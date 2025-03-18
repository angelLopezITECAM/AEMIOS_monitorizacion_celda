import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';

export const createCard = (scene, mesh, options = {}) => {
    // Valores predeterminados optimizados
    const {
        fontSize = 28,  // Aumentado para mejor visibilidad
        titleFontSize = 36,  // Aumentado para mejor visibilidad
        color = "#000000",  // Negro sólido en lugar de "black"
        backgroundColor = "#ffffff",  // Blanco sólido en lugar de "white"
        titleColor = "#000000",
        padding = 30,  // Aumentado el padding
        x = 0,
        y = 0,
        z = 0,
        width = 1.5,
        minHeight = 0.9,
        title = "PRUEBA",
        showBorder = true,
        cornerRadius = 20,
        lineHeight = 2,  // Aumentado para más espacio entre líneas
        data = { "Ejemplo": "Datos de prueba" }  // Datos de ejemplo por defecto
    } = options;

    // Crear un plano para la tarjeta con dimensiones más generosas
    const plane = BABYLON.MeshBuilder.CreatePlane(
        `cardPlane_${Date.now()}`,
        { width, height: minHeight },
        scene
    );
    plane.position.set(x, y, z);
    plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

    // Crear textura con mayor resolución
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(
        plane,
        1024,
        768
    );
    advancedTexture.useInvalidateRectOptimization = false;

    // Fondo principal con colores contrastantes
    const background = new GUI.Rectangle("cardBackground");
    background.width = 1;
    background.height = 1;
    background.cornerRadius = cornerRadius;
    background.background = backgroundColor;
    background.alpha = 0.95;  // Más opaco para mejor visibilidad

    if (showBorder) {
        background.thickness = 3;  // Borde más grueso
        background.color = "#333333";  // Borde más oscuro
    } else {
        background.thickness = 0;
    }

    advancedTexture.addControl(background);

    // Panel principal 
    const mainPanel = new GUI.StackPanel("mainPanel");
    mainPanel.width = 0.95;
    mainPanel.height = 0.95;
    mainPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    background.addControl(mainPanel);

    // Título con mayor contraste
    if (title) {
        const titleBlock = new GUI.TextBlock("cardTitle");
        titleBlock.text = title;
        titleBlock.color = titleColor;
        titleBlock.fontSize = titleFontSize;
        titleBlock.height = `${titleFontSize * 2}px`;  // Más espacio para el título
        titleBlock.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        titleBlock.paddingTop = "20px";
        titleBlock.paddingBottom = "20px";
        titleBlock.fontWeight = "bold";
        mainPanel.addControl(titleBlock);

        // Línea separadora después del título
        const separator = new GUI.Rectangle("separator");
        separator.height = "2px";
        separator.background = "#cccccc";
        separator.width = 0.9;
        mainPanel.addControl(separator);
    }

    // Panel de contenido con más padding
    const contentPanel = new GUI.StackPanel("contentPanel");
    contentPanel.width = 1;
    contentPanel.paddingTop = padding;
    contentPanel.paddingBottom = padding;
    contentPanel.paddingLeft = padding;
    contentPanel.paddingRight = padding;
    contentPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    mainPanel.addControl(contentPanel);

    // Función para actualizar la card
    const updateData = (newData = {}) => {
        console.log("Actualizando datos de la tarjeta:", newData); // Debug
        contentPanel.clearControls();
        const entries = Object.entries(newData);

        if (entries.length === 0) {
            console.warn("No hay datos para mostrar en la tarjeta");
            return;
        }

        entries.forEach(([key, value], index) => {
            // Crear directamente un bloque de texto para cada par clave-valor
            const textBlock = new GUI.TextBlock(`textLine_${index}`);
            textBlock.text = `${key}: ${value}`;
            textBlock.color = color;
            textBlock.fontSize = fontSize;
            textBlock.height = `${fontSize * 1.5}px`;
            textBlock.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            textBlock.paddingBottom = "10px";

            // IMPORTANTE: Añadir directamente al panel de contenido
            contentPanel.addControl(textBlock);

            // Debug para verificar la creación
            console.log(`Añadido elemento ${index}: ${key}: ${value}`);
        });
        // Ajustar altura con un pequeño retraso
        setTimeout(() => {
            // Cálculos de altura ajustados
            const titleHeight = title ? titleFontSize * 2 + 22 : 0; // +2px para el separador
            const contentHeight = entries.length * fontSize * lineHeight;
            const totalPaddingHeight = padding * 2 + (entries.length * 5); // Padding extra entre filas

            const totalHeight = titleHeight + contentHeight + totalPaddingHeight;
            const pixelToUnits = minHeight / 2048; // Ajustado por la resolución mayor
            const heightUnits = Math.max(minHeight, totalHeight * pixelToUnits * 1.5); // Factor más generoso

            // Ajustar la escala Y del plano
            const aspectRatio = heightUnits / width;
            plane.scaling.y = aspectRatio * plane.scaling.x;

            advancedTexture.update(true);
            console.log("Altura ajustada:", aspectRatio);
        }, 100); // Tiempo de espera más largo
    };

    // Cargar los datos iniciales
    console.log("Datos iniciales:", data);
    updateData(data);

    return {
        plane,
        background,
        contentPanel,
        advancedTexture,
        updateData
    };
};