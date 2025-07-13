// Header.jsx
import React from "react";

const Header = ({ userName, onLogout }) => {
  return (
    <header
      style={{
        background: "#fff",
        padding: "10px 20px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 4px rgb(0 0 0 / 0.05)",
      }}
    >
      <h3 style={{ margin: 0, color: "#333" }}>Trang quản trị</h3>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          color: "#555",
          fontWeight: "500",
        }}
      >
        <span>
          Xin chào, <strong>{userName || "Admin"}</strong>
        </span>
        <button
          aria-label="Đăng xuất"
          onClick={onLogout}
          style={{
            padding: "6px 14px",
            backgroundColor: "#dc3545",
            border: "none",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer",
            fontWeight: "600",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#bb2d3b")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#dc3545")
          }
          type="button"
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
};

export default Header;
