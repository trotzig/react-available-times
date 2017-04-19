module.exports = [
  {
    test: /\.jsx?/,
    exclude: /node_modules/,
    loader: 'babel-loader',
  },
  {
    test: /\.css$/,
    use: [ 'style-loader', 'css-loader' ]
  },
];

