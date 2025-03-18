import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';

export const createLabel = (scene, mesh, text, options = {}) => {
    // Valores predeterminados
    const {
        fontSize = 48,
        color = "black",
        backgroundColor = "white",
        padding = 0.5,
        x = 0,
        y = 0,
        z = 0,
        width = "200px",
        height = "100px"
    } = options;

    // Crear un plano para la etiqueta
    const plane = BABYLON.MeshBuilder.CreatePlane("labelPlane", { size: 0.5 }, scene);
    plane.position.set(x, y, z)

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

    // Crear el texto
    const textBlock = new GUI.TextBlock();
    textBlock.text = text;
    textBlock.color = color;
    textBlock.fontSize = fontSize;
    textBlock.paddingTop = padding;
    rect.addControl(textBlock);

    rect.adaptWidthToChildren = true;
    rect.adaptHeightToChildren = true;

    // Hacer que la etiqueta siempre mire a la cámara
    plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;


    return { plane, textBlock, rect, advancedTexture };
};