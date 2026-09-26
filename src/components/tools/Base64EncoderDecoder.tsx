import React, { useState, useMemo } from 'react';
import { Copy, Trash2, Check, ArrowRightLeft, Binary, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface Base64EncoderDecoderProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

const SAMPLE_TEXT = 'ToolNest is fast, private, and 100% free! 🚀 简体中文 & Español.';
const SAMPLE_BASE64 = 'VG9vbE5lc3QgaXMgZmFzdCwgcHJpdmF0ZSwgYW5kIDEwMCUgZnJlZSEg8J+agCDnrpfkvZPkuK3mlocgJiBFc3Bhw7FvbC4=';

// Robust UTF-8 safe Base64 encoder using standard Web TextEncoder
function utf8ToBase64(str: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Robust UTF-8 safe Base64 decoder using standard Web TextDecoder
function base64ToUtf8(base64: string): string {
  // Strip whitespace and newlines
  const cleaned = base64.replace(/\s+/g, '');
  const binary = atob(cleaned);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const decoder = new TextDecoder('utf-8', { fatal: true });
  return decoder.decode(bytes);
}

export const Base64EncoderDecoder: React.FC<Base64EncoderDecoderProps> = ({ tool, onToast }) => {
  const [input, setInput] = useState(SAMPLE_TEXT);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  // Purely compute conversion without render-time side effects
  const { output, error } = useMemo(() => {
    if (!input.trim()) {
      return { output: '', error: null };
    }

    try {
      if (mode === 'encode') {
        const res = utf8ToBase64(input);
        return { output: res, error: null };
      } else {
        const res = base64ToUtf8(input);
        return { output: res, error: null };
      }
    } catch (err: any) {
      return {
        output: '',
        error:
          mode === 'decode'
            ? 'Invalid Base64 sequence. Please ensure the input contains valid Base64 characters (A-Z, a-z, 0-9, +, /, =) and correct padding.'
            : `Encoding error: ${err.message}`
      };
    }
  }, [input, mode]);

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
      setInput(SAMPLE_TEXT);
    } else {
      setInput(SAMPLE_BASE64);
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
              Encode (Text → Base64)
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'decode'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Decode (Base64 → Text)
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
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

        {/* Validation / Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">Validation Error:</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Dual Editor Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Input Panel */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <label htmlFor="base64-input-editor">
                {mode === 'encode' ? 'Plain Text Input (Unicode Supported):' : 'Base64 Encoded Input:'}
              </label>
              <span className="text-slate-400 font-normal font-mono tabular-nums">{input.length} chars</span>
            </div>
            <textarea
              id="base64-input-editor"
              rows={8}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? 'Type or paste plain text here to encode...' : 'Paste Base64 string here to decode...'}
              className="w-full p-3.5 font-mono text-xs sm:text-sm text-slate-900 bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 resize-y"
            />
          </div>

          {/* Output Panel */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>{mode === 'encode' ? 'Base64 Result:' : 'Decoded Plain Text:'}</span>
                <span className="text-slate-400 font-normal font-mono tabular-nums">{output.length} chars</span>
              </div>
              <textarea
                readOnly
                rows={8}
                value={output}
                placeholder="Conversion will appear here automatically..."
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

        {/* Feature highlight */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <strong className="text-slate-800 font-semibold block mb-0.5">Full UTF-8 Unicode Architecture:</strong>
          <span>
            Standard browser <code>btoa</code> and <code>atob</code> crash when encountering characters outside the Latin1 range. ToolNest incorporates standard <code>TextEncoder</code> and <code>TextDecoder</code> pipelines so emojis, accented vowels, and global alphabets are encoded and decoded with 100% fidelity.
          </span>
        </div>
      </div>
    </ToolLayout>
  );
};
