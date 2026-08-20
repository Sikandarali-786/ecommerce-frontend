import React from 'react';
import {
  FiRefreshCw,
  FiMail,
  FiAlertTriangle,
  FiPackage,
  FiDollarSign,
  FiMapPin
} from 'react-icons/fi';

const RefundPolicyPage: React.FC = () => {
  const contactEmail = "Afzalbikerzstore@gmail.com";

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#10354a] to-[#cf531f] rounded-2xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <FiRefreshCw className="w-64 h-64 text-white" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide uppercase mb-4 text-[#ffcfb0]">
              <FiRefreshCw className="w-4 h-4" /> Customer Satisfaction Policy
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              Refund Policy
            </h1>
            <p className="text-slate-100 text-base sm:text-lg leading-relaxed font-light">
              We have a <span className="font-semibold text-white underline decoration-[#ffcfb0] decoration-2 underline-offset-4">7-day return policy</span>,
              which means you have 7 days after receiving your item to request a return.
            </p>
          </div>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-100 space-y-10">

          {/* Overview & Eligibility Section */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="w-8 h-8 rounded-lg bg-orange-50 text-[#cf531f] flex items-center justify-center font-bold text-base shrink-0">
                1
              </span>
              Return Eligibility
            </h2>
            <p className="text-slate-600 leading-relaxed">
              To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.
            </p>
          </section>

          {/* How to Start a Return */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="w-8 h-8 rounded-lg bg-orange-50 text-[#cf531f] flex items-center justify-center font-bold text-base shrink-0">
                2
              </span>
              Starting a Return
            </h2>
            <p className="text-slate-600 leading-relaxed">
              To start a return, you can contact us at{' '}
              <a
                href={`mailto:${contactEmail}`}
                className="font-semibold text-[#cf531f] hover:underline"
              >
                {contactEmail}
              </a>
              . Please note that returns will need to be sent to the following address:
            </p>

            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 text-slate-700">
              <FiMapPin className="w-5 h-5 text-[#cf531f] shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-bold text-slate-900 block mb-1">Return Shipping Address:</span>
                <span className="text-slate-600 italic block mb-1"></span>
                <span className="text-xs text-slate-500">(Zam Zam Autos Decoration Hussain a Gahi Road Multan)</span>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed">
              If your return is accepted, we’ll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.
            </p>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center gap-3 text-blue-900 text-sm">
              <FiMail className="w-5 h-5 text-blue-600 shrink-0" />
              <span>
                You can always contact us for any return question at{' '}
                <a href={`mailto:${contactEmail}`} className="font-semibold underline">
                  {contactEmail}
                </a>.
              </span>
            </div>
          </section>

          {/* Damages and Issues */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <FiAlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
              Damages and Issues
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.
            </p>
          </section>

          {/* Exceptions / Non-returnable items */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <FiPackage className="w-6 h-6 text-red-500 shrink-0" />
              Exceptions / Non-Returnable Items
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Certain types of items cannot be returned, like perishable goods (such as food, flowers, or plants), custom products (such as special orders or personalized items), and personal care goods (such as beauty products). We also do not accept returns for hazardous materials, flammable liquids, or gases. Please get in touch if you have questions or concerns about your specific item.
            </p>
            <div className="p-4 rounded-xl bg-red-50/60 border border-red-100 text-red-800 text-sm font-medium">
              Unfortunately, we cannot accept returns on sale items or gift cards.
            </div>
          </section>

          {/* Exchanges */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <FiRefreshCw className="w-6 h-6 text-teal-600 shrink-0" />
              Exchanges
            </h2>
            <p className="text-slate-600 leading-relaxed">
              The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.
            </p>
          </section>

          {/* Refunds */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <FiDollarSign className="w-6 h-6 text-emerald-600 shrink-0" />
              Refunds
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method within 10 business days. Please remember it can take some time for your bank or credit card company to process and post the refund too.
            </p>
            <p className="text-slate-600 leading-relaxed">
              If more than 15 business days have passed since we’ve approved your return, please contact us at{' '}
              <a
                href={`mailto:${contactEmail}`}
                className="font-semibold text-[#cf531f] hover:underline"
              >
                {contactEmail}
              </a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
