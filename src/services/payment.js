import api from './api';

export const createKHQRPayment = async (orderId, successUrl) => {
  const finalSuccessUrl = successUrl || `${window.location.origin}/payment-success`;

  const response = await api.post(`/api/payments/create-khqr/${orderId}`, null, {
    params: { success_url: finalSuccessUrl }
  });
  
  // រក្សាទុកព័ត៌មាន transaction សម្រាប់ផ្ទៀងផ្ទាត់
  if (response.data.transaction_id) {
    localStorage.setItem('last_transaction_id', response.data.transaction_id);
    localStorage.setItem('last_order_id', orderId);
  }

  // ត្រឡប់តែ Data ទៅឱ្យ UI Component ដោយមិនបញ្ជា redirect
  return response.data;
};

export const verifyPayment = async (transactionId) => {
  const response = await api.get(`/api/payments/verify/${transactionId}`);
  return response.data;
};

export const getOrderStatus = async (orderId) => {
  const response = await api.get(`/api/payments/order-status/${orderId}`);
  return response.data;
};

export const getExchangeRate = async () => {
  const response = await api.get('/api/settings/exchange-rate');
  return response.data;
};