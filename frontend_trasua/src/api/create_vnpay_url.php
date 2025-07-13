<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Cấu hình
$vnp_TmnCode = "OL1SYOFY";
$vnp_HashSecret = "GV7Q4GMG0TF026BTM395QTW9BZWJUWCG";
$vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
$vnp_ReturnUrl = "http://localhost:3000/vnpay_return";

// Dữ liệu từ React
$data = json_decode(file_get_contents("php://input"), true);
$amount = floatval($data['amount'] ?? 0);
$orderId = strval($data['order_id'] ?? time());

// Log dữ liệu đầu vào
error_log("Input data: " . json_encode($data));
error_log("Amount: " . $amount);
error_log("OrderId: " . $orderId);

if ($amount <= 0) {
    echo json_encode(["error" => "Số tiền không hợp lệ"]);
    exit;
}

$vnp_Params = [
    "vnp_Version" => "2.1.0",
    "vnp_Command" => "pay",
    "vnp_TmnCode" => $vnp_TmnCode,
    "vnp_Amount" => $amount * 100,
    "vnp_CurrCode" => "VND",
    "vnp_TxnRef" => $orderId,
    "vnp_OrderInfo" => "Thanh toan don hang #" . $orderId,
    "vnp_OrderType" => "billpayment",
    "vnp_Locale" => "vn",
    "vnp_ReturnUrl" => $vnp_ReturnUrl,
    "vnp_IpAddr" => $_SERVER['REMOTE_ADDR'] ?? "127.0.0.1",
    "vnp_CreateDate" => date("YmdHis"),
];

// Tạo chữ ký
ksort($vnp_Params);
$hashData = [];
foreach ($vnp_Params as $key => $value) {
    $hashData[] = $key . "=" . urlencode($value); // Mã hóa giá trị để tránh lỗi ký tự đặc biệt
}
$hashString = implode("&", $hashData);
$vnp_SecureHash = hash_hmac('sha512', $hashString, $vnp_HashSecret);

// Log chuỗi ký
error_log("HashString: " . $hashString);
error_log("SecureHash: " . $vnp_SecureHash);

// Thêm các trường vào tham số
$vnp_Params["vnp_SecureHash"] = $vnp_SecureHash;
$vnp_Params["vnp_SecureHashType"] = "SHA512";

// Tạo URL
$vnpUrl = $vnp_Url . '?' . http_build_query($vnp_Params);

// Trả về
echo json_encode([
    "vnpUrl" => $vnpUrl,
    "debug" => [
        "hashString" => $hashString,
        "secureHash" => $vnp_SecureHash,
        "params" => $vnp_Params
    ]
]);