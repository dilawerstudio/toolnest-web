import React, { useState, useMemo } from 'react';
import { Calendar, Clock, Sparkles, RotateCcw, Heart } from 'lucide-react';
import { ToolItem } from '../../types/tool';
import { ToolLayout } from '../common/ToolLayout';

interface AgeCalculatorProps {
  tool: ToolItem;
  onToast: (msg: string) => void;
}

interface AgeCalculationData {
  isFuture: false;
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  totalHeartbeats: number;
  birthDayOfWeek: string;
  daysUntilNextBday: number;
  nextBdayDayOfWeek: string;
  zodiac: string;
  zodiacElement: string;
  chineseZodiac: string;
}

interface FutureDateError {
  isFuture: true;
}

type AgeCalculationResult = AgeCalculationData | FutureDateError | null;

export const AgeCalculator: React.FC<AgeCalculatorProps> = ({ tool, onToast }) => {
  // Today's date in YYYY-MM-DD
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [targetDate, setTargetDate] = useState(todayStr);

  const results: AgeCalculationResult = useMemo(() => {
    if (!birthDate || !targetDate) return null;

    const birth = new Date(birthDate + 'T00:00:00');
    const target = new Date(targetDate + 'T00:00:00');

    if (isNaN(birth.getTime()) || isNaN(target.getTime())) return null;

    if (target < birth) {
      return { isFuture: true };
    }

    // Exact Years, Months, Days calculation
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      // Days in previous month of target
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Total milliseconds delta
    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;
    const totalHeartbeats = Math.floor(totalMinutes * 72); // average 72 bpm

    // Day of the week born
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const birthDayOfWeek = dayNames[birth.getDay()];

    // Next Birthday calculation
    let nextBdayYear = target.getFullYear();
    let nextBday = new Date(nextBdayYear, birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBdayYear += 1;
      nextBday = new Date(nextBdayYear, birth.getMonth(), birth.getDate());
    }
    const daysUntilNextBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
    const nextBdayDayOfWeek = dayNames[nextBday.getDay()];

    // Zodiac Sign
    const m = birth.getMonth() + 1;
    const d = birth.getDate();
    let zodiac = 'Capricorn';
    let zodiacElement = 'Earth';

    if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) { zodiac = 'Aquarius'; zodiacElement = 'Air'; }
    else if ((m === 2 && d >= 19) || (m === 3 && d <= 20)) { zodiac = 'Pisces'; zodiacElement = 'Water'; }
    else if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) { zodiac = 'Aries'; zodiacElement = 'Fire'; }
    else if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) { zodiac = 'Taurus'; zodiacElement = 'Earth'; }
    else if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) { zodiac = 'Gemini'; zodiacElement = 'Air'; }
    else if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) { zodiac = 'Cancer'; zodiacElement = 'Water'; }
    else if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) { zodiac = 'Leo'; zodiacElement = 'Fire'; }
    else if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) { zodiac = 'Virgo'; zodiacElement = 'Earth'; }
    else if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) { zodiac = 'Libra'; zodiacElement = 'Air'; }
    else if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) { zodiac = 'Scorpio'; zodiacElement = 'Water'; }
    else if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) { zodiac = 'Sagittarius'; zodiacElement = 'Fire'; }

    // Chinese Zodiac
    const chineseAnimals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
    const chineseZodiac = chineseAnimals[(birth.getFullYear() - 4) % 12];

    return {
      isFuture: false,
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      totalHours,
      totalMinutes,
      totalSeconds,
      totalHeartbeats,
      birthDayOfWeek,
      daysUntilNextBday,
      nextBdayDayOfWeek,
      zodiac,
      zodiacElement,
      chineseZodiac,
    };
  }, [birthDate, targetDate]);

  const handleReset = () => {
    setBirthDate('2000-01-01');
    setTargetDate(todayStr);
    onToast('Reset to defaults');
  };

  const validResults = results && !results.isFuture ? results : null;

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Date Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
          <div>
            <label htmlFor="birthdate-input" className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>Date of Birth:</span>
            </label>
            <input
              id="birthdate-input"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-sans text-sm"
            />
          </div>

          <div>
            <label htmlFor="targetdate-input" className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Age as of Date:</span>
            </label>
            <div className="flex gap-2">
              <input
                id="targetdate-input"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-sans text-sm"
              />
              <button
                onClick={() => setTargetDate(todayStr)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl border border-slate-200 transition-colors shrink-0"
                title="Reset target date to Today"
              >
                Today
              </button>
            </div>
          </div>
        </div>

        {/* Invalid date warning */}
        {results?.isFuture && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            The target date is earlier than the birth date. Please select a target date on or after your birth date.
          </div>
        )}

        {/* Results */}
        {validResults && (
          <div className="space-y-6">
            {/* Primary Result Banner */}
            <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 block mb-1">
                  Calculated Age
                </span>
                <div className="flex items-baseline gap-2 flex-wrap text-slate-900">
                  <span className="text-3xl sm:text-4xl font-extrabold tabular-nums font-mono text-indigo-700">
                    {validResults.years}
                  </span>
                  <span className="text-sm font-medium text-slate-600 mr-2">years</span>
                  <span className="text-3xl sm:text-4xl font-extrabold tabular-nums font-mono text-indigo-700">
                    {validResults.months}
                  </span>
                  <span className="text-sm font-medium text-slate-600 mr-2">months</span>
                  <span className="text-3xl sm:text-4xl font-extrabold tabular-nums font-mono text-indigo-700">
                    {validResults.days}
                  </span>
                  <span className="text-sm font-medium text-slate-600">days</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-xl transition-colors shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Dates</span>
              </button>
            </div>

            {/* Next Birthday Countdown */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">Next Birthday Countdown</h4>
                  <p className="text-xs text-slate-500">
                    Falls on a <span className="font-semibold text-slate-700">{validResults.nextBdayDayOfWeek}</span>
                  </p>
                </div>
              </div>
              <div className="text-sm font-bold text-slate-900 tabular-nums font-mono">
                {validResults.daysUntilNextBday === 0 ? (
                  <span className="text-pink-600 font-extrabold">Happy Birthday today! 🎉</span>
                ) : (
                  <span>{validResults.daysUntilNextBday} days remaining</span>
                )}
              </div>
            </div>

            {/* Total Life Units Grid */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Total Units Lived So Far
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-xs text-slate-500 block mb-0.5">Total Months</span>
                  <span className="text-xl font-bold text-slate-900 tabular-nums font-mono">
                    {validResults.totalMonths.toLocaleString()}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-xs text-slate-500 block mb-0.5">Total Weeks</span>
                  <span className="text-xl font-bold text-slate-900 tabular-nums font-mono">
                    {validResults.totalWeeks.toLocaleString()}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-xs text-slate-500 block mb-0.5">Total Days</span>
                  <span className="text-xl font-bold text-slate-900 tabular-nums font-mono">
                    {validResults.totalDays.toLocaleString()}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-xs text-slate-500 block mb-0.5">Total Hours</span>
                  <span className="text-xl font-bold text-slate-900 tabular-nums font-mono">
                    {validResults.totalHours.toLocaleString()}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-xs text-slate-500 block mb-0.5">Total Minutes</span>
                  <span className="text-xl font-bold text-slate-900 tabular-nums font-mono">
                    {validResults.totalMinutes.toLocaleString()}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-xs text-slate-500 block mb-0.5">Estimated Heartbeats</span>
                  <span className="text-xl font-bold text-slate-900 tabular-nums font-mono flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
                    {validResults.totalHeartbeats.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Astrological & Day Facts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500 block mb-1">Day of Birth</span>
                <span className="font-semibold text-slate-900 text-sm">{validResults.birthDayOfWeek}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500 block mb-1">Western Zodiac</span>
                <span className="font-semibold text-slate-900 text-sm">
                  {validResults.zodiac} <span className="text-slate-400 font-normal">({validResults.zodiacElement})</span>
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500 block mb-1">Chinese Zodiac</span>
                <span className="font-semibold text-slate-900 text-sm">Year of the {validResults.chineseZodiac}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
