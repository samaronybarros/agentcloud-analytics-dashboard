import nextConfig from 'eslint-config-next';

const config = [
  ...nextConfig,
  {
    files: ['tests/**/*.ts', 'tests/**/*.tsx'],
    rules: {
      'react/display-name': 'off',
    },
  },
  {
    ignores: ['.next/', 'node_modules/', 'jest.config.js'],
  },
];

export default config;
