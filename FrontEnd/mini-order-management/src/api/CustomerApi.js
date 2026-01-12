import axiosClient from "../services/axiosClient";

export const getCustomers = async () => {
    return await axiosClient.get("/customers");
};

export const getCustomerById = async (customerId) => {
    return await axiosClient.get(`/customers/${customerId}`);
}

export const postCustomer = async (customerData) => {
    return await axiosClient.post("/customers", customerData);
};

export const updateCustomer = async (customerId, customerData) => {
    return await axiosClient.put(`/customers/${customerId}`, customerData);
};

export const deleteCustomer = async (customerId) => {
    return await axiosClient.delete(`/customers/${customerId}`);
};  

