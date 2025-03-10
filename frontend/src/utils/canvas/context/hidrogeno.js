import hidrogenoLogo from '@/assets/img/canvas/hidrogeno.png'
import { drawArrow, drawBox, drawImage, getCoords } from '@/utils/canvas/drawingFunctions'


const hidrogenoImage = new Image()
hidrogenoImage.src = hidrogenoLogo

export function drawHidrogeno(ctx, canvas, coords) {

    const textColor = 'black' // Color del texto
    const text = '0 PPM' // Texto a mostrar
    ctx.font = '16px system-ui, Avenir, Helvetica, Arial, sans-serif'


    const baseX = coords.hidrogeno.x
    const baseY = coords.hidrogeno.y

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

    const arrowX = baseX;
    const arrowY = baseY + boxHeight + 10
    const arrowLength = boxWidth - 20

    drawArrow({
        ctx,
        posX: arrowX + 10,
        posY: arrowY,
        length: arrowLength,
        direction: 'right'
    })

    const { imageWidth, imageHeight } = drawImage({
        ctx,
        image: hidrogenoImage,
        imageBaseX: baseX + arrowLength + 35,
        imageBaseY: baseY - 10,
        desiredWidthPercentage: coords.hidrogeno.sizeMainImage
    })

}