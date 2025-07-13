<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include '../../../config/config.php';

$id_dangky = $_POST['id'] ?? null;
$new_password = $_POST['password'] ?? null;
$new_address = $_POST['diachi'] ?? null;
$avatar_filename = '';

// Kiểm tra ID
if (!$id_dangky) {
    echo json_encode(['success' => false, 'message' => 'Thiếu ID người dùng']);
    exit;
}

// Xử lý ảnh nếu có
if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === 0) {
    $ext = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
    $filename = time() . '_' . rand(1000, 9999) . '.' . $ext;
    $uploadPath = '../../../uploads/avatars/' . $filename;

    if (move_uploaded_file($_FILES['avatar']['tmp_name'], $uploadPath)) {
        $avatar_filename = $filename;
    } else {
        echo json_encode(['success' => false, 'message' => 'Không thể lưu ảnh đại diện']);
        exit;
    }
}

// Cập nhật các trường
$updateFields = [];

if ($avatar_filename !== '') {
    $updateFields[] = "avatar = '$avatar_filename'";
}
if (!empty($new_password)) {
    $hashedPassword = md5($new_password);
    $updateFields[] = "matkhau = '$hashedPassword'";
}
if (!empty($new_address)) {
    $updateFields[] = "diachi = '$new_address'";
}

if (count($updateFields) > 0) {
    $sql = "UPDATE tbl_dangky SET " . implode(', ', $updateFields) . " WHERE id_dangky = '$id_dangky'";
    $result = mysqli_query($conn, $sql);

    if ($result) {
        $getUser = mysqli_query($conn, "SELECT id_dangky, tenkhachhang, email, avatar, diachi FROM tbl_dangky WHERE id_dangky = '$id_dangky' LIMIT 1");
        $user = mysqli_fetch_assoc($getUser);

        echo json_encode([
            'success' => true,
            'message' => 'Cập nhật thành công',
            'user' => [
                'id' => $user['id_dangky'],
                'name' => $user['tenkhachhang'],
                'email' => $user['email'],
                'avatar' => $user['avatar'] ?? '',
                'diachi' => $user['diachi'] ?? ''
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Lỗi khi cập nhật CSDL']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Không có dữ liệu để cập nhật']);
}
