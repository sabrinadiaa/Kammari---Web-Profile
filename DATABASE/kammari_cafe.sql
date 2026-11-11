-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 11 Nov 2026 pada 09.16
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kammari_cafe`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `branches`
--

CREATE TABLE `branches` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `address` text NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `whatsapp` varchar(30) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `instagram` varchar(150) DEFAULT NULL,
  `reservation_info` text DEFAULT NULL,
  `open_time` time DEFAULT NULL,
  `close_time` time DEFAULT NULL,
  `operational_note` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `google_maps_url` varchar(500) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `branches`
--

INSERT INTO `branches` (`id`, `name`, `slug`, `description`, `address`, `phone`, `whatsapp`, `email`, `instagram`, `reservation_info`, `open_time`, `close_time`, `operational_note`, `latitude`, `longitude`, `google_maps_url`, `image`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Kammari Gresik', 'gresik', NULL, 'Jl. Samanhudi No.17, Kemuteran, Kec. Gresik, Kabupaten Gresik, Jawa Timur.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(2, 'Kammari Surabaya', 'surabaya', NULL, 'Jl. Ketintang Baru II No.KAV 7, Ketintang, Kec. Gayungan, Surabaya, Jawa Timur.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `branch_facilities`
--

CREATE TABLE `branch_facilities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `branch_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `type` enum('facility','highlight') NOT NULL DEFAULT 'facility',
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `branch_menu_items`
--

CREATE TABLE `branch_menu_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `branch_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `is_recommended` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `branch_menu_items`
--

INSERT INTO `branch_menu_items` (`id`, `branch_id`, `category_id`, `name`, `slug`, `description`, `image`, `price`, `is_available`, `is_recommended`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 5, 'Milo Malaysia Ashoy', 'milo-malaysia-ashoy', 'Milo Malaysia dengan sentuhan ala Kaki555.', 'assets/Minuman/signature/milo-malaysia-ashoy.png', 15000.00, 1, 0, 15, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(2, 1, 5, 'Oreo Shake', 'oreo-shake', 'Minuman creamy yang dipadukan dengan susu dan Oreo.', NULL, 15000.00, 1, 0, 16, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(3, 1, 5, 'Trakubisu', 'trakubisu', 'Extrajoss atau Kukubima dicampur dengan susu.', NULL, 12000.00, 1, 0, 17, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(4, 1, 5, 'Lemonade', 'lemonade', 'Es lemon ala Kaki555.', NULL, 15000.00, 1, 0, 18, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(5, 1, 5, 'Air Mineral', 'air-mineral', 'Air segar.', NULL, 5000.00, 1, 0, 19, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(6, 1, 6, 'Matcha Latte', 'matcha-latte', 'Racikan teh hijau Thailand dengan susu ala Kaki555.', NULL, 15000.00, 1, 0, 20, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(7, 1, 6, 'Teh Tarik', 'teh-tarik', 'Racikan teh hitam dengan susu ala Kaki555.', NULL, 15000.00, 1, 0, 21, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(8, 1, 6, 'Teh Jasmine', 'teh-jasmine', 'Racikan teh hijau dengan aroma dan rasa melati.', 'assets/Minuman/tea-based/teh-jasmine.jpg', 15000.00, 1, 0, 22, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(9, 1, 6, 'Teh Leci', 'teh-leci', 'Racikan teh hitam dengan sirup leci.', NULL, 12000.00, 1, 0, 23, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(10, 1, 6, 'Teh Manis Kami (Regular)', 'teh-manis-kami-regular', 'Teh manis hitam sederhana; ukuran Regular.', 'assets/Minuman/tea-based/teh-manis-kami.jpg', 8000.00, 1, 0, 24, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(11, 1, 6, 'Teh Manis Kami (Large)', 'teh-manis-kami-large', 'Teh manis hitam sederhana; ukuran Large.', 'assets/Minuman/tea-based/teh-manis-kami.jpg', 10000.00, 1, 0, 25, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(12, 1, 7, 'Kopi Hitam Tubruk', 'kopi-hitam-tubruk', 'Racikan kopi hitam sederhana ala Kaki555.', NULL, 6000.00, 1, 0, 26, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(13, 1, 7, 'Kopi Susu Tubruk', 'kopi-susu-tubruk', 'Racikan kopi hitam sederhana dengan susu ala Kaki555.', NULL, 8000.00, 1, 0, 27, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(14, 1, 7, 'Kopi Susu Sederhana', 'kopi-susu-sederhana', 'Es kopi susu dengan paduan sederhana antara kopi, susu, dan kental manis.', NULL, 15000.00, 1, 0, 28, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(15, 1, 7, 'Indonesiano', 'indonesiano', 'Es kopi hitam Americano dengan sentuhan ala Kaki555.', NULL, 16000.00, 1, 0, 29, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(16, 1, 7, 'Kopi Susu Tujujati', 'kopi-susu-tujujati', 'Es kopi susu racikan Tujujati Artspace.', NULL, 18000.00, 1, 0, 30, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(17, 1, 8, 'Ketan Susu', 'ketan-susu', 'Es tape ketan susu ala Kaki555.', NULL, 15000.00, 1, 0, 31, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(18, 1, 8, 'Milky Peach', 'milky-peach', 'Minuman Milky Peach ala Kaki555.', NULL, 15000.00, 1, 0, 32, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(19, 1, 8, 'Susu Coklat', 'susu-coklat', 'Es susu coklat ala Kaki555.', 'assets/Minuman/milk-based/susu-coklat.jpg', 15000.00, 1, 0, 33, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(20, 1, 9, 'Birawa', 'birawa', 'Minuman soda dengan rasa kopi.', NULL, 17000.00, 1, 0, 34, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(21, 1, 9, 'Retro Cola', 'retro-cola', 'Minuman soda cola dengan cita rasa resep jadul ala Kaki555.', 'assets/menu-seasonal/retro-cola.jpg', 15000.00, 1, 0, 35, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(22, 1, 10, 'Makassar 1', 'makassar-1', 'Mee Nyedas Kami dan es teh manis Regular.', NULL, 20000.00, 1, 0, 36, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(23, 1, 10, 'Makassar 2', 'makassar-2', 'Tenshinhan dan es teh manis Regular.', NULL, 20000.00, 1, 0, 37, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(24, 1, 10, 'Makassar 3', 'makassar-3', 'Thai Basil Chicken dan es teh manis Regular.', NULL, 27000.00, 1, 0, 38, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(25, 1, 11, 'Penak 1', 'penak-1', 'Mee Goreng Kami dan es teh manis Regular.', NULL, 20000.00, 1, 0, 39, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(26, 1, 11, 'Penak 2', 'penak-2', 'Kentang Goreng dan es teh manis Regular.', NULL, 20000.00, 1, 0, 40, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(27, 1, 11, 'Penak 3', 'penak-3', 'Mix Platter dan es teh manis Regular.', NULL, 30000.00, 1, 0, 41, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(28, 2, 2, 'Kentang Goreng Lada Garam', 'kentang-goreng-lada-garam', 'Hidangan kentang berbumbu lada garam.', NULL, 15000.00, 1, 0, 1, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(29, 2, 2, 'Tahu Kriuk Cabe Garam', 'tahu-kriuk-cabe-garam', 'Tahu goreng tepung dengan irisan cabai dan garam.', NULL, 12000.00, 1, 0, 2, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(30, 2, 2, 'Tahu + Tempe Kriuk Cabe Garam', 'tahu-tempe-kriuk-cabe-garam', 'Tahu dan tempe goreng tepung dengan irisan cabai dan garam.', NULL, 12000.00, 1, 0, 3, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(31, 2, 2, 'Tahu Tempe Kriuk + Telur Orak Arik Cabe Garam', 'tahu-tempe-kriuk-telur-orak-arik-cabe-garam', 'Tahu dan tempe goreng tepung, telur orak-arik, irisan cabai, dan garam.', NULL, 14000.00, 1, 0, 4, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(32, 2, 1, 'Mee Goreng', 'mee-goreng', 'Mie yang diracik dengan bumbu ala Kaki555 dan disajikan dengan telur dadar.', NULL, 13000.00, 1, 0, 5, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(33, 2, 1, 'Mie Nyemek Pedas', 'mie-nyemek-pedas', 'Mie pedas ala Kaki555 yang disajikan dengan campuran telur.', 'assets/Makanan/main-course/mee-nyedas-kami.png', 14000.00, 1, 0, 6, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(34, 2, 3, 'Telur', 'telur', NULL, NULL, 3000.00, 1, 0, 7, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(35, 2, 3, 'Nasi', 'nasi', NULL, NULL, 4000.00, 1, 0, 8, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(36, 2, 5, 'Milo Malaysia Ashoy', 'milo-malaysia-ashoy', 'Milo Malaysia dengan sentuhan ala Kaki555.', 'assets/Minuman/signature/milo-malaysia-ashoy.png', 15000.00, 1, 0, 9, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(37, 2, 6, 'Matcha Latte', 'matcha-latte', 'Teh hijau dengan racikan susu.', NULL, 15000.00, 1, 0, 10, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(38, 2, 6, 'Teh Tarik', 'teh-tarik', 'Teh hitam dengan campuran susu.', NULL, 15000.00, 1, 0, 11, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(39, 2, 5, 'Es Lemonade', 'es-lemonade', 'Lemon yang diracik ala Kaki555.', NULL, 13000.00, 1, 0, 12, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(40, 2, 6, 'Teh Leci', 'teh-leci', 'Teh hitam dengan racikan sirup buah leci.', NULL, 10000.00, 1, 0, 13, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(41, 2, 5, 'Trajosu dan Kukubisu', 'trajosu-dan-kukubisu', 'Minuman berbahan minuman energi yang dicampur susu dan es.', NULL, 10000.00, 1, 0, 14, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(42, 2, 7, 'Kopi Hitam Tubruk', 'kopi-hitam-tubruk', 'Kopi hitam ala Kaki555.', NULL, 6000.00, 1, 0, 15, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(43, 2, 7, 'Kopi Susu Tubruk', 'kopi-susu-tubruk', 'Kopi hitam dengan racikan susu ala Kaki555.', NULL, 8000.00, 1, 0, 16, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(44, 2, 7, 'Kopi Susu Tujujati', 'kopi-susu-tujujati', 'Kopi susu Tujujati yang diracik oleh Kaki555.', NULL, 15000.00, 1, 0, 17, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(45, 2, 8, 'Es Susu Coklat', 'es-susu-coklat', 'Minuman es susu coklat.', 'assets/Minuman/milk-based/susu-coklat.jpg', 15000.00, 1, 0, 18, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(46, 2, 7, 'Es Kopisu Sederhana', 'es-kopisu-sederhana', 'Es kopi susu dengan racikan sederhana.', NULL, 15000.00, 1, 0, 19, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(47, 2, 5, 'Oreo Shake', 'oreo-shake', 'Minuman creamy perpaduan susu dan Oreo.', NULL, 15000.00, 1, 0, 20, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(48, 2, 6, 'Es Teh Manis (Small)', 'es-teh-manis-small', 'Es teh manis ukuran Small.', 'assets/Minuman/tea-based/teh-manis-kami.jpg', 4000.00, 1, 0, 21, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(49, 2, 6, 'Es Teh Manis (Medium)', 'es-teh-manis-medium', 'Es teh manis ukuran Medium.', 'assets/Minuman/tea-based/teh-manis-kami.jpg', 6000.00, 1, 0, 22, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(50, 2, 6, 'Es Teh Manis (Large)', 'es-teh-manis-large', 'Es teh manis ukuran Large.', 'assets/Minuman/tea-based/teh-manis-kami.jpg', 10000.00, 1, 0, 23, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(51, 2, 5, 'Air Mineral', 'air-mineral', NULL, NULL, 5000.00, 1, 0, 24, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(52, 1, 1, 'Thai Basil Chicken', 'thai-basil-chicken', 'Ayam cincang dengan bumbu khas Thailand dan kemangi, disajikan dengan nasi dan telur.', 'assets/Makanan/main-course/thai-basil-chicken.jpg', 22000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-06 17:30:19'),
(53, 1, 1, 'Nasi Usus Krispy', 'nasi-usus-krispy', 'Nasi usus dengan bumbu ala Kaki555, disajikan dengan telur.', 'assets/Makanan/main-course/nasi-usus-krispy.png', 18000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-06 17:30:19'),
(54, 1, 1, 'Tenshinhan', 'tenshinhan', 'Telur dadar crabstick dengan saus tare, disajikan bersama nasi.', 'assets/Makanan/main-course/tenshinhan.jpg', 15000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-06 17:30:19'),
(55, 1, 1, 'Mee Goreng Kami', 'mee-goreng-kami', 'Mie goreng dengan bumbu khas Kaki555 dan telur.', NULL, 14000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-06 17:30:19'),
(56, 1, 1, 'Mee Nyedas Kami', 'mee-nyedas-kami', 'Mie nyemek pedas dengan racikan bumbu cabai dan telur.', 'assets/Makanan/main-course/mee-nyedas-kami.png', 15000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-06 17:30:19'),
(57, 1, 2, 'Kentang Goreng Masala', 'kentang-goreng-masala', 'Kentang dengan baluran rempah garam masala khas India.', 'assets/Makanan/snack/kentang-goreng-masala.jpg', 16000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-06 17:30:19'),
(58, 1, 2, 'Kekian', 'kekian', 'Kekian goreng disajikan dengan saus sambal.', NULL, 15000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-06 17:30:19'),
(59, 1, 2, 'Bontosan', 'bontosan', 'Hidangan ringan khas Jepara dengan saus sambal.', NULL, 10000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-06 17:30:19'),
(60, 1, 2, 'Samosa', 'samosa', 'Pastri goreng berbentuk segitiga dengan isian daging berbumbu khas Timur Tengah.', 'assets/Makanan/snack/samosa.jpg', 16000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-06 17:30:19'),
(61, 1, 2, 'Mix Platter', 'mix-platter', 'Perpaduan kentang, bontosan, dan kekian.', 'assets/Makanan/snack/mix-platter.png', 25000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-06 17:30:19'),
(62, 1, 4, 'Es Krim Loti', 'es-krim-loti', 'Es krim dengan roti khas Melayu ala Kaki555.', 'assets/Makanan/makanan-penutup/es-krim-loti.jpg', 15000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-06 17:30:19'),
(63, 1, 4, 'Cookies', 'cookies', 'Kue kering chocochips rasa coklat, greentea, atau red velvet.', NULL, 10000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-06 17:30:19'),
(64, 1, 3, 'Nasi Putih', 'nasi-putih', 'Tambahan nasi putih.', NULL, 5000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-06 17:30:19'),
(65, 1, 3, 'Telur', 'telur', 'Tambahan telur.', NULL, 5000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-06 17:30:19');

-- --------------------------------------------------------

--
-- Struktur dari tabel `events`
--

CREATE TABLE `events` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `branch_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `start_at` datetime NOT NULL,
  `end_at` datetime DEFAULT NULL,
  `poster` varchar(500) DEFAULT NULL,
  `registration_url` varchar(1000) DEFAULT NULL,
  `status` enum('draft','upcoming','ongoing','completed','cancelled') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `media_assets`
