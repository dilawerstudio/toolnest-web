import React from 'react';
import { ShieldCheck, Heart, Zap, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto text-slate-600 text-sm">
      {/* Trust Banner */}
      <div className="border-b border-slate-100 bg-slate-50/70 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">100% In-Browser Privacy</h4>
                <p className="text-xs text-slate-500">Your text and calculations never leave your device.</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Instant Execution</h4>
                <p className="text-xs text-slate-500">Zero network latency. Calculations render in real-time.</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">No Accounts or Paywalls</h4>
                <p className="text-xs text-slate-500">Free forever with zero registration requirements.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <a href="#/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                T
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">ToolNest</span>
            </a>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mb-4">
              Modern, mobile-first suite of free browser utilities for writers, students, developers, and professionals. Engineered with privacy as the core principle.
            </p>
            <div className="text-xs text-slate-400">
              <span>Running client-side JavaScript · Zero server logs</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Popular Tools</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#/tools/word-counter" className="hover:text-indigo-600 transition-colors">Word Counter</a></li>
              <li><a href="#/tools/qr-code-generator" className="hover:text-indigo-600 transition-colors">QR Code Generator</a></li>
              <li><a href="#/tools/password-generator" className="hover:text-indigo-600 transition-colors">Password Generator</a></li>
              <li><a href="#/tools/age-calculator" className="hover:text-indigo-600 transition-colors">Age Calculator</a></li>
              <li><a href="#/tools/percentage-calculator" className="hover:text-indigo-600 transition-colors">Percentage Calculator</a></li>
              <li><a href="#/tools/case-converter" className="hover:text-indigo-600 transition-colors">Case Converter</a></li>
              <li><a href="#/tools/json-formatter" className="hover:text-indigo-600 transition-colors">JSON Formatter</a></li>
              <li><a href="#/tools/unit-converter" className="hover:text-indigo-600 transition-colors">Unit Converter</a></li>
              <li><a href="#/tools/barcode-generator" className="hover:text-indigo-600 transition-colors">Barcode Generator</a></li>
              <li><a href="#/tools/image-compressor" className="hover:text-indigo-600 transition-colors">Image Compressor</a></li>
              <li><a href="#/tools/image-resizer" className="hover:text-indigo-600 transition-colors">Image Resizer</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#/tools?category=text" className="hover:text-indigo-600 transition-colors">Text Tools</a></li>
              <li><a href="#/tools?category=utility" className="hover:text-indigo-600 transition-colors">Utility & Math</a></li>
              <li><a href="#/tools?category=dev" className="hover:text-indigo-600 transition-colors">Developer Tools</a></li>
              <li><a href="#/tools?category=image" className="hover:text-indigo-600 transition-colors">Image Tools</a></li>
              <li><a href="#/tools?category=pdf" className="hover:text-indigo-600 transition-colors">PDF Tools</a></li>
              <li><a href="#/tools?category=ai" className="hover:text-indigo-600 transition-colors">AI Tools Preview</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Company & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#/about" className="hover:text-indigo-600 transition-colors">About ToolNest</a></li>
              <li><a href="#/contact" className="hover:text-indigo-600 transition-colors">Contact & Feedback</a></li>
              <li><a href="#/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
              <li><a href="#/disclaimer" className="hover:text-indigo-600 transition-colors">Disclaimer</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} ToolNest. Free and open client-side web utility.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Built with privacy & speed in mind</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
