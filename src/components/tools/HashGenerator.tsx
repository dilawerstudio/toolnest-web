import React, { useState, useEffect } from 'react';
import { Copy, Check, Trash2, Fingerprint, Info, Sparkles } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface HashGeneratorProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

type Algorithm = 'SHA-256' | 'SHA-384' | 'SHA-512' | 'SHA-1';

const SAMPLE_TEXT = 'Hello ToolNest! Secure, fast, and 100% client-side.';

export const HashGenerator: React.FC<HashGeneratorProps> = ({ tool, onToast }) => {
  const [input, setInput] = useState<string>(SAMPLE_TEXT);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [hashes, setHashes] = useState<Record<Algorithm, string>>({
    'SHA-256': '',
    'SHA-384': '',
    'SHA-512': '',
    'SHA-1': '',
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Compute all hashes via Web Crypto API
  useEffect(() => {
    let isCancelled = false;

    async function computeHashes() {
      if (!input) {
        setHashes({
          'SHA-256': '',
          'SHA-384': '',
          'SHA-512': '',
          'SHA-1': '',
        });
        return;
      }

      const encoder = new TextEncoder();
      const data = encoder.encode(input);

      const algos: Algorithm[] = ['SHA-256', 'SHA-384', 'SHA-512', 'SHA-1'];
      const nextHashes: Record<Algorithm, string> = {
        'SHA-256': '',
        'SHA-384': '',
        'SHA-512': '',
        'SHA-1': '',
      };

      for (const algo of algos) {
        try {
          const hashBuf = await crypto.subtle.digest(algo, data);
          const hashArray = Array.from(new Uint8Array(hashBuf));
          let hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
          if (uppercase) hashHex = hashHex.toUpperCase();
          nextHashes[algo] = hashHex;
        } catch (err) {
          nextHashes[algo] = 'Algorithm not supported by this browser';
        }
      }

      if (!isCancelled) {
        setHashes(nextHashes);
      }
    }

    computeHashes();

    return () => {
      isCancelled = true;
    };
  }, [input, uppercase]);

  const handleCopy = (algo: Algorithm) => {
    const val = hashes[algo];
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopiedKey(algo);
    setTimeout(() => setCopiedKey(null), 1500);
    onToast(`Copied ${algo} hash`);
  };

  const handleClear = () => {
    setInput('');
    onToast('Cleared input text');
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_TEXT);
    onToast('Loaded sample text');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-slate-700">Cryptographic Hash Generator (SHA-256 · SHA-384 · SHA-512 · SHA-1)</span>
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
            <label htmlFor="hash-input">Plaintext String to Hash (UTF-8 Encoded):</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span>Uppercase Hex</span>
              </label>
              <span className="text-slate-400 font-mono text-[11px]">
                {input.length} chars ({new TextEncoder().encode(input).length} bytes)
              </span>
            </div>
          </div>
          <textarea
            id="hash-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste any text or string to calculate cryptographic digests..."
            rows={4}
            className="w-full p-4 font-mono text-xs sm:text-sm text-slate-900 bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 resize-y leading-relaxed"
          />
        </div>

        {/* Hash Results Grid */}
        <div className="space-y-3">
          {(['SHA-256', 'SHA-512', 'SHA-384', 'SHA-1'] as Algorithm[]).map((algo) => (
            <div
              key={algo}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono text-[11px]">
                    {algo}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {algo === 'SHA-256' ? '(256 bits · 64 hex chars · Industry Standard)' : algo === 'SHA-512' ? '(512 bits · 128 hex chars · Highest Security)' : algo === 'SHA-384' ? '(384 bits · 96 hex chars)' : '(160 bits · 40 hex chars · Legacy Checksums)'}
                  </span>
                </span>
                <button
                  onClick={() => handleCopy(algo)}
                  disabled={!hashes[algo]}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-xs font-semibold text-slate-700 transition-colors disabled:opacity-40"
                >
                  {copiedKey === algo ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === algo ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg font-mono text-xs text-slate-800 break-all select-all">
                {hashes[algo] || <span className="text-slate-400 italic">Enter text above to compute hash...</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Informative Security Callout */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Info className="w-4 h-4 text-indigo-600" />
            <span>Understanding Cryptographic Hashes:</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">
            Cryptographic hash functions are deterministic, one-way mathematical algorithms. It is computationally infeasible to decrypt or reverse a hash back to its source text. Even a tiny change of a single character in the input will completely alter the resulting digest (the "avalanche effect"). All calculations execute entirely locally using your browser’s standard Web Cryptography API.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
};
