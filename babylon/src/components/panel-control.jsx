import { useState } from 'react'
import { useMQTT } from '@/context/mqtt-context';
import { useEffect } from 'react';
import { SwitchApp } from './control/switch';
import { SliderVertical } from './control/slider-vertical';
import { DataBombas } from './control/data-bombas';
import { DataTermopar } from './control/data-termopar';
export function PanelControl({ canvasRef }) {

    const [isLoading, setIsLoading] = useState(true)
    const [initialMessageSent, setInitialMessageSent] = useState(false);
    const [error, setError] = useState(null);

    const { isConnected, sendMessage } = useMQTT()

    useEffect(() => {
        setIsLoading(!isConnected)
    }, [isConnected])

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

    if (isLoading) return "Cargando..."

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflowY: 'hidden' }}>
            <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh' }} />
            <div className='m-panel'>
                <h3 className='m-panel--title'>Celda AEM</h3>
                <div className='m-panel__content'>
                    <section className='m-panel__section'>
                        {
                            itemsSwitch.map((item) => (
                                <SwitchApp item={item} key={item.id} />
                            ))
                        }

                    </section>
                    <h3>Flujo</h3>
                    <section className='m-panel__section grid grid-cols-2 gap-4'>

                        {
                            itemsSlider.map((item) => (
                                <SliderVertical item={item} key={item.id} />
                            ))
                        }
                    </section>

                    <DataBombas />
                    <DataTermopar />


                    <section className='m-panel__section'>
                        <div className='flex-between'>
                            <h4 className='m-panel__section--title'>Vista detalle</h4>
                            <label className="switch">
                                <input type="checkbox" id='switchDetalle' />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </section>
                </div>

                {/* <button className='m-panel__btn' id='btnHideInfo'>Ocultar info</button> */}
            </div>
        </div>
    )
}

const itemsSlider = [
    {
        id: "speed_cat_pump",
        title: "Cátodo",
        defaultValue: 14,
        min: 0,
        max: 100,
        step: 1,
        magnitude: "status_speed_cat_pump",
        idElement: "sliderCatodo",
    },
    {
        id: "speed_an_pump",
        title: "Ánodo",
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
        idElement: "switchCatodo",
    },
    {
        id: "anode_pump",
        title: "Bomba ánodo",
        defaultValue: false,
        magnitude: "status_anode_pump",
        idElement: "switchAnodo",
    },
    {
        id: "relay",
        title: "Controladora",
        defaultValue: false,
        magnitude: "status_relay",
        idElement: "switchControladora",
    },
];

const itemsBombas = [
    {
        title: "Intensidad",
        magnitude: "amperage_pumps",
    },
    {
        title: "Potencia",
        magnitude: "",
    },
    {
        title: "Voltaje",
        magnitude: "",
    },
]

const itemsTermopar = [
    {
        title: "Intensidad",
        magnitude: "amperage_tc",
    },
    {
        title: "Potencia",
        magnitude: "",
    },
    {
        title: "Voltaje",
        magnitude: "",
    },
    {
        title: "Temperatura",
        magnitude: "temperature_tc",
    },
]


