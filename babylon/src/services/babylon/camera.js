import * as BABYLON from '@babylonjs/core';

export function setupCamera({ scene, canvas, targetMesh }) {
    const camera = new BABYLON.ArcRotateCamera(
        "camera1",
        2.45,
        1.35,
        8,
        BABYLON.Vector3.Zero(),
        scene
    );

    configureCamera({ camera, canvas });

    if (targetMesh) {
        focusCameraOnMesh({ camera, targetMesh });
    }

    return camera;
}

function configureCamera({ camera, canvas }) {

    camera.wheelPrecision = 50;
    camera.lowerRadiusLimit = 1;
    camera.upperRadiusLimit = 50;
    camera.wheelDeltaPercentage = 0.01;
    camera.pinchDeltaPercentage = 0.01;
    camera.inertia = 0.7;
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = Math.PI - 0.1;
    camera.angularSensibilityX = 250;
    camera.angularSensibilityY = 250;
    camera.attachControl(canvas, true);
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