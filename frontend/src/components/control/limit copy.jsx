import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2, AlertCircle } from 'lucide-react'
import { useState, useEffect, useCallback, useRef } from "react"
import { useMQTT } from "@/context/mqtt-context"
import { useDebounce } from "@/hooks/use-debounce"

export function LimitApp({ item }) {
    const { messages, isConnected, sendMessage, error: mqttError } = useMQTT();
    const { title, defaultValue, min, max, step, id, magnitude, idElement } = item;

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
    const CONFIRMATION_TIMEOUT = 10000;

    // Referencia para rastrear mensajes ya procesados
    const processedMessagesRef = useRef(new Set());

    const timeDebounce = 1000;

    // Función para obtener el valor numérico desde diferentes formatos
    const getValue = (rawValue) => {
        if (typeof rawValue === 'number') return rawValue;
        if (typeof rawValue === 'string') {
            const numValue = parseFloat(rawValue);
            return isNaN(numValue) ? defaultValue : numValue;
        }
        return defaultValue;
    };

    // Procesar mensajes entrantes
    useEffect(() => {
        console.log(messages)
        if (!messages || messages.length === 0) return;

        // Filtrar solo mensajes relevantes para este slider y no procesados
        const relevantMessages = messages.filter(msg =>
            (msg?.payload?.magnitude === magnitude || msg?.payload?.magnitude === id) && // Comprobar si el mensaje es para este elemento
            !processedMessagesRef.current.has(msg.timestamp)
        );

        if (relevantMessages.length === 0) return;

        // Procesar los mensajes
        relevantMessages.forEach(msg => {
            // Marcar como procesado para evitar duplicados
            processedMessagesRef.current.add(msg.timestamp);

            if (msg.payload && msg.payload.value !== undefined) {
                const newValue = getValue(msg.payload.value);

                // Asegurar que el valor está dentro de los límites
                const boundedValue = Math.max(min, Math.min(max, newValue));

                console.log(`Actualizando slider ${id} con valor:`, boundedValue);

                // Comprobar si este mensaje es una confirmación de una acción pendiente

                if (pendingValueRef.current !== null) {
                    // Si el valor recibido es igual al pendiente, confirmamos la acción
                    if (Math.abs(boundedValue - pendingValueRef.current) < 0.001) {
                        console.log(`Confirmación recibida para slider ${id}`);
                        // Limpiar el timeout de confirmación
                        if (confirmationTimeoutRef.current) {
                            clearTimeout(confirmationTimeoutRef.current);
                            confirmationTimeoutRef.current = null;
                        }
                        pendingValueRef.current = null;
                        setIsLoading(false);
                        setLastSentValue(boundedValue);
                    } else {
                        // Si el valor es diferente, actualizamos al valor recibido del servidor
                        console.log(`Valor recibido distinto al solicitado para slider ${id}`);
                        setValue(boundedValue);
                        setLastSentValue(boundedValue);
                        pendingValueRef.current = null;
                        setIsLoading(false);
                    }
                } else {
                    // Mensaje normal de actualización
                    setValue(boundedValue);
                    setLastSentValue(boundedValue);
                }

                // Marcar que ya recibimos el valor inicial y desbloquear el control
                if (!initialValueReceived) {
                    setInitialValueReceived(true);
                    setIsLoading(false);
                    console.log(`Slider ${id} inicializado con valor ${boundedValue}`);
                }
            } else if (msg.payload && msg.payload.status !== undefined) {
                // Procesar mensaje de estado (si existe)
                if (msg.payload.status === 'error' && pendingValueRef.current !== null) {
                    // Error en la acción, revertir al valor anterior
                    console.error(`Error en acción para slider ${id}`);
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
    }, [messages, id, magnitude, min, max, defaultValue, initialValueReceived, lastSentValue]);

    const debouncedSend = useCallback(
        useDebounce(async (valueToSend) => {
            // Solo enviar si es diferente y ya hemos recibido el valor inicial
            if (valueToSend !== lastSentValue && isConnected && initialValueReceived) {
                setIsLoading(true);
                setError(null);

                try {
                    const msg = {
                        element: id,
                        action: valueToSend.toString(),
                        ud: "pwm"
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
                        console.log(`Timeout de confirmación para slider ${id}`);
                        if (pendingValueRef.current !== null) {
                            // Si aún hay un valor pendiente, revertir
                            setValue(lastSentValue);
                            pendingValueRef.current = null;
                            setError("No se recibió confirmación");
                            setIsLoading(false);
                        }
                    }, CONFIRMATION_TIMEOUT);

                    const success = await sendMessage(topic, msg);

                    if (!success) {
                        throw new Error("No se pudo enviar el mensaje");
                    }

                    // No actualizamos lastSentValue aquí, esperamos confirmación

                } catch (err) {
                    console.error("Error al enviar mensaje:", err);
                    setError(err.message || "Error de comunicación");
                    setValue(lastSentValue);
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
        [id, sendMessage, lastSentValue, isConnected, initialValueReceived]
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

    const handleSliderChange = (newValue) => {
        // Solo permitir cambios si no está cargando y ya recibimos el valor inicial
        if (!isLoading && initialValueReceived) {
            setValue(newValue[0]);
        }
    };

    const handleInputChange = (e) => {
        // Solo permitir cambios si no está cargando y ya recibimos el valor inicial
        if (!isLoading && initialValueReceived) {
            const newValue = Number(e.target.value);
            if (!isNaN(newValue) && newValue >= min && newValue <= max) {
                setValue(newValue);
            }
        }
    };

    return (
        <>
            <div className="my-4 relative">

                <div className="flex items-center justify-between mb-4">
                    <Label
                        htmlFor={`${title}-slider`}
                        className={error ? "text-red-500" : ""}
                    >
                        {title}

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
                            className={`w-20 text-right ${isLoading || !initialValueReceived ? 'opacity-70' : ''} ${error ? 'border-red-500' : ''}`}
                            min={min}
                            max={max}
                            step={step}
                            disabled={isLoading || !initialValueReceived}
                        />
                    </div>
                </div>

            </div>

            {
                error && (
                    <Badge variant="destructive" className="mr-2 my-2">
                        {error}
                    </Badge>
                )
            }
        </>
    );
}