import React, { useState, useMemo } from 'react';
import { Copy, Trash2, Check, ArrowRightLeft, FileText, Plus, Minus, Equal, ArrowUpDown } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface TextDiffProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

type DiffLineType = 'added' | 'removed' | 'unchanged';

interface DiffLine {
  type: DiffLineType;
  text: string;
  lineNumA?: number;
  lineNumB?: number;
}

const SAMPLE_A = `ToolNest Platform
Version 1.0.0
Fast, clean, and reliable browser utilities.

Included features:
- Word and Character Counter
- Case and Text Formatter
- Password Generator
- JSON Formatter
- Image and PDF Tools

100% private in-browser computation.
Thank you for using ToolNest!`;

const SAMPLE_B = `ToolNest Platform
Version 2.0.0
Fast, modern, and reliable browser utilities.

Included features:
- Word and Character Counter
- Case and Text Formatter
- QR Code and Barcode Generator
- JSON Formatter & Diff
- Image and PDF Tools
- Developer Utilities

100% private in-browser computation.
Free forever without tracking.
Thank you for using ToolNest!`;

// Efficient Longest Common Subsequence (LCS) Diff Algorithm for lines
function computeLineDiff(linesA: string[], linesB: string[]): DiffLine[] {
  const n = linesA.length;
  const m = linesB.length;

  // Matrix for LCS table
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (linesA[i] === linesB[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  // Backtrack to build diff
  const result: DiffLine[] = [];
  let i = n;
  let j = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      result.unshift({
        type: 'unchanged',
        text: linesA[i - 1],
        lineNumA: i,
        lineNumB: j,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({
        type: 'added',
        text: linesB[j - 1],
        lineNumB: j,
      });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      result.unshift({
        type: 'removed',
        text: linesA[i - 1],
        lineNumA: i,
      });
      i--;
    }
  }

  return result;
}

export const TextDiff: React.FC<TextDiffProps> = ({ tool, onToast }) => {
  const [textA, setTextA] = useState<string>(SAMPLE_A);
  const [textB, setTextB] = useState<string>(SAMPLE_B);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Compute diff
  const diffLines = useMemo(() => {
    let linesA = textA.split(/\r\n|\r|\n/);
    let linesB = textB.split(/\r\n|\r|\n/);

    if (ignoreWhitespace) {
      linesA = linesA.map((l) => l.trim());
      linesB = linesB.map((l) => l.trim());
    }

    return computeLineDiff(linesA, linesB);
  }, [textA, textB, ignoreWhitespace]);

  // Statistics
  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    let unchanged = 0;

    for (const line of diffLines) {
      if (line.type === 'added') added++;
      else if (line.type === 'removed') removed++;
      else if (line.type === 'unchanged') unchanged++;
    }

    return { added, removed, unchanged, totalChanges: added + removed };
  }, [diffLines]);

  const handleSwap = () => {
    const temp = textA;
    setTextA(textB);
    setTextB(temp);
    onToast('Swapped Text A and Text B');
  };

  const handleCopyUnifiedDiff = () => {
    if (diffLines.length === 0) return;
    const diffText = diffLines.map((l) => {
      const prefix = l.type === 'added' ? '+' : l.type === 'removed' ? '-' : ' ';
      return `${prefix} ${l.text}`;
    }).join('\n');

    navigator.clipboard.writeText(diffText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onToast('Copied unified diff to clipboard');
  };

  const handleClear = () => {
    setTextA('');
    setTextB('');
    onToast('Cleared both inputs');
  };

  const handleLoadSample = () => {
    setTextA(SAMPLE_A);
    setTextB(SAMPLE_B);
    onToast('Loaded sample text comparison');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-slate-700">Line-by-Line Text Comparison</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSwap}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Swap</span>
            </button>
            <button
              onClick={handleLoadSample}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Sample
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

        {/* Input Editors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <label htmlFor="text-diff-a">Original Text (A):</label>
              <span className="text-slate-400 font-mono text-[11px]">
                {textA.split(/\r\n|\r|\n/).length} lines · {textA.length} chars
              </span>
            </div>
            <textarea
              id="text-diff-a"
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              placeholder="Paste original baseline text here..."
              rows={10}
              className="w-full p-4 font-mono text-xs sm:text-sm text-slate-900 bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 resize-y leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <label htmlFor="text-diff-b">Modified Text (B):</label>
              <span className="text-slate-400 font-mono text-[11px]">
                {textB.split(/\r\n|\r|\n/).length} lines · {textB.length} chars
              </span>
            </div>
            <textarea
              id="text-diff-b"
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
              placeholder="Paste updated text here..."
              rows={10}
              className="w-full p-4 font-mono text-xs sm:text-sm text-slate-900 bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 resize-y leading-relaxed"
            />
          </div>
        </div>

        {/* Diff Metrics & Settings */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-800">Difference Report:</span>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold font-mono">
              +{stats.added} Added
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold font-mono">
              -{stats.removed} Removed
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-700 font-mono">
              {stats.unchanged} Unchanged
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={ignoreWhitespace}
                onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <span>Ignore line whitespace</span>
            </label>

            <button
              onClick={handleCopyUnifiedDiff}
              disabled={diffLines.length === 0}
              className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 hover:text-indigo-600 rounded-lg text-xs font-semibold shadow-2xs transition-colors disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Unified Diff'}</span>
            </button>
          </div>
        </div>

        {/* Unified Line Diff View */}
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
          <div className="px-4 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Visual Unified Diff Output:</span>
            <span className="text-[11px] text-slate-500 font-normal">
              {stats.totalChanges === 0 ? '✓ Texts are identical' : `${stats.totalChanges} line differences`}
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto font-mono text-xs divide-y divide-slate-100 select-text">
            {diffLines.length > 0 ? (
              diffLines.map((line, idx) => (
                <div
                  key={idx}
                  className={`flex items-start px-3 py-1.5 transition-colors ${
                    line.type === 'added'
                      ? 'bg-emerald-50 text-emerald-950 hover:bg-emerald-100/70'
                      : line.type === 'removed'
                      ? 'bg-rose-50 text-rose-950 hover:bg-rose-100/70'
                      : 'bg-white text-slate-700 hover:bg-slate-50/70'
                  }`}
                >
                  {/* Line Number columns */}
                  <span className="w-8 shrink-0 text-right pr-2 text-[10px] text-slate-400 select-none">
                    {line.lineNumA || ''}
                  </span>
                  <span className="w-8 shrink-0 text-right pr-2 text-[10px] text-slate-400 select-none">
                    {line.lineNumB || ''}
                  </span>
                  {/* Type Marker */}
                  <span
                    className={`w-5 shrink-0 font-bold select-none text-center ${
                      line.type === 'added'
                        ? 'text-emerald-700'
                        : line.type === 'removed'
                        ? 'text-rose-700'
                        : 'text-slate-300'
                    }`}
                  >
                    {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                  </span>
                  {/* Line Content */}
                  <span className="break-all whitespace-pre-wrap flex-1">{line.text || ' '}</span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 italic">
                Enter text above to preview line differences...
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
