import { useState } from "react";
import { IoIosHelpCircleOutline, IoIosAdd } from "react-icons/io";
import { GrLanguage } from "react-icons/gr";
import { RxAvatar } from "react-icons/rx";
import { NavLink } from "react-router-dom";
import "./css/create-product.css";

export default function CreateProduct() {
  const [products, setProducts] = useState([
    { id: 1, name: "Car A", description: "Sedan", price: 20000, stock: 5, image: "https://via.placeholder.com/150" },
    { id: 2, name: "Car B", description: "SUV", price: 30000, stock: 3, image: "https://via.placeholder.com/150" }
  ]);

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showUpdateProduct, setShowUpdateProduct] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [currentProduct, setCurrentProduct] = useState(null);
  const [formProduct, setFormProduct] = useState({name:"", description:"", price:"", stock:"", image:null, preview:""});

  // ---- Add Product ----
  const openAddProductPopup = () => {
    setFormProduct({name:"", description:"", price:"", stock:"", image:null, preview:""});
    setShowAddProduct(true);
  };

  const closeAddProductPopup = () => setShowAddProduct(false);

  const handleAddProduct = (e) => {
    e.preventDefault();
    const id = products.length + 1;
    setProducts([{...formProduct, id}, ...products]);
    closeAddProductPopup();
  };

  // ---- Update Product ----
  const openUpdatePopup = (product) => {
    setCurrentProduct(product);
    setFormProduct({
      ...product,
      preview: product.image instanceof File ? URL.createObjectURL(product.image) : product.image
    });
    setShowUpdateProduct(true);
  };

  const closeUpdatePopup = () => setShowUpdateProduct(false);

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    setProducts(products.map(p => p.id === currentProduct.id ? {...formProduct, id: currentProduct.id} : p));
    closeUpdatePopup();
  };

  // ---- Delete Product ----
  const openDeleteConfirm = (product) => {
    setCurrentProduct(product);
    setShowDeleteConfirm(true);
  };

  const handleDeleteProduct = () => {
    setProducts(products.filter(p => p.id !== currentProduct.id));
    setShowDeleteConfirm(false);
  };

  const closeDeleteConfirm = () => setShowDeleteConfirm(false);

  // ---- Handle image upload ----
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file){
      setFormProduct({
        ...formProduct,
        image: file,
        preview: URL.createObjectURL(file)
      });
    }
  };

  return (
    <div className="create-product-page">
      <header className="app-header">
        <div className="logo">Car Showroom</div>
        <div className="header-icons">
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
          <span className="icon" onClick={openAddProductPopup}><IoIosAdd /></span>
          <span className="icon"><IoIosHelpCircleOutline /></span>
          <span className="icon"><GrLanguage /></span>
          <span className="icon"><RxAvatar /></span>
        </div>
      </header>

      <main className="product-main">
        {/* --- Add Product Popup --- */}
        {showAddProduct && (
          <div className="modal">
            <div className="modal-content">
              <h4>Add Product</h4>
              <form onSubmit={handleAddProduct}>
                <div className="image-preview" onClick={() => document.getElementById("imageInput").click()}>
                  {formProduct.preview ? <img src={formProduct.preview} alt="Preview" /> : <div className="placeholder">Click to select image</div>}
                </div>
                <input type="file" id="imageInput" accept="image/*" style={{ display: "none" }} onChange={handleImageChange}/>
                <input type="text" placeholder="Product Name" value={formProduct.name} onChange={e => setFormProduct({...formProduct, name:e.target.value})} required/>
                <textarea placeholder="Description" value={formProduct.description} onChange={e => setFormProduct({...formProduct, description:e.target.value})} required/>
                <input type="number" placeholder="Price" value={formProduct.price} onChange={e => setFormProduct({...formProduct, price:e.target.value})} required/>
                <input type="number" placeholder="Stock" value={formProduct.stock} onChange={e => setFormProduct({...formProduct, stock:e.target.value})} required/>  
                <div className="modal-buttons">
                  <button type="submit">Add</button>
                  <button type="button" onClick={closeAddProductPopup}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- Update Product Popup --- */}
        {showUpdateProduct && (
          <div className="modal">
            <div className="modal-content">
              <h4>Update Product</h4>
              <form onSubmit={handleUpdateProduct}>
                <div className="image-preview" onClick={() => document.getElementById("updateImageInput").click()}>
                  {formProduct.preview ? <img src={formProduct.preview} alt="Preview" /> : <div className="placeholder">Click to select image</div>}
                </div>
                <input type="file" id="updateImageInput" accept="image/*" style={{ display: "none" }} onChange={handleImageChange}/>
                <input type="text" placeholder="Product Name" value={formProduct.name} onChange={e => setFormProduct({...formProduct, name:e.target.value})} required/>
                <textarea placeholder="Description" value={formProduct.description} onChange={e => setFormProduct({...formProduct, description:e.target.value})} required/>
                <input type="number" placeholder="Price" value={formProduct.price} onChange={e => setFormProduct({...formProduct, price:e.target.value})} required/>
                <input type="number" placeholder="Stock" value={formProduct.stock} onChange={e => setFormProduct({...formProduct, stock:e.target.value})} required/>  
                <div className="modal-buttons">
                  <button type="submit">Update</button>
                  <button type="button" onClick={closeUpdatePopup}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- Delete Confirmation Popup --- */}
        {showDeleteConfirm && (
          <div className="modal">
            <div className="modal-content" style={{width:"250px", textAlign:"center"}}>
              <p>Delete this product?</p>
              <div className="modal-buttons" style={{justifyContent:"center", gap:"10px"}}>
                <button style={{backgroundColor:"#f44336", color:"white"}} onClick={handleDeleteProduct}>Confirm</button>
                <button style={{backgroundColor:"lightgray"}} onClick={closeDeleteConfirm}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* --- Product List --- */}
        <div className="product-list">
            {products.map(p => (
                <div key={p.id} className="product-card">
                    <div className="card-top">
                        <img src={p.preview || (p.image instanceof File ? URL.createObjectURL(p.image) : p.image) || "https://via.placeholder.com/150"} alt={p.name} />
                        <div className="description">{p.description}</div>
                    </div>
                    <div className="card-bottom">
                        <div className="left-side">
                            <p>ID: {p.id}</p>
                            <button className="update-btn" onClick={() => openUpdatePopup(p)}>Update</button>
                            <button className="delete-btn" onClick={() => openDeleteConfirm(p)}>Delete</button>
                        </div>
                        <div className="right-side">
                            <h3>Name: {p.name}</h3>
                            <p>Price: ${p.price}</p>
                            <p>Stock: {p.stock}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </main>
    </div>
  );
}
