'use client';

import React, { useState } from 'react';
import { EvaluationResult, Language } from '@/lib/types';

export default function Home() {
  // Default language is Japanese ('ja')
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
      badge: "Japan Rental Intelligence",
      title: "日本の部屋探しを、スマートに診断。",
      subtitle: "SUUMOなどのURLを貼るだけで、物件の耐震性・駅動線・真の生活インフラを一瞬で可視化",
      placeholder: "物件URLを入力 (SUUMO / DOOR賃貸 / HOME'S)...",
      btnScore: "診断する",
      btnScoring: "分析中...",
      tier1Title: "総合レーティング",
      tier1Subtitle: "タップして詳細な判定根拠を確認",
      tier2Title: "条件別メリット・注意点",
      meritPrefix: "メリット：",
      cautionPrefix: "注意点：",
      demeritPrefix: "デメリット：",
      stationsTitle: "最寄り駅・アクセス",
      destLabel: "直通方面：",
      pitfallLabel: "留意点：",
      amenitiesTitle: "周辺生活インフラ",
      superLabel: "スーパーマーケット（位置づけ＆価格帯）",
      cvsLabel: "コンビニエンスストア",
      chainLabel: "定番外食チェーン",
      walkRouteHint: "徒歩ルート案内 ↗",
      tier3Title: "内見時チェックリスト",
      copyChecklist: "リストをコピー",
      copied: "コピー完了",
      footer: "Japan Rental Analyzer • Apple HIG Design • Google Maps 徒歩ナビ連携",
      vacantBadge: "現在満室（募集中なし / N/A）",
      mapsLiveBadge: "Google Maps 連携",
      reasonBoxHeader: "判定理由",
      switchPrompt: "他の指標をタップして切替"
    },
    zh: {
      badge: "日本租房智慧評估",
      title: "日本租房，一鍵智慧診斷。",
      subtitle: "貼上 SUUMO 網址，瞬間透視房屋規格、耐震風險、車站動線與周邊真實生活機能",
      placeholder: "輸入房源網址 (SUUMO / DOOR賃貸 / HOME'S)...",
      btnScore: "開始診斷",
      btnScoring: "分析中...",
      tier1Title: "核心指標總評",
      tier1Subtitle: "點擊或懸停指標查看客觀評分理由",
      tier2Title: "條件優缺點深度解析",
      meritPrefix: "優點：",
      cautionPrefix: "注意：",
      demeritPrefix: "缺點：",
      stationsTitle: "利用車站與交通動線",
      destLabel: "直達：",
      pitfallLabel: "注意：",
      amenitiesTitle: "周邊生活機能速查",
      superLabel: "周邊超市（定位＆價格檔次）",
      cvsLabel: "超商定位與價格檔次",
      chainLabel: "周邊知名連鎖外食",
      walkRouteHint: "徒步導航 ↗",
      tier3Title: "現場內見確認清單",
      copyChecklist: "複製清單",
      copied: "已複製",
      footer: "Japan Rental Analyzer • Apple HIG Design • Google Maps 徒步導航串接",
      vacantBadge: "目前滿室（無招租中 / N/A）",
      mapsLiveBadge: "Google Maps 即時連線",
      reasonBoxHeader: "評分理由與依據",
      switchPrompt: "點擊上方指標切換"
    },
    zhCN: {
      badge: "日本租房智慧评估",
      title: "日本租房，一键智慧诊断。",
      subtitle: "贴上 SUUMO 网址，瞬间透视房屋规格、耐震风险、车站动线与周边真实生活设施",
      placeholder: "输入房源网址 (SUUMO / DOOR租赁 / HOME'S)...",
      btnScore: "开始诊断",
      btnScoring: "分析中...",
      tier1Title: "核心指标总评",
      tier1Subtitle: "点击或悬停指标查看客观评分理由",
      tier2Title: "条件优缺点深度解析",
      meritPrefix: "优点：",
      cautionPrefix: "注意：",
      demeritPrefix: "缺点：",
      stationsTitle: "利用车站与交通路线",
      destLabel: "直达：",
      pitfallLabel: "注意：",
      amenitiesTitle: "周边生活设施速查",
      superLabel: "周边超市（定位＆价格档次）",
      cvsLabel: "便利店定位与价格档次",
      chainLabel: "周边知名连锁餐饮",
      walkRouteHint: "步行导航 ↗",
      tier3Title: "现场看房确认清单",
      copyChecklist: "复制清单",
      copied: "已复制",
      footer: "Japan Rental Analyzer • Apple HIG Design • Google Maps 步行导航联动",
      vacantBadge: "目前满室（无招租中 / N/A）",
      mapsLiveBadge: "Google Maps 实时连接",
      reasonBoxHeader: "评分理由与依据",
      switchPrompt: "点击上方指标切换"
    },
    en: {
      badge: "Japan Rental Intelligence",
      title: "Understand Any Rental in Seconds.",
      subtitle: "Paste a SUUMO link to reveal real earthquake safety, station commutes, and genuine local amenities",
      placeholder: "Paste property link (SUUMO / DOOR / HOME'S)...",
      btnScore: "Diagnose",
      btnScoring: "Analyzing...",
      tier1Title: "Overall Ratings",
      tier1Subtitle: "Tap any badge to see detailed evaluation rationale",
      tier2Title: "Condition Analysis (Pros & Cons)",
      meritPrefix: "Pros: ",
      cautionPrefix: "Caution: ",
      demeritPrefix: "Cons: ",
      stationsTitle: "Stations & Transit",
      destLabel: "Direct lines: ",
      pitfallLabel: "Caution: ",
      amenitiesTitle: "Local Amenities",
      superLabel: "Supermarkets (Price & Positioning)",
      cvsLabel: "Convenience Stores",
      chainLabel: "Famous Chain Restaurants",
      walkRouteHint: "Walking Route ↗",
      tier3Title: "Viewing Checklist",
      copyChecklist: "Copy Checklist",
      copied: "Copied!",
      footer: "Japan Rental Analyzer • Apple HIG Design • Google Maps Walking Route Integration",
      vacantBadge: "Fully Occupied (N/A)",
      mapsLiveBadge: "Google Maps Live",
      reasonBoxHeader: "Scoring Rationale",
      switchPrompt: "Tap another badge to switch"
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
        throw new Error(data.error || '診断に失敗しました。URLをご確認ください。');
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
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans antialiased selection:bg-[#0071E3] selection:text-white py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl flex-1 flex flex-col items-center">
        
        {/* Apple Segmented Header */}
        <header className="w-full flex items-center justify-between mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-black/[0.04] text-[11px] font-semibold text-[#86868B] tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3]"></span>
            {t.badge}
          </div>

          {/* Apple Segmented Language Picker */}
          <div className="bg-[#E5E5EA]/80 backdrop-blur-md p-1 rounded-full flex items-center shadow-inner">
            {[
              { id: 'ja', label: '日本語' },
              { id: 'zh', label: '繁體' },
              { id: 'zhCN', label: '简体' },
              { id: 'en', label: 'EN' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setLang(item.id as Language)}
                className={`px-3 py-1 rounded-full text-xs transition-all duration-200 cursor-pointer ${
                  lang === item.id 
                    ? 'bg-white text-[#1D1D1F] font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.08)]' 
                    : 'text-[#86868B] hover:text-[#1D1D1F]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </header>

        {/* Hero Section (Apple.com Typography) */}
        <div className="text-center mb-7 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F]">
            {t.title}
          </h1>
          <p className="text-sm sm:text-base text-[#86868B] max-w-lg mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Apple Style Search Capsule */}
        <form 
          onSubmit={handleSubmit} 
          className="w-full bg-white p-2 rounded-[22px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-black/[0.06] focus-within:border-[#0071E3] focus-within:ring-4 focus-within:ring-[#0071E3]/15 transition-all duration-200 flex items-center gap-2 mb-6"
        >
          <span className="pl-3.5 text-[#86868B] text-base">🔗</span>
          <input
            type="url"
            required
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder={t.placeholder}
            className="flex-1 text-sm bg-transparent outline-none text-[#1D1D1F] placeholder:text-[#86868B] py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] active:scale-[0.98] disabled:bg-[#A1A1A6] text-white text-xs sm:text-sm font-semibold rounded-full transition-all shadow-[0_2px_8px_rgba(0,113,227,0.25)] flex items-center gap-1.5 shrink-0 cursor-pointer"
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

        {/* Error Alert */}
        {error && (
          <div className="w-full mb-6 p-4 bg-[#FFF2F2] border border-[#FFD8D8] text-[#D70015] text-xs sm:text-sm rounded-[18px] text-center font-medium">
            {error}
          </div>
        )}

        {/* Results Container (Apple Bento Card Style) */}
        {evaluation && (
          <div className="w-full space-y-4 animate-in fade-in duration-300">
            
            {/* Property Header Bento Card */}
            <div className="bg-white px-6 py-5 rounded-[24px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="font-bold text-base sm:text-lg text-[#1D1D1F] tracking-tight">{propertyTitle}</h2>
                <p className="text-xs text-[#86868B] font-medium">{propertyMeta}</p>
              </div>
              <div className="text-right shrink-0">
                {evaluation.isVacant && propertyRent && !propertyRent.includes("N/A") ? (
                  <div className="text-2xl font-bold text-[#1D1D1F] tracking-tight">
                    {propertyRent}
                  </div>
                ) : (
                  <div className="inline-flex items-center px-3 py-1 bg-[#FFF4E5] text-[#B25E00] border border-[#FFE2BF] rounded-full text-xs font-semibold">
                    {t.vacantBadge}
                  </div>
                )}
              </div>
            </div>

            {/* ① Core Ratings (Apple Health Ring / Widget Style) */}
            <div className="bg-white p-5 sm:p-6 rounded-[24px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-[#86868B] uppercase">
                  {t.tier1Title}
                </span>
                <span className="text-[11px] text-[#86868B]">{t.tier1Subtitle}</span>
              </div>

              {/* 6 Dimension Badges */}
              <div className="grid grid-cols-6 gap-2 text-center">
                {evaluation.tier1.map(d => {
                  const isSelected = activeDimension?.key === d.key;
                  let colorClass = "bg-[#F5F5F7] text-[#1D1D1F] border-transparent";
                  if (d.symbol === '◎') colorClass = "bg-[#E8F8EE] text-[#1E7E34] border-[#D1F2DC]";
                  else if (d.symbol === '○') colorClass = "bg-[#EBF3FE] text-[#0064D2] border-[#D0E2FD]";
                  else if (d.symbol === '△') colorClass = "bg-[#FFF4E5] text-[#B25E00] border-[#FFE2BF]";
                  else if (d.symbol === '▲') colorClass = "bg-[#FEECEB] text-[#C9251D] border-[#FCD2CF]";

                  return (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => setSelectedDimensionKey(d.key)}
                      onMouseEnter={() => setSelectedDimensionKey(d.key)}
                      className={`p-3 rounded-[18px] border transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${colorClass} ${
                        isSelected 
                          ? 'ring-2 ring-[#0071E3] shadow-sm scale-[1.03]' 
                          : 'hover:opacity-90 active:scale-95'
                      }`}
                    >
                      <span className="text-[11px] font-medium opacity-80">{d.label[lang]}</span>
                      <span className="text-lg sm:text-xl font-bold my-0.5">{d.symbol}</span>
                      <span className="text-[9px] opacity-70 underline">理由 ▾</span>
                    </button>
                  );
                })}
              </div>

              {/* Apple Inset Rationale Panel */}
              {activeDimension && (
                <div className="p-4 rounded-[18px] bg-[#F5F5F7] border border-black/[0.04] text-xs space-y-1.5 animate-in fade-in duration-150">
                  <div className="flex justify-between items-center font-semibold text-[#1D1D1F]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#0071E3]"></span>
                      <span>{activeDimension.label[lang]}【{activeDimension.symbol}】{t.reasonBoxHeader}</span>
                    </span>
                    <span className="text-[11px] text-[#86868B] font-normal">{t.switchPrompt}</span>
                  </div>
                  <p className="text-[#424245] leading-relaxed pt-0.5 font-normal">
                    {activeDimension.reason[lang]}
                  </p>
                </div>
              )}
            </div>

            {/* ② Condition Breakdown (Apple List Style) */}
            <div className="bg-white p-5 sm:p-6 rounded-[24px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
              <div className="text-xs font-semibold tracking-wider text-[#86868B] uppercase border-b border-black/[0.04] pb-2.5">
                {t.tier2Title}
              </div>

              <div className="space-y-2.5">
                {evaluation.conditions.map(c => {
                  let badgeClass = "bg-[#F5F5F7] text-[#1D1D1F]";
                  if (c.overallType === 'positive') badgeClass = "bg-[#E8F8EE] text-[#1E7E34]";
                  else if (c.overallType === 'neutral') badgeClass = "bg-[#FFF4E5] text-[#B25E00]";
                  else if (c.overallType === 'negative') badgeClass = "bg-[#FEECEB] text-[#C9251D]";

                  return (
                    <div key={c.id} className="p-3.5 rounded-[18px] bg-[#F5F5F7]/70 border border-black/[0.02] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs sm:text-sm text-[#1D1D1F]">{c.name[lang]}</span>
                        <span className={`text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${badgeClass}`}>
                          {c.overall[lang]}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-[#424245]">
                        {c.merits.map((m, idx) => (
                          <div key={`m-${idx}`} className="flex items-start gap-1.5 text-[#1E7E34]">
                            <span className="font-bold shrink-0">{t.meritPrefix}</span>
                            <span>{m[lang]}</span>
                          </div>
                        ))}
                        {c.cautions.map((caution, idx) => (
                          <div key={`c-${idx}`} className="flex items-start gap-1.5 text-[#B25E00]">
                            <span className="font-bold shrink-0">{t.cautionPrefix}</span>
                            <span>{caution[lang]}</span>
                          </div>
                        ))}
                        {c.demerits.map((d, idx) => (
                          <div key={`d-${idx}`} className="flex items-start gap-1.5 text-[#C9251D]">
                            <span className="font-bold shrink-0">{t.demeritPrefix}</span>
                            <span>{d[lang]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 🚉 Transit & Stations */}
            {evaluation.stations && evaluation.stations.length > 0 && (
              <div className="bg-white p-5 sm:p-6 rounded-[24px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
                <div className="text-xs font-semibold tracking-wider text-[#86868B] uppercase">
                  {t.stationsTitle}
                </div>
                <div className="space-y-2">
                  {evaluation.stations.map((st, idx) => (
                    <a
                      key={idx}
                      href={st.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(st.station)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3.5 rounded-[18px] bg-[#F5F5F7]/80 hover:bg-[#EBEBF0] transition-all duration-200 space-y-1 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">🚇</span>
                          <span className="font-semibold text-xs sm:text-sm text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">
                            {st.station}
                          </span>
                          <span className="text-[11px] text-[#86868B]">（{st.line}）</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-[#0071E3] bg-[#EBF3FE] px-2.5 py-0.5 rounded-full">
                            徒歩 {st.walkMin} 分
                          </span>
                          <span className="text-[10px] text-[#0071E3] opacity-80 group-hover:opacity-100">{t.walkRouteHint}</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-[#424245] space-y-0.5 pt-0.5">
                        <div><strong className="text-[#1D1D1F]">{t.destLabel}</strong> {st.destinations[lang]}</div>
                        <div className="text-[#B25E00]"><strong className="font-semibold">{t.pitfallLabel}</strong> {st.pitfalls[lang]}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 🏪 Real Neighborhood Amenities (Deduplicated Real Stores Only) */}
            {evaluation.amenities && (
              <div className="bg-white p-5 sm:p-6 rounded-[24px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center justify-between border-b border-black/[0.04] pb-2.5">
                  <span className="text-xs font-semibold tracking-wider text-[#86868B] uppercase">
                    {t.amenitiesTitle}
                  </span>
                  {evaluation.amenities.isGoogleMapsLive && (
                    <span className="text-[10px] text-[#0071E3] bg-[#EBF3FE] px-2.5 py-0.5 rounded-full font-semibold">
                      {t.mapsLiveBadge}
                    </span>
                  )}
                </div>

                {/* 1. Supermarkets (Real Stores Only) */}
                <div className="space-y-2">
                  <div className="font-semibold text-[#1D1D1F] text-xs">
                    {t.superLabel}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {evaluation.amenities.supermarkets.map((sm, idx) => (
                      <a
                        key={idx}
                        href={sm.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sm.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3.5 rounded-[18px] bg-[#F5F5F7] hover:bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-[#0071E3]/30 border border-transparent transition-all duration-200 space-y-1 group cursor-pointer"
                      >
                        <div className="flex justify-between font-bold text-[#1D1D1F]">
                          <span className="leading-tight group-hover:text-[#0071E3] transition-colors">{sm.name}</span>
                          <span className="text-[#0071E3] font-semibold text-[11px] shrink-0 ml-1">{sm.walk}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <span className="bg-[#EBF3FE] text-[#0071E3] px-2 py-0.5 rounded-full font-medium">{sm.tag[lang]}</span>
                            {sm.priceLevel && <span className="text-[#B25E00] font-medium">{sm.priceLevel[lang]}</span>}
                          </div>
                          <span className="text-[#0071E3] font-medium opacity-80 group-hover:opacity-100">{t.walkRouteHint}</span>
                        </div>
                        <p className="text-[11px] text-[#6E6E73] leading-snug">{sm.note[lang]}</p>
                      </a>
                    ))}
                  </div>
                </div>

                {/* 2. Convenience Stores */}
                <div className="space-y-2 pt-2">
                  <div className="font-semibold text-[#1D1D1F] text-xs">
                    {t.cvsLabel}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {evaluation.amenities.convenienceStores.map((cvs, idx) => (
                      <a
                        key={idx}
                        href={cvs.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cvs.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3.5 rounded-[18px] bg-[#F5F5F7] hover:bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-[#0071E3]/30 border border-transparent transition-all duration-200 space-y-1 group cursor-pointer"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">{cvs.name}</span>
                          <span className="text-[10px] text-[#86868B] font-medium">{cvs.walk}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <span className="bg-[#EBF3FE] text-[#0071E3] px-2 py-0.5 rounded-full font-medium">{cvs.tag[lang]}</span>
                            {cvs.priceLevel && <span className="text-[#B25E00] font-medium">{cvs.priceLevel[lang]}</span>}
                          </div>
                          <span className="text-[#0071E3] font-medium opacity-80 group-hover:opacity-100">{t.walkRouteHint}</span>
                        </div>
                        <p className="text-[11px] text-[#6E6E73] leading-snug">{cvs.note[lang]}</p>
                      </a>
                    ))}
                  </div>
                </div>

                {/* 3. Famous Chains */}
                <div className="space-y-2 pt-2">
                  <div className="font-semibold text-[#1D1D1F] text-xs">
                    {t.chainLabel}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {evaluation.amenities.famousChains.map((fc, idx) => (
                      <a
                        key={idx}
                        href={fc.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fc.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-[18px] bg-[#F5F5F7] hover:bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-[#0071E3]/30 border border-transparent transition-all duration-200 space-y-0.5 group cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-[#1D1D1F] text-xs leading-tight group-hover:text-[#0071E3] transition-colors">{fc.name}</span>
                          <span className="text-[10px] text-[#0071E3] font-semibold shrink-0 ml-1">{fc.walk}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-[#86868B]">
                          <div className="flex items-center gap-1">
                            <span>{fc.tag[lang]}</span>
                            {fc.budget && <span>• {fc.budget}</span>}
                          </div>
                          <span className="text-[#0071E3] font-medium opacity-80 group-hover:opacity-100">↗</span>
                        </div>
                        <p className="text-[10px] text-[#6E6E73] leading-tight pt-0.5">{fc.note[lang]}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ③ Viewing Checklist */}
            <div className="bg-white p-5 sm:p-6 rounded-[24px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
              <div className="flex items-center justify-between border-b border-black/[0.04] pb-2.5">
                <span className="text-xs font-semibold tracking-wider text-[#86868B] uppercase">
                  {t.tier3Title}
                </span>
                <button
                  onClick={handleCopyChecklist}
                  className="text-xs text-[#0071E3] hover:underline font-semibold cursor-pointer"
                >
                  {copied ? t.copied : t.copyChecklist}
                </button>
              </div>
              
              <div className="space-y-2 text-xs">
                {evaluation.naiken.map((item, idx) => (
                  <label key={idx} className="flex items-start gap-2.5 p-1 rounded-lg hover:bg-[#F5F5F7] cursor-pointer transition-colors">
                    <input type="checkbox" className="mt-0.5 rounded text-[#0071E3] focus:ring-0 cursor-pointer" />
                    <span className="text-[#424245] leading-relaxed">
                      <strong className="font-semibold text-[#1D1D1F]">[{item.name[lang]}]</strong> {item.text[lang]}
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Apple Style Minimalist Footer */}
        <footer className="w-full text-center mt-12 text-xs text-[#86868B]">
          {t.footer}
        </footer>
      </div>
    </div>
  );
}
