import type { LangCode } from "@/config/languages";

type Steps = readonly [heading: string, description: string][];
type Item = { tag: string; title: string; text: string; source: string };
type Deadline = { duration: string; title: string; text: string; source: string };

type GuideCopy = {
  hero: { eyebrow: string; heading: readonly [string, string]; lead: string; contact: string; checklist: string; language: string; alt: string };
  tocLabel: string;
  toc: readonly [string, string, string, string, string];
  start: { heading: string; lead: string; alt: string; steps: Steps };
  assets: { heading: string; lead: string; alt: string; items: Record<"deposits" | "securities" | "property" | "insurance", Item> };
  documents: { heading: string; lead: string; alt: string; items: Steps; sources: readonly [string, string, string, string]; callout: string };
  deadlines: { heading: string; lead: string; items: Record<"renunciation" | "finalTax" | "inheritanceTax", Deadline> };
  consultation: { heading: string; alt: string; steps: Steps; roles: Steps; separateEngagements: string };
  sale: { heading: string; text: string; sources: readonly [string, string] };
  contact: { heading: string; text: string; primary: string; serviceOverview: string };
  disclaimer: string;
  checked: string;
};

// Approved international-inheritance guide; preserve the same facts and sources in each locale.
export const INTERNATIONAL_INHERITANCE_COPY: Record<LangCode, GuideCopy> = {
  ja: {
    hero: {
      eyebrow: "台湾・海外からの日本の相続相談",
      heading: [
        "日本に残された家や預金。",
        "相続は、何から始める？"
      ],
      lead: "ご家族が日本に財産を残したかもしれないと分かったとき、最初から書類がすべてそろっている必要はありません。台湾や海外から、分かる範囲でご相談ください。家を売るかどうかも、今すぐ決めなくて大丈夫です。",
      contact: "相続の書類について相談する",
      checklist: "初回相談のチェックリスト",
      language: "中国語でのご相談も可能です。",
      alt: "海辺の住宅地と対岸の風景を描いた淡い水彩画"
    },
    tocLabel: "この案内の目次",
    toc: [
      "まず確認すること",
      "財産の調べ方",
      "台湾の証明書",
      "期限",
      "相談からの流れ"
    ],
    start: {
      heading: "初回相談までに、分かることを3つ",
      lead: "把握できていない項目は「不明」のままで構いません。最初の連絡で、本人確認書類の画像や口座番号を送る必要はありません。",
      alt: "緑の冊子を囲む家族の人影を描いた水彩画",
      steps: [
        [
          "いつ知りましたか",
          "ご家族が亡くなった日と、そのことを知った日をメモします。ご自身が相続人になったと知った日が異なる場合は、その日も控えてください。"
        ],
        [
          "どこに住んでいましたか",
          "亡くなった方の最後の居住地や、ご自身が住む国・地域。詳細な住所は初回には不要です。"
        ],
        [
          "どんな財産がありそうですか",
          "日本の家や土地、預金、株式、保険など。手元に資料があるかも分かると整理しやすくなります。"
        ]
      ]
    },
    assets: {
      heading: "財産が分からないときの照会先",
      lead: "財産の種類に応じて、相続人が照会を申し込める制度があります。一つの窓口ですべてが判明するわけではありません。",
      alt: "家と複数の書類を線で結んだ水彩画",
      items: {
        deposits: {
          tag: "預貯金",
          title: "相続時照会を受け付ける金融機関",
          text: "取扱金融機関で、故人が生前にマイナンバーを付番した預貯金口座の所在を照会できます。未付番の口座は対象外です。結果通知書の郵送先は日本国内に限られます。",
          source: "デジタル庁｜預貯金口座付番制度"
        },
        securities: {
          tag: "株式等",
          title: "証券保管振替機構",
          text: "制度の対象となる株式等について、口座の開設先となっている証券会社等を照会できます。保有銘柄・数量・残高をこの窓口で確かめる手続きではありません。",
          source: "証券保管振替機構｜株主・相続人の手続"
        },
        property: {
          tag: "不動産",
          title: "法務局",
          text: "所有不動産記録証明制度で、故人名義の不動産を調べられます。登記上の氏名・住所等と検索条件が合わないと、結果に載らないことがあります。",
          source: "所有不動産記録証明制度の案内（大阪市掲載PDF・5ページ）"
        },
        insurance: {
          tag: "生命保険",
          title: "生命保険協会",
          text: "所定の条件に該当する場合、会員会社に対象の契約があるか照会できます。保障内容や保険金の請求手続きは、該当の保険会社に確認します。",
          source: "生命保険協会｜契約照会制度"
        }
      }
    },
    documents: {
      heading: "台湾の印鑑証明は「申請目的」から",
      lead: "台湾の印鑑證明は、必要に応じて戸政事務所の書式で「申請目的」を指定できます。「相続用」と書けば日本のすべての手続きに使える、とは限りません。",
      alt: "用途を確認する書類と印章の水彩画",
      items: [
        [
          "日本の銀行に出す",
          "台湾の戸政事務所の書式には、預金相続を示す用途（「金融機構存戶死亡，繼承人辦理存款繼承」）があります。必要な記載・原本部数・日本語訳の要否は、日本の銀行ごとに確認します。"
        ],
        [
          "日本の不動産登記に使う",
          "台湾の書式には別の用途「不動產登記」があります。銀行用の証明書と同じもので受理されるとは限りません。必要な記載や、署名証明等で代替できるかは、管轄の登記所や司法書士に確認します。"
        ]
      ],
      sources: [
        "台湾・内政部戸政司｜申請目的の記載について",
        "台湾・内政部戸政司｜委任書にある用途の選択例（PDF・40ページ）",
        "印鑑・署名証明の詳しい解説",
        "台湾の除戸謄本の取り方"
      ],
      callout: "まず提出先ごとに要件を確認してから、証明書を準備すると手戻りを減らせます。ご家族全員が来日する前提ではありません。郵送や委任で進められるか、署名・来店が必要かは日本側の提出先ごとに確認します。"
    },
    deadlines: {
      heading: "3・4・10か月：別々の手続き",
      lead: "数字は日本の制度の原則です。何が適用されるか、いつから数えるかは手続きごとに異なります。財産がまだ分からなくても、期限は先に確認してください。",
      items: {
        renunciation: {
          duration: "3か月",
          title: "相続放棄",
          text: "日本の民法が適用される場合、原則として自分のために相続が始まったことを知った時から3か月以内に、家庭裁判所へ申述します。",
          source: "裁判所｜相続放棄"
        },
        finalTax: {
          duration: "4か月",
          title: "故人の所得税の準確定申告",
          text: "故人の所得税の申告が必要な場合、相続開始を知った日の翌日から4か月以内に申告し、納める税額があれば納付します。故人が生前に売った株式の申告対象の利益も含みます。相続した株式を売却したり、名義を変更したりする期限ではありません。",
          source: "国税庁｜準確定申告"
        },
        inheritanceTax: {
          duration: "10か月",
          title: "日本の相続税",
          text: "相続人が申告する場合、自分のために相続が始まったことを知った日（通常は故人の死亡を知った日）の翌日から10か月以内に申告し、納める税額があれば納付します。不動産・預貯金・株式などの課税対象財産を合わせて計算します。遺言で財産を受け取る方を含め、個別の要否と期限は税理士にご確認ください。",
          source: "国税庁｜相続税の申告・納税"
        }
      }
    },
    consultation: {
      heading: "初回相談から手続きまで",
      alt: "机を囲んで書類を確認する人たちの水彩画",
      steps: [
        [
          "初回相談",
          "居住地、分かっている財産、手元の書類を確認し、急ぐ手続きと不足書類を整理します。"
        ],
        [
          "見積もり",
          "当事務所の書類業務の範囲と費用をご案内。別の専門家に依頼する業務は、各事務所が別途ご案内します。"
        ],
        [
          "契約・委任状",
          "依頼する内容と費用に合意してから契約し、必要な手続きごとに委任状や証明書を整えます。"
        ]
      ],
      roles: [
        [
          "行政書士",
          "当事務所の業務範囲内の相続書類の準備・作成"
        ],
        [
          "司法書士",
          "不動産の相続登記"
        ],
        [
          "税理士",
          "申告の要否、相続税・売却時の税金の個別相談と申告"
        ],
        [
          "弁護士",
          "相続人同士の紛争や個別の法律相談への対応。必要に応じて当事務所からご紹介します。"
        ],
        [
          "宅建業者",
          "不動産の売却や賃貸を希望する場合のご相談"
        ]
      ],
      separateEngagements: "別業務はそれぞれの専門家・事業体と直接ご契約いただきます。費用の請求・お支払いも各契約先と直接行います。当事務所は紹介料を受け取りません。"
    },
    sale: {
      heading: "家を売るかは、後から決められます",
      text: "日本の相続税と、取得した不動産を売却したときの譲渡所得にかかる税金は別です。売却する人や時期、故人から引き継ぐ取得時期・取得費、条件付きの取得費加算などで手取りが変わる場合があります。売却方針を決める前に日本の税理士へご相談ください。",
      sources: [
        "国税庁｜取得費と取得時期",
        "国税庁｜取得費加算の特例"
      ]
    },
    contact: {
      heading: "分かる範囲で、お聞かせください",
      text: "四葉行政書士事務所では、相続の書類についてご相談いただけます。ご希望の相談言語もお知らせください。最初のご連絡では、パスポート画像・口座番号・マイナンバーなどは送らないでください。",
      primary: "四葉行政書士事務所に相談する",
      serviceOverview: "相続・遺言の業務案内"
    },
    disclaimer: "この案内は一般的な情報です。適用される法律、手続きの期限、必要書類や税額は、個別に担当の専門家へご確認ください。",
    checked: "出典確認日：2026年11月22日。"
  },
  "zh-tw": {
    hero: {
      eyebrow: "從台灣或其他地區辦理日本繼承",
      heading: [
        "家人在日本留下房子或存款，",
        "該從哪裡開始辦理繼承？"
      ],
      lead: "如果家人可能在日本留下財產，不必等到文件齊全才聯絡我們。人在台灣或其他地區，都可以先談談目前知道的情況；也不必現在就決定是否賣房。",
      contact: "諮詢日本繼承文件",
      checklist: "第一次諮詢的準備清單",
      language: "也可以用中文諮詢。",
      alt: "海邊聚落與對岸風景的淡彩畫"
    },
    tocLabel: "本指南目錄",
    toc: [
      "先確認哪些事？",
      "如何查找遺產？",
      "台灣的印鑑證明",
      "手續期限",
      "諮詢流程"
    ],
    start: {
      heading: "第一次諮詢，先整理三件事",
      lead: "還不清楚的項目，可以先註明「不知道」。初次聯絡時，不必提供身分證件影像或銀行帳號。",
      alt: "一家人圍著綠色冊子的水彩畫",
      steps: [
        [
          "您是什麼時候知道的？",
          "請記下家人過世的日期，以及您得知死訊的日期。如果您是在另一日才得知自己成為繼承人，也請記下那一天。"
        ],
        [
          "家人最後住在哪裡？您現在住哪裡？",
          "請記下家人生前最後居住的地方，以及您目前居住的國家或地區。第一次諮詢不需要詳細地址。"
        ],
        [
          "在日本可能有哪些財產？",
          "例如房屋、土地、存款、股票或保險。如果手邊有相關文件，先記下有哪些即可。"
        ]
      ]
    },
    assets: {
      heading: "不知道家人留下哪些財產，可以向誰查詢？",
      lead: "繼承人可依財產種類，向不同機構申請查詢。沒有一個窗口能查出全部遺產。",
      alt: "線條連起房屋與多份文件的水彩畫",
      items: {
        deposits: {
          tag: "存款",
          title: "日本的金融機構",
          text: "可向受理查詢的金融機構申請，查找家人生前已連結日本個人編號（My Number）的適用存款帳戶開在哪裡。未連結的帳戶不在查詢範圍內。查詢結果通知書只寄送到日本國內的地址。",
          source: "日本數位廳：存款帳戶與個人編號的連結制度（日文）"
        },
        securities: {
          tag: "股票等有價證券",
          title: "日本證券保管振替機構（JASDEC）",
          text: "可向 JASDEC 查詢適用帳戶開在哪一家證券公司等機構。要確認實際持有哪些股票、持股數量或帳戶餘額，須再向開戶機構查詢。",
          source: "JASDEC：股東與繼承人的查詢手續（日文）"
        },
        property: {
          tag: "不動產",
          title: "日本法務局",
          text: "繼承人可申請不動產持有紀錄證明，查找登記在家人名下的不動產。若查詢的姓名、地址等與登記資料不符，結果可能漏列。",
          source: "不動產持有紀錄證明制度（大阪市網站，PDF 第 5 頁）（日文）"
        },
        insurance: {
          tag: "人壽保險",
          title: "日本生命保險協會",
          text: "符合條件時，可向協會查詢會員公司是否有適用的保單。保障內容及如何申請理賠，請向相關保險公司確認。",
          source: "日本生命保險協會：保單查詢制度（日文）"
        }
      }
    },
    documents: {
      heading: "申請台灣印鑑證明前，先問清楚用途",
      lead: "在台灣申請印鑑證明時，可以視需要請戶政事務所註明「申請目的」，並非一律必填。只寫「繼承用」，不代表日本所有受理機構都會接受。",
      alt: "文件與印鑑的水彩畫",
      items: [
        [
          "交給日本的往來銀行",
          "台灣的戶政表格列有「金融機構存戶死亡，繼承人辦理存款繼承」這項用途。日本各銀行需要的文字、正本份數及是否要附日文譯本，請分別向各行確認。"
        ],
        [
          "辦理日本的不動產繼承登記",
          "表格另列「不動產登記」。限於存款繼承的證明，不一定能用於日本的不動產登記。應註明什麼用途、能否以簽名證明替代，請向日本管轄登記機關或司法書士確認。"
        ]
      ],
      sources: [
        "台灣內政部戶政司：印鑑證明如何註明申請目的",
        "台灣內政部戶政司：委任書所列的用途選項（PDF 第 40 頁）",
        "詳解印鑑證明與簽名證明",
        "如何在台灣申請除戶謄本"
      ],
      callout: "先問清楚各機構的要求再申請證明，可避免重辦。不必預設全家都要赴日。能否郵寄、委任他人辦理，誰要簽名、是否須親自到場，都要分別向日本各受理機構確認。"
    },
    deadlines: {
      heading: "3、4、10 個月：三種不同的手續",
      lead: "以下是日本制度的一般期限。哪些手續適用、何時起算，要分別確認。即使遺產還沒查清，也請先確認期限。",
      items: {
        renunciation: {
          duration: "3 個月",
          title: "拋棄繼承",
          text: "若適用日本民法，原則上須自得知自己因家人過世而成為繼承人時起，3 個月內向日本家庭裁判所提出拋棄繼承的聲明。",
          source: "日本裁判所：拋棄繼承（日文）"
        },
        finalTax: {
          duration: "4 個月",
          title: "為亡者申報所得稅",
          text: "如須替亡者申報所得稅，應自得知繼承開始的次日起 4 個月內申報，並繳納應納稅款。亡者生前出售股票而須申報的所得也在範圍內。這不是繼承人賣出股票或辦理過戶的期限。",
          source: "日本國稅廳：亡者的所得稅申報（日文）"
        },
        inheritanceTax: {
          duration: "10 個月",
          title: "日本遺產稅",
          text: "繼承人如須申報，應自得知自己成為繼承人之日（通常是得知死訊之日）的次日起 10 個月內申報，並繳納應納稅款。計算時，不動產、存款、股票等應稅財產須合併考量。若透過遺囑取得財產等，是否須申報及期限仍請向日本稅理士確認。",
          source: "日本國稅廳：遺產稅的申報與繳納（日文）"
        }
      }
    },
    consultation: {
      heading: "從第一次諮詢到辦理手續",
      alt: "幾個人圍坐桌旁核對文件的水彩畫",
      steps: [
        [
          "第一次諮詢",
          "先確認居住地、已知財產與手邊的文件，再一起整理哪些手續最急、還缺哪些文件。"
        ],
        [
          "費用估算",
          "本所會說明可以承辦的文件工作及費用。若需要其他專業服務，會由各承辦單位另行說明並報價。"
        ],
        [
          "簽約與委任書",
          "確認委任範圍及費用後才簽約，再依各項手續準備所需的委任書和證明文件。"
        ]
      ],
      roles: [
        [
          "日本行政書士",
          "在本所業務範圍內，協助整理、製作繼承文件。"
        ],
        [
          "日本司法書士",
          "辦理日本不動產的繼承登記。"
        ],
        [
          "日本稅理士",
          "判斷是否須申報，提供遺產稅與出售不動產相關稅務的個別諮詢，並辦理申報。"
        ],
        [
          "日本律師",
          "提供個案法律諮詢，處理繼承人之間的爭議；有需要時，本所可協助引介。"
        ],
        [
          "日本不動產業者",
          "如有意出售或出租房產，可洽詢不動產業者。"
        ]
      ],
      separateEngagements: "各項專業服務均由您直接與個別專業人士或機構簽約。費用也由各承辦方直接請款，您直接向該方付款。本所不收取介紹費。"
    },
    sale: {
      heading: "不必現在就決定是否賣房",
      text: "日本遺產稅與之後出售房產時就獲利課徵的所得稅，是兩件不同的事。由誰出售、何時出售、亡者取得房產的時間與成本，以及是否符合將部分遺產稅計入取得成本的條件，都可能影響稅後實際拿到的金額。決定如何出售前，請先與日本稅理士討論。",
      sources: [
        "日本國稅廳：繼承房產的取得成本與取得時間（日文）",
        "日本國稅廳：將部分遺產稅計入取得成本的特例（日文）"
      ]
    },
    contact: {
      heading: "先告訴我們您知道的情況",
      text: "四葉行政書士事務所提供日本繼承文件的諮詢。也請告訴我們您希望使用的諮詢語言。初次聯絡時，請勿傳送護照影像、銀行帳號或日本個人編號（My Number）。",
      primary: "聯絡四葉行政書士事務所",
      serviceOverview: "繼承與遺囑服務"
    },
    disclaimer: "本頁僅提供一般制度資訊。個案適用的法律、手續期限、應備文件及稅額，請向相應的專業人士確認。",
    checked: "資料查核日期：2026 年 11 月 22 日。"
  },
  zh: {
    hero: {
      eyebrow: "从台湾或其他地区办理日本继承手续",
      heading: [
        "家人在日本留下了房产或存款，",
        "从哪里开始办理继承？"
      ],
      lead: "如果家人可能在日本留下了财产，不必等材料齐全才联系我们。无论您在台湾还是其他地区，都可以先说说目前了解的情况，也不必现在就决定是否卖房。",
      contact: "咨询日本继承所需的文件",
      checklist: "初次咨询准备清单",
      language: "也可以用中文咨询。",
      alt: "海边住宅与对岸风景的淡彩画"
    },
    tocLabel: "本指南目录",
    toc: [
      "先确认什么？",
      "如何查找遗产？",
      "台湾的印鉴证明",
      "办理期限",
      "咨询流程"
    ],
    start: {
      heading: "初次咨询前，先整理三件事",
      lead: "不清楚的项目可以先注明“不知道”。首次联系时，不必提供身份证件图片或银行账号。",
      alt: "一家人围着绿色册子的水彩画",
      steps: [
        [
          "您是什么时候得知的？",
          "请记下家人去世的日期，以及您得知消息的日期。如果您是在另一天才知道自己成了继承人，也请记下那一天。"
        ],
        [
          "家人最后住在哪里？您现在住在哪里？",
          "请记下家人生前最后居住的地方，以及您目前居住的国家或地区。初次咨询不需要详细地址。"
        ],
        [
          "在日本可能有哪些财产？",
          "例如房产、土地、存款、股票或保险。如果手头有相关文件，先记下有哪些即可。"
        ]
      ]
    },
    assets: {
      heading: "不清楚家人留下了哪些财产，向谁查询？",
      lead: "继承人可以按财产类别向不同机构申请查询。没有一个窗口能查出全部遗产。",
      alt: "房屋与多份文件之间以线条相连的水彩画",
      items: {
        deposits: {
          tag: "存款",
          title: "日本的金融机构",
          text: "可向受理查询的金融机构申请，查找家人生前已关联日本个人编号（My Number）的适用存款账户开在哪里。未关联的账户不在查询范围内。查询结果通知书仅寄送至日本境内的地址。",
          source: "日本数字厅：存款账户关联个人编号制度（日文）"
        },
        securities: {
          tag: "股票等证券",
          title: "日本证券保管振替机构（JASDEC）",
          text: "可向 JASDEC 查询适用账户开在哪家证券公司等机构。要确认实际持有哪些股票、持股数量或账户余额，须再向开户机构查询。",
          source: "JASDEC：股东与继承人的查询手续（日文）"
        },
        property: {
          tag: "不动产",
          title: "日本法务局",
          text: "继承人可申请不动产持有记录证明，查找登记在家人名下的不动产。查询使用的姓名、地址等与登记信息不符时，结果可能有遗漏。",
          source: "不动产持有记录证明制度（大阪市网站，PDF 第 5 页）（日文）"
        },
        insurance: {
          tag: "人寿保险",
          title: "日本生命保险协会",
          text: "符合条件时，可向协会查询会员公司是否有相关保单。保险责任及如何理赔，请向相应的保险公司确认。",
          source: "日本生命保险协会：保单查询制度（日文）"
        }
      }
    },
    documents: {
      heading: "申请台湾印鉴证明前，先问清用途",
      lead: "在台湾申请印鉴证明时，可以根据需要请户政事务所注明用途（原文为“申請目的”），并非一律必填。只写“继承用”，并不意味着日本所有受理机构都会接受。",
      alt: "文件与印章的水彩画",
      items: [
        [
          "提交给日本的银行",
          "台湾户政部门的表格中列有办理存款继承的选项（原文为“金融機構存戶死亡，繼承人辦理存款繼承”）。具体写法、所需原件份数及是否要附日文译本，请分别向日本各经办银行确认。"
        ],
        [
          "办理日本的不动产继承登记",
          "表格另列不动产登记用途（原文为“不動產登記”）。仅限存款继承的证明，未必能用于日本的不动产登记。用途如何填写、能否以签名证明替代，请向日本主管登记机构或司法书士确认。"
        ]
      ],
      sources: [
        "台湾户政部门：如何在印鉴证明上注明用途（繁体中文）",
        "台湾户政部门：委托书列出的用途选项（PDF 第 40 页）（繁体中文）",
        "印鉴证明与签名证明详解",
        "如何在台湾申请除户证明"
      ],
      callout: "先问清各机构的要求再申请证明，可以避免重新办理。不必预设全家人都要赴日。能否邮寄、委托他人办理，谁需要签字、是否须本人到场，都要分别向日本各受理机构确认。"
    },
    deadlines: {
      heading: "3、4、10 个月：三种不同的手续",
      lead: "以下是日本制度的一般期限。哪些手续适用、从哪天起算，需要分别确认。即使遗产还没查清，也请先确认期限。",
      items: {
        renunciation: {
          duration: "3 个月",
          title: "放弃继承",
          text: "如果适用日本民法，原则上须从得知自己因家人去世而成为继承人时起，在 3 个月内向日本家庭裁判所提出放弃继承的声明。",
          source: "日本法院：放弃继承（日文）"
        },
        finalTax: {
          duration: "4 个月",
          title: "为逝者申报个人所得税",
          text: "如需替逝者申报所得税，应从得知继承开始的次日起，在 4 个月内申报，并缴纳应纳税款。逝者生前出售股票所产生的应申报收益也在范围内。这不是继承人出售股票或办理过户的期限。",
          source: "日本国税厅：逝者的所得税申报（日文）"
        },
        inheritanceTax: {
          duration: "10 个月",
          title: "日本遗产税",
          text: "继承人如需申报，应从得知自己成为继承人之日（通常是得知死讯之日）的次日起，在 10 个月内申报，并缴纳应纳税款。计算时，要将不动产、存款、股票等应税财产合并考虑。如通过遗嘱取得财产等，是否需要申报及期限仍请向日本税理士确认。",
          source: "日本国税厅：遗产税的申报与缴纳（日文）"
        }
      }
    },
    consultation: {
      heading: "从初次咨询到办理手续",
      alt: "几人围坐桌旁核对文件的水彩画",
      steps: [
        [
          "初次咨询",
          "先确认居住地、已知财产和手头已有的材料，再一起梳理哪些手续最紧急、还缺哪些文件。"
        ],
        [
          "费用估算",
          "本所会说明可承办的文件工作和费用。如需其他专业服务，由各承办机构另外说明并报价。"
        ],
        [
          "签约与委托书",
          "确认委托范围和费用后再签约，然后根据各项手续准备相应的委托书和证明文件。"
        ]
      ],
      roles: [
        [
          "日本行政书士",
          "在本所的业务范围内，协助整理、制作继承文件。"
        ],
        [
          "日本司法书士",
          "办理日本不动产的继承登记。"
        ],
        [
          "日本税理士",
          "判断是否需要申报，提供有关遗产税和出售房产税务的个案咨询，并办理申报。"
        ],
        [
          "日本律师",
          "提供个案法律咨询，处理继承人之间的争议；如有需要，本所可协助介绍律师。"
        ],
        [
          "日本房地产经纪机构",
          "如希望出售或出租房产，可以向房地产经纪机构咨询。"
        ]
      ],
      separateEngagements: "各项专业服务均由您直接与相应的专业人士或机构分别签约。各承办方分别向您收费，您直接向该方付款。本所不收取介绍费。"
    },
    sale: {
      heading: "不必现在就决定是否卖房",
      text: "日本遗产税与之后出售房产时就收益缴纳的所得税，是两种不同的税。由谁出售、何时出售、逝者取得房产的时间和成本，以及是否符合将部分遗产税计入取得成本的条件，都可能影响税后实际拿到的金额。决定如何出售前，建议先咨询日本税理士。",
      sources: [
        "日本国税厅：继承房产的取得成本和取得时间（日文）",
        "日本国税厅：将部分遗产税计入取得成本的特别规定（日文）"
      ]
    },
    contact: {
      heading: "先告诉我们您知道的情况",
      text: "四葉行政書士事務所提供有关日本继承文件的咨询。请一并告知您希望使用的咨询语言。首次联系时，请勿发送护照图片、银行账号或日本个人编号（My Number）。",
      primary: "联系四葉行政書士事務所",
      serviceOverview: "继承与遗嘱服务"
    },
    disclaimer: "本页仅介绍一般制度。具体案件适用的法律、办理期限、所需材料和税额，请向相应的专业人士确认。",
    checked: "资料核对日期：2026 年 11 月 22 日。"
  },
  en: {
    hero: {
      eyebrow: "Japanese inheritance procedures for families abroad",
      heading: [
        "A home or savings in Japan?",
        "Where to start with an inheritance"
      ],
      lead: "If a family member may have left assets in Japan, you can contact us from Taiwan or elsewhere before you have all the paperwork. Start with what you know. You do not need to decide now whether to sell the home.",
      contact: "Ask about inheritance paperwork",
      checklist: "First consultation checklist",
      language: "Chinese-language consultations are also available.",
      alt: "Watercolor of homes on the coast, with land visible across the water"
    },
    tocLabel: "In this guide",
    toc: [
      "Where to start",
      "Finding assets",
      "Taiwanese seal certificates",
      "Deadlines",
      "What to expect"
    ],
    start: {
      heading: "Three things to note before you contact us",
      lead: "It is fine to say you do not know. There is no need to send copies of identity documents or bank account numbers in your first message.",
      alt: "Watercolor of a family gathered around a green booklet",
      steps: [
        [
          "When did you find out?",
          "Note the date your family member died and the date you learned of their death. If you learned that you were an heir on a different day, note that date too."
        ],
        [
          "Where did your family member live? Where do you live now?",
          "Note your family member’s last place of residence and the country or region where you live. We do not need full street addresses for the first consultation."
        ],
        [
          "What might your family member have owned?",
          "Think of homes or land in Japan, bank deposits, shares and life insurance. Make a note of any related paperwork you already have."
        ]
      ]
    },
    assets: {
      heading: "Where can I look for assets in Japan?",
      lead: "Heirs can request different searches for different types of assets. No single search covers the whole estate.",
      alt: "Watercolor of a house linked by lines to several documents",
      items: {
        deposits: {
          tag: "Bank deposits",
          title: "Participating Japanese financial institutions",
          text: "A participating institution may be able to tell you where eligible deposit accounts were held if the deceased had linked them to their Japanese individual identification number (My Number) during their lifetime. The search does not cover unlinked accounts. The results are mailed only to an address in Japan.",
          source: "Japan’s Digital Agency: My Number and deposit accounts (Japanese)"
        },
        securities: {
          tag: "Shares and other securities",
          title: "Japan Securities Depository Center (JASDEC)",
          text: "JASDEC can identify the firms where eligible accounts were opened. To find out which securities were held, in what quantities, or what the balance was, you need to ask each firm.",
          source: "JASDEC: account inquiries by shareholders and heirs (Japanese)"
        },
        property: {
          tag: "Real estate",
          title: "Japan’s Legal Affairs Bureaus",
          text: "Heirs can request an ownership records certificate to look for real estate registered in the deceased’s name. A property can be missed if, for example, the name or address used in the search does not match the register.",
          source: "Government guide to property ownership records (City of Osaka, PDF, p. 5) (Japanese)"
        },
        insurance: {
          tag: "Life insurance",
          title: "Life Insurance Association of Japan",
          text: "If the eligibility requirements are met, you can ask whether a member insurer has a qualifying policy. Ask the insurer itself about coverage and how to make a claim.",
          source: "Life Insurance Association of Japan: policy inquiries (Japanese)"
        }
      }
    },
    documents: {
      heading: "What purpose should a Taiwanese seal certificate state?",
      lead: "In Taiwan, you can ask the household registration office to state a purpose on your seal certificate, but it is not required in every case. Writing “for inheritance” does not mean that every institution in Japan will accept it.",
      alt: "Watercolor of paperwork and a personal seal",
      items: [
        [
          "For a Japanese bank",
          "Taiwan’s forms list a purpose for inheriting bank deposits: “金融機構存戶死亡，繼承人辦理存款繼承”. Before applying, ask each Japanese bank what wording it accepts, how many originals it needs and whether it requires a Japanese translation."
        ],
        [
          "For Japanese property registration",
          "“不動產登記” (property registration) is a separate purpose on the Taiwanese form. A certificate limited to bank deposits may not be accepted for registration in Japan. Ask the relevant Japanese registry or a Japanese judicial scrivener what wording is needed and whether a signature certificate is an acceptable alternative."
        ]
      ],
      sources: [
        "Taiwan’s Department of Household Registration: stating the purpose on a seal certificate (Traditional Chinese)",
        "Taiwan’s Department of Household Registration: purpose options on the authorization form (PDF, p. 40) (Traditional Chinese)",
        "Guide to seal and signature certificates",
        "How to obtain a Taiwanese household record for a deceased person"
      ],
      callout: "Check each recipient’s requirements before ordering certificates to avoid having to apply again. Do not assume that everyone must travel to Japan. Ask each Japanese institution what can be done by post or by an authorized representative, whose signature is needed and who must attend in person."
    },
    deadlines: {
      heading: "3, 4 and 10 months: three different procedures",
      lead: "These are general time limits under Japan’s rules. Whether a procedure applies, and when the clock starts, depends on the procedure. Check deadlines even if you have not found all the assets yet.",
      items: {
        renunciation: {
          duration: "3 months",
          title: "Renouncing an inheritance",
          text: "If Japan’s Civil Code applies, you generally have three months from learning that the death made you an heir to file a declaration of renunciation with a Japanese family court.",
          source: "Courts in Japan: renouncing an inheritance (Japanese)"
        },
        finalTax: {
          duration: "4 months",
          title: "The deceased’s final income tax return",
          text: "If a return is required, file it and pay any tax due within four months, counting from the day after you learned the inheritance had begun. This includes any reportable gains on shares the deceased sold before death. It is not a deadline for heirs to sell shares or transfer them into their names.",
          source: "Japan’s National Tax Agency: the deceased’s final income tax return (Japanese)"
        },
        inheritanceTax: {
          duration: "10 months",
          title: "Japanese inheritance tax",
          text: "If you are an heir and must file, file your return and pay any tax due within ten months, counting from the day after you learned you were an heir (usually when you learned of the death). The calculation takes taxable assets together, including property, deposits and shares. If you receive assets under a will, ask a Japanese tax accountant whether you need to file and what deadline applies.",
          source: "Japan’s National Tax Agency: filing and paying inheritance tax (Japanese)"
        }
      }
    },
    consultation: {
      heading: "What happens after you get in touch?",
      alt: "Watercolor of people reviewing documents together at a table",
      steps: [
        [
          "First consultation",
          "We review where you live, the assets you know about and the documents you have. Together we identify the most urgent steps and any missing paperwork."
        ],
        [
          "Fee estimate",
          "We explain which documents our office can prepare and what we charge. Any other professional you need will explain their own services and fees separately."
        ],
        [
          "Engagement and powers of attorney",
          "Once you agree on the scope of the work and the fees, you sign the relevant agreement. Powers of attorney and supporting documents are then prepared as each procedure requires."
        ]
      ],
      roles: [
        [
          "Administrative scrivener",
          "Helps gather and prepare inheritance documents within our office’s licensed scope of work in Japan."
        ],
        [
          "Judicial scrivener",
          "Handles Japanese property registration when real estate is inherited."
        ],
        [
          "Japanese tax accountant",
          "Advises on whether a return is needed, gives individual advice on inheritance tax or tax on a sale, and prepares tax filings."
        ],
        [
          "Lawyer",
          "Gives legal advice and handles disputes between heirs. We can introduce a lawyer if needed."
        ],
        [
          "Real estate agent",
          "Advises on selling or renting out a property if you decide to do so."
        ]
      ],
      separateEngagements: "You engage each professional or firm directly under a separate agreement. Each provider bills you separately and you pay them directly. Our office receives no referral fees."
    },
    sale: {
      heading: "You can decide later whether to sell the home",
      text: "Japanese inheritance tax is separate from tax on any gain when an inherited property is sold. The seller, the timing of the sale, and the deceased’s original purchase date and acquisition costs can affect what you keep. If the conditions are met, part of the inheritance tax can be added to the property’s cost basis. Discuss your options with a Japanese tax accountant before deciding how to sell.",
      sources: [
        "Japan’s National Tax Agency: acquisition cost and date for inherited property (Japanese)",
        "Japan’s National Tax Agency: when inheritance tax can be added to the cost basis (Japanese)"
      ]
    },
    contact: {
      heading: "Tell us what you know so far",
      text: "Contact Yotsuba Administrative Scrivener Office about inheritance paperwork in Japan and let us know your preferred language. Please do not send passport images, bank account numbers or Japanese individual identification numbers (My Number) in your first message.",
      primary: "Contact Yotsuba Administrative Scrivener Office",
      serviceOverview: "Inheritance and wills services"
    },
    disclaimer: "This guide gives general information only. Check the governing law, deadlines, documents and tax amounts for your situation with the relevant professional.",
    checked: "Sources checked: 22 November 2026."
  }
};
