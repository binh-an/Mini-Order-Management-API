// src/components/addProductPopup/AddProductPopup.jsx
import React from "react";

export default function UpdateProductPopup({ formProduct, setFormProduct, handleUpdateProduct, closeUpdatePopup, handleImageChange }) {
  return (
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
  );
}
