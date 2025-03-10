import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';

export function addNavigationControls(scene, camera, advancedTexture) {
    const panel = new GUI.StackPanel();
    panel.width = "150px";
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    panel.top = "20px";
    panel.right = "20px";
    advancedTexture.addControl(panel);

    const header = new GUI.TextBlock();
    header.text = "CONTROLES";
    header.height = "30px";
    header.color = "white";
    header.fontSize = 18;
    panel.addControl(header);

    const resetButton = GUI.Button.CreateSimpleButton("resetBtn", "Reset Vista");
    resetButton.width = "140px";
    resetButton.height = "30px";
    resetButton.color = "white";
    resetButton.background = "#3c8dbc";
    resetButton.cornerRadius = 5;
    resetButton.onPointerUpObservable.add(() => {
        // Restablecer vista
        BABYLON.Animation.CreateAndStartAnimation(
            "resetAlpha", camera, "alpha", 30, 60,
            camera.alpha, Math.PI / 2, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
    });
    panel.addControl(resetButton);

    return panel;
}