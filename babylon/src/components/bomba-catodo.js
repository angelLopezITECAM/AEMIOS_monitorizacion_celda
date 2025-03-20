
import { createLabel } from '@/gui/label';
import { createImage } from '@/gui/image';
import { createSwitch } from '@/gui/switch';
import { createWater } from '@/gui/materials/water';
import { processChangeInput, processChangeSlider, handleInput, handleSlider } from '@/gui/controls'
import * as BABYLON from '@babylonjs/core';

export function BombaCatodo({ scene, celdaAEM, canvas }) {

    let initialCaudal = 17;
    const switchCatodo = document.getElementById('switchCatodo')
    const sliderCatodoElement = document.getElementById('sliderCatodo')
    const inputCatodoElement = document.getElementById('inputCatodo')
    const caudalCatodo = document.getElementById('caudalCatodo')
    const switchDetalle = document.getElementById('switchDetalle')

    const isActive = switchCatodo.checked;

    const waterSystem = createWater(scene, {
        x: 0,
        y: -0.1,
        z: -1.35,
        direction: "rightToLeft",
        caudal: initialCaudal,
        name: "waterMaterialCatodo",
        nameCilindro: "switchCylinderCatodo",
        isActive
    });


    const handleCheckbox = (isChecked) => {
        waterSystem.setFlowState(isChecked);
    }

    switchDetalle && switchDetalle.addEventListener('change', (e) => {
        const isChecked = e.target.checked
        const cylinder = waterSystem.cylinder
        const fps = 60
        const seconds = 1.5
        const totalFPS = fps * seconds

        if (isChecked) {
            BABYLON.Animation.CreateAndStartAnimation(
                'anim', cylinder, 'position', fps, totalFPS, cylinder.position, new BABYLON.Vector3(
                    cylinder.position.x,
                    cylinder.position.y,
                    cylinder.position.z + 0.6
                ), BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);


        } else {
            BABYLON.Animation.CreateAndStartAnimation(
                'anim', cylinder, 'position', fps, totalFPS, cylinder.position,
                new BABYLON.Vector3(
                    cylinder.position.x,
                    cylinder.position.y,
                    cylinder.position.z - 0.6
                ), BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        }

    });

    switchCatodo && switchCatodo.addEventListener('click', (e) => {
        handleCheckbox(switchCatodo.checked)
    })

    sliderCatodoElement && sliderCatodoElement.addEventListener('input', (e) => {
        e.preventDefault();
        const newValue = e.target.value
        inputCatodoElement && (inputCatodoElement.value = newValue)
        caudalCatodo && (caudalCatodo.innerHTML = `<strong>Caudal:</strong> ${newValue} l/h`)
    })

    inputCatodoElement && inputCatodoElement.addEventListener('input', (e) => {
        e.preventDefault();
        const newValue = e.target.value
        sliderCatodoElement && (sliderCatodoElement.value = newValue)
        caudalCatodo && (caudalCatodo.innerHTML = `<strong>Caudal:</strong> ${newValue} l/h`)
    })

}