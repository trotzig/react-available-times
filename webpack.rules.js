module.exports = [
  {
    test: /\.jsx?/,
    exclude: /node_modules/,
    loader: 'babel-loader',
  },
  {
    test: /\.css$/,
    use: [
      {
        loader: 'style-loader',
      },
      {
        loader: 'css-loader',
        options: {
          localIdentName: 'rat-[name]_[local]',
        },
      },
    ]
  },
];

