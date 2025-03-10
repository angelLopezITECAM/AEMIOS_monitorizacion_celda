import * as BABYLON from '@babylonjs/core';

export function loadCeldaModel(scene, modelPath) {
    // Mostrar indicador de carga
    /* const loadingUI = createLoadingUI(); */

    return new Promise((resolve, reject) => {
        BABYLON.SceneLoader.ImportMeshAsync("", modelPath, "", scene)
            .then(result => {
                // Procesar el modelo cargado
                const rootMesh = result.meshes[0];

                // Aplicar materiales o transformaciones si es necesario
                // rootMesh.scaling = new BABYLON.Vector3(1.2, 1.2, 1.2);

                // Eliminar UI de carga
                /* removeLoadingUI(loadingUI); */

                resolve(rootMesh);
            })
            .catch(error => {
                console.error("Error cargando el modelo:", error);
                /* removeLoadingUI(loadingUI); */
                reject(error);
            });
    });
}

function createLoadingUI() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'modelLoadingUI';
    loadingDiv.style.position = 'absolute';
    loadingDiv.style.top = '50%';
    loadingDiv.style.left = '50%';
    loadingDiv.style.transform = 'translate(-50%, -50%)';
    loadingDiv.style.padding = '20px';
    loadingDiv.style.background = 'rgba(0,0,0,0.7)';
    loadingDiv.style.borderRadius = '5px';
    loadingDiv.style.color = 'white';
    loadingDiv.style.zIndex = '100';
    loadingDiv.innerText = 'Cargando modelo...';
    document.body.appendChild(loadingDiv);
    return loadingDiv;
}

function removeLoadingUI(loadingDiv) {
    if (loadingDiv && loadingDiv.parentNode) {
        loadingDiv.parentNode.removeChild(loadingDiv);
    }
}