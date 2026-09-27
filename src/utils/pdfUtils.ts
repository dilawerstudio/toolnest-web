/**
 * Client-side PDF utility functions using pdf-lib and Web APIs.
 */
import { PDFDocument } from 'pdf-lib';
import { formatFileSize, downloadBlob } from './imageUtils';

export { formatFileSize, downloadBlob };

export interface ParsedPageRangeResult {
  isValid: boolean;
  pageIndices: number[]; // 0-based
  error?: string;
}

/**
 * Parses user entered page string like "1, 3, 5-8" into sorted 0-based indices.
 * @param input String with comma-separated numbers and ranges.
 * @param totalPages Total pages in the PDF document.
 */
export function parsePageRanges(input: string, totalPages: number): ParsedPageRangeResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { isValid: false, pageIndices: [], error: 'Please enter at least one page number or range.' };
  }

  const parts = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) {
    return { isValid: false, pageIndices: [], error: 'Please enter at least one page number or range.' };
  }

  const pageSet = new Set<number>();

  for (const part of parts) {
    if (part.includes('-')) {
      const rangeParts = part.split('-').map((s) => s.trim());
      if (rangeParts.length !== 2) {
        return { isValid: false, pageIndices: [], error: `Invalid range format: "${part}". Example format: 1-5` };
      }

      const start = parseInt(rangeParts[0], 10);
      const end = parseInt(rangeParts[1], 10);

      if (isNaN(start) || isNaN(end)) {
        return { isValid: false, pageIndices: [], error: `Invalid numbers in range: "${part}"` };
      }

      if (start < 1) {
        return { isValid: false, pageIndices: [], error: `Page numbers must start at 1 (found ${start})` };
      }

      if (start > totalPages || end > totalPages) {
        return {
          isValid: false,
          pageIndices: [],
          error: `Range "${part}" exceeds document length (${totalPages} pages total)`
        };
      }

      if (start > end) {
        return {
          isValid: false,
          pageIndices: [],
          error: `Start page (${start}) cannot be greater than end page (${end}) in range "${part}"`
        };
      }

      for (let p = start; p <= end; p++) {
        pageSet.add(p - 1); // 0-based
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (isNaN(pageNum)) {
        return { isValid: false, pageIndices: [], error: `Invalid page number: "${part}". Numbers only.` };
      }

      if (pageNum < 1) {
        return { isValid: false, pageIndices: [], error: `Page numbers must be 1 or higher (found ${pageNum})` };
      }

      if (pageNum > totalPages) {
        return {
          isValid: false,
          pageIndices: [],
          error: `Page ${pageNum} is out of range. Document only has ${totalPages} pages.`
        };
      }

      pageSet.add(pageNum - 1); // 0-based
    }
  }

  const sortedIndices = Array.from(pageSet).sort((a, b) => a - b);
  if (sortedIndices.length === 0) {
    return { isValid: false, pageIndices: [], error: 'No valid pages selected.' };
  }

  return { isValid: true, pageIndices: sortedIndices };
}

/**
 * Loads a PDF file as ArrayBuffer and returns the PDFDocument
 */
export async function loadPdfDocument(file: File): Promise<PDFDocument> {
  const arrayBuffer = await file.arrayBuffer();
  try {
    return await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  } catch (err: any) {
    if (err.message && err.message.toLowerCase().includes('encrypt')) {
      throw new Error('This PDF is password-protected or encrypted. Please decrypt or unlock it before processing.');
    }
    throw new Error('Could not parse this PDF. The file may be damaged or not a valid PDF document.');
  }
}
