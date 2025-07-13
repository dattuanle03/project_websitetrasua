import React, { useContext, useEffect, useState } from "react";
import { Input, Button, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import AddressAutoComplete from "../components/AddressAutoComplete";
import styled from "styled-components";

import {
  getCoordinates,
  calculateDistance,
  shopLocation,
} from "../utils/mapbox";

const getDiscountRate = (totalQuantity) => {
  if (totalQuantity >= 50) return 0.3;
  if (totalQuantity >= 30) return 0.15;
  if (totalQuantity >= 20) return 0.1;
  if (totalQuantity >= 10) return 0.04;
  return 0;
};
const CartContainer = styled.div`
  padding: 100px 40px;

  @media (max-width: 768px) {
    padding: 80px 16px;
  }
`;

const CartItem = styled.li`
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
  width: 100%;
`;

const ItemActions = styled.span`
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const CartPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });

  const [distance, setDistance] = useState(0);
  const [shipFee, setShipFee] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        address: user.diachi || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("checkoutItems")) || [];
    setCheckoutItems(data);
  }, []);

  const totalQuantity = checkoutItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const total = checkoutItems.reduce(
    (sum, item) => sum + item.quantity * item.giasp,
    0
  );
  const discountRate = getDiscountRate(totalQuantity);
  const discountAmount = total * discountRate;
  const finalTotal = total - discountAmount;

  useEffect(() => {
    const fetchDistance = async () => {
      if (!form.address) return;
      try {
        const coords = await getCoordinates(form.address);
        const dist = calculateDistance(
          shopLocation.lat,
          shopLocation.lng,
          coords.lat,
          coords.lng
        );
        setDistance(dist);

        let fee = 0;
        if (dist < 3) {
          fee = 0; // miễn phí ship dưới 3km
        } else if (dist <= 10) {
          fee = Math.round(dist * 3000); // tính phí ship theo km
        } else {
          fee = 0; // không giao hàng quá 10km, shipFee = 0 nhưng sẽ bị chặn ở bước sau
        }

        setShipFee(fee);
        setTotalPayment(finalTotal + fee);

        console.log(`📏 Khoảng cách: ${dist.toFixed(2)} km`);
      } catch (err) {
        console.error("❌ Lỗi khi xác định vị trí:", err);
        setDistance(0);
        setShipFee(0);
        setTotalPayment(finalTotal);
      }
    };

    fetchDistance();
  }, [form.address, finalTotal]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRemoveItem = (id, size, ice, sugar) => {
    const updated = checkoutItems.filter(
      (item) =>
        !(
          item.id_sanpham === id &&
          item.size === size &&
          item.ice === ice &&
          item.sugar === sugar
        )
    );
    setCheckoutItems(updated);
    localStorage.setItem("checkoutItems", JSON.stringify(updated));
  };

  const handleQuantityChange = (id, size, ice, sugar, newQuantity) => {
    if (newQuantity < 1) return;
    const updated = checkoutItems.map((item) =>
      item.id_sanpham === id &&
      item.size === size &&
      item.ice === ice &&
      item.sugar === sugar
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCheckoutItems(updated);
    localStorage.setItem("checkoutItems", JSON.stringify(updated));
  };

  const handleOrder = async () => {
    if (!form.name || !form.phone || !form.email || !form.address) {
      message.error("❌ Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(form.phone)) {
      message.error(
        "❌ Số điện thoại không hợp lệ! Phải có đúng 10 chữ số và bắt đầu bằng số 0."
      );
      return;
    }

    if (distance > 10) {
      Modal.info({
        title: "🚫 Ngoài phạm vi giao hàng",
        content: (
          <div style={{ fontSize: "16px", lineHeight: 1.6 }}>
            <p>
              Địa chỉ bạn nhập hiện cách cửa hàng{" "}
              <strong>{distance.toFixed(2)}km</strong> – vượt quá giới hạn giao
              hàng tối đa <strong>10km</strong>.
            </p>
            <p>
              👉 Rất tiếc, chúng tôi <strong>không thể giao</strong> đến địa chỉ
              này do vượt ngoài phạm vi hoạt động.
            </p>
            <p>Mong bạn thông cảm và hẹn gặp lại trong những lần sau nhé! 💖</p>
          </div>
        ),
        okText: "Đã hiểu",
        centered: true,
      });

      return;
    }

    Modal.confirm({
      title: "Xác nhận đặt hàng?",
      content: (
        <>
          <p>Phí giao hàng: {shipFee.toLocaleString()}₫</p>
          <p>
            Tổng thanh toán:{" "}
            <strong style={{ color: "#fa541c" }}>
              {totalPayment.toLocaleString()}₫
            </strong>
          </p>
        </>
      ),
      okText: "Đặt hàng",
      cancelText: "Huỷ",
      onOk: () => {
        localStorage.setItem("receiverInfo", JSON.stringify(form));
        localStorage.setItem("checkoutItems", JSON.stringify(checkoutItems));
        localStorage.setItem("shipFee", shipFee);
        localStorage.setItem("totalPayment", totalPayment);
        navigate("/payment");
      },
    });
  };

  return (
    <CartContainer>
      <Button
        type="link"
        onClick={() => navigate(-1)}
        className="back-button"
        style={{ position: "absolute", top: 70, left: 10, fontSize: "30px" }}
      >
        ←
      </Button>

      <h2>THÔNG TIN ĐƠN HÀNG</h2>

      {checkoutItems.length === 0 ? (
        <p>Không có sản phẩm nào được chọn.</p>
      ) : (
        <>
          <ul style={{ padding: 0, listStyle: "none" }}>
            {checkoutItems.map((item, i) => (
              <CartItem key={i}>
                <ItemImage
                  src={`http://localhost/WebsiteTraSua/uploads/products/${item.hinhanh}`}
                  alt={item.tensanpham}
                />

                <ItemInfo>
                  <strong>{item.tensanpham}</strong>
                  <div style={{ fontSize: "13px", color: "#888" }}>
                    Size: {item.size} | Đá: {item.ice} | Đường: {item.sugar}
                  </div>
                </ItemInfo>

                <ItemActions>
                  <span
                    style={{
                      minWidth: 160,
                      display: "inline-block",
                      fontWeight: "bold",
                    }}
                  >
                    {Number(item.giasp).toLocaleString()}₫ x {item.quantity} ={" "}
                    <span style={{ color: "#faad14" }}>
                      {Number(item.giasp * item.quantity).toLocaleString()}₫
                    </span>
                  </span>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Button
                      size="small"
                      onClick={() =>
                        handleQuantityChange(
                          item.id_sanpham,
                          item.size,
                          item.ice,
                          item.sugar,
                          item.quantity - 1
                        )
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      size="small"
                      onClick={() =>
                        handleQuantityChange(
                          item.id_sanpham,
                          item.size,
                          item.ice,
                          item.sugar,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    type="link"
                    danger
                    onClick={() =>
                      handleRemoveItem(
                        item.id_sanpham,
                        item.size,
                        item.ice,
                        item.sugar
                      )
                    }
                  >
                    Xoá
                  </Button>
                </ItemActions>
              </CartItem>
            ))}
          </ul>
          <div style={{ marginTop: "40px" }}>
            <h3>THÔNG TIN NGƯỜI NHẬN</h3>
            <Input
              placeholder="Họ tên người nhận"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              style={{ marginBottom: "12px" }}
            />
            <Input
              placeholder="Số điện thoại"
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
              style={{ marginBottom: "12px" }}
            />
            <Input
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              style={{ marginBottom: "12px" }}
            />
            <AddressAutoComplete
              value={form.address}
              onChange={handleInputChange}
            />
            <Input.TextArea
              placeholder="Ghi chú thêm (ví dụ: giao vào buổi sáng, không lấy ống hút...)"
              name="note"
              value={form.note}
              onChange={handleInputChange}
              rows={3}
              style={{ marginBottom: "12px" }}
            />
            <div style={{ textAlign: "right", marginTop: "20px" }}>
              {discountRate > 0 && (
                <>
                  <p style={{ color: "#8c8c8c", marginBottom: 0 }}>
                    Tổng phụ: {Number(total).toLocaleString()}₫
                  </p>
                  <p style={{ color: "#389e0d", marginBottom: 0 }}>
                    Giảm giá ({(discountRate * 100).toFixed(0)}%): -
                    {Number(discountAmount).toLocaleString()}₫
                  </p>
                </>
              )}
              {shipFee > 0 ? (
                <p style={{ color: "#8c8c8c", marginBottom: 0 }}>
                  Phí vận chuyển: {shipFee.toLocaleString()}₫
                </p>
              ) : (
                <p style={{ color: "#52c41a", marginBottom: 0 }}>
                  🚚 Miễn phí giao hàng (dưới 3km)
                </p>
              )}

              <h3 style={{ color: "#555" }}>
                Tổng cộng:{" "}
                <span style={{ color: "#2E7D32" }}>
                  {Number(totalPayment).toLocaleString()}₫
                </span>
              </h3>
            </div>
            <Button type="primary" size="large" onClick={handleOrder}>
              Đặt hàng
            </Button>
          </div>
        </>
      )}
    </CartContainer>
  );
};
<style jsx="true">{`
  @media (max-width: 768px) {
    .cart-page {
      padding: 80px 16px !important;
    }

    .cart-page h2,
    .cart-page h3 {
      font-size: 18px;
    }

    .cart-page ul li {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 12px;
    }

    .cart-page ul li img {
      width: 100px !important;
      height: 100px !important;
    }

    .cart-page ul li .item-info {
      width: 100%;
    }

    .cart-page ul li .item-actions {
      width: 100%;
      display: flex !important;
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 8px !important;
    }

    .cart-page .form input,
    .cart-page .form textarea {
      width: 100%;
    }

    .cart-page .summary {
      text-align: left !important;
    }

    .cart-page .back-button {
      top: 70px !important;
      left: 10px !important;
      font-size: 24px !important;
    }
  }
`}</style>;

export default CartPage;
