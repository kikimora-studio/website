import { LANGS, type Lang } from '../i18n/ui';

/**
 * Pages that exist in more than one language. Each group becomes
 * <link rel="alternate" hreflang> tags (x-default = the Bulgarian page) and
 * the target of the language switcher. Add a group when you translate a page.
 */
export const translations: Partial<Record<Lang, string>>[] = [
  { bg: '/bg', en: '/en', ru: '/ru' },
  { bg: '/bg/about', en: '/en/about' },
  { bg: '/bg/contact', en: '/en/contact', ru: '/ru/contact' },
  { bg: '/bg/privacy-policy', en: '/en/privacy-policy' },
  { bg: '/bg/services/accounting', en: '/en/services/accounting', ru: '/ru/services/accounting' },
  { bg: '/bg/services/company-registration', en: '/en/services/company-registration', ru: '/ru/services/company-registration' },
  { bg: '/bg/services/consultancy', en: '/en/services/consultancy' },
];

/**
 * Language-switcher targets that differ from the translation groups, for
 * pages with no exact counterpart (same choices the old site made).
 * Anything not listed here or in a group falls back to that language's home.
 */
const switchOverrides: Record<string, Partial<Record<Lang, string>>> = {
  '/ru/services/company-registration': { en: '/en/services/company-registration-foreigners' },
  '/en/services/company-registration-foreigners': {
    bg: '/bg/services/company-registration',
    ru: '/ru/services/company-registration',
  },
  '/bg/services/vat-registration': { en: '/en/services/accounting' },
  '/bg/services/accounting-online-store': { en: '/en/services/accounting' },
  '/bg/services/accounting-freelancers': { en: '/en/services/accounting' },
  '/bg/services/payroll': { en: '/en/services/accounting' },
  '/bg/services/annual-closing': { en: '/en/services/accounting' },
};

export function translationGroup(path: string) {
  return translations.find((g) => Object.values(g).includes(path));
}

/** Where each entry of the language switcher leads from `path`. */
export function languageLinks(path: string, current: Lang): Record<Lang, string> {
  const group = translationGroup(path);
  const links = {} as Record<Lang, string>;
  for (const lang of LANGS) {
    links[lang] = lang === current ? path : switchOverrides[path]?.[lang] ?? group?.[lang] ?? `/${lang}`;
  }
  return links;
}
