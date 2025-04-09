<?php
$sql_danhmuc = "SELECT * FROM tbl_danhmuc ORDER BY id_danhmuc DESC";
$query_danhmuc = mysqli_query($mysqli, $sql_danhmuc);
?>
<?php
if (isset($_GET['dangxuat']) && $_GET['dangxuat'] == 1) {
    unset($_SESSION['dangky']);
}
?>
<style>
    .navbar {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5rem 1rem;
    }
    .navbar .container-fluid {
        display: flex;
        justify-content: center; 
        align-items: center;
        flex-wrap: nowrap;
    }
    .navbar-brand {
        margin-right: 1rem;
    }
    .navbar-nav {
        flex-direction: row;
        justify-content: center;
    }
    .navbar-nav .nav-item {
        margin: 0 10px;
    }
    .dropdown-menu {
        text-align: center;
    }
    .d-flex {
        margin-left: auto;
        display: flex;
        align-items: center;
    }
    .nav-link {
        color: white !important;
        font-weight: 500;
    }
    .nav-link:hover {
        color: #f0ad4e !important;
    }
    .btn-outline-success {
        color: white;
        border-color: #f0ad4e;
    }
    .btn-outline-success:hover {
        background-color: #f0ad4e;
        color: white;
    }
</style>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
        <a class="navbar-brand" href="index.php">
            <img src="img/logo.png" width="40px">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" 
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="index.php">Trang chủ</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="index.php?quanly=tintuc">Tin tức</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="index.php?quanly=lienhe">Liên hệ</a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" 
                    data-bs-toggle="dropdown" aria-expanded="false">
                        Danh mục sản phẩm
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <?php
                        while ($row_danhmuc = mysqli_fetch_array($query_danhmuc)) {
                        ?>
                            <li><a class="dropdown-item" href="index.php?quanly=danhmucsanpham&id=<?php echo $row_danhmuc['id_danhmuc'] ?>">
                                <?php echo $row_danhmuc['tendanhmuc'] ?></a></li>
                        <?php
                        }
                        ?>
                    </ul>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="index.php?quanly=giohang">Giỏ hàng</a>
                </li>
                <?php
                if (isset($_SESSION['dangky'])) {
                ?>
                    <li class="nav-item"><a class="nav-link" href="index.php?dangxuat=1">Đăng xuất</a></li>
                    <li class="nav-item"><a class="nav-link" href="index.php?quanly=thaydoimatkhau">Thay đổi mật khẩu</a></li>
                    <li class="nav-item"><a class="nav-link" href="index.php?quanly=lichsudonhang">Lịch sử đơn hàng</a></li>
                <?php
                } else {
                ?>
                    <li class="nav-item"><a class="nav-link" href="index.php?quanly=dangky">Đăng ký</a></li>
                <?php
                }
                ?>
            </ul>
            <form class="d-flex" action="index.php?quanly=timkiem" method="POST">
                <input class="form-control me-2" type="search" placeholder="Từ khóa...." aria-label="Search" name="tukhoa">
                <button class="btn btn-outline-success" name="timkiem" type="submit">Tìm</button>
            </form>
        </div>
    </div>
</nav>
