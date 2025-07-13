<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include('../../../config/config.php');

$data = json_decode(file_get_contents("php://input"), true);
$order_id = $data['order_id'] ?? null;

if (!$order_id) {
    echo json_encode(["success" => false, "message" => "Thiếu mã đơn hàng"]);
    exit;
}

$sql = "UPDATE tbl_donhang SET trangthai = 'da_xac_nhan' WHERE id_donhang = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $order_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi SQL: " . $conn->error]);
}
