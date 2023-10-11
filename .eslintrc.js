module.exports = {
  extends: [
    '@viclafouch/eslint-config-viclafouch',
    '@viclafouch/eslint-config-viclafouch/react',
    '@viclafouch/eslint-config-viclafouch/hooks',
    '@viclafouch/eslint-config-viclafouch/typescript',
    '@viclafouch/eslint-config-viclafouch/prettier'
  ],
  parserOptions: {
    project: ['./tsconfig.json', './docs/tsconfig.json']
  },
  rules: {
    // inputProps / InputProps
    'react/jsx-no-duplicate-props': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '.storybook/**',
          'stories/**',
          '**/*.stories.tsx',
          '**/*.test.ts',
          '**/*.test.tsx'
        ]
      }
    ]
  }
}
