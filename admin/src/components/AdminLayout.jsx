import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AdminLayout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userName = user?.tenkhachhang || "Admin"; // Hoặc res.data.user.name tuỳ API

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: "250px" }}>
        <Header userName={userName} onLogout={handleLogout} />
        <main
          style={{
            padding: "24px",
            background: "#f8f9fa",
            minHeight: "100vh",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
