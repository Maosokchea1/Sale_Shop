import React from 'react';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../hooks/useCart';

const CartIcon = () => {
  const { getCartCount, setCartOpen } = useCart();
  const count = getCartCount();

  return (
    <button
      onClick={() => setCartOpen(true)}
      className="relative p-2 text-gray-700 hover:text-primary-600 transition"
    >
      <ShoppingBagIcon className="h-6 w-6" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
};

export default CartIcon;