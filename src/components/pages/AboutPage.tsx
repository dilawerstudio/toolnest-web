import React from 'react';
import { ShieldCheck, Zap, DollarSign, Globe, Code2, Heart } from 'lucide-react';
import { AdContainer } from '../common/AdContainer';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 block mb-1">
          About ToolNest
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Utility Computing for Everyone
        </h1>
        <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          ToolNest was created with a straightforward mission: build fast, completely free online utilities that execute locally in your web browser with zero privacy compromises.
        </p>
      </div>

      <div className="space-y-8 text-slate-700 text-sm leading-relaxed">
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            <span>The $0 Barrier & Zero-Cost Architecture</span>
          </h2>
          <p className="mb-3">
            Most online utility sites today are cluttered with invasive popups, mandatory subscriptions, and paywalled basic calculators. We believe essential computational tools—like word counters, password generators, and percentage solvers—should be universally accessible to anyone with an internet connection.
          </p>
          <p>
            By designing ToolNest to run entirely within the user's browser via client-side HTML5, CSS3, and modern TypeScript/JavaScript, we eliminate hefty server compute costs. This allows us to keep the site 100% free forever without requiring paid subscriptions.
          </p>
        </section>

        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Privacy as a Fundamental Architecture</span>
          </h2>
          <p className="mb-3">
            When you paste a draft essay into our Word Counter, or calculate an age from a birth date, your data is processed solely inside your device's memory. We do not store, inspect, log, or transmit your confidential work to any remote server or third-party database.
          </p>
          <p>
            Once you close your browser tab, your inputs are instantly wiped from temporary memory.
          </p>
        </section>

        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-violet-600" />
            <span>Roadmap & Ongoing Development</span>
          </h2>
          <p className="mb-3">
            In our initial phase, we have brought 7 core working utilities to full maturity: Word Counter, Character Counter, Case Converter, Age Calculator, Percentage Calculator, Password Generator, and QR Code Generator.
          </p>
          <p>
            Our catalog architecture outlines the next wave of client-side image compressors, PDF processors, developer tools, and zero-cost AI integrations. We listen closely to community feedback to prioritize tools that bring the highest daily utility.
          </p>
        </section>
      </div>

      <AdContainer format="horizontal" className="my-10" />
    </div>
  );
};
