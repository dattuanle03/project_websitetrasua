<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include('../../../config/config.php');

$id_sanpham = $_GET['id_sanpham'] ?? '';

if (!$id_sanpham) {
    echo json_encode(["success" => false, "message" => "Thiếu ID sản phẩm"]);
    exit;
}

$sql = "SELECT AVG(rating) AS avg_rating FROM tbl_danhgia WHERE id_sanpham = $id_sanpham";
$result = mysqli_query($conn, $sql);
$data = mysqli_fetch_assoc($result);

echo json_encode([
    "success" => true,
    "avg_rating" => round((float)$data['avg_rating'], 1)
]);
