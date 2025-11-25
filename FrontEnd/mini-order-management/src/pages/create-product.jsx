import { useState } from "react";
import "./css/create-product.css";
import AddProductHeader from "../components/header/addProductHeader";
import ProductCard from "../components/productCard/ProductCard";
import AddProductPopup from "../components/productCard/AddProductPopup";
import UpdateProductPopup from "../components/productCard/UpdateProductPopup";
import axiosClient from "../services/axiosClient";

export default function CreateProduct() {
  const [products, setProducts] = useState([]);
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

    axiosClient.post("/products", {
      name: formProduct.name,
      description: formProduct.description,
      price: Number(formProduct.price),
      stockQuantity: Number(formProduct.stock)
    })
    .then(product => {
      setProducts([product, ...products]);
      closeAddProductPopup();
    })
    .catch(err => {
      console.error("Add product error:", err);
      alert("Không thể tạo sản phẩm! Có thể bạn không phải Admin hoặc token hết hạn.");
    });
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
    axiosClient.put(`/products/${currentProduct.id}`, {
    id: currentProduct.id,
    name: formProduct.name,
    description: formProduct.description,
    price: formProduct.price,
    stockQuantity: formProduct.stock
  });
  };

  // ---- Delete Product ----
  const openDeleteConfirm = (product) => {
    setCurrentProduct(product);
    setShowDeleteConfirm(true);
  };

  const handleDeleteProduct = () => {
    axiosClient.delete(`/products/${currentProduct.id}`);
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
      <AddProductHeader openAddProductPopup={openAddProductPopup} />

      <main className="product-main">
        {/* --- Add Product Popup --- */}
        {showAddProduct && (
          <AddProductPopup
            formProduct={formProduct}
            setFormProduct={setFormProduct}
            handleAddProduct={handleAddProduct}
            closeAddProductPopup={closeAddProductPopup}
            handleImageChange={handleImageChange}
          />
        )}

        {/* --- Update Product Popup --- */}
        {showUpdateProduct && (
          <UpdateProductPopup
            formProduct={formProduct}
            setFormProduct={setFormProduct}
            handleUpdateProduct={handleUpdateProduct}
            closeUpdatePopup={closeUpdatePopup}
            handleImageChange={handleImageChange}
          />
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
              <ProductCard
                key={p.id}
                p={p}
                openUpdatePopup={openUpdatePopup}
                openDeleteConfirm={openDeleteConfirm}
                />
              ))}
        </div>
      </main>
    </div>
  );
}
