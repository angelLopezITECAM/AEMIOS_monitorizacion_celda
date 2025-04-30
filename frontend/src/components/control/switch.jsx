import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState, useEffect, useCallback, useRef } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { useMQTT } from "@/context/mqtt-context"
import { Loader2, MenuSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"


export function SwitchApp({ item }) {

    const { title, defaultValue, id, magnitude, slider } = item;
    const topicGetStatus = `devices/status`;
    const topicSetStatus = `devices/play`;

    const { isConnected, messages, publish, subscribe, unsubscribe } = useMQTT();

    const [isLoading, setIsLoading] = useState(true);
    const [value, setValue] = useState(defaultValue);
    const [infoMsg, setInfoMsg] = useState("Esperando estado inicial del sistema...");
    const [errorMsg, setErrorMsg] = useState("");

    const valueBeforeToggle = useRef(defaultValue);
    const confirmationTimeoutRef = useRef(null);

    useEffect(() => {
        if (isConnected) {
            subscribe(topicGetStatus);

            return () => {
                unsubscribe(topicGetStatus);
            }
        } else {
            setIsLoading(true);
            setInfoMsg("Conectando al sistema...");
            console.log("No se está conectado al broker");
        }
    }, [isConnected, topicGetStatus]);

    const lastMessage = messages.findLast(msg => msg.message.magnitude === magnitude);

    useEffect(() => {
        if (lastMessage) {
            const newValue = lastMessage.message.value;
            const confirmedValue = (typeof newValue === 'string') ? (newValue === "1") : Boolean(newValue);

            if (confirmationTimeoutRef.current) {
                clearTimeout(confirmationTimeoutRef.current);
                confirmationTimeoutRef.current = null;
            }

            setValue(confirmedValue);
            setIsLoading(false);
            setInfoMsg("");
            setErrorMsg("");
        }
    }, [lastMessage]);

    const handleChange = (checked) => {
        if (confirmationTimeoutRef.current) {
            clearTimeout(confirmationTimeoutRef.current);
            confirmationTimeoutRef.current = null;
        }

        valueBeforeToggle.current = value;
        setIsLoading(true);
        setValue(checked);

        setInfoMsg("Esperando confirmación del sistema...");
        setErrorMsg("");

        const msgSetStatus = { "element": id, "action": checked ? "1" : "0", "ud": " " }
        publish(topicSetStatus, JSON.stringify(msgSetStatus))
            .catch(() => {
                setErrorMsg("No se pudo cambiar el estado. Inténtalo de nuevo.");
                setInfoMsg("");
                setValue(valueBeforeToggle.current);
                setIsLoading(false);
            });

        confirmationTimeoutRef.current = setTimeout(() => {
            if (isLoading) {
                setValue(valueBeforeToggle.current);
                setIsLoading(false);
                confirmationTimeoutRef.current = null;
                setInfoMsg("");
                setErrorMsg("No se recibió confirmación del sistema.");
            }
        }, 5000);
    }

    useEffect(() => {
        return () => {
            if (confirmationTimeoutRef.current) {
                clearTimeout(confirmationTimeoutRef.current);
            }
        };
    }, []);


    return (
        <div className="flex items-center justify-between my-4">
            <div className="flex items-center gap-2">
                <Label htmlFor={`switch-${id}`}>
                    {title}
                    {(infoMsg || errorMsg) && (
                        <div className={`mt-2 text-xs ${errorMsg ? 'text-red-500' : 'text-blue-500'}`}>
                            {errorMsg || infoMsg}
                        </div>
                    )}
                </Label>
            </div>

            <div className="relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    </div>
                )}

                <Switch
                    id={`switch-${id}`}
                    checked={value}
                    onCheckedChange={handleChange}
                    disabled={isLoading}
                    className={
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }
                />
            </div>
        </div>
    );
}