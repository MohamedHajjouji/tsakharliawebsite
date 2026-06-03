'use client';

import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';
import { Translation } from '../translations';

type ViewType = 'home' | 'partner' | 'courier';

interface NavigationProps {
  currentView: ViewType;
  navigate: (view: ViewType) => void;
  scrolled: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  t: Translation;
}

export default function Navigation({
  currentView,
  navigate,
  scrolled,
  mobileMenuOpen,
  setMobileMenuOpen,
  t,
}: NavigationProps) {
  return (
    <nav className={`fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`} id="navbar">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('home')}>
            <div className="rounded-lg flex items-center justify-center mr-3 relative overflow-hidden group">
              <Image src="/logo.png" alt="Tsakharlia Logo" width={200} height={200} className="transform group-hover:scale-110 transition-transform" />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <button onClick={() => navigate('home')} className={`nav-btn font-semibold text-sm uppercase tracking-wide transition-colors nav-link cursor-pointer ${currentView === 'home' ? 'active text-brand' : 'text-gray-600 hover:text-brand'}`} style={currentView === 'home' ? { color: '#D02828' } : {}}>{t.nav.order}</button>
            <button onClick={() => navigate('partner')} className={`nav-btn font-semibold text-sm uppercase tracking-wide transition-colors nav-link cursor-pointer ${currentView === 'partner' ? 'active text-brand' : 'text-gray-600 hover:text-brand'}`} style={currentView === 'partner' ? { color: '#D02828' } : {}}>{t.nav.partnerWithUs}</button>
            <button onClick={() => navigate('courier')} className={`nav-btn font-semibold text-sm uppercase tracking-wide transition-colors nav-link cursor-pointer ${currentView === 'courier' ? 'active text-brand' : 'text-gray-600 hover:text-brand'}`} style={currentView === 'courier' ? { color: '#D02828' } : {}}>{t.nav.rideWithUs}</button>

            {/* Language Switcher */}
            <div className="ml-4 pl-4 border-l border-gray-200">
              <LanguageSwitcher />
            </div>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-900 font-semibold hover:text-brand transition-colors cursor-pointer">{t.nav.login}</button>
            <Link href="/download" className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-brand transition-colors btn-hover flex items-center gap-2 cursor-pointer" style={{ backgroundColor: '#1A1A1A' }}>
              {t.nav.getApp} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-900 hover:text-brand focus:outline-none cursor-pointer">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
              <Link href="/download" className="w-full bg-brand text-white px-6 py-3 rounded-xl font-bold mt-2 block text-center cursor-pointer" style={{ backgroundColor: '#D02828' }}>{t.nav.getApp}</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}