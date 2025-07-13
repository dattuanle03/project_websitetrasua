<?php
$id = $_GET["id"];
$sql = "SELECT * FROM tbl_dangky WHERE id_dangky = '$id'";
$user = mysqli_fetch_assoc(mysqli_query($conn, $sql));

if ($user["is_super_admin"] == 1) {
  echo json_encode(["success" => false, "message" => "Không thể xoá admin gốc"]);
  exit;
}

// Xóa nếu không phải super admin
