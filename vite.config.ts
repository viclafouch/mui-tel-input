import { resolve } from 'node:path'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true
  },
  resolve: {
    alias: {
      '@assets': resolve(__dirname, './src/assets'),
      '@shared': resolve(__dirname, './src/shared'),
      '@components': resolve(__dirname, './src/components')
    }
  },
  build: {
    target: 'esnext',
    minify: true,
    lib: {
      formats: ['es'],
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'Mui-tel-input',
      fileName: (format) => {
        return `mui-tel-input.${format}.js`
      }
    },
    rollupOptions: {
      output: {
        sourcemapExcludeSources: true,
        globals: {
          react: 'React',
          '@mui/material/InputAdornment': 'InputAdornment',
          '@mui/material/TextField': 'TextField',
          '@mui/material/IconButton': 'IconButton',
          '@mui/material/styles': 'styles',
          'react/jsx-runtime': 'jsxRuntime',
          '@mui/material/Menu': 'Menu',
          '@mui/material/MenuItem': 'MenuItem',
          '@mui/material/Typography': 'Typography',
          '@mui/material/ListItemIcon': 'ListItemIcon',
          '@mui/material/ListItemText': 'ListItemText',
          '@mui/material/colors': 'colors'
        }
      }
    }
  },
  plugins: [
    peerDepsExternal(),
    react(),
    dts({ exclude: ['/**/*.stories.tsx', '/**/*.test.tsx'], rollupTypes: true })
  ]
})
