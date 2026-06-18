import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import ProductCard from '../../components/ProductCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import SearchBar from '../../components/SearchBar';
import ProductFilters, { type FilterState } from '../../components/ProductFilters';
import type { Product } from '../../types';
import type { ProductQueryParams } from '../../api/product.api';

// ── Debounce helper ───────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const { data: categoriesData } = useCategories();

  // ── Local state ───────────────────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy:   '',
  });

  // Debounce search so we don't fire a request on every keystroke
  const debouncedSearch = useDebounce(searchInput, 400);

  // ── Sync URL params → local state (navbar category links, search links) ───
  useEffect(() => {
    const slugFromUrl   = searchParams.get('category') ?? '';
    const searchFromUrl = searchParams.get('search')   ?? '';

    if (searchFromUrl) setSearchInput(searchFromUrl);

    if (slugFromUrl && categoriesData?.categories) {
      const matched = categoriesData.categories.find(c => c.slug === slugFromUrl);
      setFilters(prev => ({ ...prev, category: matched?._id ?? '' }));
    } else if (!slugFromUrl) {
      setFilters(prev => ({ ...prev, category: '' }));
    }
  }, [searchParams, categoriesData]);

  // ── Build server-side query params ────────────────────────────────────────
  const queryParams: ProductQueryParams = {
    search:   debouncedSearch   || undefined,
    category: filters.category  || undefined,
    minPrice: filters.minPrice  || undefined,
    maxPrice: filters.maxPrice  || undefined,
    sortBy:   (filters.sortBy as ProductQueryParams['sortBy']) || undefined,
    limit:    100, // fetch up to 100; replace with pagination later
  };

  const { data, isLoading, isError, error, isFetching } = useProducts(queryParams);

  // ── Active category label for page heading ────────────────────────────────
  const activeCategoryName =
    filters.category && categoriesData?.categories
      ? (categoriesData.categories.find(c => c._id === filters.category)?.name ?? '')
      : '';

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  // ── Error state ───────────────────────────────────────────────────────────
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

  const products   = data?.products ?? [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {activeCategoryName || 'All Products'}
          </h1>
          <p className="text-gray-500 text-sm flex items-center gap-2">
            {pagination
              ? `Showing ${products.length} of ${pagination.total} products`
              : `Showing ${products.length} products`}
            {isFetching && !isLoading && (
              <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            )}
          </p>
        </div>

        {/* ── Search Bar ────────────────────────────────────────────────── */}
        <div className="mb-6">
          <SearchBar
            onSearch={setSearchInput}
            initialValue={searchInput}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ── Filters Sidebar ───────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <ProductFilters
              onFilterChange={handleFilterChange}
              activeFilters={filters}
            />
          </div>

          {/* ── Products Grid ─────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <LoadingSpinner />
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-slate-100">
                <p className="text-xl text-gray-600 mb-2">No products found</p>
                <p className="text-gray-400 text-sm">
                  {debouncedSearch || filters.category || filters.minPrice || filters.maxPrice
                    ? 'Try adjusting your filters or search query'
                    : 'No products available in this category yet'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product: Product) => (
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
