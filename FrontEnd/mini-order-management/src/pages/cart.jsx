import { useState } from "react";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { GrLanguage } from "react-icons/gr";
import { RxAvatar } from "react-icons/rx";
import "./css/create-product.css";
import { NavLink } from "react-router-dom";
import { IoCartOutline } from "react-icons/io5";

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
      <header className="app-header">
        <div className="logo">Car Showroom</div>
        <div className="header-icons">
          <NavLink
              to="/cart"
              className={({ isActive }) => "icon link" + (isActive ? " active" : "")}
          >
              <IoCartOutline/>
          </NavLink>

          <NavLink
              to="/order"
              className={({ isActive }) => "icon link" + (isActive ? " active" : "")}
          >
              Order
          </NavLink>

          <NavLink
              to="/create-product"
              className={({ isActive }) => "icon link" + (isActive ? " active" : "")}
          >
              Create
          </NavLink>
          <span className="icon"><IoIosHelpCircleOutline /></span>
          <span className="icon"><GrLanguage /></span>
          <span className="icon"><RxAvatar /></span>
        </div>
      </header>

      <main className="product-main">

        <div className="product-list">
          {cart.map(p => (
            <div key={p.id} className="cart-card-vertical">

              <input
                type="checkbox"
                className="cart-checkbox-vertical"
                checked={p.selected}
                onChange={() => toggleSelect(p.id)}
              />

              <img
                src={p.image}
                alt={p.name}
                className="cart-image-vertical"
              />

              <h3 className="cart-name">{p.name}</h3>
              <p className="cart-text">Price: ${p.price}</p>
              <p className="cart-text">Stock: {p.stock}</p>

              <div className="cart-qty-vertical">
                <button onClick={() => decreaseQty(p.id)}>-</button>
                <span>{p.qty}</span>
                <button onClick={() => increaseQty(p.id)}>+</button>
              </div>

            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="cart-footer">
          <div className="cart-total">Total: ${totalPrice}</div>
          <button className="cart-order-btn" onClick={handleOrderClick}>Order</button>
        </div>

        {showInvoice && (
        <div className="modal">
            <div className="modal-content invoice-modal">

                <table className="invoice-table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cart.filter(p => p.selected).map(p => (
                        <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>${p.price}</td>
                        <td>{p.qty}</td>
                        <td>${p.price * p.qty}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="invoice-footer">
                    <div className="invoice-total">
                    Total: ${cart.filter(p => p.selected).reduce((t, p) => t + p.price * p.qty, 0)}
                    </div>
                    <div className="invoice-buttons">
                    <button onClick={handleAccept} className="accept-btn">Accept</button>
                    <button onClick={handleCancel} className="cancel-btn">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
        )}
  
      </main>
    </div>
  );
}
