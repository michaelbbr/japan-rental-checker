import { Rule } from './types';

export const RULES: Rule[] = [
  {
    id: "orientation_south",
    name: { ja: "南向き", zh: "南向採光", zhCN: "南向采光", en: "South-Facing" },
    category: "採光",
    overall: { ja: "◎ 最良の採光条件", zh: "◎ 明顯優點", zhCN: "◎ 明显优点", en: "◎ Excellent" },
    overallType: "positive",
    effects: { sunlight: 2.0, rent: -0.5 },
    merits: [
      { ja: "終日日当たり良好で冬場も暖かく、洗濯物がよく乾きます。", zh: "全天日照時間最長，冬天室內溫暖，曬衣乾得快。", zhCN: "全天日照时间最长，冬天室内温暖，晾衣干得快。", en: "Best natural daylight throughout the day; warm in winter and quick laundry drying." }
    ],
    cautions: [
      { ja: "相場として家賃が高めに設定されやすい傾向があります。", zh: "同地段同規格下，南向租金通常較其他朝向高出約 2,000〜5,000 円。", zhCN: "同地段同规格下，南向租金通常较高。", en: "Rents for south-facing units tend to be slightly higher than other orientations." }
    ],
    demerits: [],
    naiken: { ja: "向かいの建物による影やバルコニーの抜け感を確認。", zh: "確認對面建築物有無遮擋，陽台向外視野是否開闊。", zhCN: "确认对面建筑物有无遮挡，阳台视野是否开阔。", en: "Check for obstructions from opposite buildings and open view from balcony." }
  },
  {
    id: "orientation_southwest",
    name: { ja: "南西向き", zh: "南西向採光", zhCN: "南西向采光", en: "Southwest-Facing" },
    category: "採光",
    overall: { ja: "○ 午後良好・西日注意", zh: "○ 加分條件（午後佳）", zhCN: "○ 加分条件（午后佳）", en: "○ Good (Afternoon Sun)" },
    overallType: "positive",
    effects: { sunlight: 1.0, rent: 0 },
    merits: [
      { ja: "午後の採光が十分で、冬の夕方まで室内が暖かく保たれます。", zh: "午後採光充足，冬天傍晚室內依然溫暖舒適。", zhCN: "午后采光充足，冬天傍晚室内依然温暖舒适。", en: "Ample afternoon daylight, keeping the room warm until late afternoon in winter." }
    ],
    cautions: [
      { ja: "夏場の午後、西日による室温上昇とエアコン負荷に注意。", zh: "夏季午後西曬較熱，建議搭配抗 UV 遮光窗簾及適度空調。", zhCN: "夏季午后西晒较热，建议搭配遮光窗帘与适度空调。", en: "Intense afternoon sun in summer; blackout curtains and air conditioning recommended." }
    ],
    demerits: [],
    naiken: { ja: "午後の日当たりの強さとエアコンの設置位置を確認。", zh: "建議午後看房確認西曬熱度與冷氣出風口位置。", zhCN: "建议午后看房确认西晒热度与空调安装位置。", en: "Inspect afternoon sunlight intensity and air conditioner placement." }
  },
  {
    id: "orientation_north",
    name: { ja: "北向き", zh: "北向採光", zhCN: "北向采光", en: "North-Facing" },
    category: "採光",
    overall: { ja: "▲ 日照難・湿気注意", zh: "▲ 需妥協條件", zhCN: "▲ 需妥协条件", en: "▲ Compromise Needed" },
    overallType: "negative",
    effects: { sunlight: -2.0, rent: 1.0 },
    merits: [
      { ja: "家賃が同条件の南向きより安く抑えられ、夏の直射日光がありません。", zh: "租金通常較平價實惠，夏季不會受到強烈陽光直射暴曬。", zhCN: "租金通常较平价实惠，夏季无强烈直射暴晒。", en: "Lower rent compared to south-facing units; avoids scorching summer heat." }
    ],
    cautions: [
      { ja: "冬場は冷え込みやすく、日照が少ないため湿気・結露対策が必須です。", zh: "冬季較陰冷，直射陽光少，需特別注意室內除濕與通風防止發霉。", zhCN: "冬季较阴冷，直射阳光少，需注意除湿防霉。", en: "Chillier in winter with minimal direct sun; dehumidification and ventilation needed." }
    ],
    demerits: [],
    naiken: { ja: "窓枠やクローゼット奥のカビ臭・結露跡を入念に確認。", zh: "內見時重點檢查窗框周圍、衣櫃角落是否有水氣結露或霉味。", zhCN: "看房时重点检查窗框周围、衣柜角落是否有水汽结露或霉味。", en: "Check window frames and wardrobe corners for condensation and mold odor." }
  },
  {
    id: "structure_src",
    name: { ja: "SRC造（鉄骨鉄筋コンクリート）", zh: "SRC結構（鋼骨鋼筋混凝土）", zhCN: "SRC结构（钢骨钢筋混凝土）", en: "SRC (Steel Reinforced Concrete)" },
    category: "構造",
    overall: { ja: "◎ 最高峰の耐震・遮音性", zh: "◎ 明顯優點", zhCN: "◎ 明显优点", en: "◎ Best Durability & Soundproofing" },
    overallType: "positive",
    effects: { building: 2.0, quietness: 1.5, rent: -0.5 },
    merits: [
      { ja: "最高水準の耐震・耐火性能を誇り、遮音性も極めて高い安心の堅牢構造です。", zh: "具備日本住宅最高等級之耐震與耐火規格，隔音效果極佳，抗外界生活音干擾。", zhCN: "具备日本住宅最高等级耐震与耐火规格，隔音效果极佳。", en: "Top-tier earthquake resistance, fireproofing, and superior structural sound insulation." }
    ],
    cautions: [
      { ja: "堅牢な構造のため建築コストが高く、家賃や管理費も高めに設定されます。", zh: "建築成本最高，市場租金與管理費通常相對較高。", zhCN: "建筑成本最高，市场租金与管理费相对偏高。", en: "Higher construction costs often reflect in higher rent and management fees." }
    ],
    demerits: [],
    naiken: { ja: "外壁のクラック有無や共用部の管理状態を確認。", zh: "觀察外牆混凝土有無龜裂裂痕，確認公設與走廊清潔維護狀態。", zhCN: "观察外墙混凝土有无裂纹，确认公区维护状态。", en: "Inspect exterior concrete for cracks and verify common area maintenance." }
  },
  {
    id: "structure_rc",
    name: { ja: "RC造（鉄筋コンクリート）", zh: "RC結構（鋼筋混凝土）", zhCN: "RC结构（钢筋混凝土）", en: "RC (Reinforced Concrete)" },
    category: "構造",
    overall: { ja: "◎ 高耐震・高遮音", zh: "◎ 明顯優點", zhCN: "◎ 明显优点", en: "◎ High Durability & Soundproofing" },
    overallType: "positive",
    effects: { building: 1.5, quietness: 1.0, rent: -0.5 },
    merits: [
      { ja: "耐火・耐震・遮音性能のバランスに優れ、マンションの標準構造として安心です。", zh: "耐震、耐火、遮音平衡性極佳，為中高檔公寓之標準優質結構。", zhCN: "耐震、耐火、隔音平衡极佳，为中高档公寓标准结构。", en: "Excellent balance of fire protection, earthquake resistance, and acoustic insulation." }
    ],
    cautions: [
      { ja: "気密性が高いため、冬場の換気や結露対策を意識する必要があります。", zh: "氣密性高，冬季建議定期開窗換氣防止室內結露。", zhCN: "气密性高，冬季建议定期通风防止室内结露。", en: "High airtightness requires periodic ventilation to prevent condensation in winter." }
    ],
    demerits: [],
    naiken: { ja: "壁を軽く叩き、乾式間仕切りではなくコンクリート界壁か確認。", zh: "輕敲鄰戶相鄰牆面，確認為實心混凝土牆而非空心輕隔間。", zhCN: "轻敲与邻室共用墙，确认为实心混凝土墙而非空心隔墙。", en: "Tap partition walls to confirm solid concrete rather than hollow drywall." }
  },
  {
    id: "structure_steel",
    name: { ja: "鉄骨造", zh: "鐵骨結構", zhCN: "铁骨结构", en: "Steel Frame" },
    category: "構造",
    overall: { ja: "△ 中性（遮音性要確認）", zh: "△ 中性條件", zhCN: "△ 中性条件", en: "△ Neutral (Verify Noise)" },
    overallType: "neutral",
    effects: { building: 0.5, quietness: -0.5, rent: 0.5 },
    merits: [
      { ja: "木造より耐震強度が高く、RC造に比べて家賃が手頃な傾向があります。", zh: "耐震強於木造，租金普遍比 RC 混凝土大樓更實惠手頃。", zhCN: "耐震强于木造，租金普遍比 RC 混凝土大楼更实惠。", en: "Better seismic strength than wood; more affordable rent than concrete (RC)." }
    ],
    cautions: [
      { ja: "壁の厚みによっては隣人の生活音や上階の足音が響く場合があります。", zh: "隔音弱於 RC 水泥牆，走廊腳步聲與鄰戶關門聲仍有部分傳導。", zhCN: "隔音弱于 RC 水泥墙，走廊脚步声与关门声仍有部分传导。", en: "Soundproofing is lower than RC; neighboring footsteps and door closures may transmit." }
    ],
    demerits: [],
    naiken: { ja: "室内で静かに耳を澄まし、上下左右の生活音の響き方を確認。", zh: "在室內安靜聆聽走廊與隔壁聲響，確認隔音是否符合個人接受度。", zhCN: "在室内安静聆听走廊与隔壁声响，确认隔音是否符合个人习惯。", en: "Listen carefully for hallway and neighbor sounds to verify acoustic comfort." }
  },
  {
    id: "structure_wood",
    name: { ja: "木造", zh: "木造建築", zhCN: "木造建筑", en: "Wood Construction" },
    category: "構造",
    overall: { ja: "▲ 遮音・耐震要妥協", zh: "▲ 需妥協條件", zhCN: "▲ 需妥协条件", en: "▲ Compromise Needed" },
    overallType: "negative",
    effects: { building: -1.0, quietness: -2.0, rent: 1.5 },
    merits: [
      { ja: "家賃・初期費用が圧倒的に安く、通気性に優れ夏場涼しい物件が多いです。", zh: "租金與初期費用最為親民便宜，通風透氣性能優良。", zhCN: "租金与初期费用最为亲民便宜，通风透气性能优良。", en: "Most affordable rent and initial costs; good natural ventilation." }
    ],
    cautions: [
      { ja: "遮音性が最も低く、足音・話し声・振動が隣室へ伝わりやすいです。", zh: "隔音最弱，上下樓走動腳步聲、講話聲極易互相干擾，神經敏感者慎選。", zhCN: "隔音最弱，脚步声与谈话声极易互相干扰，神经敏感者慎选。", en: "Lowest sound insulation; footsteps, conversations, and vibrations easily pass through." }
    ],
    demerits: [],
    naiken: { ja: "床を歩いた際のきしみ音や隣室のテレビ音・足音の伝わり方を確認。", zh: "實地走動確認地板有無異響，注意隔壁講話聲與電視聲傳播情況。", zhCN: "实地走动确认地板有无异响，注意隔壁说话声与电视声传播情况。", en: "Check floor creaks and whether neighboring voices or TV sounds can be heard." }
  },
  {
    id: "age_old_quake",
    name: { ja: "旧耐震基準（1981年5月以前建築）", zh: "舊耐震法規建築（1981年前）", zhCN: "旧耐震法规建筑（1981年前）", en: "Pre-1981 Building Code" },
    category: "耐震",
    overall: { ja: "⚠️ 妥協・耐震確認必須", zh: "⚠️ 需留意條件", zhCN: "⚠️ 需留意条件", en: "⚠️ Caution Required" },
    overallType: "negative",
    effects: { building: -2.0, rent: 1.5 },
    merits: [
      { ja: "都心一等地でも割安な家賃で住める物件が多く、リノベ済みも豊富です。", zh: "能在新宿、澀谷等一線都心精華地段以平價租金入住，室內多有重新翻修。", zhCN: "能在都心精华地段以平价租金入住，室内多有重新翻新。", en: "Offers significantly lower rents in prime Tokyo downtown areas." }
    ],
    cautions: [
      { ja: "1981年以前の旧耐震基準のため、耐震補強工事の有無や配管老朽化に注意。", zh: "抗震標準不及現行法規，且大樓給排水總管線多已老化，地震險費率較高。", zhCN: "抗震标准不及现行法规，大楼公用管道多已老化。", en: "Built before the modern 1981 earthquake code; check seismic retrofits and pipe aging." }
    ],
    demerits: [],
    naiken: { ja: "耐震診断・補強工事の実施状況や給排水管の臭気・水圧を確認。", zh: "確認大樓管委會有無完成耐震補強工程，並檢查水龍頭水壓與排水孔有無異味。", zhCN: "确认大楼管委会有无完成耐震补强工程，检查水龙头水压与排水孔异味。", en: "Verify whether seismic retrofitting was performed and check water pipe odor and pressure." }
  },
  {
    id: "age_30_plus",
    name: { ja: "築30年以上", zh: "屋齡30年以上", zhCN: "屋龄30年以上", en: "Age 30+ Years" },
    category: "築年数",
    overall: { ja: "△ 経年劣化・リノベ確認", zh: "△ 需留意條件", zhCN: "△ 需留意条件", en: "△ Caution (Aging)" },
    overallType: "neutral",
    effects: { building: -1.0, rent: 1.0 },
    merits: [
      { ja: "同等立地の築浅物件に比べて家賃が20〜30%安価です。", zh: "同地段租金通常較新成屋便宜 20%〜30% 以上，居住性價比高。", zhCN: "同地段租金通常较新成屋便宜 20%〜30% 以上，性价比高。", en: "Rents are typically 20-30% cheaper than newer properties in the same location." }
    ],
    cautions: [
      { ja: "窓枠の断熱性・気密性の低下や、共用部の経年感に留意が必要です。", zh: "窗框氣密隔音較差，室內保溫性弱，公設門面與電梯具年代感。", zhCN: "窗框气密隔音较弱，公用设施具年代感。", en: "Lower window insulation and airtightness; common areas reflect age." }
    ],
    demerits: [],
    naiken: { ja: "サッシの建付け、水回りのリフォーム状況、換気扇の動作を確認。", zh: "檢查對外窗是否密合不漏風、衛浴設備翻新年代及抽風機運轉聲音。", zhCN: "检查窗户是否密闭防风、卫浴设备翻新状况及换气扇噪音。", en: "Check window seals, bathroom renovation date, and ventilation fan operation." }
  },
  {
    id: "walk_5",
    name: { ja: "駅徒歩5分以内", zh: "距車站步行5分以內", zhCN: "距车站步行5分以内", en: "Within 5 Min Walk to Station" },
    category: "立地",
    overall: { ja: "◎ 極めて優秀なアクセス", zh: "◎ 明顯優點", zhCN: "◎ 明显优点", en: "◎ Exceptional Convenience" },
    overallType: "positive",
    effects: { location: 2.0, rent: -0.5 },
    merits: [
      { ja: "雨天や深夜の帰宅も非常に快適で、移動の疲労が最小限に抑えられます。", zh: "下雨天與深夜回家極為輕鬆安全，省去大量往返通勤時間與步行體力消耗。", zhCN: "雨天与深夜回家极为轻松安全，节省大量通勤时间。", en: "Effortless commute even in rain or late night; minimizes transit fatigue." }
    ],
    cautions: [
      { ja: "駅前の繁華街や線路が近い場合、周囲の騒音や人通りを確認してください。", zh: "若鄰近鐵道或站前繁華商圈，夜晚人潮聲或平交道聲響需實地留意。", zhCN: "若邻近铁道或站前繁华商圈，夜晚人声需实地留意。", en: "Check for ambient station crowds or train noise if near busy thoroughfares." }
    ],
    demerits: [],
    naiken: { ja: "実際の改札口までの所要時間と、夜間の駅からの帰り道の安全性を確認。", zh: "親測從房門走到「月台閘門」之真實秒數，並確認夜間沿途路燈照明。", zhCN: "实测从房门走到检票口真实时间，并确认夜间沿途路灯照明。", en: "Time the actual walk to the ticket gate and verify night street lighting." }
  },
  {
    id: "equip_no_autolock",
    name: { ja: "オートロックなし", zh: "無自動門禁系統", zhCN: "无自动门禁系统", en: "No Auto-Lock Building Entry" },
    category: "防犯",
    overall: { ja: "⚠️ 防犯・セールス要留意", zh: "⚠️ 需留意條件", zhCN: "⚠️ 需留意条件", en: "⚠️ Security Caution" },
    overallType: "negative",
    effects: { security: -1.5, rent: 0.5 },
    merits: [
      { ja: "家賃や管理費が安く設定され、デリバリーの受け取りもスムーズです。", zh: "管理費通常較低，外送員送餐可直接抵達家門口。", zhCN: "管理费通常较低，外卖配送可直接到达家门口。", en: "Lower maintenance fees; food delivery can access door directly." }
    ],
    cautions: [
      { ja: "部外者や訪問営業が自室の玄関ドア前まで直接立ち入ることができます。", zh: "推銷員、可疑外部人員皆可無阻礙直達各戶房門前，獨居者防護需加強。", zhCN: "推销员与外部人员可无阻碍到达房门前，独居者防范需加强。", en: "Visitors and salespeople can walk up directly to your apartment door." }
    ],
    demerits: [],
    naiken: { ja: "玄関ドアのシリンダーキー種類（ディンプルキーか）とポストの施錠を確認。", zh: "確認房門鎖是否為防撬圓點鎖（Dimple Key），並檢查信箱是否具密碼防窺鎖。", zhCN: "确认门锁是否为防撬圆点锁（Dimple Key），检查信箱防窥锁。", en: "Check if door lock is a high-security dimple key and inspect mailbox locks." }
  },
  {
    id: "equip_bt_sep",
    name: { ja: "バストイレ別", zh: "乾濕分離（衛浴獨立）", zhCN: "干湿分离（卫浴独立）", en: "Separate Bath and Toilet" },
    category: "設備",
    overall: { ja: "◎ 快適な居住性", zh: "◎ 明顯優點", zhCN: "◎ 明显优点", en: "◎ High Comfort" },
    overallType: "positive",
    effects: { building: 1.0, rent: -0.5 },
    merits: [
      { ja: "浴室とトイレが分かれており、湿気がこもらず快適に入浴できます。", zh: "洗澡泡澡與如廁完全分開，浴室不易殘留異味，毛巾地墊不會受潮。", zhCN: "洗澡与如厕完全分开，浴室不易残留异味与湿气。", en: "Bath and toilet are separate; bathroom stays dry with no humidity intrusion." }
    ],
    cautions: [],
    demerits: [],
    naiken: { ja: "浴室の換気扇の吸気力とカビの有無を確認。", zh: "開啓浴室換氣扇確認抽風吸力，檢查矽利康膠條有無發霉黑斑。", zhCN: "开启浴室换气扇确认吸力，检查胶条有无发霉黑斑。", en: "Check bathroom exhaust fan airflow and inspect silicone sealant for mold." }
  },
  {
    id: "env_main_road",
    name: { ja: "幹線道路・大通り沿い", zh: "臨大馬路幹道（甲州街道等）", zhCN: "临大马路干道（甲州街道等）", en: "Along Major Arterial Road" },
    category: "周辺環境",
    overall: { ja: "⚠️ 走行音・排気ガスに注意", zh: "⚠️ 需留意噪音", zhCN: "⚠️ 需留意噪音", en: "⚠️ Traffic Noise Caution" },
    overallType: "negative",
    effects: { quietness: -2.0, location: 0.5 },
    merits: [
      { ja: "夜間でも人通りと街灯が多く、夜道の安全性は高いです。", zh: "夜間沿線燈火通明且人車頻繁，夜間步行回家安全性高、不易遇危險死角。", zhCN: "夜间沿线灯火通明且人车频繁，夜间步行回家安全性高。", en: "Well-lit street with continuous night visibility and higher pedestrian safety." }
    ],
    cautions: [
      { ja: "トラックの走行音、緊急車両のサイレン、排気ガスやホコリに留意が必要。", zh: "重車行駛之低頻震動、救護車緊急警笛聲頻繁，陽台曬衣易沾附道路落塵灰塵。", zhCN: "重车行驶震动、救护车警笛声较频繁，阳台晾衣易沾灰尘。", en: "Heavy truck rumble, frequent emergency sirens, and traffic soot on balconies." }
    ],
    demerits: [],
    naiken: { ja: "窓を閉めた状態での遮音性（二重サッシか）と窓枠の汚れを確認。", zh: "閉緊氣密窗仔細聆聽戶外車流隔音效果，並檢查窗框邊緣積塵狀況。", zhCN: "紧闭窗户仔细聆听户外车流隔音效果，检查窗框积尘状况。", en: "Close all windows tightly to evaluate noise insulation and check window sill dust." }
  }
];
