import React from 'react';
import { Link } from 'react-router-dom';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { formatPrice } from '../../utils/currency';
import { motion, AnimatePresence } from 'framer-motion';

const CartDrawer = () => {
  const { cartItems, cartOpen, setCartOpen, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { user } = useAuth();

  const handleQuantityChange = (item, newQuantity) => {
    updateQuantity(item.id, item.selectedOptions, newQuantity);
  };

  const handleCheckout = () => {
    setCartOpen(false);
    if (!user) {
      window.location.href = '/login';
    } else {
      window.location.href = '/checkout';
    }
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Shopping Cart</h2>
              <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <Link
                    to="/shop"
                    onClick={() => setCartOpen(false)}
                    className="btn-primary inline-block"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex gap-4 border-b pb-4">
                      <img
                        src={item.image_url || 'https://via.placeholder.com/80x80?text=No+Image'}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.title}</h3>
                        {Object.entries(item.selectedOptions).map(([key, value]) => (
                          <p key={key} className="text-xs text-gray-500">
                            {key}: {value}
                          </p>
                        ))}
                        <p className="text-primary-600 font-bold mt-1">
                          {formatPrice(item.discount_price_usd || item.original_price_usd)}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item, item.quantity - 1)}
                              className="px-2 py-1 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="px-3">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item, item.quantity + 1)}
                              className="px-2 py-1 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id, item.selectedOptions)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t p-4 space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Subtotal:</span>
                  <span className="text-primary-600">{formatPrice(getCartTotal())}</span>
                </div>
                <p className="text-sm text-gray-500">
                  Shipping and taxes calculated at checkout
                </p>
                <button onClick={handleCheckout} className="btn-primary w-full">
                  Proceed to Checkout
                </button>
                <Link
                  to="/shop"
                  onClick={() => setCartOpen(false)}
                  className="block text-center text-primary-600 hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;