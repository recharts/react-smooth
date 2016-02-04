var webpack = require('webpack')

module.exports = {
  output: {
    library: 'ReactSmooth',
    libraryTarget: 'umd',
  },
  externals: [{
    'react': {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    }
  }, {
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'ReactDOM',
      commonjs: 'ReactDOM',
      amd: 'ReactDOM'
    }
  }, {
    'react-addons-transition-group': {
      root: 'ReactTransitionGroup',
      commonjs2: 'ReactTransitionGroup',
      commonjs: 'ReactTransitionGroup',
      amd: 'ReactTransitionGroup'
    }
  }],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  node: {
    Buffer: false
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};
