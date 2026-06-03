'use client';

import Image from 'next/image';
import { Translation } from '../translations';

type ViewType = 'home' | 'partner' | 'courier';

interface SiteFooterProps {
  t: Translation;
  navigate: (view: ViewType) => void;
}

export default function SiteFooter({ t, navigate }: SiteFooterProps) {
  return (
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
              <a href="https://apps.apple.com/app/tsakhar-lia/id6758496073" target="_blank" rel="noopener noreferrer" className="w-full bg-gray-900 text-white rounded-xl px-4 py-2 flex items-center hover:bg-brand transition-colors cursor-pointer" style={{ backgroundColor: '#1A1A1A' }}>
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                <div className="text-left">
                  <div className="text-[10px] leading-none text-gray-300">Download on the</div>
                  <div className="font-bold text-sm leading-tight">{t.footer.downloadAppStore}</div>
                </div>
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.tsakharliya.tsakharliya&hl=en" target="_blank" rel="noopener noreferrer" className="w-full bg-gray-900 text-white rounded-xl px-4 py-2 flex items-center hover:bg-brand transition-colors cursor-pointer" style={{ backgroundColor: '#1A1A1A' }}>
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
  );
}