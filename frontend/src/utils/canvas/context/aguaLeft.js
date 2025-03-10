import aparatoLogo from '@/assets/img/canvas/aparato.png'
import aguaLogo from '@/assets/img/canvas/agua.png'
import { drawArrow, drawBox, drawImage, getCoords } from '@/utils/canvas/drawingFunctions'

const aparatoImage = new Image()
aparatoImage.src = aparatoLogo

const aguaImage = new Image()
aguaImage.src = aguaLogo

export function drawAguaLeft(ctx, canvas, coords) {

    const textColor = 'black' // Color del texto
    const text = '15 l/h' // Texto a mostrar
    const textPotencia = '2 W' // Texto a mostrar
    ctx.font = '16px system-ui, Avenir, Helvetica, Arial, sans-serif'

    const baseX = coords.aguaLeft.x
    const baseY = coords.aguaLeft.y

    const { imageWidth, imageHeight } = drawImage({
        ctx,
        image: aparatoImage,
        imageBaseX: baseX,
        imageBaseY: baseY,
        desiredWidthPercentage: coords.aguaLeft.sizeMainImage
    })

    const textMetrics = ctx.measureText(text)
    const textWidth = textMetrics.width

    const boxX = baseX + imageWidth + 10 // Posición X de la caja
    const boxY = baseY + imageHeight / 4 // Posición Y de la caja
    const { boxWidth, boxHeight } = drawBox({ ctx, textWidth, boxX, boxY })

    // Define las propiedades del texto
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Calcula la posición del texto para centrarlo dentro de la caja
    const textX = boxX + boxWidth / 2
    const textY = boxY + boxHeight / 2
    ctx.fillText(text, textX, textY)

    const textMetricsPotencia = ctx.measureText(textPotencia)
    const textWidthPotencia = textMetricsPotencia.width

    const boxXPotencia = baseX + imageWidth + 10 // Posición X de la caja
    const boxYPotencia = baseY - 20 // Posición Y de la caja
    const meauseBoxPotencia = drawBox({ ctx, textWidth: textWidthPotencia, boxX: boxXPotencia, boxY: boxYPotencia })

    // Define las propiedades del texto
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Calcula la posición del texto para centrarlo dentro de la caja
    const textXPotencia = boxXPotencia + meauseBoxPotencia.boxWidth / 2
    const textYPotencia = boxYPotencia + meauseBoxPotencia.boxHeight / 2
    ctx.fillText(textPotencia, textXPotencia, textYPotencia)



    const arrowX = baseX + imageWidth + 15
    const arrowY = baseY + boxHeight + 10 + imageHeight / 4
    const arrowLength = boxWidth - 20

    drawArrow({
        ctx,
        posX: arrowX,
        posY: arrowY,
        length: arrowLength,
        direction: 'right'
    })

    drawImage({
        ctx,
        image: aguaImage,
        imageBaseX: arrowX - 10,
        imageBaseY: arrowY + 10,
        desiredWidthPercentage: coords.aguaLeft.sizeSecondaryImage
    })
}