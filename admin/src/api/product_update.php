<?php
// Cho phép CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

// Kết nối CSDL
require_once("../../../config/config.php");

// Kiểm tra method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Sai phương thức"]);
    exit;
}

// Lấy dữ liệu
$id = isset($_POST['id']) ? intval($_POST['id']) : 0;
$tensanpham = $_POST['tensanpham'] ?? '';
$giasp = $_POST['giasp'] ?? 0;
$tomtat = $_POST['tomtat'] ?? '';
$tinhtrang = $_POST['tinhtrang'] ?? 1;
$id_danhmuc = $_POST['id_danhmuc'] ?? 0;
$hinhanh_cu = $_POST['hinhanh_cu'] ?? '';

// Kiểm tra dữ liệu bắt buộc
if ($id <= 0 || !$tensanpham || !$giasp || !$id_danhmuc) {
    echo json_encode(["success" => false, "message" => "Thiếu dữ liệu bắt buộc."]);
    exit;
}

// Xử lý upload ảnh mới nếu có
$hinhanh = $hinhanh_cu;
if (isset($_FILES['hinhanh']) && $_FILES['hinhanh']['error'] === UPLOAD_ERR_OK) {
    $upload_dir = "../../../uploads/products/";
    $file_name = time() . "_" . basename($_FILES["hinhanh"]["name"]);
    $target_file = $upload_dir . $file_name;

    if (move_uploaded_file($_FILES["hinhanh"]["tmp_name"], $target_file)) {
        // Xóa ảnh cũ nếu có
        if ($hinhanh_cu && file_exists($upload_dir . $hinhanh_cu)) {
            @unlink($upload_dir . $hinhanh_cu);
        }
        $hinhanh = $file_name;
    } else {
        echo json_encode(["success" => false, "message" => "Tải ảnh mới thất bại."]);
        exit;
    }
}

// Cập nhật dữ liệu
$stmt = $conn->prepare("UPDATE tbl_sanpham SET tensanpham=?, giasp=?, hinhanh=?, tomtat=?, tinhtrang=?, id_danhmuc=? WHERE id_sanpham=?");
$stmt->bind_param("sisssii", $tensanpham, $giasp, $hinhanh, $tomtat, $tinhtrang, $id_danhmuc, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Cập nhật thành công."]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi CSDL: " . $stmt->error]);
}

$stmt->close();
$conn->close();
