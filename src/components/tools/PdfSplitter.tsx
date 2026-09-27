import React, { useState, useRef } from 'react';
import { Upload, Download, RotateCcw, AlertTriangle, Scissors, FileText, Check, Sparkles, ShieldCheck, ListOrdered, Layers, Grid } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';
import { formatFileSize, downloadBlob, loadPdfDocument, parsePageRanges } from '../../utils/pdfUtils';

interface PdfSplitterProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

type SplitMode = 'ranges' | 'every_n' | 'all_single';

interface SplitResultFile {
  id: string;
  name: string;
  pagesLabel: string;
  blob: Blob;
  size: number;
}

export const PdfSplitter: React.FC<PdfSplitterProps> = ({ tool, onToast }) => {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Settings
  const [mode, setMode] = useState<SplitMode>('ranges');
  const [rangeInput, setRangeInput] = useState<string>('1');
  const [everyNPages, setEveryNPages] = useState<number>(1);

  // Status & Output
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [splitFiles, setSplitFiles] = useState<SplitResultFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    setFile(null);
    setTotalPages(0);
    setSplitFiles([]);
    setError(null);
    setIsProcessing(false);
    setProgressMsg('');
    setRangeInput('1');
    setEveryNPages(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onToast('Splitter reset');
  };

  const handleFileSelect = async (selectedFile: File) => {
    setError(null);

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a valid PDF (.pdf) document.');
      return;
    }

    try {
      setIsProcessing(true);
      setProgressMsg('Loading PDF pages...');
      const doc = await loadPdfDocument(selectedFile);
      const count = doc.getPageCount();

      setFile(selectedFile);
      setTotalPages(count);
      setSplitFiles([]);

      // Set default reasonable range
      if (count > 1) {
        setRangeInput(`1-${Math.min(count, 3)}`);
      } else {
        setRangeInput('1');
      }

      onToast(`PDF loaded (${count} ${count === 1 ? 'page' : 'pages'})`);
    } catch (err: any) {
      setError(err.message || 'Failed to read PDF document.');
      setFile(null);
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  const handleSplit = async () => {
    if (!file || totalPages <= 0) return;
    setError(null);
    setSplitFiles([]);
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const baseName = file.name.replace(/\.pdf$/i, '');
      const results: SplitResultFile[] = [];

      if (mode === 'ranges') {
        setProgressMsg('Validating page range...');
        const parseRes = parsePageRanges(rangeInput, totalPages);
        if (!parseRes.isValid || parseRes.pageIndices.length === 0) {
          throw new Error(parseRes.error || 'Invalid page range specified.');
        }

        setProgressMsg(`Extracting ${parseRes.pageIndices.length} pages...`);
        const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const newDoc = await PDFDocument.create();

        const copied = await newDoc.copyPages(srcDoc, parseRes.pageIndices);
        for (const p of copied) {
          newDoc.addPage(p);
        }

        const bytes = await newDoc.save({ useObjectStreams: true });
        const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });

        results.push({
          id: `extracted-${Date.now()}`,
          name: `${baseName}-extracted-pages-${rangeInput.replace(/[^0-9,-]/g, '')}.pdf`,
          pagesLabel: `${parseRes.pageIndices.length} pages (${rangeInput})`,
          blob,
          size: blob.size,
        });
      } else if (mode === 'every_n') {
        const step = Math.max(1, Math.floor(everyNPages));
        setProgressMsg(`Splitting every ${step} pages...`);

        const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const totalChunks = Math.ceil(totalPages / step);

        for (let chunkIdx = 0; chunkIdx < totalChunks; chunkIdx++) {
          const startPage = chunkIdx * step;
          const endPage = Math.min(startPage + step, totalPages);
          const pageIndices: number[] = [];
          for (let p = startPage; p < endPage; p++) {
            pageIndices.push(p);
          }

          setProgressMsg(`Generating part ${chunkIdx + 1} of ${totalChunks}...`);
          const partDoc = await PDFDocument.create();
          const copied = await partDoc.copyPages(srcDoc, pageIndices);
          for (const p of copied) {
            partDoc.addPage(p);
          }

          const bytes = await partDoc.save({ useObjectStreams: true });
          const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });

          results.push({
            id: `part-${chunkIdx + 1}-${Date.now()}`,
            name: `${baseName}-part-${chunkIdx + 1}-pages-${startPage + 1}-${endPage}.pdf`,
            pagesLabel: `Pages ${startPage + 1} to ${endPage} (${pageIndices.length} ${pageIndices.length === 1 ? 'page' : 'pages'})`,
            blob,
            size: blob.size,
          });
        }
      } else if (mode === 'all_single') {
        setProgressMsg(`Splitting all ${totalPages} individual pages...`);
        const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

        for (let i = 0; i < totalPages; i++) {
          setProgressMsg(`Generating page ${i + 1} of ${totalPages}...`);
          const singleDoc = await PDFDocument.create();
          const [copiedPage] = await singleDoc.copyPages(srcDoc, [i]);
          singleDoc.addPage(copiedPage);

          const bytes = await singleDoc.save({ useObjectStreams: true });
          const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });

          results.push({
            id: `page-${i + 1}-${Date.now()}`,
            name: `${baseName}-page-${i + 1}.pdf`,
            pagesLabel: `Page ${i + 1}`,
            blob,
            size: blob.size,
          });
        }
      }

      setSplitFiles(results);
      onToast(`Generated ${results.length} split PDF ${results.length === 1 ? 'file' : 'files'}!`);
    } catch (err: any) {
      setError(err.message || 'Error occurred while splitting PDF document.');
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  const handleDownloadAll = () => {
    if (splitFiles.length === 0) return;
    splitFiles.forEach((item, index) => {
      setTimeout(() => {
        downloadBlob(item.blob, item.name);
      }, index * 300);
    });
    onToast(`Downloading all ${splitFiles.length} files`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
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
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Scissors className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Select or drop a PDF to split
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Extract custom page ranges, split every N pages, or decompose documents into single-page PDFs.
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
                  ({totalPages} {totalPages === 1 ? 'page total' : 'pages total'} · {formatFileSize(file.size)})
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
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Error display */}
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block mb-0.5">Splitter Notice:</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Split Mode Selector */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Choose Split Mode:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'ranges' as SplitMode,
                      title: 'Extract Selected Pages',
                      desc: 'Specify custom pages or intervals (e.g., 1, 3, 5-8).',
                      icon: ListOrdered,
                    },
                    {
                      id: 'every_n' as SplitMode,
                      title: 'Split Every N Pages',
                      desc: 'Divides the document into equal batches of pages.',
                      icon: Layers,
                    },
                    {
                      id: 'all_single' as SplitMode,
                      title: 'Individual Pages',
                      desc: 'Turns each single page into its own separate PDF.',
                      icon: Grid,
                    },
                  ].map((item) => {
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setMode(item.id);
                          setSplitFiles([]);
                          setError(null);
                        }}
                        className={`text-left p-3.5 rounded-xl border transition-all ${
                          mode === item.id
                            ? 'bg-white border-indigo-600 ring-2 ring-indigo-100 shadow-xs'
                            : 'bg-white/70 border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <IconComp className={`w-4 h-4 ${mode === item.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                          <span className="text-xs font-bold text-slate-800">{item.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {item.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mode Specific Controls */}
              {mode === 'ranges' && (
                <div className="pt-2 border-t border-slate-200/80">
                  <label htmlFor="range-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    Page Numbers & Ranges (Total: 1 to {totalPages}):
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Enter single pages and ranges separated by commas. Example: <code className="bg-slate-200/70 px-1 py-0.5 rounded text-indigo-700 font-mono">1, 3, 5-{Math.min(totalPages, 7)}</code>
                  </p>
                  <input
                    id="range-input"
                    type="text"
                    value={rangeInput}
                    onChange={(e) => setRangeInput(e.target.value)}
                    placeholder={`e.g. 1, 3, 5-${totalPages}`}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                  />
                </div>
              )}

              {mode === 'every_n' && (
                <div className="pt-2 border-t border-slate-200/80">
                  <label htmlFor="every-n-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    Split Into Batches Of:
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="every-n-input"
                      type="number"
                      min="1"
                      max={totalPages}
                      value={everyNPages}
                      onChange={(e) => setEveryNPages(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-32 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                    />
                    <span className="text-xs text-slate-600">
                      Pages per output file (will produce ~{Math.ceil(totalPages / Math.max(1, everyNPages))} documents)
                    </span>
                  </div>
                </div>
              )}

              {mode === 'all_single' && (
                <div className="pt-2 border-t border-slate-200/80 text-xs text-slate-600">
                  Document has <strong className="text-slate-800">{totalPages} pages</strong>. This will generate exactly <strong className="text-indigo-600">{totalPages} separate single-page PDF files</strong>.
                </div>
              )}

              {/* Action Button */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  Client-side processing · No pages are uploaded
                </span>
                <button
                  type="button"
                  onClick={handleSplit}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-40"
                >
                  {isProcessing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>{progressMsg || 'Splitting...'}</span>
                    </>
                  ) : (
                    <>
                      <Scissors className="w-4 h-4" />
                      <span>Split PDF Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated Outputs List */}
            {splitFiles.length > 0 && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800">
                      {splitFiles.length} Output {splitFiles.length === 1 ? 'Document' : 'Documents'} Generated
                    </span>
                  </div>
                  {splitFiles.length > 1 && (
                    <button
                      type="button"
                      onClick={handleDownloadAll}
                      className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download All ({splitFiles.length} files)</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2.5">
                  {splitFiles.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-800 truncate max-w-xs sm:max-w-md">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {item.pagesLabel} · {formatFileSize(item.size)}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => downloadBlob(item.blob, item.name)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-200 rounded-lg transition-colors shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
