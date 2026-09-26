import { useState, useEffect } from 'react';
import { TOOLS } from '../data/tools';

export interface RouteState {
  path: string;
  toolId?: string;
  categoryFilter?: string;
}

export function useRouter() {
  const parseHash = (): RouteState => {
    const raw = window.location.hash.replace(/^#\/?/, '');
    const [main, sub] = raw.split('/').filter(Boolean);

    if (!main) {
      return { path: 'home' };
    }

    if (main === 'tools') {
      if (sub) {
        return { path: 'tool-detail', toolId: sub };
      }
      // Check query param for category if any
      const search = window.location.hash.split('?')[1];
      const params = new URLSearchParams(search);
      const cat = params.get('category') || undefined;
      return { path: 'tools', categoryFilter: cat };
    }

    if (['about', 'contact', 'privacy', 'terms', 'disclaimer'].includes(main)) {
      return { path: main };
    }

    return { path: 'home' };
  };

  const [route, setRoute] = useState<RouteState>(parseHash);

  useEffect(() => {
    const handleHashChange = () => {
      const newRoute = parseHash();
      setRoute(newRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Dynamic document title update based on current page
      if (newRoute.path === 'home') {
        document.title = 'ToolNest – Free Online Utility Tools & Fast Browser Utilities';
      } else if (newRoute.path === 'tools') {
        document.title = 'All Utility Tools – Free & Fast | ToolNest';
      } else if (newRoute.path === 'tool-detail' && newRoute.toolId) {
        const found = TOOLS.find(t => t.id === newRoute.toolId);
        if (found) {
          document.title = `${found.name} – Free Online Utility | ToolNest`;
        } else {
          document.title = 'Tool Not Found – ToolNest';
        }
      } else if (newRoute.path === 'about') {
        document.title = 'About Us – Mission & Privacy | ToolNest';
      } else if (newRoute.path === 'contact') {
        document.title = 'Contact & Feedback – ToolNest';
      } else if (newRoute.path === 'privacy') {
        document.title = 'Privacy Policy – Zero Data Collection | ToolNest';
      } else if (newRoute.path === 'terms') {
        document.title = 'Terms of Service – ToolNest';
      } else if (newRoute.path === 'disclaimer') {
        document.title = 'Disclaimer – ToolNest';
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (to: string) => {
    window.location.hash = to.startsWith('#') ? to : `#/${to.replace(/^\//, '')}`;
  };

  return { route, navigate };
}
