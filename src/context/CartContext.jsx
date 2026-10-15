import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('ecommerce_cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          console.log('Loading cart from storage:', parsedCart);
          setCartItems(parsedCart);
        } else {
          console.log('No saved cart found');
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        setCartItems([]);
      } finally {
        setIsLoaded(true);
      }
    };
    
    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      console.log('Saving cart to storage:', cartItems);
      localStorage.setItem('ecommerce_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product, quantity = 1, selectedOptions = {}) => {
    console.log('Adding to cart - Product:', product);
    console.log('Product ID:', product?.id);
    console.log('Quantity:', quantity);
    console.log('Selected Options:', selectedOptions);
    
    if (!product || !product.id) {
      console.error('Invalid product:', product);
      toast.error('Invalid product');
      return;
    }
    
    setCartItems(prevItems => {
      // Check if item already exists with same options
      const existingItemIndex = prevItems.findIndex(
        item => item.id === product.id && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
      );
      
      if (existingItemIndex !== -1) {
        // Update existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        toast.success(`Updated ${product.title} quantity in cart`);
        console.log('Updated existing item:', updatedItems[existingItemIndex]);
        return updatedItems;
      }
      
      // Add new item
      const cartItem = {
        id: product.id,
        title: product.title,
        original_price_usd: product.original_price_usd || 0,
        discount_price_usd: product.discount_price_usd || null,
        original_price_khr: product.original_price_khr || 0,
        discount_price_khr: product.discount_price_khr || null,
        image_url: product.image_url || '',
        quantity: quantity,
        selectedOptions: selectedOptions,
        stock_quantity: product.stock_quantity || 0,
        category_id: product.category_id,
        category: product.category
      };
      
      console.log('Adding new item:', cartItem);
      toast.success(`${product.title} added to cart`);
      return [...prevItems, cartItem];
    });
  };

  const removeFromCart = (productId, options) => {
    console.log('Removing from cart:', productId, options);
    
    setCartItems(prevItems =>
      prevItems.filter(
        item => !(item.id === productId && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(options))
      )
    );
    toast.success('Item removed from cart');
  };

  const updateQuantity = (productId, options, quantity) => {
    console.log('Updating quantity:', productId, quantity);
    
    if (quantity <= 0) {
      removeFromCart(productId, options);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(options)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    console.log('Clearing cart');
    setCartItems([]);
    localStorage.removeItem('ecommerce_cart');
    toast.success('Cart cleared');
  };

  const getCartTotal = (currency = 'USD') => {
    const total = cartItems.reduce((sum, item) => {
      const price = item.discount_price_usd || item.original_price_usd;
      const itemTotal = price * item.quantity;
      console.log(`Item ${item.title}: $${price} x ${item.quantity} = $${itemTotal}`);
      return sum + itemTotal;
    }, 0);
    
    console.log('Cart total:', total);
    
    if (currency === 'KHR') {
      return total * 4100;
    }
    return total;
  };

  const getCartCount = () => {
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    console.log('Cart count:', count);
    return count;
  };

  // Debug function
  const debugCart = () => {
    console.log('=== CART DEBUG ===');
    console.log('Cart Items:', cartItems);
    console.log('Cart Count:', getCartCount());
    console.log('Cart Total:', getCartTotal());
    console.log('Local Storage:', localStorage.getItem('ecommerce_cart'));
    return cartItems;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartOpen,
      setCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      debugCart,
      isLoaded
    }}>
      {children}
    </CartContext.Provider>
  );
};