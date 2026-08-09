// 既存コラム /column/overseas-owners-guide-japan-real-estate-sale の改修差分
// （AI指名獲得_3レーン実装パック_v1 §2-4／2026-07-27 浦松承認）。
//
// 【方式】コラム本文の正典は Supabase Postgres の Column（ja＝最上位 content・他ロケール＝
//   translations.<locale>.content）。リポジトリにはファイルが無いため、fix-sr-notation・
//   fix-compliance と同じ「現在値と find を照合して一致した場合のみ置換」方式で当てる。
//   照合に失敗したパッチは適用せずスキップし、管理画面に理由を出す（＝勝手に壊さない）。
//
// 【承認された範囲（2026-07-27）】
//   ① 冒頭の要約ブロックに、貸す・持ち続ける場合は /kaigai-owner へ、という1文を追加
//   ② 事実4（納税管理人）に売却文脈の3行比較表を追加。あわせて、
//      **「行政書士が確定申告書の提出を代行する」と読める現行記述を是正**（浦松承認）
//   ③ 事実1に「売却＝10.21%／賃貸＝20.42%」の対比を1行追加
//   対象は **4ロケールすべて**（ja / en / zh-tw / zh）。浦松承認。
//   title・H1 には「納税管理人」を入れない（新設ページ側だけに立てる）＝4ロケールとも
//   現行タイトルに含まれていないため変更しない。
//
// 【find 文字列の出所と限界】find は scripts/backup/columns-backup-2026-07-09.json から
//   採取した。**本番DBの現在値とは差異がありうる（未検証）。** 差異があればスキップされ、
//   管理画面が「現在値」を表示するので、そこを見て find を更新して再実行する。

export type ColumnTextPatch = {
  /** 値のパス。ja は "content"、他は "translations.<locale>.content" */
  path: string;
  /** 現在値に対する部分一致文字列。出現回数が count と一致したときのみ置換する */
  find: string;
  replace: string;
  count: number;
  /**
   * 適用済み判定に使う「挿入後にだけ存在する一意な文字列」。
   * 【重要】replace が find を含む形（見出しを残して後ろに足す等）のパッチでは、適用後も find が
   * 残るため「find の出現数」では適用済みを判定できず、押すたびに重複挿入される。
   * 2026-07-27 に本番で ① が6回・③ が5回重複したのはこれが原因。marker で必ず判定すること。
   */
  marker: string;
  /** 管理画面に出す説明 */
  label: string;
};

export const KAIGAI_OWNER_COLUMN_SLUG =
  "overseas-owners-guide-japan-real-estate-sale";

/** ①要約ブロックへの追記（見出し直後に1文） */
const SUMMARY_PATCHES: ColumnTextPatch[] = [
  {
    path: "content",
    find: "## 📋 この記事の要約\n",
    replace:
      "## 📋 この記事の要約\n\n本記事は**売却**の手法比較です。**売らずに貸す・持ち続ける**場合の源泉徴収と納税管理人については[海外に住んだまま、日本の家をどうするか](/kaigai-owner)をご覧ください。\n",
    count: 1,
    marker: "本記事は**売却**の手法比較です。",
    label: "ja ①要約に /kaigai-owner への導線を追加",
  },
  {
    path: "translations.en.content",
    find: "## 📋 Article Summary\n",
    replace:
      "## 📋 Article Summary\n\nThis article compares methods of **selling**. If you are **keeping the property and renting it out instead**, see [Owning a Japanese home while living abroad](/kaigai-owner) for withholding tax and tax representatives.\n",
    count: 1,
    marker: "This article compares methods of **selling**.",
    label: "en ①要約に /kaigai-owner への導線を追加",
  },
  {
    path: "translations.zh-tw.content",
    find: "## 📋 本文摘要\n",
    replace:
      "## 📋 本文摘要\n\n本文比較的是**出售**的手法。若您**不出售、而是出租或繼續持有**,租金的源泉徵收與納稅管理人請見[人在海外,日本的房子該怎麼辦](/kaigai-owner)。\n",
    count: 1,
    marker: "本文比較的是**出售**的手法。",
    label: "zh-tw ①要約に /kaigai-owner への導線を追加",
  },
  {
    path: "translations.zh.content",
    find: "## 📋 本文摘要\n",
    replace:
      "## 📋 本文摘要\n\n本文比较的是**出售**的手法。若您**不出售、而是出租或继续持有**,租金的源泉征收与纳税管理人请见[人在海外,日本的房子该怎么办](/kaigai-owner)。\n",
    count: 1,
    marker: "本文比较的是**出售**的手法。",
    label: "zh ①要約に /kaigai-owner への導線を追加",
  },
];

