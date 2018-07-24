// src/server.js
const path = require('path');
const express = require('express');

const config = require('./config');

const app = express();

const client = require('./sql');

const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));

app.set('views', './src/views');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(config.port, function() {
  console.log(`${config.appName} is listening on port ${config.port}`);
});