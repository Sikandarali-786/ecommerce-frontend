import { FaStar } from 'react-icons/fa';

const testimonials = [
  {
    rating: 5,
    quote: 'Afzal Bikerz Studio se jo silencer lia woh to shor kam aur style zyada nikla',
    name: 'Fahad Ali',
  },
  {
    rating: 5,
    quote: 'Wheel rims ordered and received exactly as shown in picture. Bhot impressed.',
    name: 'Zohaib Khan',
  },
  {
    rating: 5,
    quote: 'Lights itni bright hain ke raat mein drive karna asaan ho gaya. Thank you!',
    name: 'Noman',
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-20 w-full px-4 sm:px-6 lg:px-12 bg-white">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#10354a] text-center mb-12 tracking-tight">
          Customer Feedback
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="bg-white p-8 sm:p-10 flex flex-col items-center justify-between text-center shadow-[0_20px_35px_-10px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_45px_-8px_rgba(0,0,0,0.28)]"
            >
              {/* Star rating */}
              <div className="flex items-center justify-center gap-1 text-[#ffc107] mb-6">
                {[...Array(item.rating)].map((_, i) => (
                  <FaStar key={i} size={15} />
                ))}
              </div>

              {/* Feedback message */}
              <p className="text-slate-700 text-sm leading-relaxed mb-8 font-normal max-w-xs">
                {item.quote}
              </p>

              {/* Author name */}
              <p className="text-slate-900 font-bold text-sm tracking-wide">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;

