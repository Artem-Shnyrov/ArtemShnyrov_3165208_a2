import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '22102022',
  database: 'appliance_inventory',
});

export default db;