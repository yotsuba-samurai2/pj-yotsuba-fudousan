/**
 * 新規コラム「非居住者が東京の不動産を買ったら、20日以内に外為法の報告」のDB投入用データ。
 *
 * 原稿＝2026-08-12 作成（工商時報2026-07-22の報道を起点に、数値はすべて一次資料へ差し替え済み）。
 * status="draft" で投入し、浦松が確認のうえ管理画面から公開する。
 *
 * 参照元: /admin/columns/seed-hikyojusha-gaitameho
 * 既存slugがある場合は既存statusを引き継ぐ（seed-leaving-japan と同じ事故防止措置）。
 *
 * 【役割分担（luck428-column-seo 第2条・第6条）】
 *  ・本記事＝非居住者が「買った側」の届出（取得後20日以内の外為法報告）
 *  ・/column/overseas-owners-guide-japan-real-estate-sale＝「売る側」（源泉徴収・譲渡所得・売却方法）
 *  ・/kaigai-owner＝出国する日本人が持ち家を「貸す・持ち続ける」
 *  サイトマップ実測（2026-08-12）の結果、買主側を主語にしたページは存在しなかったため新規作成とした。
 *
 * 【一次資料】
 *  ・Knight Frank "The Wealth Report 2026"（第20版・2026-04-23）PIRI 100
 *  ・国土交通省「不動産登記情報を活用した新築マンションの取引の調査結果」（令和7年11月25日）
 *  ・財務省「外為法に基づく本邦にある不動産等の取得に関する報告書の提出」（令和8年6月）
 *  ・外国為替及び外国貿易法第71条第3号（e-Gov法令検索で条文本体を確認）
 *
 * 【翻訳】未投入。日本語版の公開後、繁体字→英語→簡体字の順で追加する。
 *  translations が空のあいだ /en/ /zh-tw/ /zh/ は404を返すが、これは正しい状態
 *  （luck428-column-seo 第10条1）。
 */

import type { ColumnInput } from "@/lib/column-shared";

