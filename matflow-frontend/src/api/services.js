import API from './axios';

// Auth Services
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const registerUser = (userData) => API.post('/auth/register', userData);

// Inventory Services
export const getInventory = () => API.get('/inventory');
export const updateStock = (id, stockQuantity) => API.patch(`/inventory/${id}/stock`, { stockQuantity });
export const getLowStockItems = () => API.get('/inventory/low-stock');
export const createInventoryItem = (itemData) => API.post('/inventory', itemData);
// Order Services
export const getOrders = () => API.get('/orders');
export const createOrder = (orderData) => API.post('/orders', orderData);
export const updateOrderStatus = (id, status) => API.patch(`/orders/${id}/status`, { status });