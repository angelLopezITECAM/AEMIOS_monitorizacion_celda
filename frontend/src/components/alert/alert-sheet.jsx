import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import { Badge } from "@/components/ui/badge"

import { Bell, AlertCircle, AlertTriangle, Info } from 'lucide-react'

export function AlertSheet({ open, onOpenChange, alerts, onResolve, onUpdate }) {


    const filteredAlerts = alerts

    const getAlertIcon = (severity) => {
        switch (severity) {
            case 'info':
                return <Info className="h-5 w-5 text-blue-500" />
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-amber-500" />
            case 'critical':
                return <AlertCircle className="h-5 w-5 text-destructive" />
            case 'resolved':
                return <AlertCircle className="h-5 w-5 text-green-500" />
        }
    }

    const getAlertColor = (severity) => {
        switch (severity) {
            case "critical":
                return "bg-destructive/15 text-destructive"
            case "warning":
                return "bg-amber-500/15 text-amber-500"
            case "info":
                return "bg-blue-500/15 text-blue-500"
            case "resolved":
                return "bg-green-500/15 text-green-500"
        }
    }


    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-2xl w-full flex flex-col">
                <SheetHeader>
                    <SheetTitle>Listado de alertas</SheetTitle>
                    <SheetDescription>Ver y manejar todas las alertas</SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-auto">
                    <div className="p-4 space-y-4">
                        {filteredAlerts
                            .map((alert) => (
                                <div
                                    key={alert.id}
                                    className="flex items-center gap-4 p-4 rounded-3xl border cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => setSelectedAlert(alert)}
                                >
                                    {getAlertIcon(alert.severity)}
                                    <div className="flex-1">
                                        <h4 className="font-medium">{alert.title}</h4>
                                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                                    </div>
                                    <Badge className={`${getAlertColor(alert.severity)} rounded-3xl`}>{alert.severity}</Badge>
                                </div>
                            ))}
                    </div>
                </div>
            </SheetContent>

        </Sheet>
    )
}