export const HIKYOJUSHA_GAITAMEHO_COLUMN: ColumnInput[] = [
  {
    business: "realestate",
    slug: "hikyojusha-fudosan-shutoku-gaitameho-houkoku",
    status: "draft",
    title:
      "非居住者が東京の不動産を買ったら、20日以内に外為法の報告 ─ 2026年4月から「目的を問わず」対象に",
    date: "2026-08-12",
    category: "海外オーナー向け",
    excerpt:
      "海外に住んだまま日本の不動産を取得した非居住者は、取得後20日以内に日本銀行経由で財務大臣へ報告書を提出します。2026年4月1日以降の取得は、居住用か投資用かを問わず不動産そのものが報告対象になり、他の非居住者から取得した場合の免除も廃止されました。報告事項には不動産番号が加わり、登記完了と20日の期限との逆算が要ります。あわせて、ナイト・フランク『The Wealth Report 2026』の東京＋58.5％（世界1位）と、国土交通省が登記情報から集計した東京23区の国外住所者取得308件・うち台湾192件という二つの一次データを並べ、「台湾が最多の買い手」と「東京都全体では3.0％」を同時に押さえます。宅建士・行政書士の浦松丈二が解説します。文京区小日向・茗荷谷駅徒歩5分。",
    author: {
      name: "浦松 丈二",
      title: "行政書士・宅建士・元毎日新聞中国総局長",
    },
    keywords: [
      "非居住者 不動産 取得",
      "外為法 報告 20日",
      "本邦にある不動産の取得に関する報告書",
      "外為法 2026年4月 改正",
      "非居住者 マンション 購入 東京",
      "台湾 東京 マンション",
      "国土交通省 新築マンション 国外居住者",
      "不動産番号 外為法",
      "納税管理人 非居住者",
      "源泉徴収 10.21%",
    ],
    tags: [
      "非居住者",
      "外為法",
      "東京23区",
      "台湾",
      "新築マンション",
      "国土交通省",
      "納税管理人",
      "都心6区",
      "四葉不動産",
    ],
    faq: [],
    locales: [],
    translations: {
          "zh-tw": {
                "title": "非居住者在東京買了不動產，20日內要向外為法申報 ─ 2026年4月起「不問目的」都納入對象",
                "excerpt": "人住在海外、以非居住者身分取得日本不動產的人，必須在取得後20日內透過日本銀行向財務大臣提出申報書。2026年4月1日以後的取得，不論自住用或投資用，不動產本身都成為申報對象，自其他非居住者取得時的免除也已廢除。申報事項新增了不動產號碼，必須把登記完成與20日期限一起往回推算。本文並列兩份一手資料——萊坊《The Wealth Report 2026》的東京＋58.5％（全球第1）與日本國土交通省依登記資訊統計的東京23區國外住所者取得308件、其中台灣192件——同時掌握「台灣是最大買家」與「東京都整體為3.0％」。由宅建士・行政書士浦松丈二解說。文京區小日向・茗荷谷站步行5分鐘。",
                "content": "人住在海外、以非居住者身分取得日本不動產的人，必須在取得後20日內，透過日本銀行向財務大臣提出「本邦にある不動産又はこれに関する権利の取得に関する報告書」（位於日本國內的不動產或其相關權利之取得申報書）。2026年4月1日以後的取得，不論是自住用還是投資用，不動產本身都成為申報對象。金額與面積的大小都不影響。\n\n本頁整理的是**人住在日本以外、買下東京不動產的人（非居住者的買方），在交屋之後要提出什麼**。內容集中在買方這一側。已經持有的物件要**出售**時的說明（源泉徵收10.21％、讓渡所得、出售方式的選擇）請看[海外屋主的日本不動產出售指南](https://luck428.com/column/overseas-owners-guide-japan-real-estate-sale)；離開日本後把自宅**出租、繼續持有**的說明，請看[人住在海外，日本的房子該怎麼辦](https://luck428.com/kaigai-owner)。\n\n最後更新：2026年8月12日\n\n## 東京的高級住宅，實際上漲了多少？\n\n萊坊（Knight Frank）於2026年4月公布的《The Wealth Report 2026（第20版）》中的 Prime International Residential Index（PIRI 100）顯示，2025年全球高級住宅價格平均上漲3.2％，所追蹤的100個市場中有73個上漲、24個下跌。\n\n> **萊坊（Knight Frank／日文稱「ナイト・フランク」）是什麼**\n>\n> 1896年在倫敦創立、總部設於英國的獨立（非上市）不動產顧問公司。依該公司公布的資料，在全球50多個市場設有約600個據點，2萬名以上員工從事住宅與商用不動產的買賣仲介、估價、投資建議等業務。日本也設有據點。\n>\n> 《The Wealth Report》是該公司自2007年起每年發布的富裕階層與不動產年度報告，2026年版為第20版。其核心是 **PIRI 100**（Prime International Residential Index），追蹤全球100個高級住宅市場的價格變動。這裡所說的「高級住宅（prime property）」，依該報告的定義是指**該市場中價值位居前5％的住宅**。這不是市場整體的平均，而是觀察金字塔頂端的指數——讀數字時不能漏掉這一點。\n>\n> 另外，這是民間企業彙整自家各國研究團隊資料所做的獨自調查，並非政府統計。與下一章要談的日本國土交通省調查（依登記資訊所做的全面性統計）性質不同，兩者並列著看才符合實務。\n\n其中，**東京12個月上漲58.5％，在100個市場中排名第1**。該報告指出，推升東京新成屋公寓市場的因素包括供給稀少、低利率，以及來自亞太地區的旺盛流入需求。\n\n| 排名 | 市場 | 2025年變化率 |\n|---|---|---|\n| 1 | 東京 | ＋58.5％ |\n| 2 | 杜拜 | ＋25.1％ |\n| 3 | 馬尼拉 | ＋17.5％ |\n| 4 | 首爾 | ＋14.7％ |\n| 5 | 布拉格 | ＋14.6％ |\n| … | | |\n| 13 | 新加坡 | ＋7.9％ |\n| 89 | 香港 | －2.1％ |\n| 94 | 北京 | －4.9％ |\n| 95 | 上海 | －5.0％ |\n| 98 | 深圳 | －7.2％ |\n| 100 | 廣州 | －12.2％ |\n\n以5年（2020年→2025年）來看，漲幅第一是杜拜的193.9％，**東京以159.3％排名第2**。\n\n該報告同時公布了「100萬美元能買到的面積」。從2020年到2025年，**東京縮水了41％**（杜拜－66％、邁阿密－40％、洛杉磯－28％）。同樣的預算能買到的面積在5年內少了4成，這個數字說明**「東京很便宜」這個前提本身，在這5年間正在崩解**。\n\n## 東京的新成屋公寓，有多少是從海外買走的？\n\n這裡不是推估，而是有依登記所做的政府統計。日本國土交通省於2025年11月25日公布的「不動產登記資訊活用之新成屋公寓交易調查結果」。該調查以法務省提供的不動產登記資訊為基礎，對象是2018年1月至2025年6月間辦妥保存登記、位於三大都市圈與地方四市的新成屋公寓約55萬戶。\n\n**住所在國外者取得新成屋公寓的比例（2025年1〜6月）**\n\n| 地區 | 比例 |\n|---|---|\n| 東京圈 | 1.9％ |\n| 東京都 | 3.0％ |\n| 東京23區 | 3.5％ |\n| 都心6區（千代田・中央・港・新宿・文京・澀谷） | 7.5％ |\n| 其中 新宿區 | 14.6％ |\n| 其中 澀谷區 | 8.1％ |\n| 其中 千代田區 | 7.7％ |\n| 其中 文京區 | 5.0％ |\n| 其中 港區 | 4.3％ |\n\n越接近市中心比例越高，都心6區為7.5％。不過該調查明確指出，這個數字會因當年供給了什麼樣的物件而大幅變動。\n\n**在東京23區取得新成屋公寓的「住所在國外者」依國家・地區別（2025年1〜6月）**\n\n| 國家・地區 | 登記件數 |\n|---|---|\n| 台灣 | 192件 |\n| 中國 | 30件 |\n| 新加坡 | 21件 |\n| 其他（香港・英國・美國等） | 65件 |\n| **合計** | **308件** |\n\n該調查指出，疫情之前就以中國、香港、台灣為多，**最近則以台灣最多**。台灣在308件中占192件，超過6成。\n\n**閱讀時不能漏掉的3點**\n\n1. **這不是「外國人」的統計。** 該調查是依不動產登記的所有權人住所欄位在國內或國外來分類。登記不需登錄國籍，因此住在日本的外國人、或海外法人的日本分公司所取得的部分，並未計入這個數字。\n2. **看不出偏重高價物件的傾向。** 都心6區依價格帶區分，住所在國外者的購買比例，未滿2億日圓為3.2％、2億日圓以上為3.8％。\n3. **短期買賣的主角在國內。** 東京23區的短期買賣（保存登記後1年內的移轉登記）當中，住所在國外者所為者在2024年1〜6月為17件，占短期買賣整體的1.3％。都心6區裡，2億日圓以上物件的短期買賣，國外部分為0戶。\n\n也就是說，**「台灣是最大買家」是事實，但就東京都整體而言，來自國外的取得是3.0％**——這兩件事必須同時掌握。\n\n## 台灣方面怎麼看這個現象？\n\n台灣的經濟報紙工商時報在2026年7月22日的報導（記者：蔡惠芳）中，把這個動向放在台灣資金海外分散的脈絡裡。該報的觀察大致如下。\n\n- 地緣政治風險與日圓的相對弱勢，正在加速台灣富裕階層的海外資產配置\n- 除日本之外，新加坡作為分散標的的份量也在增加，圍繞台灣高資產客戶，台灣與新加坡雙方的金融機構已開始在私人銀行業務上競爭\n- 台灣富裕階層的投資標的，正從單一住宅的取得，轉向住宅・商用不動產・飯店・另類資產的多元配置\n\n比起數字，「從買下單一物件，轉為資產配置」這個看法在實務上更有作用。買一戶物件，和把一部分資產長期放在日本，該先決定的事情並不相同。以下談的是後者。\n\n## 非居住者買了日本的不動產，首先要提出什麼？\n\n依外国為替及び外国貿易法（外匯及外國貿易法，簡稱外為法）所定的申報書。\n\n| 項目 | 內容 |\n|---|---|\n| 文件名稱 | 本邦にある不動産又はこれに関する権利の取得に関する報告書（樣式第22） |\n| 申報義務人 | 取得的非居住者 |\n| 期限 | 取得後20日內 |\n| 提交對象 | 透過日本銀行向財務大臣 |\n| 金額門檻 | 無（不問金額・面積大小都必須申報） |\n| 提交方式 | 書面或線上系統 |\n\n所謂「非居住者」，是指在日本國內有住所或居所的個人、在日本國內設有主要事務所的法人（含外國法人的日本國內分公司）＝居住者，以外的人。人住在台灣而買下東京的公寓，就是這項申報的對象。\n\n未申報或為虛偽申報的罰則是**6個月以下拘禁刑或50萬日圓以下罰金**（外為法第71條第3號）。這不是行政上的秩序罰「過料」，而是**刑事罰**，這一點請務必記住。\n\n## 2026年4月1日起有什麼改變？\n\n申報的對象範圍擴大了。以取得日在2026年3月31日以前或4月1日以後來區分。\n\n| | 2026年3月31日以前的取得 | 2026年4月1日以後的取得 |\n|---|---|---|\n| 申報對象 | 以投資目的等取得者 | **不問目的**而取得者 |\n| 不需申報的例子 | ①本人・親屬・受僱人及其他從業人員的自住用 ②為遂行非營利目的之業務 ③本人的事務所用 ④**自其他非居住者取得者** | ①②③限於「不動產**相關權利**」（租賃權、地上權等）。**④已廢除** |\n| 樣式 | 原則上為舊樣式 | 新樣式（暫時仍可沿用舊樣式修改後使用） |\n\n實務上影響較大的是以下2點。\n\n- **即使是自住用，只要買的是不動產本身就必須申報。** 日本財務省的說明資料指出，以居住為目的取得附地上權建物的情況，建物部分屬於申報對象。「我自己要住所以不用」是很容易讀錯的地方。\n- **非居住者之間買賣的排除規定沒有了。** 從海外屋主賣給海外買方的交易，也需要申報。\n\n此外，2026年4月1日以後的取得，申報事項新增了「交易對象（居住者・非居住者）」「取得目的（自住用、投資目的等）」「不動產號碼」。**因為要求填寫不動產號碼**，會出現在登記完成前無法填寫的欄位。與20日這個期限之間的關係，必須從簽約階段就往回推算。\n\n## 誰可以提出申報？可以委託仲介業者嗎？\n\n日本財務省表示，申報書的製作與提出，除了取得人本人（非居住者）之外，**由居住者身分的代理人（不動產仲介業者等）提出也可以**。代理提出時建議使用線上系統。\n\n四葉不動產株式會社以宅地建物取引業者（日本的不動產交易業者）身分承辦買賣仲介；需要製作向行政機關提出的文件時，由併設的四葉行政書士事務所以**另行簽訂的契約**承接（行政書士為日本辦理向行政機關提出文件等業務的專業資格）。兩者是各自獨立的事業體，契約與費用都分開。彼此不收受介紹費。所有權移轉登記請直接委託司法書士（日本辦理登記等業務的專業資格），確定申告與納稅請直接委託稅理士（日本的稅務專業資格）。\n\n## 沒有印鑑證明的買方，要怎麼簽約與登記？\n\n日本的印鑑登錄制度，是以在日本有住民登錄的人為前提。人住在國外的買方，必須以居住國的公證或駐外館處的證明等文件，來代替印鑑證明書。台灣的實務請看[台灣的印鑑證明與遺產分割協議書](https://luck428.com/legal/column/taiwan-inkan-shomei-isan-bunkatsu)；在日本國內有住民登錄的外國人，請看[外國人的印鑑登錄能當天完成嗎](https://luck428.com/column/gaikokujin-inkan-touroku-sokujitsu)。哪一種文件可以使用，由負責登記的司法書士判斷，因此**文件的準備請從交屋日往回推算、及早開始**比較安全。\n\n## 買了之後，日本這邊的窗口由誰擔任？\n\n在日本沒有住所卻持有不動產，會出現收不到的文件。固定資產稅的納稅通知、管理委員會的通知、確定申告的通知等等。需要事先決定的項目如下。\n\n| 要決定的事 | 補充 |\n|---|---|\n| 納稅管理人 | 指定在日本國內有住所等的人，並向稅務署申報。申報書的製作與確定申告請直接委託稅理士 |\n| 是否出租 | 出租時，若承租人為法人等，租金會被源泉徵收20.42％（[詳細](https://luck428.com/kaigai-owner)） |\n| 郵件・聯絡方式 | 確保日本國內的收件處 |\n| 建物的管理 | 空置時的巡查、通風、郵件確認 |\n\n## 將來要賣的時候，現在該先知道什麼？\n\n賣方以非居住者身分出售日本的不動產時，**買方**會產生源泉徵收義務。買方須自讓渡對價中扣除10.21％（所得稅10％＋復興特別所得稅0.21％）並繳納，賣方再以確定申告結算。\n\n例外是買方為個人、且是為自己或親屬自住而取得，並且讓渡對價在1億日圓以下的情況。買方若為法人，則不論金額都需要源泉徵收。\n\n也就是說，**以非居住者身分繼續持有，賣的時候買方會多一道手續**。當出售進入視野時，最好把居住者・非居住者的判定在哪個時點進行一併整理清楚；判定與交屋日的關係整理在[非居住者的判定是以交屋日決定的嗎](https://luck428.com/column/hikyojusha-hantei-hikiwatashi-bi)。個別稅額的判斷屬於稅理士的領域。\n\n## 找四葉不動產諮詢，可以承辦到什麼程度？\n\n四葉不動產株式會社（東京都文京區小日向・茗荷谷站步行5分鐘）承辦投資用・事業用不動產，以及以外語進行的物件諮詢。可以用中文（繁體字・簡體字）溝通。\n\n- 物件的調查・提案・買賣仲介 —— 四葉不動產株式會社（宅地建物取引業）\n- 向行政機關提出之文件的製作 —— 四葉行政書士事務所（**另行簽約**）\n- 登記 —— 請直接委託司法書士\n- 稅務申告・納稅管理人申報書 —— 請直接委託稅理士\n- 具有紛爭性的案件 —— 請直接委託律師\n\n各項均以獨立的事業體、獨立的契約承接，本公司與本事務所不收取任何介紹費。\n\n投資用・事業用不動產的整體說明請看[投資用・事業用不動產](https://luck428.com/toushi)，中文諮詢請看[中文對應](https://luck428.com/global/chinese)，與台灣有關的繼承請看[台灣跨境繼承](https://luck428.com/souzoku/taiwan)。\n\n## 本文的依據\n\n**高級住宅價格（一手資料）**\n\n- Knight Frank《The Wealth Report 2026》第20版（2026年4月23日公布）、Prime International Residential Index（PIRI 100）\n  全球平均＋3.2％／100個市場中73個上漲・24個下跌／東京＋58.5％（第1名）／5年間杜拜＋193.9％・東京＋159.3％／100萬美元購買力的5年變化（杜拜－66％、東京－41％、邁阿密－40％、洛杉磯－28％）\n  https://www.knightfrank.com/research/article/2026/4/piri-100-ultimate-prime-residential-property-index\n- 該公司概要（1896年於倫敦創立、獨立經營、50多個市場・約600據點・2萬人以上）依該公司官方網站\n  https://www.knightfrank.com/about-us\n- 「prime property＝各市場中價值前5％」的定義依《The Wealth Report 2026》的用語定義頁\n\n**來自國外的新成屋公寓取得（一手資料）**\n\n- 日本國土交通省「公布不動產登記資訊活用之新成屋公寓交易調查結果——三大都市圈及地方四市的短期買賣與國外居住者取得狀況」（令和7年11月25日）及附件「不動產登記資訊活用之新成屋公寓交易實態的調查・分析」\n  調查對象＝2018年1月〜2025年6月辦妥保存登記的新成屋公寓約55萬戶／2025年1〜6月住所在國外者的取得比例（東京都3.0％・東京23區3.5％・都心6區7.5％・新宿區14.6％）／東京23區依國家・地區別的登記件數（台灣192件、中國30件、新加坡21件、合計308件）／都心6區依價格帶的購買比例（未滿2億日圓3.2％、2億日圓以上3.8％）／東京23區短期買賣中住所在國外者於2024年1〜6月為17件・占整體1.3％\n  https://www.mlit.go.jp/report/press/tochi_fudousan_kensetsugyo05_hh_000001_00237.html\n\n**台灣方面的分析與評論**\n\n- 工商時報「台灣富豪瘋買海外不動產！東京豪宅5年狂飆159％ 台灣人躍最大外國買家」（記者：蔡惠芳、2026年7月22日）\n  本文僅引用該報獨自提出的「台灣資金海外分散」「與新加坡並立」「從單一住宅轉向多元配置」等觀察。價格與戶數的數值並非透過該報，而是取自上述一手資料。\n  https://www.ctee.com.tw/news/20260722702000-430601\n\n**制度的依據**\n\n- 外国為替及び外国貿易法第55條之3第1項第12號、外国為替令第18條之5、外国為替の取引等の報告に関する省令第12條 —— 非居住者取得日本國內不動產等的申報\n- 外国為替の取引等の報告に関する省令之修正（2026年2月20日公布・2026年4月1日施行）—— 申報對象擴大為「不問目的」，申報事項新增交易對象・取得目的・不動產號碼\n- 外国為替及び外国貿易法第71條第3號 —— 未依第55條之3第1項申報或為虛偽申報時的罰則（6個月以下拘禁刑或50萬日圓以下罰金）\n- 日本財務省「依外為法提出『本邦にある不動産又はこれに関する権利の取得に関する報告書』」（令和8年6月）\n  https://www.mof.go.jp/policy/international_policy/gaitame_kawase/real_property/\n- 所得税法第161條、第164條、第212條、第213條、所得税法施行令第281條之3、復興財源確保法第8條・第9條・第10條・第28條 —— 向非居住者等購買土地等時的10.21％源泉徵收（日本國稅廳 Tax Answer No.2879）\n- 日本國稅廳 Tax Answer No.1932「海外派駐期間出售不動產的情況」—— 1億日圓以下且買方為自己・親屬自住用時不需源泉徵收、納稅管理人的申報\n\n**未查證事項**\n\n- 工商時報所報導的台北2025年漲幅（＋0.1％）及該報所示的排名，在萊坊的公開部分無法確認，因此本文未予採用。\n\n本文為一般性的資訊提供，並非針對個別案件的法律判斷或稅務判斷。依個別情況而異的處理方式，需經有資格者確認。稅務請委託稅理士，登記請委託司法書士，具有紛爭性的案件請委託律師，均請直接簽約。\n\n**本文作者** [浦松 丈二](https://luck428.com/about/uramatsu)｜四葉不動產株式會社 代表取締役・專任宅地建物取引士。行政書士。前每日新聞中國總局長（記者資歷34年）。曾以中國總局長的身分常駐中國、台灣、泰國。社會保險勞務士考試合格（預定2026年9月開業）。\n\n## 相關連結\n\n- [投資用・事業用不動產](https://luck428.com/toushi)\n- [海外屋主的日本不動產出售指南（出售方）](https://luck428.com/column/overseas-owners-guide-japan-real-estate-sale)\n- [人住在海外，日本的房子該怎麼辦（出租・繼續持有）](https://luck428.com/kaigai-owner)\n- [中文對應](https://luck428.com/global/chinese)\n- [聯絡我們](https://luck428.com/contact)"
          },
          "en": {
                "title": "Bought property in Tokyo as a non-resident? You have 20 days to file under FEFTA — and from April 2026 purpose no longer matters",
                "excerpt": "A non-resident who acquires real estate in Japan must file a report with the Minister of Finance through the Bank of Japan within 20 days. For acquisitions from 1 April 2026 the real estate itself is reportable regardless of whether it was bought to live in or as an investment, and the exemption for acquisitions from another non-resident has been abolished. The property registration number is now a reportable item, so the registration and the 20-day deadline have to be worked backwards together. The article sets two primary sources side by side — Tokyo up 58.5% (first worldwide) in Knight Frank's The Wealth Report 2026, and MLIT's registry-based count of 308 acquisitions in the 23 wards of Tokyo by persons with an address abroad, 192 of them Taiwanese — so that both \"Taiwan is the largest source of buyers\" and \"3.0% across the Tokyo Metropolis\" are held at once. Written by Joji Uramatsu, real estate transaction specialist and administrative scrivener. Kohinata, Bunkyo-ku, five minutes from Myogadani Station.",
                "content": "If you live outside Japan and acquire real estate here as a non-resident, you must file a report with the Minister of Finance through the Bank of Japan within 20 days of the acquisition. For acquisitions made on or after 1 April 2026, the real estate itself is reportable regardless of whether you bought it to live in or as an investment. There is no threshold for price or floor area.\n\nThis page sets out **what a non-resident buyer files after completion** — someone who bought a property in Tokyo while living outside Japan. It is confined to the buyer's side. For **selling** a property you already own (10.21% withholding, capital gains, choosing how to sell), see [A guide to selling Japanese real estate for overseas owners](https://luck428.com/column/overseas-owners-guide-japan-real-estate-sale). For **letting or keeping** your home after leaving Japan, see [What to do with your home in Japan while you live overseas](https://luck428.com/kaigai-owner).\n\nLast updated: 12 August 2026\n\n## How much have prime homes in Tokyo actually risen?\n\nAccording to the Prime International Residential Index (PIRI 100) in Knight Frank's *The Wealth Report 2026* (20th edition), published in April 2026, prime residential prices worldwide rose by an average of 3.2% in 2025. Of the 100 markets tracked, 73 rose and 24 fell.\n\n> **What Knight Frank is**\n>\n> An independent (unlisted) property consultancy founded in London in 1896 and headquartered in the United Kingdom. According to the firm, it operates around 600 offices across more than 50 markets, with over 20,000 people working in residential and commercial agency, valuation and investment advisory. It has a presence in Japan.\n>\n> *The Wealth Report* has been published annually since 2007 and covers wealth and property; the 2026 edition is the 20th. At its core is **PIRI 100** (the Prime International Residential Index), which tracks price movements in 100 prime residential markets worldwide. \"Prime property\" is defined in the report as **the top 5% of the housing market by value** in each location. This is not an average of the whole market but a measure of the top slice — a point you cannot skip when reading the numbers.\n>\n> Note also that this is proprietary research compiled by a private firm from its own country research teams. It is not government statistics. It differs in character from the Japanese government survey discussed in the next section, which is a comprehensive tabulation based on registry data, so the practical approach is to read the two side by side.\n\nWithin that index, **Tokyo rose 58.5% over twelve months, ranking first of the 100 markets**. The report attributes the strength of Tokyo's new-build apartment market to scarcity of supply, low interest rates, and strong inward demand from the Asia-Pacific region.\n\n| Rank | Market | Change in 2025 |\n|---|---|---|\n| 1 | Tokyo | +58.5% |\n| 2 | Dubai | +25.1% |\n| 3 | Manila | +17.5% |\n| 4 | Seoul | +14.7% |\n| 5 | Prague | +14.6% |\n| … | | |\n| 13 | Singapore | +7.9% |\n| 89 | Hong Kong | -2.1% |\n| 94 | Beijing | -4.9% |\n| 95 | Shanghai | -5.0% |\n| 98 | Shenzhen | -7.2% |\n| 100 | Guangzhou | -12.2% |\n\nOver five years (2020 to 2025), Dubai leads at 193.9%, with **Tokyo second at 159.3%**.\n\nThe report also publishes how much space one million US dollars buys. Between 2020 and 2025, **Tokyo shrank by 41%** (Dubai -66%, Miami -40%, Los Angeles -28%). The area the same budget buys has fallen by four-tenths in five years — a figure showing that **the premise that \"Tokyo is cheap\" has itself been eroding over these five years**.\n\n## How much of Tokyo's new-build apartment stock is bought from abroad?\n\nHere there is no need to estimate: there are government statistics based on the property registry. On 25 November 2025 Japan's Ministry of Land, Infrastructure, Transport and Tourism (MLIT) published its survey of new-build apartment transactions using property registration data. Working from registry information received from the Ministry of Justice, it covers roughly 550,000 new-build apartments in the three major metropolitan areas and four regional cities for which preservation registration was completed between January 2018 and June 2025.\n\n**Share of new-build apartments acquired by persons with an address outside Japan (January–June 2025)**\n\n| Area | Share |\n|---|---|\n| Greater Tokyo | 1.9% |\n| Tokyo Metropolis | 3.0% |\n| The 23 wards of Tokyo | 3.5% |\n| The six central wards (Chiyoda, Chuo, Minato, Shinjuku, Bunkyo, Shibuya) | 7.5% |\n| of which Shinjuku | 14.6% |\n| of which Shibuya | 8.1% |\n| of which Chiyoda | 7.7% |\n| of which Bunkyo | 5.0% |\n| of which Minato | 4.3% |\n\nThe share rises the closer you get to the centre, reaching 7.5% in the six central wards. The survey states expressly, however, that the figure swings considerably depending on what kind of apartments were supplied in a given year.\n\n**New-build apartments in the 23 wards acquired by persons with an address outside Japan, by country and region (January–June 2025)**\n\n| Country / region | Registrations |\n|---|---|\n| Taiwan | 192 |\n| China | 30 |\n| Singapore | 21 |\n| Others (Hong Kong, UK, US and so on) | 65 |\n| **Total** | **308** |\n\nThe survey notes that China, Hong Kong and Taiwan were already prominent before the pandemic, and that **Taiwan has recently become the largest source**. Taiwan accounts for 192 of the 308 registrations, more than 60%.\n\n**Three things you cannot leave out when reading this**\n\n1. **These are not statistics about foreign nationals.** The survey classifies by whether the address in the owner's field of the property registry is inside or outside Japan. Nationality is not recorded in the registry, so acquisitions by foreign nationals resident in Japan, or by the Japanese branches of overseas companies, are not captured in these figures.\n2. **There is no visible skew towards expensive property.** Broken down by price in the six central wards, the share acquired by persons with an address outside Japan is 3.2% below 200 million yen and 3.8% at 200 million yen and above.\n3. **Short-term trading is domestic.** Of short-term trades in the 23 wards (transfer registration within a year of preservation registration), those by persons with an address outside Japan numbered 17 in January–June 2024, or 1.3% of all short-term trades. In the six central wards, short-term trades of property at 200 million yen and above included none from outside Japan.\n\nIn other words, two things have to be held at once: **it is true that Taiwan is the largest source of buyers, and acquisitions from outside Japan account for 3.0% of the Tokyo Metropolis as a whole.**\n\n## How is this seen from Taiwan?\n\nThe Taiwanese business daily Commercial Times, in an article of 22 July 2026 by the reporter Tsai Hui-fang, places this movement in the context of Taiwanese capital diversifying overseas. The paper's reading runs broadly as follows.\n\n- Geopolitical risk and the relative weakness of the yen are accelerating overseas asset allocation by wealthy Taiwanese\n- Alongside Japan, Singapore is gaining weight as a destination, and financial institutions in both Taiwan and Singapore have begun competing in private banking for high-net-worth Taiwanese clients\n- The investment focus of wealthy Taiwanese is shifting from acquiring a single home to a diversified allocation across residential property, commercial property, hotels and alternative assets\n\nRather than the numbers, it is this reading — from buying one property to allocating assets — that matters in practice. Buying a single unit and keeping part of your wealth in Japan call for different decisions. What follows concerns the latter.\n\n## What does a non-resident file first after buying property in Japan?\n\nA report under the Foreign Exchange and Foreign Trade Act (*Gaitame-ho*, FEFTA).\n\n| Item | Details |\n|---|---|\n| Name of the form | Report on the acquisition of real estate in Japan or rights relating thereto (Form 22) |\n| Who must file | The non-resident who acquired the property |\n| Deadline | Within 20 days of acquisition |\n| Where to file | The Minister of Finance, via the Bank of Japan |\n| Monetary threshold | None (required regardless of price or floor area) |\n| How to file | On paper, or through the online system |\n\nA \"non-resident\" means anyone other than a resident, a resident being an individual with an address or place of residence in Japan, or a corporation with its principal office in Japan (including the Japanese branch of a foreign company). If you buy an apartment in Tokyo while living in Taiwan, you fall within this reporting requirement.\n\nFailing to file, or filing a false report, carries **imprisonment for up to six months or a fine of up to 500,000 yen** (FEFTA, Article 71, item 3). Note that this is a **criminal penalty**, not an administrative fine (*karyo*) of the kind imposed as an order-maintaining sanction.\n\n## What changed on 1 April 2026?\n\nThe scope of the reporting requirement widened. Treatment differs according to whether the acquisition date falls on or before 31 March 2026, or on or after 1 April 2026.\n\n| | Acquired on or before 31 March 2026 | Acquired on or after 1 April 2026 |\n|---|---|---|\n| What is reportable | Property acquired for investment and similar purposes | Property acquired **regardless of purpose** |\n| Examples of exemptions | (1) Residential use by the person, a relative, an employee or other staff (2) For carrying on non-profit business (3) The person's own office (4) **Acquired from another non-resident** | (1) to (3) are confined to **rights relating to** real estate (leasehold, land lease rights and so on). **(4) has been abolished** |\n| Form | The old form as a rule | The new form (the old form may be amended and used for the time being) |\n\nTwo consequences matter most in practice.\n\n- **Even for residential use, buying the real estate itself is reportable.** The Ministry of Finance's guidance indicates that where a building on leased land is acquired for residential purposes, the building itself falls within the reporting requirement. \"I am going to live in it, so I do not need to file\" is an easy misreading.\n- **The exclusion for sales between non-residents is gone.** A transaction from an overseas owner to an overseas buyer now requires a report.\n\nIn addition, for acquisitions from 1 April 2026 the reportable items now include the counterparty (resident or non-resident), the purpose of acquisition (residential, investment and so on), and the **property registration number**. Because the registration number is required, part of the form cannot be completed until the registration itself is done. That has to be worked backwards against the 20-day deadline from the contract stage onwards.\n\n## Who can file it? Can I ask the agent?\n\nThe Ministry of Finance states that the report may be prepared and filed by the acquiring non-resident, or **by an agent who is a resident of Japan, such as the real estate agent**. Where an agent files, use of the online system is recommended.\n\nYotsuba Real Estate Co., Ltd. acts as broker on the sale and purchase in its capacity as a real estate brokerage business. Where documents have to be prepared for submission to a government office, the affiliated Yotsuba Administrative Scrivener Office (*gyosei-shoshi* — the Japanese qualification for preparing documents submitted to public authorities) takes that on **under a separate contract**. The two are independent businesses with separate contracts and separate fees, and no referral fees pass between them. Registration of transfer of ownership goes to a judicial scrivener (*shiho-shoshi*), and tax returns and payment to a licensed tax accountant (*zeirishi*), in each case under a contract you enter into directly.\n\n## How does a buyer with no Japanese seal certificate sign and register?\n\nJapan's seal registration system assumes you have a residence record here. A buyer living outside Japan puts together documents such as a notarisation in the country of residence, or a certificate from a Japanese embassy or consulate, in place of a seal certificate. For how this works in Taiwan, see [Taiwanese seal certificates and estate division agreements](https://luck428.com/legal/column/taiwan-inkan-shomei-isan-bunkatsu); for foreign nationals with a residence record in Japan, see [Can a foreign national register a seal the same day?](https://luck428.com/column/gaikokujin-inkan-touroku-sokujitsu). Which documents will be accepted is for the judicial scrivener handling the registration to judge, so **it is safest to work backwards from the completion date and start assembling papers early**.\n\n## Once you have bought, who is the point of contact in Japan?\n\nHolding property without an address in Japan means some documents will not reach you: the fixed asset tax notice, notices from the building management association, reminders about the tax return. The following need to be settled.\n\n| Decision | Notes |\n|---|---|\n| Tax agent (*nozei kanrinin*) | Appoint someone with an address in Japan and notify the tax office. Ask a licensed tax accountant directly to prepare the notification and file the return |\n| Whether to let the property | If you do, and the tenant is a corporation or similar, 20.42% is withheld from the rent ([details](https://luck428.com/kaigai-owner)) |\n| Post and contact details | Secure an address in Japan to receive mail |\n| Care of the building | Inspection, ventilation and checking post if it is left empty |\n\n## Is there anything to know now for when you eventually sell?\n\nIf the seller sells Japanese property while still a non-resident, the **buyer** incurs a withholding obligation. The buyer deducts and pays over 10.21% of the sale consideration (10% income tax plus 0.21% special reconstruction income tax), and the seller settles up through a tax return.\n\nThe exception is where the buyer is an individual acquiring the property for their own or a relative's residential use and the consideration is 100 million yen or less. Where the buyer is a corporation, withholding is required regardless of the amount.\n\nIn short, **holding on as a non-resident means the buyer carries an extra step when you come to sell.** Once a sale comes into view, it is worth working out at what point the resident/non-resident determination is made; the relationship between that determination and the handover date is set out in [Is non-resident status determined by the handover date?](https://luck428.com/column/hikyojusha-hantei-hikiwatashi-bi). Calculating individual tax liabilities is a matter for a licensed tax accountant.\n\n## What can Yotsuba Real Estate take on?\n\nYotsuba Real Estate Co., Ltd. (Kohinata, Bunkyo-ku, Tokyo — five minutes' walk from Myogadani Station) handles investment and business-use property, and property enquiries in foreign languages. We can work in Chinese (both traditional and simplified characters).\n\n- Investigating and proposing properties, and brokerage on sale and purchase — Yotsuba Real Estate Co., Ltd. (real estate brokerage business)\n- Preparing documents for submission to government offices — Yotsuba Administrative Scrivener Office (**separate contract**)\n- Registration — directly with a judicial scrivener\n- Tax returns and the tax agent notification — directly with a licensed tax accountant\n- Contentious matters — directly with an attorney\n\nEach is taken on as an independent business under an independent contract, and neither the company nor the office receives any referral fee.\n\nFor the whole picture on investment and business-use property see [Investment and business-use real estate](https://luck428.com/toushi); for enquiries in Chinese see [Chinese language support](https://luck428.com/global/chinese); for inheritance matters involving Taiwan see [Cross-border inheritance with Taiwan](https://luck428.com/souzoku/taiwan).\n\n## What this article is based on\n\n**Prime residential prices (primary sources)**\n\n- Knight Frank, *The Wealth Report 2026*, 20th edition (published 23 April 2026), Prime International Residential Index (PIRI 100)\n  Global average +3.2% / 73 of 100 markets up and 24 down / Tokyo +58.5% (1st) / over five years Dubai +193.9% and Tokyo +159.3% / five-year change in what one million US dollars buys (Dubai -66%, Tokyo -41%, Miami -40%, Los Angeles -28%)\n  https://www.knightfrank.com/research/article/2026/4/piri-100-ultimate-prime-residential-property-index\n- The firm's profile (founded in London in 1896, independent, over 50 markets, around 600 offices, more than 20,000 people) is from its own website\n  https://www.knightfrank.com/about-us\n- The definition of prime property as the top 5% by value in each market is from the glossary of *The Wealth Report 2026*\n\n**Acquisitions of new-build apartments from outside Japan (primary source)**\n\n- Ministry of Land, Infrastructure, Transport and Tourism, \"Publication of the survey of new-build apartment transactions using property registration data — short-term trading and acquisitions by persons resident outside Japan in the three major metropolitan areas and four regional cities\" (25 November 2025), together with the annex \"Survey and analysis of new-build apartment transactions using property registration data\"\n  Scope = approximately 550,000 new-build apartments with preservation registration between January 2018 and June 2025 / share acquired by persons with an address outside Japan, January–June 2025 (Tokyo Metropolis 3.0%, the 23 wards 3.5%, the six central wards 7.5%, Shinjuku 14.6%) / registrations in the 23 wards by country and region (Taiwan 192, China 30, Singapore 21, total 308) / share by price band in the six central wards (below 200 million yen 3.2%, 200 million yen and above 3.8%) / short-term trades in the 23 wards by persons with an address outside Japan, 17 in January–June 2024, or 1.3% of the total\n  https://www.mlit.go.jp/report/press/tochi_fudousan_kensetsugyo05_hh_000001_00237.html\n\n**Analysis and commentary from Taiwan**\n\n- Commercial Times, \"Wealthy Taiwanese pile into overseas property: Tokyo prime homes up 159% in five years, Taiwanese become the largest foreign buyers\" (reporter Tsai Hui-fang, 22 July 2026)\n  This article draws only on the paper's own reading — Taiwanese capital diversifying overseas, Singapore standing alongside Japan, and the shift from single homes to diversified allocation. The figures for prices and unit numbers come from the primary sources above, not via that paper.\n  https://www.ctee.com.tw/news/20260722702000-430601\n\n**Legal basis**\n\n- Foreign Exchange and Foreign Trade Act, Article 55-3, paragraph 1, item 12; Foreign Exchange Order, Article 18-5; Ministerial Ordinance on Reports of Foreign Exchange Transactions, Article 12 — reporting of acquisitions of real estate in Japan by non-residents\n- Amendment to the Ministerial Ordinance on Reports of Foreign Exchange Transactions (promulgated 20 February 2026, in force 1 April 2026) — scope widened to acquisitions regardless of purpose; counterparty, purpose of acquisition and property registration number added to the reportable items\n- Foreign Exchange and Foreign Trade Act, Article 71, item 3 — penalty for failing to file, or filing a false report, under Article 55-3, paragraph 1 (imprisonment for up to six months or a fine of up to 500,000 yen)\n- Ministry of Finance, \"Filing the report on the acquisition of real estate in Japan or rights relating thereto under the Foreign Exchange and Foreign Trade Act\" (June 2026)\n  https://www.mof.go.jp/policy/international_policy/gaitame_kawase/real_property/\n- Income Tax Act, Articles 161, 164, 212 and 213; Order for Enforcement of the Income Tax Act, Article 281-3; Act on Special Measures for Securing Financial Resources for Reconstruction, Articles 8, 9, 10 and 28 — 10.21% withholding on purchases of land and similar from non-residents (National Tax Agency, Taxanswer No.2879)\n- National Tax Agency, Taxanswer No.1932, \"Selling real estate while working overseas\" — no withholding where the consideration is 100 million yen or less and the buyer acquires for their own or a relative's residential use; notification of a tax agent\n\n**Not verified**\n\n- The 2025 increase for Taipei (+0.1%) reported by Commercial Times, and the ranking that paper gave, could not be confirmed in the publicly available parts of Knight Frank's report, and are therefore not carried in this article.\n\nThis article provides general information only. It is not a legal or tax judgement on any individual case. How any particular set of circumstances is handled requires confirmation by a qualified professional. We introduce you to a licensed tax accountant for tax matters, a judicial scrivener for registration, and an attorney for contentious matters, in each case under a contract you enter into directly.\n\n**About the author** [Joji Uramatsu](https://luck428.com/about/uramatsu) | Representative Director of Yotsuba Real Estate Co., Ltd. and its full-time Real Estate Transaction Specialist (*takken-shi*). Administrative scrivener. Former China Bureau Chief of the Mainichi Shimbun, with 34 years as a journalist; posted to China, Taiwan and Thailand in that role. Passed the Certified Social Insurance and Labour Consultant examination (practice scheduled to open September 2026).\n\n## Related links\n\n- [Investment and business-use real estate](https://luck428.com/toushi)\n- [A guide to selling Japanese real estate for overseas owners (the selling side)](https://luck428.com/column/overseas-owners-guide-japan-real-estate-sale)\n- [What to do with your home in Japan while you live overseas (letting, keeping)](https://luck428.com/kaigai-owner)\n- [Chinese language support](https://luck428.com/global/chinese)\n- [Contact us](https://luck428.com/contact)"
          },
          "zh": {
                "title": "非居住者在东京买了不动产，20日内要向外为法申报 ─ 2026年4月起「不问目的」都纳入对象",
                "excerpt": "人在海外、以非居住者身份取得日本不动产的人，必须在取得后20日内通过日本银行向财务大臣提交申报书。2026年4月1日以后的取得，无论自住还是投资，不动产本身都成为申报对象，自其他非居住者取得时的免除也已废除。申报事项新增了不动产号码，必须把登记完成与20日期限一起往回推算。本文并列两份一手资料——莱坊《The Wealth Report 2026》的东京＋58.5％（全球第1）与日本国土交通省依登记信息统计的东京23区国外住所者取得308件、其中台湾192件——同时把握「台湾是最大买家」与「东京都整体为3.0％」。由宅建士・行政书士浦松丈二解说。文京区小日向・茗荷谷站步行5分钟。",
                "content": "人在海外、以非居住者身份取得日本不动产的人，必须在取得后20日内，通过日本银行向财务大臣提交「本邦にある不動産又はこれに関する権利の取得に関する報告書」（位于日本国内的不动产或其相关权利之取得申报书）。2026年4月1日以后的取得，无论是自住还是投资，不动产本身都成为申报对象。金额与面积的大小都不影响。\n\n本页整理的是**人住在日本以外、买下东京不动产的人（非居住者的买方），在交房之后要提交什么**。内容集中在买方这一侧。已经持有的房产要**出售**时的说明（源泉征收10.21％、让渡所得、出售方式的选择）请看[海外业主的日本不动产出售指南](https://luck428.com/column/overseas-owners-guide-japan-real-estate-sale)；离开日本后把自住房**出租、继续持有**的说明，请看[人在海外，日本的房子该怎么办](https://luck428.com/kaigai-owner)。\n\n最后更新：2026年8月12日\n\n## 东京的高档住宅，实际上涨了多少？\n\n莱坊（Knight Frank）于2026年4月公布的《The Wealth Report 2026（第20版）》中的 Prime International Residential Index（PIRI 100）显示，2025年全球高档住宅价格平均上涨3.2％，所追踪的100个市场中有73个上涨、24个下跌。\n\n> **莱坊（Knight Frank／日文称「ナイト・フランク」）是什么**\n>\n> 1896年在伦敦创立、总部设于英国的独立（非上市）不动产顾问公司。据该公司公布的资料，在全球50多个市场设有约600个网点，2万名以上员工从事住宅与商用不动产的买卖中介、估价、投资顾问等业务。日本也设有网点。\n>\n> 《The Wealth Report》是该公司自2007年起每年发布的高净值人群与不动产年度报告，2026年版为第20版。其核心是 **PIRI 100**（Prime International Residential Index），追踪全球100个高档住宅市场的价格变动。这里所说的「高档住宅（prime property）」，按该报告的定义是指**该市场中价值位居前5％的住宅**。这不是市场整体的平均值，而是观察金字塔顶端的指数——读数字时不能漏掉这一点。\n>\n> 另外，这是民营企业汇总自家各国研究团队资料所做的独立调查，并非政府统计。与下一节要谈的日本国土交通省调查（依登记信息所做的全面统计）性质不同，两者并列来看才符合实务。\n\n其中，**东京12个月上涨58.5％，在100个市场中排名第1**。该报告指出，推升东京新房公寓市场的因素包括供给稀缺、低利率，以及来自亚太地区的旺盛流入需求。\n\n| 排名 | 市场 | 2025年变化率 |\n|---|---|---|\n| 1 | 东京 | ＋58.5％ |\n| 2 | 迪拜 | ＋25.1％ |\n| 3 | 马尼拉 | ＋17.5％ |\n| 4 | 首尔 | ＋14.7％ |\n| 5 | 布拉格 | ＋14.6％ |\n| … | | |\n| 13 | 新加坡 | ＋7.9％ |\n| 89 | 香港 | －2.1％ |\n| 94 | 北京 | －4.9％ |\n| 95 | 上海 | －5.0％ |\n| 98 | 深圳 | －7.2％ |\n| 100 | 广州 | －12.2％ |\n\n以5年（2020年→2025年）来看，涨幅第一是迪拜的193.9％，**东京以159.3％排名第2**。\n\n该报告同时公布了「100万美元能买到的面积」。从2020年到2025年，**东京缩水了41％**（迪拜－66％、迈阿密－40％、洛杉矶－28％）。同样的预算能买到的面积在5年内少了四成，这个数字说明**「东京便宜」这个前提本身，在这5年间正在瓦解**。\n\n## 东京的新房公寓，有多少是从海外买走的？\n\n这里不是推算，而是有依登记所做的政府统计。日本国土交通省于2025年11月25日公布的「运用不动产登记信息的新房公寓交易调查结果」。该调查以法务省提供的不动产登记信息为基础，对象是2018年1月至2025年6月间办妥保存登记、位于三大都市圈与地方四市的新房公寓约55万户。\n\n**住所在国外者取得新房公寓的比例（2025年1〜6月）**\n\n| 地区 | 比例 |\n|---|---|\n| 东京圈 | 1.9％ |\n| 东京都 | 3.0％ |\n| 东京23区 | 3.5％ |\n| 都心6区（千代田・中央・港・新宿・文京・涩谷） | 7.5％ |\n| 其中 新宿区 | 14.6％ |\n| 其中 涩谷区 | 8.1％ |\n| 其中 千代田区 | 7.7％ |\n| 其中 文京区 | 5.0％ |\n| 其中 港区 | 4.3％ |\n\n越接近市中心比例越高，都心6区为7.5％。不过该调查明确指出，这个数字会因当年供给了什么样的房源而大幅变动。\n\n**在东京23区取得新房公寓的「住所在国外者」按国家・地区划分（2025年1〜6月）**\n\n| 国家・地区 | 登记件数 |\n|---|---|\n| 台湾 | 192件 |\n| 中国 | 30件 |\n| 新加坡 | 21件 |\n| 其他（香港・英国・美国等） | 65件 |\n| **合计** | **308件** |\n\n该调查指出，疫情之前就以中国、香港、台湾为多，**最近则以台湾最多**。台湾在308件中占192件，超过六成。\n\n**阅读时不能漏掉的3点**\n\n1. **这不是「外国人」的统计。** 该调查是按不动产登记的所有权人住所栏在国内还是国外来分类。登记不需登录国籍，因此住在日本的外国人、或海外法人的日本分公司所取得的部分，并未计入这个数字。\n2. **看不出偏重高价房产的倾向。** 都心6区按价格带划分，住所在国外者的购买比例，不满2亿日元为3.2％、2亿日元以上为3.8％。\n3. **短期买卖的主角在国内。** 东京23区的短期买卖（保存登记后1年内的转移登记）当中，住所在国外者所为者在2024年1〜6月为17件，占短期买卖整体的1.3％。都心6区里，2亿日元以上房产的短期买卖，国外部分为0户。\n\n也就是说，**「台湾是最大买家」是事实，但就东京都整体而言，来自国外的取得是3.0％**——这两件事必须同时把握。\n\n## 台湾方面怎么看这个现象？\n\n台湾的经济类报纸工商时报在2026年7月22日的报道（记者：蔡惠芳）中，把这个动向放在台湾资金海外分散的脉络里。该报的观察大致如下。\n\n- 地缘政治风险与日元的相对弱势，正在加速台湾高净值人群的海外资产配置\n- 除日本之外，新加坡作为分散标的的分量也在增加，围绕台湾高净值客户，台湾与新加坡双方的金融机构已开始在私人银行业务上竞争\n- 台湾高净值人群的投资标的，正从单一住宅的取得，转向住宅・商用不动产・酒店・另类资产的多元配置\n\n比起数字，「从买下单一房产，转为资产配置」这个看法在实务上更有作用。买一套房，和把一部分资产长期放在日本，需要先决定的事情并不相同。以下谈的是后者。\n\n## 非居住者买了日本的不动产，首先要提交什么？\n\n依外国為替及び外国貿易法（外汇及对外贸易法，简称外为法）所定的申报书。\n\n| 项目 | 内容 |\n|---|---|\n| 文件名称 | 本邦にある不動産又はこれに関する権利の取得に関する報告書（样式第22） |\n| 申报义务人 | 取得的非居住者 |\n| 期限 | 取得后20日内 |\n| 提交对象 | 通过日本银行向财务大臣 |\n| 金额门槛 | 无（不问金额・面积大小都必须申报） |\n| 提交方式 | 书面或在线系统 |\n\n所谓「非居住者」，是指在日本国内有住所或居所的个人、在日本国内设有主要事务所的法人（含外国法人的日本国内分公司）＝居住者，以外的人。人住在台湾而买下东京的公寓，就是这项申报的对象。\n\n未申报或作虚假申报的罚则是**6个月以下拘禁刑或50万日元以下罚金**（外为法第71条第3号）。这不是行政上的秩序罚「过料」，而是**刑事处罚**，这一点请务必记住。\n\n## 2026年4月1日起有什么改变？\n\n申报的对象范围扩大了。以取得日在2026年3月31日以前还是4月1日以后来区分。\n\n| | 2026年3月31日以前的取得 | 2026年4月1日以后的取得 |\n|---|---|---|\n| 申报对象 | 以投资目的等取得者 | **不问目的**而取得者 |\n| 不需申报的例子 | ①本人・亲属・雇员及其他从业人员的自住用 ②为开展非营利目的之业务 ③本人的事务所用 ④**自其他非居住者取得者** | ①②③限于「不动产**相关权利**」（租赁权、地上权等）。**④已废除** |\n| 样式 | 原则上为旧样式 | 新样式（暂时仍可沿用旧样式修改后使用） |\n\n实务上影响较大的是以下2点。\n\n- **即使是自住用，只要买的是不动产本身就必须申报。** 日本财务省的说明资料指出，以居住为目的取得附地上权建筑物的情况，建筑物部分属于申报对象。「我自己要住所以不用」是很容易读错的地方。\n- **非居住者之间买卖的排除规定没有了。** 从海外业主卖给海外买方的交易，也需要申报。\n\n此外，2026年4月1日以后的取得，申报事项新增了「交易对象（居住者・非居住者）」「取得目的（自住用、投资目的等）」「不动产号码」。**因为要求填写不动产号码**，会出现在登记完成前无法填写的栏目。与20日这个期限之间的关系，必须从签约阶段就往回推算。\n\n## 谁可以提交申报？可以委托中介公司吗？\n\n日本财务省表示，申报书的制作与提交，除了取得人本人（非居住者）之外，**由居住者身份的代理人（不动产中介公司等）提交也可以**。代理提交时建议使用在线系统。\n\n四叶不动产株式会社以宅地建物取引业者（日本的不动产交易业者）身份承办买卖中介；需要制作向行政机关提交的文件时，由并设的四叶行政书士事务所以**另行签订的合同**承接（行政书士为日本办理向行政机关提交文件等业务的专业资格）。两者是各自独立的经营主体，合同与费用都分开。彼此不收受介绍费。所有权转移登记请直接委托司法书士（日本办理登记等业务的专业资格），确定申告与纳税请直接委托税理士（日本的税务专业资格）。\n\n## 没有印鉴证明的买方，要怎么签约与登记？\n\n日本的印鉴登录制度，是以在日本有住民登录的人为前提。人在国外的买方，必须以居住国的公证或驻外机构的证明等文件，来代替印鉴证明书。台湾的实务请看[台湾的印鉴证明与遗产分割协议书](https://luck428.com/legal/column/taiwan-inkan-shomei-isan-bunkatsu)；在日本国内有住民登录的外国人，请看[外国人的印鉴登录能当天完成吗](https://luck428.com/column/gaikokujin-inkan-touroku-sokujitsu)。哪一种文件可以使用，由负责登记的司法书士判断，因此**文件的准备请从交房日往回推算、及早开始**比较安全。\n\n## 买了之后，日本这边的窗口由谁担任？\n\n在日本没有住所却持有不动产，会出现收不到的文件。固定资产税的纳税通知、业主委员会的通知、确定申告的通知等等。需要事先决定的项目如下。\n\n| 要决定的事 | 补充 |\n|---|---|\n| 纳税管理人 | 指定在日本国内有住所等的人，并向税务署申报。申报书的制作与确定申告请直接委托税理士 |\n| 是否出租 | 出租时，若承租人为法人等，租金会被源泉征收20.42％（[详细](https://luck428.com/kaigai-owner)） |\n| 邮件・联系方式 | 确保日本国内的收件处 |\n| 建筑物的管理 | 空置时的巡查、通风、邮件确认 |\n\n## 将来要卖的时候，现在该先知道什么？\n\n卖方以非居住者身份出售日本的不动产时，**买方**会产生源泉征收义务。买方须自让渡对价中扣除10.21％（所得税10％＋复兴特别所得税0.21％）并缴纳，卖方再以确定申告结算。\n\n例外是买方为个人、且是为自己或亲属自住而取得，并且让渡对价在1亿日元以下的情况。买方若为法人，则不论金额都需要源泉征收。\n\n也就是说，**以非居住者身份继续持有，卖的时候买方会多一道手续**。当出售进入视野时，最好把居住者・非居住者的判定在哪个时点进行一并理清；判定与交房日的关系整理在[非居住者的判定是以交房日决定的吗](https://luck428.com/column/hikyojusha-hantei-hikiwatashi-bi)。个别税额的判断属于税理士的领域。\n\n## 找四叶不动产咨询，可以承办到什么程度？\n\n四叶不动产株式会社（东京都文京区小日向・茗荷谷站步行5分钟）承办投资用・事业用不动产，以及以外语进行的房产咨询。可以用中文（繁体字・简体字）沟通。\n\n- 房产的调查・提案・买卖中介 —— 四叶不动产株式会社（宅地建物取引业）\n- 向行政机关提交之文件的制作 —— 四叶行政书士事务所（**另行签约**）\n- 登记 —— 请直接委托司法书士\n- 税务申告・纳税管理人申报书 —— 请直接委托税理士\n- 具有纠纷性的案件 —— 请直接委托律师\n\n各项均以独立的经营主体、独立的合同承接，本公司与本事务所不收取任何介绍费。\n\n投资用・事业用不动产的整体说明请看[投资用・事业用不动产](https://luck428.com/toushi)，中文咨询请看[中文对应](https://luck428.com/global/chinese)，与台湾有关的继承请看[台湾跨境继承](https://luck428.com/souzoku/taiwan)。\n\n## 本文的依据\n\n**高档住宅价格（一手资料）**\n\n- Knight Frank《The Wealth Report 2026》第20版（2026年4月23日公布）、Prime International Residential Index（PIRI 100）\n  全球平均＋3.2％／100个市场中73个上涨・24个下跌／东京＋58.5％（第1名）／5年间迪拜＋193.9％・东京＋159.3％／100万美元购买力的5年变化（迪拜－66％、东京－41％、迈阿密－40％、洛杉矶－28％）\n  https://www.knightfrank.com/research/article/2026/4/piri-100-ultimate-prime-residential-property-index\n- 该公司概要（1896年于伦敦创立、独立经营、50多个市场・约600网点・2万人以上）依该公司官方网站\n  https://www.knightfrank.com/about-us\n- 「prime property＝各市场中价值前5％」的定义依《The Wealth Report 2026》的用语定义页\n\n**来自国外的新房公寓取得（一手资料）**\n\n- 日本国土交通省「公布运用不动产登记信息的新房公寓交易调查结果——三大都市圈及地方四市的短期买卖与国外居住者取得状况」（令和7年11月25日）及附件「运用不动产登记信息的新房公寓交易实态的调查・分析」\n  调查对象＝2018年1月〜2025年6月办妥保存登记的新房公寓约55万户／2025年1〜6月住所在国外者的取得比例（东京都3.0％・东京23区3.5％・都心6区7.5％・新宿区14.6％）／东京23区按国家・地区划分的登记件数（台湾192件、中国30件、新加坡21件、合计308件）／都心6区按价格带划分的购买比例（不满2亿日元3.2％、2亿日元以上3.8％）／东京23区短期买卖中住所在国外者于2024年1〜6月为17件・占整体1.3％\n  https://www.mlit.go.jp/report/press/tochi_fudousan_kensetsugyo05_hh_000001_00237.html\n\n**台湾方面的分析与评论**\n\n- 工商时报「台灣富豪瘋買海外不動產！東京豪宅5年狂飆159％ 台灣人躍最大外國買家」（记者：蔡惠芳、2026年7月22日）\n  本文仅引用该报独自提出的「台湾资金海外分散」「与新加坡并立」「从单一住宅转向多元配置」等观察。价格与户数的数值并非通过该报，而是取自上述一手资料。\n  https://www.ctee.com.tw/news/20260722702000-430601\n\n**制度的依据**\n\n- 外国為替及び外国貿易法第55条之3第1项第12号、外国為替令第18条之5、外国為替の取引等の報告に関する省令第12条 —— 非居住者取得日本国内不动产等的申报\n- 外国為替の取引等の報告に関する省令之修正（2026年2月20日公布・2026年4月1日施行）—— 申报对象扩大为「不问目的」，申报事项新增交易对象・取得目的・不动产号码\n- 外国為替及び外国貿易法第71条第3号 —— 未依第55条之3第1项申报或作虚假申报时的罚则（6个月以下拘禁刑或50万日元以下罚金）\n- 日本财务省「依外为法提交『本邦にある不動産又はこれに関する権利の取得に関する報告書』」（令和8年6月）\n  https://www.mof.go.jp/policy/international_policy/gaitame_kawase/real_property/\n- 所得税法第161条、第164条、第212条、第213条、所得税法施行令第281条之3、复兴财源确保法第8条・第9条・第10条・第28条 —— 向非居住者等购买土地等时的10.21％源泉征收（日本国税厅 Tax Answer No.2879）\n- 日本国税厅 Tax Answer No.1932「海外派驻期间出售不动产的情况」—— 1亿日元以下且买方为自己・亲属自住用时不需源泉征收、纳税管理人的申报\n\n**未核实事项**\n\n- 工商时报所报道的台北2025年涨幅（＋0.1％）及该报所示的排名，在莱坊的公开部分无法确认，因此本文未予采用。\n\n本文为一般性的信息提供，并非针对个别案件的法律判断或税务判断。依个别情况而异的处理方式，需经有资格者确认。税务请委托税理士，登记请委托司法书士，具有纠纷性的案件请委托律师，均请直接签约。\n\n**本文作者** [浦松 丈二](https://luck428.com/about/uramatsu)｜四叶不动产株式会社 代表取缔役・专任宅地建物取引士。行政书士。前每日新闻中国总局长（记者资历34年）。曾以中国总局长的身份常驻中国、台湾、泰国。社会保险劳务士考试合格（预定2026年9月开业）。\n\n## 相关链接\n\n- [投资用・事业用不动产](https://luck428.com/toushi)\n- [海外业主的日本不动产出售指南（出售方）](https://luck428.com/column/overseas-owners-guide-japan-real-estate-sale)\n- [人在海外，日本的房子该怎么办（出租・继续持有）](https://luck428.com/kaigai-owner)\n- [中文对应](https://luck428.com/global/chinese)\n- [联系我们](https://luck428.com/contact)"
          }
    },
    content: `海外に住んだまま日本の不動産を取得した非居住者は、取得後20日以内に、日本銀行を経由して財務大臣へ「本邦にある不動産又はこれに関する権利の取得に関する報告書」を提出します。2026年4月1日以降の取得分は、居住用か投資用かを問わず、不動産そのものが報告対象になりました。金額や面積の大小は問いません。

このページは、**日本国外に住んだまま東京の不動産を買った方（非居住者の買主）が、引渡し後に何を出すのか**を整理したものです。買った側の手続きに絞っています。すでに持っている物件を**売る**ときの話（源泉徴収10.21％・譲渡所得・売却方法の選び方）は[海外オーナーのための日本不動産売却ガイド](https://luck428.com/column/overseas-owners-guide-japan-real-estate-sale)、日本を離れて持ち家を**貸す・持ち続ける**ときの話は[海外に住んだまま日本の家をどうするか](https://luck428.com/kaigai-owner)にまとめています。

最終更新：2026年8月12日

## 東京の高級住宅は、実際にどれだけ上がったのですか？

ナイト・フランクが2026年4月に公表した『The Wealth Report 2026（第20版）』の Prime International Residential Index（PIRI 100）によると、2025年の世界の高級住宅価格は平均で3.2％上昇し、追跡している100市場のうち73市場が上昇、24市場が下落しました。

> **ナイト・フランク（Knight Frank／中国語圏では「萊坊」）とは**
>
> 1896年にロンドンで創業した、英国に本社を置く独立系（非上場）の不動産コンサルティング会社です。同社の公表によれば、世界50を超える市場に約600の拠点を持ち、2万人以上が住宅・商業用不動産の売買仲介、評価、投資助言などにあたっています。日本にも拠点があります。
>
> 『The Wealth Report』は同社が2007年から毎年出している富裕層と不動産の年次レポートで、2026年版が第20版です。その中核が **PIRI 100**（Prime International Residential Index）で、世界100の高級住宅市場の価格変動を追う指数。ここでいう「高級住宅（prime property）」は、同レポートの定義では**その市場で価値の上位5％にあたる住宅**を指します。市場全体の平均ではなく、上澄みの動きを見る指数だという点は、数字を読むときに外せません。
>
> なお、これは民間企業が自社の各国リサーチチームのデータを集計した独自調査であり、政府統計ではありません。次の章で扱う国土交通省の調査（登記情報に基づく悉皆的な集計）とは性格が違うため、両方を並べて読むのが実務的です。

その中で、**東京は12か月で58.5％上昇し、100市場中1位**です。同報告は、東京の新築マンション市場を押し上げた要因として、供給の希少性、低金利、アジア太平洋からの旺盛な流入需要を挙げています。

| 順位 | 市場 | 2025年の変化率 |
|---|---|---|
| 1 | 東京 | ＋58.5％ |
| 2 | ドバイ | ＋25.1％ |
| 3 | マニラ | ＋17.5％ |
| 4 | ソウル | ＋14.7％ |
| 5 | プラハ | ＋14.6％ |
| … | | |
| 13 | シンガポール | ＋7.9％ |
| 89 | 香港 | －2.1％ |
| 94 | 北京 | －4.9％ |
| 95 | 上海 | －5.0％ |
| 98 | 深圳 | －7.2％ |
| 100 | 広州 | －12.2％ |

5年間（2020年→2025年）で見ると、上昇率の首位はドバイの193.9％、**東京は159.3％で2位**です。

同報告はあわせて「100万米ドルで買える広さ」も出しています。2020年から2025年にかけて、**東京は41％縮みました**（ドバイ－66％、マイアミ－40％、ロサンゼルス－28％）。同じ予算で買える面積が5年で4割減ったということで、**「東京は割安」という前提そのものが、この5年で崩れつつある**ことを示す数字です。

## 東京の新築マンションは、どれくらい国外から買われているのですか？

ここは推計ではなく、登記に基づく政府統計があります。国土交通省が2025年11月25日に公表した「不動産登記情報を活用した新築マンションの取引の調査結果」です。法務省から受領した不動産登記情報をもとに、2018年1月から2025年6月までに保存登記された三大都市圏・地方四市の新築マンション約55万戸を対象としています。

**国外に住所がある者による新築マンション取得の割合（2025年1〜6月）**

| 地域 | 割合 |
|---|---|
| 東京圏 | 1.9％ |
| 東京都 | 3.0％ |
| 東京23区 | 3.5％ |
| 都心6区（千代田・中央・港・新宿・文京・渋谷） | 7.5％ |
| うち新宿区 | 14.6％ |
| うち渋谷区 | 8.1％ |
| うち千代田区 | 7.7％ |
| うち文京区 | 5.0％ |
| うち港区 | 4.3％ |

中心部ほど割合が高くなる傾向があり、都心6区は7.5％。ただし同調査は、その年にどのようなマンションが供給されたかによって数字が大きく変動する点を明記しています。

**東京23区で新築マンションを取得した「国外に住所がある者」の国・地域別（2025年1〜6月）**

| 国・地域 | 登記件数 |
|---|---|
| 台湾 | 192件 |
| 中国 | 30件 |
| シンガポール | 21件 |
| その他（香港・英国・米国ほか） | 65件 |
| **合計** | **308件** |

同調査は、コロナ禍以前から中国・香港・台湾が多く、**直近では台湾が最も多くなっている**としています。台湾は308件中192件で、6割を超えます。

**読むときに外せない3点**

1. **「外国人」の統計ではありません。** 同調査は不動産登記の所有者住所欄が国内か国外かで分類しています。登記に国籍の登録は不要なため、日本在住の外国人や海外法人の日本支社による取得は、この数字に含まれていません。
2. **高額物件に偏っている傾向は見られません。** 都心6区の価格帯別では、国外に住所がある者の購入割合は2億円未満で3.2％、2億円以上で3.8％です。
3. **短期売買の主役は国内です。** 東京23区の短期売買（保存登記から1年以内の移転登記）のうち、国外に住所がある者によるものは2024年1〜6月で17件、短期売買全体の1.3％。都心6区では、2億円以上の物件の短期売買は国外分が0戸でした。

つまり、**「台湾が最多の買い手」は事実だが、東京都全体で見れば国外からの取得は3.0％**、という二つを同時に押さえる必要があります。

## 台湾側は、この動きをどう見ているのですか？

台湾の経済紙・工商時報は2026年7月22日の記事（記者：蔡惠芳）で、この動きを台湾資金の海外分散という文脈に置いています。同紙の見立てはおおむね次のとおりです。

- 地政学リスクと円の相対的な弱さが、台湾の富裕層による海外資産配置を加速させている
- 日本と並んでシンガポールも分散先として重みを増し、台湾の高資産顧客をめぐって台湾・シンガポール双方の金融機関がプライベートバンキングで競合し始めている
- 台湾の富裕層の投資対象は、単一の住宅取得から、住宅・商業用不動産・ホテル・オルタナティブ資産への多元的な配分へと移りつつある

数字ではなく、この「単一物件の購入から資産配分へ」という見方のほうが、実務では効いてきます。物件を1戸買う話と、日本に資産の一部を置き続ける話とでは、決めておくべきことが違うからです。以下は後者の話になります。

## 非居住者が日本の不動産を買ったら、まず何を出すのですか？

外国為替及び外国貿易法（外為法）に基づく報告書です。

| 項目 | 内容 |
|---|---|
| 書類名 | 本邦にある不動産又はこれに関する権利の取得に関する報告書（様式第22） |
| 提出義務者 | 取得した非居住者 |
| 期限 | 取得後20日以内 |
| 提出先 | 日本銀行を経由して財務大臣 |
| 金額基準 | なし（金額・面積の大小を問わず必要） |
| 提出方法 | 書面またはオンラインシステム |

「非居住者」とは、日本国内に住所または居所を有する個人・日本国内に主たる事務所を有する法人（外国法人の日本国内支店等を含む）＝居住者、以外の者を指します。台湾に住んだまま東京のマンションを買えば、この報告の対象です。

報告をしなかった場合や虚偽の報告をした場合の罰則は、**六月以下の拘禁刑または50万円以下の罰金**です（外為法第71条第3号）。行政上の秩序罰である「過料」ではなく**刑事罰**である点は、押さえておいてください。

## 2026年4月1日から何が変わったのですか？

報告の対象範囲が広がりました。取得日が2026年3月31日以前か、4月1日以降かで扱いが分かれます。

| | 2026年3月31日以前の取得 | 2026年4月1日以降の取得 |
|---|---|---|
| 報告対象 | 投資目的等で取得したもの | **目的を問わず**取得したもの |
| 報告不要となる例 | ①本人・親族・使用人その他の従業員の居住用 ②非営利目的の業務遂行のため ③本人の事務所用 ④**他の非居住者から取得したもの** | ①②③は「不動産に**関する権利**」（賃借権・借地権等）に限られる。**④は廃止** |
| 様式 | 原則、旧様式 | 新様式（当分の間、旧様式の取り繕い使用可） |

実務上、影響が大きいのは次の2点です。

- **居住用でも、不動産そのものを買えば報告が要る。** 財務省のリーフレットは、居住目的で借地権付建物を取得するケースについて、建物部分は報告対象になると示しています。「自分が住むから不要」と読み違えやすいところです。
- **非居住者どうしの売買の除外がなくなった。** 海外オーナーから海外の買主へ、という取引でも報告が必要になります。

さらに、2026年4月1日以降の取得については、報告事項に「取引の相手方（居住者・非居住者）」「取得の目的（居住用、投資目的等）」「不動産番号」が加わりました。**不動産番号が求められる**ため、登記が済むまで書けない欄が生じます。20日という期限との兼ね合いを、契約の段階から逆算しておく必要があります。

## 報告は誰が出せますか。仲介業者に頼めますか？

財務省は、報告書の作成・提出は取得者である非居住者本人のほか、**居住者である代理人（不動産仲介業者等）による提出も可能**としています。代理提出の場合はオンラインシステムの利用が推奨されています。

四葉不動産株式会社は宅地建物取引業者として売買の仲介を行い、官公署に提出する書類の作成が必要な場面では、併設の四葉行政書士事務所が**別契約**で受任します。両者は独立した事業体で、契約も費用も別々です。紹介料等の授受はありません。所有権移転登記は司法書士、確定申告・納税は税理士へ、それぞれ直接ご依頼いただく形をご案内します。

## 印鑑証明のない買主は、どうやって契約・登記するのですか？

日本の印鑑登録制度は、日本に住民登録がある人を前提としています。国外に住んだままの買主は、印鑑証明書に代えて、居住国の公証や在外公館の証明といった書面を用意することになります。台湾の場合の実務は[台湾の印鑑証明・遺産分割協議書](https://luck428.com/legal/column/taiwan-inkan-shomei-isan-bunkatsu)、日本国内に住民登録がある外国人の方は[外国人の印鑑登録は即日できるか](https://luck428.com/column/gaikokujin-inkan-touroku-sokujitsu)をご覧ください。どの書面が使えるかは登記を担当する司法書士の判断になりますので、**書類の手配は決済日から逆算して早めに始める**のが安全です。

## 買った後、日本側の窓口は誰が務めるのですか？

日本に住所がないまま不動産を持つと、届かない書類が出ます。固定資産税の納税通知、管理組合からの通知、確定申告の案内などです。決めておく項目は次のとおりです。

| 決めること | 補足 |
|---|---|
| 納税管理人 | 国内に住所等を有する者を定め、税務署へ届け出ます。届出書の作成・確定申告は税理士へ直接ご依頼ください |
| 賃貸に出すか | 出す場合、借主が法人等であれば家賃から20.42％が源泉徴収されます（[詳細](https://luck428.com/kaigai-owner)） |
| 郵便・連絡先 | 国内の受取先を確保します |
| 建物の管理 | 空室のまま置く場合の巡回・通風・郵便物の確認 |

## 将来売るときに、いま知っておくべきことはありますか？

売主が非居住者のまま日本の不動産を売ると、**買主側**に源泉徴収義務が生じます。買主は譲渡対価の10.21％（所得税10％＋復興特別所得税0.21％）を差し引いて納付し、売主は確定申告で精算します。

例外は、買主が個人で、かつ自己または親族の居住用に取得する場合で、譲渡対価が1億円以下のときです。買主が法人であれば、金額にかかわらず源泉徴収が必要とされています。

つまり、**非居住者のまま持ち続けると、売るときに買主が一手間背負う**構造になります。売却の予定が視野に入ったら、居住者・非居住者の判定がいつの時点で行われるかを含めて整理しておくとよく、判定と引渡し日の関係は[非居住者の判定は引渡し日で決まるのか](https://luck428.com/column/hikyojusha-hantei-hikiwatashi-bi)にまとめています。個別の税額の判断は税理士の領域です。

## 四葉不動産に相談すると、どこまで担当してもらえますか？

四葉不動産株式会社（東京都文京区小日向・茗荷谷駅徒歩5分）は、投資用・事業用不動産と、外国語での物件のご相談に対応しています。中国語（繁体字・簡体字）でのやりとりが可能です。

- 物件の調査・提案・売買の仲介 —— 四葉不動産株式会社（宅地建物取引業）
- 官公署に提出する書類の作成 —— 四葉行政書士事務所（**別契約**）
- 登記 —— 司法書士へ直接ご依頼
- 税務申告・納税管理人の届出書 —— 税理士へ直接ご依頼
- 紛争性のある案件 —— 弁護士へ直接ご依頼

いずれも独立した事業体として受任し、当社・当事務所は紹介料等を受け取りません。

投資用・事業用不動産の全体像は[投資用・事業用不動産](https://luck428.com/toushi)、中国語でのご相談は[中国語対応](https://luck428.com/global/chinese)、台湾に関わる相続は[台湾越境相続](https://luck428.com/souzoku/taiwan)をご覧ください。

## この記事の根拠

**高級住宅価格（一次資料）**

- Knight Frank『The Wealth Report 2026』第20版（2026年4月23日公表）、Prime International Residential Index（PIRI 100）
  世界平均＋3.2％／100市場中73市場が上昇・24市場が下落／東京＋58.5％（1位）／5年でドバイ＋193.9％・東京＋159.3％／100万米ドルの購買力の5年変化（ドバイ－66％、東京－41％、マイアミ－40％、ロサンゼルス－28％）
  https://www.knightfrank.com/research/article/2026/4/piri-100-ultimate-prime-residential-property-index
- 同社の概要（1896年ロンドン創業、独立系、50超の市場・約600拠点・2万人以上）は同社公式サイトによる
  https://www.knightfrank.com/about-us
- 「prime property＝各市場で価値の上位5％」の定義は『The Wealth Report 2026』の用語定義ページによる

**国外からの新築マンション取得（一次資料）**

- 国土交通省「不動産登記情報を活用した新築マンションの取引の調査結果を公表——三大都市圏及び地方四市の短期売買や国外居住者による取得状況」（令和7年11月25日）および別紙「不動産登記情報を活用した新築マンションの取引実態の調査・分析について」
  調査対象＝2018年1月〜2025年6月に保存登記された新築マンション約55万戸／2025年1〜6月の国外住所者取得割合（東京都3.0％・東京23区3.5％・都心6区7.5％・新宿区14.6％）／東京23区の国・地域別登記件数（台湾192件、中国30件、シンガポール21件、合計308件）／都心6区の価格帯別購入割合（2億円未満3.2％、2億円以上3.8％）／東京23区の短期売買のうち国外住所者は2024年1〜6月で17件・全体の1.3％
  https://www.mlit.go.jp/report/press/tochi_fudousan_kensetsugyo05_hh_000001_00237.html

**台湾側の分析・論評**

- 工商時報「台灣富豪瘋買海外不動產！東京豪宅5年狂飆159％ 台灣人躍最大外國買家」（記者：蔡惠芳、2026年7月22日）
  本コラムでは、同紙が独自に示した「台湾資金の海外分散」「シンガポールとの並立」「単一住宅から多元配分へ」という見立てのみを引用しました。価格・戸数の数値は、同紙経由ではなく上記の一次資料から取っています。
  https://www.ctee.com.tw/news/20260722702000-430601

**制度の根拠**

- 外国為替及び外国貿易法第55条の3第1項第12号、外国為替令第18条の5、外国為替の取引等の報告に関する省令第12条 —— 非居住者による本邦不動産等の取得に係る報告
- 外国為替の取引等の報告に関する省令の改正（2026年2月20日公布・2026年4月1日施行）—— 報告対象が「目的を問わず」に拡大、報告事項に取引の相手方・取得の目的・不動産番号を追加
- 外国為替及び外国貿易法第71条第3号 —— 第55条の3第1項の報告をせず、又は虚偽の報告をしたときの罰則（六月以下の拘禁刑又は50万円以下の罰金）
- 財務省「外為法に基づく『本邦にある不動産又はこれに関する権利の取得に関する報告書』の提出」（令和8年6月）
  https://www.mof.go.jp/policy/international_policy/gaitame_kawase/real_property/
- 所得税法第161条、第164条、第212条、第213条、所得税法施行令第281条の3、復興財源確保法第8条・第9条・第10条・第28条 —— 非居住者等から土地等を購入した場合の10.21％の源泉徴収（国税庁タックスアンサー No.2879）
- 国税庁タックスアンサー No.1932「海外勤務中に不動産を売却した場合」—— 1億円以下かつ買主の自己・親族の居住用の場合の源泉徴収不要、納税管理人の届出

**未検証事項**

- 工商時報が報じた台北の2025年の上昇率（＋0.1％）および同紙が示した順位は、ナイト・フランクの公開部分では確認できなかったため、本コラムには採録していません。

本コラムは一般的な情報提供であり、個別の事案についての法的判断・税務判断ではありません。具体的なご事情に応じた取り扱いは、資格者による確認を要します。税務は税理士、登記は司法書士、紛争性のある案件は弁護士へ、それぞれ直接ご依頼いただく形をご案内します。

**この記事の著者** [浦松 丈二](https://luck428.com/about/uramatsu)｜四葉不動産株式会社 代表取締役・専任宅地建物取引士。行政書士。元毎日新聞中国総局長（記者歴34年）。中国総局長として中国や台湾、タイに駐在しました。社会保険労務士試験合格（2026年9月開業予定）。

## 関連リンク

- [投資用・事業用不動産](https://luck428.com/toushi)
- [海外オーナーのための日本不動産売却ガイド（売る側）](https://luck428.com/column/overseas-owners-guide-japan-real-estate-sale)
- [海外に住んだまま日本の家をどうするか（貸す・持ち続ける）](https://luck428.com/kaigai-owner)
- [中国語対応](https://luck428.com/global/chinese)
- [お問い合わせ](https://luck428.com/contact)`,
  },
];
