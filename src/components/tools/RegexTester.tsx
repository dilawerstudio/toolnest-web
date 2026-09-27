import React, { useState, useMemo } from 'react';
import { Copy, Trash2, Check, Sparkles, AlertTriangle, CheckCircle2, Code2, HelpCircle } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface RegexTesterProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

interface MatchDetail {
  index: number;
  text: string;
  length: number;
  groups: string[];
}

const PRESET_PATTERNS = [
  { name: 'Email Address', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'gi', sample: 'Contact support@example.com or sales.team@domain.co.uk today!' },
  { name: 'URL / Link', pattern: 'https?:\\/\\/[^\\s/$.?#].[^\\s]*', flags: 'gi', sample: 'Visit https://toolnest.dev or check out http://example.org/docs?id=42.' },
  { name: 'Hex Color', pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b', flags: 'gi', sample: 'Brand colors are #4f46e5 (indigo), #fff (white), and #10b981 (emerald).' },
  { name: 'IPv4 Address', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: 'g', sample: 'Server IPs: 192.168.1.1, 10.0.0.1, and public gateway 172.217.16.206.' },
  { name: 'Dates (YYYY-MM-DD)', pattern: '\\b(\\d{4})-(\\d{2})-(\\d{2})\\b', flags: 'g', sample: 'Key dates: 2026-09-27 launch, 2026-10-15 review, 2027-01-01 milestone.' },
];

export const RegexTester: React.FC<RegexTesterProps> = ({ tool, onToast }) => {
  const [pattern, setPattern] = useState<string>('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState<{ g: boolean; i: boolean; m: boolean; s: boolean; u: boolean }>({
    g: true,
    i: true,
    m: false,
    s: false,
    u: false,
  });
  const [testText, setTestText] = useState<string>(
    'Hello! You can reach our engineering team at dev@toolnest.example.com or hello@example.org for inquiries.'
  );
  const [copied, setCopied] = useState<boolean>(false);

  const flagString = useMemo(() => {
    return Object.entries(flags)
      .filter(([_, enabled]) => enabled)
      .map(([f]) => f)
      .join('');
  }, [flags]);

  // Compile regex safely
  const { regex, error, matches } = useMemo(() => {
    if (!pattern) {
      return { regex: null, error: null, matches: [] };
    }

    try {
      const reg = new RegExp(pattern, flagString);
      const foundMatches: MatchDetail[] = [];

      if (flags.g) {
        let match: RegExpExecArray | null;
        let lastIdx = -1;
        // Safety guard against infinite loops on zero-width patterns
        let loopCount = 0;
        const maxLoops = 2000;

        while ((match = reg.exec(testText)) !== null) {
          loopCount++;
          if (loopCount > maxLoops) break;

          foundMatches.push({
            index: match.index,
            text: match[0],
            length: match[0].length,
            groups: match.slice(1),
          });

          if (match.index === reg.lastIndex) {
            reg.lastIndex++;
          }
          if (reg.lastIndex <= lastIdx) break;
          lastIdx = reg.lastIndex;
        }
      } else {
        const match = reg.exec(testText);
        if (match) {
          foundMatches.push({
            index: match.index,
            text: match[0],
            length: match[0].length,
            groups: match.slice(1),
          });
        }
      }

      return { regex: reg, error: null, matches: foundMatches };
    } catch (err: any) {
      return { regex: null, error: err.message || 'Invalid regular expression', matches: [] };
    }
  }, [pattern, flagString, testText, flags.g]);

  const toggleFlag = (flagKey: 'g' | 'i' | 'm' | 's' | 'u') => {
    setFlags((prev) => ({ ...prev, [flagKey]: !prev[flagKey] }));
  };

  const handleCopyPattern = () => {
    const fullRegex = `/${pattern}/${flagString}`;
    navigator.clipboard.writeText(fullRegex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onToast('Copied regex to clipboard');
  };

  const handleLoadPreset = (preset: typeof PRESET_PATTERNS[0]) => {
    setPattern(preset.pattern);
    setTestText(preset.sample);
    setFlags({
      g: preset.flags.includes('g'),
      i: preset.flags.includes('i'),
      m: preset.flags.includes('m'),
      s: preset.flags.includes('s'),
      u: preset.flags.includes('u'),
    });
    onToast(`Loaded ${preset.name} preset`);
  };

  const handleClear = () => {
    setPattern('');
    setTestText('');
    onToast('Cleared tester');
  };

  // Safe Highlight Renderer without executing HTML
  const highlightedElements = useMemo(() => {
    if (!testText) return null;
    if (matches.length === 0 || !pattern) {
      return <span>{testText}</span>;
    }

    const elements: React.ReactNode[] = [];
    let currentPos = 0;

    matches.forEach((m, idx) => {
      // Text before match
      if (m.index > currentPos) {
        elements.push(<span key={`text-${idx}`}>{testText.slice(currentPos, m.index)}</span>);
      }
      // Matched segment
      elements.push(
        <mark
          key={`match-${idx}`}
          className="bg-indigo-100 text-indigo-900 border-b-2 border-indigo-500 rounded px-0.5 font-bold"
          title={`Match #${idx + 1} at position ${m.index}`}
        >
          {m.text}
        </mark>
      );
      currentPos = m.index + m.length;
    });

    if (currentPos < testText.length) {
      elements.push(<span key="text-end">{testText.slice(currentPos)}</span>);
    }

    return elements;
  }, [testText, matches, pattern]);

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Top Presets Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 font-semibold shrink-0">Presets:</span>
            {PRESET_PATTERNS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handleLoadPreset(p)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors shrink-0"
              >
                {p.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPattern}
              disabled={!pattern}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-indigo-400 rounded-lg transition-colors disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Regex'}</span>
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

        {/* Pattern & Flags Input */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <label htmlFor="regex-pattern-input">Regular Expression Pattern:</label>
            {error ? (
              <span className="text-rose-600 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Invalid Syntax</span>
              </span>
            ) : pattern ? (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Valid Pattern ({matches.length} {matches.length === 1 ? 'match' : 'matches'})</span>
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <span className="text-slate-400 font-mono text-base font-bold select-none">/</span>
            <input
              id="regex-pattern-input"
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g. [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
              className="w-full py-1.5 font-mono text-xs sm:text-sm text-slate-900 bg-transparent outline-none"
            />
            <span className="text-slate-400 font-mono text-base font-bold select-none">/</span>
            <span className="text-indigo-600 font-mono text-xs font-bold shrink-0">{flagString || '-'}</span>
          </div>

          {/* Flag Toggle Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-500 font-medium mr-1">Flags:</span>
            {[
              { key: 'g' as const, label: 'Global (g)', desc: 'Find all matches' },
              { key: 'i' as const, label: 'Case Insensitive (i)', desc: 'Ignore uppercase/lowercase' },
              { key: 'm' as const, label: 'Multiline (m)', desc: '^ and $ match line starts/ends' },
              { key: 's' as const, label: 'Dot All (s)', desc: '. matches newlines' },
              { key: 'u' as const, label: 'Unicode (u)', desc: 'Full unicode support' },
            ].map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => toggleFlag(f.key)}
                className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-all ${
                  flags[f.key]
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                title={f.desc}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Error Message banner */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="font-mono">{error}</span>
            </div>
          )}
        </div>

        {/* Test String Input & Highlight Output */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Test String Input */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <label htmlFor="regex-test-text">Test Text:</label>
              <span className="text-slate-400 font-mono text-[11px]">{testText.length} characters</span>
            </div>
            <textarea
              id="regex-test-text"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Paste or type test strings here..."
              rows={9}
              className="w-full p-4 font-mono text-xs sm:text-sm text-slate-900 bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 resize-y leading-relaxed"
            />
          </div>

          {/* Live Highlighted Preview */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="text-indigo-700">Match Preview:</span>
              <span className="text-indigo-600 font-mono text-[11px] font-bold">
                {matches.length} {matches.length === 1 ? 'Match' : 'Matches'}
              </span>
            </div>
            <div className="w-full p-4 font-mono text-xs sm:text-sm text-slate-800 bg-white rounded-xl border border-slate-200 min-h-[200px] max-h-[280px] overflow-y-auto whitespace-pre-wrap break-words leading-relaxed select-text">
              {highlightedElements || <span className="text-slate-400 italic">No text to evaluate...</span>}
            </div>
          </div>
        </div>

        {/* Detailed Match Table / Capture Groups */}
        {matches.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-700">
              Match Breakdown ({matches.length} items found):
            </div>
            <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700 divide-y divide-slate-200">
                <thead className="bg-slate-50 font-bold text-slate-800 sticky top-0">
                  <tr>
                    <th className="px-3.5 py-2.5">#</th>
                    <th className="px-3.5 py-2.5">Matched Text</th>
                    <th className="px-3.5 py-2.5">Position</th>
                    <th className="px-3.5 py-2.5">Capture Groups</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white font-mono">
                  {matches.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="px-3.5 py-2 text-slate-400">{idx + 1}</td>
                      <td className="px-3.5 py-2 text-indigo-700 font-bold break-all">{m.text}</td>
                      <td className="px-3.5 py-2 text-slate-500">index {m.index} ({m.length} chars)</td>
                      <td className="px-3.5 py-2 text-slate-600">
                        {m.groups.length > 0 ? (
                          m.groups.map((g, gi) => (
                            <span key={gi} className="inline-block bg-slate-100 px-1.5 py-0.5 rounded text-[11px] mr-1 mb-0.5">
                              ${gi + 1}: "{g}"
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-[11px]">None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
