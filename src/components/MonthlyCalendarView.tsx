import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Utensils } from 'lucide-react';
import { MealRow, SchoolInfo } from '../types';
import { fetchMonthlyMeals } from '../services/neisApi';
import { dateToYmd } from '../utils/parser';

interface MonthlyCalendarViewProps {
  currentSchool: SchoolInfo;
  selectedYmd: string;
  onSelectDate: (ymd: string) => void;
  apiKey?: string;
}

export const MonthlyCalendarView: React.FC<MonthlyCalendarViewProps> = ({
  currentSchool,
  selectedYmd,
  onSelectDate,
  apiKey,
}) => {
  const currentYear = selectedYmd ? parseInt(selectedYmd.substring(0, 4), 10) : new Date().getFullYear();
  const currentMonth = selectedYmd ? parseInt(selectedYmd.substring(4, 6), 10) : new Date().getMonth() + 1;

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [mealsByDate, setMealsByDate] = useState<Record<string, MealRow[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadMonthlyData = async () => {
      setLoading(true);
      const res = await fetchMonthlyMeals(
        currentSchool.ATPT_OFCDC_SC_CODE,
        currentSchool.SD_SCHUL_CODE,
        year,
        month,
        apiKey
      );
      if (isMounted) {
        setMealsByDate(res.mealsByDate || {});
        setLoading(false);
      }
    };

    loadMonthlyData();
    return () => {
      isMounted = false;
    };
  }, [currentSchool, year, month, apiKey]);

  const handlePrevMonth = () => {
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  };

  // Generate calendar grid array
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month, 0).getDate();

  const calendarCells = [];
  // Empty padding for previous month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(null);
  }
  // Days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  const todayYmd = dateToYmd(new Date());

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-4 sm:p-6 mb-8">
      {/* Calendar Header Controls */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {year}년 {month}월 월간 급식 달력
          </h2>
          {loading && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              불러오는 중...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-bold text-sm flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">이전달</span>
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-bold text-sm flex items-center gap-1"
          >
            <span className="hidden sm:inline">다음달</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels Header */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold mb-2">
        <div className="py-2 text-red-500 bg-red-50/50 rounded-lg">일</div>
        <div className="py-2 text-slate-700 bg-slate-50 rounded-lg">월</div>
        <div className="py-2 text-slate-700 bg-slate-50 rounded-lg">화</div>
        <div className="py-2 text-slate-700 bg-slate-50 rounded-lg">수</div>
        <div className="py-2 text-slate-700 bg-slate-50 rounded-lg">목</div>
        <div className="py-2 text-slate-700 bg-slate-50 rounded-lg">금</div>
        <div className="py-2 text-blue-500 bg-blue-50/50 rounded-lg">토</div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {calendarCells.map((dayNum, index) => {
          if (dayNum === null) {
            return <div key={`empty_${index}`} className="min-h-[80px] bg-slate-50/30 rounded-xl border border-transparent" />;
          }

          const dayStr = String(dayNum).padStart(2, '0');
          const monthStr = String(month).padStart(2, '0');
          const cellYmd = `${year}${monthStr}${dayStr}`;

          const isSelected = cellYmd === selectedYmd;
          const isToday = cellYmd === todayYmd;
          const meals = mealsByDate[cellYmd] || [];
          const hasMeals = meals.length > 0;

          // Extract lunch or first meal preview
          const mainMeal = meals.find((m) => m.MMEAL_SC_CODE === '2') || meals[0];
          let firstDishPreview = '';
          if (mainMeal && mainMeal.DDISH_NM) {
            const rawDish = mainMeal.DDISH_NM.split('<br/>')[0] || mainMeal.DDISH_NM.split('\n')[0];
            firstDishPreview = rawDish.replace(/\(.*?\)/g, '').trim();
          }

          const dayOfWeek = (index % 7);
          const isSunday = dayOfWeek === 0;
          const isSaturday = dayOfWeek === 6;

          return (
            <div
              key={cellYmd}
              onClick={() => onSelectDate(cellYmd)}
              className={`min-h-[80px] sm:min-h-[100px] p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/50 shadow-xs'
                  : isToday
                  ? 'bg-amber-50/80 border-amber-300'
                  : hasMeals
                  ? 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-2xs'
                  : 'bg-slate-50/60 border-slate-100/80 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs sm:text-sm font-black ${
                    isToday
                      ? 'w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center'
                      : isSunday
                      ? 'text-red-500'
                      : isSaturday
                      ? 'text-blue-500'
                      : 'text-slate-800'
                  }`}
                >
                  {dayNum}
                </span>

                {hasMeals && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
                    {meals.length}식
                  </span>
                )}
              </div>

              {/* Meal Summary Snippet */}
              {hasMeals ? (
                <div className="mt-1">
                  <div className="text-[11px] font-semibold text-slate-800 line-clamp-2 leading-tight">
                    {firstDishPreview}
                  </div>
                  {mainMeal?.CAL_INFO && (
                    <div className="text-[10px] text-emerald-700 font-bold mt-1">
                      {mainMeal.CAL_INFO}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-[10px] text-slate-300 italic mt-auto">식단없음</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
