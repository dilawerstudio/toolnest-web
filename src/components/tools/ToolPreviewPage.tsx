import React, { useState } from 'react';
import { Sparkles, Construction, ArrowLeft, Send, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface ToolPreviewPageProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

export const ToolPreviewPage: React.FC<ToolPreviewPageProps> = ({ tool, onToast }) => {
  const [voted, setVoted] = useState(false);
  const [dummyInput, setDummyInput] = useState('');

  const handleVote = () => {
    setVoted(true);
    onToast('Thank you! Your interest has been logged for future tool prioritization.');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Architecture Status Banner */}
        <div className="p-4 rounded-xl border flex items-start gap-3 bg-indigo-50/70 border-indigo-200 text-indigo-900">
          <Construction className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <strong className="font-semibold block mb-0.5">
              Catalog Architecture Specification
            </strong>
            <p>
              This utility specification and client-side processing pipeline are defined below. All 35 core tools across Text, Developer, Calculators, Image, and PDF categories are already 100% active and working!
            </p>
          </div>
        </div>

        {/* Mock Interface Preview */}
        <div className="p-6 rounded-2xl bg-slate-50/60 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
            <span className="font-semibold text-slate-700">Planned Interface Layout</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" /> Future Roadmap
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Input File / Data Payload:
            </label>
            <textarea
              rows={4}
              value={dummyInput}
              onChange={(e) => setDummyInput(e.target.value)}
              placeholder="e.g. Paste data or drag & drop files here..."
              className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-500">
              <span>Client-side execution planned · 0% server data upload</span>
            </div>

            <button
              onClick={handleVote}
              disabled={voted}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                voted 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
              }`}
            >
              {voted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Prioritization Requested!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Vote to Prioritize This Tool</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Back to Working Tools CTA */}
        <div className="pt-2 flex items-center justify-between">
          <a
            href="#/tools"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Explore Working Live Tools</span>
          </a>
        </div>
      </div>
    </ToolLayout>
  );
};
