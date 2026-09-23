import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import tankImg from '../assets/images/fueltank_banner.png';
import rimsImg from '../assets/images/rimlight_banner.png';
import silencersImg from '../assets/images/banner 4.jpeg';
import decorationImg from '../assets/images/Untitled (1).png';

interface Slide {
  id: number;
  image: string;
  badge: string;
  heading: string;
  subheading: string;
  boxTitle?: string;
  boxSubtitle?: string;
  cta: string;
  secondaryCta?: string;
  ctaPath: string;
  productsPath: string;
  tagsTitle?: string;
  tags?: { label: string; path: string }[];
  alignRight?: boolean;
  overlayFrom: string;
  overlayTo: string;
}
const slides: Slide[] = [
  {
    id: 1,
    image: tankImg,
    badge: 'New Arrivals',
    heading: 'Premium Fuel Tanks',
    subheading: 'Top-quality CD70 & CG125 fuel tanks built for performance and durability.',
    cta: 'Shop Tanks',
    ctaPath: '/products',
    productsPath: '/products?search=Fuel%20Tanks',
    tagsTitle: 'Select Tank Model:',
    tags: [
      { label: 'Customize Fuel Tanks', path: '/products?search=Customize%20Fuel%20Tanks' },
      { label: 'Genuine Fuel Tanks', path: '/products?search=Genuine%20Fuel%20Tanks' },
      { label: 'Fancy Fuel Tanks', path: '/products?search=Fancy%20Fuel%20Tanks' },
    ],
    overlayFrom: 'from-black/70',
    overlayTo: 'to-transparent',
  },
  {
    id: 2,
    image: rimsImg,
    badge: "Upgrade Your Ride",
    heading: `Premium Quality
Bike Accessories`,
    subheading: "Style | Performance | Durability",
    boxTitle: "All Top Accessories",
    boxSubtitle: "All in One Place!",
    cta: "Shop Now",
    secondaryCta: "Explore Products",
    ctaPath: "/products",
    productsPath: '/products?search=Rims',
    overlayFrom: "from-black/90",
    overlayTo: "to-red-950/40",
  },
  {
    id: 3,
    image: silencersImg,
    badge: 'Hot Deals',
    heading: 'Performance Silencers',
    subheading: 'Enhance exhaust sound and performance with our premium silencer range.',
    cta: 'Shop All Silencers',
    ctaPath: '/products?category=silencers',
    productsPath: '/products?category=silencers',
    tagsTitle: 'Select Silencer Model:',
    tags: [
      { label: 'Ahl3', path: '/products?search=Ahl3' },
      { label: 'Whistler', path: '/products?search=Whistler' },
      { label: 'Badshah', path: '/products?search=Badshah' },
      { label: 'Beat', path: '/products?search=Beat' },
    ],
    overlayFrom: 'from-black/80',
    overlayTo: 'to-black/50',
  },
  {
    id: 4,
    image: decorationImg,
    badge: 'Trending Now',
    heading: 'Bike Decoration',
    subheading: 'Give your motorcycle a fresh look with our wide range of accessories.',
    cta: 'Explore Now',
    ctaPath: '/products',
    productsPath: '/products?search=Decoration',
    overlayFrom: 'from-black/60',
    overlayTo: 'to-transparent',
  },
];

