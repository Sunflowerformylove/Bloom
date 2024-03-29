const path = require('path');

module.exports = {
  entry: '/Source/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: 'umd',
    library: 'formatPrice'
  },
  mode: 'development',
}