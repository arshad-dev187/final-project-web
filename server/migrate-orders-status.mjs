// Migration: extend orders.status ENUM to support the admin order workflow.
//   pending -> accepted -> in_progress -> completed   (rejected at any step)
// Existing statuses (confirmed/preparing/ready/cancelled) are preserved so no
// existing data is destroyed. Safe to run multiple times.
import 'dotenv/config';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'green_grounds_cafe',
  waitForConnections: true,
  connectionLimit: 2,
  decimalNumbers: true
});

const [rows] = await pool.query("SHOW COLUMNS FROM orders LIKE 'status'");
const currentType = String(rows[0]?.Type || '');

if (currentType.includes('accepted')) {
  console.log('orders.status already supports the new statuses. Nothing to do.');
} else {
  await pool.query(`
    ALTER TABLE orders
      MODIFY COLUMN status
        ENUM('pending','accepted','in_progress','completed','rejected','confirmed','preparing','ready','cancelled')
        NOT NULL DEFAULT 'pending'
  `);
  console.log('orders.status enum migrated to include accepted / in_progress / rejected.');
}

await pool.end();