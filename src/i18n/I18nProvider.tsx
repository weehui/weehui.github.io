"use client";

import {createContext, useEffect, useMemo, useState} from 'react';
import {NextIntlClientProvider} from 'next-intl';

import enMessages from '@/messages/en.json';
import zhMessages from '@/messages/zh.json';

export type AppLocale = 'en' | 'zh';

export const LocaleContext = createContext<{
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
} | null>(null);

const STORAGE_KEY = 'encoflow-locale';
const DEFAULT_LOCALE: AppLocale = 'en';

function detectDeviceLocale(): AppLocale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;

  const candidates = [
    ...(navigator.languages ?? []),
    navigator.language,
  ].filter(Boolean) as string[];

  // Any Chinese locale variant defaults to zh; otherwise en.
  const isZh = candidates.some((lang) => lang.toLowerCase().startsWith('zh'));
  return isZh ? 'zh' : 'en';
}

export default function I18nProvider({children}: {children: React.ReactNode}) {
  const [locale, setLocale] = useState<AppLocale>(DEFAULT_LOCALE);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'zh') {
      setLocale(saved);
      return;
    }

    setLocale(detectDeviceLocale());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
  }, [locale]);

  const messages = useMemo(() => {
    return locale === 'en' ? (enMessages as unknown as any) : (zhMessages as unknown as any);
  }, [locale]);

  const value = useMemo(() => ({locale, setLocale}), [locale]);

  return (
    <LocaleContext.Provider value={value}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
