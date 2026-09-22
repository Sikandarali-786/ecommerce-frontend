import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

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
    overlayFrom: 'from-black/60',
    overlayTo: 'to-transparent',
  },
];

const AUTOPLAY_INTERVAL = 4000;

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((index: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(index);
    setTimeout(() => setAnimating(false), 800);
  }, [animating]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  // Autoplay
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next]);

  const slide = slides[current];

  return (
    <section
      className="hero-banner relative w-full overflow-hidden bg-black min-h-125 h-[clamp(500px,100vw,600px)] md:min-h-105 md:h-[clamp(420px,55vw,600px)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
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
          <img
            src={s.image}
            alt={""}
            className="w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${s.overlayFrom} ${s.overlayTo}`} />
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
          <p className="mb-2.5 sm:mb-3 text-[10px] sm:text-sm font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white">
            <span className="mr-2 text-red-600">//</span>
            {slide.badge}
            <span className="ml-2 text-red-600">//</span>
          </p>

          {/* Heading */}
          <h1 className="mb-3 sm:mb-5 text-[2rem] sm:text-4xl lg:text-6xl font-black uppercase italic leading-[0.92]">
            {slide.heading.split("\n").map((line, index) => (
              <span
                key={index}
                className={`block ${index % 2 === 0 ? "text-white" : "text-red-600"}`}
              >
                {line}
              </span>
            ))}
          </h1>

          {/* Features */}
          {slide.subheading && (
            <div className="mb-4 sm:mb-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-base text-white/90 justify-start max-w-[19rem]">
              {slide.subheading.split("|").map((item, index) => (
                <span key={index}>
                  {item.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Optional Box */}
          {slide.boxTitle && (
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
          )}

          {/* Buttons */}
          <div className="flex w-full flex-wrap items-center gap-2.5 sm:gap-4 justify-start">
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
          </div>
        </div>

        {/* Right Side Content (Marquee Buttons Box) */}
        {slide.tags && slide.tags.length > 0 && (
          <div
            key={`right-${current}`}
                className="w-[calc(100%-1.5rem)] md:w-auto max-w-xs sm:max-w-sm md:max-w-md overflow-hidden p-3 sm:p-4 rounded-2xl bg-black/55 border border-white/20 backdrop-blur-md shadow-2xl self-start md:self-center mt-0 md:mt-0"
            style={{ animation: 'slideUp 0.6s ease forwards' }}
          >
            <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-red-500 mb-2.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              {slide.tagsTitle || 'Select Model:'}
            </p>

                <div className="overflow-x-auto scrollbar-hide w-full relative">
              <div className="animate-marquee flex flex-row items-center gap-2.5">
                {[...slide.tags, ...slide.tags].map((tag, idx) => (
                  <Link
                    key={idx}
                    to={tag.path}
                        className="flex shrink-0 items-center justify-center px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#10354a] to-[#cf531f] hover:from-red-600 hover:to-red-700 border border-white/20 hover:border-white text-white font-extrabold text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-105 active:scale-95 text-center whitespace-nowrap"
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Prev / Next arrows ────────────────────────────────────────── */}
      <button
        onClick={prev}
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <FiChevronLeft size={22} />
      </button>
      <button
        onClick={next}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <FiChevronRight size={22} />
      </button>

      {/* ── Dot indicators ────────────────────────────────────────────── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all rounded-full ${i === current
              ? 'bg-white w-7 h-2.5'
              : 'bg-white/50 hover:bg-white/80 w-2.5 h-2.5'
              }`}
          />
        ))}
      </div>

      {/* ── Progress bar ──────────────────────────────────────────────── */}
      {!isPaused && (
        <div className="absolute bottom-0 left-0 z-20 h-0.5 bg-gradient-to-r from-[#10354a] to-[#cf531f]"
          style={{
            animation: `progressBar ${AUTOPLAY_INTERVAL}ms linear`,
            animationIterationCount: 1,
          }}
        />
      )}

      {/* ── Keyframe styles injected inline ───────────────────────────── */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 14s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default HeroBanner;
