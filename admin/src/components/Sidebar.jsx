import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => (
  <div
    style={{
      width: "220px",
      height: "100vh",
      position: "fixed",
      top: 0,
      left: 0,
      background: "#343a40",
      color: "white",
      padding: "20px",
      overflowY: "auto",
      boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
      zIndex: 1000,
    }}
  >
    <ul style={{ listStyle: "none", padding: 0, marginTop: 30 }}>
      <li style={{ marginBottom: 12 }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          🏠 Dashboard
        </Link>
      </li>
      <li style={{ marginBottom: 12 }}>
        <Link to="/products" style={{ color: "white", textDecoration: "none" }}>
          📦 Quản lý sản phẩm
        </Link>
      </li>
      <li style={{ marginBottom: 12 }}>
        <Link
          to="/products/add"
          style={{ color: "white", textDecoration: "none" }}
        >
          ➕ Thêm sản phẩm
        </Link>
      </li>
      <li style={{ marginBottom: 12 }}>
        <Link
          to="/categories"
          style={{ color: "white", textDecoration: "none" }}
        >
          📁 Quản lý danh mục
        </Link>
      </li>
      <li style={{ marginBottom: 12 }}>
        <Link
          to="/categories/add"
          style={{ color: "white", textDecoration: "none" }}
        >
          ➕ Thêm danh mục
        </Link>
      </li>
      <li style={{ marginBottom: 12 }}>
        <Link to="/orders" style={{ color: "white", textDecoration: "none" }}>
          📋 Quản lý đơn hàng
        </Link>
      </li>
      <li style={{ marginBottom: 12 }}>
        <Link to="/users" style={{ color: "white", textDecoration: "none" }}>
          👤 Quản lý người dùng
        </Link>
      </li>
    </ul>
  </div>
);

export default Sidebar;
