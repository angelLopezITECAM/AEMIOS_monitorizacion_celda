import oxigenoLogo from '@/assets/img/canvas/oxigeno.png'
import { drawArrow, drawBox, drawImage, getCoords } from '@/utils/canvas/drawingFunctions'


const oxigenoImage = new Image()
oxigenoImage.src = oxigenoLogo

export function drawOxigeno(ctx, canvas, coords) {

    const textColor = 'black' // Color del texto
    const text = '300 PPM' // Texto a mostrar
    ctx.font = '16px Geist, system-ui, Avenir, Helvetica, Arial, sans-serif'


    const baseX = coords.oxigeno.x
    const baseY = coords.oxigeno.y

    const { imageWidth, imageHeight } = drawImage({
        ctx,
        image: oxigenoImage,
        imageBaseX: baseX,
        imageBaseY: baseY,
        desiredWidthPercentage: coords.oxigeno.sizeMainImage
    })

    const textMetrics = ctx.measureText(text)
    const textWidth = textMetrics.width

    const boxX = baseX + imageWidth + 10
    const boxY = baseY + imageHeight / 4
    const { boxWidth, boxHeight } = drawBox({ ctx, textWidth, boxX, boxY })

    // Define las propiedades del texto
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Calcula la posición del texto para centrarlo dentro de la caja
    const textX = boxX + boxWidth / 2
    const textY = boxY + boxHeight / 2
    ctx.fillText(text, textX, textY)

    const arrowX = baseX + imageWidth + 25
    const arrowY = baseY + boxHeight + 10 + imageHeight / 4
    const arrowLength = boxWidth - 20

    drawArrow({
        ctx,
        posX: arrowX,
        posY: arrowY,
        length: arrowLength,
        direction: 'left'
    })

}