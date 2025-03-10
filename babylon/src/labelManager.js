import * as GUI from '@babylonjs/gui';
import { createLabel } from './label';
import { setupAdaptiveUI } from '@/utils/adaptiveUI';

export function setupLabels(scene, camera, targetMesh) {
    // Crear textura para la interfaz
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // Crear panel principal
    const panel = createMainPanel(advancedTexture);

    // Crear texto principal
    const text = createMainText(panel);

    // Vincular panel con el modelo
    linkPanelToMesh(panel, targetMesh);

    // Crear etiquetas adicionales con diferentes niveles de detalle
    const labels = createDetailLabels(advancedTexture, targetMesh);

    // Configurar UI adaptativa
    setupAdaptiveUI(scene, camera, panel, text, labels);

    return {
        panel,
        text,
        labels,
        texture: advancedTexture
    };
}

function createMainPanel(advancedTexture) {
    const panel = new GUI.Rectangle();
    panel.width = "200px";
    panel.height = "100px";
    panel.cornerRadius = 20;
    panel.color = "white";
    panel.thickness = 2;
    panel.background = "rgba(0, 0, 0, 0.7)";
    advancedTexture.addControl(panel);

    return panel;
}

function createMainText(panel) {
    const text = new GUI.TextBlock();
    text.text = "Celda AEMIOS";
    text.color = "white";
    text.fontSize = 20;
    panel.addControl(text);

    return text;
}

function linkPanelToMesh(panel, mesh) {
    if (mesh) {
        panel.linkWithMesh(mesh);
        panel.linkOffsetX = 200;
        panel.linkOffsetY = -100;
    }
}

function createDetailLabels(advancedTexture, mesh) {
    return [
        createLabel({
            name: "basic",
            textContent: "Celda AEMIOS",
            detailLevel: "low",
            advancedTexture: advancedTexture,
            targetMesh: mesh
        }),
        createLabel({
            name: "detailed",
            textContent: "Celda AEMIOS\nModelo: XR-5\nEstado: Activo",
            detailLevel: "medium",
            advancedTexture: advancedTexture,
            targetMesh: mesh
        }),
        createLabel({
            name: "fullDetail",
            textContent: "Celda AEMIOS\nModelo: XR-5\nEstado: Activo\nTemp: 24°C\nPotencia: 100%",
            detailLevel: "high",
            advancedTexture: advancedTexture,
            targetMesh: mesh
        })
    ];
}