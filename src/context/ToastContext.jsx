import React, { createContext } from 'react';
import toast from 'react-hot-toast';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const showSuccess = (message) => {
    toast.success(message);
  };

  const showError = (message) => {
    toast.error(message);
  };

  const showLoading = (message) => {
    return toast.loading(message);
  };

  const dismiss = (toastId) => {
    toast.dismiss(toastId);
  };

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showLoading, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
};