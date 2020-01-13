const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

module.exports = async ({ config }) => {
  config.module.rules.push({
    include: path.resolve(__dirname, "../src"),
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          presets: [['react-app', { flow: false, typescript: true }]],
        },
      },require.resolve("react-docgen-typescript-loader"),
    ],
    test: /\.(ts|tsx)$/,
  });

  config.resolve.extensions.push('.ts', '.tsx');
  config.optimization = {
    splitChunks: {
      // include all types of chunks
      chunks: 'all'
    },
    minimizer: [
      new TerserPlugin({
        chunkFilter: (chunk) => {
          // Exclude uglification for the `vendor` chunk
          return chunk.name !== 'vendor';
        },
        cache: false,
        parallel: true,
        sourceMap: false,
        extractComments: false,
      })
    ]
  };

  return config;
};
