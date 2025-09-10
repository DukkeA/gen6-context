import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx']
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Gen6Context',
      formats: ['es', 'cjs'],
      fileName: (format) => `gen6-context.${format}.js`
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@polkadot/api',
        '@polkadot/extension-dapp',
        '@polkadot/ui-keyring',
        '@polkadot/util',
        '@polkadot/types'
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@polkadot/api': 'PolkadotApi',
          '@polkadot/extension-dapp': 'PolkadotExtensionDapp',
          '@polkadot/ui-keyring': 'PolkadotKeyring',
          '@polkadot/util': 'PolkadotUtil',
          '@polkadot/types': 'PolkadotTypes'
        }
      }
    }
  }
})