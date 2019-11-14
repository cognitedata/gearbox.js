const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin');

module.exports = async ({ config }) => {
  config.module.rules.push({
    test: /\.(stories|story)\.mdx$/,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          presets: [['react-app', { flow: false, typescript: true }]],
        },
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

  return config;
};
