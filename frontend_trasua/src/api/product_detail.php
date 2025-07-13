<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json; charset=UTF-8');
include("../../../config/config.php");

if (isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $sql = "SELECT * FROM tbl_sanpham WHERE id_sanpham = $id LIMIT 1";
    $query = mysqli_query($conn, $sql);
    if ($row = mysqli_fetch_assoc($query)) {
        echo json_encode($row);
    } else {
        echo json_encode(["error" => "Không tìm thấy sản phẩm"]);
    }
} else {
    echo json_encode(["error" => "Thiếu ID"]);
}
?>
