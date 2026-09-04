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
      sealBadge: "日本賃貸 総合診断所",
      title: "日本の賃貸物件を、客観的に見抜く。",
      subtitle: "URLを貼るだけで、耐震構造・駅動線・真の生活インフラを一瞬で高精度に診断",
      placeholder: "物件URLを入力 (SUUMO / DOOR賃貸 / HOME'S)...",
      btnScore: "診断を開始 ↵",
      btnScoring: "診断中...",
      tier1Title: "① 総合レーティング（6大指標）",
      tier1Subtitle: "※各指標をタップすると判定根拠が表示されます",
      tier2Title: "② 条件別メリット・注意点（長所と短所）",
      meritPrefix: "長所：",
      cautionPrefix: "注意：",
      demeritPrefix: "短所：",
      stationsTitle: "🚉 最寄り駅・アクセス（タップでGoogleマップ徒歩ルート案内）",
      destLabel: "直通方面：",
      pitfallLabel: "留意点：",
      amenitiesTitle: "🏪 生活インフラ速報（タップで店舗への徒歩ルート案内）",
      superLabel: "🛒 周辺スーパーマーケット（位置づけ＆価格帯）",
      cvsLabel: "🏪 コンビニエンスストア（価格帯＆特徴）",
      chainLabel: "🍽️ 周辺の定番外食チェーン",
      walkRouteHint: "徒歩ナビ ↗",
      tier3Title: "③ 内見時のチェックリスト",
      copyChecklist: "［ リストをコピー ］",
      copied: "✓ コピー完了",
      footer: "日本賃貸物件診断所 • 和モダンデザイン • Google Maps リアルタイム徒歩ナビ連携",
      vacantBadge: "現在満室（募集中なし / N/A）",
      mapsLiveBadge: "Google Maps リアルタイム連動",
      reasonBoxHeader: "評価理由・判定根拠",
      switchPrompt: "他の指標をタップして切替"
    },
    zh: {
      sealBadge: "日本賃貸 総合診斷所",
      title: "日本租房物件，一鍵客觀診斷。",
      subtitle: "貼上 SUUMO 網址，瞬間透視房屋規格、耐震風險、車站動線與周邊真實生活機能",
      placeholder: "輸入房源網址 (SUUMO / DOOR賃貸 / HOME'S)...",
      btnScore: "開始診斷 ↵",
      btnScoring: "分析中...",
      tier1Title: "① 核心指標總評（六大維度）",
      tier1Subtitle: "※點擊或懸停指標即可查看客觀評分理由",
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
      tier3Title: "③ 現場內見確認清單",
      copyChecklist: "［ 複製清單 ］",
      copied: "✓ 已複製",
      footer: "日本租房物件診斷所 • 和風現代設計 • Google Maps 徒步導航串接",
      vacantBadge: "目前滿室（無招租中 / N/A）",
      mapsLiveBadge: "Google Maps 即時連線",
      reasonBoxHeader: "評分理由與依據",
      switchPrompt: "點擊上方指標切換"
    },
    zhCN: {
      sealBadge: "日本租赁 综合诊断所",
      title: "日本租房物件，一键客观诊断。",
      subtitle: "贴上 SUUMO 网址，瞬间透视房屋规格、耐震风险、车站路线与周边真实生活设施",
      placeholder: "输入房源网址 (SUUMO / DOOR租赁 / HOME'S)...",
      btnScore: "开始诊断 ↵",
      btnScoring: "分析中...",
      tier1Title: "① 核心指标总评（六大维度）",
      tier1Subtitle: "※点击或悬停指标即可查看客观评分理由",
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
      tier3Title: "③ 现场看房确认清单",
      copyChecklist: "［ 复制清单 ］",
      copied: "✓ 已复制",
      footer: "日本租房物件诊断所 • 和风现代设计 • Google Maps 步行导航联动",
      vacantBadge: "目前满室（无招租中 / N/A）",
      mapsLiveBadge: "Google Maps 实时连接",
      reasonBoxHeader: "评分理由与依据",
      switchPrompt: "点击上方指标切换"
    },
    en: {
      sealBadge: "Japan Rental Intelligence",
      title: "Objectively Understand Any Rental.",
      subtitle: "Paste a SUUMO link to reveal real earthquake safety, station commutes, and genuine local amenities",
      placeholder: "Paste property link (SUUMO / DOOR / HOME'S)...",
      btnScore: "Analyze ↵",
      btnScoring: "Analyzing...",
      tier1Title: "① Core Ratings (6 Dimensions)",
      tier1Subtitle: "※Click or tap any badge to view scoring rationale",
      tier2Title: "② Condition Breakdown (Pros & Cons)",
      meritPrefix: "Pros: ",
      cautionPrefix: "Caution: ",
      demeritPrefix: "Cons: ",
      stationsTitle: "🚉 Stations & Transit (Click for Google Maps Walking Route)",
      destLabel: "Direct lines: ",
      pitfallLabel: "Caution: ",
      amenitiesTitle: "🏪 Local Amenities (Click place for Google Maps walking route)",
      superLabel: "🛒 Supermarkets (Positioning & Price Level)",
      cvsLabel: "🏪 Convenience Stores",
      chainLabel: "🍽️ Famous Chain Restaurants",
      walkRouteHint: "Walking Route ↗",
      tier3Title: "③ Viewing Checklist",
      copyChecklist: "[ Copy Checklist ]",
      copied: "✓ Copied!",
      footer: "Japan Rental Property Checker • Japanese Modern UI • Google Maps Walking Route Integration",
      vacantBadge: "Currently Fully Occupied (N/A)",
      mapsLiveBadge: "Google Maps Live Data",
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] font-sans antialiased py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl flex-1 flex flex-col items-center">
        
        {/* Japanese Hanko Style Header */}
        <header className="w-full flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-[#D6D3D1] text-xs font-bold text-[#44403C] shadow-2xs">
            <span className="w-2 h-2 rounded-xs bg-[#B91C1C]"></span>
            <span>{t.sealBadge}</span>
          </div>

          {/* 4-Language Japanese Wood Pill Switcher */}
          <div className="flex items-center bg-white border border-[#D6D3D1] rounded-lg p-1 text-xs font-bold shadow-2xs">
            {[
              { id: 'ja', label: '日本語' },
              { id: 'zh', label: '繁體中文' },
              { id: 'zhCN', label: '简体中文' },
              { id: 'en', label: 'English' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setLang(item.id as Language)}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  lang === item.id 
                    ? 'bg-[#1C1917] text-white shadow-xs font-black' 
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </header>

        {/* Hero Section (Clear Japanese Typography) */}
        <div className="text-center mb-6 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1C1917]">
            {t.title}
          </h1>
          <p className="text-sm sm:text-base text-[#78716C] font-medium max-w-lg mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Japanese Clean Search Input Box */}
        <form 
          onSubmit={handleSubmit} 
          className="w-full bg-white p-2 rounded-xl shadow-xs border-2 border-[#D6D3D1] focus-within:border-[#1C1917] transition-all flex items-center gap-2 mb-6"
        >
          <span className="pl-3 text-[#A8A29E] text-base">🔗</span>
          <input
            type="url"
            required
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder={t.placeholder}
            className="flex-1 text-sm sm:text-base font-medium bg-transparent outline-none text-[#1C1917] placeholder:text-[#A8A29E] py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#1C1917] hover:bg-[#292524] disabled:bg-[#A8A29E] text-white text-sm font-bold rounded-lg transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
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
          <div className="w-full mb-6 p-4 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-sm rounded-xl text-center font-bold">
            {error}
          </div>
        )}

        {/* Main Results (Japanese Modern Paper Card Style) */}
        {evaluation && (
          <div className="w-full space-y-4 animate-in fade-in duration-200">
            
            {/* Property Summary Header */}
            <div className="bg-white px-6 py-5 rounded-xl border border-[#E7E5E4] shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="font-black text-base sm:text-lg text-[#1C1917] tracking-tight">{propertyTitle}</h2>
                <p className="text-xs sm:text-sm text-[#78716C] font-semibold">{propertyMeta}</p>
              </div>
              <div className="text-right shrink-0">
                {evaluation.isVacant && propertyRent && !propertyRent.includes("N/A") ? (
                  <div className="text-xl sm:text-2xl font-black text-[#1C1917]">
                    {propertyRent}
                  </div>
                ) : (
                  <div className="inline-flex items-center px-3 py-1.5 bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] rounded-lg text-xs sm:text-sm font-bold">
                    {t.vacantBadge}
                  </div>
                )}
              </div>
            </div>

            {/* ① Core Ratings (Japanese Evaluation Seals with Clear Font) */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#E7E5E4] shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-black tracking-wider text-[#78716C] uppercase">
                  {t.tier1Title}
                </span>
                <span className="text-xs text-[#A8A29E] font-medium">{t.tier1Subtitle}</span>
              </div>

              {/* 6 Dimension Badges (Bold & High Contrast) */}
              <div className="grid grid-cols-6 gap-2 text-center">
                {evaluation.tier1.map(d => {
                  const isSelected = activeDimension?.key === d.key;
                  let colorClass = "bg-[#F5F5F4] text-[#44403C] border-[#E7E5E4]";
                  if (d.symbol === '◎') colorClass = "bg-[#F0FDF4] text-[#15803D] border-[#86EFAC]";
                  else if (d.symbol === '○') colorClass = "bg-[#EFF6FF] text-[#1D4ED8] border-[#93C5FD]";
                  else if (d.symbol === '△') colorClass = "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]";
                  else if (d.symbol === '▲') colorClass = "bg-[#FEE2E2] text-[#B91C1C] border-[#FCA5A5]";

                  return (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => setSelectedDimensionKey(d.key)}
                      onMouseEnter={() => setSelectedDimensionKey(d.key)}
                      className={`p-3 rounded-lg border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${colorClass} ${
                        isSelected 
                          ? 'ring-2 ring-[#1C1917] shadow-sm scale-[1.03]' 
                          : 'hover:opacity-90 active:scale-95'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-bold">{d.label[lang]}</span>
                      <span className="text-2xl sm:text-3xl font-black my-0.5">{d.symbol}</span>
                      <span className="text-[11px] font-bold opacity-80 underline">理由 ▾</span>
                    </button>
                  );
                })}
              </div>

              {/* Deep Sumi-Ink Japanese Rationale Box (High Contrast, Large Readable Font) */}
              {activeDimension && (
                <div className="p-4 rounded-xl bg-[#1C1917] text-white text-sm space-y-1.5 animate-in fade-in duration-150">
                  <div className="flex justify-between items-center font-bold">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#38BDF8]"></span>
                      <span className="text-sm sm:text-base font-black">{activeDimension.label[lang]}【{activeDimension.symbol}】{t.reasonBoxHeader}</span>
                    </span>
                    <span className="text-xs text-[#A8A29E] font-medium">{t.switchPrompt}</span>
                  </div>
                  <p className="text-sm sm:text-base text-[#F5F5F4] leading-relaxed pt-1 font-normal">
                    {activeDimension.reason[lang]}
                  </p>
                </div>
              )}
            </div>

            {/* ② Conditions Breakdown */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#E7E5E4] shadow-xs space-y-3">
              <div className="text-xs sm:text-sm font-black tracking-wider text-[#78716C] uppercase border-b border-[#F5F5F4] pb-2.5">
                {t.tier2Title}
              </div>

              <div className="space-y-2.5">
                {evaluation.conditions.map(c => {
                  let badgeClass = "bg-[#F5F5F4] text-[#44403C] border-[#E7E5E4]";
                  if (c.overallType === 'positive') badgeClass = "bg-[#F0FDF4] text-[#15803D] border-[#86EFAC]";
                  else if (c.overallType === 'neutral') badgeClass = "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]";
                  else if (c.overallType === 'negative') badgeClass = "bg-[#FEE2E2] text-[#B91C1C] border-[#FCA5A5]";

                  return (
                    <div key={c.id} className="p-3.5 rounded-lg border border-[#E7E5E4] bg-[#FAF8F5] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm sm:text-base text-[#1C1917]">{c.name[lang]}</span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${badgeClass}`}>
                          {c.overall[lang]}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs sm:text-sm font-medium text-[#44403C]">
                        {c.merits.map((m, idx) => (
                          <div key={`m-${idx}`} className="flex items-start gap-1.5 text-[#15803D]">
                            <span className="font-black shrink-0">{t.meritPrefix}</span>
                            <span className="leading-relaxed">{m[lang]}</span>
                          </div>
                        ))}
                        {c.cautions.map((caution, idx) => (
                          <div key={`c-${idx}`} className="flex items-start gap-1.5 text-[#B45309]">
                            <span className="font-black shrink-0">{t.cautionPrefix}</span>
                            <span className="leading-relaxed">{caution[lang]}</span>
                          </div>
                        ))}
                        {c.demerits.map((d, idx) => (
                          <div key={`d-${idx}`} className="flex items-start gap-1.5 text-[#B91C1C]">
                            <span className="font-black shrink-0">{t.demeritPrefix}</span>
                            <span className="leading-relaxed">{d[lang]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 🚉 Station Transit & Access */}
            {evaluation.stations && evaluation.stations.length > 0 && (
              <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#E7E5E4] shadow-xs space-y-3">
                <div className="text-xs sm:text-sm font-black tracking-wider text-[#78716C] uppercase">
                  {t.stationsTitle}
                </div>
                <div className="space-y-2">
                  {evaluation.stations.map((st, idx) => (
                    <a
                      key={idx}
                      href={st.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(st.station)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3.5 rounded-lg border border-[#E7E5E4] bg-[#FAF8F5] hover:border-[#1C1917] hover:bg-white transition-all space-y-1 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🚇</span>
                          <span className="font-black text-sm sm:text-base text-[#1C1917] group-hover:text-[#1D4ED8] transition-colors">
                            {st.station}
                          </span>
                          <span className="text-xs font-semibold text-[#78716C]">（{st.line}）</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-[#1D4ED8] bg-[#EFF6FF] px-2.5 py-0.5 rounded border border-[#BFDBFE]">
                            徒歩 {st.walkMin} 分
                          </span>
                          <span className="text-xs text-[#1D4ED8] font-bold group-hover:underline">{t.walkRouteHint}</span>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm text-[#57534E] space-y-0.5 pt-1">
                        <div><strong className="text-[#1C1917] font-bold">{t.destLabel}</strong> {st.destinations[lang]}</div>
                        <div className="text-[#B45309] font-medium"><strong className="font-bold">{t.pitfallLabel}</strong> {st.pitfalls[lang]}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 🏪 Local Amenities (Strictly Genuine Supermarkets & Stores) */}
            {evaluation.amenities && (
              <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#E7E5E4] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#F5F5F4] pb-2.5">
                  <span className="text-xs sm:text-sm font-black tracking-wider text-[#78716C] uppercase">
                    {t.amenitiesTitle}
                  </span>
                  {evaluation.amenities.isGoogleMapsLive && (
                    <span className="text-xs font-bold text-[#15803D] bg-[#F0FDF4] border border-[#86EFAC] px-2.5 py-0.5 rounded">
                      {t.mapsLiveBadge}
                    </span>
                  )}
                </div>

                {/* 1. Supermarkets (Genuine Stores Only, 4 Closest Included) */}
                <div className="space-y-2">
                  <div className="font-black text-[#1C1917] text-sm">
                    {t.superLabel}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
                    {evaluation.amenities.supermarkets.map((sm, idx) => (
                      <a
                        key={idx}
                        href={sm.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sm.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E7E5E4] hover:border-[#1C1917] hover:bg-white transition-all space-y-1.5 group cursor-pointer"
                      >
                        <div className="flex justify-between items-start font-black text-[#1C1917]">
                          <span className="leading-snug text-sm sm:text-base group-hover:text-[#1D4ED8] transition-colors">{sm.name}</span>
                          <span className="text-[#1D4ED8] font-bold text-xs shrink-0 ml-1 bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">{sm.walk}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="bg-[#E7E5E4] text-[#44403C] px-2 py-0.5 rounded font-bold">{sm.tag[lang]}</span>
                            {sm.priceLevel && <span className="text-[#B45309] font-bold">{sm.priceLevel[lang]}</span>}
                          </div>
                          <span className="text-[#1D4ED8] font-bold text-xs">{t.walkRouteHint}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed pt-0.5">{sm.note[lang]}</p>
                      </a>
                    ))}
                  </div>
                </div>

                {/* 2. Convenience Stores */}
                <div className="space-y-2 pt-2">
                  <div className="font-black text-[#1C1917] text-sm">
                    {t.cvsLabel}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
                    {evaluation.amenities.convenienceStores.map((cvs, idx) => (
                      <a
                        key={idx}
                        href={cvs.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cvs.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E7E5E4] hover:border-[#1C1917] hover:bg-white transition-all space-y-1.5 group cursor-pointer"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-black text-sm sm:text-base text-[#1C1917] group-hover:text-[#1D4ED8] transition-colors">{cvs.name}</span>
                          <span className="text-xs text-[#78716C] font-bold">{cvs.walk}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="bg-[#E7E5E4] text-[#44403C] px-2 py-0.5 rounded font-bold">{cvs.tag[lang]}</span>
                            {cvs.priceLevel && <span className="text-[#B45309] font-bold">{cvs.priceLevel[lang]}</span>}
                          </div>
                          <span className="text-[#1D4ED8] font-bold text-xs">{t.walkRouteHint}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed pt-0.5">{cvs.note[lang]}</p>
                      </a>
                    ))}
                  </div>
                </div>

                {/* 3. Famous Chains */}
                <div className="space-y-2 pt-2">
                  <div className="font-black text-[#1C1917] text-sm">
                    {t.chainLabel}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                    {evaluation.amenities.famousChains.map((fc, idx) => (
                      <a
                        key={idx}
                        href={fc.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fc.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-lg bg-[#FAF8F5] border border-[#E7E5E4] hover:border-[#1C1917] hover:bg-white transition-all space-y-1 group cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-black text-xs sm:text-sm text-[#1C1917] leading-tight group-hover:text-[#1D4ED8] transition-colors">{fc.name}</span>
                          <span className="text-[11px] text-[#1D4ED8] font-bold shrink-0 ml-1">{fc.walk}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#78716C] font-medium">
                          <div className="flex items-center gap-1">
                            <span>{fc.tag[lang]}</span>
                            {fc.budget && <span>• {fc.budget}</span>}
                          </div>
                          <span className="text-[#1D4ED8] font-bold">↗</span>
                        </div>
                        <p className="text-xs text-[#57534E] leading-snug pt-0.5">{fc.note[lang]}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ③ Viewing Checklist */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#E7E5E4] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#F5F5F4] pb-2.5">
                <span className="text-xs sm:text-sm font-black tracking-wider text-[#78716C] uppercase">
                  {t.tier3Title}
                </span>
                <button
                  onClick={handleCopyChecklist}
                  className="text-xs sm:text-sm text-[#1D4ED8] hover:underline font-bold cursor-pointer"
                >
                  {copied ? t.copied : t.copyChecklist}
                </button>
              </div>
              
              <div className="space-y-2 text-xs sm:text-sm font-medium">
                {evaluation.naiken.map((item, idx) => (
                  <label key={idx} className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-[#FAF8F5] cursor-pointer transition-colors">
                    <input type="checkbox" className="mt-1 rounded text-[#1C1917] focus:ring-0 cursor-pointer" />
                    <span className="text-[#44403C] leading-relaxed">
                      <strong className="font-black text-[#1C1917]">[{item.name[lang]}]</strong> {item.text[lang]}
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Japanese Hanko Style Footer */}
        <footer className="w-full text-center mt-12 text-xs font-semibold text-[#A8A29E]">
          {t.footer}
        </footer>
      </div>
    </div>
  );
}
