const presets = require.resolve('babel-preset-react');
const plugins = [
  [
    require.resolve('babel-plugin-module-resolver'),
    {
      root: [path.resolve('./')],
      alias: {
        controller: './src/controller',
        middlewares: './src/middlewares',
        routes: './src/routes',
        schemas: './src/schemas',
        utility: './src/utility',
      },
    },
  ],
];

module.exports = {
  presets: [presets, 'stage-0'],
  plugins: [...plugins],
};
