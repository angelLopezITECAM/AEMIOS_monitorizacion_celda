import * as BABYLON from '@babylonjs/core';

export function setupCamera({ scene, canvas, targetMesh }) {
    // Crear una Universal Camera (cámara en primera persona)
    const camera = new BABYLON.UniversalCamera(
        "universalCamera",
        new BABYLON.Vector3(2, 2, -10), // Posición inicial
        scene
    );

    // Configurar la cámara
    configureCamera({ camera, canvas, scene });

    // Si hay un mesh target, posicionar la cámara frente a él
    if (targetMesh) {
        positionCameraToFaceMesh({ camera, targetMesh });
    }

    return camera;
}

function configureCamera({ camera, canvas, scene }) {
    // Conectar controles con el canvas
    camera.attachControl(canvas, true);

    // Configurar velocidades de movimiento
    camera.speed = 0.5;
    camera.angularSensibility = 1000; // Sensibilidad del ratón (mayor = menos sensible)

}

export function positionCameraToFaceMesh({ camera, mesh }) {
    if (!mesh) return;

    // Calcular el centro y tamaño del objeto
    const boundingInfo = mesh.getBoundingInfo();
    if (boundingInfo) {
        const center = boundingInfo.boundingBox.centerWorld;
        const diagonal = boundingInfo.boundingBox.extendSizeWorld.length() * 2;

        // Calcular una posición adecuada frente al objeto
        const direction = new BABYLON.Vector3(0, 0, 1); // Dirección inicial
        const distance = diagonal * 1.5; // Distancia basada en el tamaño del objeto

        // Posicionar la cámara
        const newPosition = center.subtract(direction.scale(distance));
        newPosition.y = center.y + diagonal * 0.25; // Ligeramente por encima del centro

        // Animar el movimiento de la cámara
        BABYLON.Animation.CreateAndStartAnimation(
            "cameraMove", camera, "position", 30, 60,
            camera.position, newPosition, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        // Apuntar la cámara hacia el objeto
        camera.setTarget(center);
    }
}

// Función auxiliar para mover la cámara a una posición específica
export function moveCameraToPosition({ camera, position, lookAt }) {
    // Animar el movimiento
    BABYLON.Animation.CreateAndStartAnimation(
        "cameraMove", camera, "position", 30, 60,
        camera.position, position, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    // Establecer el punto de mira
    if (lookAt) {
        camera.setTarget(lookAt);
    }
}