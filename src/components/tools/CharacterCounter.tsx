import React, { useState, useMemo } from 'react';
import { Copy, Trash2, Check, AlertTriangle } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface CharacterCounterProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

const SAMPLE_TWEET = `Excited to announce ToolNest! A modern suite of free, client-side web utilities for writers, students, and developers. Built with 100% in-browser processing so your data never touches a remote server. Give it a try!`;

export const CharacterCounter: React.FC<CharacterCounterProps> = ({ tool, onToast }) => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const totalChars = text.length;
    const letters = (text.match(/[\p{L}]/gu) || []).length;
    const digits = (text.match(/[0-9]/g) || []).length;
    const whitespaces = (text.match(/\s/g) || []).length;
    const punctuation = (text.match(/[\p{P}\p{S}]/gu) || []).length;
    const lines = text ? text.split('\n').length : 0;

    // UTF-8 Byte calculation
    const encoder = new TextEncoder();
    const byteSize = encoder.encode(text).length;

    return {
      totalChars,
      letters,
      digits,
      whitespaces,
      punctuation,
      lines,
      byteSize,
    };
  }, [text]);

  const limits = [
    { name: 'Twitter / X Post', max: 280, count: stats.totalChars },
    { name: 'SMS (Single GSM Segment)', max: 160, count: stats.totalChars },
    { name: 'Google SEO Title Tag', max: 60, count: stats.totalChars },
    { name: 'Google Meta Description', max: 160, count: stats.totalChars },
    { name: 'Instagram Caption', max: 2200, count: stats.totalChars },
    { name: 'LinkedIn Status', max: 3000, count: stats.totalChars },
  ];

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    onToast('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText('');
    onToast('Text cleared');
  };

  const handleLoadSample = () => {
    setText(SAMPLE_TWEET);
    onToast('Sample message loaded');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadSample}
              className="text-xs font-medium text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Load Sample Post
            </button>
            <button
              onClick={handleClear}
              disabled={!text}
              className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-rose-600 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            disabled={!text}
            className="flex items-center gap-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
        </div>

        {/* Input */}
        <div>
          <label htmlFor="char-counter-input" className="sr-only">
            Text to count characters
          </label>
          <textarea
            id="char-counter-input"
            rows={7}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to track character metrics and platform limits..."
            className="w-full p-4 text-sm sm:text-base text-slate-900 bg-slate-50/50 rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-400 font-sans resize-y"
          />
        </div>

        {/* Primary Character Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs text-slate-500 block mb-1">Total Characters</span>
            <span className="text-3xl font-bold text-indigo-600 tabular-nums font-mono">
              {stats.totalChars.toLocaleString()}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs text-slate-500 block mb-1">Letters (A-Z)</span>
            <span className="text-3xl font-bold text-slate-900 tabular-nums font-mono">
              {stats.letters.toLocaleString()}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs text-slate-500 block mb-1">Digits (0-9)</span>
            <span className="text-3xl font-bold text-slate-900 tabular-nums font-mono">
              {stats.digits.toLocaleString()}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs text-slate-500 block mb-1">UTF-8 Byte Size</span>
            <span className="text-3xl font-bold text-slate-900 tabular-nums font-mono">
              {stats.byteSize.toLocaleString()} <span className="text-xs font-normal text-slate-500">bytes</span>
            </span>
          </div>
        </div>

        {/* Detailed Character Breakdown */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600">Whitespaces</span>
            <span className="font-semibold text-slate-900 tabular-nums font-mono">{stats.whitespaces}</span>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600">Punctuation & Symbols</span>
            <span className="font-semibold text-slate-900 tabular-nums font-mono">{stats.punctuation}</span>
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600">Lines</span>
            <span className="font-semibold text-slate-900 tabular-nums font-mono">{stats.lines}</span>
          </div>
        </div>

        {/* Platform Limit Meters */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Social Media & SEO Character Limits
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {limits.map((l) => {
              const remaining = l.max - l.count;
              const percent = Math.min(100, Math.round((l.count / l.max) * 100));
              const isOver = remaining < 0;

              return (
                <div key={l.name} className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-800">{l.name}</span>
                    <div className="flex items-center gap-1.5 tabular-nums font-mono text-[11px]">
                      <span className={isOver ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                        {l.count} / {l.max}
                      </span>
                      {isOver && <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-200 ${
                        isOver
                          ? 'bg-rose-500'
                          : percent > 85
                          ? 'bg-amber-500'
                          : 'bg-indigo-600'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400 flex justify-between">
                    <span>{percent}% used</span>
                    <span className={isOver ? 'text-rose-600 font-semibold' : 'text-slate-500'}>
                      {isOver ? `${Math.abs(remaining)} chars over limit` : `${remaining} chars left`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
