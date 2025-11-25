import { useState } from "react";
import "./css/create-product.css";
import { IoCartOutline } from "react-icons/io5";
import BasicHeader from "../components/header/basicHeader";
import { useEffect } from "react";
import axiosClient from "../services/axiosClient";
import { useCart } from "../context/CartContext";

export default function Order() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await axiosClient.get("/products");
        setProducts(data);
      } catch (err) {
        console.error("Fetch products failed:", err.response?.data || err);
      }
    };
    fetchProducts();
  }, []);


  const handleAddToCart = (product) => {
    // Use CartContext to add the product so UI updates immediately
    try {
      addToCart(product);
    } catch (e) {
      console.error('Failed to add to cart via context, falling back to localStorage', e);
      // Fallback: update localStorage directly (best-effort)
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const index = cart.findIndex(item => item.id === product.id);
      if (index !== -1) cart[index].qty += 1;
      else cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        qty: 1,
        stockQuantity: product.stockQuantity ?? product.stock ?? 0,
        selected: true,
        image: product.image
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      console.log("Cart updated (fallback):", cart);
    }
  };



  return (
    <div className="create-product-page">
      <BasicHeader/>

      <main className="product-main">

        <div className="product-list">
          {Array.isArray(products) && products.map(p => (
            <div key={p.id} className="product-card">

              <div className="card-top">
                <img src={p.image} alt={p.name} />
                <div className="description">{p.description}</div>
              </div>

              <div className="card-bottom">

                {/* LEFT SIDE — CART ICON */}
                <div className="left-side-cart" onClick={() => handleAddToCart(p)}>
                  <IoCartOutline className="cart-icon" />
                  <p>Add</p>
                </div>

                {/* RIGHT SIDE */}
                <div className="right-side">
                  <h3>Name: {p.name}</h3>
                  <p>Price: ${p.price}</p>
                  <p>Stock: {p.stockQuantity}</p>
                </div>

              </div>

            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
