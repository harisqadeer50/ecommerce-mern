import axios from "axios";

const API = axios.create({ baseURL: "/api" });

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const getProfile = () => API.get("/auth/profile");
export const updateProfile = (data) => API.put("/auth/profile", data);
export const toggleWishlist = (productId) => API.put(`/auth/wishlist/${productId}`);

// Products
export const getProducts = (params) => API.get("/products", { params });
export const getProductById = (id) => API.get(`/products/${id}`);
export const getFeaturedProducts = () => API.get("/products/featured");
export const createProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const createReview = (id, data) => API.post(`/products/${id}/reviews`, data);

// Categories
export const getCategories = () => API.get("/categories");
export const createCategory = (data) => API.post("/categories", data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// Cart
export const getCart = () => API.get("/cart");
export const addToCart = (data) => API.post("/cart", data);
export const updateCartItem = (productId, data) => API.put(`/cart/${productId}`, data);
export const removeFromCart = (productId) => API.delete(`/cart/${productId}`);
export const clearCart = () => API.delete("/cart/clear");

// Orders
export const createOrder = (data) => API.post("/orders", data);
export const getMyOrders = () => API.get("/orders/myorders");
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const getAllOrders = () => API.get("/orders");
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}`, data);

// Admin
export const getDashboardStats = () => API.get("/admin/stats");
export const getAllUsers = () => API.get("/admin/users");
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);
export const updateUserRole = (id, data) => API.put(`/admin/users/${id}/role`, data);

export default API;
