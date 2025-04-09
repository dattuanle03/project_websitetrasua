<style>
    .rating-stars ul {
        list-style-type: none;
        padding: 0;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .rating-stars ul>li.star {
        display: inline-block;

    }

    .rating-stars ul>li.star>i.fa {
        font-size: 1.5em;
        color: #ccc;
    }

    .rating-stars ul>li.star.hover>i.fa {
        color: #FFCC36;
    }

    .rating-stars ul>li.star.selected>i.fa {
        color: #FF912C;
    }
</style>
<?php
$sql_chitiet = "SELECT * FROM tbl_sanpham,tbl_danhmuc WHERE tbl_sanpham.id_danhmuc=tbl_danhmuc.id_danhmuc AND
     tbl_sanpham.id_sanpham='$_GET[id]' LIMIT 1";
$query_chitiet = mysqli_query($mysqli, $sql_chitiet);
while ($row_chitiet = mysqli_fetch_array($query_chitiet)) {
?>
    <div class="wrapper_chiter">
        <div class="hinhanh_sanpham">
            <img width="100%" src="admin/modules/quanlysp/uploads/<?php echo $row_chitiet['hinhanh'] ?>">
            <section class='rating-widget'>
                <?php
                $product_id = $row_chitiet['id_sanpham'];
                $sql_star = "SELECT AVG(rating) AS avg_star FROM tbl_danhgiasao WHERE product_id='$product_id'";
                $query_star = mysqli_query($mysqli, $sql_star);
                $result_star = mysqli_fetch_array($query_star);
                $avg_star = round($result_star['avg_star'], 1);
                echo "Đánh giá: " . $avg_star;
                ?>
                <div class='rating-stars text-center'>
                    <ul id='stars'>
                        <li class='star' title='Poor' data-value='1' data-product_id="<?php echo $row_chitiet['id_sanpham'] ?>">
                            <i class='fa fa-star fa-fw'></i>
                        </li>
                        <li class='star' title='Fair' data-value='2' data-product_id="<?php echo $row_chitiet['id_sanpham'] ?>">
                            <i class='fa fa-star fa-fw'></i>
                        </li>
                        <li class='star' title='Good' data-value='3' data-product_id="<?php echo $row_chitiet['id_sanpham'] ?>">
                            <i class='fa fa-star fa-fw'></i>
                        </li>
                        <li class='star' title='Excellent' data-value='4' data-product_id="<?php echo $row_chitiet['id_sanpham'] ?>">
                            <i class='fa fa-star fa-fw'></i>
                        </li>
                        <li class='star' title='WOW!!!' data-value='5' data-product_id="<?php echo $row_chitiet['id_sanpham'] ?>">
                            <i class='fa fa-star fa-fw'></i>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
        <form style="margin-top: 30px;" method="POST" action="pages/main/themgiohang.php?idsanpham=<?php echo $row_chitiet['id_sanpham'] ?>">
            <div class="chitiet_sanpham">
                <h3 style="margin-top: 50px;">Tên sản phẩm : <?php echo $row_chitiet['tensanpham'] ?></h3>
                <p>Mã sản phẩm : <?php echo $row_chitiet['masp'] ?></p>
                <p>Giá sản phẩm : <?php echo number_format($row_chitiet['giasp'], 0, ',', '.') . 'vnđ' ?></p>
                <p>Danh mục : <?php echo $row_chitiet['tendanhmuc'] ?></p>
                <p><input class="themgiohang" name="themgiohang" type="submit" value="Thêm giỏ hàng"></p>
            </div>
        </form>
    </div>
    <div class="clear"></div>
    <!-- <div class="tabs">
        <ul id="tabs-nav">
            <li><a href="#tab1">Thông tin</a></li>
            <li><a href="#tab2">Nội dung chi tiết</a></li>
        </ul> 
        <div id="tabs-content">
            <div id="tab1" class="tab-content">
                <?php //echo $row_chitiet['tomtat'] 
                ?>
            </div>
            <div id="tab2" class="tab-content">
                <?php //echo $row_chitiet['noidung'] 
                ?>
            </div>
        </div> 
    </div> -->
<?php
}
?>