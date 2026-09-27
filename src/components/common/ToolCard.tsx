import React from 'react';
import { 
  FileText, Hash, Type, Calendar, Percent, ShieldCheck, QrCode, 
  Image, Maximize2, RefreshCw, FileArchive, Files, Scissors, 
  Barcode, Scale, Braces, Link, Binary, Sparkles, Mail, MessageSquare, ArrowRight,
  Eraser, ArrowUpDown, Palette, Key, Fingerprint, Clock, Code2,
  GitCompare, KeyRound, Database, AlignLeft, FileCode, ArrowRightLeft, Code
} from 'lucide-react';
import { ToolItem } from '../../types/tool';

const iconMap: Record<string, React.ElementType> = {
  FileText,
  Hash,
  Type,
  Calendar,
  Percent,
  ShieldCheck,
  QrCode,
  Image,
  Maximize2,
  RefreshCw,
  FileArchive,
  Files,
  Scissors,
  Barcode,
  Scale,
  Braces,
  Link,
  Binary,
  Sparkles,
  Mail,
  MessageSquare,
  Eraser,
  ArrowUpDown,
  Palette,
  Key,
  Fingerprint,
  Clock,
  Code2,
  GitCompare,
  KeyRound,
  Database,
  AlignLeft,
  FileCode,
  ArrowRightLeft,
  Code,
};

interface ToolCardProps {
  tool: ToolItem;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const IconComponent = iconMap[tool.iconName] || FileText;

  return (
    <a
      href={`#/tools/${tool.id}`}
      className="group relative flex flex-col justify-between p-5 bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-indigo-300 hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <div>
        {/* Header / Unboxed Metadata (Zero-Pill discipline) */}
        <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 text-indigo-600 group-hover:bg-indigo-50 group-hover:border-indigo-100 group-hover:text-indigo-700 flex items-center justify-center transition-colors">
              <IconComponent className="w-4 h-4" />
            </div>
            <span className="font-medium text-slate-600">{tool.categoryName}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            {tool.isImplemented ? (
              <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                Ready to use
              </span>
            ) : (
              <span className="text-slate-400">Architecture Preview</span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1.5 tracking-tight">
          {tool.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Footer link cue */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
        <span>{tool.isImplemented ? 'Open Tool' : 'View Specifications'}</span>
        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </a>
  );
};
