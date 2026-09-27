import React, { useState } from 'react';
import { Search, Menu, X, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  currentPath: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, currentPath }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'All Tools', href: '#/tools' },
    { label: 'Text Tools', href: '#/tools?category=text' },
    { label: 'Calculators', href: '#/tools?category=utility' },
    { label: 'About', href: '#/about' },
    { label: 'Contact', href: '#/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#/"
          className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md py-1"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-indigo-700 transition-colors">
            T
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            ToolNest
          </span>
        </a>

        {/* Zone 2: Clean text navigation links (4-5 items, single line) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-indigo-600 transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors border border-slate-200/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Search tools"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Search tools</span>
            <kbd className="hidden sm:inline text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-400">
              /
            </kbd>
          </button>

          <a
            href="#/privacy"
            className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg transition-colors border border-emerald-200/60"
            title="100% In-Browser Local Processing"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Private & In-Browser</span>
          </a>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-150">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSearch();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg mb-3"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>Search all 35 utilities...</span>
          </button>

          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-2">
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <ShieldCheck className="w-4 h-4" /> 100% Local Processing
            </span>
            <span>$0 Free Forever</span>
          </div>
        </div>
      )}
    </header>
  );
};
