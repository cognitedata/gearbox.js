const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

module.exports = async ({ config }) => {
  config.module.rules.push({
    test: /\.(stories|story)\.mdx$/,
    use: [
      {
        loader: require.resolve('babel-loader'),
      },
      {
        loader: '@mdx-js/loader',
        options: {
          compilers: [createCompiler({})],
        },
      },
    ],
  });
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
  },
  {
    test: /\.md$/,
    use: [
      {
        loader: 'markdown-loader',
      },
    ],
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
