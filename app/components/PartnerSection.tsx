'use client';

import { Translation } from '../translations';
import { sendFormEmail } from '../actions/sendEmail';
import { useState } from 'react';

interface PartnerSectionProps {
  t: Translation;
  isActive: boolean;
}

export default function PartnerSection({ t, isActive }: PartnerSectionProps) {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  return (
    <main className={`page-view ${isActive ? 'active' : ''}`}>
      <section className="py-12 lg:py-20 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-50 -z-10 clip-shape-1" style={{ backgroundColor: '#FDE8E9' }}></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text/Value Prop */}
            <div className="order-2 lg:order-1">
              <span className="text-brand font-bold tracking-wider uppercase text-sm" style={{ color: '#D02828' }}>{t.partner.badge}</span>
              <h1 className="text-5xl md:text-6xl font-black mt-4 mb-6 leading-tight">{t.partner.title}</h1>
              <p className="text-xl text-gray-600 mb-8 font-light">{t.partner.subtitle}</p>

              <ul className="space-y-6 mb-10">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center mt-1 mr-4" style={{ backgroundColor: '#1A1A1A' }}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">{t.partner.boostRevenue.title}</h4>
                    <p className="text-gray-500 text-sm mt-1">{t.partner.boostRevenue.description}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center mt-1 mr-4" style={{ backgroundColor: '#1A1A1A' }}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">{t.partner.seamlessDelivery.title}</h4>
                    <p className="text-gray-500 text-sm mt-1">{t.partner.seamlessDelivery.description}</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Form Container (Asymmetric styling) */}
            <div className="order-1 lg:order-2 relative">
              {/* Offset red square behind form */}
              <div className="absolute -right-4 -bottom-4 w-full h-full bg-brand rounded-[2.5rem] z-0 hidden md:block" style={{ backgroundColor: '#D02828' }}></div>

              <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative z-10 border border-gray-100">
                <h3 className="text-3xl font-extrabold mb-2">{t.partner.getStarted}</h3>
                <p className="text-gray-500 mb-8 font-medium">{t.partner.businessInfo}</p>

                <form className="space-y-5" onSubmit={async (e) => {
                  e.preventDefault();
                  setFormStatus('submitting');
                  const formData = new FormData(e.currentTarget);
                  const result = await sendFormEmail({
                    type: 'partner',
                    name: `${formData.get('firstName')} ${formData.get('lastName')}`,
                    email: formData.get('email') as string,
                    phone: formData.get('phone') as string,
                    storeName: formData.get('businessName') as string,
                    category: formData.get('businessType') as string,
                    message: `Partner application from ${formData.get('businessName')} - ${formData.get('firstName')} ${formData.get('lastName')}`,
                  });
                  setFormStatus(result.success ? 'success' : 'error');
                }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div><input type="text" name="firstName" placeholder={t.partner.firstName} className="form-input" required /></div>
                    <div><input type="text" name="lastName" placeholder={t.partner.lastName} className="form-input" required /></div>
                  </div>
                  <div><input type="text" name="businessName" placeholder={t.partner.businessName} className="form-input" required /></div>
                  <div>
                    <select name="businessType" defaultValue="" className="form-input text-gray-600 cursor-pointer" required>
                      <option value="" disabled>{t.partner.businessType}</option>
                      <option value="restaurant">Restaurant / Cafe</option>
                      <option value="grocery">Grocery Store</option>
                      <option value="convenience">Convenience Store</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div><input type="email" name="email" placeholder={t.partner.email} className="form-input" required /></div>
                  <div><input type="tel" name="phone" placeholder={t.partner.phone} className="form-input" required /></div>
                  {formStatus === 'success' ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                      <p className="text-green-800 font-semibold">Application submitted successfully! We'll contact you soon.</p>
                    </div>
                  ) : formStatus === 'error' ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                      <p className="text-red-800 font-semibold">Failed to submit. Please try again or email us directly.</p>
                    </div>
                  ) : (
                    <>
                      <button type="submit" disabled={formStatus === 'submitting'} className="w-full bg-gray-900 hover:bg-brand text-white font-bold text-lg py-4 rounded-xl btn-hover mt-4 cursor-pointer disabled:opacity-50" style={{ backgroundColor: '#1A1A1A' }}>
                        {formStatus === 'submitting' ? 'Submitting...' : t.partner.submit}
                      </button>
                      <p className="text-xs text-center text-gray-400 mt-4">{t.partner.terms}</p>
                    </>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}