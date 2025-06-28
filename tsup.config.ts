import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  treeshake: true,
  external: [],
  outDir: 'dist',
  loader: {
    '.js': 'copy'
  },
  onSuccess: 'cp -r src/data-embedded dist/data-embedded 2>/dev/null || true'
}); 