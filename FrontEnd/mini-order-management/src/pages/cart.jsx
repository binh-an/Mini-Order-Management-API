import { useState } from "react";
import "./css/create-product.css";
import BasicHeader from "../components/header/basicHeader";
import CartCard from "../components/cartItem/CartCard";
import InvoiceModal from "../components/invoiceModal/InvoiceModal";

export default function Cart() {
  const [cart, setCart] = useState([
    { id: 1, name: "Car A", price: 20000, stock: 5, qty: 1, image: "https://via.placeholder.com/150", selected: true },
    { id: 2, name: "Car B", price: 30000, stock: 3, qty: 2, image: "https://via.placeholder.com/150", selected: false }
  ]);

  const toggleSelect = (id) => {
    setCart(cart.map(p =>
      p.id === id ? { ...p, selected: !p.selected } : p
    ));
  };

  const increaseQty = (id) => {
    setCart(cart.map(p =>
      p.id === id && p.qty < p.stock ? { ...p, qty: p.qty + 1 } : p
    ));
  };

  const decreaseQty = (id) => {
    setCart(cart.map(p =>
      p.id === id && p.qty > 1 ? { ...p, qty: p.qty - 1 } : p
    ));
  };

  const totalPrice = cart
    .filter(p => p.selected)
    .reduce((t, p) => t + p.price * p.qty, 0);

  const [showInvoice, setShowInvoice] = useState(false);

  const handleOrderClick = () => {
  // chỉ hiện popup nếu có ít nhất 1 sản phẩm được chọn
  if (cart.some(p => p.selected)) {
    setShowInvoice(true);
  } else {
    alert("Vui lòng chọn ít nhất 1 sản phẩm");
  }
};

  const handleAccept = () => {
  // trừ stock theo qty của những sản phẩm được chọn
  setCart(prevCart =>
    prevCart.map(p => 
      p.selected ? { ...p, stock: p.stock - p.qty, qty: 1, selected: false } : p
    )
  );

  setShowInvoice(false);
  // redirect sang trang /order
  window.location.href = "/order";
};


  const handleCancel = () => {
  setShowInvoice(false);
};
  

  return (
    <div className="create-product-page">
      <BasicHeader/>

      <main className="product-main">

        <div className="product-list">
          {cart.map(p => (
            <CartCard
              key={p.id}
              p={p}
              toggleSelect={toggleSelect}
              decreaseQty={decreaseQty}
              increaseQty={increaseQty}
            />
          ))}
        </div>

        {/* FOOTER */}
        <div className="cart-footer">
          <div className="cart-total">Total: ${totalPrice}</div>
          <button className="cart-order-btn" onClick={handleOrderClick}>Order</button>
        </div>

        {showInvoice && (
          <InvoiceModal
            cart={cart}
            handleAccept={handleAccept}
            handleCancel={handleCancel}
          />
        )}
  
      </main>
    </div>
  );
}
