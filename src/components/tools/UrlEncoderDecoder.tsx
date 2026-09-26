import React, { useState, useMemo } from 'react';
import { Copy, Trash2, Check, ArrowRightLeft, Link, AlertTriangle } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface UrlEncoderDecoderProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

const SAMPLE_RAW = 'https://toolnest.example.com/search?category=Developer Utilities&query=JSON & XML!#section-2';
const SAMPLE_ENCODED = 'https%3A%2F%2Ftoolnest.example.com%2Fsearch%3Fcategory%3DDeveloper%20Utilities%26query%3DJSON%20%26%20XML!%23section-2';

export const UrlEncoderDecoder: React.FC<UrlEncoderDecoderProps> = ({ tool, onToast }) => {
  const [input, setInput] = useState(SAMPLE_RAW);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodeScope, setEncodeScope] = useState<'component' | 'full'>('component');
  const [copied, setCopied] = useState(false);

  // Purely compute conversion without render-time side-effects
  const { output, error } = useMemo(() => {
    if (!input) {
      return { output: '', error: null };
    }

    try {
      if (mode === 'encode') {
        const res = encodeScope === 'component' ? encodeURIComponent(input) : encodeURI(input);
        return { output: res, error: null };
      } else {
        const res = encodeScope === 'component' ? decodeURIComponent(input) : decodeURI(input);
        return { output: res, error: null };
      }
    } catch (err: any) {
      return {
        output: '',
        error: `Malformed URI sequence: ${err.message || 'Cannot decode invalid percent-encoding.'}`
      };
    }
  }, [input, mode, encodeScope]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    onToast('Copied result to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    onToast('Input cleared');
  };

  const handleSwap = () => {
    if (output) {
      setInput(output);
      setMode(mode === 'encode' ? 'decode' : 'encode');
      onToast(`Swapped to ${mode === 'encode' ? 'Decode' : 'Encode'} mode`);
    } else {
      setMode(mode === 'encode' ? 'decode' : 'encode');
    }
  };

  const handleLoadSample = () => {
    if (mode === 'encode') {
      setInput(SAMPLE_RAW);
    } else {
      setInput(SAMPLE_ENCODED);
    }
    onToast('Sample loaded');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setMode('encode')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'encode'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Encode (Text → URI)
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'decode'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Decode (URI → Text)
            </button>
          </div>

          {/* Scope & Actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span className="hidden sm:inline">Scope:</span>
              <select
                value={encodeScope}
                onChange={(e) => setEncodeScope(e.target.value as any)}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs outline-none"
              >
                <option value="component">Component (encodeURIComponent)</option>
                <option value="full">Full URI (encodeURI)</option>
              </select>
            </div>

            <button
              onClick={handleSwap}
              className="flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              title="Swap input and output"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Swap</span>
            </button>

            <button
              onClick={handleLoadSample}
              className="text-xs font-medium text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Sample
            </button>

            <button
              onClick={handleClear}
              disabled={!input}
              className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-rose-600 px-2 py-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 transition-colors disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">Decoding Error:</strong>
              <p className="font-mono text-rose-900">{error}</p>
            </div>
          </div>
        )}

        {/* Side-by-side or stacked Editor Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Input Panel */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <label htmlFor="url-input-area">
                {mode === 'encode' ? 'Raw Text / URL to Encode:' : 'Encoded URL to Decode:'}
              </label>
              <span className="text-slate-400 font-normal font-mono tabular-nums">{input.length} chars</span>
            </div>
            <textarea
              id="url-input-area"
              rows={8}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? 'Paste URL or query parameter string here...' : 'Paste percent-encoded URL string here...'}
              className="w-full p-3.5 font-mono text-xs sm:text-sm text-slate-900 bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 resize-y"
            />
          </div>

          {/* Output Panel */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>{mode === 'encode' ? 'Percent-Encoded Output:' : 'Decoded Text Output:'}</span>
                <span className="text-slate-400 font-normal font-mono tabular-nums">{output.length} chars</span>
              </div>
              <textarea
                readOnly
                rows={8}
                value={output}
                placeholder="Result will appear here in real-time..."
                className="w-full p-3.5 font-mono text-xs sm:text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none select-all resize-y"
              />
            </div>

            <div className="pt-3 flex justify-end">
              <button
                onClick={handleCopy}
                disabled={!output}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Result'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Explanatory note */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <strong className="text-slate-800 font-semibold block mb-0.5">Component vs. Full URI:</strong>
          <span>
            {encodeScope === 'component'
              ? 'Component mode encodes all non-alphanumeric characters, including "/", "?", "&", and "=", making it safe for query string parameter values.'
              : 'Full URI mode preserves URL structural delimiters like "https://", "/", "?", and "&", encoding only characters not allowed in standard URIs (like spaces and quotes).'}
          </span>
        </div>
      </div>
    </ToolLayout>
  );
};
