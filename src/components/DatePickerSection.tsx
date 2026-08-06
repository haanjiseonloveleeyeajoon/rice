import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CalendarDays, LayoutGrid } from 'lucide-react';
import { formatDateKorean, ymdToIsoDate, isoDateToYmd, dateToYmd } from '../utils/parser';
import { ViewMode } from '../types';

interface DatePickerSectionProps {
  selectedYmd: string;
  onDateChange: (ymd: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const DatePickerSection: React.FC<DatePickerSectionProps> = ({
  selectedYmd,
  onDateChange,
  viewMode,
  onViewModeChange,
}) => {
  const todayYmd = dateToYmd(new Date());

  const handleOffsetDay = (offset: number) => {
    if (!selectedYmd || selectedYmd.length !== 8) return;
    const year = parseInt(selectedYmd.substring(0, 4), 10);
    const month = parseInt(selectedYmd.substring(4, 6), 10) - 1;
    const day = parseInt(selectedYmd.substring(6, 8), 10);

    const d = new Date(year, month, day + offset);
    onDateChange(dateToYmd(d));
  };

  const handleTodayClick = () => {
    onDateChange(todayYmd);
  };

  const handleTomorrowClick = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    onDateChange(dateToYmd(tomorrow));
  };

  const handleNativeDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // YYYY-MM-DD
    if (val) {
      onDateChange(isoDateToYmd(val));
    }
  };

  const isToday = selectedYmd === todayYmd;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Date Display Title & Navigation */}
        <div className="flex items-center gap-2">
          {/* Previous Day Button */}
          <button
            onClick={() => handleOffsetDay(-1)}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
            title="이전날 급식"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Date Label */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {formatDateKorean(selectedYmd)}
                </span>
                {isToday && (
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                    오늘
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Next Day Button */}
          <button
            onClick={() => handleOffsetDay(1)}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
            title="다음날 급식"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Date Quick Controls & View Mode Tabs */}
        <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end">
          {/* Quick Date Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={handleTodayClick}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isToday ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              오늘
            </button>
            <button
              onClick={handleTomorrowClick}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              내일
            </button>

            {/* Native Datepicker Wrapper */}
            <label className="relative flex items-center gap-1 px-3 py-1.5 bg-white text-slate-700 rounded-lg text-xs font-bold shadow-2xs border border-slate-200 cursor-pointer hover:bg-slate-50">
              <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>날짜 선택</span>
              <input
                type="date"
                value={ymdToIsoDate(selectedYmd)}
                onChange={handleNativeDateInput}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </label>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => onViewModeChange('daily')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'daily'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>일간 식단</span>
            </button>
            <button
              onClick={() => onViewModeChange('monthly')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'monthly'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>월간 달력</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
