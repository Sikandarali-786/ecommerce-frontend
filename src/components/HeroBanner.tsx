import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import tankImg from '../assets/images/fueltank_banner.png';
import rimsImg from '../assets/images/rimlight_banner.png';
import silencersImg from '../assets/images/silencer_banner.png';
import decorationImg from '../assets/images/decoration.jpeg';

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
    cta: 'Shop Silencers',
    ctaPath: '/products',
    overlayFrom: 'from-black/65',
    overlayTo: 'to-transparent',
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

const AUTOPLAY_INTERVAL = 2000;

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
      className="relative w-full overflow-hidden bg-black"
      style={{ height: 'clamp(320px, 55vw, 600px)' }}
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
          <div className={`absolute inset-0 bg-linear-to-r ${s.overlayFrom} ${s.overlayTo}`} />
        </div>
      ))}

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-10 flex items-center px-5 md:px-12 lg:px-20">
        <div
          key={current}
       className="max-w-2xl text-white"
          style={{ animation: 'slideUp 0.6s ease forwards' }}
        >
          {/* Badge */}
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-white">
            <span className="mr-2 text-red-600">//</span>

            {slide.badge}

            <span className="ml-2 text-red-600">//</span>
          </p>

          {/* Heading */}
          <h1 className="mb-5 text-4xl sm:text-5xl lg:text-7xl font-black uppercase italic leading-[0.9]">
            {slide.heading.split("\n").map((line, index) => (
              <span
                key={index}
                className={`block ${index % 2 === 0 ? "text-white" : "text-red-600"
                  }`}
              >
                {line}
              </span>
            ))}
          </h1>

          {/* Features */}
          {slide.subheading && (
            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm sm:text-base text-white/90">
              {slide.subheading.split("|").map((item, index) => (
                <span key={index}>
                  {item.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Optional Box */}
          {slide.boxTitle && (
            <div className="mb-8 max-w-sm rounded border border-white/30 bg-black/20 p-5 backdrop-blur-sm">
              <h3 className="text-2xl font-bold uppercase">
                {slide.boxTitle}
              </h3>

              {slide.boxSubtitle && (
                <p className="mt-2 text-lg italic text-red-500">
                  {slide.boxSubtitle}
                </p>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">

            {/* <Link
              to={slide.ctaPath}
              className="inline-flex items-center gap-2 rounded bg-red-600 px-6 py-3 font-bold uppercase transition hover:bg-red-700"
            >
              {/* {slide.cta} */}
              {/* <FiArrowRight /> */}
            {/* </Link> */} 

            {slide.secondaryCta && (
              <Link
                to={slide.ctaPath}
                className="inline-flex items-center gap-2 rounded border border-white/40 px-6 py-3 font-bold uppercase text-white transition hover:border-red-500 hover:text-red-500"
              >
                {slide.secondaryCta}
                <FiArrowRight />
              </Link>
            )}

          </div>
          {/* CTA */}
          <Link
            to={slide.ctaPath}
            className="inline-flex items-center gap-2 bg-linear-to-r from-[#10354a] to-[#cf531f] hover:opacity-90 text-white px-6 py-3 rounded-lg font-bold text-sm transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
          >
            {slide.cta}
            <FiArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* ── Prev / Next arrows ────────────────────────────────────────── */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <FiChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm"
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
        <div className="absolute bottom-0 left-0 z-20 h-0.5 bg-linear-to-r from-[#10354a] to-[#cf531f]"
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
      `}</style>
    </section>
  );
};

export default HeroBanner;
