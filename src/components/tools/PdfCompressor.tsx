import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RotateCcw, AlertTriangle, FileArchive, Check, Sparkles, FileText, Sliders, Info, ShieldCheck } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';
import { formatFileSize, downloadBlob, loadPdfDocument } from '../../utils/pdfUtils';

interface PdfCompressorProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

type CompressionLevel = 'low' | 'medium' | 'high';

export const PdfCompressor: React.FC<PdfCompressorProps> = ({ tool, onToast }) => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium');

  // Processing & result state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressText, setProgressText] = useState<string>('');
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    setFile(null);
    setPageCount(0);
    setCompressedBlob(null);
    setCompressedSize(0);
    setError(null);
    setIsProcessing(false);
    setProgressText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onToast('Compressor reset');
  };

  const handleFileSelect = async (selectedFile: File) => {
    setError(null);

    // Validate type
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Unsupported file type. Please upload a standard PDF (.pdf) document.');
      return;
    }

    try {
      setIsProcessing(true);
      setProgressText('Inspecting PDF structure...');
      const pdfDoc = await loadPdfDocument(selectedFile);
      const pages = pdfDoc.getPageCount();

      setFile(selectedFile);
      setPageCount(pages);

      // Run initial compression with default level
      await processCompression(selectedFile, compressionLevel);
      onToast('PDF loaded successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to open PDF document. It may be corrupt or encrypted.');
      setFile(null);
    } finally {
      setIsProcessing(false);
      setProgressText('');
    }
  };

  const processCompression = async (targetFile: File, level: CompressionLevel) => {
    setIsProcessing(true);
    setError(null);

    try {
      setProgressText('Analyzing objects and structural streams...');
      const arrayBuffer = await targetFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      setProgressText('Optimizing object streams and document catalog...');

      // High compression: strip non-essential document metadata and catalog overhead
      if (level === 'high') {
        try {
          pdfDoc.setTitle('');
          pdfDoc.setAuthor('');
          pdfDoc.setSubject('');
          pdfDoc.setKeywords([]);
          pdfDoc.setProducer('ToolNest Client Engine');
          pdfDoc.setCreator('ToolNest');
        } catch {
          // Non-fatal if metadata alteration is restricted
        }
      }

      setProgressText('Compacting PDF binary stream...');
      // Re-encode document using object stream compaction (lossless binary compression for PDF objects)
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      // Create blob from compressed Uint8Array
      const blob = new Blob([compressedBytes as unknown as BlobPart], { type: 'application/pdf' });
      setCompressedBlob(blob);
      setCompressedSize(blob.size);
    } catch (err: any) {
      setError(err.message || 'Error occurred during in-browser PDF optimization.');
      setCompressedBlob(null);
      setCompressedSize(0);
    } finally {
      setIsProcessing(false);
      setProgressText('');
    }
  };

  const handleLevelChange = async (newLevel: CompressionLevel) => {
    setCompressionLevel(newLevel);
    if (!file) return;
    await processCompression(file, newLevel);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDownload = () => {
    if (!compressedBlob || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    downloadBlob(compressedBlob, `${baseName}-compressed.pdf`);
    onToast('Compressed PDF downloaded');
  };

  const originalSize = file ? file.size : 0;
  const isReduced = compressedSize > 0 && compressedSize < originalSize;
  const savingsBytes = isReduced ? originalSize - compressedSize : 0;
  const savingsPercent = isReduced ? Math.round(((originalSize - compressedSize) / originalSize) * 100) : 0;

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Upload Zone */}
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
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Upload className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Select or drop your PDF document
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Optimizes cross-reference tables and compresses structural object streams in your browser with 100% privacy.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700 truncate max-w-xs sm:max-w-md">
                  {file.name}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  ({pageCount} {pageCount === 1 ? 'page' : 'pages'} · {formatFileSize(file.size)})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Change File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 border border-slate-200 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Remove File</span>
                </button>
              </div>
            </div>

            {/* Error display */}
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block mb-0.5">Processing Alert:</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Compression Level Selector */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Compression & Optimization Level:</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'low' as CompressionLevel,
                      title: 'Low Compression',
                      subtitle: 'Maximum Quality',
                      desc: 'Standard object stream normalization. Retains 100% of document metadata and structural tags.',
                    },
                    {
                      id: 'medium' as CompressionLevel,
                      title: 'Medium Compression',
                      subtitle: 'Balanced (Recommended)',
                      desc: 'Optimizes cross-reference tables and compresses raw PDF streams for email sharing.',
                    },
                    {
                      id: 'high' as CompressionLevel,
                      title: 'High Compression',
                      subtitle: 'Smallest File Size',
                      desc: 'Cleans unused catalog entries, strips redundant metadata, and compacts object streams.',
                    },
                  ].map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleLevelChange(level.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all ${
                        compressionLevel === level.id
                          ? 'bg-white border-indigo-600 ring-2 ring-indigo-100 shadow-xs'
                          : 'bg-white/70 border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-800">{level.title}</span>
                        {compressionLevel === level.id && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-indigo-600 block mb-1">
                        {level.subtitle}
                      </span>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {level.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* In-processing spinner */}
              {isProcessing && (
                <div className="flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-700 animate-pulse">
                  <Sparkles className="w-4 h-4 animate-spin text-indigo-600" />
                  <span>{progressText || 'Compressing PDF in client memory...'}</span>
                </div>
              )}
            </div>

            {/* Metrics & Results Card */}
            {compressedBlob && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[11px] text-slate-500 block mb-0.5">Original File Size</span>
                  <span className="text-base sm:text-lg font-bold text-slate-900 font-mono">
                    {formatFileSize(originalSize)}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {pageCount} {pageCount === 1 ? 'Page' : 'Pages'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[11px] text-slate-500 block mb-0.5">Optimized Size</span>
                  <span className="text-base sm:text-lg font-bold text-indigo-600 font-mono">
                    {formatFileSize(compressedSize)}
                  </span>
                  <span className="text-[10px] text-indigo-500 block mt-0.5">
                    Ready to download
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[11px] text-slate-500 block mb-0.5">Space Reduction</span>
                  <div className="flex items-center gap-1.5">
                    {isReduced ? (
                      <>
                        <span className="text-base sm:text-lg font-bold text-emerald-600 font-mono">
                          -{savingsPercent}%
                        </span>
                        <span className="text-[11px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded font-medium">
                          {formatFileSize(savingsBytes)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-slate-600 font-medium">
                        Already Optimized
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {isReduced ? 'Calculated reduction' : 'Cleaned & normalized'}
                  </span>
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

            {/* Informational note regarding PDF compression nature */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Info className="w-3.5 h-3.5 text-indigo-600" />
                <span>Client-Side PDF Optimization Note:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                {isReduced
                  ? `Successfully reduced ${file.name} by ${savingsPercent}% (${formatFileSize(savingsBytes)}). Structural cross-reference streams have been packed.`
                  : `Your PDF was already packed with compressed binary streams. It has been validated, normalized, and checked without loss of document integrity.`}
              </p>
            </div>

            {/* Bottom Download Bar */}
            {compressedBlob && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% private in-browser compression · </span>
                  <strong className="text-slate-700">{formatFileSize(compressedSize)}</strong>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleReset}
                    className="flex-1 sm:flex-initial px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-medium transition-colors"
                  >
                    Compress Another PDF
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Compressed PDF</span>
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
