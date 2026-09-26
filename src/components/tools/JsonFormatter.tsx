import React, { useState } from 'react';
import { Copy, Trash2, Check, Download, AlertTriangle, CheckCircle2, FileText, Minimize2, Maximize2 } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface JsonFormatterProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

const SAMPLE_JSON = `{
  "projectName": "ToolNest",
  "version": "2.0.0",
  "isFree": true,
  "privacyFirst": true,
  "architecture": {
    "engine": "Client-Side V8",
    "storage": "Local In-Memory",
    "cloudRetention": null
  },
  "supportedCategories": [
    "Text Tools",
    "Calculators",
    "Developer Utilities",
    "QR & Barcodes"
  ],
  "stats": {
    "activeUsers": 1250,
    "rating": 4.95
  }
}`;

export const JsonFormatter: React.FC<JsonFormatterProps> = ({ tool, onToast }) => {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [indentSize, setIndentSize] = useState<'2' | '4' | 'tab'>('2');
  const [errorInfo, setErrorInfo] = useState<{ message: string; line?: number; column?: number } | null>(null);
  const [validSuccess, setValidSuccess] = useState(true);
  const [copiedType, setCopiedType] = useState<'formatted' | 'minified' | null>(null);

  const getIndent = () => {
    if (indentSize === 'tab') return '\t';
    return Number(indentSize);
  };

  const handleFormat = () => {
    if (!input.trim()) {
      setErrorInfo(null);
      setValidSuccess(false);
      onToast('Please enter JSON text to format');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, getIndent());
      setInput(formatted);
      setErrorInfo(null);
      setValidSuccess(true);
      onToast('JSON formatted successfully!');
    } catch (err: any) {
      setValidSuccess(false);
      parseJsonError(err.message, input);
      onToast('Invalid JSON syntax');
    }
  };

  const handleMinify = () => {
    if (!input.trim()) {
      setErrorInfo(null);
      setValidSuccess(false);
      onToast('Please enter JSON text to minify');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setInput(minified);
      setErrorInfo(null);
      setValidSuccess(true);
      onToast('JSON minified!');
    } catch (err: any) {
      setValidSuccess(false);
      parseJsonError(err.message, input);
      onToast('Invalid JSON syntax');
    }
  };

  const handleValidate = () => {
    if (!input.trim()) {
      setErrorInfo({ message: 'Input is empty. Please enter JSON.' });
      setValidSuccess(false);
      return;
    }
    try {
      JSON.parse(input);
      setErrorInfo(null);
      setValidSuccess(true);
      onToast('Valid JSON!');
    } catch (err: any) {
      setValidSuccess(false);
      parseJsonError(err.message, input);
    }
  };

  const parseJsonError = (msg: string, text: string) => {
    // Attempt extracting line/column from message like "at position 45" or "line 3 column 5"
    let line: number | undefined;
    let column: number | undefined;

    const posMatch = msg.match(/position (\d+)/i);
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const lines = text.slice(0, pos).split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    } else {
      const lineColMatch = msg.match(/line (\d+) column (\d+)/i);
      if (lineColMatch) {
        line = parseInt(lineColMatch[1], 10);
        column = parseInt(lineColMatch[2], 10);
      }
    }

    setErrorInfo({ message: msg, line, column });
  };

  const handleCopy = (type: 'formatted' | 'minified') => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const output = type === 'minified' ? JSON.stringify(parsed) : JSON.stringify(parsed, null, getIndent());
      navigator.clipboard.writeText(output);
      setCopiedType(type);
      onToast(type === 'minified' ? 'Minified JSON copied!' : 'Formatted JSON copied!');
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      // If invalid JSON, copy raw text
      navigator.clipboard.writeText(input);
      setCopiedType(type);
      onToast('Copied raw text to clipboard!');
      setTimeout(() => setCopiedType(null), 2000);
    }
  };

  const handleDownload = () => {
    if (!input.trim()) return;
    const blob = new Blob([input], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onToast('JSON file downloaded!');
  };

  const handleClear = () => {
    setInput('');
    setErrorInfo(null);
    setValidSuccess(false);
    onToast('Editor cleared');
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_JSON);
    setErrorInfo(null);
    setValidSuccess(true);
    onToast('Sample JSON loaded');
  };

  const lineCount = input ? input.split('\n').length : 0;
  const charCount = input.length;

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleFormat}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Format / Prettify</span>
            </button>
            <button
              onClick={handleMinify}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Minify</span>
            </button>
            <button
              onClick={handleValidate}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Validate Only</span>
            </button>

            {/* Indentation Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-2">
              <span className="hidden sm:inline">Indent:</span>
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(e.target.value as any)}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs outline-none"
              >
                <option value="2">2 Spaces</option>
                <option value="4">4 Spaces</option>
                <option value="tab">Tabs</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadSample}
              className="text-xs font-medium text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Load Sample
            </button>
            <button
              onClick={handleClear}
              disabled={!input}
              className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-rose-600 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 transition-colors disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Validation / Error Banner */}
        {errorInfo && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">JSON Syntax Error:</strong>
              <p className="font-mono text-rose-900 break-all">{errorInfo.message}</p>
              {errorInfo.line !== undefined && (
                <span className="text-[11px] text-rose-700 font-semibold block mt-1">
                  Near Line {errorInfo.line}, Column {errorInfo.column}
                </span>
              )}
            </div>
          </div>
        )}

        {validSuccess && !errorInfo && input.trim() && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">Valid JSON structure</span>
            </div>
            <span className="text-[11px] text-emerald-700 tabular-nums font-mono">
              {lineCount} lines · {charCount.toLocaleString()} chars
            </span>
          </div>
        )}

        {/* Large JSON Editor */}
        <div className="relative">
          <label htmlFor="json-editor-input" className="sr-only">
            JSON code editor
          </label>
          <textarea
            id="json-editor-input"
            rows={14}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (errorInfo) setErrorInfo(null);
              if (validSuccess) setValidSuccess(false);
            }}
            placeholder="Paste raw or unformatted JSON here..."
            className="w-full p-4 font-mono text-xs sm:text-sm text-slate-900 bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 resize-y leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Bottom Actions & Stats Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-500 flex items-center gap-3">
            <span className="tabular-nums font-mono">{lineCount} lines</span>
            <span>·</span>
            <span className="tabular-nums font-mono">{charCount.toLocaleString()} characters</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleCopy('formatted')}
              disabled={!input.trim()}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40"
            >
              {copiedType === 'formatted' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Formatted</span>
            </button>
            <button
              onClick={() => handleCopy('minified')}
              disabled={!input.trim()}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40"
            >
              {copiedType === 'minified' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Minified</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={!input.trim()}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors disabled:opacity-40"
              title="Download as .json file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
