// Seed realistic, product-specific customer reviews into the existing reviews table.
// Uses the existing schema (product_id, customer_name, rating, review_text, status).
// All reviews are inserted as 'approved' so they appear on the public site.
await import('dotenv/config');
const { default: mysql } = await import('mysql2/promise');
const pool = await mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'green_grounds_cafe'
});

// [product_id, customer_name, rating, review_text]
const reviews = [
  // ---- Coffee ----
  [1, 'Ali R.', 5, 'Really smooth coffee and not too bitter. The foam on top was perfect.'],
  [1, 'Sarah M.', 4, 'Loved it, although I wish the cup was a little bigger.'],
  [1, 'Hamza K.', 5, 'Best cappuccino I have had in Winder.'],
  [2, 'Ayesha S.', 5, 'The caramel flavor was actually really nice, not too sweet.'],
  [2, 'Daniyal', 4, 'Good macchiato. A bit pricey but worth it once in a while.'],
  [2, 'Zainab K.', 3, 'Taste was good but a bit sweeter than I expected.'],
  [10, 'Bilal', 5, 'Strong and clean. Just how I like my americano.'],
  [10, 'Fatima N.', 4, 'Nice and bold. Would be perfect with a bit more water.'],
  [12, 'Omar', 5, 'Really good coffee.'],
  [12, 'Hira', 4, 'Smooth and milky, exactly what a latte should be.'],
  [14, 'Usman', 5, 'The chocolate and coffee balance was spot on.'],
  [14, 'Mahnoor', 3, 'A little too sweet for me, but the kids loved it.'],
  [21, 'Raza', 5, 'Cold brew was smooth, no bitterness at all. Great on a hot day.'],
  [21, 'Sana', 4, 'Really refreshing. Wish they had bigger sizes.'],

  // ---- Tea ----
  [3, 'Kashif', 5, 'Proper masala chai, you can taste the cardamom and ginger.'],
  [3, 'Nadia', 4, 'Very warming and comforting. A bit strong for me but my husband loved it.'],
  [3, 'Imran', 5, 'Tastes like home.'],
  [36, 'Areeba', 5, 'The Kashmiri chai was so creamy and pink, looked amazing and tasted even better.'],
  [36, 'Shahid', 4, 'Sweet and rich. A little heavy for an everyday drink but great for a treat.'],
  [33, 'Mehak', 4, 'Light and fresh, good quality green tea.'],
  [33, 'Tariq', 3, 'It was fine, nothing special.'],
  [31, 'Sadia', 5, 'Peach iced tea was so refreshing, perfect for summer.'],
  [31, 'Waqas', 4, 'Nice and fruity, not too sweet.'],

  // ---- Cold Drinks ----
  [23, 'Hassan', 5, 'Iced coffee was strong and cold, just right.'],
  [23, 'Rabia', 4, 'Really good, though I would have liked it a bit sweeter.'],
  [26, 'Farhan', 5, 'Caramel frappe was thick and creamy, loved it.'],
  [26, 'Iqra', 4, 'Tasty but a little too sweet for me.'],
  [32, 'Zeeshan', 5, 'Fresh lemonade, you can tell it is made fresh.'],
  [32, 'Aiman', 4, 'Tangy and refreshing.'],
  [28, 'Noman', 4, 'Mocha frappe was good, chocolatey and cold.'],
  [28, 'Saba', 3, 'Was okay, a bit watery at the end.'],

  // ---- Breakfast ----
  [4, 'Ahmed', 5, 'The eggs were cooked perfectly and the sourdough was toasted just right. Big portion too.'],
  [4, 'Maryam', 4, 'Great breakfast, everything was fresh. The potatoes could use a bit more salt.'],
  [4, 'Junaid', 5, 'Best breakfast in town, filling and tasty.'],
  [76, 'Saima', 5, 'French toast was soft and fluffy, the syrup on top was a nice touch.'],
  [76, 'Adnan', 4, 'Really good, though I wish there were more berries.'],
  [75, 'Kiran', 4, 'Omelette was fluffy and full of veggies.'],
  [75, 'Faisal', 3, 'It was decent but a little dry.'],
  [74, 'Hina', 5, 'Egg sandwich was simple and perfect, the bread was fresh.'],
  [74, 'Salman', 4, 'Good sandwich, quick to come out.'],

  // ---- Pizza & Quick Bites ----
  [5, 'Bilal A.', 5, 'Chicken burger was juicy and the bun was soft. The sauce was really good.'],
  [5, 'Ayesha', 4, 'Crispy chicken, good burger. Fries on the side would be nice.'],
  [5, 'Hamza', 3, 'Burger was okay, a bit dry this time.'],
  [54, 'Rizwan', 5, 'Chicken pizza had a good amount of topping, crust was nice and crispy.'],
  [54, 'Nida', 4, 'Tasty pizza, generous chicken.'],
  [56, 'Ali', 5, 'Pepperoni pizza was great, cheesy and hot.'],
  [56, 'Sara', 4, 'Really good, though a little oily.'],
  [59, 'Usama', 5, 'Fries were crispy and well salted.'],
  [59, 'Zara', 4, 'Good fries, perfect with the ketchup.'],
  [60, 'Kamran', 5, 'Loaded fries were amazing, lots of cheese and sauce.'],
  [60, 'Huma', 4, 'Very filling, great for sharing.'],
  [61, 'Danish', 4, 'Mozzarella sticks were cheesy and golden.'],
  [61, 'Aqsa', 3, 'They were okay, a bit greasy.'],

  // ---- Sandwiches & Savory ----
  [46, 'Shahzad', 5, 'Chicken sandwich was fresh and the chicken was tender.'],
  [46, 'Mariam', 4, 'Good sandwich, decent size.'],
  [47, 'Talha', 5, 'Grilled chicken sandwich was juicy and the bread was toasted perfectly.'],
  [47, 'Anum', 4, 'Really tasty, loved the grilled flavor.'],
  [48, 'Yasir', 5, 'Club sandwich was stacked and delicious, came with good fries.'],
  [48, 'Sidra', 4, 'Great club sandwich, very filling.'],
  [51, 'Fahad', 4, 'Chicken wrap was good, fresh veggies inside.'],
  [51, 'Laiba', 3, 'Wrap was okay, a little dry.'],
  [49, 'Naveed', 5, 'Panini was crispy outside and cheesy inside.'],
  [49, 'Eman', 4, 'Really nice panini, warm and toasty.'],

  // ---- Shakes ----
  [40, 'Arham', 5, 'Chocolate shake was thick and rich, tasted like real chocolate.'],
  [40, 'Mahnoor A.', 4, 'Really good shake, a bit heavy but worth it.'],
  [43, 'Bushra', 5, 'Oreo shake was amazing, you could taste the cookies.'],
  [43, 'Hamza A.', 4, 'Great shake, very creamy.'],
  [42, 'Rimsha', 5, 'Strawberry shake was fresh and not too sweet.'],
  [42, 'Awais', 4, 'Good strawberry shake, nice and cold.'],
  [45, 'Nimra', 5, 'Mango shake tasted like fresh mangoes, so good.'],
  [45, 'Zain', 4, 'Really refreshing, perfect for summer.'],

  // ---- Desserts ----
  [6, 'Ayesha R.', 5, 'Chocolate cake was moist and the ganache was rich.'],
  [6, 'Bilal K.', 4, 'Very good cake, a little dense but tasty.'],
  [6, 'Sana K.', 5, 'The best chocolate cake I have had in a long time.'],
  [64, 'Hassan A.', 5, 'Brownie was fudgy and warm, perfect with ice cream.'],
  [64, 'Rabia S.', 4, 'Really good brownie, nice and chocolatey.'],
  [67, 'Umar', 4, 'Cookie was soft and had good chocolate chips.'],
  [67, 'Areeba S.', 5, 'Warm cookie, so good.'],
  [69, 'Fawad', 5, 'Cinnamon roll was soft and the icing was perfect.'],
  [69, 'Hira K.', 4, 'Really tasty, though a bit sweet.'],
  [71, 'Zoya', 5, 'Pancakes were fluffy and came with lots of syrup.'],
  [71, 'Saad', 4, 'Good pancakes, nice and soft.'],

  // ---- Cakes ----
  [63, 'Mahnoor K.', 5, 'Cheesecake was creamy and smooth, the base was perfect.'],
  [63, 'Ali H.', 4, 'Really good cheesecake, not too heavy.'],
  [65, 'Nida S.', 5, 'Red velvet cake was beautiful and tasted amazing.'],
  [65, 'Usman A.', 4, 'Great cake, moist and not too sweet.'],
  [66, 'Sara K.', 4, 'Carrot cake was nice, loved the walnuts.'],
  [66, 'Daniyal A.', 3, 'It was okay, a bit dry for me.'],

  // ---- Family Meals ----
  [7, 'Ahmed R.', 5, 'Family platter was huge, we were four people and still had leftovers. Everything was tasty.'],
  [7, 'Fatima A.', 4, 'Great value for the price, the wings were the best part.'],
  [7, 'Kamran S.', 5, 'Perfect for family dinner, everyone enjoyed it.'],
  [77, 'Nadia K.', 4, 'Breakfast platter was filling and fresh.'],
  [77, 'Imran A.', 5, 'Great spread, the eggs and toast were spot on.']
];

// Insert only reviews for products that exist, and skip any that would duplicate an existing review.
const [productRows] = await pool.query('SELECT id FROM products');
const validIds = new Set(productRows.map(p => Number(p.id)));

let inserted = 0;
let skipped = 0;
for (const [productId, customerName, rating, reviewText] of reviews) {
  if (!validIds.has(Number(productId))) {
    console.log(`SKIP (no product ${productId}): ${customerName}`);
    skipped++;
    continue;
  }
  const [existing] = await pool.query(
    'SELECT id FROM reviews WHERE product_id = ? AND customer_name = ? AND review_text = ?',
    [productId, customerName, reviewText]
  );
  if (existing.length) {
    console.log(`SKIP (duplicate): ${customerName} on product ${productId}`);
    skipped++;
    continue;
  }
  await pool.query(
    'INSERT INTO reviews (product_id, customer_name, rating, review_text, status) VALUES (?, ?, ?, ?, ?)',
    [productId, customerName, rating, reviewText, 'approved']
  );
  inserted++;
}

console.log(`\nInserted ${inserted} reviews, skipped ${skipped}.`);
await pool.end();