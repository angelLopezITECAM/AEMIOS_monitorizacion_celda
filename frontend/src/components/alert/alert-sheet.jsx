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
import { useMQTT } from "@/context/mqtt-context";
import { useEffect, useState } from "react";
import { formatDateWithFormat } from "@/lib/itecam/date"
import useSWR from 'swr';
import { fetcher } from '@/lib/itecam/fetcher';

// Definimos el período de "enfriamiento" en milisegundos (1 hora)
const ALERT_COOLDOWN_MS = 60 * 60 * 1000;

export function AlertSheet({ open, onOpenChange }) {

    const topicGetAlarms = `devices/alarms`;
    const { isConnected, messages, publish, subscribe, unsubscribe } = useMQTT();
    const [isLoading, setIsLoading] = useState(true);
    const [lastAlertTimestamps, setLastAlertTimestamps] = useState({});

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



    const [alertas, setAlertas] = useState([]);
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
    const startDate = sevenDaysAgo.toISOString().split('T')[0] + "T00:00:00Z";
    const endDate = today.toISOString().split('T')[0] + "T23:59:59Z";

    const timeFilter = `start=${startDate}&end=${endDate}`;

    const { data: historicalData } = useSWR(
        `http://192.168.15.151:8002/api/influx/alarms?${timeFilter}`,
        fetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 0
        }
    );

    const lastMessage = messages.slice(-1)[0];

    useEffect(() => {
        if (!lastMessage || lastMessage.topic !== topicGetAlarms) {
            return;
        }

        const { message } = lastMessage;
        const alertKey = message.magnitude;

        const lastShownTime = lastAlertTimestamps[alertKey];
        const currentTime = Date.now();

        const shouldAddAlert = !lastShownTime || (currentTime - lastShownTime > ALERT_COOLDOWN_MS);

        if (shouldAddAlert) {
            setAlertas((prev) => [lastMessage, ...prev]);
            setLastAlertTimestamps(prev => ({
                ...prev,
                [alertKey]: currentTime
            }));
        }

    }, [lastMessage, lastAlertTimestamps]);

    useEffect(() => {
        if (!historicalData?.results) return;
        const newData = [];

        Object.keys(historicalData.results).forEach(key => {
            const result = historicalData.results[key];
            const newAlert = {
                topic: "devices/alarms",
                message: result,
                timestamp: result.time
            }

            newData.push(newAlert);
        });

        setAlertas((prev) => [...newData, ...prev]);
    }, [historicalData])



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
            case "neutral":
                return "bg-gray-500/15 text-gray-500"
        }
    }

    const getMagnitude = (magnitude) => {
        switch (magnitude) {
            case 'alarm_temperature_tc':
                return "Temperatura"
            case 'alarm_amperage_tc':
            case 'alarm_amperage_pumps':
                return "Intensidad"
            case 'alarm_flow_anode':
                return "Caudal Ánodo"
            case 'alarm_flow_cathode':
                return "Caudal Cátodo"
        }
    }


    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-2xl w-full flex flex-col">
                <SheetHeader>
                    <SheetTitle>Listado de alertas</SheetTitle>
                    <SheetDescription>Alertas recibidas en los últimos 7 días</SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-auto">
                    <div className="p-4 space-y-4">
                        {alertas?.map((alert) => (
                            <div
                                key={alert.timestamp}
                                className="flex items-center gap-4 p-4 rounded-3xl border cursor-pointer hover:bg-muted/50 transition-colors"
                            >
                                {getAlertIcon("warning")}
                                <div className="flex-1">
                                    <h4 className="font-medium">{alert.message.message} - {alert.message.value} {alert.message.ud}</h4>
                                    <p className="text-sm text-muted-foreground">Se ha procedido a parar el experimento</p>
                                    <Badge className={`${getAlertColor("neutral")} rounded-3xl`}>{formatDateWithFormat(alert.timestamp, 'dd.mm.yyyy HH:ii')}</Badge>
                                </div>
                                <Badge className={`${getAlertColor("warning")} rounded-3xl`}>{getMagnitude(alert.message.magnitude || alert.message.measurement)}</Badge>
                            </div>
                        ))}
                    </div>
                </div>
            </SheetContent>

        </Sheet>
    )
}