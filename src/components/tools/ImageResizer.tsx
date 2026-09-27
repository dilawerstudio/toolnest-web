import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, RotateCcw, AlertTriangle, Lock, Unlock, Image as ImageIcon, Sliders, Check } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';
import { formatFileSize, readFileAsDataUrl, loadImage, downloadBlob } from '../../utils/imageUtils';

interface ImageResizerProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'original';

export const ImageResizer: React.FC<ImageResizerProps> = ({ tool, onToast }) => {
  const [file, setFile] = useState<File | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);

  // Resize settings
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [selectedFormat, setSelectedFormat] = useState<OutputFormat>('original');
  const [quality, setQuality] = useState<number>(90);

  // Resized result
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (resizedUrl) {
        URL.revokeObjectURL(resizedUrl);
      }
    };
  }, [resizedUrl]);

  const handleReset = () => {
    if (resizedUrl) {
      URL.revokeObjectURL(resizedUrl);
    }
    setFile(null);
    setOriginalSrc(null);
    setOrigWidth(0);
    setOrigHeight(0);
    setTargetWidth(0);
    setTargetHeight(0);
    setResizedBlob(null);
    setResizedUrl(null);
    setError(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onToast('Resizer reset');
  };

  const processFile = async (selectedFile: File) => {
    setError(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type) && !/\.(jpe?g|png|webp)$/i.test(selectedFile.name)) {
      setError('Unsupported file type. Please upload a JPG, PNG, or WebP image.');
      return;
    }

    try {
      setIsProcessing(true);
      const dataUrl = await readFileAsDataUrl(selectedFile);
      const img = await loadImage(dataUrl);

      const w = img.naturalWidth;
      const h = img.naturalHeight;

      setFile(selectedFile);
      setOriginalSrc(dataUrl);
      setOrigWidth(w);
      setOrigHeight(h);
      setTargetWidth(w);
      setTargetHeight(h);

      // Perform initial resize at 100%
      await executeResize(img, w, h, 'original', quality, selectedFile);
      onToast('Image loaded');
    } catch (err: any) {
      setError(err.message || 'Failed to load image.');
      setFile(null);
      setOriginalSrc(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const executeResize = useCallback(async (
    img: HTMLImageElement,
    w: number,
    h: number,
    formatChoice: OutputFormat,
    qVal: number,
    currFile: File
  ) => {
    if (w <= 0 || h <= 0) return;
    setIsProcessing(true);
    setError(null);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(w);
      canvas.height = Math.round(h);
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas 2D context unavailable.');

      // Determine mime type
      let mimeType = currFile.type;
      if (formatChoice !== 'original') {
        mimeType = formatChoice;
      }
      if (!mimeType) mimeType = 'image/jpeg';

      // Fill white background if converting transparent image to JPEG
      if (mimeType === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Smooth canvas downscaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), mimeType, qVal / 100);
      });

      if (!blob) throw new Error('Failed to create resized image blob.');

      if (resizedUrl) {
        URL.revokeObjectURL(resizedUrl);
      }

      const newUrl = URL.createObjectURL(blob);
      setResizedBlob(blob);
      setResizedUrl(newUrl);
    } catch (err: any) {
      setError(err.message || 'Error occurred while resizing image.');
    } finally {
      setIsProcessing(false);
    }
  }, [resizedUrl]);

  // Dimension changes
  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    if (lockAspectRatio && origWidth > 0 && val > 0) {
      const ratio = origHeight / origWidth;
      const newHeight = Math.round(val * ratio);
      setTargetHeight(newHeight);
      triggerResize(val, newHeight, selectedFormat, quality);
    } else {
      triggerResize(val, targetHeight, selectedFormat, quality);
    }
  };

  const handleHeightChange = (val: number) => {
    setTargetHeight(val);
    if (lockAspectRatio && origHeight > 0 && val > 0) {
      const ratio = origWidth / origHeight;
      const newWidth = Math.round(val * ratio);
      setTargetWidth(newWidth);
      triggerResize(newWidth, val, selectedFormat, quality);
    } else {
      triggerResize(targetWidth, val, selectedFormat, quality);
    }
  };

  const applyPresetPercentage = (pct: number) => {
    if (origWidth <= 0 || origHeight <= 0) return;
    const newW = Math.round((origWidth * pct) / 100);
    const newH = Math.round((origHeight * pct) / 100);
    setTargetWidth(newW);
    setTargetHeight(newH);
    triggerResize(newW, newH, selectedFormat, quality);
  };

  const triggerResize = async (w: number, h: number, fmt: OutputFormat, q: number) => {
    if (!originalSrc || !file || w <= 0 || h <= 0) return;
    try {
      const img = await loadImage(originalSrc);
      await executeResize(img, w, h, fmt, q, file);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleFormatChange = (fmt: OutputFormat) => {
    setSelectedFormat(fmt);
    triggerResize(targetWidth, targetHeight, fmt, quality);
  };

  const handleQualityChange = (q: number) => {
    setQuality(q);
    triggerResize(targetWidth, targetHeight, selectedFormat, q);
  };

  const handleDownload = () => {
    if (!resizedBlob || !file) return;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    let ext = 'jpg';
    if (selectedFormat === 'original') {
      const match = file.name.match(/\.([a-zA-Z0-9]+)$/);
      ext = match ? match[1].toLowerCase() : 'jpg';
    } else if (selectedFormat === 'image/png') {
      ext = 'png';
    } else if (selectedFormat === 'image/webp') {
      ext = 'webp';
    }

    downloadBlob(resizedBlob, `${baseName}-resized-${targetWidth}x${targetHeight}.${ext}`);
    onToast('Resized image downloaded');
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
              Select or drop an image to resize
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Change dimensions by exact pixels or percentage scale. Fast, private, and client-side.
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
                  ({origWidth} × {origHeight}px · {formatFileSize(file.size)})
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

            {/* Error banner */}
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block mb-0.5">Resize Error:</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Controls panel */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
              {/* Presets Row */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Quick Scale Presets:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[25, 50, 75, 100, 150, 200].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => applyPresetPercentage(pct)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        origWidth > 0 && Math.round((targetWidth / origWidth) * 100) === pct
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Exact Dimensions Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
                {/* Width */}
                <div>
                  <label htmlFor="target-width" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Width (Pixels):
                  </label>
                  <input
                    id="target-width"
                    type="number"
                    min="1"
                    max="10000"
                    value={targetWidth || ''}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                  />
                </div>

                {/* Height */}
                <div>
                  <label htmlFor="target-height" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Height (Pixels):
                  </label>
                  <input
                    id="target-height"
                    type="number"
                    min="1"
                    max="10000"
                    value={targetHeight || ''}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                  />
                </div>

                {/* Aspect Ratio Lock Toggle */}
                <div className="pb-1">
                  <button
                    type="button"
                    onClick={() => setLockAspectRatio(!lockAspectRatio)}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-colors ${
                      lockAspectRatio
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {lockAspectRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    <span>{lockAspectRatio ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}</span>
                  </button>
                </div>
              </div>

              {/* Output format and optional quality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/80">
                <div>
                  <label htmlFor="resizer-format" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Output Format:
                  </label>
                  <select
                    id="resizer-format"
                    value={selectedFormat}
                    onChange={(e) => handleFormatChange(e.target.value as OutputFormat)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs outline-none focus:border-indigo-500"
                  >
                    <option value="original">Original Format ({file.type.replace('image/', '').toUpperCase() || 'JPG'})</option>
                    <option value="image/jpeg">JPG / JPEG</option>
                    <option value="image/png">PNG</option>
                    <option value="image/webp">WebP</option>
                  </select>
                </div>

                {(selectedFormat === 'image/jpeg' || selectedFormat === 'image/webp' || (selectedFormat === 'original' && file.type === 'image/jpeg')) && (
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                      <label htmlFor="resizer-quality">JPEG/WebP Quality:</label>
                      <span className="font-mono text-indigo-600 font-bold">{quality}%</span>
                    </div>
                    <input
                      id="resizer-quality"
                      type="range"
                      min="20"
                      max="100"
                      step="5"
                      value={quality}
                      onChange={(e) => handleQualityChange(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Comparison Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[11px] text-slate-500 block mb-0.5">Original Dimensions</span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {origWidth} × {origHeight}px
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                  {formatFileSize(file.size)}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[11px] text-slate-500 block mb-0.5">Target Dimensions</span>
                <span className="text-base font-bold text-indigo-600 font-mono">
                  {targetWidth} × {targetHeight}px
                </span>
                <span className="text-[10px] text-indigo-500 block mt-0.5 font-mono">
                  {resizedBlob ? formatFileSize(resizedBlob.size) : 'Calculating...'}
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col justify-center">
                <button
                  onClick={handleDownload}
                  disabled={isProcessing || !resizedBlob}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-40"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resized</span>
                </button>
              </div>
            </div>

            {/* Resized Live Preview */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                <span>Resized Image Preview ({targetWidth} × {targetHeight}px)</span>
                {resizedBlob && (
                  <span className="text-slate-500 font-mono">{formatFileSize(resizedBlob.size)}</span>
                )}
              </div>
              <div className="w-full min-h-[220px] max-h-[440px] bg-white rounded-lg border border-slate-200/80 flex items-center justify-center p-3 overflow-hidden relative">
                {isProcessing && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-10">
                    <span className="text-xs font-semibold text-indigo-600">Resizing image...</span>
                  </div>
                )}
                {resizedUrl ? (
                  <img
                    src={resizedUrl}
                    alt="Resized output preview"
                    className="max-h-full max-w-full object-contain rounded"
                  />
                ) : (
                  <span className="text-xs text-slate-400">Rendering preview...</span>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Resized locally in browser memory without image uploads.
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleReset}
                  className="flex-1 sm:flex-initial px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-medium transition-colors"
                >
                  Resize Another
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!resizedBlob}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Resized Image</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
