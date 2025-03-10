import aparatoLogo from '@/assets/img/canvas/aparato.png'
import aguaLogo from '@/assets/img/canvas/agua.png'
import { drawArrow, drawBox, drawImage, getCoords } from '@/utils/canvas/drawingFunctions'

const aparatoImage = new Image()
aparatoImage.src = aparatoLogo

const aguaImage = new Image()
aguaImage.src = aguaLogo

export function drawAguaRight(ctx, canvas, coords) {

    const textColor = 'black' // Color del texto
    const text = '1005 l/h' // Texto a mostrar
    const textPotencia = '23 W' // Texto a mostrar
    ctx.font = '16px system-ui, Avenir, Helvetica, Arial, sans-serif'


    const baseX = coords.aguaRight.x;
    const baseY = coords.aguaRight.y;

    const textMetrics = ctx.measureText(text)
    const textWidth = textMetrics.width

    const boxX = baseX // Posición X de la caja
    const boxY = baseY // Posición Y de la caja
    const { boxWidth, boxHeight } = drawBox({ ctx, textWidth, boxX, boxY })

    // Define las propiedades del texto
    ctx.fillStyle = textColor
    ctx.textAlign = 'center' // Alinea el texto al centro de la caja
    ctx.textBaseline = 'middle' // Alinea el texto al centro vertical de la caja

    // Calcula la posición del texto para centrarlo dentro de la caja
    const textX = boxX + boxWidth / 2
    const textY = boxY + boxHeight / 2

    // Dibuja el texto
    ctx.fillText(text, textX, textY)

    const textMetricsPotencia = ctx.measureText(textPotencia)
    const textWidthPotencia = textMetricsPotencia.width

    const boxXPotencia = baseX + 10 // Posición X de la caja
    const boxYPotencia = baseY - 40 // Posición Y de la caja
    const meauseBoxPotencia = drawBox({ ctx, textWidth: textWidthPotencia, boxX: boxXPotencia, boxY: boxYPotencia })

    // Define las propiedades del texto
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Calcula la posición del texto para centrarlo dentro de la caja
    const textXPotencia = boxXPotencia + meauseBoxPotencia.boxWidth / 2
    const textYPotencia = boxYPotencia + meauseBoxPotencia.boxHeight / 2
    ctx.fillText(textPotencia, textXPotencia, textYPotencia)

    const arrowX = baseX + 15;
    const arrowY = baseY + boxHeight + 10
    const arrowLength = boxWidth - 20

    drawArrow({
        ctx,
        posX: arrowX,
        posY: arrowY,
        length: arrowLength,
        direction: 'left'
    })

    const { imageWidth, imageHeight } = drawImage({
        ctx,
        image: aparatoImage,
        imageBaseX: baseX + arrowLength + 25,
        imageBaseY: baseY - 10,
        desiredWidthPercentage: coords.aguaRight.sizeMainImage
    })

    drawImage({
        ctx,
        image: aguaImage,
        imageBaseX: arrowX + 5,
        imageBaseY: arrowY + 10,
        desiredWidthPercentage: coords.aguaRight.sizeSecondaryImage
    })

}