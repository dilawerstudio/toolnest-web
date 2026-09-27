import React, { useState, useEffect } from 'react';
import { Copy, Check, Download, RefreshCw, Key, Trash2 } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface UuidGeneratorProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

// Generate single UUID v4
function generateV4(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Standard RFC4122 v4 fallback via crypto.getRandomValues
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const buf = new Uint8Array(16);
    crypto.getRandomValues(buf);
    buf[6] = (buf[6] & 0x0f) | 0x40; // version 4
    buf[8] = (buf[8] & 0x3f) | 0x80; // variant RFC4122
    const hex = Array.from(buf).map((b) => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  // Math.random fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const UuidGenerator: React.FC<UuidGeneratorProps> = ({ tool, onToast }) => {
  const [quantity, setQuantity] = useState<number>(5);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [includeHyphens, setIncludeHyphens] = useState<boolean>(true);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const generateBatch = (count: number, isUpper: boolean, withHyphens: boolean) => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      let id = generateV4();
      if (!withHyphens) {
        id = id.replace(/-/g, '');
      }
      if (isUpper) {
        id = id.toUpperCase();
      } else {
        id = id.toLowerCase();
      }
      list.push(id);
    }
    setUuids(list);
  };

  useEffect(() => {
    generateBatch(quantity, uppercase, includeHyphens);
  }, []);

  const handleRegenerate = () => {
    generateBatch(quantity, uppercase, includeHyphens);
    onToast(`Generated ${quantity} new UUIDs`);
  };

  const handleQuantityChange = (q: number) => {
    setQuantity(q);
    generateBatch(q, uppercase, includeHyphens);
  };

  const handleCaseChange = (isUpper: boolean) => {
    setUppercase(isUpper);
    setUuids((prev) =>
      prev.map((id) => (isUpper ? id.toUpperCase() : id.toLowerCase()))
    );
  };

  const handleHyphenChange = (withHyphens: boolean) => {
    setIncludeHyphens(withHyphens);
    generateBatch(quantity, uppercase, withHyphens);
  };

  const handleCopySingle = (id: string, index: number) => {
    navigator.clipboard.writeText(id);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
    onToast('UUID copied to clipboard');
  };

  const handleCopyAll = () => {
    if (uuids.length === 0) return;
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
    onToast(`Copied all ${uuids.length} UUIDs`);
  };

  const handleDownload = () => {
    if (uuids.length === 0) return;
    const blob = new Blob([uuids.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids-${uuids.length}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    onToast('Downloaded UUIDs text file');
  };

  const handleClear = () => {
    setUuids([]);
    onToast('Cleared UUID list');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-slate-700">UUID v4 (Universally Unique Identifier) Generator</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRegenerate}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
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

        {/* Configuration Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {/* Quantity */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Quantity to Generate:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[1, 5, 10, 25, 50].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleQuantityChange(q)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      quantity === q
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Letter Casing */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Casing:
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleCaseChange(false)}
                  className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg border transition-all ${
                    !uppercase
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  lowercase (standard)
                </button>
                <button
                  type="button"
                  onClick={() => handleCaseChange(true)}
                  className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg border transition-all ${
                    uppercase
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  UPPERCASE
                </button>
              </div>
            </div>

            {/* Hyphens */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Format:
              </label>
              <label className="flex items-center gap-2 h-9 px-3 bg-white border border-slate-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHyphens}
                  onChange={(e) => handleHyphenChange(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="text-xs text-slate-700 font-medium">Standard Hyphens (8-4-4-4-12)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results List */}
        {uuids.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">
                Generated {uuids.length} Cryptographic UUID v4:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </button>
                <button
                  onClick={handleCopyAll}
                  className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? 'Copied All!' : 'Copy All'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {uuids.map((id, index) => (
                <div
                  key={`${id}-${index}`}
                  className="p-3 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 font-mono text-xs sm:text-sm text-slate-800 transition-colors shadow-2xs group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 text-[11px] text-slate-400 font-sans text-right select-none">
                      {index + 1}.
                    </span>
                    <span className="truncate select-all">{id}</span>
                  </div>
                  <button
                    onClick={() => handleCopySingle(id, index)}
                    title="Copy individual UUID"
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors shrink-0"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500">
            Click "Regenerate" above to create a new batch of UUIDs.
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
