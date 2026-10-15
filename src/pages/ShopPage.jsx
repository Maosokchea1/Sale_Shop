import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductList from '../components/Products/ProductList';
import ProductFilters from '../components/Products/ProductFilters';
import { getProducts, getCategories } from '../services/product';
import { 
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChevronDownIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '', // Add search to filters
    priceRange: { min: '', max: '' },
    inStock: false,
    onSale: false,
  });
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const categoryScrollRef = useRef(null);
  const filterSectionRef = useRef(null);
  const previousCategoryRef = useRef(null);

  const sortOptions = [
    { value: 'newest', label: 'ថ្មីបំផុត' },
    { value: 'price_asc', label: 'តម្លៃ: ទាបទៅខ្ពស់' },
    { value: 'price_desc', label: 'តម្លៃ: ខ្ពស់ទៅទាប' },
    { value: 'name_asc', label: 'ឈ្មោះ: A ដល់ Z' },
    { value: 'name_desc', label: 'ឈ្មោះ: Z ដល់ A' },
    { value: 'popular', label: 'ពេញនិយមបំផុត' },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Update filters when URL params change
    const categoryFromUrl = searchParams.get('category');
    const searchFromUrl = searchParams.get('search');
    
    if (categoryFromUrl && categoryFromUrl !== previousCategoryRef.current) {
      setFilters(prev => ({ ...prev, category: categoryFromUrl }));
      previousCategoryRef.current = categoryFromUrl;
      
      // Scroll to filter section on mobile
      if (window.innerWidth < 1024) {
        setTimeout(() => {
          if (categoryScrollRef.current) {
            const activeButton = categoryScrollRef.current.querySelector(`[data-category="${categoryFromUrl}"]`);
            if (activeButton) {
              activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
          }
        }, 300);
      } else {
        // Scroll to filter sidebar on desktop
        setTimeout(() => {
          if (filterSectionRef.current) {
            filterSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      }
    }
    
    if (searchFromUrl) {
      setFilters(prev => ({ ...prev, search: searchFromUrl }));
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [filters, sortBy]); // Remove searchParams from dependencies

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Build API params
      const params = { skip: 0, limit: 100 };
      if (filters.category) params.category_id = filters.category;
      
      // Fetch all products or filtered by category
      let data = await getProducts(params);
      let filtered = [...data];
      
      // Apply search filter locally
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(product => 
          product.title?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.category?.name?.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply price range filter
      if (filters.priceRange.min) {
        filtered = filtered.filter(p => 
          (p.discount_price_usd || p.original_price_usd) >= parseFloat(filters.priceRange.min)
        );
      }
      if (filters.priceRange.max) {
        filtered = filtered.filter(p => 
          (p.discount_price_usd || p.original_price_usd) <= parseFloat(filters.priceRange.max)
        );
      }

      // Apply stock filter
      if (filters.inStock) {
        filtered = filtered.filter(p => p.stock_quantity > 0);
      }
      
      // Apply sale filter
      if (filters.onSale) {
        filtered = filtered.filter(p => p.discount_price_usd && p.discount_price_usd < p.original_price_usd);
      }
      
      // Apply sorting
      const sortFunctions = {
        price_asc: (a, b) => (a.discount_price_usd || a.original_price_usd) - (b.discount_price_usd || b.original_price_usd),
        price_desc: (a, b) => (b.discount_price_usd || b.original_price_usd) - (a.discount_price_usd || a.original_price_usd),
        name_asc: (a, b) => a.title?.localeCompare(b.title || '') || 0,
        name_desc: (a, b) => b.title?.localeCompare(a.title || '') || 0,
        popular: (a, b) => (b.sold_count || 0) - (a.sold_count || 0),
        newest: (a, b) => new Date(b.created_at) - new Date(a.created_at),
      };
      
      filtered.sort(sortFunctions[sortBy] || sortFunctions.newest);
      setProducts(filtered);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    
    // Update URL when category changes
    if (newFilters.category !== undefined && newFilters.category !== filters.category) {
      const newParams = new URLSearchParams(searchParams);
      if (newFilters.category) {
        newParams.set('category', newFilters.category);
      } else {
        newParams.delete('category');
      }
      setSearchParams(newParams);
    }
    
    // Update URL when search changes
    if (newFilters.search !== undefined && newFilters.search !== filters.search) {
      const newParams = new URLSearchParams(searchParams);
      if (newFilters.search) {
        newParams.set('search', newFilters.search);
      } else {
        newParams.delete('search');
      }
      setSearchParams(newParams);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleFilterChange({ search: searchQuery.trim() });
    } else {
      handleFilterChange({ search: '' });
    }
  };

  const clearAllFilters = () => {
    setFilters({
      category: '',
      search: '',
      priceRange: { min: '', max: '' },
      inStock: false,
      onSale: false,
    });
    setSortBy('newest');
    setSearchQuery('');
    setSearchParams({});
    previousCategoryRef.current = null;
  };

  const handleCategoryScroll = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = 200;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const activeFilterCount = [
    filters.category,
    filters.search,
    filters.priceRange.min || filters.priceRange.max,
    filters.inStock,
    filters.onSale,
  ].filter(Boolean).length;

  const getPageTitle = () => {
    if (filters.search) return `លទ្ធផលសម្រាប់ "${filters.search}"`;
    if (filters.category) return categories.find(c => c.id === parseInt(filters.category))?.name || 'ប្រភេទ';
    return 'ផលិតផលទាំងអស់';
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
      {/* Page Header */}
      <div className="bg-[#930712]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm font-medium mb-4 flex-wrap">
            <Link to="/" className="text-white/80 hover:text-white transition-colors no-underline">ទំព័រដើម</Link>
            <span className="text-white/40">/</span>
            <span className="text-white">ផលិតផល</span>
            {filters.search && (
              <>
                <span className="text-white/40">/</span>
                <span className="text-white/80">ស្វែងរក: "{filters.search}"</span>
              </>
            )}
            {filters.category && categories.find(c => c.id === parseInt(filters.category)) && (
              <>
                <span className="text-white/40">/</span>
                <span className="text-white/80">{categories.find(c => c.id === parseInt(filters.category))?.name}</span>
              </>
            )}
          </nav>

          {/* Title and Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                {getPageTitle()}
              </h1>
              <p className="text-white/80 mt-2 font-medium text-sm">
                រកឃើញ {products.length} ផលិតផល
              </p>
            </div>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden sm:block">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ស្វែងរកផលិតផល..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 pl-12 pr-4 py-3 bg-white text-gray-900 placeholder-gray-400 border-2 border-transparent font-medium text-sm outline-none focus:border-white"
                  style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="sm:hidden px-6 py-4 bg-white border-b border-gray-200">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ស្វែងរកផលិតផល..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-100 text-gray-900 placeholder-gray-400 border-2 border-gray-200 font-medium text-sm outline-none focus:bg-white focus:border-[#930712]"
              style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
            />
          </div>
        </form>
      </div>

      {/* Mobile Category Scroll */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="relative">
          <button
            onClick={() => handleCategoryScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow flex items-center justify-center border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <ChevronDownIcon className="w-4 h-4 rotate-90" />
          </button>

          <div
            ref={categoryScrollRef}
            className="flex gap-2 overflow-x-auto scroll-smooth px-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <button
              onClick={() => handleFilterChange({ category: '' })}
              data-category="all"
              className={`flex-shrink-0 px-4 py-2 text-sm font-medium transition-colors border-0 cursor-pointer ${
                !filters.category
                  ? 'bg-[#930712] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-[#9307120d] hover:text-[#930712]'
              }`}
            >
              ទាំងអស់
            </button>
            
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleFilterChange({ category: category.id.toString() })}
                data-category={category.id}
                className={`flex-shrink-0 px-4 py-2 text-sm font-medium transition-colors border-0 cursor-pointer ${
                  filters.category === category.id.toString()
                    ? 'bg-[#930712] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-[#9307120d] hover:text-[#930712]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleCategoryScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow flex items-center justify-center border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <ChevronDownIcon className="w-4 h-4 -rotate-90" />
          </button>
        </div>
      </div>

      {/* Search Result Badge */}
      {filters.search && (
        <div className="bg-gray-100 border-b border-gray-200 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-700">
                លទ្ធផលស្វែងរកសម្រាប់: 
                <strong className="ml-1 text-[#930712]">"{filters.search}"</strong>
              </span>
            </div>
            <button
              onClick={() => {
                handleFilterChange({ search: '' });
                setSearchQuery('');
              }}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#930712] transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
              សម្អាតការស្វែងរក
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0" ref={filterSectionRef}>
            <div className="sticky top-24">
              <ProductFilters
                categories={categories}
                filters={filters}
                onFilterChange={handleFilterChange}
                onSortChange={setSortBy}
              />
              
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#930712] border-2 border-[#930712] px-4 py-3 hover:bg-[#930712] hover:text-white transition-colors border-solid cursor-pointer"
                >
                  <XMarkIcon className="w-4 h-4" />
                  សម្អាតតម្រងទាំងអស់
                </button>
              )}
            </div>
          </aside>

          {/* Mobile Filters Overlay */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div 
                className="absolute inset-0 bg-black/50" 
                onClick={() => setMobileFiltersOpen(false)} 
              />
              <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">តម្រង & តម្រៀប</h2>
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="p-2 border-2 border-gray-200 hover:bg-[#930712] hover:text-white hover:border-[#930712] transition-colors border-solid cursor-pointer"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6">
                    <ProductFilters
                      categories={categories}
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      onSortChange={setSortBy}
                    />
                    
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="mt-4 w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#930712] border-2 border-[#930712] px-4 py-3 hover:bg-[#930712] hover:text-white transition-colors border-solid cursor-pointer"
                      >
                        <XMarkIcon className="w-4 h-4" />
                        សម្អាតទាំងអស់
                      </button>
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="w-full py-3 bg-[#930712] text-white font-semibold hover:bg-[#7a060f] transition-colors border-0 cursor-pointer"
                    >
                      បង្ហាញ {products.length} លទ្ធផល
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Section */}
          <main className="flex-1">
            {/* Mobile: Filters + Sort Bar */}
            <div className="lg:hidden flex items-center gap-3 mb-4">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-gray-900 border-2 border-gray-200 font-medium text-sm hover:border-[#930712] transition-colors border-solid cursor-pointer"
              >
                <AdjustmentsHorizontalIcon className="w-4 h-4" />
                <span>តម្រង</span>
                {activeFilterCount > 0 && (
                  <span className="bg-[#930712] text-white text-xs font-semibold px-1.5 py-0.5">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="relative flex-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-white border-2 border-gray-200 px-3 py-2.5 pr-8 text-sm font-medium text-gray-900 outline-none cursor-pointer focus:border-[#930712]"
                  style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
              </div>

              <div className="flex border-2 border-gray-200 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-[#930712] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Squares2X2Icon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors border-l-2 border-gray-200 ${viewMode === 'list' ? 'bg-[#930712] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <ListBulletIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Desktop Toolbar */}
            <div className="hidden lg:flex items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-4 flex-wrap">
                <p className="text-sm font-semibold text-gray-600">
                  <span className="text-lg text-gray-900">{products.length}</span> ផលិតផល
                </p>
                
                <div className="flex items-center gap-2 flex-wrap">
                  {filters.search && (
                    <span className="inline-flex items-center gap-2 bg-[#930712] text-white text-xs font-semibold px-3 py-1.5">
                      ស្វែងរក: {filters.search}
                      <button onClick={() => handleFilterChange({ search: '' })} className="hover:opacity-70 transition-opacity border-0 bg-transparent cursor-pointer text-white">
                        <XMarkIcon className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  )}
                  {filters.category && (
                    <span className="inline-flex items-center gap-2 bg-[#930712] text-white text-xs font-semibold px-3 py-1.5">
                      {categories.find(c => c.id === parseInt(filters.category))?.name || 'ប្រភេទ'}
                      <button onClick={() => handleFilterChange({ category: '' })} className="hover:opacity-70 transition-opacity border-0 bg-transparent cursor-pointer text-white">
                        <XMarkIcon className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  )}
                  {filters.inStock && (
                    <span className="inline-flex items-center gap-2 bg-[#930712] text-white text-xs font-semibold px-3 py-1.5">
                      មានក្នុងស្តុក
                      <button onClick={() => handleFilterChange({ inStock: false })} className="hover:opacity-70 transition-opacity border-0 bg-transparent cursor-pointer text-white">
                        <XMarkIcon className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  )}
                  {filters.onSale && (
                    <span className="inline-flex items-center gap-2 bg-[#930712] text-white text-xs font-semibold px-3 py-1.5">
                      កំពុងបញ្ចុះតម្លៃ
                      <button onClick={() => handleFilterChange({ onSale: false })} className="hover:opacity-70 transition-opacity border-0 bg-transparent cursor-pointer text-white">
                        <XMarkIcon className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border-2 border-gray-200 px-4 py-2.5 pr-10 text-sm font-medium text-gray-900 outline-none cursor-pointer focus:border-[#930712]"
                    style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 pointer-events-none" />
                </div>

                <div className="flex border-2 border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-[#930712] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Squares2X2Icon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 transition-colors border-l-2 border-gray-200 ${viewMode === 'list' ? 'bg-[#930712] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <ListBulletIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            <ProductList 
              products={products} 
              loading={loading} 
              viewMode={viewMode}
            />
          </main>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ShopPage;