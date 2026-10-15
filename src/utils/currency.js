export const formatPrice = (amount, currency = 'USD') => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'USD' ? 2 : 0,
    maximumFractionDigits: currency === 'USD' ? 2 : 0,
  });
  
  return formatter.format(amount);
};

export const convertPrice = (amount, fromCurrency, toCurrency, exchangeRate = 4100) => {
  if (fromCurrency === toCurrency) return amount;
  if (fromCurrency === 'USD' && toCurrency === 'KHR') return amount * exchangeRate;
  if (fromCurrency === 'KHR' && toCurrency === 'USD') return amount / exchangeRate;
  return amount;
};

export const getDiscountedPrice = (original, discount) => {
  return discount || original;
};

export const calculateDiscountPercent = (original, discount) => {
  if (!discount) return 0;
  return Math.round(((original - discount) / original) * 100);
};