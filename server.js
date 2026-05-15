const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();
const redis = require('redis');

const app = express();
const port = process.env.APP_PORT || 3000;

const pool = new Pool({
    // host: "localhost",
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    port: process.env.DB_PORT
});

const redisClient = redis.createClient({

    socket: {
        host: 'redis',
        potr: 6379
    }
});

app.get('/users', async (req, res) => {
    try {
        const result = await pool.query(`SELECT * from users;`);
        res.status(200).json(result.rows);
        console.log(result.rows);
    } catch (err) {
        console.error('Database error:', err.message);
        res.status(500).json({ error: 'Database query failed' });
    }
});

app.get('/loans', async (req, res) => {
    try {
        const result = await pool.query(`SELECT * from loans;`);
        res.status(200).json(result.rows);
        console.log(result.rows);
    } catch (err) {
        console.error('Database error:', err.message);
        res.status(500).json({ error: 'Database query failed' });
    }
});

app.get('/test', async (req, res) => {
    res.send("This is a test");
});

app.listen(port, () => {
    console.log('[*] Listening on port:', port);
});

redisClient.connect()
    .then(() => console.log("[*] Redis Connected!"))
    .catch(err => console.log("[!] Redis connection error:", err));