import * as BABYLON from '@babylonjs/core';

export function createImage(scene, path, options = {}) {

    const {
        x = 0,
        y = 0,
        z = 0,
    } = options

    const plane = BABYLON.MeshBuilder.CreatePlane("plane", { size: 0.35 }, scene);
    plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
    plane.position.set(x, y, z);

    const material = new BABYLON.StandardMaterial(path, scene);
    material.diffuseTexture = new BABYLON.Texture(path, scene);

    material.emissiveColor = BABYLON.Color3.White();
    material.disableLighting = true;
    plane.material = material;
}