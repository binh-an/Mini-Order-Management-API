export default function ProductCard({ p, openUpdatePopup, openDeleteConfirm }) {
  return (
    <div key={p.id} className="product-card">
      <div className="card-top">
        <img
          src={
            p.preview ||
            (p.image instanceof File
              ? URL.createObjectURL(p.image)
              : p.imageUrl) ||                  
            "https://via.placeholder.com/150"
          }
          alt={p.name}
        />
        <div className="description">{p.description}</div>
      </div>

      <div className="card-bottom">
        <div className="left-side">
          <p>ID: {p.id}</p>
          <button className="update-btn" onClick={() => openUpdatePopup(p)}>
            Update
          </button>
          <button className="delete-btn" onClick={() => openDeleteConfirm(p)}>
            Delete
          </button>
        </div>

        <div className="right-side">
          <h3>{p.name}</h3>
          <p>Price: ${p.price}</p>
          <p>Stock: {p.stockQuantity}</p>
        </div>
      </div>
    </div>
  );
}
