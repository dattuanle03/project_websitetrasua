<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include('../../../config/config.php');

// Nhận mã đơn hàng từ query string
$mahoadon = $_GET['order_id'] ?? null;

if (!$mahoadon) {
    echo json_encode(["error" => "Thiếu order_id"]);
    exit;
}

// Truy vấn đơn hàng + chi tiết đơn hàng
$sql = "
SELECT 
    dh.id_donhang,
    dh.ngaydat,
    dh.hinhthucthanhtoan,
    dh.diachi_nhan,
    dh.ghichu,
    dh.tongtien_sanpham,
    dh.ship_fee,
    dh.total_payment,
    sp.tensanpham,
    sp.hinhanh,
    ctdh.soluong,
    ctdh.dongia
FROM 
    tbl_donhang dh
JOIN 
    tbl_chitietdonhang ctdh ON dh.id_donhang = ctdh.id_donhang
JOIN 
    tbl_sanpham sp ON sp.id_sanpham = ctdh.id_sanpham
WHERE 
    dh.id_donhang = '$mahoadon'
";

$query = mysqli_query($conn, $sql);

if (!$query) {
    echo json_encode(["error" => mysqli_error($conn)]);
    exit;
}

$order = null;

while ($row = mysqli_fetch_assoc($query)) {
    if (!$order) {
        // Gán thông tin đơn hàng 1 lần duy nhất
        $order = [
            "order_id" => $row['id_donhang'],
            "date" => $row['ngaydat'],
            "payment_method" => $row['hinhthucthanhtoan'],
            "address" => $row['diachi_nhan'],
            "note" => $row['ghichu'],
            "tongtien_sanpham" => (int)$row['tongtien_sanpham'],
            "ship_fee" => (int)$row['ship_fee'],
            "total_payment" => (int)$row['total_payment'],
            "products" => []
        ];
    }

    // Đẩy sản phẩm vào danh sách
    $order["products"][] = [
        "tensanpham" => $row['tensanpham'],
        "hinhanh" => $row['hinhanh'],
        "quantity" => (int)$row['soluong'],
        "price" => (int)$row['dongia'],
        "subtotal" => (int)$row['dongia'] * (int)$row['soluong']
    ];
}

// Trả kết quả
echo json_encode($order ?: ["error" => "Không tìm thấy đơn hàng"]);
