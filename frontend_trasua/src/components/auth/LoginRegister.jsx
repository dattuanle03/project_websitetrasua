import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import GoogleLoginWrapper from "./GoogleLoginWrapper"; // hoặc ../ nếu nằm khác thư mục

const LoginRegister = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !isLogin &&
      (!form.name.trim() || !form.email.trim() || !form.password.trim())
    ) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const url = isLogin
      ? "http://localhost/WebsiteTraSua/frontend_trasua/src/api/login.php"
      : "http://localhost/WebsiteTraSua/frontend_trasua/src/api/register.php";

    try {
      const response = await axios.post(url, form);
      const data = response.data;
      if (data.success) {
        onLoginSuccess(data.user);
      } else {
        setError(data.message || "Lỗi không xác định");
      }
    } catch (err) {
      console.error("LỖI:", err);
      setError("Không thể kết nối server.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const email = decoded.email;
    const name = decoded.name;

    try {
      const res = await axios.post(
        "http://localhost/WebsiteTraSua/frontend_trasua/src/api/google_login.php",
        { email, name }
      );

      const userInfo = res.data.user;
      if (userInfo && userInfo.id) {
        localStorage.setItem("user", JSON.stringify(userInfo));
        onLoginSuccess(userInfo);
      } else {
        throw new Error("Không lấy được ID người dùng.");
      }
    } catch (error) {
      console.error("Đăng nhập Google thất bại:", error);
      setError("Không thể xác thực Google.");
    }
  };

  return (
    <div className="auth-form">
      <h2>{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Họ tên"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">{isLogin ? "Đăng nhập" : "Đăng ký"}</button>
      </form>

      {/* ✅ GoogleLogin luôn được giữ lại trong DOM */}
      <div style={{ marginTop: "16px" }}>
        {/* Google login luôn tồn tại, không bị condition hoặc xoá */}
        <GoogleLoginWrapper
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Đăng nhập Google thất bại")}
        />
      </div>

      <p style={{ marginTop: "12px" }}>
        {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
        <span
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
            setForm((prev) => ({
              ...prev,
              name: "",
            }));
          }}
          style={{ color: "blue", cursor: "pointer" }}
        >
          {isLogin ? "Đăng ký" : "Đăng nhập"}
        </span>
      </p>
    </div>
  );
};

export default LoginRegister;
