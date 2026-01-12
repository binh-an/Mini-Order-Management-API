import axiosClient from "../services/axiosClient";

export const postOrder = async (orderData) => {
    return await axiosClient.post("/orders", orderData);
};

export const getOrders = async () => {
    return await axiosClient.get("/orders");
};

export const getOrderById = async (orderId) => {
    return await axiosClient.get(`/orders/${orderId}`);
};

export const updateOrderStatus = async (orderId, orderData) => {
    return await axiosClient.patch(`/orders/${orderId}/status`, orderData, { headers: { "Content-Type": "application/json" },});
};

export const deleteOrder = async (orderId) => {
    return await axiosClient.delete(`/orders/${orderId}`);
};