// src/sql/index.js
const { Pool, Client } = require('pg');

// pools will use environment variables
// for connection information
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'project',
  password: 'secretpassword',
  port: 5432,
});

const res = await pool.query('SELECT NOW()');
await pool.end();

// clients will also use environment variables
// for connection information
const client = new Client();
await client.connect();

const res = await client.query('SELECT NOW()');
await client.end();