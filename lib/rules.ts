import { Rule } from './types';

export const RULES: Rule[] = [
  // 方角
  { id: "orientation_south", name: "南向き", category: "朝向", effects: { sunlight: 2, rent: -0.5 }, bullets: { merit: "全天日照時間最長，室內明亮且冬季溫暖。", caution: "人氣最高，同條件下租金通常較高。" }, naiken: "確認南側是否有鄰棟阻擋採光", kw: ["南向き", "南向"] },
  { id: "orientation_southwest", name: "南西向き", category: "朝向", effects: { sunlight: 1.5 }, bullets: { merit: "午後採光充足，冬天傍晚室內依然溫暖。", caution: "夏天強烈西曬，室內溫度容易偏高。" }, naiken: "確認遮熱氣密窗隔熱效果及遮光窗簾軌道", kw: ["南西向き", "南西向", "南西"] },
  { id: "orientation_southeast", name: "南東向き", category: "朝向", effects: { sunlight: 2 }, bullets: { merit: "早晨到午後光線充沛，晨型生活作息極佳。", caution: "傍晚光線轉暗較快。" }, naiken: "確認東至南向視野採光開闊度", kw: ["南東向き", "南東向"] },
  { id: "orientation_east", name: "東向き", category: "朝向", effects: { sunlight: 1 }, bullets: { merit: "早晨採光極佳有助作息，無夏季西曬煩惱。", caution: "午後直射光消失，冬季下午室溫下降較快。" }, naiken: "確認上午曬衣空間通風與採光", kw: ["東向き", "東向"] },
  { id: "orientation_west", name: "西向き", category: "朝向", effects: { sunlight: 0.5 }, bullets: { merit: "午後日照長，冬天下半天室內暖和。", caution: "夏季西曬強烈，家具易受紫外線影響。" }, naiken: "確認冷氣冷房能力與西曬時室溫", kw: ["西向き", "西向"] },
  { id: "orientation_north", name: "北向き", category: "朝向", effects: { sunlight: -2, rent: 1 }, bullets: { merit: "全日光線均勻柔和，同棟租金最便宜。", demerit: "直射日照極少，容易潮濕發黴結露。" }, naiken: "確認窗框與牆角有無結露水黴痕跡", kw: ["北向き", "北向"] },

  // 構造
  { id: "structure_src", name: "SRC造", category: "構造", effects: { building: 2, quietness: 1.5, rent: -0.5 }, bullets: { merit: "耐火、耐震與隔音皆屬頂級，生活音極少干擾。", caution: "租金與管理費基底通常偏高。" }, naiken: "確認室內樑柱是否過於突出影響家具擺設", kw: ["SRC", "鉄骨鉄筋"] },
  { id: "structure_rc", name: "RC造", category: "構造", effects: { building: 1.5, quietness: 1 }, bullets: { merit: "隔音與氣密性優良，鄰室生活音不易傳遞。", caution: "氣密性高，需保持日常定期換氣。" }, naiken: "輕敲共用戶牆確認是否為厚實水泥隔間", kw: ["RC", "鉄筋コンクリート"] },
  { id: "structure_steel", name: "鉄骨造", category: "構造", effects: { building: 0, quietness: -0.5, rent: 0.5 }, bullets: { merit: "耐震優於木造，租金性價比佳。", caution: "隔音中等，走廊腳步聲與關門聲可能略微傳導。" }, naiken: "確認走廊走動與關門聲響", kw: ["鉄骨造", "軽量鉄骨", "重量鉄骨", "S造"] },
  { id: "structure_wood", name: "木造", category: "構造", effects: { building: -1, quietness: -2, rent: 1.5 }, bullets: { merit: "透氣性好，同地段中租金最親民。", demerit: "隔音較弱，上下左右生活音與腳步聲容易穿透。" }, naiken: "確認樓上走動聲與隔壁交談音量傳導", kw: ["木造", "アパート"] },

  // 房型位置
  { id: "pos_corner", name: "角部屋", category: "位置", effects: { quietness: 1.5, sunlight: 1 }, bullets: { merit: "僅一側相鄰住戶，生活音干擾少且具雙面採光。", caution: "外壁面積大，冬天室溫受外氣影響較大。" }, naiken: "確認側面窗外是否正對鄰棟走道影響隱私", kw: ["角部屋", "角室", "2面採光"] },
  { id: "pos_top", name: "最上階", category: "位置", effects: { quietness: 2, sunlight: 1 }, bullets: { merit: "完全無上方住戶腳步聲，日照與視野最佳。", caution: "頂樓直受日照，夏季室溫偏高。" }, naiken: "確認頂樓隔熱與蓮蓬頭出水水壓", kw: ["最上階"] },
  { id: "pos_2f_plus", name: "2階以上", category: "位置", effects: { security: 1.5, sunlight: 0.5 }, bullets: { merit: "防盜性優於1樓，窗外視線不易窺探。", caution: "若下方有鄰居，仍需留意自身走動腳步聲。" }, naiken: "確認窗外管線是否有易攀爬死角", kw: ["2階", "3階", "4階", "5階", "6階", "7階", "8階", "9階", "10階", "11階", "12階", "13階"] },
  { id: "pos_1f", name: "1階", category: "位置", effects: { security: -2, sunlight: -1, rent: 1 }, bullets: { merit: "出入免爬梯，不怕吵到樓下，租金有折扣。", demerit: "防盜防窺隱憂較大，濕氣與蚊蟲風險高。" }, naiken: "確認防盜窗鐵欄、對外視線遮蔽度", kw: ["1階", "１階", "1F"] },

  // 築年
  { id: "age_new", name: "新築・築浅", category: "築年", effects: { building: 2, security: 1, rent: -1 }, bullets: { merit: "符合最新耐震法規，設備新穎乾淨。", caution: "租金與禮金押金等初期成本最高。" }, naiken: "確認有無裝修接著劑味道", kw: ["新築", "築浅", "築1年", "築2年", "築3年", "築4年", "築5年"] },
  { id: "age_10_20", name: "築10〜20年", category: "築年", effects: { building: 0.5, rent: 0.5 }, bullets: { merit: "新耐震法規，設備實用，租金性價比最佳平衡點。", caution: "衛浴廚房風格可能稍具年代感。" }, naiken: "確認水龍頭水壓與換氣扇運轉聲", kw: ["築10年", "築12年", "築15年", "築18年", "築20年"] },
  { id: "age_30_plus", name: "築30年以上", category: "築年", effects: { building: -0.5, rent: 1.5 }, bullets: { merit: "同預算下室內面積大，租金非常便宜。", caution: "共用管線老化、窗框氣密需注意確認。" }, naiken: "確認排水孔異味、窗框氣密度與總電箱安培數", kw: ["築30年", "築35年", "築40年", "築45年", "築48年", "築50年"] },
  { id: "age_old_quake", name: "旧耐震（1981年5月以前）", category: "築年", effects: { building: -2, rent: 2 }, bullets: { merit: "好地段租金便宜，部分物件室內全翻新。", caution: "需向管委會確認是否有做過耐震補強工事。", demerit: "未達現代耐震法規標準，大地震時抗震安全較堪憂。" }, naiken: "確認大樓外壁有無明顯龜裂、是否完成耐震補強診斷", kw: ["1978年", "1979年", "1980年", "197", "旧耐震"] },

  // 交通
  { id: "walk_5", name: "駅徒歩5分以内", category: "駅徒歩", effects: { location: 2, security: 1, rent: -1 }, bullets: { merit: "通勤完全無壓力，雨天輕鬆，夜道安全。", caution: "若靠車站太近，可能有些許喧囂聲。" }, naiken: "確認關窗時車站人流或列車聲", kw: ["徒歩1分", "徒歩2分", "徒歩3分", "徒歩4分", "徒歩5分"] },
  { id: "walk_10", name: "駅徒歩6〜10分", category: "駅徒歩", effects: { location: 1, quietness: 0.5 }, bullets: { merit: "兼顧通勤便捷與住宅區寧靜生活。", caution: "若有坡道或等紅燈，體感時間可能稍長。" }, naiken: "確認沿途坡度與行人道安全寬度", kw: ["徒歩6分", "徒歩7分", "徒歩8分", "徒歩9分", "徒歩10分"] },
  { id: "walk_15_plus", name: "駅徒歩15分以上", category: "駅徒歩", effects: { location: -2, quietness: 1, rent: 2 }, bullets: { merit: "租金大幅便宜，房間大且周邊清幽。", demerit: "天候不佳時往返疲憊，需依賴單車或公車。" }, naiken: "確認公車站班次與車站駐輪場空位", kw: ["徒歩15分", "徒歩20分"] },

  // 設備
  { id: "equip_bt_sep", name: "バストイレ別", category: "設備", effects: { building: 1 }, bullets: { merit: "衛浴分離舒適衛生，馬桶乾燥好整理。", caution: "相比三合一浴廁會佔用些許室內空間。" }, naiken: "確認脫衣空間與換氣乾燥設備", kw: ["バストイレ別", "バス・トイレ別", "Ｂ・Ｔ別", "BT別"] },
  { id: "equip_washbasin", name: "独立洗面台", category: "設備", effects: { building: 1 }, bullets: { merit: "早晨梳洗效率高，化妝與日常用品收納充足。", caution: "佔用些許居室空間。" }, naiken: "確認洗面台插座數量與吹風機放置空間", kw: ["洗面所独立", "独立洗面台", "洗面化粧台"] },
  { id: "equip_autolock", name: "オートロック", category: "設備", effects: { security: 2, rent: -0.5 }, bullets: { merit: "有效防範可疑人士隨意進入走廊，獨居安心。", caution: "無法完全杜絕住戶尾隨進門情況。" }, naiken: "確認是否配備彩色螢幕對講機", kw: ["オートロック"] },
  { id: "equip_indoor_wash", name: "室内洗濯機置場", category: "設備", effects: { building: 1 }, bullets: { merit: "洗衣機不日曬雨淋，夜間或雨天洗衣方便。", caution: "洗衣機尺寸受防水盤規格限制。" }, naiken: "丈量防水盤長寬與水龍頭高度", kw: ["室内洗濯機置場", "室内洗濯機置き場", "室内洗濯機"] },
  { id: "equip_delivery", name: "宅配ボックス", category: "設備", effects: { building: 1 }, bullets: { merit: "隨時無人收件，免受再配送困擾。", caution: "住戶多時置物格偶爾可能滿載。" }, naiken: "確認大樓宅配箱總格數", kw: ["宅配ボックス", "宅配BOX"] },
  { id: "equip_elevator", name: "エレベーター", category: "設備", effects: { building: 1 }, bullets: { merit: "上下樓及搬運重物行李極度便利。", caution: "通常會反映在每月管理費中。" }, naiken: "確認電梯維護狀況與車廂內監視器", kw: ["エレベーター", "エレベータ"] },

  // 周邊
  { id: "env_main_road", name: "大通り沿い", category: "周邊", effects: { quietness: -2, sunlight: 1, security: 1 }, bullets: { merit: "前方開闊採光通風好，夜間路燈明亮。", demerit: "車流噪聲振動、排氣粉塵容易弄髒窗台與陽台。" }, naiken: "窗戶緊閉時的隔音效果、窗台粉塵狀況", kw: ["大通り沿い", "大通り"] },
  { id: "env_railway", name: "線路沿い", category: "周邊", effects: { quietness: -2, rent: 1 }, bullets: { merit: "通常租金相較便宜，通往車站路線直覺。", demerit: "早班至末班車通過時的噪音、平交道鈴聲與微震動。" }, naiken: "列車通過時室內的音量與震動感", kw: ["線路沿い", "線路近"] }
];
