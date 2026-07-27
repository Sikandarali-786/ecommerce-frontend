const deals = [
  {
    title: 'LESS THAN',
    value: 'RS.999',
    description: 'Shop top picks under a low price point.',
    color: 'from-red-600 to-red-500',
  },
  {
    title: '30% OFF',
    value: 'SALE',
    description: 'Limited-time discount on popular items.',
    color: 'from-slate-900 to-slate-800',
  },
  {
    title: 'HALF PRICE',
    value: 'SALE',
    description: 'Grab select products at 50% off.',
    color: 'from-red-600 to-red-500',
  },
  {
    title: 'ALL',
    value: 'TRENDY ITEMS',
    description: 'Discover the latest trending accessories.',
    color: 'from-slate-900 to-slate-800',
  },
];

const DealZone = () => {
  return (
    <section className="py-16 w-full px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500 mb-2">Deal Zone</p>
        <div className="mx-auto h-1.5 w-16 rounded-full bg-red-600" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-center justify-center">
        {deals.map((deal) => (
          <div
            key={`${deal.title}-${deal.value}`}
            className="relative overflow-hidden rounded-full border border-slate-200 bg-white shadow-lg"
          >
            <div
              className={`flex h-72 flex-col items-center justify-center rounded-full bg-linear-to-br ${deal.color} px-6 text-center text-white shadow-xl`}
            >
              <p className="text-lg font-semibold tracking-[0.22em] uppercase leading-none">{deal.title}</p>
              <p className="mt-2 text-4xl font-bold leading-none">{deal.value}</p>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/85">{deal.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DealZone;
