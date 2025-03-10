import placaLogo from '@/assets/img/canvas/placa.png'
import { drawArrow, drawBox, drawImage, getCoords } from '@/utils/canvas/drawingFunctions'

const placaImage = new Image()
placaImage.src = placaLogo

export function drawPlaca(ctx, canvas, coords) {

    const textColor = 'black' // Color del texto
    const text = '100 W' // Texto a mostrar
    ctx.font = '16px system-ui, Avenir, Helvetica, Arial, sans-serif'


    const baseX = coords.placa.x
    const baseY = coords.placa.y

    const { imageWidth, imageHeight } = drawImage({
        ctx,
        image: placaImage,
        imageBaseX: baseX,
        imageBaseY: baseY,
        desiredWidthPercentage: coords.placa.sizeMainImage
    })

    const textMetrics = ctx.measureText(text)
    const textWidth = textMetrics.width

    const boxWidthTeorico = textWidth + 2 * 10
    const boxX = baseX + (imageWidth / 2) - (boxWidthTeorico / 2)
    const boxY = baseY - 50
    const { boxWidth, boxHeight } = drawBox({
        ctx,
        textWidth,
        boxX,
        boxY,
        bgColor: "#fde047"
    })

    // Define las propiedades del texto
    ctx.fillStyle = textColor
    ctx.textAlign = 'center' // Alinea el texto al centro de la caja
    ctx.textBaseline = 'middle' // Alinea el texto al centro vertical de la caja

    // Calcula la posición del texto para centrarlo dentro de la caja
    const textX = boxX + boxWidth / 2
    const textY = boxY + boxHeight / 2
    ctx.fillText(text, textX, textY)

    const arrowX = baseX + (imageWidth / 2)
    const arrowY = baseY - 10
    const arrowLength = boxWidth - 20

    drawArrow({
        ctx,
        posX: arrowX,
        posY: arrowY,
        length: arrowLength,
        direction: 'down'
    })




}