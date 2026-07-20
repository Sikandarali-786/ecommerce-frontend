import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import ProductCard from '../../components/ProductCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import SearchBar from '../../components/SearchBar';
import ProductFilters, { type FilterState } from '../../components/ProductFilters';
import type { Product } from '../../types';
import type { ProductQueryParams } from '../../api/product.api';

const PAGE_SIZE = 12;

// ── Debounce ─────────────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ── Pagination component ─────────────────────────────────────────────────────
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages:  number;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  // Build page number array with ellipsis: [1, …, 4, 5, 6, …, 12]
  const pages: (number | '...')[] = [];
  const delta = 1; // pages on each side of current

  const range = (from: number, to: number) =>
    Array.from({ length: to - from + 1 }, (_, i) => from + i);

  const left  = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  pages.push(1);
  if (left > 2) pages.push('...');
  pages.push(...range(left, right));
  if (right < totalPages - 1) pages.push('...');
  if (totalPages > 1) pages.push(totalPages);

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium
          border border-gray-200 bg-white text-gray-600
          hover:bg-gray-50 hover:text-gray-900 transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <FiChevronLeft size={16} />
        Prev
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 py-2 text-gray-400 text-sm select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`min-w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
              p === currentPage
                ? 'bg-linear-to-r from-[#10354a] to-[#cf531f] text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {p}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium
          border border-gray-200 bg-white text-gray-600
          hover:bg-gray-50 hover:text-gray-900 transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
        <FiChevronRight size={16} />
      </button>
    </div>
  );
};

// ── Page ─────────────────────────────────────────────────────────────────────
const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const { data: categoriesData } = useCategories();

  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy:   '',
  });

  const debouncedSearch = useDebounce(searchInput, 400);

  // Reset to page 1 whenever search / filters change
  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, filters]);

  // Sync URL params → state
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

  // Build query params
  const queryParams: ProductQueryParams = {
    search:   debouncedSearch  || undefined,
    category: filters.category || undefined,
    minPrice: filters.minPrice || undefined,
    maxPrice: filters.maxPrice || undefined,
    sortBy:   (filters.sortBy as ProductQueryParams['sortBy']) || undefined,
    page:     currentPage,
    limit:    PAGE_SIZE,
  };

  const { data, isLoading, isError, error, isFetching } = useProducts(queryParams);

  const activeCategoryName =
    filters.category && categoriesData?.categories
      ? (categoriesData.categories.find(c => c._id === filters.category)?.name ?? '')
      : '';

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const products    = data?.products    ?? [];
  const pagination  = data?.pagination;
  const totalPages  = pagination?.totalPages ?? 1;
  const totalCount  = pagination?.total      ?? products.length;

  // Range shown e.g. "Showing 13–24 of 56"
  const from = pagination ? (currentPage - 1) * PAGE_SIZE + 1 : 1;
  const to   = pagination ? Math.min(currentPage * PAGE_SIZE, totalCount) : products.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {activeCategoryName || 'All Products'}
          </h1>
          <p className="text-gray-500 text-sm flex items-center gap-2">
            {totalCount > 0
              ? `Showing ${from}–${to} of ${totalCount} product${totalCount !== 1 ? 's' : ''}`
              : 'No products found'}
            {isFetching && !isLoading && (
              <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-[#8B0000] rounded-full animate-spin" />
            )}
          </p>
        </div>

        {/* ── Search Bar ────────────────────────────────────────────────── */}
        <div className="mb-6">
          <SearchBar onSearch={setSearchInput} initialValue={searchInput} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ── Filters Sidebar ───────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <ProductFilters onFilterChange={handleFilterChange} activeFilters={filters} />
          </div>

          {/* ── Products Grid + Pagination ─────────────────────────── */}
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
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product: Product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
