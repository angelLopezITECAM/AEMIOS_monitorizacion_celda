import { drawBackground, drawSwitches } from "./drawingFunctions";

import { drawOxigeno } from "./context/oxigeno";
import { drawPlaca } from "./context/placa";
import { drawAguaLeft } from "./context/aguaLeft";
import { drawAguaRight } from "./context/aguaRight";
import { drawHidrogeno } from "./context/hidrogeno";
import { drawTemperatura } from "./context/temperatura";
import { drawTemperaturaControl } from "./context/temperaturaControl";

export function drawDashboard(ctx, canvas, switches, coords) {
    if (!ctx) return
    //Limpiamos el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBackground(ctx, canvas)

    ctx.font = '16px Geist'
    ctx.fillStyle = 'black'
    /* drawOxigeno(ctx, canvas, coords) */
    drawPlaca(ctx, canvas, coords)
    drawAguaLeft(ctx, canvas, coords)
    drawAguaRight(ctx, canvas, coords)
    /* drawHidrogeno(ctx, canvas, coords) */
    drawTemperatura(ctx, canvas, coords)
    drawTemperaturaControl(ctx, canvas, coords)
    drawSwitches(ctx, canvas, switches, coords)

}