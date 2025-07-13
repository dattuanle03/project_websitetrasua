<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include('../../../config/config.php');

$data = json_decode(file_get_contents("php://input"), true);

// Kiểm tra dữ liệu đầu vào
if (
    !$data ||
    !isset($data['user_id']) ||
    !isset($data['payment_method']) ||
    !isset($data['items']) ||
    !isset($data['receiver']['address'])
) {
    echo json_encode(["success" => false, "message" => "Thiếu dữ liệu"]);
    exit;
}

// Lấy dữ liệu
$user_id = (int)$data['user_id'];
$method = mysqli_real_escape_string($conn, $data['payment_method']);
$items = $data['items'];
$address = mysqli_real_escape_string($conn, $data['receiver']['address']);
$note = mysqli_real_escape_string($conn, $data['receiver']['note'] ?? '');
$tennguoinhan = mysqli_real_escape_string($conn, $data['receiver']['name'] ?? '');
$sodienthoai = mysqli_real_escape_string($conn, $data['receiver']['phone'] ?? '');

$ship_fee = isset($data['ship_fee']) ? (int)$data['ship_fee'] : 0;
$total_payment = isset($data['total_payment']) ? (int)$data['total_payment'] : 0;
$ngaydat = date("Y-m-d H:i:s");

// Tính tổng tiền sản phẩm
$tongtien_sanpham = 0;
$processedItems = [];

foreach ($items as $item) {
    if (
        !isset($item['id_sanpham']) ||
        !isset($item['quantity']) ||
        !isset($item['giasp'])
    ) {
        echo json_encode(["success" => false, "message" => "Dữ liệu sản phẩm không hợp lệ"]);
        exit;
    }

    $id_sanpham = (int)$item['id_sanpham'];
    $soluong = (int)$item['quantity'];
    $dongia = (int)$item['giasp'];

    $res = mysqli_query($conn, "SELECT tensanpham, hinhanh FROM tbl_sanpham WHERE id_sanpham = $id_sanpham");
    if (!$res || mysqli_num_rows($res) == 0) {
        echo json_encode(["success" => false, "message" => "Sản phẩm không tồn tại"]);
        exit;
    }

    $row = mysqli_fetch_assoc($res);
    $tensanpham = mysqli_real_escape_string($conn, $row['tensanpham']);
    $hinhanh = mysqli_real_escape_string($conn, $row['hinhanh']);

    $tongtien_sanpham += $dongia * $soluong;

    $processedItems[] = [
        'id_sanpham' => $id_sanpham,
        'tensanpham' => $tensanpham,
        'hinhanh' => $hinhanh,
        'soluong' => $soluong,
        'dongia' => $dongia,
        'size' => mysqli_real_escape_string($conn, $item['size'] ?? ''),
        'ice' => mysqli_real_escape_string($conn, $item['ice'] ?? ''),
        'sugar' => mysqli_real_escape_string($conn, $item['sugar'] ?? '')
    ];
}

// Tạo đơn hàng
$sql_order = "INSERT INTO tbl_donhang (
    id_khachhang, tennguoinhan, sodienthoai, tongtien_sanpham, ship_fee, total_payment,
    trangthai, hinhthucthanhtoan, diachi_nhan, ghichu, ngaydat
) VALUES (
    $user_id, '$tennguoinhan', '$sodienthoai', $tongtien_sanpham, $ship_fee, $total_payment,
    'cho_xac_nhan', '$method', '$address', '$note', '$ngaydat'
)";

if (!mysqli_query($conn, $sql_order)) {
    echo json_encode(["success" => false, "message" => "Lỗi khi tạo đơn hàng: " . mysqli_error($conn)]);
    exit;
}

$id_donhang = mysqli_insert_id($conn);

// Thêm chi tiết đơn hàng
foreach ($processedItems as $item) {
    $sql_ct = "INSERT INTO tbl_chitietdonhang (
        id_donhang, id_sanpham, size, ice, sugar,
        tensanpham, hinhanh, soluong, dongia, created_at
    ) VALUES (
        $id_donhang,
        {$item['id_sanpham']},
        '{$item['size']}',
        '{$item['ice']}',
        '{$item['sugar']}',
        '{$item['tensanpham']}',
        '{$item['hinhanh']}',
        {$item['soluong']},
        {$item['dongia']},
        NOW()
    )";

    if (!mysqli_query($conn, $sql_ct)) {
        echo json_encode(["success" => false, "message" => "Lỗi thêm chi tiết đơn hàng: " . mysqli_error($conn)]);
        exit;
    }
}

echo json_encode([
    "success" => true,
    "message" => "Đơn hàng đã được tạo thành công",
    "order_id" => $id_donhang,
    "tongtien_sanpham" => $tongtien_sanpham,
    "ship_fee" => $ship_fee,
    "total_payment" => $total_payment
]);
