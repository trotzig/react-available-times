const path = require('path');

const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');

const webpackConfig = require('../webpack.config.test.js');

const app = express();

app.use(express.static('assets'));

// Use webpack
app.use(webpackMiddleware(webpack(webpackConfig), {
  publicPath: '/assets/',
}));

// viewed at http://localhost:8080
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/test.html'));
});

app.listen(3333);
console.log('http://localhost:3333');
