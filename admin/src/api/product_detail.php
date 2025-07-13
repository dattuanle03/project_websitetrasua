<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

require_once("../../../config/config.php");

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if (!$id) {
  echo json_encode([
    "success" => false,
    "message" => "ID không hợp lệ"
  ]);
  exit;
}

$sql = "SELECT * FROM tbl_sanpham WHERE id_sanpham = ?";
$stmt = $conn->prepare($sql); // 🔄 Dùng $conn thay vì $mysqli
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$product = $result->fetch_assoc();

if ($product) {
  echo json_encode([
    "success" => true,
    "product" => $product
  ]);
} else {
  echo json_encode([
    "success" => false,
    "message" => "Không tìm thấy sản phẩm"
  ]);
}
?>