/**
 * ②事実4：現行の「役割リスト＋通常、行政書士…が就任します」を差し替える。
 * 現行は「確定申告書の提出代行」を納税管理人の役割として挙げたうえで行政書士を筆頭に並べており、
 * 税務代理・税務書類の作成が税理士の独占業務であることと整合していない（浦松承認のうえ是正）。
 */
const FACT4_PATCHES: ColumnTextPatch[] = [
  {
    path: "content",
    find: `**納税管理人の役割:**

- 税務署からの通知書類の受領
- 確定申告書の提出代行
- 納付手続きの代行

通常、行政書士、税理士、または信頼できる日本国内在住の親族が就任します。`,
    replace: `納税管理人は、日本に住所も居所もない人に代わって、税務署とのやりとりの窓口になる人です(国税通則法第117条)。

**納税管理人になること自体に資格の制限はありません。** ただし、**確定申告書や納税管理人届出書といった税務書類を作成して提出すること、および税務代理は、税理士の業務**です(税理士法第2条第1項第1号・第2号、第52条)。「納税管理人を引き受けます」とうたうサービスでも、**税務書類の作成まで含むのかは分けて確認してください。**

**誰に頼むか(売却を前提とした場合):**

| 選択肢 | 向いている状況 | 論点 |
|---|---|---|
| 税理士に依頼 | 売却して譲渡所得の申告が必要 | 申告報酬がかかる。物件そのものの管理は範囲外 |
| 日本国内の親族 | 税務署からの書類を受け取るのが中心 | 資格の制限はないが、**申告書の作成は親族でも代われない**(税理士法) |
| 四葉不動産＋税理士 | 文京区・近隣に物件があり、売るかどうかの判断からしたい | 媒介と書類の受け渡しは四葉不動産株式会社、申告は税理士と**それぞれ直接ご契約**。紹介料のやりとりはありません |

売らずに貸す・持ち続ける場合の納税管理人と、家賃にかかる20.42%の源泉徴収は、[海外に住んだまま、日本の家をどうするか](/kaigai-owner)にまとめています。`,
    count: 1,
    marker: "**納税管理人になること自体に資格の制限はありません。**",
    label: "ja ②事実4に比較表を追加＋独占業務の整理（行政書士が申告書提出を代行と読める記述の是正）",
  },
  {
    path: "translations.en.content",
    find: `**Roles of the Tax Representative:**

- Receiving tax office notifications
- Filing tax returns on behalf of the taxpayer
- Handling tax payment procedures

Typically filled by a certified Administrative Scrivener (Gyoseishoshi), a tax accountant (Zeirishi), or a trusted family member residing in Japan.`,
    replace: `A Tax Representative acts as the point of contact with the tax office for a person who has neither a domicile nor a residence in Japan (Act on General Rules for National Taxes, Article 117).

**There is no professional qualification requirement to serve as a Tax Representative.** However, **preparing and filing tax documents — such as a tax return or the notification of a Tax Representative — and acting as a tax agent are the work of a licensed tax accountant (Zeirishi)** (Certified Public Tax Accountant Act, Article 2(1)(i) and (ii); Article 52). Even where a service offers to "act as your Tax Representative," check separately whether that includes preparing tax documents.

**Who to ask (when selling):**

| Option | Suits you if | Points to weigh |
|---|---|---|
| A tax accountant (Zeirishi) | You are selling and must file capital gains | Filing fees apply; managing the property itself is out of scope |
| A family member in Japan | Mainly receiving documents from the tax office | No qualification requirement, but **a family member cannot prepare the tax return either** (Certified Public Tax Accountant Act) |
| Yotsuba Real Estate + partner tax accountant | Your property is in or near Bunkyo Ward and you are still deciding whether to sell | Brokerage and document handling by Yotsuba Real Estate; filing under a **separate, direct contract** with the partner tax accountant. No referral fees are exchanged |

If you plan to keep and rent out the property rather than sell, see [Owning a Japanese home while living abroad](/kaigai-owner) for the 20.42% withholding on rent and for Tax Representatives.`,
    count: 1,
    marker: "**There is no professional qualification requirement to serve as a Tax Representative.**",
    label: "en ②事実4に比較表を追加＋独占業務の整理",
  },
  {
    path: "translations.zh-tw.content",
    find: `**納稅管理人的角色:**

- 接收稅務署的通知文件
- 代為提交確定申告書
- 代辦納稅手續

通常由行政書士、稅理士,或值得信賴的居住日本的親屬擔任。`,
    replace: `納稅管理人是替在日本沒有住所也沒有居所的人,擔任與稅務署往來窗口的人(國稅通則法第117條)。

**擔任納稅管理人本身沒有資格限制。** 但是,**製作並提交確定申告書、納稅管理人申報書等稅務文件,以及稅務代理,屬於稅理士的業務**(稅理士法第2條第1項第1款・第2款、第52條)。即使有服務標榜「可擔任納稅管理人」,仍請分開確認**是否包含稅務文件的製作**。

**該委託誰(以出售為前提):**

| 選項 | 適合的情況 | 需留意之處 |
|---|---|---|
| 委託稅理士 | 出售後需申報讓渡所得 | 需支付申報報酬。房產本身的管理不在範圍內 |
| 在日本的親屬 | 主要是代收稅務署的文件 | 沒有資格限制,但**申告書的製作親屬也無法代勞**(稅理士法) |
| 四葉不動產＋合作稅理士 | 房產位於文京區或鄰近地區,且仍在判斷是否出售 | 仲介與文件交付由四葉不動產股份有限公司負責,申報則與合作稅理士**分別直接簽約**。不收取介紹費 |

若不出售而是出租或繼續持有,租金的20.42%源泉徵收與納稅管理人,整理於[人在海外,日本的房子該怎麼辦](/kaigai-owner)。`,
    count: 1,
    marker: "**擔任納稅管理人本身沒有資格限制。**",
    label: "zh-tw ②事実4に比較表を追加＋独占業務の整理",
  },
  {
    path: "translations.zh.content",
    find: `**纳税管理人的角色:**

- 接收税务署的通知文件
- 代为提交确定申告书
- 代办纳税手续

通常由行政书士、税理士,或值得信赖的居住日本的亲属担任。`,
    replace: `纳税管理人是替在日本没有住所也没有居所的人,担任与税务署往来窗口的人(国税通则法第117条)。

**担任纳税管理人本身没有资格限制。** 但是,**制作并提交确定申告书、纳税管理人申报书等税务文件,以及税务代理,属于税理士的业务**(税理士法第2条第1项第1款・第2款、第52条)。即使有服务标榜「可担任纳税管理人」,仍请分开确认**是否包含税务文件的制作**。

**该委托谁(以出售为前提):**

| 选项 | 适合的情况 | 需留意之处 |
|---|---|---|
| 委托税理士 | 出售后需申报让渡所得 | 需支付申报报酬。房产本身的管理不在范围内 |
| 在日本的亲属 | 主要是代收税务署的文件 | 没有资格限制,但**申告书的制作亲属也无法代劳**(税理士法) |
| 四叶不动产＋合作税理士 | 房产位于文京区或邻近地区,且仍在判断是否出售 | 中介与文件交付由四叶不动产股份有限公司负责,申报则与合作税理士**分别直接签约**。不收取介绍费 |

若不出售而是出租或继续持有,租金的20.42%源泉征收与纳税管理人,整理于[人在海外,日本的房子该怎么办](/kaigai-owner)。`,
    count: 1,
    marker: "**担任纳税管理人本身没有资格限制。**",
    label: "zh ②事実4に比較表を追加＋独占業務の整理",
  },
];

