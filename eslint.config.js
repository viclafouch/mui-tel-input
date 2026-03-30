// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'
import {
  hooksConfig,
  importsConfig,
  jsxA11yConfig,
  prettierConfig,
  reactConfig,
  testingLibraryConfig,
  typescriptConfig
} from '@viclafouch/eslint-config-viclafouch'

/**
 * @type {import("eslint").Linter.Config}
 */
export default [
  { ignores: ['**/node_modules/**', '**/dist/**', '**/.docusaurus/**'] },
  ...typescriptConfig,
  ...reactConfig,
  ...hooksConfig,
  ...importsConfig,
  ...jsxA11yConfig,
  ...testingLibraryConfig,
  ...prettierConfig,
  {
    rules: {
      'unicorn/filename-case': 'off'
    }
  },
  {
    files: ['**/*.test.tsx', '**/*.test.ts', '**/testUtils/**'],
    rules: {
      'max-lines-per-function': 'off',
      'testing-library/no-node-access': 'off'
    }
  },
  ...storybook.configs['flat/recommended']
]
