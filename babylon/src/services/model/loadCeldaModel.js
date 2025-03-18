import * as BABYLON from '@babylonjs/core';


export async function loadCeldaModel(scene, path) {
    const result = await BABYLON.SceneLoader.ImportMeshAsync("", path, "", scene);
    const celda = result.meshes[0];
    celda.name = "MARCADOR";
    celda.isVisible = true;
    celda.scaling = new BABYLON.Vector3(5, 5, 5);
    celda.rotationQuaternion = new BABYLON.Quaternion();
    celda.getChildMeshes()[0].visibility = 0.4

    return celda;
}