--

CREATE TABLE `media_assets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `section` varchar(60) NOT NULL,
  `subcategory` varchar(255) DEFAULT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `media_type` enum('image','video') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `media_assets`
--

INSERT INTO `media_assets` (`id`, `title`, `section`, `subcategory`, `category_id`, `file_name`, `file_path`, `media_type`, `created_at`, `updated_at`) VALUES
(1, 'Mee Nyedas Kami', 'Makanan', 'main-course', NULL, 'mee-nyedas-kami.png', 'assets/Makanan/main-course/mee-nyedas-kami.png', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(2, 'Nasi Usus Krispy', 'Makanan', 'main-course', NULL, 'nasi-usus-krispy.png', 'assets/Makanan/main-course/nasi-usus-krispy.png', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(3, 'Tenshinhan', 'Makanan', 'main-course', NULL, 'tenshinhan.jpg', 'assets/Makanan/main-course/tenshinhan.jpg', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(4, 'Thai Basil Chicken', 'Makanan', 'main-course', NULL, 'thai-basil-chicken.jpg', 'assets/Makanan/main-course/thai-basil-chicken.jpg', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(5, 'Es Krim Loti', 'Makanan', 'makanan-penutup', NULL, 'es-krim-loti.jpg', 'assets/Makanan/makanan-penutup/es-krim-loti.jpg', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(6, 'Kentang Goreng Masala', 'Makanan', 'snack', NULL, 'kentang-goreng-masala.jpg', 'assets/Makanan/snack/kentang-goreng-masala.jpg', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(7, 'Mix Platter', 'Makanan', 'snack', NULL, 'mix-platter.png', 'assets/Makanan/snack/mix-platter.png', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(8, 'Samosa', 'Makanan', 'snack', NULL, 'samosa.jpg', 'assets/Makanan/snack/samosa.jpg', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(9, 'Retro Cola', 'Menu Seasonal', 'menu-seasonal', NULL, 'retro-cola.jpg', 'assets/menu-seasonal/retro-cola.jpg', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(10, 'Susu Coklat', 'Minuman', 'milk-based', NULL, 'susu-coklat.jpg', 'assets/Minuman/milk-based/susu-coklat.jpg', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(11, 'Milo Malaysia Ashoy', 'Minuman', 'signature', NULL, 'milo-malaysia-ashoy.png', 'assets/Minuman/signature/milo-malaysia-ashoy.png', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(12, 'Teh Jasmine', 'Minuman', 'tea-based', NULL, 'teh-jasmine.jpg', 'assets/Minuman/tea-based/teh-jasmine.jpg', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(13, 'Teh Manis Kami', 'Minuman', 'tea-based', NULL, 'teh-manis-kami.jpg', 'assets/Minuman/tea-based/teh-manis-kami.jpg', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(14, 'Crochet Workshop', 'Event Mendatang', NULL, NULL, 'crochet_workshop.jpg', 'assets/poster-event-mendatang/crochet_workshop.jpg', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(15, 'Walking Tour', 'Event Mendatang', NULL, NULL, 'walking-tour.jpg', 'assets/poster-event-mendatang/walking-tour.jpg', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(16, 'Art Journaling', 'Event Terlaksana', NULL, NULL, 'art_journaling.jpg', 'assets/Poster-event-terlaksana/art_journaling.jpg', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(17, 'Junk Journaling', 'Event Terlaksana', NULL, NULL, 'Junk-Journaling.png', 'assets/Poster-event-terlaksana/Junk-Journaling.png', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(18, 'Open Mic Bola', 'Event Terlaksana', NULL, NULL, 'open-mic-bola.jpg', 'assets/Poster-event-terlaksana/open-mic-bola.jpg', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(19, 'Open Mic Jumpa Lagi', 'Event Terlaksana', NULL, NULL, 'open-mic-jumpa-lagi.jpg', 'assets/Poster-event-terlaksana/open-mic-jumpa-lagi.jpg', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(20, 'Open Mic Lagi', 'Event Terlaksana', NULL, NULL, 'open-mic-lagi.jpg', 'assets/Poster-event-terlaksana/open-mic-lagi.jpg', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(21, 'Open Mic Listrik', 'Event Terlaksana', NULL, NULL, 'open-mic-listrik.jpg', 'assets/Poster-event-terlaksana/open-mic-listrik.jpg', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(22, 'Open Mic Perampasan Aset', 'Event Terlaksana', NULL, NULL, 'open-mic-perampasan-aset.jpg', 'assets/Poster-event-terlaksana/open-mic-perampasan-aset.jpg', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(23, 'Open Mic Tasyakuran', 'Event Terlaksana', NULL, NULL, 'open-mic-tasyakuran.jpg', 'assets/Poster-event-terlaksana/open-mic-tasyakuran.jpg', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(24, 'Open Mic Tawa', 'Event Terlaksana', NULL, NULL, 'open-mic-tawa.jpg', 'assets/Poster-event-terlaksana/open-mic-tawa.jpg', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(25, 'Open Mic', 'Event Terlaksana', NULL, NULL, 'open-mic.jpg', 'assets/Poster-event-terlaksana/open-mic.jpg', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(26, 'Weekend Art Journaling', 'Event Terlaksana', NULL, NULL, 'weekend-art-journaling.jpg', 'assets/Poster-event-terlaksana/weekend-art-journaling.jpg', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48');

-- --------------------------------------------------------

--
-- Struktur dari tabel `menu_categories`
--

CREATE TABLE `menu_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `menu_categories`
--

