const path = require('path');

const nodeExternals = require('webpack-node-externals');

const rules = require('./webpack.rules.js');

// This config file is used to create a commonjs bundle that we export.
module.exports = {
  entry: path.join(__dirname, 'src/main.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
    libraryTarget: 'commonjs-module',
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css'],
  },
  module: {
    rules,
  },
};
