import * as BABYLON from '@babylonjs/core';

export function setupEngine(canvas) {
    const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    engine.enableOfflineSupport = false;

    return engine;
}

export function disposeEngine(engine, scene) {
    if (scene) scene.dispose();
    if (engine) engine.dispose();
}