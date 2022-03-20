const path = require('path')

module.exports = {
  stories: ['../src/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions'
  ],
  framework: '@storybook/react',
  webpackFinal: async (config, { configType }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@assets': path.resolve(__dirname, '../src/assets'),
      '@shared': path.resolve(__dirname, '../src/shared'),
      '@components': path.resolve(__dirname, '../src/components')
    }
    return config
  }
}
