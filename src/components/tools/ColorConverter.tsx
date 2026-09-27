import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Shuffle, Palette, AlertTriangle } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface ColorConverterProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

// Color math helpers
function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

function hexToRgb(hexStr: string): { r: number; g: number; b: number } | null {
  let hex = hexStr.trim().replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  if (hex.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(hex)) {
    return null;
  }
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r = clamp(r, 0, 255) / 255;
  g = clamp(g, 0, 255) / 255;
  b = clamp(b, 0, 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = (h % 360 + 360) % 360 / 360;
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;

  if (s === 0) {
    const val = Math.round(l * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

  return { r, g, b };
}

// Preset popular colors
const PRESETS = [
  { name: 'Indigo 600', hex: '#4f46e5' },
  { name: 'Emerald 500', hex: '#10b981' },
  { name: 'Rose 500', hex: '#f43f5e' },
  { name: 'Amber 500', hex: '#f59e0b' },
  { name: 'Sky 500', hex: '#0ea5e9' },
  { name: 'Purple 600', hex: '#9333ea' },
  { name: 'Slate 800', hex: '#1e293b' },
  { name: 'Crimson', hex: '#dc2626' },
  { name: 'Teal 600', hex: '#0d9488' },
  { name: 'Coral', hex: '#ff6f61' },
];

export const ColorConverter: React.FC<ColorConverterProps> = ({ tool, onToast }) => {
  // Master RGB representation
  const [rgb, setRgb] = useState<{ r: number; g: number; b: number }>({ r: 79, g: 70, b: 229 }); // Indigo 600
  
  // Controlled input strings
  const [hexInput, setHexInput] = useState<string>('#4f46e5');
  const [rgbInput, setRgbInput] = useState<string>('rgb(79, 70, 229)');
  const [hslInput, setHslInput] = useState<string>('hsl(243, 75%, 59%)');
  
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync all inputs from master RGB
  const syncFromRgb = (newRgb: { r: number; g: number; b: number }) => {
    setRgb(newRgb);
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    const hsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    setHexInput(hex);
    setRgbInput(`rgb(${newRgb.r}, ${newRgb.g}, ${newRgb.b})`);
    setHslInput(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
    setError(null);
  };

  const handleHexChange = (val: string) => {
    setHexInput(val);
    const parsed = hexToRgb(val);
    if (parsed) {
      setRgb(parsed);
      const hsl = rgbToHsl(parsed.r, parsed.g, parsed.b);
      setRgbInput(`rgb(${parsed.r}, ${parsed.g}, ${parsed.b})`);
      setHslInput(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
      setError(null);
    } else {
      setError('Invalid HEX color format. Example: #4f46e5 or #fff');
    }
  };

  const handleRgbChange = (val: string) => {
    setRgbInput(val);
    const match = val.match(/(?:rgb\s*\()?\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)?/i);
    if (match) {
      const r = parseInt(match[1], 10);
      const g = parseInt(match[2], 10);
      const b = parseInt(match[3], 10);
      if (r <= 255 && g <= 255 && b <= 255) {
        const newRgb = { r, g, b };
        setRgb(newRgb);
        setHexInput(rgbToHex(r, g, b));
        const hsl = rgbToHsl(r, g, b);
        setHslInput(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
        setError(null);
        return;
      }
    }
    setError('Invalid RGB format. Use rgb(79, 70, 229) with values between 0 and 255.');
  };

  const handleHslChange = (val: string) => {
    setHslInput(val);
    const match = val.match(/(?:hsl\s*\()?\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*\)?/i);
    if (match) {
      const h = parseInt(match[1], 10);
      const s = parseInt(match[2], 10);
      const l = parseInt(match[3], 10);
      if (h <= 360 && s <= 100 && l <= 100) {
        const newRgb = hslToRgb(h, s, l);
        setRgb(newRgb);
        setHexInput(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        setRgbInput(`rgb(${newRgb.r}, ${newRgb.g}, ${newRgb.b})`);
        setError(null);
        return;
      }
    }
    setError('Invalid HSL format. Example: hsl(243, 75%, 59%) with H 0-360, S 0-100%, L 0-100%.');
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    onToast(`Copied ${key.toUpperCase()}`);
  };

  const handleRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    syncFromRgb({ r, g, b });
    onToast('Generated random color');
  };

  const handleReset = () => {
    syncFromRgb({ r: 79, g: 70, b: 229 });
    onToast('Reset to default Indigo color');
  };

  // Contrast calculation to determine whether white or black text looks best on the preview
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  const isLight = brightness > 155;
  const currentHex = rgbToHex(rgb.r, rgb.g, rgb.b);

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-slate-700">Color Format Converter (HEX · RGB · HSL)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomColor}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Random Color</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 border border-slate-200 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Error notice */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">Format Notice:</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Main Swatch & Native Color Picker */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Large Live Swatch */}
          <div
            className="md:col-span-1 h-44 rounded-2xl border border-slate-200 shadow-inner flex flex-col items-center justify-center p-4 transition-colors relative group"
            style={{ backgroundColor: currentHex }}
          >
            <span
              className={`text-lg font-bold font-mono tracking-wider ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              {currentHex.toUpperCase()}
            </span>
            <span
              className={`text-xs mt-1 font-medium ${
                isLight ? 'text-slate-700' : 'text-slate-200'
              }`}
            >
              rgb({rgb.r}, {rgb.g}, {rgb.b})
            </span>

            {/* Hidden native input overlay to click-and-pick anywhere */}
            <input
              type="color"
              value={currentHex}
              onChange={(e) => handleHexChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              title="Click to open color picker"
            />
            <span className={`text-[10px] mt-2 opacity-75 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Click swatch to open native color wheel
            </span>
          </div>

          {/* Color Values & Copy Rows */}
          <div className="md:col-span-2 space-y-3.5">
            {/* HEX Input */}
            <div>
              <label htmlFor="hex-field" className="block text-xs font-semibold text-slate-700 mb-1">
                HEX Value:
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="hex-field"
                  type="text"
                  value={hexInput}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                />
                <button
                  onClick={() => handleCopy('hex', currentHex)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs transition-colors shrink-0"
                >
                  {copiedKey === 'hex' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'hex' ? 'Copied' : 'Copy HEX'}</span>
                </button>
              </div>
            </div>

            {/* RGB Input */}
            <div>
              <label htmlFor="rgb-field" className="block text-xs font-semibold text-slate-700 mb-1">
                RGB Value:
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="rgb-field"
                  type="text"
                  value={rgbInput}
                  onChange={(e) => handleRgbChange(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                />
                <button
                  onClick={() => handleCopy('rgb', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs transition-colors shrink-0"
                >
                  {copiedKey === 'rgb' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'rgb' ? 'Copied' : 'Copy RGB'}</span>
                </button>
              </div>
            </div>

            {/* HSL Input */}
            <div>
              <label htmlFor="hsl-field" className="block text-xs font-semibold text-slate-700 mb-1">
                HSL Value:
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="hsl-field"
                  type="text"
                  value={hslInput}
                  onChange={(e) => handleHslChange(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                />
                <button
                  onClick={() => {
                    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                    handleCopy('hsl', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs transition-colors shrink-0"
                >
                  {copiedKey === 'hsl' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'hsl' ? 'Copied' : 'Copy HSL'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Color Palette Presets */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-700 block">Popular Swatch Presets:</span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.hex}
                onClick={() => {
                  const parsed = hexToRgb(p.hex);
                  if (parsed) syncFromRgb(parsed);
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:border-indigo-400 hover:shadow-2xs transition-all"
              >
                <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: p.hex }} />
                <span>{p.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">{p.hex}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
