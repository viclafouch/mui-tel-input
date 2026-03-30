import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'
import { configDefaults, defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import pkg from './package.json' with { type: 'json' }

const external = [
  ...Object.keys(pkg.peerDependencies ?? {}),
  'react/jsx-runtime',
  /^@mui\/material\//
]

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: [...configDefaults.exclude, '**/dist/**']
  },
  resolve: {
    alias: {
      '@assets': resolve(import.meta.dirname, './src/assets'),
      '@shared': resolve(import.meta.dirname, './src/shared'),
      '@components': resolve(import.meta.dirname, './src/components')
    }
  },
  build: {
    target: 'esnext',
    minify: true,
    lib: {
      formats: ['es'],
      entry: resolve(import.meta.dirname, 'src/index.tsx'),
      name: 'Mui-tel-input',
      fileName: (format) => {
        return `mui-tel-input.${format}.js`
      }
    },
    rolldownOptions: {
      output: {
        sourcemapExcludeSources: true
      },
      external
    }
  },
  plugins: [
    react(),
    dts({ exclude: ['/**/*.stories.tsx', '/**/*.test.tsx'], rollupTypes: true })
  ]
})
