import * as GUI from '@babylonjs/gui';
import { AdvancedDynamicTexture } from "@babylonjs/gui";
export function createLabel({ name, textContent, detailLevel, advancedTexture, targetMesh }) {
    const labelPanel = new GUI.Rectangle(name + "Panel");
    labelPanel.width = "200px";
    labelPanel.height = "100px";
    labelPanel.cornerRadius = 20;
    labelPanel.color = "white";
    labelPanel.thickness = 2;
    labelPanel.background = "rgba(0, 0, 0, 0.7)";
    advancedTexture.addControl(labelPanel);

    const labelText = new GUI.TextBlock(name + "Text");
    labelText.text = textContent;
    labelText.color = "white";
    labelText.fontSize = 20;
    labelPanel.addControl(labelText);

    // Vincular con el mesh solo si se proporcionó uno
    if (targetMesh) {
        labelPanel.linkWithMesh(targetMesh);
        labelPanel.linkOffsetX = 200;
        labelPanel.linkOffsetY = -100;
    }

    return { panel: labelPanel, text: labelText, detail: detailLevel };
}