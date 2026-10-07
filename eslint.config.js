const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettier = require('eslint-plugin-prettier/recommended');

const FEATURES = ['@/features/*', '@/features/**'];
const APP = ['@/app', '@/app/**'];

module.exports = defineConfig([
  expoConfig,
  prettier,
  { ignores: ['dist/*', '.expo/*', 'src/design-system/generated/*', 'expo-env.d.ts'] },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'import/no-unresolved': 'off',
      'import/namespace': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      'react/jsx-no-bind': ['error', { allowArrowFunctions: false, allowFunctions: false }],
    },
  },
  {
    files: ['.github/actions/**/*.mjs'],
    rules: { 'import/no-unresolved': 'off' },
  },
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/*'],
              message: 'Import other features through their index (@/features/<name>).',
            },
            { group: APP, message: 'Features must not depend on routes.' },
          ],
        },
      ],
    },
  },
  {
    files: [
      'src/shared/**/*.{ts,tsx}',
      'src/design-system/**/*.{ts,tsx}',
      'src/config/**/*.{ts,tsx}',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [...FEATURES, ...APP],
              message: 'shared/design-system/config cannot depend on features or routes.',
            },
          ],
        },
      ],
    },
  },
]);
