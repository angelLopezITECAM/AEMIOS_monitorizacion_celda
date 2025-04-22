import { useState } from 'react'
import { useMQTT } from '@/context/mqtt-context';
import { useEffect } from 'react';
export function PanelControl({ canvasRef }) {

    const [isLoading, setIsLoading] = useState(true)
    const [initialMessageSent, setInitialMessageSent] = useState(false);

    const { isConnected, messages, sendMessage } = useMQTT()

    useEffect(() => {
        setIsLoading(!isConnected)
    }, [isConnected])

    useEffect(() => {
        if (isConnected && !initialMessageSent) {

            const initialMessage = {
                element: "state",
                action: "0",
                ud: " "
            };

            sendMessage("devices/play", initialMessage);
            setInitialMessageSent(true);
        }
    }, [isConnected, sendMessage, initialMessageSent]);

    if (isLoading) return "Cargando..."

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflowY: 'hidden' }}>
            <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh' }} />
            <div className='m-panel'>
                <h3 className='m-panel--title'>Celda AEM</h3>
                <div className='m-panel__content'>
                    <section className='m-panel__section'>

                        <div className='flex-between'>
                            <h4 className='m-panel__section--title'>Bomba cátodo</h4>
                            <label className="switch">
                                <input type="checkbox" id='switchCatodo' />
                                <span className="slider round"></span>
                            </label>
                        </div>

                        <div className='flex-between'>
                            <h4 className='m-panel__section--title'>Bomba ánodo</h4>
                            <label className="switch">
                                <input type="checkbox" id='switchAnodo' />
                                <span className="slider round"></span>
                            </label>
                        </div>

                        <div className='flex-between'>
                            <h4 className='m-panel__section--title'>Controladora</h4>
                            <label className="switch">
                                <input type="checkbox" id='switchControladora' />
                                <span className="slider round"></span>
                            </label>
                        </div>

                        <div className='m-panel__data'>
                            <div className='flex-between'>
                                <p className='m-panel__data' id='caudalCatodo'><strong>Caudal cátodo (pwm):</strong> </p>
                                <input type='range' className='m-panel__input m-panel__input-range' min={1} max={100} id='sliderCatodo' />
                                <input type='number' className='m-panel__input m-panel__input-number' id='inputCatodo' />
                            </div>
                        </div>

                        <div className='m-panel__data'>

                            <div className='flex-between'>
                                <p className='m-panel__data' id='caudalAnodo'><strong>Caudal ánodo (pwm):</strong></p>
                                <input type='range' className='m-panel__input m-panel__input-range' min={1} max={100} id='sliderAnodo' />
                                <input type='number' className='m-panel__input m-panel__input-number' id='inputAnodo' />
                            </div>

                        </div>

                    </section>

                    <section className='m-panel__section'>
                        <div className='flex-between'>
                            <h4 className='m-panel__section--title'>Bombas</h4>
                        </div>
                        <div className='m-panel__data'>
                            <div className='flex'>
                                <p className='m-panel__data'><strong>Intensidad:</strong> <span>1.2</span> A</p>
                                <p className='m-panel__data'><strong>Potencia:</strong> <span>5</span> W</p>
                                <p className='m-panel__data'><strong>Voltaje:</strong> <span>35</span> V</p>

                            </div>
                        </div>
                    </section>

                    <section className='m-panel__section'>
                        <div className='flex-between'>
                            <h4 className='m-panel__section--title'>Termopar</h4>
                        </div>
                        <div className='m-panel__data'>
                            <div className='flex'>
                                <p className='m-panel__data'><strong>Intensidad:</strong> <span>1.2</span> A</p>
                                <p className='m-panel__data'><strong>Potencia:</strong> <span>5</span> W</p>
                                <p className='m-panel__data'><strong>Voltaje:</strong> <span>35</span> V</p>
                                <p className='m-panel__data'><strong>Temperatura:</strong> <span>15</span> ºC</p>

                            </div>
                        </div>
                    </section>

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

                <button className='m-panel__btn' id='btnHideInfo'>Ocultar info</button>
            </div>
        </div>
    )
}

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
    },
    {
        id: "anode_pump",
        title: "Bomba ánodo",
        defaultValue: false,
        magnitude: "status_anode_pump",
    },
    {
        id: "relay",
        title: "Controladora",
        defaultValue: false,
        magnitude: "status_relay",
    },
];