'use client';
import * as THREE from 'three';
import { WebGLExperiment, type CreateRenderer } from './WebGLExperiment';
const create: CreateRenderer = (canvas) => {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#032C68');
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 3, 8);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.AmbientLight('#ffffff', 2));
  const light = new THREE.DirectionalLight('#ffffff', 3);
  light.position.set(3, 5, 4);
  scene.add(light);
  const planet = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1, 1),
    new THREE.MeshStandardMaterial({ color: '#13A89E', flatShading: true, roughness: 1 }),
  );
  scene.add(planet);
  const orbit = new THREE.Group();
  scene.add(orbit);
  const points = Array.from({ length: 129 }, (_, i) => {
    const a = (i / 128) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a) * 2.2, 0, Math.sin(a) * 2.2);
  });
  orbit.add(
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: '#8ca9d3' }),
    ),
  );
  const satellite = new THREE.Group();
  orbit.add(satellite);
  satellite.add(
    new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.25, 0.25),
      new THREE.MeshStandardMaterial({ color: '#F7B817' }),
    ),
  );
  [-1, 1].forEach((side) => {
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.05, 0.28),
      new THREE.MeshStandardMaterial({ color: '#24BCE2' }),
    );
    panel.position.x = side * 0.36;
    satellite.add(panel);
  });
  const reference = new THREE.GridHelper(6, 12, '#365c8e', '#244c80');
  reference.position.y = -1.25;
  scene.add(reference);
  return {
    draw(angle, time) {
      orbit.rotation.z = (angle * Math.PI) / 180;
      satellite.position.set(Math.cos(time * 0.6) * 2.2, 0, Math.sin(time * 0.6) * 2.2);
      satellite.rotation.y = -time * 0.6;
      planet.rotation.y = time * 0.1;
      renderer.render(scene, camera);
    },
    resize() {
      const { width, height } = canvas.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    },
    dispose() {
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
    },
  };
};
export default function OrbitLab() {
  return <WebGLExperiment create={create} kind="orbit" />;
}
