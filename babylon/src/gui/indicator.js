import * as BABYLON from '@babylonjs/core';
import { createCard } from '@/gui/card';

export function createIndicator(scene, canvas, meshPrincipal, pCelda = {}) {

    const { indicator } = pCelda

    const {

        size = 0.2,
        offsetY = 0.1,
        pulseAnimation = true,
        status = "success",
        card = {}
    } = indicator

    let color

    switch (status) {
        case "success":
            color = BABYLON.Color3.FromHexString("#016630");
            break;
        case "warning":
            color = BABYLON.Color3.FromHexString("#894b00");
            break;
        case "danger":
            color = BABYLON.Color3.FromHexString("#9f0712");
            break;
        default:
            color = BABYLON.Color3.FromHexString("#016630");
    }

    const sphereName = `indicator_sphere_${meshPrincipal.uniqueId || Math.random().toString(36).substr(2, 9)}`;
    const sphere = BABYLON.MeshBuilder.CreateSphere(sphereName, {
        diameter: 0.35,
        segments: 8
    }, scene)

    let originalPosition = meshPrincipal.absolutePosition;

    switch (meshPrincipal.name.trim()) {
        case "Separador teflon GDL-1":
            sphere.position = new BABYLON.Vector3(originalPosition.x - 0.2, 0.30, originalPosition.z - 0.05)
            break;
        case "Separador teflon GDL-2":
            sphere.position = new BABYLON.Vector3(originalPosition.x - 0.2, 0.30, originalPosition.z - 0.25)
            break;

        default:
            sphere.position = originalPosition
            break;
    }

    /* sphere.parent = meshPrincipal; */


    const material = new BABYLON.StandardMaterial("indicadorMaterial", scene);
    material.diffuseColor = color;
    material.emissiveColor = color;
    material.alpha = 0.8;
    sphere.material = material;

    sphere.scaling.setAll(size)


    if (pulseAnimation) {
        let scale = 1;
        scene.registerBeforeRender(() => {

            scale = 0.9 + Math.sin(Date.now() * 0.005) * 0.1;
            sphere.scaling.setAll(size * scale);
        })
    }



    canvas.addEventListener('pointerdown', () => {
        const pickResult = scene.pick(scene.pointerX, scene.pointerY);
        console.log(pickResult.pickedMesh.absolutePosition)
        if (pickResult.hit && pickResult.pickedMesh === sphere) {
            scene.getMeshByName('cardPlane') && scene.getMeshByName('cardPlane').dispose()
            scene.getMeshByName('lineCardSphere') && scene.getMeshByName('lineCardSphere').dispose()
            createCard(scene, meshPrincipal, sphere, card)
        }
    })


}