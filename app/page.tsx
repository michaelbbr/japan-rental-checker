'use client';

import React, { useState } from 'react';
import { EvaluationResult, Language } from '@/lib/types';

export default function Home() {
  const [lang, setLang] = useState<Language>('zh');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [propertyTitle, setPropertyTitle] = useState<string | null>(null);
  const [propertyMeta, setPropertyMeta] = useState<string | null>(null);
  const [propertyRent, setPropertyRent] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedDimensionKey, setSelectedDimensionKey] = useState<string>('location');
  const [activeTab, setActiveTab] = useState<'overview' | 'stations' | 'amenities' | 'checklist'>('overview');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Multi-language text dictionary
  const t = {
    ja: {
      brandBadge: "日本賃貸 総合診断システム",
      title: "日本の賃貸物件を、客観的に見抜く。",
      subtitle: "SUUMO / HOME'S / スマイティ等のURLから、耐震性・駅動線・真の生活インフラを一瞬で高精度に診断",
      placeholder: "物件URLを入力 (SUUMO, HOME'S, スマイティ, レオパレス21)...",
      btnScore: "診断実行",
      btnScoring: "解析中...",
      sampleLabel: "テスト用サンプルURL：",
      tabOverview: "📊 総合診断・特徴",
      tabStations: "🚉 交通動線・駅",
      tabAmenities: "🛒 生活インフラ",
      tabChecklist: "📝 内見チェックリスト",
      tier1Title: "総合レーティング（6大指標）",
      tier1Subtitle: "タップで診断根拠を表示",
      tier2Title: "条件別メリット・注意点（長所と短所）",
      meritPrefix: "長所：",
      cautionPrefix: "注意：",
      demeritPrefix: "短所：",
      stationsTitle: "最寄り駅・アクセス",
      stationsSub: "タップでGoogleマップ徒歩ルート案内",
      destLabel: "直通方面：",
      pitfallLabel: "留意点：",
      amenitiesTitle: "生活インフラ速報",
      amenitiesSub: "タップで店舗へのGoogleマップ徒歩ルート案内",
      superLabel: "周辺スーパーマーケット（位置づけ＆価格帯）",
      cvsLabel: "コンビニエンスストア（価格帯＆特徴）",
      chainLabel: "定番外食チェーン",
      walkRouteHint: "徒歩ナビ ↗",
      tier3Title: "内見時のチェックリスト",
      copyChecklist: "リストをコピー",
      copied: "✓ コピー完了",
      footer: "v43（新世代モダンデザイン・タブ切り替え＆全自動校準旗艦版）• 日本賃貸 総合診断システム",
      vacantBadge: "募集中",
      occupiedBadge: "満室（現在募集中なし / N/A）",
      mapsLiveBadge: "● Google Maps 即時連動中",
      reasonBoxHeader: "判定理由・評価根拠",
      switchPrompt: "他の指標をタップして切替"
    },
    zh: {
      brandBadge: "日本租房 綜合診斷系統",
      title: "日本租房物件，數據化客觀解析。",
      subtitle: "輸入 SUUMO / HOME'S / スマイティ 等網址，即時解析耐震性、真實步行動線與生活圈機能",
      placeholder: "貼上房源網址 (SUUMO, HOME'S, スマイティ, Leopalace21)...",
      btnScore: "立即診斷",
      btnScoring: "深入解析中...",
      sampleLabel: "快速測試範例：",
      tabOverview: "📊 綜合評估與特徵",
      tabStations: "🚉 交通車站動線",
      tabAmenities: "🛒 周邊生活機能",
      tabChecklist: "📝 看房內見清單",
      tier1Title: "綜合指標評級（6大維度）",
      tier1Subtitle: "點擊各指標查看評估理由",
      tier2Title: "條件優劣勢解析（長處與短處）",
      meritPrefix: "優勢：",
      cautionPrefix: "提醒：",
      demeritPrefix: "缺點：",
      stationsTitle: "鄰近車站與通勤交通",
      stationsSub: "點擊可直接開啟 Google 地圖實測步行路線",
      destLabel: "直達方向：",
      pitfallLabel: "留意事項：",
      amenitiesTitle: "生活圈民生機能速報",
      amenitiesSub: "點擊店家開啟 Google 地圖實測步行導航",
      superLabel: "周邊生鮮超市（定位與價格帶）",
      cvsLabel: "周邊便利超商（價格帶與特點）",
      chainLabel: "國民連鎖外食餐廳",
      walkRouteHint: "步行導航 ↗",
      tier3Title: "實地看房（內見）必查清單",
      copyChecklist: "一鍵複製清單",
      copied: "✓ 已複製到剪貼簿",
      footer: "v43（全新世代高質感設計・分頁導航與全自動校準旗艦版）• 日本租房 綜合診斷系統",
      vacantBadge: "招租中",
      occupiedBadge: "滿室（目前無招租中 / N/A）",
      mapsLiveBadge: "● Google Maps 即時座標連動",
      reasonBoxHeader: "判定理由與評估依據",
      switchPrompt: "點擊其他徽章以切換"
    },
    zhCN: {
      brandBadge: "日本租房 综合诊断系统",
      title: "日本租房房源，客观深度解析。",
      subtitle: "输入 SUUMO / HOME'S / スマイティ 等网址，即时解析耐震性、真实步行路线与生活圈机能",
      placeholder: "粘贴房源网址 (SUUMO, HOME'S, スマイティ, Leopalace21)...",
      btnScore: "立即诊断",
      btnScoring: "深度解析中...",
      sampleLabel: "快速测试样例：",
      tabOverview: "📊 综合评估与特征",
      tabStations: "🚉 交通车站动线",
      tabAmenities: "🛒 周边生活机能",
      tabChecklist: "📝 看房内见清单",
      tier1Title: "综合指标评级（6大维度）",
      tier1Subtitle: "点击各指标查看评估理由",
      tier2Title: "条件优劣势解析（长处与短处）",
      meritPrefix: "优势：",
      cautionPrefix: "提醒：",
      demeritPrefix: "缺点：",
      stationsTitle: "邻近车站与通勤交通",
      stationsSub: "点击可直接开启 Google 地图实测步行路线",
      destLabel: "直达方向：",
      pitfallLabel: "注意事项：",
      amenitiesTitle: "生活圈民生机能速报",
      amenitiesSub: "点击店家开启 Google 地图实测步行导航",
      superLabel: "周边生鲜超市（定位与价格带）",
      cvsLabel: "周边便利店（价格带与特点）",
      chainLabel: "国民连锁餐饮",
      walkRouteHint: "步行导航 ↗",
      tier3Title: "实地看房（内见）必查清单",
      copyChecklist: "一键复制清单",
      copied: "✓ 已复制到剪贴板",
      footer: "v43（新一代高质感设计・标签页导航与全自动校准旗舰版）• 日本租房 综合诊断系统",
      vacantBadge: "招租中",
      occupiedBadge: "满室（目前无招租中 / N/A）",
      mapsLiveBadge: "● Google Maps 即时坐标连动",
      reasonBoxHeader: "判定理由与评估依据",
      switchPrompt: "点击其他徽章以切换"
    },
    en: {
      brandBadge: "Japan Rental Intelligence",
      title: "Objective Intelligence for Japanese Rentals.",
      subtitle: "Instant precision analysis of seismic resilience, true walking routes, and verified grocery infrastructure from property URLs",
      placeholder: "Paste property URL (SUUMO, HOME'S, Sumaity, Leopalace21)...",
      btnScore: "Diagnose",
      btnScoring: "Analyzing...",
      sampleLabel: "Quick Test Samples:",
      tabOverview: "📊 Overview & Ratings",
      tabStations: "🚉 Stations & Transit",
      tabAmenities: "🛒 Neighborhood Amenities",
      tabChecklist: "📝 Viewing Checklist",
      tier1Title: "Core Ratings (6 Dimensions)",
      tier1Subtitle: "Click badge to view scoring rationale",
      tier2Title: "Condition Merits & Trade-offs",
      meritPrefix: "Pros: ",
      cautionPrefix: "Notice: ",
      demeritPrefix: "Cons: ",
      stationsTitle: "Stations & Transit Routes",
      stationsSub: "Click station for Google Maps pedestrian route",
      destLabel: "Direct Lines: ",
      pitfallLabel: "Caution: ",
      amenitiesTitle: "Neighborhood Living Infrastructure",
      amenitiesSub: "Click location for Google Maps turn-by-turn route",
      superLabel: "Supermarkets (Tiers & Pricing)",
      cvsLabel: "Convenience Stores",
      chainLabel: "Famous Chain Restaurants",
      walkRouteHint: "Route ↗",
      tier3Title: "On-site Viewing Checklist",
      copyChecklist: "Copy Checklist",
      copied: "✓ Copied!",
      footer: "v43 (Next-Gen Clean UI • Tabbed Navigation & Universal Precision Grounding) • Japan Rental Intelligence",
      vacantBadge: "Available",
      occupiedBadge: "Fully Occupied (N/A)",
      mapsLiveBadge: "● Google Maps Real-time Telemetry",
      reasonBoxHeader: "Scoring Rationale",
      switchPrompt: "Click another badge to view"
    }
  }[lang];

  const samples = [
    { label: "SUUMO (西新宿)", url: "https://suumo.jp/chintai/bc_100524309699/" },
    { label: "Sumaity (代々木)", url: "https://sumaity.com/chintai/tokyo_bldg/bldg_12278438/" },
    { label: "HOME'S (調布)", url: "https://www.homes.co.jp/chintai/b-10451421/u-48413470/" }
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
      setActiveTab('overview');
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

  const getSymbolBadge = (symbol: string) => {
    switch (symbol) {
      case '◎':
        return isDarkMode 
          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
          : 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case '○':
        return isDarkMode 
          ? 'bg-sky-500/15 text-sky-400 border-sky-500/30' 
          : 'bg-sky-50 text-sky-700 border-sky-200';
      case '△':
        return isDarkMode 
          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' 
          : 'bg-amber-50 text-amber-700 border-amber-200';
      case '▲':
        return isDarkMode 
          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' 
          : 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return isDarkMode 
          ? 'bg-gray-500/15 text-gray-400 border-gray-500/30' 
          : 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-200 ${
      isDarkMode ? 'bg-[#0E1117] text-[#F3F4F6]' : 'bg-[#F8FAFC] text-[#0F172A]'
    }`}>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 flex flex-col items-center">
        
        {/* Navigation Bar */}
        <header className="w-full flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-white font-bold shadow-md">
              🏢
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight">{t.brandBadge}</div>
              <div className="text-xs text-gray-400 font-medium">JAPAN RENTAL INTELLIGENCE</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl text-sm font-semibold border transition-all ${
                isDarkMode 
                  ? 'bg-gray-800/80 border-gray-700 text-amber-300 hover:bg-gray-700' 
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
              }`}
              title="切換深淺模式"
            >
              {isDarkMode ? '☀️ 日間' : '🌙 夜間'}
            </button>

            {/* Language Switcher */}
            <div className={`flex items-center rounded-xl p-1 border text-xs font-semibold ${
              isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
            }`}>
              {[
                { id: 'ja', label: '日' },
                { id: 'zh', label: '繁' },
                { id: 'zhCN', label: '简' },
                { id: 'en', label: 'EN' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setLang(item.id as Language)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    lang === item.id 
                      ? 'bg-indigo-600 text-white font-bold shadow' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="w-full text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2.5 bg-gradient-to-r from-indigo-500 via-sky-500 to-teal-400 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Search / URL Input Box */}
        <form onSubmit={handleSubmit} className="w-full mb-4">
          <div className={`p-2 rounded-2xl border transition-all shadow-lg flex flex-col sm:flex-row gap-2 ${
            isDarkMode 
              ? 'bg-gray-900/90 border-gray-700/80 focus-within:border-indigo-500' 
              : 'bg-white border-gray-200 focus-within:border-indigo-500'
          }`}>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>{t.btnScoring}</span>
                </>
              ) : (
                <span>{t.btnScore}</span>
              )}
            </button>
          </div>
        </form>

        {/* Quick Sample Links */}
        <div className="w-full flex items-center gap-2 mb-8 text-xs text-gray-400 flex-wrap">
          <span className="font-semibold">{t.sampleLabel}</span>
          {samples.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => { setUrl(s.url); }}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                isDarkMode 
                  ? 'bg-gray-800/60 border-gray-700 hover:border-indigo-500 hover:text-white' 
                  : 'bg-white border-gray-200 hover:border-indigo-500 hover:text-indigo-600 shadow-sm'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="w-full p-4 mb-8 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-sm font-medium flex items-center gap-3">
            <span className="text-lg">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Evaluation Results */}
        {evaluation && (
          <div className="w-full flex flex-col gap-6">

            {/* Property Summary Banner */}
            <div className={`p-6 rounded-3xl border shadow-xl relative overflow-hidden ${
              isDarkMode ? 'bg-gray-900/90 border-gray-800' : 'bg-white border-gray-200'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      evaluation.isVacant 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' 
                        : 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                    }`}>
                      {evaluation.isVacant ? t.vacantBadge : t.occupiedBadge}
                    </span>
                    {evaluation.amenities.isGoogleMapsLive && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
                        {t.mapsLiveBadge}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-2">
                    {propertyTitle || '物件詳細'}
                  </h2>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {propertyMeta}
                  </div>
                </div>

                <div className="text-left sm:text-right sm:border-l sm:pl-6 border-gray-200 dark:border-gray-800">
                  <div className="text-xs text-gray-400 font-medium mb-1">月額賃料</div>
                  <div className="text-2xl sm:text-3xl font-black text-indigo-500 dark:text-indigo-400">
                    {propertyRent || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Modern Tab Navigation */}
            <div className={`flex items-center p-1.5 rounded-2xl border gap-1 shadow-sm overflow-x-auto ${
              isDarkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-gray-100/90 border-gray-200'
            }`}>
              {[
                { id: 'overview', label: t.tabOverview },
                { id: 'stations', label: t.tabStations },
                { id: 'amenities', label: t.tabAmenities },
                { id: 'checklist', label: t.tabChecklist }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? (isDarkMode 
                          ? 'bg-indigo-600 text-white shadow-md' 
                          : 'bg-white text-indigo-700 shadow')
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: OVERVIEW & 6 DIMENSIONS */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-6">
                {/* 6 Dimension Badges Grid */}
                <div className={`p-6 rounded-3xl border shadow-lg ${
                  isDarkMode ? 'bg-gray-900/90 border-gray-800' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
                      {t.tier1Title}
                    </h3>
                    <span className="text-xs text-gray-400">{t.tier1Subtitle}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 mb-6">
                    {evaluation.tier1.map(dim => {
                      const isSelected = selectedDimensionKey === dim.key;
                      return (
                        <button
                          key={dim.key}
                          onClick={() => setSelectedDimensionKey(dim.key)}
                          className={`p-4 sm:p-5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                            isSelected 
                              ? (isDarkMode ? 'bg-indigo-600/25 border-indigo-400 shadow-xl ring-2 ring-indigo-400/50 scale-105' : 'bg-indigo-50 border-indigo-500 shadow-lg ring-2 ring-indigo-500/30 scale-105')
                              : (isDarkMode ? 'bg-gray-800/50 border-gray-800 hover:border-gray-600 hover:bg-gray-800/80' : 'bg-gray-50 border-gray-200 hover:bg-gray-100')
                          }`}
                        >
                          <div className="text-sm sm:text-base font-extrabold text-gray-200">{dim.label[lang]}</div>
                          <div className={`text-4xl sm:text-5xl font-black px-3 py-1.5 rounded-xl border my-1.5 shadow-sm transition-transform ${getSymbolBadge(dim.symbol)}`}>
                            {dim.symbol}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-400 font-bold tracking-wide">
                            {dim.score > 0 ? `+${dim.score.toFixed(1)}` : dim.score.toFixed(1)}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Dimension Rationale Box */}
                  {activeDimension && (
                    <div className={`p-4 rounded-2xl border transition-all ${
                      isDarkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-indigo-50/50 border-indigo-100'
                    }`}>
                      <div className="flex items-center gap-3 mb-2.5">
                        <span className="text-sm sm:text-base font-black uppercase tracking-wider text-indigo-400">
                          {activeDimension.label[lang]} • {t.reasonBoxHeader}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-sm font-black border ${getSymbolBadge(activeDimension.symbol)}`}>
                          {activeDimension.symbol}
                        </span>
                      </div>
                      <p className="text-base sm:text-lg font-medium leading-relaxed text-gray-100">
                        {activeDimension.reason[lang]}
                      </p>
                    </div>
                  )}
                </div>

                {/* Condition Pros & Cons */}
                <div className={`p-6 rounded-3xl border shadow-lg ${
                  isDarkMode ? 'bg-gray-900/90 border-gray-800' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="text-sm sm:text-base font-extrabold tracking-tight mb-4">
                    {t.tier2Title}
                  </h3>

                  <div className="flex flex-col gap-3">
                    {evaluation.conditions.map((card, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border transition-all ${
                          isDarkMode ? 'bg-gray-800/40 border-gray-800 hover:border-gray-700' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-extrabold text-base sm:text-xl text-white">{card.name[lang]}</span>
                          <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-bold border ${
                            card.overallType === 'positive'
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : card.overallType === 'neutral'
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          }`}>
                            {card.overall[lang]}
                          </span>
                        </div>

                        {card.merits.map((m, mIdx) => (
                          <div key={mIdx} className="text-sm sm:text-base text-emerald-400 font-medium leading-relaxed mb-2">
                            <span className="font-bold">{t.meritPrefix}</span>{m[lang]}
                          </div>
                        ))}
                        {card.cautions.map((c, cIdx) => (
                          <div key={cIdx} className="text-sm sm:text-base text-amber-400 font-medium leading-relaxed mb-2">
                            <span className="font-bold">{t.cautionPrefix}</span>{c[lang]}
                          </div>
                        ))}
                        {card.demerits.map((d, dIdx) => (
                          <div key={dIdx} className="text-sm sm:text-base text-rose-400 font-medium leading-relaxed mb-2">
                            <span className="font-bold">{t.demeritPrefix}</span>{d[lang]}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: STATIONS & TRANSIT */}
            {activeTab === 'stations' && (
              <div className={`p-6 rounded-3xl border shadow-lg ${
                isDarkMode ? 'bg-gray-900/90 border-gray-800' : 'bg-white border-gray-200'
              }`}>
                <div className="mb-4">
                  <h3 className="text-sm sm:text-base font-extrabold tracking-tight">{t.stationsTitle}</h3>
                  <p className="text-xs text-gray-400">{t.stationsSub}</p>
                </div>

                <div className="flex flex-col gap-3">
                  {evaluation.stations.map((st, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        isDarkMode ? 'bg-gray-800/40 border-gray-800 hover:border-gray-700' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🚉</span>
                          <span className="font-black text-base sm:text-xl text-white">{st.station}</span>
                          <span className="text-sm text-gray-300 font-medium">({st.line})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3.5 py-1.5 rounded-xl text-sm sm:text-base font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            徒歩 {st.walkMin} 分
                          </span>
                          {st.mapUrl && (
                            <a
                              href={st.mapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-1.5 rounded-xl text-sm font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30 hover:bg-sky-500/20 transition-all"
                            >
                              {t.walkRouteHint}
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="text-sm sm:text-base text-gray-200 leading-relaxed mb-2">
                        <span className="font-bold text-gray-300">{t.destLabel}</span>
                        {st.destinations[lang]}
                      </div>
                      <div className="text-sm sm:text-base text-amber-400/95 leading-relaxed font-medium">
                        <span className="font-bold">{t.pitfallLabel}</span>
                        {st.pitfalls[lang]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: NEIGHBORHOOD AMENITIES */}
            {activeTab === 'amenities' && (
              <div className="flex flex-col gap-6">
                {/* Supermarkets */}
                <div className={`p-6 rounded-3xl border shadow-lg ${
                  isDarkMode ? 'bg-gray-900/90 border-gray-800' : 'bg-white border-gray-200'
                }`}>
                  <div className="mb-4">
                    <h3 className="text-sm sm:text-base font-extrabold tracking-tight">{t.superLabel}</h3>
                    <p className="text-xs text-gray-400">{t.amenitiesSub}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {evaluation.amenities.supermarkets.map((sp, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          isDarkMode ? 'bg-gray-800/40 border-gray-800 hover:border-gray-700' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="font-black text-base sm:text-lg text-white leading-snug">{sp.name}</span>
                            <span className="px-3 py-1 rounded-lg text-sm font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                              {sp.walk}
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5 text-sm text-gray-300 font-semibold mb-2">
                            <span>{sp.tag[lang]}</span>
                            {sp.rating && <span className="font-bold text-amber-400">★ {sp.rating}</span>}
                          </div>
                          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3 font-normal">
                            {sp.note[lang]}
                          </p>
                        </div>

                        {sp.mapUrl && (
                          <a
                            href={sp.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl text-sm font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30 hover:bg-sky-500/20 transition-all self-end"
                          >
                            <span>{t.walkRouteHint}</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Convenience Stores */}
                <div className={`p-6 rounded-3xl border shadow-lg ${
                  isDarkMode ? 'bg-gray-900/90 border-gray-800' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="text-sm sm:text-base font-extrabold tracking-tight mb-4">{t.cvsLabel}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {evaluation.amenities.convenienceStores.map((cvs, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          isDarkMode ? 'bg-gray-800/40 border-gray-800 hover:border-gray-700' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="font-black text-base sm:text-lg text-white leading-snug">{cvs.name}</span>
                            <span className="px-3 py-1 rounded-lg text-sm font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 whitespace-nowrap">
                              {cvs.walk}
                            </span>
                          </div>
                          <div className="text-sm text-gray-300 font-semibold mb-2">{cvs.tag[lang]}</div>
                          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3 font-normal">
                            {cvs.note[lang]}
                          </p>
                        </div>
                        {cvs.mapUrl && (
                          <a
                            href={cvs.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl text-sm font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30 hover:bg-sky-500/20 transition-all self-end"
                          >
                            <span>{t.walkRouteHint}</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Famous Chains */}
                <div className={`p-6 rounded-3xl border shadow-lg ${
                  isDarkMode ? 'bg-gray-900/90 border-gray-800' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="text-sm sm:text-base font-extrabold tracking-tight mb-4">{t.chainLabel}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {evaluation.amenities.famousChains.map((c, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          isDarkMode ? 'bg-gray-800/40 border-gray-800 hover:border-gray-700' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div>
                          <div className="font-black text-base sm:text-lg text-white mb-1.5">{c.name}</div>
                          <div className="text-sm sm:text-base font-black text-indigo-300 mb-1.5">{c.walk}</div>
                          <p className="text-sm text-gray-300 leading-relaxed mb-3">{c.note[lang]}</p>
                        </div>
                        {c.mapUrl && (
                          <a
                            href={c.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1 py-1 px-2.5 rounded-lg text-[11px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20 transition-all self-end"
                          >
                            <span>{t.walkRouteHint}</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: VIEWING CHECKLIST */}
            {activeTab === 'checklist' && (
              <div className={`p-6 rounded-3xl border shadow-lg ${
                isDarkMode ? 'bg-gray-900/90 border-gray-800' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm sm:text-base font-extrabold tracking-tight">{t.tier3Title}</h3>
                  <button
                    onClick={handleCopyChecklist}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow"
                  >
                    {copied ? t.copied : t.copyChecklist}
                  </button>
                </div>

                <div className="flex flex-col gap-2.5">
                  {evaluation.naiken.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                        isDarkMode ? 'bg-gray-800/40 border-gray-800' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        id={`chk-${idx}`}
                        className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-700"
                      />
                      <label htmlFor={`chk-${idx}`} className="text-xs sm:text-sm leading-relaxed cursor-pointer select-none">
                        <span className="font-bold text-indigo-400 mr-2">[{item.name[lang]}]</span>
                        {item.text[lang]}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Footer */}
        <footer className="w-full mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-400">
          {t.footer}
        </footer>

      </div>
    </div>
  );
}
