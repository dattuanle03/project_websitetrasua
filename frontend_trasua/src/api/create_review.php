<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include '../../../config/config.php';

$id_sanpham   = $_POST['id_sanpham'] ?? null;
$id_khachhang = $_POST['id_khachhang'] ?? null;
$rating       = $_POST['rating'] ?? null;
$comment      = mysqli_real_escape_string($conn, $_POST['comment'] ?? '');
$created_at   = date('Y-m-d H:i:s');
$hinhanh      = '';

if (!$id_sanpham || !$id_khachhang || !$rating) {
    echo json_encode(["success" => false, "message" => "Thiếu dữ liệu"]);
    exit;
}

// Xử lý ảnh
if (isset($_FILES['hinhanh']) && $_FILES['hinhanh']['error'] === 0) {
    $ext = strtolower(pathinfo($_FILES['hinhanh']['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'gif'];
    $size = $_FILES['hinhanh']['size'];

    if (!in_array($ext, $allowed)) {
        echo json_encode(["success" => false, "message" => "Chỉ cho phép ảnh JPG, PNG, GIF"]);
        exit;
    }

    if ($size > 2 * 1024 * 1024) {
        echo json_encode(["success" => false, "message" => "Ảnh vượt quá 2MB"]);
        exit;
    }

    if (!is_dir('../../../uploads/reviews')) {
        mkdir('../../../uploads/reviews', 0777, true);
    }

    $filename = time() . '_' . rand(1000, 9999) . '.' . $ext;
    $uploadPath = '../../../uploads/reviews/' . $filename;

    if (move_uploaded_file($_FILES['hinhanh']['tmp_name'], $uploadPath)) {
        $hinhanh = $filename;
    }
}

$sql = "INSERT INTO tbl_danhgia (id_sanpham, id_khachhang, rating, comment, hinhanh, created_at)
        VALUES ('$id_sanpham', '$id_khachhang', '$rating', '$comment', '$hinhanh', '$created_at')";

if (mysqli_query($conn, $sql)) {
    echo json_encode(["success" => true, "filename" => $hinhanh]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi SQL: " . mysqli_error($conn)
    ]);
}
