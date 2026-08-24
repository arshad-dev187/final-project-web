-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 24, 2026 at 08:15 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `green_grounds_cafe`
--

-- --------------------------------------------------------

--
-- Table structure for table `addons`
--

CREATE TABLE `addons` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(80) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `available` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addons`
--

INSERT INTO `addons` (`id`, `name`, `price`, `available`, `created_at`) VALUES
(1, 'Extra Cheese', 100.00, 1, '2026-08-14 17:10:40'),
(2, 'Extra Chips', 150.00, 1, '2026-08-14 17:10:40'),
(3, 'Extra Spicy', 0.00, 1, '2026-08-14 17:10:40'),
(4, 'extra cream', 100.00, 1, '2026-08-15 18:07:27'),
(5, 'Extra Espresso Shot', 120.00, 1, '2026-08-20 17:16:02'),
(6, 'Caramel Syrup', 80.00, 1, '2026-08-20 17:16:02'),
(7, 'Vanilla Syrup', 80.00, 1, '2026-08-20 17:16:02'),
(8, 'Hazelnut Syrup', 80.00, 1, '2026-08-20 17:16:02'),
(9, 'Oat Milk', 100.00, 1, '2026-08-20 17:16:02'),
(10, 'Almond Milk', 120.00, 1, '2026-08-20 17:16:02'),
(11, 'Extra Whipped Cream', 90.00, 1, '2026-08-20 17:16:02'),
(12, 'Extra Chocolate Sauce', 80.00, 1, '2026-08-20 17:16:02'),
(13, 'Caramel Sauce', 80.00, 1, '2026-08-20 17:16:02'),
(14, 'Maple Syrup', 80.00, 1, '2026-08-20 17:16:02'),
(15, 'Ice Cream Scoop', 120.00, 1, '2026-08-20 17:16:02'),
(16, 'Fresh Fruit', 100.00, 1, '2026-08-20 17:16:02'),
(17, 'Extra Whipped Cream', 90.00, 1, '2026-08-20 17:16:02'),
(18, 'Extra Cheese', 100.00, 1, '2026-08-20 17:16:02'),
(19, 'Extra Chicken', 180.00, 1, '2026-08-20 17:16:02'),
(20, 'Fried Egg', 100.00, 1, '2026-08-20 17:16:02'),
(21, 'Garlic Mayo', 60.00, 1, '2026-08-20 17:16:02'),
(22, 'Chipotle Sauce', 60.00, 1, '2026-08-20 17:16:02'),
(23, 'Cheese Sauce', 100.00, 1, '2026-08-20 17:16:02'),
(24, 'Jalapeños', 70.00, 1, '2026-08-20 17:16:02'),
(25, 'Chicken Topping', 180.00, 1, '2026-08-20 17:16:02'),
(26, 'Garlic Mayo', 60.00, 1, '2026-08-20 17:16:02'),
(27, 'Extra Espresso Shot', 120.00, 1, '2026-08-22 17:29:49'),
(28, 'Caramel Syrup', 80.00, 1, '2026-08-22 17:29:49'),
(29, 'Vanilla Syrup', 80.00, 1, '2026-08-22 17:29:49'),
(30, 'Hazelnut Syrup', 80.00, 1, '2026-08-22 17:29:49'),
(31, 'Oat Milk', 100.00, 1, '2026-08-22 17:29:49'),
(32, 'Almond Milk', 120.00, 1, '2026-08-22 17:29:49'),
(33, 'Extra Whipped Cream', 90.00, 1, '2026-08-22 17:29:49'),
(34, 'Extra Chocolate Sauce', 80.00, 1, '2026-08-22 17:29:49'),
(35, 'Caramel Sauce', 80.00, 1, '2026-08-22 17:29:49'),
(36, 'Maple Syrup', 80.00, 1, '2026-08-22 17:29:49'),
(37, 'Ice Cream Scoop', 120.00, 1, '2026-08-22 17:29:49'),
(38, 'Fresh Fruit', 100.00, 1, '2026-08-22 17:29:49'),
(39, 'Extra Whipped Cream', 90.00, 1, '2026-08-22 17:29:49'),
(40, 'Extra Cheese', 100.00, 1, '2026-08-22 17:29:49'),
(41, 'Extra Chicken', 180.00, 1, '2026-08-22 17:29:49'),
(42, 'Fried Egg', 100.00, 1, '2026-08-22 17:29:49'),
(43, 'Garlic Mayo', 60.00, 1, '2026-08-22 17:29:49'),
(44, 'Chipotle Sauce', 60.00, 1, '2026-08-22 17:29:49'),
(45, 'Cheese Sauce', 100.00, 1, '2026-08-22 17:29:49'),
(46, 'Jalapeños', 70.00, 1, '2026-08-22 17:29:49'),
(47, 'Chicken Topping', 180.00, 1, '2026-08-22 17:29:49'),
(48, 'Garlic Mayo', 60.00, 1, '2026-08-22 17:29:49');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(80) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'Coffee', 'Espresso-based classics and house signatures', '2026-08-09 11:33:09'),
(2, 'Tea', 'Comforting brews with bright botanicals', '2026-08-09 11:33:09'),
(3, 'Cold Drinks', 'Chilled refreshers for warm afternoons', '2026-08-09 11:33:09'),
(4, 'Breakfast', 'Fresh starts served all day', '2026-08-09 11:33:09'),
(5, 'Snacks', 'Small plates for sharing', '2026-08-09 11:33:09'),
(6, 'Fast Food', 'Cafe favorites made to order', '2026-08-09 11:33:09'),
(7, 'Desserts', 'Sweet finishes and baked treats', '2026-08-09 11:33:09'),
(8, 'Cakes', 'Celebration slices and whole cakes', '2026-08-09 11:33:09'),
(9, 'Family Meals', 'Generous spreads for the table', '2026-08-09 11:33:09'),
(13, 'Shakes', 'Thick, creamy hand-blended shakes', '2026-08-20 17:16:02'),
(14, 'Sandwiches & Savory', 'Made-to-order sandwiches and wraps', '2026-08-20 17:16:02'),
(15, 'Pizza & Quick Bites', 'Cafe favorites, pizzas and snackable bites', '2026-08-20 17:16:02');

-- --------------------------------------------------------

--
-- Table structure for table `complaints`
--

CREATE TABLE `complaints` (
  `id` int(10) UNSIGNED NOT NULL,
  `customer_name` varchar(120) NOT NULL,
  `email` varchar(190) DEFAULT NULL,
  `phone` varchar(40) DEFAULT NULL,
  `category` enum('Food / Product','Service','Staff','Order','Cleanliness','Other') NOT NULL,
  `message` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('pending','in_progress','resolved','rejected') NOT NULL DEFAULT 'pending',
  `admin_note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `complaints`
