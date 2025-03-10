export function drawBackground(ctx, canvas) {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

export function drawArrow({ ctx, posX, posY, length, direction, colorArrow = 'black' }) {

    let fromx, fromy, tox, toy
    switch (direction) {
        case 'up':
            fromx = posX
            tox = posX
            fromy = posY + length
            toy = posY
            break;
        case 'down':
            fromx = posX
            tox = posX
            fromy = posY
            toy = posY + length
            break;
        case 'right':
            fromx = posX
            tox = posX + length
            fromy = posY
            toy = posY
            break;
        case 'left':
            fromx = posX + length
            tox = posX
            fromy = posY
            toy = posY
            break;
    }

    var headlen = 10; // length of head in pixels
    var angle = Math.atan2(toy - fromy, tox - fromx);
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineTo(
        tox - headlen * Math.cos(angle - Math.PI / 6),
        toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(tox, toy);
    ctx.lineTo(
        tox - headlen * Math.cos(angle + Math.PI / 6),
        toy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.lineWidth = 2;
    ctx.strokeStyle = colorArrow;
    ctx.stroke();
}

export function roundRect(ctx, x, y, width, height, radius) {
    radius = Math.min(radius, width / 2, height / 2)
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
}

export function drawSwitches(ctx, canvas, switches) {
    switches.forEach((sw) => {
        ctx.beginPath()
        ctx.arc(sw.x, sw.y, sw.radius, 0, 2 * Math.PI)
        ctx.fillStyle = sw.isOn ? "#05df72" : "#ff6467"
        ctx.fill()

        ctx.strokeStyle = "#1f2937"
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.fillStyle = "#000000"
        ctx.font = `12px Geist`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(sw.isOn ? "ON" : "OFF", sw.x, sw.y)
    })
}

export function drawBox({ ctx, textWidth, boxX, boxY, boxPadding = 10, boxHeight = 30, boxRadius = 10, bgColor = 'white', borderColor = 'black' }) {

    const boxWidth = textWidth + 2 * boxPadding

    ctx.fillStyle = bgColor
    ctx.strokeStyle = borderColor
    roundRect(ctx, boxX, boxY, boxWidth, boxHeight, boxRadius)

    return { boxX, boxY, boxWidth, boxHeight }

}


export function drawImage({ ctx, image, imageBaseX, imageBaseY, desiredWidthPercentage }) {
    const aspectRatio = image.naturalWidth / image.naturalHeight

    const imageWidth = image.naturalWidth * desiredWidthPercentage
    const imageHeight = imageWidth / aspectRatio

    ctx.drawImage(image, imageBaseX, imageBaseY, imageWidth, imageHeight)

    return { imageWidth, imageHeight }

}

export function getCoords() {

    return {
        canvas: {
            width: 850,
            height: 375
        },
        aguaLeft: {
            x: 5,
            y: 150,
            sizeMainImage: 0.75,
            sizeSecondaryImage: 0.1,
            switch: {
                x: 35,
                y: 250
            }
        },
        aguaRight: {
            x: 615,
            y: 160,
            sizeMainImage: 0.75,
            sizeSecondaryImage: 0.1,
            switch: {
                x: 750,
                y: 260
            }
        },
        /*         oxigeno: {
                    x: 5,
                    y: 150,
                    sizeMainImage: 0.13,
                }, */
        temperaturaControl: {
            x: 200,
            y: 25,
            sizeMainImage: 0.08,
            switch: {
                x: 175,
                y: 50
            }
        },
        temperatura: {
            x: 500,
            y: 25,
            sizeMainImage: 0.55,
        },
        /*         hidrogeno: {
                    x: 625,
                    y: 175,
                    sizeMainImage: 0.12,
                }, */
        placa: {
            x: 220,
            y: 150,
            sizeMainImage: 0.80,
        },
    }
}