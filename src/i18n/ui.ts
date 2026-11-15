// Every piece of text in the shared header, footer, sticky bar and cookie
// banner, per language. Copied from the old site; edit here, not in components.

export const LANGS = ['bg', 'en', 'ru'] as const;
export type Lang = (typeof LANGS)[number];

type Link = { href: string; label: string };

const RU_FLAG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9 6'%3E%3Crect width='9' height='6' fill='%23fff'/%3E%3Crect y='2' width='9' height='2' fill='%230039a6'/%3E%3Crect y='4' width='9' height='2' fill='%23d52b1e'/%3E%3C/svg%3E";

/** The language picker, in the order the old site listed it. */
export const languages: { code: Lang; flag: string; flagSrc: string; name: string }[] = [
  { code: 'en', flag: 'gb', flagSrc: '/images/gb-flag.png', name: 'English' },
  { code: 'bg', flag: 'bg', flagSrc: '/images/bg-flag.png', name: 'Български' },
  { code: 'ru', flag: 'ru', flagSrc: RU_FLAG, name: 'Русский' },
];

export const PHONE_HREF = 'tel:+359879884488';
export const EMAIL = 'd.mehov@gmail.com';

interface Strings {
  siteName: string;
  ogLocale: string;
  logo: { src: string; alt: string };
  /** Desktop navigation bar. */
  nav: Link[];
  /** Mobile (hamburger) menu. */
  mobileNav: Link[];
  phone: string;
  cta: Link;
  chooseLanguage: string;
  openMenu: string;
  footer: {
    title: string;
    about: string;
    navTitle: string;
    nav: Link[];
    contactTitle: string;
    address: string;
    phoneLabel: string;
    emailLabel: string;
    hours: string;
    legal: string;
    privacy: Link & { hreflang?: string };
    copyright: string;
  };
  sticky: { label: string; call: string; enquiry: Link };
  cookie: { label: string; text: string; privacy: Link; settings: string; decline: string; accept: string };
  form: { sending: string; sent: string; failed: string };
  notFound: { title: string; text: string; home: string };
}

