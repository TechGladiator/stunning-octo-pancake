// src/sql/index.js
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

module.exports = {
  query: (text, params, callback) => {
    const start = Date.now();
    return pool.query(text, params, (err, res) => {
      const duration = Date.now() - start;
      if (err) {
        console.log('executed query', { text, params, duration, error: err.detail });
        callback(err, res);
      } else {
        console.log('executed query', { text, params, duration, rows: res.rowCount });
        callback(err, res);
      }
    });
  }
}