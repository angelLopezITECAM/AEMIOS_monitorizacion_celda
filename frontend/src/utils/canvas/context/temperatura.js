import oxigenoLogo from '@/assets/img/canvas/cable.png'
import { drawArrow, drawBox, drawImage, getCoords } from '@/utils/canvas/drawingFunctions'

const oxigenoImage = new Image()
oxigenoImage.src = oxigenoLogo

export function drawTemperatura(ctx, canvas, coords) {

    const textColor = 'black' // Color del texto
    const text = '23 ºC' // Texto a mostrar
    ctx.font = '16px system-ui, Avenir, Helvetica, Arial, sans-serif'


    const baseX = coords.temperatura.x
    const baseY = coords.temperatura.y


    const { imageWidth, imageHeight } = drawImage({
        ctx,
        image: oxigenoImage,
        imageBaseX: baseX,
        imageBaseY: baseY,
        desiredWidthPercentage: coords.temperatura.sizeMainImage
    })

    const textMetrics = ctx.measureText(text)
    const textWidth = textMetrics.width

    const boxWidthTeorico = textWidth + 2 * 10
    const arrowLength = boxWidthTeorico - 20
    const boxX = baseX + (imageWidth / 2) - (boxWidthTeorico / 2) + 60
    const boxY = baseY + (imageHeight / 4)

    const measureBox = drawBox({ ctx, textWidth, boxX, boxY })
    const { boxWidth, boxHeight } = measureBox

    // Define las propiedades del texto
    ctx.fillStyle = textColor
    ctx.textAlign = 'center' // Alinea el texto al centro de la caja
    ctx.textBaseline = 'middle' // Alinea el texto al centro vertical de la caja

    // Calcula la posición del texto para centrarlo dentro de la caja
    const textX = boxX + boxWidth / 2
    const textY = boxY + boxHeight / 2
    ctx.fillText(text, textX, textY)

    const arrowX = baseX + (imageWidth / 2)
    const arrowY = baseY + imageHeight + 10


    drawArrow({
        ctx,
        posX: arrowX,
        posY: arrowY,
        length: arrowLength,
        direction: 'up'
    })



}