import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, RotateCcw, AlertTriangle, Image as ImageIcon, Sliders, Palette, Check } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';
import { formatFileSize, readFileAsDataUrl, loadImage, downloadBlob } from '../../utils/imageUtils';

interface PngToJpgProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

export const PngToJpg: React.FC<PngToJpgProps> = ({ tool, onToast }) => {
  const [file, setFile] = useState<File | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  // Conversion parameters
  const [quality, setQuality] = useState<number>(92); // 50 to 100
  const [bgColor, setBgColor] = useState<string>('#ffffff'); // Default white for transparent regions

  // Output state
  const [jpgBlob, setJpgBlob] = useState<Blob | null>(null);
  const [jpgUrl, setJpgUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (jpgUrl) {
        URL.revokeObjectURL(jpgUrl);
      }
    };
  }, [jpgUrl]);

  const handleReset = () => {
    if (jpgUrl) {
      URL.revokeObjectURL(jpgUrl);
    }
    setFile(null);
    setOriginalSrc(null);
    setDimensions(null);
    setJpgBlob(null);
    setJpgUrl(null);
    setError(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onToast('Converter reset');
  };

  const processFile = async (selectedFile: File) => {
    setError(null);

    // Validate type (prefer PNG)
    if (!selectedFile.type.includes('png') && !selectedFile.name.toLowerCase().endsWith('.png')) {
      onToast('Notice: Processing non-PNG image into JPG format');
    }

    try {
      setIsProcessing(true);
      const dataUrl = await readFileAsDataUrl(selectedFile);
      const img = await loadImage(dataUrl);

      setFile(selectedFile);
      setOriginalSrc(dataUrl);
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });

      await convertToJpg(img, quality, bgColor);
      onToast('PNG loaded and converted to JPG');
    } catch (err: any) {
      setError(err.message || 'Failed to read image.');
      setFile(null);
      setOriginalSrc(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const convertToJpg = useCallback(async (img: HTMLImageElement, qVal: number, bgHex: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas 2D context unavailable.');

      // 1. Fill solid background for transparent regions
      ctx.fillStyle = bgHex;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw image on top
      ctx.drawImage(img, 0, 0, width, height);

      // 3. Export as image/jpeg
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/jpeg', qVal / 100);
      });

      if (!blob) throw new Error('Browser JPEG encoding failed.');

      if (jpgUrl) {
        URL.revokeObjectURL(jpgUrl);
      }

      const newUrl = URL.createObjectURL(blob);
      setJpgBlob(blob);
      setJpgUrl(newUrl);
    } catch (err: any) {
      setError(err.message || 'Error occurred during JPG conversion.');
    } finally {
      setIsProcessing(false);
    }
  }, [jpgUrl]);

  const handleQualityChange = async (newQ: number) => {
    setQuality(newQ);
    if (!originalSrc) return;
    try {
      const img = await loadImage(originalSrc);
      await convertToJpg(img, newQ, bgColor);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBgColorChange = async (newColor: string) => {
    setBgColor(newColor);
    if (!originalSrc) return;
    try {
      const img = await loadImage(originalSrc);
      await convertToJpg(img, quality, newColor);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDownload = () => {
    if (!jpgBlob || !file) return;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    downloadBlob(jpgBlob, `${baseName}.jpg`);
    onToast('JPG image downloaded');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {!file ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/60'
                : 'border-slate-300 hover:border-indigo-400 bg-slate-50/60 hover:bg-slate-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  processFile(e.target.files[0]);
                }
              }}
            />
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Upload className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Select or drop a PNG image to convert to JPG
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Transforms transparent or opaque PNGs into lightweight, universally compatible JPEG images with custom background fill.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700 truncate max-w-xs sm:max-w-md">
                  {file.name}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  ({dimensions?.width} × {dimensions?.height}px · {formatFileSize(file.size)})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Change Image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      processFile(e.target.files[0]);
                    }
                  }}
                />
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 border border-slate-200 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Error display */}
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block mb-0.5">Conversion Error:</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Controls Panel */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Background color for transparent pixels */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Transparent Background Fill Color:</span>
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Because JPEG does not support transparency, transparent areas are filled with this solid color.
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => handleBgColorChange(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: 'White', color: '#ffffff' },
                        { label: 'Black', color: '#000000' },
                        { label: 'Light Gray', color: '#f1f5f9' },
                        { label: 'Slate', color: '#0f172a' },
                      ].map((preset) => (
                        <button
                          key={preset.color}
                          type="button"
                          onClick={() => handleBgColorChange(preset.color)}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-colors ${
                            bgColor.toLowerCase() === preset.color.toLowerCase()
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* JPEG Quality Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <label htmlFor="png-jpg-quality" className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                      <span>JPEG Output Quality:</span>
                    </label>
                    <span className="font-mono text-indigo-600 font-bold">{quality}%</span>
                  </div>
                  <input
                    id="png-jpg-quality"
                    type="range"
                    min="50"
                    max="100"
                    step="2"
                    value={quality}
                    onChange={(e) => handleQualityChange(Number(e.target.value))}
                    disabled={isProcessing}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Smaller (50%)</span>
                    <span>High Fidelity (92%)</span>
                    <span>Maximum (100%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[11px] text-slate-500 block mb-0.5">Source PNG</span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {formatFileSize(file.size)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {dimensions?.width} × {dimensions?.height}px
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[11px] text-slate-500 block mb-0.5">Converted JPG</span>
                <span className="text-base font-bold text-indigo-600 font-mono">
                  {jpgBlob ? formatFileSize(jpgBlob.size) : 'Converting...'}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Quality: {quality}% · Fill: {bgColor.toUpperCase()}
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col justify-center">
                <button
                  onClick={handleDownload}
                  disabled={isProcessing || !jpgBlob}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-40"
                >
                  <Download className="w-4 h-4" />
                  <span>Download JPG</span>
                </button>
              </div>
            </div>

            {/* Side-by-side Visual Previews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                  <span>Source PNG (With Alpha Transparency)</span>
                  <span className="text-slate-400 font-mono">{formatFileSize(file.size)}</span>
                </div>
                {/* Checkered background to showcase PNG transparency */}
                <div
                  className="flex-1 min-h-[220px] max-h-[380px] rounded-lg border border-slate-200/80 flex items-center justify-center p-2 overflow-hidden"
                  style={{
                    backgroundImage: 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
                    backgroundSize: '16px 16px',
                    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                    backgroundColor: '#ffffff'
                  }}
                >
                  {originalSrc && (
                    <img
                      src={originalSrc}
                      alt="Source PNG preview"
                      className="max-h-full max-w-full object-contain rounded"
                    />
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                  <span className="text-indigo-700">Converted JPG Output</span>
                  <span className="text-indigo-600 font-mono font-bold">
                    {jpgBlob ? formatFileSize(jpgBlob.size) : 'Processing...'}
                  </span>
                </div>
                <div className="flex-1 min-h-[220px] max-h-[380px] bg-white rounded-lg border border-slate-200/80 flex items-center justify-center p-2 overflow-hidden relative">
                  {isProcessing && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-10">
                      <span className="text-xs font-semibold text-indigo-600">Converting to JPG...</span>
                    </div>
                  )}
                  {jpgUrl ? (
                    <img
                      src={jpgUrl}
                      alt="Converted JPG preview"
                      className="max-h-full max-w-full object-contain rounded"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">Waiting for conversion...</span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Processed 100% in your browser. No files are uploaded to any server.
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleReset}
                  className="flex-1 sm:flex-initial px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-medium transition-colors"
                >
                  Convert Another
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!jpgBlob}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JPG Image</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
