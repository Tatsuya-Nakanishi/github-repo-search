import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import nextPlugin from '@next/eslint-plugin-next'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    ignores: ['node_modules/**', '.next/**', 'dist/**', 'src/components/ui/', 'tailwind.config.ts']
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@next': nextPlugin
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
]
