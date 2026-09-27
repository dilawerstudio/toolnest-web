import React, { useState, useMemo } from 'react';
import { Copy, Trash2, Check, Link, Sparkles, Sliders } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface SlugGeneratorProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

const SAMPLE_TITLE = '10 Best Free Tools for Students & Developers in 2026!';

export const SlugGenerator: React.FC<SlugGeneratorProps> = ({ tool, onToast }) => {
  const [input, setInput] = useState<string>(SAMPLE_TITLE);
  const [separator, setSeparator] = useState<'-' | '_'>('-');
  const [lowercase, setLowercase] = useState<boolean>(true);
  const [preserveUnicode, setPreserveUnicode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Compute slug reactively
  const slug = useMemo(() => {
    if (!input.trim()) return '';

    let text = input.trim();

    if (lowercase) {
      text = text.toLowerCase();
    }

    if (!preserveUnicode) {
      // Normalize accented Latin chars (e.g., é -> e, ü -> u)
      text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      // Strip anything that is not alphanumeric or whitespace
      text = text.replace(/[^a-zA-Z0-9\s_\-]/g, '');
    } else {
      // In Unicode mode, remove punctuation/symbols but keep unicode letters & digits
      text = text.replace(/[^\p{L}\p{N}\s_\-]/gu, '');
    }

    // Replace spaces and existing delimiters with the chosen separator
    const sepEscaped = separator === '-' ? '-' : '_';
    text = text.replace(/[\s\-_]+/g, separator);

    // Trim separator from edges
    if (separator === '-') {
      text = text.replace(/^-+|-+$/g, '');
    } else {
      text = text.replace(/^_+|_+$/g, '');
    }

    return text;
  }, [input, separator, lowercase, preserveUnicode]);

  const handleCopy = () => {
    if (!slug) return;
    navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onToast('Slug copied to clipboard');
  };

  const handleClear = () => {
    setInput('');
    onToast('Cleared input');
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_TITLE);
    onToast('Loaded sample title');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Link className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-slate-700">URL Slug Generator</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadSample}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Load Sample
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 border border-slate-200 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Input Text Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <label htmlFor="slug-input">Article Title, Headline, or String:</label>
            <span className="text-slate-400 font-mono text-[11px]">
              {input.length} characters · {input.trim() ? input.trim().split(/\s+/).length : 0} words
            </span>
          </div>
          <textarea
            id="slug-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste headline here (e.g. 10 Best Tools for Web Developers)..."
            rows={3}
            className="w-full p-4 font-sans text-sm text-slate-900 bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 resize-y leading-relaxed"
          />
        </div>

        {/* Configuration Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span>Slug Formatting Settings:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Delimiter */}
            <div>
              <label htmlFor="slug-separator" className="block font-semibold text-slate-700 mb-1.5">
                Word Separator:
              </label>
              <select
                id="slug-separator"
                value={separator}
                onChange={(e) => setSeparator(e.target.value as '-' | '_')}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs outline-none focus:border-indigo-500"
              >
                <option value="-">Hyphen / Dash (-)</option>
                <option value="_">Underscore (_)</option>
              </select>
            </div>

            {/* Casing */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Letter Case:
              </label>
              <label className="flex items-center gap-2 h-9 px-3 bg-white border border-slate-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={lowercase}
                  onChange={(e) => setLowercase(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="text-slate-700 font-medium">Force Lowercase (recommended)</span>
              </label>
            </div>

            {/* Unicode handling */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Character Encoding:
              </label>
              <label className="flex items-center gap-2 h-9 px-3 bg-white border border-slate-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={preserveUnicode}
                  onChange={(e) => setPreserveUnicode(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="text-slate-700 font-medium">Preserve Unicode (accents, UTF-8)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Result Output Card */}
        <div className="p-5 rounded-2xl bg-white border border-indigo-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Generated Clean Slug:</span>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              Length: {slug.length} characters
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 font-mono text-sm text-slate-800 break-all select-all flex items-center justify-between gap-3">
            <span>{slug || <span className="text-slate-400 italic">Slug will appear here...</span>}</span>
            <button
              onClick={handleCopy}
              disabled={!slug}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0 disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Slug'}</span>
            </button>
          </div>

          {/* URL Preview */}
          {slug && (
            <div className="text-xs text-slate-500 pt-1">
              <span className="text-slate-400">Preview: </span>
              <span className="font-mono text-indigo-600">https://example.com/blog/{slug}</span>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
};
