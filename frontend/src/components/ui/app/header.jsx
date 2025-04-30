import { useState } from 'react'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"


import { Bell, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { AlertSheet } from "../../alert/alert-sheet";
import { AlertDialog } from '../../alert/alert-dialog';
import { MqttProvider, useMQTT } from "@/context/mqtt-context";


const sampleAlerts = [
    {
        id: "1",
        title: "Desconexión manguera bomba ánodo",
        description: "Se procede a realizar parada de experimento.",
        severity: "critical",
        timestamp: "2 minutes ago",
        system: "Database Cluster",
        assignedTo: "Database Team",
    },
    {
        id: "2",
        title: "Desconexión manguera bomba cátodo",
        description: "Se procede a realizar parada de experimento.",
        severity: "warning",
        timestamp: "15 minutes ago",
        system: "Application Server",
    },
    {
        id: "3",
        title: "Temperatura excesiva",
        description: "Se procede a realizar parada de experimento.",
        severity: "info",
        timestamp: "1 hour ago",
        system: "All Systems",
    },
]

export function Header() {

    const [isSheetOpen, setIsSheetOpen] = useState(false)

    return (
        <MqttProvider>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger />
                <div data-orientation="vertical" role="none" className="shrink-0 bg-border w-[1px] mr-2 h-4"></div>
                <Button onClick={() => setIsSheetOpen(true)}>
                    <Bell className='h-4 w-4' />
                </Button>

                <AlertDialog />

            </header>

            <AlertSheet
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                alerts={sampleAlerts}
            />

        </MqttProvider>
    );
}
