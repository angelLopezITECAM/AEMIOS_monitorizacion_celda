
import { createLabel } from '@/gui/label';
import { createImage } from '@/gui/image';

export function Termopar({ scene, celdaAEM, advancedTexture }) {


    const labelTemperaturaTermopar = advancedTexture.getControlByName('labeltemperaturaTermopar')
    const consumoTermopar = advancedTexture.getControlByName('labelConsumoTermopar')
    const potenciaTermopar = advancedTexture.getControlByName('labelPotenciaTermopar')
    const voltajeTermopar = advancedTexture.getControlByName('labelVoltajeTermopar')

}