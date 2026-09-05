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
      brandBadge: "日本賃貸 総合診断システム",
      title: "日本の賃貸物件を、客観的に見抜く。",
      subtitle: "SUUMO等のURLから、耐震性・駅動線・真の生活インフラを一瞬で高精度に診断",
      placeholder: "物件URLを入力 (SUUMO / DOOR賃貸 / HOME'S)...",
      btnScore: "診断実行 ↵",
      btnScoring: "解析中...",
      tier1Title: "① 総合レーティング（6大指標）",
      tier1Subtitle: "タップで診断根拠を表示",
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
      chainLabel: "🍽️ 定番外食チェーン",
      walkRouteHint: "徒歩ナビ ↗",
      tier3Title: "③ 内見時のチェックリスト",
      copyChecklist: "［ リストをコピー ］",
      copied: "✓ コピー完了",
      footer: "v37（四大租屋網全相容・官方精準門牌回填旗艦版）• 日本賃貸 総合診断システム • Google Maps リアルタイム徒歩ナビ連携",
      vacantBadge: "満室（現在募集中なし / N/A）",
      mapsLiveBadge: "● Google Maps リアルタイム連動",
      reasonBoxHeader: "判定理由・評価根拠",
      switchPrompt: "他の指標をタップして切替"
    },
    zh: {
      brandBadge: "日本租房 綜合診斷系統",
      title: "日本租房物件，數據化精準解析。",
      subtitle: "貼上 SUUMO 網址，瞬間透視房屋規格、耐震風險、車站動線與周邊真實生活機能",
      placeholder: "輸入房源網址 (SUUMO / DOOR賃貸 / HOME'S)...",
      btnScore: "開始診斷 ↵",
      btnScoring: "分析中...",
      tier1Title: "① 核心指標總評（六大維度）",
      tier1Subtitle: "點擊查看客觀評分依據與理由",
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
      footer: "v37（四大租屋網全相容・官方精準門牌回填旗艦版）• 日本租房 綜合診斷系統 • Google Maps 徒步導航串接",
      vacantBadge: "目前滿室（無招租中 / N/A）",
      mapsLiveBadge: "● 即時地圖連線",
      reasonBoxHeader: "評分理由與依據",
      switchPrompt: "點擊上方指標切換"
    },
    zhCN: {
      brandBadge: "日本租房 综合诊断系统",
      title: "日本租房物件，数据化精准解析。",
      subtitle: "贴上 SUUMO 网址，瞬间透视房屋规格、耐震风险、车站路线与周边真实生活设施",
      placeholder: "输入房源网址 (SUUMO / DOOR租赁 / HOME'S)...",
      btnScore: "开始诊断 ↵",
      btnScoring: "解析中...",
      tier1Title: "① 核心指标总评（六大维度）",
      tier1Subtitle: "点击查看客观评分依据与理由",
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
      footer: "日本租房 综合诊断系统 • 特斯拉黑魂极简UI • Google Maps 步行导航联动",
      vacantBadge: "目前满室（无招租中 / N/A）",
      mapsLiveBadge: "● 实时地图连接",
      reasonBoxHeader: "评分理由与依据",
      switchPrompt: "点击上方指标切换"
    },
    en: {
      brandBadge: "JAPAN RENTAL INTELLIGENCE",
      title: "Objectively Understand Any Rental Property.",
      subtitle: "Paste a SUUMO link to reveal real earthquake safety, station commutes, and genuine local amenities",
      placeholder: "Paste property link (SUUMO / DOOR / HOME'S)...",
      btnScore: "Analyze ↵",
      btnScoring: "Analyzing...",
      tier1Title: "① Core Ratings (6 Dimensions)",
      tier1Subtitle: "Tap any badge to reveal diagnostic rationale",
      tier2Title: "② Property Conditions (Pros & Cons)",
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
      footer: "Japan Rental Property Checker • Dark Minimalist UI • Google Maps Walking Route Integration",
      vacantBadge: "Fully Occupied (N/A)",
      mapsLiveBadge: "● LIVE MAPS TELEMETRY",
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
    <div className="min-h-screen bg-[#0B0C10] text-[#FFFFFF] font-sans antialiased py-8 px-4 flex flex-col items-center selection:bg-[#38BDF8] selection:text-black">
      <div className="w-full max-w-2xl flex-1 flex flex-col items-center">
        
        {/* Clean Sleek Header (NO "TESLA CYBER") */}
        <header className="w-full flex items-center justify-between mb-8 border-b border-white/[0.08] pb-4">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#16181D] border border-white/[0.12] text-xs font-bold tracking-wider text-[#E5E7EB]">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8] animate-pulse"></span>
            <span>{t.brandBadge}</span>
          </div>

          {/* Minimalist Dark Pill Language Switcher */}
          <div className="flex items-center bg-[#16181D] border border-white/[0.12] rounded-full p-1 text-xs font-bold">
            {[
              { id: 'ja', label: '日本語' },
              { id: 'zh', label: '繁體' },
              { id: 'zhCN', label: '简体' },
              { id: 'en', label: 'EN' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setLang(item.id as Language)}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  lang === item.id 
                    ? 'bg-white text-black shadow-md font-black' 
                    : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </header>

        {/* Hero Section (Bold, High-Contrast Typography) */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            {t.title}
          </h1>
          <p className="text-sm sm:text-base text-[#9CA3AF] font-medium max-w-lg mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Dark Minimalist Search Box */}
        <form 
          onSubmit={handleSubmit} 
          className="w-full bg-[#16181D] p-2 rounded-2xl border border-white/[0.15] focus-within:border-[#38BDF8] focus-within:ring-2 focus-within:ring-[#38BDF8]/20 transition-all flex items-center gap-2 mb-7 shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
        >
          <span className="pl-3.5 text-[#6B7280] text-base">🔍</span>
          <input
            type="url"
            required
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder={t.placeholder}
            className="flex-1 text-sm sm:text-base font-medium bg-transparent outline-none text-white placeholder:text-[#6B7280] py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-white hover:bg-zinc-200 active:scale-95 disabled:bg-zinc-600 text-black text-sm font-black rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin"></span>
                {t.btnScoring}
              </span>
            ) : (
              <span>{t.btnScore}</span>
            )}
          </button>
        </form>

        {/* Error Alert */}
        {error && (
          <div className="w-full mb-6 p-4 bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-sm rounded-xl text-center font-bold">
            {error}
          </div>
        )}

        {/* Main Results Container */}
        {evaluation && (
          <div className="w-full space-y-4 animate-in fade-in duration-200">
            
            {/* Property Summary Header Card */}
            <div className="bg-[#16181D] px-6 py-5 rounded-2xl border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="font-black text-base sm:text-lg text-white tracking-tight">{propertyTitle}</h2>
                <p className="text-xs sm:text-sm text-[#9CA3AF] font-semibold">{propertyMeta}</p>
              </div>
              <div className="text-right shrink-0">
                {evaluation.isVacant && propertyRent && !propertyRent.includes("N/A") ? (
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {propertyRent}
                  </div>
                ) : (
                  <div className="inline-flex items-center px-3.5 py-1.5 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 rounded-xl text-xs sm:text-sm font-bold">
                    {t.vacantBadge}
                  </div>
                )}
              </div>
            </div>

            {/* ① Core Ratings (High Contrast, Bold Labels) */}
            <div className="bg-[#16181D] p-5 sm:p-6 rounded-2xl border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.4)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-black tracking-wider text-[#D1D5DB] uppercase">
                  {t.tier1Title}
                </span>
                <span className="text-xs text-[#9CA3AF] font-medium">{t.tier1Subtitle}</span>
              </div>

              {/* 6 Dimension Pods */}
              <div className="grid grid-cols-6 gap-2 text-center">
                {evaluation.tier1.map(d => {
                  const isSelected = activeDimension?.key === d.key;
                  let colorClass = "bg-[#1F222A] text-white border-white/[0.08]";
                  if (d.symbol === '◎') colorClass = "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/40";
                  else if (d.symbol === '○') colorClass = "bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/40";
                  else if (d.symbol === '△') colorClass = "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/40";
                  else if (d.symbol === '▲') colorClass = "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/40";

                  return (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => setSelectedDimensionKey(d.key)}
                      onMouseEnter={() => setSelectedDimensionKey(d.key)}
                      className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${colorClass} ${
                        isSelected 
                          ? 'ring-2 ring-white shadow-[0_0_12px_rgba(255,255,255,0.2)] scale-[1.04]' 
                          : 'hover:opacity-90 active:scale-95'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-bold">{d.label[lang]}</span>
                      <span className="text-2xl sm:text-3xl font-black my-1">{d.symbol}</span>
                      <span className="text-[10px] font-bold opacity-80 underline tracking-wider">理由 ▾</span>
                    </button>
                  );
                })}
              </div>

              {/* Deep Diagnostic Rationale Drawer */}
              {activeDimension && (
                <div className="p-4 rounded-xl bg-[#0D0E12] border border-white/[0.12] text-sm space-y-1.5 animate-in fade-in duration-150">
                  <div className="flex justify-between items-center font-bold">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]"></span>
                      <span className="text-sm sm:text-base font-black text-white">{activeDimension.label[lang]}【{activeDimension.symbol}】{t.reasonBoxHeader}</span>
                    </span>
                    <span className="text-xs text-[#9CA3AF] font-medium">{t.switchPrompt}</span>
                  </div>
                  <p className="text-sm sm:text-base text-[#E5E7EB] leading-relaxed pt-1 font-medium">
                    {activeDimension.reason[lang]}
                  </p>
                </div>
              )}
            </div>

            {/* ② Conditions Diagnostics */}
            <div className="bg-[#16181D] p-5 sm:p-6 rounded-2xl border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.4)] space-y-3">
              <div className="text-xs sm:text-sm font-black tracking-wider text-[#D1D5DB] uppercase border-b border-white/[0.08] pb-3">
                {t.tier2Title}
              </div>

              <div className="space-y-2.5">
                {evaluation.conditions.map(c => {
                  let badgeClass = "bg-[#1F222A] text-white border-white/[0.1]";
                  if (c.overallType === 'positive') badgeClass = "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/40";
                  else if (c.overallType === 'neutral') badgeClass = "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/40";
                  else if (c.overallType === 'negative') badgeClass = "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/40";

                  return (
                    <div key={c.id} className="p-4 rounded-xl border border-white/[0.06] bg-[#0D0E12] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm sm:text-base text-white">{c.name[lang]}</span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
                          {c.overall[lang]}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs sm:text-sm font-medium text-[#D1D5DB]">
                        {c.merits.map((m, idx) => (
                          <div key={`m-${idx}`} className="flex items-start gap-1.5 text-[#10B981]">
                            <span className="font-black shrink-0">{t.meritPrefix}</span>
                            <span className="leading-relaxed">{m[lang]}</span>
                          </div>
                        ))}
                        {c.cautions.map((caution, idx) => (
                          <div key={`c-${idx}`} className="flex items-start gap-1.5 text-[#F59E0B]">
                            <span className="font-black shrink-0">{t.cautionPrefix}</span>
                            <span className="leading-relaxed">{caution[lang]}</span>
                          </div>
                        ))}
                        {c.demerits.map((d, idx) => (
                          <div key={`d-${idx}`} className="flex items-start gap-1.5 text-[#EF4444]">
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

            {/* 🚉 Station Transit Routes */}
            {evaluation.stations && evaluation.stations.length > 0 && (
              <div className="bg-[#16181D] p-5 sm:p-6 rounded-2xl border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.4)] space-y-3">
                <div className="text-xs sm:text-sm font-black tracking-wider text-[#D1D5DB] uppercase">
                  {t.stationsTitle}
                </div>
                <div className="space-y-2">
                  {evaluation.stations.map((st, idx) => (
                    <a
                      key={idx}
                      href={st.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(st.station)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3.5 rounded-xl border border-white/[0.06] bg-[#0D0E12] hover:border-[#38BDF8] hover:bg-[#1A1C23] transition-all space-y-1 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🚇</span>
                          <span className="font-black text-sm sm:text-base text-white group-hover:text-[#38BDF8] transition-colors">
                            {st.station}
                          </span>
                          <span className="text-xs font-semibold text-[#9CA3AF]">（{st.line}）</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#38BDF8] bg-[#38BDF8]/10 px-2.5 py-0.5 rounded-full border border-[#38BDF8]/30">
                            徒歩 {st.walkMin} 分
                          </span>
                          <span className="text-xs text-[#38BDF8] font-bold group-hover:underline">{t.walkRouteHint}</span>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm text-[#9CA3AF] space-y-0.5 pt-1">
                        <div><strong className="text-white font-bold">{t.destLabel}</strong> {st.destinations[lang]}</div>
                        <div className="text-[#F59E0B] font-medium"><strong className="font-bold">{t.pitfallLabel}</strong> {st.pitfalls[lang]}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 🏪 Local Amenities (100% Genuine Supermarkets & Stores) */}
            {evaluation.amenities && (
              <div className="bg-[#16181D] p-5 sm:p-6 rounded-2xl border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.4)] space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <span className="text-xs sm:text-sm font-black tracking-wider text-[#D1D5DB] uppercase">
                    {t.amenitiesTitle}
                  </span>
                  {evaluation.amenities.isGoogleMapsLive && (
                    <span className="text-xs font-bold text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/30 px-2.5 py-0.5 rounded-full">
                      {t.mapsLiveBadge}
                    </span>
                  )}
                </div>

                {/* 1. Supermarkets (Genuine Supermarkets Only) */}
                <div className="space-y-2">
                  <div className="font-black text-white text-sm">
                    {t.superLabel}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
                    {evaluation.amenities.supermarkets.map((sm, idx) => (
                      <a
                        key={idx}
                        href={sm.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sm.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3.5 rounded-xl bg-[#0D0E12] border border-white/[0.06] hover:border-[#38BDF8] hover:bg-[#1A1C23] transition-all space-y-1.5 group cursor-pointer"
                      >
                        <div className="flex justify-between items-start font-black text-white">
                          <span className="leading-snug text-sm sm:text-base group-hover:text-[#38BDF8] transition-colors">{sm.name}</span>
                          <span className="text-[#38BDF8] font-bold text-xs shrink-0 ml-1 bg-[#38BDF8]/10 px-2 py-0.5 rounded-full border border-[#38BDF8]/30">{sm.walk}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="bg-[#1F222A] text-[#D1D5DB] px-2 py-0.5 rounded font-bold border border-white/[0.08]">{sm.tag[lang]}</span>
                            {sm.priceLevel && <span className="text-[#F59E0B] font-bold">{sm.priceLevel[lang]}</span>}
                          </div>
                          <span className="text-[#38BDF8] font-bold text-xs">{t.walkRouteHint}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed pt-0.5">{sm.note[lang]}</p>
                      </a>
                    ))}
                  </div>
                </div>

                {/* 2. Convenience Stores */}
                <div className="space-y-2 pt-2">
                  <div className="font-black text-white text-sm">
                    {t.cvsLabel}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
                    {evaluation.amenities.convenienceStores.map((cvs, idx) => (
                      <a
                        key={idx}
                        href={cvs.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cvs.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3.5 rounded-xl bg-[#0D0E12] border border-white/[0.06] hover:border-[#38BDF8] hover:bg-[#1A1C23] transition-all space-y-1.5 group cursor-pointer"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-black text-sm sm:text-base text-white group-hover:text-[#38BDF8] transition-colors">{cvs.name}</span>
                          <span className="text-xs text-[#9CA3AF] font-bold">{cvs.walk}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="bg-[#1F222A] text-[#D1D5DB] px-2 py-0.5 rounded font-bold border border-white/[0.08]">{cvs.tag[lang]}</span>
                            {cvs.priceLevel && <span className="text-[#F59E0B] font-bold">{cvs.priceLevel[lang]}</span>}
                          </div>
                          <span className="text-[#38BDF8] font-bold text-xs">{t.walkRouteHint}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed pt-0.5">{cvs.note[lang]}</p>
                      </a>
                    ))}
                  </div>
                </div>

                {/* 3. Famous Chains */}
                <div className="space-y-2 pt-2">
                  <div className="font-black text-white text-sm">
                    {t.chainLabel}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                    {evaluation.amenities.famousChains.map((fc, idx) => (
                      <a
                        key={idx}
                        href={fc.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fc.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-xl bg-[#0D0E12] border border-white/[0.06] hover:border-[#38BDF8] hover:bg-[#1A1C23] transition-all space-y-1 group cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-black text-xs sm:text-sm text-white leading-tight group-hover:text-[#38BDF8] transition-colors">{fc.name}</span>
                          <span className="text-[11px] text-[#38BDF8] font-bold shrink-0 ml-1">{fc.walk}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#9CA3AF] font-medium">
                          <div className="flex items-center gap-1">
                            <span>{fc.tag[lang]}</span>
                            {fc.budget && <span>• {fc.budget}</span>}
                          </div>
                          <span className="text-[#38BDF8] font-bold">↗</span>
                        </div>
                        <p className="text-xs text-[#9CA3AF] leading-snug pt-0.5">{fc.note[lang]}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ③ Viewing Checklist */}
            <div className="bg-[#16181D] p-5 sm:p-6 rounded-2xl border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.4)] space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <span className="text-xs sm:text-sm font-black tracking-wider text-[#D1D5DB] uppercase">
                  {t.tier3Title}
                </span>
                <button
                  onClick={handleCopyChecklist}
                  className="text-xs sm:text-sm text-[#38BDF8] hover:underline font-bold cursor-pointer"
                >
                  {copied ? t.copied : t.copyChecklist}
                </button>
              </div>
              
              <div className="space-y-2 text-xs sm:text-sm font-medium">
                {evaluation.naiken.map((item, idx) => (
                  <label key={idx} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-white/[0.04] cursor-pointer transition-colors">
                    <input type="checkbox" className="mt-1 rounded border-zinc-700 bg-zinc-900 text-[#38BDF8] focus:ring-0 cursor-pointer" />
                    <span className="text-[#D1D5DB] leading-relaxed">
                      <strong className="font-black text-white">[{item.name[lang]}]</strong> {item.text[lang]}
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Minimalist Footer */}
        <footer className="w-full text-center mt-12 text-xs font-bold tracking-wider text-[#6B7280]">
          {t.footer}
        </footer>
      </div>
    </div>
  );
}
