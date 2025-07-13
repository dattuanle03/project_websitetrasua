<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../../config/config.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = isset($data['id']) ? (int)$data['id'] : 0;
$tendanhmuc = trim($data['tendanhmuc'] ?? '');
$slug = trim($data['slug'] ?? '');

if ($id <= 0 || empty($tendanhmuc) || empty($slug)) {
    echo json_encode(['success' => false, 'message' => 'Thiếu hoặc sai dữ liệu']);
    exit;
}

$sql = "UPDATE tbl_danhmuc SET tendanhmuc = ?, slug = ? WHERE id_danhmuc = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Lỗi prepare: ' . $conn->error]);
    exit;
}

$stmt->bind_param("ssi", $tendanhmuc, $slug, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Cập nhật thành công']);
} else {
    echo json_encode(['success' => false, 'message' => 'Cập nhật thất bại: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
