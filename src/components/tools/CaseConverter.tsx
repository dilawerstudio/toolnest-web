import React, { useState } from 'react';
import { Copy, Trash2, Check, RefreshCw } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface CaseConverterProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

const SAMPLE_TEXT = 'convert this simple text to various programming and editorial casing formats';

export const CaseConverter: React.FC<CaseConverterProps> = ({ tool, onToast }) => {
  const [input, setInput] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Conversion functions
  const toWords = (str: string): string[] => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_\-./\\]+/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  };

  const conversions = [
    {
      id: 'upper',
      name: 'UPPERCASE',
      description: 'All letters converted to uppercase',
      value: input.toUpperCase(),
    },
    {
      id: 'lower',
      name: 'lowercase',
      description: 'All letters converted to lowercase',
      value: input.toLowerCase(),
    },
    {
      id: 'title',
      name: 'Title Case',
      description: 'Major words capitalized according to standard styling',
      value: input
        ? input.toLowerCase().replace(/(^|\s)\S/g, (l) => l.toUpperCase())
        : '',
    },
    {
      id: 'sentence',
      name: 'Sentence case',
      description: 'First letter of each sentence capitalized',
      value: input
        ? input
            .toLowerCase()
            .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
        : '',
    },
    {
      id: 'camel',
      name: 'camelCase',
      description: 'First word lowercase, subsequent words capitalized',
      value: toWords(input)
        .map((w, i) =>
          i === 0
            ? w.toLowerCase()
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join(''),
    },
    {
      id: 'pascal',
      name: 'PascalCase',
      description: 'Every word begins with an uppercase letter, no spaces',
      value: toWords(input)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(''),
    },
    {
      id: 'snake',
      name: 'snake_case',
      description: 'Words separated by underscores',
      value: toWords(input)
        .map((w) => w.toLowerCase())
        .join('_'),
    },
    {
      id: 'kebab',
      name: 'kebab-case',
      description: 'Words separated by hyphens (URL slug style)',
      value: toWords(input)
        .map((w) => w.toLowerCase())
        .join('-'),
    },
    {
      id: 'constant',
      name: 'CONSTANT_CASE',
      description: 'Uppercase words joined by underscores',
      value: toWords(input)
        .map((w) => w.toUpperCase())
        .join('_'),
    },
    {
      id: 'alternating',
      name: 'aLtErNaTiNg cAsE',
      description: 'Alternates uppercase and lowercase letters',
      value: input
        .split('')
        .map((char, index) =>
          index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        )
        .join(''),
    },
    {
      id: 'inverse',
      name: 'InVeRsE cAsE',
      description: 'Swaps existing uppercase to lowercase and vice-versa',
      value: input
        .split('')
        .map((char) =>
          char === char.toUpperCase()
            ? char.toLowerCase()
            : char.toUpperCase()
        )
        .join(''),
    },
  ];

  const handleCopy = (key: string, textToCopy: string) => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopiedKey(key);
    onToast(`Copied ${key} to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleClear = () => {
    setInput('');
    onToast('Input cleared');
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_TEXT);
    onToast('Sample text loaded');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadSample}
              className="text-xs font-medium text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Load Sample Text
            </button>
            <button
              onClick={handleClear}
              disabled={!input}
              className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-rose-600 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

          <div className="text-xs text-slate-400">
            <span>{input.length} characters</span>
          </div>
        </div>

        {/* Input Text Box */}
        <div>
          <label htmlFor="case-input-text" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Source Text:
          </label>
          <textarea
            id="case-input-text"
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste your text here to convert across multiple formats..."
            className="w-full p-3.5 text-sm sm:text-base text-slate-900 bg-slate-50/50 rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-400 font-sans resize-y"
          />
        </div>

        {/* Conversion Cards Grid */}
        <div className="pt-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Converted Outputs ({conversions.length} Formats)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {conversions.map((conv) => {
              const hasOutput = Boolean(conv.value);
              const isCopied = copiedKey === conv.id;

              return (
                <div
                  key={conv.id}
                  className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 hover:border-slate-300 transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-800">{conv.name}</span>
                    <button
                      onClick={() => handleCopy(conv.id, conv.value)}
                      disabled={!hasOutput}
                      className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-indigo-600 bg-white hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded transition-colors disabled:opacity-40 disabled:pointer-events-none"
                      title={`Copy ${conv.name}`}
                    >
                      {isCopied ? (
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

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-xs font-mono text-slate-800 break-all select-all min-h-[42px] flex items-center">
                    {hasOutput ? conv.value : <span className="text-slate-400 font-sans italic text-xs">Waiting for text...</span>}
                  </div>

                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {conv.description}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
