import type { LangCode } from "@/config/languages";
import type { BusinessKey, Column } from "@/lib/column-shared";

type LocalizedAlt = Record<LangCode, string>;

type IllustrationDefinition = {
  src: string;
  alt: LocalizedAlt;
};

export type ColumnIllustrationSource = "ogImage" | "slug" | "theme" | "fallback";

export type ResolvedColumnIllustration = {
  src: string;
  theme: string;
  source: ColumnIllustrationSource;
};

export type ColumnIllustrationInput = Pick<
  Column,
  "business" | "slug" | "title" | "category" | "tags" | "ogImage"
>;

const ILLUSTRATIONS = {
  "realestate-global": {
    src: "/hero/realestate-global-16x9.webp",
    alt: {
      ja: "海外と日本を結ぶ不動産相談のイメージ",
      en: "Illustration of cross-border real estate consultation in Japan",
      "zh-tw": "連結海外與日本的不動產諮詢示意圖",
      zh: "连接海外与日本的不动产咨询示意图",
    },
  },
  "realestate-group-home": {
    src: "/hero/realestate-group-home-16x9.webp",
    alt: {
      ja: "地域で暮らすグループホームと支援のイメージ",
      en: "Illustration of a community group home and support",
      "zh-tw": "社區團體家屋與生活支援示意圖",
      zh: "社区团体家屋与生活支持示意图",
    },
  },
  "realestate-shataku": {
    src: "/hero/realestate-shataku-16x9.webp",
    alt: {
      ja: "社宅向けの共同住宅と鍵のイメージ",
      en: "Illustration of company housing and a residential key",
      "zh-tw": "員工宿舍與住宅鑰匙示意圖",
      zh: "员工宿舍与住宅钥匙示意图",
    },
  },
  "realestate-toushi": {
    src: "/hero/realestate-toushi-16x9.webp",
    alt: {
      ja: "住宅と街並みから不動産活用を考えるイメージ",
      en: "Illustration of homes and streets for considering real estate use",
      "zh-tw": "從住宅與街景思考不動產活用的示意圖",
      zh: "从住宅与街景思考不动产活用的示意图",
    },
  },
  "bunkyo-sakura": {
    src: "/hero/bunkyo-sakura-16x9.webp",
    alt: {
      ja: "桜が咲く文京区の街並み",
      en: "A Bunkyo streetscape lined with cherry blossoms",
      "zh-tw": "櫻花盛開的文京區街景",
      zh: "樱花盛开的文京区街景",
    },
  },
  "legal-inheritance": {
    src: "/hero/legal-inheritance-16x9.webp",
    alt: {
      ja: "家族・住まい・相続書類を整理するイメージ",
      en: "Illustration of organizing family, housing, and inheritance documents",
      "zh-tw": "整理家族、住宅與繼承文件的示意圖",
      zh: "整理家庭、住宅与继承文件的示意图",
    },
  },
  "legal-visa": {
    src: "/hero/legal-visa-16x9.webp",
    alt: {
      ja: "旅券と地球儀で表す国際手続のイメージ",
      en: "Illustration of international procedures with a passport and globe",
      "zh-tw": "以護照與地球儀呈現國際手續的示意圖",
      zh: "以护照与地球仪呈现国际手续的示意图",
    },
  },
  "legal-company": {
    src: "/hero/legal-company-16x9.webp",
    alt: {
      ja: "事業所と申請書類を準備するイメージ",
      en: "Illustration of preparing business premises and application documents",
      "zh-tw": "準備營業場所與申請文件的示意圖",
      zh: "准备营业场所与申请文件的示意图",
    },
  },
  "legal-subsidy": {
    src: "/hero/legal-subsidy-16x9.webp",
    alt: {
      ja: "事業計画と資金計画を検討するイメージ",
      en: "Illustration of reviewing a business and funding plan",
      "zh-tw": "檢討事業計畫與資金計畫的示意圖",
      zh: "研究事业计划与资金计划的示意图",
    },
  },
  "legal-shogai-fukushi": {
    src: "/hero/legal-shogai-fukushi-16x9.webp",
    alt: {
      ja: "障害福祉の住まいと支援を考えるイメージ",
      en: "Illustration of housing and support in disability welfare",
      "zh-tw": "思考身心障礙福利住宅與支援的示意圖",
      zh: "思考残障福利住房与支持的示意图",
    },
  },
  "legal-top": {
    src: "/hero/legal-top-16x9.webp",
    alt: {
      ja: "書類を整えて行政手続を進めるイメージ",
      en: "Illustration of organizing documents for administrative procedures",
      "zh-tw": "整理文件並辦理行政手續的示意圖",
      zh: "整理文件并办理行政手续的示意图",
    },
  },
  "labor-gaibu-kansanin": {
    src: "/hero/labor-gaibu-kansanin-16x9.webp",
    alt: {
      ja: "資料を確認しながら外部監査を行うイメージ",
      en: "Illustration of an external audit and document review",
      "zh-tw": "查核文件並進行外部稽核的示意圖",
      zh: "核查文件并进行外部审计的示意图",
    },
  },
  "labor-gaikokujin-koyo": {
    src: "/hero/labor-gaikokujin-koyo-16x9.webp",
    alt: {
      ja: "多様な人材が働く職場づくりのイメージ",
      en: "Illustration of an inclusive workplace for international employees",
      "zh-tw": "多元人才共同工作的職場示意圖",
      zh: "多元人才共同工作的职场示意图",
    },
  },
  "labor-jinin-kijun-roumu": {
    src: "/hero/labor-jinin-kijun-roumu-16x9.webp",
    alt: {
      ja: "人事・賃金・労務制度を整えるイメージ",
      en: "Illustration of organizing HR, pay, and labor systems",
      "zh-tw": "建構人事、薪資與勞務制度的示意圖",
      zh: "建立人事、薪酬与劳动制度的示意图",
    },
  },
  "labor-joseikin": {
    src: "/hero/labor-joseikin-16x9.webp",
    alt: {
      ja: "助成金申請に向けて条件を確認するイメージ",
      en: "Illustration of checking eligibility for an employment subsidy",
      "zh-tw": "確認僱用相關補助金申請條件的示意圖",
      zh: "确认雇用相关补助金申请条件的示意图",
    },
  },
  "labor-kaigo-roumu": {
    src: "/hero/labor-kaigo-roumu-16x9.webp",
    alt: {
      ja: "介護・福祉事業所の労務管理を話し合うイメージ",
      en: "Illustration of discussing labor management in care and welfare services",
      "zh-tw": "討論照護與福利事業勞務管理的示意圖",
      zh: "讨论护理与福利事业劳动管理的示意图",
    },
  },
  "labor-saiyo": {
    src: "/hero/labor-saiyo-16x9.webp",
    alt: {
      ja: "採用面談と雇用書類のイメージ",
      en: "Illustration of a recruitment interview and employment documents",
      "zh-tw": "招募面談與僱用文件的示意圖",
      zh: "招聘面谈与雇用文件的示意图",
    },
  },
  "labor-shogai-nenkin": {
    src: "/hero/labor-shogai-nenkin-16x9.webp",
    alt: {
      ja: "障害年金と暮らしを支える手続のイメージ",
      en: "Illustration of disability pension procedures supporting daily life",
      "zh-tw": "以身心障礙年金手續支援生活的示意圖",
      zh: "以残障年金手续支持生活的示意图",
    },
  },
  "labor-shogu-kaizen": {
    src: "/hero/labor-shogu-kaizen-16x9.webp",
    alt: {
      ja: "福祉職場の処遇改善と公正な制度のイメージ",
      en: "Illustration of fair systems and improved working conditions in welfare",
      "zh-tw": "福利職場待遇改善與公平制度的示意圖",
      zh: "福利职场待遇改善与公平制度的示意图",
    },
  },
  "labor-top": {
    src: "/hero/labor-top-16x9.webp",
    alt: {
      ja: "福祉の現場と働く人を支えるイメージ",
      en: "Illustration of supporting welfare services and their workforce",
      "zh-tw": "支援福利服務現場與工作人員的示意圖",
      zh: "支持福利服务现场与工作人员的示意图",
    },
  },
  // ── 2026-09-23 納品の新規34点（GPT Image 2.5 生成・sharp で 1600x900 WebP 化） ──
  "realestate-souzoku": {
    src: "/hero/realestate-souzoku-16x9.webp",
    alt: {
      ja: "相続した実家を前に立つ二人の後ろ姿を描いた水彩イラスト",
      en: "Watercolor illustration of two people standing before an inherited family home",
      "zh-tw": "兩人站在繼承的老家前背影的水彩插畫",
      zh: "两人站在继承的老家前背影的水彩插画",
    },
  },
  "realestate-akiya": {
    src: "/hero/realestate-akiya-16x9.webp",
    alt: {
      ja: "雨戸を閉めたまま草の伸びた空き家を描いた水彩イラスト",
      en: "Watercolor illustration of a vacant house with closed shutters and overgrown grass",
      "zh-tw": "門窗緊閉、雜草叢生的空屋水彩插畫",
      zh: "门窗紧闭、杂草丛生的空屋水彩插画",
    },
  },
  "realestate-isan-bunkatsu": {
    src: "/hero/realestate-isan-bunkatsu-16x9.webp",
    alt: {
      ja: "一軒の家が三つに分かれる様子と三人の後ろ姿を描いた水彩イラスト",
      en: "Watercolor illustration of one house divided into three shares with three people",
      "zh-tw": "一棟房屋分為三份與三人背影的水彩插畫",
      zh: "一栋房屋分为三份与三人背影的水彩插画",
    },
  },
  "realestate-baikyaku-satei": {
    src: "/hero/realestate-baikyaku-satei-16x9.webp",
    alt: {
      ja: "机に広げた間取り図と巻尺で不動産の査定をする場面の水彩イラスト",
      en: "Watercolor illustration of a floor plan and tape measure for a property appraisal",
      "zh-tw": "攤開的格局圖與捲尺進行不動產估價的水彩插畫",
      zh: "摊开的户型图与卷尺进行不动产估价的水彩插画",
    },
  },
  "realestate-keiyaku-kessai": {
    src: "/hero/realestate-keiyaku-kessai-16x9.webp",
    alt: {
      ja: "決済の場で鍵が手渡される瞬間を描いた水彩イラスト",
      en: "Watercolor illustration of keys handed over at a property settlement",
      "zh-tw": "交屋結算時遞出鑰匙瞬間的水彩插畫",
      zh: "交房结算时递出钥匙瞬间的水彩插画",
    },
  },
  "realestate-jouto-shotoku": {
    src: "/hero/realestate-jouto-shotoku-16x9.webp",
    alt: {
      ja: "申告書と電卓を並べた確定申告の準備を描いた水彩イラスト",
      en: "Watercolor illustration of a tax return form and calculator on a desk",
      "zh-tw": "申報書與計算機並排、準備報稅的水彩插畫",
      zh: "申报表与计算器并排、准备报税的水彩插画",
    },
  },
  "realestate-youto-chiiki": {
    src: "/hero/realestate-youto-chiiki-16x9.webp",
    alt: {
      ja: "用途地域ごとに色分けされた街区を上空から見た水彩イラスト",
      en: "Watercolor illustration of city blocks colour-coded by zoning, seen from above",
      "zh-tw": "依使用分區著色的街區俯瞰水彩插畫",
      zh: "按用途分区着色的街区俯瞰水彩插画",
    },
  },
  "realestate-jigyou-fudosan": {
    src: "/hero/realestate-jigyou-fudosan-16x9.webp",
    alt: {
      ja: "ガラス面に空が映る低層オフィスビルを描いた水彩イラスト",
      en: "Watercolor illustration of a low-rise office building reflecting the sky",
      "zh-tw": "玻璃帷幕映照天空的低層辦公大樓水彩插畫",
      zh: "玻璃幕墙映照天空的低层办公楼水彩插画",
    },
  },
  "realestate-inshokuten": {
    src: "/hero/realestate-inshokuten-16x9.webp",
    alt: {
      ja: "無地の暖簾をかけた小さな飲食店の店先を描いた水彩イラスト",
      en: "Watercolor illustration of a small restaurant front with a plain noren curtain",
      "zh-tw": "掛著素色門簾的小餐館店面水彩插畫",
      zh: "挂着素色门帘的小餐馆店面水彩插画",
    },
  },
  "realestate-owner-change": {
    src: "/hero/realestate-owner-change-16x9.webp",
    alt: {
      ja: "灯りのともる集合住宅と並べて置かれた二本の鍵を描いた水彩イラスト",
      en: "Watercolor illustration of a lit apartment building and two keys side by side",
      "zh-tw": "燈火通明的集合住宅與並排兩把鑰匙的水彩插畫",
      zh: "灯火通明的集合住宅与并排两把钥匙的水彩插画",
    },
  },
  "realestate-yuushi-deguchi": {
    src: "/hero/realestate-yuushi-deguchi-16x9.webp",
    alt: {
      ja: "育つ若木と高さの異なる矩形で収支の推移を表した水彩イラスト",
      en: "Watercolor illustration of a growing sapling beside bars of varying height",
      "zh-tw": "成長的樹苗與高低不一的方塊表現收支變化的水彩插畫",
      zh: "成长的树苗与高低不一的方块表现收支变化的水彩插画",
    },
  },
  "realestate-taiwan-chuuka": {
    src: "/hero/realestate-taiwan-chuuka-16x9.webp",
    alt: {
      ja: "海を挟んで向かい合う二つの街並みを描いた水彩イラスト",
      en: "Watercolor illustration of two townscapes facing each other across the sea",
      "zh-tw": "隔海相望的兩座城鎮水彩插畫",
      zh: "隔海相望的两座城镇水彩插画",
    },
  },
  "realestate-rinichi": {
    src: "/hero/realestate-rinichi-16x9.webp",
    alt: {
      ja: "片付いた玄関に置かれた旅行鞄と戸口に立つ後ろ姿の水彩イラスト",
      en: "Watercolor illustration of a suitcase in a tidied entryway and a figure at the door",
      "zh-tw": "整理過的玄關放著旅行箱、門口站著背影的水彩插畫",
      zh: "整理过的玄关放着旅行箱、门口站着背影的水彩插画",
    },
  },
  "legal-koseki-ichiranzu": {
    src: "/hero/legal-koseki-ichiranzu-16x9.webp",
    alt: {
      ja: "重ねた戸籍の帳面から人の関係が枝分かれする様子の水彩イラスト",
      en: "Watercolor illustration of stacked family registers branching into relationships",
      "zh-tw": "疊放的戶籍簿冊延伸出親屬關係分支的水彩插畫",
      zh: "叠放的户籍簿册延伸出亲属关系分支的水彩插画",
    },
  },
  "legal-isan-bunkatsu-kyougi": {
    src: "/hero/legal-isan-bunkatsu-kyougi-16x9.webp",
    alt: {
      ja: "座卓を囲んで一枚の書面に向かう三人の後ろ姿を描いた水彩イラスト",
      en: "Watercolor illustration of three people around a low table facing a single document",
      "zh-tw": "三人圍坐矮桌面對一份文件的背影水彩插畫",
      zh: "三人围坐矮桌面对一份文件的背影水彩插画",
    },
  },
  "legal-iryuubun": {
    src: "/hero/legal-iryuubun-16x9.webp",
    alt: {
      ja: "不均等に分かれた円の中で小さな一片が示される水彩イラスト",
      en: "Watercolor illustration of an unevenly divided circle with one small share highlighted",
      "zh-tw": "不均等分割的圓中標示出一小片的水彩插畫",
      zh: "不均等分割的圆中标示出一小片的水彩插画",
    },
  },
  "legal-yuigon": {
    src: "/hero/legal-yuigon-16x9.webp",
    alt: {
      ja: "文机に置かれた封をした和封筒と硯を描いた水彩イラスト",
      en: "Watercolor illustration of a sealed Japanese envelope and inkstone on a writing desk",
      "zh-tw": "書案上封緘的和式信封與硯台水彩插畫",
      zh: "书案上封缄的和式信封与砚台水彩插画",
    },
  },
  "legal-ninni-kouken": {
    src: "/hero/legal-ninni-kouken-16x9.webp",
    alt: {
      ja: "年長者に寄り添う人の後ろ姿と小卓の帳面を描いた水彩イラスト",
      en: "Watercolor illustration of someone beside an older person, with a notebook on a side table",
      "zh-tw": "陪伴長者的背影與小几上帳冊的水彩插畫",
      zh: "陪伴长者的背影与小几上账册的水彩插画",
    },
  },
  "legal-souzoku-zei": {
    src: "/hero/legal-souzoku-zei-16x9.webp",
    alt: {
      ja: "三冊の帳面から伸びる線が一点に集まる専門家連携の水彩イラスト",
      en: "Watercolor illustration of lines from three ledgers converging on one point",
      "zh-tw": "三本帳冊延伸的線條匯聚於一點的水彩插畫",
      zh: "三本账册延伸的线条汇聚于一点的水彩插画",
    },
  },
  "legal-kyoninka": {
    src: "/hero/legal-kyoninka-16x9.webp",
    alt: {
      ja: "窓口カウンターに置かれた申請書の束を描いた水彩イラスト",
      en: "Watercolor illustration of a stack of application forms on a service counter",
      "zh-tw": "櫃檯上成疊申請書的水彩插畫",
      zh: "柜台上成叠申请书的水彩插画",
    },
  },
  "legal-shitei-shinsei": {
    src: "/hero/legal-shitei-shinsei-16x9.webp",
    alt: {
      ja: "平面図の上に置かれた小さな建物模型を描いた水彩イラスト",
      en: "Watercolor illustration of a small building model set on a floor plan",
      "zh-tw": "平面圖上放著小型建築模型的水彩插畫",
      zh: "平面图上放着小型建筑模型的水彩插画",
    },
  },
  "legal-jinin-setsubi-kijun": {
    src: "/hero/legal-jinin-setsubi-kijun-16x9.webp",
    alt: {
      ja: "間取り図の各部屋に人型が配置された人員基準の水彩イラスト",
      en: "Watercolor illustration of figures placed room by room on a floor plan",
      "zh-tw": "格局圖各房間配置人形的水彩插畫",
      zh: "户型图各房间配置人形的水彩插画",
    },
  },
  "legal-inshoku-ryokan": {
    src: "/hero/legal-inshoku-ryokan-16x9.webp",
    alt: {
      ja: "行灯のともる和風旅館の玄関と徳利を描いた水彩イラスト",
      en: "Watercolor illustration of a Japanese inn entrance with a lit lantern and sake flask",
      "zh-tw": "點著行燈的日式旅館玄關與酒瓶水彩插畫",
      zh: "点着行灯的日式旅馆玄关与酒瓶水彩插画",
    },
  },
  "legal-kensetsu-unsou": {
    src: "/hero/legal-kensetsu-unsou-16x9.webp",
    alt: {
      ja: "足場のある建設現場と小型トラック、ヘルメットの水彩イラスト",
      en: "Watercolor illustration of a scaffolded construction site, a small truck and a helmet",
      "zh-tw": "有鷹架的工地、小貨車與安全帽的水彩插畫",
      zh: "有脚手架的工地、小货车与安全帽的水彩插画",
    },
  },
  "legal-kousho-ninshou": {
    src: "/hero/legal-kousho-ninshou-16x9.webp",
    alt: {
      ja: "リボンと封蝋で結ばれた二通の書類を描いた水彩イラスト",
      en: "Watercolor illustration of two documents bound with a ribbon and wax seal",
      "zh-tw": "以緞帶與封蠟繫結的兩份文件水彩插畫",
      zh: "以缎带与封蜡系结的两份文件水彩插画",
    },
  },
  "labor-shugyo-kisoku": {
    src: "/hero/labor-shugyo-kisoku-16x9.webp",
    alt: {
      ja: "付箋のはさまった就業規則の冊子を開いた机上の水彩イラスト",
      en: "Watercolor illustration of an open work-rules booklet with sticky notes",
      "zh-tw": "夾著便利貼、攤開的工作規則手冊水彩插畫",
      zh: "夹着便利贴、摊开的工作规则手册水彩插画",
    },
  },
  "labor-roudou-jikan": {
    src: "/hero/labor-roudou-jikan-16x9.webp",
    alt: {
      ja: "壁の掛け時計と升目だけのシフト表を描いた水彩イラスト",
      en: "Watercolor illustration of a wall clock and a blank shift grid",
      "zh-tw": "牆上掛鐘與空白排班表的水彩插畫",
      zh: "墙上挂钟与空白排班表的水彩插画",
    },
  },
  "labor-roudou-jouken": {
    src: "/hero/labor-roudou-jouken-16x9.webp",
    alt: {
      ja: "労働条件を記した書面が手渡される場面の水彩イラスト",
      en: "Watercolor illustration of a statement of working conditions being handed over",
      "zh-tw": "遞交載明勞動條件書面的水彩插畫",
      zh: "递交载明劳动条件书面的水彩插画",
    },
  },
  "labor-kyuyo-keisan": {
    src: "/hero/labor-kyuyo-keisan-16x9.webp",
    alt: {
      ja: "電卓と升目の一覧表、給与封筒を並べた机上の水彩イラスト",
      en: "Watercolor illustration of a calculator, a ruled table and pay envelopes on a desk",
      "zh-tw": "計算機、格線表格與薪資袋並排桌上的水彩插畫",
      zh: "计算器、格线表格与工资袋并排桌上的水彩插画",
    },
  },
  "labor-shakai-hoken": {
    src: "/hero/labor-shakai-hoken-16x9.webp",
    alt: {
      ja: "淡い半円が人々を覆う社会保険の仕組みを表した水彩イラスト",
      en: "Watercolor illustration of a soft arc sheltering people, representing social insurance",
      "zh-tw": "淡色半圓覆蓋人們、象徵社會保險的水彩插畫",
      zh: "淡色半圆覆盖人们、象征社会保险的水彩插画",
    },
  },
  "labor-koyou-hoken": {
    src: "/hero/labor-koyou-hoken-16x9.webp",
    alt: {
      ja: "ヘルメットと救急箱、支える曲線を描いた労働保険の水彩イラスト",
      en: "Watercolor illustration of a helmet, a first-aid box and a supporting curve",
      "zh-tw": "安全帽、急救箱與支撐曲線的水彩插畫",
      zh: "安全帽、急救箱与支撑曲线的水彩插画",
    },
  },
  "labor-taishoku-kaiko": {
    src: "/hero/labor-taishoku-kaiko-16x9.webp",
    alt: {
      ja: "片付いた机と空の椅子、私物の入った段ボール箱の水彩イラスト",
      en: "Watercolor illustration of a cleared desk, an empty chair and a box of belongings",
      "zh-tw": "清空的辦公桌、空椅子與裝著私人物品紙箱的水彩插畫",
      zh: "清空的办公桌、空椅子与装着私人物品纸箱的水彩插画",
    },
  },
  "labor-harassment": {
    src: "/hero/labor-harassment-16x9.webp",
    alt: {
      ja: "向かい合う椅子と空白の吹き出しを描いた相談窓口の水彩イラスト",
      en: "Watercolor illustration of two facing chairs and empty speech bubbles",
      "zh-tw": "相對的兩張椅子與空白對話框的水彩插畫",
      zh: "相对的两张椅子与空白对话框的水彩插画",
    },
  },
  "labor-mental-health": {
    src: "/hero/labor-mental-health-16x9.webp",
    alt: {
      ja: "窓辺の椅子と曇りから晴れへ移る空、新しい芽を描いた水彩イラスト",
      en: "Watercolor illustration of a chair by a window, a sky clearing, and a new shoot",
      "zh-tw": "窗邊椅子、由陰轉晴的天空與新芽的水彩插畫",
      zh: "窗边椅子、由阴转晴的天空与新芽的水彩插画",
    },
  },
} as const satisfies Record<string, IllustrationDefinition>;

