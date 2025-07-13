<?php
// Cấu hình chung
$vnp_HashSecret = "GV7Q4GMG0TF026BTM395QTW9BZWJUWCG";

// Lấy tất cả tham số VNPay trả về
$vnpData = $_GET;
$vnp_SecureHash = $vnpData['vnp_SecureHash'];
unset($vnpData['vnp_SecureHash']);
unset($vnpData['vnp_SecureHashType']);

// Sắp xếp lại dữ liệu để tạo hash
ksort($vnpData);
$hashData = [];
foreach ($vnpData as $key => $value) {
    $hashData[] = $key . "=" . urlencode($value);
}
$hashString = implode("&", $hashData);
$secureHashCheck = hash_hmac('sha512', $hashString, $vnp_HashSecret);

// So sánh chữ ký
if ($secureHashCheck === $vnp_SecureHash) {
    if ($vnpData['vnp_ResponseCode'] == '00') {
        // ✅ GIAO DỊCH THÀNH CÔNG => TẠO ĐƠN HÀNG VÀO DB

        // Ví dụ thêm: bạn có thể gọi đến API tạo đơn hàng
        // hoặc chèn vào CSDL ở đây

        // Ví dụ: Gọi API nội bộ
        // file_get_contents("http://localhost/backend/tao_donhang.php?order_id=...");

        echo "<h3>Thanh toán thành công! Đơn hàng của bạn đã được ghi nhận.</h3>";
    } else {
        echo "<h3>Thanh toán thất bại hoặc bị huỷ!</h3>";
    }
} else {
    echo "<h3>Chữ ký không hợp lệ. Có thể bị giả mạo!</h3>";
}
?>