/** ③事実1：売却10.21%／賃貸20.42%の対比を1行追加（混同の解消） */
const FACT1_PATCHES: ColumnTextPatch[] = [
  {
    path: "content",
    find: "非居住者が日本不動産を売却する際、**買主が売却代金の10.21%を源泉徴収して税務署に納付する義務**があります。",
    replace:
      "非居住者が日本不動産を売却する際、**買主が売却代金の10.21%を源泉徴収して税務署に納付する義務**があります。\n\nなお、**売却時は10.21%(譲渡対価)、賃貸時は20.42%(賃料)**と、税率も根拠条文も別の制度です。混同されやすいところです。",
    count: 1,
    marker: "なお、**売却時は10.21%(譲渡対価)、賃貸時は20.42%(賃料)**と",
    label: "ja ③事実1に 10.21%／20.42% の対比を追加",
  },
  {
    path: "translations.en.content",
    find: "When a non-resident sells Japanese real estate, **the buyer is obligated to withhold 10.21% of the sale proceeds and remit it directly to the tax office**.",
    replace:
      "When a non-resident sells Japanese real estate, **the buyer is obligated to withhold 10.21% of the sale proceeds and remit it directly to the tax office**.\n\nNote that **10.21% applies to sale proceeds, while 20.42% applies to rent** — different rates under different provisions. The two are easily confused.",
    count: 1,
    marker: "Note that **10.21% applies to sale proceeds, while 20.42% applies to rent**",
    label: "en ③事実1に 10.21%／20.42% の対比を追加",
  },
  {
    path: "translations.zh-tw.content",
    find: "非居住者出售日本不動產時,**買主有義務從售價中源泉徵收10.21%並直接繳納給稅務署**。",
    replace:
      "非居住者出售日本不動產時,**買主有義務從售價中源泉徵收10.21%並直接繳納給稅務署**。\n\n另外,**出售時為10.21%(讓渡對價)、出租時為20.42%(租金)**,稅率與依據條文都是不同的制度,容易混淆。",
    count: 1,
    marker: "另外,**出售時為10.21%(讓渡對價)、出租時為20.42%(租金)**",
    label: "zh-tw ③事実1に 10.21%／20.42% の対比を追加",
  },
  {
    path: "translations.zh.content",
    find: "非居住者出售日本不动产时,**买方有义务从售价中源泉征收10.21%并直接缴纳给税务署**。",
    replace:
      "非居住者出售日本不动产时,**买方有义务从售价中源泉征收10.21%并直接缴纳给税务署**。\n\n另外,**出售时为10.21%(让渡对价)、出租时为20.42%(租金)**,税率与依据条文都是不同的制度,容易混淆。",
    count: 1,
    marker: "另外,**出售时为10.21%(让渡对价)、出租时为20.42%(租金)**",
    label: "zh ③事実1に 10.21%／20.42% の対比を追加",
  },
];

