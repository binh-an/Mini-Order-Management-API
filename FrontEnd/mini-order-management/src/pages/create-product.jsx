import { useState } from "react";
import "./css/create-product.css";
import AddProductHeader from "../components/header/addProductHeader";
import ProductCard from "../components/productCard/ProductCard";
import AddProductPopup from "../components/productCard/AddProductPopup";
import UpdateProductPopup from "../components/productCard/UpdateProductPopup";

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
