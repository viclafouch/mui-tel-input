import { themes } from 'prism-react-renderer'
import type * as Preset from '@docusaurus/preset-classic'
import type { Config } from '@docusaurus/types'

const config = {
  title: 'MUI tel input',
  tagline:
    'A phone number input designed for the React library MUI built with libphonenumber-js',
  url: 'https://viclafouch.github.io',
  baseUrl: '/mui-tel-input/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'viclafouch', // Usually your GitHub org/user name.
  projectName: 'mui-tel-input', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  trailingSlash: true,

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html gitlang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },

  presets: [
    [
      'classic',
      {
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        },
        docs: {
          sidebarPath: require.resolve('./sidebars.js')
        },
        gtag: {
          trackingID: 'G-EYM50LZ40L'
        }
      } satisfies Preset.Options
    ]
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false
    },
    navbar: {
      title: 'MUI tel input',
      logo: {
        alt: 'MUI tel input',
        src: 'img/logo.svg'
      },
      items: [
        {
          type: 'doc',
          docId: 'getting-started',
          position: 'left',
          label: 'Documentation'
        },
        {
          href: 'https://github.com/viclafouch/mui-tel-input',
          label: 'GitHub',
          position: 'right'
        },
        {
          href: 'https://www.npmjs.com/package/mui-tel-input',
          label: 'NPM',
          position: 'right'
        }
      ]
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} by Victor de la Fouchardiere`
    },
    prism: {
      theme: themes.github,
      darkTheme: themes.dracula
    }
  }
} satisfies Config

module.exports = config
