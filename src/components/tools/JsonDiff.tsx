import React, { useState, useMemo } from 'react';
import { Copy, Trash2, Check, ArrowRightLeft, Sparkles, AlertTriangle, Plus, Minus, RefreshCw, Braces } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface JsonDiffProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

type DiffType = 'added' | 'removed' | 'changed' | 'unchanged';

interface DiffEntry {
  path: string;
  type: DiffType;
  valA?: any;
  valB?: any;
}

const SAMPLE_A = `{
  "id": 101,
  "name": "ToolNest App",
  "version": "1.0.0",
  "active": true,
  "features": ["text-tools", "calculators", "image-tools"],
  "author": {
    "name": "Alex",
    "role": "Lead Engineer"
  },
  "deprecated": false
}`;

const SAMPLE_B = `{
  "id": 101,
  "name": "ToolNest Suite",
  "version": "1.1.0",
  "active": true,
  "features": ["text-tools", "calculators", "image-tools", "pdf-tools"],
  "author": {
    "name": "Alex",
    "role": "Principal Engineer",
    "email": "alex@example.org"
  },
  "tags": ["utility", "privacy"]
}`;

function compareJsonStructures(objA: any, objB: any, path: string = ''): DiffEntry[] {
  const entries: DiffEntry[] = [];

  const isObject = (val: any) => val !== null && typeof val === 'object';
  const isArray = (val: any) => Array.isArray(val);

  // If both are objects/arrays of same type
  if (isArray(objA) && isArray(objB)) {
    const maxLen = Math.max(objA.length, objB.length);
    for (let i = 0; i < maxLen; i++) {
      const curPath = path ? `${path}[${i}]` : `[${i}]`;
      if (i >= objA.length) {
        entries.push({ path: curPath, type: 'added', valB: objB[i] });
      } else if (i >= objB.length) {
        entries.push({ path: curPath, type: 'removed', valA: objA[i] });
      } else if (isObject(objA[i]) && isObject(objB[i])) {
        entries.push(...compareJsonStructures(objA[i], objB[i], curPath));
      } else if (objA[i] !== objB[i]) {
        entries.push({ path: curPath, type: 'changed', valA: objA[i], valB: objB[i] });
      } else {
        entries.push({ path: curPath, type: 'unchanged', valA: objA[i], valB: objB[i] });
      }
    }
    return entries;
  }

  if (isObject(objA) && isObject(objB) && !isArray(objA) && !isArray(objB)) {
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    const allKeys = Array.from(new Set([...keysA, ...keysB])).sort();

    for (const key of allKeys) {
      const curPath = path ? `${path}.${key}` : key;
      const inA = key in objA;
      const inB = key in objB;

      if (!inA && inB) {
        entries.push({ path: curPath, type: 'added', valB: objB[key] });
      } else if (inA && !inB) {
        entries.push({ path: curPath, type: 'removed', valA: objA[key] });
      } else if (isObject(objA[key]) && isObject(objB[key])) {
        entries.push(...compareJsonStructures(objA[key], objB[key], curPath));
      } else if (objA[key] !== objB[key]) {
        entries.push({ path: curPath, type: 'changed', valA: objA[key], valB: objB[key] });
      } else {
        entries.push({ path: curPath, type: 'unchanged', valA: objA[key], valB: objB[key] });
      }
    }
    return entries;
  }

  // Primitive root comparison
  if (objA !== objB) {
    entries.push({ path: path || 'root', type: 'changed', valA: objA, valB: objB });
  } else {
    entries.push({ path: path || 'root', type: 'unchanged', valA: objA, valB: objB });
  }

  return entries;
}