type IllustrationTheme = keyof typeof ILLUSTRATIONS;

type ThemeRule = {
  theme: IllustrationTheme;
  keywords: readonly string[];
};

// 並び順に意味がある：**先頭から順に見て、最初に一致したルールが勝つ**（resolveColumnIllustration）。
// 狭いテーマを広いテーマより前に置くこと。例えば「空き家」は「相続」より前に無いと、
// 相続ルールに吸われて空き家の画像に到達できない。
//
// 2026-09-24: 新規34点を追加したがルールが未整備で、54点中15点しか使われず
// 1画像あたり最大67記事に集中していた（新規34点は1点も選ばれていなかった）。
// 全テーマに経路を与え、狭い順に並べ直した。テーマの到達可能性はテストで担保する。
const THEME_RULES: Record<BusinessKey, readonly ThemeRule[]> = {
  realestate: [
    {
      theme: "realestate-group-home",
      keywords: ["グループホーム", "共同生活援助", "障害福祉", "福祉施設", "group-home"],
    },
    {
      theme: "realestate-akiya",
      keywords: ["空き家", "空家", "実家", "akiya", "3000万円控除", "被相続人居住用"],
    },
    {
      theme: "realestate-isan-bunkatsu",
      keywords: ["遺産分割", "分割協議", "共有", "持分", "kyoyu", "mochibun"],
    },
    {
      theme: "realestate-jouto-shotoku",
      keywords: ["譲渡所得", "確定申告", "納税管理人", "取得費", "源泉", "jouto", "nozei"],
    },
    {
      theme: "realestate-souzoku",
      keywords: ["相続", "遺産", "相続登記", "souzoku", "inherit"],
    },
    {
      theme: "realestate-rinichi",
      keywords: ["離日", "帰国", "出国", "海外赴任", "転勤", "rinichi", "kikoku", "leaving-japan"],
    },
    {
      theme: "realestate-taiwan-chuuka",
      keywords: ["台湾", "台灣", "中国語圏", "華僑", "taiwan", "chuka"],
    },
    {
      theme: "realestate-global",
      keywords: [
        "外国人", "海外", "非居住者", "中国", "在留",
        "cross-border", "foreign", "global", "hikyojusha",
      ],
    },
    {
      theme: "realestate-inshokuten",
      keywords: [
        "飲食店", "店舗", "厨房", "消防法", "カフェ", "美容室", "理容所",
        "inshokuten", "restaurant", "shop",
      ],
    },
    {
      theme: "realestate-jigyou-fudosan",
      keywords: [
        "事業用", "オフィス", "事務所", "倉庫", "工場", "営業所", "診療所", "物販",
        "office", "jigyou",
      ],
    },
    {
      theme: "realestate-youto-chiiki",
      keywords: [
        "用途地域", "接道", "再建築", "建ぺい率", "容積率", "市街化", "調整区域",
        "youto", "saikenchiku",
      ],
    },
    {
      theme: "realestate-owner-change",
      keywords: ["オーナーチェンジ", "賃貸経営", "入居者", "サブリース", "一棟", "owner-change"],
    },
    {
      theme: "realestate-keiyaku-kessai",
      keywords: ["決済", "引渡", "重要事項説明", "手付", "契約書", "keiyaku", "kessai"],
    },
    {
      theme: "realestate-baikyaku-satei",
      keywords: ["査定", "売却", "媒介", "買取", "baikyaku", "satei"],
    },
    {
      theme: "realestate-yuushi-deguchi",
      keywords: ["融資", "利回り", "収支", "出口", "ローン", "yushi", "loan"],
    },
    {
      theme: "realestate-shataku",
      keywords: ["社宅", "社員寮", "法人契約", "corporate-housing", "shataku"],
    },
    {
      theme: "legal-subsidy",
      keywords: ["補助金", "助成金", "事業計画", "subsidy"],
    },
    {
      theme: "realestate-toushi",
      keywords: ["投資", "収益", "土地活用", "不動産活用", "investment", "yield"],
    },
    {
      theme: "bunkyo-sakura",
      keywords: ["文京区", "茗荷谷", "小石川", "春日", "後楽園", "bunkyo", "myogadani", "koishikawa"],
    },
  ],
  legal: [
    {
      theme: "legal-jinin-setsubi-kijun",
      keywords: [
        "人員基準", "設備基準", "常勤換算", "サービス管理責任者", "サビ管",
        "世話人", "生活支援員", "jinin", "setsubi",
      ],
    },
    {
      theme: "legal-shitei-shinsei",
      keywords: ["指定申請", "指定基準", "事前協議", "指定権者", "shitei-shinsei"],
    },
    {
      theme: "legal-shogai-fukushi",
      keywords: [
        "障害福祉", "グループホーム", "共同生活援助", "放課後等デイ", "就労支援",
        "児童発達支援", "shogai", "welfare",
      ],
    },
    {
      theme: "legal-koseki-ichiranzu",
      keywords: ["戸籍", "法定相続情報", "除籍", "改製原", "広域交付", "koseki", "ichiranzu"],
    },
    {
      theme: "legal-isan-bunkatsu-kyougi",
      keywords: ["遺産分割", "分割協議", "協議書", "isanbunkatsu", "kyogisho"],
    },
    {
      theme: "legal-iryuubun",
      keywords: ["遺留分", "侵害額", "iryubun"],
    },
    {
      theme: "legal-yuigon",
      keywords: ["遺言", "自筆証書", "公正証書", "遺言執行", "yuigon"],
    },
    {
      theme: "legal-ninni-kouken",
      keywords: ["任意後見", "成年後見", "死後事務", "家族信託", "見守り", "kouken", "shintaku"],
    },
    {
      theme: "legal-souzoku-zei",
      keywords: ["相続税", "基礎控除", "小規模宅地", "souzoku-zei"],
    },
    {
      theme: "legal-inheritance",
      keywords: ["相続", "遺産", "相続登記", "souzoku", "inherit"],
    },
    {
      theme: "legal-kousho-ninshou",
      keywords: ["公証", "認証", "アポスティーユ", "翻訳", "領事", "kousho", "ninshou", "apostille"],
    },
    {
      theme: "legal-visa",
      keywords: [
        "在留", "ビザ", "査証", "帰化", "永住", "外国人", "特定技能",
        "技能実習", "育成就労", "visa", "resident", "naturalization",
      ],
    },
    {
      theme: "legal-inshoku-ryokan",
      keywords: [
        "飲食店", "旅館", "民泊", "酒類", "風俗営業", "公衆浴場", "食品衛生",
        "ryokan", "minpaku", "shurui",
      ],
    },
    {
      theme: "legal-kensetsu-unsou",
      keywords: [
        "建設業", "産廃", "産業廃棄物", "運送", "貨物", "自動車", "解体",
        "倉庫業", "介護タクシー", "kensetsu", "unso", "sanpai",
      ],
    },
    {
      theme: "legal-company",
      keywords: ["会社", "法人", "設立", "定款", "事業承継", "オフィス", "company", "corporation"],
    },
    {
      theme: "legal-subsidy",
      keywords: ["補助金", "助成金", "事業計画", "資金計画", "subsidy"],
    },
    {
      theme: "legal-kyoninka",
      keywords: [
        "許認可", "営業許可", "申請", "届出", "登録", "古物商",
        "permit", "license", "kyoka",
      ],
    },
  ],
  labor: [
    {
      theme: "labor-shogu-kaizen",
      keywords: ["処遇改善", "処遇改善加算", "ベースアップ等支援", "shogu-kaizen"],
    },
    {
      theme: "labor-mental-health",
      keywords: ["メンタル", "休職", "復職", "ストレスチェック", "不調", "mental"],
    },
    {
      theme: "labor-harassment",
      keywords: [
        "ハラスメント", "パワハラ", "セクハラ", "カスハラ", "カスタマーハラスメント",
        "相談窓口", "harassment", "pawahara", "kasuhara",
      ],
    },
    {
      theme: "labor-taishoku-kaiko",
      keywords: ["退職", "解雇", "雇止め", "内定取消", "退職代行", "懲戒", "taishoku", "kaiko"],
    },
    {
      theme: "labor-gaikokujin-koyo",
      keywords: [
        "外国人", "特定技能", "技能実習", "育成就労", "在留資格", "留学生",
        "社会保障協定", "gaikokujin", "foreign-worker", "ryugakusei",
      ],
    },
    {
      theme: "labor-shogai-nenkin",
      keywords: ["障害年金", "老齢", "年金", "nenkin", "disability-pension"],
    },
    {
      theme: "labor-shugyo-kisoku",
      keywords: ["就業規則", "労使協定", "服務", "規程", "shugyokisoku"],
    },
    {
      theme: "labor-roudou-jikan",
      keywords: [
        "労働時間", "36協定", "残業", "割増", "変形労働", "フレックス",
        "有給", "裁量労働", "勤務間インターバル", "roudou-jikan", "zangyo",
      ],
    },
    {
      theme: "labor-roudou-jouken",
      keywords: ["労働条件", "雇用契約", "求人", "明示", "roudou-joken", "kyujin"],
    },
    {
      theme: "labor-kyuyo-keisan",
      keywords: [
        "給与計算", "標準報酬", "年末調整", "賃金台帳", "賃金", "給与",
        "最低賃金", "freee", "kyuyo", "payroll", "chingin",
      ],
    },
    {
      theme: "labor-koyou-hoken",
      keywords: [
        "雇用保険", "労働保険", "労災", "傷病手当", "年度更新",
        "koyohoken", "rousai", "roudouhoken",
      ],
    },
    {
      theme: "labor-shakai-hoken",
      keywords: [
        "社会保険", "適用拡大", "106万", "130万", "扶養", "健康保険",
        "shakaihoken", "tekiyo",
      ],
    },
    {
      theme: "labor-saiyo",
      keywords: ["採用", "面接", "定着", "内定", "saiyo", "recruit"],
    },
    {
      theme: "labor-kaigo-roumu",
      keywords: [
        "介護", "障害福祉", "福祉", "訪問看護", "放課後等デイ", "就労支援",
        "保育", "kaigo", "welfare", "care-worker",
      ],
    },
    {
      theme: "labor-joseikin",
      keywords: [
        "助成金", "業際", "顧問", "誰に頼む", "料金",
        "joseikin", "subsidy", "gyosai",
      ],
    },
    {
      theme: "labor-gaibu-kansanin",
      keywords: [
        "外部監査", "監査人", "帳簿", "勤怠", "労務監査",
        "gaibu-kansa", "external-audit", "choubo",
      ],
    },
    {
      theme: "labor-jinin-kijun-roumu",
      keywords: ["人員基準", "常勤換算", "シフト", "配置", "jinin", "kijun"],
    },
  ],
};

