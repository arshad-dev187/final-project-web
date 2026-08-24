// Safe additive migration for customer ordering system
await import('dotenv/config');
const { default: mysql } = await import('mysql2/promise');

const pool = await mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'green_grounds_cafe'
});

// Baseline existing data (must remain intact)
const [baseline] = await pool.query(`
  SELECT
    (SELECT COUNT(*) FROM products) AS products,
    (SELECT COUNT(*) FROM categories) AS categories,
    (SELECT COUNT(*) FROM reviews) AS reviews,
    (SELECT COUNT(*) FROM team_members) AS team,
    (SELECT COUNT(*) FROM gallery) AS gallery,
    (SELECT COUNT(*) FROM messages) AS messages,
    (SELECT COUNT(*) FROM users) AS users
`);
console.log('BASELINE COUNTS:', JSON.stringify(baseline[0]));

// 1. addons
await pool.query(`
  CREATE TABLE IF NOT EXISTS addons (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(80) NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);
console.log('addons table ready');

// 2. product_addons (many-to-many)
await pool.query(`
  CREATE TABLE IF NOT EXISTS product_addons (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    product_id INT UNSIGNED NOT NULL,
    addon_id INT UNSIGNED NOT NULL,
    CONSTRAINT fk_pa_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_pa_addon FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE CASCADE,
    UNIQUE KEY uq_product_addon (product_id, addon_id)
  )
`);
console.log('product_addons table ready');

// 3. orders
await pool.query(`
  CREATE TABLE IF NOT EXISTS orders (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(20) NOT NULL UNIQUE,
    customer_name VARCHAR(120) NOT NULL,
    order_type ENUM('dine_in','take_away','online') NOT NULL,
    table_number VARCHAR(20),
    contact VARCHAR(190),
    subtotal DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    status ENUM('pending','confirmed','preparing','ready','completed','cancelled') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_orders_status (status),
    INDEX idx_orders_created (created_at)
  )
`);
console.log('orders table ready');

// 4. order_items
await pool.query(`
  CREATE TABLE IF NOT EXISTS order_items (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    order_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED,
    product_name_snapshot VARCHAR(140) NOT NULL,
    unit_price_snapshot DECIMAL(10,2) NOT NULL,
    quantity SMALLINT UNSIGNED NOT NULL,
    line_total DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_oi_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_oi_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
  )
`);
console.log('order_items table ready');

// 5. order_item_addons
await pool.query(`
  CREATE TABLE IF NOT EXISTS order_item_addons (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    order_item_id INT UNSIGNED NOT NULL,
    addon_id INT UNSIGNED,
    addon_name_snapshot VARCHAR(80) NOT NULL,
    addon_price_snapshot DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_oia_item FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
    CONSTRAINT fk_oia_addon FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE SET NULL
  )
`);
console.log('order_item_addons table ready');

// Verify
const [tables] = await pool.query('SHOW TABLES');
console.log('TABLES:', tables.map(t => Object.values(t)[0]).join(', '));

const [after] = await pool.query(`
  SELECT
    (SELECT COUNT(*) FROM products) AS products,
    (SELECT COUNT(*) FROM categories) AS categories,
    (SELECT COUNT(*) FROM reviews) AS reviews,
    (SELECT COUNT(*) FROM team_members) AS team,
    (SELECT COUNT(*) FROM gallery) AS gallery,
    (SELECT COUNT(*) FROM messages) AS messages,
    (SELECT COUNT(*) FROM users) AS users
`);
console.log('AFTER COUNTS:', JSON.stringify(after[0]));
console.log('EXISTING DATA INTACT:', JSON.stringify(baseline[0]) === JSON.stringify(after[0]));

await pool.end();