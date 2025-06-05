import { Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { useMQTT } from "@/context/mqtt-context";
import { useEffect, useState } from "react"

export function AlertDialog() {
    const topicGetAlarms = `devices/alarms`;
    const { isConnected, messages, publish, subscribe, unsubscribe } = useMQTT();
    const [isLoading, setIsLoading] = useState(true);

    const [open, setOpen] = useState(false);

    const sendEmailAlert = async (alertData) => {
        try {
            const emailMsg = `Nueva alerta: ${alertData.message.message} - ${alertData.message.value} ${alertData.message.ud || ''}`;


            const response = await fetch('http://192.168.1.151:8002/send-mail-alarm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ msg: emailMsg }),
            });

            if (response.ok) {
                console.log('Correo de alerta enviado con éxito');
            } else {
                console.error('Error al enviar correo de alerta:', await response.text());
            }
        } catch (error) {
            console.error('Error al enviar correo de alerta:', error);
        }
    };

    useEffect(() => {
        if (isConnected) {
            subscribe(topicGetAlarms);

            return () => {
                unsubscribe(topicGetAlarms);
            }
        } else {
            setIsLoading(false);
            console.log("No se está conectado al broker");
        }
    }, [isConnected, topicGetAlarms]);

    const lastMessage = messages.slice(-1)[0];


    useEffect(() => {
        if (lastMessage) {
            setOpen(true)
        }

        sendEmailAlert(lastMessage);

    }, [lastMessage]);


    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>¡Nueva alerta!</DialogTitle>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        Hay una nueva alerta en el sistema, por favor, revisa el panel de control.
                    </div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Cerrar
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