// フォールバックは「その事業のどの記事に付いても不自然でない汎用の絵」を選ぶ。
// 2026-09-24：社労士は labor-jinin-kijun-roumu（シフト表＝人員基準の専用画像）が
// 既定だったため、一致しなかった記事にシフト表が付いていた。
// 汎用の labor-top（事務所と書類）へ変更し、シフト表は人員基準のルール専用に戻した。
const DEFAULT_THEME: Record<BusinessKey, IllustrationTheme> = {
  realestate: "realestate-toushi",
  legal: "legal-top",
  labor: "labor-top",
};

const SLUG_OVERRIDES: Partial<Record<BusinessKey, Record<string, IllustrationTheme>>> = {};

function normalizeOgImage(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("//")) return undefined;
  if (trimmed.startsWith("/")) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^(?:javascript|data):/i.test(trimmed)) return undefined;
  return `/${trimmed.replace(/^public\//, "")}`;
}

function searchableText(column: ColumnIllustrationInput): string {
  return [column.slug, column.title, column.category, ...(column.tags ?? [])]
    .join(" ")
    .normalize("NFKC")
    .toLowerCase();
}

function resolvedTheme(
  theme: IllustrationTheme,
  source: Exclude<ColumnIllustrationSource, "ogImage">,
): ResolvedColumnIllustration {
  return { src: ILLUSTRATIONS[theme].src, theme, source };
}