INSERT INTO `menu_categories` (`id`, `name`, `slug`, `description`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Makanan Utama', 'main-course', NULL, 1, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(2, 'Makanan Ringan', 'snack', NULL, 2, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(3, 'Ekstra', 'ekstra', NULL, 3, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(4, 'Makanan Penutup', 'makanan-penutup', NULL, 4, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(5, 'Signature', 'signature', NULL, 5, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(6, 'Tea Based', 'tea-based', NULL, 6, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(7, 'Coffee Based', 'coffee-based', NULL, 7, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(8, 'Milk Based', 'milk-based', NULL, 8, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(9, 'Menu Seasonal', 'menu-seasonal', NULL, 9, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(10, 'Combo Makassar', 'combo-makassar', NULL, 10, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(11, 'Combo Penak', 'combo-penak', NULL, 11, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(190) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indeks untuk tabel `branch_facilities`
--
ALTER TABLE `branch_facilities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_facility_branch` (`branch_id`);

--
-- Indeks untuk tabel `branch_menu_items`
--
ALTER TABLE `branch_menu_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_branch_menu_slug` (`branch_id`,`slug`),
  ADD KEY `fk_menu_category` (`category_id`);

--
-- Indeks untuk tabel `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_event_branch` (`branch_id`);

--
-- Indeks untuk tabel `media_assets`
--
ALTER TABLE `media_assets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_media_assets_path` (`file_path`);

--
-- Indeks untuk tabel `menu_categories`
--
ALTER TABLE `menu_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `branches`
--
ALTER TABLE `branches`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `branch_facilities`
--
ALTER TABLE `branch_facilities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `branch_menu_items`
--
ALTER TABLE `branch_menu_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT untuk tabel `events`
--
ALTER TABLE `events`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `media_assets`
--
ALTER TABLE `media_assets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT untuk tabel `menu_categories`
--
ALTER TABLE `menu_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `branch_facilities`
--
ALTER TABLE `branch_facilities`
  ADD CONSTRAINT `fk_facility_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `branch_menu_items`
--
ALTER TABLE `branch_menu_items`
  ADD CONSTRAINT `fk_menu_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_menu_category` FOREIGN KEY (`category_id`) REFERENCES `menu_categories` (`id`) ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `fk_event_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
