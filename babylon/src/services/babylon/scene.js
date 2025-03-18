import * as BABYLON from '@babylonjs/core';

export function setupScene({ engine }) {

    const scene = new BABYLON.Scene(engine);

    //Configuración escena
    scene.clearColor = BABYLON.Color3.FromHexString("#f0f9ff");
    /* scene.clearColor = BABYLON.Color3.FromHexString("#f0f9ff"); */
    /* scene.ambientColor = new BABYLON.Color3(1, 0, 0); */

    //Optimizaciones
    /*     scene.useRightHandedSystem = true;
        scene.autoClear = true;
        scene.autoClearDepthAndStencil = true;
     */
    return scene;
}