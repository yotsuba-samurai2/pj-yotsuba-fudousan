import type { LangCode } from "@/config/languages";

/**
 * /labor/services/dattai-ichijikin（脱退一時金の請求）の4ロケール文言。2026-10-21 新設（浦松指示）。
 *
 * 方式＝手本B（shogai-nenkin-copy.ts と同型。COPY を src/lib/labor/ に切り出し、page.tsx は描画だけ）。
 * 料金の正本＝/labor/ryokin の「脱退一時金（帰国する外国人のお客さま）」セクション
 *   （src/lib/labor/ancillary-fees.ts の id "dattai-ichijikin"。1人44,000円・税込）。
 * 制度の根拠＝厚生年金保険法附則第29条・国民年金法附則第9条の3の2（2年の起算＝2026-10-21 e-Gov法令APIで確認）、
 *   支給上限60か月＝日本年金機構「脱退一時金の制度」（2026-04-01更新）。
 * 関連コラム＝166（帰国後・2年）／167（配偶者・第3号・10年）／168（会社をたたむ経営者）。
 *
 * 【書かないこと】支給額の計算式・支給率・源泉徴収の税率・支給までの標準日数（改定・個別差のため）。
 *   協定国の一覧はコラム166に置き、本ページは「確かめる」までに留める。
 * 【業際】請求書の作成・提出代行＝社会保険労務士（社労士法第2条第1項第1号・第1号の2）／
 *   源泉徴収された所得税の還付申告＝税理士／在留資格・再入国許可＝行政書士（四葉行政書士事務所＝別事業体・別契約）／
 *   紛争＝弁護士（紹介料の授受なし）。業務独占を断定する語は使わない（shogai-nenkin と同じ強さ）。
 * 【翻訳の規律】shogai-nenkin-copy.ts と同じ（見出し数・段落数を日本語版と揃える／事務所名は日本語表記のまま／
 *   分離受任は 繁体字＝另行簽訂契約承辦・簡体字＝另行签订合同承办）。
 */
export type DattaiIchijikinCopy = {
  metaTitle: string;
  metaDescription: string;
  keywords: readonly string[];
  crumbLabel: string;
  serviceName: string;
  heroAlt: string;
  h1: string;
  /** リード文＝[前半, 強調, 後半] */
  lead: readonly [string, string, string];
  internalLinks: readonly { href: string; label: string }[];
  crossLinkLead: string;
  s1H2: string;
  s1P1: string;
  s1TableHead: readonly [string, string];
  s1Rows: readonly { name: string; val: string }[];
  s1Note: string;
  s2H2: string;
  s2P1: string;
  s2Items: readonly { strong: string; rest: string }[];
  /** [前半, 強調, 後半] */
  s2Note: readonly [string, string, string];
  s3H2: string;
  /** [前半, 強調, 後半] */
  s3P1: readonly [string, string, string];
  /** [前半, 料金ページへのリンク文言, 後半] */
  s3Note: readonly [string, string, string];
  s4H2: string;
  s4P1: string;
  s4Items: readonly { strong: string; rest: string }[];
  /** [前半, コラム166へのリンク文言, 後半] */
  s4Note: readonly [string, string, string];
  s5H2: string;
  s5P1: string;
  s6H2: string;
  /** 番号は描画側で付ける。訳文に番号を書かない */
  s6Steps: readonly string[];
  /** [前半, 流れページへのリンク文言, 後半] */
  s6Note: readonly [string, string, string];
};

const COL1 = "/labor/column/dattai-ichijikin-kikoku-go-2nen-inai";
const COL2 = "/labor/column/dattai-ichijikin-haigusha-dai3go-60kagetsu";
const COL3 = "/labor/column/gaikokujin-keieisha-kikoku-zensou-kanpu-dattai";

