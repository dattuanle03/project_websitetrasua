<?php
// Bật CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Kết nối CSDL
require_once("../../../config/config.php");

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(["success" => false, "message" => "Phương thức không hợp lệ"]);
    exit;
}

$slug = isset($_GET['slug']) ? $_GET['slug'] : '';

if (empty($slug)) {
    echo json_encode(["success" => false, "message" => "Thiếu slug"]);
    exit;
}

// Lấy id danh mục từ slug
$sql_danhmuc = "SELECT id_danhmuc FROM tbl_danhmuc WHERE slug = ?";
$stmt_danhmuc = $conn->prepare($sql_danhmuc);
if (!$stmt_danhmuc) {
    echo json_encode(["success" => false, "message" => "Lỗi prepare danh mục: " . $conn->error]);
    exit;
}
$stmt_danhmuc->bind_param("s", $slug);
$stmt_danhmuc->execute();
$result_danhmuc = $stmt_danhmuc->get_result();

if ($result_danhmuc->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Không tìm thấy danh mục"]);
    exit;
}

$row_danhmuc = $result_danhmuc->fetch_assoc();
$id_danhmuc = $row_danhmuc['id_danhmuc'];

// Lấy sản phẩm theo danh mục
$sql_sanpham = "SELECT * FROM tbl_sanpham WHERE id_danhmuc = ?";
$stmt_sanpham = $conn->prepare($sql_sanpham);
if (!$stmt_sanpham) {
    echo json_encode(["success" => false, "message" => "Lỗi prepare sản phẩm: " . $conn->error]);
    exit;
}
$stmt_sanpham->bind_param("i", $id_danhmuc);
$stmt_sanpham->execute();
$result_sanpham = $stmt_sanpham->get_result();

$products = [];
while ($row = $result_sanpham->fetch_assoc()) {
    $products[] = $row;
}

echo json_encode($products);
