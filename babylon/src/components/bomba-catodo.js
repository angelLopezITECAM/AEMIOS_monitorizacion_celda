
import { createLabel } from '@/gui/label';
import { createImage } from '@/gui/image';
import { createSwitch } from '@/gui/switch';
import { createWater } from '@/gui/materials/water';
import { processChangeInput, processChangeSlider, handleInput, handleSlider } from '@/gui/controls'

export function BombaCatodo({ scene, celdaAEM, canvas }) {

    let initialCaudal = 17;
    const switchCatodo = document.getElementById('switchCatodo')
    const sliderCatodoElement = document.getElementById('sliderCatodo')
    const inputCatodoElement = document.getElementById('inputCatodo')
    const caudalCatodo = document.getElementById('caudalCatodo')

    const isActive = switchCatodo.checked;

    const waterSystem = createWater(scene, {
        x: 0,
        y: -0.1,
        z: -0.10,
        direction: "rightToLeft",
        caudal: initialCaudal,
        name: "waterMaterialCatodo",
        isActive
    });


    const handleCheckbox = (isChecked) => {
        waterSystem.setFlowState(isChecked);
    }

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