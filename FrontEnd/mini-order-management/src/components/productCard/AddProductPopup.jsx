// src/components/addProductPopup/AddProductPopup.jsx
import React from "react";

export default function AddProductPopup({ formProduct, setFormProduct, handleAddProduct, closeAddProductPopup, handleImageChange }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h4>Add Product</h4>
        <form onSubmit={handleAddProduct}>
          <div className="image-preview" onClick={() => document.getElementById("imageInput").click()}>
            {formProduct.preview ? <img src={formProduct.preview} alt="Preview" /> : <div className="placeholder">Click to select image</div>}
          </div>
          <input type="file" id="imageInput" accept="image/*" style={{ display: "none" }} onChange={handleImageChange}/>
          <input 
            type="text" 
            placeholder="Product Name" 
            value={formProduct.name} 
            onChange={e => setFormProduct({...formProduct, name: e.target.value})} 
            required 
          />
          <textarea 
            placeholder="Description" 
            value={formProduct.description} 
            onChange={e => setFormProduct({...formProduct, description: e.target.value})} 
            required 
          />
          <input 
            type="number" 
            placeholder="Price" 
            value={formProduct.price} 
            onChange={e => setFormProduct({...formProduct, price: e.target.value})} 
            required 
          />
          <input 
            type="number" 
            placeholder="Stock" 
            value={formProduct.stock} 
            onChange={e => setFormProduct({...formProduct, stock: e.target.value})} 
            required 
          />  
          <div className="modal-buttons">
            <button type="submit">Add</button>
            <button type="button" onClick={closeAddProductPopup}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
