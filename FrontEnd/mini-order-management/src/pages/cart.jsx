import { useState } from "react";
import BasicHeader from "../components/header/basicHeader";
import CartCard from "../components/cartItem/CartCard";
import InvoiceModal from "../components/invoiceModal/InvoiceModal";
import { useCart } from "../context/CartContext";
import axiosClient from "../services/axiosClient";

export default function Cart() {
  const { cart, updateCartItem, setCart } = useCart();
  const [showInvoice, setShowInvoice] = useState(false);

  const toggleSelect = (id) => {
    const item = cart.find((p) => p.id === id);
    if (item) updateCartItem(id, { selected: !item.selected });
  };

  const increaseQty = (id) => {
    const item = cart.find((p) => p.id === id);
    if (item && item.qty < item.stockQuantity) updateCartItem(id, { qty: item.qty + 1 });
  };

  const decreaseQty = (id) => {
    const item = cart.find((p) => p.id === id);
    if (item && item.qty > 1) updateCartItem(id, { qty: item.qty - 1 });
  };

  const totalPrice = cart.filter((p) => p.selected).reduce((t, p) => t + p.price * p.qty, 0);

  const handleOrderClick = () => {
    if (cart.some((p) => p.selected)) setShowInvoice(true);
    else alert("Vui lòng chọn ít nhất 1 sản phẩm");
  };

  const handleAccept = async () => {
    // Lọc ra các sản phẩm được chọn
    const selectedItems = cart.filter(p => p.selected);

    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất 1 sản phẩm");
      return;
    }

    // Tạo DTO theo BE yêu cầu
    const orderDto = {
      CustomerId: 1, // TODO: lấy từ user hiện tại
      Items: selectedItems.map(p => ({
        ProductId: p.id,
        Quantity: p.qty
      }))
    };

    try {
      const res = await axiosClient.post("/orders", orderDto);

      // Sau khi tạo order thành công
      alert("Order created successfully! Order ID: " + res.id);

      // Update lại stock trong cart context
      setCart(prev =>
        prev.map(p =>
          p.selected
            ? { ...p, stockQuantity: p.stockQuantity - p.qty, qty: 1, selected: false }
            : p
        )
      );

      setShowInvoice(false);
      window.location.href = "/order"; // hoặc chuyển trang khác
    } catch (err) {
      console.error("Create order failed:", err.response?.data || err);
      alert("Không thể tạo order!");
    }
  };

  const handleCancel = () => setShowInvoice(false);

  return (
    <div className="create-product-page">
      <BasicHeader />

      <main className="product-main">
        <div className="product-list">
          {cart.map((p) => (
            <CartCard
              key={p.id}
              p={p}
              toggleSelect={toggleSelect}
              decreaseQty={decreaseQty}
              increaseQty={increaseQty}
            />
          ))}
        </div>

        <div className="cart-footer">
          <div className="cart-total">Total: ${totalPrice}</div>
          <button className="cart-order-btn" onClick={handleOrderClick}>
            Order
          </button>
        </div>

        {showInvoice && (
          <InvoiceModal cart={cart} handleAccept={handleAccept} handleCancel={handleCancel} />
        )}
      </main>
    </div>
  );
}
