// Safe additive migration: expand Green Grounds Cafe menu with realistic products, matching images, add-ons.
await import('dotenv/config');
const { default: mysql } = await import('mysql2/promise');

const pool = await mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'green_grounds_cafe'
});

const CATEGORIES = [
  ['Coffee', 'Espresso-based classics and house signatures'],
  ['Cold Drinks', 'Chilled refreshers for warm afternoons'],
  ['Tea', 'Comforting brews with bright botanicals'],
  ['Shakes', 'Thick, creamy hand-blended shakes'],
  ['Sandwiches & Savory', 'Made-to-order sandwiches and wraps'],
  ['Pizza & Quick Bites', 'Cafe favorites, pizzas and snackable bites'],
  ['Desserts', 'Sweet finishes and baked treats'],
  ['Breakfast', 'Fresh starts served all day']
];

// [category, name, image, description, price, serving_size, calories, protein, carbs, fat, sugar, sodium, featured]
const PRODUCTS = [
  // Coffee
  ['Coffee', 'Espresso', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=700&q=80', 'A rich, concentrated shot of our house espresso with a golden crema and deep caramel notes.', 280, '30 ml', 5, 0.5, 1, 0, 0, 8, 0],
  ['Coffee', 'Double Espresso', 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=700&q=80', 'Two full espresso shots pulled together for an intense, bold pick-me-up.', 380, '60 ml', 10, 1, 2, 0, 0, 16, 0],
  ['Coffee', 'Americano', 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=700&q=80', 'Espresso softened with hot water for a smooth, full-bodied black coffee.', 320, '250 ml', 15, 1, 3, 0, 0, 6, 0],
  ['Coffee', 'Cappuccino', 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=700&q=80', 'Velvety espresso, steamed milk and a thick layer of soft cocoa-dusted foam.', 450, '250 ml', 120, 6, 12, 6, 10, 90, 1],
  ['Coffee', 'Cafe Latte', 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=700&q=80', 'Smooth espresso blended with plenty of creamy steamed milk and a light foam.', 480, '300 ml', 150, 7, 14, 7, 12, 95, 1],
  ['Coffee', 'Flat White', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=700&q=80', 'Double espresso with velvety micro-foamed milk, strong and silky.', 520, '200 ml', 140, 7, 11, 8, 4, 90, 0],
  ['Coffee', 'Mocha', 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=700&q=80', 'Espresso, steamed milk and rich chocolate, topped with a swirl of cream.', 540, '300 ml', 280, 8, 38, 11, 25, 110, 0],
  ['Coffee', 'Caramel Latte', 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=700&q=80', 'Smooth espresso blended with steamed milk and rich caramel syrup, finished with a light layer of foam.', 550, '300 ml', 210, 7, 36, 7, 26, 95, 1],
  ['Coffee', 'Vanilla Latte', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=700&q=80', 'Espresso, steamed milk and sweet vanilla syrup for a comforting classic.', 550, '300 ml', 200, 7, 34, 7, 24, 95, 0],
  ['Coffee', 'Hazelnut Latte', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=700&q=80', 'Espresso with smooth steamed milk and a warm, toasted hazelnut taste.', 560, '300 ml', 210, 7, 34, 8, 22, 98, 0],
  ['Coffee', 'Spanish Latte', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=700&q=80', 'Espresso with sweetened condensed milk and steamed milk — thick, sweet and rich.', 580, '300 ml', 260, 9, 42, 8, 34, 105, 0],
  ['Coffee', 'Iced Latte', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=700&q=80', 'Chilled espresso over ice with cold milk, smooth and refreshing.', 520, '350 ml', 140, 6, 14, 6, 4, 90, 0],
  ['Coffee', 'Iced Americano', 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=700&q=80', 'Espresso and cold water over ice, crisp and strong.', 440, '350 ml', 10, 1, 2, 0, 0, 6, 0],
  ['Coffee', 'Cold Brew', 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=700&q=80', 'Smooth coffee steeped cold for 18 hours, naturally sweet and less bitter.', 480, '350 ml', 12, 1, 2, 0, 0, 12, 0],
  ['Coffee', 'Iced Mocha', 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=700&q=80', 'Espresso, chocolate and chilled milk over ice, topped lightly with cream.', 570, '350 ml', 270, 8, 44, 11, 30, 108, 0],
  // Cold Drinks
  ['Cold Drinks', 'Iced Coffee', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=700&q=80', 'Chilled brewed coffee with milk and a touch of sweetness served over ice.', 440, '350 ml', 130, 3, 28, 2, 14, 30, 0],
  ['Cold Drinks', 'Frappe', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=700&q=80', 'Blended frozen coffee with milk and sugar, creamy and refreshing.', 520, '400 ml', 240, 4, 42, 4, 22, 60, 0],
  ['Cold Drinks', 'Chocolate Frappe', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=700&q=80', 'Frozen chocolate blended with milk and cocoa, topped with cream.', 560, '400 ml', 300, 6, 48, 9, 30, 90, 0],
  ['Cold Drinks', 'Caramel Frappe', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=700&q=80', 'Iced coffee blended with caramel syrup and milk, topped with cream.', 580, '400 ml', 320, 7, 52, 9, 32, 95, 0],
  ['Cold Drinks', 'Vanilla Frappe', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=700&q=80', 'Blended frozen vanilla coffee, sweet and creamy.', 560, '400 ml', 290, 7, 46, 8, 28, 90, 0],
  ['Cold Drinks', 'Mocha Frappe', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=700&q=80', 'Frozen mocha coffee blended with chocolate and ice cream.', 580, '400 ml', 330, 8, 52, 10, 30, 100, 0],
  ['Cold Drinks', 'Iced Tea', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=700&q=80', 'Freshly brewed black tea chilled over ice for a clean, crisp finish.', 360, '300 ml', 40, 0, 10, 0, 10, 4, 0],
  ['Cold Drinks', 'Lemon Iced Tea', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=700&q=80', 'Black tea with fresh lemon and a hint of sweetness served over ice.', 380, '300 ml', 60, 0, 15, 0, 12, 6, 0],
  ['Cold Drinks', 'Peach Iced Tea', 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=700&q=80', 'Refreshing tea with juicy peach notes over ice.', 400, '300 ml', 70, 0, 17, 0, 14, 8, 0],
  ['Cold Drinks', 'Fresh Lemonade', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=700&q=80', 'Freshly squeezed lemonade, tangy and sweet over ice.', 320, '350 ml', 90, 0, 22, 0, 18, 4, 0],
  // Tea
  ['Tea', 'Green Tea', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=700&q=80', 'Delicate green tea leaves steeped hot for a light, refreshing cup.', 260, '250 ml', 2, 0, 0, 0, 0, 2, 0],
  ['Tea', 'Black Tea', 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=700&q=80', 'Robust full-leaf black tea, brewed hot and served plain.', 220, '250 ml', 2, 0, 0, 0, 0, 2, 0],
  ['Tea', 'Masala Chai', 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=700&q=80', 'A warming house blend of black tea, milk and whole spices including cardamom and ginger.', 340, '250 ml', 80, 3, 10, 3, 8, 40, 1],
  ['Tea', 'Kashmiri Chai', 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=700&q=80', 'Pink-hued chai made with milk, almonds and cardamom and just a trace of saffron.', 400, '300 ml', 120, 4, 14, 5, 8, 30, 0],
  ['Tea', 'Lemon Tea', 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=700&q=80', 'Hot black tea brightened with fresh lemon.', 280, '250 ml', 5, 0, 1, 0, 0, 4, 0],
  ['Tea', 'Ginger Tea', 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=700&q=80', 'Lively hot tea infused with fresh ginger for a warming glow.', 300, '250 ml', 5, 0, 1, 0, 0, 3, 0],
  ['Tea', 'Mint Tea', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=700&q=80', 'Fragrant green tea with fresh mint leaves.', 290, '250 ml', 2, 0, 0, 0, 0, 2, 0],
  // Shakes
  ['Shakes', 'Chocolate Shake', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=700&q=80', 'Thick chocolate ice cream blended with milk and rich cocoa.', 520, '400 ml', 440, 10, 64, 16, 46, 140, 0],
  ['Shakes', 'Vanilla Shake', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=700&q=80', 'Creamy vanilla ice cream blended into a silky, sweet shake.', 500, '400 ml', 400, 8, 50, 14, 38, 120, 0],
  ['Shakes', 'Strawberry Shake', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=700&q=80', 'Fresh strawberries whipped with ice cream for a fruity shake.', 520, '400 ml', 390, 8, 54, 10, 24, 60, 0],
  ['Shakes', 'Oreo Shake', 'https://images.unsplash.com/photo-1590086782792-42dd2350140d?w=700&q=80', 'Vanilla and chocolate cookies blended into an indulgent cream.', 580, '400 ml', 480, 9, 62, 16, 30, 190, 1],
  ['Shakes', 'Banana Shake', 'https://images.unsplash.com/photo-1546173159-315724a31696?w=700&q=80', 'Ripe bananas blended with milk and vanilla for a naturally sweet shake.', 460, '400 ml', 340, 9, 46, 6, 20, 60, 0],
  ['Shakes', 'Mango Shake', 'https://images.unsplash.com/photo-1546173159-315724a31696?w=700&q=80', 'Chilled mango pulp blended with creamy milk and ice.', 480, '400 ml', 380, 8, 58, 8, 24, 50, 0],
  // Sandwiches & Savory
  ['Sandwiches & Savory', 'Chicken Sandwich', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=700&q=80', 'Grilled chicken fillet, crisp lettuce, tomato and our house sauce in toasted bread.', 550, '1 serving', 430, 30, 40, 16, 6, 480, 0],
  ['Sandwiches & Savory', 'Grilled Chicken Sandwich', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=700&q=80', 'Juicy grilled chicken breast with crunchy veggies and garlic mayo on seeded bread.', 620, '1 serving', 470, 34, 42, 18, 6, 520, 1],
  ['Sandwiches & Savory', 'Club Sandwich', 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=700&q=80', 'Triple-decker with chicken, egg, lettuce, tomato and mayo.', 680, '1 serving', 560, 40, 48, 22, 8, 620, 0],
  ['Sandwiches & Savory', 'Chicken Panini', 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=700&q=80', 'Pressed panini with chicken, mozzarella, roasted peppers and herbed sauce.', 640, '1 serving', 500, 36, 46, 20, 6, 540, 0],
  ['Sandwiches & Savory', 'Cheese Sandwich', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=700&q=80', 'Golden toast with layers of melting cheddar and mozzarella.', 450, '1 serving', 380, 16, 34, 14, 4, 480, 0],
  ['Sandwiches & Savory', 'Chicken Wrap', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=700&q=80', 'Grilled chicken, crunchy slaw and creamy sauce in a soft tortilla.', 580, '1 wrap', 420, 30, 36, 16, 6, 460, 0],
  ['Sandwiches & Savory', 'Grilled Cheese', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=700&q=80', 'Butter-toasted bread with a melty, cheesy centre.', 440, '1 serving', 390, 15, 30, 18, 5, 460, 0],
  // Pizza & Quick Bites
  ['Pizza & Quick Bites', 'Chicken Burger', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&q=80', 'Crisp fried chicken, lettuce, pickles and our cafe sauce on a toasted bun.', 790, '1 burger', 620, 30, 58, 34, 8, 780, 1],
  ['Pizza & Quick Bites', 'Chicken Pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&q=80', 'Wood-fired crust topped with mozzarella, seasoned chicken and a rich tomato sauce.', 850, '1 medium (9")', 860, 40, 84, 36, 6, 900, 0],
  ['Pizza & Quick Bites', 'Cheese Pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&q=80', 'Classic tomato sauce and a generous layer of mozzarella on a thin crispy crust.', 740, '1 medium (9")', 760, 28, 82, 26, 4, 700, 0],
  ['Pizza & Quick Bites', 'Pepperoni Pizza', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=700&q=80', 'Pepperoni slices over melted cheese and tangy tomato sauce.', 920, '1 medium (9")', 900, 34, 78, 42, 8, 1000, 0],
  ['Pizza & Quick Bites', 'Garlic Bread', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&q=80', 'Warm baguette wedges brushed with garlic butter and herbs.', 380, '6 pieces', 280, 7, 34, 10, 2, 380, 0],
  ['Pizza & Quick Bites', 'Chicken Nuggets', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&q=80', 'Crispy golden nuggets with tender chicken inside, served with dip.', 520, '8 pieces', 420, 24, 34, 18, 2, 520, 0],
  ['Pizza & Quick Bites', 'French Fries', 'https://images.unsplash.com/photo-1560421683-6856ea585c78?w=700&q=80', 'Golden, crispy fries with sea salt, hot and freshly served.', 340, '150 g', 360, 4, 44, 18, 1, 260, 0],
  ['Pizza & Quick Bites', 'Loaded Fries', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&q=80', 'Crispy fries smothered in cheese sauce, jalapeños and garlic mayo.', 540, '200 g', 520, 12, 46, 28, 8, 640, 0],
  ['Pizza & Quick Bites', 'Mozzarella Sticks', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&q=80', 'Crisp golden sticks of melted mozzarella with a warm marinara dip.', 480, '6 pieces', 390, 18, 38, 20, 6, 760, 0],
  // Desserts
  ['Desserts', 'Chocolate Cake', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&q=80', 'Rich chocolate sponge with a glossy ganache and a soft crumb.', 560, '1 slice / 120 g', 380, 4, 52, 16, 42, 220, 1],
  ['Desserts', 'Cheesecake', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=700&q=80', 'Creamy baked cheesecake on a buttery graham crust.', 580, '1 slice / 130 g', 380, 6, 30, 24, 24, 260, 1],
  ['Desserts', 'Brownie', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&q=80', 'Fudgy chocolate brownie, served warm and rich with chocolate chunks.', 380, '1 piece / 90 g', 240, 3, 32, 10, 14, 160, 0],
  ['Desserts', 'Red Velvet Cake', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&q=80', 'Classic red velvet layers with cream cheese frosting.', 600, '1 slice / 120 g', 460, 6, 42, 26, 32, 220, 0],
  ['Desserts', 'Carrot Cake', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=700&q=80', 'Moist spiced cake with grated carrot, walnut and cream cheese frosting.', 540, '1 slice / 130 g', 420, 6, 40, 26, 28, 250, 0],
  ['Desserts', 'Chocolate Chip Cookie', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=700&q=80', 'Chewy cookie packed with dark chocolate chips.', 220, '1 piece', 180, 3, 24, 8, 10, 120, 0],
  ['Desserts', 'Muffin', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=700&q=80', 'Soft baked muffin, gently sweet with a tender crumb.', 240, '1 piece', 250, 4, 32, 10, 14, 180, 0],
  ['Desserts', 'Cinnamon Roll', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=700&q=80', 'Swirled cinnamon dough with creamy icing, warm and fragrant.', 320, '1 piece', 320, 4, 44, 12, 18, 180, 0],
  ['Desserts', 'Waffle', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=700&q=80', 'Crisp golden waffle served warm, perfect for syrups and toppings.', 400, '1 waffle', 280, 6, 38, 12, 8, 320, 0],
  ['Desserts', 'Pancakes', 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=700&q=80', 'Fluffy stack of pancakes with maple syrup and a pat of butter.', 460, '3 pieces', 340, 12, 48, 10, 12, 380, 0],
  // Breakfast
  ['Breakfast', 'Croissant', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=700&q=80', 'Flaky, buttery laminated croissant baked until golden.', 280, '1 piece', 260, 6, 30, 14, 5, 200, 0],
  ['Breakfast', 'Chocolate Croissant', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&q=80', 'Flaky croissant filled with dark chocolate sticks.', 340, '1 piece', 300, 6, 32, 15, 10, 210, 0],
  ['Breakfast', 'Egg Sandwich', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=700&q=80', 'Scrambled eggs, melted cheddar and herb mayo on toasted bread.', 420, '1 serving', 340, 18, 30, 14, 4, 360, 0],
  ['Breakfast', 'Omelette', 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=700&q=80', 'Three-egg omelette with peppers, onions and herbs, served with toast.', 480, '1 serving', 320, 18, 9, 24, 8, 420, 0],
  ['Breakfast', 'French Toast', 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=700&q=80', 'Thick brioche soaked in sweet egg custard, griddled and dusted with sugar.', 520, '2 slices', 420, 12, 48, 16, 14, 320, 0],
  ['Breakfast', 'Breakfast Platter', 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=700&q=80', 'A generous plate of eggs, sourdough, grilled tomato and house potatoes.', 780, '1 platter', 680, 32, 70, 40, 12, 900, 0]
];

// addon groups: [name, price]
const ADDON_GROUPS = {
  coffee: [['Extra Espresso Shot', 120], ['Caramel Syrup', 80], ['Vanilla Syrup', 80], ['Hazelnut Syrup', 80], ['Oat Milk', 100], ['Almond Milk', 120]],
  sweet: [['Extra Whipped Cream', 90], ['Extra Chocolate Sauce', 80], ['Caramel Sauce', 80]],
  waffle: [['Maple Syrup', 80], ['Ice Cream Scoop', 120], ['Fresh Fruit', 100], ['Extra Whipped Cream', 90]],
  savory: [['Extra Cheese', 100], ['Extra Chicken', 180], ['Fried Egg', 100], ['Garlic Mayo', 60], ['Chipotle Sauce', 60]],
  fries: [['Cheese Sauce', 100], ['Jalapeños', 70], ['Chicken Topping', 180], ['Garlic Mayo', 60]]
};

// product name -> addon group keys
const MENU = {
  Espresso: ['coffee'], 'Double Espresso': ['coffee'], Americano: ['coffee'], Cappuccino: ['coffee'], 'Cafe Latte': ['coffee'],
  'Flat White': ['coffee'], Mocha: ['coffee'], 'Caramel Latte': ['coffee'], 'Vanilla Latte': ['coffee'], 'Hazelnut Latte': ['coffee'],
  'Spanish Latte': ['coffee'], 'Iced Latte': ['coffee'], 'Iced Americano': ['coffee'], 'Cold Brew': ['coffee'], 'Iced Mocha': ['coffee'],
  'Iced Coffee': ['coffee', 'sweet'], Frappe: ['coffee', 'sweet'], 'Chocolate Frappe': ['sweet'], 'Caramel Frappe': ['sweet'], 'Vanilla Frappe': ['sweet'], 'Mocha Frappe': ['sweet'],
  Waffle: ['waffle'], Pancakes: ['waffle'], Brownie: ['sweet'], 'Chocolate Cake': ['sweet'], Cheesecake: ['sweet'], 'Red Velvet Cake': ['sweet'], 'Carrot Cake': ['sweet'],
  'Chicken Sandwich': ['savory'], 'Grilled Chicken Sandwich': ['savory'], 'Club Sandwich': ['savory'], 'Chicken Panini': ['savory'], 'Cheese Sandwich': ['savory'], 'Chicken Wrap': ['savory'], 'Grilled Cheese': ['savory'],
  'Chicken Burger': ['savory', 'fries'], 'French Fries': ['fries'], 'Loaded Fries': ['fries'],
  'Garlic Bread': ['sweet'], 'Mozzarella Sticks': ['savory', 'sweet'], 'Chicken Nuggets': ['savory', 'sweet']
};

// Products need a UNIQUE name for idempotent upserts — additive, safe.
await pool.query(`ALTER TABLE products ADD UNIQUE INDEX uq_products_name (name)`).catch(() => {});

const catId = new Map();
for (const [name, desc] of CATEGORIES) {
  await pool.query('INSERT INTO categories (name, description) VALUES (?, ?) ON DUPLICATE KEY UPDATE description = VALUES(description)', [name, desc]);
  const [rows] = await pool.query('SELECT id FROM categories WHERE name = ?', [name]);
  catId.set(name, rows[0].id);
}

// Insert products by name (update existing records to clean image/description/nutrition)
const productIds = new Map();
for (const [cat, name, image, desc, price, size, cal, pro, carbs, fat, sugar, sodium, featured] of PRODUCTS) {
  await pool.query(
    `INSERT INTO products (category_id, name, description, price, serving_size, image, featured, calories, protein, carbohydrates, fat, sugar, sodium) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE category_id = VALUES(category_id), description = VALUES(description), price = VALUES(price), serving_size = VALUES(serving_size), image = VALUES(image), featured = VALUES(featured), calories = VALUES(calories), protein = VALUES(protein), carbohydrates = VALUES(carbohydrates), fat = VALUES(fat), sugar = VALUES(sugar), sodium = VALUES(sodium)`,
    [catId.get(cat), name, desc, price, size, image, featured, cal, pro, carbs, fat, sugar, sodium]
  );
  const [rows] = await pool.query('SELECT id FROM products WHERE name = ? LIMIT 1', [name]);
  productIds.set(name, rows[0].id);
}

// addons
const addonIds = new Map();
for (const [addonName, price] of [...ADDON_GROUPS.coffee, ...ADDON_GROUPS.sweet, ...ADDON_GROUPS.waffle, ...ADDON_GROUPS.savory, ...ADDON_GROUPS.fries]) {
  await pool.query('INSERT INTO addons (name, price) VALUES (?, ?) ON DUPLICATE KEY UPDATE price = VALUES(price)', [addonName, price]);
  const [rows] = await pool.query('SELECT id FROM addons WHERE name = ? LIMIT 1', [addonName]);
  addonIds.set(addonName, rows[0].id);
}

// link addons to products
const link = async (productName, addonName) => {
  const pid = productIds.get(productName);
  const aid = addonIds.get(addonName);
  if (pid && aid) await pool.query('INSERT IGNORE INTO product_addons (product_id, addon_id) VALUES (?, ?)', [pid, aid]);
};
for (const [productName, groups] of Object.entries(MENU)) {
  for (const group of groups) {
    const list = ADDON_GROUPS[group] || [];
    for (const [addonName] of list) await link(productName, addonName);
  }
}

console.log('products:', productIds.size, '| addons:', addonIds.size);
console.log('menu migration complete');
await pool.end();