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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMQTT } from "@/context/mqtt-context";
import { useEffect, useState } from "react"

export function AlertDialog() {

    const { messages } = useMQTT();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const alarmas = messages.filter((alert) => {
            return alert.topic === "devices/alarms" && alert.process === false
        })

        if (alarmas.length > 0) {
            setOpen(true)
        }
    }, [messages])
    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
