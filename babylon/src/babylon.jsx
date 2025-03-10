import React, { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import { AdvancedDynamicTexture } from "@babylonjs/gui";
import "@babylonjs/loaders/glTF";
import '@babylonjs/inspector';

import { loadCeldaModel } from '@/services/model/loadCeldaModel';
import { createLabel } from '@/gui/label';

import { setupCamera } from '@/services/babylon/camera';

const BabylonScene = () => {
    const canvasRef = useRef(null);


    useEffect(() => {
        if (canvasRef.current) {
            // Crear el motor de Babylon.js
            const engine = new BABYLON.Engine(canvasRef.current, true);
            // Crear la escena
            const scene = new BABYLON.Scene(engine);
            // Crear una cámara
            const camera = setupCamera({ scene, canvas: canvasRef.current });
            // Crear una luz
            const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
            light.intensity = 0.7;


            let celdaAEM

            loadCeldaModel(scene, "./models/celda_aem_explosionada/celda_aem_explosionada.gltf").then((loadedCelda) => {
                celdaAEM = loadedCelda;

                if (celdaAEM) {

                    const manualCenter = new BABYLON.Vector3(6, -1, 0.5);
                    camera.target = manualCenter

                    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

                    // Crear un contenedor 3D para el texto (panel)
                    const panel = new GUI.Rectangle();
                    panel.width = "200px";
                    panel.height = "100px";
                    panel.cornerRadius = 20;
                    panel.color = "white";
                    panel.thickness = 2;
                    panel.background = "rgba(0, 0, 0, 0.7)";
                    advancedTexture.addControl(panel);

                    // Crear el texto
                    const text = new GUI.TextBlock();
                    text.text = "Celda AEMIOS";
                    text.color = "white";
                    text.fontSize = 20;
                    panel.addControl(text);

                    // Posicionar el panel cerca del modelo
                    // Esto posicionará el panel cerca del modelo en la pantalla
                    panel.linkWithMesh(celdaAEM);
                    panel.linkOffsetX = 200;  // Ajuste horizontal
                    panel.linkOffsetY = -100; // Ajuste vertical

                    // Configuración base para el tamaño adaptativo
                    const baseFontSize = 20;
                    const baseDistance = 8; // La distancia inicial de la cámara
                    const baseWidth = 200;
                    const baseHeight = 100;

                    const labels = [
                        createLabel("basic", "Celda AEMIOS", "low"),
                        createLabel("detailed", "Celda AEMIOS\nModelo: XR-5\nEstado: Activo", "medium"),
                        createLabel("fullDetail", "Celda AEMIOS\nModelo: XR-5\nEstado: Activo\nTemp: 24°C\nPotencia: 100%", "high")
                    ];

                    // Registrar una función para actualizar el tamaño según el zoom
                    scene.registerBeforeRender(() => {
                        // Calcular el factor de escala basado en la distancia actual
                        const currentDistance = camera.radius;
                        const zoomRatio = baseDistance / currentDistance;

                        // Limitar el factor de escala para evitar tamaños extremos
                        const scaleFactor = Math.max(0.5, Math.min(zoomRatio, 2.5));

                        // Aplicar escala al texto y panel
                        text.fontSize = baseFontSize * scaleFactor;
                        panel.width = baseWidth * scaleFactor + "px";
                        panel.height = baseHeight * scaleFactor + "px";

                        // Opcional: ajustar la posición del panel según el zoom
                        panel.linkOffsetX = 200 * scaleFactor;
                        panel.linkOffsetY = -100 * scaleFactor;

                        const distance = camera.radius;

                        // Mostrar etiqueta apropiada según distancia
                        labels.forEach(label => {
                            if (label.detail === "low" && distance > 15) {
                                label.panel.isVisible = true;
                            } else if (label.detail === "medium" && distance > 8 && distance <= 15) {
                                label.panel.isVisible = true;
                            } else if (label.detail === "high" && distance <= 8) {
                                label.panel.isVisible = true;
                            } else {
                                label.panel.isVisible = false;
                            }
                        });
                    });


                }
            });


            /* const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI"); */

            scene.debugLayer.show();
            /* BABYLON.AppendSceneAsync("/celda_aem_ensamblada/celda_aem_ensamblada.gltf", scene); */


            /* const btn = BABYLON.GUI.Button.CreateSimpleButton("but", "Click Me"); */

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
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default BabylonScene;