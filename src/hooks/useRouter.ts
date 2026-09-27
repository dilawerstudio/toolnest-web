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

      // Dynamic document title & meta description update based on current page
      let title = 'ToolNest – Free Online Utility Tools & Fast Browser Utilities';
      let description = 'Free, fast, and privacy-first online tools. Word counter, QR code generator, password generator, diff viewers, and more. 100% in-browser processing.';

      if (newRoute.path === 'home') {
        title = 'ToolNest – Free Online Utility Tools & Fast Browser Utilities';
      } else if (newRoute.path === 'tools') {
        title = 'All Utility Tools – Free & Fast | ToolNest';
        description = 'Browse our complete catalog of 35 free, privacy-first browser utilities and calculators. No tracking, 100% client-side.';
      } else if (newRoute.path === 'tool-detail' && newRoute.toolId) {
        const found = TOOLS.find(t => t.id === newRoute.toolId);
        if (found) {
          title = `${found.name} – Free Online Utility | ToolNest`;
          description = `${found.description} 100% private in-browser tool on ToolNest.`;
        } else {
          title = 'Tool Not Found – ToolNest';
        }
      } else if (newRoute.path === 'about') {
        title = 'About Us – Mission & Privacy | ToolNest';
        description = 'Learn about ToolNest’s mission to provide fast, completely free online utilities with zero data collection.';
      } else if (newRoute.path === 'contact') {
        title = 'Contact & Feedback – ToolNest';
        description = 'Contact the ToolNest team to suggest new utilities, report issues, or provide feedback.';
      } else if (newRoute.path === 'privacy') {
        title = 'Privacy Policy – Zero Data Collection | ToolNest';
        description = 'ToolNest Privacy Policy: We do not collect, view, or log any text, files, passwords, or personal data. 100% local processing.';
      } else if (newRoute.path === 'terms') {
        title = 'Terms of Service – ToolNest';
        description = 'ToolNest Terms of Service governing the use of our free browser-based computational utilities.';
      } else if (newRoute.path === 'disclaimer') {
        title = 'Disclaimer – ToolNest';
        description = 'Important informational and calculation notice regarding ToolNest utilities and calculators.';
      }

      document.title = title;

      // Update meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', description);

      // Update OpenGraph
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', title);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', description);

      // Update Twitter
      const twTitle = document.querySelector('meta[name="twitter:title"]');
      if (twTitle) twTitle.setAttribute('content', title);
      const twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', description);
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