const AUTOPLAY_INTERVAL = 5000;

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((index) => (index + 1) % slides.length);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section
      className="hero-banner relative w-full overflow-hidden bg-black min-h-125 h-[clamp(500px,100vw,600px)] md:min-h-105 md:h-[clamp(420px,55vw,600px)]"
      aria-label="Hero banner"
    >
      {/* ── Slides ────────────────────────────────────────────────────── */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          aria-hidden={i !== current}
        >
          {/* Background image */}
          <Link
            to={s.productsPath}
            aria-label={`View products related to ${s.heading.replace('\n', ' ')}`}
            className="absolute inset-0 block"
          >
            <img
              src={s.image}
              alt={""}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-linear-to-r ${s.overlayFrom} ${s.overlayTo}`} />
          </Link>
        </div>
      ))}

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-10 flex flex-col md:flex-row items-start md:items-center justify-between px-4 sm:px-5 md:px-12 lg:px-20 py-7 sm:py-8 md:py-0 gap-5 md:gap-6">
        {/* Left Side Content */}
        <div
          key={`left-${current}`}
          className="max-w-xl text-white flex flex-col items-start text-left pr-7 md:pr-0"
          style={{ animation: 'slideUp 0.6s ease forwards' }}
        >
          {/* Badge */}
          {/* <p className="mb-2.5 sm:mb-3 text-[10px] sm:text-sm font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white">
            <span className="mr-2 text-red-600">//</span>
            {slide.badge}
            <span className="ml-2 text-red-600">//</span>
          </p> */}

          {/* Heading */}
          {/* <h1 className="mb-3 sm:mb-5 text-[2rem] sm:text-4xl lg:text-6xl font-black uppercase italic leading-[0.92]">
            {slide.heading.split("\n").map((line, index) => (
              <span
                key={index}
                className={`block ${index % 2 === 0 ? "text-white" : "text-red-600"}`}
              >
                {line}
              </span>
            ))}
          </h1> */}

          {/* Features */}
          {/* {slide.subheading && (
            <div className="mb-4 sm:mb-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-base text-white/90 justify-start max-w-[19rem]">
              {slide.subheading.split("|").map((item, index) => (
                <span key={index}>
                  {item.trim()}
                </span>
              ))}
            </div>
          )} */}

          {/* Optional Box */}
          {/* {slide.boxTitle && (
            <div className="mb-6 max-w-sm rounded-xl border border-white/30 bg-black/40 p-4 backdrop-blur-sm">
              <h3 className="text-xl font-bold uppercase">
                {slide.boxTitle}
              </h3>

              {slide.boxSubtitle && (
                <p className="mt-1 text-md italic text-red-500">
                  {slide.boxSubtitle}
                </p>
              )}
            </div>
          )} */}

          {/* Buttons */}
          {/* <div className="flex w-full flex-wrap items-center gap-2.5 sm:gap-4 justify-start">
            {slide.secondaryCta && (
              <Link
                to={slide.ctaPath}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 px-4 sm:px-6 py-2.5 sm:py-3 font-bold text-xs sm:text-sm uppercase text-white transition hover:border-red-500 hover:text-red-500"
              >
                {slide.secondaryCta}
                <FiArrowRight size={16} />
              </Link>
            )}

            <Link
              to={slide.ctaPath}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#10354a] to-[#cf531f] hover:opacity-90 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-xs sm:text-sm transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              {slide.cta}
              <FiArrowRight size={16} />
            </Link>
          </div> */}
        </div>

        {slide.tags && slide.tags.length > 0 && (
          <div className="w-[calc(100%-1.5rem)] max-w-xs overflow-hidden rounded-2xl border border-white/20 bg-black/55 p-3 shadow-2xl backdrop-blur-md sm:max-w-sm md:max-w-md">
            <p className="mb-2.5 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-red-500 sm:text-xs">
              <span className="h-2 w-2 rounded-full bg-red-600" />
              {slide.tagsTitle || 'Select Model:'}
            </p>

            <div className="w-full overflow-hidden">
              <div className="animate-tags-marquee flex w-max flex-nowrap gap-2.5">
                {[...slide.tags, ...slide.tags].map((tag, index) => (
                  <Link
                    key={`${tag.label}-${index}`}
                    to={tag.path}
                    className="flex shrink-0 items-center justify-center rounded-xl border border-white/20 bg-linear-to-r from-[#10354a] to-[#cf531f] px-3.5 py-2 text-center text-[10px] font-extrabold uppercase tracking-wider text-white transition-all duration-200 hover:scale-105 hover:from-red-600 hover:to-red-700 hover:border-white active:scale-95 sm:text-xs"
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes tagsMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-tags-marquee {
          animation: tagsMarquee 24s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroBanner;
