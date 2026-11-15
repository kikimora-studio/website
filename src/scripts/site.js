// Shared behaviour for every page: navigation, language picker, enquiry
// modal + forms (Netlify Forms), cookie consent / Google Analytics.
// Page-specific bits (FAQ accordions, reveal animations, counters) stay
// inline in the page they belong to.

const strings = JSON.parse(document.getElementById('site-strings')?.textContent || '{}');

/* ------------------------------------------------ navigation */

(function nav() {
  const links = Array.from(document.querySelectorAll('.nav-link'));
  const indicator = document.querySelector('.nav-indicator');

  function placeIndicatorFor(el) {
    if (!indicator || !el) return;
    indicator.style.width = el.offsetWidth + 'px';
    indicator.style.left = el.offsetLeft + 'px';
    indicator.style.opacity = '1';
  }
  function hideIndicator() {
    if (indicator) indicator.style.opacity = '0';
  }
  function restore() {
    const active = document.querySelector('.nav-link.active');
    if (active) placeIndicatorFor(active);
    else hideIndicator();
  }

  links.forEach((link) => {
    link.addEventListener('mouseenter', () => placeIndicatorFor(link));
    link.addEventListener('click', () => {
      links.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
      placeIndicatorFor(link);
    });
  });
  document.querySelector('.nav-container')?.addEventListener('mouseleave', restore);
  window.addEventListener('resize', restore);
  restore();

  const toggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  toggle?.addEventListener('click', () => {
    mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
  });
})();

/* ------------------------------------------------ language picker */

(function languagePicker() {
  const root = document.getElementById('langSelector');
  const btn = document.getElementById('langToggle');
  const list = document.getElementById('langList');
  if (!root || !btn || !list) return;
  const options = Array.from(list.querySelectorAll('li[role="option"]'));

  // Targets are computed at build time (src/data/routes.ts).
  const go = (opt) => {
    location.href = opt.getAttribute('data-href') + location.search + location.hash;
  };

  function onDocClick(e) {
    if (!root.contains(e.target)) close();
  }
  function onKey(e) {
    if (e.key === 'Escape') close();
  }
  function close() {
    list.style.display = 'none';
    btn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', onDocClick);
    document.removeEventListener('keydown', onKey);
  }
  function open() {
    list.style.display = 'block';
    btn.setAttribute('aria-expanded', 'true');
    (list.querySelector('[aria-selected="true"]') || options[0])?.focus();
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
  }

  btn.addEventListener('click', () => (btn.getAttribute('aria-expanded') === 'true' ? close() : open()));
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  });
  options.forEach((opt, i) => {
    opt.addEventListener('click', () => go(opt));
    opt.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        go(opt);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        options[(i + 1) % options.length].focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        options[(i - 1 + options.length) % options.length].focus();
      }
    });
  });
})();

/* ------------------------------------------------ analytics helper */

function track(name, params) {
  if (window.__mcGaLoaded && window.gtag) window.gtag('event', name, params);
}

/* ------------------------------------------------ enquiry modal */

(function enquiryModal() {
  const modal = document.getElementById('enquiryModal');
  if (!modal) return; // pages without a modal: openers are plain links to the contact form

  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // includes the mobile sticky bar's "enquiry" button
  document.querySelectorAll('[data-open-enquiry]').forEach((b) => b.addEventListener('click', openModal));
  document.getElementById('closeModal')?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
  });
  modal.__close = closeModal;
})();

/* ------------------------------------------------ forms -> Formspree / Netlify Forms */

// deploy.config.mjs `formEndpoint`: a Formspree endpoint, or empty for Netlify Forms
function send(form) {
  const data = new FormData(form);
  if (!strings.endpoint) {
    return fetch(location.pathname, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString(),
    });
  }
  const out = new FormData();
  for (const [k, v] of data) {
    if (k === 'form-name') continue;
    out.append(k === 'bot-field' ? '_gotcha' : k, v); // Formspree's honeypot field
  }
  out.append('_subject', `Запитване от сайта (${data.get('page') || location.pathname})`);
  return fetch(strings.endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: out });
}

