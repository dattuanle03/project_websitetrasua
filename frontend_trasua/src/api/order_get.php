<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include('../../../config/config.php');

$user_id = $_GET['user_id'] ?? null;
if (!$user_id) {
    echo json_encode(["error" => "Thiếu user_id"]);
    exit;
}

$sql = "
SELECT 
    d.id_donhang,
    d.ngaydat,
    d.trangthai,
    d.tongtien_sanpham,
    d.ship_fee,
    d.total_payment,
    d.hinhthucthanhtoan,
    d.tennguoinhan,
    d.sodienthoai,
    d.diachi_nhan,
    d.ghichu,
    s.tensanpham,
    c.soluong,
    c.dongia
FROM 
    tbl_donhang d
JOIN 
    tbl_chitietdonhang c ON d.id_donhang = c.id_donhang
JOIN 
    tbl_sanpham s ON c.id_sanpham = s.id_sanpham
WHERE 
    d.id_khachhang = $user_id
ORDER BY 
    d.ngaydat DESC
";

$query = mysqli_query($conn, $sql);
if (!$query) {
    echo json_encode(["error" => mysqli_error($conn)]);
    exit;
}

$orders = [];

while ($row = mysqli_fetch_assoc($query)) {
    $id = $row['id_donhang'];

    if (!isset($orders[$id])) {
        $orders[$id] = [
            "order_id" => $id,
            "date" => $row['ngaydat'],
            "status" => $row['trangthai'],
            "total" => (int)$row['tongtien_sanpham'],
            "ship_fee" => (int)$row['ship_fee'],
            "total_payment" => (int)$row['total_payment'],
            "payment_method" => $row['hinhthucthanhtoan'],
            "receiver_name" => $row['tennguoinhan'],
            "phone" => $row['sodienthoai'],
            "address" => $row['diachi_nhan'],
            "note" => $row['ghichu'],
            "products" => [],
        ];
    }

    $orders[$id]["products"][] = [
        "tensanpham" => $row["tensanpham"],
        "quantity" => (int)$row["soluong"],
        "giasp" => (int)$row["dongia"]
    ];
}

echo json_encode(array_values($orders));
