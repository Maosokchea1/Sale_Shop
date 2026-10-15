import React, { useState } from 'react';
import { 
  ChevronDownIcon, 
  XMarkIcon,
  FunnelIcon,
  CheckIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

const ProductFilters = ({ categories = [], filters = {}, onFilterChange, onSortChange }) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    availability: true,
    sort: false,
  });
  const [localPriceRange, setLocalPriceRange] = useState({
    min: filters.priceRange?.min || '',
    max: filters.priceRange?.max || '',
  });

  const sortOptions = [
    { value: 'newest', label: 'ថ្មីបំផុត' },
    { value: 'price_asc', label: 'តម្លៃ: ទាបទៅខ្ពស់' },
    { value: 'price_desc', label: 'តម្លៃ: ខ្ពស់ទៅទាប' },
    { value: 'name_asc', label: 'ឈ្មោះ: A ដល់ Z' },
    { value: 'name_desc', label: 'ឈ្មោះ: Z ដល់ A' },
  ];

  const pricePresets = [
    { label: 'ក្រោម ២៥ ដុល្លារ', min: '', max: '25' },
    { label: '២៥ - ៥០ ដុល្លារ', min: '25', max: '50' },
    { label: '៥០ - ១០០ ដុល្លារ', min: '50', max: '100' },
    { label: 'លើស ១០០ ដុល្លារ', min: '100', max: '' },
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (categoryId) => {
    onFilterChange({ 
      ...filters, 
      category: filters.category === categoryId ? '' : categoryId 
    });
  };

  const handlePriceChange = (type, value) => {
    const newPriceRange = { ...localPriceRange, [type]: value };
    setLocalPriceRange(newPriceRange);
  };

  const applyPriceFilter = () => {
    onFilterChange({ 
      ...filters, 
      priceRange: {
        min: localPriceRange.min || '',
        max: localPriceRange.max || '',
      }
    });
  };

  const handlePricePreset = (preset) => {
    const newRange = { min: preset.min, max: preset.max };
    setLocalPriceRange(newRange);
    onFilterChange({ ...filters, priceRange: newRange });
  };

  const clearAllFilters = () => {
    setLocalPriceRange({ min: '', max: '' });
    onFilterChange({ 
      category: '', 
      priceRange: { min: '', max: '' },
      inStock: false,
      onSale: false,
    });
  };

  const hasActiveFilters = () => {
    return filters.category || 
           filters.priceRange?.min || 
           filters.priceRange?.max || 
           filters.inStock || 
           filters.onSale;
  };

  return (
    <div className="bg-white border-2 border-gray-200 p-6" style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b-2 border-gray-100">
        <div className="flex items-center gap-3">
          <FunnelIcon className="w-5 h-5 text-[#930712]" />
          <h3 className="text-lg font-bold text-gray-900 m-0">តម្រង</h3>
        </div>
        {hasActiveFilters() && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-semibold text-[#930712] border-2 border-[#930712] px-4 py-1.5 hover:bg-[#930712] hover:text-white transition-colors cursor-pointer"
          >
            សម្អាតទាំងអស់
          </button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters() && (
        <div className="flex flex-wrap gap-2 mb-5 pb-4 border-b-2 border-gray-100">
          {filters.category && (
            <span className="inline-flex items-center gap-2 bg-[#930712] text-white text-xs font-semibold px-3 py-1.5">
              {categories.find(c => c.id === filters.category)?.name || 'ប្រភេទ'}
              <button
                onClick={() => handleCategoryChange(filters.category)}
                className="flex items-center p-0.5 hover:bg-white/20 transition-colors border-0 cursor-pointer text-white"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {filters.inStock && (
            <span className="inline-flex items-center gap-2 bg-[#930712] text-white text-xs font-semibold px-3 py-1.5">
              មានក្នុងស្តុក
              <button
                onClick={() => onFilterChange({ ...filters, inStock: false })}
                className="flex items-center p-0.5 hover:bg-white/20 transition-colors border-0 cursor-pointer text-white"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {filters.onSale && (
            <span className="inline-flex items-center gap-2 bg-[#930712] text-white text-xs font-semibold px-3 py-1.5">
              កំពុងបញ្ចុះតម្លៃ
              <button
                onClick={() => onFilterChange({ ...filters, onSale: false })}
                className="flex items-center p-0.5 hover:bg-white/20 transition-colors border-0 cursor-pointer text-white"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Categories Section */}
      <div className="border-b-2 border-gray-100 pb-4 mb-4">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full py-2 bg-transparent border-0 cursor-pointer hover:opacity-70 transition-opacity"
        >
          <h4 className="text-sm font-semibold text-gray-900 uppercase m-0">ប្រភេទ</h4>
          <ChevronDownIcon className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
            expandedSections.categories ? 'rotate-180' : ''
          }`} />
        </button>
        
        <div className={`transition-all duration-300 ${
          expandedSections.categories ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <button
            onClick={() => handleCategoryChange('')}
            className={`w-full flex items-center justify-between text-left px-4 py-2.5 text-sm font-medium transition-colors mb-1 border-0 cursor-pointer ${
              !filters.category 
                ? 'bg-[#930712] text-white' 
                : 'text-gray-700 hover:bg-[#9307120d] hover:text-[#930712]'
            }`}
          >
            <span>ប្រភេទទាំងអស់</span>
            {!filters.category && <CheckIcon className="w-4 h-4" />}
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`w-full flex items-center justify-between text-left px-4 py-2.5 text-sm font-medium transition-colors mb-1 border-0 cursor-pointer ${
                filters.category === category.id 
                  ? 'bg-[#930712] text-white' 
                  : 'text-gray-700 hover:bg-[#9307120d] hover:text-[#930712]'
              }`}
            >
              <span>{category.name}</span>
              {filters.category === category.id && <CheckIcon className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Section */}
      <div className="border-b-2 border-gray-100 pb-4 mb-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full py-2 bg-transparent border-0 cursor-pointer hover:opacity-70 transition-opacity"
        >
          <h4 className="text-sm font-semibold text-gray-900 uppercase m-0">តម្លៃ</h4>
          <ChevronDownIcon className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
            expandedSections.price ? 'rotate-180' : ''
          }`} />
        </button>
        
        <div className={`transition-all duration-300 ${
          expandedSections.price ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">អប្បបរមា</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-gray-500">$</span>
                <input
                  type="number"
                  placeholder="0"
                  value={localPriceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  onBlur={applyPriceFilter}
                  onKeyPress={(e) => e.key === 'Enter' && applyPriceFilter()}
                  className="w-full pl-8 pr-3 py-2.5 border-2 border-gray-200 text-sm font-medium outline-none focus:border-[#930712] transition-colors"
                  style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                />
              </div>
            </div>
            <MinusIcon className="w-5 h-5 text-gray-400 mt-7 flex-shrink-0" />
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">អតិបរមា</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-gray-500">$</span>
                <input
                  type="number"
                  placeholder="999"
                  value={localPriceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  onBlur={applyPriceFilter}
                  onKeyPress={(e) => e.key === 'Enter' && applyPriceFilter()}
                  className="w-full pl-8 pr-3 py-2.5 border-2 border-gray-200 text-sm font-medium outline-none focus:border-[#930712] transition-colors"
                  style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {pricePresets.map((preset, index) => (
              <button
                key={index}
                onClick={() => handlePricePreset(preset)}
                className={`text-xs font-semibold px-3 py-1.5 border-2 transition-colors cursor-pointer ${
                  localPriceRange.min === preset.min && localPriceRange.max === preset.max
                    ? 'bg-[#930712] text-white border-[#930712]'
                    : 'border-gray-200 text-gray-600 hover:border-[#930712] hover:text-[#930712]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Availability Section */}
      <div className="border-b-2 border-gray-100 pb-4 mb-4">
        <button
          onClick={() => toggleSection('availability')}
          className="flex items-center justify-between w-full py-2 bg-transparent border-0 cursor-pointer hover:opacity-70 transition-opacity"
        >
          <h4 className="text-sm font-semibold text-gray-900 uppercase m-0">ភាពអាចរកបាន</h4>
          <ChevronDownIcon className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
            expandedSections.availability ? 'rotate-180' : ''
          }`} />
        </button>
        
        <div className={`transition-all duration-300 ${
          expandedSections.availability ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <label className="flex items-center gap-3 p-3 cursor-pointer hover:bg-[#9307120d] transition-colors mb-1">
            <input
              type="checkbox"
              checked={filters.inStock || false}
              onChange={(e) => onFilterChange({ ...filters, inStock: e.target.checked })}
              className="hidden"
            />
            <span className={`w-5 h-5 border-2 flex-shrink-0 relative transition-colors ${
              filters.inStock ? 'bg-[#930712] border-[#930712]' : 'border-gray-300'
            }`}>
              {filters.inStock && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-2.5 h-1.5 border-l-2 border-b-2 border-white rotate-[-45deg] translate-y-[-1px]" />
                </span>
              )}
            </span>
            <span className="text-sm font-medium text-gray-700">មានក្នុងស្តុក</span>
          </label>
          
          <label className="flex items-center gap-3 p-3 cursor-pointer hover:bg-[#9307120d] transition-colors">
            <input
              type="checkbox"
              checked={filters.onSale || false}
              onChange={(e) => onFilterChange({ ...filters, onSale: e.target.checked })}
              className="hidden"
            />
            <span className={`w-5 h-5 border-2 flex-shrink-0 relative transition-colors ${
              filters.onSale ? 'bg-[#930712] border-[#930712]' : 'border-gray-300'
            }`}>
              {filters.onSale && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-2.5 h-1.5 border-l-2 border-b-2 border-white rotate-[-45deg] translate-y-[-1px]" />
                </span>
              )}
            </span>
            <span className="text-sm font-medium text-gray-700">កំពុងបញ្ចុះតម្លៃ</span>
          </label>
        </div>
      </div>

      {/* Sort Section */}
      <div>
        <button
          onClick={() => toggleSection('sort')}
          className="flex items-center justify-between w-full py-2 bg-transparent border-0 cursor-pointer hover:opacity-70 transition-opacity"
        >
          <h4 className="text-sm font-semibold text-gray-900 uppercase m-0">តម្រៀបតាម</h4>
          <ChevronDownIcon className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
            expandedSections.sort ? 'rotate-180' : ''
          }`} />
        </button>
        
        <div className={`transition-all duration-300 ${
          expandedSections.sort ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#9307120d] hover:text-[#930712] transition-colors mb-1 border-0 cursor-pointer"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;