const JA: DattaiIchijikinCopy = {
  metaTitle: "脱退一時金の請求｜四葉社会保険労務士事務所",
  metaDescription:
    "日本を離れる外国籍の方の、年金の脱退一時金の請求を文京区の四葉社会保険労務士事務所が承ります。年金記録の確認から請求書の作成・提出代行、支給までの連絡まで、1人44,000円（税込）。帰国後のご依頼、英語・中国語でのご相談もお受けします。顧問契約は必要ありません。",
  keywords: [
    "脱退一時金 社労士",
    "脱退一時金 代行",
    "脱退一時金 帰国後 請求",
    "脱退一時金 文京区",
    "脱退一時金 英語 相談",
    "脱退一時金 中国語",
  ],
  crumbLabel: "脱退一時金の請求",
  serviceName: "脱退一時金の請求のサポート",
  heroAlt: "空港の窓辺で年金の請求書類を確かめる夫婦のイメージ",
  h1: "脱退一時金の請求",
  lead: [
    "日本の公的年金に加入していた外国籍の方が、日本を離れたあとに受け取れるのが脱退一時金です。",
    "請求書の作成・提出代行は、社会保険労務士の業務です",
    "（社会保険労務士法第2条第1項第1号・第1号の2）。四葉社会保険労務士事務所（東京都文京区小日向）は、出国前の準備から帰国後の請求、支給の確認までをお手伝いします。顧問契約は必要ありません。",
  ],
  internalLinks: [
    { href: "/labor/ryokin#dattai-ichijikin", label: "脱退一時金の料金" },
    { href: COL1, label: "帰国後でも請求できるか（「2年」の数え方）" },
    { href: COL2, label: "扶養に入っていた配偶者の計算と「10年」" },
    { href: COL3, label: "会社をたたんで帰国する経営者の手順" },
    { href: "/labor/services/gaikokujin-koyo", label: "外国人雇用の労務" },
  ],
  crossLinkLead:
    "在留資格の手続きは四葉行政書士事務所、日本に残る住まいのご相談は四葉不動産株式会社が、それぞれ別の契約で受任します。",
  s1H2: "脱退一時金は、どんな人が請求できますか？",
  s1P1: "日本の国民年金・厚生年金保険に加入していた方が、次の条件をすべて満たすときに請求できます。",
  s1TableHead: ["条件", "内容"],
  s1Rows: [
    { name: "国籍", val: "日本国籍を有していないこと" },
    { name: "加入期間", val: "厚生年金保険の加入期間、または国民年金（第1号）の保険料を納めた期間などが6か月以上あること" },
    { name: "受給資格", val: "老齢年金の受給資格期間（10年）を満たしていないこと" },
    { name: "住所", val: "日本国内に住所がないこと" },
    { name: "その他", val: "障害年金などを受ける権利を持ったことがないこと" },
    {
      name: "期限",
      val: "最後に年金の資格を失った日から2年以内に請求すること（その日に日本に住所があったときは、住所がなくなった日から2年以内）",
    },
  ],
  s1Note:
    "支給額は、加入期間（上限60か月）とその間の報酬・保険料をもとに日本年金機構が計算します。厚生年金保険の脱退一時金からは所得税が源泉徴収されます。個別の請求の可否は、年金記録を確認したうえで資格者が整理します。",
  s2H2: "当事務所は、何をしますか？",
  s2P1: "脱退一時金の請求では、次のことをお引き受けします。関わる専門家の役割も分けてご案内します。",
  s2Items: [
    { strong: "年金記録の確認", rest: "＝年金事務所で記録を確かめ、請求できるか、何か月分になるかを整理します" },
    { strong: "請求書の作成・提出代行", rest: "＝社会保険労務士（当事務所）。転出（予定）日より後に日本年金機構に届くよう提出します" },
    { strong: "支給までの連絡", rest: "＝日本年金機構からの照会や通知に、代理人として対応します" },
    { strong: "源泉徴収された所得税の還付申告", rest: "＝税理士（ご本人が選んだ税理士・納税管理人を通じて行います）" },
    { strong: "在留資格・再入国許可", rest: "＝行政書士（四葉行政書士事務所・別事業体・別契約）" },
    { strong: "争いのある事案", rest: "＝弁護士（おつなぎします。紹介料の授受は行いません）" },
  ],
  s2Note: [
    "「10年」は日本に住んだ年数ではなく、年金記録の月数で数えます。",
    "日本に10年以上住んでいても、記録を確かめると120か月に届いておらず、請求できることがあります",
    "。あきらめる前に、年金記録を確認してください。",
  ],
  s3H2: "料金はいくらですか？",
  s3P1: [
    "",
    "1人44,000円（税込）です",
    "。ご夫婦で請求する場合は2人分になります。初回のご相談は無料です。",
  ],
  s3Note: [
    "郵送・書類取得等の実費は別途申し受けます。詳しくは",
    "料金ページ",
    "の「脱退一時金（帰国する外国人のお客さま）」をご覧ください。",
  ],
  s4H2: "請求する前に、確かめることはありますか？",
  s4P1:
    "脱退一時金を受け取ると、その計算のもとになった日本の加入期間はなくなります。次の方は、請求する前に損得を確かめてください。",
  s4Items: [
    {
      strong: "出身国が日本と社会保障協定を結んでいる方",
      rest: "＝協定の相手国によっては、日本の加入期間を自国の年金に通算できます。脱退一時金を受け取ると、通算できる期間もなくなります",
    },
    { strong: "将来、日本に戻って働く予定のある方", rest: "＝受け取った期間は、将来の老齢年金の受給資格期間に数えられなくなります" },
    { strong: "加入期間が10年に近い方", rest: "＝10年を満たすと脱退一時金は請求できず、代わりに将来の老齢年金が残ります" },
  ],
  s4Note: [
    "協定を結んでいる国と、通算できるかどうかは、コラム",
    "「脱退一時金は帰国後でも請求できるのか」",
    "に一覧で整理しています。",
  ],
  s5H2: "帰国したあとでも頼めますか？",
  s5P1:
    "はい。期限の2年以内であれば、帰国後でも請求できます。メールでご連絡いただき、委任状や受取口座の証明を海外から郵送していただく形で進めます。ただ、基礎年金番号の確認や受取口座の証明は、帰国後にそろえるのに手間がかかることがあります。日本を離れる前にご相談いただくと、手続きが早く進みます。英語・中国語でもご相談いただけます。",
  s6H2: "依頼するとき、どんな流れになりますか？",
  s6Steps: [
    "無料相談（来所・オンライン・メール。英語・中国語でも承ります）",
    "年金記録の確認（請求できるか、何か月分になるかを確かめます）",
    "ご契約と書類の準備（請求書・委任状への署名、受取口座の証明。出国前に済ませると確実です）",
    "転出届の提出と出国（ご本人）",
    "請求書の提出（転出日より後に日本年金機構に届くよう、当事務所から送ります）",
    "支給の確認（支給決定の通知と入金を確かめ、還付申告をする税理士への引き継ぎ資料をお渡しします）",
  ],
  s6Note: [
    "支給までの期間は、日本年金機構の処理によります。ご相談から契約までの流れは",
    "受任の流れ",
    "をご覧ください。",
  ],
};

