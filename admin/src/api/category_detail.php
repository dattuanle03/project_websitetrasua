<?php
// Nạp file cấu hình CSDL
require_once __DIR__ . '/../../../config/config.php';

// Cho phép CORS nếu dùng frontend React
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

// Lấy ID từ query string và ép kiểu an toàn
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Thiếu hoặc sai ID']);
    exit;
}

// Chuẩn bị truy vấn lấy danh mục
$sql = "SELECT id_danhmuc, tendanhmuc FROM tbl_danhmuc WHERE id_danhmuc = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi prepare: ' . $conn->error
    ]);
    exit;
}

$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode([
        'success' => true,
        'data' => $row
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Không tìm thấy danh mục'
    ]);
}

$stmt->close();
$conn->close();
