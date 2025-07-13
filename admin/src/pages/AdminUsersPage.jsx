import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Tag, message } from "antd";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const toggleStatus = (id) => {
    axios
      .post(
        "http://localhost/WebsiteTraSua/admin/src/api/user_toggle_status.php",
        { id }
      )
      .then((res) => {
        if (res.data.success) {
          message.success(res.data.message);
          setUsers((prev) =>
            prev.map((user) =>
              user.id_dangky === id
                ? { ...user, trangthai: user.trangthai === "1" ? "0" : "1" }
                : user
            )
          );
        } else {
          message.error(res.data.message || "Không thể cập nhật trạng thái");
        }
      })
      .catch(() => message.error("Lỗi khi gửi yêu cầu"));
  };
  const toggleRole = (id) => {
    axios
      .post(
        "http://localhost/WebsiteTraSua/admin/src/api/user_toggle_role.php",
        { id }
      )
      .then((res) => {
        if (res.data.success) {
          message.success(res.data.message);
          setUsers((prev) =>
            prev.map((user) =>
              user.id_dangky === id
                ? { ...user, role: user.role === "admin" ? "user" : "admin" }
                : user
            )
          );
        } else {
          message.error(res.data.message || "Không thể đổi quyền");
        }
      })
      .catch(() => message.error("Lỗi khi đổi quyền"));
  };

  useEffect(() => {
    axios
      .get("http://localhost/WebsiteTraSua/admin/src/api/admin_get_users.php")
      .then((res) => {
        setUsers(res.data);
      })
      .catch(() => {
        message.error("Không thể tải danh sách người dùng");
      });
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id_dangky", key: "id" },
    { title: "Tên", dataIndex: "tenkhachhang", key: "ten" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "volcano" : "green"}>
          {role === "admin" ? "Admin" : "Người dùng"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "trangthai",
      key: "trangthai",
      render: (t) =>
        t === "1" ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Bị khóa</Tag>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <>
          <Button
            type={record.trangthai === "1" ? "default" : "primary"}
            danger={record.trangthai === "1"}
            onClick={() => toggleStatus(record.id_dangky)}
          >
            {record.trangthai === "1" ? "Khoá" : "Mở khoá"}
          </Button>
          {record.is_super_admin !== "1" && (
            <Button
              type="link"
              onClick={() => toggleRole(record.id_dangky)}
              style={{ marginLeft: 8 }}
            >
              Đổi quyền
            </Button>
          )}
        </>
      ),
    },
    {
      title: "Phân quyền",
      dataIndex: "role",
      render: (role) => (role === "admin" ? "👑 Admin" : "👤 Người dùng"),
    },
  ];

  return (
    <div style={{ padding: 50 }}>
      <h2>👤 Quản lý người dùng</h2>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id_dangky"
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default AdminUsersPage;
