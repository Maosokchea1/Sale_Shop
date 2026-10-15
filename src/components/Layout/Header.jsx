import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { getCategories } from '../../services/product';
import { 
  ShoppingBagIcon, 
  UserIcon, 
  MagnifyingGlassIcon, 
  Bars3Icon, 
  XMarkIcon,
  HeartIcon,
  HomeIcon,
  TagIcon,
  Squares2X2Icon,
  InformationCircleIcon,
  PhoneIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [popularSearches] = useState(['ទូរស័ព្ទ', 'កុំព្យូទ័រ', 'កាស', 'សម្លៀកបំពាក់', 'ស្បែកជើង']);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchCategories();
    
    // Close search dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setSearchQuery('');
      setIsSearchDropdownOpen(false);
      setIsSearchModalOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setIsCategoryDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/shop?category=${categoryId}`);
  };

  const handleViewAllCategories = () => {
    setIsCategoryDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/categories');
  };

  const handlePopularSearch = (term) => {
    setSearchQuery(term);
    navigate(`/shop?search=${term}`);
    setIsSearchDropdownOpen(false);
    setSearchQuery('');
  };

  // Bottom navigation items
  const bottomNavItems = [
    { icon: HomeIcon, label: 'ទំព័រដើម', path: '/' },
    { icon: TagIcon, label: 'ផលិតផល', path: '/shop' },
    { icon: MagnifyingGlassIcon, label: 'ស្វែងរក', action: 'search' },
    { icon: ShoppingBagIcon, label: 'កន្ត្រក', path: '/cart', badge: getCartCount() },
    { icon: UserIcon, label: user ? 'គណនី' : 'ចូល', path: user ? '/profile' : '/login' },
  ];

  const handleBottomNavClick = (item) => {
    if (item.action === 'search') {
      setIsSearchModalOpen(true);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Noto+Sans+Khmer:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
        {/* Top Bar */}
          {/* Top Bar */}
        <div className="bg-[#930712] text-white overflow-hidden select-none">
          {/* Inject Keyframe Animation ក្នុង JSX */}
          <style>{`
            @keyframes marqueeMove {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
            .marquee-track {
              display: inline-flex;
              white-space: nowrap;
              animation: marqueeMove 20s linear infinite;
            }
            .marquee-track:hover {
              animation-play-state: paused;
            }
          `}</style>

          {/* បង្កើន py-3.5 សម្រាប់កម្ពស់ Background និង text-sm / md:text-base សម្រាប់អក្សរធំជាងមុន */}
          <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between text-sm md:text-base font-semibold">
            {/* តំបន់អក្សររត់ */}
            <div className="overflow-hidden whitespace-nowrap flex-1 mr-6">
              <div className="marquee-track flex items-center gap-12">
                <span className="flex items-center gap-2">🚀 ដឹកជញ្ជូនឥតគិតថ្លៃ $50+</span>
                <span className="flex items-center gap-2">⭐ ការបញ្ចុះតម្លៃរហូតដល់ 50%</span>
                <span className="flex items-center gap-2">🔥 ការផ្ដល់ជូនពិសេសសម្រាប់សប្ដាហ៍នេះ!</span>
              </div>
            </div>

            {/* ផ្នែកភាសា */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="cursor-pointer hover:underline">kH ខ្មែរ</span>
            </div>
          </div>
        </div>
        {/* Main Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center h-16 gap-4">
              
              {/* Logo - Left */}
              <Link to="/" className="flex items-center gap-2 no-underline flex-shrink-0">
                <div className="w-8 h-8 bg-[#930712] flex items-center justify-center rounded-lg">
                  <ShoppingBagIcon className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">Sale_Shop</span>
              </Link>

              {/* Center - Navigation */}
              <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
                <Link to="/" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-900 no-underline hover:text-[#930712] transition-colors">
                  <HomeIcon className="w-4 h-4" />
                  ទំព័រដើម
                </Link>
                <Link to="/shop" className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 no-underline hover:text-[#930712] transition-colors">
                  <TagIcon className="w-4 h-4" />
                  ផលិតផល
                </Link>
                
                {/* Categories Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#930712] transition-colors border-0 bg-transparent cursor-pointer"
                  >
                    <Squares2X2Icon className="w-4 h-4" />
                    ប្រភេទផលិតផល
                    <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isCategoryDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsCategoryDropdownOpen(false)}
                      />
                      <div 
                        className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 shadow-2xl z-50 rounded-lg overflow-hidden"
                        onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                      >
                        <div className="py-2">
                          <button
                            onClick={() => handleViewAllCategories()}
                            className="w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-[#9307120d] hover:text-[#930712] transition-colors border-0 bg-transparent cursor-pointer flex items-center justify-between"
                          >
                            ប្រភេទទាំងអស់
                            <ChevronDownIcon className="w-4 h-4 -rotate-90" />
                          </button>
                          <div className="border-t border-gray-100 my-1"></div>
                          {categories.length > 0 ? (
                            categories.map((category) => (
                              <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-[#9307120d] hover:text-[#930712] transition-colors border-0 bg-transparent cursor-pointer flex items-center gap-3"
                              >
                                <Squares2X2Icon className="w-4 h-4 text-gray-400" />
                                {category.name}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-500">
                              កំពុងផ្ទុកប្រភេទ...
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {user && (
                  <Link to="/orders" className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 no-underline hover:text-[#930712] transition-colors">
                    <ShoppingBagIcon className="w-4 h-4" />
                    ការបញ្ជាទិញ
                  </Link>
                )}
                <Link to="/about" className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 no-underline hover:text-[#930712] transition-colors">
                  <InformationCircleIcon className="w-4 h-4" />
                  អំពីយើង
                </Link>
                <Link to="/contact" className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 no-underline hover:text-[#930712] transition-colors">
                  <PhoneIcon className="w-4 h-4" />
                  ទំនាក់ទំនង
                </Link>
              </nav>

              {/* Right - Actions */}
              <div className="flex items-center gap-1 ml-auto">
                {/* Search Dropdown - Desktop */}
                <div className="relative" ref={searchRef}>
                  <button 
                    onClick={() => setIsSearchDropdownOpen(!isSearchDropdownOpen)}
                    className="p-2 text-gray-600 hover:text-[#930712] transition-colors border-0 bg-transparent cursor-pointer rounded-lg hover:bg-gray-100"
                  >
                    <MagnifyingGlassIcon className="w-5 h-5" />
                  </button>
                  
                  {/* Search Dropdown Menu */}
                  {isSearchDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-96 bg-white border border-gray-200 shadow-2xl z-50 rounded-xl overflow-hidden">
                      <div className="p-4">
                        <form onSubmit={handleSearch} className="relative">
                          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="ស្វែងរកផលិតផល..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                            className="w-full py-2.5 pl-10 pr-4 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#930712] focus:ring-1 focus:ring-[#930712]"
                            style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                          />
                          {searchQuery && (
                            <button
                              type="button"
                              onClick={() => setSearchQuery('')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            </button>
                          )}
                        </form>
                        
                        {/* Popular Searches */}
                        <div className="mt-4">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            ការស្វែងរកពេញនិយម
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {popularSearches.map((term) => (
                              <button
                                key={term}
                                onClick={() => handlePopularSearch(term)}
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-[#930712] hover:text-white transition-colors"
                              >
                                {term}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Quick Categories */}
                        {categories.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                              ប្រភេទផលិតផល
                            </h4>
                            <div className="space-y-1">
                              {categories.slice(0, 3).map((category) => (
                                <button
                                  key={category.id}
                                  onClick={() => {
                                    navigate(`/shop?category=${category.id}`);
                                    setIsSearchDropdownOpen(false);
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                                >
                                  <Squares2X2Icon className="w-4 h-4 text-gray-400" />
                                  {category.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Search Button */}
                        <button
                          onClick={handleSearch}
                          disabled={!searchQuery.trim()}
                          className="w-full mt-4 py-2.5 bg-[#930712] text-white font-semibold rounded-lg hover:bg-[#7a060f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          ស្វែងរក
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Wishlist */}
                <button className="hidden sm:flex relative p-2 text-gray-600 hover:text-[#930712] transition-colors border-0 bg-transparent cursor-pointer rounded-lg hover:bg-gray-100">
                  <HeartIcon className="w-5 h-5" />
                </button>

                {/* Cart */}
                <button 
                  onClick={() => navigate('/cart')}
                  className="relative p-2 text-gray-600 hover:text-[#930712] transition-colors border-0 bg-transparent cursor-pointer rounded-lg hover:bg-gray-100"
                >
                  <ShoppingBagIcon className="w-5 h-5" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#930712] text-white text-[10px] font-bold flex items-center justify-center rounded-full px-1">
                      {getCartCount() > 99 ? '99+' : getCartCount()}
                    </span>
                  )}
                </button>

                {/* User / Auth */}
                <div className="hidden lg:flex items-center ml-2">
                  {user ? (
                    <div className="flex items-center gap-2 ml-2 pl-3 border-l border-gray-200">
                      <div className="w-8 h-8 bg-[#930712] rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {user.full_name?.charAt(0) || 'U'}
                      </div>
                      <div className="hidden xl:block">
                        <div className="text-xs font-semibold text-gray-900 leading-tight">{user.full_name?.split(' ')[0]}</div>
                        <button onClick={logout} className="text-[10px] text-gray-500 hover:text-[#930712] border-0 bg-transparent cursor-pointer p-0">
                          ចាកចេញ
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 ml-2 pl-3 border-l border-gray-200">
                      <Link to="/login" className="text-xs font-semibold text-gray-700 hover:text-[#930712] no-underline transition-colors">
                        ចូល
                      </Link>
                      <Link to="/signup" className="text-xs font-bold text-white bg-[#930712] px-3 py-1.5 rounded-lg no-underline hover:bg-[#7a060f] transition-colors">
                        ចុះឈ្មោះ
                      </Link>
                    </div>
                  )}
                </div>

                {/* Mobile Toggle */}
                <button 
                  className="lg:hidden p-2 text-gray-600 hover:text-[#930712] transition-colors border-0 bg-transparent cursor-pointer rounded-lg hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-[104px] lg:h-[104px]"></div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="flex items-center justify-around py-2">
          {bottomNavItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={index}
                onClick={() => handleBottomNavClick(item)}
                className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors relative ${
                  isActive ? 'text-[#930712]' : 'text-gray-500 hover:text-[#930712]'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge > 0 && (
                    <span className="absolute -top-1 -right-2 min-w-[16px] h-4 bg-[#930712] text-white text-[9px] font-bold flex items-center justify-center rounded-full px-1">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Search Modal */}
      {isSearchModalOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white animate-slideUp">
          <div className="flex flex-col h-full">
            {/* Search Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">ស្វែងរក</h3>
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="p-2 text-gray-500 hover:text-[#930712] rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 bg-gray-50">
              <form onSubmit={handleSearch} className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ស្វែងរកផលិតផល..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#930712] focus:ring-1 focus:ring-[#930712]"
                  style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <XMarkIcon className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </form>
            </div>

            {/* Search Suggestions */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Popular Searches */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">ការស្វែងរកពេញនិយម</h4>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        setTimeout(() => {
                          handleSearch({ preventDefault: () => {} });
                        }, 100);
                      }}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-[#930712] hover:text-white transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">ប្រភេទផលិតផល</h4>
                <div className="space-y-2">
                  {categories.slice(0, 5).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        navigate(`/shop?category=${category.id}`);
                        setIsSearchModalOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                    >
                      <Squares2X2Icon className="w-4 h-4 text-gray-400" />
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <button
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
                className="w-full py-3 bg-[#930712] text-white font-semibold rounded-lg hover:bg-[#7a060f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ស្វែងរក
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          <div className="flex flex-col h-full">
            <div className="p-4 bg-[#930712] text-white flex items-center justify-between">
              <span className="font-bold text-sm">ម៉ឺនុយ</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white border-0 bg-transparent cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 pb-20">
              <form onSubmit={handleSearch} className="mb-5">
                <input
                  type="text"
                  placeholder="ស្វែងរកផលិតផល..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#930712]"
                  style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                />
              </form>

              <nav className="space-y-1">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 no-underline font-medium text-sm border-l-2 border-[#930712] text-[#930712] bg-[#9307120d] rounded-lg">
                  <HomeIcon className="w-4 h-4" /> ទំព័រដើម
                </Link>
                <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 no-underline font-medium text-sm text-gray-700 hover:bg-[#9307120d] hover:text-[#930712] border-l-2 border-transparent hover:border-[#930712] rounded-lg">
                  <TagIcon className="w-4 h-4" /> ផលិតផល
                </Link>
                
                {/* Mobile Categories */}
                <div className="space-y-1">
                  <div className="flex items-center gap-3 px-3 py-3 font-medium text-sm text-gray-700">
                    <Squares2X2Icon className="w-4 h-4" /> ប្រភេទផលិតផល
                  </div>
                  <div className="ml-6 space-y-1 border-l-2 border-gray-100 pl-4">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className="w-full text-left px-3 py-2.5 text-sm text-gray-600 hover:bg-[#9307120d] hover:text-[#930712] transition-colors border-0 bg-transparent cursor-pointer flex items-center gap-2 rounded-lg"
                      >
                        <Squares2X2Icon className="w-3.5 h-3.5 text-gray-400" />
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-3 no-underline font-medium text-sm text-gray-700 hover:bg-[#9307120d] hover:text-[#930712] border-l-2 border-transparent hover:border-[#930712] rounded-lg">
                  <div className="flex items-center gap-3">
                    <ShoppingBagIcon className="w-4 h-4" /> កន្ត្រក
                  </div>
                  {getCartCount() > 0 && <span className="bg-[#930712] text-white px-2 py-0.5 text-[10px] font-bold rounded-full">{getCartCount()}</span>}
                </Link>
                {user && (
                  <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 no-underline font-medium text-sm text-gray-700 hover:bg-[#9307120d] hover:text-[#930712] border-l-2 border-transparent hover:border-[#930712] rounded-lg">
                    <ShoppingBagIcon className="w-4 h-4" /> ការបញ្ជាទិញ
                  </Link>
                )}
                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 no-underline font-medium text-sm text-gray-700 hover:bg-[#9307120d] hover:text-[#930712] border-l-2 border-transparent hover:border-[#930712] rounded-lg">
                  <InformationCircleIcon className="w-4 h-4" /> អំពីយើង
                </Link>
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 no-underline font-medium text-sm text-gray-700 hover:bg-[#9307120d] hover:text-[#930712] border-l-2 border-transparent hover:border-[#930712] rounded-lg">
                  <PhoneIcon className="w-4 h-4" /> ទំនាក់ទំនង
                </Link>
              </nav>

              <div className="border-t border-gray-200 my-4"></div>

              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-3 bg-gray-50 mb-3 rounded-lg">
                    <div className="w-9 h-9 bg-[#930712] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.full_name?.charAt(0) || 'U'}
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold">{user.full_name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full py-3 text-center text-[#930712] font-medium text-sm hover:bg-[#9307120d] border-0 bg-transparent cursor-pointer rounded-lg">
                    ចាកចេញ
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-center no-underline font-semibold text-sm border border-gray-300 text-gray-900 hover:border-[#930712] hover:text-[#930712] rounded-lg">
                    ចូលគណនី
                  </Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-center no-underline font-bold text-sm text-white bg-[#930712] hover:bg-[#7a060f] rounded-lg">
                    ចុះឈ្មោះ
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
          .animate-slideUp {
            animation: slideUp 0.3s ease-out;
          }
        `
      }} />
    </>
  );
};

export default Header;