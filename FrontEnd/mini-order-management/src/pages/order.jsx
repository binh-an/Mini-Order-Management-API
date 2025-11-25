import { useState } from "react";
import "./css/create-product.css";
import { IoCartOutline } from "react-icons/io5";
import BasicHeader from "../components/header/basicHeader";
import { useEffect } from "react";
import axiosClient from "../services/axiosClient";

export default function Order() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axiosClient.get("/products")
      .then(res => {
        console.log("API /products trả về: ", res.data);
        setProducts(res.data);
      })
      .catch(err => console.error(err));
  }, []);


  const handleAddToCart = (product) => {
    console.log("Added to cart:", product);
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
                  <p>Stock: {p.stock}</p>
                </div>

              </div>

            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
