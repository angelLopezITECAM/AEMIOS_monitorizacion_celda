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
        fontFamily = "Montserrat, system-ui, Avenir, Helvetica, Arial, sans-serif",
        data = {}
    } = options;

    // Crear un plano para la etiqueta
    const plane = BABYLON.MeshBuilder.CreatePlane("cardPlane", { width: 1.6, height: 1.7 }, scene);
    if (mesh) {
        plane.position.set(
            0,
            1,
            0
        )
    } else {
        plane.position.set(x, y, z)
    }

    const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(plane);

    advancedTexture.useInvalidateRectOptimization = false;
    advancedTexture.hasAlpha = true;

    // Contenedor principal que se ajustará automáticamente
    const rect = new GUI.Rectangle();
    rect.cornerRadius = 60;
    rect.background = backgroundColor;
    rect.alpha = 0.8;
    rect.thickness = 0;
    rect.shadowBlur = 0;
    rect.shadowOffsetX = 0;
    rect.shadowOffsetY = 0;
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
    stackPanel.thickness = 0;
    rect.addControl(stackPanel);

    const entries = Object.entries(data);

    entries.forEach(([key, value], index) => {
        if (key === 'Parte') {
            // Código para el título sin cambios...
            const textBlock = new GUI.TextBlock();
            textBlock.text = `${value}`;
            textBlock.color = color;
            textBlock.fontSize = fontSize;
            textBlock.fontFamily = fontFamily;
            textBlock.fontStyle = "bold";
            textBlock.height = "140px"; // Altura reducida
            textBlock.paddingTop = padding;
            textBlock.paddingBottom = padding;
            textBlock.paddingLeft = padding;
            textBlock.paddingRight = padding;
            textBlock.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            stackPanel.addControl(textBlock);
        } else {
            // Usar Grid en lugar de StackPanel para la fila
            const grid = new GUI.Grid();
            grid.addColumnDefinition(0.7); // 40% para la clave
            grid.addColumnDefinition(0.3); // 60% para el valor
            grid.height = "120px"; // Altura reducida

            // TextBlock para la key
            const keyTextBlock = new GUI.TextBlock();
            keyTextBlock.text = `${key}:`;
            keyTextBlock.color = color;
            keyTextBlock.fontSize = fontSize;
            keyTextBlock.fontFamily = fontFamily;
            keyTextBlock.fontStyle = "bold";
            keyTextBlock.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            grid.addControl(keyTextBlock, 0, 0); // Fila 0, columna 0

            // TextBlock para el valor
            const valueTextBlock = new GUI.TextBlock();
            valueTextBlock.text = `${value}`;
            valueTextBlock.color = color;
            valueTextBlock.fontSize = fontSize;
            valueTextBlock.fontFamily = fontFamily;
            valueTextBlock.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            valueTextBlock.paddingLeft = padding;
            grid.addControl(valueTextBlock, 0, 1); // Fila 0, columna 1

            stackPanel.addControl(grid);
        }
    });
    // Crear el texto
    rect.adaptWidthToChildren = true;
    rect.adaptHeightToChildren = true;


    // Hacer que la etiqueta siempre mire a la cámara
    plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

    // Obtener la cámara activa
    const camera = scene.activeCamera;

    // Variables para controlar el escalado
    const baseDistance = 5;  // Distancia base para escala 1.0
    const minScale = 0.5;    // Escala mínima
    const maxScale = 3.0;    // Escala máxima

    // Registrar función de escalado automático
    scene.registerBeforeRender(() => {
        if (camera) {
            // Calcular distancia entre la cámara y la tarjeta
            const distance = BABYLON.Vector3.Distance(camera.position, plane.position);

            // Calcular factor de escala basado en la distancia
            // Más lejos = más grande, más cerca = más pequeño
            let scaleFactor = distance / baseDistance;

            // Limitar el factor de escala entre min y max
            scaleFactor = Math.min(Math.max(scaleFactor, minScale), maxScale);

            // Aplicar escala a la tarjeta
            plane.scaling = new BABYLON.Vector3(scaleFactor, scaleFactor, 1);
        }
    });

    return { plane, rect, advancedTexture };
}