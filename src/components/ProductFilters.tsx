import { useState, useEffect } from 'react';
import { FiSliders, FiX, FiRotateCcw } from 'react-icons/fi';
import { useCategories } from '../hooks/useCategories';

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  activeFilters: FilterState;
}

export interface FilterState {
  category: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
}

const ProductFilters = ({ onFilterChange, activeFilters }: ProductFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.categories || [];

  const [filters, setFilters] = useState<FilterState>(activeFilters);

  useEffect(() => {
    setFilters(activeFilters);
  }, [activeFilters]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters = Boolean(filters.category || filters.minPrice || filters.maxPrice || filters.sortBy);

  return (
    <div className="w-full mb-8">
      {/* Filter Toggle Header Button (Image 2 style) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium text-base mb-4 cursor-pointer transition-colors"
      >
        <FiSliders size={18} className="rotate-90 text-slate-700" />
        <span>Filter</span>
      </button>

      {/* Filter Content Card */}
      {isOpen && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 transition-all">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {/* 1. Category Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-1 inline-block">
                  Category
                </h3>
              </div>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full bg-white px-4 py-2.5 border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 font-medium transition-colors cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Price Range Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-1 inline-block">
                  Price Range
                </h3>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full bg-white px-4 py-2 border border-slate-300 rounded-xl text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 font-medium transition-colors"
                      min="0"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full bg-white px-4 py-2 border border-slate-300 rounded-xl text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 font-medium transition-colors"
                      min="0"
                    />
                  </div>
                </div>

                {(filters.minPrice || filters.maxPrice) && (
                  <p className="text-xs text-slate-500 font-medium">
                    Price: <span className="text-slate-900 font-semibold">Rs. {filters.minPrice || '0'} - Rs. {filters.maxPrice || '∞'}</span>
                  </p>
                )}
              </div>
            </div>

            {/* 3. Sort By Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-1 inline-block">
                  Sort By
                </h3>
              </div>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full bg-white px-4 py-2.5 border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 font-medium transition-colors cursor-pointer"
              >
                <option value="">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>

          </div>

          {/* Bottom Actions & Active Filters */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              {hasActiveFilters ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">Active Filters:</span>
                  {filters.category && (
                    <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-xs font-medium border border-slate-200">
                      <span>Category</span>
                      <button
                        onClick={() => handleFilterChange('category', '')}
                        className="hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <FiX size={13} />
                      </button>
                    </span>
                  )}
                  {(filters.minPrice || filters.maxPrice) && (
                    <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-xs font-medium border border-slate-200">
                      <span>Price Range</span>
                      <button
                        onClick={() => {
                          handleFilterChange('minPrice', '');
                          handleFilterChange('maxPrice', '');
                        }}
                        className="hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <FiX size={13} />
                      </button>
                    </span>
                  )}
                  {filters.sortBy && (
                    <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-xs font-medium border border-slate-200">
                      <span>Sorted</span>
                      <button
                        onClick={() => handleFilterChange('sortBy', '')}
                        className="hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <FiX size={13} />
                      </button>
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No active filters applied</p>
              )}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 text-slate-900 font-bold uppercase text-xs tracking-wider px-6 py-2 hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
              >
                <FiRotateCcw size={14} />
                <span>RESET ALL</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
