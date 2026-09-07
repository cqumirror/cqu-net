import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

import { findGuideSource } from './src/guide-source.js';

function versionedGuidePlugin() {
  let rootDirectory;
  let guide;

  function resolveGuide() {
    guide = findGuideSource(readdirSync(rootDirectory));
    return guide;
  }

  return {
    name: 'versioned-guide-source',
    configResolved(config) {
      rootDirectory = config.root;
      resolveGuide();
    },
    configureServer(server) {
      server.middlewares.use('/guide-source.json', (_request, response) => {
        const source = resolveGuide();
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.end(JSON.stringify({ path: source.publicPath }));
      });
    },
    generateBundle() {
      const source = resolveGuide();
      this.emitFile({
        type: 'asset',
        fileName: source.filename,
        source: readFileSync(resolve(rootDirectory, source.filename)),
      });
      this.emitFile({
        type: 'asset',
        fileName: 'guide-source.json',
        source: JSON.stringify({ path: source.publicPath }),
      });
    },
  };
}

export default defineConfig({
  plugins: [versionedGuidePlugin()],
});
