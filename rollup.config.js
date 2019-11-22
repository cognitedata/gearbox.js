import fs from 'fs';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const exportedComponents = fs
  .readdirSync('src/components', {
    withFileTypes: true,
  })
  .filter(
    fd => fd.isDirectory() && fd.name !== 'common' && fd.name !== '_internal'
  )
  .map(({ name }) => name);
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.optionalDependencies || {}),
];
const typescriptOpts = {
  tsconfigOverride: {
    exclude: [
      "dist",
      "**/*.test.*",
      "**/*.stories.*",
      "**/mocks"
    ],
  }
};

export default [
  {
    external,
    context: 'window',
    input: {
      'index.esm': 'src/index.ts',
      ...exportedComponents.reduce((acc, component) => {
        acc[
          `components/${component}/index`
          ] = `src/components/${component}/index.ts`;
        return acc;
      }, {}),
    },
    output: [
      {
        dir: 'dist',
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/chunk-[hash].js',
        exports: 'named',
        format: 'esm',
      },
    ],
    plugins: [
      typescript({
        ...typescriptOpts
      }),
    ],
  },
  {
    external,
    input: 'src/index.ts',
    context: 'window',
    output:[
      {
        file: pkg.main,
        format: 'cjs',
      },
    ],
    plugins: [
      typescript({
        ...typescriptOpts,
        compilerOptions: {
          declaration: false,
        },
      }),
    ],
  },
];
