import { Link } from 'react-router-dom';
import { FiTag, FiPercent, FiZap, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';

const deals = [
  {
    icon: FiTag,
    badge: "UNDER RS. 999",
    badgeColor: "bg-red-100 text-red-700 border-red-200",
    title: "Budget Deals",
    discount: "Under Rs. 999",
    description: "Top-rated motorcycle parts & essential accessories at budget-friendly prices.",
    accentGradient: "from-red-500 to-rose-600",
    shadowColor: "hover:shadow-red-500/20",
    link: "/products?maxPrice=999",
  },
  {
    icon: FiPercent,
    badge: "LIMITED TIME",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    title: "Seasonal Sale",
    discount: "30% OFF",
    description: "Limited-time discounts on best-selling silencers, tanks, and gear.",
    accentGradient: "from-[#10354a] to-slate-800",
    shadowColor: "hover:shadow-slate-900/20",
    link: "/products",
  },
  {
    icon: FiZap,
    badge: "MEGA SAVINGS",
    badgeColor: "bg-orange-100 text-orange-700 border-orange-200",
    title: "Half Price Sale",
    discount: "Flat 50% OFF",
    description: "Grab selected premium bike accessories at unbelievable half price.",
    accentGradient: "from-orange-500 to-red-600",
    shadowColor: "hover:shadow-orange-500/20",
    link: "/products",
  },
  {
    icon: FiTrendingUp,
    badge: "HOT & TRENDING",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    title: "Trending Items",
    discount: "Latest Arrivals",
    description: "Discover the newest LED lights, fancy tanks, alloy rims & custom accessories.",
    accentGradient: "from-slate-800 to-slate-950",
    shadowColor: "hover:shadow-blue-500/20",
    link: "/products?sortBy=newest",
  },
];

const DealZone = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      {/* Background Decorative Elements */}
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-red-500/5 blur-3xl" />
      <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-[#10354a]/5 blur-3xl" />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 border border-red-200 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#8B0000] mb-3">
            <FaFire className="text-red-600 animate-pulse" size={16} />
            Exclusive Offers
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Best Deals on Premium Bike Accessories
          </h2>
          <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
            Upgrade your ride with high-quality motorcycle parts at unbeatable prices.
          </p>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-[#10354a] to-[#cf531f]" />
        </div>

        {/* Deals Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {deals.map((deal) => {
            const Icon = deal.icon;
            return (
              <Link
                key={deal.title}
                to={deal.link}
                className={`group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-2xl ${deal.shadowColor} transition-all duration-300 hover:-translate-y-2 overflow-hidden`}
              >
                {/* Top Accent Line */}
                <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${deal.accentGradient}`} />

                <div>
                  {/* Header Row: Icon + Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${deal.accentGradient} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={24} />
                    </div>
                    <span className={`text-[11px] font-bold tracking-wider px-3 py-1 rounded-full border ${deal.badgeColor}`}>
                      {deal.badge}
                    </span>
                  </div>

                  {/* Discount / Value */}
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-[#8B0000] transition-colors">
                    {deal.discount}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1 mb-3">
                    {deal.title}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {deal.description}
                  </p>
                </div>

                {/* Footer Action Link */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#10354a] group-hover:text-[#8B0000] transition-colors">
                  <span>Shop Now</span>
                  <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-red-50 flex items-center justify-center transition-colors">
                    <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-14 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#10354a] to-[#cf531f] px-8 py-4 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:opacity-95 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span>Explore All Exclusive Deals</span>
            <FiArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DealZone;
