import React from 'react';
import ProductCard from './ProductCard';
import { 
  SparklesIcon,
  ExclamationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const ProductList = ({ products = [], loading = false, viewMode = 'grid' }) => {
  // Loading State
  if (loading) {
    return (
      <div className="py-6" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
        <div className={
          viewMode === 'list' 
            ? 'flex flex-col gap-4' 
            : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'
        }>
          {[...Array(8)].map((_, index) => (
            <div 
              key={index} 
              className={`bg-white border border-gray-100 overflow-hidden ${
                viewMode === 'list' ? 'flex gap-4 p-4' : ''
              }`}
            >
              {/* Skeleton Image */}
              <div className={`bg-gray-100 animate-pulse ${
                viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'aspect-square w-full'
              }`} />
              
              {/* Skeleton Content */}
              <div className={viewMode === 'list' ? 'flex-1 py-1' : 'p-4'}>
                <div className="h-3 bg-gray-100 w-1/3 mb-3 animate-pulse" />
                <div className="h-4 bg-gray-100 w-3/4 mb-2 animate-pulse" />
                <div className="h-4 bg-gray-100 w-1/2 mb-4 animate-pulse" />
                <div className="h-5 bg-gray-100 w-1/3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty State
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 px-4 sm:px-6" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#9307120d] mb-6">
          <ExclamationCircleIcon className="w-10 h-10 text-[#93071299]" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
          រកមិនឃើញផលិតផល
        </h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto mb-8 font-medium">
          យើងរកមិនឃើញផលិតផលដែលត្រូវនឹងលក្ខណៈវិនិច្ឆ័យរបស់អ្នកទេ។ សូមកែតម្រូវតម្រងរបស់អ្នក។
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#930712] text-white border-0 font-semibold text-sm transition-colors hover:bg-[#7a060f] cursor-pointer"
          >
            <ArrowPathIcon className="w-5 h-5" />
            ផ្ទុកឡើងវិញ
          </button>
          <a 
            href="/shop" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-gray-900 border-2 border-gray-200 font-semibold text-sm no-underline transition-colors hover:bg-[#930712] hover:text-white hover:border-[#930712]"
          >
            <SparklesIcon className="w-5 h-5" />
            មើលទាំងអស់
          </a>
        </div>
      </div>
    );
  }

  // Products Grid
  return (
    <div className={
      viewMode === 'list' 
        ? 'flex flex-col gap-4' 
        : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'
    }>
      {products.map((product, index) => (
        <div 
          key={product.id}
          className="opacity-0"
          style={{ 
            animation: `fadeInUp 0.4s ease forwards`,
            animationDelay: `${index * 0.05}s`
          }}
        >
          <ProductCard product={product} />
        </div>
      ))}

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProductList;