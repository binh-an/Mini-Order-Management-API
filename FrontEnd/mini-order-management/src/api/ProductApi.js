import axiosClient from "../services/axiosClient";

export const getProducts = async () => {
  return await axiosClient.get("/products");
};

export const getProductById = async (productId) => {
    return await axiosClient.get(`/products/${productId}`);
};

export const postProduct = async (formData) => {
    return await axiosClient.post("/products", formData);
};

export const updateProduct = async (productId, formData) => {
    return await axiosClient.put(`/products/${productId}`, formData);
};

export const deleteProduct = async (productId) => {
    return await axiosClient.delete(`/products/${productId}`);
};