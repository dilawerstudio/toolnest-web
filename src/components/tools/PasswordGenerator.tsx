import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Copy, RefreshCw, Check, ShieldCheck, Key, AlertCircle } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface PasswordGeneratorProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

export const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({ tool, onToast }) => {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [bulkCount, setBulkCount] = useState<1 | 5 | 10>(1);

  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Generate cryptographically secure random password
  const generatePassword = useCallback((): string => {
    let charset = '';
    if (useUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) charset += '0123456789';
    if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (excludeAmbiguous) {
      charset = charset.replace(/[1lI0Oo]/g, '');
    }

    if (!charset) return '';

    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset[randomValues[i] % charset.length];
    }
    return result;
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous]);

  const regenerate = useCallback(() => {
    const list: string[] = [];
    for (let i = 0; i < bulkCount; i++) {
      list.push(generatePassword());
    }
    setPasswords(list);
  }, [bulkCount, generatePassword]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  // Entropy and Strength analysis
  const primaryPassword = passwords[0] || '';
  const analysis = useMemo(() => {
    let poolSize = 0;
    if (useUpper) poolSize += 26;
    if (useLower) poolSize += 26;
    if (useNumbers) poolSize += 10;
    if (useSymbols) poolSize += 30;
    if (excludeAmbiguous) poolSize -= 6;
    poolSize = Math.max(poolSize, 1);

    const entropy = Math.round(length * Math.log2(poolSize));

    let strength = 'Weak';
    let color = 'text-rose-600 bg-rose-50 border-rose-200';
    let crackTime = 'A few seconds';

    if (entropy >= 80) {
      strength = 'Very Strong';
      color = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      crackTime = 'Centuries (Billions of years)';
    } else if (entropy >= 60) {
      strength = 'Strong';
      color = 'text-indigo-700 bg-indigo-50 border-indigo-200';
      crackTime = 'Thousands of years';
    } else if (entropy >= 45) {
      strength = 'Moderate';
      color = 'text-amber-700 bg-amber-50 border-amber-200';
      crackTime = 'Several months';
    } else {
      strength = 'Weak';
      color = 'text-rose-700 bg-rose-50 border-rose-200';
      crackTime = 'Instantly or minutes';
    }

    return { entropy, strength, color, crackTime, poolSize };
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous]);

  const handleCopy = (pwd: string, index: number) => {
    if (!pwd) return;
    navigator.clipboard.writeText(pwd);
    setCopiedIndex(index);
    onToast('Password copied securely to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const hasAnyCharset = useUpper || useLower || useNumbers || useSymbols;

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Primary Generated Output Box */}
        <div className="relative">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="w-full truncate font-mono text-base sm:text-xl font-medium tracking-wider text-emerald-400 select-all text-center sm:text-left">
              {hasAnyCharset ? primaryPassword : 'Select at least one character type'}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={regenerate}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Regenerate new password"
                aria-label="Regenerate"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleCopy(primaryPassword, 0)}
                disabled={!hasAnyCharset}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors disabled:opacity-40"
              >
                {copiedIndex === 0 ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Strength & Entropy Indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block mb-0.5">Strength Rating</span>
            <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold border ${analysis.color}`}>
              {analysis.strength}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block mb-0.5">Cryptographic Entropy</span>
            <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
              {analysis.entropy} bits
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block mb-0.5">Brute-Force Resistance</span>
            <span className="text-xs font-semibold text-slate-800">
              {analysis.crackTime}
            </span>
          </div>
        </div>

        {/* Generator Controls */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-5">
          {/* Length Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-2">
              <label htmlFor="pwd-length-slider">Password Length:</label>
              <span className="text-indigo-600 font-mono text-sm tabular-nums">{length} characters</span>
            </div>
            <input
              id="pwd-length-slider"
              type="range"
              min={6}
              max={64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>6</span>
              <span>16 (Recommended)</span>
              <span>32</span>
              <span>64</span>
            </div>
          </div>

          {/* Character Checkboxes */}
          <div>
            <span className="block text-xs font-semibold text-slate-700 mb-2">
              Character Inclusions:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={useUpper}
                  onChange={(e) => setUseUpper(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <div>
                  <span className="font-semibold text-slate-800 block">Uppercase Letters</span>
                  <span className="text-[11px] text-slate-500 font-mono">A-Z</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={useLower}
                  onChange={(e) => setUseLower(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <div>
                  <span className="font-semibold text-slate-800 block">Lowercase Letters</span>
                  <span className="text-[11px] text-slate-500 font-mono">a-z</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={useNumbers}
                  onChange={(e) => setUseNumbers(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <div>
                  <span className="font-semibold text-slate-800 block">Numbers & Digits</span>
                  <span className="text-[11px] text-slate-500 font-mono">0-9</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={useSymbols}
                  onChange={(e) => setUseSymbols(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <div>
                  <span className="font-semibold text-slate-800 block">Special Symbols</span>
                  <span className="text-[11px] text-slate-500 font-mono">!@#$%^&*()_+-=</span>
                </div>
              </label>
            </div>
          </div>

          {/* Filters & Bulk Quantity */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={excludeAmbiguous}
                onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <span>Avoid Ambiguous Characters (e.g. 1, l, I, 0, O)</span>
            </label>

            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-medium">Quantity:</span>
              {[1, 5, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setBulkCount(num as 1 | 5 | 10)}
                  className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
                    bulkCount === num
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bulk Password List if quantity > 1 */}
        {bulkCount > 1 && (
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Batch Generated Passwords ({passwords.length})
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
              {passwords.map((pwd, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <span className="font-mono text-xs text-slate-800 break-all select-all pr-4">
                    {pwd}
                  </span>
                  <button
                    onClick={() => handleCopy(pwd, idx)}
                    className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 shrink-0"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
