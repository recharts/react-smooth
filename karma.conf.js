
module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'chai'],
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

    plugins: [
      'karma-webpack',
      'karma-mocha',
      // 'karma-coverage',
      'karma-chai',
      'karma-sourcemap-loader',
      'karma-firefox-launcher',
      'karma-chrome-launcher',
      // 'karma-coveralls',
    ],

    externals: {
      jsdom: 'window',
      'react/lib/ExecutionEnvironment': true,
      'react/addons': 'react',
      'react/lib/ReactContext': 'window',
      'text-encoding': 'window',
      'react-addons-test-utils': 'react-dom'
    },
  });
};
