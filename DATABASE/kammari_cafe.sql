-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 12 Nov 2026 pada 07.13
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
(2, 1, 5, 'Oreo Shake', 'oreo-shake', 'Minuman creamy yang dipadukan dengan susu dan Oreo.', 'assets/Minuman/signature/oreo-shake.png', 15000.00, 1, 0, 16, 1, '2026-10-30 14:24:45', '2026-11-11 09:35:31'),
(3, 1, 5, 'Trakubisu', 'trakubisu', 'Extrajoss atau Kukubima dicampur dengan susu.', 'assets/Minuman/signature/trakubisu.png', 12000.00, 1, 0, 17, 1, '2026-10-30 14:24:45', '2026-11-11 09:35:31'),
(4, 1, 5, 'Lemonade', 'lemonade', 'Es lemon ala Kaki555.', 'assets/Minuman/signature/lemonade.png', 15000.00, 1, 0, 18, 1, '2026-10-30 14:24:45', '2026-11-11 09:35:31'),
(5, 1, 5, 'Air Mineral', 'air-mineral', 'Air segar.', 'assets/Minuman/signature/air-mineral.jpg', 5000.00, 1, 0, 19, 1, '2026-10-30 14:24:45', '2026-11-11 09:24:00'),
(6, 1, 6, 'Matcha Latte', 'matcha-latte', 'Racikan teh hijau Thailand dengan susu ala Kaki555.', 'assets/Minuman/tea-based/matcha-latte.png', 15000.00, 1, 0, 20, 1, '2026-10-30 14:24:45', '2026-11-11 09:35:31'),
(7, 1, 6, 'Teh Tarik', 'teh-tarik', 'Racikan teh hitam dengan susu ala Kaki555.', 'assets/Minuman/tea-based/teh-tarik.jpg', 15000.00, 1, 0, 21, 1, '2026-10-30 14:24:45', '2026-11-11 09:24:00'),
(8, 1, 6, 'Teh Jasmine', 'teh-jasmine', 'Racikan teh hijau dengan aroma dan rasa melati.', 'assets/Minuman/tea-based/teh-jasmine.jpg', 15000.00, 1, 0, 22, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(9, 1, 6, 'Teh Leci', 'teh-leci', 'Racikan teh hitam dengan sirup leci.', 'assets/Minuman/tea-based/teh-leci.jpg', 12000.00, 1, 0, 23, 1, '2026-10-30 14:24:45', '2026-11-11 09:24:00'),
(10, 1, 6, 'Teh Manis Kami (Regular)', 'teh-manis-kami-regular', 'Teh manis hitam sederhana; ukuran Regular.', 'assets/Minuman/tea-based/teh-manis-kami.jpg', 8000.00, 1, 0, 24, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(11, 1, 6, 'Teh Manis Kami (Large)', 'teh-manis-kami-large', 'Teh manis hitam sederhana; ukuran Large.', 'assets/Minuman/tea-based/teh-manis-kami.jpg', 10000.00, 1, 0, 25, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(12, 1, 7, 'Kopi Hitam Tubruk', 'kopi-hitam-tubruk', 'Racikan kopi hitam sederhana ala Kaki555.', 'assets/Minuman/coffee-based/kopi-hitam-tubruk.jpg', 6000.00, 1, 0, 26, 1, '2026-10-30 14:24:45', '2026-11-11 09:24:00'),
(13, 1, 7, 'Kopi Susu Tubruk', 'kopi-susu-tubruk', 'Racikan kopi hitam sederhana dengan susu ala Kaki555.', 'assets/Minuman/coffee-based/kopi-susu-tubruk.jpg', 8000.00, 1, 0, 27, 1, '2026-10-30 14:24:45', '2026-11-11 09:24:00'),
(14, 1, 7, 'Kopi Susu Sederhana', 'kopi-susu-sederhana', 'Es kopi susu dengan paduan sederhana antara kopi, susu, dan kental manis.', 'assets/Minuman/coffee-based/kopi-susu-sederhana.jpg', 15000.00, 1, 0, 28, 1, '2026-10-30 14:24:45', '2026-11-11 09:24:00'),
(15, 1, 7, 'Indonesiano', 'indonesiano', 'Es kopi hitam Americano dengan sentuhan ala Kaki555.', 'assets/Minuman/coffee-based/indonesiano.jpg', 16000.00, 1, 0, 29, 1, '2026-10-30 14:24:45', '2026-11-11 09:24:00'),
(16, 1, 7, 'Kopi Susu Tujujati', 'kopi-susu-tujujati', 'Es kopi susu racikan Tujujati Artspace.', 'assets/Minuman/coffee-based/kopi-susu-tujujati.jpg', 18000.00, 1, 0, 30, 1, '2026-10-30 14:24:45', '2026-11-11 09:24:00'),
(17, 1, 8, 'Ketan Susu', 'ketan-susu', 'Es tape ketan susu ala Kaki555.', 'assets/Minuman/milk-based/ketan-susu.jpg', 15000.00, 1, 0, 31, 1, '2026-10-30 14:24:45', '2026-11-11 17:00:54'),
(18, 1, 8, 'Milky Peach', 'milky-peach', 'Minuman Milky Peach ala Kaki555.', 'assets/Minuman/milk-based/milky-peach.jpg', 15000.00, 1, 0, 32, 1, '2026-10-30 14:24:45', '2026-11-11 17:00:54'),
(19, 1, 8, 'Susu Coklat', 'susu-coklat', 'Es susu coklat ala Kaki555.', 'assets/Minuman/milk-based/susu-coklat.jpg', 15000.00, 1, 0, 33, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(20, 1, 9, 'Birawa', 'birawa', 'Minuman soda dengan rasa kopi.', 'assets/menu-seasonal/birawa.jpg', 17000.00, 1, 0, 34, 1, '2026-10-30 14:24:45', '2026-11-11 17:49:25'),
(21, 1, 9, 'Retro Cola', 'retro-cola', 'Minuman soda cola dengan cita rasa resep jadul ala Kaki555.', 'assets/menu-seasonal/retro-cola.jpg', 15000.00, 1, 0, 35, 1, '2026-10-30 14:24:45', '2026-10-30 14:24:45'),
(22, 1, 10, 'Makassar 1', 'makassar-1', 'Mee Nyedas Kami dan es teh manis Regular.', 'assets/Makanan/combo/makassar-1.png', 20000.00, 1, 0, 36, 1, '2026-10-30 14:24:45', '2026-11-11 18:20:15'),
(23, 1, 10, 'Makassar 2', 'makassar-2', 'Tenshinhan dan es teh manis Regular.', 'assets/Makanan/combo/makassar-2.png', 20000.00, 1, 0, 37, 1, '2026-10-30 14:24:45', '2026-11-11 18:20:15'),
(24, 1, 10, 'Makassar 3', 'makassar-3', 'Thai Basil Chicken dan es teh manis Regular.', 'assets/Makanan/combo/makassar-3.png', 27000.00, 1, 0, 38, 1, '2026-10-30 14:24:45', '2026-11-11 18:20:15'),
(25, 1, 11, 'Penak 1', 'penak-1', 'Mee Goreng Kami dan es teh manis Regular.', 'assets/Makanan/combo/penak-1.jpeg', 20000.00, 1, 0, 39, 1, '2026-10-30 14:24:45', '2026-11-11 18:20:15'),
(26, 1, 11, 'Penak 2', 'penak-2', 'Kentang Goreng dan es teh manis Regular.', 'assets/Makanan/combo/penak-2.jpeg', 20000.00, 1, 0, 40, 1, '2026-10-30 14:24:45', '2026-11-11 18:20:15'),
(27, 1, 11, 'Penak 3', 'penak-3', 'Mix Platter dan es teh manis Regular.', 'assets/Makanan/combo/penak-3.jpeg', 30000.00, 1, 0, 41, 1, '2026-10-30 14:24:45', '2026-11-11 18:20:15'),
(28, 2, 2, 'Kentang Goreng Lada Garam', 'kentang-goreng-lada-garam', 'Hidangan kentang berbumbu lada garam.', 'assets/Makanan/snack/kentang-goreng-lada-garam.png', 15000.00, 1, 0, 1, 1, '2026-10-30 14:31:00', '2026-11-11 18:20:15'),
(29, 2, 2, 'Tahu Kriuk Cabe Garam', 'tahu-kriuk-cabe-garam', 'Tahu goreng tepung dengan irisan cabai dan garam.', 'assets/Makanan/snack/tahu-kriuk-cabe-garam.png', 12000.00, 1, 0, 2, 1, '2026-10-30 14:31:00', '2026-11-11 18:20:15'),
(30, 2, 2, 'Tahu + Tempe Kriuk Cabe Garam', 'tahu-tempe-kriuk-cabe-garam', 'Tahu dan tempe goreng tepung dengan irisan cabai dan garam.', 'assets/Makanan/snack/tahu-tempe-kriuk-cabe-garam.png', 12000.00, 1, 0, 3, 1, '2026-10-30 14:31:00', '2026-11-11 18:20:15'),
(31, 2, 2, 'Tahu Tempe Kriuk + Telur Orak Arik Cabe Garam', 'tahu-tempe-kriuk-telur-orak-arik-cabe-garam', 'Tahu dan tempe goreng tepung, telur orak-arik, irisan cabai, dan garam.', 'assets/Makanan/snack/tahu-tempe-kriuk-telur-orak-arik-cabe-garam.png', 14000.00, 1, 0, 4, 1, '2026-10-30 14:31:00', '2026-11-11 18:20:15'),
(32, 2, 1, 'Mee Goreng', 'mee-goreng', 'Mie yang diracik dengan bumbu ala Kaki555 dan disajikan dengan telur dadar.', 'assets/Makanan/main-course/mee-goreng.png', 13000.00, 1, 0, 5, 1, '2026-10-30 14:31:00', '2026-11-11 09:35:31'),
(33, 2, 1, 'Mie Nyemek Pedas', 'mie-nyemek-pedas', 'Mie pedas ala Kaki555 yang disajikan dengan campuran telur.', 'assets/Makanan/main-course/mee-nyedas-kami.png', 14000.00, 1, 0, 6, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(34, 2, 3, 'Telur', 'telur', NULL, 'assets/Makanan/ekstra/telur.jpg', 3000.00, 1, 0, 7, 1, '2026-10-30 14:31:00', '2026-11-11 17:49:25'),
(35, 2, 3, 'Nasi', 'nasi', NULL, 'assets/Makanan/ekstra/nasi.jpg', 4000.00, 1, 0, 8, 1, '2026-10-30 14:31:00', '2026-11-11 17:49:25'),
(36, 2, 5, 'Milo Malaysia Ashoy', 'milo-malaysia-ashoy', 'Milo Malaysia dengan sentuhan ala Kaki555.', 'assets/Minuman/signature/milo-malaysia-ashoy.png', 15000.00, 1, 0, 9, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(37, 2, 6, 'Matcha Latte', 'matcha-latte', 'Teh hijau dengan racikan susu.', 'assets/Minuman/tea-based/matcha-latte.png', 15000.00, 1, 0, 10, 1, '2026-10-30 14:31:00', '2026-11-11 09:35:31'),
(38, 2, 6, 'Teh Tarik', 'teh-tarik', 'Teh hitam dengan campuran susu.', 'assets/Minuman/tea-based/teh-tarik.jpg', 15000.00, 1, 0, 11, 1, '2026-10-30 14:31:00', '2026-11-11 09:24:00'),
(39, 2, 5, 'Es Lemonade', 'es-lemonade', 'Lemon yang diracik ala Kaki555.', 'assets/Minuman/signature/lemonade.png', 13000.00, 1, 0, 12, 1, '2026-10-30 14:31:00', '2026-11-11 09:35:31'),
(40, 2, 6, 'Teh Leci', 'teh-leci', 'Teh hitam dengan racikan sirup buah leci.', 'assets/Minuman/tea-based/teh-leci.jpg', 10000.00, 1, 0, 13, 1, '2026-10-30 14:31:00', '2026-11-11 09:24:00'),
(41, 2, 5, 'Trajosu dan Kukubisu', 'trajosu-dan-kukubisu', 'Minuman berbahan minuman energi yang dicampur susu dan es.', 'assets/Minuman/signature/trakubisu.png', 10000.00, 1, 0, 14, 1, '2026-10-30 14:31:00', '2026-11-11 17:05:56'),
(42, 2, 7, 'Kopi Hitam Tubruk', 'kopi-hitam-tubruk', 'Kopi hitam ala Kaki555.', 'assets/Minuman/coffee-based/kopi-hitam-tubruk.jpg', 6000.00, 1, 0, 15, 1, '2026-10-30 14:31:00', '2026-11-11 09:24:00'),
(43, 2, 7, 'Kopi Susu Tubruk', 'kopi-susu-tubruk', 'Kopi hitam dengan racikan susu ala Kaki555.', 'assets/Minuman/coffee-based/kopi-susu-tubruk.jpg', 8000.00, 1, 0, 16, 1, '2026-10-30 14:31:00', '2026-11-11 09:24:00'),
(44, 2, 7, 'Kopi Susu Tujujati', 'kopi-susu-tujujati', 'Kopi susu Tujujati yang diracik oleh Kaki555.', 'assets/Minuman/coffee-based/kopi-susu-tujujati.jpg', 15000.00, 1, 0, 17, 1, '2026-10-30 14:31:00', '2026-11-11 09:24:00'),
(45, 2, 8, 'Es Susu Coklat', 'es-susu-coklat', 'Minuman es susu coklat.', 'assets/Minuman/milk-based/es-susu-coklat.jpg', 15000.00, 1, 0, 18, 1, '2026-10-30 14:31:00', '2026-11-11 17:00:54'),
(46, 2, 7, 'Es Kopisu Sederhana', 'es-kopisu-sederhana', 'Es kopi susu dengan racikan sederhana.', 'assets/Minuman/coffee-based/kopi-susu-sederhana.jpg', 15000.00, 1, 0, 19, 1, '2026-10-30 14:31:00', '2026-11-11 18:20:15'),
(47, 2, 5, 'Oreo Shake', 'oreo-shake', 'Minuman creamy perpaduan susu dan Oreo.', 'assets/Minuman/signature/oreo-shake.png', 15000.00, 1, 0, 20, 1, '2026-10-30 14:31:00', '2026-11-11 09:35:31'),
(48, 2, 6, 'Es Teh Manis (Small)', 'es-teh-manis-small', 'Es teh manis ukuran Small.', 'assets/Minuman/tea-based/teh-manis-kami.jpg', 4000.00, 1, 0, 21, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(49, 2, 6, 'Es Teh Manis (Medium)', 'es-teh-manis-medium', 'Es teh manis ukuran Medium.', 'assets/Minuman/tea-based/teh-manis-kami.jpg', 6000.00, 1, 0, 22, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(50, 2, 6, 'Es Teh Manis (Large)', 'es-teh-manis-large', 'Es teh manis ukuran Large.', 'assets/Minuman/tea-based/teh-manis-kami.jpg', 10000.00, 1, 0, 23, 1, '2026-10-30 14:31:00', '2026-10-30 14:31:00'),
(51, 2, 5, 'Air Mineral', 'air-mineral', NULL, 'assets/Minuman/signature/air-mineral.jpg', 5000.00, 1, 0, 24, 1, '2026-10-30 14:31:00', '2026-11-11 09:24:00'),
(52, 1, 1, 'Thai Basil Chicken', 'thai-basil-chicken', 'Ayam cincang dengan bumbu khas Thailand dan kemangi, disajikan dengan nasi dan telur.', 'assets/Makanan/main-course/thai-basil-chicken.jpg', 22000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-06 17:30:19'),
(53, 1, 1, 'Nasi Usus Krispy', 'nasi-usus-krispy', 'Nasi usus dengan bumbu ala Kaki555, disajikan dengan telur.', 'assets/Makanan/main-course/nasi-usus-krispy.png', 18000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-06 17:30:19'),
(54, 1, 1, 'Tenshinhan', 'tenshinhan', 'Telur dadar crabstick dengan saus tare, disajikan bersama nasi.', 'assets/Makanan/main-course/tenshinhan.jpg', 15000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-06 17:30:19'),
(55, 1, 1, 'Mee Goreng Kami', 'mee-goreng-kami', 'Mie goreng dengan bumbu khas Kaki555 dan telur.', 'assets/Makanan/main-course/mee-goreng.png', 14000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-11 09:35:31'),
(56, 1, 1, 'Mee Nyedas Kami', 'mee-nyedas-kami', 'Mie nyemek pedas dengan racikan bumbu cabai dan telur.', 'assets/Makanan/main-course/mee-nyedas-kami.png', 15000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-06 17:30:19'),
(57, 1, 2, 'Kentang Goreng Masala', 'kentang-goreng-masala', 'Kentang dengan baluran rempah garam masala khas India.', 'assets/Makanan/snack/kentang-goreng-masala.jpg', 16000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-06 17:30:19'),
(58, 1, 2, 'Kekian', 'kekian', 'Kekian goreng disajikan dengan saus sambal.', 'assets/Makanan/snack/kekian.png', 15000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-11 18:14:32'),
(59, 1, 2, 'Bontosan', 'bontosan', 'Hidangan ringan khas Jepara dengan saus sambal.', 'assets/Makanan/snack/bontosan.png', 10000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-11 18:14:32'),
(60, 1, 2, 'Samosa', 'samosa', 'Pastri goreng berbentuk segitiga dengan isian daging berbumbu khas Timur Tengah.', 'assets/Makanan/snack/samosa.jpg', 16000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-06 17:30:19'),
(61, 1, 2, 'Mix Platter', 'mix-platter', 'Perpaduan kentang, bontosan, dan kekian.', 'assets/Makanan/snack/mix-platter.png', 25000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-06 17:30:19'),
(62, 1, 4, 'Es Krim Loti', 'es-krim-loti', 'Es krim dengan roti khas Melayu ala Kaki555.', 'assets/Makanan/makanan-penutup/es-krim-loti.jpg', 15000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-06 17:30:19'),
(63, 1, 4, 'Cookies', 'cookies', 'Kue kering chocochips rasa coklat, greentea, atau red velvet.', 'assets/Makanan/makanan-penutup/cookies.png', 10000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-11 09:35:31'),
(64, 1, 3, 'Nasi Putih', 'nasi-putih', 'Tambahan nasi putih.', 'assets/Makanan/ekstra/nasi.jpg', 5000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-11 17:49:25'),
(65, 1, 3, 'Telur', 'telur', 'Tambahan telur.', 'assets/Makanan/ekstra/telur.jpg', 5000.00, 1, 0, 0, 1, '2026-11-06 17:30:19', '2026-11-11 17:49:25');

-- --------------------------------------------------------

--
-- Struktur dari tabel `events`
--

CREATE TABLE `events` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `branch_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `start_at` datetime DEFAULT NULL,
  `end_at` datetime DEFAULT NULL,
  `poster` varchar(500) DEFAULT NULL,
  `registration_url` varchar(1000) DEFAULT NULL,
  `status` enum('draft','upcoming','ongoing','completed','cancelled') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `events`
--

INSERT INTO `events` (`id`, `branch_id`, `title`, `slug`, `description`, `start_at`, `end_at`, `poster`, `registration_url`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'A Letter to Myself', 'a-letter-to-myself', 'Kegiatan journaling bersama di Kammari Gresik.', '2026-11-28 09:30:00', '2026-11-28 12:00:00', 'assets/poster-event-mendatang/a-letter-to-myself.jpg', NULL, 'upcoming', '2026-11-12 06:13:00', '2026-11-12 06:13:00'),
(2, NULL, 'Open Mic Meskipun Hujan', 'open-mic-meskipun-hujan', 'Open Mic di Kammari.', '2026-11-13 19:30:00', NULL, 'assets/poster-event-mendatang/open-mic-meskipun-hujan.jpg', NULL, 'upcoming', '2026-11-12 06:13:00', '2026-11-12 06:13:00'),
(3, NULL, 'Walking Tour', 'walking-tour', 'Walking tour di Aston Gresik. Poster mencantumkan jadwal setiap Selasa.', NULL, NULL, 'assets/poster-event-mendatang/walking-tour.jpg', NULL, 'upcoming', '2026-11-12 06:13:00', '2026-11-12 06:13:00'),
(4, 1, 'Crochet Workshop', 'crochet-workshop', 'Workshop crochet untuk pemula di Kammari Gresik.', '2026-11-08 15:00:00', '2026-11-08 17:00:00', 'assets/poster-event-mendatang/crochet_workshop.jpg', NULL, 'completed', '2026-11-12 06:13:00', '2026-11-12 06:13:00'),
(5, 1, 'Art Journaling', 'art-journaling', 'Kegiatan art journaling bersama Kammari.', NULL, NULL, 'assets/Poster-event-terlaksana/art_journaling.jpg', NULL, 'completed', '2026-11-12 06:13:00', '2026-11-12 06:13:00'),
(6, 1, 'Junk Journaling', 'junk-journaling', 'Workshop kreatif junk journaling.', '2026-10-18 09:30:00', '2026-10-18 12:00:00', 'assets/Poster-event-terlaksana/Junk-Journaling.png', NULL, 'completed', '2026-11-12 06:13:00', '2026-11-12 06:13:00'),
(7, NULL, 'Open Mic Bola', 'open-mic-bola', 'Kegiatan Open Mic di Kammari.', '2026-07-10 19:30:00', NULL, 'assets/Poster-event-terlaksana/open-mic-bola.jpg', NULL, 'completed', '2026-11-12 06:13:00', '2026-11-12 06:13:00'),
(8, NULL, 'Open Mic Jumpa Lagi', 'open-mic-jumpa-lagi', 'Kegiatan Open Mic bertema Jumpa Lagi.', '2026-09-04 19:30:00', NULL, 'assets/Poster-event-terlaksana/open-mic-jumpa-lagi.jpg', NULL, 'completed', '2026-11-12 06:13:00', '2026-11-12 06:13:00'),
(9, NULL, 'Open Mic Lagi', 'open-mic-lagi', 'Kegiatan Open Mic bersama komunitas Stand Up Indo Gresik.', '2026-08-21 19:30:00', NULL, 'assets/Poster-event-terlaksana/open-mic-lagi.jpg', NULL, 'completed', '2026-11-12 06:13:00', '2026-11-12 06:13:00'),
(10, NULL, 'Open Mic Listrik', 'open-mic-listrik', 'Kegiatan Open Mic bertema Listrik.', NULL, NULL, 'assets/Poster-event-terlaksana/open-mic-listrik.jpg', NULL, 'completed', '2026-11-12 06:13:00', '2026-11-12 06:13:00'),
(11, NULL, 'Open Mic Perampasan Aset', 'open-mic-perampasan-aset', 'Kegiatan Open Mic bertema Perampasan Aset Sah.', '2026-09-11 19:30:00', NULL, 'assets/Poster-event-terlaksana/open-mic-perampasan-aset.jpg', NULL, 'completed', '2026-11-12 06:13:00', '2026-11-12 06:13:00'),
(12, NULL, 'Open Mic Tasyakuran', 'open-mic-tasyakuran', 'Kegiatan Open Mic bertema Malam Tasyakuran.', '2026-08-07 19:30:00', NULL, 'assets/Poster-event-terlaksana/open-mic-tasyakuran.jpg', NULL, 'completed', '2026-11-12 06:13:00', '2026-11-12 06:13:00'),
(13, NULL, 'Open Mic Tawa', 'open-mic-tawa', 'Kegiatan Open Mic Tawa-Tawa di Kammari.', '2026-07-24 19:30:00', NULL, 'assets/Poster-event-terlaksana/open-mic-tawa.jpg', NULL, 'completed', '2026-11-12 06:13:00', '2026-11-12 06:13:00'),
(14, NULL, 'Open Mic', 'open-mic', 'Kegiatan Open Mic di Kammari.', '2026-10-30 19:30:00', NULL, 'assets/Poster-event-terlaksana/open-mic.jpg', NULL, 'completed', '2026-11-12 06:13:00', '2026-11-12 06:13:00'),
(15, 1, 'Weekend Art Journaling', 'weekend-art-journaling', 'Kegiatan kreatif Weekend Art Journaling.', '2026-09-13 09:30:00', '2026-09-13 12:00:00', 'assets/Poster-event-terlaksana/weekend-art-journaling.jpg', NULL, 'completed', '2026-11-12 06:13:00', '2026-11-12 06:13:00');

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
(26, 'Weekend Art Journaling', 'Event Terlaksana', NULL, NULL, 'weekend-art-journaling.jpg', 'assets/Poster-event-terlaksana/weekend-art-journaling.jpg', 'image', '2026-10-30 14:46:48', '2026-10-30 14:46:48'),
(28, 'Mee Goreng Kami', 'Makanan', 'main-course', NULL, 'mee-goreng.png', 'assets/Makanan/main-course/mee-goreng.png', 'image', '2026-11-11 09:35:43', '2026-11-11 09:35:43'),
(29, 'Cookies', 'Makanan', 'makanan-penutup', NULL, 'cookies.png', 'assets/Makanan/makanan-penutup/cookies.png', 'image', '2026-11-11 09:35:43', '2026-11-11 09:35:43'),
(30, 'Indonesiano', 'Minuman', 'coffee-based', NULL, 'indonesiano.jpg', 'assets/Minuman/coffee-based/indonesiano.jpg', 'image', '2026-11-11 09:35:43', '2026-11-11 09:35:43'),
(31, 'Kopi Hitam Tubruk', 'Minuman', 'coffee-based', NULL, 'kopi-hitam-tubruk.jpg', 'assets/Minuman/coffee-based/kopi-hitam-tubruk.jpg', 'image', '2026-11-11 09:35:43', '2026-11-11 09:35:43'),
(32, 'Kopi Susu Sederhana', 'Minuman', 'coffee-based', NULL, 'kopi-susu-sederhana.jpg', 'assets/Minuman/coffee-based/kopi-susu-sederhana.jpg', 'image', '2026-11-11 09:35:43', '2026-11-11 09:35:43'),
(33, 'Kopi Susu Tubruk', 'Minuman', 'coffee-based', NULL, 'kopi-susu-tubruk.jpg', 'assets/Minuman/coffee-based/kopi-susu-tubruk.jpg', 'image', '2026-11-11 09:35:43', '2026-11-11 09:35:43'),
(34, 'Kopi Susu Tujujati', 'Minuman', 'coffee-based', NULL, 'kopi-susu-tujujati.jpg', 'assets/Minuman/coffee-based/kopi-susu-tujujati.jpg', 'image', '2026-11-11 09:35:43', '2026-11-11 09:35:43'),
(35, 'Air Mineral', 'Minuman', 'signature', NULL, 'air-mineral.jpg', 'assets/Minuman/signature/air-mineral.jpg', 'image', '2026-11-11 09:35:43', '2026-11-11 09:35:43'),
(36, 'Lemonade', 'Minuman', 'signature', NULL, 'lemonade.png', 'assets/Minuman/signature/lemonade.png', 'image', '2026-11-11 09:35:43', '2026-11-11 09:35:43'),
(37, 'Oreo Shake', 'Minuman', 'signature', NULL, 'oreo-shake.png', 'assets/Minuman/signature/oreo-shake.png', 'image', '2026-11-11 09:35:43', '2026-11-11 09:35:43'),
(38, 'Trakubisu', 'Minuman', 'signature', NULL, 'trakubisu.png', 'assets/Minuman/signature/trakubisu.png', 'image', '2026-11-11 09:35:43', '2026-11-11 09:35:43'),
(39, 'Matcha Latte', 'Minuman', 'tea-based', NULL, 'matcha-latte.png', 'assets/Minuman/tea-based/matcha-latte.png', 'image', '2026-11-11 09:35:43', '2026-11-11 09:35:43'),
(40, 'Teh Leci', 'Minuman', 'tea-based', NULL, 'teh-leci.jpg', 'assets/Minuman/tea-based/teh-leci.jpg', 'image', '2026-11-11 09:35:43', '2026-11-11 09:35:43'),
(41, 'Teh Tarik', 'Minuman', 'tea-based', NULL, 'teh-tarik.jpg', 'assets/Minuman/tea-based/teh-tarik.jpg', 'image', '2026-11-11 09:35:43', '2026-11-11 09:35:43'),
(42, 'Makassar 1', 'Makanan', 'combo-makassar', 10, 'makassar-1.jpg', 'assets/Makanan/combo/makassar-1.jpg', 'image', '2026-11-11 17:01:13', '2026-11-11 17:01:13'),
(43, 'Makassar 2', 'Makanan', 'combo-makassar', 10, 'makassar-2.jpg', 'assets/Makanan/combo/makassar-2.jpg', 'image', '2026-11-11 17:01:13', '2026-11-11 17:01:13'),
(44, 'Makassar 3', 'Makanan', 'combo-makassar', 10, 'makassar-3.jpg', 'assets/Makanan/combo/makassar-3.jpg', 'image', '2026-11-11 17:01:13', '2026-11-11 17:01:13'),
(45, 'Penak 1', 'Makanan', 'combo-penak', 11, 'penak-1.jpg', 'assets/Makanan/combo/penak-1.jpg', 'image', '2026-11-11 17:01:13', '2026-11-11 17:01:13'),
(46, 'Penak 2', 'Makanan', 'combo-penak', 11, 'penak-2.jpg', 'assets/Makanan/combo/penak-2.jpg', 'image', '2026-11-11 17:01:13', '2026-11-11 17:01:13'),
(47, 'Penak 3', 'Makanan', 'combo-penak', 11, 'penak-3.jpg', 'assets/Makanan/combo/penak-3.jpg', 'image', '2026-11-11 17:01:13', '2026-11-11 17:01:13'),
(48, 'Ketan Susu', 'Minuman', 'milk-based', 8, 'ketan-susu.jpg', 'assets/Minuman/milk-based/ketan-susu.jpg', 'image', '2026-11-11 17:01:13', '2026-11-11 17:01:13'),
(49, 'Milky Peach', 'Minuman', 'milk-based', 8, 'milky-peach.jpg', 'assets/Minuman/milk-based/milky-peach.jpg', 'image', '2026-11-11 17:01:13', '2026-11-11 17:01:13'),
(50, 'Es Susu Coklat', 'Minuman', 'milk-based', 8, 'es-susu-coklat.jpg', 'assets/Minuman/milk-based/es-susu-coklat.jpg', 'image', '2026-11-11 17:01:13', '2026-11-11 17:01:13'),
(51, 'Kentang Goreng Lada Garam', 'Makanan', 'snack', 2, 'kentang-goreng-lada-garam.jpg', 'assets/Makanan/snack/kentang-goreng-lada-garam.jpg', 'image', '2026-11-11 17:01:13', '2026-11-11 17:01:13'),
(52, 'Tahu Kriuk Cabe Garam', 'Makanan', 'snack', 2, 'tahu-kriuk-cabe-garam.jpg', 'assets/Makanan/snack/tahu-kriuk-cabe-garam.jpg', 'image', '2026-11-11 17:01:13', '2026-11-11 17:01:13'),
(53, 'Tahu + Tempe Kriuk Cabe Garam', 'Makanan', 'snack', 2, 'tahu-tempe-kriuk-cabe-garam.jpg', 'assets/Makanan/snack/tahu-tempe-kriuk-cabe-garam.jpg', 'image', '2026-11-11 17:01:13', '2026-11-11 17:01:13'),
(54, 'Tahu Tempe Kriuk + Telur Orak Arik Cabe Garam', 'Makanan', 'snack', 2, 'tahu-tempe-kriuk-telur-orak-arik-cabe-garam.jpg', 'assets/Makanan/snack/tahu-tempe-kriuk-telur-orak-arik-cabe-garam.jpg', 'image', '2026-11-11 17:01:13', '2026-11-11 17:01:13'),
(55, 'Kekian', 'Makanan', 'snack', 2, 'kekian.jpg', 'assets/Makanan/snack/kekian.jpg', 'image', '2026-11-11 17:01:13', '2026-11-11 17:01:13'),
(56, 'Bontosan', 'Makanan', 'snack', 2, 'bontosan.jpg', 'assets/Makanan/snack/bontosan.jpg', 'image', '2026-11-11 17:01:13', '2026-11-11 17:01:13'),
(73, 'Nasi', 'Makanan', 'ekstra', NULL, 'nasi.jpg', 'assets/Makanan/ekstra/nasi.jpg', 'image', '2026-11-11 17:49:25', '2026-11-11 17:49:25'),
(74, 'Telur', 'Makanan', 'ekstra', NULL, 'telur.jpg', 'assets/Makanan/ekstra/telur.jpg', 'image', '2026-11-11 17:49:25', '2026-11-11 17:49:25'),
(75, 'Birawa', 'Menu Seasonal', 'menu-seasonal', NULL, 'birawa.jpg', 'assets/menu-seasonal/birawa.jpg', 'image', '2026-11-11 17:49:25', '2026-11-11 17:49:25'),
(77, 'A Letter to Myself', 'Event Mendatang', NULL, NULL, 'a-letter-to-myself.jpg', 'assets/poster-event-mendatang/a-letter-to-myself.jpg', 'image', '2026-11-11 17:49:41', '2026-11-11 17:49:41'),
(78, 'Open Mic Meski Pun Hujan', 'Event Mendatang', NULL, NULL, 'open-mic-meski-pun-hujan.jpg', 'assets/poster-event-mendatang/open-mic-meski-pun-hujan.jpg', 'image', '2026-11-11 17:49:41', '2026-11-11 17:49:41'),
(79, 'Sudut Duduk Kursi Kayu', 'Fasilitas', 'gresik', NULL, 'sudut-duduk-kursi-kayu.jpg', 'assets/fasilitas/gresik/sudut-duduk-kursi-kayu.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(80, 'Area Baca dan Meja', 'Fasilitas', 'gresik', NULL, 'area-baca-dan-meja.jpg', 'assets/fasilitas/gresik/area-baca-dan-meja.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(81, 'Sudut Buku dan Dekorasi', 'Fasilitas', 'gresik', NULL, 'sudut-buku-dan-dekorasi.jpg', 'assets/fasilitas/gresik/sudut-buku-dan-dekorasi.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(82, 'Ruang Utama dan Meja Bar', 'Fasilitas', 'gresik', NULL, 'ruang-utama-dan-meja-bar.jpg', 'assets/fasilitas/gresik/ruang-utama-dan-meja-bar.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(83, 'Kursi Bar Dekat Jendela', 'Fasilitas', 'gresik', NULL, 'kursi-bar-dekat-jendela.jpg', 'assets/fasilitas/gresik/kursi-bar-dekat-jendela.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(84, 'Area Duduk Dekat Jendela', 'Fasilitas', 'gresik', NULL, 'area-duduk-dekat-jendela.jpg', 'assets/fasilitas/gresik/area-duduk-dekat-jendela.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(85, 'Rak Buku dan Pajangan', 'Fasilitas', 'gresik', NULL, 'rak-buku-dan-pajangan.jpg', 'assets/fasilitas/gresik/rak-buku-dan-pajangan.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(86, 'Rak Buku Tampak Depan', 'Fasilitas', 'gresik', NULL, 'rak-buku-tampak-depan.jpg', 'assets/fasilitas/gresik/rak-buku-tampak-depan.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(87, 'Area Pintu Masuk', 'Fasilitas', 'gresik', NULL, 'area-pintu-masuk.jpg', 'assets/fasilitas/gresik/area-pintu-masuk.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(88, 'Sudut Duduk Jendela', 'Fasilitas', 'gresik', NULL, 'sudut-duduk-jendela.jpg', 'assets/fasilitas/gresik/sudut-duduk-jendela.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(89, 'Sudut Display Buku', 'Fasilitas', 'gresik', NULL, 'sudut-display-buku.jpg', 'assets/fasilitas/gresik/sudut-display-buku.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(90, 'Dinding Pajangan Seni', 'Fasilitas', 'gresik', NULL, 'dinding-pajangan-seni.jpg', 'assets/fasilitas/gresik/dinding-pajangan-seni.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(91, 'Area Bar dan Peracikan', 'Fasilitas', 'gresik', NULL, 'area-bar-peracikan.jpg', 'assets/fasilitas/gresik/area-bar-peracikan.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(92, 'Sudut Galeri Dinding', 'Fasilitas', 'gresik', NULL, 'sudut-galeri-dinding.jpg', 'assets/fasilitas/gresik/sudut-galeri-dinding.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(93, 'Sudut Perlengkapan Minuman', 'Fasilitas', 'gresik', NULL, 'sudut-perlengkapan-minuman.jpg', 'assets/fasilitas/gresik/sudut-perlengkapan-minuman.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(94, 'Tampak Depan dengan Tanaman', 'Fasilitas', 'gresik', NULL, 'tampak-depan-dengan-tanaman.jpg', 'assets/fasilitas/gresik/tampak-depan-dengan-tanaman.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(95, 'Papan Menu dan Dekorasi', 'Fasilitas', 'gresik', NULL, 'papan-menu-dan-dekorasi.jpg', 'assets/fasilitas/gresik/papan-menu-dan-dekorasi.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(96, 'Pintu Masuk Bergaya Vintage', 'Fasilitas', 'gresik', NULL, 'pintu-masuk-vintage.jpg', 'assets/fasilitas/gresik/pintu-masuk-vintage.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(97, 'Sudut Area Acara', 'Fasilitas', 'gresik', NULL, 'sudut-area-acara.jpg', 'assets/fasilitas/gresik/sudut-area-acara.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(98, 'Tampak Depan Malam Hari', 'Fasilitas', 'gresik', NULL, 'tampak-depan-malam.jpg', 'assets/fasilitas/gresik/tampak-depan-malam.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(99, 'Area Bar dengan Pengunjung', 'Fasilitas', 'gresik', NULL, 'area-bar-dengan-pengunjung.jpg', 'assets/fasilitas/gresik/area-bar-dengan-pengunjung.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(100, 'Area Duduk Outdoor Vintage', 'Fasilitas', 'gresik', NULL, 'area-duduk-outdoor-vintage.jpg', 'assets/fasilitas/gresik/area-duduk-outdoor-vintage.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(101, 'Teras Hijau', 'Fasilitas', 'gresik', NULL, 'teras-hijau.jpg', 'assets/fasilitas/gresik/teras-hijau.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(102, 'Ruang Pameran Seni', 'Fasilitas', 'gresik', NULL, 'ruang-pameran-seni.jpg', 'assets/fasilitas/gresik/ruang-pameran-seni.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(103, 'Papan Identitas dan Fasad', 'Fasilitas', 'gresik', NULL, 'papan-identitas-fasad.jpg', 'assets/fasilitas/gresik/papan-identitas-fasad.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(104, 'Area Duduk Samping', 'Fasilitas', 'gresik', NULL, 'area-duduk-samping.jpg', 'assets/fasilitas/gresik/area-duduk-samping.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(105, 'Area Bar dan Audio', 'Fasilitas', 'gresik', NULL, 'area-bar-dan-audio.jpg', 'assets/fasilitas/gresik/area-bar-dan-audio.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(106, 'Lorong Depan Kafe Malam Hari', 'Fasilitas', 'gresik', NULL, 'lorong-depan-kafe-malam.jpg', 'assets/fasilitas/gresik/lorong-depan-kafe-malam.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(107, 'Pajangan Manifesto', 'Fasilitas', 'gresik', NULL, 'pajangan-manifesto.jpg', 'assets/fasilitas/gresik/pajangan-manifesto.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(108, 'Fasad dan Pintu Masuk', 'Fasilitas', 'gresik', NULL, 'fasad-dan-pintu-masuk.jpg', 'assets/fasilitas/gresik/fasad-dan-pintu-masuk.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(109, 'Halaman dengan Tanaman', 'Fasilitas', 'gresik', NULL, 'halaman-dengan-tanaman.jpg', 'assets/fasilitas/gresik/halaman-dengan-tanaman.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(110, 'Kolase Suasana Kafe 01', 'Fasilitas', 'gresik', NULL, 'kolase-suasana-kafe-01.jpeg', 'assets/fasilitas/gresik/kolase-suasana-kafe-01.jpeg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(111, 'Kursi Outdoor Dinding Vintage', 'Fasilitas', 'gresik', NULL, 'kursi-outdoor-dinding-vintage.jpeg', 'assets/fasilitas/gresik/kursi-outdoor-dinding-vintage.jpeg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(112, 'Tampak Depan Kafe Siang Hari', 'Fasilitas', 'gresik', NULL, 'tampak-depan-kafe-siang.jpeg', 'assets/fasilitas/gresik/tampak-depan-kafe-siang.jpeg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(113, 'Rak Buku Area Duduk', 'Fasilitas', 'gresik', NULL, 'rak-buku-area-duduk.jpeg', 'assets/fasilitas/gresik/rak-buku-area-duduk.jpeg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(114, 'Kolase Suasana Kafe 02', 'Fasilitas', 'gresik', NULL, 'kolase-suasana-kafe-02.jpeg', 'assets/fasilitas/gresik/kolase-suasana-kafe-02.jpeg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(115, 'Meja Outdoor Bawah Jendela', 'Fasilitas', 'gresik', NULL, 'meja-outdoor-bawah-jendela.jpeg', 'assets/fasilitas/gresik/meja-outdoor-bawah-jendela.jpeg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(116, 'Sudut Meja Bundar', 'Fasilitas', 'gresik', NULL, 'sudut-meja-bundar.jpeg', 'assets/fasilitas/gresik/sudut-meja-bundar.jpeg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(117, 'Rak Dekorasi dan Kursi Kayu', 'Fasilitas', 'gresik', NULL, 'rak-dekorasi-dan-kursi-kayu.jpeg', 'assets/fasilitas/gresik/rak-dekorasi-dan-kursi-kayu.jpeg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(118, 'Ruang Duduk dengan Logo Kammari', 'Fasilitas', 'gresik', NULL, 'ruang-duduk-logo-kammari.jpeg', 'assets/fasilitas/gresik/ruang-duduk-logo-kammari.jpeg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(119, 'Ruang Utama dengan Pajangan Seni', 'Fasilitas', 'gresik', NULL, 'ruang-utama-pajangan-seni.jpeg', 'assets/fasilitas/gresik/ruang-utama-pajangan-seni.jpeg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52'),
(120, 'Area Duduk Outdoor Surabaya', 'Fasilitas', 'surabaya', NULL, 'area-duduk-outdoor-surabaya.jpg', 'assets/fasilitas/surabaya/area-duduk-outdoor-surabaya.jpg', 'image', '2026-11-11 18:07:52', '2026-11-11 18:07:52');

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT untuk tabel `media_assets`
--
ALTER TABLE `media_assets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

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