const EN: DattaiIchijikinCopy = {
  metaTitle: "Claiming the Lump-sum Withdrawal Payment｜四葉社会保険労務士事務所",
  metaDescription:
    "四葉社会保険労務士事務所 in Bunkyo, Tokyo handles claims for the lump-sum withdrawal payment (脱退一時金) of the Japanese pension for foreign nationals leaving Japan. From checking pension records to preparing and submitting the claim and liaising until payment: ¥44,000 per person (tax-inclusive). We also accept requests after you have left Japan, and consultations in English and Chinese. No advisory contract is required.",
  keywords: [
    "lump-sum withdrawal payment Japan",
    "Japan pension refund leaving Japan",
    "dattai ichijikin claim",
    "Japanese pension lump sum after returning home",
    "lump-sum withdrawal payment agent Tokyo",
  ],
  crumbLabel: "Lump-sum withdrawal payment",
  serviceName: "Support for claiming the lump-sum withdrawal payment",
  heroAlt: "Illustration of a couple checking pension claim documents by an airport window",
  h1: "Claiming the Lump-sum Withdrawal Payment (脱退一時金)",
  lead: [
    "Foreign nationals who were enrolled in Japan's public pension can receive the lump-sum withdrawal payment (脱退一時金) after leaving Japan. ",
    "Preparing and submitting the claim on your behalf is the work of a Certified Social Insurance and Labor Consultant (社会保険労務士)",
    " (Article 2, paragraph 1, items 1 and 1-2 of the 社会保険労務士法). 四葉社会保険労務士事務所 (Kohinata, Bunkyo, Tokyo) helps from preparation before departure through the claim after you return home and confirmation of payment. No advisory contract is required.",
  ],
  internalLinks: [
    { href: "/labor/ryokin#dattai-ichijikin", label: "Fees for the lump-sum withdrawal payment" },
    { href: COL1, label: "Can you claim after returning home? (counting the “two years”)" },
    { href: COL2, label: "Calculation for a dependent spouse and the “10 years”" },
    { href: COL3, label: "Steps for a business owner closing a company and leaving Japan" },
    { href: "/labor/services/gaikokujin-koyo", label: "Labor management for foreign employees" },
  ],
  crossLinkLead:
    "Residence status procedures are handled by 四葉行政書士事務所, and consultations about a home left in Japan by 四葉不動産株式会社, each under a separate contract.",
  s1H2: "Who can claim the lump-sum withdrawal payment?",
  s1P1:
    "People who were enrolled in Japan's National Pension (国民年金) or Employees' Pension Insurance (厚生年金保険) can claim when they meet all of the following conditions.",
  s1TableHead: ["Condition", "Details"],
  s1Rows: [
    { name: "Nationality", val: "You do not hold Japanese nationality" },
    {
      name: "Enrollment period",
      val: "You have at least six months of Employees' Pension Insurance coverage, or of paid National Pension (Category 1) premiums, etc.",
    },
    { name: "Pension eligibility", val: "You do not meet the 10-year qualifying period for the old-age pension" },
    { name: "Address", val: "You have no address in Japan" },
    { name: "Other", val: "You have never had the right to receive a disability pension or similar benefit" },
    {
      name: "Deadline",
      val: "You claim within two years of the date you last lost your pension coverage (if you still had an address in Japan on that date, within two years of the date you ceased to have one)",
    },
  ],
  s1Note:
    "The Japan Pension Service calculates the amount from the enrollment period (capped at 60 months) and the pay and premiums during that time. Income tax is withheld from the Employees' Pension Insurance lump-sum withdrawal payment. Whether an individual can claim is assessed by a qualified professional after checking the pension records.",
  s2H2: "What does our office do?",
  s2P1:
    "For the lump-sum withdrawal payment claim, we take on the following. We also set out the roles of the other professionals involved.",
  s2Items: [
    {
      strong: "Checking pension records",
      rest: " — we confirm the records at the pension office and work out whether you can claim and how many months will count",
    },
    {
      strong: "Preparing and submitting the claim",
      rest: " — a Certified Social Insurance and Labor Consultant (our office). We submit it so that it reaches the Japan Pension Service after your (planned) moving-out date",
    },
    { strong: "Liaison until payment", rest: " — we respond to enquiries and notices from the Japan Pension Service as your agent" },
    {
      strong: "Tax return to recover the withheld income tax",
      rest: " — a tax accountant (税理士), through the tax accountant / tax agent (納税管理人) you appoint",
    },
    {
      strong: "Residence status and re-entry permits",
      rest: " — an administrative scrivener (四葉行政書士事務所: a separate business, under a separate contract)",
    },
    { strong: "Disputed matters", rest: " — a lawyer (we will connect you; no referral fees are given or received)" },
  ],
  s2Note: [
    "The “10 years” is counted not in years of living in Japan but in months on your pension record. ",
    "Even if you have lived in Japan for more than 10 years, your record may fall short of 120 months, and you may still be able to claim",
    ". Please check your pension record before giving up.",
  ],
  s3H2: "How much does it cost?",
  s3P1: [
    "",
    "¥44,000 per person (tax-inclusive)",
    ". If a couple both claim, the fee is for two people. The first consultation is free.",
  ],
  s3Note: [
    "Out-of-pocket costs such as postage and document fees are charged separately. For details, see “Lump-sum withdrawal payment (foreign clients leaving Japan)” on the ",
    "fees page",
    ".",
  ],
  s4H2: "Is there anything to check before claiming?",
  s4P1:
    "Once you receive the lump-sum withdrawal payment, the Japanese enrollment period it was calculated from is erased. If any of the following applies to you, weigh the pros and cons before claiming.",
  s4Items: [
    {
      strong: "Your home country has a social security agreement with Japan",
      rest: " — depending on the country, your Japanese enrollment period can be totalized with your home country's pension. Receiving the lump-sum withdrawal payment also erases the period that could have been totalized",
    },
    {
      strong: "You may come back to work in Japan in future",
      rest: " — the period you were paid for will no longer count toward the qualifying period for a future old-age pension",
    },
    {
      strong: "Your enrollment period is close to 10 years",
      rest: " — once you reach 10 years you can no longer claim the lump-sum withdrawal payment; a future old-age pension remains instead",
    },
  ],
  s4Note: [
    "Which countries have an agreement and whether totalization is possible are listed in our column ",
    "“Can you claim the lump-sum withdrawal payment after returning home?”",
    ".",
  ],
  s5H2: "Can I ask you after I have returned home?",
  s5P1:
    "Yes. Within the two-year deadline, you can claim after returning home. You contact us by email and post the power of attorney and proof of your receiving account from abroad. However, confirming your Basic Pension Number and obtaining proof of your receiving account can take time once you have left. Consulting us before you leave Japan makes the process quicker. Consultations are available in English and Chinese.",
  s6H2: "What is the process when I ask you?",
  s6Steps: [
    "Free consultation (in person, online or by email; English and Chinese available)",
    "Checking your pension record (whether you can claim and how many months will count)",
    "Contract and document preparation (signing the claim form and power of attorney, proof of your receiving account; doing this before departure is the surest way)",
    "Moving-out notification and departure (by you)",
    "Submitting the claim (our office sends it so that it reaches the Japan Pension Service after your moving-out date)",
    "Confirming payment (we check the payment decision notice and the deposit, and hand over materials for the tax accountant who files the refund return)",
  ],
  s6Note: [
    "The time until payment depends on the Japan Pension Service's processing. For the steps from consultation to contract, see ",
    "our engagement process",
    ".",
  ],
};

