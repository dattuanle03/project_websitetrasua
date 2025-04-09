<p>Hình thức thanh toán</p>
<div class="container">
    <?php
    if (isset($_SESSION['id_khachhang'])) {
    ?>
        <div class="arrow-steps clearfix">
            <div class="step done"> <span><a href="index.php?quanly=giohang">Giỏ hàng</a></span></div>
            <div class="step done"> <span><a href="index.php?quanly=vanchuyen">Vận chuyển</a></span></div>
            <div class="step current"> <span><a href="index.php?quanly=thongtinthanhtoan">Thanh toán</a></span></div>
            <div class="step"> <span><a href="index.php?quanly=donhangdadat">Lịch sử đơn hàng</a></span></div>
        </div>
    <?php
    }
    ?>
    <form action="pages/main/xulythanhtoan.php" method="POST">
        <div class="row">
            <?php
            $id_dangky = $_SESSION['id_khachhang'];
            $sql_get_vanchuyen = mysqli_query($mysqli, "SELECT * FROM tbl_shipping WHERE id_dangky='$id_dangky' LIMIT 1");
            $count = mysqli_num_rows($sql_get_vanchuyen);
            if ($count > 0) {
                $row_get_vanchuyen = mysqli_fetch_array($sql_get_vanchuyen);
                $name = $row_get_vanchuyen['name'];
                $phone = $row_get_vanchuyen['phone'];
                $address = $row_get_vanchuyen['address'];
                $note = $row_get_vanchuyen['note'];
            } else {

                $name = '';
                $phone = '';
                $address = '';
                $note = '';
            }
            ?>
            <div class="col-md-8">
                <h4>Thông tin vận chuyển và đơn hàng</h4>
                <ul>
                    <li>Họ và tên vận chuyển : <b><?php echo $name ?></b> </li>
                    <li>Số điện thoại : <b><?php echo $phone ?></b></li>
                    <li>Địa chỉ : <b><?php echo $address ?></b></li>
                    <li>Ghi chú : <b><?php echo $note ?></b></li>
                </ul>
                <!-- -------------Giỏ hàng------------ -->
                <table style="width:100%; text-align:center; margin-top:20px;" border="1">
                    <tr>
                        <th>Tên sản phẩm</th>
                        <th>Hình ảnh</th>
                        <th>Số lượng</th>
                        <th>Giá sản phẩm</th>
                        <th>Thành tiền</th>

                    </tr>
                    <?php
                    if (isset($_SESSION['cart'])) {
                        $i = 0;
                        $tongtien = 0;
                        foreach ($_SESSION['cart'] as $cart_item) {
                            $thanhtien = $cart_item['soluong'] * $cart_item['giasp'];
                            $tongtien += $thanhtien;
                            $i++;
                    ?>
                            <tr>
                                <td><?php echo $cart_item['tensanpham'] ?></td>
                                <td><img src="admin/modules/quanlysp/uploads/<?php echo $cart_item['hinhanh'] ?>" width="100px"></td>
                                <td>
                                    <?php echo $cart_item['soluong'] ?>
                                </td>
                                <td><?php echo number_format($cart_item['giasp'], 0, ',', '.') . 'vnđ'; ?></td>
                                <td><?php echo number_format($thanhtien, 0, ',', '.') . 'vnđ' ?></td>
                            </tr>
                        <?php
                        }
                        ?>
                        <tr>
                            <td colspan="8">
                                <p style="float:left;">Tổng tiền : <?php echo number_format($tongtien, 0, ',', '.') . 'vnđ' ?></p>
                                <div style="clear:both"></div>
                                <?php
                                if (isset($_SESSION['dangky'])) {
                                ?>
                                <?php
                                } else {
                                ?>
                                    <p><a href="index.php?quanly=dangky">Đăng ký đặt hàng</a></p>
                                <?php
                                }
                                ?>
                            </td>
                        </tr>
                    <?php
                    } else {
                    ?>
                        <tr>
                            <td colspan="8">
                                <p>Hiện tại giỏ hàng trống</p>
                            </td>

                        </tr>
                    <?php
                    }
                    ?>
                </table>
            </div>
            <style type="text/css">
                .col-md-4.hinhthucthanhtoan .form-check {
                    margin: 10px;
                }
            </style>

            <div class="col-md-4 hinhthucthanhtoan">
                <h4>Hình thức thanh toán</h4>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="payment" id="exampleRaios2" value="tienmat" checked>
                    <label class="form-check-label" for="exampleRaios2">
                        Tiền mặt
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="payment" id="exampleRaios2" value="chuyenkhoan" checked>
                    <label class="form-check-label" for="exampleRaios2">
                        Chuyển khoản
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="payment" id="exampleRaios4" value="VNPAY" checked>
                    <img src="img/VNPAY.png" height="20" width="64">
                    <label class="form-check-label" for="exampleRaios4">
                        VNPAY
                    </label>
                </div>
                <input type="submit" value="Thanh toán ngay" name="redirect" class="btn btn-danger">
                
                </form>

                <p></p>

                <?php
                $tongtien = 0;
                foreach ($_SESSION['cart'] as $key => $value) {
                    $thanhtien = $cart_item['soluong'] * $cart_item['giasp'];
                    $tongtien += $thanhtien;
                }
                $tongtien_vnd = $tongtien;
                $tongtien_usd = round($tongtien / 25.437);
                ?>
                <input type="hidden" name="" value="<?php echo $tongtien_usd ?>" id="tongtien">
                <div id="paypal-button"></div>

                <form class="" method="POST" target="_blank" enctype="application/x-www-form-urlencoded"
                    action="pages/main/xulythanhtoanmomo.php">
                    <input type="hidden" value="<?php echo $tongtien_vnd ?>" name="tongtien_vnd">
                    <input type="submit" name="momo" value="Thanh toán momo qr code" class="btn btn-danger">
                </form>

                <p></p>
                <form method="POST" target="_blank" enctype="application/x-www-form-urlencoded"
                    action="pages/main/xulythanhtoanmomo_atm.php">

                    <input type="hidden" value="<?php echo $tongtien_vnd ?>" name="tongtien_vnd">
                    <input type="submit" name="momo" value="Thanh toán MOMO ATM" class="btn btn-danger">
                </form>


            </div>

        </div>



</div>