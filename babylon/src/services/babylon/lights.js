import * as BABYLON from '@babylonjs/core';

export function setupLights(scene) {
    // Luz hemisférica principal
    const mainLight = new BABYLON.HemisphericLight(
        "light1",
        new BABYLON.Vector3(1, 1, 0),
        scene
    );
    mainLight.intensity = 0.7;

    return mainLight;
}