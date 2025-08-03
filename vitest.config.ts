import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // Node environment pour les tests de logique pure
    include: ['tests/unit/**/*.test.ts'], // Seulement les tests unitaires
    exclude: ['tests/**/*.spec.ts'], // Exclure les tests Playwright
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})