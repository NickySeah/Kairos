const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,        // separate port from host
  user: "root",
  password: "root",
  database: "kairos_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
(async () => {
  try {
    const connection = await pool.getConnection(); // get a connection from the pool
    console.log("Successfully connected to MySQL!");
    connection.release(); // release it back to the pool
  } catch (err) {
    console.error("Error connecting to MySQL:", err.message);
  }
})();

module.exports = pool;