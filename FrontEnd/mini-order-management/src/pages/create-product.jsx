import { useState, useEffect } from "react";
import "../style/create-product.css";
import AddProductHeader from "../components/header/addProductHeader";
import ProductCard from "../components/productCard/ProductCard";
import AddProductPopup from "../components/productCard/AddProductPopup";
import UpdateProductPopup from "../components/productCard/UpdateProductPopup";
import { getProducts, postProduct, updateProduct, deleteProduct, getProductById } from "../api/ProductApi";

export default function CreateProduct() {
  const [products, setProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showUpdateProduct, setShowUpdateProduct] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const [formProduct, setFormProduct] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    image: null,
    preview: "",
  });

  // --------------------- FETCH PRODUCTS ---------------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Fetch products failed:", err.response?.data || err);
      }
    };
    fetchProducts();
  }, []);

  // --------------------- ADD PRODUCT ---------------------
  const openAddProductPopup = () => {
    setFormProduct({
      name: "",
      description: "",
      price: "",
      stockQuantity: "",
      image: null,
      preview: "",
    });
    setShowAddProduct(true);
  };

  const closeAddProductPopup = () => setShowAddProduct(false);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", formProduct.name);
      formData.append("description", formProduct.description);
      const price = parseFloat(formProduct.price);
      if (isNaN(price) || price < 0) {
        alert("Price phải là số >= 0");
        return;
      }
      formData.append("price", price);
      const stock = parseInt(formProduct.stockQuantity);
      if (isNaN(stock) || stock < 0) {
        alert("Stock quantity phải là số nguyên >= 0");
        return;
      }

      formData.append("stockQuantity", stock);

      if (formProduct.image) {
        formData.append("image", formProduct.image);
      }

      const product = await postProduct(formData);

      setProducts([product, ...products]);
      closeAddProductPopup();
    } catch (err) {
      console.error("Add product error:", err.response?.data || err);
      alert("Không thể tạo sản phẩm! Có thể bạn không phải Admin hoặc token hết hạn.");
    }
  };

  // --------------------- UPDATE PRODUCT ---------------------
  const openUpdatePopup = (product) => {
    setCurrentProduct(product);

    setFormProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      image: null, // ảnh cũ backend giữ
      preview: product.imageUrl, // ảnh hiển thị
    });

    setShowUpdateProduct(true);
  };

  const closeUpdatePopup = () => setShowUpdateProduct(false);

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("id", currentProduct.id);
      formData.append("name", formProduct.name);
      formData.append("description", formProduct.description);
      formData.append("price", Number(formProduct.price));
      formData.append("stockQuantity", Number(formProduct.stockQuantity));

      if (formProduct.image instanceof File) {
        formData.append("image", formProduct.image);
      }

      const updatedProduct = await updateProduct(currentProduct.id, formData);

      setProducts(
        products.map((p) =>
          p.id === currentProduct.id ? updatedProduct : p
        )
      );
      closeUpdatePopup();
    } catch (err) {
      console.error("Update product failed:", err.response?.data || err);
      alert("Cập nhật sản phẩm thất bại!");
    }
  };


  // --------------------- DELETE PRODUCT ---------------------
  const openDeleteConfirm = (product) => {
    setCurrentProduct(product);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => setShowDeleteConfirm(false);

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(currentProduct.id);
      setProducts(products.filter((p) => p.id !== currentProduct.id));
      closeDeleteConfirm();
    } catch (err) {
      console.error("Delete product failed:", err.response?.data || err);
      alert("Xóa sản phẩm thất bại!");
    }
  };

  // --------------------- HANDLE IMAGE UPLOAD ---------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormProduct({
        ...formProduct,
        image: file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleSearch = async (id) => {
    try {
      if (!id) {
        // Reset lại toàn bộ sản phẩm
        const data = await getProducts();
        setProducts(data);
        return;
      }
      const p = await getProductById(id);
      setProducts([p]);
    } catch (err) {
      alert("Không tìm thấy sản phẩm!");
      console.error(err);
    }
  };

  return (
    <div className="create-product-page">
      <AddProductHeader 
        openAddProductPopup={openAddProductPopup}
        onSearch={handleSearch}
      />

      <main className="product-main">
        {showAddProduct && (
          <AddProductPopup
            formProduct={formProduct}
            setFormProduct={setFormProduct}
            handleAddProduct={handleAddProduct}
            closeAddProductPopup={closeAddProductPopup}
            handleImageChange={handleImageChange}
          />
        )}

        {showUpdateProduct && (
          <UpdateProductPopup
            formProduct={formProduct}
            setFormProduct={setFormProduct}
            handleUpdateProduct={handleUpdateProduct}
            closeUpdatePopup={closeUpdatePopup}
            handleImageChange={handleImageChange}
          />
        )}

        {showDeleteConfirm && (
          <div className="modal">
            <div className="modal-content" style={{ width: "250px", textAlign: "center" }}>
              <p>Delete this product?</p>
              <div className="modal-buttons" style={{ justifyContent: "center", gap: "10px" }}>
                <button
                  style={{ backgroundColor: "#f44336", color: "white" }}
                  onClick={handleDeleteProduct}
                >
                  Confirm
                </button>
                <button style={{ backgroundColor: "lightgray" }} onClick={closeDeleteConfirm}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="product-list">
          {products.map((p) => (
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
