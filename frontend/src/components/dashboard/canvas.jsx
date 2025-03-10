// canvas.jsx
import React, { useRef, useEffect, useState } from 'react'

import { drawDashboard } from '@/utils/canvas/canvasDrawing'
import { getCoords } from '@/utils/canvas/drawingFunctions'

function Canvas() {
    const canvasRef = useRef(null)
    const coords = getCoords()

    const [switches, setSwitches] = useState([
        {
            x: coords.temperaturaControl.switch.x,
            y: coords.temperaturaControl.switch.y,
            radius: 16,
            isOn: true,
            fn: () => console.log("Control temperatura"),
        },
        {
            x: coords.aguaLeft.switch.x,
            y: coords.aguaLeft.switch.y,
            radius: 16,
            isOn: true,
            fn: () => console.log("Agua Left"),
        },
        {
            x: coords.aguaRight.switch.x,
            y: coords.aguaRight.switch.y,
            radius: 16,
            isOn: true,
            fn: () => console.log("Agua Right"),
        },
    ])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = coords.canvas.width
        canvas.height = coords.canvas.height

        const resizeCanvas = () => {

            drawDashboard(ctx, canvas, switches, coords)
        }

        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)

        return () => {
            window.removeEventListener('resize', resizeCanvas)
        }
    }, [switches])

    const handleCanvasClick = (event) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        const x = (event.clientX - rect.left) * scaleX
        const y = (event.clientY - rect.top) * scaleY

        console.log(x, y)

        setSwitches((prevSwitches) =>
            prevSwitches.map((sw) => {
                const distance = Math.sqrt((x - sw.x) ** 2 + (y - sw.y) ** 2)

                console.log(sw.x, sw.y)

                if (distance <= sw.radius * 1.75) {
                    sw.fn()
                    return { ...sw, isOn: !sw.isOn }
                }
                return sw
            }),
        )
    }



    return <canvas ref={canvasRef} className='w-full h-full p-4' onClick={handleCanvasClick} />

}



export default Canvas