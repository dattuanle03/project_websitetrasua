<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include("../../../config/config.php");

// Đọc dữ liệu JSON từ body
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_review']) || !isset($data['id_khachhang'])) {
    echo json_encode(["success" => false, "message" => "Thiếu dữ liệu"]);
    exit;
}

$id_review = intval($data['id_review']);
$id_khachhang = intval($data['id_khachhang']);

// Kiểm tra quyền xóa
$check = mysqli_query($conn, "SELECT * FROM tbl_danhgia WHERE id = $id_review AND id_khachhang = $id_khachhang");
if (mysqli_num_rows($check) === 0) {
    echo json_encode(["success" => false, "message" => "Không được phép xóa"]);
    exit;
}

// Xóa ảnh nếu có
$row = mysqli_fetch_assoc($check);
if (!empty($row['hinhanh'])) {
    $imagePath = '../uploads/reviews/' . $row['hinhanh'];
    if (file_exists($imagePath)) {
        unlink($imagePath);
    }
}

// Xóa bình luận
$result = mysqli_query($conn, "DELETE FROM tbl_danhgia WHERE id = $id_review");

if ($result) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => mysqli_error($conn)]);
}
