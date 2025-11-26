// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // load cart từ localStorage khi mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // lưu cart vào localStorage mỗi khi cart thay đổi
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const index = prev.findIndex((p) => p.id === product.id);
      if (index !== -1) {
        const newCart = prev.map((p, i) =>
          i === index ? { ...p, qty: p.qty + 1 } : p
        );
        return newCart;
      } else {
        return [...prev, { ...product, qty: 1, selected: true }];
      }
    });
  };


  const removeFromCart = (id) => {
    setCart(cart.filter((p) => p.id !== id));
  };

  const updateCartItem = (id, updates) => {
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, updateCartItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
