const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const mysqlConnection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT || 3306, 
 connectTimeout: 10000,
 ssl: {
    rejectUnauthorized: false
  }
});

mysqlConnection.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

module.exports = mysqlConnection;