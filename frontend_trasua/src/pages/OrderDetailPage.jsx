import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, List, Typography, Spin, message, Button } from "antd";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 60px;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const ProductItem = styled(List.Item)`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;

    @media (max-width: 768px) {
      width: 100px;
      height: 100px;
    }
  }

  div {
    line-height: 1.4;
  }
`;

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(
      `http://localhost/WebsiteTraSua/frontend_trasua/src/api/order_detail.php?order_id=${orderId}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          message.error(data.error);
        } else {
          setOrder(data);
        }
      })
      .catch(() => message.error("Lỗi khi tải chi tiết đơn hàng"));
  }, [orderId]);

  if (!order)
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin tip="Đang tải chi tiết đơn hàng..." />
      </div>
    );

  return (
    <Wrapper>
      <Button
        type="link"
        onClick={() => navigate(-1)}
        style={{ position: "absolute", top: 81, left: 10, fontSize: "30px" }}
      >
        ←
      </Button>

      <Typography.Title
        level={2}
        style={{ fontSize: "24px", paddingTop: "80px" }}
      >
        🧾 Chi tiết đơn hàng {order.order_id}
      </Typography.Title>

      <p>
        <strong>Ngày đặt:</strong> {order.date}
      </p>
      <p>
        <strong>Phương thức thanh toán:</strong> {order.payment_method}
      </p>
      <p>
        <strong>Địa chỉ:</strong> {order.address}
      </p>
      {order.note && (
        <p>
          <strong>Ghi chú:</strong> {order.note}
        </p>
      )}

      <Card title="Danh sách sản phẩm" style={{ marginTop: 24 }}>
        <List
          dataSource={order.products}
          renderItem={(item) => (
            <ProductItem>
              <img
                src={`http://localhost/WebsiteTraSua/uploads/products/${item.hinhanh}`}
                alt={item.tensanpham}
              />
              <div>
                <strong>{item.tensanpham}</strong>
                <p style={{ margin: 0 }}>
                  SL: {item.quantity} × {Number(item.price).toLocaleString()}₫ ={" "}
                  <span style={{ color: "#fa541c", fontWeight: "bold" }}>
                    {Number(item.subtotal).toLocaleString()}₫
                  </span>
                </p>
              </div>
            </ProductItem>
          )}
        />
        <div style={{ textAlign: "right", marginTop: 16 }}>
          <p>
            Tổng tiền sản phẩm:{" "}
            {Number(order.tongtien_sanpham).toLocaleString()}₫
          </p>
          <p>Phí vận chuyển: {Number(order.ship_fee).toLocaleString()}₫</p>
          <p style={{ fontWeight: "bold", color: "#d4380d", fontSize: 18 }}>
            Tổng thanh toán: {Number(order.total_payment).toLocaleString()}₫
          </p>
        </div>
      </Card>
    </Wrapper>
  );
};

export default OrderDetailPage;
