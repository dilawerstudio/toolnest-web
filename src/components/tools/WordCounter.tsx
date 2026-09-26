import React, { useState, useMemo } from 'react';
import { Copy, Trash2, FileText, Download, Check } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface WordCounterProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

const SAMPLE_TEXT = `The rapid pace of technological innovation is reshaping how we work, communicate, and create. In an increasingly interconnected world, lightweight utility tools allow professionals and students to streamline everyday tasks without sacrificing digital privacy.

By keeping data execution strictly in the local web browser, individuals maintain complete custody of their sensitive thoughts, draft essays, and code snippets. Fast, free, and accessible computing for everyone is not just a luxury—it is an essential standard for the modern open web.`;

export const WordCounter: React.FC<WordCounterProps> = ({ tool, onToast }) => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  // Compute live statistics
  const stats = useMemo(() => {
    const raw = text.trim();
    if (!raw) {
      return {
        words: 0,
        charsWithSpaces: 0,
        charsNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        lines: 0,
        readingTimeMinutes: 0,
        speakingTimeMinutes: 0,
        avgWordLength: 0,
        keywords: [] as { word: string; count: number; percentage: number }[],
      };
    }

    const wordsArray = raw.split(/\s+/).filter(Boolean);
    const words = wordsArray.length;
    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s+/g, '').length;

    // Sentences (split by ., !, ?)
    const sentences = raw.split(/[.!?]+/).filter((s) => s.trim().length > 0).length || (words > 0 ? 1 : 0);

    // Paragraphs (split by double newlines or non-empty lines)
    const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0).length || (words > 0 ? 1 : 0);
    const lines = text.split('\n').length;

    // Reading & Speaking times
    const readingTimeMinutes = Math.ceil(words / 225);
    const speakingTimeMinutes = Math.ceil(words / 130);

    // Average word length
    const totalWordChars = wordsArray.reduce((acc, w) => acc + w.length, 0);
    const avgWordLength = words > 0 ? Number((totalWordChars / words).toFixed(1)) : 0;

    // Keyword density (stop words filtered)
    const stopWords = new Set([
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he',
      'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
      'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about',
      'who', 'get', 'which', 'go', 'me', 'is', 'are', 'was', 'were', 'has', 'had', 'been'
    ]);

    const freqMap: Record<string, number> = {};
    wordsArray.forEach((w) => {
      const cleaned = w.toLowerCase().replace(/[^a-z0-9]/gi, '');
      if (cleaned.length > 2 && !stopWords.has(cleaned)) {
        freqMap[cleaned] = (freqMap[cleaned] || 0) + 1;
      }
    });

    const keywords = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({
        word,
        count,
        percentage: Number(((count / words) * 100).toFixed(1)),
      }));

    return {
      words,
      charsWithSpaces,
      charsNoSpaces,
      sentences,
      paragraphs,
      lines,
      readingTimeMinutes,
      speakingTimeMinutes,
      avgWordLength,
      keywords,
    };
  }, [text]);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    onToast('Text copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText('');
    onToast('Editor cleared');
  };

  const handleLoadSample = () => {
    setText(SAMPLE_TEXT);
    onToast('Sample text loaded');
  };

  const handleDownload = () => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `toolnest-text-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onToast('Document downloaded');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadSample}
              className="text-xs font-medium text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Load Sample Text
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

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={!text}
              className="flex items-center gap-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={!text}
              className="flex items-center gap-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm disabled:opacity-40 disabled:pointer-events-none"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .txt</span>
            </button>
          </div>
        </div>

        {/* Text Input Area */}
        <div className="relative">
          <label htmlFor="word-counter-textarea" className="sr-only">
            Text to analyze
          </label>
          <textarea
            id="word-counter-textarea"
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to count words, characters, and reading statistics..."
            className="w-full p-4 text-sm sm:text-base text-slate-900 bg-slate-50/50 rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-400 font-sans resize-y"
          />
        </div>

        {/* Primary Metric Tiles (Tabular Numerals) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs text-slate-500 block mb-1">Total Words</span>
            <span className="text-2xl sm:text-3xl font-bold text-indigo-600 tabular-nums font-mono">
              {stats.words.toLocaleString()}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs text-slate-500 block mb-1">Characters</span>
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums font-mono">
              {stats.charsWithSpaces.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5 tabular-nums">
              ({stats.charsNoSpaces} no spaces)
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs text-slate-500 block mb-1">Sentences</span>
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums font-mono">
              {stats.sentences.toLocaleString()}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs text-slate-500 block mb-1">Paragraphs</span>
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums font-mono">
              {stats.paragraphs.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Secondary Metrics & Time Estimates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600">Reading Time</span>
            <span className="font-semibold text-slate-900 tabular-nums font-mono">
              ~{stats.readingTimeMinutes} min{stats.readingTimeMinutes === 1 ? '' : 's'}
            </span>
          </div>
          <div className="p-3.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600">Speaking Time</span>
            <span className="font-semibold text-slate-900 tabular-nums font-mono">
              ~{stats.speakingTimeMinutes} min{stats.speakingTimeMinutes === 1 ? '' : 's'}
            </span>
          </div>
          <div className="p-3.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600">Avg Word Length</span>
            <span className="font-semibold text-slate-900 tabular-nums font-mono">
              {stats.avgWordLength} chars
            </span>
          </div>
        </div>

        {/* Keyword Density Table */}
        {stats.keywords.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Top Recurring Keywords (Excluding Common Stopwords)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {stats.keywords.map((kw, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                  <div className="font-medium text-slate-800 truncate mb-1">"{kw.word}"</div>
                  <div className="flex items-center justify-between text-slate-500 tabular-nums font-mono text-[11px]">
                    <span>{kw.count}x</span>
                    <span>{kw.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
