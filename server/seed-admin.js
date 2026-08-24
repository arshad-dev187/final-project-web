import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env') });
const password = process.argv[2];
if (!password || password.length < 8) throw new Error('Usage: node seed-admin.js <password> (minimum 8 characters)');
const pool = await mysql.createPool({ host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', database: process.env.DB_NAME || 'green_grounds_cafe' });
const hash = await bcrypt.hash(password, 12);
await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE password=VALUES(password), name=VALUES(name)', ['Green Grounds Admin', 'admin@greengroundscafe.com', hash, 'admin']);
console.log('Admin account ready: admin@greengroundscafe.com');
await pool.end();
