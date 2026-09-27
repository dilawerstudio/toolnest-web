import React, { useState, useMemo } from 'react';
import { Copy, Check, Download, Trash2, Code2, Eye, FileText, Sparkles } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface MarkdownPreviewProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

const SAMPLE_MARKDOWN = `# Welcome to ToolNest Markdown Editor

ToolNest is a **100% free**, *client-side* online utility suite.

## Core Features
- **Privacy First**: Zero server tracking or uploads.
- **Fast Performance**: Instant client-side execution.
- **Accessible**: Built with clean, modern web standards.

### Code Example
Here is some inline \`const name = "ToolNest";\` and a block:

\`\`\`javascript
function calculateSum(a, b) {
  return a + b;
}
console.log(calculateSum(10, 20));
\`\`\`

### Blockquote
> "Simplicity is prerequisite for reliability."
> — Edsger W. Dijkstra

### Task List
- [x] Create Markdown Previewer
- [x] Verify XSS sanitization
- [ ] Add more developer utilities

### Quick Table
| Tool Name | Category | Status |
| :--- | :--- | :--- |
| Word Counter | Text Tools | Active |
| Image Resizer | Image Tools | Active |
| PDF Merger | PDF Tools | Active |

---
Enjoy building with **[ToolNest](#/)**!
`;

