import React, { useEffect } from 'react';
import CartComponent from '../components/Cart/CartComponent'; // Fixed path
import { useCart } from '../hooks/useCart'; // Fixed path - useCart is a hook, not a page

const CartPage = () => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Update document title
  useEffect(() => {
    document.title = cartCount > 0 
      ? `Shopping Cart (${cartCount} items) | ShopHub` 
      : 'Shopping Cart | ShopHub';
    
    return () => {
      document.title = 'ShopHub';
    };
  }, [cartCount]);

  return <CartComponent />;
};

export default CartPage;