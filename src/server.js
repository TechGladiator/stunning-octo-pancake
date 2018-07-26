// src/server.js
const path = require('path');
const express = require('express');

const config = require('./config');

const app = express();

const router = require('./routes')

const pool = require('./sql');

const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));
app.use('/api', router);

app.set('views', './src/views');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index', { project: 'Project: Database Schema Creation & Basic CRUD Operations', apiKey: process.env.API_KEY});
});

app.listen(config.port, function() {
  console.log(`${config.appName} is listening on port ${config.port}`);
});