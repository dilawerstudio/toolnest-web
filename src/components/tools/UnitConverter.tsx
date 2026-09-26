import React, { useState, useMemo } from 'react';
import { Copy, Trash2, Check, ArrowRightLeft, Scale, Ruler, Thermometer, Box, Gauge, Clock, Database, Layers } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface UnitConverterProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

interface UnitDef {
  id: string;
  name: string;
  symbol: string;
  ratioToBase: number; // For non-temperature: valueInBase = value * ratioToBase
}

interface CategoryDef {
  id: string;
  name: string;
  icon: React.ElementType;
  baseUnit: string;
  units: UnitDef[];
}

const CATEGORIES: CategoryDef[] = [
  {
    id: 'length',
    name: 'Length',
    icon: Ruler,
    baseUnit: 'm',
    units: [
      { id: 'm', name: 'Meters', symbol: 'm', ratioToBase: 1 },
      { id: 'km', name: 'Kilometers', symbol: 'km', ratioToBase: 1000 },
      { id: 'cm', name: 'Centimeters', symbol: 'cm', ratioToBase: 0.01 },
      { id: 'mm', name: 'Millimeters', symbol: 'mm', ratioToBase: 0.001 },
      { id: 'mi', name: 'Miles', symbol: 'mi', ratioToBase: 1609.344 },
      { id: 'yd', name: 'Yards', symbol: 'yd', ratioToBase: 0.9144 },
      { id: 'ft', name: 'Feet', symbol: 'ft', ratioToBase: 0.3048 },
      { id: 'in', name: 'Inches', symbol: 'in', ratioToBase: 0.0254 },
      { id: 'nmi', name: 'Nautical Miles', symbol: 'NM', ratioToBase: 1852 },
    ],
  },
  {
    id: 'weight',
    name: 'Weight / Mass',
    icon: Scale,
    baseUnit: 'kg',
    units: [
      { id: 'kg', name: 'Kilograms', symbol: 'kg', ratioToBase: 1 },
      { id: 'g', name: 'Grams', symbol: 'g', ratioToBase: 0.001 },
      { id: 'mg', name: 'Milligrams', symbol: 'mg', ratioToBase: 0.000001 },
      { id: 't', name: 'Metric Tons', symbol: 't', ratioToBase: 1000 },
      { id: 'lb', name: 'Pounds', symbol: 'lb', ratioToBase: 0.45359237 },
      { id: 'oz', name: 'Ounces', symbol: 'oz', ratioToBase: 0.028349523125 },
      { id: 'st', name: 'Stones', symbol: 'st', ratioToBase: 6.35029318 },
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    icon: Thermometer,
    baseUnit: 'C',
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', ratioToBase: 1 },
      { id: 'f', name: 'Fahrenheit', symbol: '°F', ratioToBase: 1 },
      { id: 'k', name: 'Kelvin', symbol: 'K', ratioToBase: 1 },
    ],
  },
  {
    id: 'area',
    name: 'Area',
    icon: Layers,
    baseUnit: 'm2',
    units: [
      { id: 'm2', name: 'Square Meters', symbol: 'm²', ratioToBase: 1 },
      { id: 'km2', name: 'Square Kilometers', symbol: 'km²', ratioToBase: 1000000 },
      { id: 'ft2', name: 'Square Feet', symbol: 'ft²', ratioToBase: 0.09290304 },
      { id: 'yd2', name: 'Square Yards', symbol: 'yd²', ratioToBase: 0.83612736 },
      { id: 'mi2', name: 'Square Miles', symbol: 'mi²', ratioToBase: 2589988.110336 },
      { id: 'ac', name: 'Acres', symbol: 'ac', ratioToBase: 4046.8564224 },
      { id: 'ha', name: 'Hectares', symbol: 'ha', ratioToBase: 10000 },
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    icon: Box,
    baseUnit: 'l',
    units: [
      { id: 'l', name: 'Liters', symbol: 'L', ratioToBase: 1 },
      { id: 'ml', name: 'Milliliters', symbol: 'mL', ratioToBase: 0.001 },
      { id: 'm3', name: 'Cubic Meters', symbol: 'm³', ratioToBase: 1000 },
      { id: 'gal', name: 'Gallons (US)', symbol: 'gal', ratioToBase: 3.785411784 },
      { id: 'qt', name: 'Quarts (US)', symbol: 'qt', ratioToBase: 0.946352946 },
      { id: 'pt', name: 'Pints (US)', symbol: 'pt', ratioToBase: 0.473176473 },
      { id: 'cup', name: 'Cups (US)', symbol: 'cup', ratioToBase: 0.2365882365 },
      { id: 'floz', name: 'Fluid Ounces (US)', symbol: 'fl oz', ratioToBase: 0.0295735295625 },
    ],
  },
  {
    id: 'speed',
    name: 'Speed',
    icon: Gauge,
    baseUnit: 'mps',
    units: [
      { id: 'mps', name: 'Meters per second', symbol: 'm/s', ratioToBase: 1 },
      { id: 'kph', name: 'Kilometers per hour', symbol: 'km/h', ratioToBase: 0.2777777778 },
      { id: 'mph', name: 'Miles per hour', symbol: 'mph', ratioToBase: 0.44704 },
      { id: 'kn', name: 'Knots', symbol: 'kn', ratioToBase: 0.5144444444 },
      { id: 'fps', name: 'Feet per second', symbol: 'ft/s', ratioToBase: 0.3048 },
    ],
  },
  {
    id: 'time',
    name: 'Time',
    icon: Clock,
    baseUnit: 's',
    units: [
      { id: 's', name: 'Seconds', symbol: 's', ratioToBase: 1 },
      { id: 'ms', name: 'Milliseconds', symbol: 'ms', ratioToBase: 0.001 },
      { id: 'min', name: 'Minutes', symbol: 'min', ratioToBase: 60 },
      { id: 'h', name: 'Hours', symbol: 'h', ratioToBase: 3600 },
      { id: 'd', name: 'Days', symbol: 'd', ratioToBase: 86400 },
      { id: 'wk', name: 'Weeks', symbol: 'wk', ratioToBase: 604800 },
      { id: 'mo', name: 'Months (30 days)', symbol: 'mo', ratioToBase: 2592000 },
      { id: 'yr', name: 'Years (365 days)', symbol: 'yr', ratioToBase: 31536000 },
    ],
  },
  {
    id: 'data',
    name: 'Data Storage',
    icon: Database,
    baseUnit: 'b',
    units: [
      { id: 'b', name: 'Bytes', symbol: 'B', ratioToBase: 1 },
      { id: 'bit', name: 'Bits', symbol: 'bit', ratioToBase: 0.125 },
      { id: 'kb', name: 'Kilobytes (Decimal)', symbol: 'KB', ratioToBase: 1000 },
      { id: 'mb', name: 'Megabytes (Decimal)', symbol: 'MB', ratioToBase: 1000000 },
      { id: 'gb', name: 'Gigabytes (Decimal)', symbol: 'GB', ratioToBase: 1000000000 },
      { id: 'tb', name: 'Terabytes (Decimal)', symbol: 'TB', ratioToBase: 1000000000000 },
      { id: 'kib', name: 'Kibibytes (Binary)', symbol: 'KiB', ratioToBase: 1024 },
      { id: 'mib', name: 'Mebibytes (Binary)', symbol: 'MiB', ratioToBase: 1048576 },
      { id: 'gib', name: 'Gibibytes (Binary)', symbol: 'GiB', ratioToBase: 1073741824 },
    ],
  },
];

export const UnitConverter: React.FC<UnitConverterProps> = ({ tool, onToast }) => {
  const [selectedCatId, setSelectedCatId] = useState('length');
  const [inputValue, setInputValue] = useState('10');
  const [fromUnitId, setFromUnitId] = useState('m');
  const [toUnitId, setToUnitId] = useState('ft');
  const [copied, setCopied] = useState(false);

  const activeCategory = CATEGORIES.find((c) => c.id === selectedCatId) || CATEGORIES[0];

  // Handle changing category: reset from/to units to first two items
  const handleCategoryChange = (catId: string) => {
    setSelectedCatId(catId);
    const cat = CATEGORIES.find((c) => c.id === catId);
    if (cat && cat.units.length >= 2) {
      setFromUnitId(cat.units[0].id);
      setToUnitId(cat.units[1].id);
    }
  };

  const handleSwap = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
    onToast('Swapped conversion units');
  };

  const handleClear = () => {
    setInputValue('');
    onToast('Input cleared');
  };

  // Compute conversion result
  const conversionResult = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return null;

    const fromUnit = activeCategory.units.find((u) => u.id === fromUnitId) || activeCategory.units[0];
    const toUnit = activeCategory.units.find((u) => u.id === toUnitId) || activeCategory.units[1];

    if (activeCategory.id === 'temperature') {
      // Special temperature logic
      let celsius = val;
      if (fromUnit.id === 'f') {
        celsius = (val - 32) * (5 / 9);
      } else if (fromUnit.id === 'k') {
        celsius = val - 273.15;
      }

      let result = celsius;
      let formulaText = '';

      if (toUnit.id === 'f') {
        result = celsius * (9 / 5) + 32;
        formulaText = `(${val} ${fromUnit.symbol} → ${result.toFixed(4)} ${toUnit.symbol})`;
      } else if (toUnit.id === 'k') {
        result = celsius + 273.15;
        formulaText = `(${val} ${fromUnit.symbol} → ${result.toFixed(4)} ${toUnit.symbol})`;
      } else {
        result = celsius;
        formulaText = `(${val} ${fromUnit.symbol} → ${result.toFixed(4)} ${toUnit.symbol})`;
      }

      const formatted = Number(result.toFixed(6));
      return {
        result: formatted,
        fromUnit,
        toUnit,
        formula: formulaText,
      };
    } else {
      // Standard linear ratio
      const baseValue = val * fromUnit.ratioToBase;
      const result = baseValue / toUnit.ratioToBase;
      const formatted = Number(result.toPrecision(8));
      const ratio = fromUnit.ratioToBase / toUnit.ratioToBase;

      return {
        result: formatted,
        fromUnit,
        toUnit,
        formula: `1 ${fromUnit.symbol} = ${Number(ratio.toPrecision(6))} ${toUnit.symbol}`,
      };
    }
  }, [inputValue, activeCategory, fromUnitId, toUnitId]);

  const handleCopy = () => {
    if (!conversionResult) return;
    navigator.clipboard.writeText(`${conversionResult.result} ${conversionResult.toUnit.symbol}`);
    setCopied(true);
    onToast('Converted value copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Category Selector Tabs */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Select Measurement Category:
          </label>
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCatId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Converter Workstation */}
        <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* From Input & Dropdown */}
            <div className="md:col-span-5 space-y-2">
              <label htmlFor="unit-input-val" className="block text-xs font-semibold text-slate-700">
                From:
              </label>
              <div className="space-y-2">
                <input
                  id="unit-input-val"
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter amount..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-base tabular-nums focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                />
                <select
                  value={fromUnitId}
                  onChange={(e) => setFromUnitId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs outline-none"
                >
                  {activeCategory.units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-2 flex items-center justify-center pb-2">
              <button
                onClick={handleSwap}
                className="p-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl shadow-xs transition-colors hover:text-indigo-600"
                title="Swap units"
                aria-label="Swap units"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* To Result & Dropdown */}
            <div className="md:col-span-5 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                To:
              </label>
              <div className="space-y-2">
                <div className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-indigo-700 font-mono text-base font-bold tabular-nums truncate flex items-center justify-between min-h-[44px]">
                  <span>{conversionResult ? conversionResult.result : '—'}</span>
                  {conversionResult && (
                    <span className="text-xs text-slate-400 font-normal ml-2">
                      {conversionResult.toUnit.symbol}
                    </span>
                  )}
                </div>
                <select
                  value={toUnitId}
                  onChange={(e) => setToUnitId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs outline-none"
                >
                  {activeCategory.units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/80">
            <div className="text-xs text-slate-500 font-mono">
              {conversionResult ? (
                <span>Formula: {conversionResult.formula}</span>
              ) : (
                <span>Enter a valid numeric value</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClear}
                disabled={!inputValue}
                className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-rose-600 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 transition-colors disabled:opacity-40"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
              <button
                onClick={handleCopy}
                disabled={!conversionResult}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Result'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Reference Grid */}
        <div className="pt-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Common Quick Conversions in {activeCategory.name}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {activeCategory.units.slice(0, 8).map((u) => {
              const baseUnit = activeCategory.units.find((x) => x.id === activeCategory.baseUnit) || activeCategory.units[0];
              const ratio = u.ratioToBase;
              return (
                <div key={u.id} className="p-2.5 rounded-lg bg-white border border-slate-200 flex flex-col justify-between">
                  <span className="font-semibold text-slate-800">{u.name}</span>
                  <span className="text-[11px] text-slate-500 font-mono mt-1">
                    1 {u.symbol} = {ratio} {baseUnit.symbol}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
