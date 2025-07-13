// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ProductListPage from "./pages/ProductListPage/ProductListPage.jsx";
import ProductAddPage from "./pages/ProductAddPage/ProductAddPage.jsx";
import ProductEditPage from "./pages/ProductEditPage/ProductEditPage.jsx";
import NotFound from "./pages/NotFound";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import CategoryListPage from "./pages/CategoryListPage/CategoryListPage.jsx";
import CategoryAddPage from "./pages/CategoryAddPage/CategoryAddPage.jsx";
import CategoryEditPage from "./pages/CategoryEditPage/CategoryEditPage.jsx";
import AdminUsersPage from "./pages/AdminUsersPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminLayout from "./components/AdminLayout";

const AppLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // ⛔ Nếu chưa đăng nhập hoặc không phải admin
  if (!user || user.role !== "admin") {
    return isLoginPage ? (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    ) : (
      <Navigate to="/login" replace />
    );
  }

  // ⛔ Nếu đã login admin mà vào /login → redirect về /
  if (user.role === "admin" && isLoginPage) {
    return <Navigate to="/" replace />;
  }

  // ✅ Admin đã đăng nhập
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/add" element={<ProductAddPage />} />
        <Route path="/products/edit/:id" element={<ProductEditPage />} />
        <Route path="/categories" element={<CategoryListPage />} />
        <Route path="/categories/add" element={<CategoryAddPage />} />
        <Route path="/categories/edit/:id" element={<CategoryEditPage />} />
        <Route path="/orders" element={<AdminOrdersPage />} />
        <Route path="/users" element={<AdminUsersPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AdminLayout>
  );
};

const App = () => (
  <Router>
    <AppLayout />
  </Router>
);

export default App;
