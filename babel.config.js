module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        root: './src',
        extensions: ['.js'],
        alias: {
          controller: './src/controller',
          middlewares: './src/middlewares',
          routes: './src/routes',
          schemas: './src/schemas',
          utility: './src/utility',
        },
      },
    ],
  ],
}

