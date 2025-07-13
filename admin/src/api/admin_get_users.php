<?php
// File: admin_get_users.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include('../../../config/config.php');

$sql = "
SELECT id_dangky, tenkhachhang, email, avatar, diachi, role, trangthai, created_at 
FROM tbl_dangky
ORDER BY created_at DESC";

$result = mysqli_query($conn, $sql);

$users = [];
while ($row = mysqli_fetch_assoc($result)) {
    $users[] = $row;
}

echo json_encode($users);
