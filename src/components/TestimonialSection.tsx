import { useQuery } from '@tanstack/react-query';
import { FaStar, FaCheckCircle } from 'react-icons/fa';
import { getHomepageTestimonials, type TestimonialItem } from '../api/review.api';
import { getImageUrl } from '../utils/image';
import silencerImg from '../assets/images/silencers.jpeg';
import rimsImg from '../assets/images/rims.jpeg';
import decorationImg from '../assets/images/decoration.jpeg';

const defaultTestimonials: TestimonialItem[] = [
  {
    _id: 'fb-1',
    rating: 5,
    quote: 'Afzal Bikerz Store se jo silencer lia woh to shor kam aur style zyada nikla',
    name: 'Fahad Ali',
    productTitle: 'Heavy Sound SC Project Silencer',
    productImage: silencerImg,
    isReal: false,
  },
  {
    _id: 'fb-2',
    rating: 5,
    quote: 'Wheel rims ordered and received exactly as shown in picture. Bhot impressed.',
    name: 'Zohaib Khan',
    productTitle: 'Alloy Wheel Rims Set',
    productImage: rimsImg,
    isReal: false,
  },
  {
    _id: 'fb-3',
    rating: 5,
    quote: 'Lights itni bright hain ke raat mein drive karna asaan ho gaya. Thank you!',
    name: 'Noman',
    productTitle: 'Ultra LED Headlight Kit',
    productImage: decorationImg,
    isReal: false,
  },
];

const fallbackImageMap: Record<string, string> = {
  'fb-1': silencerImg,
  'fb-2': rimsImg,
  'fb-3': decorationImg,
};

const resolveProductImage = (item: TestimonialItem): string | null => {
  if (fallbackImageMap[item._id]) {
    return fallbackImageMap[item._id];
  }
  if (item.productImage) {
    if (item.productImage.includes('silencers.jpeg')) return silencerImg;
    if (item.productImage.includes('rims.jpeg')) return rimsImg;
    if (item.productImage.includes('decoration.jpeg')) return decorationImg;
    return getImageUrl(item.productImage);
  }
  return null;
};

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
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#10354a] tracking-tight">
            Customer Feedback
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            See what our valued riders say about their purchased parts
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 h-72 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {list.map((item) => {
              const imgUrl = resolveProductImage(item);
              return (
                <div
                  key={item._id || item.name}
                  className="bg-white p-6 sm:p-8 flex flex-col items-center justify-between text-center shadow-[0_15px_35px_-10px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_45px_-8px_rgba(0,0,0,0.22)] rounded-2xl border border-slate-100 group relative"
                >
                  {/* Product Image Box */}
                  {imgUrl ? (
                    <div className="w-24 h-24 mb-4 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center p-2 group-hover:border-orange-200 transition-colors duration-300 shrink-0">
                      <img
                        src={imgUrl}
                        alt={item.productTitle || 'Reviewed Product'}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 mb-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 text-xs shrink-0">
                      No Image
                    </div>
                  )}

                  {/* Product Title Badge */}
                  {item.productTitle && (
                    <div
                      className="mb-3 px-3 py-1 bg-slate-100/90 rounded-full text-[12px] font-semibold text-[#10354a] max-w-[240px] truncate border border-slate-200/60"
                      title={item.productTitle}
                    >
                      {item.productTitle}
                    </div>
                  )}

                  {/* Star rating */}
                  <div className="flex items-center justify-center gap-1 text-[#ffc107] mb-4">
                    {[...Array(item.rating)].map((_, i) => (
                      <FaStar key={i} size={15} />
                    ))}
                  </div>

                  {/* Feedback message */}
                  <p className="text-slate-700 text-sm leading-relaxed mb-6 font-normal max-w-xs italic flex-1">
                    "{item.quote}"
                  </p>

                  {/* Author name & verified badge */}
                  <div className="mt-auto pt-4 border-t border-slate-100 w-full flex flex-col items-center gap-1">
                    <p className="text-slate-900 font-bold text-sm tracking-wide flex items-center gap-1.5 justify-center">
                      {item.name}
                      {item.isReal && (
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"
                          title="Verified Customer Review"
                        >
                          <FaCheckCircle size={10} /> Verified
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialSection;
