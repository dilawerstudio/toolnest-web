import React, { useState, useMemo } from 'react';
import { Copy, Trash2, Check, Download, ArrowRightLeft, Sparkles, Code, FileText } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface HtmlEncoderProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

const NAMED_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '©': '&copy;',
  '®': '&reg;',
  '™': '&trade;',
  '€': '&euro;',
  '£': '&pound;',
  '¥': '&yen;',
  '•': '&bull;',
  '—': '&mdash;',
  '–': '&ndash;',
  '«': '&laquo;',
  '»': '&raquo;',
  '×': '&times;',
  '÷': '&divide;',
  '±': '&plusmn;',
  '≠': '&ne;',
  '≤': '&le;',
  '≥': '&ge;',
  'é': '&eacute;',
  'è': '&egrave;',
  'ê': '&ecirc;',
  'ë': '&euml;',
  'á': '&aacute;',
  'à': '&agrave;',
  'â': '&acirc;',
  'ä': '&auml;',
  'ó': '&oacute;',
  'ò': '&ograve;',
  'ô': '&ocirc;',
  'ö': '&ouml;',
  'í': '&iacute;',
  'ì': '&igrave;',
  'î': '&icirc;',
  'ï': '&iuml;',
  'ú': '&uacute;',
  'ù': '&ugrave;',
  'û': '&ucirc;',
  'ü': '&uuml;',
  'ñ': '&ntilde;',
  'ç': '&ccedil;',
};

const SAMPLE_HTML = `<div class="hero-banner" id="main-header">
  <h1>Welcome to ToolNest & Friends!</h1>
  <p>100% Client-Side "Fast & Private" Utilities © 2026.</p>
  <a href="https://toolnest.dev?ref=home&lang=en">Visit Us & Save > 50%</a>
</div>`;

const SAMPLE_ENTITIES = `&lt;div class=&quot;hero-banner&quot;&gt;
  &lt;h1&gt;Welcome to ToolNest &amp; Friends!&lt;/h1&gt;
  &lt;p&gt;100% Client-Side &quot;Fast &amp; Private&quot; Utilities &copy; 2026.&lt;/p&gt;
&lt;/div&gt;`;

