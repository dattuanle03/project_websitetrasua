<?php
require_once __DIR__ . '/../../../config/config.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Thiếu hoặc sai ID']);
    exit;
}

// 1. Kiểm tra có sản phẩm nào thuộc danh mục
$checkQuery = "SELECT COUNT(*) AS total FROM tbl_sanpham WHERE id_danhmuc = ?";
$checkStmt = $conn->prepare($checkQuery);

if (!$checkStmt) {
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi prepare (check): ' . $conn->error
    ]);
    exit;
}

$checkStmt->bind_param("i", $id);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();
$checkRow = $checkResult->fetch_assoc();
$checkStmt->close();

if ($checkRow['total'] > 0) {
    echo json_encode([
        'success' => false,
        'message' => '❌ Không thể xoá: danh mục đang chứa sản phẩm.'
    ]);
    exit;
}

// 2. Xoá danh mục
$sql = "DELETE FROM tbl_danhmuc WHERE id_danhmuc = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi prepare (delete): ' . $conn->error
    ]);
    exit;
}

$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => '✅ Đã xoá danh mục.']);
} else {
    echo json_encode([
        'success' => false,
        'message' => '❌ Xoá thất bại: ' . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
