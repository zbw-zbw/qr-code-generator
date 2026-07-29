import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './src/manifest.json'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    crx({ manifest })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173
    },
    // @crxjs 开发模式下扩展以 chrome-extension:// 源访问 dev server，
    // 仅放行扩展协议来源，不使用通配 *
    cors: {
      origin: [/^chrome-extension:\/\//]
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  build: {
    minify: mode === 'production' ? 'terser' : false,
    sourcemap: mode !== 'production',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production'
      }
    }
  }
})) 
 