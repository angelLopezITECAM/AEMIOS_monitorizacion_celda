import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2, AlertCircle } from 'lucide-react'
import { useState, useEffect, useCallback, useRef } from "react"
import { useMQTT } from "@/context/mqtt-context"
import { useDebounce } from "@/hooks/use-debounce"

export function SliderVertical({ item }) {
    const { title, defaultValue, min, max, step, id, magnitude, idElement } = item;
    const topicGetStatus = `devices/status`;
    const topicSetStatus = `devices/play`;
    console.log(magnitude)

    const { isConnected, messages, publish, subscribe, unsubscribe } = useMQTT();

    const [isLoading, setIsLoading] = useState(true);
    const [value, setValue] = useState(defaultValue);
    const [infoMsg, setInfoMsg] = useState("Esperando estado inicial del sistema...");
    const [errorMsg, setErrorMsg] = useState("");

    const valueBeforeToggle = useRef(defaultValue);
    const confirmationTimeoutRef = useRef(null);

    const debouncedPublish = useDebounce((newValue) => {
        if (isLoading) return;
        if (confirmationTimeoutRef.current) {
            clearTimeout(confirmationTimeoutRef.current);
            confirmationTimeoutRef.current = null;
        }
        valueBeforeToggle.current = newValue;
        setIsLoading(true);
        setInfoMsg("Esperando confirmación del sistema...");
        setErrorMsg("");
        const msgSetStatus = { "element": id, "action": newValue.toString(), "ud": "pwm " }

        publish(topicSetStatus, JSON.stringify(msgSetStatus))
            .catch(() => {
                setErrorMsg("No se pudo cambiar el valor. Inténtalo de nuevo.");
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
    }, 1500);

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
            const confirmedValue = (typeof newValue === 'string') ? newValue : null;
            console.log(confirmedValue)

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

    const handleChange = (newValue) => {
        if (!isNaN(newValue) && newValue >= min && newValue <= max) {
            setValue(newValue);
            debouncedPublish(newValue);
        }
    }

    const handleInputChange = (e) => {
        const newValue = Number(e.target.value);
        handleChange(newValue);
    }
    const handleSliderChange = (value) => {
        const newValue = Number(value[0]);
        handleChange(newValue);
    }

    useEffect(() => {
        return () => {
            if (confirmationTimeoutRef.current) {
                clearTimeout(confirmationTimeoutRef.current);
            }
        };
    }, []);

    return (
        <>
            <div className="my-4 relative">

                <div className="flex items-center justify-between mb-4">
                    <Label
                        htmlFor={`${title}-slider`}
                    >
                        {title}
                        {(infoMsg || errorMsg) && (
                            <div className={`mt-2 text-xs ${errorMsg ? 'text-red-500' : 'text-blue-500'}`}>
                                {errorMsg || infoMsg}
                            </div>
                        )}


                    </Label>

                    <div className="relative">
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10 rounded">
                                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                            </div>
                        )}
                        <Input
                            id={`${title}-input`}
                            type="number"
                            value={value}
                            onChange={handleInputChange}
                            className={`w-20 text-right ${isLoading ? 'opacity-70' : ''}`}
                            min={min}
                            max={max}
                            step={step}
                            disabled={isLoading}
                        />
                    </div>

                </div>


                <div className="flex flex-col items-center">
                    <span className="text-sm text-muted-foreground mb-2">{max}</span>
                    <div className="relative h-40">
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <div className="bg-background/50 p-2 rounded-full">
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                </div>
                            </div>
                        )}
                        <Slider
                            id={`${title}-slider`}
                            min={min}
                            max={max}
                            step={step}
                            value={[value]}
                            onValueChange={handleSliderChange}
                            orientation="vertical"
                            className={`h-40 ${isLoading ? 'opacity-70' : ''}`}
                            disabled={isLoading}
                        />
                    </div>
                    <span className="text-sm text-muted-foreground mt-2">{min}</span>
                </div>


            </div>

        </>
    );
}