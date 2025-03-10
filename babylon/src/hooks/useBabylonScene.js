import { useState, useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import { createScene } from '@/services/babylon/scene';
import { setupEngine, disposeEngine } from '@/services/babylon/engine';

/**
 * Hook para gestionar una escena Babylon.js
 * @param {HTMLCanvasElement} canvas - Elemento canvas
 * @param {Object} options - Opciones de configuración
 * @returns {Object} - Objeto con escena, motor y otras propiedades
 */
export function useBabylonScene(canvas, options = {}) {
    const [scene, setScene] = useState(null);
    const [engine, setEngine] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const renderLoopRef = useRef(null);

    useEffect(() => {
        if (!canvas) return;

        // Crear motor y escena
        const newEngine = setupEngine(canvas);
        const newScene = createScene(newEngine);

        setEngine(newEngine);
        setScene(newScene);

        // Iniciar renderizado
        renderLoopRef.current = newEngine.runRenderLoop(() => {
            newScene.render();
        });

        // Evento de redimensión
        const handleResize = () => newEngine.resize();
        window.addEventListener('resize', handleResize);

        // Marcar como listo cuando todo está configurado
        setIsReady(true);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (renderLoopRef.current) {
                newEngine.stopRenderLoop(renderLoopRef.current);
            }
            disposeEngine(newEngine, newScene);
        };
    }, [canvas]);

    return { scene, engine, isReady };
}