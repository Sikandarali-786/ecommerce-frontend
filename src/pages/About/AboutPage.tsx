import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiChevronRight,
  FiTarget,
  FiMapPin,
  FiStar,
  FiShield,
  FiTruck,
  FiUsers,
  FiPackage,
  FiZap,
} from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';

const AboutPage: React.FC = () => {
  const products = [
    'Fuel Tanks (Custom & Genuine)',
    'Indicators',
    'Silencers',
    'Helmets',
    'Bike Outfits',
    'Modification Parts',
    'Accessories',
    'Honda 125 Genuine Spare Parts',
    'Honda CD 70 Genuine Parts',
  ];

  const sections = [
    {
      icon: FiUsers,
      title: 'Who We Are',
      color: 'text-[#10354a]',
      bg: 'bg-[#10354a]/5',
      iconBg: 'from-[#10354a] to-[#1a5276]',
      content: (
        <p className="text-slate-600 leading-relaxed">
          Afzal Bikerz Store is your go-to place for all things biking! Since{' '}
          <strong className="text-slate-800">1983</strong>, we've been making Honda bikes awesome in{' '}
          <strong className="text-slate-800">Multan, Punjab, Pakistan</strong>, and beyond. Meet our
          chief, <strong className="text-slate-800">AL-Haaj Muhammad Afzal Qureshi</strong>, the brains behind our
          fantastic bike magic!
        </p>
      ),
    },
    {
      icon: FiTarget,
      title: 'Our Mission',
      color: 'text-[#cf531f]',
      bg: 'bg-orange-50',
      iconBg: 'from-[#cf531f] to-orange-500',
      content: (
        <p className="text-slate-600 leading-relaxed">
          Dedicated to elevating your biking experience, we strive to provide high-quality products
          that blend innovation with functionality. Afzal Bikerz Store is not just a business;
          it's a commitment to the biking community. Imagine having the coolest bike in town! We
          Provide high-quality <strong className="text-slate-800">bike Spare Parts and </strong>,{' '}
          <strong className="text-slate-800">modification parts</strong>{' '}
          <strong className="text-slate-800">accessories</strong> Across Pakistan. From{' '}
          <strong className="text-slate-800">shiny fuel tanks</strong> to{' '}
          <strong className="text-slate-800">super cool helmets</strong>, we've got Each and everything to
          make your bike stand out!
        </p>
      ),
    },
    {
      icon: FiMapPin,
      title: 'Where to Find Us',
      color: 'text-violet-700',
      bg: 'bg-violet-50',
      iconBg: 'from-violet-600 to-purple-600',
      content: (
        <p className="text-slate-600 leading-relaxed">
          Afzal Bikerz Store lives in the heart of{' '}
          <strong className="text-slate-800">Multan, Punjab, Pakistan</strong> — This store of ours reflects our forefathers. Afzal Bikerz Store is more than just a destination. It's a
          hub where bike enthusiasts converge to explore the latest trends and innovations in the
          biking world.
        </p>
      ),
    },
    {
      icon: FiStar,
      title: 'Area of Expertise',
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      iconBg: 'from-amber-500 to-yellow-500',
      content: (
        <p className="text-slate-600 leading-relaxed">
          Afzal Bikerz Studio specializes in{' '}
          <strong className="text-slate-800">All Bikes</strong> and{' '}
          <strong className="text-slate-800">Honda CD 70 or CG 125 Genuine Parts</strong>. We understand the
          value of authenticity, and our commitment to providing genuine parts sets us apart in the
          market. The real deal! No fuss, just genuine parts for your beloved ride.
        </p>
      ),
    },
    {
      icon: FiShield,
      title: 'Quality Assurance',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      iconBg: 'from-emerald-600 to-teal-600',
      content: (
        <p className="text-slate-600 leading-relaxed">
          At Afzal Bikerz Studio, quality is non-negotiable. At Afzal Bikerz Studio, quality is non-negotiable. We source our products from reputable suppliers around the globe,
           We fully understand the importance of genuine parts, and our commitment to supplying them sets us apart from others in the market. we deliver your gear in a flash!
        </p>
      ),
    },
    {
      icon: FiTruck,
      title: 'Nationwide Delivery',
      color: 'text-sky-700',
      bg: 'bg-sky-50',
      iconBg: 'from-sky-600 to-blue-600',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            Ready to roll? Head to our{' '}
            <Link
              to="/products"
              className="font-bold text-[#cf531f] underline decoration-[#cf531f]/40 hover:decoration-[#cf531f] transition-all"
            >
              store NOW
            </Link>{' '}
            and pick your favorites! Plus, the first 50 customers get an exclusive surprise, because
            you're awesome!
          </p>
          <p className="text-slate-600 leading-relaxed">
            We understand that the love for biking knows no boundaries. That's why we extend our
            services beyond Attock, reaching every corner of Pakistan. Afzal Bikerz Studio is
            committed to bringing the best biking experience to enthusiasts across the nation.
          </p>
        </>
      ),
    },
    {
      icon: FiUsers,
      title: 'Join the Afzal Bikerz Community',
      color: 'text-rose-700',
      bg: 'bg-rose-50',
      iconBg: 'from-rose-500 to-pink-500',
      content: (
        <p className="text-slate-600 leading-relaxed">
          Afzal Bikerz Store is not just a store; it's a community of like-minded individuals who
          share a passion for biking. Connect with us on social media, participate in events, and
          stay updated on the latest trends in the biking world.
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#10354a] to-[#cf531f] rounded-2xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-widest uppercase mb-5 text-[#ffcfb0]">
              <FiZap className="w-3.5 h-3.5" /> Since 1983
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 uppercase leading-tight">
              Welcome to Afzal Bikerz Store
            </h1>
            <div className="w-16 h-1 bg-[#ffcfb0] rounded-full mx-auto mb-5" />
            <p className="text-slate-100 text-base sm:text-lg italic font-light tracking-wide">
              Where Passion Meets Precision
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-5">
          {sections.map((sec) => (
            <div
              key={sec.title}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sec.iconBg} text-white flex items-center justify-center shadow-sm shrink-0`}>
                  <sec.icon className="w-5 h-5" />
                </div>
                <h2 className={`text-xl sm:text-2xl font-bold ${sec.color}`}>{sec.title}</h2>
              </div>
              <div className="pl-0 sm:pl-13">{sec.content}</div>
            </div>
          ))}
        </div>

        {/* Product Range */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10354a] to-[#cf531f] text-white flex items-center justify-center shadow-sm shrink-0">
              <FiPackage className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Our Product Range</h2>
          </div>
          <p className="text-slate-600 leading-relaxed mb-6">
            Afzal Bikerz Store is your one-stop destination for all your biking needs. Whether
            you're looking for customized Spare parts tanks to express your individuality or{' '}
            <strong className="text-slate-800">genuine fuel tanks</strong> to ensure optimal
            performance, we have it all. <strong className="text-slate-800">Indicators</strong>,{' '}
            <strong className="text-slate-800">silencers</strong>, and{' '}
            <strong className="text-slate-800">Modification Lights</strong> — each product in our inventory is
            curated with precision and passion. Living far away? No worries! We deliver anywhere in
            Pakistan. Just imagine your dream bike accessories at your doorstep with Afzal Bikerz
            Store!
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {products.map((p) => (
              <div
                key={p}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 font-medium"
              >
                <span className="w-2 h-2 rounded-full bg-gradient-to-br from-[#10354a] to-[#cf531f] shrink-0" />
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* CTA / Ready Set Ride */}
        <div className="bg-gradient-to-r from-[#10354a] to-[#cf531f] rounded-2xl p-8 sm:p-10 text-white text-center shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight">Ready, Set, Ride! 🏍️</h2>
            <p className="text-slate-100 text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-6">
              Your dream biking adventure starts with Afzal Bikerz Studio. Don't miss out — let the
              biking magic begin!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <Link
                to="/products"
                className="px-8 py-3 bg-white text-[#cf531f] font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-lg text-sm"
              >
                Shop Now →
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3 bg-white/10 border border-white/25 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors text-sm backdrop-blur-md"
              >
                Contact Us
              </Link>
            </div>
            <p className="mt-6 text-[#ffcfb0] text-xs italic font-medium">
              Afzal Bikerz Studio — Your Journey Begins Here.
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 text-center">
          <h3 className="text-base font-bold text-slate-900 mb-4">Follow Us on Social Media</h3>
          <div className="flex justify-center gap-4">
            <a
              href="https://www.facebook.com/share/1EPHNehFik/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm"
              aria-label="Facebook"
            >
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/afzalbikerzstore?igsh=cWd5YXVsemRzZ3M0&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
              aria-label="Instagram"
            >
              <FaInstagram className="w-4 h-4" />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-colors shadow-sm"
              aria-label="TikTok"
            >
              <FaTiktok className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;