import api from './api';

export const getProducts = async (params = {}) => {
  try {
    const response = await api.get('/api/products/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProduct = async (id) => {
  try {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/api/categories/');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getBanners = async () => {
  try {
    console.log('Fetching banners from:', `${api.defaults.baseURL}/api/banners/`);
    const response = await api.get('/api/banners/');
    console.log('Banners response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
};

export const getBrands = async () => {
  try {
    const response = await api.get('/api/brands/');
    console.log('Brands response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
};

export const getLowStockProducts = async () => {
  try {
    const response = await api.get('/api/products/low-stock');
    return response.data;
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    return [];
  }
};

export const getHighStockProducts = async () => {
  try {
    const response = await api.get('/api/products/high-stock');
    return response.data;
  } catch (error) {
    console.error('Error fetching high stock products:', error);
    return [];
  }
};