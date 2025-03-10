import oxigenoLogo from '@/assets/img/canvas/temperatura.png'
import { drawArrow, drawImage, getCoords } from '@/utils/canvas/drawingFunctions'


const oxigenoImage = new Image()
oxigenoImage.src = oxigenoLogo

export function drawTemperaturaControl(ctx, canvas, coords) {

    const baseX = coords.temperaturaControl.x
    const baseY = coords.temperaturaControl.y

    const { imageWidth, imageHeight } = drawImage({
        ctx,
        image: oxigenoImage,
        imageBaseX: baseX,
        imageBaseY: baseY,
        desiredWidthPercentage: coords.temperaturaControl.sizeMainImage
    })

    const arrowX = baseX + imageWidth / 2
    const arrowY = baseY + imageHeight + 15
    const arrowLength = 50

    drawArrow({
        ctx,
        posX: arrowX,
        posY: arrowY,
        length: arrowLength,
        direction: 'down'
    })

}