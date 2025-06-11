import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { useMQTT } from "@/context/mqtt-context";
import { useEffect, useState } from "react"

// Definimos el período de "enfriamiento" en milisegundos (1 hora)
const ALERT_COOLDOWN_MS = 60 * 60 * 1000;

export function AlertDialog() {
    const topicGetAlarms = "devices/alarms";

    const { isConnected, messages, subscribe, unsubscribe } = useMQTT();
    const [open, setOpen] = useState(false);

    // Nuevo estado para guardar la marca de tiempo de la última alerta mostrada por tipo
    const [lastAlertTimestamps, setLastAlertTimestamps] = useState({});

    const [currentAlert, setCurrentAlert] = useState(null);

    // Efecto para la suscripción a los tópicos de MQTT
    useEffect(() => {
        if (isConnected) {
            // Ya no necesitamos suscribirnos a 'status' o 'data', solo a las alarmas
            subscribe(topicGetAlarms);
            return () => {
                unsubscribe(topicGetAlarms);
            }
        }
    }, [isConnected, subscribe, unsubscribe]);

    // Obtiene el último mensaje de la cola
    const lastMessage = messages.slice(-1)[0];

    // Efecto principal que gestiona la lógica de las alertas
    useEffect(() => {
        if (!lastMessage || lastMessage.topic !== topicGetAlarms) {
            return; // Ignoramos cualquier mensaje que no sea una alarma
        }

        const { message } = lastMessage;
        const alertKey = message.magnitude; // p.ej., "alarm_flow_cathode"

        // Obtenemos la última vez que esta alerta específica se mostró
        const lastShownTime = lastAlertTimestamps[alertKey];
        const currentTime = Date.now();

        // Condición para mostrar la alerta:
        // 1. Si nunca se ha mostrado antes (lastShownTime es undefined)
        // 2. O si ha pasado más de una hora desde la última vez.
        const shouldShowAlert = !lastShownTime || (currentTime - lastShownTime > ALERT_COOLDOWN_MS);

        if (shouldShowAlert) {
            console.log(`MOSTRANDO ALERTA: ${alertKey}. No se mostrará de nuevo por 1 hora.`);

            // Mostramos el diálogo
            setCurrentAlert(lastMessage);
            setOpen(true);

            // Actualizamos el estado con la nueva marca de tiempo para esta alerta
            setLastAlertTimestamps(prev => ({
                ...prev,
                [alertKey]: currentTime
            }));

        } else {
            const timeLeft = Math.round((ALERT_COOLDOWN_MS - (currentTime - lastShownTime)) / 60000);
            console.log(`IGNORANDO ALERTA REPETIDA: ${alertKey}. Reintentar en ${timeLeft} minutos.`);
        }

    }, [lastMessage, lastAlertTimestamps]);


    const handleClose = () => {
        setOpen(false);
        setCurrentAlert(null);
    };

    const getAlertDescription = (alert) => {
        if (!alert) return "Hay una nueva alerta en el sistema.";

        const { message, value, ud } = alert.message;
        const description = `${message} (${value} ${ud || ''})`;

        return `${description}. Nota: una alerta del mismo tipo no se volverá a mostrar durante una hora.`;
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>¡Alerta Crítica!</DialogTitle>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        {getAlertDescription(currentAlert)}
                    </div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Entendido
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}