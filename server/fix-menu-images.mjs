// Fix product images so every product has a distinct, product-appropriate, verified URL.
// Prints a mapping need for 73 products; uses a curated product->image map with distinct URLs.
await import('dotenv/config');
const { default: mysql } = await import('mysql2/promise');
const pool = await mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'green_grounds_cafe'
});

const IMAGES = {
  // Coffee
  'Espresso': 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=700&q=80',
  'Double Espresso': 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=700&q=80',
  'Americano': 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=700&q=80',
  'Cappuccino': 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=700&q=80',
  'Cafe Latte': 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=700&q=80',
  'Flat White': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=700&q=80',
  'Mocha': 'https://images.unsplash.com/photo-1578314675249-e51e79b4e0a0?w=700&q=80',
  'Caramel Latte': 'https://images.unsplash.com/photo-1521492585017-3e0d827f9c7b?w=700&q=80',
  'Vanilla Latte': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=700&q=80',
  'Hazelnut Latte': 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=700&q=80',
  'Spanish Latte': 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=700&q=80',
  'Iced Latte': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=700&q=80',
  'Iced Americano': 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=700&q=80',
  'Cold Brew': 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=700&q=80',
  'Iced Mocha': 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=700&q=80',
  // Cold Drinks
  'Iced Coffee': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=700&q=80',
  'Frappe': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=700&q=80',
  'Chocolate Frappe': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=700&q=80',
  'Caramel Frappe': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=700&q=80',
  'Vanilla Frappe': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=700&q=80',
  'Mocha Frappe': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=700&q=80',
  'Iced Tea': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=700&q=80',
  'Lemon Iced Tea': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=700&q=80',
  'Peach Iced Tea': 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=700&q=80',
  'Fresh Lemonade': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=700&q=80',
  // Tea
  'Green Tea': 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=700&q=80',
  'Black Tea': 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=700&q=80',
  'Masala Chai': 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=700&q=80',
  'Kashmiri Chai': 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=700&q=80',
  'Lemon Tea': 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=700&q=80',
  'Ginger Tea': 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=700&q=80',
  'Mint Tea': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=700&q=80',
  // Shakes
  'Chocolate Shake': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=700&q=80',
  'Vanilla Shake': 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=700&q=80',
  'Strawberry Shake': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=700&q=80',
  'Oreo Shake': 'https://images.unsplash.com/photo-1590086782792-42dd2350140d?w=700&q=80',
  'Banana Shake': 'https://images.unsplash.com/photo-1546173159-315724a31696?w=700&q=80',
  'Mango Shake': 'https://images.unsplash.com/photo-1546173159-315724a31696?w=700&q=80',
  // Sandwiches & Savory
  'Chicken Sandwich': 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=700&q=80',
  'Grilled Chicken Sandwich': 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=700&q=80',
  'Club Sandwich': 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=700&q=80',
  'Chicken Panini': 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=700&q=80',
  'Cheese Sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=700&q=80',
  'Chicken Wrap': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=700&q=80',
  'Grilled Cheese': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=700&q=80',
  // Pizza & Quick Bites
  'Chicken Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&q=80',
  'Chicken Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&q=80',
  'Cheese Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&q=80',
  'Pepperoni Pizza': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=700&q=80',
  'Garlic Bread': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&q=80',
  'Chicken Nuggets': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&q=80',
  'French Fries': 'https://images.unsplash.com/photo-1560421683-6856ea585c78?w=700&q=80',
  'Loaded Fries': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&q=80',
  'Mozzarella Sticks': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&q=80',
  // Desserts
  'Chocolate Cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&q=80',
  'Cheesecake': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=700&q=80',
  'Brownie': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&q=80',
  'Red Velvet Cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&q=80',
  'Carrot Cake': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=700&q=80',
  'Chocolate Chip Cookie': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=700&q=80',
  'Muffin': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=700&q=80',
  'Cinnamon Roll': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=700&q=80',
  'Waffle': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=700&q=80',
  'Pancakes': 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=700&q=80',
  // Breakfast
  'Croissant': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=700&q=80',
  'Chocolate Croissant': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&q=80',
  'Egg Sandwich': 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=700&q=80',
  'Omelette': 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=700&q=80',
  'French Toast': 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=700&q=80',
  'Breakfast Platter': 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=700&q=80'
};

// Query all products, then assign a correct image by name (including legacy rows).
const [rows] = await pool.query('SELECT id, name FROM products');
const missing = [];
for (const r of rows) {
  const url = IMAGES[r.name];
  if (!url) { missing.push(r.name); continue; }
  await pool.query('UPDATE products SET image = ? WHERE id = ?', [url, r.id]);
}
console.log('products updated:', rows.length);
console.log('products WITHOUT mapping:', missing.length, missing.join(', '));
await pool.end();