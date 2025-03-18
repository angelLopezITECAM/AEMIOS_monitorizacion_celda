
import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';

export function createSwitch(scene, canvas, options = {}) {

    const {
        x = 0,
        y = 0,
        z = 0,
        waterSystem,
        defaultValue = false
    } = options;

    const switchCylinder = BABYLON.MeshBuilder.CreateCylinder("switchCylinder", { height: 0.1, diameter: 0.2 }, scene);
    switchCylinder.position = new BABYLON.Vector3(x, y, z);
    switchCylinder.rotation.x = Math.PI / 2;
    switchCylinder.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

    const switchOnMaterial = new BABYLON.StandardMaterial("switchOnMaterial", scene);
    switchOnMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);

    const switchOffMaterial = new BABYLON.StandardMaterial("switchOffMaterial", scene);
    switchOffMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);


    let isSwitchOn = defaultValue;
    switchCylinder.material =
        isSwitchOn
            ? switchOnMaterial
            : switchOffMaterial;

    if (waterSystem) {
        waterSystem.setFlowState(isSwitchOn);
    }

    canvas.addEventListener('pointerdown', () => {
        const pickResult = scene.pick(scene.pointerX, scene.pointerY);

        if (pickResult.hit && pickResult.pickedMesh === switchCylinder) {
            isSwitchOn = !isSwitchOn;

            if (isSwitchOn) {
                switchCylinder.material = switchOnMaterial;
                waterSystem.setFlowState(true);

            } else {
                switchCylinder.material = switchOffMaterial;
                waterSystem.setFlowState(false);

            }
        }
    })
}