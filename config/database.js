const mysql = require('mysql2');

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "Nyamka2416@",
  database: "motors",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.promise().query("SELECT 1")
  .then(() => console.log('MySQL connected'))
  .catch(err => console.error('MySQL connection error:', err));

module.exports = pool;

