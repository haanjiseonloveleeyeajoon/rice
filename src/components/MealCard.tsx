import React, { useState } from 'react';
import { Sun, SunMoon, Moon, Flame, Users, AlertTriangle, ChevronDown, ChevronUp, Copy, Check, Info } from 'lucide-react';
import { MealRow } from '../types';
import { parseDishName, parseNutritionInfo, parseOriginInfo } from '../utils/parser';

interface MealCardProps {
  meal: MealRow;
  userAllergies: number[];
}

export const MealCard: React.FC<MealCardProps> = ({ meal, userAllergies }) => {
  const [showNutrition, setShowNutrition] = useState(false);
  const [showOrigin, setShowOrigin] = useState(false);
  const [copied, setCopied] = useState(false);

  const dishes = parseDishName(meal.DDISH_NM, userAllergies);
  const nutritionList = parseNutritionInfo(meal.NTR_INFO);
  const originList = parseOriginInfo(meal.ORPLC_INFO);

  const hasWarning = dishes.some((d) => d.isWarning);

  // Meal Type Theme styling
  const getMealTypeStyle = (typeCode: string) => {
    switch (typeCode) {
      case '1': // 조식
        return {
          headerBg: 'bg-gradient-to-r from-amber-500 to-orange-500',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: <Sun className="w-5 h-5 text-amber-100" />,
          title: '조식 (아침)',
        };
      case '2': // 중식
        return {
          headerBg: 'bg-gradient-to-r from-emerald-600 to-teal-600',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: <SunMoon className="w-5 h-5 text-emerald-100" />,
          title: '중식 (점심)',
        };
      case '3': // 석식
        return {
          headerBg: 'bg-gradient-to-r from-indigo-600 to-purple-600',
          badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
          icon: <Moon className="w-5 h-5 text-indigo-100" />,
          title: '석식 (저녁)',
        };
      default:
        return {
          headerBg: 'bg-gradient-to-r from-slate-700 to-slate-800',
          badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: <SunMoon className="w-5 h-5 text-slate-100" />,
          title: meal.MMEAL_SC_NM || '급식',
        };
    }
  };

  const style = getMealTypeStyle(meal.MMEAL_SC_CODE);

  // Copy meal text to clipboard
  const handleCopy = () => {
    const dishNames = dishes.map((d) => `• ${d.name}`).join('\n');
    const text = `[${meal.SCHUL_NM} - ${style.title}]\n${dishNames}\n칼로리: ${meal.CAL_INFO || '정보없음'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col">
      {/* Card Header */}
      <div className={`${style.headerBg} p-4 sm:p-5 text-white flex items-center justify-between`}>
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/10 backdrop-blur-xs rounded-xl">{style.icon}</div>
          <div>
            <h3 className="text-lg font-bold tracking-tight">{style.title}</h3>
            <span className="text-xs text-white/80">{meal.SCHUL_NM}</span>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold backdrop-blur-xs transition-colors flex items-center gap-1"
          title="식단 복사하기"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">복사됨</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">복사</span>
            </>
          )}
        </button>
      </div>

      {/* Meta Info Bar: Calories & Servings */}
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600">
        <div className="flex items-center gap-3">
          {meal.CAL_INFO && (
            <span className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {meal.CAL_INFO}
            </span>
          )}
          {meal.MLSV_FGR && (
            <span className="flex items-center gap-1 text-slate-600 bg-slate-200/60 px-2.5 py-1 rounded-lg">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              급식인원 {meal.MLSV_FGR}명
            </span>
          )}
        </div>

        {hasWarning && (
          <span className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            알레르기 주의
          </span>
        )}
      </div>

      {/* Dish List */}
      <div className="p-5 flex-1 bg-white">
        <ul className="space-y-3">
          {dishes.map((dish, idx) => (
            <li
              key={idx}
              className={`p-2.5 rounded-xl border transition-all ${
                dish.isWarning
                  ? 'bg-amber-50/90 border-amber-300 shadow-2xs'
                  : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className={`font-semibold text-sm sm:text-base leading-snug ${dish.isWarning ? 'text-amber-950 font-bold' : 'text-slate-800'}`}>
                  {dish.name}
                </span>

                {dish.isWarning && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-600 text-white rounded-md shrink-0">
                    주의
                  </span>
                )}
              </div>

              {/* Allergy Tag List */}
              {dish.allergyNames.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {dish.allergyNames.map((allergyName, aIdx) => {
                    const code = dish.allergyCodes[aIdx];
                    const isUserAllergic = userAllergies.includes(code);

                    return (
                      <span
                        key={aIdx}
                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-medium ${
                          isUserAllergic
                            ? 'bg-amber-600 text-white font-bold'
                            : 'bg-slate-200/70 text-slate-600'
                        }`}
                      >
                        {allergyName}
                      </span>
                    );
                  })}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Accordions for Nutrition & Origin */}
      <div className="border-t border-slate-100 bg-slate-50/50">
        {/* Nutrition Accordion Button */}
        {nutritionList.length > 0 && (
          <div className="border-b border-slate-100">
            <button
              onClick={() => setShowNutrition(!showNutrition)}
              className="w-full px-5 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-100/80 transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-600" />
                영양 성분 정보 ({nutritionList.length}항목)
              </span>
              {showNutrition ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showNutrition && (
              <div className="px-5 py-3 bg-white border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {nutritionList.map((nut, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-slate-400 text-[11px] font-medium">{nut.name}</div>
                    <div className="font-bold text-slate-800 mt-0.5">
                      {nut.value} {nut.unit}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Origin Info Accordion Button */}
        {originList.length > 0 && (
          <div>
            <button
              onClick={() => setShowOrigin(!showOrigin)}
              className="w-full px-5 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-100/80 transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-teal-600" />
                원산지 정보 ({originList.length}품목)
              </span>
              {showOrigin ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showOrigin && (
              <div className="px-5 py-3 bg-white border-t border-slate-100 max-h-48 overflow-y-auto divide-y divide-slate-100 text-xs">
                {originList.map((item, idx) => (
                  <div key={idx} className="py-1.5 flex items-center justify-between">
                    <span className="font-medium text-slate-700">{item.item}</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {item.origin}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