export const HtmlEncoder: React.FC<HtmlEncoderProps> = ({ tool, onToast }) => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [inputText, setInputText] = useState<string>(SAMPLE_HTML);
  const [encodeScope, setEncodeScope] = useState<'basic' | 'extended' | 'numeric'>('basic');
  const [copied, setCopied] = useState<boolean>(false);

  // Encode logic
  const encodedText = useMemo(() => {
    if (!inputText) return '';

    if (encodeScope === 'basic') {
      return inputText.replace(/[&<>"']/g, (char) => {
        switch (char) {
          case '&': return '&amp;';
          case '<': return '&lt;';
          case '>': return '&gt;';
          case '"': return '&quot;';
          case "'": return '&#39;';
          default: return char;
        }
      });
    }

    if (encodeScope === 'numeric') {
      return inputText.replace(/[^\w\s]/g, (char) => {
        return `&#${char.charCodeAt(0)};`;
      });
    }

    // Extended named entities + fallback
    let result = '';
    for (const char of inputText) {
      if (NAMED_ENTITIES[char]) {
        result += NAMED_ENTITIES[char];
      } else if (char.charCodeAt(0) > 127) {
        result += `&#${char.charCodeAt(0)};`;
      } else {
        result += char;
      }
    }
    return result;
  }, [inputText, encodeScope]);

  // Safe Decode logic using browser DOMParser or textarea
  const decodedText = useMemo(() => {
    if (!inputText) return '';
    try {
      const doc = new DOMParser().parseFromString(inputText, 'text/html');
      return doc.documentElement.textContent || '';
    } catch {
      const txt = document.createElement('textarea');
      txt.innerHTML = inputText;
      return txt.value;
    }
  }, [inputText]);

  const outputText = mode === 'encode' ? encodedText : decodedText;

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onToast(`Copied ${mode === 'encode' ? 'encoded HTML entities' : 'decoded text'}`);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `html-${mode === 'encode' ? 'encoded' : 'decoded'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    onToast('Downloaded result file');
  };

  const handleClear = () => {
    setInputText('');
    onToast('Cleared input');
  };

  const handleSwap = () => {
    const nextMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(nextMode);
    setInputText(outputText);
    onToast(`Swapped to ${nextMode} mode`);
  };

  const handleLoadSample = (type: 'html' | 'entities') => {
    if (type === 'html') {
      setMode('encode');
      setInputText(SAMPLE_HTML);
      onToast('Loaded sample HTML');
    } else {
      setMode('decode');
      setInputText(SAMPLE_ENTITIES);
      onToast('Loaded sample HTML entities');
    }
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Controls Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setMode('encode')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                mode === 'encode'
                  ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Encode (Text → Entities)
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                mode === 'decode'
                  ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Decode (Entities → Text)
            </button>
          </div>

          {mode === 'encode' && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500 mr-1">Scope:</span>
              <button
                onClick={() => setEncodeScope('basic')}
                className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                  encodeScope === 'basic'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title="Encodes reserved characters: amp, lt, gt, quotes"
              >
                Basic HTML (&amp;, &lt;, &gt;)
              </button>
              <button
                onClick={() => setEncodeScope('extended')}
                className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                  encodeScope === 'extended'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title="Encodes special characters and non-ASCII symbols"
              >
                Extended (Named)
              </button>
              <button
                onClick={() => setEncodeScope('numeric')}
                className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                  encodeScope === 'numeric'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title="Encodes characters to numeric decimal entities"
              >
                Decimal (Numeric)
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLoadSample(mode === 'encode' ? 'html' : 'entities')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Sample
            </button>
            <button
              onClick={handleSwap}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
              title="Swap input and output"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              Swap
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

        {/* Editor Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Input Panel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="font-semibold text-slate-700">
                {mode === 'encode' ? 'Raw HTML / Text Input' : 'HTML Entities Input'}
              </span>
              <span>{inputText.length} chars · {inputText.split(/\r\n|\r|\n/).length} lines</span>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={mode === 'encode' ? 'Type or paste raw HTML/text to encode...' : 'Paste &lt;div&gt; entities to decode...'}
              rows={12}
              className="w-full font-mono text-xs p-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y shadow-sm"
              spellCheck={false}
            />
          </div>

          {/* Output Panel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="font-semibold text-slate-700">
                {mode === 'encode' ? 'Encoded Output (Safe Entities)' : 'Decoded Text Output'}
              </span>
              <span>{outputText.length} chars · {outputText.split(/\r\n|\r|\n/).length} lines</span>
            </div>
            <textarea
              value={outputText}
              readOnly
              placeholder="Result will appear here automatically..."
              rows={12}
              className="w-full font-mono text-xs p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none text-slate-800 transition-all resize-y"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-500" />
            <span>Prevents XSS attacks and preserves code formatting in web browsers.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={!outputText}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Download className="w-4 h-4 text-slate-500" />
              Download
            </button>
            <button
              onClick={handleCopy}
              disabled={!outputText}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-sm ${
                copied
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Entity Text' : 'Copy Output'}
            </button>
          </div>
        </div>

        {/* Quick Reference Table */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Common Essential HTML Entities Reference</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs">
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="text-slate-400 font-mono block text-[10px]">Ampersand (&amp;)</span>
              <code className="text-indigo-600 font-semibold">&amp;amp;</code>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="text-slate-400 font-mono block text-[10px]">Less Than (&lt;)</span>
              <code className="text-indigo-600 font-semibold">&amp;lt;</code>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="text-slate-400 font-mono block text-[10px]">Greater Than (&gt;)</span>
              <code className="text-indigo-600 font-semibold">&amp;gt;</code>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="text-slate-400 font-mono block text-[10px]">Quote (&quot;)</span>
              <code className="text-indigo-600 font-semibold">&amp;quot;</code>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="text-slate-400 font-mono block text-[10px]">Apostrophe (&#39;)</span>
              <code className="text-indigo-600 font-semibold">&amp;#39;</code>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="text-slate-400 font-mono block text-[10px]">Copyright (&copy;)</span>
              <code className="text-indigo-600 font-semibold">&amp;copy;</code>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
