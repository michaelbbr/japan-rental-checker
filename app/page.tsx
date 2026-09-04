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
      badge: "🏢 日本租房評分器",
      title: "貼上租屋網址，一眼看懂好壞",
      subtitle: "支援 SUUMO、DOOR賃貸、HOME'S 等，自動抓取規格、車站、生活機能與內見清單",
      placeholder: "貼上房源網址 (SUUMO / DOOR賃貸 / HOME'S)...",
      btnScore: "評分 ↵",
      btnScoring: "解析中...",
      tier1Title: "① 一眼看懂（六大指標）",
      tier1Subtitle: "客觀嚴格評級",
      tier2Title: "② 關鍵條件解析（優缺點合一）",
      meritPrefix: "👍 優點：",
      cautionPrefix: "⚠️ 注意：",
      demeritPrefix: "👎 缺點：",
      stationsTitle: "🚉 利用車站與交通路線（實用直達＆痛點）",
      destLabel: "📍 直達：",
      pitfallLabel: "注意：",
      amenitiesTitle: "🏪 生活機能速查（超市・超商・知名連鎖）",
      superLabel: "🛒 主力超市",
      cvsLabel: "🏪 超商定位與價格",
      chainLabel: "🍽️ 知名連鎖外食",
      tier3Title: "③ 內見時確認清單",
      copyChecklist: "📋 複製清單",
      copied: "✓ 已複製",
      footer: "日本租房評分工具 • 繁中 / 日本語 雙語支援 • 簡潔版",
      vacantBadge: "🔴 目前滿室（無招租中 / N/A）",
      vacantBadgeJa: "🔴 現在満室（募集中なし / N/A）"
    },
    ja: {
      badge: "🏢 賃貸チェッカー",
      title: "URLを貼るだけ、一瞬でまるわかり",
      subtitle: "SUUMO・DOOR賃貸等のURLから、条件・駅路線・周辺環境・内見ポイントを自動分析",
      placeholder: "物件URLを貼り付け (SUUMO / DOOR賃貸 / HOME'S)...",
      btnScore: "診断する ↵",
      btnScoring: "解析中...",
      tier1Title: "① 一眼看懂（6大レーティング）",
      tier1Subtitle: "客観的・厳格評価",
      tier2Title: "② 条件ごとの長所・短所（メリット＆デメリット）",
      meritPrefix: "👍 メリット：",
      cautionPrefix: "⚠️ 注意点：",
      demeritPrefix: "👎 デメリット：",
      stationsTitle: "🚉 利用可能駅・アクセスのリアル検証",
      destLabel: "📍 直通：",
      pitfallLabel: "注意：",
      amenitiesTitle: "🏪 生活インフラ速報（スーパー・コンビニ・有名外食）",
      superLabel: "🛒 メインスーパー",
      cvsLabel: "🏪 コンビニのポジショニング",
      chainLabel: "🍽️ 定番外食チェーン",
      tier3Title: "③ 内見時のチェックリスト",
      copyChecklist: "📋 コピー",
      copied: "✓ コピー完了",
      footer: "日本賃貸物件診断ツール • 日本語 / 繁体中文 対応 • シンプル版",
      vacantBadge: "🔴 目前滿室（無招租中 / N/A）",
      vacantBadgeJa: "🔴 現在満室（募集中なし / N/A）"
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
          {t.badge}
        </div>
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-medium shadow-xs">
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
      <div className="text-center mb-6 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {t.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {t.subtitle}
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

      {/* Error Message */}
      {error && (
        <div className="w-full mt-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl text-center">
          {error}
        </div>
      )}

      {/* Main Results View */}
      {evaluation && (
        <div className="w-full mt-6 space-y-4 animate-in fade-in duration-200">
          
          {/* Property Mini Header */}
          <div className="bg-white px-5 py-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-sm sm:text-base text-slate-900">{propertyTitle}</div>
              <div className="text-xs text-slate-500">{propertyMeta}</div>
            </div>
            <div className="text-right shrink-0">
              {evaluation.isVacant && propertyRent && !propertyRent.includes("N/A") ? (
                <div>
                  <span className="text-xl font-bold text-slate-900">{propertyRent}</span>
                </div>
              ) : (
                <div className="inline-block px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold">
                  {lang === 'zh' ? t.vacantBadge : t.vacantBadgeJa}
                </div>
              )}
            </div>
          </div>

          {/* ① 一眼看懂 (Six Dimensions) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
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
                else if (d.symbol === '▲') colorClass = "bg-rose-50 border-rose-200 text-rose-800";
                else colorClass = "bg-slate-100 border-slate-200 text-slate-500";

                return (
                  <div key={d.key} className={`p-2 sm:p-2.5 rounded-xl border ${colorClass} flex flex-col items-center justify-center`}>
                    <span className="text-[10px] sm:text-[11px] font-medium opacity-80">{d.label[lang]}</span>
                    <span className="text-base sm:text-lg font-bold my-0.5">{d.symbol}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ② 條件別解析（優缺點合一） */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-2">
              {t.tier2Title}
            </div>

            <div className="space-y-2">
              {evaluation.conditions.map(c => {
                let badgeClass = "bg-slate-100 text-slate-700 border-slate-200";
                if (c.overallType === 'positive') badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
                else if (c.overallType === 'neutral') badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
                else if (c.overallType === 'negative') badgeClass = "bg-rose-50 text-rose-700 border-rose-200";

                return (
                  <div key={c.id} className="p-3 rounded-xl border border-slate-150 bg-slate-50/50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-slate-900">{c.name[lang]}</span>
                      <span className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md border ${badgeClass}`}>
                        {c.overall[lang]}
                      </span>
                    </div>

                    <div className="space-y-0.5 text-xs text-slate-600">
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

          {/* 🚉 車站交通深度解析 */}
          {evaluation.stations && evaluation.stations.length > 0 && (
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                {t.stationsTitle}
              </div>
              <div className="space-y-2">
                {evaluation.stations.map((st, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-150 bg-slate-50/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">🚇</span>
                        <span className="font-bold text-xs sm:text-sm text-slate-900">{st.station}</span>
                        <span className="text-[11px] text-slate-500">（{st.line}）</span>
                      </div>
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        徒歩 {st.walkMin} 分
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-700 space-y-0.5 pt-0.5">
                      <div><strong className="text-slate-800">{t.destLabel}</strong> {st.destinations[lang]}</div>
                      <div className="text-amber-900"><strong className="text-amber-800">{t.pitfallLabel}</strong> {st.pitfalls[lang]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 🏪 生活機能速查（超市・超商・外食） - 簡潔三欄 */}
          {evaluation.amenities && (
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1.5">
                {t.amenitiesTitle}
              </div>

              {/* 3 Categories in Clean Grid */}
              <div className="space-y-3 text-xs">
                {/* 1. Supermarkets */}
                <div>
                  <div className="font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <span>{t.superLabel}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {evaluation.amenities.supermarkets.map((sm, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-150 space-y-0.5">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{sm.name}</span>
                          <span className="text-indigo-600 font-medium text-[11px]">{sm.walk}</span>
                        </div>
                        <p className="text-[11px] text-slate-600">{sm.note[lang]}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Convenience Stores Positioning */}
                <div>
                  <div className="font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <span>{t.cvsLabel}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {evaluation.amenities.convenienceStores.map((cvs, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-150 space-y-0.5">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900">{cvs.name}</span>
                          <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-medium">{cvs.tag[lang]}</span>
                        </div>
                        <p className="text-[11px] text-slate-600">{cvs.note[lang]}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Famous Chains */}
                <div>
                  <div className="font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <span>{t.chainLabel}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {evaluation.amenities.famousChains.map((fc, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-150 text-center space-y-0.5">
                        <div className="font-bold text-slate-900 text-xs">{fc.name}</div>
                        <div className="text-[10px] text-indigo-600 font-medium">{fc.tag[lang]}</div>
                        <div className="text-[10px] text-slate-500">{fc.walk}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ③ 內見時確認清單 */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
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
            
            <div className="space-y-1.5 text-xs">
              {evaluation.naiken.map((item, idx) => (
                <label key={idx} className="flex items-start gap-2 p-1 rounded hover:bg-slate-50 cursor-pointer">
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
      <footer className="w-full text-center mt-10 text-xs text-slate-400">
        {t.footer}
      </footer>
    </div>
  );
}
