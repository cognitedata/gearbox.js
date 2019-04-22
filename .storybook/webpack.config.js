module.exports = ({ config }) => {
  config.module.rules.push(
    {
      loader: require.resolve('babel-loader'),
      options: {
        presets: [['react-app', { flow: false, typescript: true }]],
      },
      test: /\.(ts|tsx)$/,
    },
    {
      test: /\.md$/,
      use: [
        {
          loader: 'markdown-loader',
        },
      ],
    }
  );

  config.resolve.extensions.push('.ts', '.tsx');

  return config;
};
