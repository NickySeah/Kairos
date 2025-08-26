const mysql = require('mysql2/promise');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",            // your MySQL username
  password: "root", // your MySQL password
  database: "kairos_db",  // your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log("Connected to MySQL!");

module.exports = pool;