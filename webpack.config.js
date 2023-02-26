const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './Source/index.js',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    }
}