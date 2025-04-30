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
    console.log(lastMessage)

    useEffect(() => {
        if (lastMessage) {
            setOpen(true)
        }
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
