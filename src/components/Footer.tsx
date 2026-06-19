import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiMail, FiPhone } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import logoImg from '../assets/images/logo.jpeg';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <footer className="bg-[#8B0000] text-white">

      {/* ── Main footer grid ─────────────────────────────────────────────── */}
      <div className="w-full px-6 sm:px-10 lg:px-16 pt-10 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Col 1: Brand ──────────────────────────────────────────────── */}
          <div>
            {/* Logo */}
            <div className="mb-5">
              <img
                src={logoImg}
                alt="Afzal Bikerz Studio"
                className="h-20 w-auto object-contain rounded"
              />
            </div>

            {/* Address */}
            <div className="flex items-start gap-2 text-red-100 text-sm mb-3">
              <FiMapPin size={15} className="mt-0.5 flex-shrink-0 text-red-300" />
              <span>K-Block Street#3 Corner Shop<br />Motorcycle Market, Attock</span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-2 text-red-100 text-sm mb-3">
              <FiMail size={14} className="flex-shrink-0 text-red-300" />
              <a
                href="mailto:Afzalbikerzstudio@gmail.com"
                className="hover:text-white transition-colors"
              >
                rehanqureshi@gmail.com
              </a>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2 text-red-100 text-sm mb-5">
              <FiPhone size={14} className="flex-shrink-0 text-red-300" />
              <a
                href="tel:+923335959318"
                className="hover:text-white transition-colors"
              >
                +923048405899
              </a>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF size={14} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={14} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors"
                aria-label="TikTok"
              >
                <FaTiktok size={14} />
              </a>
            </div>
          </div>

          {/* ── Col 2: Quick Links ────────────────────────────────────────── */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Shop All',               to: '/products' },
                { label: 'All collections',        to: '/products' },
                { label: 'CG 125 Fancy Fuel Tanks', to: '/products' },
                { label: 'CD 70 Fancy Fuel Tanks',  to: '/products' },
                { label: 'Search',                  to: '/products' },
                { label: 'Silencers',               to: '/products' },
                { label: 'Profile',                 to: '/profile'  },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-red-100 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Customer Support ───────────────────────────────────── */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">
              Customer Support
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Refund Policy',       to: '#' },
                { label: 'Shipping Policy',     to: '#' },
                { label: 'Contact Information', to: '#' },
                { label: 'About Us',            to: '#' },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-red-100 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 4: Newsletter ─────────────────────────────────────────── */}
          <div>
            <h4 className="text-white font-bold text-base mb-2 tracking-wide">
              Newsletter Signup
            </h4>
            <p className="text-red-100 text-sm mb-4 leading-relaxed">
              Subscribe to our newsletter and get 10% off your first purchase
            </p>
            <form onSubmit={handleSubscribe} className="flex items-center">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email addr..."
                required
                className="flex-1 min-w-0 text-sm px-3 py-2.5 rounded-l-md bg-white/10 border border-white/20 text-white placeholder-red-300 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-colors"
              />
              <button
                type="submit"
                className="flex-shrink-0 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-r-md transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────────────────────── */}
      <div className="border-t border-white/20 px-6 sm:px-10 lg:px-16 py-4">
        <p className="text-center text-red-200 text-xs">
          Copyright © 2026{' '}
          <span className="text-white font-semibold">Afzal Bikers Store</span>{' '}
          all rights reserved.
        </p>
      </div>

    </footer>
  );
};

export default Footer;