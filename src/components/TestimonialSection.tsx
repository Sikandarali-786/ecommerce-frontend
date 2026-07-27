const testimonials = [
  {
    quote: 'Bike ka look complete ho gaya fancy tank aur decoration lights se.',
    name: 'Shahmeer',
  },
  {
    quote: 'CD70 ka tank fit hua bilkul factory jaisa. Quality is top notch!',
    name: 'Ali',
  },
  {
    quote: 'CG125 fancy tank ne to bike ki look hi change kar di. Zabardast finish!',
    name: 'Hassan Raza',
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-16 w-full px-4 sm:px-6 lg:px-8 bg-white">
      <div className="mx-auto max-w-7xl text-center mb-10">
        <p className="text-sm uppercase tracking-[0.32em] text-red-600 font-bold mb-2">Customer Feedback</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">What Buyers Are Saying</h2>
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((item) => (
          <div key={item.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="text-center">
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-yellow-300 text-lg font-bold text-slate-900">
                ★★★★★
              </div>
              <p className="text-sm leading-relaxed text-slate-700">{item.quote}</p>
              <p className="mt-6 text-sm font-semibold text-slate-900">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;
