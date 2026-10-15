import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../Products/ProductCard';
import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { getCategories } from '../../services/product';

const FeaturedProducts = ({ products = [], title = "ផលិតផលពេញនិយម" }) => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    filterProductsByCategory();
  }, [activeCategory, products]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const filterProductsByCategory = () => {
    if (activeCategory === 'all') {
      setFilteredProducts(products.slice(0, 8));
    } else {
      const filtered = products.filter(
        product => product.category?.id === activeCategory || 
                   product.category_id === activeCategory
      );
      setFilteredProducts(filtered.slice(0, 8));
    }
  };

  // Empty State
  if (!products.length) {
    return (
      <section className="bg-white border-t border-gray-100 py-16" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#9307120d] flex items-center justify-center mx-auto mb-5">
              <SparklesIcon className="w-8 h-8 text-[#93071299]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              មិនមានផលិតផលទេ
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              យើងកំពុងធ្វើបច្ចុប្បន្នភាពផលិតផលរបស់យើង។ សូមត្រឡប់មកពិនិត្យមើលផលិតផលថ្មីៗឆាប់ៗនេះ!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white border-t border-gray-100 py-6" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-10">

          {/* Category Tabs */}
          <div
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto py-1"
          >
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-5 py-2.5 text-sm font-medium whitespace-nowrap flex-shrink-0 border-0 cursor-pointer transition-colors ${
                activeCategory === 'all'
                  ? 'bg-[#930712] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-[#9307120d] hover:text-[#930712]'
              }`}
            >
              ទាំងអស់
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2.5 text-sm font-medium whitespace-nowrap flex-shrink-0 border-0 cursor-pointer transition-colors ${
                  activeCategory === category.id
                    ? 'bg-[#930712] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-[#9307120d] hover:text-[#930712]'
                }`}
              >
                {category.name}
              </button>
            ))}

            <Link
              to="/shop"
              className="inline-flex items-center gap-1 px-4 py-2.5 text-[#930712] no-underline text-sm font-medium whitespace-nowrap flex-shrink-0 hover:text-[#7a060f] sm:hidden"
            >
              មើលទាំងអស់
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 mb-10">
            {filteredProducts.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-5 bg-[#9307120d] mb-10">
            <p className="text-base text-gray-600 mb-2">
              រកមិនឃើញផលិតផលក្នុងប្រភេទនេះទេ
            </p>
            <button
              onClick={() => setActiveCategory('all')}
              className="bg-transparent border-0 text-[#930712] text-sm font-medium cursor-pointer underline hover:text-[#7a060f]"
            >
              មើលផលិតផលទាំងអស់
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center">
          <Link
            to={activeCategory === 'all' ? '/shop?featured=true' : `/shop?category=${activeCategory}`}
            className="inline-flex items-center gap-2 bg-[#930712] text-white px-7 py-3.5 no-underline font-medium text-sm hover:bg-[#7a060f] transition-colors"
          >
            មើលផលិតផលទាំងអស់
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
          
          {filteredProducts.length > 0 && (
            <p className="mt-3 text-xs text-gray-500 font-medium">
              បង្ហាញ {filteredProducts.length} ផលិតផល
              {activeCategory !== 'all' && ' ក្នុងប្រភេទនេះ'}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 mt-16" />
      </div>

      {/* Scrollbar Hide Styles */}
      <style>{`
        .overflow-x-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default FeaturedProducts;