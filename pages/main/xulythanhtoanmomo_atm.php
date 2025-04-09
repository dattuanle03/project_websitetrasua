<?php
header('Content-type: text/html; charset=utf-8');
// Bật thông báo lỗi
ini_set('display_errors', 1);
error_reporting(E_ALL);

function execPostRequest($url, $data)
{
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data))
    );
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);

    // Tắt kiểm tra SSL (Không khuyến khích sử dụng trong môi trường sản xuất)
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

    // Execute post request
    $result = curl_exec($ch);

    // Kiểm tra lỗi cURL
    if(curl_errno($ch)) {
        echo 'cURL Error: ' . curl_error($ch);
        curl_close($ch);
        exit();
    }

    curl_close($ch);
    return $result;
}


$endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
$partnerCode = 'MOMOBKUN20180529';
$accessKey = 'klm05TvNBzhg7h7j';
$secretKey = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';

$orderInfo = "Thanh toán qua MoMo ATM";
$amount = $_POST['tongtien_vnd'];
$orderId = time() . "";
$redirectUrl = "http://localhost/DOANCHUYENNGANH/index.php?quanly=camon";
$ipnUrl = "http://localhost/DOANCHUYENNGANH/index.php?quanly=camon";
$extraData = "";

// Kiểm tra extraData từ POST
$extraData = $_POST["extraData"] ?? ""; // Dùng toán tử null coalescing nếu PHP >= 7

// Khai báo và gán giá trị cho requestId và requestType
$requestId = time() . ""; // Gán giá trị cho requestId
$requestType = "payWithATM"; // Gán giá trị cho requestType

// Tạo chuỗi rawHash để ký
$rawHash = "accessKey=" . $accessKey .
           "&amount=" . $amount .
           "&extraData=" . $extraData .
           "&ipnUrl=" . $ipnUrl .
           "&orderId=" . $orderId .
           "&orderInfo=" . $orderInfo .
           "&partnerCode=" . $partnerCode .
           "&redirectUrl=" . $redirectUrl .
           "&requestId=" . $requestId .
           "&requestType=" . $requestType;

$signature = hash_hmac("sha256", $rawHash, $secretKey);

$data = array(
    'partnerCode' => $partnerCode,
    'partnerName' => "Test",
    "storeId" => "MomoTestStore",
    'requestId' => $requestId,
    'amount' => $amount,
    'orderId' => $orderId,
    'orderInfo' => $orderInfo,
    'redirectUrl' => $redirectUrl,
    'ipnUrl' => $ipnUrl,
    'lang' => 'vi',
    'extraData' => $extraData,
    'requestType' => $requestType,
    'signature' => $signature
);

$result = execPostRequest($endpoint, json_encode($data));

if ($result === false) {
    echo "Lỗi khi gửi yêu cầu: " . curl_error($ch);
    exit();
}

$jsonResult = json_decode($result, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo "Lỗi phân tích JSON: " . json_last_error_msg();
    exit();
}

// Kiểm tra và chuyển hướng
if (isset($jsonResult['payUrl'])) {
    header('Location: ' . $jsonResult['payUrl']);
    exit();
} else {
    echo "Lỗi khi tạo yêu cầu thanh toán: " . ($jsonResult['message'] ?? 'Không rõ lỗi.');
}
?>
