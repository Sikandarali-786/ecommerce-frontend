import { Link } from 'react-router-dom';
import {
  FiArrowRight, FiShoppingBag, FiTruck, FiPhone, FiRefreshCw,
  FiCheckSquare,
} from 'react-icons/fi';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/ProductCard';
import { SkeletonGrid } from '../../components/SkeletonCard';
import HeroBanner from '../../components/HeroBanner';
import DealZone from '../../components/DealZone';
import TestimonialSection from '../../components/TestimonialSection';
import VideoShowcase from '../../components/VideoShowcase';
import { useSEO } from '../../hooks/useSEO';
import { useCategories } from '../../hooks/useCategories';
import { getImageUrl } from '../../utils/image';

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
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const allProducts  = productsData?.products ?? [];
  const categories = categoriesData?.categories ?? [];
  // Show 8 new in-stock products as "featured"
  const featured = allProducts.filter(p => p.stock > 0).slice(0, 8);

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

      {/* ── Top Collections ──────────────────────────────────────────────── */}
      <section className="py-16 w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-4 mb-10">
          <div className="text-center">
            {/* <p className="text-xs font-700 text-indigo-600 uppercase tracking-widest mb-1">Our Best Picks</p> */}
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Top Collections</h2>
          </div>
        </div>

        {categoriesLoading ? (
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="h-64 rounded-3xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center text-slate-500">No top collections available yet.</div>
        ) : (
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {categories.slice(0, 8).map(category => (
              <Link
                key={category._id}
                to={`/products?category=${encodeURIComponent(category.slug)}`}
                className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={getImageUrl(category.image || '')}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x600?text=No+Image'; }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-sm uppercase tracking-[0.24em] font-semibold text-white/80">Category</p>
                    <h3 className="mt-2 text-xl font-bold leading-tight">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <VideoShowcase />
      <DealZone />
      <TestimonialSection />

      {/* ── Featured Products ─────────────────────────────────────────────── */}
      {/* <section className="py-16 w-full px-4 sm:px-6 lg:px-8">
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
              className="inline-flex items-center gap-2 bg-linear-to-r from-[#10354a] to-[#cf531f] text-white px-8 py-3.5 rounded-xl font-700 hover:opacity-90 transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg"
            >
              View All Products
              <FiArrowRight size={18} />
            </Link>
          </div>
        )}
      </section> */}

    </div>
  );
};

export default HomePage;