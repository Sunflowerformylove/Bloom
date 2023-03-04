const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: '/Source/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  mode: 'development',
  plugins: [
    new webpack.ProvidePlugin({
      'crypto' : 'crypto-js',
      'bowser' : 'bowser'
    })
  ],
  module: {
    rules: [{
      test: '/\.js$/',
      exclude: '/node_modules/',
      use: 'babel-loader',
    }]
  }
}