<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include('../../../config/config.php');

$order_id = $_GET['order_id'] ?? null;

if (!$order_id) {
    echo json_encode(["success" => false, "message" => "Thiếu order_id"]);
    exit;
}

$sql = "
SELECT 
    c.tensanpham,
    c.hinhanh,
    c.dongia AS gia,
    c.soluong,
    (c.soluong * c.dongia) AS thanhtien,
    c.size,              -- ✅ thêm dòng này
    c.ice,               -- ✅ thêm dòng này
    c.sugar,             -- ✅ thêm dòng này
    d.tennguoinhan,
    d.sodienthoai,
    d.diachi_nhan,
    d.ghichu,
    d.ship_fee,
    d.total_payment
FROM tbl_chitietdonhang c
JOIN tbl_donhang d ON d.id_donhang = c.id_donhang
WHERE d.id_donhang = '$order_id'

";

$result = mysqli_query($conn, $sql);

if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi SQL: " . mysqli_error($conn)
    ]);
    exit;
}

$items = [];
$firstRow = true;
$ship_fee = 0;
$total_payment = 0;
$receiver_info = [];

while ($row = mysqli_fetch_assoc($result)) {
    if ($firstRow) {
        $ship_fee = (int)$row['ship_fee'];
        $total_payment = (int)$row['total_payment'];

        $receiver_info = [
            "tennguoinhan" => $row["tennguoinhan"],
            "sodienthoai" => $row["sodienthoai"],
            "diachi_nhan" => $row["diachi_nhan"],
            "ghichu" => $row["ghichu"],
        ];

        $firstRow = false;
    }

    $items[] = [
        "tensanpham" => $row["tensanpham"],
        "hinhanh" => $row["hinhanh"],
        "gia" => (int)$row["gia"],
        "soluong" => (int)$row["soluong"],
        "thanhtien" => (int)$row["thanhtien"],
        "size" => $row["size"],     // ✅
    "ice" => $row["ice"],       // ✅
    "sugar" => $row["sugar"],
    ];
}

echo json_encode([
    "success" => true,
    "items" => $items,
    "ship_fee" => $ship_fee,
    "total_payment" => $total_payment,
    "receiver" => $receiver_info
]);
