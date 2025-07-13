import React, { useEffect, useState, useContext } from "react";
import { Table, message, Button } from "antd";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";
import styled from "styled-components";

const PageWrapper = styled.div`
  padding: 50px;

  @media (max-width: 768px) {
    padding: 20px;
  }

  h2 {
    font-size: 24px;
    margin-bottom: 24px;

    @media (max-width: 768px) {
      font-size: 18px;
      text-align: center;
    }
  }
`;

const OrdersPage = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);

  const getOrderList = () => {
    axios
      .get(
        `http://localhost/WebsiteTraSua/frontend_trasua/src/api/order_get.php?user_id=${user.id}`
      )
      .then((res) => {
        if (Array.isArray(res.data)) {
          setOrders(res.data);
        } else {
          console.error("❌ Dữ liệu không hợp lệ:", res.data);
          message.error("Không thể tải đơn hàng (dữ liệu lỗi)");
        }
      })
      .catch(() => {
        message.error("Lỗi khi tải đơn hàng.");
      });
  };

  useEffect(() => {
    if (user) {
      getOrderList();
    }
  }, [user]);

  const statusDisplay = (status) => {
    const map = {
      cho_xac_nhan: { text: "⏳ Chờ xác nhận", color: "#faad14" },
      da_xac_nhan: { text: "✅ Đã xác nhận", color: "#1890ff" },
      dang_giao: { text: "🚚 Đang giao", color: "#722ed1" },
      da_giao: { text: "📦 Đã giao", color: "#52c41a" },
      da_huy: { text: "❌ Đã huỷ", color: "#f5222d" },
      0: { text: "⏳ Chờ xác nhận", color: "#faad14" },
      1: { text: "✅ Đã xác nhận", color: "#1890ff" },
      2: { text: "🚚 Đang giao", color: "#722ed1" },
      3: { text: "📦 Đã giao", color: "#52c41a" },
      4: { text: "❌ Đã huỷ", color: "#f5222d" },
    };

    const obj = map[status] || { text: "Không rõ", color: "#999" };
    return <span style={{ color: obj.color }}>{obj.text}</span>;
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm("Bạn có chắc muốn huỷ đơn hàng này không?")) {
      axios
        .post(
          "http://localhost/WebsiteTraSua/frontend_trasua/src/api/order_cancel.php",
          {
            order_id: orderId,
          }
        )
        .then((res) => {
          if (res.data.success) {
            message.success("Đã huỷ đơn hàng.");
            getOrderList();
          } else {
            message.error(res.data.message || "Không thể huỷ đơn hàng.");
          }
        })
        .catch(() => {
          message.error("Lỗi huỷ đơn hàng.");
        });
    }
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "order_id",
      key: "order_id",
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_payment",
      key: "total_payment",
      render: (value) =>
        isNaN(Number(value))
          ? "Không rõ"
          : Number(value).toLocaleString() + "₫",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => statusDisplay(status),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) =>
        record.status === "cho_xac_nhan" || record.status === 0 ? (
          <Button
            danger
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleCancelOrder(record.order_id);
            }}
          >
            Huỷ đơn
          </Button>
        ) : (
          "-"
        ),
    },
  ];

  return (
    <PageWrapper>
      <h2>📋 Đơn hàng đã mua</h2>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="order_id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }} // ✅ Cho phép scroll ngang trên màn hình nhỏ
        onRow={(record) => ({
          onClick: () => {
            window.location.href = `/order/${record.order_id}`;
          },
        })}
      />
    </PageWrapper>
  );
};

export default OrdersPage;
