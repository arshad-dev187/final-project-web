// End-to-end verification - seed addons + create order + verify server-side pricing
await import('dotenv/config');
const { default: mysql } = await import('mysql2/promise');
const BASE = 'http://localhost:5000/api';

const pool = await mysql.createPool({
  host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'green_grounds_cafe'
});

// 1. Seed addons + link to Chicken Burger (product 5) and Cappuccino (product 1)
async function insertAddon(name, price) {
  const [r] = await pool.query('INSERT INTO addons (name, price) VALUES (?, ?)', [name, price]);
  return r.insertId;
}
const extraCheese = await insertAddon('Extra Cheese', 100);
const extraChips = await insertAddon('Extra Chips', 150);
const extraSpicy = await insertAddon('Extra Spicy', 0);
await pool.query('INSERT IGNORE INTO product_addons (product_id, addon_id) VALUES (?, ?)', [5, extraCheese]);
await pool.query('INSERT IGNORE INTO product_addons (product_id, addon_id) VALUES (?, ?)', [5, extraChips]);
await pool.query('INSERT IGNORE INTO product_addons (product_id, addon_id) VALUES (?, ?)', [5, extraSpicy]);
await pool.query('INSERT IGNORE INTO product_addons (product_id, addon_id) VALUES (?, ?)', [1, extraCheese]);
console.log(`Seeded addons: cheese=${extraCheese} chips=${extraChips} spicy=${extraSpicy}`);

// 2. GET addons list
const addons = await fetch(`${BASE}/addons`).then(r => r.json());
console.log('GET /addons:', JSON.stringify(addons));

// 3. GET product 5 addons
const p5Addons = await fetch(`${BASE}/products/5/addons`).then(r => r.json());
console.log('GET /products/5/addons:', JSON.stringify(p5Addons));

// 4. Create an order (Chicken Burger ×2 + Extra Cheese + Extra Spicy) - server computes prices
// Burger 780 + cheese 100 + spicy 0 = 880/unit, qty 2 = 1760
const orderRes = await fetch(`${BASE}/orders`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customer_name: 'Test Customer',
    order_type: 'dine_in',
    table_number: 'T4',
    items: [{ product_id: 5, quantity: 2, addon_ids: [extraCheese, extraSpicy] }]
  })
});
const order = await orderRes.json();
console.log('ORDER status:', orderRes.status, JSON.stringify(order));

// 5. Invalid: unavailable product / invalid ID
const badProduct = await fetch(`${BASE}/orders`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ customer_name: 'X', order_type: 'take_away', items: [{ product_id: 99999, quantity: 1 }] })
}).then(async r => ({ status: r.status, body: await r.json() }));
console.log('INVALID product:', JSON.stringify(badProduct));

// 6. Invalid: negative qty
const badQty = await fetch(`${BASE}/orders`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ customer_name: 'X', order_type: 'take_away', items: [{ product_id: 5, quantity: -1 }] })
}).then(async r => ({ status: r.status, body: await r.json() }));
console.log('INVALID qty:', JSON.stringify(badQty));

// 7. GET the order back
const fetched = await fetch(`${BASE}/orders/${order.id}`).then(r => r.json());
console.log('GET order:', JSON.stringify(fetched));

await pool.end();