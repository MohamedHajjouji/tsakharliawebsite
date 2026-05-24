'use client';

import { useLanguage } from '../LanguageContext';
import { languages } from '../translations';

export default function LanguageSwitcher() {
  const { language, setLanguage, dir } = useLanguage();

  const getCurrentLanguageName = () => {
    const currentLang = languages.find(l => l.code === language);
    return currentLang?.nativeName || language.toUpperCase();
  };

  // For RTL, we need to position the dropdown on the left side
  const dropdownPosition = dir === 'rtl' ? 'left-0' : 'right-0';

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100/80 hover:bg-gray-200 transition-all duration-200 text-sm font-semibold border border-transparent hover:border-gray-300"
        aria-label="Switch language"
      >
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span className="text-gray-700">{getCurrentLanguageName()}</span>
        <svg className="w-3 h-3 text-gray-500 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className={`absolute ${dropdownPosition} mt-2 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50`}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`w-full text-left px-4 py-3 text-sm transition-all duration-150 flex items-center gap-3 ${
              language === lang.code 
                ? 'bg-red-50 text-red-600 font-semibold' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${language === lang.code ? 'bg-red-600' : 'bg-gray-300'}`} />
            <span className="font-medium">{lang.nativeName}</span>
            <span className={`text-xs uppercase ml-auto ${language === lang.code ? 'text-red-400' : 'text-gray-400'}`}>
              {lang.code}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
