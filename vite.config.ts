import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

const isBuildLib = () => {
  return process.env.BUILD_TYPE === 'lib'
}

const outDir = isBuildLib() ? 'dist' : 'example'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/vue-autotooltip/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./src', import.meta.url)),
      '~~': fileURLToPath(new URL('./', import.meta.url)),
      '@@': fileURLToPath(new URL('./', import.meta.url))
    }
  },
  build: isBuildLib()
    ? {
        outDir,
        target: 'es2015',
        lib: {
          // Could also be a dictionary or array of multiple entry points
          entry: resolve(__dirname, 'src/lib/main.ts'),
          name: 'VueAutotooltip',
          // the proper extensions will be added
          fileName: 'vue-autotooltip',
          formats: ['es', 'cjs']
        },
        rollupOptions: {
          external: ['vue', '@floating-ui/dom', 'fourdom']
        },
        copyPublicDir: false
      }
    : { outDir }
})
