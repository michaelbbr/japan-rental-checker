import { Rule } from './types';

export const RULES: Rule[] = [
  // 1. 方角 (Orientation)
  {
    id: "orientation_south",
    name: { zh: "南向き", ja: "南向き" },
    category: "朝向",
    overall: { zh: "◎ 明顯優點", ja: "◎ 明確な強み" },
    overallType: "positive",
    effects: { sunlight: 2, rent: -0.5 },
    merits: [{ zh: "全天日照時間最長，室內明亮且冬季溫暖，衣物極易曬乾。", ja: "日当たりが一日中最も良く、冬場も暖かく洗濯物が早く乾く。" }],
    cautions: [{ zh: "同條件下人氣最高，租金通常較高。", ja: "一番人気の方角のため、同条件の他方角より家賃が高め。" }],
    demerits: [],
    naiken: { zh: "確認南側是否有鄰棟阻擋實際採光", ja: "南側に高い建物がなく採光が抜けているか確認" }
  },
  {
    id: "orientation_southwest",
    name: { zh: "南西向き", ja: "南西向き" },
    category: "朝向",
    overall: { zh: "○ 加分條件", ja: "○ 加点条件" },
    overallType: "positive",
    effects: { sunlight: 1.2 },
    merits: [{ zh: "午後採光充足，冬天傍晚室內依然溫暖，適合晚起生活作息。", ja: "午後の日当たりが長く続き、冬でも夕方まで室温が保たれやすい。" }],
    cautions: [{ zh: "夏季午後強烈西曬（西日），室內溫度容易升高，需開冷氣與拉遮光簾。", ja: "夏場は強い西日により室温が上がりやすいため、遮光対策が必要。" }],
    demerits: [],
    naiken: { zh: "確認窗戶遮熱隔熱性及是否有遮光窗簾軌道", ja: "サッシの断熱性能や遮光カーテンの設置可否を確認" }
  },
  {
    id: "orientation_east",
    name: { zh: "東向き", ja: "東向き" },
    category: "朝向",
    overall: { zh: "○ 加分條件", ja: "○ 加点条件" },
    overallType: "positive",
    effects: { sunlight: 1 },
    merits: [{ zh: "早晨陽光充足有助作息提神，避開夏季午後強烈西曬。", ja: "朝の爽やかな日差しが入り、夏の西日熱気配がない。" }],
    cautions: [{ zh: "中午過後無直射陽光，冬季午後室溫下降較快。", ja: "午後以降は日陰になり冬場は夕方にかけて冷えやすい。" }],
    demerits: [],
    naiken: { zh: "確認上午曬衣空間通風與採光", ja: "午前中の洗濯物干しスペースの明るさを確認" }
  },
  {
    id: "orientation_north",
    name: { zh: "北向き", ja: "北向き" },
    category: "朝向",
    overall: { zh: "⚠️ 需妥協", ja: "⚠️ 妥協・注意" },
    overallType: "negative",
    effects: { sunlight: -2, rent: 1 },
    merits: [{ zh: "全日光線均勻柔和無眩光，同棟中租金最便宜。", ja: "直射日光がなく光が一日中均一。家賃が最も割安。" }],
    cautions: [{ zh: "日照極少，冬天較陰冷，暖氣耗電量可能增加。", ja: "日差しによる温かさがなく冬の暖房費がかさみやすい。" }],
    demerits: [{ zh: "無直射陽光，衣物不易乾，結露與潮濕發黴風險高。", ja: "日当たりがほぼなく、結露やカビのリスクが高まりやすい。" }],
    naiken: { zh: "確認窗框與牆角有無水氣發黴痕跡、換氣扇強度", ja: "窓周りや収納の角に結露やカビの跡がないか確認" }
  },

  // 2. 構造 (Structure)
  {
    id: "structure_src",
    name: { zh: "SRC造（鉄骨鉄筋コンクリート）", ja: "SRC造（鉄骨鉄筋コンクリート）" },
    category: "構造",
    overall: { zh: "◎ 明顯優點", ja: "◎ 明確な強み" },
    overallType: "positive",
    effects: { building: 1.5, quietness: 1.5 },
    merits: [{ zh: "頂級耐震、耐火與遮音結構，鄰室生活噪音不易傳遞干擾。", ja: "耐震・耐火・遮音性に極めて優れ、隣室の生活音が響きにくい最高峰構造。" }],
    cautions: [{ zh: "結構堅固厚實，室內可能有粗大樑柱佔用空間，管理費基底偏高。", ja: "頑丈な構造のため室内に太い柱や梁が出やすく、管理費も高め。" }],
    demerits: [],
    naiken: { zh: "確認室內樑柱是否過於突出影響家具擺設", ja: "室内の柱や梁が家具の配置を邪魔しないか確認" }
  },
  {
    id: "structure_rc",
    name: { zh: "RC造（鉄筋コンクリート）", ja: "RC造（鉄筋コンクリート）" },
    category: "構造",
    overall: { zh: "◎ 明顯優點", ja: "◎ 明確な強み" },
    overallType: "positive",
    effects: { building: 1.2, quietness: 1 },
    merits: [{ zh: "中高層公寓主流，隔音與氣密性優良，耐火防風佳。", ja: "気密性・遮音性・耐火性に優れ、生活音が伝わりにくい標準構造。" }],
    cautions: [{ zh: "氣密性高，需保持日常定期通風換氣預防結露。", ja: "気密性が高いため、こまめな日常換気が必要。" }],
    demerits: [],
    naiken: { zh: "輕敲共用戶牆確認是否為厚實水泥隔間", ja: "戸境壁を軽く叩いて石膏ボード特有の空洞音がしないか確認" }
  },
  {
    id: "structure_steel",
    name: { zh: "鉄骨造（重量/軽量）", ja: "鉄骨造（重量/軽量）" },
    category: "構造",
    overall: { zh: "△ 中性/看習慣", ja: "△ 普通・好みによる" },
    overallType: "neutral",
    effects: { quietness: -0.5, rent: 0.5 },
    merits: [{ zh: "耐震性能優於木造，租金性價比佳。", ja: "木造より耐震性が高く、RC造より手頃な家賃でコスパが良い。" }],
    cautions: [{ zh: "隔音弱於 RC，腳步聲或開關門震動仍有部分傳導。", ja: "遮音性はRC造に劣り、足音やドアの開閉音はある程度響く。" }],
    demerits: [],
    naiken: { zh: "確認共用走廊走動與相鄰戶門扇關閉聲響", ja: "共用廊下の足音や隣室のドア開閉音の聞こえ方を確認" }
  },
  {
    id: "structure_wood",
    name: { zh: "木造（アパート）", ja: "木造（アパート）" },
    category: "構造",
    overall: { zh: "👎 明顯抗性", ja: "👎 明確な弱点" },
    overallType: "negative",
    effects: { building: -1, quietness: -2, rent: 1.5 },
    merits: [{ zh: "透氣調濕性佳，同地段中租金門檻最低。", ja: "通気性が良く、同条件の中で家賃相場が最も手頃。" }],
    cautions: [{ zh: "氣密與保溫性較低，冷暖房效率較受外氣影響。", ja: "気密性が低いため外気の影響を受けやすく冷暖房費がかかる。" }],
    demerits: [{ zh: "遮音性最弱，上下樓腳步聲、交談聲與水管流水聲容易互相穿透。", ja: "上下左右の生活音（足音、話し声、水回り音）がかなり筒抜けになりやすい。" }],
    naiken: { zh: "實地確認樓上走動聲與相鄰戶交談聲傳導程度", ja: "隣室や上階からの音漏れ、隙間風の有無を確認" }
  },

  // 3. 築年數 (Age)
  {
    id: "age_new",
    name: { zh: "新築・築浅（5年以内）", ja: "新築・築浅（5年以内）" },
    category: "築年",
    overall: { zh: "◎ 明顯優點", ja: "◎ 明確な強み" },
    overallType: "positive",
    effects: { building: 2, security: 1, rent: -1 },
    merits: [{ zh: "最新耐震與節能標準，設備潔淨現代化，居住舒適度最高。", ja: "最新の耐震・省エネ基準を満たし、設備・内装がピカピカで清潔。" }],
    cautions: [{ zh: "租金與初期費用（禮金保證金）門檻最高。", ja: "家賃や初期費用（敷金礼金）が最も高い水準。" }],
    demerits: [],
    naiken: { zh: "確認室內有無新裝潢接著劑味道", ja: "新築・リフォーム特有の臭気や接着剤臭がないか確認" }
  },
  {
    id: "age_10_20",
    name: { zh: "築10〜20年", ja: "築10〜20年" },
    category: "築年",
    overall: { zh: "○ 加分條件", ja: "○ 加点条件" },
    overallType: "positive",
    effects: { building: 0.5, rent: 0.5 },
    merits: [{ zh: "符合新耐震法規，設備實用完備，租金性價比最佳平衡點。", ja: "新耐震基準で構造が確か。新築より家賃が一段安くコスパ最強。" }],
    cautions: [{ zh: "衛浴廚房風格可能稍具年代感。", ja: "水回り設備のデザインや機能に多少の年代感がある。" }],
    demerits: [],
    naiken: { zh: "確認水龍頭水壓與換氣扇運轉聲音", ja: "水回りの清掃状態や換気扇の稼働音を確認" }
  },
  {
    id: "age_30_plus",
    name: { zh: "築30年以上（新耐震）", ja: "築30年以上（新耐震）" },
    category: "築年",
    overall: { zh: "△ 中性/看習慣", ja: "△ 普通・好みによる" },
    overallType: "neutral",
    effects: { building: -0.5, rent: 1 },
    merits: [{ zh: "同預算下室內面積通常較大，租金非常便宜。", ja: "立地の割に家賃が大幅に安く、専有面積が広い掘り出し物が多い。" }],
    cautions: [{ zh: "室內即使翻修，公共管線與窗框氣密仍具年代感。", ja: "室内が改装されていても、共用配管やサッシなど建物自体の古さは残る。" }],
    demerits: [],
    naiken: { zh: "確認排水孔異味、窗框氣密程度與電箱簽約安培數", ja: "排水管の悪臭上がり、サッシの隙間風、アンペア数を確認" }
  },
  {
    id: "age_old_quake",
    name: { zh: "旧耐震基準（1981年5月以前建）", ja: "旧耐震基準（1981年5月以前築）" },
    category: "築年",
    overall: { zh: "👎 明顯抗性", ja: "👎 明確な弱点" },
    overallType: "negative",
    effects: { building: -2.5, rent: 1.5 },
    merits: [{ zh: "同地段租金極低，部分物件室內已全面重新翻新。", ja: "好立地でも格安の家賃。室内フルリノベーション物件も多い。" }],
    cautions: [{ zh: "需向房仲或管委會確認是否有做過耐震補強工程與診斷。", ja: "耐震補強工事や耐震診断の実施状況の確認が必須。" }],
    demerits: [{ zh: "建造於1981年新耐震法規前，大地震時的抗震安全係數較低，管線老朽化。", ja: "現行の耐震基準を満たしておらず、大地震への不安と共用配管の老朽化が懸念。" }],
    naiken: { zh: "確認大樓外壁是否有結構龜裂、是否實施過耐震診斷", ja: "外壁や共用部のクラック（ひび割れ）、耐震工事の有無を確認" }
  },

  // 4. 駅徒歩 & 複数駅利用 (Multi-Station)
  {
    id: "walk_5",
    name: { zh: "駅徒歩5分以内", ja: "駅徒歩5分以内" },
    category: "交通",
    overall: { zh: "◎ 明顯優點", ja: "◎ 明確な強み" },
    overallType: "positive",
    effects: { location: 2, security: 1, rent: -0.5 },
    merits: [{ zh: "每日通勤零壓力，雨天輕鬆，夜道多路燈商店更安全。", ja: "通勤・通学の移動ストレスが皆無。雨の日も楽で夜道も安全。" }],
    cautions: [{ zh: "若靠車站太近，可能有些許鬧區喧囂或人流。", ja: "駅近特有の人通りの多さや周辺店舗の音が気になる場合がある。" }],
    demerits: [],
    naiken: { zh: "確認關窗時車站人流或列車聲", ja: "窓を閉めた時の駅前人流や電車の走行音を確認" }
  },
  {
    id: "walk_multi_station",
    name: { zh: "複数路線・複数駅利用可", ja: "複数路線・複数駅利用可" },
    category: "交通",
    overall: { zh: "◎ 明顯優點", ja: "◎ 明確な強み" },
    overallType: "positive",
    effects: { location: 1.5 },
    merits: [{ zh: "可用 2~3 個地鐵/鐵路站（含都心大站），轉乘選擇多、通勤極具彈性。", ja: "複数駅・複数路線が徒歩圏で、目的地に応じた使い分けや終電後の移動が非常に便利。" }],
    cautions: [{ zh: "不同路線進站步行距離不一，需確認日常最常搭乘的動線。", ja: "路線によって実際の徒歩分数や坂道が異なるため日常動線の確認が必要。" }],
    demerits: [],
    naiken: { zh: "實走日常最常使用的車站路線確認步行時間", ja: "メインで使う駅までの実際のルート（信号待ちや坂道）を確認" }
  },

  // 5. 周邊環境・公園 (Park & Environment)
  {
    id: "env_park_near",
    name: { zh: "大型公園至近（新宿中央公園など）", ja: "大型公園至近（新宿中央公園など）" },
    category: "環境",
    overall: { zh: "◎ 明顯優點", ja: "◎ 明確な強み" },
    overallType: "positive",
    effects: { quietness: 1, sunlight: 0.5 },
    merits: [{ zh: "鄰近開闊綠意公園（如新宿中央公園），散步、慢跑放鬆生活品質極高。", ja: "新宿中央公園など豊かな緑が徒歩圏で、散歩やランニング、休日リフレッシュに最高の環境。" }],
    cautions: [{ zh: "假日或活動時公園人流較多，夏天可能有樹木蚊蟲。", ja: "休日は公園利用者が増え、夏場は虫が発生しやすい。" }],
    demerits: [],
    naiken: { zh: "確認步行至公園路徑與夜間照明安全", ja: "公園までの歩道環境や夜間の街灯の明るさを確認" }
  },
  {
    id: "env_main_road",
    name: { zh: "大通り沿い（幹線道路沿い）", ja: "大通り沿い（幹線道路沿い）" },
    category: "環境",
    overall: { zh: "⚠️ 需妥協", ja: "⚠️ 妥協・注意" },
    overallType: "negative",
    effects: { quietness: -2, sunlight: 1, security: 1 },
    merits: [{ zh: "前方棟距開闊採光通風好，夜間路燈明亮人流多較安全。", ja: "前面が開けて採光・通風が良く、夜道も明るく人通りがあって安心。" }],
    cautions: [{ zh: "突發救護車或機車拉轉聲可能較明顯。", ja: "深夜の緊急車両やバイクの走行音が突発的に響くことがある。" }],
    demerits: [{ zh: "車流噪音震動，排氣粉塵容易弄髒窗台與陽台衣物。", ja: "車の走行騒音・微振動や、排気ガスによるベランダ・網戸の汚れ。" }],
    naiken: { zh: "確認窗戶緊閉時的隔音效果與窗台粉塵沉積情況", ja: "窓を閉めた時の遮音性（二重サッシか）と網戸・ベランダの汚れを確認" }
  },

  // 6. 設備
  {
    id: "equip_bt_sep",
    name: { zh: "バストイレ別", ja: "バストイレ別" },
    category: "設備",
    overall: { zh: "◎ 明顯優點", ja: "◎ 明確な強み" },
    overallType: "positive",
    effects: { building: 1 },
    merits: [{ zh: "衛浴分離舒適衛生，馬桶乾燥無水氣，生活品質高。", ja: "お風呂とトイレが別で衛生的。湯船にゆっくり浸かれて快適。" }],
    cautions: [{ zh: "相比一體成型衛浴會佔用些許室內居室面積。", ja: "3点ユニットより水回りに床面積を取られ家賃も上がる。" }],
    demerits: [],
    naiken: { zh: "確認脫衣空間與浴室換氣乾燥設備", ja: "脱衣スペースの広さと換気設備の吸い込みを確認" }
  },
  {
    id: "equip_washbasin",
    name: { zh: "独立洗面台", ja: "独立洗面台" },
    category: "設備",
    overall: { zh: "○ 加分條件", ja: "○ 加点条件" },
    overallType: "positive",
    effects: { building: 1 },
    merits: [{ zh: "早晨梳洗效率高，化妝與日常清潔瓶罐收納充足。", ja: "朝の身支度がしやすく、歯ブラシや化粧品の収納力が大幅アップ。" }],
    cautions: [{ zh: "在小套房格局中可能會稍稍壓縮居室空間。", ja: "専有面積が小さめの場合、居室部分が圧迫されることがある。" }],
    demerits: [],
    naiken: { zh: "確認洗面台插座數量與吹風機放置位置", ja: "洗面台のコンセント数とドライヤーの置き場を確認" }
  },
  {
    id: "equip_indoor_wash",
    name: { zh: "室内洗濯機置場", ja: "室内洗濯機置場" },
    category: "設備",
    overall: { zh: "◎ 明顯優點", ja: "◎ 明確な強み" },
    overallType: "positive",
    effects: { building: 1 },
    merits: [{ zh: "洗衣機不日曬雨淋劣化，夜間或雨雪天洗衣服安全舒適。", ja: "洗濯機が雨風や直射日光で傷まず、夜間や悪天候でも快適に洗濯可能。" }],
    cautions: [{ zh: "洗衣機尺寸受防水盤規格長寬限制。", ja: "防水パンのサイズにより置ける洗濯機の寸法が決まる。" }],
    demerits: [],
    naiken: { zh: "丈量防水盤長寬與水龍頭高度（滾筒式是否可放入）", ja: "防水パンの寸法と蛇口の高さ（ドラム式が入るか）を確認" }
  },
  {
    id: "equip_no_autolock",
    name: { zh: "オートロックなし（無門禁大門）", ja: "オートロックなし" },
    category: "設備",
    overall: { zh: "⚠️ 需妥協", ja: "⚠️ 妥協・注意" },
    overallType: "negative",
    effects: { security: -1 },
    merits: [{ zh: "忘記帶鑰匙時較不易被反鎖，管理費通常較平價。", ja: "鍵忘れ時の締め出しリスクが少なく、共益費が抑えめ。" }],
    cautions: [{ zh: "外人可直接步行上樓至房門口，防犯需依賴房門鎖與對講機。", ja: "外部の人間が各戸の玄関前まで直接立ち入れるため防犯意識が必要。" }],
    demerits: [{ zh: "推銷員或不速之客能直接敲門，獨居安全感略受影響。", ja: "訪問営業や不審者が玄関先まで来やすく、防犯性にやや不安。" }],
    naiken: { zh: "確認玄關門鎖是否為防撬雙鎖、TV對講機鏡頭清晰度", ja: "玄関ドアがツーロックか、TVモニターホンの画質を確認" }
  },
  {
    id: "equip_elevator",
    name: { zh: "エレベーター", ja: "エレベーター" },
    category: "設備",
    overall: { zh: "○ 加分條件", ja: "○ 加点条件" },
    overallType: "positive",
    effects: { building: 0.5 },
    merits: [{ zh: "日常出入、搬運重物與行李極度便利。", ja: "日常の昇降移動や重い荷物・スーツケースの運搬が非常に楽。" }],
    cautions: [{ zh: "電梯維護費用通常直接反映在每月管理費中。", ja: "定期点検による一時停止や共益費への反映がある。" }],
    demerits: [],
    naiken: { zh: "確認電梯保養狀況與車廂內監視器", ja: "エレベーターの点検状況と防犯カメラの有無を確認" }
  }
];
