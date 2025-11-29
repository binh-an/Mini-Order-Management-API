// src/pages/OrderList.jsx
import { useState, useEffect } from "react";
import BasicHeader from "../components/header/basicHeader";
import { getOrders, deleteOrder, updateOrderStatus } from "../api/OrderApi";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [showEditStatus, setShowEditStatus] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const role = localStorage.getItem("role");

  // Fetch orders
  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      let response;

      response = await getOrders(config);

      console.log("Fetch response:", response);
      setOrders(response || []);
    } catch (err) {
      console.error("Fetch orders failed:", err.response?.data || err);
      alert("Không thể tải danh sách đơn hàng.");
    }
  };
  fetchOrders();
}, []);


  // Delete order (admin only)
  const handleDeleteOrder = async (orderId) => {
    if (role !== "Admin") return alert("Bạn không có quyền xóa đơn hàng!");
    if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;

    try {
      await deleteOrder(orderId);
      setOrders(orders.filter(o => o.id !== orderId));
    } catch (err) {
      console.error("Delete order failed:", err.response?.data || err);
      alert("Xóa đơn hàng thất bại!");
    }
  };

  // Open edit status popup (admin only)
  const openEditStatusPopup = (order) => {
    if (role !== "Admin") return alert("Bạn không có quyền chỉnh sửa!");
    setCurrentOrder(order);
    setNewStatus(order.status);
    setShowEditStatus(true);
  };

  const closeEditStatusPopup = () => setShowEditStatus(false);

  // PATCH status only
  const handleUpdateStatus = async (e) => {
  e.preventDefault();
  if (!currentOrder) return;

  try {
    await updateOrderStatus(currentOrder.id, { status: newStatus });
    // await axiosClient.patch(
    //   `/orders/${currentOrder.id}/status`,
    //   { status: newStatus },
    //   { headers: { "Content-Type": "application/json" } } // bắt buộc
    // );

    setOrders(orders.map(o => o.id === currentOrder.id ? { ...o, status: newStatus } : o));
    closeEditStatusPopup();
  } catch (err) {
    console.error("Update status failed:", err.response?.data || err);
    alert("Cập nhật trạng thái thất bại!");
  }
};


  return (
    <div className="create-product-page">
      <BasicHeader />

      <main className="product-main">
        <h2>Order List</h2>

        <div className="table-wrapper">
          <table className="customer-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Total</th>
                <th>Created Date</th>
                {role === "Admin" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.customerId}</td>
                  <td>{order.items?.map(i => i.productName).join(", ")}</td>
                  <td>{order.items?.reduce((sum, i) => sum + i.quantity, 0)}</td>
                  <td>{order.status}</td>
                  <td>${order.totalAmount}</td>
                  <td>{new Date(order.createdDate).toLocaleString()}</td>
                  {role === "Admin" && (
                    <td>
                      <button 
                        className="update-btn" 
                        onClick={() => openEditStatusPopup(order)}
                      >
                        Edit Status
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Status Modal */}
        {showEditStatus && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edit Status for Order #{currentOrder.id}</h3>
              <form onSubmit={handleUpdateStatus}>
                <label>
                  Status:
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </label>

                <div className="modal-buttons">
                  <button type="submit">Save</button>
                  <button type="button" onClick={closeEditStatusPopup}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
