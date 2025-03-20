
import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import { WaterMaterial } from "@babylonjs/materials/water";
import { FluidRenderer } from '@babylonjs/core';

export function createWater(scene, options = {}) {

    const {
        x = 0,
        y = 0,
        z = 0,
        flowSpeed = 0.1,
        isActive = true,
        caudal = 20,
        direction = "rightToLeft",
        name = "waterMaterial",
        nameCilindro = "switchCylinder",
        waterColor = new BABYLON.Color3(0.1, 0.3, 0.6)
    } = options;


    const switchCylinder = BABYLON.MeshBuilder.CreateCylinder(nameCilindro, { height: 0.05, diameter: 0.2, tessellation: 64 }, scene);
    switchCylinder.position = new BABYLON.Vector3(x, y, z);
    switchCylinder.rotation.z = Math.PI / 2;
    /* switchCylinder.billboardMode = BABYLON.Mesh.BILLBOARDMODE_NONE; */

    const waterMaterial = new WaterMaterial(name, scene);
    const bumpTexture = new BABYLON.Texture("https://assets.babylonjs.com/textures/waterbump.png", scene);
    waterMaterial.bumpTexture = bumpTexture
    waterMaterial.waveHeight = 0.05;
    waterMaterial.bumpHeight = 0.15;
    waterMaterial.windForce = -5;
    waterMaterial.waterColor = waterColor;
    waterMaterial.colorBlendFactor = 0.5;
    waterMaterial.waveSpeed = new BABYLON.Vector2(-flowSpeed, 0);

    waterMaterial.reflectionFresnel = true;
    waterMaterial.reflectionAmount = 0.3;
    waterMaterial.refractionFresnel = true;
    waterMaterial.refractionAmount = 0.7;

    waterMaterial.reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -1, 0, 0);

    const useGPU = true;
    const renderAsFluid = false;
    const numParticles = caudal;
    const numParticlesEmitRate = 100 * numParticles;

    const particleSystem = new BABYLON.ParticleSystem("particles", numParticles, scene);
    /* particleSystem.particleTexture = new BABYLON.Texture("https://assets.babylonjs.com/textures/Flare2.png", scene); */
    particleSystem.particleTexture = new BABYLON.Texture("img/Flare2.png", scene);
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
    particleSystem.particleTexture.hasAlpha = true;
    particleSystem.particleTexture.getAlphaFromRGB = true;

    console.log(BABYLON.ParticleSystem.BLENDMODE_STANDARD)
    const emitter = particleSystem.createConeEmitter(0.25, Math.PI / 4);

    switchCylinder.rotation.y = Math.PI / 2;
    emitter.direction1 = new BABYLON.Vector3(1, 0, 0);
    emitter.direction2 = new BABYLON.Vector3(1, 0, 0);

    if (direction === "leftToRight") {
        switchCylinder.rotation.z = -Math.PI / 2;
    }

    particleSystem.emitter = switchCylinder;

    const colorParticle = new BABYLON.Color4(
        waterColor.r,
        waterColor.g,
        waterColor.b,
        1.0);
    particleSystem.color1 = colorParticle;
    particleSystem.color2 = colorParticle;
    particleSystem.colorDead = new BABYLON.Color4(
        waterColor.r,
        waterColor.g,
        waterColor.b,
        0.0);

    particleSystem.minSize = 0.08;
    particleSystem.maxSize = 0.15;

    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 0.5;

    particleSystem.emitRate = numParticlesEmitRate;

    particleSystem.gravity = new BABYLON.Vector3(0, -0.5, 0);

    particleSystem.minEmitPower = 0.1;
    particleSystem.maxEmitPower = 0.2;
    particleSystem.updateSpeed = 0.02;

    particleSystem.preWarmCycles = 60 * 8;

    if (isActive) {
        particleSystem.start();
    }

    particleSystem.render();
    particleSystem.renderAsFluid = renderAsFluid;



    switchCylinder.material = waterMaterial;

    const setFlowState = (isOn) => {
        if (isOn) {
            waterMaterial.waveSpeed = new BABYLON.Vector2(-flowSpeed, 0);
            particleSystem.start();
        } else {
            waterMaterial.waveSpeed = new BABYLON.Vector2(0, 0);
            particleSystem.stop();
        }
    }

    const setCaudal = (value) => {
        const newEmitRate = value * 100;
        particleSystem.emitRate = newEmitRate
    }

    return {
        cylinder: switchCylinder,
        particleSystem: particleSystem,
        setFlowState: setFlowState,
        setCaudal: setCaudal
    }


}