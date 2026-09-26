import React from 'react';
import { AlertCircle } from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 block mb-1">
          Important Notice
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Disclaimer
        </h1>
        <p className="text-xs text-slate-500 mt-1">Last Updated: September 2026</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 text-slate-700 text-sm leading-relaxed space-y-6">
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block mb-0.5">General Informational and Utility Purposes:</strong>
            The tools, calculators, generators, and data provided on ToolNest are offered solely for general utility, productivity, and convenience.
          </div>
        </div>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">1. Mathematical & Calculation Accuracy</h2>
          <p>
            While we strive for precision in our calculators (such as the Age Calculator, Percentage Calculator, and Character Metrics), rounding differences, calendar quirks, or regional conventions may produce variations. Users should independently verify critical calculations prior to making financial, legal, medical, or contractual commitments.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">2. Security & Passwords</h2>
          <p>
            Our Password Generator utilizes standard browser Web Cryptography APIs (<code>window.crypto.getRandomValues</code>) to generate pseudorandom strings. While cryptographically sound, ToolNest does not guarantee absolute immunity against social engineering, keyloggers, or unauthorized access. Users are solely responsible for securely storing their credentials in an authorized password manager.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">3. No Professional Advice</h2>
          <p>
            The content and tools on ToolNest do not constitute legal, tax, financial, or security advice. Always consult a certified professional for guidance regarding specific legal or financial matters.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-2">4. Third-Party Advertising & Affiliates</h2>
          <p>
            ToolNest may feature advertisements, sponsored listings, or affiliate links to offset operational costs. We are not responsible for the products, guarantees, or claims made by external advertisers.
          </p>
        </section>
      </div>
    </div>
  );
};
