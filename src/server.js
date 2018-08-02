// src/server.js
const bodyParser = require('body-parser');
const config = require('./config');
const cool = require('cool-ascii-faces');
const db = require('./sql');
const express = require('express');
const path = require('path');
const router = require('./routes');

const app = express();

const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use('/api', router);

app.set('views', './src/views');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index', { title: 'Stunning Octo Pancake', apiKey: process.env.API_KEY});
});

app.get('/cool', (req, res) => {
  res.send(cool());
});

app.listen(config.port, function() {
  console.log(`${config.appName} is listening on port ${config.port}`);
});