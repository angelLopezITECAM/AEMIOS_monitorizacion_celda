export function startRenderLoop(engine, scene) {
    const renderLoop = engine.runRenderLoop(() => {
        scene.render();
    });

    return {
        stop: () => {
            engine.stopRenderLoop(renderLoop);
        }
    };
}