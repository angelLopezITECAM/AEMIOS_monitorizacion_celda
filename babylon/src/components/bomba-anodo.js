
import { createLabel } from '@/gui/label';
import { createImage } from '@/gui/image';
import { createSwitch } from '@/gui/switch';
import { createWater } from '@/gui/materials/water';
import { processChangeInput, processChangeSlider, handleInput, handleSlider } from '@/gui/controls'

export function BombaAnodo({ scene, celdaAEM, canvas }) {

    let initialCaudal = 25;

    const switchAnodo = document.getElementById('switchAnodo')
    const sliderAnodoElement = document.getElementById('sliderAnodo')
    const inputAnodoElement = document.getElementById('inputAnodo')
    const caudalAnodo = document.getElementById('caudalAnodo')

    const isActive = switchAnodo.checked;

    const waterSystem = createWater(scene, {
        x: 0,
        y: 0,
        z: 2.5,
        direction: "leftToRight",
        caudal: initialCaudal,
        name: "waterMaterialAnodo",
        isActive
    });


    const handleCheckbox = (isChecked) => {
        waterSystem.setFlowState(isChecked);
    }



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