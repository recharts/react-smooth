const path = require('path');
const defaultConfig = require('../webpack.config');

const config = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    Gossip: path.join(__dirname, '/Gossip/app.js'),
    GroupAnimation: path.join(__dirname, '/GroupAnimation/app.js'),
    SimpleAnimation: path.join(__dirname, '/SimpleAnimation/app.js'),
    Pendulum: path.join(__dirname, '/Pendulum/app.js'),
  },
  output: {
    path: __dirname,
    filename: '[name]/build.js',
  },
  resolve: {
    alias: {
      'react-smooth': path.join(__dirname, '../src/index.js'),
      react: path.join(__dirname, '../node_modules/react'),
      'react-dom': path.join(__dirname, '../node_modules/react-dom'),
      'react-transition-group': path.join(
        __dirname,
        './node_modules/react-transition-group',
      ),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          __dirname,
          path.join(__dirname, '../src'),
          path.join(__dirname, '../node_modules'),
        ],
      },
    ],
  },
  devServer: {
    static: [
      { directory: __dirname },
      { directory: path.join(__dirname, '../umd') },
    ],
  },
};

// TEST_UMD=1 npm run demo to test output of the UMD build
if (process.env.TEST_UMD) {
  delete config.resolve.alias;
  config.externals = {
    react: 'React',
    'react-transition-group': 'ReactTransitionGroup',
    'prop-types': 'PropTypes',
    'react-dom': 'ReactDOM',
    'react-smooth': 'ReactSmooth',
  };
}
module.exports = config;
