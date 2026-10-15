import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { formatPrice, calculateDiscountPercent } from '../../utils/currency';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const discountPercent = calculateDiscountPercent(
    product.original_price_usd,
    product.discount_price_usd
  );

  const currentPrice = product.discount_price_usd || product.original_price_usd;
  const originalPrice = product.original_price_usd;
  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 10;

  const stockStatus = {
    text: isOutOfStock ? 'អស់ពីស្តុក' : isLowStock ? `នៅសល់ ${product.stock_quantity}` : 'មានក្នុងស្តុក',
    color: isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500',
    textColor: isOutOfStock ? 'text-red-500' : isLowStock ? 'text-amber-500' : 'text-emerald-500'
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('សូមចូលគណនីដើម្បីបន្ថែមទំនិញ');
      return;
    }
    
    if (product.options && Object.keys(product.options).length > 0) {
      toast((t) => (
        <div className="flex flex-col gap-2" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
          <p className="text-sm font-medium m-0">សូមជ្រើសរើសជម្រើសសម្រាប់ {product.title}</p>
          <Link 
            to={`/product/${product.id}`} 
            className="text-sm font-medium text-[#930712] underline hover:text-[#7a060f]"
            onClick={() => toast.dismiss(t.id)}
          >
            មើលផលិតផល →
          </Link>
        </div>
      ));
      return;
    }
    
    addToCart(product, 1, {});
    toast.success(`${product.title} បានបន្ថែមចូលកន្ត្រក`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'បានដកចេញពីចំណូលចិត្ត' : 'បានបន្ថែមចូលចំណូលចិត្ត');
  };

  return (
    <div className="relative bg-white overflow-hidden border border-gray-100 hover:border-[#93071233] transition-colors group" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
      <Link to={`/product/${product.id}`} className="no-underline text-inherit block">
        {/* Image Section */}
        <div className="relative pt-[100%] bg-gray-50 overflow-hidden">
          {/* Skeleton Loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}
          
          <img
            src={product.image_url || '/placeholder-image.jpg'}
            alt={product.title}
            className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-image.jpg';
            }}
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-[1]">
            {discountPercent > 0 && (
              <span className="text-xs font-semibold py-1 px-2 bg-[#930712] text-white">
                -{discountPercent}%
              </span>
            )}
            {product.is_new && (
              <span className="text-xs font-semibold py-1 px-2 bg-white text-[#930712] border border-[#93071233]">
                ថ្មី
              </span>
            )}
            {product.is_bestseller && (
              <span className="text-xs font-semibold py-1 px-2 bg-[#930712] text-white flex items-center gap-0.5">
                <StarIcon className="w-2.5 h-2.5" />
                ពេញនិយម
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-2 right-2 p-1.5 bg-white border border-gray-200 cursor-pointer flex items-center justify-center z-[2] transition-all ${
              isWishlisted ? '!bg-[#930712] !text-white !border-[#930712]' : 'text-gray-600'
            } hover:bg-[#930712] hover:text-white hover:border-[#930712]`}
            aria-label={isWishlisted ? 'ដកចេញពីចំណូលចិត្ត' : 'បន្ថែមចូលចំណូលចិត្ត'}
          >
            {isWishlisted ? (
              <HeartSolidIcon className="w-4 h-4" />
            ) : (
              <HeartIcon className="w-4 h-4" />
            )}
          </button>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
              <span className="bg-[#930712] text-white text-xs font-semibold py-1.5 px-4">
                អស់ពីស្តុក
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-3">
          {/* Category & Rating */}
          <div className="flex items-center justify-between mb-1.5 min-h-[16px]">
            {product.category?.name && (
              <span className="text-xs text-gray-500 font-medium uppercase" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>
                {product.category.name}
              </span>
            )}
            {product.rating && (
              <div className="flex items-center gap-0.5 text-xs font-semibold text-[#930712]" style={{ fontSize: '11px' }}>
                <StarIcon className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>{product.rating}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#930712] transition-colors" style={{ fontSize: '13px', lineHeight: '1.3' }}>
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-base font-bold text-[#930712]">
              {formatPrice(currentPrice)}
            </span>
            {discountPercent > 0 && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Stock & Add to Cart */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 min-h-[32px]">
            <div className="flex items-center gap-1 text-xs font-medium" style={{ fontSize: '11px' }}>
              <span className={`w-1.5 h-1.5 ${stockStatus.color}`} />
              <span className={stockStatus.textColor}>{stockStatus.text}</span>
            </div>
            
            {!isOutOfStock && (
              <button 
                onClick={handleAddToCart} 
                className="flex items-center gap-1 py-1.5 px-3 bg-[#930712] text-white border-0 cursor-pointer text-xs font-medium hover:bg-[#7a060f] transition-colors"
                aria-label={`បន្ថែម ${product.title} ចូលកន្ត្រក`}
              >
                <ShoppingCartIcon className="w-3.5 h-3.5" />
                <span>បន្ថែម</span>
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;