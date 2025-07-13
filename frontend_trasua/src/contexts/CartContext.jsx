// src/contexts/CartContext.js
import { createContext, useState, useEffect } from "react";
import { Modal, Button, Radio } from "antd";
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load giỏ hàng từ localStorage khi mở web
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Lưu giỏ hàng vào localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Tổng số lượng sản phẩm
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  // Hàm addToCart chỉ cần truyền product
  const addToCart = (productWithOptions) => {
    const { id_sanpham, size, ice, sugar } = productWithOptions;

    const existing = cartItems.find(
      (item) =>
        item.id_sanpham === id_sanpham &&
        item.size === size &&
        item.ice === ice &&
        item.sugar === sugar
    );

    if (existing) {
      const updated = cartItems.map((item) =>
        item.id_sanpham === id_sanpham &&
        item.size === size &&
        item.ice === ice &&
        item.sugar === sugar
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCartItems(updated);
    } else {
      setCartItems([...cartItems, productWithOptions]);
    }
  };

  // Xoá sản phẩm
  const removeFromCart = (id_sanpham, size, ice, sugar) => {
    const updated = cartItems.filter(
      (item) =>
        !(
          item.id_sanpham === id_sanpham &&
          item.size === size &&
          item.ice === ice &&
          item.sugar === sugar
        )
    );
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Cập nhật số lượng
  const updateQuantity = (id_sanpham, size, ice, sugar, delta) => {
    const updated = cartItems.map((item) =>
      item.id_sanpham === id_sanpham &&
      item.size === size &&
      item.ice === ice &&
      item.sugar === sugar
        ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
        : item
    );
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
