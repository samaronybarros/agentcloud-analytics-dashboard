import nextConfig from 'eslint-config-next';

const config = [
  ...nextConfig,
  {
    files: ['__tests__/**/*.ts', '__tests__/**/*.tsx'],
    rules: {
      'react/display-name': 'off',
    },
  },
  {
    ignores: ['.next/', 'node_modules/', 'jest.config.js', 'coverage/'],
  },
];

export default config;
