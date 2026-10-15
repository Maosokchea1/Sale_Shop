import React, { useState } from 'react';
import { formatPrice, convertPrice } from '../../utils/currency';

const PriceDisplay = ({ usdPrice, khrPrice, showToggle = true }) => {
  const [currency, setCurrency] = useState('USD');

  const toggleCurrency = () => {
    setCurrency(currency === 'USD' ? 'KHR' : 'USD');
  };

  const displayPrice = currency === 'USD' ? usdPrice : khrPrice;

  return (
    <div className="flex items-center space-x-2">
      <span className="text-xl font-bold text-primary-600">
        {formatPrice(displayPrice, currency)}
      </span>
      {showToggle && (
        <button
          onClick={toggleCurrency}
          className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 transition"
        >
          {currency === 'USD' ? 'Show in KHR' : 'Show in USD'}
        </button>
      )}
    </div>
  );
};

export default PriceDisplay;