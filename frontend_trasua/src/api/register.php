<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include('../../../config/config.php');

// ✅ Đọc dữ liệu JSON nếu Content-Type là application/json
$contentType = $_SERVER["CONTENT_TYPE"] ?? '';
if (strpos($contentType, "application/json") !== false) {
    $data = json_decode(file_get_contents("php://input"), true);
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = isset($data['password']) ? md5($data['password']) : '';
    $avatar = '';
    $diachi = '';
} else {
    // ✅ Đọc dữ liệu từ FormData nếu là multipart/form-data
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = isset($_POST['password']) ? md5($_POST['password']) : '';
    $avatar = '';
    $diachi = '';

    if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === 0) {
        $ext = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
        $filename = time() . '_' . rand(1000, 9999) . '.' . $ext;
        $uploadPath = '../uploads/avatars/' . $filename;

        if (move_uploaded_file($_FILES['avatar']['tmp_name'], $uploadPath)) {
            $avatar = $filename;
        }
    }
}

// ✅ Kiểm tra thông tin bắt buộc
if (!$name || !$email || !$password) {
    echo json_encode(["success" => false, "message" => "Vui lòng nhập đầy đủ tên, email và mật khẩu."]);
    exit;
}

// ✅ Kiểm tra trùng email
$check = "SELECT id_dangky FROM tbl_dangky WHERE email='$email'";
$result = mysqli_query($conn, $check);
if (mysqli_num_rows($result) > 0) {
    echo json_encode(["success" => false, "message" => "Email đã được đăng ký."]);
    exit;
}

// ✅ Lưu vào CSDL
$sql = "INSERT INTO tbl_dangky (tenkhachhang, email, matkhau, avatar, diachi)
        VALUES ('$name', '$email', '$password', '$avatar', '$diachi')";

if (mysqli_query($conn, $sql)) {
    $id = mysqli_insert_id($conn);
    echo json_encode([
        "success" => true,
        "message" => "Đăng ký thành công.",
        "user" => [
            "id" => $id,
            "name" => $name,
            "email" => $email,
            "avatar" => $avatar,
            "diachi" => $diachi
        ]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi đăng ký: " . mysqli_error($conn)]);
}
