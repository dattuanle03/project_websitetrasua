import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeaderComponent from "./components/Header/Header.jsx";
import HomePage from "./HomePage";
import ProductDetail from "./components/ProductDetail/ProductDetail.jsx";
import FooterComponent from "./components/Footer/Footer.jsx";
import CartPage from "./pages/CartPage.jsx";
import About from "./pages/About.jsx";
import NewsPage from "./pages/NewsPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import OrderDetailPage from "./pages/OrderDetailPage.jsx";
import VNPayReturnPage from "./pages/VNPayReturnPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProductCategoryPage from "./pages/ProductCategoryPage.jsx";

const App = () => {
  const [cartCount, setCartCount] = useState(() => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    return cart ? cart.reduce((total, item) => total + item.quantity, 0) : 0;
  });

  const [searchTerm, setSearchTerm] = useState(""); // ✅ thêm dòng này

  return (
    <Router>
      {/* ✅ Truyền onSearch cho HeaderComponent */}
      <HeaderComponent cartCount={cartCount} onSearch={setSearchTerm} />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              searchTerm={searchTerm} // ✅ truyền searchTerm vào
            />
          }
        />
        <Route
          path="/sanpham/:id"
          element={<ProductDetail setCartCount={setCartCount} />}
        />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/order/:orderId" element={<OrderDetailPage />} />
        <Route path="/category/:slug" element={<ProductCategoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/vnpay_return" element={<VNPayReturnPage />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <FooterComponent />
    </Router>
  );
};

export default App;
