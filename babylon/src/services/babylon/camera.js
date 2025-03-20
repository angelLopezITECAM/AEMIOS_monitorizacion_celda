import * as BABYLON from '@babylonjs/core';

export function setupCamera({ scene, canvas, targetMesh }) {
    const camera = new BABYLON.ArcRotateCamera(
        "camera1",
        Math.PI,
        Math.PI / 2,
        4,
        BABYLON.Vector3.Zero(),
        scene
    );

    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    camera.minZ = 0.01;
    camera.maxZ = 1000;
    camera.wheelDeltaPercentage = 0.03;
    camera.wheelPrecision = 50;

    /* camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    camera.orthoLeft = -10;
    camera.orthoRight = 10; */
    /* camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA; */

    configureCamera({ camera, canvas });

    /* if (targetMesh) {
        focusCameraOnMesh({ camera, targetMesh });
    } */


    return camera;
}

function configureCamera({ camera, canvas }) {

    camera.attachControl(canvas, true);
    camera.wheelPrecision = 50;
    camera.lowerRadiusLimit = 0.1;
    camera.upperRadiusLimit = 50;
    camera.wheelDeltaPercentage = 0.03;
    camera.pinchDeltaPercentage = 0.03;
    camera.inertia = 0.7;

    /* camera.lowerAlphaLimit = -Math.PI / 2;
    camera.upperAlphaLimit = Math.PI * 2;

    camera.lowerBetaLimit = 0;
    camera.upperBetaLimit = Math.PI; */


    /* camera.lowerRadiusLimit = 1;
    camera.upperRadiusLimit = 12; */

}

export function focusCameraOnMesh({ camera, mesh }) {
    if (!mesh) return;

    // Calcular el centro óptimo basado en el boundingBox
    const boundingInfo = mesh.getBoundingInfo();
    if (boundingInfo) {
        const center = boundingInfo.boundingBox.centerWorld;

        // Animación suave hacia el centro del modelo
        BABYLON.Animation.CreateAndStartAnimation(
            "cameraFocus", camera, "target", 30, 60,
            camera.target, center, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
    }
}