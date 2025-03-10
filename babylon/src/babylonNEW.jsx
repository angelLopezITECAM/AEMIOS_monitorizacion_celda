import React, { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import "@babylonjs/loaders/glTF";
import '@babylonjs/inspector';

// Importar todas las funciones modularizadas
import { setupCamera } from '@/services/babylon/camera';
import { setupLights } from '@/services/babylon/lights';
import { loadCeldaModel } from '@/services/model/loadCeldaModel';
import { createLabel } from '@/gui/label';
import { setupAdaptiveUI } from '@/utils/adaptiveUI';
import { addNavigationControls } from '@/gui/controls';
import { setupEngine, disposeEngine } from '@/services/babylon/engine';
import { setupScene } from '@/services/babylon/scene';
import { startRenderLoop } from '@/services/babylon/render';

const BabylonScene = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const engine = setupEngine(canvasRef.current);
        const scene = setupScene(engine);
        const camera = setupCamera({ scene, canvas: canvasRef.current });
        const light = setupLights(scene);

        loadCeldaModel(scene, "./models/celda_aem_explosionada/celda_aem_explosionada.gltf")
            .then(celdaAEM => {
                if (!celdaAEM) return;

                const manualCenter = new BABYLON.Vector3(6, -1, 0.5);
                camera.target = manualCenter;

                /*                 const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
                
                                const panel = new GUI.Rectangle();
                                panel.width = "200px";
                                panel.height = "100px";
                                panel.cornerRadius = 20;
                                panel.color = "white";
                                panel.thickness = 2;
                                panel.background = "rgba(0, 0, 0, 0.7)";
                                advancedTexture.addControl(panel);
                
                                // 6. TEXTO PRINCIPAL
                                const text = new GUI.TextBlock();
                                text.text = "Celda AEMIOS";
                                text.color = "white";
                                text.fontSize = 20;
                                panel.addControl(text);
                
                                // 7. VINCULACIÓN AL MODELO
                                panel.linkWithMesh(celdaAEM);
                                panel.linkOffsetX = 200;
                                panel.linkOffsetY = -100; */

                // 8. ETIQUETAS DINÁMICAS
                /*                 const labels = [
                                    createLabel({
                                        name: "basic",
                                        textContent: "Celda AEMIOS",
                                        detailLevel: "low",
                                        advancedTexture,
                                        targetMesh: celdaAEM
                                    }),
                                    createLabel({
                                        name: "detailed",
                                        textContent: "Celda AEMIOS\nModelo: XR-5\nEstado: Activo",
                                        detailLevel: "medium",
                                        advancedTexture,
                                        targetMesh: celdaAEM
                                    }),
                                    createLabel({
                                        name: "fullDetail",
                                        textContent: "Celda AEMIOS\nModelo: XR-5\nEstado: Activo\nTemp: 24°C\nPotencia: 100%",
                                        detailLevel: "high",
                                        advancedTexture,
                                        targetMesh: celdaAEM
                                    })
                                ]; */

                // 9. CONFIGURACIÓN DE UI ADAPTATIVA
                /* setupAdaptiveUI(scene, camera, panel, text, labels); */

                // 10. CONTROLES DE NAVEGACIÓN
                /* addNavigationControls(scene, camera, advancedTexture); */
            });

        // 11. RENDERIZADO Y HERRAMIENTAS DE DESARROLLO
        scene.debugLayer.show();
        const renderLoop = startRenderLoop(engine, scene);

        // 12. MANEJO DE REDIMENSIONAMIENTO
        const handleResize = () => engine.resize();
        window.addEventListener('resize', handleResize);

        // 13. LIMPIEZA AL DESMONTAR
        return () => {
            window.removeEventListener('resize', handleResize);
            renderLoop.stop();
            disposeEngine(engine, scene);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default BabylonScene;