export const JsonDiff: React.FC<JsonDiffProps> = ({ tool, onToast }) => {
  const [jsonA, setJsonA] = useState<string>(SAMPLE_A);
  const [jsonB, setJsonB] = useState<string>(SAMPLE_B);
  const [filterType, setFilterType] = useState<'all' | 'differences'>('differences');
  const [copied, setCopied] = useState<boolean>(false);

  // Parsing & validation
  const { parsedA, errorA } = useMemo(() => {
    if (!jsonA.trim()) return { parsedA: undefined, errorA: null };
    try {
      return { parsedA: JSON.parse(jsonA), errorA: null };
    } catch (err: any) {
      return { parsedA: undefined, errorA: err.message };
    }
  }, [jsonA]);

  const { parsedB, errorB } = useMemo(() => {
    if (!jsonB.trim()) return { parsedB: undefined, errorB: null };
    try {
      return { parsedB: JSON.parse(jsonB), errorB: null };
    } catch (err: any) {
      return { parsedB: undefined, errorB: err.message };
    }
  }, [jsonB]);

  // Diff entries
  const diffEntries = useMemo(() => {
    if (parsedA === undefined || parsedB === undefined) return [];
    return compareJsonStructures(parsedA, parsedB);
  }, [parsedA, parsedB]);

  // Diff metrics
  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    let changed = 0;
    let unchanged = 0;

    for (const d of diffEntries) {
      if (d.type === 'added') added++;
      else if (d.type === 'removed') removed++;
      else if (d.type === 'changed') changed++;
      else if (d.type === 'unchanged') unchanged++;
    }

    return { added, removed, changed, unchanged, totalDiffs: added + removed + changed };
  }, [diffEntries]);

  const displayedEntries = useMemo(() => {
    if (filterType === 'differences') {
      return diffEntries.filter((d) => d.type !== 'unchanged');
    }
    return diffEntries;
  }, [diffEntries, filterType]);

  const handleFormatBoth = () => {
    if (parsedA !== undefined) {
      setJsonA(JSON.stringify(parsedA, null, 2));
    }
    if (parsedB !== undefined) {
      setJsonB(JSON.stringify(parsedB, null, 2));
    }
    onToast('Formatted both JSON inputs');
  };

  const handleSwap = () => {
    const temp = jsonA;
    setJsonA(jsonB);
    setJsonB(temp);
    onToast('Swapped JSON A and JSON B');
  };

  const handleCopyDiff = () => {
    if (diffEntries.length === 0) return;
    const lines = diffEntries.map((d) => {
      if (d.type === 'added') return `+ [ADDED] ${d.path}: ${JSON.stringify(d.valB)}`;
      if (d.type === 'removed') return `- [REMOVED] ${d.path}: ${JSON.stringify(d.valA)}`;
      if (d.type === 'changed') return `~ [CHANGED] ${d.path}: ${JSON.stringify(d.valA)} => ${JSON.stringify(d.valB)}`;
      return `  [UNCHANGED] ${d.path}: ${JSON.stringify(d.valA)}`;
    });
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onToast('Copied structural diff summary');
  };

  const handleClear = () => {
    setJsonA('');
    setJsonB('');
    onToast('Cleared both inputs');
  };

  const handleLoadSample = () => {
    setJsonA(SAMPLE_A);
    setJsonB(SAMPLE_B);
    onToast('Loaded sample JSON documents');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Braces className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-slate-700">Semantic JSON Structure Comparison</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFormatBoth}
              disabled={errorA !== null || errorB !== null || (!jsonA && !jsonB)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-40"
            >
              Format Both
            </button>
            <button
              onClick={handleSwap}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Swap A/B</span>
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

        {/* JSON A and JSON B Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* JSON A */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <label htmlFor="json-diff-a">Original JSON (Document A):</label>
              {errorA ? (
                <span className="text-rose-600 text-[11px] font-bold">Invalid Syntax</span>
              ) : jsonA.trim() ? (
                <span className="text-emerald-600 text-[11px] font-bold">Valid JSON</span>
              ) : null}
            </div>
            <textarea
              id="json-diff-a"
              value={jsonA}
              onChange={(e) => setJsonA(e.target.value)}
              placeholder="Paste first JSON here..."
              rows={11}
              className={`w-full p-4 font-mono text-xs sm:text-sm text-slate-900 bg-slate-50/70 rounded-xl border focus:bg-white focus:ring-2 outline-none transition-all placeholder:text-slate-400 resize-y leading-relaxed ${
                errorA ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
            {errorA && (
              <p className="text-[11px] text-rose-600 font-mono px-1">{errorA}</p>
            )}
          </div>

          {/* JSON B */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <label htmlFor="json-diff-b">Modified JSON (Document B):</label>
              {errorB ? (
                <span className="text-rose-600 text-[11px] font-bold">Invalid Syntax</span>
              ) : jsonB.trim() ? (
                <span className="text-emerald-600 text-[11px] font-bold">Valid JSON</span>
              ) : null}
            </div>
            <textarea
              id="json-diff-b"
              value={jsonB}
              onChange={(e) => setJsonB(e.target.value)}
              placeholder="Paste second JSON here..."
              rows={11}
              className={`w-full p-4 font-mono text-xs sm:text-sm text-slate-900 bg-slate-50/70 rounded-xl border focus:bg-white focus:ring-2 outline-none transition-all placeholder:text-slate-400 resize-y leading-relaxed ${
                errorB ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
            {errorB && (
              <p className="text-[11px] text-rose-600 font-mono px-1">{errorB}</p>
            )}
          </div>
        </div>

        {/* Diff Results Header & Stats */}
        {parsedA !== undefined && parsedB !== undefined && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-slate-800">Comparison Summary:</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold font-mono">
                  +{stats.added} added
                </span>
                <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold font-mono">
                  -{stats.removed} removed
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold font-mono">
                  ~{stats.changed} changed
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-mono">
                  {stats.unchanged} unchanged
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-semibold">
                  <button
                    onClick={() => setFilterType('differences')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      filterType === 'differences' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Differences Only ({stats.totalDiffs})
                  </button>
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      filterType === 'all' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All Keys ({diffEntries.length})
                  </button>
                </div>

                <button
                  onClick={handleCopyDiff}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 hover:text-indigo-600 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Diff'}</span>
                </button>
              </div>
            </div>

            {/* Diff Entry Cards */}
            {displayedEntries.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {displayedEntries.map((d, idx) => (
                  <div
                    key={`${d.path}-${idx}`}
                    className={`p-3 rounded-xl border text-xs font-mono transition-colors ${
                      d.type === 'added'
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : d.type === 'removed'
                        ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                        : d.type === 'changed'
                        ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="flex items-center gap-1.5 font-bold">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-sans font-bold uppercase tracking-wider bg-white/80 shadow-2xs">
                          {d.type}
                        </span>
                        <span className="text-slate-900 font-mono">{d.path}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5 text-[11px] pt-1 border-t border-black/5">
                      {d.type === 'added' && (
                        <div className="sm:col-span-2 text-emerald-700">
                          + Added: <span className="font-bold select-all">{JSON.stringify(d.valB)}</span>
                        </div>
                      )}
                      {d.type === 'removed' && (
                        <div className="sm:col-span-2 text-rose-700 line-through">
                          - Removed: <span className="select-all">{JSON.stringify(d.valA)}</span>
                        </div>
                      )}
                      {d.type === 'changed' && (
                        <>
                          <div className="text-rose-700 line-through">
                            Before (A): <span className="select-all">{JSON.stringify(d.valA)}</span>
                          </div>
                          <div className="text-emerald-700">
                            After (B): <span className="font-bold select-all">{JSON.stringify(d.valB)}</span>
                          </div>
                        </>
                      )}
                      {d.type === 'unchanged' && (
                        <div className="sm:col-span-2 text-slate-500">
                          Value: <span className="select-all">{JSON.stringify(d.valA)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600">
                {stats.totalDiffs === 0 ? '✓ Both JSON documents are structurally identical!' : 'No differences found matching your filter.'}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
