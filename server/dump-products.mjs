// Print current products: id, name, category, image
await import('dotenv/config');
const { default: mysql } = await import('mysql2/promise');
const pool = await mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'green_grounds_cafe'
});
const [rows] = await pool.query(`SELECT p.id, p.name, c.name AS category, p.image FROM products p JOIN categories c ON c.id = p.category_id ORDER BY c.name, p.name`);
console.log('TOTAL:', rows.length);
for (const r of rows) console.log(`${r.id}\t${r.category}\t${r.name}\t${r.image}`);
await pool.end();