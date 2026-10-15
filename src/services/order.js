import api from './api';

export const createOrder = async (orderData) => {
  const response = await api.post('/api/orders/', orderData);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/api/orders/my-orders');
  return response.data;
};

export const getOrder = async (id) => {
  const response = await api.get(`/api/orders/${id}`);
  return response.data;
};

export const cancelOrder = async (id) => {
  const response = await api.put(`/api/orders/${id}/status`, { status: 'cancelled' });
  return response.data;
};