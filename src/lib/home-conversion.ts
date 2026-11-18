import type { LangCode } from "@/config/languages";
import { addLocalePrefix } from "@/lib/locale";

export const HOME_LINE_TOPICS = ["family", "business", "inheritance"] as const;
export type HomeLineTopic = (typeof HOME_LINE_TOPICS)[number];
export function getHomeLineTopic(value: unknown): HomeLineTopic | null {
  return typeof value === "string" && HOME_LINE_TOPICS.some(item => item === value) ? value as HomeLineTopic : null;
}
export function homeLineHref(topic: HomeLineTopic, locale: LangCode) {
  return addLocalePrefix("/line", locale) + "?topic=" + topic;
}
export const HOME_ENTRIES = {
  "ja": {
    "h1": "四葉不動産｜文京区の住まいを、希望の学区から。",
    "meta": "四葉不動産｜文京区の学区別賃貸・事業用物件・相続不動産｜四葉グループ",
    "desc": "東京都文京区小日向、茗荷谷駅徒歩5分の四葉不動産株式会社。希望の小学校区に合う賃貸を、当社サイトに載っていない候補も含めてお探しします。店舗・事務所の物件探しや相続した家の管理・賃貸・売却も、代表の浦松にLINEでご相談ください。",
    "place": "文京区小日向 ｜ 茗荷谷駅 徒歩5分",
    "lead": "希望の小学校、家賃、入居時期。決まっている条件から、ご家族の住まいを探します。サイトに載っていない候補も、ご希望を伺って募集状況を確認します。",
    "other": "店舗・事務所の物件探し、相続した家を貸す・売るご相談も、代表の宅建士・浦松がお受けします。",
    "main": "希望の学区をLINEで相談",
    "rent": "学区別の賃貸を見る",
    "directions": "ご相談の入口",
    "topics": "住まい・事業用・相続",
    "family": "ご家族の住まい",
    "fbody": "小学校区の地図と住所を照らし合わせ、賃貸と購入の選択肢を比べられます。",
    "zone": "20校の通学区域を見る",
    "sale": "学区別の売買を見る",
    "business": "事業用の場所を探す",
    "bbody": "店舗、事務所、福祉事業所。用途と開業時期から、物件を選ぶ際の確認点を整理します。",
    "bguide": "事業用・投資用物件の案内",
    "bline": "事業用物件をLINEで相談",
    "inheritance": "相続した家を考える",
    "ibody": "まだ売ると決めていなくても、空き家の管理、貸した場合、売った場合を比較できます。",
    "iguide": "相続不動産の選択肢を見る",
    "iline": "相続した不動産をLINEで相談",
    "global": "日本語・英語・中国語でのお部屋探し",
    "fee": "対象賃貸の仲介手数料0.33ヶ月（税込）について",
    "reply": "LINEは代表に直接届きます。24時間受付・順次返信。",
    "lines": {
      "family": "文京区の学区で住まいを探しています。\n希望の小学校またはエリア：\n家賃または購入予算：\n入居希望時期：",
      "business": "事業用物件を探しています。\n予定している用途：\n希望エリア：\n開業希望時期：",
      "inheritance": "相続した不動産について、貸す・売る・管理する選択肢を相談したいです。\n物件のおおよそのエリア：\nいま気になっていること："
    },
    "messageHelp": "この例文は任意です。コピーしてLINEに貼り付け、わかるところだけお書きください。"
  },
  "en": {
    "h1": "四葉不動産｜Find a family home in your Bunkyo school district.",
    "meta": "四葉不動産｜School District Rentals, Business Premises and Inherited Property in Bunkyo",
    "desc": "Based in Kohinata, a five-minute walk from Myogadani Station, Yotsuba Real Estate helps families find Bunkyo homes by school district. Ask about rentals not shown on this site, business premises or options for inherited property via LINE.",
    "place": "Kohinata, Bunkyo · 5 minutes on foot from Myogadani Station",
    "lead": "Start with a school, a budget or a move-in date. We check what is available for your family, including suitable options not listed on our website.",
    "other": "Looking for a shop or an office, or deciding whether to rent out or sell an inherited house? Our representative Joji Uramatsu can help.",
    "main": "Ask about a school district on LINE",
    "rent": "Browse rentals by school district",
    "directions": "Start here",
    "topics": "Find the right service",
    "family": "Find a family home",
    "fbody": "Check the district for an address, then compare homes to rent or buy.",
    "zone": "Explore all 20 elementary school districts",
    "sale": "Browse homes for sale by district",
    "business": "Find business premises",
    "bbody": "For a shop, office or care facility, start with the intended use and the date you plan to open.",
    "bguide": "Business and investment property guide",
    "bline": "Ask about premises on LINE",
    "inheritance": "Plan for an inherited home",
    "ibody": "Compare upkeep, renting out and selling, even if you have not chosen a direction yet.",
    "iguide": "Explore your options",
    "iline": "Ask about inherited property on LINE",
    "global": "Housing help in Japanese, English and Chinese",
    "fee": "About the 0.33-month brokerage fee on eligible rentals (tax included)",
    "reply": "LINE goes directly to our representative. Messages are accepted anytime and answered in turn.",
    "lines": {
      "family": "I am looking for a home in a Bunkyo school district.\nSchool or area:\nRent or purchase budget:\nPreferred move-in date:",
      "business": "I am looking for business premises.\nIntended use:\nPreferred area:\nPlanned opening:",
      "inheritance": "I would like to discuss keeping, renting out or selling inherited property.\nApproximate area:\nWhat I would like to understand:"
    },
    "messageHelp": "You can copy this sample into LINE and fill in only what you know."
  },
  "zh-tw": {
    "h1": "四葉不動産｜在文京區，從理想學區找到全家的住處。",
    "meta": "四葉不動産｜文京區學區租屋、營業場所及繼承不動產",
    "desc": "四葉不動産株式会社位於文京區小日向，從茗荷谷站步行約5分鐘。可按小學學區找房，也會依需求確認本網站未刊登的選項。找店面、辦公室或評估繼承房產的出租與出售，皆可透過LINE諮詢。",
    "place": "文京區小日向 ｜ 距茗荷谷站步行5分鐘",
    "lead": "想讀哪所小學、可接受的租金、預計入住時間，有一項就能開始找房。我們會按您的需求確認招租情況，也會查詢本網站未刊登的選項。",
    "other": "若您在找店面、辦公室，或考慮將繼承的房屋出租或出售，也可直接洽詢代表浦松丈二。",
    "main": "用LINE諮詢理想學區",
    "rent": "依學區查看租屋",
    "directions": "諮詢入口",
    "topics": "住家、營業場所與繼承房產",
    "family": "為家人找住處",
    "fbody": "先用地址核對學區，再比較出租和出售中的物件。",
    "zone": "查看20所區立小學的學區",
    "sale": "依學區查看出售物件",
    "business": "尋找營業場所",
    "bbody": "店面、辦公室或福祉設施，可從用途與預計開業時間著手。",
    "bguide": "營業與投資用不動產指南",
    "bline": "用LINE諮詢營業場所",
    "inheritance": "評估繼承房產的去向",
    "ibody": "尚未決定出售也沒關係，可比較管理、出租及出售的選項。",
    "iguide": "了解繼承房產的處理方式",
    "iline": "用LINE諮詢繼承房產",
    "global": "日文、英文及中文找房服務",
    "fee": "適用物件的仲介費為0.33個月租金（含稅）",
    "reply": "LINE訊息由代表親自接收，可隨時留言，按順序回覆。",
    "lines": {
      "family": "我正在按文京區的小學學區找房。\n希望就讀的學校或地區：\n租金或購屋預算：\n預計入住時間：",
      "business": "我想尋找營業場所。\n預計用途：\n希望地區：\n預計開業時間：",
      "inheritance": "我想比較繼承房產的管理、出租與出售選項。\n房產大致地區：\n目前想了解的問題："
    },
    "messageHelp": "可將範例複製到LINE，只填寫已確定的資訊。"
  },
  "zh": {
    "h1": "四葉不動産｜在文京区，按心仪的小学学区为家人找房。",
    "meta": "四葉不動産｜文京区学区租房、经营场所与继承房产",
    "desc": "四葉不動産株式会社位于东京文京区小日向，距茗荷谷站步行约5分钟。可以按小学学区找房，我们也会按需求查询本站未刊登的房源。寻找商铺、办公室或考虑出租、出售继承的房产，均可通过LINE咨询。",
    "place": "文京区小日向 ｜ 距茗荷谷站步行5分钟",
    "lead": "心仪的小学、租金预算、希望入住的时间，只要确定了一项，就可以开始找房。我们按您的需求核实招租情况，也会查询本站未刊登的房源。",
    "other": "寻找商铺、办公室，或考虑出租、出售继承的房产，也可直接向代表浦松丈二咨询。",
    "main": "用LINE咨询心仪的学区",
    "rent": "按学区查看出租房源",
    "directions": "咨询入口",
    "topics": "住宅、经营场所与继承房产",
    "family": "为家人找住房",
    "fbody": "先按地址核对小学学区，再比较适合租住或购买的房源。",
    "zone": "查看20所区立小学的学区",
    "sale": "按学区查看出售房源",
    "business": "寻找经营场所",
    "bbody": "商铺、办公室、福利服务设施，可先从预期用途和开业时间谈起。",
    "bguide": "经营及投资用房产指南",
    "bline": "用LINE咨询经营场所",
    "inheritance": "考虑如何处理继承的房产",
    "ibody": "即使尚未决定出售，也可以先比较日常管理、出租和出售的选择。",
    "iguide": "了解继承房产的选择",
    "iline": "用LINE咨询继承的房产",
    "global": "日语、英语和中文找房服务",
    "fee": "适用房源的中介费为0.33个月租金（含税）",
    "reply": "LINE消息由代表本人接收。可随时留言，按顺序回复。",
    "lines": {
      "family": "我想按文京区的小学学区找房。\n心仪的学校或地区：\n租金或购房预算：\n希望入住的时间：",
      "business": "我在寻找经营场所。\n预计用途：\n心仪地区：\n预计开业时间：",
      "inheritance": "我想咨询继承的房产是日常管理、出租还是出售。\n房产大致所在地区：\n我目前关心的问题："
    },
    "messageHelp": "可以复制示例到LINE，只填写已确定的信息。"
  }
} as const satisfies Record<LangCode,{lines: Record<HomeLineTopic,string>} & Record<string, unknown>>;
