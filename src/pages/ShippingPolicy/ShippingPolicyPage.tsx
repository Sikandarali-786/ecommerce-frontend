import React from 'react';
import {
  FiTruck,
  FiClock,
  FiMapPin,
  FiPhone,
  FiPackage,
  FiAlertCircle,
  FiCheckCircle,
} from 'react-icons/fi';

const ShippingPolicyPage: React.FC = () => {
  const contactEmail = "Afzalbikerzstudio@gmail.com";
  const contactPhone = "+923048405899";

  const deliverySteps = [
    { icon: FiPackage, label: 'Order Placed', desc: 'Your order is confirmed and being prepared.' },
    { icon: FiTruck, label: 'Dispatched', desc: 'Your package is handed over to the courier.' },
    { icon: FiCheckCircle, label: 'Delivered', desc: 'Package arrives at your doorstep within 3–5 working days.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#10354a] to-[#cf531f] rounded-2xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <FiTruck className="w-72 h-72 text-white" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide uppercase mb-4 text-[#ffcfb0]">
              <FiTruck className="w-4 h-4" /> Fast &amp; Reliable Delivery
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              Shipping Policy
            </h1>
            <p className="text-slate-100 text-base sm:text-lg leading-relaxed font-light">
              We will deliver orders in{' '}
              <span className="font-semibold text-white underline decoration-[#ffcfb0] decoration-2 underline-offset-4">
                3 to 5 Working Days
              </span>{' '}
              across Pakistan.
            </p>
          </div>
        </div>

        {/* Delivery Timeline Visual */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-100">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 border-b border-slate-100 pb-3 mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="hidden sm:block absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-0.5 bg-gradient-to-r from-[#10354a] via-[#cf531f]/60 to-[#cf531f]" />

            {deliverySteps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center relative z-10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#10354a] to-[#cf531f] text-white flex items-center justify-center shadow-lg mb-4">
                  <step.icon className="w-7 h-7" />
                </div>
                <span className="text-sm font-bold text-slate-900 mb-1">{step.label}</span>
                <span className="text-xs text-slate-500 leading-snug">{step.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-100 space-y-10">

          {/* Delivery Time */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="w-8 h-8 rounded-lg bg-orange-50 text-[#cf531f] flex items-center justify-center font-bold text-base shrink-0">1</span>
              Delivery Time
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We process all orders within <span className="font-semibold text-slate-800">1–2 business days</span> of confirmation. After dispatch, your order will be delivered within <span className="font-semibold text-slate-800">3 to 5 working days</span> depending on your location within Pakistan.
            </p>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900 text-sm">
              <FiClock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Estimated Delivery:</strong> 3–5 Working Days from dispatch. Remote areas may take slightly longer.
              </span>
            </div>
          </section>

          {/* Coverage Area */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="w-8 h-8 rounded-lg bg-orange-50 text-[#cf531f] flex items-center justify-center font-bold text-base shrink-0">2</span>
              Coverage Area
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We deliver to all major cities and towns across Pakistan. This includes but is not limited to Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, and other cities.
            </p>
            <div className="flex items-start gap-3 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700">
              <FiMapPin className="w-5 h-5 text-[#cf531f] shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-bold text-slate-900 block mb-1">Our Store Location:</span>
                <span className="text-slate-600">Zam Zam Autos Decoration, Hussain a Gahi Road, Multan</span>
              </div>
            </div>
          </section>

          {/* Shipping Charges */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="w-8 h-8 rounded-lg bg-orange-50 text-[#cf531f] flex items-center justify-center font-bold text-base shrink-0">3</span>
              Shipping Charges
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Shipping charges are calculated at checkout based on your delivery location and the size/weight of your order. We aim to keep our shipping charges as low as possible to provide the best value for our customers.
            </p>
          </section>

          {/* Tracking */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="w-8 h-8 rounded-lg bg-orange-50 text-[#cf531f] flex items-center justify-center font-bold text-base shrink-0">4</span>
              Order Tracking
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Once your order is dispatched, you will be notified via phone or WhatsApp with tracking details. You can monitor your order status directly in your account under <strong className="text-slate-800">My Orders</strong>.
            </p>
          </section>

          {/* Delays Notice */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <FiAlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
              Delays &amp; Issues
            </h2>
            <p className="text-slate-600 leading-relaxed">
              In rare cases, deliveries may be delayed due to weather conditions, public holidays, or courier-related issues. If your order has not arrived within the expected timeframe, please contact us and we'll look into it right away.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#cf531f]/40 hover:bg-orange-50/30 transition-all text-sm"
              >
                <span className="w-9 h-9 rounded-lg bg-[#cf531f]/10 text-[#cf531f] flex items-center justify-center shrink-0">
                  <FiPackage className="w-4 h-4" />
                </span>
                <div>
                  <span className="block font-semibold text-slate-800">Email Us</span>
                  <span className="text-slate-500 text-xs">{contactEmail}</span>
                </div>
              </a>
              <a
                href={`tel:${contactPhone}`}
                className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#cf531f]/40 hover:bg-orange-50/30 transition-all text-sm"
              >
                <span className="w-9 h-9 rounded-lg bg-[#cf531f]/10 text-[#cf531f] flex items-center justify-center shrink-0">
                  <FiPhone className="w-4 h-4" />
                </span>
                <div>
                  <span className="block font-semibold text-slate-800">Call / WhatsApp</span>
                  <span className="text-slate-500 text-xs">{contactPhone}</span>
                </div>
              </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;
