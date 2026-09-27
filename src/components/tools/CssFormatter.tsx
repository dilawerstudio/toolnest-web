import React, { useState, useMemo } from 'react';
import { Copy, Trash2, Check, Download, Sparkles, FileCode, Sliders, AlertTriangle } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface CssFormatterProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

const SAMPLE_CSS = `/* ToolNest Global Layout Styles */
:root {
  --primary-color: #4f46e5;
  --bg-dark: #0f172a;
  --radius-xl: 16px;
}

.hero-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1.5rem;
  background-color: var(--bg-dark);
}

.hero-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .hero-container {
    flex-direction: row;
    padding: 6rem 2rem;
  }
  .hero-title {
    font-size: 3.5rem;
  }
}

@keyframes pulse-ring {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
}`;

// Format CSS with indentation
function beautifyCss(css: string, indentStr: string): string {
  // Strip comments temporarily or preserve
  let clean = css.trim();
  if (!clean) return '';

  let formatted = '';
  let depth = 0;
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    const prev = i > 0 ? clean[i - 1] : '';
    const next = i < clean.length - 1 ? clean[i + 1] : '';

    if ((char === '"' || char === "'") && prev !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (stringChar === char) {
        inString = false;
      }
      formatted += char;
      continue;
    }

    if (inString) {
      formatted += char;
      continue;
    }

    if (char === '{') {
      depth++;
      formatted = formatted.trimEnd() + ' {\n' + indentStr.repeat(depth);
    } else if (char === '}') {
      depth = Math.max(0, depth - 1);
      formatted = formatted.trimEnd() + '\n' + indentStr.repeat(depth) + '}\n' + (depth === 0 ? '\n' : '') + indentStr.repeat(depth);
    } else if (char === ';') {
      formatted += ';\n' + indentStr.repeat(depth);
    } else if (char === ':' && next !== ':') {
      formatted += ': ';
    } else if (char === '\n' || char === '\r') {
      // Collapse redundant breaks
      if (!formatted.endsWith('\n')) {
        formatted += '\n' + indentStr.repeat(depth);
      }
    } else if (/\s/.test(char)) {
      if (!/\s/.test(prev)) {
        formatted += ' ';
      }
    } else {
      formatted += char;
    }
  }

  // Clean trailing blank lines
  return formatted
    .split('\n')
    .map((l) => l.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Minify CSS
function minifyCss(css: string): string {
  return css
    // Remove multi-line comments /* ... */
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove whitespace around symbols
    .replace(/\s*([{};:,>+~])\s*/g, '$1')
    // Remove trailing semicolons before closing brace
    .replace(/;}/g, '}')
    // Collapse multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}

export const CssFormatter: React.FC<CssFormatterProps> = ({ tool, onToast }) => {
  const [inputCss, setInputCss] = useState<string>(SAMPLE_CSS);
  const [indentOption, setIndentOption] = useState<'2' | '4' | 'tab'>('2');
  const [mode, setMode] = useState<'beautify' | 'minify'>('beautify');
  const [copied, setCopied] = useState<boolean>(false);

  const indentStr = useMemo(() => {
    if (indentOption === '4') return '    ';
    if (indentOption === 'tab') return '\t';
    return '  ';
  }, [indentOption]);

  const outputCss = useMemo(() => {
    if (!inputCss.trim()) return '';
    if (mode === 'minify') {
      return minifyCss(inputCss);
    }
    return beautifyCss(inputCss, indentStr);
  }, [inputCss, mode, indentStr]);

  // Syntax check
  const syntaxCheck = useMemo(() => {
    let openCount = 0;
    let closeCount = 0;
    for (const char of inputCss) {
      if (char === '{') openCount++;
      if (char === '}') closeCount++;
    }
    return {
      isValid: openCount === closeCount,
      openCount,
      closeCount,
      mismatch: Math.abs(openCount - closeCount),
    };
  }, [inputCss]);

  // Statistics
  const stats = useMemo(() => {
    const rawBytes = new Blob([inputCss]).size;
    const outBytes = new Blob([outputCss]).size;
    const diff = rawBytes - outBytes;
    const pct = rawBytes > 0 ? Math.round((diff / rawBytes) * 100) : 0;
    return { rawBytes, outBytes, diff, pct };
  }, [inputCss, outputCss]);

  const handleCopy = () => {
    if (!outputCss) return;
    navigator.clipboard.writeText(outputCss);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onToast(`Copied ${mode === 'minify' ? 'minified' : 'formatted'} CSS`);
  };

  const handleDownload = () => {
    if (!outputCss) return;
    const blob = new Blob([outputCss], { type: 'text/css;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `styles-${mode}.css`;
    link.click();
    URL.revokeObjectURL(url);
    onToast('Downloaded CSS stylesheet');
  };

  const handleClear = () => {
    setInputCss('');
    onToast('Cleared CSS input');
  };

  const handleLoadSample = () => {
    setInputCss(SAMPLE_CSS);
    onToast('Loaded CSS sample');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setMode('beautify')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                mode === 'beautify'
                  ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Format / Beautify
            </button>
            <button
              onClick={() => setMode('minify')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                mode === 'minify'
                  ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Minify / Compress
            </button>
          </div>

          {mode === 'beautify' && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500 mr-1 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" /> Indent:
              </span>
              {(['2', '4', 'tab'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setIndentOption(opt)}
                  className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                    indentOption === opt
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt === 'tab' ? 'Tabs' : `${opt} Spaces`}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Sample
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        </div>

        {/* Warning if unbalanced braces */}
        {!syntaxCheck.isValid && inputCss.trim().length > 0 && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Potential CSS syntax warning:</strong> Found {syntaxCheck.openCount} opening braces &#123; and {syntaxCheck.closeCount} closing braces &#125;. Please ensure all rules are properly terminated.
            </span>
          </div>
        )}

        {/* Editor Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Input Panel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="font-semibold text-slate-700">Source CSS</span>
              <span>{stats.rawBytes} bytes · {inputCss.split('\n').length} lines</span>
            </div>
            <textarea
              value={inputCss}
              onChange={(e) => setInputCss(e.target.value)}
              placeholder="Paste or write your CSS stylesheet here..."
              rows={14}
              className="w-full font-mono text-xs p-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y shadow-sm"
              spellCheck={false}
            />
          </div>

          {/* Output Panel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="font-semibold text-slate-700">
                {mode === 'minify' ? 'Minified CSS Result' : 'Formatted CSS Result'}
              </span>
              <span>
                {stats.outBytes} bytes
                {mode === 'minify' && stats.diff > 0 && (
                  <span className="text-emerald-600 font-semibold ml-1.5">
                    (-{stats.pct}% saved)
                  </span>
                )}
              </span>
            </div>
            <textarea
              value={outputCss}
              readOnly
              placeholder="Clean CSS will display here..."
              rows={14}
              className="w-full font-mono text-xs p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none text-slate-800 transition-all resize-y"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Action & Stats Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-indigo-500" />
            <span>
              {mode === 'minify'
                ? `Saved ${stats.diff > 0 ? stats.diff : 0} bytes (${stats.pct}% reduction) by removing spaces and comments.`
                : 'Formats selectors, media queries, keyframe animations, and CSS variables cleanly.'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={!outputCss}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Download className="w-4 h-4 text-slate-500" />
              Download .css
            </button>
            <button
              onClick={handleCopy}
              disabled={!outputCss}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-sm ${
                copied
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied CSS' : 'Copy Output'}
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
