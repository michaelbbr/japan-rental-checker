'use client';

import React, { useState } from 'react';
import { EvaluationResult } from '@/lib/types';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [propertyTitle, setPropertyTitle] = useState<string | null>(null);
  const [propertyMeta, setPropertyMeta] = useState<string | null>(null);
  const [propertyRent, setPropertyRent] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || '評分失敗，請確認網址有效性');
      }

      setPropertyTitle(data.title);
      setPropertyMeta(data.meta);
      setPropertyRent(data.rent);
      setEvaluation(data.evaluation);
    } catch (err: any) {
      setError(err.message || '連線逾時或抓取失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyChecklist = () => {
    if (!evaluation) return;
    const text = evaluation.naiken.map(c => `- [ ] [${c.name}] ${c.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10 flex-1 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium mb-1">
          <span>🏢</span> 日本租房 3 層評分器
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          貼上網址，一眼看懂好壞
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          支援貼上 SUUMO 房源網址，自動抓取規格並即時評分
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="w-full bg-white p-2 rounded-2xl shadow-sm border border-slate-200 focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-100 transition-all flex items-center gap-2">
        <span className="pl-3 text-slate-400 text-sm">🔗</span>
        <input
          type="url"
          required
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://suumo.jp/chintai/bc_..."
          className="flex-1 text-sm bg-transparent outline-none text-slate-800 placeholder:text-slate-400 py-1.5"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0"
        >
          {loading ? (
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              解析中...
            </span>
          ) : (
            <span>評分 ↵</span>
          )}
        </button>
      </form>

      {/* Quick Test Chips */}
      <div className="w-full mt-3 flex items-center gap-2 text-xs text-slate-500 px-1 flex-wrap">
        <span className="text-slate-400 text-[11px]">快速測試：</span>
        <button
          type="button"
          onClick={() => setUrl('https://suumo.jp/chintai/bc_100524309699/')}
          className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors text-[11px]"
        >
          永谷リヴュール新宿 (100524309699)
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full mt-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl text-center">
          {error}
        </div>
      )}

      {/* Results View */}
      {evaluation && (
        <div className="w-full mt-6 space-y-4">
          {/* Property Mini Header */}
          <div className="bg-white px-5 py-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-sm sm:text-base text-slate-900">{propertyTitle}</div>
              <div className="text-xs text-slate-500">{propertyMeta}</div>
            </div>
            {propertyRent && (
              <div className="text-right">
                <span className="text-lg font-bold text-slate-900">{propertyRent}</span>
                <span className="text-xs text-slate-500"> 万円</span>
              </div>
            )}
          </div>

          {/* ① 一眼看懂 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                ① 一眼看懂（六大指標）
              </span>
              <span className="text-slate-400 text-[11px]">綜合雷達評級</span>
            </div>

            <div className="grid grid-cols-6 gap-1.5 sm:gap-2 text-center">
              {evaluation.tier1.map(d => {
                let colorClass = "bg-slate-50 border-slate-200 text-slate-700";
                if (d.symbol === '◎') colorClass = "bg-emerald-50 border-emerald-200 text-emerald-800";
                else if (d.symbol === '○') colorClass = "bg-blue-50 border-blue-200 text-blue-800";
                else if (d.symbol === '△') colorClass = "bg-amber-50 border-amber-200 text-amber-800";
                else colorClass = "bg-rose-50 border-rose-200 text-rose-800";

                return (
                  <div key={d.key} className={`p-2.5 rounded-xl border ${colorClass} flex flex-col items-center justify-center`}>
                    <span className="text-[10px] sm:text-[11px] font-medium opacity-80">{d.label}</span>
                    <span className="text-base sm:text-lg font-bold my-0.5">{d.symbol}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ② 優點 / 缺點 / 注意點 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2.5">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                ② 優點 / 缺點 / 注意點（單句解析）
              </span>
              <div className="flex gap-2 text-[11px]">
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
                  👍 {evaluation.merits.length}
                </span>
                <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-medium">
                  ⚠️ {evaluation.cautions.length}
                </span>
                <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md font-medium">
                  👎 {evaluation.demerits.length}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-50">
              {evaluation.merits.map((m, idx) => (
                <div key={`m-${idx}`} className="pt-2 flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">👍 {m.name}</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-slate-600 leading-relaxed">{m.text}</span>
                </div>
              ))}
              {evaluation.cautions.map((c, idx) => (
                <div key={`c-${idx}`} className="pt-2 flex items-start gap-2">
                  <span className="text-amber-600 font-bold shrink-0">⚠️ {c.name}</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-slate-600 leading-relaxed">{c.text}</span>
                </div>
              ))}
              {evaluation.demerits.map((d, idx) => (
                <div key={`d-${idx}`} className="pt-2 flex items-start gap-2">
                  <span className="text-rose-600 font-bold shrink-0">👎 {d.name}</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-slate-600 leading-relaxed">{d.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ③ 內見時確認 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                ③ 內見時確認清單
              </span>
              <button
                onClick={handleCopyChecklist}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium"
              >
                {copied ? '✓ 已複製清單' : '📋 複製清單'}
              </button>
            </div>
            
            <div className="space-y-1.5 text-xs pt-1">
              {evaluation.naiken.map((item, idx) => (
                <label key={idx} className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 rounded text-slate-800 focus:ring-0" />
                  <span className="text-slate-700 leading-snug">
                    <strong className="font-medium text-slate-800">[{item.name}]</strong> {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full text-center mt-12 text-xs text-slate-400">
        日本租房評分工具 • 極簡 3 層架構 • Vercel Ready
      </footer>
    </div>
  );
}
