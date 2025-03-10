export function setupAdaptiveUI(scene, camera, panel, text, labels) {
    // Configuración base para tamaño adaptativo
    const baseFontSize = 20;
    const baseDistance = 8;
    const baseWidth = 200;
    const baseHeight = 100;

    // Variables para animación suave
    let currentFontSize = baseFontSize;
    let currentWidth = baseWidth;
    let currentHeight = baseHeight;
    let currentOffsetX = 200;
    let currentOffsetY = -100;

    // Factor de suavizado (menor = más suave)
    const smoothingFactor = 0.1;

    // Registrar función para actualizar en cada frame
    scene.registerBeforeRender(() => {
        // Calcular factor de escala basado en distancia
        const currentDistance = camera.radius;
        const zoomRatio = baseDistance / currentDistance;
        const scaleFactor = Math.max(0.5, Math.min(zoomRatio, 2.5));

        // Interpolar valores para animación suave
        currentFontSize += (baseFontSize * scaleFactor - currentFontSize) * smoothingFactor;
        currentWidth += (baseWidth * scaleFactor - currentWidth) * smoothingFactor;
        currentHeight += (baseHeight * scaleFactor - currentHeight) * smoothingFactor;
        currentOffsetX += (200 * scaleFactor - currentOffsetX) * smoothingFactor;
        currentOffsetY += (-100 * scaleFactor - currentOffsetY) * smoothingFactor;

        // Actualizar propiedades UI
        text.fontSize = currentFontSize;
        panel.width = `${currentWidth}px`;
        panel.height = `${currentHeight}px`;
        panel.linkOffsetX = currentOffsetX;
        panel.linkOffsetY = currentOffsetY;

        // Actualizar visibilidad de etiquetas según distancia
        updateLabelVisibility(labels, currentDistance);
    });
}

function updateLabelVisibility(labels, distance) {
    if (!labels || labels.length === 0) return;

    labels.forEach(label => {
        if (label.detail === "low" && distance > 15) {
            label.panel.isVisible = true;
        } else if (label.detail === "medium" && distance > 8 && distance <= 15) {
            label.panel.isVisible = true;
        } else if (label.detail === "high" && distance <= 8) {
            label.panel.isVisible = true;
        } else {
            label.panel.isVisible = false;
        }
    });
}