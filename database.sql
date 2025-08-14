-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th8 14, 2025 lúc 06:42 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `motelpro`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `assets`
--

CREATE TABLE `assets` (
  `id` int(11) NOT NULL,
  `property_id` int(11) NOT NULL,
  `room_id` int(11) DEFAULT NULL,
  `asset_type_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `serial_number` varchar(100) DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `warranty_end_date` date DEFAULT NULL,
  `value` decimal(12,2) DEFAULT NULL,
  `status` enum('in_use','in_storage','under_repair','disposed') DEFAULT 'in_use',
  `notes` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `assets`
--

INSERT INTO `assets` (`id`, `property_id`, `room_id`, `asset_type_id`, `name`, `serial_number`, `purchase_date`, `warranty_end_date`, `value`, `status`, `notes`, `createdAt`, `updatedAt`, `quantity`) VALUES
(1, 1, 2, 1, 'Tivi Samsung 43 inch', 'TV-SM43-0001', '2024-05-10', '2026-05-10', 7000000.00, 'in_use', 'Smart TV full HD', '2025-08-11 20:59:54', '2025-08-11 14:03:10', 1),
(2, 1, 3, 1, 'Tivi LG 50 inch', 'TV-LG50-0002', '2024-06-12', '2026-06-12', 9000000.00, 'in_use', 'Smart TV 4K', '2025-08-11 20:59:54', '2025-08-11 16:25:15', 1),
(3, 2, 5, 2, 'Máy lạnh Daikin 1HP', 'AC-DK1HP-0003', '2024-07-15', '2027-07-15', 9000000.00, 'in_use', 'Tiết kiệm điện', '2025-08-11 20:59:54', '2025-08-11 14:03:40', 1),
(4, 2, 6, 2, 'Máy lạnh Panasonic 1.5HP', 'AC-PN15-0004', '2024-07-20', '2027-07-20', 8500000.00, 'in_use', 'Chế độ lọc không khí', '2025-08-11 20:59:54', '2025-08-11 17:08:33', 1),
(5, 3, 9, 3, 'Tủ lạnh Toshiba 200L', 'FR-TS200-0005', '2024-08-05', '2026-08-05', 7000000.00, 'in_use', 'Ngăn đá rộng', '2025-08-11 20:59:54', '2025-08-11 14:05:49', 1),
(6, 3, 10, 3, 'Tủ lạnh Panasonic 250L', 'FR-PN250-0006', '2024-08-06', '2026-08-06', 8500000.00, 'in_use', 'Công nghệ Inverter', '2025-08-11 20:59:54', '2025-08-11 14:04:20', 1),
(7, 1, 1, 4, 'Máy giặt LG 8Kg', 'WM-LG8-0007', '2024-09-01', '2026-09-01', 7000000.00, 'in_use', 'Giặt nhanh', '2025-08-11 20:59:54', '2025-08-14 13:55:11', 1),
(8, 1, 4, 4, 'Máy giặt Samsung 9Kg', 'WM-SM9-0008', '2024-09-02', '2026-09-02', 8000000.00, 'in_use', 'Tiết kiệm nước', '2025-08-11 20:59:54', '2025-08-11 14:03:30', 1),
(9, 2, 7, 5, 'Bếp gas đôi Rinnai', 'GS-RN-0009', '2024-09-05', '2025-09-05', 2500000.00, 'in_use', 'Bếp gas an toàn', '2025-08-11 20:59:54', '2025-08-11 15:50:57', 1),
(10, 2, 8, 5, 'Bếp gas đơn Namilux', 'GS-NM-0010', '2024-09-06', '2025-09-06', 1500000.00, 'in_use', 'Bếp nhỏ gọn', '2025-08-11 20:59:54', '2025-08-11 14:04:07', 1),
(11, 1, 5, 1, 'TV Sony Bravia 43\"', 'SON-TV-0011', '2023-05-01', '2026-05-01', 8000000.00, 'in_use', 'Hình ảnh sắc nét, âm thanh sống động', '2025-08-11 21:09:33', '2025-08-11 21:09:33', 1),
(12, 2, 7, 1, 'Loa Bluetooth JBL PartyBox', 'JBL-SPK-0012', '2024-02-10', '2026-02-10', 4500000.00, 'in_use', 'Âm thanh mạnh mẽ, pin 12h', '2025-08-11 21:09:33', '2025-08-11 15:50:57', 1),
(13, 3, 9, 1, 'Tivi Xiaomi Mi TV 4A 55\"', 'XM-TV-0013', '2024-08-05', '2027-08-05', 9500000.00, 'in_use', 'Smart TV hỗ trợ Netflix, Youtube', '2025-08-11 21:09:33', '2025-08-11 21:09:33', 1),
(14, 1, 6, 2, 'Máy lạnh Toshiba 1HP', 'TOS-AC-0014', '2023-03-15', '2028-03-15', 7500000.00, 'in_use', 'Tiết kiệm điện, chạy êm', '2025-08-11 21:09:33', '2025-08-11 17:08:33', 1),
(15, 2, 8, 2, 'Máy lạnh LG Inverter 1.5HP', 'LG-AC-0015', '2024-05-12', '2029-05-12', 9800000.00, 'in_use', 'Làm lạnh nhanh, bảo hành 5 năm', '2025-08-11 21:09:33', '2025-08-11 14:11:37', 1),
(16, 3, 10, 2, 'Máy lạnh Samsung WindFree 1HP', 'SS-AC-0016', '2024-07-01', '2029-07-01', 8900000.00, 'in_use', 'Không thổi gió trực tiếp, êm ái', '2025-08-11 21:09:33', '2025-08-11 21:09:33', 1),
(17, 1, 2, 3, 'Bếp từ Philips 2000W', 'PH-BEP-0017', '2023-06-22', '2026-06-22', 1500000.00, 'in_use', 'Nấu nhanh, tiết kiệm điện', '2025-08-11 21:09:33', '2025-08-11 21:09:33', 1),
(18, 2, 5, 3, 'Lò vi sóng Sharp 23L', 'SH-MW-0018', '2024-04-15', '2027-04-15', 2200000.00, 'in_use', 'Nhiều chế độ nấu', '2025-08-11 21:09:33', '2025-08-11 14:11:44', 1),
(19, 3, 8, 3, 'Nồi cơm điện Panasonic 1.8L', 'PN-RC-0019', '2023-11-05', '2026-11-05', 1200000.00, 'in_use', 'Chống dính, dễ vệ sinh', '2025-08-11 21:09:33', '2025-08-11 21:09:33', 1),
(20, 1, 4, 4, 'Bàn gỗ sồi 1m2', 'BG-GO-0020', '2024-01-10', '2034-01-10', 2500000.00, 'in_use', 'Bàn ăn 4 người', '2025-08-11 21:09:33', '2025-08-11 21:09:33', 1),
(21, 2, 7, 4, 'Ghế sofa vải nỉ', 'SOFA-0021', '2024-06-01', '2034-06-01', 5500000.00, 'in_use', 'Màu xám, chống bẩn', '2025-08-11 21:09:33', '2025-08-11 15:50:57', 1),
(22, 3, 11, 4, 'Tủ quần áo gỗ xoan', 'TQA-0022', '2023-02-14', '2033-02-14', 4800000.00, 'in_use', '2 cánh, rộng rãi', '2025-08-11 21:09:33', '2025-08-11 15:55:38', 1),
(23, 1, 1, 5, 'Đèn LED trần Philips', 'LED-0023', '2024-03-12', '2029-03-12', 900000.00, 'in_use', 'Ánh sáng ấm', '2025-08-11 21:09:33', '2025-08-14 13:55:11', 1),
(24, 2, 6, 5, 'Đèn ngủ Xiaomi', 'LED-0024', '2024-05-20', '2027-05-20', 500000.00, 'in_use', 'Điều chỉnh độ sáng', '2025-08-11 21:09:33', '2025-08-11 17:08:33', 1),
(25, 3, 9, 5, 'Đèn bàn học Rạng Đông', 'LED-0025', '2023-12-10', '2026-12-10', 350000.00, 'in_use', 'Tiết kiệm điện', '2025-08-11 21:09:33', '2025-08-11 21:09:33', 1),
(26, 1, 3, 6, 'Tranh treo tường phong cảnh', 'TR-0026', '2024-01-01', '2030-01-01', 700000.00, 'in_use', 'Phong cảnh thiên nhiên', '2025-08-11 21:09:33', '2025-08-11 16:25:15', 1),
(27, 2, 5, 6, 'Rèm cửa vải bố', 'REM-0027', '2024-07-15', '2034-07-15', 1500000.00, 'in_use', 'Chống nắng tốt', '2025-08-11 21:09:33', '2025-08-11 14:12:05', 1),
(28, 3, 8, 6, 'Thảm trải sàn 2x3m', 'THAM-0028', '2023-09-25', '2033-09-25', 2100000.00, 'in_use', 'Màu be sang trọng', '2025-08-11 21:09:33', '2025-08-11 21:09:33', 1),
(29, 1, 12, 7, 'Bồn cầu Inax', 'WC-0029', '2023-05-10', '2033-05-10', 3500000.00, 'in_use', 'Tiết kiệm nước', '2025-08-11 21:09:33', '2025-08-11 17:08:44', 1),
(30, 2, 4, 7, 'Vòi sen Toto', 'VS-0030', '2024-06-30', '2034-06-30', 1800000.00, 'in_use', 'Áp lực mạnh', '2025-08-11 21:09:33', '2025-08-11 14:12:10', 1),
(31, 3, 10, 7, 'Chậu rửa lavabo Caesar', 'LB-0031', '2023-10-12', '2033-10-12', 2500000.00, 'in_use', 'Thiết kế đẹp', '2025-08-11 21:09:33', '2025-08-11 21:09:33', 1),
(32, 1, 7, 8, 'Camera Hikvision 2MP', 'CAM-0032', '2024-04-15', '2029-04-15', 1500000.00, 'in_use', 'Quan sát 24/7', '2025-08-11 21:09:33', '2025-08-11 15:50:57', 1),
(33, 2, 9, 8, 'Khóa cửa vân tay Samsung', 'LOCK-0033', '2023-11-20', '2028-11-20', 3800000.00, 'in_use', 'Mở khóa nhanh', '2025-08-11 21:09:33', '2025-08-11 14:12:16', 1),
(34, 3, 5, 8, 'Chuông cửa có hình Panasonic', 'BELL-0034', '2024-02-05', '2029-02-05', 2200000.00, 'in_use', 'Màn hình LCD', '2025-08-11 21:09:33', '2025-08-11 21:09:33', 1),
(35, 1, 6, 9, 'Máy giặt Electrolux 9Kg', 'MG-0035', '2024-01-18', '2029-01-18', 8900000.00, 'in_use', 'Giặt sạch, ít nhăn', '2025-08-11 21:09:33', '2025-08-11 17:08:33', 1),
(36, 2, 11, 9, 'Máy sấy Toshiba 7Kg', 'MS-0036', '2023-12-30', '2028-12-30', 7700000.00, 'in_use', 'Sấy nhanh', '2025-08-11 21:09:33', '2025-08-11 15:55:38', 1),
(37, 3, 2, 9, 'Máy giặt LG TwinWash 10Kg', 'MG-0037', '2024-05-25', '2029-05-25', 12500000.00, 'in_use', 'Giặt song song', '2025-08-11 21:09:33', '2025-08-11 21:09:33', 1),
(38, 1, 3, 10, 'Bình nước nóng Ariston 30L', 'BNN-0038', '2023-06-14', '2028-06-14', 3200000.00, 'in_use', 'Giữ nhiệt lâu', '2025-08-11 21:09:33', '2025-08-11 16:25:15', 1),
(39, 2, 8, 10, 'Quạt trần Panasonic', 'QT-0039', '2024-03-02', '2029-03-02', 2100000.00, 'in_use', 'Gió mạnh, êm ái', '2025-08-11 21:09:33', '2025-08-11 14:12:31', 1),
(40, 3, 1, 10, 'Máy lọc không khí Sharp', 'MLK-0040', '2024-07-10', '2029-07-10', 4500000.00, 'in_use', 'Khử mùi, lọc bụi mịn', '2025-08-11 21:09:33', '2025-08-14 13:55:11', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `asset_types`
--

CREATE TABLE `asset_types` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `asset_types`
--

INSERT INTO `asset_types` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Tivi', '2025-08-11 20:59:54', '2025-08-11 20:59:54'),
(2, 'Máy lạnh', '2025-08-11 20:59:54', '2025-08-11 20:59:54'),
(3, 'Tủ lạnh', '2025-08-11 20:59:54', '2025-08-11 20:59:54'),
(4, 'Máy giặt', '2025-08-11 20:59:54', '2025-08-11 20:59:54'),
(5, 'Bếp gas', '2025-08-11 20:59:54', '2025-08-11 20:59:54'),
(6, 'Bếp điện', '2025-08-11 20:59:54', '2025-08-11 20:59:54'),
(7, 'Bàn ghế', '2025-08-11 20:59:54', '2025-08-11 20:59:54'),
(8, 'Giường', '2025-08-11 20:59:54', '2025-08-11 20:59:54'),
(9, 'Đèn chiếu sáng', '2025-08-11 20:59:54', '2025-08-11 20:59:54'),
(10, 'Khóa cửa thông minh', '2025-08-11 20:59:54', '2025-08-11 20:59:54');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `contracts`
--

CREATE TABLE `contracts` (
  `id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `tenant_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `rent_price` decimal(12,2) NOT NULL,
  `deposit_amount` decimal(12,2) DEFAULT 0.00,
  `status` enum('active','expired','terminated') DEFAULT 'active',
  `contract_url` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_signed` tinyint(1) DEFAULT 0,
  `signed_at` datetime DEFAULT NULL,
  `content` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `contracts`
--

INSERT INTO `contracts` (`id`, `room_id`, `tenant_id`, `start_date`, `end_date`, `rent_price`, `deposit_amount`, `status`, `contract_url`, `createdAt`, `updatedAt`, `is_signed`, `signed_at`, `content`) VALUES
(1, 1, 2, '2025-01-01', '2025-12-31', 3000000.00, 3000000.00, 'active', NULL, '2025-08-11 21:00:27', '2025-08-11 21:00:27', 1, '2025-08-11 21:00:27', 'HĐ thuê phòng 101 - Nhà trọ Phú Hữu'),
(2, 2, 3, '2025-02-01', '2025-12-31', 3200000.00, 3200000.00, 'active', NULL, '2025-08-11 21:00:27', '2025-08-11 21:00:27', 1, '2025-08-11 21:00:27', 'HĐ thuê phòng 102 - Nhà trọ Phú Hữu'),
(3, 3, 4, '2025-03-01', '2025-12-31', 3500000.00, 3500000.00, 'active', NULL, '2025-08-11 21:00:27', '2025-08-11 21:00:27', 1, '2025-08-11 21:00:27', 'HĐ thuê phòng 103 - Nhà trọ Phú Hữu'),
(4, 4, 5, '2025-04-01', '2025-12-31', 3800000.00, 3800000.00, 'active', NULL, '2025-08-11 21:00:27', '2025-08-11 21:00:27', 1, '2025-08-11 21:00:27', 'HĐ thuê phòng 104 - Nhà trọ Phú Hữu'),
(5, 5, 6, '2025-05-01', '2025-12-31', 4200000.00, 4200000.00, 'active', NULL, '2025-08-11 21:00:27', '2025-08-11 21:00:27', 1, '2025-08-11 21:00:27', 'HĐ thuê phòng 201 - Nhà trọ Liên Phường'),
(6, 6, 7, '2025-06-01', '2025-12-31', 3100000.00, 3100000.00, 'active', NULL, '2025-08-11 21:00:27', '2025-08-11 21:00:27', 1, '2025-08-11 21:00:27', 'HĐ thuê phòng 202 - Nhà trọ Liên Phường'),
(7, 7, 8, '2025-07-01', '2025-12-31', 3400000.00, 3400000.00, 'active', NULL, '2025-08-11 21:00:27', '2025-08-11 21:00:27', 1, '2025-08-11 21:00:27', 'HĐ thuê phòng 203 - Nhà trọ Liên Phường'),
(13, 8, 11, '2025-08-11', '2025-11-11', 3600000.00, 3600000.00, 'active', NULL, '2025-08-11 17:09:24', '2025-08-11 17:10:35', 1, '2025-08-11 17:10:35', 'hi');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `contract_id` int(11) NOT NULL,
  `issue_date` date NOT NULL,
  `due_date` date NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `status` enum('pending','paid','overdue','cancelled') DEFAULT 'pending',
  `billing_month` int(11) NOT NULL,
  `billing_year` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `invoices`
--

INSERT INTO `invoices` (`id`, `contract_id`, `issue_date`, `due_date`, `total_amount`, `status`, `billing_month`, `billing_year`, `createdAt`, `updatedAt`) VALUES
(2, 2, '2025-08-01', '2025-08-10', 3200000.00, 'pending', 8, 2025, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(3, 3, '2025-08-01', '2025-08-10', 3500000.00, 'paid', 8, 2025, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(4, 4, '2025-08-01', '2025-08-10', 3800000.00, 'overdue', 8, 2025, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(5, 5, '2025-08-01', '2025-08-10', 4200000.00, 'paid', 8, 2025, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(6, 6, '2025-08-01', '2025-08-10', 3100000.00, 'pending', 8, 2025, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(7, 7, '2025-08-01', '2025-08-10', 3400000.00, 'paid', 8, 2025, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(11, 1, '2025-08-05', '2025-08-15', 450000.00, 'paid', 8, 2025, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(12, 2, '2025-08-05', '2025-08-15', 480000.00, 'pending', 8, 2025, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(13, 3, '2025-08-05', '2025-08-15', 420000.00, 'paid', 8, 2025, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(14, 4, '2025-08-05', '2025-08-15', 500000.00, 'pending', 8, 2025, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(15, 5, '2025-08-05', '2025-08-15', 520000.00, 'paid', 8, 2025, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(16, 6, '2025-08-05', '2025-08-15', 390000.00, 'pending', 8, 2025, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(17, 7, '2025-08-05', '2025-08-15', 410000.00, 'paid', 8, 2025, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(31, 1, '2025-08-14', '2025-08-31', 3987000.00, 'pending', 8, 2025, '2025-08-14 16:42:00', '2025-08-14 16:42:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `invoice_items`
--

CREATE TABLE `invoice_items` (
  `id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `invoice_items`
--

INSERT INTO `invoice_items` (`id`, `invoice_id`, `description`, `amount`, `createdAt`, `updatedAt`) VALUES
(2, 2, 'Tiền phòng tháng 8/2025', 3200000.00, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(3, 3, 'Tiền phòng tháng 8/2025', 3500000.00, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(4, 4, 'Tiền phòng tháng 8/2025', 3800000.00, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(5, 5, 'Tiền phòng tháng 8/2025', 4200000.00, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(6, 6, 'Tiền phòng tháng 8/2025', 3100000.00, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(7, 7, 'Tiền phòng tháng 8/2025', 3400000.00, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(11, 11, 'Tiền điện tháng 8/2025', 300000.00, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(12, 11, 'Tiền nước tháng 8/2025', 150000.00, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(13, 12, 'Tiền điện tháng 8/2025', 320000.00, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(14, 12, 'Tiền nước tháng 8/2025', 160000.00, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(15, 13, 'Tiền điện tháng 8/2025', 280000.00, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(16, 13, 'Tiền nước tháng 8/2025', 140000.00, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(17, 14, 'Tiền điện tháng 8/2025', 350000.00, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(18, 14, 'Tiền nước tháng 8/2025', 150000.00, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(19, 15, 'Tiền điện tháng 8/2025', 360000.00, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(20, 15, 'Tiền nước tháng 8/2025', 160000.00, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(21, 16, 'Tiền điện tháng 8/2025', 270000.00, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(22, 16, 'Tiền nước tháng 8/2025', 120000.00, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(23, 17, 'Tiền điện tháng 8/2025', 290000.00, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(24, 17, 'Tiền nước tháng 8/2025', 120000.00, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(103, 31, 'Tiền thuê phòng', 3000000.00, '2025-08-14 16:42:00', '2025-08-14 16:42:00'),
(104, 31, 'Điện: 123 → 321 kWh (4,000 VND/kWh)', 792000.00, '2025-08-14 16:42:00', '2025-08-14 16:42:00'),
(105, 31, 'Nước: 32 → 45 m³ (15,000 VND/m³)', 195000.00, '2025-08-14 16:42:00', '2025-08-14 16:42:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `related_url` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `message`, `is_read`, `related_url`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'Hóa đơn tiền phòng tháng 8/2025 đã được tạo.', 0, '/invoices/1', '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(2, 3, 'Hóa đơn điện/nước tháng 8/2025 đã được tạo.', 0, '/invoices/11', '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(3, 4, 'Lịch bảo trì hệ thống điện ngày 14/08.', 0, '/reports', '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(4, 5, 'Vui lòng giữ vệ sinh khu vực chung.', 0, NULL, '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(5, 6, 'Cập nhật: Sửa ống nước tầng 2 hoàn tất.', 0, '/reports/2', '2025-08-11 21:00:27', '2025-08-11 21:00:27');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `payment_date` datetime DEFAULT NULL,
  `amount_paid` decimal(12,2) NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `transaction_code` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `payments`
--

INSERT INTO `payments` (`id`, `invoice_id`, `payment_date`, `amount_paid`, `payment_method`, `transaction_code`, `createdAt`, `updatedAt`) VALUES
(2, 3, '2025-08-04 11:00:00', 3500000.00, 'cash', 'TX-0003', '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(3, 5, '2025-08-05 12:00:00', 4200000.00, 'bank_transfer', 'TX-0005', '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(4, 7, '2025-08-06 09:00:00', 3400000.00, 'cash', 'TX-0007', '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(5, 11, '2025-08-07 08:00:00', 450000.00, 'bank_transfer', 'TX-0011', '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(6, 13, '2025-08-07 08:30:00', 420000.00, 'cash', 'TX-0013', '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(7, 15, '2025-08-07 09:00:00', 520000.00, 'bank_transfer', 'TX-0015', '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(8, 17, '2025-08-07 09:30:00', 410000.00, 'cash', 'TX-0017', '2025-08-11 21:00:27', '2025-08-11 21:00:27');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `properties`
--

CREATE TABLE `properties` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `properties`
--

INSERT INTO `properties` (`id`, `name`, `address`, `createdAt`, `updatedAt`) VALUES
(1, 'Nhà trọ Phú Hữu', '70 Bưng Ông Thoàn, Phường Phú Hữu, TP.Thủ Đức, HCM', '2025-08-11 20:59:54', '2025-08-11 20:59:54'),
(2, 'Nhà trọ Liên Phường', '4 Đường D21, Phường Phước Long B, TP.Thủ Đức, HCM', '2025-08-11 20:59:54', '2025-08-11 20:59:54'),
(3, 'Nhà trọ Tăng Nhơn Phú', '15 Đường Tăng Nhơn Phú, Phường Tăng Nhơn Phú B, TP.Thủ Đức, HCM', '2025-08-11 20:59:54', '2025-08-11 20:59:54');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `tenant_id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `report_type` enum('maintenance','complaint','request') NOT NULL,
  `status` enum('new','in_progress','resolved','closed') DEFAULT 'new',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `reports`
--

INSERT INTO `reports` (`id`, `tenant_id`, `room_id`, `title`, `description`, `report_type`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 2, 1, 'Máy lạnh yếu', 'Máy lạnh chạy nhưng không mát, cần kiểm tra gas.', 'maintenance', 'in_progress', '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(2, 3, 2, 'Rò rỉ nước', 'Ống nước trong nhà vệ sinh rỉ nước.', 'maintenance', 'in_progress', '2025-08-11 21:00:27', '2025-08-11 14:16:10'),
(3, 4, 3, 'Đèn chập chờn', 'Đèn trần lúc sáng lúc tắt.', 'maintenance', 'resolved', '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(4, 5, 4, 'Xin thêm bàn học', 'Muốn lắp thêm một bàn học nhỏ.', 'request', 'new', '2025-08-11 21:00:27', '2025-08-11 21:00:27'),
(5, 6, 5, 'Tiếng ồn buổi tối', 'Hàng xóm nói chuyện lớn sau 22h.', 'complaint', 'in_progress', '2025-08-11 21:00:27', '2025-08-11 21:00:27');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `roles`
--

INSERT INTO `roles` (`id`, `role_name`, `createdAt`, `updatedAt`) VALUES
(1, 'admin', '2025-08-11 20:59:54', '2025-08-11 20:59:54'),
(2, 'tenant', '2025-08-11 20:59:54', '2025-08-11 20:59:54');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `property_id` int(11) NOT NULL,
  `room_number` varchar(20) NOT NULL,
  `area` decimal(5,2) NOT NULL,
  `rent_price` decimal(12,2) NOT NULL,
  `max_tenants` int(11) DEFAULT 1,
  `description` text DEFAULT NULL,
  `status` enum('available','occupied','reserved','maintenance') DEFAULT 'available',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `rooms`
--

INSERT INTO `rooms` (`id`, `property_id`, `room_number`, `area`, `rent_price`, `max_tenants`, `description`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 1, '101', 20.00, 3000000.00, 2, 'Phòng 20m2 Phòng trọ rộng rãi, thoáng mát, thiết kế hiện đại với cửa sổ lớn đón ánh sáng tự nhiên. Nằm ở vị trí thuận tiện, gần chợ, siêu thị, trường học và bến xe, giúp di chuyển dễ dàng.\r\nPhòng được trang bị ban công riêng, kệ bếp, máy nước nóng, cùng không gian nhà xe rộng rãi, có camera an ninh 24/7 và ra vào bằng khóa vân tay an toàn.\r\nMôi trường yên tĩnh, dân cư văn minh, thích hợp cho sinh viên và nhân viên văn phòng.', 'occupied', '2025-08-11 20:59:54', '2025-08-14 13:55:11'),
(2, 1, '102', 22.00, 3200000.00, 3, 'Phòng 22m2, đầy đủ nội thất cơ bản', 'occupied', '2025-08-11 20:59:54', '2025-08-11 14:03:10'),
(3, 1, '103', 25.00, 3500000.00, 3, 'Phòng rộng rãi, gần cầu thang', 'occupied', '2025-08-11 20:59:54', '2025-08-11 16:25:15'),
(4, 1, '104', 28.00, 3800000.00, 3, 'Phòng có ban công rộng', 'occupied', '2025-08-11 20:59:54', '2025-08-11 14:03:30'),
(5, 2, '201', 30.00, 4200000.00, 4, 'Phòng 30m2, nội thất mới', 'occupied', '2025-08-11 20:59:54', '2025-08-11 15:45:32'),
(6, 2, '202', 21.00, 3100000.00, 2, 'Phòng mới sơn sửa', 'occupied', '2025-08-11 20:59:54', '2025-08-11 17:08:33'),
(7, 2, '203', 26.00, 3400000.00, 3, 'Phòng gần chợ và siêu thị', 'occupied', '2025-08-11 20:59:54', '2025-08-11 15:50:57'),
(8, 2, '204', 29.00, 3600000.00, 3, 'Phòng view đẹp, nhiều ánh sáng', 'occupied', '2025-08-11 20:59:54', '2025-08-11 17:09:24'),
(9, 3, '301', 24.00, 3300000.00, 3, 'Phòng có ban công và cửa sổ lớn', 'available', '2025-08-11 20:59:54', '2025-08-11 17:08:07'),
(10, 3, '302', 27.00, 3500000.00, 3, 'Phòng có máy lạnh, giường tủ', 'available', '2025-08-11 20:59:54', '2025-08-11 17:08:05'),
(11, 3, '303', 28.00, 3700000.00, 3, 'Phòng nội thất đầy đủ, mới 100%', 'available', '2025-08-11 20:59:54', '2025-08-11 15:55:38'),
(12, 3, '304', 29.00, 3800000.00, 3, 'Phòng có cửa sổ thoáng', 'available', '2025-08-11 20:59:54', '2025-08-11 17:08:44');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `room_images`
--

CREATE TABLE `room_images` (
  `id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `caption` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `room_images`
--

INSERT INTO `room_images` (`id`, `room_id`, `image_url`, `is_primary`, `createdAt`, `updatedAt`, `caption`) VALUES
(13, 1, '/uploads/images-1754920931179-419886025.jpg', 0, '2025-08-11 14:02:11', '2025-08-14 13:55:11', NULL),
(14, 2, '/uploads/images-1754920990076-39837357.jpg', 1, '2025-08-11 14:03:10', '2025-08-11 14:03:10', NULL),
(16, 4, '/uploads/images-1754921010523-16496209.jpg', 1, '2025-08-11 14:03:30', '2025-08-11 14:03:30', NULL),
(17, 5, '/uploads/images-1754921020806-233056312.jpg', 1, '2025-08-11 14:03:40', '2025-08-11 14:03:40', NULL),
(18, 6, '/uploads/images-1754921029639-412294189.jpg', 0, '2025-08-11 14:03:49', '2025-08-11 17:08:33', NULL),
(20, 8, '/uploads/images-1754921047414-63897447.jpg', 1, '2025-08-11 14:04:07', '2025-08-11 14:04:07', NULL),
(21, 10, '/uploads/images-1754921060011-544831903.jpg', 1, '2025-08-11 14:04:20', '2025-08-11 14:04:20', NULL),
(23, 12, '/uploads/images-1754921075714-109514132.jpg', 0, '2025-08-11 14:04:35', '2025-08-11 17:08:44', NULL),
(24, 9, '/uploads/images-1754921149415-918020307.jpg', 1, '2025-08-11 14:05:49', '2025-08-11 14:05:49', NULL),
(25, 12, '/uploads/images-1754927423798-238424001.jpg', 0, '2025-08-11 15:50:23', '2025-08-11 17:08:44', NULL),
(26, 3, '/uploads/images-1754927445199-701330113.jpg', 0, '2025-08-11 15:50:45', '2025-08-11 16:25:15', NULL),
(27, 7, '/uploads/images-1754927457855-378561489.jpg', 1, '2025-08-11 15:50:57', '2025-08-11 15:50:57', NULL),
(28, 11, '/uploads/images-1754927738193-502347985.jpg', 1, '2025-08-11 15:55:38', '2025-08-11 15:55:38', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `must_change_password` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `role_id`, `full_name`, `email`, `password_hash`, `phone_number`, `avatar_url`, `is_active`, `createdAt`, `updatedAt`, `must_change_password`) VALUES
(1, 1, 'Quản trị viên', 'admin@example.com', '$2b$10$JNec2DQnQw8.xGy1rP70QO76xLAOPo6JOIAcOeJ./2cHqGflKrBdK', '0909000001', NULL, 1, '2025-08-11 20:59:54', '2025-08-11 20:59:54', 0),
(2, 2, 'Phạm Xuân Thắng', 'Thangphamxuan097@gmail.com', '$2b$10$JNec2DQnQw8.xGy1rP70QO76xLAOPo6JOIAcOeJ./2cHqGflKrBdK', '0909000002', NULL, 1, '2025-08-11 20:59:54', '2025-08-14 11:43:08', 0),
(3, 2, 'Trần Thị Bích', 'bich.tran@example.com', '$2a$10$DH/k6Vf6jnMLd3DWc0cMg.y3aPTZ1Gr.guE6Z9IiSp7FY/zpH45IK', '0909000003', NULL, 1, '2025-08-11 20:59:54', '2025-08-11 15:18:04', 0),
(4, 2, 'Lê Văn Cường', 'cuong.le@example.com', '$2b$10$JNec2DQnQw8.xGy1rP70QO76xLAOPo6JOIAcOeJ./2cHqGflKrBdK', '0909000004', NULL, 1, '2025-08-11 20:59:54', '2025-08-11 20:59:54', 1),
(5, 2, 'Phạm Thị Dung', 'dung.pham@example.com', '$2b$10$JNec2DQnQw8.xGy1rP70QO76xLAOPo6JOIAcOeJ./2cHqGflKrBdK', '0909000005', NULL, 1, '2025-08-11 20:59:54', '2025-08-11 20:59:54', 1),
(6, 2, 'Hoàng Minh Đức', 'duc.hoang@example.com', '$2b$10$JNec2DQnQw8.xGy1rP70QO76xLAOPo6JOIAcOeJ./2cHqGflKrBdK', '0909000006', NULL, 1, '2025-08-11 20:59:54', '2025-08-11 20:59:54', 1),
(7, 2, 'Đỗ Thị Hoa', 'hoa.do@example.com', '$2b$10$JNec2DQnQw8.xGy1rP70QO76xLAOPo6JOIAcOeJ./2cHqGflKrBdK', '0909000007', NULL, 1, '2025-08-11 20:59:54', '2025-08-11 20:59:54', 1),
(8, 2, 'Vũ Văn Hùng', 'hung.vu@example.com', '$2b$10$JNec2DQnQw8.xGy1rP70QO76xLAOPo6JOIAcOeJ./2cHqGflKrBdK', '0909000008', NULL, 1, '2025-08-11 20:59:54', '2025-08-11 20:59:54', 1),
(9, 2, 'Ngô Thị Lan', 'lan.ngo@example.com', '$2b$10$JNec2DQnQw8.xGy1rP70QO76xLAOPo6JOIAcOeJ./2cHqGflKrBdK', '0909000009', NULL, 1, '2025-08-11 20:59:54', '2025-08-11 20:59:54', 1),
(10, 2, 'Bùi Quốc Toàn', 'toan.bui@example.com', '$2b$10$JNec2DQnQw8.xGy1rP70QO76xLAOPo6JOIAcOeJ./2cHqGflKrBdK', '0909000010', NULL, 1, '2025-08-11 20:59:54', '2025-08-11 20:59:54', 1),
(11, 2, 'Nguyễn Lê Phương Trang', 'phuongtrang0907684509@gmail.com', '$2a$10$5irHMKVosnx4KmwlOFg/ROVAZyASWNnXLhPtxnl/tbfRPZTjpO0wm', '0794887919', NULL, 1, '2025-08-11 14:24:05', '2025-08-11 17:10:05', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `utility_meters`
--

CREATE TABLE `utility_meters` (
  `id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `meter_type` enum('electricity','water') NOT NULL,
  `unit` varchar(10) NOT NULL,
  `serial_number` varchar(100) DEFAULT NULL,
  `installed_date` date DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `utility_readings`
--

CREATE TABLE `utility_readings` (
  `id` bigint(20) NOT NULL,
  `meter_id` int(11) NOT NULL,
  `reading_value` decimal(12,2) NOT NULL,
  `reading_timestamp` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `assets`
--
ALTER TABLE `assets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `serial_number` (`serial_number`),
  ADD UNIQUE KEY `serial_number_2` (`serial_number`),
  ADD KEY `property_id` (`property_id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `asset_type_id` (`asset_type_id`);

--
-- Chỉ mục cho bảng `asset_types`
--
ALTER TABLE `asset_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `name_9` (`name`),
  ADD UNIQUE KEY `name_10` (`name`),
  ADD UNIQUE KEY `name_11` (`name`),
  ADD UNIQUE KEY `name_12` (`name`),
  ADD UNIQUE KEY `name_13` (`name`),
  ADD UNIQUE KEY `name_14` (`name`),
  ADD UNIQUE KEY `name_15` (`name`),
  ADD UNIQUE KEY `name_16` (`name`),
  ADD UNIQUE KEY `name_17` (`name`),
  ADD UNIQUE KEY `name_18` (`name`),
  ADD UNIQUE KEY `name_19` (`name`),
  ADD UNIQUE KEY `name_20` (`name`),
  ADD UNIQUE KEY `name_21` (`name`),
  ADD UNIQUE KEY `name_22` (`name`),
  ADD UNIQUE KEY `name_23` (`name`),
  ADD UNIQUE KEY `name_24` (`name`),
  ADD UNIQUE KEY `name_25` (`name`),
  ADD UNIQUE KEY `name_26` (`name`),
  ADD UNIQUE KEY `name_27` (`name`),
  ADD UNIQUE KEY `name_28` (`name`),
  ADD UNIQUE KEY `name_29` (`name`),
  ADD UNIQUE KEY `name_30` (`name`),
  ADD UNIQUE KEY `name_31` (`name`),
  ADD UNIQUE KEY `name_32` (`name`),
  ADD UNIQUE KEY `name_33` (`name`),
  ADD UNIQUE KEY `name_34` (`name`),
  ADD UNIQUE KEY `name_35` (`name`),
  ADD UNIQUE KEY `name_36` (`name`),
  ADD UNIQUE KEY `name_37` (`name`),
  ADD UNIQUE KEY `name_38` (`name`),
  ADD UNIQUE KEY `name_39` (`name`),
  ADD UNIQUE KEY `name_40` (`name`),
  ADD UNIQUE KEY `name_41` (`name`),
  ADD UNIQUE KEY `name_42` (`name`),
  ADD UNIQUE KEY `name_43` (`name`),
  ADD UNIQUE KEY `name_44` (`name`),
  ADD UNIQUE KEY `name_45` (`name`),
  ADD UNIQUE KEY `name_46` (`name`),
  ADD UNIQUE KEY `name_47` (`name`),
  ADD UNIQUE KEY `name_48` (`name`),
  ADD UNIQUE KEY `name_49` (`name`),
  ADD UNIQUE KEY `name_50` (`name`),
  ADD UNIQUE KEY `name_51` (`name`),
  ADD UNIQUE KEY `name_52` (`name`),
  ADD UNIQUE KEY `name_53` (`name`),
  ADD UNIQUE KEY `name_54` (`name`),
  ADD UNIQUE KEY `name_55` (`name`),
  ADD UNIQUE KEY `name_56` (`name`),
  ADD UNIQUE KEY `name_57` (`name`),
  ADD UNIQUE KEY `name_58` (`name`),
  ADD UNIQUE KEY `name_59` (`name`),
  ADD UNIQUE KEY `name_60` (`name`),
  ADD UNIQUE KEY `name_61` (`name`),
  ADD UNIQUE KEY `name_62` (`name`);

--
-- Chỉ mục cho bảng `contracts`
--
ALTER TABLE `contracts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `tenant_id` (`tenant_id`);

--
-- Chỉ mục cho bảng `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contract_id` (`contract_id`);

--
-- Chỉ mục cho bảng `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_id` (`invoice_id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_id` (`invoice_id`);

--
-- Chỉ mục cho bảng `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tenant_id` (`tenant_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Chỉ mục cho bảng `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_name` (`role_name`),
  ADD UNIQUE KEY `role_name_2` (`role_name`);

--
-- Chỉ mục cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `property_id` (`property_id`,`room_number`);

--
-- Chỉ mục cho bảng `room_images`
--
ALTER TABLE `room_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `phone_number` (`phone_number`),
  ADD KEY `role_id` (`role_id`);

--
-- Chỉ mục cho bảng `utility_meters`
--
ALTER TABLE `utility_meters`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `serial_number` (`serial_number`),
  ADD UNIQUE KEY `serial_number_2` (`serial_number`),
  ADD KEY `room_id` (`room_id`);

--
-- Chỉ mục cho bảng `utility_readings`
--
ALTER TABLE `utility_readings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `meter_id` (`meter_id`,`reading_timestamp`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `assets`
--
ALTER TABLE `assets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT cho bảng `asset_types`
--
ALTER TABLE `asset_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `contracts`
--
ALTER TABLE `contracts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT cho bảng `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `properties`
--
ALTER TABLE `properties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `room_images`
--
ALTER TABLE `room_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `utility_meters`
--
ALTER TABLE `utility_meters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `utility_readings`
--
ALTER TABLE `utility_readings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `assets`
--
ALTER TABLE `assets`
  ADD CONSTRAINT `assets_ibfk_364` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `assets_ibfk_365` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `assets_ibfk_366` FOREIGN KEY (`asset_type_id`) REFERENCES `asset_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `contracts`
--
ALTER TABLE `contracts`
  ADD CONSTRAINT `contracts_ibfk_239` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `contracts_ibfk_240` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD CONSTRAINT `invoice_items_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_229` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reports_ibfk_230` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `room_images`
--
ALTER TABLE `room_images`
  ADD CONSTRAINT `room_images_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `utility_meters`
--
ALTER TABLE `utility_meters`
  ADD CONSTRAINT `utility_meters_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `utility_readings`
--
ALTER TABLE `utility_readings`
  ADD CONSTRAINT `utility_readings_ibfk_1` FOREIGN KEY (`meter_id`) REFERENCES `utility_meters` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
