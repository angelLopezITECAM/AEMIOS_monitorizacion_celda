import * as BABYLON from '@babylonjs/core';

export function setupScene({ engine }) {

    const scene = new BABYLON.Scene(engine);

    //Configuración escena
    scene.clearColor = new BABYLON.Color4(0.05, 0.05, 0.2, 1);
    scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);

    //Optimizaciones
    scene.useRightHandedSystem = true;
    scene.autoClear = true;
    scene.autoClearDepthAndStencil = true;

    return scene;
}