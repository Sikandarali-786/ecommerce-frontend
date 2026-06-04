const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
    <div className="skeleton h-60 w-full" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-3 w-16 rounded-full" />
      <div className="skeleton h-4 w-4/5 rounded-md" />
      <div className="skeleton h-4 w-3/5 rounded-md" />
      <div className="flex items-center justify-between pt-1">
        <div className="skeleton h-6 w-20 rounded-md" />
        <div className="skeleton h-4 w-16 rounded-md" />
      </div>
      <div className="skeleton h-9 w-full rounded-lg" />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonCard;
