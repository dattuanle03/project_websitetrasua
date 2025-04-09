<?php
include('../../admin/config/config.php');

if (isset($_POST['product_id']) && isset($_POST['ratingValue'])) {
    $product_id = $_POST['product_id'];
    $ratingValue = $_POST['ratingValue'];

    // Lưu đánh giá vào bảng `tbl_danhgiasao`
    $sql = "INSERT INTO tbl_danhgiasao (product_id, rating) VALUES ('$product_id', '$ratingValue')";
    if (mysqli_query($mysqli, $sql)) {
        echo "Cảm ơn bạn đã đánh giá!";
    } else {
        echo "Lỗi khi lưu đánh giá!";
    }
}
?>
