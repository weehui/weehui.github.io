"use client";

import {useContext} from 'react';

import {LocaleContext, type AppLocale} from '@/src/i18n/I18nProvider';

const locales: Array<{locale: AppLocale; label: string}> = [
  {locale: 'en', label: 'EN'},
  {locale: 'zh', label: 'CN'}
];

export default function LocaleSwitcher() {
  const context = useContext(LocaleContext);
  if (!context) return null;

  return (
    <div className="locale-switcher" role="navigation" aria-label="Language">
      {locales.map(({locale: targetLocale, label}) => {
        const isActive = context.locale === targetLocale;

        return (
          <button
            key={targetLocale}
            type="button"
            className={`locale-switcher__btn ${isActive ? 'is-active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => context.setLocale(targetLocale)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
