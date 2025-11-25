// src/pages/Customer.jsx
import { useState, useEffect } from "react";
import axiosClient from "../services/axiosClient";
import AddCustomerPopup from "../components/customer/AddCustomerPopup";
import UpdateCustomerPopup from "../components/customer/UpdateCustomerPopup";
import CustomerHeader from "../components/header/customerHeader";
import "../pages/css/create-product.css"; // vẫn dùng CSS chung

export default function Customer() {
  const [customers, setCustomers] = useState([]);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showUpdateCustomer, setShowUpdateCustomer] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  const [formCustomer, setFormCustomer] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  // Fetch all customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await axiosClient.get("/customers");
        setCustomers(data);
      } catch (err) {
        console.error("Fetch customers failed:", err.response?.data || err);
      }
    };
    fetchCustomers();
  }, []);

  // Add Customer
  const openAddCustomerPopup = () => {
    setFormCustomer({ name: "", email: "", phoneNumber: "", address: "" });
    setShowAddCustomer(true);
  };
  const closeAddCustomerPopup = () => setShowAddCustomer(false);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const newCustomer = await axiosClient.post("/customers", formCustomer);
      setCustomers([newCustomer, ...customers]);
      closeAddCustomerPopup();
    } catch (err) {
      console.error("Add customer error:", err.response?.data || err);
      alert("Không thể tạo khách hàng! Kiểm tra quyền hoặc token.");
    }
  };

  // Update Customer 
  const openUpdateCustomerPopup = (customer) => { setCurrentCustomer(customer);
    setFormCustomer({ id: customer.id, name: customer.name, email: customer.email, phoneNumber: customer.phoneNumber, address: customer.address, }); 
    setShowUpdateCustomer(true);
  };
  const closeUpdateCustomerPopup = () => setShowUpdateCustomer(false); 
  const handleUpdateCustomer = async (e) => { e.preventDefault(); 
    try 
    { 
        axiosClient.put(`/customers/${currentCustomer.id}`, formCustomer)
 
    //Update local state trực tiếp, tránh crash nếu data undefined 
  setCustomers(customers.map(c => c.id === currentCustomer.id ? { ...c, ...formCustomer } : c )); 
  closeUpdateCustomerPopup(); 
} 
catch (err) 
{ console.error("Update customer failed:", err.response?.data || err);
     alert("Cập nhật khách hàng thất bại!");
     } 
    };

  // Delete Customer
  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm("Bạn có chắc muốn xóa khách hàng này?")) return;
    try {
      await axiosClient.delete(`/customers/${customerId}`);
      setCustomers(customers.filter(c => c.id !== customerId));
    } catch (err) {
      console.error("Delete customer failed:", err.response?.data || err);
      alert("Xóa khách hàng thất bại!");
    }
  };

  return (
    <div className="create-product-page">
      <CustomerHeader openAddCustomerPopup={openAddCustomerPopup} />

      <main className="product-main">
        <h2>Customer Management</h2>

        {showAddCustomer && (
          <AddCustomerPopup
            formCustomer={formCustomer}
            setFormCustomer={setFormCustomer}
            handleAddCustomer={handleAddCustomer}
            closeAddCustomerPopup={closeAddCustomerPopup}
          />
        )}

        {showUpdateCustomer && (
          <UpdateCustomerPopup
            formCustomer={formCustomer}
            setFormCustomer={setFormCustomer}
            handleUpdateCustomer={handleUpdateCustomer}
            closeUpdateCustomerPopup={closeUpdateCustomerPopup}
          />
        )}

        <div className="table-wrapper">
            <table className="customer-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {customers.map(c => (
                    <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.phoneNumber}</td>
                    <td>{c.address}</td>
                    <td>
                        <div className="customer-actions">
                            <button className="update-btn" onClick={() => openUpdateCustomerPopup(c)}>Update</button>
                            <button className="delete-btn" onClick={() => handleDeleteCustomer(c.id)}>Delete</button>
                        </div>
                        </td>  
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
      </main>
    </div>
  );
}
