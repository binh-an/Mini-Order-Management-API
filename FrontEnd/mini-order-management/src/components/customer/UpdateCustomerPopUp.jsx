// src/components/customer/UpdateCustomerPopup.jsx
export default function UpdateCustomerPopup({ formCustomer, setFormCustomer, handleUpdateCustomer, closeUpdateCustomerPopup }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h4>Update Customer</h4>
        <form onSubmit={handleUpdateCustomer}>
          <input
            type="text"
            placeholder="Name"
            value={formCustomer.name}
            onChange={e => setFormCustomer({ ...formCustomer, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formCustomer.email}
            onChange={e => setFormCustomer({ ...formCustomer, email: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={formCustomer.phoneNumber}
            onChange={e => setFormCustomer({ ...formCustomer, phoneNumber: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={formCustomer.address}
            onChange={e => setFormCustomer({ ...formCustomer, address: e.target.value })}
            required
          />

          <div className="modal-buttons">
            <button type="submit">Update</button>
            <button type="button" onClick={closeUpdateCustomerPopup}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
