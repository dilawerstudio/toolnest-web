import React from 'react';

interface AdContainerProps {
  format?: 'horizontal' | 'rectangle';
  className?: string;
}

export const AdContainer: React.FC<AdContainerProps> = ({ format = 'horizontal', className = '' }) => {
  return (
    <aside
      aria-label="Advertisement placeholder"
      className={`relative rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-center my-6 flex flex-col items-center justify-center transition-colors hover:border-slate-300 ${className}`}
    >
      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-1">
        Advertisement (Reserved Placement)
      </span>
      {format === 'horizontal' ? (
        <div className="w-full max-w-[728px] h-[90px] max-h-[90px] border border-slate-200/80 rounded bg-white/70 flex items-center justify-center text-xs text-slate-400">
          <span>728 × 90 Responsive Ad Unit Slot</span>
        </div>
      ) : (
        <div className="w-[300px] h-[250px] border border-slate-200/80 rounded bg-white/70 flex items-center justify-center text-xs text-slate-400">
          <span>300 × 250 Medium Rectangle Ad Unit Slot</span>
        </div>
      )}
      <span className="text-[10px] text-slate-400 mt-1">
        Non-intrusive AdSense-ready container · Does not track user activity
      </span>
    </aside>
  );
};
