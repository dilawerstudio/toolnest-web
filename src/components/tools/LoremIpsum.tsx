import React, { useState, useMemo } from 'react';
import { Copy, Trash2, Check, Download, RefreshCw, AlignLeft, Hash, Sliders } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface LoremIpsumProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'ut',
  'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
  'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat',
  'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim',
  'id', 'est', 'laborum', 'curabitur', 'pretium', 'tincidunt', 'lacus', 'pellentesque', 'habitant', 'morbi',
  'tristique', 'senectus', 'netus', 'fames', 'ac', 'turpis', 'egestas', 'vestibulum', 'tortor', 'quam',
  'feugiat', 'vitae', 'ultricies', 'eget', 'tempor', 'sit', 'amet', 'ante', 'donec', 'eu', 'libero',
  'sit', 'amet', 'quam', 'egestas', 'semper', 'aenean', 'ultricies', 'mi', 'vitae', 'est', 'mauris'
];

function generateSentence(startWithClassic: boolean, isFirstSentence: boolean): string {
  if (startWithClassic && isFirstSentence) {
    return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
  }

  const length = Math.floor(Math.random() * 10) + 8; // 8-17 words
  const words: string[] = [];

  for (let i = 0; i < length; i++) {
    const randomWord = LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
    words.push(randomWord);
  }

  // Capitalize first letter
  const sentence = words.join(' ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
}

function generateParagraph(sentenceCount: number, startWithClassic: boolean, isFirstPara: boolean): string {
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence(startWithClassic, isFirstPara && i === 0));
  }
  return sentences.join(' ');
}

export const LoremIpsum: React.FC<LoremIpsumProps> = ({ tool, onToast }) => {
  const [unitType, setUnitType] = useState<'paragraphs' | 'sentences' | 'words' | 'list'>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);
  const [outputFormat, setOutputFormat] = useState<'text' | 'html' | 'markdown'>('text');
  const [seed, setSeed] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  // Generate output
  const generatedText = useMemo(() => {
    // seed triggers re-computation
    void seed;

    if (count <= 0) return '';

    if (unitType === 'words') {
      const words: string[] = [];
      if (startWithLorem && count >= 5) {
        words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
      }
      while (words.length < count) {
        words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
      }
      const raw = words.slice(0, count).join(' ');
      if (outputFormat === 'html') return `<p>${raw}</p>`;
      return raw;
    }

    if (unitType === 'sentences') {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence(startWithLorem, i === 0));
      }

      if (outputFormat === 'html') {
        return sentences.map((s) => `<p>${s}</p>`).join('\n');
      }
      if (outputFormat === 'markdown') {
        return sentences.join('\n\n');
      }
      return sentences.join(' ');
    }

    if (unitType === 'list') {
      const items: string[] = [];
      for (let i = 0; i < count; i++) {
        items.push(generateSentence(false, false).replace(/\.$/, ''));
      }

      if (outputFormat === 'html') {
        return `<ul>\n${items.map((it) => `  <li>${it}</li>`).join('\n')}\n</ul>`;
      }
      if (outputFormat === 'markdown') {
        return items.map((it) => `- ${it}`).join('\n');
      }
      return items.map((it, idx) => `${idx + 1}. ${it}`).join('\n');
    }

    // Paragraphs
    const paras: string[] = [];
    for (let i = 0; i < count; i++) {
      const numSentences = Math.floor(Math.random() * 3) + 4; // 4-6 sentences
      paras.push(generateParagraph(numSentences, startWithLorem, i === 0));
    }

    if (outputFormat === 'html') {
      return paras.map((p) => `<p>${p}</p>`).join('\n\n');
    }
    if (outputFormat === 'markdown') {
      return paras.join('\n\n');
    }
    return paras.join('\n\n');
  }, [unitType, count, startWithLorem, outputFormat, seed]);

  // Statistics
  const stats = useMemo(() => {
    if (!generatedText) return { words: 0, chars: 0, paras: 0 };
    const words = generatedText.trim().split(/\s+/).filter(Boolean).length;
    const chars = generatedText.length;
    const paras = generatedText.split(/\n\s*\n/).filter(Boolean).length;
    return { words, chars, paras };
  }, [generatedText]);

  const handleCopy = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onToast('Copied Lorem Ipsum text');
  };

  const handleRegenerate = () => {
    setSeed((prev) => prev + 1);
    onToast('Regenerated dummy text');
  };

  const handleDownload = () => {
    if (!generatedText) return;
    const isHtml = outputFormat === 'html';
    const blob = new Blob([generatedText], { type: isHtml ? 'text/html' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lorem-ipsum.${isHtml ? 'html' : 'txt'}`;
    link.click();
    URL.revokeObjectURL(url);
    onToast('Downloaded dummy text file');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Controls Configuration Card */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Unit Type Selection */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
              {(['paragraphs', 'sentences', 'words', 'list'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setUnitType(type)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                    unitType === type
                      ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Count Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-700">Quantity:</span>
              <div className="flex items-center gap-1.5">
                {[1, 3, 5, 10, 20].map((num) => (
                  <button
                    key={num}
                    onClick={() => setCount(num)}
                    className={`w-7 h-7 rounded-lg border text-xs font-medium transition-colors ${
                      count === num
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={count}
                  onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                  className="w-14 px-2 py-1 text-center font-mono text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
            {/* Options */}
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={startWithLorem}
                  onChange={(e) => setStartWithLorem(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Start with &quot;Lorem ipsum dolor sit amet...&quot;</span>
              </label>

              <div className="flex items-center gap-1.5 ml-2">
                <span className="text-slate-500">Format:</span>
                {(['text', 'html', 'markdown'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setOutputFormat(fmt)}
                    className={`px-2.5 py-1 rounded-lg border text-xs capitalize transition-colors ${
                      outputFormat === fmt
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Regenerate Action */}
            <button
              onClick={handleRegenerate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Regenerate Text
            </button>
          </div>
        </div>

        {/* Output Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-semibold text-slate-700">Generated Placeholder Text</span>
            <span>
              {stats.words} words · {stats.chars} characters · {stats.paras} {unitType === 'list' ? 'items' : 'paragraphs'}
            </span>
          </div>
          <textarea
            value={generatedText}
            readOnly
            rows={14}
            className="w-full font-mono text-xs p-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 transition-all resize-y shadow-sm leading-relaxed"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <AlignLeft className="w-4 h-4 text-indigo-500" />
            <span>Classic dummy copy designed for UI mockups, typography tests, and layout wireframes.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={!generatedText}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Download className="w-4 h-4 text-slate-500" />
              Download {outputFormat === 'html' ? '.html' : '.txt'}
            </button>
            <button
              onClick={handleCopy}
              disabled={!generatedText}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-sm ${
                copied
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Text' : 'Copy Text'}
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
