const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: 3306,
    password: "root",
    database: "motors"
});
connection.connect((error) => {
    if (error) {
        console.error('MySQL тэй холбогдсонгүй үндсэн хэсэг:', error);
    } else {
        console.log('MySQL тэй холбогдлоо');
    }
});

module.exports = connection;
