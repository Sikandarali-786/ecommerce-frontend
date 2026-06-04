import { Link } from 'react-router-dom';
import {
  FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiRefreshCw,
  FiStar, FiZap,
} from 'react-icons/fi';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import ProductCard from '../../components/ProductCard';
import { SkeletonGrid } from '../../components/SkeletonCard';
import type { Category } from '../../types';

// ── Category colour map ───────────────────────────────────────────────────────
const categoryColors: Record<string, string> = {
  default:     'from-indigo-500 to-violet-600',
  electronics: 'from-blue-500 to-cyan-500',
  clothing:    'from-pink-500 to-rose-500',
  shoes:       'from-orange-500 to-amber-500',
  books:       'from-green-500 to-emerald-500',
  sports:      'from-teal-500 to-cyan-600',
  home:        'from-purple-500 to-fuchsia-500',
  beauty:      'from-rose-400 to-pink-600',
  toys:        'from-yellow-400 to-orange-500',
  food:        'from-lime-500 to-green-500',
};

const getCategoryGradient = (name: string) => {
  const key = name.toLowerCase();
  for (const k of Object.keys(categoryColors)) {
    if (k !== 'default' && key.includes(k)) return categoryColors[k];
  }
  return categoryColors.default;
};

// ── Trustworthy features strip ────────────────────────────────────────────────
const features = [
  { icon: <FiTruck size={22} />,      label: 'Free Shipping',   sub: 'On orders over $100'   },
  { icon: <FiShield size={22} />,     label: 'Secure Payment',  sub: '100% protected'         },
  { icon: <FiRefreshCw size={22} />,  label: 'Easy Returns',    sub: '30-day return policy'   },
  { icon: <FiStar size={22} />,       label: 'Top Quality',     sub: 'Curated products only'  },
];

const HomePage = () => {
  const { data: productsData, isLoading: productsLoading } = useProducts();
  const { data: categoriesData } = useCategories();

  const allProducts  = productsData?.products ?? [];
  const categories   = categoriesData?.categories ?? [];

  // Show 8 newest in-stock products as "featured"
  const featured = allProducts
    .filter(p => p.stock > 0)
    .slice(0, 8);

  // New arrivals — last 4
  const newArrivals = [...allProducts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-24 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-500 mb-6 backdrop-blur-sm">
              <FiZap size={14} className="text-amber-300" />
              New arrivals every week
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-800 text-white leading-tight mb-6">
              Discover Products
              <span className="block text-amber-300 mt-1">You'll Love</span>
            </h1>

            <p className="text-lg sm:text-xl text-indigo-100 mb-10 max-w-xl mx-auto leading-relaxed">
              Curated quality products, fast delivery, and a shopping experience
              that puts you first.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 px-8 py-3.5 rounded-xl font-700 hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base"
              >
                <FiShoppingBag size={20} />
                Shop Now
                <FiArrowRight size={18} />
              </Link>
              {categories.length > 0 && (
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-8 py-3.5 rounded-xl font-600 hover:bg-white/20 transition-all backdrop-blur-sm text-base"
                >
                  Browse Categories
                </Link>
              )}
            </div>

            {/* Stats row */}
            {allProducts.length > 0 && (
              <div className="mt-14 grid grid-cols-3 gap-6 max-w-md mx-auto">
                {[
                  { value: allProducts.length,     label: 'Products'   },
                  { value: categories.length,      label: 'Categories' },
                  { value: '100%',                 label: 'Satisfaction' },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl font-800 text-white">{stat.value}</p>
                    <p className="text-xs text-indigo-200 font-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Trust features strip ──────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-100">
            {features.map(f => (
              <div key={f.label} className="flex items-center gap-3 px-6 py-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  {f.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-700 text-slate-900">{f.label}</p>
                  <p className="text-xs text-slate-500">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shop by Category ─────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-700 text-indigo-600 uppercase tracking-widest mb-1">Browse</p>
              <h2 className="text-2xl sm:text-3xl font-800 text-slate-900">Shop by Category</h2>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-600 text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              View all <FiArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {categories.map((cat: Category) => (
              <Link
                key={cat._id}
                to={`/products`}
                className="group flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getCategoryGradient(cat.name)} flex items-center justify-center text-white font-800 text-lg shadow-sm group-hover:scale-110 transition-transform`}>
                  {cat.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-600 text-slate-700 group-hover:text-indigo-600 transition-colors text-center leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Featured Products ─────────────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-700 text-indigo-600 uppercase tracking-widest mb-1">Handpicked</p>
            <h2 className="text-2xl sm:text-3xl font-800 text-slate-900">Featured Products</h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-600 text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            View all <FiArrowRight size={15} />
          </Link>
        </div>

        {productsLoading ? (
          <SkeletonGrid count={8} />
        ) : featured.length === 0 ? (
          <div className="text-center py-20">
            <FiShoppingBag className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-500">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {featured.length > 0 && (
          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-700 hover:bg-indigo-700 transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg"
            >
              View All Products
              <FiArrowRight size={18} />
            </Link>
          </div>
        )}
      </section>

      {/* ── New Arrivals ──────────────────────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="py-16 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-700 text-amber-500 uppercase tracking-widest mb-1">Just In</p>
                <h2 className="text-2xl sm:text-3xl font-800 text-slate-900">New Arrivals</h2>
              </div>
              <Link
                to="/products"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-600 text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                See all <FiArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-14 text-center">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-orange-600/20 rounded-full blur-2xl" />
          </div>
          <div className="relative">
            <span className="inline-block px-4 py-1 rounded-full bg-white/20 text-white text-sm font-600 mb-4">
              Limited time offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-800 text-white mb-3">
              Free Shipping on Orders Over $100
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-md mx-auto">
              Stock up and save. No code needed — discount applied automatically at checkout.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-3.5 rounded-xl font-700 hover:bg-orange-50 transition-all shadow-lg hover:-translate-y-0.5"
            >
              Shop Now <FiArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
