<?php
    include('admin/config/config.php');
    // require('carbon/autoload.php');
    // use Carbon\Carbon;
    // use Carbon\CarbonInterval;

    // $now = Carbon::now('Asia/Ho_Chi_Minh');
    if(isset($_GET['vnp_Amount'])) {
        
        $vnp_Amount = $_GET['vnp_Amount'];
        $vnp_BankCode = $_GET['vnp_BankCode'];
        $vnp_BankTranNo = $_GET['vnp_BankTranNo'];
        $vnp_OrderInfo = $_GET['vnp_OrderInfo'];
        $vnp_PayDate = $_GET['vnp_PayDate'];
        $vnp_TmnCode = $_GET['vnp_TmnCode'];
        $vnp_TransactionNo = $_GET['vnp_TransactionNo'];
        $vnp_CardTyoe = $_GET['vnp_CardType'];
        $code_cart = $_SESSION['code_cart'];


        //insert database vnpay
        $insert_vnpay = "INSERT INTO tbl_vnpay(vnp_amount,code_cart,vnp_bankcode,vnp_banktranno,vnp_cardtype,vnp_orderinfo,vnp_paydate,
        vnp_tmncode,vnp_transactionno) VALUE('".$vnp_Amount."','".$code_cart."','".$vnp_BankCode."','".$vnp_BankTranNo."','".$vnp_CardTyoe."',
        '".$vnp_OrderInfo."','".$vnp_PayDate."','".$vnp_TmnCode."','".$vnp_TransactionNo."')";
        $cart_query = mysqli_query($mysqli,$insert_vnpay);

        if($cart_query) {
            //insert gio hang
            echo '<h3>Giao dịch thanh toán bằng VNPAY thành công </h3>';
            echo '<p>Vui lòng vào trang <a href="index.php?quanly=lichsudonhang"> Lịch sử đơn hàng </a> để xem chi tiết đơn hàng </p>';
        }else {
            echo 'Giao dịch thất bại';
        }
    }
    elseif(isset($_GET['partnerCode'])){
        $id_khachhang = $_SESSION['id_khachhang']; 
        $code_order = rand(0,9999);
        $partnerCode = $_GET['partnerCode'];
        $orderId = $_GET['orderId'];
        $amount = $_GET['amount'];
        $orderInfo = $_GET['orderInfo'];
        $orderType = $_GET['orderType'];
        $transId = $_GET['transId'];
        $payType = $_GET['payType'];
        $cart_payment = 'momo';
        $sql_get_vanchuyen = mysqli_query($mysqli, "SELECT * FROM tbl_shipping WHERE id_dangky='$id_khachhang' LIMIT 1");
        $row_get_vanchuyen = mysqli_fetch_array($sql_get_vanchuyen);
        $id_shipping = $row_get_vanchuyen['id_shipping'];
        $insert_momo = "INSERT INTO tbl_momo(partner_code,order_id,amount,order_info,order_type,trans_id,pay_type,code_cart) 
        VALUE('".$partnerCode."','".$orderId."','".$amount."','".$orderInfo."','".$orderType."','".$transId."','".$payType."','".$code_order."')";
        $cart_query = mysqli_query($mysqli,$insert_momo);

        if($cart_query) {
            $insert_cart = "INSERT INTO tbl_cart(id_khachhang,code_cart,cart_status,cart_date,cart_payment,cart_shipping) 
            VALUE('".$id_khachhang."','".$code_order."',1,'".$now."','".$cart_payment."','".$id_shipping."')";
            $cart_query = mysqli_query($mysqli,$insert_cart);
            //insert gio hang
            foreach($_SESSION['cart'] as $key => $value){
                $id_sanpham = $value['id'];
                $soluong = $value['soluong'];
                $insert_order_details = "INSERT INTO tbl_cart_details(id_sanpham,code_cart,soluongmua) 
                VALUE('".$id_sanpham."','".$code_order."','".$soluong."')";
                mysqli_query($mysqli,$insert_order_details);
        }     
            echo '<h3>Giao dịch thanh toán bằng MOMO thành công </h3>';
            echo '<p>Vui lòng vào trang <a href="index.php?quanly=lichsudonhang"> Lịch sử đơn hàng </a> để xem chi tiết đơn hàng </p>';
        }else {
            echo 'Giao dịch thất bại';
        }
    }
    else {
        if (isset($_GET['thanhtoan']) && $_GET['thanhtoan'] == 'paypal') {
            // Tạo mã đơn hàng ngẫu nhiên
            $code_order = rand(0, 9999);
            $cart_payment = 'paypal';
            $id_khachhang = $_SESSION['id_khachhang'];
            
            // Lấy thông tin giao hàng của khách hàng
            $sql_get_vanchuyen = mysqli_query($mysqli, "SELECT * FROM tbl_shipping WHERE id_dangky='$id_khachhang' LIMIT 1");
            $row_get_vanchuyen = mysqli_fetch_array($sql_get_vanchuyen);
            $id_shipping = $row_get_vanchuyen['id_shipping'];
    
            // Lấy thời gian hiện tại
            $now = date("Y-m-d H:i:s");
    
            // Câu lệnh insert vào bảng tbl_cart
            $insert_cart = "INSERT INTO tbl_cart(id_khachhang, code_cart, cart_status, cart_date, cart_payment, cart_shipping) 
                            VALUES ('" . $id_khachhang . "', '" . $code_order . "', 1, '" . $now . "', '" . $cart_payment . "', '" . $id_shipping . "')";
    
            // Thực thi câu lệnh
            $cart_query = mysqli_query($mysqli, $insert_cart);
    
            // Thêm chi tiết đơn hàng vào bảng tbl_cart_details
            foreach ($_SESSION['cart'] as $key => $value) {
                $id_sanpham = $value['id'];
                $soluong = $value['soluong'];
                $insert_order_details = "INSERT INTO tbl_cart_details(id_sanpham, code_cart, soluongmua) 
                                         VALUES ('" . $id_sanpham . "', '" . $code_order . "', '" . $soluong . "')";
                mysqli_query($mysqli, $insert_order_details);
            }
    
            // Kiểm tra xem câu lệnh có thực thi thành công không
            if ($cart_query) {
                echo '<h3>Giao dịch thanh toán bằng Paypal thành công </h3>';
                echo '<p>Vui lòng vào trang <a href="index.php?quanly=lichsudonhang"> Lịch sử đơn hàng </a> để xem chi tiết đơn hàng </p>';
            } else {
                echo 'Giao dịch thất bại';
            }
        }
    }
    
?>
<p>Cảm ơn bạn đã đặt hàng</p>