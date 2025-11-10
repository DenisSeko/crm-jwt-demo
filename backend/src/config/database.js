import { Pool } from 'pg';
import 'dotenv/config';

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Database error:', err);
});

// Test funkcija za provjeru baze
export const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW() as time');
    console.log('✅ Database connection test passed:', result.rows[0].time);
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    return false;
  }
};
