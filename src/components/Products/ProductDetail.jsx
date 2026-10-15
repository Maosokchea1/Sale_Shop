import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  StarIcon, 
  ShoppingCartIcon, 
  ShieldCheckIcon, 
  TruckIcon, 
  ArrowPathIcon,
  HeartIcon,
  ShareIcon,
  CheckIcon,
  MinusIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TagIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { formatPrice, calculateDiscountPercent } from '../../utils/currency';
import { getProducts } from '../../services/product';
import ProductCard from './ProductCard';
import toast from 'react-hot-toast';

const ProductDetail = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  const allImages = [product.image_url, ...(product.images || [])].filter(Boolean);
  
  const discountPercent = calculateDiscountPercent(
    product.original_price_usd,
    product.discount_price_usd
  );

  const currentPrice = product.discount_price_usd || product.original_price_usd;
  const originalPrice = product.original_price_usd;
  const savings = originalPrice - currentPrice;
  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 10;

  useEffect(() => {
    fetchRelatedProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const fetchRelatedProducts = async () => {
    setLoadingRelated(true);
    try {
      // Fetch products by category if category exists
      if (product.category?.id) {
        const data = await getProducts({ 
          category_id: product.category.id,
          limit: 8 
        });
        // Filter out current product
        const filtered = data.filter(p => p.id !== product.id);
        setRelatedProducts(filtered.slice(0, 4));
      } 
      // If no category, fetch featured or recent products
      else {
        const data = await getProducts({ 
          limit: 8 
        });
        const filtered = data.filter(p => p.id !== product.id);
        setRelatedProducts(filtered.slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
      // Set empty array on error
      setRelatedProducts([]);
    } finally {
      setLoadingRelated(false);
    }
  };

  const handleOptionChange = (optionName, value) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('សូមចូលគណនីដើម្បីបន្ថែមទំនិញ');
      return;
    }

    if (product.options && Object.keys(product.options).length > 0) {
      const missingOptions = Object.keys(product.options).filter(
        option => !selectedOptions[option]
      );
      if (missingOptions.length > 0) {
        toast.error(`សូមជ្រើសរើស: ${missingOptions.join(', ')}`);
        return;
      }
    }

    addToCart(product, quantity, selectedOptions);
    toast.success(`${product.title} បានបន្ថែមចូលកន្ត្រក`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'បានដកចេញពីចំណូលចិត្ត' : 'បានបន្ថែមចូលចំណូលចិត្ត');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('បានចម្លងតំណភ្ជាប់!');
    }
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  const tabs = [
    { id: 'description', label: 'ការពិពណ៌នា' },
    { id: 'specifications', label: 'លក្ខណៈពិសេស' },
    { id: 'reviews', label: 'ការវាយតម្លៃ' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm font-medium mb-8 flex-wrap">
        <Link to="/" className="text-gray-500 hover:text-[#930712] no-underline">ទំព័រដើម</Link>
        <span className="text-gray-300">/</span>
        <Link to="/shop" className="text-gray-500 hover:text-[#930712] no-underline">ផលិតផល</Link>
        {product.category?.name && (
          <>
            <span className="text-gray-300">/</span>
            <Link to={`/shop?category=${product.category.id}`} className="text-gray-500 hover:text-[#930712] no-underline">
              {product.category.name}
            </Link>
          </>
        )}
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-semibold truncate max-w-[200px]">{product.title}</span>
      </nav>

      {/* Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Product Images */}
        <div className="flex flex-col gap-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 overflow-hidden">
            <img
              src={allImages[currentImageIndex] || '/placeholder-product.jpg'}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-product.jpg';
              }}
            />
            
            {allImages.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white flex items-center justify-center hover:bg-[#930712] hover:text-white transition-colors border-0 cursor-pointer">
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white flex items-center justify-center hover:bg-[#930712] hover:text-white transition-colors border-0 cursor-pointer">
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs font-semibold px-3 py-1">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              </>
            )}

            {discountPercent > 0 && (
              <div className="absolute top-3 left-3 bg-[#930712] text-white text-sm font-bold px-4 py-2">
                -{discountPercent}% បញ្ចុះតម្លៃ
              </div>
            )}

            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <button
                onClick={handleWishlist}
                className={`p-2 bg-white hover:bg-[#930712] hover:text-white transition-colors border-0 cursor-pointer ${
                  isWishlisted ? 'bg-[#930712] text-white' : 'text-gray-900'
                }`}
              >
                {isWishlisted ? <HeartSolidIcon className="w-5 h-5" /> : <HeartIcon className="w-5 h-5" />}
              </button>
              <button onClick={handleShare} className="p-2 bg-white text-gray-900 hover:bg-[#930712] hover:text-white transition-colors border-0 cursor-pointer">
                <ShareIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative aspect-square overflow-hidden border-2 transition-colors ${
                    currentImageIndex === idx ? 'border-[#930712]' : 'border-transparent hover:border-gray-400'
                  }`}
                >
                  <img src={img} alt={`${product.title} - ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <div className="text-sm font-medium text-gray-500 uppercase" style={{ letterSpacing: '0.05em' }}>
            <span>{product.category?.name || 'ប្រភេទ'}</span>
            {product.brand && <><span className="mx-2">•</span><span>{product.brand}</span></>}
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">{product.title}</h1>
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className={`w-5 h-5 ${i < (product.rating || 4) ? 'text-[#930712] fill-[#930712]' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-500">{product.rating || '4.5'} ({product.reviews_count || 128} ការវាយតម្លៃ)</span>
            </div>
          </div>

          {/* Price */}
          <div className="p-6 bg-gray-50">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl md:text-4xl font-bold text-[#930712]">{formatPrice(currentPrice)}</span>
              {discountPercent > 0 && (
                <>
                  <span className="text-xl text-gray-400 line-through font-bold">{formatPrice(originalPrice)}</span>
                  <span className="bg-[#930712] text-white text-sm font-bold px-4 py-2">សន្សំ {formatPrice(savings)}</span>
                </>
              )}
            </div>
            <p className="text-xs font-medium text-gray-500 uppercase mt-2" style={{ letterSpacing: '0.05em' }}>រួមបញ្ចូលពន្ធគ្រប់ប្រភេទ</p>
            
            {product.promocode && (
              <div className="flex items-center gap-3 mt-4 p-4 bg-white border border-gray-200">
                <TagIcon className="w-6 h-6 text-[#930712]" />
                <div>
                  <p className="text-sm font-semibold">ប្រើកូដ <span className="bg-[#930712] text-white px-2 py-0.5">{product.promocode}</span></p>
                  <p className="text-xs text-gray-500 mt-1">ការបញ្ចុះតម្លៃបន្ថែមពេលទូទាត់</p>
                </div>
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 p-4 border border-gray-200">
            <span className={`w-2 h-2 ${isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <span className="text-sm font-semibold uppercase" style={{ letterSpacing: '0.05em' }}>
              {isOutOfStock ? 'អស់ពីស្តុក' : isLowStock ? `នៅសល់ ${product.stock_quantity}` : 'មានក្នុងស្តុក'}
            </span>
          </div>

          {/* Options */}
          {product.options && Object.keys(product.options).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase" style={{ letterSpacing: '0.05em' }}>ជម្រើស</h3>
              {Object.entries(product.options).map(([optionName, values]) => (
                <div key={optionName}>
                  <label className="block text-sm font-medium text-gray-600 mb-2">{optionName}</label>
                  <div className="flex flex-wrap gap-2">
                    {values.map((value) => (
                      <button
                        key={value}
                        onClick={() => handleOptionChange(optionName, value)}
                        className={`px-5 py-2.5 text-sm font-medium border-2 flex items-center gap-2 transition-colors ${
                          selectedOptions[optionName] === value
                            ? 'bg-[#930712] text-white border-[#930712]'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-[#930712]'
                        }`}
                      >
                        {value}
                        {selectedOptions[optionName] === value && <CheckIcon className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold uppercase" style={{ letterSpacing: '0.05em' }}>ចំនួន</span>
            <div className="flex items-center border-2 border-gray-200 overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed border-0 bg-transparent cursor-pointer"
                disabled={quantity <= 1}
              >
                <MinusIcon className="w-5 h-5" />
              </button>
              <span className="px-6 py-3 text-base font-semibold border-x-2 border-gray-200 min-w-[60px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                className="p-3 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed border-0 bg-transparent cursor-pointer"
                disabled={quantity >= product.stock_quantity}
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full py-4 bg-[#930712] text-white border-0 text-base font-semibold cursor-pointer uppercase flex items-center justify-center gap-2 hover:bg-[#7a060f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{ letterSpacing: '0.05em' }}
          >
            <ShoppingCartIcon className="w-6 h-6" />
            {isOutOfStock ? 'អស់ពីស្តុក' : 'បន្ថែមចូលកន្ត្រក'}
          </button>

          {/* Shipping Info */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: TruckIcon, title: 'ដឹកជញ្ជូនឥតគិតថ្លៃ', desc: 'ការបញ្ជាទិញលើសពី ៥០ ដុល្លារ' },
              { icon: ArrowPathIcon, title: 'ងាយស្រួលប្រគល់', desc: 'គោលការណ៍ ៣០ ថ្ងៃ' },
              { icon: ShieldCheckIcon, title: 'ការធានា', desc: 'ធានា ២ ឆ្នាំ' },
            ].map((item, index) => (
              <div key={index} className="p-4 text-center border border-gray-200 hover:bg-[#9307120d] transition-colors">
                <item.icon className="w-6 h-6 mx-auto mb-2 text-[#930712]" />
                <p className="text-xs font-semibold uppercase" style={{ letterSpacing: '0.05em' }}>{item.title}</p>
                <p className="text-xs text-gray-500 uppercase mt-1" style={{ letterSpacing: '0.05em' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Delivery */}
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <ClockIcon className="w-5 h-5" />
            <span>ការដឹកជញ្ជូនប៉ាន់ស្មាន: ៣-៥ ថ្ងៃធ្វើការ</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-200 mt-16">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-8 py-4 text-sm font-semibold uppercase transition-colors border-0 bg-transparent cursor-pointer ${
                activeTab === tab.id ? 'text-[#930712] border-b-2 border-[#930712]' : 'text-gray-500 hover:text-gray-700'
              }`}
              style={{ letterSpacing: '0.05em' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="py-8">
          {activeTab === 'description' && (
            <div className="max-w-3xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">ការពិពណ៌នាផលិតផល</h3>
              <p className="text-base text-gray-700" style={{ lineHeight: '1.6' }}>{product.description || 'មិនមានការពិពណ៌នា។'}</p>
            </div>
          )}
          
          {activeTab === 'specifications' && (
            <div className="max-w-3xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">លក្ខណៈពិសេស</h3>
              {product.specifications ? (
                <dl className="border border-gray-200 overflow-hidden divide-y divide-gray-200">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-4 px-6">
                      <dt className="font-semibold capitalize">{key}</dt>
                      <dd className="text-gray-600">{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-gray-500">លក្ខណៈពិសេសនឹងមកដល់ឆាប់ៗនេះ...</p>
              )}
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div className="max-w-3xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">ការវាយតម្លៃពីអតិថិជន</h3>
                <button className="px-6 py-3 bg-[#930712] text-white border-0 font-semibold cursor-pointer uppercase hover:bg-[#7a060f] transition-colors" style={{ letterSpacing: '0.05em' }}>
                  សរសេរការវាយតម្លៃ
                </button>
              </div>
              <div className="text-center py-12">
                <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-900 font-semibold uppercase" style={{ letterSpacing: '0.05em' }}>មិនទាន់មានការវាយតម្លៃទេ។</p>
                <p className="text-sm text-gray-500 mt-1">ធ្វើជាអ្នកដំបូងក្នុងការវាយតម្លៃ!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">ផលិតផលពាក់ព័ន្ធ</h2>
            <Link 
              to={`/shop?category=${product.category?.id || ''}`}
              className="text-[#930712] hover:text-[#7a060f] font-semibold text-sm no-underline flex items-center gap-1"
            >
              មើលទាំងអស់
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id}>
                <ProductCard product={relatedProduct} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Loading Related Products */}
      {loadingRelated && (
        <section className="mt-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">ផលិតផលពាក់ព័ន្ធ</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white border border-gray-100 overflow-hidden">
                <div className="relative pt-[100%] bg-gray-100 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-100 animate-pulse w-2/3" />
                  <div className="h-4 bg-gray-100 animate-pulse w-full" />
                  <div className="h-4 bg-gray-100 animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* View All CTA */}
      <div className="text-center mt-16 pb-16">
        <Link
          to={`/shop?category=${product.category?.id || ''}`}
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#930712] text-white no-underline font-semibold uppercase hover:bg-[#7a060f] transition-colors"
          style={{ letterSpacing: '0.05em' }}
        >
          មើលផលិតផលទាំងអស់
          <ArrowRightIcon className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default ProductDetail;