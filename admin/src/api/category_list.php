<?php
// Nạp cấu hình kết nối CSDL
require_once __DIR__ . '/../../../config/config.php';

// Thiết lập header để hỗ trợ CORS và định dạng JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Câu truy vấn
$sql = "SELECT * FROM tbl_danhmuc ORDER BY id_danhmuc DESC";
$result = mysqli_query($conn, $sql);

// Kiểm tra lỗi truy vấn
if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi truy vấn: " . mysqli_error($conn)
    ]);
    exit;
}

// Xử lý dữ liệu
$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

// Trả về kết quả JSON
echo json_encode([
    "success" => true,
    "categories" => $data
]);
