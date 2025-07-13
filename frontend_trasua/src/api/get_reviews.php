<?php
// Cấu hình CORS và JSON headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Trả về 200 nếu là preflight request từ trình duyệt
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Kết nối database
include '../../../config/config.php'; // sử dụng $mysqli

// Lấy id sản phẩm từ query string
$id_sanpham = isset($_GET['id_sanpham']) ? intval($_GET['id_sanpham']) : 0;

if ($id_sanpham <= 0) {
    echo json_encode(["success" => false, "message" => "Thiếu hoặc sai ID sản phẩm"]);
    exit;
}
$sql = "SELECT dg.*, dk.tenkhachhang, dk.avatar 
        FROM tbl_danhgia dg 
        JOIN tbl_dangky dk ON dg.id_khachhang = dk.id_dangky
        WHERE id_sanpham = '$id_sanpham' 
        ORDER BY dg.created_at DESC";

$result = mysqli_query($conn, $sql);

$reviews = [];
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $reviews[] = $row;
    }
    echo json_encode($reviews);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi truy vấn: " . mysqli_error($conn)]);
}
