const path = require('path');
require('dotenv').config({
    override: true,
    path: path.join(__dirname, '.env')
})

const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.PORT,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 10000
});
/*
(async () => {
    const client = await pool.connect();
    const {rows} = await client.query("SELECT * FROM users");
    console.log(rows);
    client.release();
})();
*/
module.exports = pool;