import React, { useState } from 'react';
import { 
  Search, ShieldCheck, Zap, Lock, Sparkles, ArrowRight, HelpCircle, 
  FileText, QrCode, Key, Calendar, Percent, Type, Hash, CheckCircle2 
} from 'lucide-react';
import { TOOLS } from '../../data/tools';
import { ToolCard } from '../common/ToolCard';
import { AdContainer } from '../common/AdContainer';

interface HomePageProps {
  onOpenSearch: () => void;
  onSelectCategory: (cat: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenSearch, onSelectCategory }) => {
  // Curated 6 popular tools across different categories for the Featured section
  const featuredToolIds = [
    'word-counter',
    'qr-code-generator',
    'password-generator',
    'image-compressor',
    'pdf-merger',
    'json-formatter'
  ];
  const featuredTools = TOOLS.filter((t) => featuredToolIds.includes(t.id));

  const textTools = TOOLS.filter((t) => t.category === 'text');
  const utilityTools = TOOLS.filter((t) => t.category === 'utility');
  const devTools = TOOLS.filter((t) => t.category === 'dev');
  const imageTools = TOOLS.filter((t) => t.category === 'image');
  const pdfTools = TOOLS.filter((t) => t.category === 'pdf');

  const faqs = [
    {
      q: 'Are ToolNest tools really 100% free?',
      a: 'Yes. All tools on ToolNest are completely free to use without subscriptions, hidden fees, or credit card requirements. The platform is designed to operate at $0 server cost using client-side JavaScript execution.'
    },
    {
      q: 'Is my data or text uploaded to a server?',
      a: 'No. Every calculation, word count, password generation, and QR code rendering executes directly in your browser’s local JavaScript sandbox. Your data never touches a remote server or database.'
    },
    {
      q: 'Do I need to create an account to use the tools?',
      a: 'No accounts, logins, or personal details are required. Simply open any tool and start using it instantly.'
    },
    {
      q: 'Can I use ToolNest on my smartphone or tablet?',
      a: 'Absolutely. ToolNest is engineered with a mobile-first architecture that works seamlessly across iOS, Android, tablets, laptops, and large desktop screens.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 border-b border-slate-200/80 pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Subtle text trust marker (Zero-pill discipline: unboxed clean text) */}
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 mb-4">
            <span className="text-indigo-600 font-semibold">ToolNest Utilities</span>
            <span aria-hidden="true">·</span>
            <span>100% Client-Side</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Zero Server Storage
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight text-balance">
            Fast, Free & Privacy-First <br className="hidden sm:inline" />
            <span className="text-indigo-600">Online Browser Utilities</span>
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Essential text counters, QR generators, strong password creators, and everyday calculators running directly on your device. No signups, no data uploads, and zero fees.
          </p>

          {/* Search Bar Input */}
          <div className="mt-8 max-w-xl mx-auto">
            <div
              onClick={onOpenSearch}
              className="group relative flex items-center w-full px-4 py-3.5 bg-white rounded-2xl border border-slate-300 shadow-md hover:border-indigo-400 hover:shadow-lg transition-all cursor-pointer text-left"
            >
              <Search className="w-5 h-5 text-slate-400 mr-3 group-hover:text-indigo-600 transition-colors" />
              <span className="text-sm text-slate-400 flex-1">
                Search tools (e.g. "compress", "QR", "word counter", "password")...
              </span>
              <kbd className="hidden sm:inline-block px-2 py-1 text-[11px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded-md">
                /
              </kbd>
            </div>

            {/* Quick Keyword Links */}
            <div className="mt-3 flex items-center justify-center gap-2 flex-wrap text-xs text-slate-500">
              <span className="text-slate-400">Quick Jump:</span>
              <a href="#/tools/word-counter" className="hover:text-indigo-600 transition-colors">Word Counter</a>
              <span>·</span>
              <a href="#/tools/qr-code-generator" className="hover:text-indigo-600 transition-colors">QR Code</a>
              <span>·</span>
              <a href="#/tools/password-generator" className="hover:text-indigo-600 transition-colors">Password</a>
              <span>·</span>
              <a href="#/tools/age-calculator" className="hover:text-indigo-600 transition-colors">Age Calculator</a>
              <span>·</span>
              <a href="#/tools/percentage-calculator" className="hover:text-indigo-600 transition-colors">Percentage</a>
              <span>·</span>
              <a href="#/tools/json-formatter" className="hover:text-indigo-600 transition-colors">JSON Formatter</a>
              <span>·</span>
              <a href="#/tools/regex-tester" className="hover:text-indigo-600 transition-colors">Regex Tester</a>
              <span>·</span>
              <a href="#/tools/json-diff" className="hover:text-indigo-600 transition-colors">JSON Diff</a>
              <span>·</span>
              <a href="#/tools/jwt-decoder" className="hover:text-indigo-600 transition-colors">JWT Decoder</a>
              <span>·</span>
              <a href="#/tools/sql-formatter" className="hover:text-indigo-600 transition-colors">SQL Formatter</a>
              <span>·</span>
              <a href="#/tools/image-compressor" className="hover:text-indigo-600 transition-colors">Image Compressor</a>
              <span>·</span>
              <a href="#/tools/pdf-merger" className="hover:text-indigo-600 transition-colors">PDF Merger</a>
              <span>·</span>
              <a href="#/tools/unit-converter" className="hover:text-indigo-600 transition-colors">Unit Converter</a>
              <span>·</span>
              <a href="#/tools/uuid-generator" className="hover:text-indigo-600 transition-colors">UUID Generator</a>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Placement: Top Responsive Leaderboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <AdContainer format="horizontal" />
      </div>

      {/* Section 1: Popular & Ready Tools */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-slate-200">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
                Featured Utilities
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Popular Working Tools
              </h2>
            </div>
            <a
              href="#/tools"
              className="mt-2 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              <span>View All 35 Utilities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Text Tools Section */}
      <section className="py-12 bg-slate-50/70 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs text-slate-500 font-medium">Text Manipulation & Analysis</span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Text Tools</h2>
            </div>
            <a href="#/tools?category=text" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              Browse All 5 Text Tools →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {textTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Utility & Calculator Tools Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs text-slate-500 font-medium">Everyday Math, Codes & Security</span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Utility Tools & Calculators</h2>
            </div>
            <a href="#/tools?category=utility" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              Browse All 5 Calculators →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {utilityTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Developer Tools Section */}
      <section className="py-12 bg-slate-50/70 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs text-slate-500 font-medium">Formatting, Diff, Encoders & Testing</span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Developer Tools</h2>
            </div>
            <a href="#/tools?category=dev" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              Browse All 18 Dev Tools →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {devTools.slice(0, 6).map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <a
              href="#/tools?category=dev"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-300 shadow-xs transition-all"
            >
              <span>Explore All 18 Developer Utilities (Regex, JSON Diff, JWT, SQL & More)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Section 5: Image & PDF Tools Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Image Tools */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Raster & Format Optimization</span>
                  <h3 className="text-xl font-bold text-slate-900">Image Tools</h3>
                </div>
                <a href="#/tools?category=image" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                  View All (4) →
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {imageTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>

            {/* PDF Tools */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Document Assembly & Compression</span>
                  <h3 className="text-xl font-bold text-slate-900">PDF Tools</h3>
                </div>
                <a href="#/tools?category=pdf" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                  View All (3) →
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pdfTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: "Why Use ToolNest?" Value Section */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1 block">
              Core Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Why Use Our Tools?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Engineered from the ground up for privacy, speed, and transparent zero-cost utility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">100% In-Browser Privacy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculations execute in your browser's local sandbox. Your confidential text, files, and credentials never travel over the internet.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Instant Zero-Latency Speed</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No server queuing, cold starts, or upload delays. Results compute in milliseconds as you type or adjust parameters.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">$0 Budget & No Accounts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No subscription paywalls, no required registrations, and no credit card prompts. Truly free utility tools for everyone.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Mobile-First Accessibility</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fully responsive UI crafted to feel natural on smartphones, tablets, and desktops with high WCAG contrast standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: FAQ Section */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1 block">
              Common Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200">
                <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-2 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Placement: Bottom Leaderboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6">
        <AdContainer format="horizontal" />
      </div>
    </div>
  );
};
