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
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        extractComments: false,
      })
    ]

  };

  return config;
};
