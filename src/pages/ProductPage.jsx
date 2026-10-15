import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductDetail from '../components/Products/ProductDetail';
import { getProduct } from '../services/product';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { 
  ArrowLeftIcon, 
  ExclamationTriangleIcon,
  ShoppingBagIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProduct(id);
      if (!data) {
        setError('រកមិនឃើញផលិតផល');
        setProduct(null);
      } else {
        setProduct(data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('មិនអាចផ្ទុកផលិតផលបានទេ។ សូមព្យាយាមម្តងទៀត។');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-6 text-gray-500 animate-pulse text-lg font-bold uppercase tracking-wider">
            កំពុងផ្ទុកផលិតផល...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
        <div className="text-center max-w-md mx-auto px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 mb-6">
            <ExclamationTriangleIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3 uppercase">
            មានបញ្ហា
          </h1>
          <p className="text-gray-500 mb-8 font-bold text-sm uppercase">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={fetchProduct}
              className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-4 font-bold uppercase hover:bg-red-700 transition-colors border-0 cursor-pointer"
            >
              ព្យាយាមម្តងទៀត
            </button>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 font-bold uppercase border-2 border-gray-300 hover:border-red-600 hover:text-red-600 transition-colors no-underline"
            >
              <ShoppingBagIcon className="w-5 h-5" />
              មើលផលិតផល
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Product Not Found State
  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
        <div className="text-center max-w-md mx-auto px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 mb-6">
            <ShoppingBagIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3 uppercase">
            រកមិនឃើញផលិតផល
          </h1>
          <p className="text-gray-500 mb-8 font-bold text-sm uppercase">
            ផលិតផលដែលអ្នកកំពុងស្វែងរកមិនមានទេ ឬត្រូវបានដកចេញ។
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-4 font-bold uppercase hover:bg-red-700 transition-colors no-underline"
            >
              <ShoppingBagIcon className="w-5 h-5" />
              ទិញឥឡូវនេះ
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 font-bold uppercase border-2 border-gray-300 hover:border-red-600 hover:text-red-600 transition-colors no-underline"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              ទំព័រដើម
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Product Found - Render ProductDetail
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
      {/* Breadcrumb Navigation */}
      

      {/* Back Button (Mobile) */}
      <div className="max-w-7xl mx-auto px-6 pt-4 lg:hidden">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-red-600 transition-colors uppercase border-0 bg-transparent cursor-pointer"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          ត្រឡប់ក្រោយ
        </button>
      </div>

      {/* Product Detail Component */}
      <ProductDetail product={product} />

      {/* Related Products Section */}
      {product.related_products && product.related_products.length > 0 && (
        <section className="py-16 bg-white border-t-2 border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-red-600 text-white text-sm font-bold px-6 py-3 mb-6 uppercase">
                <SparklesIcon className="w-5 h-5" />
                <span>បំពេញរូបរាងរបស់អ្នក</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 uppercase">
                ផលិតផលពាក់ព័ន្ធ
              </h2>
              <div className="w-24 h-0.5 bg-red-600 mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Related products would be rendered here */}
              <p className="col-span-full text-center text-gray-500 font-bold text-sm uppercase">
                ផលិតផលពាក់ព័ន្ធនឹងមកដល់ឆាប់ៗនេះ...
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;