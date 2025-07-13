<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include '../../../config/config.php';

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$avatar = $data['avatar'] ?? '';

if (empty($email) || empty($name)) {
    echo json_encode(["success" => false, "message" => "Thiếu tên hoặc email"]);
    exit;
}

// Hash mật khẩu mặc định là "1"
$defaultPassword = md5("1");

// Kiểm tra tài khoản đã tồn tại chưa
$query = mysqli_query($conn, "SELECT * FROM tbl_dangky WHERE email = '$email'");
if (mysqli_num_rows($query) > 0) {
    $user = mysqli_fetch_assoc($query);

    // Nếu chưa có mật khẩu thì cập nhật
    if (empty($user['matkhau'])) {
        mysqli_query($conn, "UPDATE tbl_dangky SET matkhau = '$defaultPassword' WHERE email = '$email'");
    }

    $response = [
        "id" => $user["id_dangky"],
        "name" => $user["tenkhachhang"],
        "email" => $user["email"],
        "avatar" => $user["avatar"] ?? "",
        "diachi" => $user["diachi"] ?? ""
    ];
    echo json_encode(["success" => true, "user" => $response]);
    exit;
}

// Nếu chưa có thì tạo mới, gán mật khẩu mặc định là hash("1")
$sql = "INSERT INTO tbl_dangky (tenkhachhang, email, matkhau, avatar) VALUES ('$name', '$email', '$defaultPassword', '$avatar')";
if (mysqli_query($conn, $sql)) {
    $newId = mysqli_insert_id($conn);
    echo json_encode([
        "success" => true,
        "user" => [
            "id" => $newId,
            "name" => $name,
            "email" => $email,
            "avatar" => $avatar,
            "diachi" => ""
        ]
    ]);
} else {
    echo json_encode(["success" => false, "message" => mysqli_error($conn)]);
}
