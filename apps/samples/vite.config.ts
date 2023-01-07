import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  root: resolve(__dirname, 'src'),
  base: '/samples/',
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        'gpgpu-trails': resolve('src/gpgpu-trails', 'index.html'),
        // sample1: resolve('src/sample1', 'index.html'),
        // sample2: resolve('src/sample2', 'index.html'),
      },
    },
  },
})
