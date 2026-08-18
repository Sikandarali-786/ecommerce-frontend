import { useQuery } from '@tanstack/react-query';
import { FaStar, FaCheckCircle } from 'react-icons/fa';
import { getHomepageTestimonials, type TestimonialItem } from '../api/review.api';

const defaultTestimonials: TestimonialItem[] = [
  {
    _id: 'fb-1',
    rating: 5,
    quote: 'Afzal Bikerz Store se jo silencer lia woh to shor kam aur style zyada nikla',
    name: 'Fahad Ali',
    isReal: false,
  },
  {
    _id: 'fb-2',
    rating: 5,
    quote: 'Wheel rims ordered and received exactly as shown in picture. Bhot impressed.',
    name: 'Zohaib Khan',
    isReal: false,
  },
  {
    _id: 'fb-3',
    rating: 5,
    quote: 'Lights itni bright hain ke raat mein drive karna asaan ho gaya. Thank you!',
    name: 'Noman',
    isReal: false,
  },
];

const TestimonialSection = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['homepage-testimonials'],
    queryFn: getHomepageTestimonials,
    staleTime: 5 * 60 * 1000,
  });

  const list = data?.testimonials?.length ? data.testimonials : defaultTestimonials;

  return (
    <section className="py-20 w-full px-4 sm:px-6 lg:px-12 bg-white">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#10354a] text-center mb-12 tracking-tight">
          Customer Feedback
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 h-64 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {list.map((item) => (
              <div
                key={item._id || item.name}
                className="bg-white p-8 sm:p-10 flex flex-col items-center justify-between text-center shadow-[0_20px_35px_-10px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_45px_-8px_rgba(0,0,0,0.28)] rounded-xl border border-slate-100"
              >
                {/* Star rating */}
                <div className="flex items-center justify-center gap-1 text-[#ffc107] mb-6">
                  {[...Array(item.rating)].map((_, i) => (
                    <FaStar key={i} size={15} />
                  ))}
                </div>

                {/* Feedback message */}
                <p className="text-slate-700 text-sm leading-relaxed mb-6 font-normal max-w-xs italic">
                  "{item.quote}"
                </p>

                {/* Author name & verified badge */}
                <div className="mt-auto flex flex-col items-center gap-1">
                  <p className="text-slate-900 font-bold text-sm tracking-wide flex items-center gap-1.5">
                    {item.name}
                    {item.isReal && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full" title="Verified Customer Review">
                        <FaCheckCircle size={10} /> Verified
                      </span>
                    )}
                  </p>
                  {item.productTitle && (
                    <span className="text-xs text-slate-400 font-medium truncate max-w-[200px]">
                      on {item.productTitle}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialSection;
