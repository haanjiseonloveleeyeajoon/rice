import React, { useState } from 'react';
import { X, Rocket, Check, ExternalLink, Code2, Globe, ShieldCheck } from 'lucide-react';

interface VercelDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelDeployModal: React.FC<VercelDeployModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const vercelJsonCode = `{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`;

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(vercelJsonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-xs">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Vercel 배포 가이드</h2>
              <p className="text-xs text-slate-300">본 앱을 Vercel에 무료로 원클릭 배포하는 방법</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Status Badge */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900">
              <p className="font-bold text-sm text-emerald-950 mb-0.5">Vercel 배포 준비 완료!</p>
              본 프로젝트에는 프로젝트 루트에 <code className="bg-emerald-100 px-1.5 py-0.5 rounded font-mono text-emerald-900">vercel.json</code> 라우팅 설정 파일이 포함되어 있어, Vercel에서 즉시 빌드 및 배포가 가능합니다.
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">배포 단계 안내</h3>

            <div className="space-y-3 text-sm">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </div>
                <div>
                  <div className="font-bold text-slate-900">깃허브 레포지토리 생성 및 푸시</div>
                  <div className="text-xs text-slate-500 mt-1">
                    프로젝트 코드를 본인의 GitHub 저장소(Repository)에 푸시(push)합니다.
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </div>
                <div>
                  <div className="font-bold text-slate-900">Vercel에서 프로젝트 임포트</div>
                  <div className="text-xs text-slate-500 mt-1">
                    <a
                      href="https://vercel.com/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 underline font-semibold flex items-center gap-1 inline-flex"
                    >
                      Vercel Dashboard <ExternalLink className="w-3 h-3" />
                    </a>
                    에 접속하여 방금 올린 GitHub 저장소를 선택합니다.
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </div>
                <div>
                  <div className="font-bold text-slate-900">빌드 설정 확인 & [Deploy] 클릭</div>
                  <div className="text-xs text-slate-500 mt-1 space-y-1">
                    <p>• Framework Preset: <strong>Vite</strong></p>
                    <p>• Build Command: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">npm run build</code></p>
                    <p>• Output Directory: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">dist</code></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* vercel.json snippet */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-emerald-600" />
                포함된 vercel.json 파일
              </span>
              <button
                onClick={handleCopyConfig}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
                <span>{copied ? '복사됨' : '설정 복사'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto">
              {vercelJsonCode}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-between items-center">
          <a
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Vercel로 이동하기</span>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
