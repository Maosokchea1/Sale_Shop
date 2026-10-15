import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrashIcon, 
  ArrowLeftIcon,
  ShoppingBagIcon,
  MinusIcon,
  PlusIcon,
  ShieldCheckIcon,
  TruckIcon,
  SparklesIcon,
  CreditCardIcon,
  LockClosedIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { formatPrice } from '../../utils/currency';
import toast from 'react-hot-toast';

const CartComponent = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart, getCartCount } = useCart();
  const { user } = useAuth();

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(item);
      return;
    }
    if (newQuantity > 99) {
      toast.error('ចំនួនអតិបរមាគឺ 99');
      return;
    }
    updateQuantity(item.id, item.selectedOptions, newQuantity);
  };

  const handleRemoveItem = (item) => {
    removeFromCart(item.id, item.selectedOptions);
    toast.success(`${item.title} បានដកចេញពីកន្ត្រក`);
  };

  const handleClearCart = () => {
    if (window.confirm('តើអ្នកប្រាកដថាចង់ដកទំនិញទាំងអស់ចេញពីកន្ត្រកមែនទេ?')) {
      clearCart();
      toast.success('កន្ត្រកត្រូវបានសម្អាត');
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
        <div className="text-center max-w-md mx-auto px-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 mb-8">
            <ShoppingBagIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            កន្ត្រករបស់អ្នកទទេ
          </h1>
          <p className="text-gray-600 mb-8">
            អ្នកមិនទាន់បានបន្ថែមទំនិញចូលកន្ត្រកនៅឡើយទេ។ ស្វែងរកផលិតផលដ៏អស្ចារ្យរបស់យើង!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/shop"
              className="group inline-flex items-center justify-center gap-3 bg-[#930712] text-white px-8 py-4 font-semibold hover:bg-[#7a060f] transition-colors no-underline"
            >
              <span>ចាប់ផ្តើមទិញឥឡូវនេះ</span>
            </Link>
            <Link
              to="/shop?sale=true"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 font-semibold border border-gray-200 hover:border-[#930712] hover:text-[#930712] transition-colors no-underline"
            >
              <TagIcon className="w-5 h-5" />
              <span>ការបញ្ចុះតម្លៃ</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <nav className="flex items-center gap-2 text-sm mb-2">
              <Link to="/" className="text-gray-500 hover:text-[#930712] transition-colors no-underline">ទំព័រដើម</Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium">កន្ត្រកទំនិញ</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              កន្ត្រកទំនិញ
            </h1>
            <p className="text-gray-500 mt-1">
              {getCartCount()} ទំនិញក្នុងកន្ត្រក
            </p>
          </div>
          
          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#930712] transition-colors no-underline"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            បន្តទិញទំនិញ
          </Link>
        </div>
      
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 overflow-hidden">
              {/* Table Header - Desktop */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                <div className="col-span-5">ផលិតផល</div>
                <div className="col-span-2 text-center">តម្លៃ</div>
                <div className="col-span-2 text-center">ចំនួន</div>
                <div className="col-span-2 text-right">សរុប</div>
                <div className="col-span-1"></div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-100">
                {cartItems.map((item, index) => {
                  const price = item.discount_price_usd || item.original_price_usd;
                  const total = price * item.quantity;
                  const originalPrice = item.original_price_usd;
                  const discountPercent = item.discount_price_usd 
                    ? Math.round(((originalPrice - item.discount_price_usd) / originalPrice) * 100)
                    : 0;

                  return (
                    <div key={index} className="p-4 sm:p-6 hover:bg-gray-50/50 transition-colors">
                      <div className="sm:grid sm:grid-cols-12 gap-4 items-center">
                        {/* Product Info */}
                        <div className="col-span-5 flex gap-4">
                          <Link to={`/product/${item.id}`} className="flex-shrink-0">
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 overflow-hidden">
                              <img
                                src={item.image_url || '/placeholder-image.jpg'}
                                alt={item.title}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/placeholder-image.jpg';
                                }}
                              />
                              {discountPercent > 0 && (
                                <span className="absolute top-1 left-1 bg-[#930712] text-white text-[10px] font-bold px-1.5 py-0.5">
                                  -{discountPercent}%
                                </span>
                              )}
                            </div>
                          </Link>
                          
                          <div className="flex-1 min-w-0">
                            <Link 
                              to={`/product/${item.id}`}
                              className="text-sm font-semibold text-gray-900 hover:text-[#930712] transition-colors line-clamp-2 no-underline"
                            >
                              {item.title}
                            </Link>
                            
                            {Object.entries(item.selectedOptions || {}).length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {Object.entries(item.selectedOptions).map(([key, value]) => (
                                  <span 
                                    key={key} 
                                    className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium"
                                  >
                                    {key}: {value}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            {/* Mobile Price */}
                            <div className="sm:hidden mt-2 flex items-center justify-between">
                              <span className="text-sm font-semibold text-gray-900">
                                {formatPrice(price)}
                              </span>
                              {discountPercent > 0 && (
                                <span className="text-xs text-gray-400 line-through">
                                  {formatPrice(originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Price - Desktop */}
                        <div className="hidden sm:block col-span-2 text-center">
                          <div>
                            <span className="text-sm font-semibold text-gray-900">
                              {formatPrice(price)}
                            </span>
                            {discountPercent > 0 && (
                              <p className="text-xs text-gray-400 line-through">
                                {formatPrice(originalPrice)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="col-span-2 flex justify-center mt-3 sm:mt-0">
                          <div className="inline-flex items-center border-2 border-gray-200 overflow-hidden">
                            <button
                              onClick={() => handleQuantityChange(item, item.quantity - 1)}
                              className="p-2 hover:bg-gray-50 transition-colors border-0 bg-transparent cursor-pointer"
                              disabled={item.quantity <= 1}
                            >
                              <MinusIcon className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="px-4 py-2 text-sm font-semibold text-gray-900 min-w-[50px] text-center border-x-2 border-gray-200">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item, item.quantity + 1)}
                              className="p-2 hover:bg-gray-50 transition-colors border-0 bg-transparent cursor-pointer"
                              disabled={item.quantity >= 99}
                            >
                              <PlusIcon className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </div>

                        {/* Total - Desktop */}
                        <div className="hidden sm:block col-span-2 text-right">
                          <span className="text-sm font-bold text-gray-900">
                            {formatPrice(total)}
                          </span>
                        </div>

                        {/* Remove Button */}
                        <div className="col-span-1 flex justify-end">
                          <button
                            onClick={() => handleRemoveItem(item)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border-0 bg-transparent cursor-pointer"
                            title="ដកចេញ"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          
            {/* Cart Actions */}
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Link 
                to="/shop" 
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#930712] transition-colors no-underline"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                បន្តទិញទំនិញ
              </Link>
              
              <button 
                onClick={handleClearCart} 
                className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 transition-all border-0 bg-transparent cursor-pointer"
              >
                <TrashIcon className="w-4 h-4" />
                សម្អាតកន្ត្រក
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Summary Card */}
              <div className="bg-white border border-gray-200 p-6 md:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-6">សង្ខេបការបញ្ជាទិញ</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">សរុបរង ({getCartCount()} ទំនិញ)</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">ការដឹកជញ្ជូន</span>
                    <span className="text-sm font-medium">
                      {shipping === 0 ? (
                        <span className="text-emerald-600">ឥតគិតថ្លៃ</span>
                      ) : (
                        <span className="text-gray-900">{formatPrice(shipping)}</span>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">ពន្ធ (ប៉ាន់ស្មាន)</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(tax)}
                    </span>
                  </div>
                  
                  {subtotal > 0 && shipping > 0 && (
                    <div className="bg-amber-50 border border-amber-200 p-3">
                      <p className="text-xs text-amber-700">
                        បន្ថែម {formatPrice(50 - subtotal)} ទៀតសម្រាប់ការដឹកជញ្ជូនឥតគិតថ្លៃ!
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">សរុប</span>
                    <span className="text-2xl font-bold text-[#930712]">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">រួមបញ្ចូលអាករ</p>
                </div>
                
                <Link
                  to={user ? "/checkout" : "/login?redirect=checkout"}
                  className="group w-full inline-flex items-center justify-center gap-3 bg-[#930712] text-white py-4 font-semibold hover:bg-[#7a060f] transition-colors no-underline"
                >
                  <LockClosedIcon className="w-5 h-5" />
                  <span>បន្តទៅការទូទាត់</span>
                </Link>
                
                {/* Payment Methods */}
                <div className="flex items-center justify-center gap-3 mt-4">
                  <CreditCardIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-xs text-gray-500">ការទូទាត់ដោយសុវត្ថិភាព</span>
                  <div className="flex gap-1.5">
                    {['Visa', 'MC', 'Amex'].map(method => (
                      <span key={method} className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white border border-gray-200 p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <TruckIcon className="w-5 h-5 text-[#930712]" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">ដឹកជញ្ជូនឥតគិតថ្លៃ</p>
                      <p className="text-xs text-gray-500">សម្រាប់ការបញ្ជាទិញលើសពី ៥០ ដុល្លារ</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheckIcon className="w-5 h-5 text-[#930712]" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">ការទូទាត់ដោយសុវត្ថិភាព</p>
                      <p className="text-xs text-gray-500">ប្រតិបត្តិការសុវត្ថិភាព 100%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="bg-white border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">មានកូដផ្សព្វផ្សាយ?</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="បញ្ចូលកូដ"
                    className="flex-1 px-3 py-2 border border-gray-200 text-sm outline-none focus:border-[#930712] transition-colors"
                    style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                  />
                  <button className="px-4 py-2 bg-[#930712] text-white text-sm font-medium hover:bg-[#7a060f] transition-colors border-0 cursor-pointer">
                    អនុវត្ត
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartComponent;