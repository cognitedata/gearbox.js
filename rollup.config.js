import fs from 'fs';
import typescript from 'rollup-plugin-typescript2';
import replace from '@rollup/plugin-replace';
import json from 'rollup-plugin-json';
import pkg from './package.json';

const exportedComponents = fs
  .readdirSync('src/components', {
    withFileTypes: true,
  })
  .filter(
    fd => fd.isDirectory() && fd.name !== 'common'
  )
  .map(({ name }) => name);
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.optionalDependencies || {}),
];
const typescriptOpts = (compilerOptions = {}) => ({
  tsconfigOverride: {
    exclude: [
      "dist",
      "**/*.test.*",
      "**/*.stories.*",
      "**/mocks"
    ],
    compilerOptions
  }
});

export default [
  {
    cache: false,
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
        ...typescriptOpts()
      }),
      json()
    ],
  },
  {
    cache: false,
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
      replace({__REPLACE_package_version__: pkg.version }),
      typescript({
        ...typescriptOpts({
          declaration: false
        }),
      }),
      json()
    ],
  },
];
