import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // react-is is included in React 19 but recharts still imports it by name.
      // Alias it to the copy bundled with react-dom.
      'react-is': 'react-dom',
    },
  },
  optimizeDeps: {
    // MapLibre GL bundles its own web worker internally — excluding it from
    // Vite's pre-bundler prevents the "maplibre-gl-worker.mjs does not exist" error.
    exclude: ['maplibre-gl'],
  },
  build: {
    rolldownOptions: {
      // Suppress large-chunk warning for the bundled vendor code
      onwarn(warning, warn) {
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        warn(warning);
      },
    },
    chunkSizeWarningLimit: 1800,
  },
})

