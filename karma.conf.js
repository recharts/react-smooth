
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

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      stats: 'errors-only',
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
    // config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    browserNoActivityTimeout: 60000,
  });
};
