import { useEffect } from 'react';

const SITE_NAME  = 'Afzal Bikerz Store';
const SITE_URL   = typeof window !== 'undefined' ? window.location.origin : '';
const DEFAULT_IMG = '/favicon.svg';

export interface SEOProps {
  title:        string;       // page-specific title (will be appended with site name)
  description?: string;
  image?:       string;       // absolute or relative URL for og:image
  type?:        'website' | 'product' | 'article';
  price?:       string;       // for product pages
  availability?: 'in stock' | 'out of stock';
  noIndex?:     boolean;
}

/** Set/remove a <meta> tag by name or property */
const setMeta = (attr: 'name' | 'property', key: string, value: string) => {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
};

const removeMeta = (attr: 'name' | 'property', key: string) => {
  document.querySelector(`meta[${attr}="${key}"]`)?.remove();
};

const setLink = (rel: string, href: string) => {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

export const useSEO = ({
  title,
  description = 'Pakistan\'s #1 Motorcycle Parts Store. Shop tanks, rims, silencers, LED lighting, helmets & accessories. Fast delivery. 100% genuine products.',
  image        = DEFAULT_IMG,
  type         = 'website',
  price,
  availability,
  noIndex      = false,
}: SEOProps) => {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const fullImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;
    const canonical = window.location.href.split('?')[0]; // strip query for canonical

    // ── <title> ─────────────────────────────────────────────────────────────
    document.title = fullTitle;

    // ── Standard meta ───────────────────────────────────────────────────────
    setMeta('name', 'description', description);
    if (noIndex) {
      setMeta('name', 'robots', 'noindex, nofollow');
    } else {
      removeMeta('name', 'robots');
    }

    // ── Open Graph ───────────────────────────────────────────────────────────
    setMeta('property', 'og:title',       fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image',       fullImage);
    setMeta('property', 'og:url',         canonical);
    setMeta('property', 'og:type',        type);
    setMeta('property', 'og:site_name',   SITE_NAME);

    // ── Twitter Card ─────────────────────────────────────────────────────────
    setMeta('name', 'twitter:card',        'summary_large_image');
    setMeta('name', 'twitter:title',       fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image',       fullImage);

    // ── Product-specific (og:price / availability) ────────────────────────
    if (price) {
      setMeta('property', 'product:price:amount',   price);
      setMeta('property', 'product:price:currency', 'PKR');
    } else {
      removeMeta('property', 'product:price:amount');
      removeMeta('property', 'product:price:currency');
    }
    if (availability) {
      setMeta('property', 'product:availability', availability);
    } else {
      removeMeta('property', 'product:availability');
    }

    // ── Canonical link ────────────────────────────────────────────────────
    setLink('canonical', canonical);

    // Cleanup: restore default title on unmount
    return () => {
      document.title = SITE_NAME;
    };
  }, [title, description, image, type, price, availability, noIndex]);
};
