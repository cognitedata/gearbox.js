import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import pkg from './package.json';
import regenerator from 'rollup-plugin-regenerator';

export default {
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
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
    }),
    json(),
    regenerator(),
  ],
};
