const mysql = require("mysql2");

// Create a connection pool instead of a single connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,  
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0
});

// Test connection (optional)
db.getConnection((err, connection) => {
  if (err) {
    console.error(" Not connected to MySQL database:", err.message);
  } else {
    console.log("Connected to MySQL database");
    connection.release(); // release connection back to pool
  }
});

module.exports = db;
