import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { Download, Copy, Check, Barcode, AlertTriangle, RefreshCw, Sliders } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface BarcodeGeneratorProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

type BarcodeFormat = 'CODE128' | 'EAN13' | 'UPC';

export const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({ tool, onToast }) => {
  const [format, setFormat] = useState<BarcodeFormat>('CODE128');
  const [value, setValue] = useState('TOOLNEST-2026');
  const [displayValue, setDisplayValue] = useState(true);
  const [height, setHeight] = useState(100);
  const [width, setWidth] = useState(2);
  const [lineColor, setLineColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Compute standard Modulo 10 check digit for EAN-13
  const calcEan13CheckDigit = (digits12: string): number => {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(digits12[i], 10);
      sum += i % 2 === 0 ? digit : digit * 3;
    }
    const rem = sum % 10;
    return rem === 0 ? 0 : 10 - rem;
  };

  // Compute standard Modulo 10 check digit for UPC-A
  const calcUpcACheckDigit = (digits11: string): number => {
    let sum = 0;
    for (let i = 0; i < 11; i++) {
      const digit = parseInt(digits11[i], 10);
      sum += i % 2 === 0 ? digit * 3 : digit;
    }
    const rem = sum % 10;
    return rem === 0 ? 0 : 10 - rem;
  };

  // Validate format specific inputs
  const validateInput = (fmt: BarcodeFormat, val: string): { isValid: boolean; normalized: string; error?: string } => {
    const trimmed = val.trim();
    if (!trimmed) {
      return { isValid: false, normalized: '', error: 'Barcode value cannot be empty.' };
    }

    if (fmt === 'EAN13') {
      if (!/^\d+$/.test(trimmed)) {
        return { isValid: false, normalized: '', error: 'EAN-13 only accepts numeric digits (0-9).' };
      }
      if (trimmed.length === 12) {
        // Automatically calculate and append the valid 13th check digit
        const check = calcEan13CheckDigit(trimmed);
        return { isValid: true, normalized: trimmed + check.toString() };
      }
      if (trimmed.length === 13) {
        const expected = calcEan13CheckDigit(trimmed.slice(0, 12));
        const actual = parseInt(trimmed[12], 10);
        if (expected !== actual) {
          return {
            isValid: false,
            normalized: '',
            error: `Invalid EAN-13 checksum digit. For prefix ${trimmed.slice(0, 12)}, the 13th digit should be ${expected} (you entered ${actual}).`,
          };
        }
        return { isValid: true, normalized: trimmed };
      }
      return { isValid: false, normalized: '', error: `EAN-13 requires 12 or 13 digits (you entered ${trimmed.length}).` };
    }

    if (fmt === 'UPC') {
      if (!/^\d+$/.test(trimmed)) {
        return { isValid: false, normalized: '', error: 'UPC-A only accepts numeric digits (0-9).' };
      }
      if (trimmed.length === 11) {
        // Automatically calculate and append the valid 12th check digit
        const check = calcUpcACheckDigit(trimmed);
        return { isValid: true, normalized: trimmed + check.toString() };
      }
      if (trimmed.length === 12) {
        const expected = calcUpcACheckDigit(trimmed.slice(0, 11));
        const actual = parseInt(trimmed[11], 10);
        if (expected !== actual) {
          return {
            isValid: false,
            normalized: '',
            error: `Invalid UPC-A checksum digit. For prefix ${trimmed.slice(0, 11)}, the 12th digit should be ${expected} (you entered ${actual}).`,
          };
        }
        return { isValid: true, normalized: trimmed };
      }
      return { isValid: false, normalized: '', error: `UPC-A requires 11 or 12 digits (you entered ${trimmed.length}).` };
    }

    // CODE128 accepts standard ASCII
    return { isValid: true, normalized: trimmed };
  };

  // Switch format presets
  const handleFormatChange = (newFmt: BarcodeFormat) => {
    setFormat(newFmt);
    setError(null);
    if (newFmt === 'EAN13') {
      setValue('978020137962'); // 12-digit standard ISBN/EAN prefix
    } else if (newFmt === 'UPC') {
      setValue('01234567890'); // 11-digit UPC
    } else {
      setValue('TOOLNEST-2026');
    }
  };

  // Render barcode whenever parameters change
  useEffect(() => {
    const validation = validateInput(format, value);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid input.');
      return;
    }

    if (!svgRef.current) return;

    try {
      JsBarcode(svgRef.current, validation.normalized, {
        format: format,
        lineColor: lineColor,
        background: bgColor,
        width: width,
        height: height,
        displayValue: displayValue,
        font: 'JetBrains Mono, monospace',
        fontSize: 14,
        margin: 15,
        valid: (valid) => {
          if (!valid) {
            setError(`Invalid checksum or character set for ${format}.`);
          } else {
            setError(null);
          }
        },
      });

      // Also render to offscreen canvas for PNG export
      if (canvasRef.current) {
        JsBarcode(canvasRef.current, validation.normalized, {
          format: format,
          lineColor: lineColor,
          background: bgColor,
          width: width,
          height: height,
          displayValue: displayValue,
          font: 'JetBrains Mono, monospace',
          fontSize: 14,
          margin: 15,
        });
      }
    } catch (err: any) {
      setError(err.message || `Failed to render ${format} barcode.`);
    }
  }, [format, value, displayValue, height, width, lineColor, bgColor]);

  const handleDownloadPng = () => {
    if (!canvasRef.current || error) return;
    const link = document.createElement('a');
    link.download = `barcode-${format.toLowerCase()}-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    onToast('Barcode PNG downloaded!');
  };

  const handleDownloadSvg = () => {
    if (!svgRef.current || error) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `barcode-${format.toLowerCase()}-${Date.now()}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    onToast('Barcode SVG downloaded!');
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current || error) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        setCopied(true);
        onToast('Barcode image copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      });
    } catch (err) {
      console.error(err);
      onToast('Copy failed. Try downloading PNG instead.');
    }
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-8">
        {/* Format Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => handleFormatChange('CODE128')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
              format === 'CODE128'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Code 128 (Alphanumeric / Shipping)
          </button>
          <button
            onClick={() => handleFormatChange('EAN13')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
              format === 'EAN13'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            EAN-13 (13 Digits / Retail)
          </button>
          <button
            onClick={() => handleFormatChange('UPC')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
              format === 'UPC'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            UPC-A (12 Digits / North America)
          </button>
        </div>

        {/* Workstation Grid: Config on Left, Preview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Configuration Form */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <label htmlFor="barcode-data-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Barcode Payload Value:
              </label>
              <input
                id="barcode-data-input"
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={
                  format === 'EAN13'
                    ? 'Enter 12 or 13 digits (e.g. 978020137962)...'
                    : format === 'UPC'
                    ? 'Enter 11 or 12 digits (e.g. 01234567890)...'
                    : 'Enter alphanumeric text...'
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                {format === 'EAN13'
                  ? 'Input 12 digits to auto-calculate checksum, or all 13 digits.'
                  : format === 'UPC'
                  ? 'Input 11 digits to auto-calculate checksum, or all 12 digits.'
                  : 'Supports standard uppercase, lowercase, numbers, and symbols.'}
              </span>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block mb-0.5">Barcode Generation Error:</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Visual Options */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
              <span className="font-semibold uppercase tracking-wider text-slate-500 block text-[11px]">
                Dimensions & Styling Options
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-1 font-medium">Bar Width ({width}px):</label>
                  <input
                    type="range"
                    min={1}
                    max={4}
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-medium">Bar Height ({height}px):</label>
                  <input
                    type="range"
                    min={40}
                    max={150}
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-slate-700 mb-1 font-medium">Bar Color:</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={lineColor}
                      onChange={(e) => setLineColor(e.target.value)}
                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0.5"
                    />
                    <span className="font-mono text-[11px] uppercase text-slate-600">{lineColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-medium">Background:</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0.5"
                    />
                    <span className="font-mono text-[11px] uppercase text-slate-600">{bgColor}</span>
                  </div>
                </div>

                <div className="flex items-center pt-3">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={displayValue}
                      onChange={(e) => setDisplayValue(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span>Show Text Label</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview Panel */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-50/80 rounded-2xl border border-slate-200/90 text-center">
            <span className="text-xs font-semibold text-slate-600 mb-4 block">
              Live Scannable 1D Barcode Preview
            </span>

            {/* Barcode Display Box */}
            <div className="p-4 bg-white rounded-xl shadow-xs border border-slate-200 flex items-center justify-center overflow-x-auto max-w-full">
              <svg ref={svgRef} className="max-w-full h-auto" />
              {/* Offscreen canvas for crisp PNG raster export */}
              <canvas
                ref={canvasRef}
                style={{ position: 'fixed', left: '-9999px', top: '-9999px', opacity: 0, pointerEvents: 'none' }}
                aria-hidden="true"
              />
            </div>

            {/* Actions */}
            <div className="w-full mt-6 space-y-2.5">
              <button
                onClick={handleDownloadPng}
                disabled={Boolean(error)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-sm disabled:opacity-40"
              >
                <Download className="w-4 h-4" />
                <span>Download Barcode PNG</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDownloadSvg}
                  disabled={Boolean(error)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition-colors disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SVG</span>
                </button>
                <button
                  onClick={handleCopyImage}
                  disabled={Boolean(error)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition-colors disabled:opacity-40"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Image'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