// Safe HTML sanitizer
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Pure client-side Markdown to sanitized HTML parser
function renderMarkdownSafely(markdown: string): string {
  if (!markdown) return '';

  // 1. Separate code blocks so their contents aren't modified by inline formatting
  const codeBlocks: string[] = [];
  let text = markdown.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const escapedCode = escapeHtml(code.trim());
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(
      `<pre class="p-3.5 my-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800"><code>${escapedCode}</code></pre>`
    );
    return placeholder;
  });

  // 2. Escape all remaining HTML entities to prevent raw HTML/XSS injection
  text = escapeHtml(text);

  // 3. Inline code
  text = text.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-slate-100 text-indigo-700 font-mono text-xs rounded border border-slate-200">$1</code>');

  // 4. Horizontal rules (--- or ***)
  text = text.replace(/^(?:---|\*\*\*|___)\s*$/gm, '<hr class="my-5 border-slate-200" />');

  // 5. Headings
  text = text.replace(/^###### (.*$)/gm, '<h6 class="text-xs font-bold text-slate-800 mt-4 mb-1">$1</h6>');
  text = text.replace(/^##### (.*$)/gm, '<h5 class="text-sm font-bold text-slate-800 mt-4 mb-1">$1</h5>');
  text = text.replace(/^#### (.*$)/gm, '<h4 class="text-base font-bold text-slate-800 mt-5 mb-1.5">$1</h4>');
  text = text.replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold text-slate-900 mt-6 mb-2">$1</h3>');
  text = text.replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-slate-900 mt-7 mb-2.5 pb-1 border-b border-slate-100">$1</h2>');
  text = text.replace(/^# (.*$)/gm, '<h1 class="text-2xl sm:text-3xl font-bold text-slate-900 mt-8 mb-3 pb-1.5 border-b border-slate-200">$1</h1>');

  // 6. Blockquotes
  text = text.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-indigo-500 pl-4 py-1 my-3 text-slate-600 italic bg-indigo-50/40 rounded-r-lg">$1</blockquote>');

  // 7. Checkboxes: - [ ] and - [x]
  text = text.replace(/^- \[x\] (.*$)/gm, '<div class="flex items-center gap-2 text-sm my-1 text-slate-700"><span class="w-4 h-4 rounded bg-indigo-600 text-white flex items-center justify-center text-[10px]">✓</span><span>$1</span></div>');
  text = text.replace(/^- \[ \] (.*$)/gm, '<div class="flex items-center gap-2 text-sm my-1 text-slate-700"><span class="w-4 h-4 rounded border border-slate-300 inline-block"></span><span>$1</span></div>');

  // 8. Unordered lists: - item or * item
  text = text.replace(/^[*-] (.*$)/gm, '<li class="ml-4 list-disc text-sm text-slate-700 my-0.5">$1</li>');

  // 9. Ordered lists: 1. item
  text = text.replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal text-sm text-slate-700 my-0.5">$1</li>');

  // 10. Tables (basic markdown tables)
  text = text.replace(/((?:\|[^\n]+\|\r?\n)+)/g, (match) => {
    const lines = match.trim().split(/\r?\n/);
    if (lines.length < 2) return match;
    const headerCols = lines[0].split('|').map((s) => s.trim()).filter(Boolean);
    // line 1 is separator | :--- | :--- |
    const bodyRows = lines.slice(2);

    let tableHtml = '<div class="overflow-x-auto my-4 rounded-xl border border-slate-200"><table class="w-full text-xs text-left text-slate-700 divide-y divide-slate-200">';
    tableHtml += '<thead class="bg-slate-50 font-bold text-slate-800"><tr>';
    for (const h of headerCols) {
      tableHtml += `<th class="px-3.5 py-2.5">${h}</th>`;
    }
    tableHtml += '</tr></thead><tbody class="divide-y divide-slate-100 bg-white">';
    for (const row of bodyRows) {
      const cols = row.split('|').map((s) => s.trim()).filter(Boolean);
      tableHtml += '<tr class="hover:bg-slate-50/50">';
      for (const col of cols) {
        tableHtml += `<td class="px-3.5 py-2">${col}</td>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table></div>';
    return tableHtml;
  });

  // 11. Bold, Italic, Strikethrough
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');
  text = text.replace(/__(.*?)__/g, '<strong class="font-bold text-slate-900">$1</strong>');
  text = text.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  text = text.replace(/_(.*?)_/g, '<em class="italic">$1</em>');
  text = text.replace(/~~(.*?)~~/g, '<del class="line-through text-slate-400">$1</del>');

  // 12. Safe Link parsing (prevent javascript: or data: URIs)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, url) => {
    const trimmedUrl = url.trim();
    const isSafe = /^(https?:\/\/|\/|#|mailto:)/i.test(trimmedUrl);
    if (!isSafe) {
      return `<span>${label}</span>`;
    }
    return `<a href="${trimmedUrl}" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 underline font-medium">${label}</a>`;
  });

  // 13. Paragraphs and line breaks
  text = text.replace(/\n\n+/g, '</p><p class="my-3 text-sm text-slate-700 leading-relaxed">');

  // 14. Restore code blocks
  codeBlocks.forEach((blockHtml, idx) => {
    text = text.replace(`__CODE_BLOCK_${idx}__`, blockHtml);
  });

  return `<div class="prose max-w-none"><p class="my-2 text-sm text-slate-700 leading-relaxed">${text}</p></div>`;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ tool, onToast }) => {
  const [markdown, setMarkdown] = useState<string>(SAMPLE_MARKDOWN);
  const [viewTab, setViewTab] = useState<'split' | 'editor' | 'preview'>('split');
  const [copiedMd, setCopiedMd] = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);

  // Compute safe HTML output
  const renderedHtml = useMemo(() => {
    return renderMarkdownSafely(markdown);
  }, [markdown]);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
    onToast('Markdown copied to clipboard');
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(renderedHtml);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
    onToast('Sanitized HTML copied to clipboard');
  };

  const handleDownloadMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    onToast('Downloaded .md document');
  };

  const handleClear = () => {
    setMarkdown('');
    onToast('Cleared editor');
  };

  const handleLoadSample = () => {
    setMarkdown(SAMPLE_MARKDOWN);
    onToast('Loaded sample markdown');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-slate-700">Live Markdown Editor & Previewer</span>
          </div>

          <div className="flex items-center gap-2">
            {/* View layout toggle for mobile/desktop */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
              <button
                onClick={() => setViewTab('editor')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  viewTab === 'editor' ? 'bg-white text-indigo-700 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setViewTab('split')}
                className={`hidden md:block px-2.5 py-1 rounded-md transition-all ${
                  viewTab === 'split' ? 'bg-white text-indigo-700 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                Split View
              </button>
              <button
                onClick={() => setViewTab('preview')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  viewTab === 'preview' ? 'bg-white text-indigo-700 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                Preview
              </button>
            </div>

            <button
              onClick={handleLoadSample}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Load Sample
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 border border-slate-200 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Editor and Preview Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Editor Pane */}
          {(viewTab === 'split' || viewTab === 'editor') && (
            <div className={`flex flex-col space-y-2 ${viewTab === 'editor' ? 'md:col-span-2' : ''}`}>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <label htmlFor="markdown-editor-input" className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Markdown Source:</span>
                </label>
                <span className="text-slate-400 font-mono text-[11px]">
                  {markdown.length} chars · {markdown ? markdown.split(/\r\n|\r|\n/).length : 0} lines
                </span>
              </div>
              <textarea
                id="markdown-editor-input"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Type or paste Markdown here..."
                rows={18}
                className="w-full p-4 font-mono text-xs sm:text-sm text-slate-900 bg-slate-50/70 rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 resize-y leading-relaxed"
              />
            </div>
          )}

          {/* Live Preview Pane */}
          {(viewTab === 'split' || viewTab === 'preview') && (
            <div className={`flex flex-col space-y-2 ${viewTab === 'preview' ? 'md:col-span-2' : ''}`}>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5 text-indigo-700">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Safe Rendered Preview:</span>
                </span>
                <span className="text-emerald-600 text-[11px] font-medium">
                  ✓ XSS Sanitized
                </span>
              </div>
              <div
                className="w-full p-5 bg-white rounded-xl border border-slate-200 min-h-[380px] max-h-[580px] overflow-y-auto leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            Rendered client-side with zero script execution risk
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadMd}
              disabled={!markdown}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-medium transition-colors disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .md</span>
            </button>
            <button
              onClick={handleCopyHtml}
              disabled={!markdown}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-medium transition-colors disabled:opacity-40"
            >
              {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Code2 className="w-3.5 h-3.5" />}
              <span>{copiedHtml ? 'Copied HTML!' : 'Copy HTML'}</span>
            </button>
            <button
              onClick={handleCopyMarkdown}
              disabled={!markdown}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-40"
            >
              {copiedMd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMd ? 'Copied!' : 'Copy Markdown'}</span>
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
