import React, { useState, useEffect } from 'react';
import { Copy, Check, Clock, RotateCcw, AlertTriangle, ArrowRightLeft, Calendar } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface TimestampConverterProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

export const TimestampConverter: React.FC<TimestampConverterProps> = ({ tool, onToast }) => {
  // Mode: Timestamp -> Date or Date -> Timestamp
  const [activeTab, setActiveTab] = useState<'to_date' | 'to_timestamp'>('to_date');

  // Tab 1: Timestamp -> Date
  const [timestampInput, setTimestampInput] = useState<string>(() => Math.floor(Date.now() / 1000).toString());
  const [unitMode, setUnitMode] = useState<'auto' | 'seconds' | 'milliseconds'>('auto');

  // Tab 2: Date -> Timestamp
  const [customDate, setCustomDate] = useState<string>(() => {
    const now = new Date();
    // Format YYYY-MM-DDTHH:mm for datetime-local input
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Local browser timezone name
  const localTimezone = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Local Time';

  // Compute parsed Date from timestamp input
  const parsedFromTimestamp = (() => {
    const raw = timestampInput.trim();
    if (!raw) return null;
    const num = Number(raw);
    if (isNaN(num)) return null;

    let ms = num;
    if (unitMode === 'seconds') {
      ms = num * 1000;
    } else if (unitMode === 'milliseconds') {
      ms = num;
    } else {
      // Auto: if string has <= 11 digits, assume seconds, otherwise ms
      if (raw.length <= 11) {
        ms = num * 1000;
      } else {
        ms = num;
      }
    }

    const d = new Date(ms);
    if (isNaN(d.getTime())) return null;
    return { date: d, ms: d.getTime(), seconds: Math.floor(d.getTime() / 1000) };
  })();

  // Relative time formatter
  const getRelativeTime = (d: Date): string => {
    const diffMs = d.getTime() - Date.now();
    const diffSec = Math.round(diffMs / 1000);
    const absSec = Math.abs(diffSec);

    if (absSec < 5) return 'just now';
    if (absSec < 60) return diffSec > 0 ? `in ${absSec} seconds` : `${absSec} seconds ago`;

    const diffMin = Math.round(diffSec / 60);
    const absMin = Math.abs(diffMin);
    if (absMin < 60) return diffMin > 0 ? `in ${absMin} minutes` : `${absMin} minutes ago`;

    const diffHours = Math.round(diffMin / 60);
    const absHours = Math.abs(diffHours);
    if (absHours < 24) return diffHours > 0 ? `in ${absHours} hours` : `${absHours} hours ago`;

    const diffDays = Math.round(diffHours / 24);
    const absDays = Math.abs(diffDays);
    if (absDays < 30) return diffDays > 0 ? `in ${absDays} days` : `${absDays} days ago`;

    const diffMonths = Math.round(diffDays / 30);
    const absMonths = Math.abs(diffMonths);
    if (absMonths < 12) return diffMonths > 0 ? `in ${absMonths} months` : `${absMonths} months ago`;

    const diffYears = Math.round(diffDays / 365);
    const absYears = Math.abs(diffYears);
    return diffYears > 0 ? `in ${absYears} years` : `${absYears} years ago`;
  };

  // Compute timestamp from customDate input
  const parsedFromDate = (() => {
    if (!customDate) return null;
    const d = new Date(customDate);
    if (isNaN(d.getTime())) return null;
    return {
      date: d,
      seconds: Math.floor(d.getTime() / 1000),
      ms: d.getTime(),
    };
  })();

  const handleSetCurrent = () => {
    const now = Date.now();
    setTimestampInput(Math.floor(now / 1000).toString());
    const d = new Date(now);
    const pad = (n: number) => n.toString().padStart(2, '0');
    setCustomDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`);
    onToast('Loaded current live timestamp');
  };

  const handleCopy = (key: string, val: string | number) => {
    navigator.clipboard.writeText(String(val));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
    onToast(`Copied ${key}`);
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-slate-700">Unix Epoch Timestamp Converter</span>
          </div>
          <button
            onClick={handleSetCurrent}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Use Current Timestamp (Now)</span>
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl max-w-md">
          <button
            onClick={() => setActiveTab('to_date')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'to_date'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Unix Timestamp → Human Date
          </button>
          <button
            onClick={() => setActiveTab('to_timestamp')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'to_timestamp'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Human Date → Unix Timestamp
          </button>
        </div>

        {/* Tab 1: Timestamp to Date */}
        {activeTab === 'to_date' && (
          <div className="space-y-5">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="sm:col-span-2">
                  <label htmlFor="timestamp-input-field" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Enter Unix Timestamp:
                  </label>
                  <input
                    id="timestamp-input-field"
                    type="text"
                    value={timestampInput}
                    onChange={(e) => setTimestampInput(e.target.value)}
                    placeholder="e.g. 1774699200 (seconds) or 1774699200000 (ms)"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="unit-mode-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Time Unit:
                  </label>
                  <select
                    id="unit-mode-select"
                    value={unitMode}
                    onChange={(e) => setUnitMode(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs outline-none focus:border-indigo-500"
                  >
                    <option value="auto">Auto-detect (Seconds / ms)</option>
                    <option value="seconds">Seconds (10 digits)</option>
                    <option value="milliseconds">Milliseconds (13 digits)</option>
                  </select>
                </div>
              </div>
            </div>

            {parsedFromTimestamp ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Converted Date & Time Formats:</span>
                  <span className="text-indigo-600 font-medium">
                    Relative: {getRelativeTime(parsedFromTimestamp.date)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Local Time Card */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-500">
                        Local Browser Time ({localTimezone})
                      </span>
                      <button
                        onClick={() => handleCopy('local', parsedFromTimestamp.date.toLocaleString())}
                        className="text-slate-400 hover:text-indigo-600"
                      >
                        {copiedKey === 'local' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="text-sm font-bold text-slate-900 font-mono select-all">
                      {parsedFromTimestamp.date.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'long' })}
                    </div>
                  </div>

                  {/* UTC Time Card */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-500">
                        UTC / GMT Time
                      </span>
                      <button
                        onClick={() => handleCopy('utc', parsedFromTimestamp.date.toUTCString())}
                        className="text-slate-400 hover:text-indigo-600"
                      >
                        {copiedKey === 'utc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="text-sm font-bold text-indigo-700 font-mono select-all">
                      {parsedFromTimestamp.date.toUTCString()}
                    </div>
                  </div>

                  {/* ISO 8601 */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-500">ISO 8601 Extended</span>
                      <button
                        onClick={() => handleCopy('iso', parsedFromTimestamp.date.toISOString())}
                        className="text-slate-400 hover:text-indigo-600"
                      >
                        {copiedKey === 'iso' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="text-xs font-bold text-slate-800 font-mono select-all truncate">
                      {parsedFromTimestamp.date.toISOString()}
                    </div>
                  </div>

                  {/* Seconds & Milliseconds */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-500">Epoch Seconds / Milliseconds</span>
                      <button
                        onClick={() => handleCopy('seconds', parsedFromTimestamp.seconds)}
                        className="text-slate-400 hover:text-indigo-600"
                      >
                        {copiedKey === 'seconds' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="text-xs font-bold text-slate-800 font-mono select-all">
                      {parsedFromTimestamp.seconds} s · {parsedFromTimestamp.ms} ms
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Please enter a valid numeric Unix timestamp (e.g. 1774699200).</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Date to Timestamp */}
        {activeTab === 'to_timestamp' && (
          <div className="space-y-5">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div>
                <label htmlFor="custom-datetime-field" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Choose Date & Time ({localTimezone}):
                </label>
                <input
                  id="custom-datetime-field"
                  type="datetime-local"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-full sm:w-80 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-sans text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>
            </div>

            {parsedFromDate ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500">Epoch Timestamp (Seconds)</span>
                    <button
                      onClick={() => handleCopy('date_sec', parsedFromDate.seconds)}
                      className="text-slate-400 hover:text-indigo-600"
                    >
                      {copiedKey === 'date_sec' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="text-lg font-bold text-indigo-700 font-mono select-all">
                    {parsedFromDate.seconds}
                  </div>
                  <span className="text-[10px] text-slate-400">Used by Unix, Linux, PHP, Python, PostgreSQL</span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500">Epoch Timestamp (Milliseconds)</span>
                    <button
                      onClick={() => handleCopy('date_ms', parsedFromDate.ms)}
                      className="text-slate-400 hover:text-indigo-600"
                    >
                      {copiedKey === 'date_ms' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="text-lg font-bold text-slate-900 font-mono select-all">
                    {parsedFromDate.ms}
                  </div>
                  <span className="text-[10px] text-slate-400">Used by JavaScript Date.now(), Java, MongoDB</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Please select a valid date.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
