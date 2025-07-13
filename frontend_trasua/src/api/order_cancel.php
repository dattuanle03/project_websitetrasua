<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // thêm dòng này
header("Access-Control-Allow-Headers: Content-Type");   // và dòng này
header("Content-Type: application/json; charset=UTF-8");

include('../../../config/config.php');

// Nếu là preflight request (OPTIONS), trả về 200 OK luôn
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Đọc dữ liệu từ body
$data = json_decode(file_get_contents("php://input"), true);
$order_id = intval($data['order_id'] ?? 0);

if (!$order_id) {
    echo json_encode(["success" => false, "message" => "Thiếu order_id"]);
    exit;
}

// Kiểm tra trạng thái đơn hàng
$result = mysqli_query($conn, "SELECT trangthai FROM tbl_donhang WHERE id_donhang = $order_id");
$order = mysqli_fetch_assoc($result);

if (!$order) {
    echo json_encode(["success" => false, "message" => "Đơn hàng không tồn tại"]);
    exit;
}

// Nếu trạng thái khác 0 (đã xác nhận), không cho huỷ
if ((int)$order['trangthai'] !== 0) {
    echo json_encode(["success" => false, "message" => "Không thể huỷ đơn hàng đã xác nhận"]);
    exit;
}

// Xoá chi tiết đơn
mysqli_query($conn, "DELETE FROM tbl_chitietdonhang WHERE id_donhang = $order_id");

// Xoá đơn
if (mysqli_query($conn, "DELETE FROM tbl_donhang WHERE id_donhang = $order_id")) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi khi huỷ đơn: " . mysqli_error($conn)]);
}
