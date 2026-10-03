import { useEffect, useState } from 'react';

export type Route = { name: 'home' } | { name: 'quiz'; quizId: string } | { name: 'notFound' };

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '');
  if (path === '' || path === '/') return { name: 'home' };
  const m = path.match(/^\/kviz\/([a-z0-9-]+)\/?$/);
  if (m) return { name: 'quiz', quizId: m[1] as string };
  return { name: 'notFound' };
}

/** Kotvy na zdroje (#zdroj-n) nejsou trasy; router je ignoruje. */
const isInPageAnchor = (hash: string) => /^#zdroj-\d+$/.test(hash);

export function navigate(path: string): void {
  window.location.hash = path;
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => {
      if (!isInPageAnchor(window.location.hash)) setRoute(parseHash(window.location.hash));
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
