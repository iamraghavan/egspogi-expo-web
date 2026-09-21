'use client';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { CreateBox } from '@babylonjs/core/Meshes/Builders/boxBuilder';
import { CreateLines } from '@babylonjs/core/Meshes/Builders/linesBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { WebGLExperiment, type CreateRenderer } from './WebGLExperiment';
const create: CreateRenderer = (canvas) => {
  const engine = new Engine(canvas, true, { preserveDrawingBuffer: false, stencil: false });
  engine.setHardwareScalingLevel(1 / Math.min(window.devicePixelRatio, 1.5));
  const scene = new Scene(engine);
  scene.clearColor = new Color4(3 / 255, 44 / 255, 104 / 255, 1);
  const camera = new FreeCamera('view', new Vector3(0, 2.3, -8), scene);
  camera.setTarget(Vector3.Zero());
  new HemisphericLight('light', new Vector3(0, 1, -1), scene);
  const wing = CreateBox('wing', { width: 2.3, height: 0.18, depth: 1.1 }, scene);
  const material = new StandardMaterial('coral', scene);
  material.diffuseColor = Color3.FromHexString('#F45B4F');
  material.specularColor = Color3.Black();
  wing.material = material;
  const streams = Array.from({ length: 7 }, (_, row) => {
    const points = Array.from(
      { length: 41 },
      (_, i) => new Vector3(-4 + i / 5, (row - 3) * 0.4, -0.65),
    );
    const line = CreateLines(`stream-${row}`, { points, updatable: true }, scene);
    line.color = Color3.FromHexString(row % 2 ? '#24BCE2' : '#FFF8E8');
    return { line, points, row };
  });
  const particles = Array.from({ length: 12 }, (_, i) => {
    const particle = CreateBox(`air-${i}`, { width: 0.09, height: 0.06, depth: 0.06 }, scene);
    const paint = new StandardMaterial(`air-paint-${i}`, scene);
    paint.emissiveColor = Color3.FromHexString('#F7B817');
    particle.material = paint;
    return particle;
  });
  return {
    draw(angle, time) {
      wing.rotation.z = (angle * Math.PI) / 180;
      for (const { line, points, row } of streams) {
        points.forEach((point) => {
          const bend = Math.exp((-point.x * point.x) / 1.4);
          point.y = (row - 3) * 0.4 + bend * ((row >= 3 ? 0.33 : -0.33) + angle / 100);
        });
        CreateLines(line.name, { points, instance: line });
      }
      particles.forEach((particle, i) => {
        const x = ((time * 1.1 + i * 0.73) % 8) - 4;
        const row = i % 7;
        particle.position.set(
          x,
          (row - 3) * 0.4 + Math.exp((-x * x) / 1.4) * ((row >= 3 ? 0.33 : -0.33) + angle / 100),
          -0.65,
        );
      });
      scene.render();
    },
    resize() {
      engine.resize();
    },
    dispose() {
      scene.dispose();
      engine.dispose();
    },
  };
};
export default function AeroLab() {
  return <WebGLExperiment create={create} kind="aero" />;
}
