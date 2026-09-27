import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, RotateCcw, AlertTriangle, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';
import { formatFileSize, readFileAsDataUrl, loadImage, downloadBlob } from '../../utils/imageUtils';

interface JpgToPngProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

export const JpgToPng: React.FC<JpgToPngProps> = ({ tool, onToast }) => {
  const [file, setFile] = useState<File | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  // Converted PNG state
  const [pngBlob, setPngBlob] = useState<Blob | null>(null);
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (pngUrl) {
        URL.revokeObjectURL(pngUrl);
      }
    };
  }, [pngUrl]);

  const handleReset = () => {
    if (pngUrl) {
      URL.revokeObjectURL(pngUrl);
    }
    setFile(null);
    setOriginalSrc(null);
    setDimensions(null);
    setPngBlob(null);
    setPngUrl(null);
    setError(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onToast('Converter reset');
  };

  const processFile = async (selectedFile: File) => {
    setError(null);

    const validExtensions = /\.(jpe?g|webp|bmp|gif)$/i;
    if (!selectedFile.type.includes('jpeg') && !selectedFile.type.includes('jpg') && !validExtensions.test(selectedFile.name)) {
      onToast('Notice: Converting uploaded image into PNG format');
    }

    try {
      setIsProcessing(true);
      const dataUrl = await readFileAsDataUrl(selectedFile);
      const img = await loadImage(dataUrl);

      const w = img.naturalWidth;
      const h = img.naturalHeight;

      setFile(selectedFile);
      setOriginalSrc(dataUrl);
      setDimensions({ width: w, height: h });

      await convertToPng(img, w, h);
      onToast('Image loaded and converted to PNG');
    } catch (err: any) {
      setError(err.message || 'Failed to read image file.');
      setFile(null);
      setOriginalSrc(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const convertToPng = useCallback(async (img: HTMLImageElement, width: number, height: number) => {
    setIsProcessing(true);
    setError(null);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas 2D context unavailable.');

      // Draw JPEG directly to canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Export as lossless PNG
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/png');
      });

      if (!blob) throw new Error('Browser PNG encoding failed.');

      if (pngUrl) {
        URL.revokeObjectURL(pngUrl);
      }

      const newUrl = URL.createObjectURL(blob);
      setPngBlob(blob);
      setPngUrl(newUrl);
    } catch (err: any) {
      setError(err.message || 'Error occurred during PNG conversion.');
    } finally {
      setIsProcessing(false);
    }
  }, [pngUrl]);

  const handleDownload = () => {
    if (!pngBlob || !file) return;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    downloadBlob(pngBlob, `${baseName}.png`);
    onToast('PNG image downloaded');
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
              accept="image/jpeg,image/jpg,image/webp,image/*"
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
              Select or drop a JPG/JPEG image to convert to PNG
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Lossless client-side re-encoding into PNG format. Preserves original dimensions without server processing.
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
                  accept="image/jpeg,image/jpg,image/webp,image/*"
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

            {/* Conversion Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[11px] text-slate-500 block mb-0.5">Source JPG</span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {formatFileSize(file.size)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                  {dimensions?.width} × {dimensions?.height}px
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[11px] text-slate-500 block mb-0.5">Converted PNG</span>
                <span className="text-base font-bold text-indigo-600 font-mono">
                  {pngBlob ? formatFileSize(pngBlob.size) : 'Converting...'}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                  Lossless 24-bit PNG
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col justify-center">
                <button
                  onClick={handleDownload}
                  disabled={isProcessing || !pngBlob}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-40"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PNG</span>
                </button>
              </div>
            </div>

            {/* Side-by-side Visual Previews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                  <span>Source Image (JPG)</span>
                  <span className="text-slate-400 font-mono">{formatFileSize(file.size)}</span>
                </div>
                <div className="flex-1 min-h-[220px] max-h-[380px] bg-white rounded-lg border border-slate-200/80 flex items-center justify-center p-2 overflow-hidden">
                  {originalSrc && (
                    <img
                      src={originalSrc}
                      alt="Source JPG preview"
                      className="max-h-full max-w-full object-contain rounded"
                    />
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                  <span className="text-indigo-700">Converted PNG Output</span>
                  <span className="text-indigo-600 font-mono font-bold">
                    {pngBlob ? formatFileSize(pngBlob.size) : 'Processing...'}
                  </span>
                </div>
                <div className="flex-1 min-h-[220px] max-h-[380px] bg-white rounded-lg border border-slate-200/80 flex items-center justify-center p-2 overflow-hidden relative">
                  {isProcessing && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-10">
                      <span className="text-xs font-semibold text-indigo-600">Encoding PNG...</span>
                    </div>
                  )}
                  {pngUrl ? (
                    <img
                      src={pngUrl}
                      alt="Converted PNG preview"
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
                100% private in-browser conversion. Zero server logs or data retention.
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
                  disabled={!pngBlob}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG Image</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
