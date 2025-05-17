import 'dotenv/config';
import mariadb from 'mariadb';

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 5,
  connectTimeout: 5000,
  acquireTimeout: 10000,
});

export default pool; 