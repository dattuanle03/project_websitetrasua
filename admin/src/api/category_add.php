<?php
require_once __DIR__ . '/../../../config/config.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");


// Nhận dữ liệu JSON từ body
$data = json_decode(file_get_contents("php://input"), true);

// Kiểm tra biến nhận
$tendanhmuc = trim($data['tendanhmuc'] ?? '');
$slug = trim($data['slug'] ?? '');

if ($tendanhmuc === '') {
    echo json_encode([
        'success' => false,
        'message' => 'Tên danh mục không được để trống'
    ]);
    exit;
}

// Kiểm tra kết nối
if (!$conn) {
    echo json_encode([
        'success' => false,
        'message' => 'Không thể kết nối cơ sở dữ liệu'
    ]);
    exit;
}

// Thực hiện thêm
$sql = "INSERT INTO tbl_danhmuc (tendanhmuc,slug) VALUES (?,?)";
$stmt = $conn->prepare($sql);

if ($stmt) {
$stmt->bind_param("ss", $tendanhmuc, $slug);
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Thêm danh mục thành công',
            'insert_id' => $stmt->insert_id // Gửi luôn ID nếu muốn dùng phía React
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Thêm thất bại: ' . $stmt->error
        ]);
    }
    $stmt->close();
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi prepare SQL: ' . $conn->error
    ]);
}
