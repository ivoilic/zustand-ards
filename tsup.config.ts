import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/**.ts'],
  sourcemap: false,
  splitting: false, // We are manually splitting the files
  external: ['./shallow', './array-selector', './types', 'zustand'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  minify: false,
  treeshake: true,
});
