import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_password_here',
  database: 'appliance_inventory',
});

export default db;