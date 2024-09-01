const { loadConfigFromFile, mergeConfig } = require('vite')
const path = require('path');

module.exports = {
  stories: ['../src/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],

  framework: {
    name: '@storybook/react-vite',
    options: {}
  },

  async viteFinal(config) {
    const { config: userConfig } = await loadConfigFromFile(
      path.resolve(__dirname, '../vite.config.ts')
    )

    return mergeConfig(config, {
      ...userConfig,
      plugins: []
    })
  },

  docs: {},

  typescript: {
    reactDocgen: 'react-docgen-typescript'
  }
};