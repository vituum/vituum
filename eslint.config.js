import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'

export default defineConfig([
  {
    plugins: { js },
    extends: [
      'js/recommended',
      stylistic.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    ignores: ['playground', '**/dist/**', 'examples/**/src', '**/*.d.ts'],
  },
])
