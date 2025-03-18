
import { createLabel } from '@/gui/label';
import { createImage } from '@/gui/image';
import { createSwitch } from '@/gui/switch';
import { createWater } from '@/gui/materials/water';
import { processChangeInput, processChangeSlider, handleInput, handleSlider } from '@/gui/controls'

export function BombaAnodo({ scene, celdaAEM, canvas, advancedTexture }) {

    let initialCaudal = 25;

    const checkboxAnodo = advancedTexture.getControlByName('checkboxAnodo')
    const labelCaudalAnodo = advancedTexture.getControlByName('labelCaudalAnodo')
    const sliderAnodo = advancedTexture.getControlByName('SliderAnodo')
    const inputCaudalAnodo = advancedTexture.getControlByName('valueCaudalAnodo')

    const consumoAnodo = advancedTexture.getControlByName('labelConsumoAnodo')
    const potenciaAnodo = advancedTexture.getControlByName('labelPotenciaAnodo')
    const voltajeAnodo = advancedTexture.getControlByName('labelVoltajeAnodo')



    const isActive = checkboxAnodo.isChecked;

    const waterSystem = createWater(scene, {
        x: 0,
        y: 0,
        z: 2.5,
        direction: "leftToRight",
        caudal: initialCaudal,
        name: "waterMaterialAnodo",
        isActive
    });


    handleSlider(initialCaudal, inputCaudalAnodo, labelCaudalAnodo)
    handleInput({ text: initialCaudal }, sliderAnodo, labelCaudalAnodo)

    const handleCheckbox = (isChecked) => {
        waterSystem.setFlowState(isChecked);
    }


    sliderAnodo.onValueChangedObservable.add((value) => processChangeSlider(value, inputCaudalAnodo, labelCaudalAnodo))
    inputCaudalAnodo.onTextChangedObservable.add((value) => processChangeInput(value, sliderAnodo, labelCaudalAnodo))

    checkboxAnodo.onIsCheckedChangedObservable.add(isChecked => {
        handleCheckbox(isChecked)
    })

    const switchAnodo = document.getElementById('switchAnodo')
    const sliderAnodoElement = document.getElementById('sliderAnodo')
    const inputAnodoElement = document.getElementById('inputAnodo')
    const caudalAnodo = document.getElementById('caudalAnodo')

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