export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,3}[)]?[-\s.]?[0-9]{3,4}[-\s.]?[0-9]{3,4}$/;
  return re.test(phone);
};

export const getErrorMessage = (error) => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const saveToLocalStorage = (key, value) => {
  // Don't stringify if it's already a string (like token)
  if (typeof value === 'string') {
    localStorage.setItem(key, value);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getFromLocalStorage = (key) => {
  const item = localStorage.getItem(key);
  if (!item) return null;
  
  // Try to parse as JSON, but if it fails, return as string
  try {
    return JSON.parse(item);
  } catch (e) {
    // If it's not valid JSON, return as string (for tokens)
    return item;
  }
};

export const removeFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};

// Clear all localStorage
export const clearLocalStorage = () => {
  localStorage.clear();
};