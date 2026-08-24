CREATE DATABASE IF NOT EXISTS green_grounds_cafe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE green_grounds_cafe;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin') NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  category_id INT UNSIGNED NOT NULL,
  name VARCHAR(140) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  discount_price DECIMAL(10,2) NULL,
  image VARCHAR(255),
  available BOOLEAN NOT NULL DEFAULT TRUE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  serving_size VARCHAR(80),
  calories INT UNSIGNED,
  protein DECIMAL(6,2),
  carbohydrates DECIMAL(6,2),
  fat DECIMAL(6,2),
  sugar DECIMAL(6,2),
  sodium INT UNSIGNED,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_products_category (category_id),
  INDEX idx_products_featured (featured)
);

CREATE TABLE IF NOT EXISTS team_members (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  role VARCHAR(120) NOT NULL,
  bio TEXT NOT NULL,
  image VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(140) NOT NULL,
  image VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(40),
  subject VARCHAR(180) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('unread', 'read') NOT NULL DEFAULT 'unread',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_messages_status (status),
  INDEX idx_messages_created (created_at)
);

CREATE TABLE IF NOT EXISTS complaints (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  customer_name VARCHAR(120) NOT NULL,
  email VARCHAR(190),
  phone VARCHAR(40),
  category ENUM('Food / Product','Service','Staff','Order','Cleanliness','Other') NOT NULL,
  message TEXT NOT NULL,
  image VARCHAR(255),
  status ENUM('pending','in_progress','resolved','rejected') NOT NULL DEFAULT 'pending',
  admin_note TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_complaints_status (status),
  INDEX idx_complaints_created (created_at)
);

CREATE TABLE IF NOT EXISTS reviews (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  product_id INT UNSIGNED NULL,
  customer_name VARCHAR(120) NOT NULL,
  rating TINYINT UNSIGNED NOT NULL,
  review_text TEXT NOT NULL,
  status ENUM('pending','approved') NOT NULL DEFAULT 'pending',
  reviewer_image VARCHAR(255),
  review_image VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_reviews_status (status),
  INDEX idx_reviews_created (created_at),
  INDEX idx_reviews_product (product_id),
  CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL ON UPDATE CASCADE
);

INSERT IGNORE INTO categories (name, description) VALUES
('Coffee', 'Espresso-based classics and house signatures'),
('Tea', 'Comforting brews with bright botanicals'),
('Cold Drinks', 'Chilled refreshers for warm afternoons'),
('Breakfast', 'Fresh starts served all day'),
('Snacks', 'Small plates for sharing'),
('Fast Food', 'Cafe favorites made to order'),
('Desserts', 'Sweet finishes and baked treats'),
('Cakes', 'Celebration slices and whole cakes'),
('Family Meals', 'Generous spreads for the table');

INSERT INTO products (category_id, name, description, price, featured)
SELECT c.id, seed.name, seed.description, seed.price, seed.featured
FROM (SELECT 'Coffee' AS category, 'Cappuccino' AS name, 'Velvety espresso, silky milk and a soft cocoa finish.' AS description, 480.00 AS price, TRUE AS featured
  UNION ALL SELECT 'Coffee', 'Caramel Macchiato', 'Layered espresso with caramel and steamed milk.', 620.00, TRUE
  UNION ALL SELECT 'Tea', 'Masala Chai', 'A warming house blend with cardamom and ginger.', 320.00, FALSE
  UNION ALL SELECT 'Breakfast', 'Green Grounds Breakfast', 'Eggs, sourdough, grilled tomatoes and house potatoes.', 850.00, TRUE
  UNION ALL SELECT 'Fast Food', 'Chicken Burger', 'Crisp chicken, lettuce, pickles and our cafe sauce.', 780.00, FALSE
  UNION ALL SELECT 'Desserts', 'Chocolate Cake', 'Rich chocolate sponge with a glossy ganache.', 520.00, TRUE
  UNION ALL SELECT 'Family Meals', 'Family Platter', 'A generous spread of wings, fries, sliders and dips.', 2450.00, TRUE) AS seed
JOIN categories c ON c.name = seed.category
WHERE NOT EXISTS (SELECT 1 FROM products existing WHERE existing.name = seed.name);

CREATE TABLE IF NOT EXISTS addons (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_addons (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  product_id INT UNSIGNED NOT NULL,
  addon_id INT UNSIGNED NOT NULL,
  CONSTRAINT fk_pa_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_pa_addon FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE CASCADE,
  UNIQUE KEY uq_product_addon (product_id, addon_id)
);

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
);

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
);

CREATE TABLE IF NOT EXISTS order_item_addons (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  order_item_id INT UNSIGNED NOT NULL,
  addon_id INT UNSIGNED,
  addon_name_snapshot VARCHAR(80) NOT NULL,
  addon_price_snapshot DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_oia_item FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
  CONSTRAINT fk_oia_addon FOREIGN KEY (addon_id) REFERENCES addons(id) ON DELETE SET NULL
);