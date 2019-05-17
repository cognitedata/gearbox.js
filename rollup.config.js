import fs from 'fs';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import pkg from './package.json';

const exportedComponents = fs
  .readdirSync('src/components')
  .filter(dir => dir !== 'common' && dir !== '_internal');

export default {
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  input: {
    index: 'src/index.ts',
    ...exportedComponents.reduce((acc, component) => {
      acc[`components/${component}/index`] = `src/components/${component}/index.ts`;
      return acc;
    }, {}),
  },
  output: [
    {
      dir: 'dist',
      entryFileNames: '[name].js',
      format: 'cjs',
    },
    {
      dir: 'dist',
      entryFileNames: '[name].es.js',
      format: 'es',
    },
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
      exclude: [ "**/*.(test|stories).ts+(|x)" ],
    }),
    json(),
  ],
};
