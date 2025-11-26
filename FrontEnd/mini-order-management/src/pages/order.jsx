import { useState, useEffect } from "react";
import { IoCartOutline } from "react-icons/io5";
import BasicHeader from "../components/header/basicHeader";
import axiosClient from "../services/axiosClient";
import { useCart } from "../context/CartContext";

export default function Order() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await axiosClient.get("/products");
        setProducts(data);
        setAllProducts(data)
      } catch (err) {
        console.error("Fetch products failed:", err.response?.data || err);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  // Hàm search theo ID
  const handleSearch = (value) => {
    if (!value.trim()) {
      setProducts(allProducts); // input trống -> show tất cả
      return;
    }
    const filtered = allProducts.filter(p =>
      p.id.toString().includes(value.trim())
    );
    setProducts(filtered);
  };

  return (
    <div className="create-product-page">
      <BasicHeader onSearch={handleSearch} />


      <main className="product-main">
        <div className="product-list">
          {Array.isArray(products) &&
            products.map((p) => (
              <div key={p.id} className="product-card">
                <div className="card-top">
                  <img src={p.imageUrl} alt={p.name} /> 
                  <div className="description">{p.description}</div>
                </div>

                <div className="card-bottom">
                  <div className="left-side-cart" onClick={() => handleAddToCart(p)}>
                    <IoCartOutline className="cart-icon" />
                    <p>Add</p>
                  </div>

                  <div className="right-side">
                    <h3>{p.name}</h3>
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
