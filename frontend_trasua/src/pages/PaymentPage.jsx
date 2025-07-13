// src/pages/PaymentPage.jsx
import React from "react";
import { Button, Modal, Radio, message } from "antd";
import { CartContext } from "../contexts/CartContext";
import { useContext } from "react";

const PaymentPage = () => {
  const { cartItems, setCartItems } = useContext(CartContext);

  const [method, setMethod] = React.useState("cod");
  const handlePayment = async () => {
    const checkoutItems = JSON.parse(
      localStorage.getItem("checkoutItems") || "[]"
    );
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const receiver = JSON.parse(localStorage.getItem("receiverInfo") || "{}");
    const shipFee = parseInt(localStorage.getItem("shipFee") || "0");
    const totalPayment = parseInt(localStorage.getItem("totalPayment") || "0");

    console.log("user:", user);
    console.log("items:", checkoutItems);
    console.log("receiver:", receiver);

    if (!user.id || checkoutItems.length === 0 || !receiver.name) {
      message.error("Dữ liệu đơn hàng không hợp lệ.");
      return;
    }

    // ✅ Nếu chọn VNPAY thì gọi API tạo URL và chuyển hướng
    if (method === "vnpay") {
      const total = totalPayment;
      const generatedOrderId = new Date().getTime();

      // ✅ THÊM Ở ĐÂY
      localStorage.setItem("shipFee", shipFee.toString());
      localStorage.setItem("totalPayment", total.toString());
      localStorage.setItem("orderId", generatedOrderId.toString());
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("checkoutItems", JSON.stringify(checkoutItems));
      localStorage.setItem("receiverInfo", JSON.stringify(receiver));

      try {
        const res = await fetch(
          "http://localhost/WebsiteTraSua/frontend_trasua/src/api/create_vnpay_url.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              order_id: generatedOrderId,
              amount: total,
            }),
          }
        );

        const data = await res.json();
        if (data.vnpUrl) {
          window.location.href = data.vnpUrl; // ✅ chuyển trang
        } else {
          message.error("Không thể tạo URL thanh toán VNPAY.");
        }
      } catch (error) {
        message.error("Lỗi khi tạo yêu cầu thanh toán VNPAY.");
      }

      return;
    }

    // ✅ Nếu không phải VNPAY → Xử lý như cũ
    try {
      const res = await fetch(
        "http://localhost/WebsiteTraSua/frontend_trasua/src/api/order_create.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            payment_method: method,
            items: checkoutItems,
            receiver: receiver,
            ship_fee: shipFee, // ✅ thêm phí ship
            total_payment: totalPayment, // ✅ tổng tiền cuối cùng
          }),
        }
      );

      const raw = await res.text();
      console.log("📦 Server trả về:", raw);

      const data = JSON.parse(raw);
      if (data.success) {
        message.success("🎉 Thanh toán thành công!");

        const updatedCart = cartItems.filter(
          (item) =>
            !checkoutItems.some(
              (checkoutItem) => checkoutItem.id_sanpham === item.id_sanpham
            )
        );

        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        localStorage.removeItem("checkoutItems");
        localStorage.setItem("totalPayment", totalPayment); // ✅ thêm dòng này
        localStorage.setItem("shipFee", shipFee);
        localStorage.removeItem("receiverInfo");

        Modal.success({
          title: "🎉 Mua hàng thành công!",
          content: "Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi.",
          okButtonProps: { style: { display: "none" } },
        });

        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } else {
        message.error("Lỗi: " + data.message);
      }
    } catch (error) {
      console.error("Lỗi fetch:", error);
      message.error("Không thể kết nối server.");
    }
  };

  return (
    <div style={{ padding: "100px 40px", maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 24 }}>🔒 Thanh toán đơn hàng</h2>

      <div style={{ marginBottom: 32 }}>
        <h3>Chọn phương thức thanh toán</h3>
        <Radio.Group
          onChange={(e) => setMethod(e.target.value)}
          value={method}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginTop: 12,
          }}
        >
          <Radio value="cod">💵 Thanh toán khi nhận hàng (COD)</Radio>
          <Radio value="vnpay">💳 VNPay (ATM / Thẻ nội địa)</Radio>
        </Radio.Group>
      </div>

      <Button type="primary" size="large" block onClick={handlePayment}>
        XÁC NHẬN THANH TOÁN
      </Button>
    </div>
  );
};

export default PaymentPage;
