var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var env = process.env.NODE_ENV

var config = {
  entry: './src/index.js',

  output: {
    library: 'ReactSmooth',
    libraryTarget: 'umd',
  },

  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      include: [
        path.resolve(__dirname, 'src')
      ],
      loader: 'babel',
    }],
    resolve: {
      alias: {
        'react': path.join(__dirname, './node_modules/react'),
        'react-dom': path.join(__dirname, './node_modules/react-dom'),
        'react-transition-group': path.join(__dirname, './node_modules/react-transition-group'),
      }
    },
  },

  externals: {
    "react": {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'react-transition-group': {
      root: ['ReactTransitionGroup'],
      commonjs2: 'react-transition-group',
      commonjs: 'react-transition-group',
      amd: 'react-transition-group'
     }
  },

  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
  ],
};

if (env === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      },
      output: {
        comments: false
      },
      sourceMap: false
    })
  );
}

module.exports = config;
