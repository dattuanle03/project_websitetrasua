<?php
if (isset($_GET['search']) && !empty($_GET['search'])) {
    // Xử lý khi tìm kiếm theo từ khóa
    $search = $_GET['search'];
    $sql_pro = "SELECT * FROM tbl_sanpham WHERE tensanpham LIKE '%$search%' ORDER BY id_sanpham DESC";
    $query_pro = mysqli_query($mysqli, $sql_pro);
    echo '<h3>Kết quả tìm kiếm cho: ' . $search . '</h3>';
} elseif (isset($_GET['id'])) {
    // Xử lý khi bấm vào danh mục
    $sql_pro = "SELECT * FROM tbl_sanpham WHERE id_danhmuc='$_GET[id]' ORDER BY id_sanpham DESC";
    $query_pro = mysqli_query($mysqli, $sql_pro);

    // Lấy tên danh mục
    $sql_cate = "SELECT * FROM tbl_danhmuc WHERE id_danhmuc='$_GET[id]' LIMIT 1";
    $query_cate = mysqli_query($mysqli, $sql_cate);
    $row_title = mysqli_fetch_array($query_cate);

    echo '<h3>Danh mục sản phẩm: ' . $row_title['tendanhmuc'] . '</h3>';
}
?>

<ul class="product_list">
    <?php
    while ($row = mysqli_fetch_array($query_pro)) {
    ?>
        <li>
            <a href="index.php?quanly=sanpham&id=<?php echo $row['id_sanpham'] ?>">
                <img class="img img-responsive" src="admin/modules/quanlysp/uploads/<?php echo $row['hinhanh'] ?>" alt="<?php echo $row['tensanpham'] ?>">
                <p class="title_product"><?php echo $row['tensanpham'] ?></p>
                <p class="price_product">Giá: <?php echo number_format($row['giasp'], 0, ',', '.') . ' VNĐ' ?></p>
            </a>
        </li>
    <?php
    }
    ?>
</ul>
