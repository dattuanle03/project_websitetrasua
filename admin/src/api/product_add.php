<?php
// Cấu hình CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

// Kết nối CSDL
include(__DIR__ . "/../../../config/config.php");

// Kiểm tra phương thức POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Yêu cầu không hợp lệ"]);
    exit;
}

// Nhận dữ liệu
$tensanpham = $_POST['tensanpham'] ?? '';
$giasp = (int)($_POST['giasp'] ?? 0);
$tomtat = $_POST['tomtat'] ?? '';
$tinhtrang = (int)($_POST['tinhtrang'] ?? 1);
$id_danhmuc = (int)($_POST['id_danhmuc'] ?? 0);
$hinhanh = $_FILES['hinhanh'] ?? null;

// Kiểm tra dữ liệu bắt buộc
if (!$tensanpham || !$giasp || !$id_danhmuc || !$hinhanh) {
    echo json_encode(["success" => false, "message" => "Thiếu dữ liệu"]);
    exit;
}

// Xử lý upload ảnh
$hinhanh_name = time() . "_" . basename($hinhanh['name']);
$upload_path = __DIR__ . "/../../../uploads/products/" . $hinhanh_name;

if (!move_uploaded_file($hinhanh['tmp_name'], $upload_path)) {
    echo json_encode(["success" => false, "message" => "Lỗi upload hình ảnh"]);
    exit;
}

// Thêm vào database
$sql = "INSERT INTO tbl_sanpham (tensanpham, giasp, hinhanh, tomtat, tinhtrang, id_danhmuc) 
        VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sissii", $tensanpham, $giasp, $hinhanh_name, $tomtat, $tinhtrang, $id_danhmuc);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Thêm sản phẩm thành công"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi DB: " . $conn->error]);
}
