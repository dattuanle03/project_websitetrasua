<p>Lịch sử đơn hàng</p>
<div class="container">
<?php
if (isset($_SESSION['id_khachhang'])) {
?>
    <div class="arrow-steps clearfix">
        <div class="step done"> <span><a href="index.php?quanly=giohang">Giỏ hàng</a></span></div>
        <div class="step done"> <span><a href="index.php?quanly=vanchuyen">Vận chuyển</a></span></div>
        <div class="step done"> <span><a href="index.php?quanly=thongtinthanhtoan">Thanh toán</a></span></div>
        <div class="step current"> <span><a href="index.php?quanly=donhangdadat">Lịch sử đơn hàng</a></span></div>
    </div>
    <?php
}
?>
</div>