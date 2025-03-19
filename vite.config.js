import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        app: resolve(__dirname, 'app.html'),
        privacyPolicy: resolve(__dirname, 'privacy-policy.html'),
        termsOfService: resolve(__dirname, 'terms-of-service.html'),

        indexJs: resolve(__dirname, 'src/scripts/index.js'),
        appJs: resolve(__dirname, 'src/scripts/app.js'),
        tosJs: resolve(__dirname, 'src/scripts/tos.js')
      }
    },
  }
})