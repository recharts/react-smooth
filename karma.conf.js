
module.exports = function (config) {
  config.set({
    frameworks: ['mocha'],
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'test/spec.js',
    ],
    preprocessors: {
      'test/spec.js': ['webpack', 'sourcemap'],
    },
    browsers: ['Chrome'],
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
          },
        ],
      },
    },
    webpackServer: {
      noInfo: false,
    },
  });
};
