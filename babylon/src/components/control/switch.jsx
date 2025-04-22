import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState, useEffect, useCallback, useRef } from "react"
import useDebounce from "@/hooks/useDebounce"
import { useMQTT } from "@/context/mqtt-context"
import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function SwitchApp({ item }) {
    const { messages, isConnected, sendMessage, error: mqttError } = useMQTT();
    const { title, defaultValue, id, magnitude } = item;
    const [value, setValue] = useState(defaultValue);
    const [lastSentValue, setLastSentValue] = useState(defaultValue);
    const [isLoading, setIsLoading] = useState(true); // Iniciar como cargando
    const [error, setError] = useState(null);
    const [initialValueReceived, setInitialValueReceived] = useState(false);

    // Nueva ref para el timeout de confirmación
    const confirmationTimeoutRef = useRef(null);
    // Agregar una ref para el valor que está pendiente de confirmación
    const pendingValueRef = useRef(null);
    // Tiempo de espera para la confirmación en ms
    const CONFIRMATION_TIMEOUT = 5000;

    // Referencia para rastrear mensajes ya procesados
    const processedMessagesRef = useRef(new Set());

    // Función para obtener el valor booleano desde diferentes formatos
    const getValue = (rawValue) => {
        if (typeof rawValue === 'boolean') return rawValue;
        if (typeof rawValue === 'string') {
            const normalized = rawValue.toLowerCase().trim();
            return normalized === '1' || normalized === 'true' || normalized === 'on';
        }
        if (typeof rawValue === 'number') return rawValue === 1;
        return false;
    };

    // Función para verificar si hay un mensaje de slider con valor 0
    const checkSliderValue = useCallback(() => {
        if (!messages || messages.length === 0) return;

        // Buscar el último mensaje del slider correspondiente
        const sliderMessages = messages.filter(msg =>
            msg?.payload?.magnitude === `status_speed_${id}` &&
            !processedMessagesRef.current.has(msg.timestamp)
        );

        if (sliderMessages.length > 0) {
            const lastSliderMessage = sliderMessages[sliderMessages.length - 1];
            const sliderValue = parseFloat(lastSliderMessage.payload.value);

            // Si el slider está en 0, desactivar el switch
            if (sliderValue === 0 && value) {
                console.log(`Slider ${id} está en 0, desactivando switch`);
                setValue(false);
                setLastSentValue(false);
            }
        }
    }, [messages, id, value]);

    useEffect(() => {
        checkSliderValue();
    }, [checkSliderValue]);

    useEffect(() => {
        if (!messages || messages.length === 0) return;

        console.log(messages)
        // Filtrar solo mensajes relevantes para este interruptor y no procesados
        const relevantMessages = messages.filter(msg =>
            (msg?.payload?.magnitude === magnitude) && // Comprobar si el mensaje es para este elemento
            !processedMessagesRef.current.has(msg.timestamp)
        );

        if (relevantMessages.length === 0) return;

        // Procesar los mensajes
        relevantMessages.forEach(msg => {
            // Marcar como procesado para evitar duplicados
            processedMessagesRef.current.add(msg.timestamp);

            if (msg.payload && msg.payload.value !== undefined) {
                const newValue = getValue(msg.payload.value);
                console.log(`Actualizando switch ${magnitude} con valor:`, newValue);

                // Comprobar si este mensaje es una confirmación de una acción pendiente
                if (pendingValueRef.current !== null) {
                    // Si el valor recibido es igual al pendiente, confirmamos la acción
                    if (newValue === pendingValueRef.current) {
                        console.log(`Confirmación recibida para switch ${magnitude}`);
                        // Limpiar el timeout de confirmación
                        if (confirmationTimeoutRef.current) {
                            clearTimeout(confirmationTimeoutRef.current);
                            confirmationTimeoutRef.current = null;
                        }
                        pendingValueRef.current = null;
                        setIsLoading(false);
                        setLastSentValue(newValue);
                    } else {
                        // Si el valor es diferente, actualizamos al valor recibido del servidor
                        console.log(`Valor recibido distinto al solicitado para switch ${magnitude}`);
                        setValue(newValue);
                        setLastSentValue(newValue);
                        pendingValueRef.current = null;
                        setIsLoading(false);
                    }
                } else {
                    // Mensaje normal de actualización
                    setValue(newValue);
                    setLastSentValue(newValue);
                }

                // Marcar que ya recibimos el valor inicial y desbloquear el control
                if (!initialValueReceived) {
                    setInitialValueReceived(true);
                    setIsLoading(false);
                    console.log(`Switch ${magnitude} inicializado con valor ${newValue}`);
                }
            } else if (msg.payload && msg.payload.status !== undefined) {
                // Procesar mensaje de estado (si existe)
                if (msg.payload.status === 'error' && pendingValueRef.current !== null) {
                    // Error en la acción, revertir al valor anterior
                    console.error(`Error en acción para switch ${magnitude}`);
                    setValue(lastSentValue);
                    pendingValueRef.current = null;
                    setError("Error en la acción");
                    setIsLoading(false);

                    // Limpiar timeout
                    if (confirmationTimeoutRef.current) {
                        clearTimeout(confirmationTimeoutRef.current);
                        confirmationTimeoutRef.current = null;
                    }
                }
            }
        });
    }, [messages, magnitude, initialValueReceived, lastSentValue]);

    const timeDebounce = 100;

    const debouncedSend = useCallback(
        useDebounce(async (valueToSend) => {
            // Solo enviar si es diferente y ya hemos recibido el valor inicial
            if (valueToSend !== lastSentValue && initialValueReceived) {
                setIsLoading(true);
                setError(null);

                try {
                    const numericValue = valueToSend ? "1" : "0";
                    const msg = {
                        element: id,
                        action: numericValue,
                        ud: " "
                    }
                    const topic = "devices/play";
                    console.log(`Enviando valor ${valueToSend} a ${topic}`);

                    // Guardar el valor pendiente de confirmación
                    pendingValueRef.current = valueToSend;

                    // Establecer timeout para revertir si no hay confirmación
                    if (confirmationTimeoutRef.current) {
                        clearTimeout(confirmationTimeoutRef.current);
                    }

                    confirmationTimeoutRef.current = setTimeout(() => {
                        console.log(`Timeout de confirmación para switch ${magnitude}`);
                        if (pendingValueRef.current !== null) {
                            // Si aún hay un valor pendiente, revertir
                            setValue(lastSentValue);
                            pendingValueRef.current = null;
                            setError("No se recibió confirmación");
                            setIsLoading(false);
                        }
                    }, CONFIRMATION_TIMEOUT);

                    // Enviamos el mensaje y esperamos respuesta
                    const success = await sendMessage(topic, msg);
                    console.log("Resultado del envío:", success);

                    if (!success) {
                        throw new Error("No se pudo enviar el mensaje");
                    }

                    // No actualizamos lastSentValue aquí, esperamos confirmación

                } catch (err) {
                    console.error("Error al enviar mensaje:", err);
                    setError(err.message || "Error de comunicación");
                    setValue(lastSentValue); // Revertir al estado anterior
                    pendingValueRef.current = null;

                    // Limpiar timeout
                    if (confirmationTimeoutRef.current) {
                        clearTimeout(confirmationTimeoutRef.current);
                        confirmationTimeoutRef.current = null;
                    }

                    setIsLoading(false);
                }
            }
        }, timeDebounce),
        [id, sendMessage, lastSentValue, initialValueReceived]
    );

    // Limpiar timeouts cuando el componente se desmonte
    useEffect(() => {
        return () => {
            if (confirmationTimeoutRef.current) {
                clearTimeout(confirmationTimeoutRef.current);
            }
        };
    }, []);

    // Manejar errores del contexto MQTT
    useEffect(() => {
        if (mqttError) {
            setError(mqttError);
            setValue(lastSentValue);
        }
    }, [mqttError, lastSentValue]);

    // Enviar cambios cuando cambia el valor
    useEffect(() => {
        if (isConnected && !isLoading && initialValueReceived) {
            debouncedSend(value);
        }
    }, [value, debouncedSend, isConnected, isLoading, initialValueReceived]);

    const handleChange = () => {
        // Solo permitir cambios si no está cargando y ya recibimos el valor inicial
        if (!isLoading && initialValueReceived) {
            setValue(!value);
        }
    };

    return (
        <div className="flex items-center justify-between my-4">
            <div className="flex items-center gap-2">
                <Label htmlFor={`switch-${id}`} className={error ? "text-red-500" : ""}>
                    {title}
                    {error && (
                        <Badge variant="destructive" className="ml-2">
                            {error}
                        </Badge>
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
                    disabled={isLoading || !initialValueReceived}
                    className={
                        isLoading || !initialValueReceived ? "opacity-50 cursor-not-allowed" :
                            error ? "border-red-500" : ""
                    }
                />
            </div>
        </div>
    );
}