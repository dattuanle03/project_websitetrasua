<?php
    if (isset($_POST['timkiem']) && isset($_POST['tukhoa']) && !empty($_POST['tukhoa'])) {
        $tukhoa = $_POST['tukhoa'];
        $sql_pro = "SELECT * FROM tbl_sanpham,tbl_danhmuc WHERE tbl_sanpham.id_danhmuc=tbl_danhmuc.id_danhmuc AND tbl_sanpham.tensanpham LIKE ?";
        $stmt = mysqli_prepare($mysqli, $sql_pro);
        $searchTerm = "%" . $tukhoa . "%"; 

        mysqli_stmt_bind_param($stmt, "s", $searchTerm); 
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
    }
?>
<h3>Tìm kiếm từ khóa: <?php echo isset($tukhoa) ? htmlspecialchars($tukhoa) : ''; ?></h3>

<ul class="product_list">
    <?php
        if (isset($result)) {
            while ($row = mysqli_fetch_array($result)) {
    ?>
    <li>
        <a href="index.php?quanly=sanpham&id=<?php echo $row['id_sanpham'] ?>">
            <img src="admin/modules/quanlysp/uploads/<?php echo $row['hinhanh'] ?>">
            <p class="title_product"><?php echo $row['tensanpham'] ?></p>
            <p class="price_product">Giá <?php echo number_format($row['giasp'], 0, ',', '.') . 'vnđ' ?></p>
        </a>
    </li>
    <?php
            }
        }
    ?>
</ul>
