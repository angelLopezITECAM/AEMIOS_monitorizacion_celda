import React, { useEffect, useRef, useState } from 'react';
import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';


import "@babylonjs/loaders/glTF";
import '@babylonjs/inspector';

import { loadCeldaModel } from '@/services/model/loadCeldaModel';

import { BombaCatodo } from '@/components/bomba-catodo';
import { BombaAnodo } from '@/components/bomba-anodo';
import { Termopar } from '@/components/termopar';
import { PotenciaGlobal } from '@/components/potencia-global';
import { Controladora } from '@/components/controladora';

import { createIndicator } from '@/gui/indicator';

import { setupCamera, focusCameraOnMesh } from '@/services/babylon/camera';
import { setupScene } from '@/services/babylon/scene';
import '@/assets/panel.css'


/* import { setupCamera } from '@/services/babylon/camera-universal'; */
const partesCelda = [
    {
        nameMesh: "Separador teflon GDL-1",
        indicator: {
            card: {
                data: {
                    "Parte": "Separador teflon GDL-1",
                    "Temperatura": `${Math.floor(Math.random() * 50)} ºC`
                },
                status: "warning"
            }
        },
    },
    {
        nameMesh: "Separador teflon GDL-2",
        indicator: {
            card: {
                data: {
                    "Parte": "Separador teflon GDL-2",
                    "Temperatura": `${Math.floor(Math.random() * 50)} ºC`
                },
            },
            status: "warning"
        },
    },
    {
        nameMesh: "Separador teflon GDL-2",
        indicator: {
            card: {
                data: {
                    "Parte": "Separador teflon GDL-2",
                    "Temperatura": `${Math.floor(Math.random() * 50)} ºC`
                },
            },
            status: "success"
        },
    },
    {
        nameMesh: "Separador teflon-aislante-1",
        indicator: {
            card: {
                data: {
                    "Parte": "Separador teflon aislante 1",
                    "Temperatura": `${Math.floor(Math.random() * 50)} ºC`
                },
            },
            status: "warning"
        },
    },
    {
        nameMesh: "Separador teflon-aislante-2",
        indicator: {
            card: {
                data: {
                    "Parte": "Separador teflon aislante 2",
                    "Temperatura": `${Math.floor(Math.random() * 50)} ºC`
                },
            },
            status: "warning"
        },
    },
    {
        nameMesh: "Placa bipolar-1",
        indicator: {
            card: {
                data: {
                    "Parte": "Placa bipolar 1",
                    "Temperatura": `${Math.floor(Math.random() * 50)} ºC`
                },
            },
            status: "warning"
        },
    },
    {
        nameMesh: "Placa bipolar-2",
        indicator: {
            card: {
                data: {
                    "Parte": "Placa bipolar 2",
                    "Temperatura": `${Math.floor(Math.random() * 50)} ºC`
                }
            },
            status: "success"
        },
    },
    {
        nameMesh: "Placa final 1-1",
        indicator: {
            card: {
                data: {
                    "Parte": "Placa final 1-1",
                    "Temperatura": `${Math.floor(Math.random() * 50)} ºC`
                }
            },
            status: "success"
        },
    },
    {
        nameMesh: "Placa final 1-2",
        indicator: {
            card: {
                data: {
                    "Parte": "Placa final 1-2",
                    "Temperatura": `${Math.floor(Math.random() * 50)} ºC`
                },
            },
            status: "danger"
        },
    },
]

