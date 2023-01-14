import { resolve } from 'path'
import { defineConfig } from 'vite'
import { glslify } from 'vite-plugin-glslify'

export default defineConfig({
  root: resolve(__dirname, 'src'),
  base: '/sketches/',
  build: {
    outDir: resolve(__dirname, 'dist/sketches'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        'gpgpu-particle-bravo': resolve('src/gpgpu-particle-bravo', 'index.html'),
        'gpgpu-trails': resolve('src/gpgpu-trails', 'index.html'),
        // sample1: resolve('src/sample1', 'index.html'),
        // sample2: resolve('src/sample2', 'index.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          } else if (id.includes('/x/')) {
            return 'x'
          } else {
            console.log(id)
          }
        },
      },
    },
  },
  plugins: [glslify()],
  assetsInclude: ['**/*.gltf', '**/*.frag'],
  resolve: {
    alias: {
      x: resolve(__dirname, '../../packages/x/src'),
    },
  },
})
