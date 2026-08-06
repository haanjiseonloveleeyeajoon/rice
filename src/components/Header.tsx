import React from 'react';
import { Utensils, Search, Settings, ShieldAlert, Rocket, Bookmark } from 'lucide-react';
import { SchoolInfo } from '../types';

interface HeaderProps {
  currentSchool: SchoolInfo;
  onOpenSchoolSearch: () => void;
  onOpenAllergyFilter: () => void;
  onOpenApiKeyModal: () => void;
  onOpenVercelModal: () => void;
  activeAllergyCount: number;
  favoriteSchools: SchoolInfo[];
  onSelectSchool: (school: SchoolInfo) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSchool,
  onOpenSchoolSearch,
  onOpenAllergyFilter,
  onOpenApiKeyModal,
  onOpenVercelModal,
  activeAllergyCount,
  favoriteSchools,
  onSelectSchool,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        {/* Top bar: Logo + School Picker + Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">학교 급식 식단 정보</h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                  NEIS API
                </span>
              </div>
              <p className="text-xs text-slate-500">전국 초·중·고등학교 날짜별 급식 & 영양 조회</p>
            </div>
          </div>

          {/* Controls & Actions */}
          <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-end">
            {/* Active School Selector Button */}
            <button
              onClick={onOpenSchoolSearch}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-medium transition-colors border border-slate-200"
              title="학교 변경하기"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span className="max-w-[140px] sm:max-w-[200px] truncate font-semibold">
                {currentSchool.SCHUL_NM}
              </span>
              <span className="text-xs text-slate-500 hidden md:inline">
                ({currentSchool.ATPT_OFCDC_SC_NM.replace('교육청', '')})
              </span>
            </button>

            {/* Allergy Filter Button */}
            <button
              onClick={onOpenAllergyFilter}
              className={`relative p-2 rounded-lg text-sm font-medium transition-colors border ${
                activeAllergyCount > 0
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="알레르기 설정"
            >
              <ShieldAlert className="w-4 h-4" />
              {activeAllergyCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeAllergyCount}
                </span>
              )}
            </button>

            {/* API Settings Button */}
            <button
              onClick={onOpenApiKeyModal}
              className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-sm transition-colors"
              title="API 키 / 설정"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Vercel Deploy Guide Button */}
            <button
              onClick={onOpenVercelModal}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all shadow-xs"
            >
              <Rocket className="w-3.5 h-3.5 text-emerald-400" />
              <span>Vercel 배포</span>
            </button>
          </div>
        </div>

        {/* Favorite Schools Quick Strip (if available) */}
        {favoriteSchools.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-medium text-slate-400 shrink-0 flex items-center gap-1">
              <Bookmark className="w-3 h-3" />
              즐겨찾기:
            </span>
            <div className="flex items-center gap-1.5">
              {favoriteSchools.map((school) => {
                const isSelected = school.SD_SCHUL_CODE === currentSchool.SD_SCHUL_CODE;
                return (
                  <button
                    key={school.SD_SCHUL_CODE}
                    onClick={() => onSelectSchool(school)}
                    className={`px-2.5 py-1 text-xs rounded-full transition-all shrink-0 ${
                      isSelected
                        ? 'bg-emerald-600 text-white font-medium shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {school.SCHUL_NM}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
