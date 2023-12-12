const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB
});
connection.connect((error) => {
    if (error) {
        console.error('MySQL тэй холбогдсонгүй үндсэн хэсэг:', error);
    } else {
        console.log('MySQL тэй холбогдлоо');
    }
});

module.exports = connection;