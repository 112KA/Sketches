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
        // 'gpgpu-trails': resolve('src/gpgpu-trails', 'index.html'),
        // grass: resolve('src/grass', 'index.html'),
        // gradation: resolve('src/gradation', 'index.html'),
        // instanced_skinned_mesh: resolve('src/instanced_skinned_mesh', 'index.html'),
        // sample1: resolve('src/sample1', 'index.html'),
        // sample2: resolve('src/sample2', 'index.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          } else if (id.includes('/x/')) {
            return 'x'
          } else if (id.includes('/x3/')) {
            return 'x3'
          } else {
            console.log(id)
          }
        },
      },
    },
  },
  plugins: [glslify()],
  assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.frag'],
  resolve: {
    alias: {
      x: resolve(__dirname, '../../packages/x/src'),
      x3: resolve(__dirname, '../../packages/x3/src'),
    },
  },
})