export const ui: Record<Lang, Strings> = {
  bg: {
    siteName: 'Мехов Консулт',
    ogLocale: 'bg_BG',
    logo: { src: '/images/mehovconsult-logo.png', alt: 'Мехов Консулт' },
    nav: [
      { href: '/bg', label: 'Начало' },
      { href: '/bg/services/accounting', label: 'Счетоводни услуги' },
      { href: '/bg/services/consultancy', label: 'Консултантски услуги' },
      { href: '/bg/services/company-registration', label: 'Регистрация на фирма' },
      { href: '/bg/about', label: 'За нас' },
      { href: '/bg/blog', label: 'Блог' },
    ],
    mobileNav: [
      { href: '/bg', label: 'Начало' },
      { href: '/bg/services/accounting', label: 'Счетоводни услуги' },
      { href: '/bg/services/consultancy', label: 'Консултантски услуги' },
      { href: '/bg/services/company-registration', label: 'Регистрация на фирма' },
      { href: '/bg/contact', label: 'Контакти' },
      { href: '/bg/about', label: 'За нас' },
      { href: '/bg/blog', label: 'Блог' },
    ],
    phone: '0879 88 44 88',
    cta: { href: '/bg/contact', label: 'Свържете се с нас' },
    chooseLanguage: 'Изберете език',
    openMenu: 'Отвори меню',
    footer: {
      title: 'Мехов Консулт',
      about: 'Счетоводна кантора в София. Професионални счетоводни и консултантски услуги за стартиращи и утвърдени бизнеси.',
      navTitle: 'Навигация',
      nav: [
        { href: '/bg', label: 'Начало' },
        { href: '/bg/services/accounting', label: 'Счетоводни услуги' },
        { href: '/bg/services/consultancy', label: 'Консултантски услуги' },
        { href: '/bg/services/company-registration', label: 'Регистрация на фирма' },
        { href: '/bg/about', label: 'За нас' },
        { href: '/bg/blog', label: 'Блог' },
        { href: '/bg/contact', label: 'Контакти' },
      ],
      contactTitle: 'Контакти',
      address: 'гр. София 1756, жк. Дървеница, бл. 48, вх. В, офис №6',
      phoneLabel: 'Телефон',
      emailLabel: 'Имейл',
      hours: 'Работно време: понеделник – петък, 9:00 – 17:00',
      legal: 'МЕХОВ КОНСУЛТ ЕООД · ЕИК 204406662 · гр. София 1756, жк. Дървеница, бл. 48, вх. В, офис №6',
      privacy: { href: '/bg/privacy-policy', label: 'Политика за поверителност' },
      copyright: 'Мехов Консулт. Всички права запазени.',
    },
    sticky: {
      label: 'Бързи връзки',
      call: 'Обадете се',
      enquiry: { href: '/bg/contact#contact-form', label: 'Запитване' },
    },
    cookie: {
      label: 'Съгласие за бисквитки',
      text: 'Използваме бисквитки на Google Analytics, за да разберем как се използва сайтът. Поставят се само ако ги приемете.',
      privacy: { href: '/bg/privacy-policy', label: 'Политика за поверителност' },
      settings: 'Настройки за бисквитки',
      decline: 'Отказвам',
      accept: 'Приемам',
    },
    form: {
      sending: 'Изпращане…',
      sent: 'Благодарим ви! Получихме запитването и ще се свържем с вас възможно най-скоро.',
      failed: 'Изпращането не успя. Моля, опитайте отново или се обадете на 0879 88 44 88.',
    },
    notFound: {
      title: 'Страницата не е намерена',
      text: 'Страницата, която търсите, не съществува или е преместена.',
      home: 'Към началната страница',
    },
  },

  en: {
    siteName: 'Mehov Consult',
    ogLocale: 'en_US',
    logo: { src: '/images/mehovconsult-logo-en.png', alt: 'Mehov Consult' },
    nav: [
      { href: '/en', label: 'Home' },
      { href: '/en/services/accounting', label: 'Accounting Services' },
      { href: '/en/services/consultancy', label: 'Consulting Services' },
      { href: '/en/services/company-registration', label: 'Company Registration' },
      { href: '/en/about', label: 'About Us' },
    ],
    mobileNav: [
      { href: '/en', label: 'Home' },
      { href: '/en/services/accounting', label: 'Accounting Services' },
      { href: '/en/services/consultancy', label: 'Consulting Services' },
      { href: '/en/services/company-registration', label: 'Company Registration' },
      { href: '/en/contact', label: 'Contact' },
      { href: '/en/about', label: 'About Us' },
    ],
    phone: '+359 879 88 44 88',
    cta: { href: '/en/contact', label: 'Contact Us' },
    chooseLanguage: 'Choose language',
    openMenu: 'Open menu',
    footer: {
      title: 'Mehov Consult',
      about: 'Accounting firm in Sofia. Professional accounting and consulting services for startups and established businesses.',
      navTitle: 'Navigation',
      nav: [
        { href: '/en', label: 'Home' },
        { href: '/en/services/accounting', label: 'Accounting Services' },
        { href: '/en/services/consultancy', label: 'Consulting Services' },
        { href: '/en/services/company-registration', label: 'Company Registration' },
        { href: '/en/about', label: 'About Us' },
        { href: '/en/contact', label: 'Contact' },
      ],
      contactTitle: 'Contact',
      address: 'Sofia 1756, Darvenitsa District, Block 48, Entrance V, Office 6',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      hours: 'Working hours: Monday – Friday, 9:00 – 17:00',
      legal: 'MEHOV CONSULT EOOD (Ltd.) · UIC 204406662 · Sofia 1756, Darvenitsa District, Block 48, Entrance V, Office 6',
      privacy: { href: '/en/privacy-policy', label: 'Privacy Policy' },
      copyright: 'Mehov Consult. All rights reserved.',
    },
    sticky: {
      label: 'Quick contact',
      call: 'Call us',
      enquiry: { href: '/en/contact#contact-form', label: 'Get a quote' },
    },
    cookie: {
      label: 'Cookie consent',
      text: 'We use Google Analytics cookies to understand how the website is used. They are only set if you accept.',
      privacy: { href: '/en/privacy-policy', label: 'Privacy Policy' },
      settings: 'Cookie settings',
      decline: 'Decline',
      accept: 'Accept',
    },
    form: {
      sending: 'Sending…',
      sent: 'Thank you! We received your enquiry and will get back to you as soon as possible.',
      failed: 'Sending failed. Please try again or call us on +359 879 88 44 88.',
    },
    notFound: {
      title: 'Page not found',
      text: 'The page you are looking for does not exist or has been moved.',
      home: 'Go to the home page',
    },
  },

  ru: {
    siteName: 'Мехов Консулт',
    ogLocale: 'ru_RU',
    logo: { src: '/images/mehovconsult-logo.png', alt: 'Мехов Консулт' },
    nav: [
      { href: '/ru', label: 'Главная' },
      { href: '/ru/services/company-registration', label: 'Регистрация фирмы' },
      { href: '/ru/services/accounting', label: 'Бухгалтерия' },
      { href: '/ru/contact', label: 'Контакты' },
    ],
    mobileNav: [
      { href: '/ru', label: 'Главная' },
      { href: '/ru/services/company-registration', label: 'Регистрация фирмы' },
      { href: '/ru/services/accounting', label: 'Бухгалтерия' },
      { href: '/ru/contact', label: 'Контакты' },
    ],
    phone: '+359 879 88 44 88',
    cta: { href: '/ru/contact', label: 'Связаться' },
    chooseLanguage: 'Выбрать язык',
    openMenu: 'Открыть меню',
    footer: {
      title: 'Мехов Консулт',
      about: 'Бухгалтерская фирма в Софии. Бухгалтерское обслуживание и регистрация фирм для новых и действующих компаний в Болгарии.',
      navTitle: 'Навигация',
      nav: [
        { href: '/ru', label: 'Главная' },
        { href: '/ru/services/company-registration', label: 'Регистрация фирмы' },
        { href: '/ru/services/accounting', label: 'Бухгалтерия' },
        { href: '/ru/contact', label: 'Контакты' },
      ],
      contactTitle: 'Контакты',
      address: 'София 1756, жк Дырвеница, бл. 48, вх. В, офис 6',
      phoneLabel: 'Телефон',
      emailLabel: 'Эл. почта',
      hours: 'Часы работы: понедельник – пятница, 9:00 – 17:00',
      legal: 'МЕХОВ КОНСУЛТ ЕООД · ЕИК 204406662 · София 1756, жк Дырвеница, бл. 48, вх. В, офис 6',
      privacy: { href: '/en/privacy-policy', label: 'Политика конфиденциальности (на англ.)', hreflang: 'en' },
      copyright: 'Мехов Консулт. Все права защищены.',
    },
    sticky: {
      label: 'Быстрая связь',
      call: 'Позвонить',
      enquiry: { href: '/ru/contact#contact-form', label: 'Запрос' },
    },
    cookie: {
      label: 'Согласие на cookie',
      text: 'Мы используем файлы cookie Google Analytics, чтобы понять, как используется сайт. Они устанавливаются только с вашего согласия.',
      privacy: { href: '/en/privacy-policy', label: 'Политика конфиденциальности (на англ.)' },
      settings: 'Настройки cookie',
      decline: 'Отказаться',
      accept: 'Принять',
    },
    form: {
      sending: 'Отправка…',
      sent: 'Спасибо! Мы получили ваш запрос и свяжемся с вами в ближайшее время.',
      failed: 'Не удалось отправить. Попробуйте ещё раз или позвоните +359 879 88 44 88.',
    },
    notFound: {
      title: 'Страница не найдена',
      text: 'Страница, которую вы ищете, не существует или была перемещена.',
      home: 'На главную',
    },
  },
};
