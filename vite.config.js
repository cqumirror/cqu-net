import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

import { GUIDE_DIRECTORY, findGuidePdf, findGuideSource } from './src/guide-source.js';

function resolveAssets(config) {
  const directory = resolve(config.root, 'public', GUIDE_DIRECTORY);
  const filenames = readdirSync(directory);

  const guide = findGuideSource(filenames);
  const pdf = findGuidePdf(filenames, guide.filename.replace(/\.md$/, ''));

  const payload = { path: guide.publicPath };
  if (pdf) payload.pdf = pdf.publicPath;
  return payload;
}

function guideSourcePlugin() {
  let config;

  return {
    name: 'guide-source',
    configResolved(resolved) {
      config = resolved;
    },
    configureServer(server) {
      server.middlewares.use('/guide-source.json', (_request, response) => {
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.end(JSON.stringify(resolveAssets(config)));
      });
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'guide-source.json',
        source: JSON.stringify(resolveAssets(config)),
      });
    },
  };
}

export default defineConfig({
  plugins: [guideSourcePlugin()],
});
