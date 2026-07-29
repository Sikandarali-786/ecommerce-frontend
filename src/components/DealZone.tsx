import { FiTag, FiPercent, FiZap, FiStar } from 'react-icons/fi';

const deals = [
  {
    icon: FiTag,
    title: "LESS THAN",
    value: "Rs.999",
    description: "Shop top picks under a low price point.",
    color: "from-red-600 via-red-500 to-red-700",
  },
  {
    icon: FiPercent,
    title: "30% OFF",
    value: "SALE",
    description: "Limited-time discount on popular items.",
    color: "from-slate-900 via-slate-800 to-slate-950",
  },
  {
    icon: FiZap,
    title: "HALF PRICE",
    value: "SALE",
    description: "Grab select products at 50% off.",
    color: "from-red-600 via-red-500 to-red-700",
  },
  {
    icon: FiStar,
    title: "ALL",
    value: "TRENDY ITEMS",
    description: "Discover the latest trending accessories.",
    color: "from-slate-900 via-slate-800 to-slate-950",
  },
];

const DealZone = () => {
  return (
  <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-100 py-20">

  {/* Background Decoration */}
  <div className="absolute left-20 top-24 h-40 w-40 rounded-full border border-red-200 opacity-30" />
  <div className="absolute right-10 top-20 grid grid-cols-5 gap-2 opacity-20">
    {Array.from({ length: 25 }).map((_, i) => (
      <span key={i} className="h-1.5 w-1.5 rounded-full bg-red-500" />
    ))}
  </div>

  <div className="mx-auto max-w-7xl px-6">

    {/* Heading */}
    <div className="mb-16 text-center">

      <p className="text-sm font-bold uppercase tracking-[0.35em] text-red-600">
        Deal Zone
      </p>

      <h2 className="mt-4 text-4xl font-black text-slate-900">
        Best Deals on Premium Bike Accessories
      </h2>

      <div className="mx-auto mt-5 h-1.5 w-24 rounded-full bg-red-600" />

    </div>

    <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">

      {deals.map((deal) => {

        const Icon = deal.icon;

        return (

          <div
            key={deal.title}
            className="group flex justify-center"
          >

            <div
              className={`relative flex h-72 w-72 flex-col items-center justify-center rounded-full bg-gradient-to-br ${deal.color} px-8 text-center text-white shadow-xl transition-all duration-500 hover:-translate-y-3 hover:scale-105 hover:shadow-2xl`}
            >

              {/* Icon */}

              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white text-red-600 shadow-lg">

                <Icon size={32} />

              </div>

              <p className="text-lg font-bold tracking-[0.25em] uppercase">
                {deal.title}
              </p>

              <h3 className="mt-2 text-5xl font-black leading-none">
                {deal.value}
              </h3>

              <div className="my-4 h-1 w-12 rounded-full bg-white/40" />

              <p className="text-sm leading-7 text-white/90">
                {deal.description}
              </p>

            </div>

          </div>

        );

      })}

    </div>

    {/* Button */}

    <div className="mt-16 text-center">

      <button className="rounded-lg border-2 border-red-600 px-8 py-4 font-bold uppercase tracking-wider text-red-600 transition hover:bg-red-600 hover:text-white">

        View All Deals →

      </button>

    </div>

  </div>

</section>
  );
};

export default DealZone;
