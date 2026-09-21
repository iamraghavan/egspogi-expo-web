import { mkdirSync, copyFileSync } from 'node:fs';
mkdirSync('public/map-assets', { recursive: true });
for (const file of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs'])
  copyFileSync(`node_modules/maplibre-gl/dist/${file}`, `public/map-assets/${file}`);
console.log('MapLibre worker assets prepared locally.');
