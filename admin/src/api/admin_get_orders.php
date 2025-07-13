<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include('../../../config/config.php');

$sql = "
SELECT 
    id_donhang AS order_id,
    id_khachhang,
    tennguoinhan,
    sodienthoai,
    tongtien_sanpham,
    trangthai AS status,
    hinhthucthanhtoan,
    diachi_nhan,
    ghichu,
    ngaydat AS date,
    ship_fee,
    total_payment
FROM 
    tbl_donhang
ORDER BY 
    ngaydat DESC
";

$query = mysqli_query($conn, $sql);

if (!$query) {
    echo json_encode(["success" => false, "message" => mysqli_error($conn)]);
    exit;
}

$orders = [];
while ($row = mysqli_fetch_assoc($query)) {
    // Ép kiểu cho những cột số nếu cần
    $row['tongtien_sanpham'] = (int)$row['tongtien_sanpham'];
    $row['ship_fee'] = (int)$row['ship_fee'];
    $row['total_payment'] = (int)$row['total_payment'];
    $orders[] = $row;
}

echo json_encode($orders);
