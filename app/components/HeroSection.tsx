'use client';

import { Translation } from '../translations';

interface HeroSectionProps {
  t: Translation;
}

export default function HeroSection({ t }: HeroSectionProps) {
  return (
    <main className="page-view active">
      {/* Hero Section (Asymmetric) */}
      <section className="relative bg-white overflow-hidden pb-20 pt-10 lg:pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Content (Takes more space - 7 cols) */}
            <div className="lg:col-span-7 z-10 animate-slide-up">
              {/* Live badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm mb-6" style={{ backgroundColor: '#FDE8E9', color: '#D02828' }}>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#D02828' }}></span>
                  <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: '#D02828' }}></span>
                </span>
                {t.hero.badge}
              </div>

              {/* Heading */}
              <h1 className="text-6xl md:text-7xl lg:text-[5rem] font-black leading-[1.05] tracking-tight mb-6">
                {t.hero.title}{' '}
                <span className="relative inline-block" style={{ color: '#D02828' }}>
                  {t.hero.titleHighlight}
                  {/* Decorative underline */}
                  <svg className="absolute w-full h-4 -bottom-2 left-0 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none" style={{ color: '#FDE8E9' }}>
                    <path d="M0,5 Q50,10 100,0" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-gray-600 mb-10 max-w-lg font-light">{t.hero.subtitle}</p>

              {/* Search/Action Asymmetric Box */}
              <div className="bg-white p-4 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col sm:flex-row gap-3 max-w-xl relative">
                {/* Decorative dot */}
                <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full z-20" style={{ backgroundColor: '#D02828' }}></div>

                <div className="relative flex-grow flex items-center rounded-2xl px-4 py-3" style={{ backgroundColor: '#F4F4F5' }}>
                  <svg className="w-6 h-6 mr-3 flex-shrink-0" style={{ color: '#D02828' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input type="text" placeholder={t.hero.placeholder} className="bg-transparent w-full outline-none text-lg font-medium text-gray-900 placeholder-gray-400" />
                </div>
                <button className="text-white px-8 py-4 rounded-2xl font-bold text-lg whitespace-nowrap btn-hover flex items-center justify-center gap-2 cursor-pointer" style={{ backgroundColor: '#D02828' }}>
                  {t.hero.findFood}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </div>

            {/* Right Content - Premium 3D Phone Hero */}
            <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center min-h-[700px]">
              {/* Background Glow */}
              <div
                className="absolute w-[520px] h-[520px] rounded-full blur-3xl opacity-20 animate-pulse"
                style={{
                  background: "radial-gradient(circle, rgba(208,40,40,0.45) 0%, rgba(208,40,40,0) 70%)",
                }}
              />

              {/* Large Abstract Shape */}
              <div
                className="absolute right-[-80px] top-[-40px] w-[420px] h-[420px] rounded-[80px] rotate-12 opacity-10"
                style={{ backgroundColor: "#D02828" }}
              />

              {/* Floating Decorative Orb */}
              <div
                className="absolute top-20 left-10 w-20 h-20 rounded-full blur-2xl opacity-40 animate-float"
                style={{ backgroundColor: "#D02828" }}
              />

              {/* Floating Decorative Orb */}
              <div
                className="absolute bottom-24 right-0 w-28 h-28 rounded-full blur-3xl opacity-20 animate-float"
                style={{
                  backgroundColor: "#D02828",
                  animationDelay: "1.5s",
                }}
              />

              {/* Phone Wrapper */}
              <div className="relative z-20 animate-float">
                {/* Floating Badge - Voice Ordering */}
                <div className="absolute -left-24 top-24 bg-white/90 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-2xl px-5 py-4 flex items-center gap-3 rotate-[-8deg]">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#FDE8E9" }}>
                    <svg className="w-6 h-6" style={{ color: "#D02828" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1v11m0 0a3 3 0 003-3V5a3 3 0 10-6 0v4a3 3 0 003 3zm0 0v4m-4 0h8" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Voice Orders</p>
                    <p className="text-sm text-gray-500">Order naturally</p>
                  </div>
                </div>

                {/* Floating Badge - Live Tracking */}
                <div className="absolute -right-24 bottom-28 bg-gray-900 text-white shadow-2xl rounded-2xl px-5 py-4 rotate-[8deg]">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <span className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: "#D02828" }} />
                      <span className="relative block w-3 h-3 rounded-full" style={{ backgroundColor: "#D02828" }} />
                    </div>
                    <div>
                      <p className="font-semibold">Live Tracking</p>
                      <p className="text-xs text-gray-400">Driver nearby</p>
                    </div>
                  </div>
                </div>

                {/* Main Phone */}
                <div className="relative w-[290px] h-[600px] rounded-[3.5rem] bg-black border-[10px] border-black shadow-[0_50px_120px_-20px_rgba(0,0,0,0.45)] rotate-[6deg] overflow-hidden">
                  {/* Gloss Reflection */}
                  <div className="absolute inset-0 z-30 pointer-events-none"
                    style={{ background: "linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 35%, rgba(255,255,255,0) 60%)" }}
                  />
                  {/* Screenshot Container */}
                  <div className="relative w-full h-full bg-[#D02828] flex items-center justify-center overflow-hidden rounded-[2.8rem]">
                    <img src="/iconp.png" alt="Tsakhar Lia App" className="w-[50%] object-cover" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.18), rgba(0,0,0,0))" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid (Monochrome gray tones + Red accents) */}
      <section className="py-24 bg-gray-50 clip-shape-2 relative mt-10" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">{t.features.title}</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">{t.features.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-10 rounded-[2.5rem] card-hover relative overflow-hidden group">
              <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-brand transition-colors duration-500" style={{ backgroundColor: '#F4F4F5' }}>
                <svg className="w-10 h-10 text-gray-900 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">{t.features.lightningFast.title}</h3>
              <p className="text-gray-600 leading-relaxed font-light">{t.features.lightningFast.description}</p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white p-10 rounded-[2.5rem] card-hover relative overflow-hidden group md:mt-12">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -z-10 transition-transform group-hover:scale-150" style={{ backgroundColor: '#FDE8E9' }}></div>
              <div className="w-20 h-20 bg-brand text-white rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-brand/30" style={{ backgroundColor: '#D02828' }}>
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">{t.features.localFavorites.title}</h3>
              <p className="text-gray-600 leading-relaxed font-light">{t.features.localFavorites.description}</p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white p-10 rounded-[2.5rem] card-hover relative overflow-hidden group">
              <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-gray-900 transition-colors duration-500" style={{ backgroundColor: '#F4F4F5' }}>
                <svg className="w-10 h-10 text-gray-900 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">{t.features.friendlyService.title}</h3>
              <p className="text-gray-600 leading-relaxed font-light">{t.features.friendlyService.description}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}