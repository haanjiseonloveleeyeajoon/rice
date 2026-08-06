import React from 'react';
import { X, ShieldAlert, CheckSquare, Square, RotateCcw } from 'lucide-react';
import { ALLERGY_LIST } from '../constants/allergies';

interface AllergyFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAllergies: number[];
  onToggleAllergy: (code: number) => void;
  onResetAllergies: () => void;
}

export const AllergyFilterModal: React.FC<AllergyFilterModalProps> = ({
  isOpen,
  onClose,
  userAllergies,
  onToggleAllergy,
  onResetAllergies,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-950">개인 알레르기 설정</h2>
              <p className="text-xs text-amber-700">해당하는 성분을 선택하시면 식단에서 강조 표시됩니다</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Allergy List Grid */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ALLERGY_LIST.map((item) => {
              const checked = userAllergies.includes(item.code);

              return (
                <button
                  key={item.code}
                  onClick={() => onToggleAllergy(item.code)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-2 ${
                    checked
                      ? 'bg-amber-100/80 border-amber-400 text-amber-950 font-bold shadow-xs ring-1 ring-amber-400'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-400 mb-0.5">#{item.code}</div>
                    <div className="text-sm font-bold">{item.name}</div>
                    {item.description && (
                      <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">{item.description}</div>
                    )}
                  </div>
                  <div className="mt-0.5 text-amber-600">
                    {checked ? (
                      <CheckSquare className="w-4 h-4 text-amber-700 fill-amber-100" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onResetAllergies}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            초기화
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold transition-all shadow-xs"
          >
            설정 완료 ({userAllergies.length}개 선택됨)
          </button>
        </div>
      </div>
    </div>
  );
};
