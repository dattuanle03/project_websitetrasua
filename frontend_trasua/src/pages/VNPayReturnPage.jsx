import { useEffect, useState } from "react";
import { message, Spin } from "antd";

const VNPayReturnPage = () => {
  const [status, setStatus] = useState("loading"); // loading | success | fail

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const responseCode = params.get("vnp_ResponseCode");

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const receiver = JSON.parse(localStorage.getItem("receiverInfo") || "{}");
    const items = JSON.parse(localStorage.getItem("checkoutItems") || "[]");

    if (responseCode === "00") {
      const ship_fee = parseInt(localStorage.getItem("shipFee") || "0");
      const total_payment = parseInt(
        localStorage.getItem("totalPayment") || "0"
      );

      // ✅ Gọi API tạo đơn hàng với đầy đủ dữ liệu
      fetch(
        "http://localhost/WebsiteTraSua/frontend_trasua/src/api/order_create.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            payment_method: "vnpay",
            items,
            receiver,
            ship_fee,
            total_payment,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            message.success("🎉 Thanh toán thành công!");
            localStorage.removeItem("checkoutItems");
            localStorage.removeItem("receiverInfo");
            localStorage.removeItem("cart");
            localStorage.removeItem("shipFee");
            localStorage.removeItem("totalPayment");
            setStatus("success");

            setTimeout(() => {
              window.location.href = "/";
            }, 3000);
          } else {
            setStatus("fail");
            message.error("⚠️ Không tạo được đơn hàng sau khi thanh toán.");
            setTimeout(() => {
              window.location.href = "/cart";
            }, 1500);
          }
        })
        .catch((err) => {
          console.error("Lỗi:", err);
          message.error("Lỗi server khi tạo đơn hàng.");
          setStatus("fail");
          setTimeout(() => {
            window.location.href = "/cart";
          }, 1500);
        });
    } else {
      // ❌ THANH TOÁN THẤT BẠI hoặc BỊ HUỶ
      message.error("❌ Thanh toán thất bại hoặc bị huỷ.");
      setStatus("fail");

      setTimeout(() => {
        window.location.href = "/cart"; // 👉 Trở về giỏ hàng
      }, 1500);
    }
  }, []);

  return (
    <div style={{ padding: 50, textAlign: "center" }}>
      {status === "loading" && (
        <>
          <Spin size="large" />
          <p>🔁 Đang xử lý kết quả thanh toán...</p>
        </>
      )}
      {status === "success" && (
        <>
          <h2>🎉 Thanh toán thành công!</h2>
          <p>Chúng tôi đang xử lý đơn hàng của bạn...</p>
        </>
      )}
      {status === "fail" && (
        <>
          <h2>❌ Thanh toán thất bại hoặc bị hủyy</h2>
        </>
      )}
    </div>
  );
};

export default VNPayReturnPage;
