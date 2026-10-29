import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// `vite build --mode lib`: the component library (dist/, React left out).
// Plain `vite build`: the demo page (dist-demo/, served by the container).
export default defineConfig(({ mode }) =>
  mode === 'lib'
    ? {
        plugins: [react()],
        build: {
          emptyOutDir: false, // keep the .d.ts files tsc wrote in dist/types
          lib: {
            entry: resolve(import.meta.dirname, 'src/index.ts'),
            formats: ['es'],
            fileName: 'bonobo-ui',
            cssFileName: 'styles',
          },
          rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime'] },
        },
      }
    : {
        plugins: [react()],
        base: './',
        build: { outDir: 'dist-demo' },
      },
)
