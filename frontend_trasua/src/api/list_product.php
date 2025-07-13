<?php
// Bật hiển thị lỗi
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Trả về JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
$conn = new mysqli("localhost", "root", "", "website_trasua");
$conn->set_charset("utf8"); // ⚠️ Dòng này BẮT BUỘC phải có

// Kết nối CSDL
if ($conn->connect_error) {
    echo json_encode(["error" => "❌ Lỗi kết nối CSDL: " . $conn->connect_error]);
    exit;
}

// Truy vấn dữ liệu
$sql = "SELECT * FROM tbl_sanpham WHERE tinhtrang = 1";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["error" => "❌ Lỗi truy vấn SQL: " . $conn->error]);
    exit;
}

// Đếm kết quả
if ($result->num_rows === 0) {
    echo json_encode(["message" => "⚠️ Không có sản phẩm nào trong bảng"]);
    exit;
}

// Chuyển dữ liệu thành mảng
$products = [];
while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

$json = json_encode($products, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

if ($json === false) {
    echo json_encode(["error" => "❌ json_encode lỗi", "chi_tiet" => json_last_error_msg()]);
    exit;
}

echo $json;
exit;


