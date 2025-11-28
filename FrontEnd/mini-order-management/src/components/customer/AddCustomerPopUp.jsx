// src/components/customer/AddCustomerPopup.jsx
export default function AddCustomerPopup({ formCustomer, setFormCustomer, handleAddCustomer, closeAddCustomerPopup }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h4>Add Customer</h4>
        <form onSubmit={handleAddCustomer}>
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
            <button type="submit">Add</button>
            <button type="button" onClick={closeAddCustomerPopup}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
