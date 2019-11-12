import fs from 'fs';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import pkg from './package.json';

const exportedComponents = fs
  .readdirSync('src/components', {
    withFileTypes: true,
  })
  .filter(
    fd => fd.isDirectory() && fd.name !== 'common' && fd.name !== '_internal'
  )
  .map(({ name }) => name);

export default [
  {
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      ...Object.keys(pkg.optionalDependencies || {}),
    ],
    context: 'window',
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
      {
        file: pkg.module,
        format: 'es',
      },
    ],
    plugins: [
      typescript({
        typescript: require('typescript'),
        exclude: ['**/*.(test|stories).ts+(|x)', '**/mocks/*.ts+(|x)'],
      }),
      json(),
    ],
  },
  {
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      ...Object.keys(pkg.optionalDependencies || {}),
    ],
    context: 'window',
    input: exportedComponents.reduce((acc, component) => {
      acc[
        `components/${component}/index`
      ] = `src/components/${component}/index.ts`;
      return acc;
    }, {}),
    output: {
      dir: 'dist',
      entryFileNames: '[name].js',
      chunkFileNames: 'chunks/chunk-[hash].js',
      format: 'cjs',
    },
    plugins: [
      typescript({
        typescript: require('typescript'),
        exclude: ['**/*.(test|stories).ts+(|x)', '**/mocks/*.ts+(|x)'],
      }),
      json(),
    ],
  },
];
