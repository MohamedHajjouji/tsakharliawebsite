'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import PartnerSection from './components/PartnerSection';
import CourierSection from './components/CourierSection';
import SiteFooter from './components/SiteFooter';

// View types for SPA navigation
type ViewType = 'home' | 'partner' | 'courier';

export default function Home() {
  const { t } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

      <Navigation
        currentView={currentView}
        navigate={navigate}
        scrolled={scrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        t={t}
      />

      {/* Main Content Area */}
      <div className="pt-20">
        {/* ================= HOME VIEW (CONSUMER) ================= */}
        {currentView === 'home' && <HeroSection t={t} />}

        {/* ================= PARTNER VIEW ================= */}
        <PartnerSection t={t} isActive={currentView === 'partner'} />

        {/* ================= COURIER VIEW ================= */}
        <CourierSection t={t} isActive={currentView === 'courier'} />
      </div>

      <SiteFooter t={t} navigate={navigate} />
    </div>
  );
}