'use client';

import { Translation } from '../translations';
import { sendFormEmail } from '../actions/sendEmail';
import { useState } from 'react';

interface CourierSectionProps {
  t: Translation;
  isActive: boolean;
}

export default function CourierSection({ t, isActive }: CourierSectionProps) {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  return (
    <main className={`page-view ${isActive ? 'active' : ''}`}>
      <section className="py-12 lg:py-20 bg-gray-900 text-white min-h-[80vh] flex items-center relative overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
        {/* Large graphic element */}
        <svg className="absolute -right-20 -bottom-20 text-gray-800 opacity-20 -rotate-12 pointer-events-none" width="400" height="400" viewBox="0 0 24 24" fill="currentColor" style={{ width: '30rem', height: '30rem' }}>
          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Text */}
            <div className="lg:col-span-7">
              <h1 className="text-5xl md:text-7xl font-black mb-6">{t.courier.title}</h1>
              <p className="text-2xl text-gray-300 mb-8 font-light max-w-xl">{t.courier.subtitle}</p>
              <div className="grid sm:grid-cols-2 gap-6 mt-12">
                <div className="bg-gray-800/50 p-6 rounded-2xl backdrop-blur-sm border border-gray-700">
                  <svg className="w-12 h-12 text-brand mb-4" style={{ color: '#D02828' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="font-bold text-xl mb-2">{t.courier.flexibleHours.title}</h4>
                  <p className="text-gray-400 text-sm">{t.courier.flexibleHours.description}</p>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-2xl backdrop-blur-sm border border-gray-700">
                  <svg className="w-12 h-12 text-brand mb-4" style={{ color: '#D02828' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 0h10M3 21h18a2 2 0 002-2V5a2 2 0 00-2-2H3a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <h4 className="font-bold text-xl mb-2">{t.courier.fastEarnings.title}</h4>
                  <p className="text-gray-400 text-sm">{t.courier.fastEarnings.description}</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-5">
              <div className="bg-white text-gray-900 p-8 md:p-10 rounded-[2rem] shadow-2xl transform md:-rotate-2 hover:rotate-0 transition-transform duration-500">
                <h3 className="text-2xl font-black mb-6 text-center">{t.courier.signUp}</h3>
                <form className="space-y-4" onSubmit={async (e) => {
                  e.preventDefault();
                  setFormStatus('submitting');
                  const formData = new FormData(e.currentTarget);
                  const result = await sendFormEmail({
                    type: 'delivery',
                    name: `${formData.get('firstName')} ${formData.get('lastName')}`,
                    email: formData.get('email') as string,
                    phone: formData.get('phone') as string,
                    vehicleType: formData.get('deliveryMethod') as string,
                    city: formData.get('city') as string,
                    message: `Delivery worker application from ${formData.get('firstName')} ${formData.get('lastName')} in ${formData.get('city')}`,
                  });
                  setFormStatus(result.success ? 'success' : 'error');
                }}>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="firstName" placeholder={t.courier.firstName} className="form-input bg-gray-50 border-gray-200" required />
                    <input type="text" name="lastName" placeholder={t.courier.lastName} className="form-input bg-gray-50 border-gray-200" required />
                  </div>
                  <input type="email" name="email" placeholder={t.courier.email} className="form-input bg-gray-50 border-gray-200" required />
                  <input type="tel" name="phone" placeholder={t.courier.phone} className="form-input bg-gray-50 border-gray-200" required />
                  <div className="relative">
                    <select name="deliveryMethod" defaultValue="" className="form-input bg-gray-50 border-gray-200 text-gray-600 appearance-none" required>
                      <option value="" disabled>{t.courier.deliveryMethod}</option>
                      <option value="car">Car</option>
                      <option value="scooter">Motorcycle / Scooter</option>
                      <option value="bike">Bicycle</option>
                    </select>
                    <svg className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <input type="text" name="city" placeholder={t.courier.city} className="form-input bg-gray-50 border-gray-200" required />
                  {formStatus === 'success' ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                      <p className="text-green-800 font-semibold">Application submitted successfully! We'll contact you soon.</p>
                    </div>
                  ) : formStatus === 'error' ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                      <p className="text-red-800 font-semibold">Failed to submit. Please try again or email us directly.</p>
                    </div>
                  ) : (
                    <button type="submit" disabled={formStatus === 'submitting'} className="w-full bg-brand hover:bg-brand-dark text-white font-bold text-lg py-4 rounded-xl btn-hover mt-6 shadow-lg shadow-brand/30 cursor-pointer disabled:opacity-50" style={{ backgroundColor: '#D02828' }}>
                      {formStatus === 'submitting' ? 'Submitting...' : t.courier.next}
                    </button>
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