import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollRestoration = () => {
  const { pathname, search, hash } = useLocation();

  // Disable browser scroll restoration so we can control it
  useEffect(() => {
    if ('scrollRestoration' in history) {
      try {
        history.scrollRestoration = 'manual';
      } catch (e) {
        // ignore
      }
    }
    return () => {
      if ('scrollRestoration' in history) {
        try {
          history.scrollRestoration = 'auto';
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // Scroll to top on navigation (pathname/search/hash changes)
  useEffect(() => {
    // small timeout to ensure browser has finished any focus/restore actions
    const t = window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, 0);

    return () => clearTimeout(t);
  }, [pathname, search, hash]);

  return null;
};

export default ScrollRestoration;
