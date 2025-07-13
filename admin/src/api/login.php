<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

include('../../../config/config.php');

$data = json_decode(file_get_contents("php://input"), true);
$email = mysqli_real_escape_string($conn, $data['email'] ?? '');
$password = $data['matkhau'] ?? '';

if (!$email || !$password) {
    echo json_encode(["success" => false, "message" => "Thiếu email hoặc mật khẩu"]);
    exit;
}

$sql = "SELECT * FROM tbl_dangky WHERE email = '$email' AND trangthai = '1'";
$result = mysqli_query($conn, $sql);

if (!$result || mysqli_num_rows($result) === 0) {
    echo json_encode(["success" => false, "message" => "Email không tồn tại hoặc bị khóa"]);
    exit;
}

$user = mysqli_fetch_assoc($result);

// Kiểm tra mật khẩu
if (md5($password) !== $user['matkhau']) {
    echo json_encode(["success" => false, "message" => "Mật khẩu không đúng"]);
    exit;
}

// Kiểm tra quyền admin
if ($user['role'] !== 'admin') {
    echo json_encode(["success" => false, "message" => "Tài khoản không có quyền truy cập trang quản trị."]);
    exit;
}

// Xoá mật khẩu trước khi gửi
unset($user['matkhau']);

echo json_encode([
    "success" => true,
    "user" => $user
]);
