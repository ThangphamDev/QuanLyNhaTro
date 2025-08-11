CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL -- 'admin', 'tenant'
);

-- Bảng trung tâm cho tất cả người dùng
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) UNIQUE,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Bảng quản lý các khu trọ/tòa nhà
CREATE TABLE properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng quản lý các phòng trọ
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    area DECIMAL(5, 2) NOT NULL,
    rent_price DECIMAL(12, 2) NOT NULL,
    max_tenants INT DEFAULT 1,
    description TEXT,
    status ENUM('available', 'occupied', 'reserved', 'maintenance') NOT NULL DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(property_id, room_number),
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);
-- Bảng quản lý ảnh của phòng
CREATE TABLE room_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);
-- Bảng quản lý loại tài sản (Nội thất)
CREATE TABLE asset_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Bảng quản lý từng tài sản/nội thất cụ thể
CREATE TABLE assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    room_id INT,
    asset_type_id INT,
    name VARCHAR(255) NOT NULL,
    serial_number VARCHAR(100) UNIQUE,
    purchase_date DATE,
    warranty_end_date DATE,
    value DECIMAL(12, 2),
    status ENUM('in_use', 'in_storage', 'under_repair', 'disposed') NOT NULL DEFAULT 'in_use',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL,
    FOREIGN KEY (asset_type_id) REFERENCES asset_types(id)
);
CREATE TABLE contracts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    tenant_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    rent_price DECIMAL(12, 2) NOT NULL,
    deposit_amount DECIMAL(12, 2) DEFAULT 0.00,
    status ENUM('active', 'expired', 'terminated') NOT NULL DEFAULT 'active',
    contract_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (tenant_id) REFERENCES users(id)
);

-- Bảng quản lý các công tơ điện/nước
CREATE TABLE utility_meters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    meter_type ENUM('electricity', 'water') NOT NULL,
    unit VARCHAR(10) NOT NULL,
    serial_number VARCHAR(100) UNIQUE,
    installed_date DATE,
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- Bảng lưu trữ chỉ số điện/nước
CREATE TABLE utility_readings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    meter_id INT NOT NULL,
    reading_value DECIMAL(12, 2) NOT NULL,
    reading_timestamp TIMESTAMP NOT NULL,
    FOREIGN KEY (meter_id) REFERENCES utility_meters(id),
    INDEX(meter_id, reading_timestamp)
);

-- Bảng quản lý hóa đơn
CREATE TABLE invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contract_id INT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    status ENUM('pending', 'paid', 'overdue', 'cancelled') NOT NULL DEFAULT 'pending',
    billing_month INT NOT NULL,
    billing_year INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES contracts(id)
);

-- Bảng chi tiết hóa đơn
CREATE TABLE invoice_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

-- Bảng ghi nhận thanh toán
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount_paid DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50),
    transaction_code VARCHAR(100),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);

-- Bảng báo cáo sự cố/yêu cầu
CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    room_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    report_type ENUM('maintenance', 'complaint', 'request') NOT NULL,
    status ENUM('new', 'in_progress', 'resolved', 'closed') NOT NULL DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES users(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- Bảng quản lý các thông báo
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
