import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import ProductCard from '../../components/ProductCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import SearchBar from '../../components/SearchBar';
import ProductFilters, { type FilterState } from '../../components/ProductFilters';
import type { Product, Category } from '../../types';

const ProductsPage = () => {
  const { data, isLoading, isError, error } = useProducts();
  const { data: categoriesData } = useCategories();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: '',
  });

  // ── Pre-apply category filter from URL query param (?category=slug) ────────
  useEffect(() => {
    const slugFromUrl = searchParams.get('category') ?? '';
    const searchFromUrl = searchParams.get('search') ?? '';

    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }

    if (slugFromUrl && categoriesData?.categories) {
      // Resolve slug → _id so the existing filter logic works unchanged
      const matched = categoriesData.categories.find(
        c => c.slug === slugFromUrl
      );
      setFilters(prev => ({
        ...prev,
        category: matched?._id ?? '',
      }));
    } else if (!slugFromUrl) {
      // Clear category filter when URL has no category param
      setFilters(prev => ({ ...prev, category: '' }));
    }
  }, [searchParams, categoriesData]);

  // ── Current category name for the page heading ────────────────────────────
  const activeCategoryName = useMemo(() => {
    if (!filters.category || !categoriesData?.categories) return '';
    return categoriesData.categories.find(c => c._id === filters.category)?.name ?? '';
  }, [filters.category, categoriesData]);

  // ── Filter & sort products ────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];

    let filtered = [...data.products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    if (filters.category) {
      filtered = filtered.filter((product) => {
        const category = product.category as Category;
        return category._id === filters.category;
      });
    }

    if (filters.minPrice) {
      filtered = filtered.filter((p) => p.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((p) => p.price <= parseFloat(filters.maxPrice));
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':  filtered.sort((a, b) => a.price - b.price); break;
        case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
        case 'name-asc':   filtered.sort((a, b) => a.title.localeCompare(b.title)); break;
        case 'name-desc':  filtered.sort((a, b) => b.title.localeCompare(a.title)); break;
      }
    }

    return filtered;
  }, [data?.products, searchQuery, filters]);

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Products</h2>
          <p className="text-gray-600">
            {error instanceof Error ? error.message : 'Something went wrong'}
          </p>
        </div>
      </div>
    );
  }

  const totalProducts = data?.products?.length ?? 0;
  const displayedProducts = filteredProducts.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {activeCategoryName ? activeCategoryName : 'All Products'}
          </h1>
          <p className="text-gray-500 text-sm">
            {displayedProducts === totalProducts
              ? `Showing all ${totalProducts} products`
              : `Showing ${displayedProducts} of ${totalProducts} products`}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar onSearch={setSearchQuery} initialValue={searchQuery} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters onFilterChange={setFilters} activeFilters={filters} />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-slate-100">
                <p className="text-xl text-gray-600 mb-2">No products found</p>
                <p className="text-gray-400 text-sm">
                  {searchQuery || filters.category || filters.minPrice || filters.maxPrice
                    ? 'Try adjusting your filters or search query'
                    : 'No products available in this category yet'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product: Product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
