<?php
    if(isset($_GET['trang'])){
        $page = $_GET['trang'];
    }else {
        $page = 1;
    }
    if($page == '' || $page == 1){
        $begin = 0;
    }else {
        $begin = ($page*8)-8;
    }
    $sql_pro = "SELECT * FROM tbl_sanpham,tbl_danhmuc WHERE tbl_sanpham.id_danhmuc=tbl_danhmuc.id_danhmuc ORDER BY tbl_sanpham.id_sanpham DESC LIMIT $begin,8";
    $query_pro = mysqli_query($mysqli, $sql_pro);
    $sql_trang = mysqli_query($mysqli, "SELECT * FROM tbl_sanpham");
    $row_count = mysqli_num_rows($sql_trang);
    $trang = ceil($row_count / 8);
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Danh sách sản phẩm</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <style type="text/css">
        ul.product_list {
            padding: 0;
            margin: 0;
            list-style: none;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
        }
        ul.product_list li {
            width: 23%;
            border: 1px solid #ddd;
            margin: 10px 0;
            display: inline-block;
            vertical-align: top;
            height: 350px;
            padding: 10px;
            box-sizing: border-box;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        ul.product_list li:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        ul.product_list li img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        p.title_product {
            text-align: center;
            color: #000;
            font-size: 16px;
            font-weight: bold;
            margin-top: 10px;
        }
        p.price_product {
            text-align: center;
            color: red;
            font-size: 16px;
            font-weight: bold;
        }
        ul.list_trang {
            list-style: none;
            justify-content: center;
            display: flex;
            padding: 20px 200px 0 0;
        }
        ul.list_trang li {
            padding: 5px 8px;
        }
        ul.list_trang li a {
            color: #000;
            text-decoration: none;
            background-color: #ff8c00;
        }
    </style>
</head>
<body>

<h3>Sản phẩm mới nhất</h3>
<div id="product-list">
    <ul class="product_list">
        <?php
        while ($row = mysqli_fetch_array($query_pro)) {
        ?>
            <li class="product_item">
                <a href="index.php?quanly=sanpham&id=<?php echo $row['id_sanpham'] ?>">
                    <img class="img img-responsive" src="admin/modules/quanlysp/uploads/<?php echo $row['hinhanh'] ?>" alt="product image">
                    <p class="title_product"><?php echo $row['tensanpham'] ?></p>
                    <p class="price_product">Giá <?php echo number_format($row['giasp'], 0, ',', '.') . 'vnđ' ?></p>
                </a>
            </li>
        <?php
        }
        ?>
    </ul>
</div>
<p id="current-page">Trang hiện tại: <?php echo $page ?>/<?php echo $trang ?></p>
<ul class="list_trang">
    <?php
    for ($i = 1; $i <= $trang; $i++) {
    ?>
        <li <?php if ($i == $page) { echo ''; } ?> >
            <a href="javascript:void(0);" class="page-link" data-page="<?php echo $i ?>"><?php echo $i ?></a>
        </li>
    <?php
    }
    ?>
</ul>

<script>
    $(document).ready(function() {
        $(".page-link").click(function() {
            var page = $(this).data("page");

            $.ajax({
                url: "", 
                type: "GET",
                data: { trang: page },
                success: function(response) {
                    var newProducts = $(response).find("#product-list").html();
                    $("#product-list").html(newProducts);
                    var currentPageText = "Trang hiện tại : " + page + "/" + <?php echo $trang; ?>;
                    $("#current-page").text(currentPageText); 
                }
            });
        });
    });
</script>

</body>
</html>
