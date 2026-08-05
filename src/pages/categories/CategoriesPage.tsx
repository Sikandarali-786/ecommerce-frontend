import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { useSEO } from '../../hooks/useSEO';
import { getImageUrl } from '../../utils/image';
import { FiArrowRight, FiGrid } from 'react-icons/fi';

const CategoriesPage = () => {
  useSEO({
    title: 'All Categories',
    description: 'Browse all motorcycle parts and accessories categories at Afzal Bikerz Store.',
  });

  const { data: categoriesData, isLoading } = useCategories();
  const categories = categoriesData?.categories ?? [];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 pb-6 gap-4">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-[#8B0000] font-semibold text-sm mb-2">
              <FiGrid size={18} />
              <span>Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">All Categories</h1>
            <p className="mt-2 text-base text-slate-600">
              Explore our complete collection of motorcycle parts, styling accessories, and equipment.
            </p>
          </div>
          <p className="text-sm font-semibold text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-full self-center sm:self-auto shadow-xs">
            Total Categories: <span className="text-[#8B0000] font-bold">{categories.length}</span>
          </p>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="h-64 rounded-3xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-xs">
            <p className="text-lg text-slate-500">No categories found.</p>
            <Link
              to="/products"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#8B0000] hover:underline"
            >
              Browse All Products <FiArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/products?category=${encodeURIComponent(category.slug)}`}
                className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={getImageUrl(category.image || '')}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/600x600?text=No+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs uppercase tracking-[0.24em] font-semibold text-white/80">Category</p>
                    <h3 className="mt-1 text-xl font-bold leading-tight flex items-center justify-between">
                      <span>{category.name}</span>
                      <FiArrowRight size={18} className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
