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
import { PanelControl } from './components/panel-control';
import { MQTTProvider } from "@/context/mqtt-context";

const partesCelda = [
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
        position: 'left',
        variation: 0.011,
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
        position: 'left',
        variation: 0.008,
    },

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
        position: 'left',
        variation: 0.005,
        childMesh: "20x20-0.5 mm-1"
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
        position: 'center',
        variation: 0,
        childMesh: "Membrana-2"
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
        position: 'right',
        variation: -0.003,
        childMesh: "20x20-0.5 mm-2"
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
        position: 'right',
        variation: -0.006,
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
        position: 'right',
        variation: -0.009,
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
        position: 'right',
        variation: -0.012,
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


            /* loadCeldaModel(scene, "./models/explosionada.glb") */
            loadCeldaModel(scene, "./models/celda_aem_explosionada/celda_aem_explosionada.gltf")
                /* loadCeldaModel(scene, "./models/celda_aem_ensamblada/celda_aem_ensamblada.gltf") */
                .then((loadedCelda) => {
                    celdaAEM = loadedCelda;
                    /* const eje = new BABYLON.AxesViewer(scene);
                    eje.xAxis.parent = celdaAEM;
                    eje.yAxis.parent = celdaAEM;
                    eje.zAxis.parent = celdaAEM; */

                    if (celdaAEM) {
                        console.log(celdaAEM)
                        celdaAEM.position = new BABYLON.Vector3(0, 0, -1.1);

                        partesCelda.forEach((pCelda) => {
                            const meshParteCelda = scene.getMeshByName(pCelda.nameMesh)
                            pCelda.initialPosition = meshParteCelda.position
                            if (pCelda.childMesh) {
                                const childMesh = scene.getMeshByName(pCelda.childMesh)
                                pCelda.initialPositionChild = childMesh.position
                            }
                            /* createIndicator(scene, canvas, meshParteCelda, pCelda) */
                        })

                        console.log(partesCelda)
                        const btnHideInfoElement = document.getElementById('btnHideInfo')
                        const switchDetalle = document.getElementById('switchDetalle')



                        btnHideInfoElement && btnHideInfoElement.addEventListener('click', (e) => {
                            e.preventDefault()
                            scene.getMeshByName('cardPlane') && scene.getMeshByName('cardPlane').dispose()
                            scene.getMeshByName('lineCardSphere') && scene.getMeshByName('lineCardSphere').dispose()
                        })

                        switchDetalle && switchDetalle.addEventListener('change', (e) => {

                            const isChecked = e.target.checked
                            const centerCelda = partesCelda.find((pCelda) => pCelda.position === 'center')
                            const fps = 60
                            const seconds = 1.5
                            const totalFPS = fps * seconds
                            const indicadores = scene.materials.filter((material) => material.name === 'indicadorMaterial')
                            console.log(indicadores)

                            if (isChecked) {
                                partesCelda.forEach((pCelda) => {
                                    if (pCelda.position === 'center') return
                                    const meshParteCelda = scene.getMeshByName(pCelda.nameMesh)
                                    const diff = centerCelda.initialPosition.z + pCelda.variation

                                    meshParteCelda.position = new BABYLON.Vector3(
                                        meshParteCelda.position.x,
                                        meshParteCelda.position.y,
                                        diff)
                                    BABYLON.Animation.CreateAndStartAnimation(
                                        'anim', meshParteCelda, 'position', fps, totalFPS, pCelda.initialPosition, meshParteCelda.position, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT)

                                    if (pCelda.childMesh) {
                                        const childMesh = scene.getMeshByName(pCelda.childMesh)
                                        childMesh.position = new BABYLON.Vector3(
                                            childMesh.position.x,
                                            childMesh.position.y,
                                            diff)
                                        BABYLON.Animation.CreateAndStartAnimation(
                                            'anim', childMesh, 'position', fps, totalFPS, pCelda.initialPositionChild, childMesh.position, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT)
                                    }

                                    indicadores.forEach((indicador) => {
                                        BABYLON.Animation.CreateAndStartAnimation("hide", indicador, "alpha", fps, totalFPS, 1, 0, 0)
                                    })
                                })
                            } else {
                                partesCelda.forEach((pCelda) => {
                                    if (pCelda.position === 'center') return
                                    const meshParteCelda = scene.getMeshByName(pCelda.nameMesh)

                                    BABYLON.Animation.CreateAndStartAnimation(
                                        'anim', meshParteCelda, 'position', fps, totalFPS, meshParteCelda.position, pCelda.initialPosition, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT)

                                    if (pCelda.childMesh) {
                                        const childMesh = scene.getMeshByName(pCelda.childMesh)

                                        BABYLON.Animation.CreateAndStartAnimation(
                                            'anim', childMesh, 'position', fps, totalFPS, childMesh.position, pCelda.initialPositionChild, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT)
                                    }

                                    indicadores.forEach((indicador) => {
                                        BABYLON.Animation.CreateAndStartAnimation("hide", indicador, "alpha", fps, totalFPS, 0, 1, 0)
                                    })
                                })
                            }



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

    return <MQTTProvider><PanelControl canvasRef={canvasRef} /></MQTTProvider>;
};

export default BabylonScene;

