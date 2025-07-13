<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include("../../../config/config.php");

// Lấy và kiểm tra user ID
$id_khachhang = isset($_GET['id_khachhang']) ? intval($_GET['id_khachhang']) : 0;

if ($id_khachhang <= 0) {
    echo json_encode(["success" => false, "message" => "Thiếu hoặc sai id_khachhang"]);
    exit;
}

// Truy vấn đơn hàng theo khách hàng
$sql = "SELECT * FROM tbl_donhang WHERE id_khachhang = $id_khachhang ORDER BY id_donhang DESC";
$result = mysqli_query($conn, $sql);

$data = [];

while ($row = mysqli_fetch_assoc($result)) {
    $data[] = [
        "id_donhang" => $row["id_donhang"],
        "ngaydat" => $row["ngaydat"],
        "trangthai" => $row["trangthai"],
        "tongtien" => (int)$row["tongtien"],
        "hinhthucthanhtoan" => $row["hinhthucthanhtoan"],
        "diachi_nhan" => $row["diachi_nhan"],
        "ghichu" => $row["ghichu"]
    ];
}

echo json_encode(["success" => true, "orders" => $data]);