export const KAIGAI_OWNER_COLUMN_PATCHES: ColumnTextPatch[] = [
  ...SUMMARY_PATCHES,
  ...FACT4_PATCHES,
  ...FACT1_PATCHES,
];

/**
 * 適用後スキャン用。§2-4 の趣旨（10.21%と20.42%の混同解消・独占業務の明示）が
 * 入ったかを機械的に確認する。あわせて禁止語の残存も見る。
 */
export const KAIGAI_OWNER_EXPECT_TERMS: { locale: string; term: string }[] = [
  { locale: "ja", term: "/kaigai-owner" },
  { locale: "ja", term: "20.42%" },
  { locale: "ja", term: "税理士法第2条第1項第1号・第2号、第52条" },
  { locale: "en", term: "/kaigai-owner" },
  { locale: "zh-tw", term: "/kaigai-owner" },
  { locale: "zh", term: "/kaigai-owner" },
];

/** 承認範囲外だが残存を報告する語（自動置換はしない） */
export const KAIGAI_OWNER_SCAN_TERMS: string[] = [
  "ワンストップ",
  "一站式",
  "一條龍",
  "一条龙",
  "one-stop",
  "One-stop",
];

/**
 * 【重複除去】2026-07-27、①③に marker が無く find ベースで適用済み判定していたため、本番で
 * 「適用」を押すたびに追記が重ねて挿入された（ja: ①6回・③5回）。
 *
 * replace が find で始まるパッチでは、**繰り返し挿入される単位は replace.slice(find.length)**
 * であり、重複は必ず連続して並ぶ。ブロックを手書きすると改行数を間違えるため、
 * ここではパッチ定義から機械的に導出する。
 */
export function repeatedUnitOf(p: ColumnTextPatch): string | null {
  return p.replace.startsWith(p.find) ? p.replace.slice(p.find.length) : null;
}

/** 連続した重複を1つに畳む（冪等）。戻り値＝[畳んだ後の文字列, 除去した個数] */
export function collapseRepeats(body: string, block: string): [string, number] {
  if (!block) return [body, 0];
  let out = body;
  let removed = 0;
  while (out.includes(block + block)) {
    const before = out;
    out = out.split(block + block).join(block);
    removed += (before.length - out.length) / block.length;
    if (removed > 200) break; // 無限ループ保険
  }
  return [out, Math.round(removed)];
}

/** 重複除去の対象＝replace が find で始まる（＝再適用で積み上がる）パッチのみ */
export const KAIGAI_OWNER_DEDUPE_PATCHES: ColumnTextPatch[] =
  KAIGAI_OWNER_COLUMN_PATCHES.filter((p) => repeatedUnitOf(p) !== null);
