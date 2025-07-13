<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: *");

include('../../../config/config.php');

$data = json_decode(file_get_contents("php://input"), true);

$email = $data["email"] ?? "";
$password = md5($data["password"] ?? "");

// 👉 Thêm điều kiện trạng thái = 1
$sql = "SELECT * FROM tbl_dangky WHERE email='$email' AND matkhau='$password' AND trangthai = 1 LIMIT 1";
$query = mysqli_query($conn, $sql);
$count = mysqli_num_rows($query);

if ($count > 0) {
    $row = mysqli_fetch_assoc($query);
    echo json_encode([
        "success" => true,
        "user" => [
            "id" => $row["id_dangky"],
            "name" => $row["tenkhachhang"],
            "email" => $row["email"],
            "avatar" => $row["avatar"] ?? null
        ]
    ]);
} else {
    // ❗ Có thể do sai mật khẩu hoặc tài khoản bị khóa
    echo json_encode([
        "success" => false,
        "message" => "Tài khoản không tồn tại hoặc đã bị khóa"
    ]);
}
?>
