<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once("../../../config/config.php"); // Đảm bảo đường dẫn đúng

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'ID không hợp lệ']);
    exit;
}

$sql = "SELECT * FROM tbl_sanpham WHERE id_sanpham = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$product = $result->fetch_assoc();

if ($product) {
    echo json_encode(['success' => true, 'product' => $product]);
} else {
    echo json_encode(['success' => false, 'message' => 'Không tìm thấy sản phẩm']);
}
