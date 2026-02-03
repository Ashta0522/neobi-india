'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  getTranslations,
  Translations,
  detectLanguage,
  t as translate,
} from '@/lib/i18n';

// Language Context
interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  translations: Translations;
  t: (category: keyof Translations, key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// Language Provider
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');
  const [translations, setTranslations] = useState<Translations>(getTranslations('en'));

  useEffect(() => {
    // Check localStorage first, then detect from browser
    const savedLang = localStorage.getItem('neobi-language') as SupportedLanguage;
    const initialLang = savedLang || detectLanguage();
    setLanguageState(initialLang);
    setTranslations(getTranslations(initialLang));
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    setTranslations(getTranslations(lang));
    localStorage.setItem('neobi-language', lang);
  };

  const t = (category: keyof Translations, key: string) => {
    return translate(language, category, key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Language Selector Component
interface LanguageSelectorProps {
  variant?: 'dropdown' | 'inline' | 'compact';
  showLabel?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'dropdown',
  showLabel = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language);

  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap gap-2">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              language === lang.code
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="font-medium">{lang.nativeName}</span>
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
        >
          <span>{currentLang?.flag}</span>
          <span className="text-xs text-gray-400">{language.toUpperCase()}</span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 bg-gray-800 border border-white/10 rounded-lg overflow-hidden z-50 shadow-xl min-w-[150px]"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 transition-colors ${
                      language === lang.code ? 'bg-blue-500/20 text-blue-400' : 'text-gray-300'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className="p-4 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-white/10">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold">Language / भाषा</h3>
            <p className="text-xs text-gray-400">Select your preferred language</p>
          </div>
        </div>
      </div>

      {/* Current Selection */}
      <div className="mb-4 p-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg border border-indigo-500/20">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{currentLang?.flag}</span>
          <div>
            <p className="text-white font-medium">{currentLang?.nativeName}</p>
            <p className="text-xs text-gray-400">{currentLang?.name}</p>
          </div>
        </div>
      </div>

      {/* Language Grid */}
      <div className="grid grid-cols-2 gap-2">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-2 p-3 rounded-lg transition-all ${
              language === lang.code
                ? 'bg-indigo-500/20 border-2 border-indigo-500/50'
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
          >
            <span className="text-xl">{lang.flag}</span>
            <div className="text-left">
              <p className={`text-sm font-medium ${language === lang.code ? 'text-indigo-400' : 'text-white'}`}>
                {lang.nativeName}
              </p>
              {showLabel && (
                <p className="text-xs text-gray-400">{lang.name}</p>
              )}
            </div>
            {language === lang.code && (
              <svg className="w-4 h-4 text-indigo-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* Info */}
      <p className="mt-4 text-xs text-gray-500 text-center">
        🇮🇳 Made for India | भारत के लिए बनाया गया
      </p>
    </div>
  );
};

export default LanguageSelector;
