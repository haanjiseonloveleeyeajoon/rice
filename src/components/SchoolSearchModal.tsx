import React, { useState } from 'react';
import { Search, X, MapPin, Building2, Star, Check, Loader2 } from 'lucide-react';
import { SchoolInfo } from '../types';
import { EDUCATION_OFFICES, PRESET_SCHOOLS } from '../constants/schools';
import { searchSchools } from '../services/neisApi';

interface SchoolSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSchool: (school: SchoolInfo) => void;
  currentSchool: SchoolInfo;
  favoriteSchools: SchoolInfo[];
  onToggleFavorite: (school: SchoolInfo) => void;
  apiKey?: string;
}

export const SchoolSearchModal: React.FC<SchoolSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSchool,
  currentSchool,
  favoriteSchools,
  onToggleFavorite,
  apiKey,
}) => {
  const [keyword, setKeyword] = useState('');
  const [selectedOffice, setSelectedOffice] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SchoolInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!keyword.trim() || keyword.trim().length < 2) {
      setErrorMsg('학교명을 2자 이상 입력해주세요.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const result = await searchSchools(keyword, selectedOffice || undefined, apiKey);
    setLoading(false);

    if (result.message) {
      setErrorMsg(result.message);
      setSearchResults([]);
    } else {
      setSearchResults(result.schools);
    }
  };

  const isFavorite = (schoolCode: string) => {
    return favoriteSchools.some((s) => s.SD_SCHUL_CODE === schoolCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">학교 검색</h2>
            <p className="text-xs text-slate-500">전국 초·중·고·특수학교 검색 및 선택</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input & Region Filter */}
        <div className="p-6 border-b border-slate-100 bg-white">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            {/* Region Dropdown */}
            <select
              value={selectedOffice}
              onChange={(e) => setSelectedOffice(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shrink-0"
            >
              <option value="">전국 전체 교육청</option>
              {EDUCATION_OFFICES.map((office) => (
                <option key={office.code} value={office.code}>
                  {office.name}
                </option>
              ))}
            </select>

            {/* Keyword Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="학교명을 입력하세요 (예: 신도고, 경기고, 서울과학고)"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>

            {/* Search Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-xs disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>검색 중...</span>
                </>
              ) : (
                <span>검색</span>
              )}
            </button>
          </form>

          {errorMsg && <p className="mt-2 text-xs font-medium text-amber-600">{errorMsg}</p>}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
          {/* Search Results if any */}
          {searchResults.length > 0 ? (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                검색 결과 ({searchResults.length}건)
              </h3>
              <div className="space-y-2">
                {searchResults.map((school) => {
                  const isSelected = school.SD_SCHUL_CODE === currentSchool.SD_SCHUL_CODE;
                  const fav = isFavorite(school.SD_SCHUL_CODE);

                  return (
                    <div
                      key={`${school.ATPT_OFCDC_SC_CODE}_${school.SD_SCHUL_CODE}`}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-50/80 border-emerald-300 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex-1 pr-3 cursor-pointer" onClick={() => { onSelectSchool(school); onClose(); }}>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-base">{school.SCHUL_NM}</span>
                          {school.SCHUL_KND_SC_NM && (
                            <span className="px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-600 rounded-md">
                              {school.SCHUL_KND_SC_NM}
                            </span>
                          )}
                          {isSelected && (
                            <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-600 text-white rounded-md flex items-center gap-1">
                              <Check className="w-3 h-3" /> 선택됨
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {school.ATPT_OFCDC_SC_NM}
                          </span>
                          {school.ORG_RDNMA && (
                            <span className="flex items-center gap-1 truncate">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {school.ORG_RDNMA}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Favorite Toggle & Select Button */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(school);
                          }}
                          className={`p-2 rounded-lg text-sm transition-colors ${
                            fav
                              ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
                          }`}
                          title={fav ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                        >
                          <Star className={`w-4 h-4 ${fav ? 'fill-amber-500' : ''}`} />
                        </button>
                        <button
                          onClick={() => {
                            onSelectSchool(school);
                            onClose();
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          }`}
                        >
                          선택
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {/* Presets & Favorite Schools */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  주요 추천 학교
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PRESET_SCHOOLS.map((school) => {
                    const isSelected = school.SD_SCHUL_CODE === currentSchool.SD_SCHUL_CODE;
                    const fav = isFavorite(school.SD_SCHUL_CODE);

                    return (
                      <div
                        key={school.SD_SCHUL_CODE}
                        onClick={() => {
                          onSelectSchool(school);
                          onClose();
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-400/50'
                            : 'bg-white border-slate-200 hover:border-emerald-200 hover:shadow-xs'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{school.SCHUL_NM}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {school.LCTN_SC_NM || school.ATPT_OFCDC_SC_NM}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(school);
                          }}
                          className="p-1.5 text-slate-300 hover:text-amber-500"
                        >
                          <Star className={`w-4 h-4 ${fav ? 'fill-amber-500 text-amber-500' : ''}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
