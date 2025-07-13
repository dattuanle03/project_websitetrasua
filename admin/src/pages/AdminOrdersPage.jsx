import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, message, Button, Modal } from "antd";

// Map trạng thái để hiển thị
const statusTextMap = {
  cho_xac_nhan: "Chờ xác nhận",
  da_xac_nhan: "Đã xác nhận",
  dang_giao: "Đang giao",
  da_giao: "Đã giao thành công",
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [shipFee, setShipFee] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [receiver, setReceiver] = useState({});

  useEffect(() => {
    fetch("http://localhost/WebsiteTraSua/admin/src/api/admin_get_orders.php")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
        else message.error("Dữ liệu đơn hàng không hợp lệ");
      })
      .catch(() => message.error("Không thể tải đơn hàng"));
  }, []);

  const updateStatus = (id, status, successMsg) => {
    axios
      .post(
        "http://localhost/WebsiteTraSua/admin/src/api/order_update_status.php",
        { order_id: id, status }
      )
      .then((res) => {
        if (res.data.success) {
          message.success(successMsg);
          setOrders((prev) =>
            prev.map((o) => (o.order_id === id ? { ...o, status } : o))
          );
        } else {
          message.error(res.data.message || "Lỗi cập nhật trạng thái");
        }
      })
      .catch(() => message.error("Không thể cập nhật trạng thái đơn hàng"));
  };

  const handleViewDetail = (order_id) => {
    setSelectedOrderId(order_id);
    setModalVisible(true);

    axios
      .get(
        `http://localhost/WebsiteTraSua/admin/src/api/admin_get_order_detail.php?order_id=${order_id}`
      )
      .then((res) => {
        if (res.data.success) {
          setReceiver(res.data.receiver || {});

          setOrderItems(res.data.items);
          setShipFee(res.data.ship_fee);
          setTotalPayment(res.data.total_payment);
        } else {
          message.error("Không thể lấy chi tiết đơn hàng");
        }
      })

      .catch(() => {
        message.error("Lỗi khi gọi API chi tiết đơn hàng");
      });
  };

  const columns = [
    { title: "Mã đơn", dataIndex: "order_id", key: "order_id" },
    { title: "Khách hàng", dataIndex: "id_khachhang", key: "id_khachhang" },
    { title: "Ngày đặt", dataIndex: "date", key: "date" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => statusTextMap[status] || "Chưa xác nhận",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => {
        switch (record.status) {
          case "cho_xac_nhan":
            return (
              <Button
                type="primary"
                onClick={() =>
                  updateStatus(
                    record.order_id,
                    "da_xac_nhan",
                    "Đã xác nhận đơn hàng"
                  )
                }
              >
                Xác nhận
              </Button>
            );
          case "da_xac_nhan":
            return (
              <Button
                type="dashed"
                onClick={() =>
                  updateStatus(
                    record.order_id,
                    "dang_giao",
                    "Đã chuyển sang 'Đang giao'"
                  )
                }
              >
                Bắt đầu giao hàng
              </Button>
            );
          case "dang_giao":
            return (
              <Button
                type="link"
                onClick={() =>
                  updateStatus(
                    record.order_id,
                    "da_giao",
                    "Đã giao hàng thành công"
                  )
                }
              >
                Đã giao xong
              </Button>
            );
          default:
            return "-";
        }
      },
    },
    {
      title: "Chi tiết",
      key: "detail",
      render: (_, record) => (
        <Button
          type="default"
          onClick={() => handleViewDetail(record.order_id)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 50 }}>
      <h2>🛠️ Quản lý đơn hàng</h2>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="order_id"
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        title={`Chi tiết đơn hàng #${selectedOrderId}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {orderItems.length === 0 ? (
          <p>Không có sản phẩm.</p>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <p>
                👤 <b>Người nhận:</b> {receiver.tennguoinhan}
              </p>
              <p>
                📞 <b>Điện thoại:</b> {receiver.sodienthoai}
              </p>
              <p>
                📍 <b>Địa chỉ:</b> {receiver.diachi_nhan}
              </p>
              {receiver.ghichu && (
                <p>
                  📝 <b>Ghi chú:</b> {receiver.ghichu}
                </p>
              )}
            </div>

            <ul>
              {orderItems.map((item, index) => (
                <li key={index}>
                  🧋 <b>{item.tensanpham}</b>
                  <br />
                  🔸 Size: {item.size || "Mặc định"} | Đá: {item.ice || "100%"}{" "}
                  | Đường: {item.sugar || "100%"}
                  <br />
                  SL: {item.soluong} x {item.gia.toLocaleString()}₫ ={" "}
                  <b>
                    {(
                      item.thanhtien ?? item.gia * item.soluong
                    ).toLocaleString()}
                    ₫
                  </b>
                </li>
              ))}
            </ul>

            <p>🚚 Phí vận chuyển: {shipFee.toLocaleString()}₫</p>
            <p style={{ marginTop: 10, fontWeight: "bold" }}>
              🧾 Tổng thanh toán:&nbsp;
              <span style={{ color: "#d4380d" }}>
                {totalPayment.toLocaleString()}₫
              </span>
            </p>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrdersPage;