const ZH_TW: DattaiIchijikinCopy = {
  metaTitle: "脫退一時金的請求｜四葉社会保険労務士事務所",
  metaDescription:
    "位於東京文京區的四葉社会保険労務士事務所，承辦即將離開日本的外國籍人士之年金脫退一時金（退出時一次性給付）請求。從確認年金記錄、製作與代為提出請求書，到支付為止的聯繫，每人44,000日圓（含稅）。回國後也可委託，並可用中文・英文諮詢。不需顧問契約。",
  keywords: [
    "脫退一時金 社勞士",
    "日本年金 退款 回國",
    "脫退一時金 回國後 請求",
    "日本 年金 一次性給付 代辦",
    "脫退一時金 中文 諮詢",
  ],
  crumbLabel: "脫退一時金的請求",
  serviceName: "脫退一時金請求的協助",
  heroAlt: "在機場窗邊確認年金請求文件的夫妻示意圖",
  h1: "脫退一時金的請求",
  lead: [
    "曾加入日本公的年金的外國籍人士，在離開日本後可以領取脫退一時金（退出時一次性給付）。",
    "請求書的製作・代為提出，是社會保險勞務士的業務",
    "（社会保険労務士法第2條第1項第1號・第1號之2）。四葉社会保険労務士事務所（東京都文京區小日向）從出國前的準備、回國後的請求，到確認支付，全程協助。不需顧問契約。",
  ],
  internalLinks: [
    { href: "/labor/ryokin#dattai-ichijikin", label: "脫退一時金的費用" },
    { href: COL1, label: "回國後還能請求嗎（「2年」的算法）" },
    { href: COL2, label: "曾為配偶扶養者的計算與「10年」" },
    { href: COL3, label: "結束公司後回國的經營者之手續順序" },
    { href: "/labor/services/gaikokujin-koyo", label: "外國人僱用的勞務管理" },
  ],
  crossLinkLead:
    "在留資格的手續由四葉行政書士事務所、留在日本的住居諮詢由四葉不動産株式会社，分別另行簽訂契約承辦。",
  s1H2: "什麼人可以請求脫退一時金？",
  s1P1: "曾加入日本國民年金・厚生年金保險的人士，在符合以下全部條件時可以請求。",
  s1TableHead: ["條件", "內容"],
  s1Rows: [
    { name: "國籍", val: "不具有日本國籍" },
    { name: "加入期間", val: "厚生年金保險的加入期間，或國民年金（第1號）保險費繳納期間等達6個月以上" },
    { name: "受給資格", val: "未滿足老齡年金的受給資格期間（10年）" },
    { name: "住所", val: "在日本國內沒有住所" },
    { name: "其他", val: "從未取得領取障害年金等的權利" },
    {
      name: "期限",
      val: "在最後喪失年金資格之日起2年內請求（該日在日本仍有住所時，自不再有住所之日起2年內）",
    },
  ],
  s1Note:
    "支付金額由日本年金機構依加入期間（上限60個月）及該期間的報酬・保險費計算。厚生年金保險的脫退一時金會被預扣所得稅。個別能否請求，由具資格者在確認年金記錄後整理判斷。",
  s2H2: "本事務所做什麼？",
  s2P1: "在脫退一時金的請求上，本事務所承辦以下事項。相關專家的角色也分開說明。",
  s2Items: [
    { strong: "確認年金記錄", rest: "＝在年金事務所確認記錄，整理能否請求、可計入幾個月" },
    { strong: "請求書的製作・代為提出", rest: "＝社會保險勞務士（本事務所）。安排在轉出（預定）日之後送達日本年金機構" },
    { strong: "至支付為止的聯繫", rest: "＝以代理人身分回應日本年金機構的詢問與通知" },
    { strong: "被預扣所得稅的退稅申報", rest: "＝稅理士（透過本人選任的稅理士・納稅管理人辦理）" },
    { strong: "在留資格・再入國許可", rest: "＝行政書士（四葉行政書士事務所・獨立事業體・另行簽訂契約承辦）" },
    { strong: "有爭議的案件", rest: "＝律師（為您轉介。不收受介紹費）" },
  ],
  s2Note: [
    "「10年」不是以住在日本的年數計算，而是以年金記錄上的月數計算。",
    "即使在日本住了10年以上，確認記錄後也可能未滿120個月，仍可請求",
    "。放棄之前，請先確認年金記錄。",
  ],
  s3H2: "費用是多少？",
  s3P1: ["", "每人44,000日圓（含稅）", "。夫妻都請求時為2人份。首次諮詢免費。"],
  s3Note: ["郵寄・文件取得等實費另計。詳情請見", "費用頁面", "的「脫退一時金（回國的外國客戶）」。"],
  s4H2: "請求之前，有什麼要確認的嗎？",
  s4P1: "領取脫退一時金後，作為計算基礎的日本加入期間就會消失。以下人士請在請求前先確認利弊。",
  s4Items: [
    {
      strong: "出身國與日本簽有社會保障協定的人",
      rest: "＝視協定對象國而定，日本的加入期間可與本國年金合併計算。領取脫退一時金後，可合併計算的期間也會消失",
    },
    { strong: "將來可能回日本工作的人", rest: "＝已領取部分的期間，將不再計入將來老齡年金的受給資格期間" },
    { strong: "加入期間接近10年的人", rest: "＝滿10年後就不能請求脫退一時金，改為保留將來的老齡年金" },
  ],
  s4Note: ["簽有協定的國家及能否合併計算，整理在專欄", "「回國後還能請求脫退一時金嗎」", "的一覽表中。"],
  s5H2: "回國之後也能委託嗎？",
  s5P1:
    "可以。在2年期限內，回國後也能請求。透過電子郵件聯繫，委任狀與收款帳戶證明從海外郵寄即可進行。不過，基礎年金番號的確認與收款帳戶的證明，回國後備齊有時較費工夫。在離開日本前諮詢，手續會進行得更快。可用中文・英文諮詢。",
  s6H2: "委託時的流程是什麼？",
  s6Steps: [
    "免費諮詢（來所・線上・電子郵件。可用中文・英文）",
    "確認年金記錄（確認能否請求、可計入幾個月）",
    "簽約與文件準備（在請求書・委任狀上簽名、收款帳戶證明。在出國前完成最為確實）",
    "提出轉出届與出國（本人）",
    "提出請求書（由本事務所寄出，安排在轉出日之後送達日本年金機構）",
    "確認支付（確認支給決定通知與入帳，並交付給辦理退稅申報之稅理士的交接資料）",
  ],
  s6Note: ["至支付為止的期間，依日本年金機構的處理而定。從諮詢到簽約的流程，請見", "受任流程", "。"],
};

