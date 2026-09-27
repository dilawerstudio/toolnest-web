import React, { useState } from 'react';
import { Copy, Trash2, Check, Download, RotateCcw, ArrowRight, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface TextCleanerProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

const SAMPLE_TEXT = `   ToolNest    is   a    free   online    tools    suite.   

It   provides    handy   everyday   utilities.


It   provides    handy   everyday   utilities.
   
Fast,    privacy-first,    and   100%   browser-based.
Fast,    privacy-first,    and   100%   browser-based.

All   processing    stays   local   in   your   browser.   
`;

export const TextCleaner: React.FC<TextCleanerProps> = ({ tool, onToast }) => {
  const [input, setInput] = useState<string>(SAMPLE_TEXT);
  const [output, setOutput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [lastAction, setLastAction] = useState<string>('');

  // Helper stats
  const getStats = (text: string) => {
    const chars = text.length;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return { chars, lines, words };
  };

  const inputStats = getStats(input);
  const outputStats = getStats(output || input);

  // Individual Actions
  const handleRemoveExtraSpaces = () => {
    if (!input) return;
    const res = input
      .split(/\r\n|\r|\n/)
      .map((line) => line.replace(/[ \t]+/g, ' '))
      .join('\n');
    setOutput(res);
    setLastAction('Removed extra spaces');
    onToast('Removed extra spaces');
  };

  const handleTrimLines = () => {
    if (!input) return;
    const res = input
      .split(/\r\n|\r|\n/)
      .map((line) => line.trim())
      .join('\n');
    setOutput(res);
    setLastAction('Trimmed line edges');
    onToast('Trimmed leading and trailing spaces');
  };

  const handleRemoveEmptyLines = () => {
    if (!input) return;
    const res = input
      .split(/\r\n|\r|\n/)
      .filter((line) => line.trim().length > 0)
      .join('\n');
    setOutput(res);
    setLastAction('Removed empty lines');
    onToast('Removed empty lines');
  };

  const handleRemoveDuplicateBlankLines = () => {
    if (!input) return;
    const lines = input.split(/\r\n|\r|\n/);
    const resultLines: string[] = [];
    let prevEmpty = false;

    for (const line of lines) {
      const isEmpty = line.trim().length === 0;
      if (isEmpty) {
        if (!prevEmpty) {
          resultLines.push('');
          prevEmpty = true;
        }
      } else {
        resultLines.push(line);
        prevEmpty = false;
      }
    }

    const res = resultLines.join('\n');
    setOutput(res);
    setLastAction('Collapsed duplicate blank lines');
    onToast('Collapsed duplicate blank lines');
  };

  const handleRemoveDuplicateLines = () => {
    if (!input) return;
    const lines = input.split(/\r\n|\r|\n/);
    const seen = new Set<string>();
    const res = lines.filter((line) => {
      const key = line.trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).join('\n');
    setOutput(res);
    setLastAction('Removed duplicate lines');
    onToast('Removed duplicate lines');
  };

  const handleNormalizeLineBreaks = () => {
    if (!input) return;
    const res = input.replace(/\r\n|\r/g, '\n');
    setOutput(res);
    setLastAction('Normalized line breaks to Unix LF');
    onToast('Normalized line breaks');
  };

  const handleSortAZ = () => {
    if (!input) return;
    const lines = input.split(/\r\n|\r|\n/);
    const res = lines.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).join('\n');
    setOutput(res);
    setLastAction('Sorted lines A to Z');
    onToast('Sorted lines A-Z');
  };

  const handleSortZA = () => {
    if (!input) return;
    const lines = input.split(/\r\n|\r|\n/);
    const res = lines.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' })).join('\n');
    setOutput(res);
    setLastAction('Sorted lines Z to A');
    onToast('Sorted lines Z-A');
  };

  const handleCleanAll = () => {
    if (!input) return;
    // Master clean: normalize breaks, trim lines, collapse spaces, remove duplicate lines & empty lines
    const lines = input.replace(/\r\n|\r/g, '\n').split('\n');
    const seen = new Set<string>();
    const cleanedLines: string[] = [];

    for (const rawLine of lines) {
      const collapsed = rawLine.replace(/[ \t]+/g, ' ').trim();
      if (collapsed.length > 0 && !seen.has(collapsed)) {
        seen.add(collapsed);
        cleanedLines.push(collapsed);
      }
    }

    const res = cleanedLines.join('\n');
    setOutput(res);
    setLastAction('Complete Deep Clean applied');
    onToast('Complete clean applied');
  };

  const handleCopy = () => {
    const textToCopy = output || input;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onToast('Result copied to clipboard');
  };

  const handleDownload = () => {
    const textToDownload = output || input;
    if (!textToDownload) return;
    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    onToast('Downloaded cleaned text');
  };

  const handleApplyResultToInput = () => {
    if (!output) return;
    setInput(output);
    setOutput('');
    onToast('Applied cleaned text as new input');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setLastAction('');
    onToast('Cleared text');
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_TEXT);
    setOutput('');
    setLastAction('');
    onToast('Loaded sample text');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Text Cleaner & Formatter</span>
            {lastAction && (
              <span className="text-[11px] px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-medium">
                Last: {lastAction}
              </span>
            )}
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

        {/* Cleaning Action Buttons Grid */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Choose Cleaning Action:</span>
            <button
              onClick={handleCleanAll}
              disabled={!input}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-40"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>One-Click Complete Clean</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={handleRemoveExtraSpaces}
              disabled={!input}
              className="px-3 py-2 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 rounded-xl text-xs font-medium text-slate-700 transition-colors shadow-2xs disabled:opacity-40"
            >
              Remove Extra Spaces
            </button>
            <button
              onClick={handleTrimLines}
              disabled={!input}
              className="px-3 py-2 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 rounded-xl text-xs font-medium text-slate-700 transition-colors shadow-2xs disabled:opacity-40"
            >
              Trim Line Edges
            </button>
            <button
              onClick={handleRemoveEmptyLines}
              disabled={!input}
              className="px-3 py-2 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 rounded-xl text-xs font-medium text-slate-700 transition-colors shadow-2xs disabled:opacity-40"
            >
              Remove Empty Lines
            </button>
            <button
              onClick={handleRemoveDuplicateBlankLines}
              disabled={!input}
              className="px-3 py-2 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 rounded-xl text-xs font-medium text-slate-700 transition-colors shadow-2xs disabled:opacity-40"
            >
              Collapse Blank Lines
            </button>
            <button
              onClick={handleRemoveDuplicateLines}
              disabled={!input}
              className="px-3 py-2 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 rounded-xl text-xs font-medium text-slate-700 transition-colors shadow-2xs disabled:opacity-40"
            >
              Remove Duplicate Lines
            </button>
            <button
              onClick={handleNormalizeLineBreaks}
              disabled={!input}
              className="px-3 py-2 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 rounded-xl text-xs font-medium text-slate-700 transition-colors shadow-2xs disabled:opacity-40"
            >
              Normalize Line Breaks
            </button>
            <button
              onClick={handleSortAZ}
              disabled={!input}
              className="px-3 py-2 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 rounded-xl text-xs font-medium text-slate-700 transition-colors shadow-2xs disabled:opacity-40"
            >
              Sort Lines (A-Z)
            </button>
            <button
              onClick={handleSortZA}
              disabled={!input}
              className="px-3 py-2 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 rounded-xl text-xs font-medium text-slate-700 transition-colors shadow-2xs disabled:opacity-40"
            >
              Sort Lines (Z-A)
            </button>
          </div>
        </div>

        {/* Input & Output Side-by-Side / Stacked */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input Panel */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <label htmlFor="text-cleaner-input">Original Text (Untouched):</label>
              <span className="text-slate-400 font-mono text-[11px]">
                {inputStats.chars} chars · {inputStats.lines} lines · {inputStats.words} words
              </span>
            </div>
            <textarea
              id="text-cleaner-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste or type text to clean..."
              rows={12}
              className="w-full p-4 font-mono text-xs sm:text-sm text-slate-900 bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 resize-y leading-relaxed"
            />
          </div>

          {/* Output Panel */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="text-indigo-700">Cleaned Result:</span>
              <span className="text-indigo-600 font-mono text-[11px]">
                {outputStats.chars} chars · {outputStats.lines} lines · {outputStats.words} words
              </span>
            </div>
            <textarea
              id="text-cleaner-output"
              value={output || input}
              readOnly
              placeholder="Cleaned output will appear here after selecting an action..."
              rows={12}
              className="w-full p-4 font-mono text-xs sm:text-sm text-slate-900 bg-white rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 resize-y leading-relaxed"
            />
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {output && (
              <>
                <button
                  onClick={handleApplyResultToInput}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                >
                  Use Result as Input
                </button>
                <span>·</span>
              </>
            )}
            <span>Processed client-side in browser memory</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={!input}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-medium transition-colors disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download TXT</span>
            </button>
            <button
              onClick={handleCopy}
              disabled={!input}
              className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Cleaned Text'}</span>
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
