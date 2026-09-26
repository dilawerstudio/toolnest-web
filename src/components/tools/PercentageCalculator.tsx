import React, { useState, useMemo } from 'react';
import { Copy, Check, RotateCcw, ArrowRight } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface PercentageCalculatorProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

export const PercentageCalculator: React.FC<PercentageCalculatorProps> = ({ tool, onToast }) => {
  // Mode 1: What is P% of X?
  const [m1P, setM1P] = useState('15');
  const [m1X, setM1X] = useState('80');

  // Mode 2: X is what % of Y?
  const [m2X, setM2X] = useState('25');
  const [m2Y, setM2Y] = useState('200');

  // Mode 3: Percentage change from A to B
  const [m3A, setM3A] = useState('50');
  const [m3B, setM3B] = useState('75');

  // Mode 4: Add / Subtract P% to X (Discount / Tax)
  const [m4X, setM4X] = useState('120');
  const [m4P, setM4P] = useState('20');
  const [m4Op, setM4Op] = useState<'add' | 'subtract'>('subtract');

  const [activeTab, setActiveTab] = useState<'m1' | 'm2' | 'm3' | 'm4'>('m1');
  const [copied, setCopied] = useState(false);

  // Computations with useMemo
  const res1 = useMemo(() => {
    const p = parseFloat(m1P);
    const x = parseFloat(m1X);
    if (isNaN(p) || isNaN(x)) return null;
    const ans = (p / 100) * x;
    return {
      ans: Number(ans.toFixed(4)),
      formula: `(${p} ÷ 100) × ${x} = ${ans.toFixed(2)}`,
    };
  }, [m1P, m1X]);

  const res2 = useMemo(() => {
    const x = parseFloat(m2X);
    const y = parseFloat(m2Y);
    if (isNaN(x) || isNaN(y) || y === 0) return null;
    const ans = (x / y) * 100;
    return {
      ans: Number(ans.toFixed(4)),
      formula: `(${x} ÷ ${y}) × 100 = ${ans.toFixed(2)}%`,
    };
  }, [m2X, m2Y]);

  const res3 = useMemo(() => {
    const a = parseFloat(m3A);
    const b = parseFloat(m3B);
    if (isNaN(a) || isNaN(b) || a === 0) return null;
    const diff = b - a;
    const ans = (diff / Math.abs(a)) * 100;
    const isIncrease = diff >= 0;
    return {
      ans: Number(ans.toFixed(4)),
      diff: Number(diff.toFixed(4)),
      isIncrease,
      formula: `((${b} - ${a}) ÷ |${a}|) × 100 = ${ans.toFixed(2)}%`,
    };
  }, [m3A, m3B]);

  const res4 = useMemo(() => {
    const x = parseFloat(m4X);
    const p = parseFloat(m4P);
    if (isNaN(x) || isNaN(p)) return null;
    const delta = (p / 100) * x;
    const total = m4Op === 'add' ? x + delta : x - delta;
    return {
      total: Number(total.toFixed(4)),
      delta: Number(delta.toFixed(4)),
      formula: `${x} ${m4Op === 'add' ? '+' : '-'} ((${p}% of ${x}) = ${delta.toFixed(2)}) = ${total.toFixed(2)}`,
    };
  }, [m4X, m4P, m4Op]);

  const handleCopyResult = (val: string | number) => {
    navigator.clipboard.writeText(String(val));
    setCopied(true);
    onToast(`Copied ${val} to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Mode Selector Tabs (Interactive filter control) */}
        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('m1')}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'm1'
                ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            What is P% of X?
          </button>
          <button
            onClick={() => setActiveTab('m2')}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'm2'
                ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            X is what % of Y?
          </button>
          <button
            onClick={() => setActiveTab('m3')}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'm3'
                ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            % Change (Increase / Decrease)
          </button>
          <button
            onClick={() => setActiveTab('m4')}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'm4'
                ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Add / Subtract % (Discount / Tax)
          </button>
        </div>

        {/* Tab 1: What is P% of X? */}
        {activeTab === 'm1' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="m1-p" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Percentage (%):
                </label>
                <div className="relative">
                  <input
                    id="m1-p"
                    type="number"
                    value={m1P}
                    onChange={(e) => setM1P(e.target.value)}
                    className="w-full pl-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm tabular-nums"
                    placeholder="e.g. 15"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 text-sm font-semibold">%</span>
                </div>
              </div>

              <div>
                <label htmlFor="m1-x" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Of Value:
                </label>
                <input
                  id="m1-x"
                  type="number"
                  value={m1X}
                  onChange={(e) => setM1X(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm tabular-nums"
                  placeholder="e.g. 80"
                />
              </div>
            </div>

            {res1 && (
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-indigo-700 font-semibold uppercase tracking-wider block mb-1">
                    Result:
                  </span>
                  <div className="text-3xl font-extrabold text-slate-900 tabular-nums font-mono">
                    {res1.ans}
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block font-mono">
                    Formula: {res1.formula}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyResult(res1.ans)}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Answer</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: X is what % of Y? */}
        {activeTab === 'm2' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="m2-x" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Part Value (X):
                </label>
                <input
                  id="m2-x"
                  type="number"
                  value={m2X}
                  onChange={(e) => setM2X(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm tabular-nums"
                  placeholder="e.g. 25"
                />
              </div>

              <div>
                <label htmlFor="m2-y" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Total Value (Y):
                </label>
                <input
                  id="m2-y"
                  type="number"
                  value={m2Y}
                  onChange={(e) => setM2Y(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm tabular-nums"
                  placeholder="e.g. 200"
                />
              </div>
            </div>

            {res2 && (
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-indigo-700 font-semibold uppercase tracking-wider block mb-1">
                    Result:
                  </span>
                  <div className="text-3xl font-extrabold text-slate-900 tabular-nums font-mono">
                    {res2.ans}%
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block font-mono">
                    Formula: {res2.formula}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyResult(`${res2.ans}%`)}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Percentage</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Percentage Change */}
        {activeTab === 'm3' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="m3-a" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Original Value (From):
                </label>
                <input
                  id="m3-a"
                  type="number"
                  value={m3A}
                  onChange={(e) => setM3A(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm tabular-nums"
                  placeholder="e.g. 50"
                />
              </div>

              <div>
                <label htmlFor="m3-b" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  New Value (To):
                </label>
                <input
                  id="m3-b"
                  type="number"
                  value={m3B}
                  onChange={(e) => setM3B(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm tabular-nums"
                  placeholder="e.g. 75"
                />
              </div>
            </div>

            {res3 && (
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-indigo-700 font-semibold uppercase tracking-wider block mb-1">
                    {res3.isIncrease ? 'Percentage Increase' : 'Percentage Decrease'}
                  </span>
                  <div className={`text-3xl font-extrabold tabular-nums font-mono ${res3.isIncrease ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {res3.isIncrease ? '+' : ''}{res3.ans}%
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Absolute Difference: {res3.diff >= 0 ? `+${res3.diff}` : res3.diff} · Formula: {res3.formula}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyResult(`${res3.ans}%`)}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Change</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Add / Subtract Percentage (Discount & Tax) */}
        {activeTab === 'm4' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="m4-x" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Initial Amount ($):
                </label>
                <input
                  id="m4-x"
                  type="number"
                  value={m4X}
                  onChange={(e) => setM4X(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm tabular-nums"
                  placeholder="e.g. 120"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Operation:
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setM4Op('subtract')}
                    className={`flex-1 py-2.5 text-xs font-medium rounded-xl border transition-colors ${
                      m4Op === 'subtract'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Subtract (Discount)
                  </button>
                  <button
                    onClick={() => setM4Op('add')}
                    className={`flex-1 py-2.5 text-xs font-medium rounded-xl border transition-colors ${
                      m4Op === 'add'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Add (Tax / Tip)
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="m4-p" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Percentage (%):
                </label>
                <input
                  id="m4-p"
                  type="number"
                  value={m4P}
                  onChange={(e) => setM4P(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm tabular-nums"
                  placeholder="e.g. 20"
                />
              </div>
            </div>

            {res4 && (
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-indigo-700 font-semibold uppercase tracking-wider block mb-1">
                    Final Net Total:
                  </span>
                  <div className="text-3xl font-extrabold text-slate-900 tabular-nums font-mono">
                    {res4.total}
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    {m4Op === 'subtract' ? 'Discount Amount' : 'Tax / Tip Amount'}: {res4.delta} · {res4.formula}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyResult(res4.total)}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Total</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
