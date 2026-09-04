import { Rule } from './types';

export const RULES: Rule[] = [
  // 1. 方角 (Orientation)
  {
    id: "orientation_south",
    name: "南向き",
    category: "朝向",
    overall: "◎ 明顯優點",
    overallType: "positive",
    effects: { sunlight: 2, rent: -0.5 },
    merits: ["全天日照時間最長，室內明亮且冬季溫暖，衣物極易曬乾。"],
    cautions: ["同條件下人氣最高，租金通常較高。"],
    demerits: [],
    naiken: "確認南側是否有鄰棟阻擋實際採光"
  },
  {
    id: "orientation_southwest",
    name: "南西向き",
    category: "朝向",
    overall: "○ 加分條件",
    overallType: "positive",
    effects: { sunlight: 1.5 },
    merits: ["午後採光充足，冬天傍晚室內依然溫暖，適合晚起生活作息。"],
    cautions: ["夏季午後強烈西曬（西日），室內溫度容易升高，需開冷氣。"],
    demerits: [],
    naiken: "確認窗戶遮熱隔熱性及是否有遮光窗簾軌道"
  },
  {
    id: "orientation_southeast",
    name: "南東向き",
    category: "朝向",
    overall: "◎ 明顯優點",
    overallType: "positive",
    effects: { sunlight: 2 },
    merits: ["清晨至午後採光充足，晨型生活作息極佳。"],
    cautions: ["傍晚光線轉暗稍早。"],
    demerits: [],
    naiken: "確認東至南向視野採光開闊度"
  },
  {
    id: "orientation_east",
    name: "東向き",
    category: "朝向",
    overall: "○ 加分條件",
    overallType: "positive",
    effects: { sunlight: 1 },
    merits: ["早晨陽光充足有助作息提神，避開夏季午後強烈西曬。"],
    cautions: ["中午過後無直射陽光，冬季午後室溫下降較快。"],
    demerits: [],
    naiken: "確認上午曬衣空間通風與採光"
  },
  {
    id: "orientation_west",
    name: "西向き",
    category: "朝向",
    overall: "△ 中性/看習慣",
    overallType: "neutral",
    effects: { sunlight: 0.5 },
    merits: ["午後到傍晚日照充足，冬季下午室內溫暖省暖氣。"],
    cautions: ["夏季西曬時間長室溫偏高，家具易受紫外線褪色。"],
    demerits: [],
    naiken: "確認冷氣冷房能力與西曬時的體感溫度"
  },
  {
    id: "orientation_north",
    name: "北向き",
    category: "朝向",
    overall: "⚠️ 需妥協",
    overallType: "negative",
    effects: { sunlight: -2, rent: 1 },
    merits: ["全日光線均勻柔和無眩光，同棟中租金最便宜。"],
    cautions: ["日照極少，冬天較陰冷，暖氣耗電量可能增加。"],
    demerits: ["無直射陽光，衣物不易乾，結露與潮濕發黴風險高。"],
    naiken: "確認窗框與牆角有無水氣發黴痕跡、換氣扇強度"
  },

  // 2. 構造 (Structure)
  {
    id: "structure_src",
    name: "SRC造（鉄骨鉄筋コンクリート）",
    category: "構造",
    overall: "◎ 明顯優點",
    overallType: "positive",
    effects: { building: 2, quietness: 1.5, rent: -0.5 },
    merits: ["頂級耐震、耐火與隔音結構，生活音極少干擾。"],
    cautions: ["結構堅固厚實，租金與管理費基底通常偏高。"],
    demerits: [],
    naiken: "確認室內樑柱是否過於突出影響家具擺設"
  },
  {
    id: "structure_rc",
    name: "RC造（鉄筋コンクリート）",
    category: "構造",
    overall: "◎ 明顯優點",
    overallType: "positive",
    effects: { building: 1.5, quietness: 1 },
    merits: ["中高層公寓主流，隔音與氣密性優良，鄰室生活音不易傳遞。"],
    cautions: ["氣密性高，需保持日常定期通風換氣。"],
    demerits: [],
    naiken: "輕敲共用戶牆確認是否為厚實水泥隔間"
  },
  {
    id: "structure_steel",
    name: "鉄骨造（重量/軽量）",
    category: "構造",
    overall: "△ 中性/看習慣",
    overallType: "neutral",
    effects: { building: 0, quietness: -0.5, rent: 0.5 },
    merits: ["耐震性能優於木造，租金性價比佳。"],
    cautions: ["隔音弱於 RC，腳步聲或開關門震動仍有部分傳導。"],
    demerits: [],
    naiken: "確認共用走廊走動與相鄰戶門扇關閉聲響"
  },
  {
    id: "structure_wood",
    name: "木造（アパート）",
    category: "構造",
    overall: "👎 明顯抗性",
    overallType: "negative",
    effects: { building: -1, quietness: -2, rent: 1.5 },
    merits: ["透氣調濕性佳，同地段中租金門檻最低。"],
    cautions: ["氣密與保溫性較低，冷暖房效率較受外氣影響。"],
    demerits: ["遮音性最弱，上下樓腳步聲、交談聲與水管流水聲容易互相穿透。"],
    naiken: "實地確認樓上走動聲與相鄰戶交談聲傳導程度"
  },

  // 3. 所在階・位置
  {
    id: "pos_corner",
    name: "角部屋",
    category: "位置",
    overall: "◎ 明顯優點",
    overallType: "positive",
    effects: { quietness: 1.5, sunlight: 1 },
    merits: ["僅一側相鄰住戶生活音干擾減半，常具備雙面採光通風好。"],
    cautions: ["外壁面積大，冬季保溫稍遜於中房間。"],
    demerits: [],
    naiken: "確認側面窗外是否鄰近鄰棟窗戶走道（隱私問題）"
  },
  {
    id: "pos_top",
    name: "最上階",
    category: "位置",
    overall: "◎ 明顯優點",
    overallType: "positive",
    effects: { quietness: 2, sunlight: 1 },
    merits: ["完全無上方住戶生活噪音與踩踏聲，採光與視野最佳。"],
    cautions: ["屋頂直受太陽日曬，夏季室溫偏高。"],
    demerits: [],
    naiken: "確認頂樓隔熱與蓮蓬頭水壓狀況"
  },
  {
    id: "pos_2f_plus",
    name: "2階以上",
    category: "位置",
    overall: "○ 加分條件",
    overallType: "positive",
    effects: { security: 1.5, sunlight: 0.5 },
    merits: ["防盜安全性優於1樓，外界視線不易窺探，蟲害少。"],
    cautions: ["下方若有鄰居，仍需留意自身走動腳步聲。"],
    demerits: [],
    naiken: "確認陽台周邊有無水管或雨遮等易攀爬死角"
  },
  {
    id: "pos_1f",
    name: "1階",
    category: "位置",
    overall: "⚠️ 需妥協",
    overallType: "negative",
    effects: { security: -2, sunlight: -1, rent: 1 },
    merits: ["出入免爬梯，不怕腳步聲吵到樓下，租金通常有折扣。"],
    cautions: ["晾衣服或開窗時需提高隱私與防盜警覺。"],
    demerits: ["防盜防窺風險較高，室外濕氣與蚊蟲較易進入。"],
    naiken: "確認窗戶防盜鐵欄（面格子）與對外視線遮蔽性"
  },

  // 4. 築年數
  {
    id: "age_new",
    name: "新築・築浅（5年以内）",
    category: "築年",
    overall: "◎ 明顯優點",
    overallType: "positive",
    effects: { building: 2, security: 1, rent: -1 },
    merits: ["最新耐震與節能標準，設備潔淨現代化，居住舒適度最高。"],
    cautions: ["租金與初期費用（禮金保證金）門檻最高。"],
    demerits: [],
    naiken: "確認室內有無新裝潢接著劑味道"
  },
  {
    id: "age_10_20",
    name: "築10〜20年",
    category: "築年",
    overall: "○ 加分條件",
    overallType: "positive",
    effects: { building: 0.5, rent: 0.5 },
    merits: ["符合新耐震法規，設備實用完備，租金性價比最佳。"],
    cautions: ["衛浴廚房風格可能稍具年代感。"],
    demerits: [],
    naiken: "確認水龍頭水壓與換氣扇運轉聲音"
  },
  {
    id: "age_30_plus",
    name: "築30年以上",
    category: "築年",
    overall: "△ 中性/看習慣",
    overallType: "neutral",
    effects: { building: -0.5, rent: 1.5 },
    merits: ["同預算下室內面積通常較大，租金非常便宜。"],
    cautions: ["室內即使翻修，公共管線與窗框氣密仍具年代感。"],
    demerits: [],
    naiken: "確認排水孔異味、窗框氣密程度與電箱簽約安培數"
  },
  {
    id: "age_old_quake",
    name: "旧耐震基準（1981年5月以前建）",
    category: "築年",
    overall: "👎 明顯抗性",
    overallType: "negative",
    effects: { building: -2, rent: 2 },
    merits: ["同地段租金極低，部分物件室內已完成全面翻新。"],
    cautions: ["需向房仲或管委會確認是否有做過耐震補強工程。"],
    demerits: ["建造於1981年新耐震法規前，大地震時的抗震安全係數較低。"],
    naiken: "確認大樓外壁是否有結構龜裂、是否實施過耐震診斷"
  },

  // 5. 駅徒歩
  {
    id: "walk_5",
    name: "駅徒歩5分以内",
    category: "駅徒歩",
    overall: "◎ 明顯優點",
    overallType: "positive",
    effects: { location: 2, security: 1, rent: -1 },
    merits: ["每日通勤零壓力，雨天輕鬆，夜道多路燈商店更安全。"],
    cautions: ["若靠車站太近，可能有些許鬧區喧囂或人流。"],
    demerits: [],
    naiken: "確認關窗時車站人流或列車聲"
  },
  {
    id: "walk_10",
    name: "駅徒歩6〜10分",
    category: "駅徒歩",
    overall: "○ 加分條件",
    overallType: "positive",
    effects: { location: 1, quietness: 0.5 },
    merits: ["兼顧通勤實用性與住宅區安靜生活品質的黃金平衡。"],
    cautions: ["若沿途有長坡道或紅綠燈，體感時間可能稍長。"],
    demerits: [],
    naiken: "確認沿途坡度與行人道安全寬度"
  },
  {
    id: "walk_15_plus",
    name: "駅徒歩15分以上",
    category: "駅徒歩",
    overall: "⚠️ 需妥協",
    overallType: "negative",
    effects: { location: -2, quietness: 1, rent: 2 },
    merits: ["租金性價比極高，房間大且周邊環境開闊清幽。"],
    cautions: ["生活動線通常需依賴自行車或公車轉乘。"],
    demerits: ["天候惡劣時往返疲憊，深夜錯過終電交通不便。"],
    naiken: "確認公車站班次頻率與車站駐輪場空位"
  },

  // 6. 設備
  {
    id: "equip_bt_sep",
    name: "バストイレ別",
    category: "設備",
    overall: "◎ 明顯優點",
    overallType: "positive",
    effects: { building: 1 },
    merits: ["衛浴分離舒適衛生，馬桶乾燥無水氣，生活品質高。"],
    cautions: ["相比一體成型衛浴會佔用些許室內居室面積。"],
    demerits: [],
    naiken: "確認脫衣空間與浴室換氣乾燥設備"
  },
  {
    id: "equip_washbasin",
    name: "独立洗面台",
    category: "設備",
    overall: "○ 加分條件",
    overallType: "positive",
    effects: { building: 1 },
    merits: ["早晨梳洗效率高，化妝與日常清潔瓶罐收納充足。"],
    cautions: ["在小套房格局中可能會稍稍壓縮居室空間。"],
    demerits: [],
    naiken: "確認洗面台插座數量與吹風機放置位置"
  },
  {
    id: "equip_autolock",
    name: "オートロック",
    category: "設備",
    overall: "◎ 明顯優點",
    overallType: "positive",
    effects: { security: 2, rent: -0.5 },
    merits: ["有效阻絕推銷員與可疑人士進入走廊，獨居安全感倍增。"],
    cautions: ["無法完全杜絕住戶進門時的尾隨情況。"],
    demerits: [],
    naiken: "確認是否配備彩色螢幕對講機"
  },
  {
    id: "equip_indoor_wash",
    name: "室内洗濯機置場",
    category: "設備",
    overall: "◎ 明顯優點",
    overallType: "positive",
    effects: { building: 1 },
    merits: ["洗衣機不日曬雨淋劣化，夜間或雨雪天洗衣服安全舒適。"],
    cautions: ["洗衣機尺寸受防水盤規格長寬限制。"],
    demerits: [],
    naiken: "丈量防水盤長寬與水龍頭高度（滾筒式是否可放入）"
  },
  {
    id: "equip_delivery",
    name: "宅配ボックス",
    category: "設備",
    overall: "◎ 明顯優點",
    overallType: "positive",
    effects: { building: 1 },
    merits: ["不在家或開會洗澡時也能安全收貨，免受再配送困擾。"],
    cautions: ["戶數多的社區可能偶爾出現置物格全滿。"],
    demerits: [],
    naiken: "確認大樓宅配箱總格數"
  },
  {
    id: "equip_elevator",
    name: "エレベーター",
    category: "設備",
    overall: "○ 加分條件",
    overallType: "positive",
    effects: { building: 1 },
    merits: ["日常出入、搬運重物與行李極度便利。"],
    cautions: ["電梯維護費用通常直接反映在每月管理費中。"],
    demerits: [],
    naiken: "確認電梯保養狀況與車廂內監視器"
  },

  // 7. 周邊
  {
    id: "env_main_road",
    name: "大通り沿い",
    category: "周邊",
    overall: "⚠️ 需妥協",
    overallType: "negative",
    effects: { quietness: -2, sunlight: 1, security: 1 },
    merits: ["棟距寬闊採光通風好，夜間路燈明亮人流多較安全。"],
    cautions: ["突發救護車或機車拉轉聲可能較明顯。"],
    demerits: ["車流噪音震動，排氣粉塵容易弄髒窗台與陽台衣物。"],
    naiken: "確認窗戶緊閉時的隔音效果與窗台粉塵沉積情況"
  },
  {
    id: "env_railway",
    name: "線路沿い",
    category: "周邊",
    overall: "👎 明顯抗性",
    overallType: "negative",
    effects: { quietness: -2, rent: 1 },
    merits: ["通往車站路線直覺單純，同條件下租金通常有折扣。"],
    cautions: ["日常生活節奏需適應首末班車營運時間。"],
    demerits: ["早晚列車通過噪音、煞車尖銳聲、平交道警報音與微震動。"],
    naiken: "實測列車通過時室內的音量與窗台震動感受"
  }
];
