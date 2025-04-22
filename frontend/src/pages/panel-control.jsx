import React, { useState, useEffect } from "react"
import { SwitchApp } from "@/components/control/switch"
import { SliderVertical } from "@/components/control/slider-vertical"
import { Title } from '@/components/ui/itecam/typography';
import useSWR from "swr"
import useSWRSubscription from 'swr/subscription'
import { MQTTProvider, useMQTT } from "@/context/mqtt-context";

// Componente interno que se comunica con MQTT
function ControlPanel() {
    const { isConnected, sendMessage } = useMQTT();
    const [initialMessageSent, setInitialMessageSent] = useState(false);
    const [error, setError] = useState(null);

    // Efecto para enviar mensaje inicial cuando la conexión está lista
    useEffect(() => {
        const sendInitialMessage = async () => {
            if (isConnected && !initialMessageSent) {
                console.log("=== Intentando enviar mensaje inicial ===");
                try {
                    const initialMessage = {
                        element: "state",
                        action: "0",
                        ud: " "
                    };

                    console.log("Enviando mensaje inicial:", initialMessage);
                    const result = await sendMessage("devices/play", initialMessage);
                    console.log("Resultado del envío:", result);

                    if (result) {
                        console.log("Mensaje inicial enviado con éxito");
                        setInitialMessageSent(true);
                        setError(null);
                    }
                } catch (err) {
                    console.error("Error al enviar mensaje inicial:", err);
                    setError(err.message);
                    // Reintentar en 2 segundos
                    setTimeout(() => {
                        setInitialMessageSent(false);
                    }, 2000);
                }
            }
        };

        sendInitialMessage();
    }, [isConnected, sendMessage, initialMessageSent]);

    return (
        <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between my-2 ">
                <h1 className="text-2xl font-bold tracking-tight">Panel de control</h1>
                <div className="flex flex-col items-end">
                    {!isConnected && (
                        <p className="text-red-500 text-sm">Conectando al sistema...</p>
                    )}
                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}
                </div>
            </div>

            <div className="">
                {
                    itemsSwitch.map((item) => (
                        <SwitchApp
                            key={item.id}
                            item={item}
                        />
                    ))
                }

                <div className="grid grid-cols-2 gap-4">
                    {
                        itemsSlider.map((item) => (
                            <SliderVertical
                                key={item.id}
                                item={item}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

// Datos para los controles
const itemsSlider = [
    {
        id: "speed_cat_pump",
        title: "Bomba cátodo",
        defaultValue: 14,
        min: 0,
        max: 255,
        step: 1,
        magnitude: "status_speed_cat_pump",
    },
    {
        id: "speed_an_pump",
        title: "Bomba ánodo",
        defaultValue: 76,
        min: 0,
        max: 255,
        step: 1,
        magnitude: "status_speed_an_pump",
    },
];

const itemsSwitch = [
    {
        id: "cathode_pump",
        title: "Bomba cátodo",
        defaultValue: false,
        magnitude: "status_cathode_pump",
        slider: "status_speed_cat_pump",
    },
    {
        id: "anode_pump",
        title: "Bomba ánodo",
        defaultValue: false,
        magnitude: "status_anode_pump",
        slider: "status_speed_an_pump",
    },
    {
        id: "relay",
        title: "Controladora",
        defaultValue: false,
        magnitude: "status_relay",
        slider: null,
    },
];

// Componente principal que incluye el Provider
export function PagePanelControl() {
    return (
        <MQTTProvider>
            <ControlPanel />
        </MQTTProvider>
    );
}