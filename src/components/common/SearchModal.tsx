import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { TOOLS } from '../../data/tools';
import { ToolItem } from '../../types/tool';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectTool }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if (e.key === '/' && !isOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        // Trigger open search
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();
  const results: ToolItem[] = normalizedQuery
    ? TOOLS.filter((t) => {
        const matchName = t.name.toLowerCase().includes(normalizedQuery);
        const matchDesc = t.description.toLowerCase().includes(normalizedQuery);
        const matchCat = t.categoryName.toLowerCase().includes(normalizedQuery);
        const matchTags = t.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
        return matchName || matchDesc || matchCat || matchTags;
      })
    : TOOLS.slice(0, 8); // show popular / first items when blank

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex items-start justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search tools"
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative border-b border-slate-200 px-4 flex items-center">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools (e.g. compress, QR, word, password, age)..."
            className="w-full py-4 text-base bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md mr-1"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-900 px-2 py-1 bg-slate-100 rounded border border-slate-200"
          >
            Esc
          </button>
        </div>

        {/* Quick Suggestion Chips (Buttons) */}
        {!query && (
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs text-slate-600">
            <span className="text-slate-400 shrink-0">Popular:</span>
            {['QR Code', 'Word Counter', 'Password', 'Barcode', 'JSON', 'Units', 'Base64', 'Age', 'Compress', 'Resize'].map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-2 py-0.5 rounded bg-white hover:bg-slate-200/80 border border-slate-200 text-slate-700 transition-colors shrink-0"
              >
                {term}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100">
          {results.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-slate-700">No matching tools found for "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for keywords like "QR", "compress", "word", or "calculator".</p>
            </div>
          ) : (
            results.map((tool) => (
              <button
                key={tool.id}
                onClick={() => {
                  onSelectTool(tool.id);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-slate-50 focus-visible:bg-slate-50 transition-colors flex items-center justify-between group focus-visible:outline-none"
              >
                <div className="pr-4">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-0.5">
                    <span>{tool.categoryName}</span>
                    <span aria-hidden="true">·</span>
                    {tool.isImplemented ? (
                      <span className="text-emerald-700 font-medium">Ready</span>
                    ) : (
                      <span className="text-slate-400">Preview</span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {tool.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {tool.description}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-1 text-xs font-medium text-slate-400 group-hover:text-indigo-600 transition-colors">
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% In-Browser Privacy Guaranteed</span>
          </div>
          <span>Showing {results.length} tools</span>
        </div>
      </div>
    </div>
  );
};
