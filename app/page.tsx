'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from './LanguageContext';
import LanguageSwitcher from './components/LanguageSwitcher';
import AnimatedSection from './components/AnimatedSection';
import { sendFormEmail } from './actions/sendEmail';

// View types for SPA navigation
type ViewType = 'home' | 'partner' | 'courier';

export default function Home() {
  const { t } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [partnerFormStatus, setPartnerFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [courierFormStatus, setCourierFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    setLoaded(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = (view: ViewType) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`flex flex-col min-h-screen overflow-x-hidden grain-overlay font-sans transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`} style={{backgroundColor:'#FAFAFA', color:'#1A1A1A'}}>
      {/* Custom styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-slide-up { animation: slideUp 0.5s ease-out forwards; }
        .btn-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-hover:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 10px 20px -10px rgba(208, 40, 40, 0.5);
        }
        .card-hover {
          transition: all 0.4s ease;
        }
        .card-hover:hover {
          transform: translateY(-8px) rotate(-1deg);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
        }
        .clip-shape-1 { clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%); }
        .clip-shape-2 { clip-path: polygon(0 15%, 100% 0, 100% 100%, 0 100%); }
        .form-input {
          width: 100%;
          padding: 1rem 1.25rem;
          background-color: #F4F4F5;
          border: 2px solid transparent;
          border-radius: 1rem;
          font-size: 1rem;
          transition: all 0.2s ease;
          outline: none;
          color: #1A1A1A;
        }
        .form-input::placeholder {
          color: #9CA3AF;
        }
        .form-input:focus {
          border-color: #D02828;
          background-color: #FFFFFF;
          box-shadow: 0 4px 14px 0 rgba(208, 40, 40, 0.1);
        }
        .nav-link { position: relative; }
        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: #D02828;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after, .nav-link.active::after { width: 100%; }
        .page-view {
          display: none;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }
        .page-view.active {
          display: block;
          opacity: 1;
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`} id="navbar">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('home')}>
              <div className=" rounded-lg flex items-center justify-center mr-3 relative overflow-hidden group">
                <Image src="/logo.png" alt="Tsakharlia Logo" width={200} height={200}  className="transform group-hover:scale-110 transition-transform"/>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <button onClick={() => navigate('home')} className={`nav-btn font-semibold text-sm uppercase tracking-wide transition-colors nav-link cursor-pointer ${currentView === 'home' ? 'active text-brand' : 'text-gray-600 hover:text-brand'}`} style={currentView === 'home' ? {color:'#D02828'} : {}}>{t.nav.order}</button>
              <button onClick={() => navigate('partner')} className={`nav-btn font-semibold text-sm uppercase tracking-wide transition-colors nav-link cursor-pointer ${currentView === 'partner' ? 'active text-brand' : 'text-gray-600 hover:text-brand'}`} style={currentView === 'partner' ? {color:'#D02828'} : {}}>{t.nav.partnerWithUs}</button>
              <button onClick={() => navigate('courier')} className={`nav-btn font-semibold text-sm uppercase tracking-wide transition-colors nav-link cursor-pointer ${currentView === 'courier' ? 'active text-brand' : 'text-gray-600 hover:text-brand'}`} style={currentView === 'courier' ? {color:'#D02828'} : {}}>{t.nav.rideWithUs}</button>
              
              {/* Language Switcher */}
              <div className="ml-4 pl-4 border-l border-gray-200">
                <LanguageSwitcher />
              </div>
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="text-gray-900 font-semibold hover:text-brand transition-colors cursor-pointer">{t.nav.login}</button>
              <Link href="/download" className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-brand transition-colors btn-hover flex items-center gap-2 cursor-pointer" style={{backgroundColor:'#1A1A1A'}}>
                {t.nav.getApp} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-900 hover:text-brand focus:outline-none cursor-pointer">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl">
            <div className="px-4 pt-2 pb-6 space-y-1">
              <Link href="/download" className="block w-full text-left px-3 py-4 text-base font-bold text-gray-900 hover:bg-gray-50 border-b border-gray-50 cursor-pointer">{t.nav.orderFood}</Link>
              <button onClick={() => navigate('partner')} className="block w-full text-left px-3 py-4 text-base font-bold text-gray-900 hover:bg-gray-50 border-b border-gray-50 cursor-pointer">{t.nav.partner}</button>
              <button onClick={() => navigate('courier')} className="block w-full text-left px-3 py-4 text-base font-bold text-gray-900 hover:bg-gray-50 border-b border-gray-50 cursor-pointer">{t.nav.courier}</button>
              
              {/* Mobile Language Switcher */}
              <div className="pt-4 pb-2 border-t border-gray-50">
                <div className="px-3">
                  <LanguageSwitcher />
                </div>
              </div>
              
              <div className="pt-4 px-3">
                <Link href="/download" className="w-full bg-brand text-white px-6 py-3 rounded-xl font-bold mt-2 block text-center cursor-pointer" style={{backgroundColor:'#D02828'}}>{t.nav.getApp}</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <div className="pt-20">

        {/* ================= HOME VIEW (CONSUMER) ================= */}
        <main className={`page-view ${currentView === 'home' ? 'active' : ''}`}>
          
          {/* Hero Section (Asymmetric) */}
          <section className="relative bg-white overflow-hidden pb-20 pt-10 lg:pt-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
              <div className="grid lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Content (Takes more space - 7 cols) */}
                <div className="lg:col-span-7 z-10 animate-slide-up">
                  {/* Live badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm mb-6" style={{backgroundColor:'#FDE8E9', color:'#D02828'}}>
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{backgroundColor:'#D02828'}}></span>
                      <span className="relative inline-flex rounded-full h-3 w-3" style={{backgroundColor:'#D02828'}}></span>
                    </span>
                    {t.hero.badge}
                  </div>

                  {/* Heading */}
                  <h1 className="text-6xl md:text-7xl lg:text-[5rem] font-black leading-[1.05] tracking-tight mb-6">
                    {t.hero.title}{' '}
                    <span className="relative inline-block" style={{color:'#D02828'}}>
                      {t.hero.titleHighlight}
                      {/* Decorative underline */}
                      <svg className="absolute w-full h-4 -bottom-2 left-0 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none" style={{color:'#FDE8E9'}}>
                        <path d="M0,5 Q50,10 100,0" stroke="currentColor" strokeWidth="8" fill="none" />
                      </svg>
                    </span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xl text-gray-600 mb-10 max-w-lg font-light">{t.hero.subtitle}</p>

                  {/* Search/Action Asymmetric Box */}
                  <div className="bg-white p-4 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col sm:flex-row gap-3 max-w-xl relative">
                    {/* Decorative dot */}
                    <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full z-20" style={{backgroundColor:'#D02828'}}></div>

                    <div className="relative flex-grow flex items-center rounded-2xl px-4 py-3" style={{backgroundColor:'#F4F4F5'}}>
                      <svg className="w-6 h-6 mr-3 flex-shrink-0" style={{color:'#D02828'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input type="text" placeholder={t.hero.placeholder} className="bg-transparent w-full outline-none text-lg font-medium text-gray-900 placeholder-gray-400" />
                    </div>
                    <button className="text-white px-8 py-4 rounded-2xl font-bold text-lg whitespace-nowrap btn-hover flex items-center justify-center gap-2 cursor-pointer" style={{backgroundColor:'#D02828'}}>
                      {t.hero.findFood}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </button>
                  </div>
                </div>

                {/* Right Content - Premium 3D Phone Hero */}
                <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center min-h-[700px]">

                  {/* Background Glow */}
                  <div
                    className="absolute w-[520px] h-[520px] rounded-full blur-3xl opacity-20 animate-pulse"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(208,40,40,0.45) 0%, rgba(208,40,40,0) 70%)",
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
                    <div
                      className="absolute -left-24 top-24 bg-white/90 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-2xl px-5 py-4 flex items-center gap-3 rotate-[-8deg]"
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: "#FDE8E9" }}
                      >
                        <svg
                          className="w-6 h-6"
                          style={{ color: "#D02828" }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 1v11m0 0a3 3 0 003-3V5a3 3 0 10-6 0v4a3 3 0 003 3zm0 0v4m-4 0h8"
                          />
                        </svg>
                      </div>

                      <div>
                        <p className="font-bold text-gray-900">Voice Orders</p>
                        <p className="text-sm text-gray-500">Order naturally</p>
                      </div>
                    </div>

                    {/* Floating Badge - Live Tracking */}
                    <div
                      className="absolute -right-24 bottom-28 bg-gray-900 text-white shadow-2xl rounded-2xl px-5 py-4 rotate-[8deg]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <span
                            className="absolute inset-0 rounded-full animate-ping opacity-75"
                            style={{ backgroundColor: "#D02828" }}
                          />
                          <span
                            className="relative block w-3 h-3 rounded-full"
                            style={{ backgroundColor: "#D02828" }}
                          />
                        </div>

                        <div>
                          <p className="font-semibold">Live Tracking</p>
                          <p className="text-xs text-gray-400">Driver nearby</p>
                        </div>
                      </div>
                    </div>

                    {/* Main Phone */}
                    <div
                      className="
                        relative
                        w-[290px]
                        h-[600px]
                        rounded-[3.5rem]
                        bg-black
                        border-[10px]
                        border-black
                        shadow-[0_50px_120px_-20px_rgba(0,0,0,0.45)]
                        rotate-[6deg]
                        overflow-hidden
                      "
                    >

                      {/* Gloss Reflection */}
                      <div
                        className="absolute inset-0 z-30 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 35%, rgba(255,255,255,0) 60%)",
                        }}
                      />

                      {/* Dynamic Island */}

                      {/* Screenshot Container */}
                      <div className="relative w-full h-full bg-[#D02828] flex items-center justify-center overflow-hidden rounded-[2.8rem] ">

                        {/* Replace with your actual app screenshot */}
                        <img
                          src="/iconp.png"
                          alt="Tsakhar Lia App"
                          className="w-[50%] object-cover"
                        />

                        {/* Overlay Gradient */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.18), rgba(0,0,0,0))",
                          }}
                        />

                        {/* Floating In-App Card */}

                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Features Grid (Monochrome gray tones + Red accents) */}
          <section className="py-24 bg-gray-50 clip-shape-2 relative mt-10" style={{backgroundColor:'#FAFAFA'}}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-black mb-4">{t.features.title}</h2>
                  <p className="text-xl text-gray-500 max-w-2xl mx-auto">{t.features.subtitle}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-white p-10 rounded-[2.5rem] card-hover relative overflow-hidden group">
                  <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-brand transition-colors duration-500" style={{backgroundColor:'#F4F4F5'}}>
                    <svg className="w-10 h-10 text-gray-900  transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                    <h3 className="text-2xl font-bold mb-4">{t.features.lightningFast.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-light">{t.features.lightningFast.description}</p>
                </div>
                
                {/* Feature 2 (Offset slightly for asymmetry) */}
                <div className="bg-white p-10 rounded-[2.5rem] card-hover relative overflow-hidden group md:mt-12">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -z-10 transition-transform group-hover:scale-150" style={{backgroundColor:'#FDE8E9'}}></div>
                  <div className="w-20 h-20 bg-brand text-white rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-brand/30" style={{backgroundColor:'#D02828'}}>
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                  </div>
                    <h3 className="text-2xl font-bold mb-4">{t.features.localFavorites.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-light">{t.features.localFavorites.description}</p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white p-10 rounded-[2.5rem] card-hover relative overflow-hidden group">
                  <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-gray-900 transition-colors duration-500" style={{backgroundColor:'#F4F4F5'}}>
                    <svg className="w-10 h-10 text-gray-900  transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                    <h3 className="text-2xl font-bold mb-4">{t.features.friendlyService.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-light">{t.features.friendlyService.description}</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* ================= PARTNER VIEW ================= */}
        <main className={`page-view ${currentView === 'partner' ? 'active' : ''}`}>
          <section className="py-12 lg:py-20 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-50 -z-10 clip-shape-1" style={{backgroundColor:'#FDE8E9'}}></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                
                {/* Text/Value Prop */}
                <div className="order-2 lg:order-1">
                  <span className="text-brand font-bold tracking-wider uppercase text-sm" style={{color:'#D02828'}}>{t.partner.badge}</span>
                  <h1 className="text-5xl md:text-6xl font-black mt-4 mb-6 leading-tight">{t.partner.title}</h1>
                  <p className="text-xl text-gray-600 mb-8 font-light">{t.partner.subtitle}</p>
                  
                  <ul className="space-y-6 mb-10">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center mt-1 mr-4" style={{backgroundColor:'#1A1A1A'}}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold">{t.partner.boostRevenue.title}</h4>
                        <p className="text-gray-500 text-sm mt-1">{t.partner.boostRevenue.description}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center mt-1 mr-4" style={{backgroundColor:'#1A1A1A'}}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
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
                  <div className="absolute -right-4 -bottom-4 w-full h-full bg-brand rounded-[2.5rem] z-0 hidden md:block" style={{backgroundColor:'#D02828'}}></div>
                  
                  <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative z-10 border border-gray-100">
                    <h3 className="text-3xl font-extrabold mb-2">{t.partner.getStarted}</h3>
                    <p className="text-gray-500 mb-8 font-medium">{t.partner.businessInfo}</p>

                    <form className="space-y-5" onSubmit={async (e) => {
                      e.preventDefault();
                      setPartnerFormStatus('submitting');
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
                      setPartnerFormStatus(result.success ? 'success' : 'error');
                    }}>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <input type="text" name="firstName" placeholder={t.partner.firstName} className="form-input" required/>
                        </div>
                        <div>
                          <input type="text" name="lastName" placeholder={t.partner.lastName} className="form-input" required/>
                        </div>
                      </div>
                      <div>
                        <input type="text" name="businessName" placeholder={t.partner.businessName} className="form-input" required/>
                      </div>
                      <div>
                        <select name="businessType" className="form-input text-gray-600 cursor-pointer" required>
                          <option value="" disabled selected>{t.partner.businessType}</option>
                          <option value="restaurant">Restaurant / Cafe</option>
                          <option value="grocery">Grocery Store</option>
                          <option value="convenience">Convenience Store</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <input type="email" name="email" placeholder={t.partner.email} className="form-input" required/>
                      </div>
                      <div>
                        <input type="tel" name="phone" placeholder={t.partner.phone} className="form-input" required/>
                      </div>
                      {partnerFormStatus === 'success' ? (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                          <p className="text-green-800 font-semibold">Application submitted successfully! We'll contact you soon.</p>
                        </div>
                      ) : partnerFormStatus === 'error' ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                          <p className="text-red-800 font-semibold">Failed to submit. Please try again or email us directly.</p>
                        </div>
                      ) : (
                        <>
                          <button type="submit" disabled={partnerFormStatus === 'submitting'} className="w-full bg-gray-900 hover:bg-brand text-white font-bold text-lg py-4 rounded-xl btn-hover mt-4 cursor-pointer disabled:opacity-50" style={{backgroundColor:'#1A1A1A'}}>
                            {partnerFormStatus === 'submitting' ? 'Submitting...' : t.partner.submit}
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

        {/* ================= COURIER VIEW ================= */}
        <main className={`page-view ${currentView === 'courier' ? 'active' : ''}`}>
          <section className="py-12 lg:py-20 bg-gray-900 text-white min-h-[80vh] flex items-center relative overflow-hidden" style={{backgroundColor:'#1A1A1A'}}>
            {/* Large graphic element */}
            <svg className="absolute -right-20 -bottom-20 text-gray-800 opacity-20 -rotate-12 pointer-events-none" width="400" height="400" viewBox="0 0 24 24" fill="currentColor" style={{width:'30rem', height:'30rem'}}>
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
              <div className="grid lg:grid-cols-12 gap-16 items-center">
                
                {/* Text */}
                <div className="lg:col-span-7">
                  <h1 className="text-5xl md:text-7xl font-black mb-6">{t.courier.title}</h1>
                  <p className="text-2xl text-gray-300 mb-8 font-light max-w-xl">{t.courier.subtitle}</p>
                  
                  <div className="grid sm:grid-cols-2 gap-6 mt-12">
                    <div className="bg-gray-800/50 p-6 rounded-2xl backdrop-blur-sm border border-gray-700">
                        <svg className="w-12 h-12 text-brand mb-4" style={{color:'#D02828'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      <h4 className="font-bold text-xl mb-2">{t.courier.flexibleHours.title}</h4>
                      <p className="text-gray-400 text-sm">{t.courier.flexibleHours.description}</p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-2xl backdrop-blur-sm border border-gray-700">
                        <svg className="w-12 h-12 text-brand mb-4" style={{color:'#D02828'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 0h10M3 21h18a2 2 0 002-2V5a2 2 0 00-2-2H3a2 2 0 00-2 2v14a2 2 0 002 2z"/>
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
                      setCourierFormStatus('submitting');
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
                      setCourierFormStatus(result.success ? 'success' : 'error');
                    }}>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" name="firstName" placeholder={t.courier.firstName} className="form-input bg-gray-50 border-gray-200" required/>
                        <input type="text" name="lastName" placeholder={t.courier.lastName} className="form-input bg-gray-50 border-gray-200" required/>
                      </div>
                      <input type="email" name="email" placeholder={t.courier.email} className="form-input bg-gray-50 border-gray-200" required/>
                      <input type="tel" name="phone" placeholder={t.courier.phone} className="form-input bg-gray-50 border-gray-200" required/>
                      
                      <div className="relative">
                        <select name="deliveryMethod" className="form-input bg-gray-50 border-gray-200 text-gray-600 appearance-none" required>
                          <option value="" disabled selected>{t.courier.deliveryMethod}</option>
                          <option value="car">Car</option>
                          <option value="scooter">Motorcycle / Scooter</option>
                          <option value="bike">Bicycle</option>
                        </select>
                        <svg className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                        </svg>
                      </div>
                      
                      <input type="text" name="city" placeholder={t.courier.city} className="form-input bg-gray-50 border-gray-200" required/>

                      {courierFormStatus === 'success' ? (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                          <p className="text-green-800 font-semibold">Application submitted successfully! We'll contact you soon.</p>
                        </div>
                      ) : courierFormStatus === 'error' ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                          <p className="text-red-800 font-semibold">Failed to submit. Please try again or email us directly.</p>
                        </div>
                      ) : (
                        <button type="submit" disabled={courierFormStatus === 'submitting'} className="w-full bg-brand hover:bg-brand-dark text-white font-bold text-lg py-4 rounded-xl btn-hover mt-6 shadow-lg shadow-brand/30 cursor-pointer disabled:opacity-50" style={{backgroundColor:'#D02828'}}>
                          {courierFormStatus === 'submitting' ? 'Submitting...' : t.courier.next}
                        </button>
                      )}
                    </form>
                  </div>
                </div>

              </div>
            </div>
          </section>
        </main>

      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div className="col-span-2 md:col-span-1">
              <div className="flex items-center mb-6">
                <div className="rounded flex items-center justify-center mr-2">
                  <Image src="/logo.png" alt="Tsakharlia Logo" width={200} height={200} />
                </div>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-brand hover:text-white transition-all duration-200 cursor-pointer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-brand hover:text-white transition-all duration-200 cursor-pointer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-brand hover:text-white transition-all duration-200 cursor-pointer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-brand transition-colors cursor-pointer">{t.footer.about}</a></li>
                <li><a href="#" className="hover:text-brand transition-colors cursor-pointer">{t.footer.careers}</a></li>
                <li><a href="#" className="hover:text-brand transition-colors cursor-pointer">{t.footer.blog}</a></li>
                <li><a href="#" className="hover:text-brand transition-colors cursor-pointer">{t.footer.contact}</a></li>
              </ul>
            </div>

            <div>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" onClick={() => navigate('partner')} className="hover:text-brand transition-colors cursor-pointer">{t.footer.addRestaurant}</a></li>
                <li><a href="#" onClick={() => navigate('courier')} className="hover:text-brand transition-colors cursor-pointer">{t.footer.signUpDeliver}</a></li>
                <li><a href="#" className="hover:text-brand transition-colors cursor-pointer">{t.footer.businessApp}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Get the app</h4>
              <div className="space-y-3">
                <a href="https://apps.apple.com/app/tsakhar-lia/id6758496073" target="_blank" rel="noopener noreferrer" className="w-full bg-gray-900 text-white rounded-xl px-4 py-2 flex items-center hover:bg-brand transition-colors cursor-pointer" style={{backgroundColor:'#1A1A1A'}}>
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  <div className="text-left">
                    <div className="text-[10px] leading-none text-gray-300">Download on the</div>
                    <div className="font-bold text-sm leading-tight">{t.footer.downloadAppStore}</div>
                  </div>
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.tsakharliya.tsakharliya&hl=en" target="_blank" rel="noopener noreferrer" className="w-full bg-gray-900 text-white rounded-xl px-4 py-2 flex items-center hover:bg-brand transition-colors cursor-pointer" style={{backgroundColor:'#1A1A1A'}}>
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 010 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>
                  <div className="text-left">
                    <div className="text-[10px] leading-none text-gray-300">GET IT ON</div>
                    <div className="font-bold text-sm leading-tight">{t.footer.downloadPlayStore}</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-medium">
            <p>{t.footer.copyright}</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-gray-900 cursor-pointer">{t.footer.privacy}</a>
              <a href="#" className="hover:text-gray-900 cursor-pointer">{t.footer.terms}</a>
              <a href="#" className="hover:text-gray-900 cursor-pointer">{t.footer.pricing}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}