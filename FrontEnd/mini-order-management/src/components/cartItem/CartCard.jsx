export default function CartCard({ p, toggleSelect, decreaseQty, increaseQty}){
    return(
        <div key={p.id} className="cart-card-vertical">

            <input
            type="checkbox"
            className="cart-checkbox-vertical"
            checked={p.selected}
            onChange={() => toggleSelect(p.id)}
            />

            <img
                src={
                    p.preview ||
                    (p.image instanceof File
                    ? URL.createObjectURL(p.image)
                    : p.imageUrl) ||                  
                    "https://via.placeholder.com/150"
                }
                alt={p.name}
            className="cart-image-vertical"
            />

            <h3 className="cart-name">{p.name}</h3>
            <p className="cart-text">Price: ${p.price}</p>
            <p className="cart-text">Stock: {p.stockQuantity}</p>

            <div className="cart-qty-vertical">
            <button onClick={() => decreaseQty(p.id)}>-</button>
            <span>{p.qty}</span>
            <button onClick={() => increaseQty(p.id)}>+</button>
            </div>

        </div>
    )
}