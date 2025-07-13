<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

include("../../../config/config.php");

$data = json_decode(file_get_contents("php://input"), true);
$id = $data["id"] ?? null;

if (!$id) {
    echo json_encode(["success" => false, "message" => "Thiếu ID người dùng"]);
    exit;
}

// Lấy thông tin người dùng
$sql = "SELECT * FROM tbl_dangky WHERE id_dangky = '$id'";
$result = mysqli_query($conn, $sql);
if (!$result || mysqli_num_rows($result) === 0) {
    echo json_encode(["success" => false, "message" => "Người dùng không tồn tại"]);
    exit;
}

$user = mysqli_fetch_assoc($result);

// ❌ Nếu là super admin thì không được đổi quyền
if ($user['is_super_admin'] == "1") {
    echo json_encode(["success" => false, "message" => "Không thể thay đổi quyền của super admin"]);
    exit;
}

// Đổi role
$newRole = ($user['role'] === 'admin') ? 'user' : 'admin';
$update = mysqli_query($conn, "UPDATE tbl_dangky SET role = '$newRole' WHERE id_dangky = '$id'");

if ($update) {
    echo json_encode(["success" => true, "message" => "Đã đổi quyền thành công"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi khi cập nhật quyền"]);
}
