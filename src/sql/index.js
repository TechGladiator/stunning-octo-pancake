// src/sql/index.js
const { Pool, Client } = require('pg');

// pools will use environment variables
// for connection information
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

const res = await pool.query('SELECT NOW()');
await pool.end();

// clients will also use environment variables
// for connection information
const client = new Client();
await client.connect();

const res = await client.query('SELECT NOW()');
await client.end();