'use client';

import React, { useState } from 'react';
import { EvaluationResult, Language } from '@/lib/types';

export default function Home() {
  // 3. Default language set to Japanese ('ja') as requested!
  const [lang, setLang] = useState<Language>('ja');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [propertyTitle, setPropertyTitle] = useState<string | null>(null);
  const [propertyMeta, setPropertyMeta] = useState<string | null>(null);
  const [propertyRent, setPropertyRent] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedDimensionKey, setSelectedDimensionKey] = useState<string>('quietness');

  const t = {
    ja: {
      badge: "日本賃貸 総合診断",
      title: "物件URLを貼るだけ、一目でわかる",
      subtitle: "SUUMO・DOOR賃貸等のURLから、物件規格・耐震リスク・駅アクセス・実生活インフラを即時分析",
      placeholder: "物件URLを貼り付け (SUUMO / DOOR賃貸 / HOME'S)...",
      btnScore: "診断する ↵",
      btnScoring: "解析中...",
      tier1Title: "① 一眼看懂（6大レーティング）",
      tier1Subtitle: "指標をタップして判定根拠を表示",
      tier2Title: "② 条件ごとの長所・短所（メリット＆デメリット）",
      meritPrefix: "長所：",
      cautionPrefix: "注意：",
      demeritPrefix: "短所：",
      stationsTitle: "🚉 利用可能駅（タップでGoogleマップ徒歩ルート案内）",
      destLabel: "直通：",
      pitfallLabel: "注意：",
      amenitiesTitle: "🏪 生活インフラ速報（タップで店舗への徒歩ルート案内）",
      superLabel: "🛒 周辺スーパー（位置づけ＆価格帯）",
      cvsLabel: "🏪 コンビニのポジショニング＆価格帯",
      chainLabel: "🍽️ 定番外食チェーン",
      walkRouteHint: "徒歩ルート ↗",
      tier3Title: "③ 内見時のチェックリスト",
      copyChecklist: "チェックリストをコピー",
      copied: "コピー完了",
      footer: "日本賃貸物件診断ツール • 和風モダンUI • Google Maps リアルタイム徒歩ナビ連携",
      vacantBadge: "現在満室（募集中なし / N/A）",
      mapsLiveBadge: "Google Maps API 連携中",
      reasonBoxHeader: "評価理由・判定根拠",
      switchPrompt: "他の指標をタップで切替"
    },
    zh: {
      badge: "日本租房 綜合評估",
      title: "貼上租屋網址，一眼看懂好壞",
      subtitle: "支援 SUUMO、DOOR賃貸、HOME'S 等，自動分析規格、耐震風險、車站動線與周邊真實機能",
      placeholder: "貼上房源網址 (SUUMO / DOOR賃貸 / HOME'S)...",
      btnScore: "評分 ↵",
      btnScoring: "解析中...",
      tier1Title: "① 一眼看懂（六大指標）",
      tier1Subtitle: "點擊或懸停指標查看評分理由",
      tier2Title: "② 關鍵條件解析（優缺點合一）",
      meritPrefix: "優點：",
      cautionPrefix: "注意：",
      demeritPrefix: "缺點：",
      stationsTitle: "🚉 利用車站與交通動線（點擊查看 Google Maps 徒步路線）",
      destLabel: "直達：",
      pitfallLabel: "注意：",
      amenitiesTitle: "🏪 生活機能速查（點擊店家開啟 Google Maps 徒步導航）",
      superLabel: "🛒 主力超市（定位＆價格檔次）",
      cvsLabel: "🏪 超商定位與價格檔次",
      chainLabel: "🍽️ 周邊知名連鎖外食",
      walkRouteHint: "徒步導航 ↗",
      tier3Title: "③ 內見時確認清單",
      copyChecklist: "複製清單",
      copied: "已複製",
      footer: "日本租房評分工具 • 日式簡約設計 • Google Maps 徒步導航串接",
      vacantBadge: "目前滿室（無招租中 / N/A）",
      mapsLiveBadge: "Google Maps API 即時資料",
      reasonBoxHeader: "評分理由與依據",
      switchPrompt: "點擊上方指標切換"
    },
    zhCN: {
      badge: "日本租房 综合评估",
      title: "贴上租房网址，一眼看懂好坏",
      subtitle: "支持 SUUMO、DOOR租赁、HOME'S 等，自动分析房屋规格、耐震风险、车站路线与周边真实生活设施",
      placeholder: "贴上房源网址 (SUUMO / DOOR租赁 / HOME'S)...",
      btnScore: "评分 ↵",
      btnScoring: "解析中...",
      tier1Title: "① 一眼看懂（六大指标）",
      tier1Subtitle: "点击或悬停指标查看评分理由",
      tier2Title: "② 关键条件解析（优缺点合一）",
      meritPrefix: "优点：",
      cautionPrefix: "注意：",
      demeritPrefix: "缺点：",
      stationsTitle: "🚉 利用车站与交通路线（点击查看 Google Maps 步行路线）",
      destLabel: "直达：",
      pitfallLabel: "注意：",
      amenitiesTitle: "🏪 生活设施速查（点击店铺开启 Google Maps 步行导航）",
      superLabel: "🛒 主力超市（定位＆价格档次）",
      cvsLabel: "🏪 便利店定位与价格档次",
      chainLabel: "🍽️ 周边知名连锁餐饮",
      walkRouteHint: "步行导航 ↗",
      tier3Title: "③ 看房时确认清单",
      copyChecklist: "复制清单",
      copied: "已复制",
      footer: "日本租房评分工具 • 日式极简设计 • Google Maps 步行导航联动",
      vacantBadge: "目前满室（无招租中 / N/A）",
      mapsLiveBadge: "Google Maps API 实时数据",
      reasonBoxHeader: "评分理由与依据",
      switchPrompt: "点击上方指标切换"
    },
    en: {
      badge: "Japan Rental Analyzer",
      title: "Paste Property URL, Understand in Seconds",
      subtitle: "Instant analysis of building specs, earthquake risk, station access, and nearby grocery/dining",
      placeholder: "Paste property URL (SUUMO / DOOR / HOME'S)...",
      btnScore: "Analyze ↵",
      btnScoring: "Analyzing...",
      tier1Title: "① At a Glance (6 Core Dimensions)",
      tier1Subtitle: "Click/tap any dimension to view scoring rationale",
      tier2Title: "② Condition Breakdown (Pros & Cons)",
      meritPrefix: "Pros: ",
      cautionPrefix: "Caution: ",
      demeritPrefix: "Cons: ",
      stationsTitle: "🚉 Station & Transit Access (Click for Google Maps Walking Route)",
      destLabel: "Direct to: ",
      pitfallLabel: "Caution: ",
      amenitiesTitle: "🏪 Neighborhood Amenities (Click place for Google Maps walking route)",
      superLabel: "🛒 Supermarkets (Positioning & Price Level)",
      cvsLabel: "🏪 Convenience Stores (Positioning & Price Level)",
      chainLabel: "🍽️ Famous Chain Restaurants",
      walkRouteHint: "Walking Route ↗",
      tier3Title: "③ Viewing Checklist",
      copyChecklist: "Copy Checklist",
      copied: "Copied!",
      footer: "Japan Rental Property Checker • Minimalist Japanese UI • Google Maps Walking Route Integration",
      vacantBadge: "Currently Fully Occupied (N/A)",
      mapsLiveBadge: "Google Maps API Live Data",
      reasonBoxHeader: "Scoring Rationale",
      switchPrompt: "Tap another dimension to switch"
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
        throw new Error(data.error || '解析に失敗しました。URLをご確認ください。');
      }

      setPropertyTitle(data.title);
      setPropertyMeta(data.meta);
      setPropertyRent(data.rent);
      setEvaluation(data.evaluation);
      if (data.evaluation?.tier1?.length > 0) {
        setSelectedDimensionKey(data.evaluation.tier1[0].key);
      }
    } catch (err: any) {
      setError(err.message || '通信エラーまたは取得失敗');
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

  const activeDimension = evaluation?.tier1.find(d => d.key === selectedDimensionKey) || evaluation?.tier1[0];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 flex-1 flex flex-col items-center font-sans antialiased text-[#2D3748]">
      {/* Top Bar with 4-Language Switcher (Japanese Default) */}
      <div className="w-full flex items-center justify-between mb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2f3f5] text-[#4A5568] text-[11px] font-medium tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
          {t.badge}
        </div>

        {/* 4-Language Japanese Modern Style Pill */}
        <div className="flex items-center bg-white border border-[#E2E8F0] rounded-lg p-0.5 text-xs font-medium shadow-2xs">
          <button
            onClick={() => setLang('ja')}
            className={`px-2.5 py-1 rounded-md transition-all ${lang === 'ja' ? 'bg-[#1A202C] text-white shadow-xs font-semibold' : 'text-[#718096] hover:text-[#2D3748]'}`}
          >
            日本語
          </button>
          <button
            onClick={() => setLang('zh')}
            className={`px-2.5 py-1 rounded-md transition-all ${lang === 'zh' ? 'bg-[#1A202C] text-white shadow-xs font-semibold' : 'text-[#718096] hover:text-[#2D3748]'}`}
          >
            繁中
          </button>
          <button
            onClick={() => setLang('zhCN')}
            className={`px-2.5 py-1 rounded-md transition-all ${lang === 'zhCN' ? 'bg-[#1A202C] text-white shadow-xs font-semibold' : 'text-[#718096] hover:text-[#2D3748]'}`}
          >
            简中
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-2.5 py-1 rounded-md transition-all ${lang === 'en' ? 'bg-[#1A202C] text-white shadow-xs font-semibold' : 'text-[#718096] hover:text-[#2D3748]'}`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Hero Title (Japanese Minimalist) */}
      <div className="text-center mb-6 space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A202C]">
          {t.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#718096] max-w-lg mx-auto leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="w-full bg-white p-2 rounded-2xl shadow-xs border border-[#CBD5E0] focus-within:border-[#718096] focus-within:ring-4 focus-within:ring-slate-100 transition-all flex items-center gap-2">
        <span className="pl-3 text-[#A0AEC0] text-sm">🔗</span>
        <input
          type="url"
          required
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder={t.placeholder}
          className="flex-1 text-sm bg-transparent outline-none text-[#2D3748] placeholder:text-[#A0AEC0] py-1.5"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#1A202C] hover:bg-[#2D3748] disabled:bg-[#CBD5E0] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0"
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
          <div className="bg-white px-5 py-4 rounded-2xl border border-[#E2E8F0] shadow-2xs flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-sm sm:text-base text-[#1A202C]">{propertyTitle}</div>
              <div className="text-xs text-[#718096]">{propertyMeta}</div>
            </div>
            <div className="text-right shrink-0">
              {evaluation.isVacant && propertyRent && !propertyRent.includes("N/A") ? (
                <div>
                  <span className="text-xl font-bold text-[#1A202C] tracking-tight">{propertyRent}</span>
                </div>
              ) : (
                <div className="inline-block px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold">
                  {t.vacantBadge}
                </div>
              )}
            </div>
          </div>

          {/* ① 一眼看懂 (Interactive 6 Dimensions with Explanations) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#718096] tracking-wider text-[11px]">
                {t.tier1Title}
              </span>
              <span className="text-[#A0AEC0] text-[11px]">{t.tier1Subtitle}</span>
            </div>

            {/* 6 Dimension Badges */}
            <div className="grid grid-cols-6 gap-1.5 sm:gap-2 text-center">
              {evaluation.tier1.map(d => {
                const isSelected = activeDimension?.key === d.key;
                let colorClass = "bg-[#F7FAFC] border-[#E2E8F0] text-[#4A5568]";
                if (d.symbol === '◎') colorClass = "bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]";
                else if (d.symbol === '○') colorClass = "bg-[#EFF6FF] border-[#BFDBFE] text-[#1D4ED8]";
                else if (d.symbol === '△') colorClass = "bg-[#FFFBEB] border-[#FDE68A] text-[#B45309]";
                else if (d.symbol === '▲') colorClass = "bg-[#FFF1F2] border-[#FECDD3] text-[#BE123C]";
                else colorClass = "bg-[#F1F5F9] border-[#E2E8F0] text-[#64748B]";

                return (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => setSelectedDimensionKey(d.key)}
                    onMouseEnter={() => setSelectedDimensionKey(d.key)}
                    className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center ${colorClass} ${
                      isSelected ? 'ring-2 ring-[#1A202C] shadow-xs scale-105' : 'hover:opacity-90'
                    }`}
                  >
                    <span className="text-[10px] sm:text-[11px] font-medium opacity-80">{d.label[lang]}</span>
                    <span className="text-base sm:text-lg font-bold my-0.5">{d.symbol}</span>
                    <span className="text-[9px] opacity-60 underline">理由 ▾</span>
                  </button>
                );
              })}
            </div>

            {/* Active Dimension Reason Box (Japanese Minimalist Dark Drawer) */}
            {activeDimension && (
              <div className="p-3.5 rounded-xl bg-[#1A202C] text-white text-xs space-y-1 animate-in fade-in duration-150">
                <div className="flex justify-between items-center font-bold">
                  <span className="flex items-center gap-1.5">
                    <span>💡</span>
                    <span>{activeDimension.label[lang]}【{activeDimension.symbol}】{t.reasonBoxHeader}</span>
                  </span>
                  <span className="text-[10px] text-[#A0AEC0] font-normal">{t.switchPrompt}</span>
                </div>
                <p className="text-[#E2E8F0] leading-relaxed pt-0.5">
                  {activeDimension.reason[lang]}
                </p>
              </div>
            )}
          </div>

          {/* ② 条件別メリット・デメリット（優缺點合一） */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-3">
            <div className="text-xs font-bold text-[#718096] tracking-wider text-[11px] border-b border-[#F7FAFC] pb-2">
              {t.tier2Title}
            </div>

            <div className="space-y-2">
              {evaluation.conditions.map(c => {
                let badgeClass = "bg-[#F7FAFC] text-[#4A5568] border-[#E2E8F0]";
                if (c.overallType === 'positive') badgeClass = "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]";
                else if (c.overallType === 'neutral') badgeClass = "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]";
                else if (c.overallType === 'negative') badgeClass = "bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3]";

                return (
                  <div key={c.id} className="p-3 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC]/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-[#1A202C]">{c.name[lang]}</span>
                      <span className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md border ${badgeClass}`}>
                        {c.overall[lang]}
                      </span>
                    </div>

                    <div className="space-y-0.5 text-xs text-[#4A5568]">
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

          {/* 🚉 駅アクセス（タップでGoogleマップ徒歩ルート） */}
          {evaluation.stations && evaluation.stations.length > 0 && (
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#718096] tracking-wider text-[11px]">
                  {t.stationsTitle}
                </span>
              </div>
              <div className="space-y-2">
                {evaluation.stations.map((st, idx) => (
                  <a
                    key={idx}
                    href={st.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(st.station)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-xl border border-[#EDF2F7] bg-[#F7FAFC]/80 hover:bg-[#EDF2F7]/70 transition-all space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">🚇</span>
                        <span className="font-bold text-xs sm:text-sm text-[#1A202C] group-hover:text-indigo-600 transition-colors">
                          {st.station}
                        </span>
                        <span className="text-[11px] text-[#718096]">（{st.line}）</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          徒歩 {st.walkMin} 分
                        </span>
                        <span className="text-[10px] text-indigo-600 opacity-80 group-hover:opacity-100">{t.walkRouteHint}</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-[#4A5568] space-y-0.5 pt-0.5">
                      <div><strong className="text-[#2D3748]">{t.destLabel}</strong> {st.destinations[lang]}</div>
                      <div className="text-amber-900"><strong className="text-amber-800">{t.pitfallLabel}</strong> {st.pitfalls[lang]}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 🏪 周辺インフラ速報（タップでGoogleマップ店舗徒歩ルート） */}
          {evaluation.amenities && (
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#F7FAFC] pb-2">
                <span className="text-xs font-bold text-[#718096] tracking-wider text-[11px]">
                  {t.amenitiesTitle}
                </span>
                {evaluation.amenities.isGoogleMapsLive && (
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                    {t.mapsLiveBadge}
                  </span>
                )}
              </div>

              {/* 1. Supermarkets (Real Stores Only, Clean Deduplicated) */}
              <div className="space-y-1.5">
                <div className="font-bold text-[#4A5568] text-xs">
                  {t.superLabel}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {evaluation.amenities.supermarkets.map((sm, idx) => (
                    <a
                      key={idx}
                      href={sm.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sm.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2.5 rounded-xl bg-[#F7FAFC] border border-[#EDF2F7] hover:border-indigo-300 hover:bg-[#EDF2F7]/60 transition-all space-y-1 group cursor-pointer"
                    >
                      <div className="flex justify-between font-bold text-[#1A202C]">
                        <span className="leading-tight group-hover:text-indigo-600 transition-colors">{sm.name}</span>
                        <span className="text-indigo-600 font-medium text-[11px] shrink-0 ml-1">{sm.walk}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-medium">{sm.tag[lang]}</span>
                          {sm.priceLevel && <span className="text-amber-700 font-medium">{sm.priceLevel[lang]}</span>}
                        </div>
                        <span className="text-indigo-600 font-medium opacity-80 group-hover:opacity-100">{t.walkRouteHint}</span>
                      </div>
                      <p className="text-[11px] text-[#4A5568] leading-snug">{sm.note[lang]}</p>
                    </a>
                  ))}
                </div>
              </div>

              {/* 2. Convenience Stores */}
              <div className="space-y-1.5 pt-1">
                <div className="font-bold text-[#4A5568] text-xs">
                  {t.cvsLabel}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {evaluation.amenities.convenienceStores.map((cvs, idx) => (
                    <a
                      key={idx}
                      href={cvs.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cvs.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2.5 rounded-xl bg-[#F7FAFC] border border-[#EDF2F7] hover:border-indigo-300 hover:bg-[#EDF2F7]/60 transition-all space-y-1 group cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#1A202C] group-hover:text-indigo-600 transition-colors">{cvs.name}</span>
                        <span className="text-[10px] text-[#718096] font-medium">{cvs.walk}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-medium">{cvs.tag[lang]}</span>
                          {cvs.priceLevel && <span className="text-amber-700 font-medium">{cvs.priceLevel[lang]}</span>}
                        </div>
                        <span className="text-indigo-600 font-medium opacity-80 group-hover:opacity-100">{t.walkRouteHint}</span>
                      </div>
                      <p className="text-[11px] text-[#4A5568] leading-snug">{cvs.note[lang]}</p>
                    </a>
                  ))}
                </div>
              </div>

              {/* 3. Famous Chains */}
              <div className="space-y-1.5 pt-1">
                <div className="font-bold text-[#4A5568] text-xs">
                  {t.chainLabel}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {evaluation.amenities.famousChains.map((fc, idx) => (
                    <a
                      key={idx}
                      href={fc.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fc.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2 rounded-xl bg-[#F7FAFC] border border-[#EDF2F7] hover:border-indigo-300 hover:bg-[#EDF2F7]/60 transition-all space-y-0.5 group cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-[#1A202C] text-xs leading-tight group-hover:text-indigo-600 transition-colors">{fc.name}</span>
                        <span className="text-[10px] text-indigo-600 font-medium shrink-0 ml-1">{fc.walk}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[#718096]">
                        <div className="flex items-center gap-1">
                          <span>{fc.tag[lang]}</span>
                          {fc.budget && <span>• {fc.budget}</span>}
                        </div>
                        <span className="text-indigo-600 font-medium opacity-80 group-hover:opacity-100">↗</span>
                      </div>
                      <p className="text-[10px] text-[#4A5568] leading-tight pt-0.5">{fc.note[lang]}</p>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ③ 内見時の確認リスト */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#F7FAFC] pb-2">
              <span className="font-bold text-[#718096] tracking-wider text-[11px]">
                {t.tier3Title}
              </span>
              <button
                onClick={handleCopyChecklist}
                className="text-xs text-[#718096] hover:text-[#1A202C] font-medium"
              >
                {copied ? t.copied : t.copyChecklist}
              </button>
            </div>
            
            <div className="space-y-1.5 text-xs">
              {evaluation.naiken.map((item, idx) => (
                <label key={idx} className="flex items-start gap-2 p-1 rounded hover:bg-[#F7FAFC] cursor-pointer">
                  <input type="checkbox" className="mt-0.5 rounded text-[#1A202C] focus:ring-0" />
                  <span className="text-[#4A5568] leading-snug">
                    <strong className="font-medium text-[#1A202C]">[{item.name[lang]}]</strong> {item.text[lang]}
                  </span>
                </label>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Footer */}
      <footer className="w-full text-center mt-10 text-xs text-[#A0AEC0]">
        {t.footer}
      </footer>
    </div>
  );
}
