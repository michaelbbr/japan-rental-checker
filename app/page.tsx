'use client';

import React, { useState } from 'react';
import { EvaluationResult } from '@/lib/types';

export default function Home() {
  const [lang, setLang] = useState<'zh' | 'ja'>('zh');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [propertyTitle, setPropertyTitle] = useState<string | null>(null);
  const [propertyMeta, setPropertyMeta] = useState<string | null>(null);
  const [propertyRent, setPropertyRent] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [copied, setCopied] = useState(false);

  const t = {
    zh: {
      badge: "🏢 日本租房 3 層評分器",
      title: "貼上網址，一眼看懂好壞",
      subtitle: "貼上 SUUMO 房源網址，自動抓取規格、多車站、格局與街區評價",
      placeholder: "https://suumo.jp/chintai/bc_...",
      btnScore: "評分 ↵",
      btnScoring: "解析中...",
      quickTest: "快速測試：",
      sampleBtn: "永谷リヴュール新宿 (100524309699)",
      tier1Title: "① 一眼看懂（六大指標）",
      tier1Subtitle: "嚴格客觀加權",
      tier2Title: "② 條件別解析（優缺點合一）",
      tier2Count: "共 {n} 項條件",
      meritPrefix: "👍 優點：",
      cautionPrefix: "⚠️ 注意：",
      demeritPrefix: "👎 缺點：",
      stationsTitle: "🚉 可利用交通與車站（複数駅・路線）",
      layoutTitle: "📐 房型格局深度剖析（間取り分析）",
      areaTitle: "🏙️ 街區真實印象與生活氛圍（日本人眼中的西新宿）",
      costTitle: "💰 入住初期費用概算（租屋預算參考）",
      tier3Title: "③ 內見時確認清單",
      copyChecklist: "📋 複製清單",
      copied: "✓ 已複製清單",
      footer: "日本租房評分工具 • 繁中 / 日本語 雙語支援 • Vercel Ready",
      rentUnit: " 万円",
      totalCostPrefix: "預估總額："
    },
    ja: {
      badge: "🏢 賃貸物件チェッカー",
      title: "URLを貼るだけ、一瞬でまるわかり",
      subtitle: "SUUMOの物件URLを入力すると、条件・複数駅・間取り・街の住み心地を自動分析",
      placeholder: "https://suumo.jp/chintai/bc_...",
      btnScore: "診断する ↵",
      btnScoring: "解析中...",
      quickTest: "テスト用物件：",
      sampleBtn: "永谷リヴュール新宿 (100524309699)",
      tier1Title: "① 一眼看懂（6大レーティング）",
      tier1Subtitle: "厳格な客観評価",
      tier2Title: "② 条件ごとの長所・短所（メリット＆デメリット）",
      tier2Count: "全 {n} 項目",
      meritPrefix: "👍 メリット：",
      cautionPrefix: "⚠️ 注意点：",
      demeritPrefix: "👎 デメリット：",
      stationsTitle: "🚉 利用可能駅・アクセス（複数路線対応）",
      layoutTitle: "📐 間取り・専有面積のリアル分析",
      areaTitle: "🏙️ 街の住みやすさ・治安のリアルな印象",
      costTitle: "💰 初期費用の概算シミュレーション",
      tier3Title: "③ 内見時のチェックリスト",
      copyChecklist: "📋 リストをコピー",
      copied: "✓ コピー完了",
      footer: "日本賃貸物件診断ツール • 日本語 / 繁体中文 対応 • Vercel Ready",
      rentUnit: " 万円",
      totalCostPrefix: "概算目安："
    }
  }[lang];

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
    const text = evaluation.naiken.map(c => `- [ ] [${c.name[lang]}] ${c.text[lang]}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 flex-1 flex flex-col items-center">
      {/* Top Bar with Language Switcher */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
          {t.badge}
        </div>
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-medium">
          <button
            onClick={() => setLang('zh')}
            className={`px-2.5 py-1 rounded-md transition-colors ${lang === 'zh' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'}`}
          >
            繁體中文
          </button>
          <button
            onClick={() => setLang('ja')}
            className={`px-2.5 py-1 rounded-md transition-colors ${lang === 'ja' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'}`}
          >
            日本語
          </button>
        </div>
      </div>

      {/* Hero Title */}
      <div className="text-center mb-6 space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {t.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg">
          {t.subtitle}
        </p>
      </div>

      {/* URL Input Box */}
      <form onSubmit={handleSubmit} className="w-full bg-white p-2 rounded-2xl shadow-sm border border-slate-200 focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-100 transition-all flex items-center gap-2">
        <span className="pl-3 text-slate-400 text-sm">🔗</span>
        <input
          type="url"
          required
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder={t.placeholder}
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
              {t.btnScoring}
            </span>
          ) : (
            <span>{t.btnScore}</span>
          )}
        </button>
      </form>

      {/* Quick Test Chip */}
      <div className="w-full mt-3 flex items-center gap-2 text-xs text-slate-500 px-1 flex-wrap">
        <span className="text-slate-400 text-[11px]">{t.quickTest}</span>
        <button
          type="button"
          onClick={() => setUrl('https://suumo.jp/chintai/bc_100524309699/')}
          className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors text-[11px]"
        >
          {t.sampleBtn}
        </button>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="w-full mt-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl text-center">
          {error}
        </div>
      )}

      {/* Main Results View */}
      {evaluation && (
        <div className="w-full mt-6 space-y-4 animate-in fade-in duration-200">
          
          {/* Property Header */}
          <div className="bg-white px-5 py-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-sm sm:text-base text-slate-900">{propertyTitle}</div>
              <div className="text-xs text-slate-500">{propertyMeta}</div>
            </div>
            {propertyRent && (
              <div className="text-right">
                <span className="text-lg font-bold text-slate-900">{propertyRent}</span>
                <span className="text-xs text-slate-500">{t.rentUnit}</span>
              </div>
            )}
          </div>

          {/* Multiple Stations Access Bar */}
          {evaluation.stations.length > 0 && (
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                {t.stationsTitle}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {evaluation.stations.map((st, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center gap-2">
                    <span className="text-base">🚇</span>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-800">{st.station}</div>
                      <div className="text-[11px] text-slate-500">
                        {st.line} • <strong className="text-indigo-600 font-semibold">{st.walkMin}分</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ① 一眼看懂 (Ratings calibrated rigorously) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                {t.tier1Title}
              </span>
              <span className="text-slate-400 text-[11px]">{t.tier1Subtitle}</span>
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
                    <span className="text-[10px] sm:text-[11px] font-medium opacity-80">{d.label[lang]}</span>
                    <span className="text-base sm:text-lg font-bold my-0.5">{d.symbol}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ② 條件別解析（同項目優缺點整合） */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2.5">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                {t.tier2Title}
              </span>
              <span className="text-slate-400 text-[11px]">
                {t.tier2Count.replace('{n}', evaluation.conditions.length.toString())}
              </span>
            </div>

            <div className="space-y-3">
              {evaluation.conditions.map(c => {
                let badgeClass = "bg-slate-100 text-slate-700 border-slate-200";
                if (c.overallType === 'positive') {
                  badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
                } else if (c.overallType === 'neutral') {
                  badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
                } else if (c.overallType === 'negative') {
                  badgeClass = "bg-rose-50 text-rose-700 border-rose-200";
                }

                return (
                  <div key={c.id} className="p-3.5 rounded-xl border border-slate-150 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-800">{c.name[lang]}</span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${badgeClass}`}>
                        {c.overall[lang]}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600">
                      {c.merits.map((m, idx) => (
                        <div key={`m-${idx}`} className="flex items-start gap-1.5 text-emerald-950">
                          <span className="font-bold text-emerald-600 shrink-0">{t.meritPrefix}</span>
                          <span>{m[lang]}</span>
                        </div>
                      ))}
                      {c.cautions.map((caution, idx) => (
                        <div key={`c-${idx}`} className="flex items-start gap-1.5 text-amber-950">
                          <span className="font-bold text-amber-600 shrink-0">{t.cautionPrefix}</span>
                          <span>{caution[lang]}</span>
                        </div>
                      ))}
                      {c.demerits.map((d, idx) => (
                        <div key={`d-${idx}`} className="flex items-start gap-1.5 text-rose-950">
                          <span className="font-bold text-rose-600 shrink-0">{t.demeritPrefix}</span>
                          <span>{d[lang]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ③ 間取り格局深入剖析 */}
          {evaluation.layoutAnalysis && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                {t.layoutTitle}
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-150 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{evaluation.layoutAnalysis.type}</span>
                  <span className="text-slate-500 font-medium">{evaluation.layoutAnalysis.area}</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {evaluation.layoutAnalysis.comment[lang]}
                </p>
                <div className="pt-1 space-y-1">
                  {evaluation.layoutAnalysis.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-slate-600 text-[11px]">
                      <span className="text-indigo-600">💡</span>
                      <span>{tip[lang]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ④ 街區印象與真實居住氛圍 */}
          {evaluation.areaImpression && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                {t.areaTitle}
              </div>
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-150 space-y-3 text-xs leading-relaxed">
                <div className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-1.5">
                  📍 {evaluation.areaImpression.areaName}
                </div>
                <p className="text-slate-700">
                  {evaluation.areaImpression.summary[lang]}
                </p>
                <div className="grid grid-cols-1 gap-2 pt-1">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-150">
                    <span className="text-slate-800 font-semibold">{evaluation.areaImpression.safety[lang]}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-150">
                    <span className="text-slate-800 font-semibold">{evaluation.areaImpression.convenience[lang]}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-150">
                    <span className="text-slate-800 font-semibold">{evaluation.areaImpression.environment[lang]}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ⑤ 初期費用概算試算 */}
          {evaluation.initialCost && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                  {t.costTitle}
                </span>
                <span className="font-bold text-indigo-700">
                  {t.totalCostPrefix} {evaluation.initialCost.totalEstimate}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                {evaluation.initialCost.items.map((it, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-150 flex items-center justify-between">
                    <span className="text-slate-600">{it.name[lang]}</span>
                    <span className="font-bold text-slate-900">{it.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ⑥ 內見時確認清單 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                {t.tier3Title}
              </span>
              <button
                onClick={handleCopyChecklist}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium"
              >
                {copied ? t.copied : t.copyChecklist}
              </button>
            </div>
            
            <div className="space-y-1.5 text-xs pt-1">
              {evaluation.naiken.map((item, idx) => (
                <label key={idx} className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 rounded text-slate-800 focus:ring-0" />
                  <span className="text-slate-700 leading-snug">
                    <strong className="font-medium text-slate-800">[{item.name[lang]}]</strong> {item.text[lang]}
                  </span>
                </label>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Footer */}
      <footer className="w-full text-center mt-12 text-xs text-slate-400">
        {t.footer}
      </footer>
    </div>
  );
}
