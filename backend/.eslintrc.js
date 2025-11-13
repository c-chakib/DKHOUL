module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  env: {
    node: true,
    es6: true,
  },
  overrides: [
    {
      files: ['src/__tests__/**/*.ts'],
      parserOptions: {
        project: null, // Disable project requirement for test files
      },
      env: {
        jest: true,
      },
    },
  ],
  ignorePatterns: ['dist/', 'node_modules/', 'logs/', 'uploads/'],
};