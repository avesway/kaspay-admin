import js from '@eslint/js'
import reactPlugin from 'eslint-plugin-react'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'

export default [
  js.configs.recommended,

  {
    files: ['**/*.{js,jsx,ts,tsx}'],

    languageOptions: {
      ecmaVersion: 'latest',

      sourceType: 'module',

      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    plugins: {
      react: reactPlugin,
      'simple-import-sort': simpleImportSort,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'no-unused-vars': 'off',

      // включаем React-вариант
      'react/jsx-uses-vars': 'error',

      // React 17+ / Vite / Expo
      'react/react-in-jsx-scope': 'off',

      // сортировка импортов
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react$', '^react-native$', '^@?\\w'],

            ['^@/'],

            ['^\\./', '^\\.\\./'],
          ],
        },
      ],

      'simple-import-sort/exports': 'error',
    },
  },
]