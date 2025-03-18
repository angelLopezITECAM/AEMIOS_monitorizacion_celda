
import { createLabel } from '@/gui/label';
import { createImage } from '@/gui/image';
import { createSwitch } from '@/gui/switch';
import { createWater } from '@/gui/materials/water';
import { processChangeInput, processChangeSlider, handleInput, handleSlider } from '@/gui/controls'

export function BombaCatodo({ scene, celdaAEM, canvas, advancedTexture }) {

    let initialCaudal = 17;

    const checkboxCatodo = advancedTexture.getControlByName('checkboxCatodo')
    const sliderCatodo = advancedTexture.getControlByName('SliderCatodo')
    const labelCaudalCatodo = advancedTexture.getControlByName('labelCaudalCatodo')
    const inputCaudalCatodo = advancedTexture.getControlByName('valueCaudalCatodo')

    const consumoCatodo = advancedTexture.getControlByName('labelConsumoCatodo')
    const potenciaCatodo = advancedTexture.getControlByName('labelPotenciaCatodo')
    const voltajeCatodo = advancedTexture.getControlByName('labelVoltajeCatodo')




    const isActive = checkboxCatodo.isChecked;

    const waterSystem = createWater(scene, {
        x: 0,
        y: -0.1,
        z: -0.10,
        direction: "rightToLeft",
        caudal: initialCaudal,
        name: "waterMaterialCatodo",
        isActive
    });

    handleSlider(initialCaudal, inputCaudalCatodo, labelCaudalCatodo)
    handleInput({ text: initialCaudal }, sliderCatodo, labelCaudalCatodo)

    const handleCheckbox = (isChecked) => {
        waterSystem.setFlowState(isChecked);
    }


    sliderCatodo.onValueChangedObservable.add((value) => {
        processChangeSlider(value, inputCaudalCatodo, labelCaudalCatodo)
        waterSystem.setCaudal(value.toFixed(0));
    })
    inputCaudalCatodo.onTextChangedObservable.add((value) => {
        processChangeInput(value, sliderCatodo, labelCaudalCatodo)
        waterSystem.setCaudal(value.text);
    })

    checkboxCatodo.onIsCheckedChangedObservable.add(isChecked => {
        handleCheckbox(isChecked)
    })

    const switchCatodo = document.getElementById('switchCatodo')
    const sliderCatodoElement = document.getElementById('sliderCatodo')
    const inputCatodoElement = document.getElementById('inputCatodo')
    const caudalCatodo = document.getElementById('caudalCatodo')

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