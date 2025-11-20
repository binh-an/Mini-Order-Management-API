export default function InvoiceModal({ cart, handleAccept, handleCancel}){
    return(
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
    )
}