import React, { useState, useRef } from 'react';
import { Upload, Download, ArrowUp, ArrowDown, Trash2, RotateCcw, AlertTriangle, Files, FileText, Check, Plus, ShieldCheck, Sparkles } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';
import { formatFileSize, downloadBlob, loadPdfDocument } from '../../utils/pdfUtils';

interface PdfMergerProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

interface PdfFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
}

export const PdfMerger: React.FC<PdfMergerProps> = ({ tool, onToast }) => {
  const [pdfList, setPdfList] = useState<PdfFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const [mergedStats, setMergedStats] = useState<{ totalPages: number; totalSize: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddFiles = async (files: FileList | File[]) => {
    setError(null);
    const newItems: PdfFileItem[] = [];

    setIsProcessing(true);
    setProgressMsg('Inspecting PDF files...');

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
        setError(`Skipped "${f.name}": Only PDF documents are supported.`);
        continue;
      }

      try {
        const doc = await loadPdfDocument(f);
        const count = doc.getPageCount();
        newItems.push({
          id: `${f.name}-${f.size}-${Date.now()}-${Math.random()}`,
          file: f,
          name: f.name,
          size: f.size,
          pageCount: count,
        });
      } catch (err: any) {
        setError(`Failed to read "${f.name}": ${err.message || 'File is encrypted or corrupt.'}`);
      }
    }

    setIsProcessing(false);
    setProgressMsg('');

    if (newItems.length > 0) {
      setPdfList((prev) => [...prev, ...newItems]);
      // Invalidate existing merged result when new files are added
      setMergedBlob(null);
      setMergedStats(null);
      onToast(`Added ${newItems.length} PDF ${newItems.length === 1 ? 'document' : 'documents'}`);
    }
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    setPdfList((prev) => {
      const clone = [...prev];
      const temp = clone[index - 1];
      clone[index - 1] = clone[index];
      clone[index] = temp;
      return clone;
    });
    setMergedBlob(null);
  };

  const moveDown = (index: number) => {
    if (index >= pdfList.length - 1) return;
    setPdfList((prev) => {
      const clone = [...prev];
      const temp = clone[index + 1];
      clone[index + 1] = clone[index];
      clone[index] = temp;
      return clone;
    });
    setMergedBlob(null);
  };

  const removeItem = (id: string) => {
    setPdfList((prev) => prev.filter((item) => item.id !== id));
    setMergedBlob(null);
    setMergedStats(null);
    onToast('Document removed');
  };

  const handleClearAll = () => {
    setPdfList([]);
    setMergedBlob(null);
    setMergedStats(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onToast('List cleared');
  };

  const handleMerge = async () => {
    if (pdfList.length < 2) {
      setError('Please add at least 2 PDF documents to merge.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      setProgressMsg('Initializing master PDF document...');
      const mergedPdf = await PDFDocument.create();
      let totalPagesAdded = 0;

      for (let i = 0; i < pdfList.length; i++) {
        const item = pdfList[i];
        setProgressMsg(`Merging ${i + 1} of ${pdfList.length}: ${item.name}...`);

        const arrayBuffer = await item.file.arrayBuffer();
        const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const pageIndices = srcDoc.getPageIndices();

        const copiedPages = await mergedPdf.copyPages(srcDoc, pageIndices);
        for (const page of copiedPages) {
          mergedPdf.addPage(page);
          totalPagesAdded++;
        }
      }

      setProgressMsg('Compiling finalized merged PDF...');
      const mergedBytes = await mergedPdf.save({ useObjectStreams: true });
      const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });

      setMergedBlob(blob);
      setMergedStats({
        totalPages: totalPagesAdded,
        totalSize: blob.size,
      });
      onToast(`Successfully merged ${pdfList.length} documents into 1 PDF!`);
    } catch (err: any) {
      setError(err.message || 'Error occurred while merging PDFs. Check if any file is corrupted or password-protected.');
      setMergedBlob(null);
      setMergedStats(null);
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  const handleDownload = () => {
    if (!mergedBlob) return;
    const firstTitle = pdfList[0]?.name.replace(/\.pdf$/i, '') || 'documents';
    downloadBlob(mergedBlob, `${firstTitle}-merged.pdf`);
    onToast('Merged PDF downloaded');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAddFiles(e.dataTransfer.files);
    }
  };

  const totalInputPages = pdfList.reduce((acc, curr) => acc + curr.pageCount, 0);
  const totalInputSize = pdfList.reduce((acc, curr) => acc + curr.size, 0);

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleAddFiles(e.target.files);
            }
          }}
        />

        {/* Upload Zone / Drop Area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/60'
              : 'border-slate-300 hover:border-indigo-400 bg-slate-50/60 hover:bg-slate-50'
          }`}
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-1">
            {pdfList.length === 0 ? 'Select or drop multiple PDFs to merge' : 'Add more PDF files'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Choose 2 or more PDF documents. Files are joined in the exact order shown below.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">Merger Notice:</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Document List */}
        {pdfList.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">
                  {pdfList.length} {pdfList.length === 1 ? 'Document' : 'Documents'} in Queue
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  (Total: {totalInputPages} pages · {formatFileSize(totalInputSize)})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add More</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 border border-slate-200 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>

            {/* Draggable/Reorderable cards */}
            <div className="space-y-2.5">
              {pdfList.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </div>
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800 truncate max-w-xs sm:max-w-md">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'} · {formatFileSize(item.size)}
                      </div>
                    </div>
                  </div>

                  {/* Reordering and removal controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      title="Move Up"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(index)}
                      disabled={index === pdfList.length - 1}
                      title="Move Down"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      title="Remove"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Merge Action Row */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                {pdfList.length < 2 ? (
                  <span className="text-amber-700 font-medium">
                    ⚠️ Please add at least one more PDF to enable merging.
                  </span>
                ) : (
                  <span>
                    Ready to assemble <strong>{pdfList.length} documents</strong> into 1 continuous PDF.
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleMerge}
                disabled={isProcessing || pdfList.length < 2}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-40"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Merging In Memory...</span>
                  </>
                ) : (
                  <>
                    <Files className="w-4 h-4" />
                    <span>Merge PDFs Now</span>
                  </>
                )}
              </button>
            </div>

            {/* Processing banner */}
            {isProcessing && (
              <div className="flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-700 animate-pulse">
                <Sparkles className="w-4 h-4 animate-spin text-indigo-600" />
                <span>{progressMsg || 'Processing PDF documents...'}</span>
              </div>
            )}

            {/* Merged Result Card */}
            {mergedBlob && mergedStats && (
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-950">Merged Document Ready</h4>
                      <p className="text-xs text-emerald-700">
                        {mergedStats.totalPages} total pages · {formatFileSize(mergedStats.totalSize)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Merged PDF</span>
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
