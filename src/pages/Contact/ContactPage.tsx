import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiBriefcase,
  FiChevronRight,
  FiMessageCircle,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const ContactPage: React.FC = () => {
  const contactDetails = [
    {
      icon: FiBriefcase,
      label: 'Trade Name',
      value: 'Afzal Bikerz Store',
      color: 'from-[#10354a] to-[#1a5276]',
      bg: 'bg-[#10354a]/5',
      border: 'border-[#10354a]/10',
      textColor: 'text-[#10354a]',
      action: null,
    },
    {
      icon: FiPhone,
      label: 'Phone Number',
      value: '03048405899',
      color: 'from-emerald-600 to-teal-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      textColor: 'text-emerald-700',
      action: { href: 'tel:03048405899', text: 'Call Now' },
    },
    {
      icon: FiMail,
      label: 'Email',
      value: 'Afzalbikerzstudio@gmail.com',
      color: 'from-[#cf531f] to-orange-500',
      bg: 'bg-orange-50',
      border: 'border-orange-100',
      textColor: 'text-[#cf531f]',
      action: { href: 'mailto:Afzalbikerzstudio@gmail.com', text: 'Send Email' },
    },
    {
      icon: FiMapPin,
      label: 'Physical Address',
      value: 'Zam Zam Autoz Hussain a Gahi Road ,Multan ,Pakistan',
      color: 'from-violet-600 to-purple-600',
      bg: 'bg-violet-50',
      border: 'border-violet-100',
      textColor: 'text-violet-700',
      action: {
        href: 'https://maps.google.com/?q=Imtiaz+Autos+Attock+City+Attock+43600+Pakistan',
        text: 'View on Map',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-[#cf531f] transition-colors">Home</Link>
          <FiChevronRight className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-slate-800">Contact Information</span>
        </nav>

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#10354a] to-[#cf531f] rounded-2xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <FiMessageCircle className="w-72 h-72 text-white" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide uppercase mb-4 text-[#ffcfb0]">
              <FiPhone className="w-4 h-4" /> We're Here to Help
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              Contact Information
            </h1>
            <p className="text-slate-100 text-base sm:text-lg leading-relaxed font-light">
              Have a question or need help? Reach out to us anytime — we're happy to assist you.
            </p>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {contactDetails.map((item) => (
            <div
              key={item.label}
              className={`bg-white rounded-2xl p-6 shadow-sm border ${item.border} flex flex-col gap-4 hover:shadow-md transition-shadow`}
            >
              {/* Icon + Label */}
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-sm`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {item.label}
                </span>
              </div>

              {/* Value */}
              <p className={`text-base sm:text-lg font-semibold ${item.textColor} leading-snug break-words`}>
                {item.value}
              </p>

              {/* Action Button */}
              {item.action && (
                <a
                  href={item.action.href}
                  target={item.action.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`mt-auto self-start text-sm font-semibold px-4 py-2 rounded-lg ${item.bg} ${item.textColor} hover:opacity-80 transition-opacity border ${item.border}`}
                >
                  {item.action.text} →
                </a>
              )}
            </div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-green-500 text-white flex items-center justify-center shadow-lg shrink-0">
            <FaWhatsapp className="w-9 h-9" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Chat with us on WhatsApp</h3>
            <p className="text-slate-500 text-sm">
              Get instant support — message us directly and we'll get back to you as soon as possible.
            </p>
          </div>
          <a
            href="https://wa.me/923135070072"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-3 rounded-xl bg-green-500 text-white font-bold text-sm hover:bg-green-600 transition-colors shadow-md"
          >
            Open WhatsApp
          </a>
        </div>

        {/* Business Hours */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <span className="w-2 h-6 rounded-full bg-gradient-to-b from-[#10354a] to-[#cf531f] inline-block" />
            Business Hours
          </h2>
          <div className="space-y-3">
            {[
              { day: 'Monday – Friday', hours: '9:00 AM – 7:00 PM' },
              { day: 'Saturday', hours: '10:00 AM – 6:00 PM' },
              { day: 'Sunday', hours: 'Closed' },
            ].map((row) => (
              <div
                key={row.day}
                className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0"
              >
                <span className="text-sm font-medium text-slate-700">{row.day}</span>
                <span
                  className={`text-sm font-semibold ${
                    row.hours === 'Closed' ? 'text-red-500' : 'text-[#cf531f]'
                  }`}
                >
                  {row.hours}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
