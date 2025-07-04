
import { createLabel } from '@/gui/label';
import { createImage } from '@/gui/image';
import { createSwitch } from '@/gui/switch';
import { createWater } from '@/gui/materials/water';
import { processChangeInput, processChangeSlider, handleInput, handleSlider } from '@/gui/controls'
import * as BABYLON from '@babylonjs/core';

export function BombaAnodo({ scene, celdaAEM, canvas }) {

    let initialCaudal = 25;

    const switchAnodo = document.getElementById('switchAnodo')
    const sliderAnodoElement = document.getElementById('sliderAnodo')
    const inputAnodoElement = document.getElementById('inputAnodo')
    const caudalAnodo = document.getElementById('caudalAnodo')
    const switchDetalle = document.getElementById('switchDetalle')

    const isActive = switchAnodo.checked;

    const waterSystem = createWater(scene, {
        x: 0,
        y: 0,
        z: 1.35,
        direction: "leftToRight",
        caudal: initialCaudal,
        name: "waterMaterialAnodo",
        nameCilindro: "switchCylinderAnodo",
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
                    cylinder.position.z - 0.4
                ), BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        } else {
            BABYLON.Animation.CreateAndStartAnimation(
                'anim', cylinder, 'position', fps, totalFPS, cylinder.position,
                new BABYLON.Vector3(
                    cylinder.position.x,
                    cylinder.position.y,
                    cylinder.position.z + 0.4
                ), BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        }

    });


    switchAnodo && switchAnodo.addEventListener('click', (e) => {
        handleCheckbox(switchAnodo.checked)
    })

    sliderAnodoElement && sliderAnodoElement.addEventListener('input', (e) => {
        e.preventDefault();
        const newValue = e.target.value
        inputAnodoElement && (inputAnodoElement.value = newValue)
        caudalAnodo && (caudalAnodo.innerHTML = `<strong>Caudal:</strong> ${newValue} l/h`)
    })

    inputAnodoElement && inputAnodoElement.addEventListener('input', (e) => {
        e.preventDefault();
        const newValue = e.target.value
        sliderAnodoElement && (sliderAnodoElement.value = newValue)
        caudalAnodo && (caudalAnodo.innerHTML = `<strong>Caudal:</strong> ${newValue} l/h`)
    })


}