--

INSERT INTO `complaints` (`id`, `customer_name`, `email`, `phone`, `category`, `message`, `image`, `status`, `admin_note`, `created_at`, `updated_at`) VALUES
(1, 'sadgd', 'adadas@gmail.com', '736237527', 'Food / Product', 'dhsdjgdsjjadsdad', '/uploads/50870259-fcbe-400c-8723-c32ab7b742f8.jpg', 'resolved', 'sorry for inconveinice', '2026-08-19 15:42:35', '2026-08-19 16:13:51');

-- --------------------------------------------------------

--
-- Table structure for table `gallery`
--

CREATE TABLE `gallery` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(140) NOT NULL,
  `image` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gallery`
--

INSERT INTO `gallery` (`id`, `title`, `image`, `description`, `created_at`) VALUES
(2, 'test', '/uploads/19e03ef2-ed9f-4436-b450-665e914a34a0.jpeg', 'test', '2026-08-10 16:55:23');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(190) NOT NULL,
  `phone` varchar(40) DEFAULT NULL,
  `subject` varchar(180) NOT NULL,
  `message` text NOT NULL,
  `status` enum('unread','read') NOT NULL DEFAULT 'unread',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `name`, `email`, `phone`, `subject`, `message`, `status`, `created_at`) VALUES
(1, 'ash', 'ash@gmail.com', '883273844', 'coffee', 'i would like a coffww', 'unread', '2026-08-12 09:13:02');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(10) UNSIGNED NOT NULL,
  `order_number` varchar(20) NOT NULL,
  `customer_name` varchar(120) NOT NULL,
  `order_type` enum('dine_in','take_away','online') NOT NULL,
  `table_number` varchar(20) DEFAULT NULL,
  `contact` varchar(190) DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `tax_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','preparing','ready','completed','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `customer_name`, `order_type`, `table_number`, `contact`, `subtotal`, `tax_rate`, `tax_amount`, `total`, `status`, `created_at`, `updated_at`) VALUES
(1, 'GG-00001', 'Test Customer', 'dine_in', 'T4', NULL, 1760.00, 0.00, 0.00, 1760.00, 'pending', '2026-08-14 17:10:40', '2026-08-14 17:10:40'),
(2, 'GG-00002', 'ash', 'online', NULL, 'asghsasa', 2450.00, 0.00, 0.00, 2450.00, 'pending', '2026-08-15 17:12:09', '2026-08-15 17:12:09'),
(3, 'GG-00003', 'ash', 'online', NULL, 'asahshghaa', 2760.00, 0.00, 0.00, 2760.00, 'pending', '2026-08-15 17:29:25', '2026-08-15 17:29:25'),
(4, 'GG-00004', 'arshad', 'online', NULL, 'arshad@gmail.com', 2930.00, 0.00, 0.00, 2930.00, 'pending', '2026-08-24 17:03:55', '2026-08-24 17:03:55');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(10) UNSIGNED NOT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED DEFAULT NULL,
  `product_name_snapshot` varchar(140) NOT NULL,
  `unit_price_snapshot` decimal(10,2) NOT NULL,
  `quantity` smallint(5) UNSIGNED NOT NULL,
  `line_total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name_snapshot`, `unit_price_snapshot`, `quantity`, `line_total`) VALUES
(1, 1, 5, 'Chicken Burger', 780.00, 2, 1760.00),
(2, 2, 7, 'Family Platter', 2450.00, 1, 2450.00),
(3, 3, 3, 'Masala Chai', 320.00, 2, 640.00),
(4, 3, 1, 'Cappuccino', 480.00, 2, 960.00),
(5, 3, 1, 'Cappuccino', 480.00, 2, 1160.00),
(6, 4, 74, 'Egg Sandwich', 420.00, 1, 420.00),
(7, 4, 56, 'Pepperoni Pizza', 920.00, 1, 920.00),
(8, 4, 55, 'Cheese Pizza', 740.00, 1, 740.00),
(9, 4, 71, 'Pancakes', 460.00, 1, 850.00);

-- --------------------------------------------------------

--
-- Table structure for table `order_item_addons`
--

CREATE TABLE `order_item_addons` (
  `id` int(10) UNSIGNED NOT NULL,
  `order_item_id` int(10) UNSIGNED NOT NULL,
  `addon_id` int(10) UNSIGNED DEFAULT NULL,
  `addon_name_snapshot` varchar(80) NOT NULL,
  `addon_price_snapshot` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_item_addons`
--

INSERT INTO `order_item_addons` (`id`, `order_item_id`, `addon_id`, `addon_name_snapshot`, `addon_price_snapshot`) VALUES
(1, 1, 1, 'Extra Cheese', 100.00),
(2, 1, 3, 'Extra Spicy', 0.00),
(3, 5, 1, 'Extra Cheese', 100.00),
(4, 9, 14, 'Maple Syrup', 80.00),
(5, 9, 15, 'Ice Cream Scoop', 120.00),
(6, 9, 16, 'Fresh Fruit', 100.00),
(7, 9, 11, 'Extra Whipped Cream', 90.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(10) UNSIGNED NOT NULL,
  `category_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(140) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `available` tinyint(1) NOT NULL DEFAULT 1,
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `serving_size` varchar(80) DEFAULT NULL,
  `calories` int(10) UNSIGNED DEFAULT NULL,
  `protein` decimal(6,2) DEFAULT NULL,
  `carbohydrates` decimal(6,2) DEFAULT NULL,
  `fat` decimal(6,2) DEFAULT NULL,
  `sugar` decimal(6,2) DEFAULT NULL,
  `sodium` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `price`, `discount_price`, `image`, `available`, `featured`, `created_at`, `updated_at`, `serving_size`, `calories`, `protein`, `carbohydrates`, `fat`, `sugar`, `sodium`) VALUES
