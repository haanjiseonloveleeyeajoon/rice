import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DatePickerSection } from './components/DatePickerSection';
import { MealCard } from './components/MealCard';
import { MonthlyCalendarView } from './components/MonthlyCalendarView';
import { SchoolSearchModal } from './components/SchoolSearchModal';
import { AllergyFilterModal } from './components/AllergyFilterModal';
import { VercelDeployModal } from './components/VercelDeployModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { DEFAULT_SCHOOL, PRESET_SCHOOLS } from './constants/schools';
import { fetchDailyMeals } from './services/neisApi';
import { dateToYmd, formatDateKorean } from './utils/parser';
import { MealRow, SchoolInfo, ViewMode } from './types';
import { CalendarX, Loader2, RefreshCw, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  // Local Storage State initialization
  const [currentSchool, setCurrentSchool] = useState<SchoolInfo>(() => {
    try {
      const saved = localStorage.getItem('neis_school');
      return saved ? JSON.parse(saved) : DEFAULT_SCHOOL;
    } catch {
      return DEFAULT_SCHOOL;
    }
  });

  const [favoriteSchools, setFavoriteSchools] = useState<SchoolInfo[]>(() => {
    try {
      const saved = localStorage.getItem('neis_favorites');
      return saved ? JSON.parse(saved) : PRESET_SCHOOLS;
    } catch {
      return PRESET_SCHOOLS;
    }
  });

  const [userAllergies, setUserAllergies] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('neis_allergies');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [apiKey, setApiKey] = useState<string>(() => {
    try {
      return localStorage.getItem('neis_apikey') || '';
    } catch {
      return '';
    }
  });

  const [selectedYmd, setSelectedYmd] = useState<string>(() => dateToYmd(new Date()));
  const [viewMode, setViewMode] = useState<ViewMode>('daily');

  // Meal Fetch Data State
  const [meals, setMeals] = useState<MealRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Modals
  const [isSchoolSearchOpen, setIsSchoolSearchOpen] = useState(false);
  const [isAllergyFilterOpen, setIsAllergyFilterOpen] = useState(false);
  const [isVercelModalOpen, setIsVercelModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Save current school to local storage
  const handleSelectSchool = (school: SchoolInfo) => {
    setCurrentSchool(school);
    localStorage.setItem('neis_school', JSON.stringify(school));
  };

  // Toggle Favorite School
  const handleToggleFavorite = (school: SchoolInfo) => {
    setFavoriteSchools((prev) => {
      const exists = prev.some((s) => s.SD_SCHUL_CODE === school.SD_SCHUL_CODE);
      let updated;
      if (exists) {
        updated = prev.filter((s) => s.SD_SCHUL_CODE !== school.SD_SCHUL_CODE);
      } else {
        updated = [...prev, school];
      }
      localStorage.setItem('neis_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Toggle User Allergy
  const handleToggleAllergy = (code: number) => {
    setUserAllergies((prev) => {
      const updated = prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code];
      localStorage.setItem('neis_allergies', JSON.stringify(updated));
      return updated;
    });
  };

  const handleResetAllergies = () => {
    setUserAllergies([]);
    localStorage.removeItem('neis_allergies');
  };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem('neis_apikey', key);
    } else {
      localStorage.removeItem('neis_apikey');
    }
  };

  // Fetch Daily Meals when school, date, or API key changes
  const loadDailyMeals = async () => {
    setLoading(true);
    setMessage(null);

    const result = await fetchDailyMeals(
      currentSchool.ATPT_OFCDC_SC_CODE,
      currentSchool.SD_SCHUL_CODE,
      selectedYmd,
      apiKey
    );

    setLoading(false);
    setMeals(result.meals || []);
    if (result.message && (!result.meals || result.meals.length === 0)) {
      setMessage(result.message);
    }
  };

  useEffect(() => {
    loadDailyMeals();
  }, [currentSchool, selectedYmd, apiKey]);

  // Jump to next weekday helper
  const handleJumpNextWeekday = () => {
    const year = parseInt(selectedYmd.substring(0, 4), 10);
    const month = parseInt(selectedYmd.substring(4, 6), 10) - 1;
    const day = parseInt(selectedYmd.substring(6, 8), 10);

    const date = new Date(year, month, day);
    // Add days until Monday
    do {
      date.setDate(date.getDate() + 1);
    } while (date.getDay() === 0 || date.getDay() === 6);

    setSelectedYmd(dateToYmd(date));
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans flex flex-col antialiased">
      {/* Header Bar */}
      <Header
        currentSchool={currentSchool}
        onOpenSchoolSearch={() => setIsSchoolSearchOpen(true)}
        onOpenAllergyFilter={() => setIsAllergyFilterOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenVercelModal={() => setIsVercelModalOpen(true)}
        activeAllergyCount={userAllergies.length}
        favoriteSchools={favoriteSchools}
        onSelectSchool={handleSelectSchool}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Date Selection Bar */}
        <DatePickerSection
          selectedYmd={selectedYmd}
          onDateChange={(ymd) => setSelectedYmd(ymd)}
          viewMode={viewMode}
          onViewModeChange={(mode) => setViewMode(mode)}
        />

        {/* View Mode Router */}
        {viewMode === 'monthly' ? (
          <MonthlyCalendarView
            currentSchool={currentSchool}
            selectedYmd={selectedYmd}
            onSelectDate={(ymd) => {
              setSelectedYmd(ymd);
              setViewMode('daily'); // Switch to daily view upon selecting date
            }}
            apiKey={apiKey}
          />
        ) : (
          /* Daily Meal View */
          <div>
            {loading ? (
              /* Loading Skeleton */
              <div className="py-16 text-center bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  {currentSchool.SCHUL_NM} 급식 정보를 불러오는 중...
                </h3>
                <p className="text-xs text-slate-400 mt-1">NEIS 오픈 API로부터 데이터를 수신하고 있습니다.</p>
              </div>
            ) : meals.length > 0 ? (
              /* Meal Cards Grid (Breakfast, Lunch, Dinner) */
              <div>
                <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
                  <span>총 {meals.length}개의 식단 정보가 제공됩니다.</span>
                  <button
                    onClick={loadDailyMeals}
                    className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> 새로고침
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {meals.map((meal, idx) => (
                    <MealCard key={idx} meal={meal} userAllergies={userAllergies} />
                  ))}
                </div>
              </div>
            ) : (
              /* Empty State (No Meals / Weekend / Vacation) */
              <div className="py-16 px-6 text-center bg-white rounded-2xl border border-slate-200/80 shadow-2xs max-w-xl mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center">
                  <CalendarX className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  {formatDateKorean(selectedYmd)}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {message || '해당 날짜에 등록된 급식 정보가 없습니다.'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  (주말, 공휴일, 방학 기간 또는 식단 미등록일 수 있습니다)
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleJumpNextWeekday}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <span>다음 평일 급식 보기</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedYmd(dateToYmd(new Date()))}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    오늘 날짜로 이동
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>교육부 NEIS 나이스 오픈 API 연동</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsVercelModalOpen(true)}
              className="hover:text-slate-900 font-semibold underline decoration-slate-300 underline-offset-4"
            >
              Vercel 배포 가이드
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSchoolSearchOpen(true)}
              className="hover:text-slate-900 font-semibold"
            >
              학교 변경 ({currentSchool.SCHUL_NM})
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SchoolSearchModal
        isOpen={isSchoolSearchOpen}
        onClose={() => setIsSchoolSearchOpen(false)}
        onSelectSchool={handleSelectSchool}
        currentSchool={currentSchool}
        favoriteSchools={favoriteSchools}
        onToggleFavorite={handleToggleFavorite}
        apiKey={apiKey}
      />

      <AllergyFilterModal
        isOpen={isAllergyFilterOpen}
        onClose={() => setIsAllergyFilterOpen(false)}
        userAllergies={userAllergies}
        onToggleAllergy={handleToggleAllergy}
        onResetAllergies={handleResetAllergies}
      />

      <VercelDeployModal
        isOpen={isVercelModalOpen}
        onClose={() => setIsVercelModalOpen(false)}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />
    </div>
  );
}
