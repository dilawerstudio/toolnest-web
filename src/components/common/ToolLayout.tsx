import React from 'react';
import { ShieldCheck, ChevronRight, HelpCircle, Check, Sparkles, ArrowRight } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { TOOLS } from '../../data/tools';
import { AdContainer } from './AdContainer';

interface ToolLayoutProps {
  tool: ToolItem;
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ tool, children }) => {
  const relatedTools = TOOLS.filter((t) => tool.relatedToolIds.includes(t.id));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <a href="#/" className="hover:text-slate-900 transition-colors">Home</a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <a href={`#/tools?category=${tool.category}`} className="hover:text-slate-900 transition-colors">
          {tool.categoryName}
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-medium text-slate-900 truncate">{tool.name}</span>
      </nav>

      {/* Tool Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
          <span className="font-semibold text-indigo-600">{tool.categoryName}</span>
          <span aria-hidden="true">·</span>
          <span>100% Free Utility</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Client-Side Only
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
          {tool.name}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          {tool.description}
        </p>

        {tool.statusNote && (
          <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{tool.statusNote}</span>
          </div>
        )}
      </div>

      {/* Main Tool Interface Container */}
      <section aria-label={`${tool.name} interactive interface`} className="mb-10">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </section>

      {/* Privacy Guarantee Callout */}
      <div className="my-8 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <strong className="font-semibold text-slate-900 block mb-0.5">Privacy First Guarantee:</strong>
          All operations performed by this {tool.name} execute exclusively in your browser’s JavaScript engine.
          No inputs, documents, text snippets, or calculation parameters are transferred to external cloud servers or stored in any database.
        </div>
      </div>

      {/* Non-intrusive AdSense Slot 1 (Horizontal Leaderboard) */}
      <AdContainer format="horizontal" className="my-10" />

      {/* How to Use Section */}
      {tool.howToUse && tool.howToUse.length > 0 && (
        <section aria-labelledby="how-to-use-heading" className="mb-12">
          <h2 id="how-to-use-heading" className="text-xl font-bold text-slate-900 mb-4">
            How to Use {tool.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tool.howToUse.map((step, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200/90 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features Section */}
      {tool.features && tool.features.length > 0 && (
        <section aria-labelledby="features-heading" className="mb-12">
          <h2 id="features-heading" className="text-xl font-bold text-slate-900 mb-4">
            Key Features & Benefits
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tool.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-slate-200/80">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-700">{feat}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {tool.faqs && tool.faqs.length > 0 && (
        <section aria-labelledby="faq-heading" className="mb-12">
          <h2 id="faq-heading" className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <span>Frequently Asked Questions</span>
          </h2>
          <div className="space-y-3">
            {tool.faqs.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{faq.question}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section aria-labelledby="related-tools-heading" className="border-t border-slate-200 pt-8 mt-12">
          <h2 id="related-tools-heading" className="text-xl font-bold text-slate-900 mb-4">
            Related Tools You May Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTools.map((relTool) => (
              <a
                key={relTool.id}
                href={`#/tools/${relTool.id}`}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition-all group"
              >
                <div className="text-[11px] text-slate-500 mb-1">{relTool.categoryName}</div>
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">
                  {relTool.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">{relTool.description}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-indigo-600">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