document.querySelectorAll('[data-form-section]').forEach((section) => {
  const form = section.querySelector('form');
  if (!form) return;
  const result = section.querySelector('[data-form-result]');
  const submit = section.querySelector('[data-form-submit]') || form.querySelector('[type="submit"]');
  const label = submit?.querySelector('span');

  function show(text, color) {
    if (!result) return;
    result.textContent = text;
    result.style.color = color;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const idle = label ? label.textContent : submit?.textContent;
    const busy = (on) => {
      if (!submit) return;
      submit.disabled = on;
      submit.setAttribute('aria-busy', String(on));
      if (label) label.textContent = on ? strings.sending : idle;
    };

    show(strings.sending, '#6b7280');
    busy(true);
    try {
      const res = await send(form);
      if (!res.ok) throw new Error(String(res.status));
      show(strings.sent, '#15803d');
      form.reset();
      track('generate_lead', { page_path: location.pathname });
      const modal = section.closest('.modal');
      if (modal?.__close) setTimeout(modal.__close, 1200);
    } catch {
      show(strings.failed, '#b91c1c');
    } finally {
      busy(false);
    }
  });
});

/* ------------------------------------------------ cookie consent + Google Analytics */

(function consent() {
  const KEY = 'mc_consent_v1';
  const GA_ID = 'G-8L77CWXPKN';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  const gtag = window.gtag;
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  function loadGa() {
    gtag('consent', 'update', { analytics_storage: 'granted' });
    if (window.__mcGaLoaded) return;
    window.__mcGaLoaded = true;
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID);
  }
  function dropGa() {
    gtag('consent', 'update', { analytics_storage: 'denied' });
    const host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach((c) => {
      const n = c.split('=')[0].trim();
      if (n.indexOf('_ga') === 0) {
        document.cookie = n + '=; Max-Age=0; path=/';
        document.cookie = n + '=; Max-Age=0; path=/; domain=.' + host;
      }
    });
  }

  const box = document.getElementById('mc-cc');
  let choice = null;
  try {
    choice = localStorage.getItem(KEY);
  } catch {}
  if (choice === 'yes') loadGa();
  else if (choice !== 'no' && box) box.hidden = false;

  box?.addEventListener('click', (e) => {
    const t = e.target.closest('[data-cc]');
    if (!t) return;
    const answer = t.getAttribute('data-cc');
    try {
      localStorage.setItem(KEY, answer);
    } catch {}
    box.hidden = true;
    if (answer === 'yes') loadGa();
    else dropGa();
  });

  // "Cookie settings" link at the end of the footer's legal lines
  const legals = document.querySelectorAll('.footer-legal');
  const legal = legals[legals.length - 1];
  if (legal && box) {
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = box.getAttribute('data-settings');
    a.addEventListener('click', (e) => {
      e.preventDefault();
      box.hidden = false;
    });
    legal.append(' · ', a);
  }

  document.addEventListener('click', (e) => {
    const a = e.target?.closest?.('a[href]');
    if (!a) return;
    const h = a.getAttribute('href') || '';
    if (h.startsWith('tel:')) track('phone_click', { link_url: h, page_path: location.pathname });
    else if (h.startsWith('mailto:')) track('email_click', { link_url: h, page_path: location.pathname });
  }, true);
})();

/* ------------------------------------------------ layout fix carried over from the old site */

document
  .querySelectorAll('main.mc-home, main.mc-about-page, main.mc-reg-page, main.mc-acct-page, main.mc-consult-page, main.mc-contact-page, main.mc-post')
  .forEach((el) => {
    el.style.setProperty('overflow', 'visible', 'important');
    el.style.setProperty('overflow-x', 'clip', 'important');
    el.style.setProperty('max-width', '100%', 'important');
  });
const wrap = document.querySelector('.widget-placeholder-wrap');
if (wrap) {
  wrap.style.setProperty('overflow', 'visible', 'important');
  wrap.style.setProperty('max-width', '100%', 'important');
}

