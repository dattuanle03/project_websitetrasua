<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");

// Include file config đúng đường dẫn
include(__DIR__ . "/../../../config/config.php");

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id > 0) {
    // Lấy tên ảnh
    $query_image = mysqli_query($conn, "SELECT hinhanh FROM tbl_sanpham WHERE id_sanpham = $id");
    if (!$query_image) {
        echo json_encode(["success" => false, "message" => "Lỗi truy vấn lấy ảnh: " . mysqli_error($conn)]);
        exit;
    }

    $row = mysqli_fetch_assoc($query_image);
    if ($row && !empty($row['hinhanh'])) {
        $file_path = __DIR__ . "/../../../uploads/products/" . $row['hinhanh'];
        if (file_exists($file_path)) {
            @unlink($file_path); // xoá file ảnh nếu tồn tại
        }
    }

    // Xoá sản phẩm
    $sql = "DELETE FROM tbl_sanpham WHERE id_sanpham = $id";
    $result = mysqli_query($conn, $sql);

    if ($result && mysqli_affected_rows($conn) > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Không tìm thấy sản phẩm hoặc xoá thất bại"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "ID không hợp lệ"]);
}
