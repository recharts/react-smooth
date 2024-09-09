const path = require('path');

module.exports = {
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
      'react-smooth': path.join(__dirname, '../src/index.ts'),
    },
  },
  devServer: {
    static: {
      directory: 'demo/',
    },
    port: 4000,
    host: '127.0.0.1',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [__dirname, path.join(__dirname, '../src'), path.join(__dirname, '../node_modules')],
      },
    ],
  },
};
