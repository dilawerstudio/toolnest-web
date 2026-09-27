import React, { useState, useMemo } from 'react';
import { Search, X, LayoutGrid, FileText, Calculator, Code2, Image as ImageIcon, Files } from 'lucide-react';
import { TOOLS, CATEGORIES } from '../../data/tools';
import { ToolCard } from '../common/ToolCard';
import { AdContainer } from '../common/AdContainer';

const categoryIconMap: Record<string, React.ElementType> = {
  all: LayoutGrid,
  text: FileText,
  utility: Calculator,
  dev: Code2,
  image: ImageIcon,
  pdf: Files,
};

interface AllToolsPageProps {
  initialCategory?: string;
}

export const AllToolsPage: React.FC<AllToolsPageProps> = ({ initialCategory }) => {
  const [selectedCat, setSelectedCat] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCat(initialCategory);
    }
  }, [initialCategory]);

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesCategory = selectedCat === 'all' || tool.category === selectedCat;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesQuery =
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.categoryName.toLowerCase().includes(q) ||
        tool.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [selectedCat, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
          All Utility Tools & Calculators
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Browse our complete catalog of browser-based utilities. Select a category or search for specific tools.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 mb-8">
        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter tools by keyword (e.g. word, QR, password)..."
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600"
              aria-label="Clear filter"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Tabs (Interactive buttons) */}
        <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100/90 rounded-xl border border-slate-200/60">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCat === cat.id;
            const Icon = categoryIconMap[cat.id] || LayoutGrid;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Grid */}
      {filteredTools.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-base font-semibold text-slate-800">No tools found</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting your filter or searching for another term.</p>
          <button
            onClick={() => {
              setSelectedCat('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}

      {/* Non-intrusive AdSense Slot */}
      <AdContainer format="horizontal" className="mt-12" />
    </div>
  );
};
