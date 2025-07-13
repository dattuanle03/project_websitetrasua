<?php
// Cấu hình CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Trả về 200 nếu là preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Kết nối CSDL
require_once('../../../config/config.php');

// Lấy dữ liệu JSON từ client
$data = json_decode(file_get_contents("php://input"), true);
$order_id = $data['order_id'] ?? null;
$status = $data['status'] ?? null;

// Kiểm tra dữ liệu đầu vào
if (!$order_id || !$status) {
    echo json_encode(["success" => false, "message" => "Thiếu dữ liệu"]);
    exit;
}

// Cập nhật trạng thái đơn hàng bằng Prepared Statement
$sql = "UPDATE tbl_donhang SET trangthai = ? WHERE id_donhang = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $status, $order_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi SQL: " . $conn->error
    ]);
}

exit;
