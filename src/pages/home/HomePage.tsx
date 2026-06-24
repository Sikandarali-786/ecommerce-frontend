import { Link } from 'react-router-dom';
import {
  FiArrowRight, FiShoppingBag, FiTruck, FiPhone, FiRefreshCw,
  FiCheckSquare,
} from 'react-icons/fi';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/ProductCard';
import { SkeletonGrid } from '../../components/SkeletonCard';
import HeroBanner from '../../components/HeroBanner';
import { useSEO } from '../../hooks/useSEO';

// ── Trust features strip ──────────────────────────────────────────────────────
const features = [
  {
    icon: <FiTruck size={26} />,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-500',
    label: 'Shipping Terms',
    sub: 'Advance shipping charges apply to all orders.',
  },
  {
    icon: <FiPhone size={26} />,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-500',
    label: 'Support 12/6',
    sub: 'Contact us 9 AM – 9 PM, 6 days a week.',
  },
  {
    icon: <FiRefreshCw size={26} />,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-400',
    label: '3-Day Returns',
    sub: 'Simply return within 3 days for an exchange.',
  },
  {
    icon: <FiCheckSquare size={26} />,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-500',
    label: 'Same Products',
    sub: 'Products delivered as shown, 100% guaranteed.',
  },
];

const HomePage = () => {
  useSEO({
    title:       'Home',
    description: "Pakistan's #1 Motorcycle Parts Store. Shop CD70 & CG125 tanks, alloy rims, silencers, LED lights, helmets & accessories. Fast delivery. 100% genuine products.",
  });
  const { data: productsData, isLoading: productsLoading } = useProducts();
  const allProducts  = productsData?.products ?? [];
  // Show 8 new in-stock products as "featured"
  const featured = allProducts.filter(p => p.stock > 0).slice(0, 8);

  // New arrivals — last 4
  const newArrivals = [...allProducts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Hero Banner with Slider ───────────────────────────────────────── */}
      <HeroBanner />

      {/* ── Trust features strip ──────────────────────────────────────────── */}
      <section className="bg-[#f9f9f9] border-b border-slate-200 py-4">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {features.map(f => (
              <div
                key={f.label}
                className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg px-5 py-4 shadow-sm"
              >
                {/* Icon box */}
                <div className={`shrink-0 w-12 h-12 rounded-lg ${f.iconBg} ${f.iconColor} flex items-center justify-center`}>
                  {f.icon}
                </div>
                {/* Text */}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 leading-tight">{f.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ── Featured Products ─────────────────────────────────────────────── */}
      <section className="py-16 w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-700 text-indigo-600 uppercase tracking-widest mb-1">Handpicked</p>
            <h2 className="text-2xl sm:text-3xl font-800 text-slate-900">Featured Products</h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-600 text-indigo-600 hover:text-indigo-700 transition-colors">
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
          <div className="w-full px-4 sm:px-6 lg:px-8">
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
      <section className="py-16 w-full px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-amber-400 to-orange-500 px-8 py-14 text-center">
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