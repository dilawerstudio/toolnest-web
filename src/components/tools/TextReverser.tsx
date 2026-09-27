import React, { useState, useMemo } from 'react';
import { Copy, Trash2, Check, Download, RotateCcw, ArrowUpDown, ArrowRightLeft, Sparkles } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface TextReverserProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

type ReversalMode = 
  | 'reverse_all' 
  | 'reverse_each_line' 
  | 'reverse_words' 
  | 'sort_az' 
  | 'sort_za' 
  | 'sort_len_asc' 
  | 'sort_len_desc';

const SAMPLE_TEXT = `Apple
Banana
Cherry
Date
Elderberry
Fig
Grape`;

export const TextReverser: React.FC<TextReverserProps> = ({ tool, onToast }) => {
  const [input, setInput] = useState<string>(SAMPLE_TEXT);
  const [mode, setMode] = useState<ReversalMode>('reverse_all');
  const [removeEmpty, setRemoveEmpty] = useState<boolean>(false);
  const [removeDuplicates, setRemoveDuplicates] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Compute transformed text reactively with useMemo
  const output = useMemo(() => {
    if (!input) return '';

    let lines = input.split(/\r\n|\r|\n/);

    if (removeEmpty) {
      lines = lines.filter((l) => l.trim().length > 0);
    }

    if (removeDuplicates) {
      const seen = new Set<string>();
      lines = lines.filter((l) => {
        if (seen.has(l)) return false;
        seen.add(l);
        return true;
      });
    }

    switch (mode) {
      case 'reverse_all':
        // Reverse all characters in whole text
        return Array.from(lines.join('\n')).reverse().join('');

      case 'reverse_each_line':
        // Reverse characters in each line individually
        return lines.map((line) => Array.from(line).reverse().join('')).join('\n');

      case 'reverse_words':
        // Reverse words in each line
        return lines
          .map((line) => line.split(/\s+/).filter(Boolean).reverse().join(' '))
          .join('\n');

      case 'sort_az':
        return [...lines].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).join('\n');

      case 'sort_za':
        return [...lines].sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' })).join('\n');

      case 'sort_len_asc':
        return [...lines].sort((a, b) => a.length - b.length || a.localeCompare(b)).join('\n');

      case 'sort_len_desc':
        return [...lines].sort((a, b) => b.length - a.length || a.localeCompare(b)).join('\n');

      default:
        return input;
    }
  }, [input, mode, removeEmpty, removeDuplicates]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onToast('Reversed text copied');
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reversed-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    onToast('Downloaded reversed text');
  };

  const handleClear = () => {
    setInput('');
    onToast('Cleared text');
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_TEXT);
    onToast('Loaded sample text');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Top Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Reversal & Sorting Operations</span>
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

        {/* Operation Selector */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select Transformation Mode:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'reverse_all' as ReversalMode, label: 'Reverse Entire Text', desc: 'Flips all characters' },
                { id: 'reverse_each_line' as ReversalMode, label: 'Reverse Each Line', desc: 'Flips each line horizontally' },
                { id: 'reverse_words' as ReversalMode, label: 'Reverse Word Order', desc: 'Reverses word sequence' },
                { id: 'sort_az' as ReversalMode, label: 'Sort Lines (A-Z)', desc: 'Alphabetical order' },
                { id: 'sort_za' as ReversalMode, label: 'Sort Lines (Z-A)', desc: 'Reverse alphabetical' },
                { id: 'sort_len_asc' as ReversalMode, label: 'Sort by Length (Shortest)', desc: 'Shortest lines first' },
                { id: 'sort_len_desc' as ReversalMode, label: 'Sort by Length (Longest)', desc: 'Longest lines first' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    mode === m.id
                      ? 'bg-white border-indigo-600 ring-2 ring-indigo-100 shadow-xs'
                      : 'bg-white/70 border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-800 mb-0.5">{m.label}</div>
                  <div className="text-[10px] text-slate-500">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Filtering Toggles */}
          <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-200/80 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={removeEmpty}
                onChange={(e) => setRemoveEmpty(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <span>Remove empty lines</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={removeDuplicates}
                onChange={(e) => setRemoveDuplicates(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <span>Remove duplicate lines</span>
            </label>
          </div>
        </div>

        {/* Input & Output editors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <label htmlFor="text-reverser-input">Source Text:</label>
              <span className="text-slate-400 font-mono text-[11px]">
                {input.length} chars · {input ? input.split(/\r\n|\r|\n/).length : 0} lines
              </span>
            </div>
            <textarea
              id="text-reverser-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to reverse or sort..."
              rows={12}
              className="w-full p-4 font-mono text-xs sm:text-sm text-slate-900 bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 resize-y leading-relaxed"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="text-indigo-700">Transformed Result:</span>
              <span className="text-indigo-600 font-mono text-[11px]">
                {output.length} chars · {output ? output.split('\n').length : 0} lines
              </span>
            </div>
            <textarea
              id="text-reverser-output"
              value={output}
              readOnly
              placeholder="Transformed output will render here..."
              rows={12}
              className="w-full p-4 font-mono text-xs sm:text-sm text-slate-900 bg-white rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 resize-y leading-relaxed"
            />
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            Real-time client-side text processing
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={!output}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-medium transition-colors disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download TXT</span>
            </button>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Result'}</span>
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