const BabylonScene = () => {
    const canvasRef = useRef(null);
    const [uiConfig, setUiConfig] = useState(null);

    useEffect(() => {
        fetch('./guiTexture.json')
            .then(res => res.json())
            .then(data => setUiConfig(data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const engine = new BABYLON.Engine(canvas, true);
            const scene = setupScene({ engine });
            const camera = setupCamera({ scene, canvas });

            const light = new BABYLON.HemisphericLight(
                "light1",
                new BABYLON.Vector3(1, 0, 0),
                scene
            );

            light.intensity = 0.7;


            let celdaAEM

            loadCeldaModel(scene, "./models/celda_aem_explosionada/celda_aem_explosionada.gltf")
                .then((loadedCelda) => {
                    celdaAEM = loadedCelda;
                    /* focusCameraOnMesh({ camera, mesh: celdaAEM }); */
                    if (celdaAEM) {

                        const manualCenter = new BABYLON.Vector3(6, -1, 0.5);
                        camera.target = manualCenter

                        partesCelda.forEach((pCelda) => {
                            const meshParteCelda = scene.getMeshByName(pCelda.nameMesh)

                            createIndicator(scene, canvas, meshParteCelda, pCelda)
                        })

                        const btnHideInfoElement = document.getElementById('btnHideInfo')



                        btnHideInfoElement && btnHideInfoElement.addEventListener('click', (e) => {
                            e.preventDefault()
                            scene.getMeshByName('cardPlane') && scene.getMeshByName('cardPlane').dispose()
                        })

                        BombaCatodo({ scene, celdaAEM, canvas });
                        BombaAnodo({ scene, celdaAEM, canvas });
                        Termopar({ scene, celdaAEM });
                        PotenciaGlobal({ scene, celdaAEM });
                        Controladora({ scene, canvas });

                    }
                })
                .catch((err) => {
                    console.error(err);
                });


            /* scene.debugLayer.show(); */

            // Renderizar la escena
            engine.runRenderLoop(() => {
                scene.render();
            });

            // Manejar el redimensionamiento de la ventana
            window.addEventListener('resize', () => {
                engine.resize();
            });

            // Limpiar la escena al desmontar el componente
            return () => {
                scene.dispose();
                engine.dispose();
            };
        }
    }, [uiConfig]);

    return <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
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
                    <div className='m-panel__data'>
                        <div className='flex-between'>
                            <p className='m-panel__data'><strong>Consumo:</strong> <span>0.3</span> kWh</p>
                            <p className='m-panel__data'><strong>Potencia:</strong> <span>5</span> W</p>
                        </div>
                        <div className='flex-between'>
                            <div>
                                <p className='m-panel__data'><strong>Voltaje:</strong> <span>20</span> V</p>
                                <p className='m-panel__data' id='caudalCatodo'><strong>Caudal:</strong> <span>5</span> l/h</p>
                            </div>

                            <div className='flex-between'>
                                <input type='range' className='m-panel__input m-panel__input-range' min={1} max={100} id='sliderCatodo' />
                                <input type='number' className='m-panel__input m-panel__input-number' id='inputCatodo' />
                            </div>
                        </div>



                    </div>
                </section>
                <section className='m-panel__section'>
                    <div className='flex-between'>
                        <h4 className='m-panel__section--title'>Bomba ánodo</h4>
                        <label className="switch">
                            <input type="checkbox" id='switchAnodo' />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className='m-panel__data'>
                        <div className='flex-between'>
                            <p className='m-panel__data'><strong>Consumo:</strong> <span>1.0</span> kWh</p>
                            <p className='m-panel__data'><strong>Potencia:</strong> <span>5</span> W</p>
                        </div>
                        <div className='flex-between'>
                            <div>
                                <p className='m-panel__data'><strong>Voltaje:</strong> <span>25</span> V</p>
                                <p className='m-panel__data' id='caudalAnodo'><strong>Caudal:</strong> <span>10</span> l/h</p>
                            </div>

                            <div className='flex-between'>
                                <input type='range' className='m-panel__input m-panel__input-range' min={1} max={100} id='sliderAnodo' />
                                <input type='number' className='m-panel__input m-panel__input-number' id='inputAnodo' />
                            </div>
                        </div>



                    </div>
                </section>
                <section className='m-panel__section'>
                    <div className='flex-between'>
                        <h4 className='m-panel__section--title'>Termopar</h4>
                    </div>
                    <div className='m-panel__data'>
                        <div className='flex-between'>
                            <p className='m-panel__data'><strong>Consumo:</strong> <span>1.2</span> kWh</p>
                            <p className='m-panel__data'><strong>Potencia:</strong> <span>5</span> W</p>
                        </div>
                        <div className='flex-between'>
                            <div className='flex-'>
                                <p className='m-panel__data'><strong>Voltaje:</strong> <span>35</span> V</p>
                                <p className='m-panel__data'><strong>Caudal:</strong> <span>5</span> l/h</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='m-panel__section'>
                    <div className='flex-between'>
                        <h4 className='m-panel__section--title'>Controladora</h4>
                        <label className="switch">
                            <input type="checkbox" id='switchControladora' />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </section>
            </div>
            <button className='m-panel__btn' id='btnHideInfo'>Ocultar info</button>
        </div>
    </div>;
};

export default BabylonScene;

