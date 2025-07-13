<?php
include('../../../config/config.php');

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$limit = 100;
$start = ($page - 1) * $limit;

$sql = "SELECT sp.*, dm.tendanhmuc 
        FROM tbl_sanpham sp
        JOIN tbl_danhmuc dm ON sp.id_danhmuc = dm.id_danhmuc 
        ORDER BY sp.id_sanpham DESC 
        LIMIT ?, ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $start, $limit);
$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode(["success" => true, "products" => $data]);