export function resolveColumnIllustration(
  column: ColumnIllustrationInput,
): ResolvedColumnIllustration {
  const ogImage = normalizeOgImage(column.ogImage);
  if (ogImage) return { src: ogImage, theme: "article", source: "ogImage" };

  const override = SLUG_OVERRIDES[column.business]?.[column.slug];
  if (override) return resolvedTheme(override, "slug");

  const haystack = searchableText(column);
  const rule = THEME_RULES[column.business].find(({ keywords }) =>
    keywords.some((keyword) => haystack.includes(keyword.toLowerCase())),
  );
  if (rule) return resolvedTheme(rule.theme, "theme");

  return resolvedTheme(DEFAULT_THEME[column.business], "fallback");
}

const ARTICLE_ALT_PREFIX: Record<LangCode, (title: string) => string> = {
  ja: (title) => `「${title}」に関する記事画像`,
  en: (title) => `Article image for “${title}”`,
  "zh-tw": (title) => `「${title}」的文章圖片`,
  zh: (title) => `“${title}”的文章图片`,
};

export function getColumnIllustrationAlt(
  illustration: ResolvedColumnIllustration,
  locale: LangCode,
  localizedTitle: string,
): string {
  if (illustration.source === "ogImage") return ARTICLE_ALT_PREFIX[locale](localizedTitle);
  return ILLUSTRATIONS[illustration.theme as IllustrationTheme].alt[locale];
}

export function getColumnIllustrationAssetPaths(): string[] {
  return [...new Set(Object.values(ILLUSTRATIONS).map(({ src }) => src))];
}

/**
 * どのルールからも到達できないテーマを返す。正常時は空配列。
 *
 * 2026-09-24：新規34点を ILLUSTRATIONS とは別の配列に登録したまま THEME_RULES を
 * 更新しなかったため、画像もaltも揃っているのに1点も表示されない状態になっていた
 * （54点中15点しか使われず、1画像あたり最大67記事に集中）。
 * ファイルの存在確認だけでは検出できないので、経路の有無をテストで担保する。
 */
export function getUnreachableIllustrationThemes(): string[] {
  const routed = new Set<string>(Object.values(DEFAULT_THEME));
  for (const rules of Object.values(THEME_RULES)) {
    for (const { theme } of rules) routed.add(theme);
  }
  for (const overrides of Object.values(SLUG_OVERRIDES)) {
    for (const theme of Object.values(overrides ?? {})) routed.add(theme);
  }
  return Object.keys(ILLUSTRATIONS).filter((theme) => !routed.has(theme));
}
