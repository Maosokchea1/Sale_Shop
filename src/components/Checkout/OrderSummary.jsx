import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/currency';
import { 
  ShoppingBagIcon,
  TruckIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  ClockIcon,
  CreditCardIcon,
  TagIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const OrderSummary = () => {
  const { cartItems, getCartTotal, getCartCount } = useCart();

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const itemCount = getCartCount();

  // Empty State
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="bg-white border border-gray-200 p-6 md:p-8 sticky top-24" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
        <div className="flex items-center gap-2 mb-6">
          <ShoppingBagIcon className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-bold text-gray-900">សង្ខេបការបញ្ជាទិញ</h2>
        </div>
        <div className="text-center py-8">
          <ShoppingBagIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">កន្ត្រករបស់អ្នកទទេ</p>
          <p className="text-sm text-gray-400 mt-1">បន្ថែមទំនិញដើម្បីចាប់ផ្តើម</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 p-6 md:p-8 sticky top-24" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ShoppingBagIcon className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-bold text-gray-900">សង្ខេបការបញ្ជាទិញ</h2>
        </div>
        <Link 
          to="/cart" 
          className="text-xs font-medium text-[#930712] hover:text-[#7a060f] transition-colors no-underline"
        >
          កែកន្ត្រក
        </Link>
      </div>

      {/* Cart Items */}
      <div className="space-y-3 mb-6 max-h-80 overflow-y-auto pr-1">
        {cartItems.map((item, index) => {
          const price = item.discount_price_usd || item.original_price_usd;
          const originalPrice = item.original_price_usd;
          const hasDiscount = item.discount_price_usd && item.discount_price_usd < originalPrice;
          
          return (
            <div 
              key={index} 
              className="flex gap-3 p-3 hover:bg-gray-50 transition-colors group"
            >
              {/* Product Image */}
              <Link to={`/product/${item.id}`} className="flex-shrink-0">
                <div className="relative w-16 h-16 bg-gray-100 overflow-hidden">
                  <img
                    src={item.image_url || '/placeholder-image.jpg'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                  {item.quantity > 1 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#930712] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center">
                      {item.quantity}
                    </span>
                  )}
                </div>
              </Link>
              
              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <Link 
                  to={`/product/${item.id}`}
                  className="text-sm font-medium text-gray-900 hover:text-[#930712] transition-colors line-clamp-2 no-underline"
                >
                  {item.title}
                </Link>
                
                {/* Selected Options */}
                {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {Object.entries(item.selectedOptions).map(([key, value]) => (
                      <span 
                        key={key} 
                        className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Price & Quantity */}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    ចំនួន: {item.quantity}
                  </span>
                  <div className="text-right">
                    {hasDiscount ? (
                      <div>
                        <span className="text-sm font-semibold text-[#930712]">
                          {formatPrice(price)}
                        </span>
                        <span className="text-xs text-gray-400 line-through ml-1">
                          {formatPrice(originalPrice)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-semibold text-gray-900">
                        {formatPrice(price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Promo Code */}
      <div className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="កូដផ្សព្វផ្សាយ"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#930712] transition-all"
              style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
            />
          </div>
          <button className="px-4 py-2.5 bg-[#930712] text-white text-sm font-medium hover:bg-[#7a060f] transition-colors border-0 cursor-pointer">
            អនុវត្ត
          </button>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 pb-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">សរុបរង ({itemCount} ទំនិញ)</span>
          <span className="text-sm font-medium text-gray-900">{formatPrice(subtotal)}</span>
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
          <span className="text-sm font-medium text-gray-900">{formatPrice(tax)}</span>
        </div>

        {/* Free Shipping Progress */}
        {shipping > 0 && subtotal > 0 && (
          <div className="bg-amber-50 border border-amber-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-amber-700 font-medium">
                បន្ថែម {formatPrice(50 - subtotal)} ទៀតសម្រាប់ការដឹកជញ្ជូនឥតគិតថ្លៃ
              </p>
              <span className="text-xs text-amber-600 font-semibold">
                {Math.round((subtotal / 50) * 100)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-amber-200 overflow-hidden">
              <div 
                className="h-full bg-amber-500 transition-all duration-500"
                style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Savings */}
        {cartItems.some(item => item.discount_price_usd && item.discount_price_usd < item.original_price_usd) && (
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3">
            <SparklesIcon className="w-4 h-4" />
            <p className="text-xs font-medium">
              អ្នកកំពុងសន្សំលើការបញ្ជាទិញនេះ!
            </p>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="py-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-base font-bold text-gray-900">សរុប</span>
          <div className="text-right">
            <span className="text-2xl font-bold text-[#930712]">{formatPrice(total)}</span>
            <p className="text-xs text-gray-500">រួមបញ្ចូលអាករ</p>
          </div>
        </div>
      </div>

      {/* Delivery & Payment Info */}
      <div className="py-4 border-b border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TruckIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">ការដឹកជញ្ជូនប៉ាន់ស្មាន</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {deliveryDate.toLocaleDateString('km-KH', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">ពេលវេលាដឹកជញ្ជូន</span>
          </div>
          <span className="text-sm font-medium text-gray-900">៣-៥ ថ្ងៃធ្វើការ</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCardIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">ការទូទាត់</span>
          </div>
          <span className="text-sm font-medium text-gray-900">ជម្រើសច្រើន</span>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="pt-4 space-y-3">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <LockClosedIcon className="w-3.5 h-3.5 text-gray-400" />
            <span>SSL Encrypted</span>
          </div>
          <div className="w-1 h-1 bg-gray-300"></div>
          <div className="flex items-center gap-1.5">
            <ShieldCheckIcon className="w-3.5 h-3.5 text-gray-400" />
            <span>ការទូទាត់សុវត្ថិភាព</span>
          </div>
        </div>
        
        {/* Payment Methods */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-1">Visa</span>
          <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-1">MC</span>
          <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-1">Amex</span>
          <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-1">KHQR</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;