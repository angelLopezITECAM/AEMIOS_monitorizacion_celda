import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';

export function createCard(scene, mesh, options = {}) {

    const {
        fontSize = 64,
        color = "black",
        backgroundColor = "white",
        padding = 10,
        x = 0,
        y = 0,
        z = 0,
        width = "200px",
        height = "100px",

        data = {}
    } = options;

    // Crear un plano para la etiqueta
    const plane = BABYLON.MeshBuilder.CreatePlane("cardPlane", { width: 1.6, height: 1.7 }, scene);
    if (mesh) {
        plane.position.set(
            0,
            0.8,
            1
        )
    } else {
        plane.position.set(x, y, z)
    }

    const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(plane);

    advancedTexture.useInvalidateRectOptimization = false;

    // Contenedor principal que se ajustará automáticamente
    const rect = new GUI.Rectangle();
    rect.cornerRadius = 60;
    rect.background = backgroundColor;
    rect.alpha = 0.8;
    rect.thickness = 0;
    rect.width = width;
    rect.height = height;
    advancedTexture.addControl(rect);


    const stackPanel = new GUI.StackPanel();
    stackPanel.width = 1;
    stackPanel.paddingTop = padding;
    stackPanel.paddingBottom = padding;
    stackPanel.paddingLeft = padding;
    stackPanel.paddingRight = padding;
    stackPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    rect.addControl(stackPanel);

    const entries = Object.entries(data);

    entries.forEach(([key, value], index) => {

        const textBlock = new GUI.TextBlock();
        textBlock.text = `${key}: ${value}`;
        textBlock.color = color;
        textBlock.fontSize = fontSize;
        textBlock.height = "125px";
        textBlock.paddingTop = padding;
        textBlock.paddingBottom = padding;
        textBlock.paddingLeft = padding;
        textBlock.paddingRight = padding;

        textBlock.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        stackPanel.addControl(textBlock);
    })
    // Crear el texto
    rect.adaptWidthToChildren = true;
    rect.adaptHeightToChildren = true;


    // Hacer que la etiqueta siempre mire a la cámara
    plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

    return { plane, rect, advancedTexture };
}