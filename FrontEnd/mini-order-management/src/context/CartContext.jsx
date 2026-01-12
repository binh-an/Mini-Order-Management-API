// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

// Tạo context
const CartContext = createContext();

// Provider
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Lưu cart vào localStorage mỗi khi cart thay đổi
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Thêm sản phẩm vào cart
  const addToCart = (product) => {
    setCart((prev) => {
      const index = prev.findIndex((p) => p.id === product.id);
      if (index !== -1) {
        return prev.map((p, i) =>
          i === index ? { ...p, qty: p.qty + 1 } : p
        );
      } else {
        return [...prev, { ...product, qty: 1, selected: true }];
      }
    });
  };

  // Xóa sản phẩm khỏi cart
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  // Cập nhật thông tin sản phẩm trong cart
  const updateCartItem = (id, updates) => {
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  return (
    <CartContext.Provider
      value={{ cart, setCart, addToCart, removeFromCart, updateCartItem }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