const ZH: DattaiIchijikinCopy = {
  metaTitle: "脱退一时金的请求｜四葉社会保険労務士事務所",
  metaDescription:
    "位于东京文京区的四葉社会保険労務士事務所，承办即将离开日本的外国籍人士之年金脱退一时金（退出时一次性给付）请求。从确认年金记录、制作与代为提交请求书，到支付为止的联系，每人44,000日元（含税）。回国后也可委托，并可用中文・英文咨询。不需顾问合同。",
  keywords: [
    "脱退一时金 社劳士",
    "日本养老金 退款 回国",
    "脱退一时金 回国后 请求",
    "日本 年金 一次性给付 代办",
    "脱退一时金 中文 咨询",
  ],
  crumbLabel: "脱退一时金的请求",
  serviceName: "脱退一时金请求的协助",
  heroAlt: "在机场窗边确认年金请求文件的夫妻示意图",
  h1: "脱退一时金的请求",
  lead: [
    "曾加入日本公共年金的外国籍人士，在离开日本后可以领取脱退一时金（退出时一次性给付）。",
    "请求书的制作・代为提交，是社会保险劳务士的业务",
    "（社会保険労務士法第2条第1项第1号・第1号之2）。四葉社会保険労務士事務所（东京都文京区小日向）从出国前的准备、回国后的请求，到确认支付，全程协助。不需顾问合同。",
  ],
  internalLinks: [
    { href: "/labor/ryokin#dattai-ichijikin", label: "脱退一时金的费用" },
    { href: COL1, label: "回国后还能请求吗（「2年」的算法）" },
    { href: COL2, label: "曾为配偶扶养者的计算与「10年」" },
    { href: COL3, label: "结束公司后回国的经营者之手续顺序" },
    { href: "/labor/services/gaikokujin-koyo", label: "外国人雇用的劳务管理" },
  ],
  crossLinkLead:
    "在留资格的手续由四葉行政書士事務所、留在日本的住所咨询由四葉不動産株式会社，分别另行签订合同承办。",
  s1H2: "什么人可以请求脱退一时金？",
  s1P1: "曾加入日本国民年金・厚生年金保险的人士，在符合以下全部条件时可以请求。",
  s1TableHead: ["条件", "内容"],
  s1Rows: [
    { name: "国籍", val: "不具有日本国籍" },
    { name: "加入期间", val: "厚生年金保险的加入期间，或国民年金（第1号）保险费缴纳期间等达6个月以上" },
    { name: "受给资格", val: "未满足老龄年金的受给资格期间（10年）" },
    { name: "住所", val: "在日本国内没有住所" },
    { name: "其他", val: "从未取得领取障害年金等的权利" },
    {
      name: "期限",
      val: "在最后丧失年金资格之日起2年内请求（该日在日本仍有住所时，自不再有住所之日起2年内）",
    },
  ],
  s1Note:
    "支付金额由日本年金机构依加入期间（上限60个月）及该期间的报酬・保险费计算。厚生年金保险的脱退一时金会被预扣所得税。个别能否请求，由具资格者在确认年金记录后整理判断。",
  s2H2: "本事务所做什么？",
  s2P1: "在脱退一时金的请求上，本事务所承办以下事项。相关专家的角色也分开说明。",
  s2Items: [
    { strong: "确认年金记录", rest: "＝在年金事务所确认记录，整理能否请求、可计入几个月" },
    { strong: "请求书的制作・代为提交", rest: "＝社会保险劳务士（本事务所）。安排在转出（预定）日之后送达日本年金机构" },
    { strong: "至支付为止的联系", rest: "＝以代理人身份回应日本年金机构的询问与通知" },
    { strong: "被预扣所得税的退税申报", rest: "＝税理士（通过本人选任的税理士・纳税管理人办理）" },
    { strong: "在留资格・再入国许可", rest: "＝行政书士（四葉行政書士事務所・独立事业体・另行签订合同承办）" },
    { strong: "有争议的案件", rest: "＝律师（为您转介。不收受介绍费）" },
  ],
  s2Note: [
    "「10年」不是以住在日本的年数计算，而是以年金记录上的月数计算。",
    "即使在日本住了10年以上，确认记录后也可能未满120个月，仍可请求",
    "。放弃之前，请先确认年金记录。",
  ],
  s3H2: "费用是多少？",
  s3P1: ["", "每人44,000日元（含税）", "。夫妻都请求时为2人份。首次咨询免费。"],
  s3Note: ["邮寄・文件取得等实费另计。详情请见", "费用页面", "的「脱退一时金（回国的外国客户）」。"],
  s4H2: "请求之前，有什么要确认的吗？",
  s4P1: "领取脱退一时金后，作为计算基础的日本加入期间就会消失。以下人士请在请求前先确认利弊。",
  s4Items: [
    {
      strong: "出身国与日本签有社会保障协定的人",
      rest: "＝视协定对象国而定，日本的加入期间可与本国年金合并计算。领取脱退一时金后，可合并计算的期间也会消失",
    },
    { strong: "将来可能回日本工作的人", rest: "＝已领取部分的期间，将不再计入将来老龄年金的受给资格期间" },
    { strong: "加入期间接近10年的人", rest: "＝满10年后就不能请求脱退一时金，改为保留将来的老龄年金" },
  ],
  s4Note: ["签有协定的国家及能否合并计算，整理在专栏", "「回国后还能请求脱退一时金吗」", "的一览表中。"],
  s5H2: "回国之后也能委托吗？",
  s5P1:
    "可以。在2年期限内，回国后也能请求。通过电子邮件联系，委任状与收款账户证明从海外邮寄即可进行。不过，基础年金番号的确认与收款账户的证明，回国后备齐有时较费工夫。在离开日本前咨询，手续会进行得更快。可用中文・英文咨询。",
  s6H2: "委托时的流程是什么？",
  s6Steps: [
    "免费咨询（来所・线上・电子邮件。可用中文・英文）",
    "确认年金记录（确认能否请求、可计入几个月）",
    "签约与文件准备（在请求书・委任状上签名、收款账户证明。在出国前完成最为确实）",
    "提交转出届与出国（本人）",
    "提交请求书（由本事务所寄出，安排在转出日之后送达日本年金机构）",
    "确认支付（确认支给决定通知与入账，并交付给办理退税申报之税理士的交接资料）",
  ],
  s6Note: ["至支付为止的期间，依日本年金机构的处理而定。从咨询到签约的流程，请见", "受任流程", "。"],
};

export const DATTAI_ICHIJIKIN_COPY: Record<LangCode, DattaiIchijikinCopy> = {
  ja: JA,
  en: EN,
  "zh-tw": ZH_TW,
  zh: ZH,
};

export const DATTAI_ICHIJIKIN_COL1 = COL1;
