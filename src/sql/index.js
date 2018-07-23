// src/sql/index.js
const { Client } = require('pg');

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

client.connect();

client.query('SELECT NOW() as now', (err, res) => {
  if (err) {
    console.log(err.stack);
  } else {
    console.log(res.rows[0])
  }
  client.end();
});