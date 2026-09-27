import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, RotateCcw, AlertTriangle, Check, Sliders, Image as ImageIcon, Sparkles, FileDown, ArrowRight } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';
import { formatFileSize, readFileAsDataUrl, loadImage, downloadBlob } from '../../utils/imageUtils';

interface ImageCompressorProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

type OutputFormat = 'image/jpeg' | 'image/webp' | 'image/png';

export const ImageCompressor: React.FC<ImageCompressorProps> = ({ tool, onToast }) => {
  const [file, setFile] = useState<File | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);

  // Settings
  const [quality, setQuality] = useState<number>(75); // 10 to 100
  const [format, setFormat] = useState<OutputFormat>('image/jpeg');

  // Compressed result state
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedDimensions, setCompressedDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (compressedUrl) {
        URL.revokeObjectURL(compressedUrl);
      }
    };
  }, [compressedUrl]);

  const handleReset = () => {
    if (compressedUrl) {
      URL.revokeObjectURL(compressedUrl);
    }
    setFile(null);
    setOriginalSrc(null);
    setOriginalDimensions(null);
    setCompressedBlob(null);
    setCompressedUrl(null);
    setCompressedDimensions(null);
    setError(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onToast('Compressor reset');
  };

  const processFile = async (selectedFile: File) => {
    setError(null);

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type) && !/\.(jpe?g|png|webp)$/i.test(selectedFile.name)) {
      setError('Unsupported file type. Please upload a JPG, PNG, or WebP image.');
      return;
    }

    try {
      setIsProcessing(true);
      const dataUrl = await readFileAsDataUrl(selectedFile);
      const img = await loadImage(dataUrl);

      setFile(selectedFile);
      setOriginalSrc(dataUrl);
      setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });

      // Auto-choose initial format: if PNG with potential transparency, default to WebP or JPEG
      let initialFormat: OutputFormat = 'image/jpeg';
      if (selectedFile.type === 'image/webp') {
        initialFormat = 'image/webp';
      } else if (selectedFile.type === 'image/png') {
        // WebP preserves transparency while providing lossy compression
        initialFormat = 'image/webp';
      }
      setFormat(initialFormat);

      // Trigger initial compression with default settings
      await runCompression(img, quality, initialFormat, selectedFile.name);
      onToast('Image loaded successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to process the uploaded image.');
      setFile(null);
      setOriginalSrc(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const runCompression = useCallback(async (
    imgElement: HTMLImageElement,
    targetQuality: number,
    targetFormat: OutputFormat,
    originalName: string
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      const width = imgElement.naturalWidth;
      const height = imgElement.naturalHeight;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context unavailable.');
      }

      // If converting to JPEG, paint white background in case of transparency
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(imgElement, 0, 0, width, height);

      const q = targetQuality / 100;

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), targetFormat, q);
      });

      if (!blob) {
        throw new Error('In-browser image encoding failed.');
      }

      if (compressedUrl) {
        URL.revokeObjectURL(compressedUrl);
      }

      const newUrl = URL.createObjectURL(blob);
      setCompressedBlob(blob);
      setCompressedUrl(newUrl);
      setCompressedDimensions({ width, height });
    } catch (err: any) {
      setError(err.message || 'Error occurred during compression.');
      setCompressedBlob(null);
      if (compressedUrl) {
        URL.revokeObjectURL(compressedUrl);
        setCompressedUrl(null);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [compressedUrl]);

  // Re-compress when quality or format changes
  const handleApplySettings = async (newQuality: number, newFormat: OutputFormat) => {
    if (!originalSrc || !file) return;
    try {
      const img = await loadImage(originalSrc);
      await runCompression(img, newQuality, newFormat, file.name);
    } catch (err: any) {
      setError(err.message || 'Failed to recompress image.');
    }
  };

  const onQualityChange = (val: number) => {
    setQuality(val);
    handleApplySettings(val, format);
  };

  const onFormatChange = (newFmt: OutputFormat) => {
    setFormat(newFmt);
    handleApplySettings(newQualitySafe(newFmt), newFmt);
  };

  const newQualitySafe = (fmt: OutputFormat) => {
    return quality;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDownload = () => {
    if (!compressedBlob || !file) return;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const ext = format === 'image/webp' ? 'webp' : format === 'image/png' ? 'png' : 'jpg';
    downloadBlob(compressedBlob, `${baseName}-compressed.${ext}`);
    onToast('Compressed image downloaded');
  };

  // Savings calculation
  const originalSize = file ? file.size : 0;
  const compressedSize = compressedBlob ? compressedBlob.size : 0;
  const sizeDiff = originalSize - compressedSize;
  const savingsPercent = originalSize > 0 && compressedSize > 0 
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100) 
    : 0;

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Upload Zone (shown prominently when no file, or collapsible) */}
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
              accept="image/jpeg,image/png,image/webp,image/jpg"
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
              Drop your image here, or <span className="text-indigo-600">browse files</span>
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Supports JPG, PNG, and WebP. 100% private in-browser compression without server uploads.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700 truncate max-w-xs sm:max-w-md">
                  {file.name}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  ({formatFileSize(file.size)})
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
                  accept="image/jpeg,image/png,image/webp,image/jpg"
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

            {/* Error notice */}
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block mb-0.5">Processing Error:</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Controls Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                {/* Quality Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <label htmlFor="quality-slider" className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Compression Quality:</span>
                    </label>
                    <span className="font-mono text-indigo-600 font-bold">{quality}%</span>
                  </div>
                  <input
                    id="quality-slider"
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={quality}
                    onChange={(e) => onQualityChange(Number(e.target.value))}
                    disabled={isProcessing}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Smaller Size (10%)</span>
                    <span>Balanced (75%)</span>
                    <span>Best Quality (100%)</span>
                  </div>
                </div>

                {/* Output Format Picker */}
                <div>
                  <label htmlFor="output-format" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Target Output Format:
                  </label>
                  <select
                    id="output-format"
                    value={format}
                    onChange={(e) => onFormatChange(e.target.value as OutputFormat)}
                    disabled={isProcessing}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs outline-none focus:border-indigo-500"
                  >
                    <option value="image/jpeg">JPG / JPEG (Standard universal lossy)</option>
                    <option value="image/webp">WebP (Modern web format, best compression & transparency)</option>
                    <option value="image/png">PNG (Lossless raster, limited compression)</option>
                  </select>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {format === 'image/jpeg' ? 'JPEG converts transparent pixels to white.' : format === 'image/webp' ? 'WebP offers modern compression with transparency support.' : 'Canvas PNG compression is lossless.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Comparison Metrics Header */}
            {compressedBlob && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[11px] text-slate-500 block mb-0.5">Original Size</span>
                  <span className="text-base sm:text-lg font-bold text-slate-900 font-mono">
                    {formatFileSize(originalSize)}
                  </span>
                  {originalDimensions && (
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {originalDimensions.width} × {originalDimensions.height}px
                    </span>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[11px] text-slate-500 block mb-0.5">Compressed Size</span>
                  <span className="text-base sm:text-lg font-bold text-indigo-600 font-mono">
                    {formatFileSize(compressedSize)}
                  </span>
                  {compressedDimensions && (
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {compressedDimensions.width} × {compressedDimensions.height}px
                    </span>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[11px] text-slate-500 block mb-0.5">Space Saved</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-base sm:text-lg font-bold font-mono ${savingsPercent > 0 ? 'text-emerald-600' : 'text-slate-600'}`}>
                      {savingsPercent > 0 ? `-${savingsPercent}%` : `${savingsPercent}%`}
                    </span>
                    {savingsPercent > 0 && (
                      <span className="text-[11px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded font-medium">
                        {formatFileSize(sizeDiff)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col justify-center">
                  <button
                    onClick={handleDownload}
                    disabled={isProcessing || !compressedBlob}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-40"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            )}

            {/* Side-by-Side Image Previews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original preview */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                  <span>Original Image</span>
                  <span className="text-slate-400 font-mono">{formatFileSize(originalSize)}</span>
                </div>
                <div className="flex-1 min-h-[220px] max-h-[380px] bg-white rounded-lg border border-slate-200/80 flex items-center justify-center p-2 overflow-hidden">
                  {originalSrc && (
                    <img
                      src={originalSrc}
                      alt="Original uploaded preview"
                      className="max-h-full max-w-full object-contain rounded"
                    />
                  )}
                </div>
              </div>

              {/* Compressed preview */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                  <span className="flex items-center gap-1.5 text-indigo-700">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Compressed Preview</span>
                  </span>
                  <span className="text-indigo-600 font-mono font-bold">
                    {compressedBlob ? formatFileSize(compressedSize) : 'Processing...'}
                  </span>
                </div>
                <div className="flex-1 min-h-[220px] max-h-[380px] bg-white rounded-lg border border-slate-200/80 flex items-center justify-center p-2 overflow-hidden relative">
                  {isProcessing && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-10">
                      <span className="text-xs font-semibold text-indigo-600">Compressing in browser...</span>
                    </div>
                  )}
                  {compressedUrl ? (
                    <img
                      src={compressedUrl}
                      alt="Compressed preview"
                      className="max-h-full max-w-full object-contain rounded"
                    />
                  ) : (
                    <div className="text-slate-400 text-xs">Waiting for processing...</div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Download Bar */}
            {compressedBlob && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  <span>Processed locally using HTML5 Canvas · </span>
                  <strong className="text-slate-700">{formatFileSize(compressedSize)}</strong>
                  {savingsPercent > 0 && (
                    <span className="text-emerald-600 font-medium"> ({savingsPercent}% smaller)</span>
                  )}
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleReset}
                    className="flex-1 sm:flex-initial px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-medium transition-colors"
                  >
                    Compress Another
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Compressed Image</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
