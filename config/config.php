

<?php
// config.php

// Cấu hình kết nối
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'website_trasua');

// Kết nối MySQLi
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Kiểm tra kết nối
if ($conn->connect_error) {
    // Trả về JSON nếu là API
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Kết nối cơ sở dữ liệu thất bại: ' . $conn->connect_error
    ]);
    exit;
}

// Thiết lập bảng mã
$conn->set_charset('utf8mb4');
?>
