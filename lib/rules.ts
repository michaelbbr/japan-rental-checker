import { Rule } from './types';

export const RULES: Rule[] = [
  // 1. Orientations
  {
    id: "orientation_south",
    name: { ja: "南向き", zh: "南向", zhCN: "南向", en: "South-facing" },
    category: "環境",
    overall: { ja: "採光良好", zh: "採光極佳", zhCN: "采光极佳", en: "Excellent Sunlight" },
    overallType: "positive",
    effects: { sunlight: 2.0 },
    merits: [
      { ja: "日照時間が長く、冬でも部屋が暖まりやすい。", zh: "全天日照時間最長，室內明亮溫暖，冬天節省暖氣費用。", zhCN: "全天日照时间最长，室内明亮温暖，冬天节省暖气费用。", en: "Longest hours of natural sunlight; keeps the room warm and bright in winter." },
      { ja: "洗濯物がよく乾き、カビや結露のリスクが低い。", zh: "衣物曬乾速度最快，濕氣與結露發霉風險大幅降低。", zhCN: "衣物晾干速度最快，湿气与结露发霉风险大幅降低。", en: "Laundry dries quickly; significantly lower risk of mold and condensation." }
    ],
    cautions: [
      { ja: "夏場は室温が上がりやすいため遮光カーテンの利用を推奨。", zh: "夏季午後室內升溫較快，建議搭配遮光隔熱窗簾。", zhCN: "夏季午后室内升温较快，建议搭配遮光隔热窗帘。", en: "Interior can get hot in mid-summer; blackout or thermal curtains recommended." }
    ],
    demerits: [],
    naiken: {
      ja: "向かいの建物による日陰の有無、窓の開口部と周囲の視界を確認。",
      zh: "現場確認前方是否有大樓遮擋採光，以及開窗後的隱私視線。",
      zhCN: "现场确认前方是否有大楼遮挡采光，以及开窗后的隐私视线。",
      en: "Check if opposite buildings cast shadows, and inspect privacy from windows."
    }
  },
  {
    id: "orientation_southeast",
    name: { ja: "南東向き", zh: "東南向", zhCN: "东南向", en: "Southeast-facing" },
    category: "環境",
    overall: { ja: "理想的な採光", zh: "理想採光", zhCN: "理想采光", en: "Ideal Sunlight" },
    overallType: "positive",
    effects: { sunlight: 2.0 },
    merits: [
      { ja: "朝から心地よい陽光が入り、午後の強烈な西日は避けられる理想の採光。", zh: "清晨即有柔和朝陽灑入，午後又不會受到西曬高溫肆虐，被公認為日本最舒適朝向。", zhCN: "清晨即有柔和朝阳洒入，午后不会受到西晒高温肆虐，公认为最舒适朝向。", en: "Receives gentle morning sunlight without harsh afternoon sun, considered the most comfortable orientation in Japan." }
    ],
    cautions: [],
    demerits: [],
    naiken: {
      ja: "午前中のバルコニーの日当たりと、周囲の建物による影の有無を確認。",
      zh: "確認上午陽台日照進光狀況，以及是否有鄰棟遮蔽。",
      zhCN: "确认上午阳台日照进光状况，以及是否有邻栋遮蔽。",
      en: "Verify morning sun coverage on the balcony and check for shadows from nearby structures."
    }
  },
  {
    id: "orientation_southwest",
    name: { ja: "南西向き", zh: "西南向", zhCN: "西南向", en: "Southwest-facing" },
    category: "環境",
    overall: { ja: "午後日照十分", zh: "午後日照充足", zhCN: "午后日照充足", en: "Ample Afternoon Sun" },
    overallType: "neutral",
    effects: { sunlight: 1.0 },
    merits: [
      { ja: "お昼前から夕方まで日当たりが続き、冬の夕方も部屋が温かい。", zh: "午前至傍晚採光充沛，冬季傍晚室內依然維持溫暖舒適。", zhCN: "午前至傍晚采光充沛，冬季傍晚室内依然维持温暖舒适。", en: "Sunlight extends from late morning to evening; stays pleasantly warm in winter." }
    ],
    cautions: [
      { ja: "夏場の午後は西日により室温が高くなりやすく、エアコン消費が増える傾向。", zh: "夏季午後西曬強烈，室內升溫明顯且冷氣耗電量較大。", zhCN: "夏季午后西晒强烈，室内升温明显且冷气耗电量较大。", en: "Intense afternoon sun during summer can increase room temperature and AC electricity bills." }
    ],
    demerits: [],
    naiken: {
      ja: "午後の西日の強さと、遮光カーテンや断熱フィルムの設置要否を確認。",
      zh: "留意下午西曬直射程度，評估是否需加裝一級遮光窗簾或隔熱貼膜。",
      zhCN: "留意下午西晒直射程度，评估是否需加装一级遮光窗帘或隔热贴膜。",
      en: "Inspect afternoon sun exposure and assess the need for UV/blackout thermal curtains."
    }
  },
  {
    id: "orientation_east",
    name: { ja: "東向き", zh: "東向", zhCN: "东向", en: "East-facing" },
    category: "環境",
    overall: { ja: "朝型生活に最適", zh: "晨型人首選", zhCN: "晨型人首选", en: "Great for Early Risers" },
    overallType: "neutral",
    effects: { sunlight: 1.0 },
    merits: [
      { ja: "清々しい朝日が入るため、朝型の生活リズムが整いやすい。", zh: "早晨天然陽光喚醒，非常適合早起上班或作息規律的晨型族群。", zhCN: "早晨天然阳光唤醒，非常适合早起上班或作息规律的晨型人群。", en: "Bright early morning sunshine helps establish a healthy, energetic morning routine." }
    ],
    cautions: [
      { ja: "午後以降は直射日光が入らなくなるため、夕方はやや暗く感じやすい。", zh: "過午之後便無直射陽光，午後室內偏陰暗，需較早開啟室內照明。", zhCN: "午后无直射阳光，室内偏阴暗，需较早开启室内照明。", en: "No direct sunlight in the afternoon; the room may feel dimmer earlier in the day." }
    ],
    demerits: [],
    naiken: {
      ja: "朝の採光度と、午後〜夕方の室内の明るさを確認。",
      zh: "確認清晨日照採光量，以及午後室內的自然光能見度。",
      zhCN: "确认清晨日照采光量，以及午后室内的自然光能见度。",
      en: "Observe morning daylight and inspect indoor illumination during late afternoons."
    }
  },
  {
    id: "orientation_west",
    name: { ja: "西向き", zh: "西向", zhCN: "西向", en: "West-facing" },
    category: "環境",
    overall: { ja: "西日注意", zh: "需留意西曬", zhCN: "需留意西晒", en: "Afternoon Sun Caution" },
    overallType: "neutral",
    effects: { sunlight: 0.5 },
    merits: [
      { ja: "冬場は夕方遅くまで暖かく、洗濯物が午後でも乾きやすい。", zh: "冬季直到傍晚均有日照，下半天曬衣依然容易晾乾。", zhCN: "冬季直到傍晚均有日照，下午晾衣依然容易晒干。", en: "Stays warm until sunset in winter; laundry dries well even in late afternoon." }
    ],
    cautions: [
      { ja: "夏場の西日による室温上昇が強烈で、家具やフローリングの日焼けに注意。", zh: "夏日西曬酷熱，室內悶熱感重，木質地板與家具易被紫外線曬傷褪色。", zhCN: "夏日西晒酷热，室内闷热感重，木质地板与家具易被紫外线晒伤褪色。", en: "Severe heat buildup in summer afternoons; furniture and wood flooring prone to UV fading." }
    ],
    demerits: [],
    naiken: {
      ja: "窓ガラスの遮熱性能と、午後の室温上昇度合いを確認。",
      zh: "檢查窗戶玻璃是否有隔熱鍍膜，並評估遮光窗簾之配置需求。",
      zhCN: "检查窗户玻璃是否有隔热镀膜，并评估遮光窗帘之配置需求。",
      en: "Check window thermal insulation and evaluate need for heavy UV-blocking curtains."
    }
  },
  {
    id: "orientation_north",
    name: { ja: "北向き", zh: "北向", zhCN: "北向", en: "North-facing" },
    category: "環境",
    overall: { ja: "日当たり不足", zh: "採光偏弱", zhCN: "采光偏弱", en: "Limited Sunlight" },
    overallType: "negative",
    effects: { sunlight: -2.0 },
    merits: [
      { ja: "家賃が同条件の南向きより安く設定されることが多い。", zh: "同地段與同面積下，租金通常比南向便宜 5%~10% 以上。", zhCN: "同地段与同面积下，租金通常比南向实惠 5%~10% 以上。", en: "Rents are typically discounted 5-10% compared to south-facing units." }
    ],
    cautions: [],
    demerits: [
      { ja: "直射日光がほぼ入らず、冬場は冷え込みやすく暖房代がかさむ。", zh: "幾乎無直射陽光進房，冬天室內陰冷潮濕，暖氣電費開銷偏大。", zhCN: "几乎无直射阳光进房，冬天室内阴冷潮湿，暖气电费开销偏大。", en: "Virtually no direct sunlight; cold and damp in winter, driving up heating costs." },
      { ja: "湿気がこもりやすく、サッシの結露やカビが発生しやすい。", zh: "濕氣不易揮散，窗框容易產生嚴重結露甚至發霉生菌。", zhCN: "湿气不易挥散，窗框容易产生严重结露甚至发霉生菌。", en: "High humidity accumulation; significant risk of window condensation and mold." }
    ],
    naiken: {
      ja: "壁際や押し入れ・窓枠にカビ・結露の痕跡がないか徹底確認。",
      zh: "特別檢查衣櫃角落、牆角壁紙與窗框是否有發霉水痕或潮濕霉味。",
      zhCN: "特别检查衣柜角落、墙角壁纸与窗框是否有发霉水痕或潮湿霉味。",
      en: "Thoroughly inspect closet corners, baseboards, and window seals for mold or dampness."
    }
  },

  // 2. Building Structure
  {
    id: "structure_src",
    name: { ja: "SRC造（鉄骨鉄筋コンクリート）", zh: "SRC結構（鋼骨鋼筋混凝土）", zhCN: "SRC结构（钢骨钢筋混凝土）", en: "SRC (Steel Reinforced Concrete)" },
    category: "構造",
    overall: { ja: "最高峰の遮音・耐震", zh: "最高級遮音耐震", zhCN: "最高级隔音耐震", en: "Top Tier Soundproofing" },
    overallType: "positive",
    effects: { building: 2.0, quietness: 1.5 },
    merits: [
      { ja: "鉄骨と鉄筋コンクリートが一体化し、耐火・耐震・耐久性が最高水準。", zh: "結合鋼骨韌性與水泥剛性，耐火、耐震、耐久性均屬日本住宅最高等級。", zhCN: "结合钢骨韧性与水泥刚性，耐火、耐震、耐久性均属日本住宅最高等级。", en: "Combines structural steel resilience with concrete mass; top rating for seismic and fire safety." },
      { ja: "遮音性能が極めて高く、隣室や上下階の生活音が響きにくい。", zh: "隔音性能極佳，隔壁鄰居生活音與上下樓震動聲極難傳導。", zhCN: "隔音性能极佳，隔壁邻居生活音与上下楼震动声极难传导。", en: "Superior acoustic isolation; everyday airborne and impact noise from neighbors is minimized." }
    ],
    cautions: [
      { ja: "気密性が高いため、冬季の定期的な換気と結露対策が必要。", zh: "氣密性極高，冬天需適度開窗換氣或開啟24小時換氣設備以防反潮。", zhCN: "气密性极高，冬天需适度开窗换气或开启24小时换气以防返潮。", en: "High airtightness; regular winter ventilation is advised to prevent indoor condensation." }
    ],
    demerits: [],
    naiken: {
      ja: "壁を叩いて中空音がないか、サッシの防音グレードを確認。",
      zh: "輕敲室內相鄰隔間牆確認是否為厚實水泥厚壁，檢查氣密窗防音規格。",
      zhCN: "轻敲室内相邻隔间墙确认是否为厚实水泥厚壁，检查气密窗防音规格。",
      en: "Tap party walls to verify solid concrete density; inspect acoustic window ratings."
    }
  },
  {
    id: "structure_rc",
    name: { ja: "RC造（鉄筋コンクリート）", zh: "RC結構（鋼筋混凝土）", zhCN: "RC结构（钢筋混凝土）", en: "RC (Reinforced Concrete)" },
    category: "構造",
    overall: { ja: "優れた遮音・耐火", zh: "優異遮音耐火", zhCN: "优异隔音耐火", en: "Excellent Soundproofing" },
    overallType: "positive",
    effects: { building: 1.5, quietness: 1.0 },
    merits: [
      { ja: "コンクリートの質量により高い耐火性と優れた遮音性を発揮。", zh: "厚實混凝土自重提供高耐火性與良好隔音，都市租屋首選安心結構。", zhCN: "厚实混凝土自重提供高耐火性与良好隔音，都市租屋首选安心结构。", en: "Concrete mass delivers high fire resistance and robust acoustic insulation." },
      { ja: "木造や鉄骨造に比べ地震時の揺れや騒音トラブルが大幅に少ない。", zh: "耐震穩定度遠優於木造與輕量鐵骨，日常被鄰居噪音困擾機率極低。", zhCN: "耐震稳定度远优于木造与轻量铁骨，日常被邻居噪音困扰机率极低。", en: "Significantly more rigid in tremors and far less prone to neighbor noise disputes than timber." }
    ],
    cautions: [
      { ja: "室内壁の一部が石膏ボード仕上げの場合、隣室の音が伝わることもある。", zh: "若戶與戶之間為乾式隔間輕鋼架石膏板，隔音仍可能略遜於實心厚灌漿牆。", zhCN: "若户与户之间为干式隔间轻钢架石膏板，隔音仍可能略逊于实心厚浇筑墙。", en: "If partition walls use lightweight gypsum board instead of solid concrete, some sound may transmit." }
    ],
    demerits: [],
    naiken: {
      ja: "戸境壁がコンクリート壁か石膏ボード中空壁かを手でノックして確認。",
      zh: "用手指輕敲與鄰居相鄰的牆面，確認是實心灌漿壁還是空心夾板。",
      zhCN: "用手指轻敲与邻居相邻的墙面，确认是实心浇筑墙还是空心夹板。",
      en: "Knock on dividing party walls to ensure solid concrete rather than hollow drywall."
    }
  },
  {
    id: "structure_steel",
    name: { ja: "鉄骨造・軽量鉄骨造", zh: "鐵骨造・輕量鐵骨", zhCN: "铁骨造・轻量铁骨", en: "Steel Frame Construction" },
    category: "構造",
    overall: { ja: "遮音性に留意", zh: "隔音需稍留意", zhCN: "隔音需稍留意", en: "Fair Acoustic Isolation" },
    overallType: "neutral",
    effects: { building: 0.5, quietness: -0.5 },
    merits: [
      { ja: "木造に比べて耐震強度が高く、品質が均一で虫害の心配がない。", zh: "耐震度與結構穩定性優於純木造，工廠預製規格品質均勻，無白蟻蛀蝕風險。", zhCN: "耐震度与结构稳定性优于纯木造，工厂预制规格品质均匀，无白蚁蛀蚀风险。", en: "Superior seismic resistance to timber, consistent manufactured quality, and immune to wood pests." },
      { ja: "RC造に比べて賃料がリーズナブルに設定される。", zh: "在相同地段與面積下，租金通常比 RC 鋼筋混凝土便宜許多。", zhCN: "在相同地段与面积下，租金通常比 RC 钢筋混凝土实惠许多。", en: "Rents are generally noticeably more affordable than comparable RC apartments." }
    ],
    cautions: [
      { ja: "遮音性はRC造に劣るため、隣室の生活音（足音やテレビ音）が聞こえやすい。", zh: "隔音性明顯遜於 RC 混凝土，相鄰戶電視聲、講話聲或樓上腳步聲較易傳導。", zhCN: "隔音性明显逊于 RC 混凝土，相邻户电视声、讲话声或楼上脚步声较易传导。", en: "Acoustic insulation is lower than concrete; footsteps or television audio from neighbors can be audible." }
    ],
    demerits: [],
    naiken: {
      ja: "隣室側の壁の厚みと、上下階の足音響き具合を静かな時間帯に確認。",
      zh: "建議挑選傍晚或鄰居在家的時段內見，感受上下層腳步聲與隔壁交談音傳導情況。",
      zhCN: "建议挑选傍晚或邻居在家的时段看房，感受上下层脚步声与隔壁交谈音传导情况。",
      en: "Schedule viewing during evening hours when neighbors are home to assess footstep and speech transmission."
    }
  },
  {
    id: "structure_wood",
    name: { ja: "木造", zh: "木造建築", zhCN: "木造建筑", en: "Wood Frame Construction" },
    category: "構造",
    overall: { ja: "遮音・防音要妥協", zh: "隔音隔熱需妥協", zhCN: "隔音隔热需妥协", en: "High Acoustic Compromise" },
    overallType: "negative",
    effects: { building: -1.0, quietness: -1.5 },
    merits: [
      { ja: "家賃が非常に安く、初期費用や更新料も抑えられやすい。", zh: "同地段中租金最便宜，初期入居費用與禮金押金負擔最小。", zhCN: "同地段中租金最实惠，初期入住费用与礼金押金负担最小。", en: "Most affordable rents in the area with lower upfront deposit and key money." }
    ],
    cautions: [],
    demerits: [
      { ja: "遮音性が著しく低く、上下左右の生活音やドアの開閉音が筒抜けになりやすい。", zh: "隔音效果極弱，上下左右生活音、開關門甚至咳嗽講話聲幾乎清晰可聞。", zhCN: "隔音效果极弱，上下左右生活音、开关门甚至咳嗽讲话声几乎清晰可闻。", en: "Very low acoustic isolation; neighbors' conversations, doors, and footsteps transmit easily." },
      { ja: "耐火性能がコンクリート造より劣り、火災保険料が高めになる。", zh: "耐火性能低於水泥鋼骨，冬季易受周遭火災波及，火災保險費用較高。", zhCN: "耐火性能低于水泥钢骨，冬季易受周遭火灾波及，火灾保险费用较高。", en: "Lower fire resistance than concrete structures; tenant fire insurance rates may be higher." }
    ],
    naiken: {
      ja: "足音や話し声の漏れ具合を現地で細かくテスト。",
      zh: "現場實地感受走廊腳步聲震動，以及窗戶關閉後外圍聲音大小。",
      zhCN: "现场实地感受走廊脚步声震动，以及窗户关闭后外围声音大小。",
      en: "Test hallway footstep vibration and evaluate sound leakage through walls and doors."
    }
  },

  // 3. Building Age
  {
    id: "age_old_quake",
    name: { ja: "旧耐震基準（1981年5月以前建築）", zh: "舊耐震法規建築（1981以前）", zhCN: "旧耐震法规建筑（1981以前）", en: "Pre-1981 Seismic Standard" },
    category: "安全性",
    overall: { ja: "耐震性・設備要妥協", zh: "耐震與管線需妥協", zhCN: "耐震与管线需妥协", en: "Seismic Compromise" },
    overallType: "negative",
    effects: { building: -2.0, rent: 1.0 },
    merits: [
      { ja: "同じ広さ・立地でも新耐震物件に比べて家賃が割安。", zh: "同面積與優良地段下，租金比新耐震大樓便宜 15%~30% 以上。", zhCN: "同面积与优良地段下，租金比新耐震大楼便宜 15%~30% 以上。", en: "Rents are typically 15-30% cheaper than modern buildings in prime central locations." }
    ],
    cautions: [],
    demerits: [
      { ja: "1981年6月以前の旧耐震のため、震度6強以上の大地震への耐力検証が不可欠。", zh: "建於 1981 年 6 月新耐震基準實施前，面對震度 6 強以上劇烈地震之抗震係數較舊。", zhCN: "建于 1981 年 6 月新耐震基准实施前，面对震度 6 强以上剧烈地震之抗震系数较低。", en: "Constructed prior to the landmark 1981 New Seismic Standard; seismic resilience in major earthquakes is dated." },
      { ja: "給排水管や共用部分の老朽化が進んでおり、水回りトラブルのリスクがある。", zh: "大樓給排水水管與共用管道老化，水壓不足或漏水回堵風險較高。", zhCN: "大楼给排水水管与共用管道老化，水压不足或漏水回堵风险较高。", en: "Plumbing pipes and shared conduits may be aged; higher likelihood of drainage issues or water pressure variance." }
    ],
    naiken: {
      ja: "耐震補強工事の実施履歴、水道の水圧や排水溝の匂いを確認。",
      zh: "務必向房東確認大樓是否曾做過「耐震補強改修」，檢查洗手台水壓與排水管異味。",
      zhCN: "务必向房东确认大楼是否曾做过“耐震补强改修”，检查水槽水压与排水管异味。",
      en: "Inquire if seismic retrofitting has been performed; test faucet pressure and check for drainage odors."
    }
  },
  {
    id: "age_30_plus",
    name: { ja: "築30年以上", zh: "屋齡30年以上", zhCN: "房龄30年以上", en: "Built Over 30 Years Ago" },
    category: "築年数",
    overall: { ja: "割安・リノベ要確認", zh: "租金實惠・需確認翻新", zhCN: "租金实惠・需确认翻新", en: "Affordable / Check Refurbishment" },
    overallType: "neutral",
    effects: { building: -0.5, rent: 1.0 },
    merits: [
      { ja: "同エリアの新築・築浅物件に比べて家賃が20〜30％程度安い。", zh: "租金通常比周遭新成屋便宜 20%~30%，小資省錢絕佳選擇。", zhCN: "租金通常比周边新成屋实惠 20%~30%，小资省钱绝佳选择。", en: "Rents are roughly 20-30% lower than newer units in the same neighborhood." }
    ],
    cautions: [
      { ja: "共用部（ゴミ置場やポスト）の維持管理状態と、専有部の配管臭を要確認。", zh: "需仔細觀察公共區域（垃圾場、信箱）維護管理狀況，以及室內水槽有無暗管異味。", zhCN: "需仔细观察公共区域（垃圾场、信箱）维护管理状况，以及室内水槽有无暗管异味。", en: "Carefully inspect upkeep in common areas (trash station, mailboxes) and smell for sewer gas near sinks." }
    ],
    demerits: [],
    naiken: {
      ja: "水回りのリフォーム履歴（キッチン・浴室・トイレ）とエアコンの製造年を確認。",
      zh: "確認廚房流理台、浴室及馬桶是否近期翻新，檢查附屬冷氣之出廠製造年份。",
      zhCN: "确认厨房料理台、浴室及马桶是否近期翻新，检查附带空调的制造年份。",
      en: "Verify refurbishment dates for bath/kitchen/toilet; check manufactured year on supplied AC units."
    }
  },

  // 4. Transit & Walk
  {
    id: "walk_5",
    name: { ja: "駅徒歩5分以内", zh: "徒步5分以內近車站", zhCN: "步行5分以内近车站", en: "Within 5-min Walk to Station" },
    category: "交通",
    overall: { ja: "極めて快適な動線", zh: "動線極度舒適", zhCN: "动线极度舒适", en: "Supreme Transit Convenience" },
    overallType: "positive",
    effects: { location: 2.5 },
    merits: [
      { ja: "雨の日や夜間の帰宅が圧倒的に楽で、毎日の通勤通学時間を大幅短縮。", zh: "雨天、寒冬或深夜歸宅毫無負擔，每日往返通勤時間大幅縮減，生活品質高。", zhCN: "雨天、寒冬或深夜归宅毫无负担，每日往返通勤时间大幅缩减，生活品质高。", en: "Effortless commute even in rain, cold, or late at night; saves substantial daily travel time." },
      { ja: "駅前の商業施設・コンビニ・飲食店を帰宅動線上でそのまま利用可能。", zh: "出站順路即可使用超商、超市、藥妝與外食餐廳，下班生活動線一氣呵成。", zhCN: "出站顺路即可使用便利店、超市、药妆与餐饮，下班生活动线一气呵成。", en: "Station amenities, groceries, and dining can be accessed directly on your way home." }
    ],
    cautions: [
      { ja: "駅前の人通りや線路・踏切からの騒音、深夜の酔客の往来を現地で確認。", zh: "站前人潮較為雜沓，需注意鄰近軌道列車剎車聲或深夜居酒屋醉客喧嘩。", zhCN: "站前人潮较为杂沓，需注意邻近轨道列车刹车声或深夜居酒屋酒客喧哗。", en: "Observe foot traffic outside, train track audio, and late-night nightlife noise near the station." }
    ],
    demerits: [],
    naiken: {
      ja: "駅出入口から物件玄関までの実際のルートを歩き、信号待ち時間や歩道の安全性を確認。",
      zh: "實地從車站出入口走回住處大門，計算等紅綠燈秒數並確認人行道是否有照明。",
      zhCN: "实地从车站出入口走回住处大门，计算等红绿灯秒数并确认人行道是否有照明。",
      en: "Walk the actual route from station exit to front door; check crossing signal wait and streetlighting."
    }
  },

  // 5. Equipment & Security
  {
    id: "equip_autolock",
    name: { ja: "オートロック完備", zh: "配備門禁自動鎖", zhCN: "配备门禁自动锁", en: "Auto-Lock Security Entry" },
    category: "防犯",
    overall: { ja: "高い防犯性", zh: "防盜防生人優秀", zhCN: "防盗防生人优秀", en: "High Building Security" },
    overallType: "positive",
    effects: { security: 2.0 },
    merits: [
      { ja: "エントランス施錠により不審者や飛び込み営業の直接立ち入りを遮断。", zh: "大樓玄關需密碼或感應鑰匙，直接阻絕可疑陌生人與推銷業務直達家門口。", zhCN: "大楼玄关需密码或感应钥匙，直接阻绝可疑陌生人与推销业务直达家门口。", en: "Secured main entrance prevents unauthorized solicitors or strangers from reaching your apartment door." },
      { ja: "女性の一人暮らしや夜間帰宅時も高い安心感を確保。", zh: "單身女性或夜間晚歸時心理安全感極高，防盜層級優秀。", zhCN: "单身女性或夜间晚归时安全感极高，防盗层级优秀。", en: "Provides significant peace of mind for solo dwellers and late-night homecomings." }
    ],
    cautions: [
      { ja: "共連れ（他の住人に続いて入る）侵入には注意が必要。", zh: "仍需留意後方陌生人藉由住戶開門尾隨（共連れ）進入大廳。", zhCN: "仍需留意后方陌生人借由住户开门尾随（共连れ）进入大厅。", en: "Be mindful of tailgating (strangers slipping in directly behind authorized residents)." }
    ],
    demerits: [],
    naiken: {
      ja: "インターホンのカメラ機能（録画可否）とエントランス自動ドアの開閉動作を確認。",
      zh: "測試室內對講機是否有彩色螢幕與錄影功能，確認玄關門禁感應靈敏度。",
      zhCN: "测试室内对讲机是否有彩色屏幕与录像功能，确认玄关门禁感应灵敏度。",
      en: "Test the video intercom screen/recording functionality and inspect main gate sensor response."
    }
  },
  {
    id: "equip_no_autolock",
    name: { ja: "オートロックなし", zh: "無門禁自動鎖", zhCN: "无门禁自动锁", en: "No Auto-Lock System" },
    category: "防犯",
    overall: { ja: "防犯対策・施錠徹底", zh: "需落實隨手鎖門", zhCN: "需落实随手锁门", en: "Manual Locking Required" },
    overallType: "negative",
    effects: { security: -1.5 },
    merits: [
      { ja: "友人の訪問時やデリバリー受取時にエントランス解錠の手間がない。", zh: "親友到訪或外送抵達時，不需在玄關按對講機多道解鎖，出入自由。", zhCN: "亲友到访或外卖抵达时，不需在玄关按对讲机多道解锁，出入自由。", en: "Visitors and delivery couriers can walk up to your unit door without buzzer clearance." }
    ],
    cautions: [],
    demerits: [
      { ja: "部外者や訪問販売員が直接玄関ドア前まで立ち入れるため、防犯上の警戒が必要。", zh: "外人、推銷員或快遞可直接走到各戶房門前，女性或獨居者需加強門鎖防範。", zhCN: "外人、推销员或快递可直接走到各户房门前，女性或独居者需加强门锁防范。", en: "Strangers or salespeople have unimpeded access to front doors; requires strict door locking." }
    ],
    naiken: {
      ja: "玄関ドアの鍵がディンプルキー（複製困難）か、TVモニター付きインターホンがあるか確認。",
      zh: "確認大門鑰匙是否為防盜凹點鑰匙（Dimple Key），確認室內是否有彩色螢幕對講機。",
      zhCN: "确认大门钥匙是否为防盗凹点钥匙（Dimple Key），确认室内是否有彩色屏幕对讲机。",
      en: "Check if the front door uses a pick-resistant dimple key and verify if a video intercom is installed."
    }
  },
  {
    id: "equip_bt_sep",
    name: { ja: "バストイレ別（BT別）", zh: "乾濕分離（衛浴分離）", zhCN: "干湿分离（卫浴分离）", en: "Separate Bath and Toilet" },
    category: "設備",
    overall: { ja: "快適な水回り", zh: "衛浴獨立舒適", zhCN: "卫浴独立舒适", en: "Comfortable Bath Layout" },
    overallType: "positive",
    effects: { rent: -0.5 },
    merits: [
      { ja: "湿気がトイレにこもらず、衛生的で快適。温水洗浄便座も使いやすい。", zh: "洗澡水氣不會瀰漫馬桶，衛生乾淨不發霉，並可從容配置免治馬桶座。", zhCN: "洗澡水气不会弥漫马桶，卫生干净不发霉，可从容配置智能马桶盖。", en: "Steam from showers does not dampen the toilet; highly hygienic and easy to keep dry." },
      { ja: "洗い場付きのお風呂でゆったり入浴でき、日々の疲れを癒やせる。", zh: "浴室有獨立洗澡地板空間，可真正放滿熱水泡澡消除疲勞。", zhCN: "浴室有独立洗澡地板空间，可真正放满热水泡澡消除疲劳。", en: "Dedicated bathing area with separate tub allows comfortable Japanese soaking baths." }
    ],
    cautions: [],
    demerits: [],
    naiken: {
      ja: "浴室乾燥機・換気扇の動作状況と、脱衣所の広さを確認。",
      zh: "檢查抽風排氣扇運轉風量，確認浴缸大小與脫衣更衣空間是否寬敞。",
      zhCN: "检查抽风排气扇运转风量，确认浴缸大小与脱衣更衣空间是否宽敞。",
      en: "Test bath ventilation exhaust power and inspect changing space outside the bathroom."
    }
  },

  // 6. Floor level
  {
    id: "floor_1",
    name: { ja: "1階住戸", zh: "1樓住戶", zhCN: "1楼住户", en: "Ground Floor Unit" },
    category: "立地",
    overall: { ja: "防犯・視線に注意", zh: "需注意防盜與視線", zhCN: "需注意防盗与视线", en: "Mind Privacy & Security" },
    overallType: "neutral",
    effects: { security: -1.0 },
    merits: [
      { ja: "階段やエレベーターを使わず出入りが楽。下の階への足音トラブルの心配がない。", zh: "出門免等電梯或爬樓梯，且下方無鄰居，完全不用擔心腳步聲吵到樓下。", zhCN: "出门免等电梯或爬楼梯，且下方无邻居，不用担心脚步声吵到楼下。", en: "No stairs/elevators required, and zero anxiety about footstep noise to downstairs neighbors." }
    ],
    cautions: [
      { ja: "道路からの視線や防犯上の侵入リスク、湿気・害虫の侵入に留意。", zh: "路人視線較易直視室內，需注意防盜窗鎖、曬衣隱私以及夏日防蟲防潮。", zhCN: "路人视线较易直视室内，需注意防盗窗锁、晾衣隐私以及夏日防虫防潮。", en: "Pedestrian streetline sightlines require curtains; higher exposure to moisture and insects." }
    ],
    demerits: [],
    naiken: {
      ja: "窓の外の防犯格子、雨戸・シャッターの有無、外からの視線の通り具合を確認。",
      zh: "檢查窗外是否有鐵窗柵欄、防盜捲門（雨戸）以及拉上窗簾後的私密性。",
      zhCN: "检查窗外是否有防盗栅栏、防盗卷门（雨户）以及拉上窗帘后的私密性。",
      en: "Verify security grilles, exterior shutters (amado), and check exterior sightlines."
    }
  },
  {
    id: "floor_2_plus",
    name: { ja: "2階以上", zh: "2樓以上住戶", zhCN: "2楼以上住户", en: "2nd Floor or Above" },
    category: "立地",
    overall: { ja: "防犯・採光良好", zh: "防盜採光俱佳", zhCN: "防盗采光俱佳", en: "Safe & Bright" },
    overallType: "positive",
    effects: { security: 1.0, sunlight: 0.5 },
    merits: [
      { ja: "道路からの侵入リスクが低く、洗濯物を干す際のプライバシーも守られやすい。", zh: "外部入侵風險極低，陽台曬私密衣物不易被窺視，居住安心感顯著提升。", zhCN: "外部入侵风险极低，阳台晾私密衣物不易被窥视，居住安心感显著提升。", en: "Lower burglary entry risk and superior balcony laundry privacy from street pedestrians." }
    ],
    cautions: [
      { ja: "下の階への足音配慮が必要。エレベーターのない3階以上は階段負担を確認。", zh: "夜間需適度留意拖鞋與腳步聲；若無電梯之 3 樓以上需評估搬重物體力負擔。", zhCN: "夜间需适度留意拖鞋与脚步声；若无电梯之 3 楼以上需评估搬重物体力负担。", en: "Mind heavy footsteps for downstairs residents; assess stair climb if lacking an elevator." }
    ],
    demerits: [],
    naiken: {
      ja: "ベランダの手すりの高さと、下階への床の遮音性能を確認。",
      zh: "確認陽台欄杆安全高度，以及地板踏步時是否有扎實的防音厚度。",
      zhCN: "确认阳台栏杆安全高度，以及地板踏步时是否有扎实的防音厚度。",
      en: "Inspect balcony railing safety height and step firmly to test floor acoustic damping."
    }
  },

  // 7. Environment & Road Proximity
  {
    id: "env_main_road",
    name: { ja: "幹線道路・大通り沿い", zh: "臨大馬路幹道", zhCN: "临大马路干道", en: "Along Major Arterial Road" },
    category: "環境",
    overall: { ja: "夜間騒音に注意", zh: "需注意車流警笛噪音", zhCN: "需注意车流警笛噪音", en: "Mind Nighttime Road Noise" },
    overallType: "negative",
    effects: { quietness: -2.0 },
    merits: [
      { ja: "夜間でも人通りや街灯が多く、夜道の一人歩きが明るく安全。", zh: "大馬路沿線通宵街燈通明、人流不斷，夜間晚歸無走暗巷恐懼。", zhCN: "大马路沿线通宵街灯通明、人流不断，夜间晚归无走暗巷恐惧。", en: "Well-lit sidewalks with steady traffic make walking home late at night feel safe." }
    ],
    cautions: [],
    demerits: [
      { ja: "車の走行音、重車両の振動、緊急車両のサイレンが昼夜を問わず響きやすい。", zh: "全天車流噪音大，大型重車行駛常有地表震動，且救護車與警笛聲頻繁。", zhCN: "全天车流噪音大，大型重车行驶常有地面震动，且救护车与警笛声频繁。", en: "Continuous tire roar, heavy truck vibrations, and periodic emergency vehicle sirens." },
      { ja: "排気ガスによる粉塵でベランダに洗濯物を干しにくい。", zh: "廢氣粉塵較多，陽台欄杆易積黑灰，不便長時間戶外晾曬衣物。", zhCN: "废气粉尘较多，阳台栏杆易积黑灰，不便长时间户外晾晒衣物。", en: "Exhaust particulates make outdoor balcony clothes drying less desirable." }
    ],
    naiken: {
      ja: "窓を完全に閉めた状態での遮音性（二重サッシの有無）と車の振動を現地で確認。",
      zh: "務必關緊窗戶實測隔音氣密性，觀察是否有雙層氣密窗，並靜立感受重車震動。",
      zhCN: "务必关紧窗户实测隔音气密性，观察是否有双层气密窗，并静立感受重车震动。",
      en: "Close all windows completely to test double-pane acoustic sealing and feel for truck vibrations."
    }
  }
  // 8. Financials: Key Money (礼金)
  {
    id: "reikin_zero",
    name: { ja: "礼金0（礼金なし）", zh: "零禮金（免禮金）", zhCN: "零礼金（免礼金）", en: "Zero Key Money (No Reikin)" },
    category: "費用",
    overall: { ja: "初期費用を大幅節約", zh: "初期費用大幅減輕", zhCN: "初期费用大幅减轻", en: "Huge Upfront Savings" },
    overallType: "positive",
    effects: { rent: 1.5 },
    merits: [
      { ja: "契約時の礼金（通常家賃1〜2ヶ月分）が0円。まとまった初期費用を15〜25万円程度丸々節約可能！", zh: "簽約時免付給房東的不可退還感謝金（通常為1~2個月租金），直接省下約15~25萬日圓初期開銷！", zhCN: "签约时免付给房东的不可退还感谢金（通常为1~2个月租金），直接省下约15~25万日元初期开销！", en: "Zero non-refundable gift money to the landlord; saves 1-2 months of rent (~150k-250k JPY) upfront!" }
    ],
    cautions: [
      { ja: "短期解約違約金特約（1年未満の解約で家賃1ヶ月分等）が付いている場合があるため事前確認を推奨。", zh: "部分零禮金房源附帶「短期解約違約金」（如未住滿1年解約需補繳1個月租金），簽約前務必確認特約條款。", zhCN: "部分零礼金房源附带短期解约违约金（如未住满1年退租需补交1个月租金），签约前需确认特约条款。", en: "Check for early lease termination penalty clauses (e.g. 1 month rent penalty if vacating within 1 year)." }
    ],
    demerits: [],
    naiken: {
      ja: "敷金の返還条件や、退去時のハウスクリーニング費用の負担区分を重要事項説明書で確認。",
      zh: "向房仲確認押金退還規定、退租時室內清潔費是否由租客定額負擔，並審閱契約特約事項。",
      zhCN: "向中介确认押金退还规定、退租时室内清洁费是否由租客定额负担，并审阅合同特约事项。",
      en: "Verify security deposit refund terms, move-out cleaning fee allocations, and review lease rider conditions."
    }
  },

  // 9. Pet Policy
  {
    id: "pet_allowed",
    name: { ja: "ペット相談・飼育可", zh: "可養寵物（寵物相談）", zhCN: "可养宠物（宠物商谈）", en: "Pet Friendly (Consultation)" },
    category: "条件",
    overall: { ja: "ペット同住可能", zh: "可與毛孩同住", zhCN: "可与毛孩同住", en: "Pets Allowed" },
    overallType: "positive",
    effects: { building: 1.0 },
    merits: [
      { ja: "大切な家族である犬や猫と一緒に暮らせる希少なペット飼育相談可能物件！", zh: "日本僅極少數公寓允許飼育寵物，此房源能與心愛的貓咪、狗狗一同入住新生活！", zhCN: "仅极少数公寓允许饲养宠物，此房源能与心爱的猫咪、狗狗一同开启新生活！", en: "Rare pet-friendly property in Japan allowing you to live together with your beloved dogs or cats!" }
    ],
    cautions: [
      { ja: "ペット飼育時は敷金+1ヶ月や、退去時クリーニング（消臭・壁紙張替）の追加特約が付く一般的傾向。", zh: "飼養寵物時通常需額外加收1個月押金（敷金+1ヶ月），退租時通常會約定由租客全額負擔除臭與更換壁紙費用。", zhCN: "饲养宠物通常需额外加收1个月押金（敷金+1个月），退租时通常会约定由租客全额负担除臭与更换壁纸费用。", en: "Pet residency typically requires +1 month additional security deposit and specific tenant-paid deodorization/wallpaper replacement riders upon moving out." },
      { ja: "飼育可能な種類・頭数（小型犬1匹のみ、猫の可否など）を管理規約で事前確認。", zh: "務必向房東與管理規約確認可飼養之種類與隻數限制（例如：僅限小型犬1隻、是否允許養貓、體重上限等）。", zhCN: "务必向房东确认可饲养之种类与数量限制（例如：仅限小型犬1只、是否允许养猫、体重上限等）。", en: "Verify exact animal rules in the building bylaws (e.g. 1 small dog only, cats permitted, weight limitations)." }
    ],
    demerits: [],
    naiken: {
      ja: "共用部分にペット専用足洗い場があるか、エレベーター内ペット同乗マナー、近隣の動物病院を確認。",
      zh: "確認大樓一樓是否有洗腳區、攜帶寵物搭乘電梯之規定，以及周圍步行範圍內是否有動物醫院。",
      zhCN: "确认大楼一楼是否有宠物洗脚池、带宠物搭乘电梯之规定，以及周边是否有动物医院。",
      en: "Check building pet foot-washing amenities, elevator pet carriage rules, and locate nearby veterinary clinics."
    }
  },
  {
    id: "pet_not_allowed",
    name: { ja: "ペット不可（飼育禁止）", zh: "嚴禁飼養寵物", zhCN: "严禁饲养宠物", en: "No Pets Allowed" },
    category: "条件",
    overall: { ja: "ペット飼育厳禁", zh: "禁止飼養寵物", zhCN: "禁止饲养宠物", en: "Strictly No Pets" },
    overallType: "negative",
    effects: {},
    merits: [
      { ja: "動物の鳴き声や毛・アレルギーの心配がなく、静かで衛生的な住環境を好む方に適している。", zh: "無相鄰戶寵物吠叫噪音或毛髮異味，適合追求安靜與有動物過敏體質之租客。", zhCN: "无邻近户宠物吠叫噪音或毛发异味，适合追求安静与对动物过敏之租客。", en: "Free from barking noise, pet hair, or dander; ideal for tenants with pet allergies or seeking quiet." }
    ],
    cautions: [
      { ja: "マンション管理規約により動物の飼育は厳禁。無断飼育は契約解除・即時退去処分の対象となります。", zh: "大樓規約嚴格禁止飼養任何寵物，若擅自偷養將面臨合約立即解除、強制搬離並求償巨額違約金。", zhCN: "大楼规约严格禁止饲养任何宠物，若擅自偷养将面临合同立即解除、强制搬离并追索巨额违约金。", en: "Pets strictly prohibited by building covenants; unauthorized keeping results in immediate lease eviction." }
    ],
    demerits: [],
    naiken: {
      ja: "将来的にペットを飼う可能性がある場合は、本物件の契約を見送る必要があります。",
      zh: "若未來有飼養貓狗之規劃，本物件完全無法融通，需另尋「ペット相談可」之房源。",
      zhCN: "若未来有饲养猫狗之规划，本物件无法变通，需另寻宠物商谈房源。",
      en: "If you plan to adopt or keep a pet in the future, this property cannot accommodate it."
    }
  }
];
