import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  root: resolve(__dirname, './demos'),
  build: {
    outDir : resolve(__dirname, './dist'),
    rollupOptions: {
      input: {
        bouncy: resolve(__dirname, 'demos/bouncy.html'),
        cloth: resolve(__dirname, 'demos/cloth.html'),
        pendulum: resolve(__dirname, 'demos/pendulum.html'),
        arboretum: resolve(__dirname, 'demos/arboretum.html'),
      }
    }
  }
})
