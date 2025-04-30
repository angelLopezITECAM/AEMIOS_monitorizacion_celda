import React, { useState, useEffect } from "react"

import { SwitchApp } from "@/components/control/switch"
import { SliderVertical } from "@/components/control/slider-vertical"
import { LimitApp } from "../components/control/limit";
import { Title } from '@/components/ui/itecam/typography';

import { MqttProvider, useMQTT } from "@/context/mqtt-context";

function ControlPanel() {
    const { isConnected, publish } = useMQTT();
    const [initialMessageSent, setInitialMessageSent] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        const sendInitialMessage = async () => {
            if (isConnected && !initialMessageSent) {

                try {
                    const initialMessage = {
                        element: "state",
                        action: "0",
                        ud: " "
                    };

                    const result = await publish("devices/play", JSON.stringify(initialMessage));

                    if (result) {
                        console.log("Mensaje inicial enviado con éxito");
                        setInitialMessageSent(true);
                        setError(null);
                    }
                } catch (err) {
                    console.error("Error al enviar mensaje inicial:", err);
                    setError(err.message);

                    setTimeout(() => {
                        setInitialMessageSent(false);
                    }, 2000);
                }
            }
        };

        sendInitialMessage();
    }, [isConnected, publish, initialMessageSent]);

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
                <LimitApp
                    item={itemsLimit[0]}
                />
            </div>
        </div>
    );
}

// Datos para los controles
const itemsSlider = [
    {
        id: "speed_cat_pump",
        title: "Bomba cátodo (%)",
        defaultValue: 14,
        min: 0,
        max: 100,
        step: 1,
        magnitude: "status_speed_cat_pump",
    },
    {
        id: "speed_an_pump",
        title: "Bomba ánodo (%)",
        defaultValue: 76,
        min: 0,
        max: 100,
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

const itemsLimit = [
    {
        id: "limit_temperature_tc",
        title: "Límite temperatura (ºC)",
        defaultValue: 20,
        min: 0,
        max: 100,
        step: 1,
        magnitude: "status_limit_temperature_tc",
    },

];

// Componente principal que incluye el Provider
export function PagePanelControl() {
    return (
        <MqttProvider>
            <ControlPanel />
        </MqttProvider>
    );
}