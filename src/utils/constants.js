export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const CURRENCIES = {
  USD: { symbol: '$', code: 'USD', rate: 1 },
  KHR: { symbol: '៛', code: 'KHR', rate: 4100 }
};

export const ORDER_STATUS = {
  pending: { 
    label: 'Pending Payment', 
    color: 'bg-yellow-500', 
    text: 'text-yellow-800',
    bg: 'bg-yellow-50'
  },
  paid: { 
    label: 'Paid', 
    color: 'bg-blue-500', 
    text: 'text-blue-800',
    bg: 'bg-blue-50'
  },
  shipped: { 
    label: 'Shipped', 
    color: 'bg-purple-500', 
    text: 'text-purple-800',
    bg: 'bg-purple-50'
  },
  delivered: { 
    label: 'Delivered', 
    color: 'bg-green-500', 
    text: 'text-green-800',
    bg: 'bg-green-50'
  },
  cancelled: { 
    label: 'Cancelled', 
    color: 'bg-red-500', 
    text: 'text-red-800',
    bg: 'bg-red-50'
  }
};

export const PAYMENT_METHODS = [
  { id: 'khqr', name: 'KHQR Payment', icon: '🏦', description: 'Pay with ABA, ACLEDA, Wing, etc.' },
  { id: 'cash', name: 'Cash on Delivery', icon: '💵', description: 'Pay when you receive your order' }
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];