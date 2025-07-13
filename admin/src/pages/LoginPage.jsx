import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, message, Card } from "antd";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    axios
      .post("http://localhost/WebsiteTraSua/admin/src/api/login.php", values)
      .then((res) => {
        if (res.data.success) {
          // ✅ Lưu thông tin người dùng vào localStorage
          localStorage.setItem("user", JSON.stringify(res.data.user));

          message.success("Đăng nhập thành công!");
          navigate("/"); // Chuyển vào dashboard
        } else {
          message.error(res.data.message || "Đăng nhập thất bại");
        }
      })
      .catch(() => {
        message.error("Lỗi kết nối đến server");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f2f5",
      }}
    >
      <Card title="🔐 Đăng nhập Admin" style={{ width: 400 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="matkhau"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ marginTop: 10 }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