(1, 1, 'Cappuccino', 'Velvety espresso, steamed milk and a thick layer of soft cocoa-dusted foam.', 450.00, NULL, '/uploads/4f0a793d-6e94-43d5-a121-0ceaf7cbf66c.jpg', 1, 1, '2026-08-09 11:33:09', '2026-08-23 17:40:10', '250 ml', 120, 6.00, 12.00, 6.00, 10.00, 90),
(2, 1, 'Caramel Macchiato', 'Layered espresso with caramel and steamed milk.', 620.00, 500.00, '/uploads/957fd067-ff5e-49c9-b52b-2bf5a8329806.jpg', 1, 1, '2026-08-09 11:33:09', '2026-08-23 17:40:40', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 2, 'Masala Chai', 'A warming house blend of black tea, milk and whole spices including cardamom and ginger.', 340.00, NULL, '/uploads/749f674d-4aed-4204-81b3-847622240b6b.jpg', 1, 1, '2026-08-09 11:33:09', '2026-08-23 17:42:09', '250 ml', 80, 3.00, 10.00, 3.00, 8.00, 40),
(4, 4, 'Green Grounds Breakfast', 'Eggs, sourdough, grilled tomatoes and house potatoes.', 850.00, NULL, '/uploads/289c3b00-84e2-4e1e-966f-8f0b5b9f075b.jpg', 1, 1, '2026-08-09 11:33:09', '2026-08-23 17:29:15', '690g', 1200, 50.00, 324.88, 57.00, 11.83, 810),
(5, 15, 'Chicken Burger', 'Crisp fried chicken, lettuce, pickles and our cafe sauce on a toasted bun.', 790.00, NULL, '/uploads/3686bae2-d796-4e7e-b911-8859b4191a55.jpg', 1, 1, '2026-08-09 11:33:09', '2026-08-23 17:41:43', '1 burger', 620, 30.00, 58.00, 34.00, 8.00, 780),
(6, 7, 'Chocolate Cake', 'Rich chocolate sponge with a glossy ganache and a soft crumb.', 560.00, NULL, '/uploads/b5589c4e-8e32-476d-9e76-ffca7cbf659b.jpg', 1, 1, '2026-08-09 11:33:09', '2026-08-23 17:40:58', '1 slice / 120 g', 380, 4.00, 52.00, 16.00, 42.00, 220),
(7, 9, 'Family Platter', 'A generous spread of wings, fries, sliders and dips.', 2450.00, NULL, '/uploads/a58f9118-55ab-4850-9fbf-ff8e00aca6f7.jpg', 1, 1, '2026-08-09 11:33:09', '2026-08-23 17:41:18', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 1, 'Espresso', 'A rich, concentrated shot of our house espresso with a golden crema and deep caramel notes.', 280.00, NULL, '/uploads/4d962837-a441-4436-b1ba-d44451e2893c.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 18:36:03', '30 ml', 5, 0.50, 1.00, 0.00, 0.00, 8),
(9, 1, 'Double Espresso', 'Two full espresso shots pulled together for an intense, bold pick-me-up.', 380.00, NULL, '/uploads/1c78bb3b-f6ea-43ca-8cf8-b49214b40ddf.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 18:36:51', '60 ml', 10, 1.00, 2.00, 0.00, 0.00, 16),
(10, 1, 'Americano', 'Espresso softened with hot water for a smooth, full-bodied black coffee.', 320.00, NULL, '/uploads/8e42830e-6b41-4b15-80ea-77d08c3bcdf4.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 18:39:20', '250 ml', 15, 1.00, 3.00, 0.00, 0.00, 6),
(12, 1, 'Cafe Latte', 'Smooth espresso blended with plenty of creamy steamed milk and a light foam.', 480.00, NULL, '/uploads/498b6534-6e74-45ed-bc6d-3e7b96ab9d56.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:44:06', '300 ml', 150, 7.00, 14.00, 7.00, 12.00, 95),
(13, 1, 'Flat White', 'Double espresso with velvety micro-foamed milk, strong and silky.', 520.00, NULL, '/uploads/5611c23f-575f-4916-9384-1741d6a354db.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:44:42', '200 ml', 140, 7.00, 11.00, 8.00, 4.00, 90),
(14, 1, 'Mocha', 'Espresso, steamed milk and rich chocolate, topped with a swirl of cream.', 540.00, NULL, '/uploads/205cb666-2d1f-4e48-bb48-cf2e280dfb1c.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 18:39:56', '300 ml', 280, 8.00, 38.00, 11.00, 25.00, 110),
(15, 1, 'Caramel Latte', 'Smooth espresso blended with steamed milk and rich caramel syrup, finished with a light layer of foam.', 550.00, NULL, '/uploads/4e2bc1f6-c93e-4bbd-bfa9-47607412a40c.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 18:43:34', '300 ml', 210, 7.00, 36.00, 7.00, 26.00, 95),
(16, 1, 'Vanilla Latte', 'Espresso, steamed milk and sweet vanilla syrup for a comforting classic.', 550.00, NULL, '/uploads/c8743ce3-99f2-4b3e-8c73-562b08627fef.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 18:43:56', '300 ml', 200, 7.00, 34.00, 7.00, 24.00, 95),
(17, 1, 'Hazelnut Latte', 'Espresso with smooth steamed milk and a warm, toasted hazelnut taste.', 560.00, NULL, '/uploads/72bdc98d-0d2e-4469-9802-8f18af45fd7d.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 18:44:40', '300 ml', 210, 7.00, 34.00, 8.00, 22.00, 98),
(18, 1, 'Spanish Latte', 'Espresso with sweetened condensed milk and steamed milk — thick, sweet and rich.', 580.00, NULL, '/uploads/d8e14161-1cea-44de-bbf3-e3169dd4c46c.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 18:46:09', '300 ml', 260, 9.00, 42.00, 8.00, 34.00, 105),
(19, 1, 'Iced Latte', 'Chilled espresso over ice with cold milk, smooth and refreshing.', 520.00, NULL, '/uploads/2012603d-c669-4947-8c89-ccbe3d7b274c.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 18:48:10', '350 ml', 140, 6.00, 14.00, 6.00, 4.00, 90),
(20, 1, 'Iced Americano', 'Espresso and cold water over ice, crisp and strong.', 440.00, NULL, '/uploads/40c2bd83-298d-455d-b95c-a761d439f704.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 18:48:40', '350 ml', 10, 1.00, 2.00, 0.00, 0.00, 6),
(21, 1, 'Cold Brew', 'Smooth coffee steeped cold for 18 hours, naturally sweet and less bitter.', 480.00, NULL, '/uploads/67af4f6a-2752-48f1-b9f8-2273032ffb79.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 18:49:41', '350 ml', 12, 1.00, 2.00, 0.00, 0.00, 12),
(22, 1, 'Iced Mocha', 'Espresso, chocolate and chilled milk over ice, topped lightly with cream.', 570.00, NULL, '/uploads/8b8f4f7d-dbe7-4291-b732-6730047486f0.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 18:52:39', '350 ml', 270, 8.00, 44.00, 11.00, 30.00, 108),
(23, 3, 'Iced Coffee', 'Chilled brewed coffee with milk and a touch of sweetness served over ice.', 440.00, NULL, '/uploads/9b86efdd-f4dd-4465-8877-1ab00785ef7e.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 18:53:29', '350 ml', 130, 3.00, 28.00, 2.00, 14.00, 30),
(24, 3, 'Frappe', 'Blended frozen coffee with milk and sugar, creamy and refreshing.', 520.00, NULL, '/uploads/d295b18b-c6ec-4cf9-856f-4d5034b4855f.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 18:54:00', '400 ml', 240, 4.00, 42.00, 4.00, 22.00, 60),
(25, 3, 'Chocolate Frappe', 'Frozen chocolate blended with milk and cocoa, topped with cream.', 560.00, NULL, '/uploads/e81881f1-58f4-40aa-b6c0-e8028224f995.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 18:56:06', '400 ml', 300, 6.00, 48.00, 9.00, 30.00, 90),
(26, 3, 'Caramel Frappe', 'Iced coffee blended with caramel syrup and milk, topped with cream.', 580.00, NULL, '/uploads/96b27541-3436-4bcb-bdbd-80ab5078facc.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 18:59:44', '400 ml', 320, 7.00, 52.00, 9.00, 32.00, 95),
(27, 3, 'Vanilla Frappe', 'Blended frozen vanilla coffee, sweet and creamy.', 560.00, NULL, '/uploads/2afd8106-d598-4a04-8953-252d47b8130f.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 18:59:08', '400 ml', 290, 7.00, 46.00, 8.00, 28.00, 90),
(28, 3, 'Mocha Frappe', 'Frozen mocha coffee blended with chocolate and ice cream.', 580.00, NULL, '/uploads/368c8654-0607-4406-a2ba-503b5cdc2074.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 19:01:03', '400 ml', 330, 8.00, 52.00, 10.00, 30.00, 100),
(29, 2, 'Iced Tea', 'Freshly brewed black tea chilled over ice for a clean, crisp finish.', 360.00, NULL, '/uploads/354c1edb-d8dd-4806-9b72-cff025da3065.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 19:09:16', '300 ml', 40, 0.00, 10.00, 0.00, 10.00, 4),
(30, 2, 'Lemon Iced Tea', 'Black tea with fresh lemon and a hint of sweetness served over ice.', 380.00, NULL, '/uploads/2d23e4fa-cc11-44ac-857a-5de9f26a9930.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 19:06:08', '300 ml', 60, 0.00, 15.00, 0.00, 12.00, 6),
(31, 2, 'Peach Iced Tea', 'Refreshing tea with juicy peach notes over ice.', 400.00, NULL, '/uploads/0446badb-fcc6-4971-8ae4-d21d85afb229.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 19:10:24', '300 ml', 70, 0.00, 17.00, 0.00, 14.00, 8),
(32, 3, 'Fresh Lemonade', 'Freshly squeezed lemonade, tangy and sweet over ice.', 320.00, NULL, '/uploads/6372b9f0-4a7e-4fe9-a1aa-78dcfb25ad0c.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 19:10:48', '350 ml', 90, 0.00, 22.00, 0.00, 18.00, 4),
(33, 2, 'Green Tea', 'Delicate green tea leaves steeped hot for a light, refreshing cup.', 260.00, NULL, '/uploads/3168a429-c55a-455b-8619-98925fb31a9c.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:26:52', '250 ml', 2, 0.00, 0.00, 0.00, 0.00, 2),
(34, 2, 'Black Tea', 'Robust full-leaf black tea, brewed hot and served plain.', 220.00, NULL, '/uploads/bf5d6a0a-854b-4852-83c2-c7a7bcfec286.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:27:23', '250 ml', 2, 0.00, 0.00, 0.00, 0.00, 2),
(36, 2, 'Kashmiri Chai', 'Pink-hued chai made with milk, almonds and cardamom and just a trace of saffron.', 400.00, NULL, '/uploads/0af92d60-5b8b-4d7b-9fb1-e3cf217956dd.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:27:45', '300 ml', 120, 4.00, 14.00, 5.00, 8.00, 30),
(37, 2, 'Lemon Tea', 'Hot black tea brightened with fresh lemon.', 280.00, NULL, '/uploads/e8941c2c-0406-4a52-99c4-bfa7000f5492.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:28:11', '250 ml', 5, 0.00, 1.00, 0.00, 0.00, 4),
(38, 2, 'Ginger Tea', 'Lively hot tea infused with fresh ginger for a warming glow.', 300.00, NULL, '/uploads/1b93d1f8-7676-4312-8e1c-cd215414fb56.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:28:32', '250 ml', 5, 0.00, 1.00, 0.00, 0.00, 3),
(39, 2, 'Mint Tea', 'Fragrant green tea with fresh mint leaves.', 290.00, NULL, '/uploads/e5858b98-6074-4f26-a4d7-108c8de05046.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:28:50', '250 ml', 2, 0.00, 0.00, 0.00, 0.00, 2),
(40, 13, 'Chocolate Shake', 'Thick chocolate ice cream blended with milk and rich cocoa.', 520.00, NULL, '/uploads/63c71424-8bf1-4962-84d6-56d05a323f1d.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:21:30', '400 ml', 440, 10.00, 64.00, 16.00, 46.00, 140),
(41, 13, 'Vanilla Shake', 'Creamy vanilla ice cream blended into a silky, sweet shake.', 500.00, NULL, '/uploads/7565ccd2-d299-474c-a41a-88b914eadc43.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:23:21', '400 ml', 400, 8.00, 50.00, 14.00, 38.00, 120),
(42, 13, 'Strawberry Shake', 'Fresh strawberries whipped with ice cream for a fruity shake.', 520.00, NULL, '/uploads/81e8e22b-e062-43f4-bb7d-f96cfa9deb67.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:24:35', '400 ml', 390, 8.00, 54.00, 10.00, 24.00, 60),
(43, 13, 'Oreo Shake', 'Vanilla and chocolate cookies blended into an indulgent cream.', 580.00, NULL, '/uploads/ed6b38d1-7a42-4ffb-823a-6d6851b6e442.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:24:59', '400 ml', 480, 9.00, 62.00, 16.00, 30.00, 190),
(44, 13, 'Banana Shake', 'Ripe bananas blended with milk and vanilla for a naturally sweet shake.', 460.00, NULL, '/uploads/cabb61ea-33a3-424b-87b6-428fefc96edf.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:26:05', '400 ml', 340, 9.00, 46.00, 6.00, 20.00, 60),
(45, 13, 'Mango Shake', 'Chilled mango pulp blended with creamy milk and ice.', 480.00, NULL, '/uploads/839a172b-2e62-4bd0-8355-a6e54a526624.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:26:22', '400 ml', 380, 8.00, 58.00, 8.00, 24.00, 50),
(46, 14, 'Chicken Sandwich', 'Grilled chicken fillet, crisp lettuce, tomato and our house sauce in toasted bread.', 550.00, NULL, '/uploads/476200eb-b0fc-4a23-aebe-e5e8d15d63ef.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:06:31', '1 serving', 430, 30.00, 40.00, 16.00, 6.00, 480),
(47, 14, 'Grilled Chicken Sandwich', 'Juicy grilled chicken breast with crunchy veggies and garlic mayo on seeded bread.', 620.00, NULL, '/uploads/9c8038a2-7bb9-437a-b821-c5164b3ac3f7.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:07:53', '1 serving', 470, 34.00, 42.00, 18.00, 6.00, 520),
(48, 14, 'Club Sandwich', 'Triple-decker with chicken, egg, lettuce, tomato and mayo.', 680.00, NULL, '/uploads/cf234fc4-521d-4db7-a706-9ceead41a31e.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:08:45', '1 serving', 560, 40.00, 48.00, 22.00, 8.00, 620),
(49, 14, 'Chicken Panini', 'Pressed panini with chicken, mozzarella, roasted peppers and herbed sauce.', 640.00, NULL, '/uploads/a9c805cc-19ef-4aae-b472-75b2d05773ce.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:09:33', '1 serving', 500, 36.00, 46.00, 20.00, 6.00, 540),
(50, 14, 'Cheese Sandwich', 'Golden toast with layers of melting cheddar and mozzarella.', 450.00, NULL, '/uploads/c1e75f9b-87bb-4259-a215-b91d9331ea02.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:10:03', '1 serving', 380, 16.00, 34.00, 14.00, 4.00, 480),
(51, 14, 'Chicken Wrap', 'Grilled chicken, crunchy slaw and creamy sauce in a soft tortilla.', 580.00, NULL, '/uploads/2e4c1bde-7336-4530-8089-fcb83e082f8e.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:10:45', '1 wrap', 420, 30.00, 36.00, 16.00, 6.00, 460),
(52, 14, 'Grilled Cheese', 'Butter-toasted bread with a melty, cheesy centre.', 440.00, NULL, '/uploads/21709666-0afb-4848-9c8b-a4e3eccd9708.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:11:15', '1 serving', 390, 15.00, 30.00, 18.00, 5.00, 460),
(54, 15, 'Chicken Pizza', 'Wood-fired crust topped with mozzarella, seasoned chicken and a rich tomato sauce.', 850.00, NULL, '/uploads/e3d5a1f0-a2ee-4b7c-89ff-18532013aaab.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 16:52:37', '1 medium (9\")', 860, 40.00, 84.00, 36.00, 6.00, 900),
(55, 15, 'Cheese Pizza', 'Classic tomato sauce and a generous layer of mozzarella on a thin crispy crust.', 740.00, NULL, '/uploads/6e338831-65ef-4261-8d51-ced28118b3db.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 16:53:17', '1 medium (9\")', 760, 28.00, 82.00, 26.00, 4.00, 700),
(56, 15, 'Pepperoni Pizza', 'Pepperoni slices over melted cheese and tangy tomato sauce.', 920.00, NULL, '/uploads/394d4352-cfb8-417d-8355-786cac1f29eb.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:03:38', '1 medium (9\")', 900, 34.00, 78.00, 42.00, 8.00, 1000),
(57, 15, 'Garlic Bread', 'Warm baguette wedges brushed with garlic butter and herbs.', 380.00, NULL, '/uploads/4939ca11-d9c5-4b13-844f-35d4402ec7c6.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:04:09', '6 pieces', 280, 7.00, 34.00, 10.00, 2.00, 380),
(58, 15, 'Chicken Nuggets', 'Crispy golden nuggets with tender chicken inside, served with dip.', 520.00, NULL, '/uploads/88778ec1-eea5-435f-929f-1c42360ea6e2.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:20:49', '8 pieces', 420, 24.00, 34.00, 18.00, 2.00, 520),
(59, 15, 'French Fries', 'Golden, crispy fries with sea salt, hot and freshly served.', 340.00, NULL, '/uploads/3d5f9b35-cd4f-41c8-af8b-b152154b5b64.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:04:57', '150 g', 360, 4.00, 44.00, 18.00, 1.00, 260),
(60, 15, 'Loaded Fries', 'Crispy fries smothered in cheese sauce, jalapeños and garlic mayo.', 540.00, NULL, '/uploads/cf69cdff-703c-41e0-a99d-b07915af64fc.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:05:16', '200 g', 520, 12.00, 46.00, 28.00, 8.00, 640),
(61, 15, 'Mozzarella Sticks', 'Crisp golden sticks of melted mozzarella with a warm marinara dip.', 480.00, NULL, '/uploads/c72f33a3-388a-402d-98e0-7b7a51ae6854.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:05:57', '6 pieces', 390, 18.00, 38.00, 20.00, 6.00, 760),
(63, 8, 'Cheesecake', 'Creamy baked cheesecake on a buttery graham crust.', 580.00, NULL, '/uploads/89e87ec0-2438-44f0-b9fb-479b52def2ee.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 19:11:15', '1 slice / 130 g', 380, 6.00, 30.00, 24.00, 24.00, 260),
(64, 7, 'Brownie', 'Fudgy chocolate brownie, served warm and rich with chocolate chunks.', 380.00, NULL, '/uploads/717402e8-34db-4e01-be19-3cd5ea8dea41.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 19:14:22', '1 piece / 90 g', 240, 3.00, 32.00, 10.00, 14.00, 160),
(65, 8, 'Red Velvet Cake', 'Classic red velvet layers with cream cheese frosting.', 600.00, NULL, '/uploads/2ea2dde0-066b-42bc-9a0f-6bdd71e1ac35.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 19:15:38', '1 slice / 120 g', 460, 6.00, 42.00, 26.00, 32.00, 220),
(66, 8, 'Carrot Cake', 'Moist spiced cake with grated carrot, walnut and cream cheese frosting.', 540.00, NULL, '/uploads/a5cc498e-1307-4422-86b8-7035c735ebf3.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 19:18:06', '1 slice / 130 g', 420, 6.00, 40.00, 26.00, 28.00, 250),
(67, 7, 'Chocolate Chip Cookie', 'Chewy cookie packed with dark chocolate chips.', 220.00, NULL, '/uploads/ac5ebdf2-a9c4-4ee6-b1f4-b0845cdbabb8.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 16:50:40', '1 piece', 180, 3.00, 24.00, 8.00, 10.00, 120),
(68, 7, 'Muffin', 'Soft baked muffin, gently sweet with a tender crumb.', 240.00, NULL, '/uploads/a5c32319-76af-458a-b040-a94020770a8c.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 16:51:04', '1 piece', 250, 4.00, 32.00, 10.00, 14.00, 180),
(69, 7, 'Cinnamon Roll', 'Swirled cinnamon dough with creamy icing, warm and fragrant.', 320.00, NULL, '/uploads/583ef451-9fad-48ae-9736-b84e79edf2fc.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 16:51:30', '1 piece', 320, 4.00, 44.00, 12.00, 18.00, 180),
(70, 7, 'Waffle', 'Crisp golden waffle served warm, perfect for syrups and toppings.', 400.00, NULL, '/uploads/6fe7ca34-8877-4415-925b-4c13104e5e9b.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 16:51:53', '1 waffle', 280, 6.00, 38.00, 12.00, 8.00, 320),
(71, 7, 'Pancakes', 'Fluffy stack of pancakes with maple syrup and a pat of butter.', 460.00, NULL, '/uploads/797077ab-4246-4e7f-9004-995b7831a3f0.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 16:52:09', '3 pieces', 340, 12.00, 48.00, 10.00, 12.00, 380),
(72, 4, 'Croissant', 'Flaky, buttery laminated croissant baked until golden.', 280.00, NULL, '/uploads/9f68afab-ad31-4518-af5a-eaccc337513e.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:37:33', '1 piece', 260, 6.00, 30.00, 14.00, 5.00, 200),
(73, 4, 'Chocolate Croissant', 'Flaky croissant filled with dark chocolate sticks.', 340.00, NULL, '/uploads/e963241b-7ac2-4e96-b373-984d338a2784.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:37:52', '1 piece', 300, 6.00, 32.00, 15.00, 10.00, 210),
(74, 4, 'Egg Sandwich', 'Scrambled eggs, melted cheddar and herb mayo on toasted bread.', 420.00, NULL, '/uploads/632d9f31-d745-4ce2-bb2a-3c5f9fe85667.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:38:43', '1 serving', 340, 18.00, 30.00, 14.00, 4.00, 360),
(75, 4, 'Omelette', 'Three-egg omelette with peppers, onions and herbs, served with toast.', 480.00, NULL, '/uploads/96f1f8d0-fba0-4fcb-9760-49df9946a9cc.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:39:12', '1 serving', 320, 18.00, 9.00, 24.00, 8.00, 420),
(76, 4, 'French Toast', 'Thick brioche soaked in sweet egg custard, griddled and dusted with sugar.', 520.00, NULL, '/uploads/0d84be17-0234-4c61-a0e4-0ab3b3ba7b2d.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-23 17:39:36', '2 slices', 420, 12.00, 48.00, 16.00, 14.00, 320),
(77, 4, 'Breakfast Platter', 'A generous plate of eggs, sourdough, grilled tomato and house potatoes.', 780.00, NULL, '/uploads/787bca74-c3c4-44ff-b810-104ada1e7a2b.jpg', 1, 1, '2026-08-20 17:16:02', '2026-08-22 18:35:02', '1 platter', 680, 32.00, 70.00, 40.00, 12.00, 900),
(148, 6, 'biryani', 'chicken biryani', 350.00, 300.00, '/uploads/1ce6e032-212c-480f-b45e-2e5195a5d042.jpg', 1, 1, '2026-08-24 17:05:38', '2026-08-24 17:06:01', '250gm', NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_addons`
--

CREATE TABLE `product_addons` (
  `id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `addon_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_addons`
--

INSERT INTO `product_addons` (`id`, `product_id`, `addon_id`) VALUES
(5, 1, 4),
(25, 1, 5),
(26, 1, 6),
(27, 1, 7),
(482, 1, 8),
(29, 1, 9),
(30, 1, 10),
(6, 2, 4),
(447, 5, 1),
(2, 5, 2),
(3, 5, 3),
(186, 5, 19),
(187, 5, 20),
(188, 5, 21),
(189, 5, 22),
(190, 5, 23),
(191, 5, 24),
(192, 5, 25),
(471, 6, 11),
(460, 6, 12),
(439, 6, 13),
(7, 8, 5),
(8, 8, 6),
(9, 8, 7),
(486, 8, 8),
(11, 8, 9),
(12, 8, 10),
(13, 9, 5),
(14, 9, 6),
(15, 9, 7),
(485, 9, 8),
(17, 9, 9),
(18, 9, 10),
(19, 10, 5),
(20, 10, 6),
(21, 10, 7),
(480, 10, 8),
(23, 10, 9),
(24, 10, 10),
(31, 12, 5),
(32, 12, 6),
(33, 12, 7),
(481, 12, 8),
(35, 12, 9),
(36, 12, 10),
(37, 13, 5),
(38, 13, 6),
(39, 13, 7),
(487, 13, 8),
(41, 13, 9),
(42, 13, 10),
(43, 14, 5),
(44, 14, 6),
(45, 14, 7),
(494, 14, 8),
(47, 14, 9),
(48, 14, 10),
(49, 15, 5),
(50, 15, 6),
(51, 15, 7),
(483, 15, 8),
(53, 15, 9),
(54, 15, 10),
(55, 16, 5),
(56, 16, 6),
(57, 16, 7),
(496, 16, 8),
(59, 16, 9),
(60, 16, 10),
(61, 17, 5),
(62, 17, 6),
(63, 17, 7),
(489, 17, 8),
(65, 17, 9),
(66, 17, 10),
(67, 18, 5),
(68, 18, 6),
(69, 18, 7),
(495, 18, 8),
(71, 18, 9),
(72, 18, 10),
(73, 19, 5),
(74, 19, 6),
(75, 19, 7),
(492, 19, 8),
(77, 19, 9),
(78, 19, 10),
(79, 20, 5),
(80, 20, 6),
(81, 20, 7),
(490, 20, 8),
(83, 20, 9),
(84, 20, 10),
(85, 21, 5),
(86, 21, 6),
(87, 21, 7),
(484, 21, 8),
(89, 21, 9),
(90, 21, 10),
(91, 22, 5),
(92, 22, 6),
(93, 22, 7),
(493, 22, 8),
(95, 22, 9),
(96, 22, 10),
(97, 23, 5),
(98, 23, 6),
(99, 23, 7),
(491, 23, 8),
(101, 23, 9),
(102, 23, 10),
(474, 23, 11),
(463, 23, 12),
(442, 23, 13),
(106, 24, 5),
(107, 24, 6),
(108, 24, 7),
(488, 24, 8),
(110, 24, 9),
(111, 24, 10),
(473, 24, 11),
(462, 24, 12),
(441, 24, 13),
(472, 25, 11),
(461, 25, 12),
(440, 25, 13),
(468, 26, 11),
(457, 26, 12),
(436, 26, 13),
(478, 27, 11),
(466, 27, 12),
(445, 27, 13),
(475, 28, 11),
(464, 28, 12),
(443, 28, 13),
(450, 46, 1),
(151, 46, 19),
(152, 46, 20),
(153, 46, 21),
(154, 46, 22),
(454, 47, 1),
(156, 47, 19),
(157, 47, 20),
(158, 47, 21),
(159, 47, 22),
(452, 48, 1),
(161, 48, 19),
(162, 48, 20),
(163, 48, 21),
(164, 48, 22),
(449, 49, 1),
(166, 49, 19),
(167, 49, 20),
(168, 49, 21),
(169, 49, 22),
(446, 50, 1),
(171, 50, 19),
(172, 50, 20),
(173, 50, 21),
(174, 50, 22),
(451, 51, 1),
(176, 51, 19),
(177, 51, 20),
(178, 51, 21),
(179, 51, 22),
(453, 52, 1),
(181, 52, 19),
(182, 52, 20),
(183, 52, 21),
(184, 52, 22),
(448, 58, 1),
(214, 58, 19),
(215, 58, 20),
(216, 58, 21),
(217, 58, 22),
(197, 59, 21),
(194, 59, 23),
(195, 59, 24),
(196, 59, 25),
(201, 60, 21),
(198, 60, 23),
(199, 60, 24),
(200, 60, 25),
(455, 61, 1),
(206, 61, 19),
(207, 61, 20),
(208, 61, 21),
(209, 61, 22),
(470, 63, 11),
(459, 63, 12),
(438, 63, 13),
(467, 64, 11),
(456, 64, 12),
(435, 64, 13),
(477, 65, 11),
(465, 65, 12),
(444, 65, 13),
(469, 66, 11),
(458, 66, 12),
(437, 66, 13),
(479, 70, 11),
(127, 70, 14),
(128, 70, 15),
(129, 70, 16),
(476, 71, 11),
(131, 71, 14),
(132, 71, 15),
(133, 71, 16);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED DEFAULT NULL,
  `customer_name` varchar(120) NOT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `review_text` text NOT NULL,
  `status` enum('pending','approved') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `reviewer_image` varchar(255) DEFAULT NULL,
  `review_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `product_id`, `customer_name`, `rating`, `review_text`, `status`, `created_at`, `updated_at`, `reviewer_image`, `review_image`) VALUES
(10, 1, 'Ali R.', 5, 'Really smooth coffee and not too bitter. The foam on top was perfect.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(11, 1, 'Sarah M.', 4, 'Loved it, although I wish the cup was a little bigger.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(12, 1, 'Hamza K.', 5, 'Best cappuccino I have had in Winder.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(13, 2, 'Ayesha S.', 5, 'The caramel flavor was actually really nice, not too sweet.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(14, 2, 'Daniyal', 4, 'Good macchiato. A bit pricey but worth it once in a while.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(15, 2, 'Zainab K.', 3, 'Taste was good but a bit sweeter than I expected.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(16, 10, 'Bilal', 5, 'Strong and clean. Just how I like my americano.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(17, 10, 'Fatima N.', 4, 'Nice and bold. Would be perfect with a bit more water.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(18, 12, 'Omar', 5, 'Really good coffee.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(19, 12, 'Hira', 4, 'Smooth and milky, exactly what a latte should be.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(20, 14, 'Usman', 5, 'The chocolate and coffee balance was spot on.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(21, 14, 'Mahnoor', 3, 'A little too sweet for me, but the kids loved it.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(22, 21, 'Raza', 5, 'Cold brew was smooth, no bitterness at all. Great on a hot day.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(23, 21, 'Sana', 4, 'Really refreshing. Wish they had bigger sizes.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(24, 3, 'Kashif', 5, 'Proper masala chai, you can taste the cardamom and ginger.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(25, 3, 'Nadia', 4, 'Very warming and comforting. A bit strong for me but my husband loved it.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(26, 3, 'Imran', 5, 'Tastes like home.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(27, 36, 'Areeba', 5, 'The Kashmiri chai was so creamy and pink, looked amazing and tasted even better.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(28, 36, 'Shahid', 4, 'Sweet and rich. A little heavy for an everyday drink but great for a treat.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(29, 33, 'Mehak', 4, 'Light and fresh, good quality green tea.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(30, 33, 'Tariq', 3, 'It was fine, nothing special.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(31, 31, 'Sadia', 5, 'Peach iced tea was so refreshing, perfect for summer.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(32, 31, 'Waqas', 4, 'Nice and fruity, not too sweet.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(33, 23, 'Hassan', 5, 'Iced coffee was strong and cold, just right.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(34, 23, 'Rabia', 4, 'Really good, though I would have liked it a bit sweeter.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(35, 26, 'Farhan', 5, 'Caramel frappe was thick and creamy, loved it.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(36, 26, 'Iqra', 4, 'Tasty but a little too sweet for me.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(37, 32, 'Zeeshan', 5, 'Fresh lemonade, you can tell it is made fresh.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(38, 32, 'Aiman', 4, 'Tangy and refreshing.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(39, 28, 'Noman', 4, 'Mocha frappe was good, chocolatey and cold.', 'approved', '2026-08-23 17:49:53', '2026-08-23 17:49:53', NULL, NULL),
(40, 28, 'Saba', 3, 'Was okay, a bit watery at the end.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(41, 4, 'Ahmed', 5, 'The eggs were cooked perfectly and the sourdough was toasted just right. Big portion too.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(42, 4, 'Maryam', 4, 'Great breakfast, everything was fresh. The potatoes could use a bit more salt.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(43, 4, 'Junaid', 5, 'Best breakfast in town, filling and tasty.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(44, 76, 'Saima', 5, 'French toast was soft and fluffy, the syrup on top was a nice touch.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(45, 76, 'Adnan', 4, 'Really good, though I wish there were more berries.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(46, 75, 'Kiran', 4, 'Omelette was fluffy and full of veggies.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(47, 75, 'Faisal', 3, 'It was decent but a little dry.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(48, 74, 'Hina', 5, 'Egg sandwich was simple and perfect, the bread was fresh.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(49, 74, 'Salman', 4, 'Good sandwich, quick to come out.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(50, 5, 'Bilal A.', 5, 'Chicken burger was juicy and the bun was soft. The sauce was really good.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(51, 5, 'Ayesha', 4, 'Crispy chicken, good burger. Fries on the side would be nice.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(52, 5, 'Hamza', 3, 'Burger was okay, a bit dry this time.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(53, 54, 'Rizwan', 5, 'Chicken pizza had a good amount of topping, crust was nice and crispy.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(54, 54, 'Nida', 4, 'Tasty pizza, generous chicken.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(55, 56, 'Ali', 5, 'Pepperoni pizza was great, cheesy and hot.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(56, 56, 'Sara', 4, 'Really good, though a little oily.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(57, 59, 'Usama', 5, 'Fries were crispy and well salted.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(58, 59, 'Zara', 4, 'Good fries, perfect with the ketchup.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(59, 60, 'Kamran', 5, 'Loaded fries were amazing, lots of cheese and sauce.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(60, 60, 'Huma', 4, 'Very filling, great for sharing.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(61, 61, 'Danish', 4, 'Mozzarella sticks were cheesy and golden.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(62, 61, 'Aqsa', 3, 'They were okay, a bit greasy.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(63, 46, 'Shahzad', 5, 'Chicken sandwich was fresh and the chicken was tender.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(64, 46, 'Mariam', 4, 'Good sandwich, decent size.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(65, 47, 'Talha', 5, 'Grilled chicken sandwich was juicy and the bread was toasted perfectly.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(66, 47, 'Anum', 4, 'Really tasty, loved the grilled flavor.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(67, 48, 'Yasir', 5, 'Club sandwich was stacked and delicious, came with good fries.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(68, 48, 'Sidra', 4, 'Great club sandwich, very filling.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(69, 51, 'Fahad', 4, 'Chicken wrap was good, fresh veggies inside.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(70, 51, 'Laiba', 3, 'Wrap was okay, a little dry.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(71, 49, 'Naveed', 5, 'Panini was crispy outside and cheesy inside.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(72, 49, 'Eman', 4, 'Really nice panini, warm and toasty.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(73, 40, 'Arham', 5, 'Chocolate shake was thick and rich, tasted like real chocolate.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(74, 40, 'Mahnoor A.', 4, 'Really good shake, a bit heavy but worth it.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(75, 43, 'Bushra', 5, 'Oreo shake was amazing, you could taste the cookies.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(76, 43, 'Hamza A.', 4, 'Great shake, very creamy.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(77, 42, 'Rimsha', 5, 'Strawberry shake was fresh and not too sweet.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(78, 42, 'Awais', 4, 'Good strawberry shake, nice and cold.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(79, 45, 'Nimra', 5, 'Mango shake tasted like fresh mangoes, so good.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(80, 45, 'Zain', 4, 'Really refreshing, perfect for summer.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(81, 6, 'Ayesha R.', 5, 'Chocolate cake was moist and the ganache was rich.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(82, 6, 'Bilal K.', 4, 'Very good cake, a little dense but tasty.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(83, 6, 'Sana K.', 5, 'The best chocolate cake I have had in a long time.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(84, 64, 'Hassan A.', 5, 'Brownie was fudgy and warm, perfect with ice cream.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(85, 64, 'Rabia S.', 4, 'Really good brownie, nice and chocolatey.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(86, 67, 'Umar', 4, 'Cookie was soft and had good chocolate chips.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(87, 67, 'Areeba S.', 5, 'Warm cookie, so good.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(88, 69, 'Fawad', 5, 'Cinnamon roll was soft and the icing was perfect.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(89, 69, 'Hira K.', 4, 'Really tasty, though a bit sweet.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(90, 71, 'Zoya', 5, 'Pancakes were fluffy and came with lots of syrup.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(91, 71, 'Saad', 4, 'Good pancakes, nice and soft.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(92, 63, 'Mahnoor K.', 5, 'Cheesecake was creamy and smooth, the base was perfect.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(93, 63, 'Ali H.', 4, 'Really good cheesecake, not too heavy.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(94, 65, 'Nida S.', 5, 'Red velvet cake was beautiful and tasted amazing.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(95, 65, 'Usman A.', 4, 'Great cake, moist and not too sweet.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(96, 66, 'Sara K.', 4, 'Carrot cake was nice, loved the walnuts.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(97, 66, 'Daniyal A.', 3, 'It was okay, a bit dry for me.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(98, 7, 'Ahmed R.', 5, 'Family platter was huge, we were four people and still had leftovers. Everything was tasty.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(99, 7, 'Fatima A.', 4, 'Great value for the price, the wings were the best part.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(100, 7, 'Kamran S.', 5, 'Perfect for family dinner, everyone enjoyed it.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(101, 77, 'Nadia K.', 4, 'Breakfast platter was filling and fresh.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL),
(102, 77, 'Imran A.', 5, 'Great spread, the eggs and toast were spot on.', 'approved', '2026-08-23 17:49:54', '2026-08-23 17:49:54', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

CREATE TABLE `team_members` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `role` varchar(120) NOT NULL,
  `bio` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `team_members`
--

INSERT INTO `team_members` (`id`, `name`, `role`, `bio`, `image`, `created_at`) VALUES
(1, 'Arshad', 'Founder & Owner', 'Shapes the cafe vision and makes sure every guest finds a warm, welcoming table.', NULL, '2026-08-10 16:33:25'),
(2, 'Hamza Malik', 'Head Chef', 'Leads the kitchen and keeps every plate thoughtful, fresh and generous.', NULL, '2026-08-10 16:33:25'),
(3, 'Sara Ahmed', 'Cafe Manager', 'Keeps the cafe running smoothly and helps the team make every visit feel easy.', NULL, '2026-08-10 16:33:25');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(190) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin') NOT NULL DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Green Grounds Admin', 'admin@greengroundscafe.com', '$2b$12$USEF5T8ZYff5ifgD1m7i1ejtF7t6CGQZ.lgBHIb2v2wYXANGUH9g2', 'admin', '2026-08-09 12:28:42');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addons`
--
ALTER TABLE `addons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `complaints`
--
ALTER TABLE `complaints`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_complaints_status` (`status`),
  ADD KEY `idx_complaints_created` (`created_at`);

--
-- Indexes for table `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_messages_status` (`status`),
  ADD KEY `idx_messages_created` (`created_at`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `idx_orders_status` (`status`),
  ADD KEY `idx_orders_created` (`created_at`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_oi_order` (`order_id`),
  ADD KEY `fk_oi_product` (`product_id`);

--
-- Indexes for table `order_item_addons`
--
ALTER TABLE `order_item_addons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_oia_item` (`order_item_id`),
  ADD KEY `fk_oia_addon` (`addon_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_products_name` (`name`),
  ADD KEY `idx_products_category` (`category_id`),
  ADD KEY `idx_products_featured` (`featured`);

--
-- Indexes for table `product_addons`
--
ALTER TABLE `product_addons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_product_addon` (`product_id`,`addon_id`),
  ADD KEY `fk_pa_addon` (`addon_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_reviews_status` (`status`),
  ADD KEY `idx_reviews_created` (`created_at`),
  ADD KEY `idx_reviews_product` (`product_id`);

--
-- Indexes for table `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addons`
--
ALTER TABLE `addons`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `complaints`
--
ALTER TABLE `complaints`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `order_item_addons`
--
ALTER TABLE `order_item_addons`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=149;

--
-- AUTO_INCREMENT for table `product_addons`
--
ALTER TABLE `product_addons`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=497;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT for table `team_members`
--
ALTER TABLE `team_members`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_oi_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_oi_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_item_addons`
--
ALTER TABLE `order_item_addons`
  ADD CONSTRAINT `fk_oia_addon` FOREIGN KEY (`addon_id`) REFERENCES `addons` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_oia_item` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `product_addons`
--
ALTER TABLE `product_addons`
  ADD CONSTRAINT `fk_pa_addon` FOREIGN KEY (`addon_id`) REFERENCES `addons` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pa_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
