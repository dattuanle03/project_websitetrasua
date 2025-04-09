<?php
    $limit = 10;
    $page = isset($_GET['page']) ? $_GET['page'] : 1;
    $start = ($page - 1) * $limit;
    $sql_total = "SELECT COUNT(*) AS total FROM tbl_sanpham";
    $query_total = mysqli_query($mysqli, $sql_total);
    $row_total = mysqli_fetch_assoc($query_total);
    $total_products = $row_total['total'];
    $total_pages = ceil($total_products / $limit);

    $sql_lietke_sp = "SELECT * FROM tbl_sanpham, tbl_danhmuc WHERE tbl_sanpham.id_danhmuc = tbl_danhmuc.id_danhmuc 
    ORDER BY id_sanpham LIMIT $start, $limit";
    $query_lietke_sp = mysqli_query($mysqli, $sql_lietke_sp);
?>
<p>Liệt kê sản phẩm</p>
<style>
    a {
        text-decoration: none;
        color: black;
    }
    a:hover {
        color: brown;
    }
    .pagination {
        margin-top: 20px;
        display: flex;
        justify-content: center;
    }
    .pagination a {
        padding: 8px 15px;
        margin: 0 5px;
        border: 1px solid #ddd;
        color: black;
    }
    .pagination a.active {
        background-color: brown;
        color: white;
        border-color: brown;
    }
    .pagination a:hover {
        background-color: #ddd;
    }
</style>
<table style="width:100%" border="1" style="border-collapse: collapse;">
    <tr>
        <th>ID</th>
        <th>Tên sản phẩm</th>
        <th>Hình ảnh</th>
        <th>Giá</th>
        <th>Danh mục</th>
        <th>Mã sản phẩm</th>
        <th>Tóm tắt</th>
        <th>Tình trạng</th>
        <th>Quản lý</th>
    </tr>
    <?php
        $i = $start;
        while ($row = mysqli_fetch_array($query_lietke_sp)) {
            $i++;
    ?>
    <tr>
        <td><?php echo $i; ?></td>
        <td><?php echo $row['tensanpham']; ?></td>
        <td><img src="modules/quanlysp/uploads/<?php echo $row['hinhanh']; ?>" width="100px"></td>
        <td><?php echo $row['giasp']; ?></td>
        <td><?php echo $row['tendanhmuc']; ?></td>
        <td><?php echo $row['masp']; ?></td>
        <td><?php echo $row['tomtat']; ?></td>
        <td>
            <?php echo ($row['tinhtrang'] == 1) ? "Kích hoạt" : "Ẩn"; ?>
        </td>
        <td>
            <a href="modules/quanlysp/xuly.php?idsanpham=<?php echo $row['id_sanpham']; ?>">Xóa</a> |
            <a href="?action=quanlysp&query=sua&idsanpham=<?php echo $row['id_sanpham']; ?>">Sửa</a>
        </td>
    </tr>
    <?php
        }
    ?>
</table>

<div class="pagination">
    <?php
        $action = isset($_GET['action']) ? $_GET['action'] : '';
        $query = isset($_GET['query']) ? $_GET['query'] : '';
        if ($page > 1) {
            echo '<a href="index.php?action=' . $action . '&query=' . $query . '&page=' . ($page - 1) . '">&laquo;</a>';
        }
        for ($i = 1; $i <= $total_pages; $i++) {
            if ($i == $page) {
                echo '<a href="index.php?action=' . $action . '&query=' . $query . '&page=' . $i . '" class="active">' . $i . '</a>';
            } else {
                echo '<a href="index.php?action=' . $action . '&query=' . $query . '&page=' . $i . '">' . $i . '</a>';
            }
        }
        if ($page < $total_pages) {
            echo '<a href="index.php?action=' . $action . '&query=' . $query . '&page=' . ($page + 1) . '">&raquo;</a>';
        }
    ?>
</div>

