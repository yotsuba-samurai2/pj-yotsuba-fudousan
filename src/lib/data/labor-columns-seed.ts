// このファイルは自動生成（npx tsx scripts/seed-labor-columns.ts --emit-ts）。直接編集しない。
// 原稿の正本＝scripts/labor-columns/*.md。修正はmd側→再生成で行う。
// 用途＝/admin/columns/seed-labor からの管理者セッション経由バルクupsert（seed-office と同型）。

export type LaborSeedColumn = {
  business: "labor";
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  status: "published";
  author: { name: string; title: string };
  keywords: string[];
  tags: string[];
  locales: ("ja" | "en" | "zh-tw" | "zh")[];
  faq: { question: string; answer: string }[];
  translations?: Partial<
    Record<
      "en" | "zh-tw" | "zh",
      {
        title: string;
        excerpt: string;
        content: string;
        category?: string;
        keywords?: string[];
        tags?: string[];
        author?: { name: string; title: string };
        faq?: { question: string; answer: string }[];
      }
    >
  >;
};

export const LABOR_COLUMNS_SEED: LaborSeedColumn[] = [
  {
    "business": "labor",
    "slug": "shogu-kaizen-sharoushi-gyoseishoshi-dochira",
    "title": "処遇改善加算は、社会保険労務士と行政書士のどちらに頼むのか",
    "date": "2026-09-01",
    "category": "誰に頼むか",
    "excerpt": "処遇改善加算は工程で担当が分かれます。賃金制度の設計と賃金改善額の算定は社会保険労務士、指定権者へ提出する計画書・実績報告書の作成は行政書士です。根拠となる法律が違うため、ひとつの事務所が両方を名乗ることはできません。四葉での分担と料金もあわせて示します。",
    "content": "**結論（先に要点）**：処遇改善加算は、**工程で担当が分かれます**。就業規則・賃金規程・キャリアパス要件など賃金制度の設計と、賃金改善額の算定は社会保険労務士。加算体制届・計画書・実績報告書など、指定権者（自治体）へ提出する書類の作成は行政書士です。ひとつの事務所が両方を名乗ることはできないため、2つの契約に分かれます。\n\n「処遇改善加算の相談は、社労士と行政書士のどちらにすればいいのか」——障害福祉・介護の事業者から、よく受ける質問です。ウェブで検索すると、社会保険労務士事務所も行政書士事務所も、どちらも「処遇改善加算に対応します」と書いています。矛盾しているように見えますが、実際には**それぞれ違う工程を指している**だけです。\n\n## なぜ、ひとつの加算に2つの資格が出てくるのか？\n\n処遇改善加算は、「賃金を上げる」ことと「上げたと届け出る」ことの2つでできています。この2つが、別々の法律の管轄に入るためです。\n\n社会保険労務士法（昭和43年法律第89号）第2条第1項は、社会保険労務士の業務を号ごとに定めています。第1号が労働社会保険諸法令に基づく申請書等の作成と提出代行、第3号が労務管理その他の労働に関する事項についての相談・指導です。賃金制度の設計は、この第3号にあたります。\n\n一方、行政書士法（昭和26年法律第4号）第1条の2第1項は、他人の依頼を受けて**官公署に提出する書類**を作成することを行政書士の業務と定めています。指定権者である自治体に出す計画書・実績報告書は、これにあたります。\n\nつまり、**同じ加算でも「賃金の側」と「届出の側」で根拠法が違う**のです。\n\n## 社会保険労務士が担当するのは、どこまでか？\n\n| 工程 | 内容 |\n|---|---|\n| 賃金制度の設計 | 就業規則・賃金規程の改定、キャリアパス要件を満たす等級・評価の枠組み |\n| 賃金改善額の算定 | 加算見込額に対して、誰にいくら配分するかの設計と突合 |\n| 月額賃金への反映 | 基本給・手当のどこに乗せるかの整理と、労働条件通知書への反映 |\n| 労働社会保険への影響の確認 | 賃金が上がったことによる標準報酬月額の変更（随時改定）の要否 |\n\nいちばん見落とされやすいのが最後の行です。賃金を上げると社会保険料が変わります。加算で得た原資のうち、事業主負担分がどれだけ増えるかを見ておかないと、実質の手取り改善が想定より小さくなります。\n\n## 行政書士が担当するのは、どこからか？\n\n| 工程 | 内容 |\n|---|---|\n| 加算体制届 | 算定する加算区分の届出 |\n| 計画書 | 年度当初に指定権者へ提出する処遇改善計画書 |\n| 実績報告書 | 年度終了後の実績報告 |\n| 変更の届出 | 計画の変更が生じたときの届出 |\n\n書式・提出期限・添付書類は指定権者（自治体）ごとに運用が違います。文京区の事業所であっても、東京都に出すものと区に出すものがあります。\n\n## 分けて頼むと、費用は二重にかかるのか？\n\n工程が違うので、二重払いにはなりません。ただし**契約は2つになります**。\n\n四葉での料金は次のとおりです。\n\n| 工程 | 担当 | 料金（税込） |\n|---|---|---|\n| 賃金要件の設計・賃金改善額の算定 | 四葉社会保険労務士事務所 | お見積り |\n| 処遇改善加算 計画書（届出） | 四葉行政書士事務所 | 66,000円 |\n| 処遇改善加算 実績報告 | 四葉行政書士事務所 | 55,000円 |\n\n賃金の側をお見積りにしているのは、従業員数と現行の賃金体系によって作業量が大きく変わるためです。既に賃金規程が整っている事業所と、これから作る事業所とでは、同じ「設計」でも中身が違います。\n\n## 四葉ではどう受けているのか？\n\n四葉社会保険労務士事務所と四葉行政書士事務所は、**それぞれ独立した事業体**です。代表は同じ浦松丈二ですが、契約・請求・入金は別々になります。紹介料の授受は一切行いません。\n\nどちらか片方だけのご依頼でも構いません。賃金の設計は自社でできるので届出だけ、という事業所もありますし、その逆もあります。\n\n賃金の側の業務内容は[処遇改善加算の賃金要件](/labor/services/shogu-kaizen)に、料金の全体は[報酬額表](/labor/ryokin)に掲載しています。\n\n事業所の指定申請そのものについては[障害福祉サービスの指定申請](/legal/services/shogai-fukushi)を、グループホームの報酬・加算の全体像については[グループホーム開設｜報酬体系・加算の基礎](/legal/column/group-home-hoshu-taikei-kasan-kiso)をご覧ください。\n\n## よくある質問\n\n**Q. 顧問の社労士がいますが、届出だけ別の事務所に頼めますか？**\nA. 差し支えありません。届出は行政書士の業務なので、そもそも社会保険労務士事務所では受けられない工程です。顧問の社会保険労務士に賃金の側を見てもらいながら、届出だけを行政書士に依頼する形は、一般的な組み合わせです。\n\n**Q. どちらの資格も持っている人に頼めば、契約は1本で済みますか？**\nA. 済みません。同じ人が両方の資格を持っていても、業務ごとに別の登録・別の事務所として行うことになるため、契約は分かれます。四葉も同様で、代表は社会保険労務士と行政書士の両方の登録をしていますが、それぞれ別の事務所として受任します。\n\n**Q. 計画書を出す前に、賃金の設計が終わっていないといけませんか？**\nA. 順序としてはそうなります。計画書には賃金改善の方法と見込額を書くため、先に賃金の側が固まっている必要があります。年度の切り替わりに間に合わせるには、逆算して余裕を持って着手されることをお勧めします。\n\n**Q. 加算を取ると、社会保険料も上がりますか？**\nA. 賃金が上がれば、標準報酬月額が変わることがあります。固定的賃金の変動があり一定の要件を満たす場合には随時改定の対象になり、事業主の保険料負担も増えます。加算の原資のうち、どれだけが手取りに回るかを事前に見ておくことをお勧めします。個別の判断は、賃金の内訳を拝見したうえで行います。\n\n## この記事の根拠\n\n- 社会保険労務士法（昭和43年法律第89号）第2条第1項第1号・第3号、第27条\n- 行政書士法（昭和26年法律第4号）第1条の2第1項、第19条第1項\n- 福祉・介護職員等処遇改善加算の要件・様式・提出期限は、厚生労働省の通知および指定権者（自治体）の運用によります。年度ごとに改定されるため、最新の様式をご確認ください。本記事では特定年度の加算率・様式番号は記載していません。\n\n本記事は一般的な情報提供です。個別のご事情に応じた判断は、面談のうえ資格者が行います。執筆は[浦松丈二](/about/uramatsu)（社会保険労務士・行政書士・宅地建物取引士）です。",
    "status": "published",
    "author": {
      "name": "浦松 丈二",
      "title": "社会保険労務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
    },
    "keywords": [
      "処遇改善加算 社労士 行政書士 どちら",
      "処遇改善加算 誰に頼む",
      "処遇改善加算 計画書 代行",
      "処遇改善加算 賃金改善額 算定",
      "障害福祉 処遇改善加算 相談",
      "処遇改善加算 業際"
    ],
    "tags": [
      "処遇改善加算",
      "障害福祉",
      "介護",
      "業際",
      "社会保険労務士",
      "行政書士"
    ],
    "locales": [],
    "faq": [
      {
        "question": "顧問の社労士がいますが、届出だけ別の事務所に頼めますか？",
        "answer": "差し支えありません。届出は行政書士の業務なので、そもそも社会保険労務士事務所では受けられない工程です。顧問の社会保険労務士に賃金の側を見てもらいながら、届出だけを行政書士に依頼する形は、一般的な組み合わせです。"
      },
      {
        "question": "どちらの資格も持っている人に頼めば、契約は1本で済みますか？",
        "answer": "済みません。同じ人が両方の資格を持っていても、業務ごとに別の登録・別の事務所として行うことになるため、契約は分かれます。四葉も同様で、代表は社会保険労務士と行政書士の両方の登録をしていますが、それぞれ別の事務所として受任します。"
      },
      {
        "question": "計画書を出す前に、賃金の設計が終わっていないといけませんか？",
        "answer": "順序としてはそうなります。計画書には賃金改善の方法と見込額を書くため、先に賃金の側が固まっている必要があります。年度の切り替わりに間に合わせるには、逆算して余裕を持って着手されることをお勧めします。"
      },
      {
        "question": "加算を取ると、社会保険料も上がりますか？",
        "answer": "賃金が上がれば、標準報酬月額が変わることがあります。固定的賃金の変動があり一定の要件を満たす場合には随時改定の対象になり、事業主の保険料負担も増えます。加算の原資のうち、どれだけが手取りに回るかを事前に見ておくことをお勧めします。個別の判断は、賃金の内訳を拝見したうえで行います。"
      }
    ],
    "translations": {
      "en": {
        "title": "The treatment-improvement add-on: do you ask a shakai hoken roumushi or a gyoseishoshi?",
        "excerpt": "The treatment-improvement add-on splits by stage. Designing the wage system and calculating the wage-improvement amount is work for a shakai hoken roumushi; preparing the plan and the performance report filed with the designating authority is work for a gyoseishoshi. The two rest on different statutes, so no single office can hold itself out as both. We also show how the work and the fees are divided at Yotsuba.",
        "content": "**In short:** The treatment-improvement add-on **splits by stage**. Designing the wage system — work rules, wage regulations, career-path requirements — and calculating the wage-improvement amount is work for a shakai hoken roumushi (Certified Social Insurance and Labor Consultant). Preparing the documents filed with the designating authority (the municipality) — the add-on structure notification, the plan, the performance report — is work for a gyoseishoshi (Certified Administrative Procedures Legal Specialist). One office cannot hold itself out as both, so the work is divided into two contracts.\n\n\"Should we ask a shakai hoken roumushi or a gyoseishoshi about the treatment-improvement add-on?\" We hear this often from disability-welfare and long-term-care providers. Search the web and you will find that social insurance and labor consultant offices and gyoseishoshi offices both say they \"handle the treatment-improvement add-on.\" It looks contradictory, but in fact each is simply **pointing at a different stage**.\n\n## Why does a single add-on involve two qualifications?\n\nThe treatment-improvement add-on consists of two things: raising wages, and reporting that you raised them. Those two fall under different statutes.\n\nArticle 2, paragraph 1 of the Certified Social Insurance and Labor Consultant Act (社会保険労務士法, Act No. 89 of 1968) sets out the work of a shakai hoken roumushi item by item. Item 1 covers preparing applications and other documents under the labor and social insurance laws and filing them on the client's behalf; item 3 covers consultation and guidance on labor management and other labor-related matters. Designing a wage system falls under item 3.\n\nArticle 1-2, paragraph 1 of the Certified Administrative Procedures Legal Specialist Act (行政書士法, Act No. 4 of 1951), on the other hand, defines the work of a gyoseishoshi as preparing, at another person's request, **documents to be submitted to public agencies**. The plan and the performance report filed with the designating authority — the municipality — belong here.\n\nIn other words, **within the same add-on, the \"wage side\" and the \"filing side\" rest on different statutes**.\n\n## How far does the shakai hoken roumushi's part go?\n\n| Stage | What it covers |\n|---|---|\n| Designing the wage system | Revising the work rules and the wage regulations; the grade and evaluation framework that satisfies the career-path requirements |\n| Calculating the wage-improvement amount | Designing who receives how much against the expected add-on amount, and reconciling the two |\n| Reflecting it in monthly wages | Sorting out whether it goes into base pay or into allowances, and reflecting that in the written notice of working conditions |\n| Checking the effect on labor and social insurance | Whether the standard monthly remuneration has to be revised (an occasional revision) because wages went up |\n\nThe last row is the one most often missed. When wages rise, social insurance premiums change. Unless you look at how much the employer's share increases out of the funds the add-on brings in, the real improvement in take-home pay comes out smaller than expected.\n\n## Where does the gyoseishoshi's part begin?\n\n| Stage | What it covers |\n|---|---|\n| Add-on structure notification | Notifying which add-on category you will claim |\n| Plan | The treatment-improvement plan filed with the designating authority at the start of the fiscal year |\n| Performance report | The report on results after the fiscal year ends |\n| Notification of changes | The notification filed when the plan changes |\n\nForms, filing deadlines and attachments are operated differently by each designating authority (municipality). Even for a provider in Bunkyo City, some documents go to the Tokyo Metropolitan Government and others to the ward.\n\n## If the work is split, do you pay twice?\n\nThe stages are different, so you are not paying twice for the same thing. You will, however, **have two contracts**.\n\nThe fees at Yotsuba are as follows.\n\n| Stage | Who handles it | Fee (tax incl.) |\n|---|---|---|\n| Designing the wage requirements and calculating the wage-improvement amount | 四葉社会保険労務士事務所 | Individual estimate |\n| Treatment-improvement add-on: the plan (filing) | 四葉行政書士事務所 | 66,000 yen |\n| Treatment-improvement add-on: the performance report | 四葉行政書士事務所 | 55,000 yen |\n\nThe wage side is quoted individually because the volume of work varies greatly with the number of employees and the wage structure already in place. The same word \"design\" means something quite different at a provider whose wage regulations are already in order and at one that is building them from scratch.\n\n## How does Yotsuba take this on?\n\n四葉社会保険労務士事務所 and 四葉行政書士事務所 are **separate businesses**. The same person, Joji Uramatsu, represents both, but the contracts, the invoices and the payments are separate: each accepts work **separately**, under a **separate contract**. No referral fees are exchanged in either direction.\n\nYou are welcome to ask for only one of the two. Some providers design the wages in-house and ask only for the filing; others do the reverse.\n\nWhat the wage side involves is set out in [the wage requirements of the treatment-improvement add-on](/en/labor/services/shogu-kaizen), and the fees as a whole are on [the fee schedule](/en/labor/ryokin).\n\nFor the designation application itself, see [designation applications for disability-welfare services](/en/legal/services/shogai-fukushi); for the overall picture of group-home revenue and add-ons, see [Opening a group home: the revenue structure and the basics of add-ons](/en/legal/column/group-home-hoshu-taikei-kasan-kiso).\n\n## Frequently asked questions\n\n**Q. We already have a retained shakai hoken roumushi. May we ask a different office for the filing alone?**\nA. That is perfectly acceptable. Filing is gyoseishoshi work, so it is a stage a social insurance and labor consultant's office cannot take on in the first place. Having your retained shakai hoken roumushi look after the wage side while a gyoseishoshi handles the filing alone is a common combination.\n\n**Q. If we ask someone who holds both qualifications, can it be a single contract?**\nA. No. Even when one person holds both qualifications, the work is carried out under separate registrations and as separate offices, so the contracts are separate. It is the same at Yotsuba: our representative is registered both as a shakai hoken roumushi and as a gyoseishoshi, but each office accepts the work separately.\n\n**Q. Does the wage design have to be finished before the plan is filed?**\nA. In that order, yes. The plan states the method and the expected amount of the wage improvement, so the wage side has to be settled first. To be in time for the change of fiscal year, we recommend working backwards from the deadline and starting with room to spare.\n\n**Q. If we claim the add-on, will social insurance premiums rise as well?**\nA. If wages rise, the standard monthly remuneration may change. Where there is a change in fixed wages and certain requirements are met, an occasional revision applies, and the employer's share of the premiums increases as well. We recommend checking in advance how much of the funds the add-on brings in actually reaches take-home pay. The judgment in a specific case is made after we have seen the breakdown of the wages.\n\n## Sources for this article\n\n- 社会保険労務士法 (Act No. 89 of 1968), Article 2, paragraph 1, items 1 and 3; Article 27\n- 行政書士法 (Act No. 4 of 1951), Article 1-2, paragraph 1; Article 19, paragraph 1\n- The requirements, forms and filing deadlines for the treatment-improvement add-on for welfare and care workers follow notices of the Ministry of Health, Labour and Welfare and the practice of each designating authority (municipality). They are revised each fiscal year, so please check the latest forms. This article does not state add-on rates or form numbers for any particular fiscal year.\n\nThis article is general information. A judgment on your individual circumstances is made by a qualified professional after a consultation. Written by [Joji Uramatsu](/en/about/uramatsu) (Shakai Hoken Roumushi, Gyoseishoshi, Registered Real Estate Transaction Specialist).",
        "category": "Who to ask",
        "keywords": [
          "treatment improvement add-on who to ask",
          "shakai hoken roumushi or gyoseishoshi",
          "treatment improvement add-on plan filing agent",
          "wage improvement amount calculation",
          "disability welfare treatment improvement add-on consultation",
          "scope of practice social insurance labor consultant gyoseishoshi"
        ],
        "tags": [
          "Treatment-improvement add-on",
          "Disability welfare",
          "Long-term care",
          "Scope of practice",
          "Shakai Hoken Roumushi",
          "Gyoseishoshi"
        ],
        "author": {
          "name": "Joji Uramatsu",
          "title": "Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist — 四葉社会保険労務士事務所／四葉行政書士事務所"
        },
        "faq": [
          {
            "question": "We already have a retained shakai hoken roumushi. May we ask a different office for the filing alone?",
            "answer": "That is perfectly acceptable. Filing is gyoseishoshi work, so it is a stage a social insurance and labor consultant's office cannot take on in the first place. Having your retained shakai hoken roumushi look after the wage side while a gyoseishoshi handles the filing alone is a common combination."
          },
          {
            "question": "If we ask someone who holds both qualifications, can it be a single contract?",
            "answer": "No. Even when one person holds both qualifications, the work is carried out under separate registrations and as separate offices, so the contracts are separate. It is the same at Yotsuba: our representative is registered both as a shakai hoken roumushi and as a gyoseishoshi, but each office accepts the work separately."
          },
          {
            "question": "Does the wage design have to be finished before the plan is filed?",
            "answer": "In that order, yes. The plan states the method and the expected amount of the wage improvement, so the wage side has to be settled first. To be in time for the change of fiscal year, we recommend working backwards from the deadline and starting with room to spare."
          },
          {
            "question": "If we claim the add-on, will social insurance premiums rise as well?",
            "answer": "If wages rise, the standard monthly remuneration may change. Where there is a change in fixed wages and certain requirements are met, an occasional revision applies, and the employer's share of the premiums increases as well. We recommend checking in advance how much of the funds the add-on brings in actually reaches take-home pay. The judgment in a specific case is made after we have seen the breakdown of the wages."
          }
        ]
      },
      "zh-tw": {
        "title": "處遇改善加算，該委託社會保險勞務士還是行政書士？",
        "excerpt": "處遇改善加算依工序劃分負責人。薪資制度的設計與薪資改善額的計算屬社會保險勞務士，向指定權者提出的計畫書・實績報告書的製作屬行政書士。因所依據的法律不同，一家事務所無法兼稱兩者。本文一併說明四葉的分工與費用。",
        "content": "**結論（先講重點）**：處遇改善加算**依工序劃分負責人**。就業規則、薪資規程、職涯路徑要件等薪資制度的設計，以及薪資改善額的計算，屬社會保險勞務士。加算體制申報、計畫書、實績報告書等向指定權者（自治體）提出之文件的製作，屬行政書士。一家事務所無法兼稱兩者，因此會分成兩份契約。\n\n「處遇改善加算要找社會保險勞務士，還是找行政書士？」——這是障礙福祉・介護的事業者經常提出的問題。在網路上搜尋，會看到社會保險勞務士事務所與行政書士事務所都寫著「可對應處遇改善加算」。看似矛盾，實際上只是**各自指的工序不同**而已。\n\n## 為什麼同一個加算會牽涉到兩種資格？\n\n處遇改善加算由「提高薪資」與「申報已提高」這兩件事構成。而這兩件事分屬不同法律的管轄。\n\n社會保險勞務士法（昭和43年法律第89號）第2條第1項逐號規定社會保險勞務士的業務。第1號是依勞動社會保險各項法令製作申請書等文件並代為提出，第3號是關於勞務管理及其他勞動事項的諮詢與指導。薪資制度的設計屬於第3號。\n\n另一方面，行政書士法（昭和26年法律第4號）第1條之2第1項規定，受他人委託製作**向官公署提出的文件**，屬行政書士的業務。向身為指定權者的自治體提出的計畫書・實績報告書即屬於此。\n\n也就是說，**即使是同一個加算，「薪資這一側」與「申報這一側」所依據的法律並不相同**。\n\n## 社會保險勞務士負責到哪裡？\n\n| 工序 | 內容 |\n|---|---|\n| 薪資制度的設計 | 就業規則・薪資規程的修訂，滿足職涯路徑要件的職等與評價架構 |\n| 薪資改善額的計算 | 對照加算的預估金額，設計並核對分配給誰、各多少 |\n| 反映於月薪 | 整理要加在基本薪資還是津貼，並反映於勞動條件通知書 |\n| 確認對勞動社會保險的影響 | 因薪資調升而是否需要變更標準報酬月額（隨時改定） |\n\n最容易被忽略的是最後一列。薪資調升，社會保險費也會隨之變動。若未事先掌握加算所得的財源中，事業主負擔部分會增加多少，實際到手金額的改善幅度就會小於預期。\n\n## 行政書士從哪裡開始負責？\n\n| 工序 | 內容 |\n|---|---|\n| 加算體制申報 | 申報所要計算的加算區分 |\n| 計畫書 | 年度之初向指定權者提出的處遇改善計畫書 |\n| 實績報告書 | 年度結束後的實績報告 |\n| 變更申報 | 計畫發生變更時的申報 |\n\n格式・提出期限・附件，各指定權者（自治體）的運用並不相同。即使是文京區的事業所，也有須向東京都提出與須向區提出的文件之別。\n\n## 分開委託，費用會重複支付嗎？\n\n因為工序不同，不會重複支付。但是**契約會變成兩份**。\n\n四葉的費用如下。\n\n| 工序 | 負責 | 費用（含稅） |\n|---|---|---|\n| 薪資要件的設計・薪資改善額的計算 | 四葉社会保険労務士事務所 | 個別估價 |\n| 處遇改善加算 計畫書（申報） | 四葉行政書士事務所 | 66,000日圓 |\n| 處遇改善加算 實績報告 | 四葉行政書士事務所 | 55,000日圓 |\n\n薪資這一側採個別估價，是因為作業量會隨員工人數與現行薪資體系而大幅變動。薪資規程已經完備的事業所，與從現在開始建立的事業所，同樣稱為「設計」，內容並不相同。\n\n## 四葉如何承接？\n\n四葉社会保険労務士事務所與四葉行政書士事務所是**各自獨立的事業體**。代表同為浦松丈二，但契約・請款・入帳分別進行，須**另行簽約**、**分別承接**。雙方不收取介紹費。\n\n只委託其中一方也沒有問題。有的事業所薪資的設計可自行處理，因此只委託申報；也有相反的情形。\n\n薪資這一側的業務內容刊載於[處遇改善加算的薪資要件](/zh-tw/labor/services/shogu-kaizen)，費用的全貌刊載於[報酬額表](/zh-tw/labor/ryokin)。\n\n關於事業所的指定申請本身，請參閱[障礙福祉服務的指定申請](/zh-tw/legal/services/shogai-fukushi)；關於團體家屋報酬・加算的全貌，請參閱[團體家屋開設｜報酬體系・加算的基礎](/zh-tw/legal/column/group-home-hoshu-taikei-kasan-kiso)。\n\n## 常見問題\n\n**Q. 我們已有顧問社會保險勞務士，可以只把申報委託給其他事務所嗎？**\nA. 沒有問題。申報屬行政書士的業務，因此本來就不是社會保險勞務士事務所所能承接的工序。由顧問的社會保險勞務士照看薪資這一側，僅將申報委託行政書士，是常見的組合。\n\n**Q. 若委託同時持有兩種資格的人，契約可以只有一份嗎？**\nA. 無法。即使同一人持有兩種資格，仍須依業務別以不同的登錄、不同的事務所執行，因此契約會分開。四葉亦同，代表雖同時登錄為社會保險勞務士與行政書士，仍由各事務所分別受任。\n\n**Q. 提出計畫書之前，薪資的設計必須先完成嗎？**\nA. 順序上是如此。計畫書須記載薪資改善的方法與預估金額，因此薪資這一側必須先行確定。若要趕上年度的更替，建議自期限回推、提早著手。\n\n**Q. 取得加算後，社會保險費也會上升嗎？**\nA. 薪資調升後，標準報酬月額有可能變動。若固定性薪資發生變動並符合一定要件，即成為隨時改定的對象，事業主的保險費負擔也會增加。建議事先掌握加算的財源中有多少會實際成為到手金額。個別的判斷，將於檢視薪資明細後作成。\n\n## 本文的依據\n\n- 社會保險勞務士法（昭和43年法律第89號）第2條第1項第1號・第3號、第27條\n- 行政書士法（昭和26年法律第4號）第1條之2第1項、第19條第1項\n- 福祉・介護職員等處遇改善加算的要件・格式・提出期限，依厚生勞動省的通知及指定權者（自治體）的運用。因每年度均會修訂，請確認最新格式。本文未記載特定年度的加算率與格式編號。\n\n本文為一般性的資訊提供。因應個別情況的判斷，將由有資格者於面談後作成。本文執筆：[浦松丈二](/zh-tw/about/uramatsu)（社會保險勞務士・行政書士・宅地建物取引士）。",
        "category": "該委託誰",
        "keywords": [
          "處遇改善加算 社會保險勞務士 行政書士 該委託誰",
          "處遇改善加算 委託對象",
          "處遇改善加算 計畫書 代辦",
          "處遇改善加算 薪資改善額 計算",
          "障礙福祉 處遇改善加算 諮詢",
          "處遇改善加算 執業範圍"
        ],
        "tags": [
          "處遇改善加算",
          "障礙福祉",
          "介護",
          "執業範圍",
          "社會保險勞務士",
          "行政書士"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社會保險勞務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "我們已有顧問社會保險勞務士，可以只把申報委託給其他事務所嗎？",
            "answer": "沒有問題。申報屬行政書士的業務，因此本來就不是社會保險勞務士事務所所能承接的工序。由顧問的社會保險勞務士照看薪資這一側，僅將申報委託行政書士，是常見的組合。"
          },
          {
            "question": "若委託同時持有兩種資格的人，契約可以只有一份嗎？",
            "answer": "無法。即使同一人持有兩種資格，仍須依業務別以不同的登錄、不同的事務所執行，因此契約會分開。四葉亦同，代表雖同時登錄為社會保險勞務士與行政書士，仍由各事務所分別受任。"
          },
          {
            "question": "提出計畫書之前，薪資的設計必須先完成嗎？",
            "answer": "順序上是如此。計畫書須記載薪資改善的方法與預估金額，因此薪資這一側必須先行確定。若要趕上年度的更替，建議自期限回推、提早著手。"
          },
          {
            "question": "取得加算後，社會保險費也會上升嗎？",
            "answer": "薪資調升後，標準報酬月額有可能變動。若固定性薪資發生變動並符合一定要件，即成為隨時改定的對象，事業主的保險費負擔也會增加。建議事先掌握加算的財源中有多少會實際成為到手金額。個別的判斷，將於檢視薪資明細後作成。"
          }
        ]
      },
      "zh": {
        "title": "处遇改善加算，该委托社会保险劳务士还是行政书士？",
        "excerpt": "处遇改善加算按工序划分负责人。工资制度的设计与工资改善额的计算属社会保险劳务士，向指定权者提交的计划书・实绩报告书的制作属行政书士。因所依据的法律不同，一家事务所无法兼称两者。本文一并说明四葉的分工与费用。",
        "content": "**结论（先讲重点）**：处遇改善加算**按工序划分负责人**。就业规则、工资规程、职业发展路径要件等工资制度的设计，以及工资改善额的计算，属社会保险劳务士。加算体制申报、计划书、实绩报告书等向指定权者（自治体）提交之文件的制作，属行政书士。一家事务所无法兼称两者，因此会分成两份合同。\n\n「处遇改善加算要找社会保险劳务士，还是找行政书士？」——这是残障福祉・介护的事业者经常提出的问题。在网上搜索，会看到社会保险劳务士事务所与行政书士事务所都写着「可对应处遇改善加算」。看似矛盾，实际上只是**各自所指的工序不同**而已。\n\n## 为什么同一个加算会牵涉到两种资格？\n\n处遇改善加算由「提高工资」与「申报已提高」这两件事构成。而这两件事分属不同法律的管辖。\n\n社会保险劳务士法（昭和43年法律第89号）第2条第1项逐号规定社会保险劳务士的业务。第1号是依劳动社会保险各项法令制作申请书等文件并代为提交，第3号是关于劳务管理及其他劳动事项的咨询与指导。工资制度的设计属于第3号。\n\n另一方面，行政书士法（昭和26年法律第4号）第1条之2第1项规定，受他人委托制作**向官公署提交的文件**，属行政书士的业务。向作为指定权者的自治体提交的计划书・实绩报告书即属于此。\n\n也就是说，**即使是同一个加算，「工资这一侧」与「申报这一侧」所依据的法律并不相同**。\n\n## 社会保险劳务士负责到哪里？\n\n| 工序 | 内容 |\n|---|---|\n| 工资制度的设计 | 就业规则・工资规程的修订，满足职业发展路径要件的职级与评价框架 |\n| 工资改善额的计算 | 对照加算的预计金额，设计并核对分配给谁、各多少 |\n| 反映于月工资 | 梳理要加在基本工资还是津贴，并反映于劳动条件通知书 |\n| 确认对劳动社会保险的影响 | 因工资上调而是否需要变更标准报酬月额（随时改定） |\n\n最容易被忽略的是最后一行。工资上调，社会保险费也会随之变动。若未事先掌握加算所得的财源中，事业主负担部分会增加多少，实际到手金额的改善幅度就会小于预期。\n\n## 行政书士从哪里开始负责？\n\n| 工序 | 内容 |\n|---|---|\n| 加算体制申报 | 申报所要计算的加算区分 |\n| 计划书 | 年度之初向指定权者提交的处遇改善计划书 |\n| 实绩报告书 | 年度结束后的实绩报告 |\n| 变更申报 | 计划发生变更时的申报 |\n\n格式・提交期限・附件，各指定权者（自治体）的运用并不相同。即使是文京区的事业所，也有须向东京都提交与须向区提交的文件之别。\n\n## 分开委托，费用会重复支付吗？\n\n因为工序不同，不会重复支付。但是**合同会变成两份**。\n\n四葉的费用如下。\n\n| 工序 | 负责 | 费用（含税） |\n|---|---|---|\n| 工资要件的设计・工资改善额的计算 | 四葉社会保険労務士事務所 | 个别估价 |\n| 处遇改善加算 计划书（申报） | 四葉行政書士事務所 | 66,000日元 |\n| 处遇改善加算 实绩报告 | 四葉行政書士事務所 | 55,000日元 |\n\n工资这一侧采用个别估价，是因为作业量会随员工人数与现行工资体系而大幅变动。工资规程已经完备的事业所，与从现在开始建立的事业所，同样称为「设计」，内容并不相同。\n\n## 四葉如何承接？\n\n四葉社会保険労務士事務所与四葉行政書士事務所是**各自独立的事业体**。代表同为浦松丈二，但合同・请款・入账分别进行，须**另行签约**、**分别承接**。双方不收取介绍费。\n\n只委托其中一方也没有问题。有的事业所工资的设计可自行处理，因此只委托申报；也有相反的情形。\n\n工资这一侧的业务内容刊载于[处遇改善加算的工资要件](/zh/labor/services/shogu-kaizen)，费用的全貌刊载于[报酬额表](/zh/labor/ryokin)。\n\n关于事业所的指定申请本身，请参阅[残障福祉服务的指定申请](/zh/legal/services/shogai-fukushi)；关于团体家屋报酬・加算的全貌，请参阅[团体家屋开设｜报酬体系・加算的基础](/zh/legal/column/group-home-hoshu-taikei-kasan-kiso)。\n\n## 常见问题\n\n**Q. 我们已有顾问社会保险劳务士，可以只把申报委托给其他事务所吗？**\nA. 没有问题。申报属行政书士的业务，因此本来就不是社会保险劳务士事务所所能承接的工序。由顾问的社会保险劳务士照看工资这一侧，仅将申报委托行政书士，是常见的组合。\n\n**Q. 若委托同时持有两种资格的人，合同可以只有一份吗？**\nA. 无法。即使同一人持有两种资格，仍须按业务分别以不同的登录、不同的事务所执行，因此合同会分开。四葉亦同，代表虽同时登录为社会保险劳务士与行政书士，仍由各事务所分别受任。\n\n**Q. 提交计划书之前，工资的设计必须先完成吗？**\nA. 顺序上是如此。计划书须记载工资改善的方法与预计金额，因此工资这一侧必须先行确定。若要赶上年度的更替，建议自期限倒推、提早着手。\n\n**Q. 取得加算后，社会保险费也会上升吗？**\nA. 工资上调后，标准报酬月额有可能变动。若固定性工资发生变动并符合一定要件，即成为随时改定的对象，事业主的保险费负担也会增加。建议事先掌握加算的财源中有多少会实际成为到手金额。个别的判断，将于查看工资明细后作出。\n\n## 本文的依据\n\n- 社会保险劳务士法（昭和43年法律第89号）第2条第1项第1号・第3号、第27条\n- 行政书士法（昭和26年法律第4号）第1条之2第1项、第19条第1项\n- 福祉・介护职员等处遇改善加算的要件・格式・提交期限，依厚生劳动省的通知及指定权者（自治体）的运用。因每年度均会修订，请确认最新格式。本文未记载特定年度的加算率与格式编号。\n\n本文为一般性的信息提供。针对个别情况的判断，将由有资格者于面谈后作出。本文执笔：[浦松丈二](/zh/about/uramatsu)（社会保险劳务士・行政书士・宅地建物取引士）。",
        "category": "该委托谁",
        "keywords": [
          "处遇改善加算 社会保险劳务士 行政书士 该委托谁",
          "处遇改善加算 委托对象",
          "处遇改善加算 计划书 代办",
          "处遇改善加算 工资改善额 计算",
          "残障福祉 处遇改善加算 咨询",
          "处遇改善加算 执业范围"
        ],
        "tags": [
          "处遇改善加算",
          "残障福祉",
          "介护",
          "执业范围",
          "社会保险劳务士",
          "行政书士"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社会保险劳务士・行政书士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "我们已有顾问社会保险劳务士，可以只把申报委托给其他事务所吗？",
            "answer": "没有问题。申报属行政书士的业务，因此本来就不是社会保险劳务士事务所所能承接的工序。由顾问的社会保险劳务士照看工资这一侧，仅将申报委托行政书士，是常见的组合。"
          },
          {
            "question": "若委托同时持有两种资格的人，合同可以只有一份吗？",
            "answer": "无法。即使同一人持有两种资格，仍须按业务分别以不同的登录、不同的事务所执行，因此合同会分开。四葉亦同，代表虽同时登录为社会保险劳务士与行政书士，仍由各事务所分别受任。"
          },
          {
            "question": "提交计划书之前，工资的设计必须先完成吗？",
            "answer": "顺序上是如此。计划书须记载工资改善的方法与预计金额，因此工资这一侧必须先行确定。若要赶上年度的更替，建议自期限倒推、提早着手。"
          },
          {
            "question": "取得加算后，社会保险费也会上升吗？",
            "answer": "工资上调后，标准报酬月额有可能变动。若固定性工资发生变动并符合一定要件，即成为随时改定的对象，事业主的保险费负担也会增加。建议事先掌握加算的财源中有多少会实际成为到手金额。个别的判断，将于查看工资明细后作出。"
          }
        ]
      }
    }
  },
  {
    "business": "labor",
    "slug": "joseikin-hojokin-dochira-ni-tanomu",
    "title": "助成金と補助金は、どちらに頼めばいいのか",
    "date": "2026-09-01",
    "category": "誰に頼むか",
    "excerpt": "「人を雇う・働き方を変える」お金が助成金で社会保険労務士の領域、「事業を興す・設備を入れる」お金が補助金で行政書士の領域です。原資も審査の考え方も違います。雇用保険法第62条という根拠から、なぜ頼む相手が分かれるのかを整理します。",
    "content": "**結論（先に要点）**：おおまかには、**「人を雇う・働き方を変える」お金が助成金で、社会保険労務士の領域。「事業を興す・設備を入れる」お金が補助金で、行政書士の領域**です。名前が似ていますが、原資も、審査の考え方も、頼む相手も違います。\n\n「助成金と補助金、どちらに申し込めばいいですか」と聞かれることがあります。この質問には、その前に確かめることが2つあります。**何にお金を使いたいのか**と、**誰に頼むのか**です。\n\n## 助成金と補助金は、何が違うのか？\n\n| | 雇用関係の助成金 | 補助金 |\n|---|---|---|\n| 原資 | 事業主が納める雇用保険料（雇用保険二事業） | 国・自治体の予算 |\n| 主な所管 | 厚生労働省・労働局 | 経済産業省・中小企業庁・自治体など |\n| 募集 | 通年のものが多い | 公募期間が限られる |\n| 採否 | 要件を満たせば支給されるものが多い | 審査・採択があり、要件を満たしても不採択がある |\n| 代行できる資格 | 社会保険労務士 | 行政書士（申請書類の作成） |\n\nいちばん実務に響く違いは、下から2行目です。**助成金は「要件を満たしているか」の勝負、補助金は「選ばれるか」の勝負**です。だから補助金には事業計画の書き方という工夫の余地があり、助成金にはあまりありません。そのかわり助成金は、要件を1つ落とすと支給されません。\n\n雇用関係の助成金は、雇用保険法（昭和49年法律第116号）第62条の雇用安定事業として行われます。原資が雇用保険料であるため、**雇用保険の適用事業所であること**が入口の条件になります。\n\n## なぜ、頼む相手が分かれるのか？\n\n社会保険労務士法（昭和43年法律第89号）別表第一は、社会保険労務士が扱う法令を列挙しています。雇用保険法はこの中に入っています。したがって、**報酬を得て雇用関係助成金の申請書類を作成し、提出を代行できるのは社会保険労務士**です（同法第27条）。\n\n補助金は雇用保険法に基づくものではないため、この制限にかかりません。官公署に提出する書類の作成として、行政書士法（昭和26年法律第4号）第1条の2第1項の業務になります。\n\nつまり**資格で線を引いているのではなく、根拠となる法律で線が引かれている**のです。\n\n## 「うちはどちらですか」を見分けるには\n\nやりたいことから逆に引くのが早道です。\n\n**助成金の側にあるもの**\n\n- 有期契約の社員を正社員にしたい\n- 高齢者・障害のある方・就職が難しい方を雇い入れたい\n- 育児・介護と両立できる制度を作りたい\n- 従業員に研修を受けさせたい\n- 業績が落ちたが雇用を維持したい\n\n**補助金の側にあるもの**\n\n- 設備・機械を導入したい\n- 販路を開拓したい、ウェブサイトを作りたい\n- 新しい事業を始めたい\n- 事業を承継したい\n\n境目にあるのが「人を雇うために設備を入れる」ようなケースです。この場合は両方に該当することがあり、併給の可否を個別に確認することになります。\n\n## 四葉ではどう受けているのか？\n\n| | 担当 | 料金（税込） |\n|---|---|---|\n| [雇用関係助成金](/labor/services/joseikin)の申請代行 | 四葉社会保険労務士事務所 | 着手金なし ＋ 成功報酬 支給額の20%（顧問先限定） |\n| 補助金の申請サポート | 四葉行政書士事務所 | [報酬額表](/legal/ryokin)をご覧ください |\n\n顧問料と手続の料金は[報酬額表](/labor/ryokin)に掲載しています。\n\n助成金を顧問先限定にしているのは、要件の確認に日常の労務の状況が必要だからです。就業規則の内容、労働条件通知書の書き方、出勤簿の付け方——助成金の不支給は、こうした足元でつまずくことがほとんどです。単発で書類だけを整えても、支給までは届きません。\n\n四葉社会保険労務士事務所と四葉行政書士事務所は、それぞれ独立した事業体です。どちらも代表は浦松丈二ですが、契約・請求・入金は別々になります。紹介料の授受は行いません。\n\n## よくある質問\n\n**Q. 助成金は必ずもらえるのですか？**\nA. 要件を満たしていれば支給されるものが多い、というのが補助金との違いです。ただし「必ず」ではありません。支給申請の期限を過ぎた、対象労働者の要件を満たしていなかった、労働関係法令の違反があった——といった理由で不支給になることがあります。\n\n**Q. 過去に労働基準監督署から是正勧告を受けています。助成金は使えますか？**\nA. 助成金の多くは、不正受給や労働保険料の滞納、一定の労働関係法令違反がないことを支給要件にしています。是正勧告そのものが直ちに欠格になるとは限りませんが、是正が済んでいるかどうかが問われます。個別のご事情を伺ったうえで確認します。\n\n**Q. 助成金の申請を、コンサルタント会社から勧められました。**\nA. 報酬を得て雇用関係助成金の申請書類を作成・提出代行できるのは社会保険労務士です（社会保険労務士法第27条）。「社労士と提携している」という説明を受けた場合は、実際に誰と契約し、誰に支払うのかをご確認ください。四葉では紹介料の授受を行わず、それぞれの事務所と直接ご契約いただく形をとっています。\n\n**Q. 助成金と補助金は、同時に使えますか？**\nA. 制度によります。同じ経費に対して重複して受けることは、一般に認められません。ただし対象が異なれば併用できる場合があります。個別の組み合わせについては、それぞれの公募要領・支給要領で確認する必要があります。\n\n## この記事の根拠\n\n- 雇用保険法（昭和49年法律第116号）第62条（雇用安定事業）\n- 社会保険労務士法（昭和43年法律第89号）第2条第1項第1号、第27条、別表第一\n- 行政書士法（昭和26年法律第4号）第1条の2第1項\n- 個々の助成金・補助金の要件、支給額、期限は、所管する省庁・自治体の支給要領および公募要領によります。年度ごとに改定されるため、最新のものをご確認ください。本記事では特定の助成金・補助金の名称と金額は記載していません。\n\n本記事は一般的な情報提供です。個別のご事情に応じた判断は、面談のうえ資格者が行います。執筆は[浦松丈二](/about/uramatsu)（社会保険労務士・行政書士・宅地建物取引士）です。",
    "status": "published",
    "author": {
      "name": "浦松 丈二",
      "title": "社会保険労務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
    },
    "keywords": [
      "助成金 補助金 違い",
      "助成金 社労士 行政書士 どちら",
      "雇用関係助成金 誰に頼む",
      "助成金 申請代行 資格",
      "補助金 行政書士",
      "助成金 コンサル 社労士"
    ],
    "tags": [
      "助成金",
      "補助金",
      "雇用保険",
      "業際",
      "社会保険労務士",
      "行政書士"
    ],
    "locales": [],
    "faq": [
      {
        "question": "助成金は必ずもらえるのですか？",
        "answer": "要件を満たしていれば支給されるものが多い、というのが補助金との違いです。ただし「必ず」ではありません。支給申請の期限を過ぎた、対象労働者の要件を満たしていなかった、労働関係法令の違反があった——といった理由で不支給になることがあります。"
      },
      {
        "question": "過去に労働基準監督署から是正勧告を受けています。助成金は使えますか？",
        "answer": "助成金の多くは、不正受給や労働保険料の滞納、一定の労働関係法令違反がないことを支給要件にしています。是正勧告そのものが直ちに欠格になるとは限りませんが、是正が済んでいるかどうかが問われます。個別のご事情を伺ったうえで確認します。"
      },
      {
        "question": "助成金の申請を、コンサルタント会社から勧められました。",
        "answer": "報酬を得て雇用関係助成金の申請書類を作成・提出代行できるのは社会保険労務士です（社会保険労務士法第27条）。「社労士と提携している」という説明を受けた場合は、実際に誰と契約し、誰に支払うのかをご確認ください。四葉では紹介料の授受を行わず、それぞれの事務所と直接ご契約いただく形をとっています。"
      },
      {
        "question": "助成金と補助金は、同時に使えますか？",
        "answer": "制度によります。同じ経費に対して重複して受けることは、一般に認められません。ただし対象が異なれば併用できる場合があります。個別の組み合わせについては、それぞれの公募要領・支給要領で確認する必要があります。"
      }
    ],
    "translations": {
      "en": {
        "title": "Joseikin or hojokin — which one, and who do you ask?",
        "excerpt": "Broadly, money for hiring people and changing how they work is a joseikin (employment-related subsidy), and that is the shakai hoken roumushi's field; money for starting a business or installing equipment is a hojokin (grant), and that is the gyoseishoshi's field. The funding source and the way applications are assessed both differ. Starting from Article 62 of the Employment Insurance Act, we set out why the person you ask changes.",
        "content": "**In short:** Broadly, **money for \"hiring people and changing how they work\" is a joseikin (an employment-related subsidy), and that is the field of the shakai hoken roumushi (Certified Social Insurance and Labor Consultant). Money for \"starting a business and installing equipment\" is a hojokin (a grant), and that is the field of the gyoseishoshi (Certified Administrative Procedures Legal Specialist)**. The names look alike, but the funding source, the way applications are assessed, and the person you ask are all different.\n\n\"Which should we apply for, a joseikin or a hojokin?\" We are asked this from time to time. Two things have to be settled before the question can be answered: **what you want to spend the money on**, and **who you ask**.\n\n## What is the difference between a joseikin and a hojokin?\n\n| | Employment-related subsidies (joseikin) | Grants (hojokin) |\n|---|---|---|\n| Funding source | The employment insurance premiums employers pay (the employment insurance two-services account) | The budgets of the national government and municipalities |\n| Main jurisdiction | The Ministry of Health, Labour and Welfare and the Labour Bureaus | The Ministry of Economy, Trade and Industry, the Small and Medium Enterprise Agency, municipalities and others |\n| Application windows | Many are open all year round | The public call period is limited |\n| Whether you receive it | Many are paid once you meet the requirements | There is screening and selection; you can meet the requirements and still not be selected |\n| Who may act for you | A shakai hoken roumushi | A gyoseishoshi (preparing the application documents) |\n\nThe difference that matters most in practice is the second row from the bottom. **A joseikin turns on whether you meet the requirements; a hojokin turns on whether you are chosen.** That is why there is room for craft in how a business plan is written for a hojokin, and very little of it for a joseikin. In exchange, a joseikin is not paid at all if you drop a single requirement.\n\nEmployment-related subsidies are carried out as employment stabilization services under Article 62 of the Employment Insurance Act (雇用保険法, Act No. 116 of 1974). Because the money comes from employment insurance premiums, **being an establishment covered by employment insurance** is the threshold condition.\n\n## Why does the person you ask change?\n\nAppended Table 1 of the Certified Social Insurance and Labor Consultant Act (社会保険労務士法, Act No. 89 of 1968) lists the laws a shakai hoken roumushi handles. The Employment Insurance Act is on that list. It follows that **only a shakai hoken roumushi may, for a fee, prepare the application documents for an employment-related subsidy and file them on your behalf** (Article 27 of the same Act).\n\nA hojokin is not based on the Employment Insurance Act, so that restriction does not reach it. Preparing documents to be submitted to public agencies is work under Article 1-2, paragraph 1 of the Certified Administrative Procedures Legal Specialist Act (行政書士法, Act No. 4 of 1951).\n\nIn other words, **the line is not drawn by the qualification; it is drawn by the statute the money rests on**.\n\n## Working out which side you are on\n\nThe quickest route is to work backwards from what you want to do.\n\n**On the joseikin side**\n\n- You want to move fixed-term employees onto permanent contracts\n- You want to hire older workers, people with disabilities, or people who find it hard to get work\n- You want to build arrangements that let staff combine work with childcare or family care\n- You want to put employees through training\n- Business has fallen off but you want to keep people employed\n\n**On the hojokin side**\n\n- You want to bring in equipment or machinery\n- You want to open new sales channels or build a website\n- You want to start a new line of business\n- You want to hand the business on to a successor\n\nThe borderline case is something like \"installing equipment in order to hire people.\" Here both may apply, and whether they can be received together has to be checked case by case.\n\n## How does Yotsuba take this on?\n\n| | Who handles it | Fee (tax incl.) |\n|---|---|---|\n| Filing for [employment-related subsidies](/en/labor/services/joseikin) on your behalf | 四葉社会保険労務士事務所 | No fee up front + a success fee of 20% of the amount granted (retained clients only) |\n| Support with grant applications | 四葉行政書士事務所 | Please see the [fee schedule](/en/legal/ryokin) |\n\nThe retainer and the fees for individual procedures are on [the fee schedule](/en/labor/ryokin).\n\nSubsidies are limited to retained clients because checking the requirements takes a view of day-to-day labor management. The content of the work rules, the way the written notice of working conditions is drafted, how attendance records are kept — non-payment of a subsidy almost always comes from a stumble at that level. Putting the documents in order as a one-off job does not carry you through to payment.\n\n四葉社会保険労務士事務所 and 四葉行政書士事務所 are separate businesses. Joji Uramatsu represents both, but the contracts, the invoices and the payments are separate: each accepts work **separately**, under a **separate contract**. No referral fees are exchanged.\n\n## Frequently asked questions\n\n**Q. Is a joseikin always paid?**\nA. That many of them are paid once you meet the requirements is what separates them from a hojokin. But \"always\" is too strong. A subsidy can go unpaid because the deadline for the payment application passed, because the worker concerned did not meet the requirements, or because there was a breach of the labor laws.\n\n**Q. We have had a corrective recommendation from the Labour Standards Inspection Office in the past. Can we still use a joseikin?**\nA. Most subsidies require that there has been no improper receipt of funds, no delinquency in labor insurance premiums, and no breach of certain labor-related laws. A corrective recommendation does not by itself necessarily disqualify you, but whether the correction has been completed will be asked about. We check after hearing your particular circumstances.\n\n**Q. A consulting firm has recommended that we apply for a joseikin.**\nA. Only a shakai hoken roumushi may, for a fee, prepare and file the application documents for an employment-related subsidy (Article 27 of 社会保険労務士法). If you are told that \"a shakai hoken roumushi is involved,\" please confirm who you will actually be contracting with and who you will be paying. At Yotsuba no referral fees are exchanged, and you contract directly with each office.\n\n**Q. Can a joseikin and a hojokin be used at the same time?**\nA. It depends on the programs. Receiving both against the same expense is generally not allowed. Where what they cover is different, however, they can sometimes be used together. Any particular combination has to be checked against the public call guidelines and the payment guidelines for each.\n\n## Sources for this article\n\n- 雇用保険法 (Act No. 116 of 1974), Article 62 (employment stabilization services)\n- 社会保険労務士法 (Act No. 89 of 1968), Article 2, paragraph 1, item 1; Article 27; Appended Table 1\n- 行政書士法 (Act No. 4 of 1951), Article 1-2, paragraph 1\n- The requirements, amounts and deadlines of individual subsidies and grants follow the payment guidelines and public call guidelines of the ministry or municipality with jurisdiction. They are revised each fiscal year, so please check the current version. This article does not name any particular subsidy or grant, or state amounts.\n\nThis article is general information. A judgment on your individual circumstances is made by a qualified professional after a consultation. Written by [Joji Uramatsu](/en/about/uramatsu) (Shakai Hoken Roumushi, Gyoseishoshi, Registered Real Estate Transaction Specialist).",
        "category": "Who to ask",
        "keywords": [
          "difference between joseikin and hojokin",
          "employment subsidy shakai hoken roumushi or gyoseishoshi",
          "who to ask employment related subsidy",
          "qualification to file subsidy applications",
          "hojokin grant gyoseishoshi",
          "subsidy consultant social insurance labor consultant"
        ],
        "tags": [
          "Employment subsidies (joseikin)",
          "Grants (hojokin)",
          "Employment insurance",
          "Scope of practice",
          "Shakai Hoken Roumushi",
          "Gyoseishoshi"
        ],
        "author": {
          "name": "Joji Uramatsu",
          "title": "Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist — 四葉社会保険労務士事務所／四葉行政書士事務所"
        },
        "faq": [
          {
            "question": "Is a joseikin always paid?",
            "answer": "That many of them are paid once you meet the requirements is what separates them from a hojokin. But \"always\" is too strong. A subsidy can go unpaid because the deadline for the payment application passed, because the worker concerned did not meet the requirements, or because there was a breach of the labor laws."
          },
          {
            "question": "We have had a corrective recommendation from the Labour Standards Inspection Office in the past. Can we still use a joseikin?",
            "answer": "Most subsidies require that there has been no improper receipt of funds, no delinquency in labor insurance premiums, and no breach of certain labor-related laws. A corrective recommendation does not by itself necessarily disqualify you, but whether the correction has been completed will be asked about. We check after hearing your particular circumstances."
          },
          {
            "question": "A consulting firm has recommended that we apply for a joseikin.",
            "answer": "Only a shakai hoken roumushi may, for a fee, prepare and file the application documents for an employment-related subsidy (Article 27 of 社会保険労務士法). If you are told that \"a shakai hoken roumushi is involved,\" please confirm who you will actually be contracting with and who you will be paying. At Yotsuba no referral fees are exchanged, and you contract directly with each office."
          },
          {
            "question": "Can a joseikin and a hojokin be used at the same time?",
            "answer": "It depends on the programs. Receiving both against the same expense is generally not allowed. Where what they cover is different, however, they can sometimes be used together. Any particular combination has to be checked against the public call guidelines and the payment guidelines for each."
          }
        ]
      },
      "zh-tw": {
        "title": "助成金與補助金，該委託誰？",
        "excerpt": "大致而言，「僱用人力・改變工作方式」的錢是助成金，屬社會保險勞務士的領域；「創辦事業・導入設備」的錢是補助金，屬行政書士的領域。財源與審查的思考方式都不同。本文從僱用保險法第62條這項依據，整理為什麼委託的對象會不同。",
        "content": "**結論（先講重點）**：大致而言，**「僱用人力・改變工作方式」的錢是助成金，屬社會保險勞務士的領域；「創辦事業・導入設備」的錢是補助金，屬行政書士的領域**。名稱相似，但財源、審查的思考方式、以及委託的對象都不相同。\n\n「助成金和補助金，我們該申請哪一個？」有時會被這樣詢問。要回答這個問題，必須先確認兩件事：**想把錢用在什麼地方**，以及**要委託誰**。\n\n## 助成金與補助金，差別在哪裡？\n\n| | 僱用關係的助成金 | 補助金 |\n|---|---|---|\n| 財源 | 事業主繳納的僱用保險費（僱用保險二事業） | 國家・自治體的預算 |\n| 主要主管機關 | 厚生勞動省・勞動局 | 經濟產業省・中小企業廳・自治體等 |\n| 招募 | 多為全年受理 | 公開招募期間有限 |\n| 是否獲得 | 多數只要符合要件即可獲得支付 | 有審查與採納，即使符合要件也可能未獲採納 |\n| 可代辦的資格 | 社會保險勞務士 | 行政書士（申請文件的製作） |\n\n在實務上影響最大的差異是倒數第二列。**助成金比的是「是否符合要件」，補助金比的是「是否被選上」**。因此補助金在事業計畫的寫法上有下工夫的空間，助成金則幾乎沒有。相對地，助成金只要漏掉一項要件就不會支付。\n\n僱用關係的助成金，是依僱用保險法（昭和49年法律第116號）第62條作為僱用安定事業而實施。由於財源是僱用保險費，**必須是僱用保險的適用事業所**，這是入口的條件。\n\n## 為什麼委託的對象會不同？\n\n社會保險勞務士法（昭和43年法律第89號）別表第一列舉了社會保險勞務士所處理的法令。僱用保險法即列於其中。因此，**得以收取報酬製作僱用關係助成金的申請文件並代為提出者，限於社會保險勞務士**（同法第27條）。\n\n補助金並非依僱用保險法而來，因此不受此一限制。作為向官公署提出之文件的製作，屬行政書士法（昭和26年法律第4號）第1條之2第1項的業務。\n\n也就是說，**劃線的並不是資格，而是作為依據的法律**。\n\n## 判斷「我們屬於哪一邊」的方法\n\n從想做的事情反推最為快速。\n\n**屬於助成金這一側的**\n\n- 想把有期契約的員工轉為正職員工\n- 想僱用高齡者・身心障礙者・就業困難者\n- 想建立能兼顧育兒・照護的制度\n- 想讓員工接受培訓\n- 業績下滑但想維持僱用\n\n**屬於補助金這一側的**\n\n- 想導入設備・機械\n- 想開拓銷售通路、想製作網站\n- 想開始新的事業\n- 想承繼事業\n\n位於交界的，是「為了僱用人力而導入設備」這類情形。此時可能兩者皆符合，是否可併同領取須個別確認。\n\n## 四葉如何承接？\n\n| | 負責 | 費用（含稅） |\n|---|---|---|\n| [僱用關係助成金](/zh-tw/labor/services/joseikin)的申請代辦 | 四葉社会保険労務士事務所 | 不收取著手金 ＋ 成功報酬 支付金額的20%（限顧問客戶） |\n| 補助金的申請支援 | 四葉行政書士事務所 | 請參閱[報酬額表](/zh-tw/legal/ryokin) |\n\n顧問費與各項手續的費用，刊載於[報酬額表](/zh-tw/labor/ryokin)。\n\n助成金之所以限於顧問客戶，是因為確認要件需要掌握日常的勞務狀況。就業規則的內容、勞動條件通知書的寫法、出勤簿的記載方式——助成金不予支付，多半是在這些基本之處絆倒。即使單次把文件整理妥當，也走不到支付這一步。\n\n四葉社会保険労務士事務所與四葉行政書士事務所是各自獨立的事業體。兩者的代表同為浦松丈二，但契約・請款・入帳分別進行，須**另行簽約**、**分別承接**。雙方不收取介紹費。\n\n## 常見問題\n\n**Q. 助成金一定領得到嗎？**\nA. 多數只要符合要件即可獲得支付，這是與補助金的差異所在。但並非「一定」。可能因為超過支付申請的期限、未滿足對象勞工的要件、或有違反勞動相關法令的情形，而不予支付。\n\n**Q. 我們過去曾被勞動基準監督署糾正勸告。還能使用助成金嗎？**\nA. 多數助成金以未有不正當領取、未滯納勞動保險費、未違反一定的勞動相關法令作為支付要件。糾正勸告本身未必立即構成失格，但會被追問是否已完成改善。將於聽取個別情況後確認。\n\n**Q. 有顧問公司建議我們申請助成金。**\nA. 得以收取報酬製作僱用關係助成金的申請文件並代為提出者，限於社會保險勞務士（社會保險勞務士法第27條）。若對方說明「有社會保險勞務士參與」，請確認實際上是與誰簽約、向誰付款。四葉不收取介紹費，採取由您與各事務所直接簽約的方式。\n\n**Q. 助成金與補助金可以同時使用嗎？**\nA. 視制度而定。針對同一筆費用重複領取，一般不被認可。但若對象不同，仍有可併用的情形。個別的組合，須依各自的公開招募要領與支付要領確認。\n\n## 本文的依據\n\n- 僱用保險法（昭和49年法律第116號）第62條（僱用安定事業）\n- 社會保險勞務士法（昭和43年法律第89號）第2條第1項第1號、第27條、別表第一\n- 行政書士法（昭和26年法律第4號）第1條之2第1項\n- 個別助成金・補助金的要件、支付金額、期限，依主管的省廳・自治體的支付要領及公開招募要領。因每年度均會修訂，請確認最新版本。本文未記載特定助成金・補助金的名稱與金額。\n\n本文為一般性的資訊提供。因應個別情況的判斷，將由有資格者於面談後作成。本文執筆：[浦松丈二](/zh-tw/about/uramatsu)（社會保險勞務士・行政書士・宅地建物取引士）。",
        "category": "該委託誰",
        "keywords": [
          "助成金 補助金 差異",
          "助成金 社會保險勞務士 行政書士 該委託誰",
          "僱用關係助成金 委託對象",
          "助成金 申請代辦 資格",
          "補助金 行政書士",
          "助成金 顧問公司 社會保險勞務士"
        ],
        "tags": [
          "助成金",
          "補助金",
          "僱用保險",
          "執業範圍",
          "社會保險勞務士",
          "行政書士"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社會保險勞務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "助成金一定領得到嗎？",
            "answer": "多數只要符合要件即可獲得支付，這是與補助金的差異所在。但並非「一定」。可能因為超過支付申請的期限、未滿足對象勞工的要件、或有違反勞動相關法令的情形，而不予支付。"
          },
          {
            "question": "我們過去曾被勞動基準監督署糾正勸告。還能使用助成金嗎？",
            "answer": "多數助成金以未有不正當領取、未滯納勞動保險費、未違反一定的勞動相關法令作為支付要件。糾正勸告本身未必立即構成失格，但會被追問是否已完成改善。將於聽取個別情況後確認。"
          },
          {
            "question": "有顧問公司建議我們申請助成金。",
            "answer": "得以收取報酬製作僱用關係助成金的申請文件並代為提出者，限於社會保險勞務士（社會保險勞務士法第27條）。若對方說明「有社會保險勞務士參與」，請確認實際上是與誰簽約、向誰付款。四葉不收取介紹費，採取由您與各事務所直接簽約的方式。"
          },
          {
            "question": "助成金與補助金可以同時使用嗎？",
            "answer": "視制度而定。針對同一筆費用重複領取，一般不被認可。但若對象不同，仍有可併用的情形。個別的組合，須依各自的公開招募要領與支付要領確認。"
          }
        ]
      },
      "zh": {
        "title": "助成金与补助金，该委托谁？",
        "excerpt": "大致而言，「雇用人力・改变工作方式」的钱是助成金，属社会保险劳务士的领域；「创办事业・导入设备」的钱是补助金，属行政书士的领域。财源与审查的思考方式都不同。本文从雇用保险法第62条这项依据，梳理为什么委托的对象会不同。",
        "content": "**结论（先讲重点）**：大致而言，**「雇用人力・改变工作方式」的钱是助成金，属社会保险劳务士的领域；「创办事业・导入设备」的钱是补助金，属行政书士的领域**。名称相似，但财源、审查的思考方式、以及委托的对象都不相同。\n\n「助成金和补助金，我们该申请哪一个？」有时会被这样询问。要回答这个问题，必须先确认两件事：**想把钱用在什么地方**，以及**要委托谁**。\n\n## 助成金与补助金，区别在哪里？\n\n| | 雇用关系的助成金 | 补助金 |\n|---|---|---|\n| 财源 | 事业主缴纳的雇用保险费（雇用保险二事业） | 国家・自治体的预算 |\n| 主要主管机关 | 厚生劳动省・劳动局 | 经济产业省・中小企业厅・自治体等 |\n| 招募 | 多为全年受理 | 公开招募期间有限 |\n| 是否获得 | 多数只要符合要件即可获得支付 | 有审查与采纳，即使符合要件也可能未获采纳 |\n| 可代办的资格 | 社会保险劳务士 | 行政书士（申请文件的制作） |\n\n在实务上影响最大的区别是倒数第二行。**助成金比的是「是否符合要件」，补助金比的是「是否被选上」**。因此补助金在事业计划的写法上有下功夫的空间，助成金则几乎没有。相对地，助成金只要漏掉一项要件就不会支付。\n\n雇用关系的助成金，是依雇用保险法（昭和49年法律第116号）第62条作为雇用安定事业而实施。由于财源是雇用保险费，**必须是雇用保险的适用事业所**，这是入口的条件。\n\n## 为什么委托的对象会不同？\n\n社会保险劳务士法（昭和43年法律第89号）别表第一列举了社会保险劳务士所处理的法令。雇用保险法即列于其中。因此，**得以收取报酬制作雇用关系助成金的申请文件并代为提交者，限于社会保险劳务士**（同法第27条）。\n\n补助金并非依雇用保险法而来，因此不受此一限制。作为向官公署提交之文件的制作，属行政书士法（昭和26年法律第4号）第1条之2第1项的业务。\n\n也就是说，**划线的并不是资格，而是作为依据的法律**。\n\n## 判断「我们属于哪一边」的方法\n\n从想做的事情反推最为快速。\n\n**属于助成金这一侧的**\n\n- 想把有期合同的员工转为正式员工\n- 想雇用高龄者・身心障碍者・就业困难者\n- 想建立能兼顾育儿・照护的制度\n- 想让员工接受培训\n- 业绩下滑但想维持雇用\n\n**属于补助金这一侧的**\n\n- 想导入设备・机械\n- 想开拓销售渠道、想制作网站\n- 想开始新的事业\n- 想承继事业\n\n位于交界的，是「为了雇用人力而导入设备」这类情形。此时可能两者皆符合，是否可并同领取须个别确认。\n\n## 四葉如何承接？\n\n| | 负责 | 费用（含税） |\n|---|---|---|\n| [雇用关系助成金](/zh/labor/services/joseikin)的申请代办 | 四葉社会保険労務士事務所 | 不收取着手金 ＋ 成功报酬 支付金额的20%（限顾问客户） |\n| 补助金的申请支援 | 四葉行政書士事務所 | 请参阅[报酬额表](/zh/legal/ryokin) |\n\n顾问费与各项手续的费用，刊载于[报酬额表](/zh/labor/ryokin)。\n\n助成金之所以限于顾问客户，是因为确认要件需要掌握日常的劳务状况。就业规则的内容、劳动条件通知书的写法、考勤簿的记载方式——助成金不予支付，多半是在这些基本之处绊倒。即使单次把文件整理妥当，也走不到支付这一步。\n\n四葉社会保険労務士事務所与四葉行政書士事務所是各自独立的事业体。两者的代表同为浦松丈二，但合同・请款・入账分别进行，须**另行签约**、**分别承接**。双方不收取介绍费。\n\n## 常见问题\n\n**Q. 助成金一定领得到吗？**\nA. 多数只要符合要件即可获得支付，这是与补助金的区别所在。但并非「一定」。可能因为超过支付申请的期限、未满足对象劳动者的要件、或有违反劳动相关法令的情形，而不予支付。\n\n**Q. 我们过去曾被劳动基准监督署纠正劝告。还能使用助成金吗？**\nA. 多数助成金以未有不正当领取、未拖欠劳动保险费、未违反一定的劳动相关法令作为支付要件。纠正劝告本身未必立即构成失格，但会被追问是否已完成整改。将于听取个别情况后确认。\n\n**Q. 有顾问公司建议我们申请助成金。**\nA. 得以收取报酬制作雇用关系助成金的申请文件并代为提交者，限于社会保险劳务士（社会保险劳务士法第27条）。若对方说明「有社会保险劳务士参与」，请确认实际上是与谁签约、向谁付款。四葉不收取介绍费，采取由您与各事务所直接签约的方式。\n\n**Q. 助成金与补助金可以同时使用吗？**\nA. 视制度而定。针对同一笔费用重复领取，一般不被认可。但若对象不同，仍有可并用的情形。个别的组合，须依各自的公开招募要领与支付要领确认。\n\n## 本文的依据\n\n- 雇用保险法（昭和49年法律第116号）第62条（雇用安定事业）\n- 社会保险劳务士法（昭和43年法律第89号）第2条第1项第1号、第27条、别表第一\n- 行政书士法（昭和26年法律第4号）第1条之2第1项\n- 个别助成金・补助金的要件、支付金额、期限，依主管的省厅・自治体的支付要领及公开招募要领。因每年度均会修订，请确认最新版本。本文未记载特定助成金・补助金的名称与金额。\n\n本文为一般性的信息提供。针对个别情况的判断，将由有资格者于面谈后作出。本文执笔：[浦松丈二](/zh/about/uramatsu)（社会保险劳务士・行政书士・宅地建物取引士）。",
        "category": "该委托谁",
        "keywords": [
          "助成金 补助金 区别",
          "助成金 社会保险劳务士 行政书士 该委托谁",
          "雇用关系助成金 委托对象",
          "助成金 申请代办 资格",
          "补助金 行政书士",
          "助成金 顾问公司 社会保险劳务士"
        ],
        "tags": [
          "助成金",
          "补助金",
          "雇用保险",
          "执业范围",
          "社会保险劳务士",
          "行政书士"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社会保险劳务士・行政书士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "助成金一定领得到吗？",
            "answer": "多数只要符合要件即可获得支付，这是与补助金的区别所在。但并非「一定」。可能因为超过支付申请的期限、未满足对象劳动者的要件、或有违反劳动相关法令的情形，而不予支付。"
          },
          {
            "question": "我们过去曾被劳动基准监督署纠正劝告。还能使用助成金吗？",
            "answer": "多数助成金以未有不正当领取、未拖欠劳动保险费、未违反一定的劳动相关法令作为支付要件。纠正劝告本身未必立即构成失格，但会被追问是否已完成整改。将于听取个别情况后确认。"
          },
          {
            "question": "有顾问公司建议我们申请助成金。",
            "answer": "得以收取报酬制作雇用关系助成金的申请文件并代为提交者，限于社会保险劳务士（社会保险劳务士法第27条）。若对方说明「有社会保险劳务士参与」，请确认实际上是与谁签约、向谁付款。四葉不收取介绍费，采取由您与各事务所直接签约的方式。"
          },
          {
            "question": "助成金与补助金可以同时使用吗？",
            "answer": "视制度而定。针对同一笔费用重复领取，一般不被认可。但若对象不同，仍有可并用的情形。个别的组合，须依各自的公开招募要领与支付要领确认。"
          }
        ]
      }
    }
  },
  {
    "business": "labor",
    "slug": "kyuyo-keisan-soba-sharoushi",
    "title": "給与計算を社会保険労務士に頼むと、いくらかかるのか",
    "date": "2026-09-01",
    "category": "料金の考え方",
    "excerpt": "給与計算の代行は「基本料金＋従業員1人あたりいくら」が一般的で、1人あたりは月200〜500円（税別）と説明されることが多い形です。なぜ基本料金があるのか、代行と伴走支援をどう見分けるのか、比べるときに揃えるべき4点を整理します。四葉は基本料金なし・1人1,100円（税込）です。",
    "content": "**結論（先に要点）**：給与計算の代行は、**「基本料金＋従業員1人あたりいくら」**という形が一般的です。1人あたりの単価は月200〜500円（税別）と説明されることが多く、税込では220〜550円ほど。ここに基本料金が乗ります。**人数が少ないほど、1人あたりの負担が重くなる**構造です。\n\n給与計算をよそに頼もうとして料金表を見ると、事務所によって金額の出し方がばらばらで比べにくい、という声をよく聞きます。実際に調べてみると、値段そのものよりも**料金の組み立て方**に違いがあることが分かります。\n\n## 市場ではどう値付けされているのか？\n\n| 形 | 料金の例 | 特徴 |\n|---|---|---|\n| 基本料金＋人数比例 | 基本料金 ＋ 1人あたり月200〜500円（税別） | いちばん多い形。少人数だと基本料金の比重が大きい |\n| 顧問料に込み | 顧問料の中に給与計算を含める | 内訳が見えにくい。人数が増えたときの扱いが契約で決まる |\n| 自社で回す支援 | 月6,980円〜（10名程度から） | ★代行ではなく、クラウドの使い方を伴走する形。代行と直接は比べられない |\n| 取り扱わない | — | スポット業務に特化した事務所には、給与計算を受けない方針のところもある |\n\n3行目は注意が必要です。「給与計算 月6,980円〜」と見えても、それが**代行なのか、自社でやるのを手伝う形なのか**で、必要な手間がまったく違います。比較するときは、まずここを揃えてください。\n\n## なぜ「基本料金」があるのか？\n\n給与計算は、人数に比例する作業と、人数に関係なく毎月かかる作業に分かれます。\n\n**人数に比例する作業**\n\n- 勤怠の確認と反映\n- 支給・控除の計算\n- 給与明細の作成\n\n**人数に関係なく毎月かかる作業**\n\n- 締日ごとのデータ受け渡しと突合\n- 保険料率・税額表の改定への対応\n- 振込データの作成\n- 金額が合わないときの原因追及\n\n後者があるため、多くの事務所が基本料金を置きます。従業員1人の会社でも、月末月初の作業そのものは発生するからです。\n\n## 四葉はどうしているのか？\n\n| | |\n|---|---|\n| 料金 | 従業員1人あたり **月1,100円（税込）** |\n| 基本料金 | **なし** |\n| 前提 | ★**顧問契約とセット**。給与計算だけのご依頼は承っていません |\n\n1人あたり1,100円は、市場の上限（税込550円程度）の2倍にあたります。そのかわり基本料金を置いていません。従業員20名を境に、市場でよくある「基本料金11,000円＋1人550円」と金額が一致します。20名より少なければ四葉のほうが安く、多ければ高くなります。\n\n**基本料金を置かずに済んでいるのは、給与計算を単独で受けないからです。** 顧問契約が前提なので、「従業員1人の会社を月1,100円で引き受ける」という状況が起きません。最小の構成は、顧問料22,000円に給与計算1,100円を足した月23,100円（税込）になります。\n\nつまり、基本料金の役割を**受任方針が代わりに果たしている**わけです。\n\n## 比べるときに揃えるべき4点\n\n料金表の数字だけを並べても比較になりません。次の4つを揃えてから比べてください。\n\n1. **代行か、伴走か**——自社で入力するのかどうか\n2. **税込か税別か**——1人500円と550円は同じ額のことがある\n3. **賞与の扱い**——月次と別に費用がかかるか\n4. **年末調整の扱い**——年末調整は税理士の業務です。給与計算の料金に含まれていることはありません\n\n4つめは見落とされがちです。四葉でも年末調整は取り扱っておらず、税理士におつなぎしています。\n\n給与計算を含む料金の全体は[報酬額表](/labor/ryokin)に、顧問料の考え方は[社会保険労務士の顧問料は、何の対価なのか](/labor/column/sharoushi-komonryo-nan-no-taika)に書いています。\n\n## よくある質問\n\n**Q. 給与計算だけをお願いすることはできますか？**\nA. 四葉では承っておりません。給与計算は顧問契約とセットでお受けします。ご相談を伴わずに計算だけをお受けすると、実情を把握しないまま誤った前提で処理してしまうおそれがあるためです。事務所によって方針は異なりますので、単独で受ける事務所をお探しになるのも一つの選択です。\n\n**Q. 給与計算は社会保険労務士でないとできない業務ですか？**\nA. いいえ。給与計算そのものは社会保険労務士の独占業務ではありません。ただし、給与計算に伴って発生する社会保険の資格取得・喪失、算定基礎届、月額変更届といった手続は、報酬を得て行うには社会保険労務士の登録が必要です（社会保険労務士法第27条）。\n\n**Q. 賞与のときも別に費用がかかりますか？**\nA. 四葉では賞与の計算そのものは給与計算に含めています。ただし賞与支払届の提出は労働社会保険の手続にあたるため、報酬額表の料金を別途申し受けます。他の事務所では扱いが異なることがあるので、契約前にご確認ください。\n\n**Q. 従業員が自分で入力する前提ですか？**\nA. クラウドの人事労務システムをお使いの場合、入社時の情報やマイナンバーは従業員ご本人に入力していただく形が基本になります。紙で受け取って当方で代行入力する場合は、作業量が変わるため個別にご相談ください。\n\n## この記事の根拠\n\n- 社会保険労務士法（昭和43年法律第89号）第2条第1項第1号、第27条\n- 市場の料金は、2026年8月時点で公開されている複数の社会保険労務士事務所・サービスの料金表および解説記事から整理したものです。事務所ごとに条件が異なるため、目安としてご覧ください。\n- 「1人あたり月200〜500円」は税別と読める記述が多く、税込に換算すると220〜550円相当になります。原典の表記が税別か税込か明示されていない場合があるため、**この換算は当方の解釈**です。\n\n本記事は一般的な情報提供です。個別のご事情に応じた判断は、面談のうえ資格者が行います。執筆は[浦松丈二](/about/uramatsu)（社会保険労務士・行政書士・宅地建物取引士）です。",
    "status": "published",
    "author": {
      "name": "浦松 丈二",
      "title": "社会保険労務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
    },
    "keywords": [
      "給与計算 社労士 相場",
      "給与計算 代行 費用",
      "給与計算 アウトソーシング 料金",
      "給与計算 基本料金 人数",
      "給与計算 社労士 独占業務",
      "給与計算 年末調整 税理士"
    ],
    "tags": [
      "給与計算",
      "料金",
      "相場",
      "アウトソーシング",
      "社会保険労務士"
    ],
    "locales": [],
    "faq": [
      {
        "question": "給与計算だけをお願いすることはできますか？",
        "answer": "四葉では承っておりません。給与計算は顧問契約とセットでお受けします。ご相談を伴わずに計算だけをお受けすると、実情を把握しないまま誤った前提で処理してしまうおそれがあるためです。事務所によって方針は異なりますので、単独で受ける事務所をお探しになるのも一つの選択です。"
      },
      {
        "question": "給与計算は社会保険労務士でないとできない業務ですか？",
        "answer": "いいえ。給与計算そのものは社会保険労務士の独占業務ではありません。ただし、給与計算に伴って発生する社会保険の資格取得・喪失、算定基礎届、月額変更届といった手続は、報酬を得て行うには社会保険労務士の登録が必要です（社会保険労務士法第27条）。"
      },
      {
        "question": "賞与のときも別に費用がかかりますか？",
        "answer": "四葉では賞与の計算そのものは給与計算に含めています。ただし賞与支払届の提出は労働社会保険の手続にあたるため、報酬額表の料金を別途申し受けます。他の事務所では扱いが異なることがあるので、契約前にご確認ください。"
      },
      {
        "question": "従業員が自分で入力する前提ですか？",
        "answer": "クラウドの人事労務システムをお使いの場合、入社時の情報やマイナンバーは従業員ご本人に入力していただく形が基本になります。紙で受け取って当方で代行入力する場合は、作業量が変わるため個別にご相談ください。"
      }
    ],
    "translations": {
      "en": {
        "title": "What does it cost to have a shakai hoken roumushi run your payroll?",
        "excerpt": "Outsourced payroll is usually priced as a base fee plus an amount per employee, and the per-employee figure is most often quoted at 200-500 yen a month before tax. We set out why there is a base fee, how to tell full outsourcing from support for running payroll yourself, and the four things to line up before you compare. At Yotsuba there is no base fee: 1,100 yen per employee, tax included.",
        "content": "**In short:** Outsourced payroll is generally priced as **\"a base fee plus so much per employee.\"** The per-employee figure is most often described as 200-500 yen a month (before tax), which comes to roughly 220-550 yen including tax. The base fee sits on top of that. It is a structure in which **the fewer people you have, the heavier the cost per person becomes**.\n\nWhen people set out to have payroll handled elsewhere and start reading fee schedules, we often hear that the amounts are put together so differently from office to office that they cannot be compared. Look into it and you find that the differences lie less in the prices themselves than in **how the fee is assembled**.\n\n## How is payroll priced in the market?\n\n| Shape | Example pricing | Character |\n|---|---|---|\n| Base fee + per head | Base fee + 200-500 yen per person per month (before tax) | The most common shape. With few employees the base fee weighs heavily |\n| Included in the retainer | Payroll is included within the retainer fee | The breakdown is hard to see. What happens when headcount grows is settled by the contract |\n| Support for doing it in-house | From 6,980 yen a month (from around 10 people) | ★Not outsourcing, but support that walks you through using a cloud service. Not directly comparable with outsourcing |\n| Not offered | — | Some offices that specialize in one-off work have a policy of not taking payroll at all |\n\nThe third row calls for care. Even where you see \"payroll from 6,980 yen a month,\" whether that is **outsourcing or help with doing it yourself** changes the work required entirely. When you compare, line that up first.\n\n## Why is there a \"base fee\"?\n\nPayroll divides into work that scales with headcount and work that arises every month regardless of headcount.\n\n**Work that scales with headcount**\n\n- Checking attendance records and reflecting them\n- Calculating payments and deductions\n- Producing pay statements\n\n**Work that arises every month regardless of headcount**\n\n- Handing over and reconciling data at each cut-off date\n- Keeping up with revisions to premium rates and withholding tax tables\n- Producing the transfer data\n- Tracking down the cause when the amounts do not agree\n\nBecause of the latter, most offices set a base fee. Even at a company with one employee, the work at the end and start of each month still happens.\n\n## What does Yotsuba do?\n\n| | |\n|---|---|\n| Fee | **1,100 yen per employee per month (tax incl.)** |\n| Base fee | **None** |\n| Condition | ★**Bundled with a retainer agreement.** We do not accept payroll on its own |\n\n1,100 yen per person is twice the top of the market (around 550 yen including tax). In exchange, there is no base fee. At 20 employees the amount comes out the same as the common market shape of \"an 11,000 yen base fee + 550 yen per person.\" Below 20 people Yotsuba is cheaper; above that, more expensive.\n\n**We can do without a base fee because we do not take payroll on its own.** A retainer agreement is a precondition, so the situation of \"taking on a company with one employee for 1,100 yen a month\" does not arise. The smallest configuration is a 22,000 yen retainer plus 1,100 yen for payroll: 23,100 yen a month (tax incl.).\n\nIn other words, **the engagement policy plays the part that the base fee would otherwise play**.\n\n## Four things to line up when you compare\n\nSetting the figures from fee schedules side by side is not yet a comparison. Line up these four first.\n\n1. **Outsourcing, or support alongside you** — whether your own staff do the data entry\n2. **Tax included or tax excluded** — 500 yen and 550 yen per person can be the same amount\n3. **How bonuses are treated** — whether a charge arises separately from the monthly fee\n4. **How the year-end tax adjustment is treated** — the year-end tax adjustment is the work of a tax accountant. It is never included in a payroll fee\n\nThe fourth is easily missed. We do not handle the year-end tax adjustment either; we refer you to a tax accountant.\n\nThe fees as a whole, payroll included, are on [the fee schedule](/en/labor/ryokin), and how we think about the retainer is set out in [What is a shakai hoken roumushi's retainer actually paying for?](/en/labor/column/sharoushi-komonryo-nan-no-taika).\n\n## Frequently asked questions\n\n**Q. Can we ask you for payroll alone?**\nA. We do not accept that. Payroll is taken on together with a retainer agreement. If we handled the calculations without also handling the consultations, we would risk processing the work on mistaken assumptions without knowing the actual situation. Policies differ between offices, so looking for an office that takes payroll on its own is one reasonable option.\n\n**Q. Is payroll work that only a shakai hoken roumushi may do?**\nA. No. Payroll itself is not exclusive to shakai hoken roumushi. However, the procedures that arise alongside payroll — acquiring and losing social insurance coverage, the standard remuneration base notification, notifications of monthly remuneration changes — require registration as a shakai hoken roumushi if they are carried out for a fee (Article 27 of 社会保険労務士法).\n\n**Q. Is there a separate charge when bonuses are paid?**\nA. At Yotsuba the calculation of the bonus itself is included in payroll. Filing the bonus payment notification, however, is a labor and social insurance procedure, so the fee in the fee schedule is charged separately. Other offices treat this differently, so please check before you sign.\n\n**Q. Does this assume employees enter their own data?**\nA. If you use a cloud HR and labor management system, the basic arrangement is for employees themselves to enter their details and My Number when they join. Where you receive the information on paper and we enter it on your behalf, the volume of work changes, so please raise it with us individually.\n\n## Sources for this article\n\n- 社会保険労務士法 (Act No. 89 of 1968), Article 2, paragraph 1, item 1; Article 27\n- The market figures are drawn together from the fee schedules and explanatory articles published by several social insurance and labor consultant offices and services as of August 2026. Conditions differ from office to office, so please treat them as a guide.\n- \"200-500 yen per person per month\" is written in most sources in a way that reads as excluding consumption tax; converted to tax-included figures it corresponds to 220-550 yen. Because the original sources do not always state whether the figure excludes or includes tax, **this conversion is our own reading**.\n\nThis article is general information. A judgment on your individual circumstances is made by a qualified professional after a consultation. Written by [Joji Uramatsu](/en/about/uramatsu) (Shakai Hoken Roumushi, Gyoseishoshi, Registered Real Estate Transaction Specialist).",
        "category": "How fees work",
        "keywords": [
          "payroll shakai hoken roumushi market rate",
          "payroll outsourcing cost japan",
          "payroll service fee per employee",
          "payroll base fee headcount",
          "is payroll exclusive to social insurance labor consultant",
          "year-end tax adjustment tax accountant payroll"
        ],
        "tags": [
          "Payroll",
          "Fees",
          "Market rates",
          "Outsourcing",
          "Shakai Hoken Roumushi"
        ],
        "author": {
          "name": "Joji Uramatsu",
          "title": "Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist — 四葉社会保険労務士事務所／四葉行政書士事務所"
        },
        "faq": [
          {
            "question": "Can we ask you for payroll alone?",
            "answer": "We do not accept that. Payroll is taken on together with a retainer agreement. If we handled the calculations without also handling the consultations, we would risk processing the work on mistaken assumptions without knowing the actual situation. Policies differ between offices, so looking for an office that takes payroll on its own is one reasonable option."
          },
          {
            "question": "Is payroll work that only a shakai hoken roumushi may do?",
            "answer": "No. Payroll itself is not exclusive to shakai hoken roumushi. However, the procedures that arise alongside payroll — acquiring and losing social insurance coverage, the standard remuneration base notification, notifications of monthly remuneration changes — require registration as a shakai hoken roumushi if they are carried out for a fee (Article 27 of 社会保険労務士法)."
          },
          {
            "question": "Is there a separate charge when bonuses are paid?",
            "answer": "At Yotsuba the calculation of the bonus itself is included in payroll. Filing the bonus payment notification, however, is a labor and social insurance procedure, so the fee in the fee schedule is charged separately. Other offices treat this differently, so please check before you sign."
          },
          {
            "question": "Does this assume employees enter their own data?",
            "answer": "If you use a cloud HR and labor management system, the basic arrangement is for employees themselves to enter their details and My Number when they join. Where you receive the information on paper and we enter it on your behalf, the volume of work changes, so please raise it with us individually."
          }
        ]
      },
      "zh-tw": {
        "title": "把薪資計算委託社會保險勞務士，要花多少錢？",
        "excerpt": "薪資計算的代辦，一般採「基本費用＋每位員工多少錢」的形式，每人多為每月200〜500日圓（未含稅）。本文整理為什麼會有基本費用、如何分辨代辦與陪同協助、以及比較時應先對齊的4點。四葉不收基本費用，每人1,100日圓（含稅）。",
        "content": "**結論（先講重點）**：薪資計算的代辦，一般採**「基本費用＋每位員工多少錢」**的形式。每人的單價多被說明為每月200〜500日圓（未含稅），換算含稅約為220〜550日圓。基本費用再加在其上。這是**人數越少，每人負擔越重**的結構。\n\n想把薪資計算委託外部而查看費用表時，常聽到「各事務所的金額算法不一，難以比較」的聲音。實際調查後會發現，差異與其說在價格本身，不如說在**費用的組成方式**。\n\n## 市場上如何訂價？\n\n| 形式 | 費用範例 | 特徵 |\n|---|---|---|\n| 基本費用＋依人數計價 | 基本費用 ＋ 每人每月200〜500日圓（未含稅） | 最常見的形式。人數少時基本費用的比重大 |\n| 含在顧問費中 | 顧問費之中包含薪資計算 | 明細不易看清。人數增加時的處理方式由契約決定 |\n| 協助自行處理 | 每月6,980日圓起（約10名以上） | ★並非代辦，而是陪同協助使用雲端系統的形式。無法與代辦直接比較 |\n| 不承接 | — | 專精單次業務的事務所中，也有不承接薪資計算的方針 |\n\n第三列需要注意。即使看到「薪資計算 每月6,980日圓起」，那究竟是**代辦，還是協助自行處理**，所需的工夫完全不同。比較時，請先把這一點對齊。\n\n## 為什麼會有「基本費用」？\n\n薪資計算可分為與人數成比例的作業，以及與人數無關、每月都會發生的作業。\n\n**與人數成比例的作業**\n\n- 出勤紀錄的確認與反映\n- 給付・扣除的計算\n- 薪資明細的製作\n\n**與人數無關、每月都會發生的作業**\n\n- 各結算日的資料交付與核對\n- 因應保險費率・稅額表的修訂\n- 匯款資料的製作\n- 金額不符時的原因追查\n\n正因為有後者，多數事務所會設定基本費用。即使是只有1名員工的公司，月底月初的作業本身仍然會發生。\n\n## 四葉如何處理？\n\n| | |\n|---|---|\n| 費用 | 每位員工 **每月1,100日圓（含稅）** |\n| 基本費用 | **無** |\n| 前提 | ★**與顧問契約成套**。不承接僅有薪資計算的委託 |\n\n每人1,100日圓，相當於市場上限（含稅約550日圓）的2倍。相對地，本所不設基本費用。以員工20名為界，與市場上常見的「基本費用11,000日圓＋每人550日圓」金額一致。少於20名時四葉較便宜，多於20名則較貴。\n\n**之所以能夠不設基本費用，是因為本所不單獨承接薪資計算。** 由於以顧問契約為前提，不會發生「以每月1,100日圓承接1名員工的公司」這種情況。最小的組合，是顧問費22,000日圓加上薪資計算1,100日圓，每月23,100日圓（含稅）。\n\n也就是說，基本費用的角色，**由受任方針代為承擔**。\n\n## 比較時應先對齊的4點\n\n僅把費用表上的數字並排，並不構成比較。請先對齊以下4點再比較。\n\n1. **是代辦，還是陪同協助**——由誰輸入資料\n2. **含稅還是未含稅**——每人500日圓與550日圓，有時是相同的金額\n3. **獎金的處理**——是否在月度費用之外另行收費\n4. **年末調整的處理**——年末調整（年度所得稅的結算）是稅理士的業務。不會包含在薪資計算的費用之中\n\n第4點最容易被忽略。四葉同樣不承辦年末調整，會為您轉介稅理士。\n\n包含薪資計算在內的費用全貌刊載於[報酬額表](/zh-tw/labor/ryokin)，顧問費的思考方式則寫於[社會保險勞務士的顧問費，究竟是什麼的對價](/zh-tw/labor/column/sharoushi-komonryo-nan-no-taika)。\n\n## 常見問題\n\n**Q. 可以只委託薪資計算嗎？**\nA. 四葉不承接。薪資計算是與顧問契約成套承接的。若在沒有諮詢的情況下僅承接計算，恐怕會在未掌握實際情況下，以錯誤的前提進行處理。各事務所的方針不同，尋找單獨承接的事務所也是一種選擇。\n\n**Q. 薪資計算是非社會保險勞務士不可的業務嗎？**\nA. 並非如此。薪資計算本身並不是社會保險勞務士的獨占業務。但伴隨薪資計算而發生的社會保險資格取得・喪失、算定基礎申報、月額變更申報等手續，若要收取報酬辦理，則需要社會保險勞務士的登錄（社會保險勞務士法第27條）。\n\n**Q. 發放獎金時，是否另外收費？**\nA. 四葉將獎金的計算本身包含在薪資計算之內。但獎金支付申報的提出屬勞動社會保險的手續，將另行收取報酬額表所載的費用。其他事務所的處理方式可能不同，請於簽約前確認。\n\n**Q. 是以員工自行輸入為前提嗎？**\nA. 若您使用雲端的人事勞務系統，入職時的資料與個人編號（My Number），基本上由員工本人輸入。若以紙本交付、由本所代為輸入，作業量會有所不同，請個別與我們洽談。\n\n## 本文的依據\n\n- 社會保險勞務士法（昭和43年法律第89號）第2條第1項第1號、第27條\n- 市場費用係依2026年8月時點公開的多家社會保險勞務士事務所・服務的費用表及解說文章整理而成。各事務所的條件不同，僅供參考。\n- 「每人每月200〜500日圓」在多數記述中可讀為未含稅，換算含稅相當於220〜550日圓。由於原始資料未必明示為未含稅或含稅，**此一換算為本所的解讀**。\n\n本文為一般性的資訊提供。因應個別情況的判斷，將由有資格者於面談後作成。本文執筆：[浦松丈二](/zh-tw/about/uramatsu)（社會保險勞務士・行政書士・宅地建物取引士）。",
        "category": "費用的思考方式",
        "keywords": [
          "薪資計算 社會保險勞務士 行情",
          "薪資計算 代辦 費用",
          "薪資計算 委外 價格",
          "薪資計算 基本費用 人數",
          "薪資計算 社會保險勞務士 獨占業務",
          "薪資計算 年末調整 稅理士"
        ],
        "tags": [
          "薪資計算",
          "費用",
          "行情",
          "委外",
          "社會保險勞務士"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社會保險勞務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "可以只委託薪資計算嗎？",
            "answer": "四葉不承接。薪資計算是與顧問契約成套承接的。若在沒有諮詢的情況下僅承接計算，恐怕會在未掌握實際情況下，以錯誤的前提進行處理。各事務所的方針不同，尋找單獨承接的事務所也是一種選擇。"
          },
          {
            "question": "薪資計算是非社會保險勞務士不可的業務嗎？",
            "answer": "並非如此。薪資計算本身並不是社會保險勞務士的獨占業務。但伴隨薪資計算而發生的社會保險資格取得・喪失、算定基礎申報、月額變更申報等手續，若要收取報酬辦理，則需要社會保險勞務士的登錄（社會保險勞務士法第27條）。"
          },
          {
            "question": "發放獎金時，是否另外收費？",
            "answer": "四葉將獎金的計算本身包含在薪資計算之內。但獎金支付申報的提出屬勞動社會保險的手續，將另行收取報酬額表所載的費用。其他事務所的處理方式可能不同，請於簽約前確認。"
          },
          {
            "question": "是以員工自行輸入為前提嗎？",
            "answer": "若您使用雲端的人事勞務系統，入職時的資料與個人編號（My Number），基本上由員工本人輸入。若以紙本交付、由本所代為輸入，作業量會有所不同，請個別與我們洽談。"
          }
        ]
      },
      "zh": {
        "title": "把工资计算委托社会保险劳务士，要花多少钱？",
        "excerpt": "工资计算的代办，一般采用「基本费用＋每位员工多少钱」的形式，每人多为每月200〜500日元（未含税）。本文梳理为什么会有基本费用、如何分辨代办与陪同协助、以及比较时应先对齐的4点。四葉不收基本费用，每人1,100日元（含税）。",
        "content": "**结论（先讲重点）**：工资计算的代办，一般采用**「基本费用＋每位员工多少钱」**的形式。每人的单价多被说明为每月200〜500日元（未含税），换算含税约为220〜550日元。基本费用再加在其上。这是**人数越少，每人负担越重**的结构。\n\n想把工资计算委托外部而查看费用表时，常听到「各事务所的金额算法不一，难以比较」的声音。实际调查后会发现，差异与其说在价格本身，不如说在**费用的组成方式**。\n\n## 市场上如何定价？\n\n| 形式 | 费用范例 | 特征 |\n|---|---|---|\n| 基本费用＋按人数计价 | 基本费用 ＋ 每人每月200〜500日元（未含税） | 最常见的形式。人数少时基本费用的比重大 |\n| 含在顾问费中 | 顾问费之中包含工资计算 | 明细不易看清。人数增加时的处理方式由合同决定 |\n| 协助自行处理 | 每月6,980日元起（约10名以上） | ★并非代办，而是陪同协助使用云端系统的形式。无法与代办直接比较 |\n| 不承接 | — | 专精单次业务的事务所中，也有不承接工资计算的方针 |\n\n第三行需要注意。即使看到「工资计算 每月6,980日元起」，那究竟是**代办，还是协助自行处理**，所需的工夫完全不同。比较时，请先把这一点对齐。\n\n## 为什么会有「基本费用」？\n\n工资计算可分为与人数成比例的作业，以及与人数无关、每月都会发生的作业。\n\n**与人数成比例的作业**\n\n- 考勤记录的确认与反映\n- 支付・扣除的计算\n- 工资明细的制作\n\n**与人数无关、每月都会发生的作业**\n\n- 各结算日的资料交付与核对\n- 应对保险费率・税额表的修订\n- 汇款数据的制作\n- 金额不符时的原因追查\n\n正因为有后者，多数事务所会设定基本费用。即使是只有1名员工的公司，月底月初的作业本身仍然会发生。\n\n## 四葉如何处理？\n\n| | |\n|---|---|\n| 费用 | 每位员工 **每月1,100日元（含税）** |\n| 基本费用 | **无** |\n| 前提 | ★**与顾问合同成套**。不承接仅有工资计算的委托 |\n\n每人1,100日元，相当于市场上限（含税约550日元）的2倍。相对地，本所不设基本费用。以员工20名为界，与市场上常见的「基本费用11,000日元＋每人550日元」金额一致。少于20名时四葉较便宜，多于20名则较贵。\n\n**之所以能够不设基本费用，是因为本所不单独承接工资计算。** 由于以顾问合同为前提，不会发生「以每月1,100日元承接1名员工的公司」这种情况。最小的组合，是顾问费22,000日元加上工资计算1,100日元，每月23,100日元（含税）。\n\n也就是说，基本费用的角色，**由受任方针代为承担**。\n\n## 比较时应先对齐的4点\n\n仅把费用表上的数字并排，并不构成比较。请先对齐以下4点再比较。\n\n1. **是代办，还是陪同协助**——由谁输入数据\n2. **含税还是未含税**——每人500日元与550日元，有时是相同的金额\n3. **奖金的处理**——是否在月度费用之外另行收费\n4. **年末调整的处理**——年末调整（年度所得税的结算）是税理士的业务。不会包含在工资计算的费用之中\n\n第4点最容易被忽略。四葉同样不承办年末调整，会为您介绍税理士。\n\n包含工资计算在内的费用全貌刊载于[报酬额表](/zh/labor/ryokin)，顾问费的思考方式则写于[社会保险劳务士的顾问费，究竟是什么的对价](/zh/labor/column/sharoushi-komonryo-nan-no-taika)。\n\n## 常见问题\n\n**Q. 可以只委托工资计算吗？**\nA. 四葉不承接。工资计算是与顾问合同成套承接的。若在没有咨询的情况下仅承接计算，恐怕会在未掌握实际情况下，以错误的前提进行处理。各事务所的方针不同，寻找单独承接的事务所也是一种选择。\n\n**Q. 工资计算是非社会保险劳务士不可的业务吗？**\nA. 并非如此。工资计算本身并不是社会保险劳务士的独占业务。但伴随工资计算而发生的社会保险资格取得・丧失、算定基础申报、月额变更申报等手续，若要收取报酬办理，则需要社会保险劳务士的登录（社会保险劳务士法第27条）。\n\n**Q. 发放奖金时，是否另外收费？**\nA. 四葉将奖金的计算本身包含在工资计算之内。但奖金支付申报的提交属劳动社会保险的手续，将另行收取报酬额表所载的费用。其他事务所的处理方式可能不同，请于签约前确认。\n\n**Q. 是以员工自行输入为前提吗？**\nA. 若您使用云端的人事劳务系统，入职时的资料与个人编号（My Number），基本上由员工本人输入。若以纸质交付、由本所代为输入，作业量会有所不同，请个别与我们洽谈。\n\n## 本文的依据\n\n- 社会保险劳务士法（昭和43年法律第89号）第2条第1项第1号、第27条\n- 市场费用系依2026年8月时点公开的多家社会保险劳务士事务所・服务的费用表及解说文章整理而成。各事务所的条件不同，仅供参考。\n- 「每人每月200〜500日元」在多数记述中可读为未含税，换算含税相当于220〜550日元。由于原始资料未必明示为未含税或含税，**此一换算为本所的解读**。\n\n本文为一般性的信息提供。针对个别情况的判断，将由有资格者于面谈后作出。本文执笔：[浦松丈二](/zh/about/uramatsu)（社会保险劳务士・行政书士・宅地建物取引士）。",
        "category": "费用的思考方式",
        "keywords": [
          "工资计算 社会保险劳务士 行情",
          "工资计算 代办 费用",
          "工资计算 外包 价格",
          "工资计算 基本费用 人数",
          "工资计算 社会保险劳务士 独占业务",
          "工资计算 年末调整 税理士"
        ],
        "tags": [
          "工资计算",
          "费用",
          "行情",
          "外包",
          "社会保险劳务士"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社会保险劳务士・行政书士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "可以只委托工资计算吗？",
            "answer": "四葉不承接。工资计算是与顾问合同成套承接的。若在没有咨询的情况下仅承接计算，恐怕会在未掌握实际情况下，以错误的前提进行处理。各事务所的方针不同，寻找单独承接的事务所也是一种选择。"
          },
          {
            "question": "工资计算是非社会保险劳务士不可的业务吗？",
            "answer": "并非如此。工资计算本身并不是社会保险劳务士的独占业务。但伴随工资计算而发生的社会保险资格取得・丧失、算定基础申报、月额变更申报等手续，若要收取报酬办理，则需要社会保险劳务士的登录（社会保险劳务士法第27条）。"
          },
          {
            "question": "发放奖金时，是否另外收费？",
            "answer": "四葉将奖金的计算本身包含在工资计算之内。但奖金支付申报的提交属劳动社会保险的手续，将另行收取报酬额表所载的费用。其他事务所的处理方式可能不同，请于签约前确认。"
          },
          {
            "question": "是以员工自行输入为前提吗？",
            "answer": "若您使用云端的人事劳务系统，入职时的资料与个人编号（My Number），基本上由员工本人输入。若以纸质交付、由本所代为输入，作业量会有所不同，请个别与我们洽谈。"
          }
        ]
      }
    }
  },
  {
    "business": "labor",
    "slug": "sharoushi-komonryo-nan-no-taika",
    "title": "社会保険労務士の顧問料は、何の対価なのか",
    "date": "2026-09-01",
    "category": "料金の考え方",
    "excerpt": "顧問料は事務所によって中身が違います。多くは「相談＋基本的な手続」を含む包括料金ですが、四葉は相談だけの対価にし、手続は顧問先でも都度いただく形をとりました。なぜその設計にしたのか、包括型と比べて何が変わるのかを、隠さずに書きます。",
    "content": "**結論（先に要点）**：社会保険労務士の顧問料は、事務所によって**中身が違います**。多くは「相談＋基本的な手続」を含む包括料金ですが、四葉は**相談だけの対価**にしています。手続は顧問先でも都度いただきます。同じ月額33,000円でも、含まれるものが違うということです。\n\n社会保険労務士の顧問料を比べようとすると、金額はどこも似たような幅に収まっているのに、実際に払う総額が事務所によって変わります。理由は単純で、**顧問料に何が入っているかが揃っていない**からです。\n\n## 顧問料には、ふつう何が入っているのか？\n\n多くの事務所では、顧問料は次のようなものを包括しています。\n\n- 労務に関する相談\n- 法改正の案内\n- **入退社などの基本的な手続**\n- 算定基礎届・年度更新といった年次の手続\n\n3つめと4つめが入っているのが一般的です。だから「顧問料を払っていれば、入社1名の手続は追加費用なし」という事務所が多いわけです。\n\nこれには合理性があります。事業者から見れば、毎月いくらと決まっていて、その中で手続もしてもらえるほうが分かりやすい。事務所から見ても、都度の請求事務が減ります。\n\n## なぜ四葉は、その形をとらなかったのか？\n\n四葉社会保険労務士事務所の顧問料は、**労務のご相談に対する対価だけ**です。労働社会保険の手続は、顧問先の方にも[報酬額表](/labor/ryokin)の料金を都度申し受けます。\n\nそうした理由は3つあります。\n\n**ひとつめ。相談が「おまけ」になるのを避けたかった。** 手続込みの顧問料では、手続が発生しない月は「何もしていないのに払っている」という感覚になりがちです。相談が主で手続が従、という関係をはっきりさせたいと考えました。\n\n**ふたつめ。手続の量で不公平が出るのを避けたかった。** 入退社の多い事業所と少ない事業所が同じ顧問料では、どちらかが損をします。人の出入りが激しい業種ほど、包括料金の恩恵を受けます。それは裏返せば、出入りの少ない事業所が負担しているということです。\n\n給与計算の値付けについては[給与計算を社会保険労務士に頼むと、いくらかかるのか](/labor/column/kyuyo-keisan-soba-sharoushi)に書いています。\n\n**みっつめ。相談に制限をかけたくなかった。** 手続を含めない代わりに、**ご相談は回数・時間の制限なく承ります**。「何回まで」「何時間まで」を決めていません。\n\n## 同じ月額でも、総額はどう変わるのか？\n\nここははっきり書いておきます。**手続を別にしている以上、手続が多い年は、包括料金の事務所より総額が高くなります。**\n\n| | 一般的な包括型 | 四葉 |\n|---|---|---|\n| 顧問料 | 相談＋基本的な手続 | **相談のみ** |\n| 入退社の手続 | 顧問料に含むことが多い | 都度申し受けます |\n| 算定基礎届・年度更新 | 顧問料に含むことが多い | 都度申し受けます |\n| 相談の回数・時間 | 制限を置く事務所もある | **制限なし** |\n| 給与計算 | 別料金が多い | 別料金（顧問契約とセット） |\n\n料金表の月額だけを並べて比べると、四葉は安く見えます。**それは正しくありません。** 手続の分が乗るためです。ご検討の際は、年間でどれだけ手続が発生しそうかを見積もって、総額で比べてください。\n\n## 手続だけを頼むことはできるのか？\n\n四葉では承っていません。**手続だけのご依頼をお受けしないのは、実情を把握しないまま誤った前提で処理してしまうおそれがあるためです。**\n\nたとえば「資格取得届を出してほしい」という依頼を受けたとします。書式を埋めるだけなら簡単ですが、その方が週何時間働くのか、雇用契約はどうなっているのか、他の従業員との均衡は取れているのか——こうしたことを知らないまま処理すると、加入すべき人を漏らしたり、逆に対象外の人を入れたりします。あとから遡って直すほうが、はるかに手間もお金もかかります。\n\n法人・個人事業主のお客さまは顧問契約を前提としてお受けします。ただし**障害年金のご相談（個人のお客さま）は顧問契約を前提としません**。こちらはご本人・ご家族から直接お受けします。\n\n## 規程の法改正対応には、そのつど費用がかかるのか？\n\nかかりません。**当事務所が作成した規程については、法改正に伴う該当条文の改定と届出を顧問料に含めて承ります。回数の制限はありません。**\n\n労働関係法令は毎年のように改正があります。そのたびに就業規則の直しに費用がかかるのでは、規程を作ったこと自体が負債になってしまいます。会社の都合による改定は「就業規則 変更」の料金を申し受けますが、法改正への追随は顧問料の中で行います。\n\n## よくある質問\n\n**Q. 相談は月に何回までですか？**\nA. 回数・時間の制限は設けていません。顧問料は相談の対価なので、制限を置くと趣旨と合わなくなります。\n\n**Q. 初めての相談から費用がかかりますか？**\nA. 初めてのご相談は60分まで無料です。顧問契約に至らなかった場合の2回目以降のご相談は、1時間11,000円（税込）を申し受けます。顧問契約後のご相談は顧問料に含まれます。\n\n**Q. 顧問料は従業員数で決まるのですか？**\nA. 対象人数の帯で決まります。〜4人の月22,000円（税込）から、25〜29人の77,000円（税込）まで、5人ごとの階段です。30人以上は個別にお見積りします。対象人数は、役員と従業員の合計です（アルバイト・パートの方を含みます。社会保険の被保険者数ではありません）。ただし人数帯は目安で、顧問料はご相談の対価のため、ご相談の内容と量に応じた帯でお見積りします。\n\n**Q. 顧問先だと手続が割引になりますか？**\nA. なりません。手続は顧問先だけにお受けするものなので、比べる相手がいないためです。顧問契約を結んでいない方から手続だけをお受けすることがないので、「顧問先価格」という考え方をとっていません。\n\n## この記事の根拠\n\n- 社会保険労務士法（昭和43年法律第89号）第2条第1項第1号・第2号・第3号、第27条\n- 四葉社会保険労務士事務所の料金は[報酬額表](/labor/ryokin)に掲載しています。金額はすべて税込です。\n- 他の事務所の料金体系についての記述は、2026年8月時点で公開されている複数の社会保険労務士事務所の料金表から整理した一般的な傾向です。個々の事務所の契約内容を示すものではありません。\n\n本記事は一般的な情報提供です。個別のご事情に応じた判断は、面談のうえ資格者が行います。執筆は[浦松丈二](/about/uramatsu)（社会保険労務士・行政書士・宅地建物取引士）です。",
    "status": "published",
    "author": {
      "name": "浦松 丈二",
      "title": "社会保険労務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
    },
    "keywords": [
      "社労士 顧問料 相場",
      "社労士 顧問料 何が含まれる",
      "社労士 顧問契約 内容",
      "社労士 手続だけ 依頼",
      "社労士 顧問料 従業員数",
      "社労士 相談 回数制限"
    ],
    "tags": [
      "顧問料",
      "料金",
      "受任方針",
      "就業規則",
      "社会保険労務士"
    ],
    "locales": [],
    "faq": [
      {
        "question": "相談は月に何回までですか？",
        "answer": "回数・時間の制限は設けていません。顧問料は相談の対価なので、制限を置くと趣旨と合わなくなります。"
      },
      {
        "question": "初めての相談から費用がかかりますか？",
        "answer": "初めてのご相談は60分まで無料です。顧問契約に至らなかった場合の2回目以降のご相談は、1時間11,000円（税込）を申し受けます。顧問契約後のご相談は顧問料に含まれます。"
      },
      {
        "question": "顧問料は従業員数で決まるのですか？",
        "answer": "対象人数の帯で決まります。〜4人の月22,000円（税込）から、25〜29人の77,000円（税込）まで、5人ごとの階段です。30人以上は個別にお見積りします。対象人数は、役員と従業員の合計です（アルバイト・パートの方を含みます。社会保険の被保険者数ではありません）。ただし人数帯は目安で、顧問料はご相談の対価のため、ご相談の内容と量に応じた帯でお見積りします。"
      },
      {
        "question": "顧問先だと手続が割引になりますか？",
        "answer": "なりません。手続は顧問先だけにお受けするものなので、比べる相手がいないためです。顧問契約を結んでいない方から手続だけをお受けすることがないので、「顧問先価格」という考え方をとっていません。"
      }
    ],
    "translations": {
      "en": {
        "title": "What does a Shakai Hoken Roumushi retainer fee actually pay for?",
        "excerpt": "What a retainer fee covers differs from office to office. Most offices charge an inclusive fee bundling consultation plus basic procedural filings, but 四葉 made the retainer the price of consultation alone and bills filings each time, even for retainer clients. Here is why we designed it that way, and what changes compared with the inclusive model, set out plainly.",
        "content": "**In short:** The retainer fee charged by a Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant) **covers different things at different offices**. Most offices charge an inclusive fee bundling \"consultation plus basic procedural filings,\" but at 四葉 the retainer is **the price of consultation only**. Filings are billed each time they arise, even for retainer clients. Two offices can both charge 33,000 yen a month and include entirely different things.\n\nWhen you set out to compare retainer fees, the headline amounts all sit within a similar range, yet the total you actually pay differs from office to office. The reason is simple: **there is no common standard for what the retainer fee includes**.\n\n## What is normally included in a retainer fee?\n\nAt most offices, the retainer fee bundles the following.\n\n- consultation on labor and employment matters\n- notice of amendments to the law\n- **basic filings such as those on hiring and departure**\n- annual filings such as the 算定基礎届 (standard monthly remuneration calculation report) and the 年度更新 (annual labor insurance premium declaration)\n\nThe third and fourth items are commonly included. That is why so many offices can say, \"if you are paying the retainer, the filing for one new hire costs nothing extra.\"\n\nThere is sense in this. From the employer's side, a fixed monthly amount that also covers filings is easier to grasp. From the office's side, it reduces the administrative work of billing item by item.\n\n## Why did 四葉 not take that form?\n\nThe retainer fee of 四葉社会保険労務士事務所 is **the price of labor and employment consultation, and only that**. For labor and social insurance filings, we charge retainer clients the rates in the [fee schedule](/en/labor/ryokin) each time they arise.\n\nThere were three reasons.\n\n**First, we wanted to avoid consultation becoming an afterthought.** With a retainer that includes filings, a month in which no filing arises tends to feel like \"paying for nothing.\" We wanted to make it clear that consultation is the main thing and filings are secondary.\n\n**Second, we wanted to avoid unfairness arising from the volume of filings.** If a workplace with many arrivals and departures and one with few pay the same retainer, one of them loses out. The more turnover an industry has, the more it benefits from an inclusive fee. Turned around, that means the workplaces with little turnover are carrying it.\n\nOn how we price payroll calculation, see [What does it cost to have a Shakai Hoken Roumushi do your payroll calculation?](/en/labor/column/kyuyo-keisan-soba-sharoushi).\n\n**Third, we did not want to place limits on consultation.** In return for not including filings, **we accept consultation with no limit on the number of times or the length of time**. We have not set any \"up to so many times\" or \"up to so many hours.\"\n\n## Does the total change even when the monthly amount is the same?\n\nWe will state this plainly. **Because filings are billed separately, in a year with many filings the total will come out higher than at an office with an inclusive fee.**\n\n| | Typical inclusive model | 四葉 |\n|---|---|---|\n| Retainer fee | Consultation + basic filings | **Consultation only** |\n| Filings on hiring and departure | Usually included in the retainer | Billed each time |\n| 算定基礎届 and 年度更新 | Usually included in the retainer | Billed each time |\n| Number and length of consultations | Some offices set limits | **No limit** |\n| Payroll calculation | Usually charged separately | Charged separately (paired with a retainer agreement) |\n\nIf you line up only the monthly figures on the fee schedules, 四葉 looks inexpensive. **That reading is not correct.** The filings are added on top. When you are weighing this up, estimate how many filings are likely to arise over a year and compare the totals.\n\n## Can you ask us to handle filings only?\n\nWe do not accept that. **The reason we do not take filing-only work is the risk of processing a matter on mistaken assumptions without knowing the actual situation.**\n\nSuppose we receive a request to \"submit the 資格取得届 (notification of acquisition of insured status).\" Filling in the form is simple enough, but how many hours a week does this person work? What does the employment contract say? Is the treatment balanced against that of the other employees? Processing the filing without knowing these things can mean leaving out someone who should be enrolled, or enrolling someone who is outside the scope. Going back and correcting it afterwards takes far more time and money.\n\nFor corporate clients and sole proprietors, we accept work on the premise of a retainer agreement. However, **consultation on disability pensions (individual clients) is not premised on a retainer agreement**. We accept those directly from the person concerned or their family.\n\n## Is there a charge each time regulations have to be updated for an amendment to the law?\n\nThere is not. **For regulations that we drafted ourselves, we revise the affected provisions and make the required filings in response to amendments to the law within the retainer fee. There is no limit on the number of times.**\n\nLabor-related legislation is amended almost every year. If each round of corrections to the work rules cost money, having had the rules drawn up would itself become a liability. Revisions made for the company's own reasons are charged at the \"work rules — amendment\" rate, but keeping up with amendments to the law is done within the retainer fee.\n\n## Frequently asked questions\n\n**Q. How many consultations can I have in a month?**\nA. We set no limit on the number of times or the length of time. The retainer fee is the price of consultation, so placing a limit would be inconsistent with what it is for.\n\n**Q. Is there a charge from the very first consultation?**\nA. The first consultation is free for up to 60 minutes. If it does not lead to a retainer agreement, the second and subsequent consultations are charged at 11,000 yen per hour (tax included). Consultations after a retainer agreement is in place are covered by the retainer fee.\n\n**Q. Is the retainer fee decided by the number of employees?**\nA. It is decided by bands. It starts at 22,000 yen a month (tax included) for up to 4 people and runs to 77,000 yen a month (tax included) for 25 to 29 people, in steps of 5 people. For 30 or more, we quote individually. The number counted is officers plus employees, including part-timers and casual staff — not the number of people enrolled in social insurance. The bands are a guide: because the retainer is payment for consultation, we quote the band that matches the content and volume of your consultations.\n\n**Q. Do retainer clients get a discount on filings?**\nA. No. Filings are accepted only from retainer clients, so there is nothing to compare them against. Because we never take filing-only work from anyone without a retainer agreement, we do not use the notion of a \"retainer client price.\"\n\n## Sources for this article\n\n- the Certified Social Insurance and Labor Consultant Act (社会保険労務士法, Act No. 89 of 1968), Article 2, paragraph 1, items 1, 2 and 3; Article 27\n- The fees of 四葉社会保険労務士事務所 are published in the [fee schedule](/en/labor/ryokin). All amounts include tax.\n- The description of other offices' fee structures sets out general tendencies compiled from the fee schedules of several Shakai Hoken Roumushi offices published as of August 2026. It does not represent the terms of any individual office's agreement.\n\nThis article is general information. Judgments that depend on your particular circumstances are made by a qualified professional after a meeting. Written by [Joji Uramatsu](/en/about/uramatsu) (Shakai Hoken Roumushi, Gyoseishoshi, Registered Real Estate Transaction Specialist).",
        "category": "How fees work",
        "keywords": [
          "Shakai Hoken Roumushi retainer fee",
          "what a retainer fee includes",
          "scope of a labor consultant retainer agreement",
          "requesting filings only",
          "retainer fee and number of employees",
          "limit on the number of consultations"
        ],
        "tags": [
          "retainer fee",
          "fees",
          "engagement policy",
          "work rules",
          "Shakai Hoken Roumushi"
        ],
        "author": {
          "name": "Joji Uramatsu",
          "title": "Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist — 四葉社会保険労務士事務所／四葉行政書士事務所"
        },
        "faq": [
          {
            "question": "How many consultations can I have in a month?",
            "answer": "We set no limit on the number of times or the length of time. The retainer fee is the price of consultation, so placing a limit would be inconsistent with what it is for."
          },
          {
            "question": "Is there a charge from the very first consultation?",
            "answer": "The first consultation is free for up to 60 minutes. If it does not lead to a retainer agreement, the second and subsequent consultations are charged at 11,000 yen per hour (tax included). Consultations after a retainer agreement is in place are covered by the retainer fee."
          },
          {
            "question": "Is the retainer fee decided by the number of employees?",
            "answer": "It is decided by bands. It starts at 22,000 yen a month (tax included) for up to 4 people and runs to 77,000 yen a month (tax included) for 25 to 29 people, in steps of 5 people. For 30 or more, we quote individually. The number counted is officers plus employees, including part-timers and casual staff — not the number of people enrolled in social insurance. The bands are a guide: because the retainer is payment for consultation, we quote the band that matches the content and volume of your consultations."
          },
          {
            "question": "Do retainer clients get a discount on filings?",
            "answer": "No. Filings are accepted only from retainer clients, so there is nothing to compare them against. Because we never take filing-only work from anyone without a retainer agreement, we do not use the notion of a \"retainer client price.\""
          }
        ]
      },
      "zh-tw": {
        "title": "社會保險勞務士的顧問費，究竟是什麼的對價",
        "excerpt": "顧問費的內容因事務所而異。多數事務所是包含「諮詢＋基本手續」的包套費用，四葉則把顧問費定位為只對諮詢收費，手續即使是顧問客戶也逐件申領。為什麼這樣設計、與包套型相比會有什麼不同，我們毫不隱瞞地寫下來。",
        "content": "**結論（先講重點）**：社會保險勞務士的顧問費，**內容因事務所而不同**。多數是包含「諮詢＋基本手續」的包套費用，四葉則設定為**只對諮詢收費**。手續即使是顧問客戶，也逐件申領費用。同樣是每月33,000日圓，包含的東西並不一樣。\n\n想比較社會保險勞務士的顧問費時，會發現金額大多落在相近的區間，實際支付的總額卻因事務所而不同。理由很單純，因為**顧問費裡包含什麼並沒有統一**。\n\n## 顧問費裡通常包含什麼？\n\n多數事務所的顧問費包含以下項目。\n\n- 勞務相關的諮詢\n- 法令修正的通知\n- **入職、離職等基本手續**\n- 算定基礎届（標準報酬月額的年度計算申報）、年度更新（勞動保險費的年度申報）等年度手續\n\n第三項與第四項通常也包含在內。因此，很多事務所才能說「只要付了顧問費，1名員工的入職手續不另外收費」。\n\n這樣做有其合理性。從事業主來看，每月金額固定，而且手續也一併處理，比較容易理解。從事務所來看，逐件請款的事務也會減少。\n\n## 四葉為什麼沒有採用這種形式？\n\n四葉社会保険労務士事務所的顧問費，**只是勞務諮詢的對價**。勞動社會保險的手續，即使是顧問客戶，也依[報酬額表](/zh-tw/labor/ryokin)所載金額逐件申領。\n\n理由有三個。\n\n**第一，不希望諮詢變成「附贈品」。** 在含手續的顧問費之下，沒有發生手續的月份，容易讓人覺得「什麼都沒做卻要付錢」。我們希望明確地把諮詢放在主位、手續放在從位。\n\n**第二，不希望因手續數量而產生不公平。** 如果人員進出多的事業所與少的事業所付同樣的顧問費，總有一方吃虧。人員流動越激烈的行業，越能從包套費用中受益。反過來說，就是人員進出少的事業所在承擔這部分。\n\n關於薪資核算的定價，我們寫在[委託社會保險勞務士處理薪資核算，要花多少錢](/zh-tw/labor/column/kyuyo-keisan-soba-sharoushi)。\n\n**第三，不希望對諮詢設限。** 作為不含手續的交換，**諮詢不設次數與時間的限制**。我們沒有規定「幾次為限」「幾小時為限」。\n\n## 同樣的月費，總額會有什麼不同？\n\n這一點我們明白寫出來。**既然手續另計，手續多的年度，總額就會比包套型的事務所高。**\n\n| | 一般的包套型 | 四葉 |\n|---|---|---|\n| 顧問費 | 諮詢＋基本手續 | **僅諮詢** |\n| 入職、離職的手續 | 多半包含在顧問費內 | 逐件申領 |\n| 算定基礎届、年度更新 | 多半包含在顧問費內 | 逐件申領 |\n| 諮詢的次數與時間 | 也有事務所設限 | **不設限** |\n| 薪資核算 | 多為另外收費 | 另外收費（與顧問契約成套） |\n\n若只把收費表上的月費並列比較，四葉看起來比較便宜。**這並不正確。** 因為還要加上手續的部分。評估時，請先估算一年大約會發生多少手續，用總額來比較。\n\n## 可以只委託手續嗎？\n\n四葉不承接。**我們不接受只委託手續的原因是，在未掌握實際情況的狀態下，有可能依錯誤的前提處理。**\n\n例如，假設收到「請提出資格取得届（取得被保險人資格的申報）」的委託。只是填表的話很簡單，但這位員工一週工作幾小時、僱用契約是怎麼訂的、與其他員工之間是否取得均衡——在不了解這些的情況下處理，可能會漏掉應該加保的人，或反過來把不屬於對象的人加進去。事後回溯更正，要花上多得多的時間與金錢。\n\n法人與個人事業主的客戶，我們以簽訂顧問契約為前提承接。不過，**障害年金（身心障礙年金）的諮詢（個人客戶）不以顧問契約為前提**。這部分我們直接受理本人或家屬的委託。\n\n## 規程因應法令修正，每次都要收費嗎？\n\n不收費。**本事務所製作的規程，因法令修正而需要修改相關條文與辦理申報時，包含在顧問費內承接。次數不設限制。**\n\n勞動相關法令幾乎每年都有修正。如果每次修改就業規則都要收費，那麼當初製作規程這件事本身就變成了負債。因公司自身需求而修改時，我們會申領「就業規則 變更」的費用；但因應法令修正的追隨，在顧問費之內進行。\n\n## 常見問題\n\n**Q. 諮詢一個月最多幾次？**\nA. 我們不設次數與時間的限制。顧問費是諮詢的對價，設限會與其宗旨不符。\n\n**Q. 第一次諮詢就要收費嗎？**\nA. 第一次諮詢60分鐘以內免費。未進入顧問契約時，第二次以後的諮詢，每小時申領11,000日圓（含稅）。簽訂顧問契約後的諮詢包含在顧問費內。\n\n**Q. 顧問費是依員工人數決定的嗎？**\nA. 依對象人數的級距決定。從4人以下每月22,000日圓（含稅）起，到25至29人的77,000日圓（含稅）為止，以5人為一階。30人以上另行估價。對象人數為董監事與員工的合計（包含工讀生與兼職人員），並非社會保險的被保險人數。惟級距僅為參考，顧問費為諮詢的對價，本事務所將依諮詢的內容與數量估價。\n\n**Q. 顧問客戶的手續會有折扣嗎？**\nA. 不會。手續只承接顧問客戶的委託，因此沒有可以比較的對象。由於我們不會只承接未簽顧問契約者的手續，所以沒有「顧問客戶價」這種概念。\n\n## 本文的依據\n\n- 社會保險勞務士法（昭和43年法律第89號）第2條第1項第1號・第2號・第3號、第27條\n- 四葉社会保険労務士事務所的收費刊載於[報酬額表](/zh-tw/labor/ryokin)。金額均為含稅。\n- 關於其他事務所收費體系的敘述，是根據2026年8月時點公開的多家社會保險勞務士事務所收費表整理出的一般傾向。並非表示個別事務所的契約內容。\n\n本文為一般性的資訊提供。針對個別情況的判斷，由具備資格者於面談後進行。撰文者為[浦松丈二](/zh-tw/about/uramatsu)（社會保險勞務士・行政書士・宅地建物取引士）。",
        "category": "費用的思考方式",
        "keywords": [
          "社會保險勞務士 顧問費 行情",
          "社會保險勞務士 顧問費 包含什麼",
          "社會保險勞務士 顧問契約 內容",
          "只委託手續 社會保險勞務士",
          "顧問費 員工人數",
          "諮詢 次數限制"
        ],
        "tags": [
          "顧問費",
          "收費",
          "承接方針",
          "就業規則",
          "社會保險勞務士"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社會保險勞務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "諮詢一個月最多幾次？",
            "answer": "我們不設次數與時間的限制。顧問費是諮詢的對價，設限會與其宗旨不符。"
          },
          {
            "question": "第一次諮詢就要收費嗎？",
            "answer": "第一次諮詢60分鐘以內免費。未進入顧問契約時，第二次以後的諮詢，每小時申領11,000日圓（含稅）。簽訂顧問契約後的諮詢包含在顧問費內。"
          },
          {
            "question": "顧問費是依員工人數決定的嗎？",
            "answer": "依對象人數的級距決定。從4人以下每月22,000日圓（含稅）起，到25至29人的77,000日圓（含稅）為止，以5人為一階。30人以上另行估價。對象人數為董監事與員工的合計（包含工讀生與兼職人員），並非社會保險的被保險人數。惟級距僅為參考，顧問費為諮詢的對價，本事務所將依諮詢的內容與數量估價。"
          },
          {
            "question": "顧問客戶的手續會有折扣嗎？",
            "answer": "不會。手續只承接顧問客戶的委託，因此沒有可以比較的對象。由於我們不會只承接未簽顧問契約者的手續，所以沒有「顧問客戶價」這種概念。"
          }
        ]
      },
      "zh": {
        "title": "社会保险劳务士的顾问费，究竟是什么的对价",
        "excerpt": "顾问费的内容因事务所而异。多数事务所是包含\"咨询＋基本手续\"的包套费用，四葉则把顾问费定位为只对咨询收费，手续即使是顾问客户也逐件收取。为什么这样设计、与包套型相比会有什么不同，我们毫不隐瞒地写下来。",
        "content": "**结论（先讲重点）**：社会保险劳务士的顾问费，**内容因事务所而不同**。多数是包含\"咨询＋基本手续\"的包套费用，四葉则设定为**只对咨询收费**。手续即使是顾问客户，也逐件收取费用。同样是每月33,000日元，包含的东西并不一样。\n\n想比较社会保险劳务士的顾问费时，会发现金额大多落在相近的区间，实际支付的总额却因事务所而不同。理由很单纯，因为**顾问费里包含什么并没有统一**。\n\n## 顾问费里通常包含什么？\n\n多数事务所的顾问费包含以下项目。\n\n- 劳务相关的咨询\n- 法令修正的通知\n- **入职、离职等基本手续**\n- 算定基礎届（标准报酬月额的年度计算申报）、年度更新（劳动保险费的年度申报）等年度手续\n\n第三项与第四项通常也包含在内。因此，很多事务所才能说\"只要付了顾问费，1名员工的入职手续不另外收费\"。\n\n这样做有其合理性。从事业主来看，每月金额固定，而且手续也一并处理，比较容易理解。从事务所来看，逐件请款的事务也会减少。\n\n## 四葉为什么没有采用这种形式？\n\n四葉社会保険労務士事務所的顾问费，**只是劳务咨询的对价**。劳动社会保险的手续，即使是顾问客户，也依[报酬额表](/zh/labor/ryokin)所载金额逐件收取。\n\n理由有三个。\n\n**第一，不希望咨询变成\"附赠品\"。** 在含手续的顾问费之下，没有发生手续的月份，容易让人觉得\"什么都没做却要付钱\"。我们希望明确地把咨询放在主位、手续放在从位。\n\n**第二，不希望因手续数量而产生不公平。** 如果人员进出多的事业所与少的事业所付同样的顾问费，总有一方吃亏。人员流动越激烈的行业，越能从包套费用中受益。反过来说，就是人员进出少的事业所在承担这部分。\n\n关于薪资核算的定价，我们写在[委托社会保险劳务士处理薪资核算，要花多少钱](/zh/labor/column/kyuyo-keisan-soba-sharoushi)。\n\n**第三，不希望对咨询设限。** 作为不含手续的交换，**咨询不设次数与时间的限制**。我们没有规定\"几次为限\"\"几小时为限\"。\n\n## 同样的月费，总额会有什么不同？\n\n这一点我们明白写出来。**既然手续另计，手续多的年度，总额就会比包套型的事务所高。**\n\n| | 一般的包套型 | 四葉 |\n|---|---|---|\n| 顾问费 | 咨询＋基本手续 | **仅咨询** |\n| 入职、离职的手续 | 多半包含在顾问费内 | 逐件收取 |\n| 算定基礎届、年度更新 | 多半包含在顾问费内 | 逐件收取 |\n| 咨询的次数与时间 | 也有事务所设限 | **不设限** |\n| 薪资核算 | 多为另外收费 | 另外收费（与顾问契约成套） |\n\n若只把收费表上的月费并列比较，四葉看起来比较便宜。**这并不正确。** 因为还要加上手续的部分。评估时，请先估算一年大约会发生多少手续，用总额来比较。\n\n## 可以只委托手续吗？\n\n四葉不承接。**我们不接受只委托手续的原因是，在未掌握实际情况的状态下，有可能依错误的前提处理。**\n\n例如，假设收到\"请提出資格取得届（取得被保险人资格的申报）\"的委托。只是填表的话很简单，但这位员工一周工作几小时、雇用契约是怎么订的、与其他员工之间是否取得均衡——在不了解这些的情况下处理，可能会漏掉应该加保的人，或反过来把不属于对象的人加进去。事后回溯更正，要花上多得多的时间与金钱。\n\n法人与个人事业主的客户，我们以签订顾问契约为前提承接。不过，**障害年金（残障年金）的咨询（个人客户）不以顾问契约为前提**。这部分我们直接受理本人或家属的委托。\n\n## 规程因应法令修正，每次都要收费吗？\n\n不收费。**本事务所制作的规程，因法令修正而需要修改相关条文与办理申报时，包含在顾问费内承接。次数不设限制。**\n\n劳动相关法令几乎每年都有修正。如果每次修改就业规则都要收费，那么当初制作规程这件事本身就变成了负债。因公司自身需求而修改时，我们会收取\"就业规则 变更\"的费用；但因应法令修正的追随，在顾问费之内进行。\n\n## 常见问题\n\n**Q. 咨询一个月最多几次？**\nA. 我们不设次数与时间的限制。顾问费是咨询的对价，设限会与其宗旨不符。\n\n**Q. 第一次咨询就要收费吗？**\nA. 第一次咨询60分钟以内免费。未进入顾问契约时，第二次以后的咨询，每小时收取11,000日元（含税）。签订顾问契约后的咨询包含在顾问费内。\n\n**Q. 顾问费是依员工人数决定的吗？**\nA. 依对象人数的级距决定。从4人以下每月22,000日元（含税）起，到25至29人的77,000日元（含税）为止，以5人为一阶。30人以上另行报价。对象人数为董事与员工的合计（包含小时工与兼职人员），并非社会保险的被保险人数。但级距仅供参考，顾问费为咨询的对价，本事务所将依咨询的内容与数量报价。\n\n**Q. 顾问客户的手续会有折扣吗？**\nA. 不会。手续只承接顾问客户的委托，因此没有可以比较的对象。由于我们不会只承接未签顾问契约者的手续，所以没有\"顾问客户价\"这种概念。\n\n## 本文的依据\n\n- 社会保险劳务士法（昭和43年法律第89号）第2条第1项第1号・第2号・第3号、第27条\n- 四葉社会保険労務士事務所的收费刊载于[报酬额表](/zh/labor/ryokin)。金额均为含税。\n- 关于其他事务所收费体系的叙述，是根据2026年8月时点公开的多家社会保险劳务士事务所收费表整理出的一般倾向。并非表示个别事务所的契约内容。\n\n本文为一般性的资讯提供。针对个别情况的判断，由具备资格者于面谈后进行。撰稿人为[浦松丈二](/zh/about/uramatsu)（社会保险劳务士・行政书士・宅地建物取引士）。",
        "category": "费用的思考方式",
        "keywords": [
          "社会保险劳务士 顾问费 行情",
          "社会保险劳务士 顾问费 包含什么",
          "社会保险劳务士 顾问契约 内容",
          "只委托手续 社会保险劳务士",
          "顾问费 员工人数",
          "咨询 次数限制"
        ],
        "tags": [
          "顾问费",
          "收费",
          "承接方针",
          "就业规则",
          "社会保险劳务士"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社会保险劳务士・行政书士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "咨询一个月最多几次？",
            "answer": "我们不设次数与时间的限制。顾问费是咨询的对价，设限会与其宗旨不符。"
          },
          {
            "question": "第一次咨询就要收费吗？",
            "answer": "第一次咨询60分钟以内免费。未进入顾问契约时，第二次以后的咨询，每小时收取11,000日元（含税）。签订顾问契约后的咨询包含在顾问费内。"
          },
          {
            "question": "顾问费是依员工人数决定的吗？",
            "answer": "依对象人数的级距决定。从4人以下每月22,000日元（含税）起，到25至29人的77,000日元（含税）为止，以5人为一阶。30人以上另行报价。对象人数为董事与员工的合计（包含小时工与兼职人员），并非社会保险的被保险人数。但级距仅供参考，顾问费为咨询的对价，本事务所将依咨询的内容与数量报价。"
          },
          {
            "question": "顾问客户的手续会有折扣吗？",
            "answer": "不会。手续只承接顾问客户的委托，因此没有可以比较的对象。由于我们不会只承接未签顾问契约者的手续，所以没有\"顾问客户价\"这种概念。"
          }
        ]
      }
    }
  },
  {
    "business": "labor",
    "slug": "gaichu-koyo-sakaime-roudoushasei",
    "title": "外注と雇用の境目は、契約書では決まらない",
    "date": "2026-09-01",
    "category": "労働法の基本",
    "excerpt": "業務委託契約書があっても、実態が雇用なら雇用として扱われます。判断は契約書の題名ではなく、仕事の依頼を断れるか、指揮監督を受けているか、時間や場所の拘束があるか——という実態で行われます。労働基準法研究会報告（昭和60年12月19日）の判断項目と、遡って求められる範囲・時効を表で整理しました。",
    "content": "**結論（先に要点）**：業務委託契約書があっても、実態が雇用なら雇用として扱われます。判断は契約書の題名ではなく、仕事の依頼を断れるか、指揮監督を受けているか、時間や場所の拘束があるか——という実態で行われます。\n\n「うちは業務委託でお願いしているので」という説明を、よくうかがいます。契約書もあり、請求書も毎月もらっている。それでも、あとから「実態は雇用だった」と扱われることがあります。契約の形と実態がずれていると、ずれているほうではなく**実態のほうが正**とされるからです。\n\n## 「業務委託」と書いてあれば、業務委託になるのか？\n\nなりません。労働基準法は「労働者」を、**事業に使用される者で、賃金を支払われる者**と定めています（労働基準法第9条）。ここには契約の名称が出てきません。委任か請負か雇用かではなく、**使用されているかどうか**で決まる建て付けです。\n\nこの考え方を具体化したものが、**労働基準法研究会報告「労働基準法の『労働者』の判断基準について」（昭和60年12月19日）**です。40年前の報告ですが、現在も厚生労働省が判断基準の資料として掲げています。報告は、「使用される」＝指揮監督下の労働、という労務提供の形態と、「賃金を支払われる」＝報酬の労務対償性、この2つを合わせて**「使用従属性」**と呼び、これを軸に総合判断するとしています。\n\n## 実態は、どこを見て判断されるのか？\n\n報告が挙げる項目は次のとおりです。上の4つが判断の中心、下の3つが補強要素という構造になっています。\n\n| | 見られるところ | 位置づけ |\n|---|---|---|\n| ① | 仕事の依頼、業務従事の指示等に対する**諾否の自由**の有無 | 指揮監督下の労働か |\n| ② | 業務遂行上の**指揮監督**の有無 | 同上 |\n| ③ | **拘束性**の有無（時間・場所） | 同上 |\n| ④ | **代替性**の有無 | 指揮監督関係の判断を**補強** |\n| ⑤ | **報酬の労務対償性** | 使用従属性のもう一方の柱 |\n| ⑥ | **事業者性**の有無（機械・器具の負担、報酬の額 ほか） | 労働者性の判断を**補強** |\n| ⑦ | **専属性**の程度 | 同上 |\n\n実務でつまずきやすいのは①と③です。「その日は都合が悪いので」と断れるか。始業と終業の時刻が決まっていて、事実上その時間そこにいることが求められていないか。ここが埋まっていると、契約書に何と書いてあっても苦しくなります。\n\nなお⑥の「機械、器具の負担関係」は、道具を会社が用意しているかどうかを見る項目です。パソコンも作業着も会社が貸与し、材料費も会社持ち、という状態は、事業者性を弱める方向に働きます。\n\n**この7項目は、どれか1つで決まるものではありません。** 報告自身が「総合判断」と書いており、個別の事案がどちらに振れるかは、事実関係を全部並べてみないと分かりません。\n\n## 実態が雇用だったとき、何を求められるのか？\n\nさかのぼって請求が来ます。範囲は制度ごとに違い、時効の年数も揃っていません。\n\n| 何を | 時効 | 根拠 |\n|---|---|---|\n| 労働保険料（労災保険・雇用保険） | **2年** | 労働保険の保険料の徴収等に関する法律第41条 |\n| 健康保険料 | **2年** | 健康保険法第193条 |\n| 厚生年金保険料 | **2年** | 厚生年金保険法第92条第1項 |\n| 賃金（残業代など。退職手当を除く） | **当分の間3年** | 労働基準法第115条・附則第143条第3項 |\n| 退職手当 | **5年** | 同上 |\n\n**「賃金の時効は一律3年」ではありません。** 労働基準法第115条の本則は既に5年で、附則第143条第3項が「当分の間」3年に読み替えているという構造です。読み替えの対象から退職手当が外されているため、退職手当だけは最初から5年です。\n\n**そして「当分の間」がいつ終わるかは、法律に書かれていません。** 令和2年法律第13号の附則に検討条項があるだけで、自動的に5年になる期日は定められていません。「いずれ5年になる」という説明を見かけたら、時期が決まっていないことも合わせて確認してください。\n\n保険料は労使折半のはずですが、遡って請求されるとき、本人分をあとから本人に求めるのは実際には難しくなります。金額の見込みを立てるときは、**会社負担分だけでなく全額**を見ておくほうが安全です。\n\n税務でも同じ論点になります。業務委託として支払っていたものが給与と扱われれば、消費税や源泉徴収の取り扱いが変わります。**ただし税務の判断は税理士の業務です。** 当事務所では扱っておりませんので、税理士に直接ご依頼いただく形をご案内しています。当事務所は紹介料を受け取りません。\n\n## 気づいたら、まず何をすればいいのか？\n\n契約書を書き直すことから始めないでください。書面だけ整えても実態が変わらなければ、判断は変わりません。\n\n順番としては、**①いまの実態を書き出す → ②実態をどちらに寄せるかを決める → ③決めたほうに契約と運用の両方を合わせる**、になります。②が本体です。指揮監督をやめて本当の外注にするのか、雇用として整えるのか。どちらを選ぶかで、そのあとに必要な手続がまるごと変わります。\n\n雇用として整えると決めた場合は、社会保険と労働保険の加入、労働条件の明示、そして人数によっては就業規則が必要になります。何人から何が義務になるかは[就業規則は何人から義務か。義務でないものは何か](/labor/column/shugyokisoku-10nin-gimu-nani-ga-hitsuyo)に、短い時間で雇う場合の保険の入り方は[短い時間で雇うと、社会保険はどうなるか](/labor/column/tanjikan-koyo-shakaihoken-4bunno3)にまとめています。\n\n## よくある質問\n\n**Q. 本人が「雇用ではなく業務委託がいい」と言っている場合はどうなりますか？**\nA. 本人の希望は、判断の要素の一つにはなりますが、それだけで決まるものではありません。労働基準法第9条の「労働者」に当たるかどうかは実態で判断されるため、双方が合意していても実態が雇用であれば雇用として扱われます。合意書を交わしても、この判断を変える効力はありません。\n\n**Q. 週1日だけ来てもらっている人も対象になりますか？**\nA. 日数の多い少ないで決まるものではありません。昭和60年の報告が挙げる判断項目に日数は入っていません。週1日でも、その日の仕事を断れず、指示を受けて、時間を拘束されているのであれば、労働者性は認められる方向に傾きます。逆に週5日でも、専門的な裁量で動いていて諾否の自由があるなら、外注として整理できる場合があります。\n\n**Q. 遡って請求されるのは、必ず時効いっぱいの年数になりますか？**\nA. いいえ。時効は「これ以上はさかのぼれない」という上限で、実際にどこまで遡るかは事案によります。ただし上限を前提に見込みを立てておくほうが、資金の手当てとしては安全です。個別の見込みは、契約の開始時期や支払の記録を確認したうえでのご相談になります。\n\n**Q. いま契約している人が10人います。全員を見直す必要がありますか？**\nA. まず、同じ条件で契約している方をグループに分けて、グループごとに実態を確認する形をおすすめしています。契約書の書式が同じでも、実際の働き方が人によって違うことは珍しくありません。1人ずつ確認するより早く、抜けも出にくくなります。費用の考え方は[報酬額表](/labor/ryokin)をご覧ください。\n\n## この記事の根拠\n\n- 労働基準法（昭和22年法律第49号）第9条、第115条、附則第143条第3項\n- 労働基準法の一部を改正する法律（令和2年法律第13号）附則第2条第2項・第3条。施行日は令和2年4月1日\n- 労働基準法研究会報告「労働基準法の『労働者』の判断基準について」（昭和60年12月19日）。厚生労働省が公開する原文により確認\n- 労働保険の保険料の徴収等に関する法律（昭和44年法律第84号）第41条\n- 健康保険法（大正11年法律第70号）第193条\n- 厚生年金保険法（昭和29年法律第115号）第92条第1項\n- 条文はいずれも2026年8月13日時点でe-Gov法令検索により確認した現行条文です\n\n**この記事は、誰に相談するかまでは決めていません。** 実態が雇用かどうかの見立てと、遡ってどこまで求められうるかの整理、そして雇用として整える場合の手続は、社会保険労務士の業務です。消費税や源泉徴収の扱いは税理士、契約の解消をめぐって争いになっている場合は弁護士へ、それぞれ直接ご依頼いただく形をご案内します。当事務所は紹介料を受け取りません。四葉社会保険労務士事務所にご相談いただく場合の費用は[報酬額表](/labor/ryokin)に、よくいただくご質問は[よくあるご質問](/labor/faq)にまとめています。\n\n本記事は一般的な情報提供です。個別のご事情に応じた判断は、面談のうえ資格者が行います。執筆は[浦松丈二](/about/uramatsu)（社会保険労務士・行政書士・宅地建物取引士）です。",
    "status": "published",
    "author": {
      "name": "浦松 丈二",
      "title": "社会保険労務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
    },
    "keywords": [
      "業務委託 雇用 違い",
      "労働者性 判断基準",
      "業務委託 実態は雇用",
      "業務委託 社会保険 遡及",
      "労働基準法 第9条 労働者",
      "偽装請負 残業代 遡り"
    ],
    "tags": [
      "労働者性",
      "業務委託",
      "労働基準法",
      "社会保険",
      "時効"
    ],
    "locales": [],
    "faq": [
      {
        "question": "本人が「雇用ではなく業務委託がいい」と言っている場合はどうなりますか？",
        "answer": "本人の希望は、判断の要素の一つにはなりますが、それだけで決まるものではありません。労働基準法第9条の「労働者」に当たるかどうかは実態で判断されるため、双方が合意していても実態が雇用であれば雇用として扱われます。合意書を交わしても、この判断を変える効力はありません。"
      },
      {
        "question": "週1日だけ来てもらっている人も対象になりますか？",
        "answer": "日数の多い少ないで決まるものではありません。昭和60年の報告が挙げる判断項目に日数は入っていません。週1日でも、その日の仕事を断れず、指示を受けて、時間を拘束されているのであれば、労働者性は認められる方向に傾きます。逆に週5日でも、専門的な裁量で動いていて諾否の自由があるなら、外注として整理できる場合があります。"
      },
      {
        "question": "遡って請求されるのは、必ず時効いっぱいの年数になりますか？",
        "answer": "いいえ。時効は「これ以上はさかのぼれない」という上限で、実際にどこまで遡るかは事案によります。ただし上限を前提に見込みを立てておくほうが、資金の手当てとしては安全です。個別の見込みは、契約の開始時期や支払の記録を確認したうえでのご相談になります。"
      },
      {
        "question": "いま契約している人が10人います。全員を見直す必要がありますか？",
        "answer": "まず、同じ条件で契約している方をグループに分けて、グループごとに実態を確認する形をおすすめしています。契約書の書式が同じでも、実際の働き方が人によって違うことは珍しくありません。1人ずつ確認するより早く、抜けも出にくくなります。費用の考え方は報酬額表をご覧ください。"
      }
    ],
    "translations": {
      "en": {
        "title": "The line between outsourcing and employment is not settled by the contract",
        "excerpt": "Even where there is a contract for services, if the reality is employment it is treated as employment. The judgment turns not on the title of the contract but on the facts: whether the person can refuse a request for work, whether they are under direction and supervision, whether they are constrained as to time and place. We set out the criteria from the Labor Standards Act Study Group report of December 19, 1985, and give the scope and limitation periods for retroactive claims in tables.",
        "content": "**In short:** Even where there is a contract for services (業務委託契約書), if the reality is employment it is treated as employment. The judgment is made not on the title of the contract but on the facts — whether the person can refuse a request for work, whether they are under direction and supervision, whether they are constrained as to time and place.\n\n\"We engage them under a contract for services\" is an explanation we hear often. There is a contract, and an invoice arrives every month. Even so, the arrangement can later be treated as \"in reality, employment.\" Where the form of the contract and the reality diverge, it is **the reality that is taken as correct**, not the form.\n\n## If the paper says \"contract for services,\" does that make it one?\n\nIt does not. The Labor Standards Act (労働基準法, Act No. 49 of 1947) defines a \"worker\" as **a person who is used in a business and to whom wages are paid** (Article 9). The name of the contract does not appear there. The structure turns not on whether the arrangement is mandate, contract for work or employment, but on **whether the person is being used**.\n\nWhat gives this idea concrete shape is the **Labor Standards Act Study Group report, \"On the criteria for determining who is a 'worker' under the Labor Standards Act\" (労働基準法研究会報告「労働基準法の『労働者』の判断基準について」, December 19, 1985)**. It is a report from forty years ago, but the Ministry of Health, Labour and Welfare still presents it as the reference material for the criteria. The report takes \"being used,\" meaning the form in which labor is provided as work under direction and supervision, together with \"being paid wages,\" meaning remuneration that is consideration for labor, calls the two together **\"use and subordination\" (使用従属性)**, and judges cases comprehensively on that axis.\n\n## What is looked at in determining the reality?\n\nThe items the report lists are as follows. The top four are the core of the judgment; the bottom three are structured as reinforcing factors.\n\n| | What is looked at | Where it sits |\n|---|---|---|\n| ① | Whether there is **freedom to accept or refuse** requests for work, instructions to perform duties and the like | Is the work under direction and supervision |\n| ② | Whether there is **direction and supervision** in carrying out the work | Same as above |\n| ③ | Whether there is **constraint** (as to time and place) | Same as above |\n| ④ | Whether the work is **substitutable** | **Reinforces** the finding on the direction and supervision relationship |\n| ⑤ | **Whether the remuneration is consideration for labor** | The other pillar of use and subordination |\n| ⑥ | Whether the person has the **character of a business operator** (bearing the cost of machinery and tools, the level of remuneration, and others) | **Reinforces** the finding on worker status |\n| ⑦ | The degree of **exclusivity** | Same as above |\n\nIn practice, ① and ③ are where things come apart. Can the person say \"that day does not work for me\" and decline? Are the start and finish times fixed, so that the person is in effect required to be there during those hours? Where these are filled in, the position becomes difficult whatever the contract says.\n\nItem ⑥, \"the bearing of machinery and tools,\" looks at whether the company supplies the equipment. A situation where the company lends the computer and the work clothes and also pays for materials works in the direction of weakening the character of a business operator.\n\n**These seven items are not decided by any one of them alone.** The report itself says the judgment is comprehensive, and which way an individual case falls cannot be known without laying out all of the facts.\n\n## What is demanded when the reality was employment?\n\nClaims come retroactively. The scope differs by system, and the limitation periods are not aligned either.\n\n| What | Limitation period | Basis |\n|---|---|---|\n| Labor insurance premiums (workers' accident compensation insurance and employment insurance) | **2 years** | Act on Collection of Insurance Premiums of Labor Insurance (労働保険の保険料の徴収等に関する法律), Article 41 |\n| Health insurance premiums | **2 years** | Health Insurance Act (健康保険法), Article 193 |\n| Employees' pension insurance premiums | **2 years** | Employees' Pension Insurance Act (厚生年金保険法), Article 92, paragraph 1 |\n| Wages (overtime pay and the like; excluding retirement allowance) | **3 years for the time being** | Labor Standards Act (労働基準法), Article 115 and Supplementary Provisions, Article 143, paragraph 3 |\n| Retirement allowance | **5 years** | Same as above |\n\n**It is not the case that \"the limitation period for wages is uniformly 3 years.\"** The main text of Article 115 of the Labor Standards Act is already 5 years, and Article 143, paragraph 3 of the Supplementary Provisions reads it as 3 years \"for the time being.\" Because retirement allowance is excluded from the scope of that reading, retirement allowance alone is 5 years from the outset.\n\n**And when \"for the time being\" ends is not written in the statute.** There is only a review provision in the Supplementary Provisions to Act No. 13 of 2020; no date on which it automatically becomes 5 years has been fixed. If you come across an explanation that \"it will become 5 years in due course,\" check as well that the timing has not been decided.\n\nPremiums are supposed to be split equally between employer and employee, but when they are claimed retroactively it is in practice difficult to recover the employee's share from the person afterwards. When you estimate the amounts, it is safer to allow for **the full amount, not only the employer's share**.\n\nThe same issue arises for tax. If payments made as a contract for services are treated as salary, the treatment of consumption tax and withholding at source changes. **Judgments on tax, however, are the work of a tax accountant.** We do not handle them, so we suggest that you engage a tax accountant directly, under a separate contract. We receive no referral fee.\n\n## What should you do first when you notice this?\n\nDo not start by rewriting the contract. If only the paperwork is tidied up and the reality does not change, the judgment does not change.\n\nThe order is **① write out the present reality → ② decide which way to take it → ③ bring both the contract and the day-to-day operation into line with what you decided**. ② is the substance. Do you stop directing and supervising and make it genuine outsourcing, or do you organize it as employment? Which you choose changes the whole set of procedures that follow.\n\nIf you decide to organize it as employment, you will need enrollment in social insurance and labor insurance, written notice of working conditions, and, depending on the number of people, work rules. Which obligations begin at how many people is set out in [From how many people are work rules mandatory, and what is not mandatory](/en/labor/column/shugyokisoku-10nin-gimu-nani-ga-hitsuyo); how insurance works when you hire for short hours is set out in [What happens to social insurance when you hire for short hours](/en/labor/column/tanjikan-koyo-shakaihoken-4bunno3).\n\n## Frequently asked questions\n\n**Q. What if the person themselves says they would rather have a contract for services than employment?**\nA. The person's wishes are one factor in the judgment, but they do not settle it on their own. Whether someone falls within \"worker\" under Article 9 of the Labor Standards Act is judged on the facts, so even where both sides agree, if the reality is employment it is treated as employment. Exchanging a written agreement has no effect that changes this judgment.\n\n**Q. Does someone who comes in only one day a week fall within this?**\nA. It is not decided by how many days. The number of days is not among the criteria listed in the 1985 report. Even at one day a week, if the person cannot refuse that day's work, receives instructions and is constrained as to time, the finding leans toward worker status. Conversely, even at five days a week, if the person works with professional discretion and has freedom to accept or refuse, the arrangement can in some cases be organized as outsourcing.\n\n**Q. When claims are made retroactively, is it always for the full number of years in the limitation period?**\nA. No. The limitation period is a ceiling — \"no further back than this\" — and how far back a claim actually goes depends on the case. Even so, building your estimate on the ceiling is the safer course for arranging funds. An estimate for your own case is a matter for consultation, after checking when the contracts began and the records of payment.\n\n**Q. We currently have ten people on contract. Do we need to review all of them?**\nA. We suggest first dividing those engaged on the same terms into groups and checking the reality group by group. It is not unusual for people to work differently in practice even where the form of the contract is identical. It is quicker than checking one person at a time, and less likely to leave gaps. On how the fees work, please see the [fee schedule](/en/labor/ryokin).\n\n## Sources for this article\n\n- the Labor Standards Act (労働基準法, Act No. 49 of 1947), Article 9, Article 115, and Supplementary Provisions, Article 143, paragraph 3\n- the Act Partially Amending the Labor Standards Act (労働基準法の一部を改正する法律, Act No. 13 of 2020), Supplementary Provisions, Article 2, paragraph 2 and Article 3. Date of entry into force: April 1, 2020\n- Labor Standards Act Study Group report, \"On the criteria for determining who is a 'worker' under the Labor Standards Act\" (労働基準法研究会報告「労働基準法の『労働者』の判断基準について」, December 19, 1985). Confirmed against the original text published by the Ministry of Health, Labour and Welfare\n- the Act on Collection of Insurance Premiums of Labor Insurance (労働保険の保険料の徴収等に関する法律, Act No. 84 of 1969), Article 41\n- the Health Insurance Act (健康保険法, Act No. 70 of 1922), Article 193\n- the Employees' Pension Insurance Act (厚生年金保険法, Act No. 115 of 1954), Article 92, paragraph 1\n- All of the provisions are the versions in force as confirmed on e-Gov法令検索 (e-Gov Law Search) on August 13, 2026\n\n**This article does not go so far as to decide whom you should consult.** Forming a view on whether the reality is employment, organizing how far back claims could reach, and the procedures for setting things up as employment are the work of a Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant). For the treatment of consumption tax and withholding at source, a tax accountant; where the ending of the contract has become a dispute, an attorney — in each case we suggest that you engage them directly, under a separate contract. We receive no referral fee. The fees for consulting 四葉社会保険労務士事務所 are set out in the [fee schedule](/en/labor/ryokin), and the questions we are asked most often in the [frequently asked questions](/en/labor/faq).\n\nThis article is general information. Judgments that depend on your particular circumstances are made by a qualified professional after a meeting. Written by [Joji Uramatsu](/en/about/uramatsu) (Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist).",
        "category": "Labor law basics",
        "keywords": [
          "difference between a contract for services and employment",
          "criteria for worker status",
          "outsourcing that is in reality employment",
          "retroactive social insurance premiums",
          "Labor Standards Act Article 9 worker",
          "disguised subcontracting and back overtime pay"
        ],
        "tags": [
          "worker status",
          "contract for services",
          "Labor Standards Act",
          "social insurance",
          "limitation periods"
        ],
        "author": {
          "name": "Joji Uramatsu",
          "title": "Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist — 四葉社会保険労務士事務所／四葉行政書士事務所"
        },
        "faq": [
          {
            "question": "What if the person themselves says they would rather have a contract for services than employment?",
            "answer": "The person's wishes are one factor in the judgment, but they do not settle it on their own. Whether someone falls within \"worker\" under Article 9 of the Labor Standards Act is judged on the facts, so even where both sides agree, if the reality is employment it is treated as employment. Exchanging a written agreement has no effect that changes this judgment."
          },
          {
            "question": "Does someone who comes in only one day a week fall within this?",
            "answer": "It is not decided by how many days. The number of days is not among the criteria listed in the 1985 report. Even at one day a week, if the person cannot refuse that day's work, receives instructions and is constrained as to time, the finding leans toward worker status. Conversely, even at five days a week, if the person works with professional discretion and has freedom to accept or refuse, the arrangement can in some cases be organized as outsourcing."
          },
          {
            "question": "When claims are made retroactively, is it always for the full number of years in the limitation period?",
            "answer": "No. The limitation period is a ceiling — \"no further back than this\" — and how far back a claim actually goes depends on the case. Even so, building your estimate on the ceiling is the safer course for arranging funds. An estimate for your own case is a matter for consultation, after checking when the contracts began and the records of payment."
          },
          {
            "question": "We currently have ten people on contract. Do we need to review all of them?",
            "answer": "We suggest first dividing those engaged on the same terms into groups and checking the reality group by group. It is not unusual for people to work differently in practice even where the form of the contract is identical. It is quicker than checking one person at a time, and less likely to leave gaps. On how the fees work, please see the fee schedule."
          }
        ]
      },
      "zh-tw": {
        "title": "外包與僱用的界線，不是由契約書決定的",
        "excerpt": "即使有業務委託契約書，只要實際狀態是僱用，就會被當作僱用處理。判斷的依據不是契約書的名稱，而是能否拒絕工作的委託、是否受到指揮監督、時間與地點是否受到拘束——這些實際狀態。我們整理了勞動基準法研究會報告（昭和60年12月19日）的判斷項目，並以表格列出可能被回溯請求的範圍與時效。",
        "content": "**結論（先講重點）**：即使有業務委託契約書，只要實際狀態是僱用，就會被當作僱用處理。判斷的依據不是契約書的名稱，而是能否拒絕工作的委託、是否受到指揮監督、時間與地點是否受到拘束——這些實際狀態。\n\n「我們是用業務委託的方式請他做的」，這樣的說明我們經常聽到。契約書也有，每個月也收到請款單。即使如此，事後仍可能被認定「實際狀態是僱用」。因為當契約的形式與實際狀態不一致時，被視為正確的不是形式，而是**實際狀態**。\n\n## 只要寫著「業務委託」，就是業務委託嗎？\n\n不是。勞動基準法把「勞動者」定義為**受事業使用、並被支付工資的人**（勞動基準法第9條）。這裡並沒有出現契約的名稱。也就是說，決定的不是委任、承攬還是僱用，而是**是否被使用**。\n\n把這個想法具體化的，是**勞動基準法研究會報告〈關於勞動基準法「勞動者」的判斷基準〉（昭和60年12月19日）**。雖然是40年前的報告，但厚生勞動省至今仍將其列為判斷基準的資料。報告把「受使用」＝在指揮監督下勞動這種提供勞務的形態，與「被支付工資」＝報酬的勞務對價性，這兩者合起來稱為**「使用從屬性」**，並以此為軸進行綜合判斷。\n\n## 實際狀態要看哪些地方來判斷？\n\n報告列出的項目如下。上面4項是判斷的核心，下面3項則是補強要素的結構。\n\n| | 觀察的地方 | 定位 |\n|---|---|---|\n| ① | 對於工作的委託、從事業務的指示等，有無**承諾與拒絕的自由** | 是否為指揮監督下的勞動 |\n| ② | 執行業務時有無**指揮監督** | 同上 |\n| ③ | 有無**拘束性**（時間、地點） | 同上 |\n| ④ | 有無**代替性** | **補強**指揮監督關係的判斷 |\n| ⑤ | **報酬的勞務對價性** | 使用從屬性的另一根支柱 |\n| ⑥ | 有無**事業者性**（機械、器具的負擔，報酬的金額等） | **補強**勞動者性的判斷 |\n| ⑦ | **專屬性**的程度 | 同上 |\n\n實務上容易出問題的是①與③。能不能說「那天不方便」而拒絕。上下班的時刻是否已經固定，事實上是否被要求在那段時間待在那裡。這些一旦成立，契約書上不管寫什麼都會很吃力。\n\n另外，⑥的「機械、器具的負擔關係」，是看工具是不是公司準備的項目。電腦與工作服都由公司出借、材料費也由公司負擔，這樣的狀態會朝著削弱事業者性的方向作用。\n\n**這7個項目，不是靠其中任何一項就能決定的。** 報告本身就寫著「綜合判斷」，個別案件會倒向哪一邊，不把所有事實攤開來看是無法判斷的。\n\n## 實際狀態是僱用時，會被要求什麼？\n\n會被回溯請求。範圍因制度而不同，時效的年數也不一致。\n\n| 項目 | 時效 | 依據 |\n|---|---|---|\n| 勞動保險費（勞災保險・僱用保險） | **2年** | 勞動保險保險費徵收等相關法律第41條 |\n| 健康保險費 | **2年** | 健康保險法第193條 |\n| 厚生年金保險費 | **2年** | 厚生年金保險法第92條第1項 |\n| 工資（加班費等。不含退職手當） | **暫時期間為3年** | 勞動基準法第115條・附則第143條第3項 |\n| 退職手當（退職金） | **5年** | 同上 |\n\n**並不是「工資的時效一律為3年」。** 勞動基準法第115條的本文原本就是5年，而附則第143條第3項在「暫時期間」內將其讀作3年，是這樣的結構。由於退職手當被排除在這個讀法的對象之外，所以只有退職手當從一開始就是5年。\n\n**而且「暫時期間」何時結束，法律上並沒有寫。** 令和2年法律第13號的附則中只有檢討規定，並沒有訂出自動變成5年的日期。如果看到「將來會變成5年」的說明，請一併確認時間點並未確定這一點。\n\n保險費原本應由勞資各半負擔，但被回溯請求時，事後要向本人請求其個人負擔的部分，實際上會變得困難。在估算金額時，**不只看公司負擔的部分，而是把全額都算進去**比較安全。\n\n在稅務上也會出現同樣的爭點。原本以業務委託方式支付的報酬若被當作薪資，消費稅與源泉扣繳的處理就會改變。**不過，稅務的判斷是稅理士的業務。** 本事務所並不承辦，因此我們會請您直接向稅理士委託、另行簽約。本事務所不收取介紹費。\n\n## 察覺之後，首先該做什麼？\n\n請不要從改寫契約書開始。只把書面整理好，實際狀態沒有改變的話，判斷也不會改變。\n\n順序是**①寫出現在的實際狀態 → ②決定要把實際狀態往哪一邊靠 → ③讓契約與運作兩方面都配合所決定的方向**。②才是本體。是停止指揮監督、變成真正的外包，還是整頓成僱用。選擇哪一邊，之後所需要的手續會整組改變。\n\n如果決定整頓成僱用，就需要加入社會保險與勞動保險、明示勞動條件，並且依人數不同可能需要就業規則。從幾人開始有哪些義務，整理在[就業規則從幾人開始是義務，哪些不是義務](/zh-tw/labor/column/shugyokisoku-10nin-gimu-nani-ga-hitsuyo)；以短時間僱用時保險要怎麼加入，整理在[以短時間僱用時，社會保險會怎麼樣](/zh-tw/labor/column/tanjikan-koyo-shakaihoken-4bunno3)。\n\n## 常見問題\n\n**Q. 如果本人說「不要僱用，希望用業務委託」，會怎麼樣？**\nA. 本人的意願可以成為判斷的要素之一，但不會僅憑這一點就決定。是否屬於勞動基準法第9條的「勞動者」是依實際狀態判斷的，因此即使雙方同意，只要實際狀態是僱用，就會被當作僱用處理。就算簽了同意書，也沒有改變這項判斷的效力。\n\n**Q. 一週只來1天的人也會是對象嗎？**\nA. 不是以天數多寡決定的。昭和60年的報告所列的判斷項目中並沒有天數。即使一週1天，只要當天的工作無法拒絕、接受指示、時間受到拘束，勞動者性就會朝被認定的方向傾斜。反過來說，即使一週5天，若是依專業裁量行動且有承諾與拒絕的自由，也可能整理成外包。\n\n**Q. 被回溯請求時，一定會是時效上限的年數嗎？**\nA. 不會。時效是「不能再往前回溯」的上限，實際上回溯到哪裡則因案件而異。不過，以上限為前提來估算，在資金準備上比較安全。個別的估算，要在確認契約的開始時期與付款紀錄之後才能討論。\n\n**Q. 目前有10位簽約的人。全部都需要重新檢視嗎？**\nA. 我們建議先把契約條件相同的人分成群組，再逐一群組確認實際狀態。即使契約書的格式相同，實際的工作方式因人而異也並不少見。這比一個一個確認更快，也比較不會有遺漏。費用的思路請參閱[報酬額表](/zh-tw/labor/ryokin)。\n\n## 本文的依據\n\n- 勞動基準法（昭和22年法律第49號）第9條、第115條、附則第143條第3項\n- 勞動基準法部分修正法律（労働基準法の一部を改正する法律。令和2年法律第13號）附則第2條第2項・第3條。施行日為令和2年4月1日\n- 勞動基準法研究會報告〈關於勞動基準法「勞動者」的判斷基準〉（労働基準法研究会報告「労働基準法の『労働者』の判断基準について」。昭和60年12月19日）。已依厚生勞動省公開的原文確認\n- 勞動保險保險費徵收等相關法律（労働保険の保険料の徴収等に関する法律。昭和44年法律第84號）第41條\n- 健康保險法（大正11年法律第70號）第193條\n- 厚生年金保險法（昭和29年法律第115號）第92條第1項\n- 上述條文均為2026年8月13日時點以e-Gov法令檢索確認的現行條文\n\n**本文並未決定到「該找誰諮詢」為止。** 實際狀態是否為僱用的研判、可能被回溯要求到什麼程度的整理，以及整頓為僱用時的手續，是社會保險勞務士的業務。消費稅與源泉扣繳的處理請找稅理士，因契約解除而發生爭議時請找律師，各自直接委託、另行簽約。本事務所不收取介紹費。向四葉社会保険労務士事務所諮詢時的費用列於[報酬額表](/zh-tw/labor/ryokin)，常收到的問題整理於[常見問答](/zh-tw/labor/faq)。\n\n本文為一般性的資訊提供。針對個別情況的判斷，由具備資格者於面談後進行。執筆者為[浦松丈二](/zh-tw/about/uramatsu)（社會保險勞務士・行政書士・宅地建物取引士）。",
        "category": "勞動法基礎",
        "keywords": [
          "業務委託 僱用 差異",
          "勞動者性 判斷基準",
          "業務委託 實際上是僱用",
          "業務委託 社會保險 回溯",
          "勞動基準法 第9條 勞動者",
          "假承攬 加班費 回溯"
        ],
        "tags": [
          "勞動者性",
          "業務委託",
          "勞動基準法",
          "社會保險",
          "時效"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社會保險勞務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "如果本人說「不要僱用，希望用業務委託」，會怎麼樣？",
            "answer": "本人的意願可以成為判斷的要素之一，但不會僅憑這一點就決定。是否屬於勞動基準法第9條的「勞動者」是依實際狀態判斷的，因此即使雙方同意，只要實際狀態是僱用，就會被當作僱用處理。就算簽了同意書，也沒有改變這項判斷的效力。"
          },
          {
            "question": "一週只來1天的人也會是對象嗎？",
            "answer": "不是以天數多寡決定的。昭和60年的報告所列的判斷項目中並沒有天數。即使一週1天，只要當天的工作無法拒絕、接受指示、時間受到拘束，勞動者性就會朝被認定的方向傾斜。反過來說，即使一週5天，若是依專業裁量行動且有承諾與拒絕的自由，也可能整理成外包。"
          },
          {
            "question": "被回溯請求時，一定會是時效上限的年數嗎？",
            "answer": "不會。時效是「不能再往前回溯」的上限，實際上回溯到哪裡則因案件而異。不過，以上限為前提來估算，在資金準備上比較安全。個別的估算，要在確認契約的開始時期與付款紀錄之後才能討論。"
          },
          {
            "question": "目前有10位簽約的人。全部都需要重新檢視嗎？",
            "answer": "我們建議先把契約條件相同的人分成群組，再逐一群組確認實際狀態。即使契約書的格式相同，實際的工作方式因人而異也並不少見。這比一個一個確認更快，也比較不會有遺漏。費用的思路請參閱報酬額表。"
          }
        ]
      },
      "zh": {
        "title": "外包与雇用的界线，不是由契约书决定的",
        "excerpt": "即使有业务委托契约书，只要实际状态是雇用，就会被当作雇用处理。判断的依据不是契约书的名称，而是能否拒绝工作的委托、是否受到指挥监督、时间与地点是否受到拘束——这些实际状态。我们整理了劳动基准法研究会报告（昭和60年12月19日）的判断项目，并以表格列出可能被回溯请求的范围与时效。",
        "content": "**结论（先讲重点）**：即使有业务委托契约书，只要实际状态是雇用，就会被当作雇用处理。判断的依据不是契约书的名称，而是能否拒绝工作的委托、是否受到指挥监督、时间与地点是否受到拘束——这些实际状态。\n\n\"我们是用业务委托的方式请他做的\"，这样的说明我们经常听到。契约书也有，每个月也收到请款单。即使如此，事后仍可能被认定\"实际状态是雇用\"。因为当契约的形式与实际状态不一致时，被视为正确的不是形式，而是**实际状态**。\n\n## 只要写着\"业务委托\"，就是业务委托吗？\n\n不是。劳动基准法把\"劳动者\"定义为**受事业使用、并被支付工资的人**（劳动基准法第9条）。这里并没有出现契约的名称。也就是说，决定的不是委任、承揽还是雇用，而是**是否被使用**。\n\n把这个想法具体化的，是**劳动基准法研究会报告〈关于劳动基准法\"劳动者\"的判断基准〉（昭和60年12月19日）**。虽然是40年前的报告，但厚生劳动省至今仍将其列为判断基准的资料。报告把\"受使用\"＝在指挥监督下劳动这种提供劳务的形态，与\"被支付工资\"＝报酬的劳务对价性，这两者合起来称为**\"使用从属性\"**，并以此为轴进行综合判断。\n\n## 实际状态要看哪些地方来判断？\n\n报告列出的项目如下。上面4项是判断的核心，下面3项则是补强要素的结构。\n\n| | 观察的地方 | 定位 |\n|---|---|---|\n| ① | 对于工作的委托、从事业务的指示等，有无**承诺与拒绝的自由** | 是否为指挥监督下的劳动 |\n| ② | 执行业务时有无**指挥监督** | 同上 |\n| ③ | 有无**拘束性**（时间、地点） | 同上 |\n| ④ | 有无**代替性** | **补强**指挥监督关系的判断 |\n| ⑤ | **报酬的劳务对价性** | 使用从属性的另一根支柱 |\n| ⑥ | 有无**事业者性**（机械、器具的负担，报酬的金额等） | **补强**劳动者性的判断 |\n| ⑦ | **专属性**的程度 | 同上 |\n\n实务上容易出问题的是①与③。能不能说\"那天不方便\"而拒绝。上下班的时刻是否已经固定，事实上是否被要求在那段时间待在那里。这些一旦成立，契约书上不管写什么都会很吃力。\n\n另外，⑥的\"机械、器具的负担关系\"，是看工具是不是公司准备的项目。电脑与工作服都由公司出借、材料费也由公司负担，这样的状态会朝着削弱事业者性的方向作用。\n\n**这7个项目，不是靠其中任何一项就能决定的。** 报告本身就写着\"综合判断\"，个别案件会倒向哪一边，不把所有事实摊开来看是无法判断的。\n\n## 实际状态是雇用时，会被要求什么？\n\n会被回溯请求。范围因制度而不同，时效的年数也不一致。\n\n| 项目 | 时效 | 依据 |\n|---|---|---|\n| 劳动保险费（劳灾保险・雇用保险） | **2年** | 劳动保险保险费征收等相关法律第41条 |\n| 健康保险费 | **2年** | 健康保险法第193条 |\n| 厚生年金保险费 | **2年** | 厚生年金保险法第92条第1项 |\n| 工资（加班费等。不含退职手当） | **暂时期间为3年** | 劳动基准法第115条・附则第143条第3项 |\n| 退职手当（退职金） | **5年** | 同上 |\n\n**并不是\"工资的时效一律为3年\"。** 劳动基准法第115条的本文原本就是5年，而附则第143条第3项在\"暂时期间\"内将其读作3年，是这样的结构。由于退职手当被排除在这个读法的对象之外，所以只有退职手当从一开始就是5年。\n\n**而且\"暂时期间\"何时结束，法律上并没有写。** 令和2年法律第13号的附则中只有检讨规定，并没有订出自动变成5年的日期。如果看到\"将来会变成5年\"的说明，请一并确认时间点并未确定这一点。\n\n保险费原本应由劳资各半负担，但被回溯请求时，事后要向本人请求其个人负担的部分，实际上会变得困难。在估算金额时，**不只看公司负担的部分，而是把全额都算进去**比较安全。\n\n在税务上也会出现同样的争点。原本以业务委托方式支付的报酬若被当作薪资，消费税与源泉扣缴的处理就会改变。**不过，税务的判断是税理士的业务。** 本事务所并不承办，因此我们会请您直接向税理士委托、另行签约。本事务所不收取介绍费。\n\n## 察觉之后，首先该做什么？\n\n请不要从改写契约书开始。只把书面整理好，实际状态没有改变的话，判断也不会改变。\n\n顺序是**①写出现在的实际状态 → ②决定要把实际状态往哪一边靠 → ③让契约与运作两方面都配合所决定的方向**。②才是本体。是停止指挥监督、变成真正的外包，还是整顿成雇用。选择哪一边，之后所需要的手续会整组改变。\n\n如果决定整顿成雇用，就需要加入社会保险与劳动保险、明示劳动条件，并且依人数不同可能需要就业规则。从几人开始有哪些义务，整理在[就业规则从几人开始是义务，哪些不是义务](/zh/labor/column/shugyokisoku-10nin-gimu-nani-ga-hitsuyo)；以短时间雇用时保险要怎么加入，整理在[以短时间雇用时，社会保险会怎么样](/zh/labor/column/tanjikan-koyo-shakaihoken-4bunno3)。\n\n## 常见问题\n\n**Q. 如果本人说\"不要雇用，希望用业务委托\"，会怎么样？**\nA. 本人的意愿可以成为判断的要素之一，但不会仅凭这一点就决定。是否属于劳动基准法第9条的\"劳动者\"是依实际状态判断的，因此即使双方同意，只要实际状态是雇用，就会被当作雇用处理。就算签了同意书，也没有改变这项判断的效力。\n\n**Q. 一周只来1天的人也会是对象吗？**\nA. 不是以天数多寡决定的。昭和60年的报告所列的判断项目中并没有天数。即使一周1天，只要当天的工作无法拒绝、接受指示、时间受到拘束，劳动者性就会朝被认定的方向倾斜。反过来说，即使一周5天，若是依专业裁量行动且有承诺与拒绝的自由，也可能整理成外包。\n\n**Q. 被回溯请求时，一定会是时效上限的年数吗？**\nA. 不会。时效是\"不能再往前回溯\"的上限，实际上回溯到哪里则因案件而异。不过，以上限为前提来估算，在资金准备上比较安全。个别的估算，要在确认契约的开始时期与付款纪录之后才能讨论。\n\n**Q. 目前有10位签约的人。全部都需要重新检视吗？**\nA. 我们建议先把契约条件相同的人分成群组，再逐一群组确认实际状态。即使契约书的格式相同，实际的工作方式因人而异也并不少见。这比一个一个确认更快，也比较不会有遗漏。费用的思路请参阅[报酬额表](/zh/labor/ryokin)。\n\n## 本文的依据\n\n- 劳动基准法（昭和22年法律第49号）第9条、第115条、附则第143条第3项\n- 劳动基准法部分修正法律（労働基準法の一部を改正する法律。令和2年法律第13号）附则第2条第2项・第3条。施行日为令和2年4月1日\n- 劳动基准法研究会报告〈关于劳动基准法\"劳动者\"的判断基准〉（労働基準法研究会報告「労働基準法の『労働者』の判断基準について」。昭和60年12月19日）。已依厚生劳动省公开的原文确认\n- 劳动保险保险费征收等相关法律（労働保険の保険料の徴収等に関する法律。昭和44年法律第84号）第41条\n- 健康保险法（大正11年法律第70号）第193条\n- 厚生年金保险法（昭和29年法律第115号）第92条第1项\n- 上述条文均为2026年8月13日时点以e-Gov法令检索确认的现行条文\n\n**本文并未决定到\"该找谁咨询\"为止。** 实际状态是否为雇用的研判、可能被回溯要求到什么程度的整理，以及整顿为雇用时的手续，是社会保险劳务士的业务。消费税与源泉扣缴的处理请找税理士，因契约解除而发生争议时请找律师，各自直接委托、另行签约。本事务所不收取介绍费。向四葉社会保険労務士事務所咨询时的费用列于[报酬额表](/zh/labor/ryokin)，常收到的问题整理于[常见问答](/zh/labor/faq)。\n\n本文为一般性的资讯提供。针对个别情况的判断，由具备资格者于面谈后进行。执笔者为[浦松丈二](/zh/about/uramatsu)（社会保险劳务士・行政书士・宅地建物取引士）。",
        "category": "劳动法基础",
        "keywords": [
          "业务委托 雇用 差异",
          "劳动者性 判断基准",
          "业务委托 实际上是雇用",
          "业务委托 社会保险 回溯",
          "劳动基准法 第9条 劳动者",
          "假承揽 加班费 回溯"
        ],
        "tags": [
          "劳动者性",
          "业务委托",
          "劳动基准法",
          "社会保险",
          "时效"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社会保险劳务士・行政书士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "如果本人说\"不要雇用，希望用业务委托\"，会怎么样？",
            "answer": "本人的意愿可以成为判断的要素之一，但不会仅凭这一点就决定。是否属于劳动基准法第9条的\"劳动者\"是依实际状态判断的，因此即使双方同意，只要实际状态是雇用，就会被当作雇用处理。就算签了同意书，也没有改变这项判断的效力。"
          },
          {
            "question": "一周只来1天的人也会是对象吗？",
            "answer": "不是以天数多寡决定的。昭和60年的报告所列的判断项目中并没有天数。即使一周1天，只要当天的工作无法拒绝、接受指示、时间受到拘束，劳动者性就会朝被认定的方向倾斜。反过来说，即使一周5天，若是依专业裁量行动且有承诺与拒绝的自由，也可能整理成外包。"
          },
          {
            "question": "被回溯请求时，一定会是时效上限的年数吗？",
            "answer": "不会。时效是\"不能再往前回溯\"的上限，实际上回溯到哪里则因案件而异。不过，以上限为前提来估算，在资金准备上比较安全。个别的估算，要在确认契约的开始时期与付款纪录之后才能讨论。"
          },
          {
            "question": "目前有10位签约的人。全部都需要重新检视吗？",
            "answer": "我们建议先把契约条件相同的人分成群组，再逐一群组确认实际状态。即使契约书的格式相同，实际的工作方式因人而异也并不少见。这比一个一个确认更快，也比较不会有遗漏。费用的思路请参阅报酬额表。"
          }
        ]
      }
    }
  },
  {
    "business": "labor",
    "slug": "shacho-rosai-tokubetsu-kanyu-hitori",
    "title": "社長には労災が出ない。そして1人だと特別加入もできない",
    "date": "2026-09-01",
    "category": "労働保険",
    "excerpt": "役員は労災保険の給付を受けられません。中小事業主等の特別加入という制度がありますが、労働者を1人も雇っていない会社は加入できません。労働者について労災保険の保険関係が成立していることが条件だからです。業種別の規模要件と、加入までの順序をまとめました。",
    "content": "**結論（先に要点）**：役員は労災保険の給付を受けられません。中小事業主等の特別加入という制度がありますが、**労働者を1人も雇っていない会社は加入できません**。労働者について労災保険の保険関係が成立していることが、加入の条件だからです。\n\n現場に出る社長ほど、この話を知らないままでいることがあります。従業員のけがには労災が出るのに、同じ現場で同じ作業をしていた社長本人には出ない。しかも、備えようとして調べると「1人だから入れない」という答えに行き当たります。順を追って整理します。\n\n## 社長が仕事中にけがをしたら、労災は出るのか？\n\n出ません。労災保険は**労働者**のための制度で、労働者災害補償保険法は「**労働者を使用する事業**を適用事業とする」と定めています（同法第3条第1項）。会社の代表者は、その会社に使用される労働者ではないため、保険給付の対象から外れます。\n\n現場で従業員と並んで同じ作業をしていても、この結論は変わりません。実務で厳しいのはここで、危険の度合いは同じなのに、補償の有無だけが立場で分かれます。\n\nなお、健康保険は使えます。ただし**業務上のけがや病気は、原則として健康保険の給付の対象になりません**。労災でも健保でもない、という状態が起こりうる、というのがこの話の核心です。\n\n## 特別加入とは、何ができる制度なのか？\n\nこの隙間を埋めるために置かれているのが**特別加入**です。労働者ではない人を、申請と政府の承認によって「労働者とみなす」しくみで、労働者災害補償保険法第33条以下に定めがあります。\n\n対象は立場ごとに分かれています。会社の代表者が使うのは、原則として**中小事業主等**の枠です。\n\n| 枠 | 誰が | 根拠 |\n|---|---|---|\n| 中小事業主等 | 規模要件を満たす事業の事業主（法人なら代表者） | 労災保険法第33条第1号 |\n| 同上 | その事業主が行う事業に従事する者（役員・家族従事者など。労働者である者を除く） | 同第33条第2号 |\n| 一人親方等 | 省令で定める種類の事業を、労働者を使用しないで行うことを常態とする者 | 同第33条第3号 |\n| 海外派遣者 | 国内の事業主が海外の事業に従事させるため派遣する者 | 同第33条第7号 |\n\n**「中小」の線引きは、業種によって違います。**\n\n| 主たる事業 | 常時使用する労働者数 |\n|---|---|\n| 金融業・保険業、不動産業、小売業 | **50人以下** |\n| 卸売業、サービス業 | **100人以下** |\n| 上記以外 | **300人以下** |\n\n（労働者災害補償保険法施行規則第46条の16）\n\n数え方には行政の運用があります。工場や支店がいくつかあるときは**それぞれの労働者数を合計**して企業単位で見ること、業種の区分は原則として**日本標準産業分類**によること、そして通年で雇っていない場合も**1年間に100日以上**労働者を使用していれば「常時使用している」として扱われること。いずれも厚生労働省「特別加入制度のしおり（中小事業主等用）」に示されています。\n\n## 従業員がいない会社は、なぜ入れないのか？\n\n条文が2つの要件でできているためです。\n\n| | 要件 | 根拠 |\n|---|---|---|\n| ① | その事業について**労災保険の保険関係が成立している**こと | 労災保険法第34条第1項（「当該事業について成立する保険関係に基づき」） |\n| ② | **労働保険事務組合**に労働保険事務の処理を**委託している**こと | 労災保険法第33条第1号 |\n\n①でつまずきます。労災保険の保険関係は、**労働者を使用する事業**の事業主について、その事業が開始された日に成立します（労働保険の保険料の徴収等に関する法律第3条）。労働者が1人もいなければ適用事業に当たらず、成立する保険関係そのものがありません。特別加入は、成立している保険関係に**乗る**制度なので、乗る土台がない状態では申請できないわけです。\n\n同じ理由から、**あとで労働者がいなくなれば、特別加入者としての地位も消えます。** 厚生労働省のしおりも「この保険関係が消滅したときは、その消滅の日に特別加入者としての地位も消滅します」と明記しています。②の委託を解除したときも同様です。\n\n**つまり、最初の1人を雇った日が、社長自身が守られる最初の日になります。**\n\nただし、**すべての1人社長が入れないわけではありません。** 建設業など省令で定められた種類の事業を、労働者を使用しないで行うことを常態としている場合は、**一人親方等**（第33条第3号）として加入できる場合があります。厚生労働省のしおりも、1年間に労働者を使用する日数が100日未満で中小事業主等として加入できない場合について、一人親方等の要件を満たせばそちらで加入できると案内しています。ご自身の事業がどの枠に当たるかは、業種と働き方の両方を見ないと決まりません。\n\n## 入るには、何から手をつけるのか？\n\n労働者を雇っている（または雇う予定がある）場合、順番は次のようになります。\n\n1. **労働者について労働保険の保険関係を成立させる**（保険関係成立届の提出）\n2. **労働保険事務組合を選び、労働保険事務の処理を委託する**\n3. 事務組合を通じて**特別加入の申請**を行い、政府の承認を受ける\n\n2の事務組合は、商工会・商工会議所・事業協同組合などが厚生労働大臣の認可を受けて運営しています。**特別加入は事務組合への委託が要件になっているため、委託しないという選択肢がありません。** 委託料が別途かかることも、先に見込んでおいてください。\n\n会社をつくったばかりで、労働保険の手続がまだの場合は[会社をつくったら、いつまでに何を出すのか](/labor/column/kaisha-setsuritsu-shakaihoken-roudouhoken-kigen)に期限をまとめています。従業員を海外に出す場合は労災の扱いが変わるので、[海外出張と海外派遣は、労災でまったく違う](/labor/column/kaigai-shucho-haken-rosai-chigai)をご覧ください。\n\n## よくある質問\n\n**Q. 役員が2人いて、どちらも現場に出ています。両方入れますか？**\nA. 中小事業主等の特別加入では、事業主（法人なら代表者）に加えて「その事業主が行う事業に従事する者」も対象とされています（労働者災害補償保険法第33条第2号）。代表者以外の役員も、この枠で申請の対象になりえます。ただし承認は申請ごとの判断になりますので、実際の従事状況を整理したうえでの手続になります。\n\n**Q. 従業員はアルバイト1人だけです。それでも保険関係は成立しますか？**\nA. 労働者を使用していれば、労働時間や雇用形態にかかわらず労災保険の適用事業になります。アルバイトでも保険関係は成立します。なお労災保険は、雇用保険と違って**週20時間未満でも適用**されます。この点は混同されやすいところです。\n\n**Q. 給付の額はどう決まりますか？**\nA. 特別加入者には実際の賃金がないため、あらかじめ申請して承認された**給付基礎日額**をもとに給付額が決まります（労働者災害補償保険法第34条第1項第3号）。日額をいくらに設定するかで保険料も給付額も変わるため、加入時に決める必要があります。\n\n**Q. 加入していれば、どんなけがでも給付されますか？**\nA. いいえ。特別加入者の場合、**業務として承認された範囲の作業**に伴うものが対象です。事業主としての経営の仕事や、私的な行為の最中の事故は対象になりません。この範囲の線引きは加入時に確認しておくべきところで、加入だけして中身を確認しないままにすると、いざというときに食い違いが出ます。ご相談は[報酬額表](/labor/ryokin)の料金でお受けしています。\n\n## この記事の根拠\n\n- 労働者災害補償保険法（昭和22年法律第50号）第3条第1項、第33条第1号・第2号・第3号・第7号、第34条第1項、第36条第1項\n- 労働者災害補償保険法施行規則（昭和30年労働省令第22号）第46条の16、第46条の17、第46条の19\n- 労働保険の保険料の徴収等に関する法律（昭和44年法律第84号）第3条、第33条第1項\n- 労働保険の保険料の徴収等に関する法律施行規則（昭和47年労働省令第8号）第62条第2項\n- 厚生労働省「特別加入制度のしおり（中小事業主等用）」（常時使用する労働者数の数え方、100日基準、保険関係消滅時の取扱い）\n- 条文はいずれも2026年8月13日時点でe-Gov法令検索により確認した現行条文です。規則第46条の16の規模要件（50人・100人・300人）は、e-Govで遡れる2017年4月1日施行版以降、変更されていないことを確認しました\n- 業種区分の日本標準産業分類による運用および企業単位での合算は、厚生労働省・都道府県労働局の公表資料により確認しています。これらを定めた通達の原文は確認していません（**未検証**）\n\n**この記事は、誰に相談するかまでは決めていません。** 特別加入の可否の見立て、労働保険の成立手続、事務組合への委託の段取りは社会保険労務士の業務です。役員の報酬や退職金の税務の扱いは税理士、役員変更の登記は司法書士へ、それぞれ直接ご依頼いただく形をご案内します。当事務所は紹介料を受け取りません。四葉社会保険労務士事務所にご相談いただく場合の費用は[報酬額表](/labor/ryokin)に、よくいただくご質問は[よくあるご質問](/labor/faq)にまとめています。\n\n本記事は一般的な情報提供です。個別のご事情に応じた判断は、面談のうえ資格者が行います。執筆は[浦松丈二](/about/uramatsu)（社会保険労務士・行政書士・宅地建物取引士）です。",
    "status": "published",
    "author": {
      "name": "浦松 丈二",
      "title": "社会保険労務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
    },
    "keywords": [
      "社長 労災 出ない",
      "労災保険 特別加入 中小事業主",
      "一人社長 労災 特別加入",
      "特別加入 労働保険事務組合",
      "特別加入 業種 規模要件",
      "役員 労災 けが"
    ],
    "tags": [
      "労災保険",
      "特別加入",
      "役員",
      "労働保険事務組合",
      "中小企業"
    ],
    "locales": [],
    "faq": [
      {
        "question": "役員が2人いて、どちらも現場に出ています。両方入れますか？",
        "answer": "中小事業主等の特別加入では、事業主（法人なら代表者）に加えて「その事業主が行う事業に従事する者」も対象とされています（労働者災害補償保険法第33条第2号）。代表者以外の役員も、この枠で申請の対象になりえます。ただし承認は申請ごとの判断になりますので、実際の従事状況を整理したうえでの手続になります。"
      },
      {
        "question": "従業員はアルバイト1人だけです。それでも保険関係は成立しますか？",
        "answer": "労働者を使用していれば、労働時間や雇用形態にかかわらず労災保険の適用事業になります。アルバイトでも保険関係は成立します。なお労災保険は、雇用保険と違って週20時間未満でも適用されます。この点は混同されやすいところです。"
      },
      {
        "question": "給付の額はどう決まりますか？",
        "answer": "特別加入者には実際の賃金がないため、あらかじめ申請して承認された給付基礎日額をもとに給付額が決まります（労働者災害補償保険法第34条第1項第3号）。日額をいくらに設定するかで保険料も給付額も変わるため、加入時に決める必要があります。"
      },
      {
        "question": "加入していれば、どんなけがでも給付されますか？",
        "answer": "いいえ。特別加入者の場合、業務として承認された範囲の作業に伴うものが対象です。事業主としての経営の仕事や、私的な行為の最中の事故は対象になりません。この範囲の線引きは加入時に確認しておくべきところで、加入だけして中身を確認しないままにすると、いざというときに食い違いが出ます。ご相談は報酬額表の料金でお受けしています。"
      }
    ],
    "translations": {
      "en": {
        "title": "There is no workers' accident insurance for the president. And with no employees, no special enrollment either.",
        "excerpt": "Directors cannot receive benefits under workers' accident compensation insurance. There is a special enrollment scheme for owners of small and medium-sized businesses and others, but a company that employs no workers at all cannot join, because the condition is that an insurance relationship under workers' accident compensation insurance has been established in respect of workers. We set out the size requirements by industry and the order of the steps up to enrollment.",
        "content": "**In short:** Directors cannot receive benefits under workers' accident compensation insurance. There is a scheme called special enrollment for owners of small and medium-sized businesses and others, but **a company that employs no workers at all cannot join**. That an insurance relationship under workers' accident compensation insurance has been established in respect of workers is the condition for joining.\n\nThe presidents who are out on site are often the ones who go on without knowing this. An employee's injury is covered by workers' accident compensation insurance, but the president who was doing the same work on the same site is not. And when they look into providing for it, they run into the answer \"with one person, you cannot join.\" Let us take it in order.\n\n## If the president is injured at work, does workers' accident compensation insurance pay out?\n\nIt does not. Workers' accident compensation insurance is a scheme for **workers**, and the Industrial Accident Compensation Insurance Act (労働者災害補償保険法, Act No. 50 of 1947) provides that **a business that uses workers is a covered business** (Article 3, paragraph 1 of that Act). The representative of a company is not a worker used by that company, and so falls outside the scope of insurance benefits.\n\nStanding on site doing the same work alongside employees does not change this conclusion. This is the hard part in practice: the degree of danger is the same, and only whether there is compensation is divided by status.\n\nHealth insurance can be used. However, **injuries and illnesses arising out of work are, as a rule, not covered by health insurance benefits**. That a state of neither workers' accident compensation nor health insurance can arise is the heart of this subject.\n\n## What is the special enrollment scheme able to do?\n\nWhat is in place to fill this gap is **special enrollment**. It is a mechanism by which a person who is not a worker is \"deemed to be a worker\" upon application and approval by the government, provided for in Article 33 and the following articles of the Industrial Accident Compensation Insurance Act.\n\nThe categories are divided by status. What the representative of a company uses is, as a rule, the category of **owners of small and medium-sized businesses and others (中小事業主等)**.\n\n| Category | Who | Basis |\n|---|---|---|\n| Owners of small and medium-sized businesses and others | The owner of a business that meets the size requirements (the representative, in the case of a company) | 労災保険法, Article 33, item 1 |\n| Same as above | Persons engaged in the business carried on by that business owner (directors, family workers and the like; excluding those who are workers) | Same Act, Article 33, item 2 |\n| Sole proprietors without employees and others (一人親方等) | Persons who habitually carry on, without using workers, a business of a kind specified by ordinance | Same Act, Article 33, item 3 |\n| Workers posted overseas | Persons dispatched by a domestic business owner to be engaged in a business overseas | Same Act, Article 33, item 7 |\n\n**Where the line for \"small and medium-sized\" falls differs by industry.**\n\n| Principal business | Number of workers regularly employed |\n|---|---|\n| Finance and insurance, real estate, retail | **50 or fewer** |\n| Wholesale, services | **100 or fewer** |\n| Other than the above | **300 or fewer** |\n\n(労働者災害補償保険法施行規則, Article 46-16)\n\nThere are administrative practices for counting. Where there are several factories or branches, **the numbers of workers at each are added together** and the count is taken on an enterprise basis; the industry classification follows, as a rule, the **日本標準産業分類 (Japan Standard Industrial Classification)**; and even where workers are not employed all year round, a business that uses workers on **100 or more days in a year** is treated as employing them regularly. All of these are set out in the Ministry of Health, Labour and Welfare's 特別加入制度のしおり（中小事業主等用）(Guide to the special enrollment scheme, for owners of small and medium-sized businesses and others).\n\n## Why can a company with no employees not join?\n\nBecause the provisions are built on two requirements.\n\n| | Requirement | Basis |\n|---|---|---|\n| ① | That **an insurance relationship under workers' accident compensation insurance has been established** in respect of that business | 労災保険法, Article 34, paragraph 1 (\"based on the insurance relationship established in respect of that business\") |\n| ② | That the handling of labor insurance administration has been **entrusted** to a **労働保険事務組合 (labor insurance administration association)** | 労災保険法, Article 33, item 1 |\n\nIt is ① that trips people up. The insurance relationship under workers' accident compensation insurance comes into existence, for the owner of **a business that uses workers**, on the day that business is commenced (労働保険の保険料の徴収等に関する法律, Article 3). If there is not a single worker, the business is not a covered business, and there is no insurance relationship in existence at all. Special enrollment is a scheme that **rides on** an established insurance relationship, so where there is no base to ride on, no application can be made.\n\nFor the same reason, **if the workers later cease to exist, the standing as a specially enrolled person disappears too.** The Ministry's guide states expressly that \"when this insurance relationship is extinguished, the standing as a specially enrolled person is also extinguished on the day of that extinguishment.\" The same applies when the entrustment under ② is terminated.\n\n**In other words, the day you take on your first worker is the first day on which the president is protected.**\n\nThat said, **it is not the case that every one-person company is unable to join.** Where a person habitually carries on, without using workers, a business of a kind specified by ordinance — construction and the like — they may in some cases enroll as a **sole proprietor without employees (一人親方等)** (Article 33, item 3). The Ministry's guide likewise explains that where the number of days on which workers are used in a year is fewer than 100 and enrollment as an owner of a small or medium-sized business is not available, a person who meets the requirements for sole proprietors without employees can enroll under that category instead. Which category your own business falls into cannot be settled without looking at both the industry and the way you work.\n\n## Where do you start in order to join?\n\nWhere you employ workers (or plan to), the order is as follows.\n\n1. **Bring an insurance relationship under labor insurance into existence in respect of the workers** (submit the 保険関係成立届, notification of establishment of the insurance relationship)\n2. **Choose a labor insurance administration association and entrust the handling of labor insurance administration to it**\n3. **Apply for special enrollment** through the association and obtain approval from the government\n\nThe associations at step 2 are run by societies of commerce and industry, chambers of commerce and industry, business cooperatives and the like, under authorization from the Minister of Health, Labour and Welfare. **Because entrustment to an association is a requirement for special enrollment, there is no option of not entrusting.** Allow in advance for the separate fee the association charges as well.\n\nIf you have only just set up the company and the labor insurance filings are still outstanding, the deadlines are set out in [Once you set up a company, what has to be filed and by when](/en/labor/column/kaisha-setsuritsu-shakaihoken-roudouhoken-kigen). If you send employees overseas, the treatment under workers' accident compensation insurance changes, so please see [Overseas business trips and overseas postings are entirely different for workers' accident compensation insurance](/en/labor/column/kaigai-shucho-haken-rosai-chigai).\n\n## Frequently asked questions\n\n**Q. There are two directors and both are out on site. Can both of them enroll?**\nA. Under special enrollment for owners of small and medium-sized businesses and others, in addition to the business owner (the representative, in the case of a company), \"persons engaged in the business carried on by that business owner\" are also covered (労働者災害補償保険法, Article 33, item 2). Directors other than the representative can therefore be the subject of an application under this category. Approval is, however, a judgment made on each application, so the procedure follows after organizing how the person is actually engaged.\n\n**Q. Our only employee is one part-timer. Does an insurance relationship still come into existence?**\nA. If you use workers, the business is covered by workers' accident compensation insurance regardless of working hours or the form of employment. An insurance relationship comes into existence even with a part-timer. Note that workers' accident compensation insurance, unlike employment insurance, **applies even below 20 hours a week**. This is a point that is easily confused.\n\n**Q. How is the amount of benefit determined?**\nA. Because a specially enrolled person has no actual wages, the amount of benefit is determined on the basis of the **給付基礎日額 (basic daily benefit amount)** applied for and approved in advance (労働者災害補償保険法, Article 34, paragraph 1, item 3). The level at which the daily amount is set changes both the premium and the amount of benefit, so it has to be decided at the time of enrollment.\n\n**Q. Once enrolled, is any injury covered?**\nA. No. For a specially enrolled person, what is covered is what arises in connection with **work within the scope approved as business activity**. Accidents during management work as a business owner, or during private activities, are not covered. Where this line falls is something to confirm at the time of enrollment; enrolling without checking the substance leaves a discrepancy that shows up at the critical moment. We accept consultations at the rates in the [fee schedule](/en/labor/ryokin).\n\n## Sources for this article\n\n- the Industrial Accident Compensation Insurance Act (労働者災害補償保険法, Act No. 50 of 1947), Article 3, paragraph 1; Article 33, items 1, 2, 3 and 7; Article 34, paragraph 1; Article 36, paragraph 1\n- the Ordinance for Enforcement of the Industrial Accident Compensation Insurance Act (労働者災害補償保険法施行規則, Ordinance of the Ministry of Labour No. 22 of 1955), Article 46-16, Article 46-17, Article 46-19\n- the Act on Collection of Insurance Premiums of Labor Insurance (労働保険の保険料の徴収等に関する法律, Act No. 84 of 1969), Article 3, Article 33, paragraph 1\n- the Ordinance for Enforcement of the Act on Collection of Insurance Premiums of Labor Insurance (労働保険の保険料の徴収等に関する法律施行規則, Ordinance of the Ministry of Labour No. 8 of 1972), Article 62, paragraph 2\n- Ministry of Health, Labour and Welfare, 特別加入制度のしおり（中小事業主等用）(Guide to the special enrollment scheme, for owners of small and medium-sized businesses and others) (how the number of workers regularly employed is counted, the 100-day criterion, and the treatment when the insurance relationship is extinguished)\n- All of the provisions are the versions in force as confirmed on e-Gov法令検索 (e-Gov Law Search) on August 13, 2026. We confirmed that the size requirements in Article 46-16 of the Ordinance (50, 100 and 300 people) have not changed since the version in force from April 1, 2017, which is as far back as e-Gov goes\n- The practice of classifying industries by the 日本標準産業分類 and of aggregating on an enterprise basis is confirmed from materials published by the Ministry of Health, Labour and Welfare and the Prefectural Labour Bureaus. We have not checked the original text of the administrative notices that established them (**not verified**)\n\n**This article does not go so far as to decide whom you should consult.** Forming a view on whether special enrollment is available, the procedures for bringing labor insurance into existence, and the arrangements for entrustment to an administration association are the work of a Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant). For the tax treatment of directors' remuneration and retirement benefits, a tax accountant; for registration of a change of directors, a judicial scrivener — in each case we suggest that you engage them directly, under a separate contract. We receive no referral fee. The fees for consulting 四葉社会保険労務士事務所 are set out in the [fee schedule](/en/labor/ryokin), and the questions we are asked most often in the [frequently asked questions](/en/labor/faq).\n\nThis article is general information. Judgments that depend on your particular circumstances are made by a qualified professional after a meeting. Written by [Joji Uramatsu](/en/about/uramatsu) (Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist).",
        "category": "Labor insurance",
        "keywords": [
          "no workers accident insurance for the president",
          "special enrollment for owners of small and medium-sized businesses",
          "one-person company workers accident special enrollment",
          "labor insurance administration association",
          "special enrollment industry size requirements",
          "director injured at work"
        ],
        "tags": [
          "workers' accident compensation insurance",
          "special enrollment",
          "directors",
          "labor insurance administration association",
          "small and medium-sized businesses"
        ],
        "author": {
          "name": "Joji Uramatsu",
          "title": "Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist — 四葉社会保険労務士事務所／四葉行政書士事務所"
        },
        "faq": [
          {
            "question": "There are two directors and both are out on site. Can both of them enroll?",
            "answer": "Under special enrollment for owners of small and medium-sized businesses and others, in addition to the business owner (the representative, in the case of a company), \"persons engaged in the business carried on by that business owner\" are also covered (労働者災害補償保険法, Article 33, item 2). Directors other than the representative can therefore be the subject of an application under this category. Approval is, however, a judgment made on each application, so the procedure follows after organizing how the person is actually engaged."
          },
          {
            "question": "Our only employee is one part-timer. Does an insurance relationship still come into existence?",
            "answer": "If you use workers, the business is covered by workers' accident compensation insurance regardless of working hours or the form of employment. An insurance relationship comes into existence even with a part-timer. Note that workers' accident compensation insurance, unlike employment insurance, applies even below 20 hours a week. This is a point that is easily confused."
          },
          {
            "question": "How is the amount of benefit determined?",
            "answer": "Because a specially enrolled person has no actual wages, the amount of benefit is determined on the basis of the 給付基礎日額 (basic daily benefit amount) applied for and approved in advance (労働者災害補償保険法, Article 34, paragraph 1, item 3). The level at which the daily amount is set changes both the premium and the amount of benefit, so it has to be decided at the time of enrollment."
          },
          {
            "question": "Once enrolled, is any injury covered?",
            "answer": "No. For a specially enrolled person, what is covered is what arises in connection with work within the scope approved as business activity. Accidents during management work as a business owner, or during private activities, are not covered. Where this line falls is something to confirm at the time of enrollment; enrolling without checking the substance leaves a discrepancy that shows up at the critical moment. We accept consultations at the rates in the fee schedule."
          }
        ]
      },
      "zh-tw": {
        "title": "社長領不到勞災給付。而且只有一個人時，連特別加入也做不到",
        "excerpt": "董事無法領取勞災保險的給付。雖然有中小事業主等的特別加入制度，但一名勞動者都沒有僱用的公司無法加入。因為加入的條件是，已就勞動者成立勞災保險的保險關係。我們整理了各業種的規模要件，以及加入前的步驟順序。",
        "content": "**結論（先講重點）**：董事無法領取勞災保險的給付。雖然有中小事業主等的特別加入制度，但**一名勞動者都沒有僱用的公司無法加入**。因為已就勞動者成立勞災保險的保險關係，正是加入的條件。\n\n越是親自到現場的社長，越可能一直不知道這件事。員工受傷有勞災給付，在同一個現場做同樣作業的社長本人卻沒有。而且想要事先準備時去查，得到的答案卻是「只有一個人所以不能加入」。我們依序整理。\n\n## 社長在工作中受傷，勞災會給付嗎？\n\n不會。勞災保險是為**勞動者**設置的制度，勞動者災害補償保險法規定「**以使用勞動者的事業為適用事業**」（同法第3條第1項）。公司的代表人並不是受該公司使用的勞動者，因此被排除在保險給付的對象之外。\n\n即使在現場與員工並排做同樣的作業，這個結論也不會改變。實務上嚴苛的正是這一點：危險的程度相同，卻只因立場不同而分出有無補償。\n\n另外，健康保險是可以使用的。不過，**因業務而發生的傷病，原則上不屬於健康保險的給付對象**。可能出現既不是勞災、也不是健保的狀態，這正是這個話題的核心。\n\n## 特別加入是能做什麼的制度？\n\n為了填補這個縫隙而設置的，就是**特別加入**。這是把非勞動者的人，透過申請與政府的承認「視為勞動者」的機制，規定在勞動者災害補償保險法第33條以下。\n\n對象依立場而分。公司的代表人所使用的，原則上是**中小事業主等**這個框。\n\n| 框 | 誰 | 依據 |\n|---|---|---|\n| 中小事業主等 | 符合規模要件之事業的事業主（法人則為代表人） | 勞災保險法第33條第1號 |\n| 同上 | 從事該事業主所經營事業的人（董事、家族從事者等。屬於勞動者者除外） | 同第33條第2號 |\n| 一人親方等（不僱用勞動者的個人業者） | 以不使用勞動者的方式，常態經營省令所定種類事業的人 | 同第33條第3號 |\n| 海外派遣者 | 由國內事業主為使其從事海外事業而派遣的人 | 同第33條第7號 |\n\n**「中小」的界線因業種而不同。**\n\n| 主要事業 | 經常使用的勞動者人數 |\n|---|---|\n| 金融業・保險業、不動產業、零售業 | **50人以下** |\n| 批發業、服務業 | **100人以下** |\n| 上述以外 | **300人以下** |\n\n（勞動者災害補償保險法施行規則第46條之16）\n\n計算方式有行政上的運作方式。有數個工廠或分店時，要把**各自的勞動者人數合計**，以企業為單位來看；業種的區分原則上依**日本標準產業分類**；即使不是全年僱用，只要**一年間有100日以上**使用勞動者，也會被當作「經常使用」。這些都記載於厚生勞動省〈特別加入制度指南（中小事業主等用）〉。\n\n## 沒有員工的公司，為什麼不能加入？\n\n因為條文是由兩個要件構成的。\n\n| | 要件 | 依據 |\n|---|---|---|\n| ① | 就該事業**已成立勞災保險的保險關係** | 勞災保險法第34條第1項（「依就該事業成立的保險關係」） |\n| ② | 已將勞動保險事務的處理**委託**給**勞動保險事務組合** | 勞災保險法第33條第1號 |\n\n會卡住的是①。勞災保險的保險關係，是就**使用勞動者的事業**的事業主，於該事業開始之日成立（勞動保險保險費徵收等相關法律第3條）。如果一名勞動者都沒有，就不屬於適用事業，也就不存在所成立的保險關係。特別加入是**搭載**在已成立的保險關係上的制度，因此在沒有可搭載基礎的狀態下無法提出申請。\n\n基於同樣的理由，**日後若勞動者不在了，特別加入者的地位也會消滅。** 厚生勞動省的指南也明確寫著「當此保險關係消滅時，特別加入者的地位亦於消滅之日消滅」。解除②的委託時也是一樣。\n\n**也就是說，僱用第一個人的那一天，才是社長本身受到保障的第一天。**\n\n不過，**並不是所有一人公司都不能加入。** 若是以不使用勞動者的方式，常態經營建設業等省令所定種類的事業，可能可以用**一人親方等**（第33條第3號）的身分加入。厚生勞動省的指南也說明，若一年間使用勞動者的日數未滿100日、無法以中小事業主等的身分加入時，只要符合一人親方等的要件，就可以用該框加入。自己的事業屬於哪一個框，不同時看業種與工作方式是無法確定的。\n\n## 要加入，該從什麼開始著手？\n\n有僱用勞動者（或預定僱用）時，順序如下。\n\n1. **就勞動者成立勞動保險的保險關係**（提出保険関係成立届，即保險關係成立申報書）\n2. **選定勞動保險事務組合，委託其處理勞動保險事務**\n3. 透過事務組合**提出特別加入的申請**，並取得政府的承認\n\n步驟2的事務組合，是由商工會、商工會議所、事業協同組合等取得厚生勞動大臣認可後營運的。**由於特別加入以委託事務組合為要件，因此沒有「不委託」這個選項。** 也請先把另外產生的委託費用估算進去。\n\n如果公司剛成立、勞動保險的手續尚未辦理，期限整理在[公司成立後，什麼時候之前要提出什麼](/zh-tw/labor/column/kaisha-setsuritsu-shakaihoken-roudouhoken-kigen)。若要讓員工前往海外，勞災的處理會改變，請參閱[海外出差與海外派遣，在勞災上完全不同](/zh-tw/labor/column/kaigai-shucho-haken-rosai-chigai)。\n\n## 常見問題\n\n**Q. 有2位董事，兩人都會到現場。兩人都可以加入嗎？**\nA. 在中小事業主等的特別加入中，除了事業主（法人則為代表人）之外，「從事該事業主所經營事業的人」也是對象（勞動者災害補償保險法第33條第2號）。代表人以外的董事，也可能成為此框的申請對象。不過承認是就每一件申請個別判斷，因此要先整理實際的從事狀況再辦理手續。\n\n**Q. 員工只有1位工讀生。這樣保險關係也會成立嗎？**\nA. 只要使用勞動者，不論工作時間或僱用形態如何，都會成為勞災保險的適用事業。即使是工讀生，保險關係也會成立。另外，勞災保險與僱用保險不同，**每週未滿20小時也適用**。這一點很容易混淆。\n\n**Q. 給付的金額是怎麼決定的？**\nA. 特別加入者沒有實際的工資，因此依事先申請並經承認的**給付基礎日額**來決定給付金額（勞動者災害補償保險法第34條第1項第3號）。日額設定為多少，保險費與給付金額都會改變，所以必須在加入時決定。\n\n**Q. 只要加入了，任何受傷都會給付嗎？**\nA. 不是。特別加入者的情況，對象是伴隨**經承認為業務範圍內的作業**而發生的事故。以事業主身分進行的經營工作，或私人行為過程中的事故，都不是對象。這個範圍的界線應在加入時確認清楚，若只是加入而沒有確認內容，真正需要時就會出現落差。諮詢依[報酬額表](/zh-tw/labor/ryokin)的費用受理。\n\n## 本文的依據\n\n- 勞動者災害補償保險法（昭和22年法律第50號）第3條第1項、第33條第1號・第2號・第3號・第7號、第34條第1項、第36條第1項\n- 勞動者災害補償保險法施行規則（昭和30年勞動省令第22號）第46條之16、第46條之17、第46條之19\n- 勞動保險保險費徵收等相關法律（労働保険の保険料の徴収等に関する法律。昭和44年法律第84號）第3條、第33條第1項\n- 勞動保險保險費徵收等相關法律施行規則（昭和47年勞動省令第8號）第62條第2項\n- 厚生勞動省〈特別加入制度指南（中小事業主等用）〉（特別加入制度のしおり（中小事業主等用））（經常使用的勞動者人數的計算方式、100日基準、保險關係消滅時的處理）\n- 上述條文均為2026年8月13日時點以e-Gov法令檢索確認的現行條文。規則第46條之16的規模要件（50人・100人・300人），已確認自e-Gov可回溯的2017年4月1日施行版以後未曾變更\n- 業種區分依日本標準產業分類的運作方式，以及以企業為單位的合計，是依厚生勞動省與都道府縣勞動局的公開資料確認。制定這些做法的通達原文尚未確認（**未經查證**）\n\n**本文並未決定到「該找誰諮詢」為止。** 特別加入可否的研判、勞動保險的成立手續、委託事務組合的安排，是社會保險勞務士的業務。董事報酬與退職金的稅務處理請找稅理士，董事變更的登記請找司法書士，各自直接委託、另行簽約。本事務所不收取介紹費。向四葉社会保険労務士事務所諮詢時的費用列於[報酬額表](/zh-tw/labor/ryokin)，常收到的問題整理於[常見問答](/zh-tw/labor/faq)。\n\n本文為一般性的資訊提供。針對個別情況的判斷，由具備資格者於面談後進行。執筆者為[浦松丈二](/zh-tw/about/uramatsu)（社會保險勞務士・行政書士・宅地建物取引士）。",
        "category": "勞動保險",
        "keywords": [
          "社長 勞災 領不到",
          "勞災保險 特別加入 中小事業主",
          "一人公司 勞災 特別加入",
          "特別加入 勞動保險事務組合",
          "特別加入 業種 規模要件",
          "董事 勞災 受傷"
        ],
        "tags": [
          "勞災保險",
          "特別加入",
          "董事",
          "勞動保險事務組合",
          "中小企業"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社會保險勞務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "有2位董事，兩人都會到現場。兩人都可以加入嗎？",
            "answer": "在中小事業主等的特別加入中，除了事業主（法人則為代表人）之外，「從事該事業主所經營事業的人」也是對象（勞動者災害補償保險法第33條第2號）。代表人以外的董事，也可能成為此框的申請對象。不過承認是就每一件申請個別判斷，因此要先整理實際的從事狀況再辦理手續。"
          },
          {
            "question": "員工只有1位工讀生。這樣保險關係也會成立嗎？",
            "answer": "只要使用勞動者，不論工作時間或僱用形態如何，都會成為勞災保險的適用事業。即使是工讀生，保險關係也會成立。另外，勞災保險與僱用保險不同，每週未滿20小時也適用。這一點很容易混淆。"
          },
          {
            "question": "給付的金額是怎麼決定的？",
            "answer": "特別加入者沒有實際的工資，因此依事先申請並經承認的給付基礎日額來決定給付金額（勞動者災害補償保險法第34條第1項第3號）。日額設定為多少，保險費與給付金額都會改變，所以必須在加入時決定。"
          },
          {
            "question": "只要加入了，任何受傷都會給付嗎？",
            "answer": "不是。特別加入者的情況，對象是伴隨經承認為業務範圍內的作業而發生的事故。以事業主身分進行的經營工作，或私人行為過程中的事故，都不是對象。這個範圍的界線應在加入時確認清楚，若只是加入而沒有確認內容，真正需要時就會出現落差。諮詢依報酬額表的費用受理。"
          }
        ]
      },
      "zh": {
        "title": "社长领不到劳灾给付。而且只有一个人时，连特别加入也做不到",
        "excerpt": "董事无法领取劳灾保险的给付。虽然有中小事业主等的特别加入制度，但一名劳动者都没有雇用的公司无法加入。因为加入的条件是，已就劳动者成立劳灾保险的保险关系。我们整理了各业种的规模要件，以及加入前的步骤顺序。",
        "content": "**结论（先讲重点）**：董事无法领取劳灾保险的给付。虽然有中小事业主等的特别加入制度，但**一名劳动者都没有雇用的公司无法加入**。因为已就劳动者成立劳灾保险的保险关系，正是加入的条件。\n\n越是亲自到现场的社长，越可能一直不知道这件事。员工受伤有劳灾给付，在同一个现场做同样作业的社长本人却没有。而且想要事先准备时去查，得到的答案却是\"只有一个人所以不能加入\"。我们依序整理。\n\n## 社长在工作中受伤，劳灾会给付吗？\n\n不会。劳灾保险是为**劳动者**设置的制度，劳动者灾害补偿保险法规定\"**以使用劳动者的事业为适用事业**\"（同法第3条第1项）。公司的代表人并不是受该公司使用的劳动者，因此被排除在保险给付的对象之外。\n\n即使在现场与员工并排做同样的作业，这个结论也不会改变。实务上严苛的正是这一点：危险的程度相同，却只因立场不同而分出有无补偿。\n\n另外，健康保险是可以使用的。不过，**因业务而发生的伤病，原则上不属于健康保险的给付对象**。可能出现既不是劳灾、也不是健保的状态，这正是这个话题的核心。\n\n## 特别加入是能做什么的制度？\n\n为了填补这个缝隙而设置的，就是**特别加入**。这是把非劳动者的人，透过申请与政府的承认\"视为劳动者\"的机制，规定在劳动者灾害补偿保险法第33条以下。\n\n对象依立场而分。公司的代表人所使用的，原则上是**中小事业主等**这个框。\n\n| 框 | 谁 | 依据 |\n|---|---|---|\n| 中小事业主等 | 符合规模要件之事业的事业主（法人则为代表人） | 劳灾保险法第33条第1号 |\n| 同上 | 从事该事业主所经营事业的人（董事、家族从事者等。属于劳动者者除外） | 同第33条第2号 |\n| 一人親方等（不雇用劳动者的个人业者） | 以不使用劳动者的方式，常态经营省令所定种类事业的人 | 同第33条第3号 |\n| 海外派遣者 | 由国内事业主为使其从事海外事业而派遣的人 | 同第33条第7号 |\n\n**\"中小\"的界线因业种而不同。**\n\n| 主要事业 | 经常使用的劳动者人数 |\n|---|---|\n| 金融业・保险业、不动产业、零售业 | **50人以下** |\n| 批发业、服务业 | **100人以下** |\n| 上述以外 | **300人以下** |\n\n（劳动者灾害补偿保险法施行规则第46条之16）\n\n计算方式有行政上的运作方式。有数个工厂或分店时，要把**各自的劳动者人数合计**，以企业为单位来看；业种的区分原则上依**日本标准产业分类**；即使不是全年雇用，只要**一年间有100日以上**使用劳动者，也会被当作\"经常使用\"。这些都记载于厚生劳动省〈特别加入制度指南（中小事业主等用）〉。\n\n## 没有员工的公司，为什么不能加入？\n\n因为条文是由两个要件构成的。\n\n| | 要件 | 依据 |\n|---|---|---|\n| ① | 就该事业**已成立劳灾保险的保险关系** | 劳灾保险法第34条第1项（\"依就该事业成立的保险关系\"） |\n| ② | 已将劳动保险事务的处理**委托**给**劳动保险事务组合** | 劳灾保险法第33条第1号 |\n\n会卡住的是①。劳灾保险的保险关系，是就**使用劳动者的事业**的事业主，于该事业开始之日成立（劳动保险保险费征收等相关法律第3条）。如果一名劳动者都没有，就不属于适用事业，也就不存在所成立的保险关系。特别加入是**搭载**在已成立的保险关系上的制度，因此在没有可搭载基础的状态下无法提出申请。\n\n基于同样的理由，**日后若劳动者不在了，特别加入者的地位也会消灭。** 厚生劳动省的指南也明确写着\"当此保险关系消灭时，特别加入者的地位亦于消灭之日消灭\"。解除②的委托时也是一样。\n\n**也就是说，雇用第一个人的那一天，才是社长本身受到保障的第一天。**\n\n不过，**并不是所有一人公司都不能加入。** 若是以不使用劳动者的方式，常态经营建设业等省令所定种类的事业，可能可以用**一人親方等**（第33条第3号）的身分加入。厚生劳动省的指南也说明，若一年间使用劳动者的日数未满100日、无法以中小事业主等的身分加入时，只要符合一人親方等的要件，就可以用该框加入。自己的事业属于哪一个框，不同时看业种与工作方式是无法确定的。\n\n## 要加入，该从什么开始着手？\n\n有雇用劳动者（或预定雇用）时，顺序如下。\n\n1. **就劳动者成立劳动保险的保险关系**（提出保険関係成立届，即保险关系成立申报书）\n2. **选定劳动保险事务组合，委托其处理劳动保险事务**\n3. 透过事务组合**提出特别加入的申请**，并取得政府的承认\n\n步骤2的事务组合，是由商工会、商工会议所、事业协同组合等取得厚生劳动大臣认可后营运的。**由于特别加入以委托事务组合为要件，因此没有\"不委托\"这个选项。** 也请先把另外产生的委托费用估算进去。\n\n如果公司刚成立、劳动保险的手续尚未办理，期限整理在[公司成立后，什么时候之前要提出什么](/zh/labor/column/kaisha-setsuritsu-shakaihoken-roudouhoken-kigen)。若要让员工前往海外，劳灾的处理会改变，请参阅[海外出差与海外派遣，在劳灾上完全不同](/zh/labor/column/kaigai-shucho-haken-rosai-chigai)。\n\n## 常见问题\n\n**Q. 有2位董事，两人都会到现场。两人都可以加入吗？**\nA. 在中小事业主等的特别加入中，除了事业主（法人则为代表人）之外，\"从事该事业主所经营事业的人\"也是对象（劳动者灾害补偿保险法第33条第2号）。代表人以外的董事，也可能成为此框的申请对象。不过承认是就每一件申请个别判断，因此要先整理实际的从事状况再办理手续。\n\n**Q. 员工只有1位工读生。这样保险关系也会成立吗？**\nA. 只要使用劳动者，不论工作时间或雇用形态如何，都会成为劳灾保险的适用事业。即使是工读生，保险关系也会成立。另外，劳灾保险与雇用保险不同，**每周未满20小时也适用**。这一点很容易混淆。\n\n**Q. 给付的金额是怎么决定的？**\nA. 特别加入者没有实际的工资，因此依事先申请并经承认的**给付基础日额**来决定给付金额（劳动者灾害补偿保险法第34条第1项第3号）。日额设定为多少，保险费与给付金额都会改变，所以必须在加入时决定。\n\n**Q. 只要加入了，任何受伤都会给付吗？**\nA. 不是。特别加入者的情况，对象是伴随**经承认为业务范围内的作业**而发生的事故。以事业主身分进行的经营工作，或私人行为过程中的事故，都不是对象。这个范围的界线应在加入时确认清楚，若只是加入而没有确认内容，真正需要时就会出现落差。咨询依[报酬额表](/zh/labor/ryokin)的费用受理。\n\n## 本文的依据\n\n- 劳动者灾害补偿保险法（昭和22年法律第50号）第3条第1项、第33条第1号・第2号・第3号・第7号、第34条第1项、第36条第1项\n- 劳动者灾害补偿保险法施行规则（昭和30年劳动省令第22号）第46条之16、第46条之17、第46条之19\n- 劳动保险保险费征收等相关法律（労働保険の保険料の徴収等に関する法律。昭和44年法律第84号）第3条、第33条第1项\n- 劳动保险保险费征收等相关法律施行规则（昭和47年劳动省令第8号）第62条第2项\n- 厚生劳动省〈特别加入制度指南（中小事业主等用）〉（特別加入制度のしおり（中小事業主等用））（经常使用的劳动者人数的计算方式、100日基准、保险关系消灭时的处理）\n- 上述条文均为2026年8月13日时点以e-Gov法令检索确认的现行条文。规则第46条之16的规模要件（50人・100人・300人），已确认自e-Gov可回溯的2017年4月1日施行版以后未曾变更\n- 业种区分依日本标准产业分类的运作方式，以及以企业为单位的合计，是依厚生劳动省与都道府县劳动局的公开资料确认。制定这些做法的通达原文尚未确认（**未经查证**）\n\n**本文并未决定到\"该找谁咨询\"为止。** 特别加入可否的研判、劳动保险的成立手续、委托事务组合的安排，是社会保险劳务士的业务。董事报酬与退职金的税务处理请找税理士，董事变更的登记请找司法书士，各自直接委托、另行签约。本事务所不收取介绍费。向四葉社会保険労務士事務所咨询时的费用列于[报酬额表](/zh/labor/ryokin)，常收到的问题整理于[常见问答](/zh/labor/faq)。\n\n本文为一般性的资讯提供。针对个别情况的判断，由具备资格者于面谈后进行。执笔者为[浦松丈二](/zh/about/uramatsu)（社会保险劳务士・行政书士・宅地建物取引士）。",
        "category": "劳动保险",
        "keywords": [
          "社长 劳灾 领不到",
          "劳灾保险 特别加入 中小事业主",
          "一人公司 劳灾 特别加入",
          "特别加入 劳动保险事务组合",
          "特别加入 业种 规模要件",
          "董事 劳灾 受伤"
        ],
        "tags": [
          "劳灾保险",
          "特别加入",
          "董事",
          "劳动保险事务组合",
          "中小企业"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社会保险劳务士・行政书士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "有2位董事，两人都会到现场。两人都可以加入吗？",
            "answer": "在中小事业主等的特别加入中，除了事业主（法人则为代表人）之外，\"从事该事业主所经营事业的人\"也是对象（劳动者灾害补偿保险法第33条第2号）。代表人以外的董事，也可能成为此框的申请对象。不过承认是就每一件申请个别判断，因此要先整理实际的从事状况再办理手续。"
          },
          {
            "question": "员工只有1位工读生。这样保险关系也会成立吗？",
            "answer": "只要使用劳动者，不论工作时间或雇用形态如何，都会成为劳灾保险的适用事业。即使是工读生，保险关系也会成立。另外，劳灾保险与雇用保险不同，每周未满20小时也适用。这一点很容易混淆。"
          },
          {
            "question": "给付的金额是怎么决定的？",
            "answer": "特别加入者没有实际的工资，因此依事先申请并经承认的给付基础日额来决定给付金额（劳动者灾害补偿保险法第34条第1项第3号）。日额设定为多少，保险费与给付金额都会改变，所以必须在加入时决定。"
          },
          {
            "question": "只要加入了，任何受伤都会给付吗？",
            "answer": "不是。特别加入者的情况，对象是伴随经承认为业务范围内的作业而发生的事故。以事业主身分进行的经营工作，或私人行为过程中的事故，都不是对象。这个范围的界线应在加入时确认清楚，若只是加入而没有确认内容，真正需要时就会出现落差。咨询依报酬额表的费用受理。"
          }
        ]
      }
    }
  },
  {
    "business": "labor",
    "slug": "kazoku-shain-koyohoken-yakuin-joseikin",
    "title": "家族を社員にするとき、つまずく3つのところ",
    "date": "2026-09-01",
    "category": "採用と雇用",
    "excerpt": "家族を社員にするときは、同居しているか、取締役にするか、助成金を考えているか——の3つを確かめてください。同居の親族は原則として雇用保険の被保険者になりませんが、要件を示せば被保険者として取り扱われます。立場ごとの雇用保険・社会保険の可否を表にしました。",
    "content": "**結論（先に要点）**：家族を社員にするときは、3つ確かめてください。**同居しているか**、**取締役にするか**、**助成金を考えているか**。この3つは、別々の制度が別々の理由で効いてくるもので、いずれも入社の日より前に決めておく必要があります。\n\n子や配偶者に会社を手伝ってもらう。同族会社では自然な話ですが、手続の側から見ると、他人を雇うのとは違う分岐がいくつも出てきます。しかも分岐の多くは、**入社してからでは戻せません**。\n\n## 同居している家族は、雇用保険に入れるのか？\n\n**原則は入りません。ただし、入る場合があります。** ここは「入れない」と断定できないところです。\n\n厚生労働省「雇用保険に関する業務取扱要領（適用関係）」は、個人事業の事業主と同居している親族について「**原則として被保険者としない**」としています。法人の代表者と同居している親族についても、形式は法人でも実質的には代表者の個人事業と同様と認められる場合——株式や出資の全部または大部分を代表者やその親族のみで保有し、取締役会や株主総会がほとんど開催されていないような場合——は、同様に原則として被保険者としない、とされています。\n\nそのうえで要領は、次の3つを満たすものは**被保険者として取り扱う**としています。\n\n| | 条件 |\n|---|---|\n| (ｲ) | 業務を行うにつき、**事業主の指揮命令に従っていることが明確**であること |\n| (ﾛ) | **就業の実態が他の労働者と同様**であり、賃金もこれに応じて支払われていること。特に始業・終業の時刻、休憩、休日、休暇と、賃金の決定・計算・支払の方法、締切りと支払の時期について、**就業規則その他これに準ずるものに定めるところにより**、その管理が他の労働者と同様になされていること |\n| (ﾊ) | 事業主と**利益を一にする地位（取締役等）にない**こと |\n\n(ﾛ)が実務の要です。**「就業規則その他これに準ずるもの」が求められている**ため、従業員10人未満で就業規則の作成義務がない会社でも、家族を雇用保険に入れたいのであれば、これに準ずる書面が必要になります。人数の義務の話は[就業規則は何人から義務か。義務でないものは何か](/labor/column/shugyokisoku-10nin-gimu-nani-ga-hitsuyo)にまとめました。\n\n手続の際は、要領の(ｲ)から(ﾊ)までの事項を記載した**事業主の証明書**、登記事項証明書、他の労働者の出勤簿などの提出が求められます。「実態がそうなっている」ことを、書類で示す作業になります。\n\nなお、**社会保険（健康保険・厚生年金保険）は考え方が違います。** 適用事業所に使用されていれば被保険者となるため、同居の親族であることを理由に外れることはありません。雇用保険とは別の判断です。\n\n## 取締役にすると、何が変わるのか？\n\n雇用保険から外れます。業務取扱要領は「**株式会社の取締役は、原則として、被保険者としない**」「**代表取締役は被保険者とならない**」としています。雇用保険法が被保険者を「適用事業に**雇用される労働者**」と定めているため（同法第4条第1項）、雇用される立場にない役員は対象外になる、という筋道です。\n\n例外は**使用人兼務役員**です。取締役でありながら同時に部長・支店長・工場長などの従業員としての身分を持つ場合、報酬の支払などから見て労働者的性格が強く、雇用関係があると認められるものに限って被保険者になります。ただしこの場合も、失業給付の算定の基礎となる賃金に**役員報酬は含まれません**。\n\n一方、社会保険は逆方向に働きます。取締役になると、労働者かどうかを問わず適用事業所に使用される者として被保険者になります。整理すると次のとおりです。\n\n| 立場 | 雇用保険 | 健康保険・厚生年金保険 |\n|---|---|---|\n| 使用人（同居していない親族） | 入る | 入る |\n| 使用人（同居の親族） | **原則入らない**。上記(ｲ)〜(ﾊ)を満たせば入る | 入る |\n| 使用人兼務役員 | 労働者的性格が強く雇用関係が認められる場合に限り入る | 入る |\n| 取締役 | **入らない** | 入る |\n| 代表取締役 | **入らない** | 入る |\n\n（社会保険は、いずれも所定労働時間などの適用要件を満たす場合です）\n\n役員にするかどうかは、報酬の決め方や責任の所在の話として検討されることが多いのですが、**雇用保険と、次に述べる助成金の両方に効いてきます。** 手続の側からも一度見ておいてください。\n\n## 家族の入社で、助成金は使えるのか？\n\n**多くの場合、使えません。** 二重の壁があります。\n\n**1つめは、いま見た雇用保険の壁です。** 雇用関係助成金は、雇用保険適用事業所の事業主であることを前提としており、対象となるのも雇用保険の被保険者です。同居の親族が原則として被保険者にならない以上、そもそも土俵に上がりません。\n\n**2つめは、助成金そのものの除外規定です。** キャリアアップ助成金の支給要領は、正社員化コースの対象労働者の要件として「**転換又は直接雇用を行った適用事業所の事業主又は取締役の3親等以内の親族**（民法第725条第1号に規定する血族のうち3親等以内の者、同条第2号に規定する配偶者及び同条第3号に規定する姻族をいう）**以外の者であること**」と定めています。\n\n**判定される期間まで決まっています。** 厚生労働省のQ&Aは、正社員化コースについて「**転換又は直接雇用日の前日から起算して6か月前の日を始期とし、支給申請時点まで**」としています。入社の直前に親族関係が変わっても、6か月さかのぼって見られるということです。\n\nこの除外は正社員化コースだけでなく、賃金規定等改定・共通化・賞与退職金・短時間労働者労働時間延長支援の各コースにも同趣旨で置かれています。**「家族だから使えないコースがある」ではなく、「キャリアアップ助成金は全体として家族を外している」と理解しておくほうが実態に近いです。**\n\nなお、この3親等以内の親族の除外は**キャリアアップ助成金固有の要件**です。雇用関係助成金に共通の要領には親族に関する規定がありません。他の助成金については、それぞれの要領を個別に確認する必要があります。取り扱っている助成金の範囲は[助成金の申請サポート](/labor/services/joseikin)をご覧ください。\n\n## いつまでに決めておけばいいのか？\n\n**入社の日より前です。** 3つとも、あとから変えることが難しいか、変えても遡らないためです。\n\n| 決めること | いつまでに | 遅れるとどうなるか |\n|---|---|---|\n| 同居か別居か（住民票上の世帯） | 入社前 | 実態が伴わない転居は、かえって説明が難しくなります |\n| 取締役にするかどうか | 入社前 | 就任後に外しても、雇用保険の被保険者資格が遡って生じるわけではありません |\n| 助成金を狙うかどうか | **転換等を実施する日の前日まで**（キャリアアップ計画の提出期限） | 計画を出していないと、要件を満たしていても不支給になります |\n\n3つめは特に注意が必要です。キャリアアップ助成金は、計画の提出が転換の実施より前でなければなりません。入り口の契約の形で額まで変わるので、[助成金を狙うなら、最初の契約形態で決まる](/labor/column/joseikin-yuki-muki-keiyaku-katachi)を先にお読みください。\n\n## よくある質問\n\n**Q. 別居している息子を雇う場合は、普通の従業員と同じですか？**\nA. 雇用保険については、同居していなければ「同居の親族」の取扱いには当たらず、通常の判断になります。ただしキャリアアップ助成金の3親等以内の親族の除外は**同居・別居を問いません**。雇用保険には入れるが助成金の対象にはならない、という組み合わせが生じます。\n\n**Q. 同居していますが、他の従業員とまったく同じ勤務です。雇用保険に入れますか？**\nA. 業務取扱要領の(ｲ)から(ﾊ)を満たすと示せれば、被保険者として取り扱われます。ただし「同じ勤務です」という説明だけでは足りず、就業規則またはこれに準ずるもの、出勤簿、賃金台帳といった書類で、他の労働者と同様に管理されていることを示す必要があります。最終的な判断はハローワークが行いますので、当方で「入れます」と保証することはできません。\n\n**Q. 妻を取締役にしていますが、実際は事務のパートに近い働き方です。雇用保険に入れませんか？**\nA. 使用人兼務役員として認められる余地はありますが、要領は「報酬支払等の面からみて労働者的性格の強い者であって、雇用関係があると認められるものに限り」としています。役員報酬と給与の区分、就業実態、他の従業員との比較といった材料を揃えたうえでの判断になります。なお認められた場合でも、失業給付の基礎となる賃金に役員報酬は含まれません。\n\n**Q. 3つとも当てはまってしまいました。どうすればいいですか？**\nA. 助成金を優先するのか、手続の簡便さを優先するのかで、選ぶ形が変わります。助成金を取りに行くなら、別居の親族を雇用保険に入れて、かつキャリアアップ助成金以外の制度を探す形になりますが、そこまでして合わせるだけの額かどうかは別の検討です。実際の金額と手間を並べてご相談いただくのが早いと思います。費用は[報酬額表](/labor/ryokin)をご覧ください。\n\n## この記事の根拠\n\n- 雇用保険法（昭和49年法律第116号）第4条第1項\n- 厚生労働省「雇用保険に関する業務取扱要領（適用関係）」20351（1）イ（取締役及び社員、監査役等）、同リ（同居の親族）。**通達ではなく業務取扱要領が出典です。** 要領は改訂が頻繁なため、参照は厚生労働省の掲載ページから最新版をご確認ください\n- 健康保険法（大正11年法律第70号）第3条第1項、厚生年金保険法（昭和29年法律第115号）第9条\n- キャリアアップ助成金支給要領 1003ニ（**令和8年4月8日付け**）。3親等以内の親族の定義は民法（明治29年法律第89号）第725条第1号・第2号・第3号\n- キャリアアップ助成金Q&A（**令和8年7月29日**）Q-8（判定される期間）\n- 雇用関係助成金に共通の支給要領（令和8年4月8日付け）0301\n- **助成金の支給要領・支給額は年度ごとに、また年度の途中でも改定されます。** 申請の際は、必ず厚生労働省の最新の支給要領でご確認ください\n- 条文はいずれも2026年8月13日時点でe-Gov法令検索により確認した現行条文です\n\n**この記事は、誰に相談するかまでは決めていません。** 同居の親族を被保険者として取り扱えるかの見立て、必要な書類の整え方、助成金の計画づくりは社会保険労務士の業務です。役員報酬の決め方や税務の扱いは税理士、役員変更の登記は司法書士へ、それぞれ直接ご依頼いただく形をご案内します。当事務所は紹介料を受け取りません。四葉社会保険労務士事務所にご相談いただく場合の費用は[報酬額表](/labor/ryokin)に、よくいただくご質問は[よくあるご質問](/labor/faq)にまとめています。\n\n本記事は一般的な情報提供です。個別のご事情に応じた判断は、面談のうえ資格者が行います。執筆は[浦松丈二](/about/uramatsu)（社会保険労務士・行政書士・宅地建物取引士）です。",
    "status": "published",
    "author": {
      "name": "浦松 丈二",
      "title": "社会保険労務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
    },
    "keywords": [
      "家族 従業員 雇用保険",
      "同居の親族 雇用保険 被保険者",
      "取締役 雇用保険 入れない",
      "family 助成金 3親等以内の親族",
      "同族会社 家族 社会保険",
      "使用人兼務役員 雇用保険"
    ],
    "tags": [
      "雇用保険",
      "同居の親族",
      "役員",
      "同族会社",
      "助成金"
    ],
    "locales": [],
    "faq": [
      {
        "question": "別居している息子を雇う場合は、普通の従業員と同じですか？",
        "answer": "雇用保険については、同居していなければ「同居の親族」の取扱いには当たらず、通常の判断になります。ただしキャリアアップ助成金の3親等以内の親族の除外は同居・別居を問いません。雇用保険には入れるが助成金の対象にはならない、という組み合わせが生じます。"
      },
      {
        "question": "同居していますが、他の従業員とまったく同じ勤務です。雇用保険に入れますか？",
        "answer": "業務取扱要領の(ｲ)から(ﾊ)を満たすと示せれば、被保険者として取り扱われます。ただし「同じ勤務です」という説明だけでは足りず、就業規則またはこれに準ずるもの、出勤簿、賃金台帳といった書類で、他の労働者と同様に管理されていることを示す必要があります。最終的な判断はハローワークが行いますので、当方で「入れます」と保証することはできません。"
      },
      {
        "question": "妻を取締役にしていますが、実際は事務のパートに近い働き方です。雇用保険に入れませんか？",
        "answer": "使用人兼務役員として認められる余地はありますが、要領は「報酬支払等の面からみて労働者的性格の強い者であって、雇用関係があると認められるものに限り」としています。役員報酬と給与の区分、就業実態、他の従業員との比較といった材料を揃えたうえでの判断になります。なお認められた場合でも、失業給付の基礎となる賃金に役員報酬は含まれません。"
      },
      {
        "question": "3つとも当てはまってしまいました。どうすればいいですか？",
        "answer": "助成金を優先するのか、手続の簡便さを優先するのかで、選ぶ形が変わります。助成金を取りに行くなら、別居の親族を雇用保険に入れて、かつキャリアアップ助成金以外の制度を探す形になりますが、そこまでして合わせるだけの額かどうかは別の検討です。実際の金額と手間を並べてご相談いただくのが早いと思います。費用は報酬額表をご覧ください。"
      }
    ],
    "translations": {
      "en": {
        "title": "Three things that trip you up when you put a family member on the payroll",
        "excerpt": "Before you put a family member on the payroll, check three things — whether they live in the same household, whether you will make them a director, and whether you are hoping to claim a subsidy. A relative living in the same household is as a rule not an insured person under employment insurance, but where the requirements can be shown to be met, they are treated as an insured person. A table sets out employment insurance and social insurance for each position.",
        "content": "**In short:** When you put a family member on the payroll, check three things. **Do they live in the same household?** **Will you make them a director?** **Are you hoping to claim a subsidy?** Each of the three is driven by a different scheme for a different reason, and all three have to be settled before the day the person joins.\n\nHaving a child or a spouse help out with the business is a natural thing to do in a family-held company. Seen from the procedural side, though, it opens up a number of forks in the road that do not arise when you hire an outsider — and most of those forks **cannot be reversed once the person has joined**.\n\n## Can a family member who lives in the same household be enrolled in employment insurance?\n\n**As a rule, no. But there are cases where they are.** This is not a point where you can flatly say \"they cannot be enrolled.\"\n\nThe Ministry of Health, Labour and Welfare's Administrative Handling Guidelines on Employment Insurance (Application) (雇用保険に関する業務取扱要領（適用関係）) provide, for a relative living in the same household as the proprietor of a sole proprietorship, that such a person is \"**as a rule not treated as an insured person**.\" The same is said of a relative living in the same household as the representative of a company: where the entity is a company in form but is recognised as being in substance no different from the representative's own sole proprietorship — for example, where all or the greater part of the shares or capital contributions are held only by the representative and their relatives, and board meetings and shareholders' meetings are hardly ever held — such a relative is likewise, as a rule, not treated as an insured person.\n\nOn that basis, the Guidelines go on to say that a person who satisfies the following three conditions **is treated as an insured person**.\n\n| | Condition |\n|---|---|\n| (ｲ) | It is **clear that the person follows the proprietor's directions and orders** in carrying out the work |\n| (ﾛ) | **The actual working arrangement is the same as that of the other workers**, and wages are paid accordingly. In particular, starting and finishing times, breaks, days off and leave, together with the method of determining, calculating and paying wages and the closing date and timing of payment, are managed in the same way as for the other workers, **in accordance with what is laid down in the rules of employment or an equivalent document** |\n| (ﾊ) | The person does **not hold a position that shares in the proprietor's profits (director or the like)** |\n\n(ﾛ) is the crux in practice. Because **\"the rules of employment or an equivalent document\" is required**, even a company with fewer than 10 employees — which has no obligation to draw up rules of employment — will need an equivalent written document if it wants to enrol a family member in employment insurance. The rules on the headcount threshold are collected in [How many employees before rules of employment become mandatory, and what is not mandatory](/en/labor/column/shugyokisoku-10nin-gimu-nani-ga-hitsuyo).\n\nWhen you file, you will be asked for **a certificate from the proprietor** setting out the matters in (ｲ) to (ﾊ) of the Guidelines, a certificate of registered matters, the attendance records of the other workers and the like. The work consists of showing on paper that this is in fact how things stand.\n\nNote that **social insurance (health insurance and employees' pension insurance) proceeds on a different logic.** A person employed at a covered workplace becomes an insured person, so being a relative in the same household is not in itself a reason to fall outside it. It is a judgement separate from employment insurance.\n\n## What changes if you make them a director?\n\nThey fall outside employment insurance. The Administrative Handling Guidelines state that \"**a director of a kabushiki kaisha is, as a rule, not treated as an insured person**\" and that \"**a representative director does not become an insured person**.\" The reasoning is that the Employment Insurance Act (雇用保険法, Act No. 116 of 1974) defines an insured person as \"**a worker employed** by a covered business\" (Article 4, paragraph 1 of that Act), so an officer who is not in the position of being employed falls outside the scope.\n\nThe exception is a **director who concurrently serves as an employee** (使用人兼務役員). Where a person is a director and at the same time holds employee status such as department manager, branch manager or plant manager, they become an insured person only where, judged from such matters as how remuneration is paid, their character as a worker is strong and an employment relationship is recognised. Even in that case, **director's remuneration is not included** in the wages that form the basis for calculating unemployment benefits.\n\nSocial insurance, by contrast, works in the opposite direction. Once a person becomes a director, they become an insured person as someone employed at a covered workplace, whether or not they are a worker. In summary:\n\n| Position | Employment insurance | Health insurance / employees' pension insurance |\n|---|---|---|\n| Employee (relative not living in the same household) | Covered | Covered |\n| Employee (relative living in the same household) | **As a rule not covered**. Covered where (ｲ) to (ﾊ) above are satisfied | Covered |\n| Director concurrently serving as an employee | Covered only where the character as a worker is strong and an employment relationship is recognised | Covered |\n| Director | **Not covered** | Covered |\n| Representative director | **Not covered** | Covered |\n\n(For social insurance, in each case where the coverage requirements such as prescribed working hours are met.)\n\nWhether to make someone an officer is usually discussed as a question of how remuneration is set and where responsibility lies, but **it feeds into both employment insurance and the subsidies discussed next.** It is worth looking at from the procedural side as well.\n\n## Can you use a subsidy when a family member joins?\n\n**In most cases, no.** There are two walls.\n\n**The first is the employment insurance wall we have just looked at.** Employment-related subsidies presuppose that the employer runs a workplace covered by employment insurance, and the people they cover are insured persons under employment insurance. Since a relative in the same household is as a rule not an insured person, you never get into the ring.\n\n**The second is the exclusion clause in the subsidy itself.** The payment guidelines for the Career Up Subsidy (キャリアアップ助成金) provide, as a requirement for eligible workers under the Regular Employee Conversion Course, that the worker must be \"**a person other than a relative within the third degree of kinship of the proprietor or a director of the covered workplace that carried out the conversion or the direct hiring** (meaning those within the third degree of kinship among the blood relatives provided for in Article 725, item 1 of the Civil Code, the spouse provided for in item 2 of that Article, and the relatives by marriage provided for in item 3 of that Article).\"\n\n**Even the period over which this is judged is fixed.** The Ministry of Health, Labour and Welfare's Q&A states, for the Regular Employee Conversion Course, that it runs \"**from the day 6 months before the day preceding the date of conversion or direct hiring, up to the time of the application for payment**.\" In other words, if the family relationship changes just before the person joins, it is still looked at 6 months back.\n\nThis exclusion is placed to the same effect not only in the Regular Employee Conversion Course but also in the courses for revision of wage rules, harmonisation of wage rules, bonuses and retirement allowances, and support for extending the working hours of part-time workers. **Rather than \"there are some courses a family member cannot use,\" it is closer to reality to understand that \"the Career Up Subsidy as a whole excludes family members.\"**\n\nNote that this exclusion of relatives within the third degree of kinship is **a requirement specific to the Career Up Subsidy**. The guidelines common to employment-related subsidies contain no provision on relatives. For other subsidies you have to check each set of guidelines individually. For the range of subsidies we handle, see [Support with subsidy applications](/en/labor/services/joseikin).\n\n## By when do these things have to be decided?\n\n**Before the day the person joins.** All three are either hard to change afterwards, or do not reach back even if you do change them.\n\n| What to decide | By when | What happens if you are late |\n|---|---|---|\n| Same household or not (the household on the residence record) | Before joining | A change of address not matched by the facts only makes the explanation harder |\n| Whether to make them a director | Before joining | Removing them after they have taken office does not retroactively create insured status under employment insurance |\n| Whether to go after a subsidy | **By the day before the day the conversion is carried out** (the deadline for submitting the Career Up Plan) | Without a plan on file, the subsidy is refused even where the requirements are met |\n\nThe third calls for particular care. With the Career Up Subsidy, the plan has to be submitted before the conversion is carried out. Because the form of the contract at the entrance changes even the amount, read [If you are going after a subsidy, it is decided by the form of the first contract](/en/labor/column/joseikin-yuki-muki-keiyaku-katachi) first.\n\n## Frequently asked questions\n\n**Q. If I hire my son, who lives separately, is he the same as an ordinary employee?**\nA. For employment insurance, if he does not live in the same household he does not fall under the treatment of \"a relative in the same household,\" and the ordinary judgement applies. However, the Career Up Subsidy's exclusion of relatives within the third degree of kinship **applies whether or not they live in the same household**. So you get the combination where the person can be enrolled in employment insurance but is not eligible for the subsidy.\n\n**Q. She lives in the same household, but her work is exactly the same as the other employees'. Can I enrol her in employment insurance?**\nA. If you can show that (ｲ) to (ﾊ) of the Administrative Handling Guidelines are satisfied, she is treated as an insured person. But saying \"the work is the same\" is not enough on its own: you need to show, with documents such as the rules of employment or an equivalent document, attendance records and the wage ledger, that she is managed in the same way as the other workers. The final judgement is made by Hello Work (the public employment security office), so we cannot guarantee that she \"can be enrolled.\"\n\n**Q. My wife is a director, but in practice her work is closer to part-time office work. Can she really not be enrolled in employment insurance?**\nA. There is room for her to be recognised as a director concurrently serving as an employee, but the Guidelines limit this to \"a person whose character as a worker is strong, judged from such matters as the payment of remuneration, and for whom an employment relationship is recognised.\" The judgement is made once the materials are assembled — the split between director's remuneration and salary, the actual working arrangement, and a comparison with the other employees. Note that even where it is recognised, director's remuneration is not included in the wages that form the basis for unemployment benefits.\n\n**Q. All three apply to us. What should we do?**\nA. The shape you choose depends on whether you prioritise the subsidy or the simplicity of the procedure. If you go after the subsidy, the shape is to enrol a relative who does not live in the same household in employment insurance and to look for a scheme other than the Career Up Subsidy — but whether the amount justifies going that far is a separate question. The quickest route is to talk it through with the actual figures and the actual effort side by side. For fees, see the [fee schedule](/en/labor/ryokin).\n\n## Sources for this article\n\n- Employment Insurance Act (雇用保険法, Act No. 116 of 1974), Article 4, paragraph 1\n- Ministry of Health, Labour and Welfare, \"Administrative Handling Guidelines on Employment Insurance (Application)\" (雇用保険に関する業務取扱要領（適用関係）), 20351 (1) イ (directors and employees, company auditors, etc.) and リ (relatives in the same household). **The source is the Administrative Handling Guidelines, not a circular (通達).** The Guidelines are revised frequently, so please check the latest version from the Ministry's own posting page\n- Health Insurance Act (健康保険法, Act No. 70 of 1922), Article 3, paragraph 1; Employees' Pension Insurance Act (厚生年金保険法, Act No. 115 of 1954), Article 9\n- Career Up Subsidy payment guidelines (キャリアアップ助成金支給要領) 1003ニ (**dated 8 April 2026 (Reiwa 8)**). The definition of relatives within the third degree of kinship is Article 725, items 1, 2 and 3 of the Civil Code (民法, Act No. 89 of 1896)\n- Career Up Subsidy Q&A (**29 July 2026 (Reiwa 8)**), Q-8 (the period judged)\n- Payment guidelines common to employment-related subsidies (dated 8 April 2026 (Reiwa 8)), 0301\n- **Subsidy payment guidelines and payment amounts are revised each fiscal year, and sometimes in the course of a fiscal year.** When you apply, always check against the Ministry of Health, Labour and Welfare's latest payment guidelines\n- All provisions are those in force as confirmed through e-Gov law search as of 13 August 2026\n\n**This article stops short of deciding who you should consult.** Forming a view on whether a relative in the same household can be treated as an insured person, putting the necessary documents in order, and drawing up a subsidy plan are the work of a Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant). For how director's remuneration is set and how it is treated for tax, and for registering a change of officers, we will point you to a tax accountant and a judicial scrivener respectively, each of whom you engage directly under a separate contract. We do not receive referral fees. Fees for consulting 四葉社会保険労務士事務所 are set out in the [fee schedule](/en/labor/ryokin), and the questions we are asked most often are collected in [frequently asked questions](/en/labor/faq).\n\nThis article is general information. A judgement on your particular circumstances is made by a qualified professional after a meeting. Written by [Joji Uramatsu](/en/about/uramatsu) (Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist).",
        "category": "Hiring and employment",
        "keywords": [
          "family member employee employment insurance",
          "relative in the same household employment insurance insured person",
          "director employment insurance not covered",
          "subsidy relatives within the third degree of kinship",
          "family-held company family social insurance",
          "director concurrently serving as an employee employment insurance"
        ],
        "tags": [
          "Employment insurance",
          "Relatives in the same household",
          "Officers",
          "Family-held company",
          "Subsidies"
        ],
        "author": {
          "name": "Joji Uramatsu",
          "title": "Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist — 四葉社会保険労務士事務所／四葉行政書士事務所"
        },
        "faq": [
          {
            "question": "If I hire my son, who lives separately, is he the same as an ordinary employee?",
            "answer": "For employment insurance, if he does not live in the same household he does not fall under the treatment of \"a relative in the same household,\" and the ordinary judgement applies. However, the Career Up Subsidy's exclusion of relatives within the third degree of kinship applies whether or not they live in the same household. So you get the combination where the person can be enrolled in employment insurance but is not eligible for the subsidy."
          },
          {
            "question": "She lives in the same household, but her work is exactly the same as the other employees'. Can I enrol her in employment insurance?",
            "answer": "If you can show that (ｲ) to (ﾊ) of the Administrative Handling Guidelines are satisfied, she is treated as an insured person. But saying \"the work is the same\" is not enough on its own: you need to show, with documents such as the rules of employment or an equivalent document, attendance records and the wage ledger, that she is managed in the same way as the other workers. The final judgement is made by Hello Work (the public employment security office), so we cannot guarantee that she \"can be enrolled.\""
          },
          {
            "question": "My wife is a director, but in practice her work is closer to part-time office work. Can she really not be enrolled in employment insurance?",
            "answer": "There is room for her to be recognised as a director concurrently serving as an employee, but the Guidelines limit this to \"a person whose character as a worker is strong, judged from such matters as the payment of remuneration, and for whom an employment relationship is recognised.\" The judgement is made once the materials are assembled — the split between director's remuneration and salary, the actual working arrangement, and a comparison with the other employees. Note that even where it is recognised, director's remuneration is not included in the wages that form the basis for unemployment benefits."
          },
          {
            "question": "All three apply to us. What should we do?",
            "answer": "The shape you choose depends on whether you prioritise the subsidy or the simplicity of the procedure. If you go after the subsidy, the shape is to enrol a relative who does not live in the same household in employment insurance and to look for a scheme other than the Career Up Subsidy — but whether the amount justifies going that far is a separate question. The quickest route is to talk it through with the actual figures and the actual effort side by side. For fees, see the fee schedule."
          }
        ]
      },
      "zh-tw": {
        "title": "讓家人成為員工時，容易卡住的3個地方",
        "excerpt": "讓家人成為員工時，請先確認3件事——是否同住、是否要讓他擔任董事、是否打算申請助成金。同住的親屬原則上不會成為雇用保險的被保險人，但只要能提出符合要件的證明，就會被當作被保險人處理。本文以表格整理了各種身分下雇用保險與社會保險的加保與否。",
        "content": "**結論（先講重點）**：讓家人成為員工時，請確認3件事。**是否同住**、**是否讓他擔任董事**、**是否打算申請助成金**。這3件事分別由不同的制度、基於不同的理由發生作用，而且都必須在到職日之前先決定好。\n\n讓子女或配偶來幫忙公司的事務。在同族公司裡這是很自然的事，但從手續的角度來看，會出現好幾個與雇用外人時不同的分歧。而且多數的分歧，**在到職之後就回不去了**。\n\n## 同住的家人，可以加入雇用保險嗎？\n\n**原則上不加入。但也有加入的情形。** 這裡並不能斷定說「不能加入」。\n\n厚生勞動省「雇用保險相關業務處理要領（適用關係）」（雇用保険に関する業務取扱要領（適用関係））對於與個人事業之事業主同住的親屬，規定「**原則上不作為被保險人**」。至於與法人代表人同住的親屬，若形式上雖為法人、但被認定實質上與代表人的個人事業相同——例如股份或出資的全部或大部分僅由代表人及其親屬持有，董事會或股東會幾乎未曾召開的情形——同樣原則上不作為被保險人。\n\n在此前提之下，要領又規定，滿足下列3項者**作為被保險人處理**。\n\n| | 條件 |\n|---|---|\n| (ｲ) | 執行業務時，**明確遵從事業主的指揮命令** |\n| (ﾛ) | **實際的工作狀態與其他勞工相同**，且工資也依此支付。特別是上下班時刻、休息、休假日、休假，以及工資的決定、計算、支付方法與結算截止日、支付時期，**依就業規則或準此之文件所定**，其管理與其他勞工相同 |\n| (ﾊ) | 不處於與事業主**利益一致之地位（董事等）** |\n\n(ﾛ)是實務上的關鍵。**因為要求「就業規則或準此之文件」**，即使是員工未滿10人、沒有製作就業規則義務的公司，只要想讓家人加入雇用保險，就需要準此的書面文件。關於人數的義務，整理在[就業規則從幾人開始是義務。不是義務的又是什麼](/zh-tw/labor/column/shugyokisoku-10nin-gimu-nani-ga-hitsuyo)。\n\n辦理手續時，會被要求提出記載要領(ｲ)至(ﾊ)各事項的**事業主證明書**、登記事項證明書、其他勞工的出勤簿等。這是一項以文件證明「實際狀態確實如此」的作業。\n\n另外，**社會保險（健康保險・厚生年金保險）的思路不同。** 只要受雇於適用事業所就會成為被保險人，因此不會因為是同住的親屬而被排除在外。這與雇用保險是不同的判斷。\n\n## 讓他擔任董事，會有什麼改變？\n\n會脫離雇用保險。業務處理要領規定「**股份有限公司的董事，原則上不作為被保險人**」「**代表董事不成為被保險人**」。因為雇用保險法（雇用保険法，昭和49年〈1974年〉法律第116號）將被保險人定義為「受雇於適用事業之**勞工**」（同法第4條第1項），所以不處於受雇地位的董監事不在對象之內。\n\n例外是**使用人兼務董事**（使用人兼務役員，兼具員工身分的董事）。身為董事同時具有經理、分店長、廠長等員工身分的情形，僅限於從報酬的支付等方面來看勞工性格較強、被認定存在雇用關係者，才會成為被保險人。不過即使在這種情形，作為失業給付計算基礎的工資中，**也不包含董事報酬**。\n\n另一方面，社會保險則往相反的方向作用。一旦成為董事，不問是否為勞工，都會作為受雇於適用事業所之人而成為被保險人。整理如下。\n\n| 身分 | 雇用保險 | 健康保險・厚生年金保險 |\n|---|---|---|\n| 員工（未同住的親屬） | 加入 | 加入 |\n| 員工（同住的親屬） | **原則上不加入**。滿足上述(ｲ)〜(ﾊ)則加入 | 加入 |\n| 使用人兼務董事 | 僅限勞工性格較強、被認定存在雇用關係時加入 | 加入 |\n| 董事 | **不加入** | 加入 |\n| 代表董事 | **不加入** | 加入 |\n\n（社會保險均以滿足約定工作時間等適用要件為前提）\n\n要不要讓他擔任董監事，多半被當成報酬的決定方式或責任歸屬的問題來討論，但**這件事對雇用保險、以及接下來要談的助成金都會發生作用。** 也請從手續的角度看過一次。\n\n## 家人到職，可以使用助成金嗎？\n\n**多數情形下不能使用。** 有雙重的牆。\n\n**第一道，就是剛才看到的雇用保險這道牆。** 雇用關係助成金以事業主為雇用保險適用事業所之事業主為前提，其對象也是雇用保險的被保險人。既然同住的親屬原則上不會成為被保險人，一開始就上不了場。\n\n**第二道，是助成金本身的排除規定。** Career Up助成金（キャリアアップ助成金）的支給要領，就正職化課程（正社員化コース）的對象勞工要件規定：必須是「**實施轉換或直接雇用之適用事業所的事業主或董事的三親等以內親屬**（指民法第725條第1號所定血親中三親等以內者、同條第2號所定配偶、及同條第3號所定姻親）**以外之人**」。\n\n**連判定的期間都有規定。** 厚生勞動省的Q&A就正職化課程指出：「**以轉換或直接雇用日之前一日起算6個月前之日為始期，至支給申請時點為止**」。也就是說，即使在到職前夕變更親屬關係，仍會回溯6個月來看。\n\n這項排除不只放在正職化課程，也以相同意旨放在工資規定等修訂、共通化、獎金退職金、部分工時勞工工作時間延長支援等各課程。**與其說「有些課程因為是家人所以不能用」，不如理解為「Career Up助成金整體上把家人排除在外」，更接近實際情況。**\n\n另外，這項三親等以內親屬的排除是**Career Up助成金特有的要件**。雇用關係助成金共通的要領中沒有關於親屬的規定。其他助成金必須各自確認其要領。本所承辦的助成金範圍請見[助成金的申請支援](/zh-tw/labor/services/joseikin)。\n\n## 應該在什麼時候之前決定？\n\n**在到職日之前。** 因為這3件事要不是事後難以變更，就是變更了也不會回溯。\n\n| 要決定的事 | 期限 | 太晚會怎麼樣 |\n|---|---|---|\n| 同住或分開住（住民票上的世帶） | 到職前 | 沒有實際狀態相伴的遷居，反而更難說明 |\n| 是否讓他擔任董事 | 到職前 | 就任後即使卸任，雇用保險的被保險人資格也不會回溯發生 |\n| 是否要爭取助成金 | **實施轉換等之日的前一日為止**（Career Up計畫的提出期限） | 沒有提出計畫的話，即使滿足要件也會不予支給 |\n\n第三項特別需要注意。Career Up助成金的計畫，必須在轉換實施之前提出。入口的契約形式連金額都會改變，所以請先閱讀[要爭取助成金，最初的契約形式就決定了一切](/zh-tw/labor/column/joseikin-yuki-muki-keiyaku-katachi)。\n\n## 常見問題\n\n**Q. 雇用分開住的兒子時，和一般員工一樣嗎？**\nA. 就雇用保險而言，只要沒有同住，就不屬於「同住的親屬」的處理，而是依一般的判斷。不過Career Up助成金的三親等以內親屬排除，**不問同住或分開住**。因此會出現「可以加入雇用保險，但不是助成金的對象」這樣的組合。\n\n**Q. 雖然同住，但工作方式與其他員工完全相同。可以加入雇用保險嗎？**\nA. 若能證明滿足業務處理要領的(ｲ)至(ﾊ)，就會被當作被保險人處理。不過僅說明「工作方式相同」並不足夠，必須以就業規則或準此之文件、出勤簿、工資台帳等文件，證明其管理方式與其他勞工相同。最終判斷由 Hello Work（公共職業安定所）作成，本所無法保證「可以加入」。\n\n**Q. 我讓太太擔任董事，但實際上比較接近事務性的兼職工作。不能加入雇用保險嗎？**\nA. 有被認定為使用人兼務董事的空間，但要領規定「僅限從報酬支付等方面來看勞工性格較強，且被認定存在雇用關係者」。必須備齊董事報酬與薪資的區分、實際的工作狀態、與其他員工的比較等材料之後才能判斷。另外即使被認定，作為失業給付基礎的工資中也不包含董事報酬。\n\n**Q. 3項全都符合了。該怎麼辦？**\nA. 要優先助成金，還是優先手續的簡便，選擇的形式會不同。若要爭取助成金，就會變成讓沒有同住的親屬加入雇用保險，並尋找Career Up助成金以外的制度；但為此配合到這種程度是否值得那個金額，則是另一個層次的檢討。把實際的金額與工夫並列出來一起商量，應該是最快的方式。費用請見[報酬額表](/zh-tw/labor/ryokin)。\n\n## 本文的依據\n\n- 雇用保險法（雇用保険法，昭和49年〈1974年〉法律第116號）第4條第1項\n- 厚生勞動省「雇用保險相關業務處理要領（適用關係）」20351（1）イ（董事及員工、監察人等）、同リ（同住的親屬）。**出處是業務處理要領，而不是通達。** 要領修訂頻繁，請從厚生勞動省的刊載頁面確認最新版本\n- 健康保險法（健康保険法，大正11年〈1922年〉法律第70號）第3條第1項、厚生年金保險法（厚生年金保険法，昭和29年〈1954年〉法律第115號）第9條\n- Career Up助成金支給要領 1003ニ（**令和8年〈2026年〉4月8日**）。三親等以內親屬的定義為民法（明治29年〈1896年〉法律第89號）第725條第1號・第2號・第3號\n- Career Up助成金Q&A（**令和8年〈2026年〉7月29日**）Q-8（判定的期間）\n- 雇用關係助成金共通的支給要領（令和8年〈2026年〉4月8日）0301\n- **助成金的支給要領與支給金額每年度都會修訂，年度中途也可能修訂。** 申請時請務必以厚生勞動省最新的支給要領確認\n- 條文均為2026年8月13日時點以e-Gov法令檢索確認的現行條文\n\n**本文並未決定到「該找誰商量」為止。** 同住的親屬能否作為被保險人處理的判斷、必要文件的整備、助成金計畫的擬定，是社會保險勞務士的業務。董事報酬的決定方式與稅務上的處理請找稅理士，董監事變更的登記請找司法書士，**分別直接委任、另行簽約**。本所不收取介紹費。向四葉社会保険労務士事務所諮詢時的費用請見[報酬額表](/zh-tw/labor/ryokin)，常收到的提問則整理在[常見問答](/zh-tw/labor/faq)。\n\n本文為一般性的資訊提供。針對個別情況的判斷，由具備資格者於面談後作成。撰文者為[浦松丈二](/zh-tw/about/uramatsu)（社會保險勞務士・行政書士・宅地建物取引士）。",
        "category": "招募與雇用",
        "keywords": [
          "家人 員工 雇用保險",
          "同住的親屬 雇用保險 被保險人",
          "董事 雇用保險 無法加保",
          "助成金 三親等以內的親屬",
          "同族公司 家人 社會保險",
          "使用人兼務董事 雇用保險"
        ],
        "tags": [
          "雇用保險",
          "同住的親屬",
          "董事",
          "同族公司",
          "助成金"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社會保險勞務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "雇用分開住的兒子時，和一般員工一樣嗎？",
            "answer": "就雇用保險而言，只要沒有同住，就不屬於「同住的親屬」的處理，而是依一般的判斷。不過Career Up助成金的三親等以內親屬排除，不問同住或分開住。因此會出現「可以加入雇用保險，但不是助成金的對象」這樣的組合。"
          },
          {
            "question": "雖然同住，但工作方式與其他員工完全相同。可以加入雇用保險嗎？",
            "answer": "若能證明滿足業務處理要領的(ｲ)至(ﾊ)，就會被當作被保險人處理。不過僅說明「工作方式相同」並不足夠，必須以就業規則或準此之文件、出勤簿、工資台帳等文件，證明其管理方式與其他勞工相同。最終判斷由 Hello Work（公共職業安定所）作成，本所無法保證「可以加入」。"
          },
          {
            "question": "我讓太太擔任董事，但實際上比較接近事務性的兼職工作。不能加入雇用保險嗎？",
            "answer": "有被認定為使用人兼務董事的空間，但要領規定「僅限從報酬支付等方面來看勞工性格較強，且被認定存在雇用關係者」。必須備齊董事報酬與薪資的區分、實際的工作狀態、與其他員工的比較等材料之後才能判斷。另外即使被認定，作為失業給付基礎的工資中也不包含董事報酬。"
          },
          {
            "question": "3項全都符合了。該怎麼辦？",
            "answer": "要優先助成金，還是優先手續的簡便，選擇的形式會不同。若要爭取助成金，就會變成讓沒有同住的親屬加入雇用保險，並尋找Career Up助成金以外的制度；但為此配合到這種程度是否值得那個金額，則是另一個層次的檢討。把實際的金額與工夫並列出來一起商量，應該是最快的方式。費用請見報酬額表。"
          }
        ]
      },
      "zh": {
        "title": "让家人成为员工时，容易卡住的3个地方",
        "excerpt": "让家人成为员工时，请先确认3件事——是否同住、是否要让他担任董事、是否打算申请助成金。同住的亲属原则上不会成为雇用保险的被保险人，但只要能提出符合要件的证明，就会被当作被保险人处理。本文以表格整理了各种身份下雇用保险与社会保险的加保与否。",
        "content": "**结论（先讲重点）**：让家人成为员工时，请确认3件事。**是否同住**、**是否让他担任董事**、**是否打算申请助成金**。这3件事分别由不同的制度、基于不同的理由发生作用，而且都必须在到职日之前先定下来。\n\n让子女或配偶来帮忙公司的事务。在同族公司里这是很自然的事，但从手续的角度看，会出现好几个与雇用外人时不同的分歧。而且多数分歧，**在到职之后就回不去了**。\n\n## 同住的家人，可以加入雇用保险吗？\n\n**原则上不加入。但也有加入的情形。** 这里并不能断定说「不能加入」。\n\n厚生劳动省「雇用保险相关业务处理要领（适用关系）」（雇用保険に関する業務取扱要領（適用関係））对于与个人事业之事业主同住的亲属，规定「**原则上不作为被保险人**」。至于与法人代表人同住的亲属，若形式上虽为法人、但被认定实质上与代表人的个人事业相同——例如股份或出资的全部或大部分仅由代表人及其亲属持有，董事会或股东会几乎未曾召开的情形——同样原则上不作为被保险人。\n\n在此前提之下，要领又规定，满足下列3项者**作为被保险人处理**。\n\n| | 条件 |\n|---|---|\n| (ｲ) | 执行业务时，**明确遵从事业主的指挥命令** |\n| (ﾛ) | **实际的工作状态与其他劳动者相同**，且工资也据此支付。特别是上下班时刻、休息、休息日、休假，以及工资的决定、计算、支付方法与结算截止日、支付时期，**依就业规则或准此之文件所定**，其管理与其他劳动者相同 |\n| (ﾊ) | 不处于与事业主**利益一致之地位（董事等）** |\n\n(ﾛ)是实务上的关键。**因为要求「就业规则或准此之文件」**，即使是员工不满10人、没有制作就业规则义务的公司，只要想让家人加入雇用保险，就需要准此的书面文件。关于人数的义务，整理在[就业规则从几人开始是义务。不是义务的又是什么](/zh/labor/column/shugyokisoku-10nin-gimu-nani-ga-hitsuyo)。\n\n办理手续时，会被要求提交记载要领(ｲ)至(ﾊ)各事项的**事业主证明书**、登记事项证明书、其他劳动者的出勤簿等。这是一项以文件证明「实际状态确实如此」的作业。\n\n另外，**社会保险（健康保险・厚生年金保险）的思路不同。** 只要受雇于适用事业所就会成为被保险人，因此不会因为是同住的亲属而被排除在外。这与雇用保险是不同的判断。\n\n## 让他担任董事，会有什么改变？\n\n会脱离雇用保险。业务处理要领规定「**股份有限公司的董事，原则上不作为被保险人**」「**代表董事不成为被保险人**」。因为雇用保险法（雇用保険法，昭和49年〈1974年〉法律第116号）将被保险人定义为「受雇于适用事业之**劳动者**」（同法第4条第1项），所以不处于受雇地位的董事、监事不在对象之内。\n\n例外是**使用人兼务董事**（使用人兼務役員，兼具员工身份的董事）。身为董事同时具有部长、分店长、厂长等员工身份的情形，仅限于从报酬的支付等方面看劳动者性格较强、被认定存在雇用关系者，才会成为被保险人。不过即使在这种情形，作为失业给付计算基础的工资中，**也不包含董事报酬**。\n\n另一方面，社会保险则朝相反的方向作用。一旦成为董事，不问是否为劳动者，都会作为受雇于适用事业所之人而成为被保险人。整理如下。\n\n| 身份 | 雇用保险 | 健康保险・厚生年金保险 |\n|---|---|---|\n| 员工（未同住的亲属） | 加入 | 加入 |\n| 员工（同住的亲属） | **原则上不加入**。满足上述(ｲ)〜(ﾊ)则加入 | 加入 |\n| 使用人兼务董事 | 仅限劳动者性格较强、被认定存在雇用关系时加入 | 加入 |\n| 董事 | **不加入** | 加入 |\n| 代表董事 | **不加入** | 加入 |\n\n（社会保险均以满足约定工作时间等适用要件为前提）\n\n要不要让他担任董事、监事，多半被当成报酬的决定方式或责任归属的问题来讨论，但**这件事对雇用保险、以及接下来要谈的助成金都会发生作用。** 也请从手续的角度看过一次。\n\n## 家人到职，可以使用助成金吗？\n\n**多数情形下不能使用。** 有双重的墙。\n\n**第一道，就是刚才看到的雇用保险这道墙。** 雇用关系助成金以事业主为雇用保险适用事业所之事业主为前提，其对象也是雇用保险的被保险人。既然同住的亲属原则上不会成为被保险人，一开始就上不了场。\n\n**第二道，是助成金本身的排除规定。** Career Up助成金（キャリアアップ助成金）的支给要领，就正式员工化课程（正社員化コース）的对象劳动者要件规定：必须是「**实施转换或直接雇用之适用事业所的事业主或董事的三亲等以内亲属**（指民法第725条第1号所定血亲中三亲等以内者、同条第2号所定配偶、及同条第3号所定姻亲）**以外之人**」。\n\n**连判定的期间都有规定。** 厚生劳动省的Q&A就正式员工化课程指出：「**以转换或直接雇用日之前一日起算6个月前之日为始期，至支给申请时点为止**」。也就是说，即使在到职前夕变更亲属关系，仍会回溯6个月来看。\n\n这项排除不只放在正式员工化课程，也以相同意旨放在工资规定等修订、共通化、奖金退职金、短时间劳动者工作时间延长支援等各课程。**与其说「有些课程因为是家人所以不能用」，不如理解为「Career Up助成金整体上把家人排除在外」，更接近实际情况。**\n\n另外，这项三亲等以内亲属的排除是**Career Up助成金特有的要件**。雇用关系助成金共通的要领中没有关于亲属的规定。其他助成金必须各自确认其要领。本所承办的助成金范围请见[助成金的申请支援](/zh/labor/services/joseikin)。\n\n## 应该在什么时候之前定下来？\n\n**在到职日之前。** 因为这3件事要么事后难以变更，要么变更了也不会回溯。\n\n| 要决定的事 | 期限 | 太晚会怎么样 |\n|---|---|---|\n| 同住或分开住（住民票上的世带） | 到职前 | 没有实际状态相伴的迁居，反而更难说明 |\n| 是否让他担任董事 | 到职前 | 就任后即使卸任，雇用保险的被保险人资格也不会回溯发生 |\n| 是否要争取助成金 | **实施转换等之日的前一日为止**（Career Up计划的提出期限） | 没有提出计划的话，即使满足要件也会不予支给 |\n\n第三项特别需要注意。Career Up助成金的计划，必须在转换实施之前提出。入口的合同形式连金额都会改变，所以请先阅读[要争取助成金，最初的合同形式就决定了一切](/zh/labor/column/joseikin-yuki-muki-keiyaku-katachi)。\n\n## 常见问题\n\n**Q. 雇用分开住的儿子时，和一般员工一样吗？**\nA. 就雇用保险而言，只要没有同住，就不属于「同住的亲属」的处理，而是按一般的判断。不过Career Up助成金的三亲等以内亲属排除，**不问同住或分开住**。因此会出现「可以加入雇用保险，但不是助成金的对象」这样的组合。\n\n**Q. 虽然同住，但工作方式与其他员工完全相同。可以加入雇用保险吗？**\nA. 若能证明满足业务处理要领的(ｲ)至(ﾊ)，就会被当作被保险人处理。不过仅说明「工作方式相同」并不足够，必须以就业规则或准此之文件、出勤簿、工资台账等文件，证明其管理方式与其他劳动者相同。最终判断由 Hello Work（公共职业安定所）作出，本所无法保证「可以加入」。\n\n**Q. 我让太太担任董事，但实际上比较接近事务性的兼职工作。不能加入雇用保险吗？**\nA. 有被认定为使用人兼务董事的余地，但要领规定「仅限从报酬支付等方面看劳动者性格较强，且被认定存在雇用关系者」。必须备齐董事报酬与工资的区分、实际的工作状态、与其他员工的比较等材料之后才能判断。另外即使被认定，作为失业给付基础的工资中也不包含董事报酬。\n\n**Q. 3项全都符合了。该怎么办？**\nA. 要优先助成金，还是优先手续的简便，选择的形式会不同。若要争取助成金，就会变成让没有同住的亲属加入雇用保险，并寻找Career Up助成金以外的制度；但为此配合到这种程度是否值得那个金额，则是另一个层次的检讨。把实际的金额与工夫并列出来一起商量，应该是最快的方式。费用请见[报酬额表](/zh/labor/ryokin)。\n\n## 本文的依据\n\n- 雇用保险法（雇用保険法，昭和49年〈1974年〉法律第116号）第4条第1项\n- 厚生劳动省「雇用保险相关业务处理要领（适用关系）」20351（1）イ（董事及员工、监事等）、同リ（同住的亲属）。**出处是业务处理要领，而不是通达。** 要领修订频繁，请从厚生劳动省的刊载页面确认最新版本\n- 健康保险法（健康保険法，大正11年〈1922年〉法律第70号）第3条第1项、厚生年金保险法（厚生年金保険法，昭和29年〈1954年〉法律第115号）第9条\n- Career Up助成金支给要领 1003ニ（**令和8年〈2026年〉4月8日**）。三亲等以内亲属的定义为民法（明治29年〈1896年〉法律第89号）第725条第1号・第2号・第3号\n- Career Up助成金Q&A（**令和8年〈2026年〉7月29日**）Q-8（判定的期间）\n- 雇用关系助成金共通的支给要领（令和8年〈2026年〉4月8日）0301\n- **助成金的支给要领与支给金额每年度都会修订，年度中途也可能修订。** 申请时请务必以厚生劳动省最新的支给要领确认\n- 条文均为2026年8月13日时点以e-Gov法令检索确认的现行条文\n\n**本文并未决定到「该找谁商量」为止。** 同住的亲属能否作为被保险人处理的判断、必要文件的整备、助成金计划的拟定，是社会保险劳务士的业务。董事报酬的决定方式与税务上的处理请找税理士，董事、监事变更的登记请找司法书士，**分别直接委任、另行签约**。本所不收取介绍费。向四葉社会保険労務士事務所咨询时的费用请见[报酬额表](/zh/labor/ryokin)，常收到的提问则整理在[常见问答](/zh/labor/faq)。\n\n本文为一般性的信息提供。针对个别情况的判断，由具备资格者于面谈后作出。撰文者为[浦松丈二](/zh/about/uramatsu)（社会保险劳务士・行政书士・宅地建物取引士）。",
        "category": "招聘与雇用",
        "keywords": [
          "家人 员工 雇用保险",
          "同住的亲属 雇用保险 被保险人",
          "董事 雇用保险 无法加保",
          "助成金 三亲等以内的亲属",
          "同族公司 家人 社会保险",
          "使用人兼务董事 雇用保险"
        ],
        "tags": [
          "雇用保险",
          "同住的亲属",
          "董事",
          "同族公司",
          "助成金"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社会保险劳务士・行政书士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "雇用分开住的儿子时，和一般员工一样吗？",
            "answer": "就雇用保险而言，只要没有同住，就不属于「同住的亲属」的处理，而是按一般的判断。不过Career Up助成金的三亲等以内亲属排除，不问同住或分开住。因此会出现「可以加入雇用保险，但不是助成金的对象」这样的组合。"
          },
          {
            "question": "虽然同住，但工作方式与其他员工完全相同。可以加入雇用保险吗？",
            "answer": "若能证明满足业务处理要领的(ｲ)至(ﾊ)，就会被当作被保险人处理。不过仅说明「工作方式相同」并不足够，必须以就业规则或准此之文件、出勤簿、工资台账等文件，证明其管理方式与其他劳动者相同。最终判断由 Hello Work（公共职业安定所）作出，本所无法保证「可以加入」。"
          },
          {
            "question": "我让太太担任董事，但实际上比较接近事务性的兼职工作。不能加入雇用保险吗？",
            "answer": "有被认定为使用人兼务董事的余地，但要领规定「仅限从报酬支付等方面看劳动者性格较强，且被认定存在雇用关系者」。必须备齐董事报酬与工资的区分、实际的工作状态、与其他员工的比较等材料之后才能判断。另外即使被认定，作为失业给付基础的工资中也不包含董事报酬。"
          },
          {
            "question": "3项全都符合了。该怎么办？",
            "answer": "要优先助成金，还是优先手续的简便，选择的形式会不同。若要争取助成金，就会变成让没有同住的亲属加入雇用保险，并寻找Career Up助成金以外的制度；但为此配合到这种程度是否值得那个金额，则是另一个层次的检讨。把实际的金额与工夫并列出来一起商量，应该是最快的方式。费用请见报酬额表。"
          }
        ]
      }
    }
  },
  {
    "business": "labor",
    "slug": "tanjikan-koyo-shakaihoken-4bunno3",
    "title": "短い時間で雇うと、社会保険はどうなるか",
    "date": "2026-09-01",
    "category": "社会保険",
    "excerpt": "従業員51人未満の会社では、社会保険に入るかどうかは4分の3基準だけで決まります。1週の所定労働時間と1月の所定労働日数の両方が通常の労働者の4分の3未満なら入りません。雇用保険は週20時間が分かれ目です。企業規模要件が2035年10月までに撤廃される日程も表にしました。",
    "content": "**結論（先に要点）**：従業員51人未満の会社では、社会保険に入るかどうかは「**4分の3基準**」だけで決まります。1週の所定労働時間と1月の所定労働日数の**両方**が通常の労働者の4分の3未満なら入りません。雇用保険は別で、**週20時間以上**が分かれ目です。\n\nパートを雇うときに「何時間までなら保険に入らずに済むか」というご質問をよくいただきます。答えは会社の規模で変わり、しかも**これから10年かけて変わり続けます**。いま決めた基準が、数年後にはそのまま使えなくなるという性格の話です。\n\n## 何時間から社会保険に入るのか？\n\n健康保険と厚生年金保険には、短時間労働者を被保険者から外す規定があります（健康保険法第3条第1項第9号、厚生年金保険法第12条第5号）。ここで使われるのが4分の3基準です。\n\n**通常の労働者が週40時間・月20日の会社なら、週30時間・月15日が境目**になります。両方とも4分の3未満なら被保険者になりません。片方でも4分の3以上なら被保険者です。\n\nこの4分の3基準だけで決まるのは、**特定適用事業所ではない会社**、つまり厚生年金保険の被保険者が常時50人以下の会社です。根拠は、平成24年法律第62号の附則第17条第1項（厚生年金保険）と附則第46条第1項（健康保険）で、「当分の間、特定適用事業所以外の適用事業所に使用される特定4分の3未満短時間労働者については…被保険者としない」と定められています。\n\n被保険者が**常時50人を超える**会社では、4分の3未満でも、次のすべてに当たれば被保険者になります。\n\n| | 要件 |\n|---|---|\n| ① | 1週の所定労働時間が**20時間以上** |\n| ② | 所定内賃金が**月額8.8万円以上** |\n| ③ | **学生でない**こと |\n\n②については、あとで述べるとおり撤廃が予定されています。\n\n## 雇用保険は、社会保険と同じ基準なのか？\n\n違います。**雇用保険は週20時間**です。雇用保険法は「1週間の所定労働時間が20時間未満である者」を適用除外としています（同法第6条第1号）。\n\n労災保険はさらに別で、**時間の要件がありません**。労働者を1人でも使えば適用事業になり、週1時間でも対象です。3つを並べると次のようになります。\n\n| 1週の所定労働時間 | 労災保険 | 雇用保険 | 健康保険・厚生年金保険（51人未満の会社） |\n|---|---|---|---|\n| 20時間未満 | 入る | 入らない | 入らない |\n| 20時間以上30時間未満 | 入る | **入る** | 入らない |\n| 30時間以上 | 入る | 入る | **入る**（週40時間の会社の場合） |\n\n**20時間から30時間の帯が、いちばん誤解されます。** 雇用保険には入るが社会保険には入らない、という状態です。「保険に入っていないはず」と思っていた方が離職票を求めてきて、そこで初めて気づく、ということが起こります。\n\nなお、社会保険の欄の「30時間以上」は、通常の労働者が週40時間の会社での話です。**通常の労働者の所定労働時間が短い会社では、境目も下がります。** 週35時間の会社なら26.25時間です。自社の就業規則の所定労働時間から計算してください。\n\n## 「106万円の壁」は、どこへ行ったのか？\n\n**なくなる方向で動いています。** 上に挙げた②の賃金要件（月額8.8万円以上。年収に直すと約106万円）が、いわゆる「106万円の壁」の正体でした。\n\n厚生労働省は、この賃金要件を**令和8年（2026年）10月に撤廃する予定**としています。理由は、**全都道府県の令和7年度地域別最低賃金が時給1,016円を超えた**ことです。時給1,016円で週20時間働けば月額8.8万円に届くため、①の時間要件を満たせば②は自動的に満たされる。だから要件として意味をなさなくなった、という整理です。\n\n**ただし「予定」です。** 令和7年法律第74号は撤廃の時期を「公布から3年以内の政令で定める日」としており、その施行期日を定める政令は、本記事の執筆時点（2026年8月13日）では確認できていません。厚生労働省・日本年金機構とも「撤廃予定」という表現を使っています。**日付を前提に人員計画を立てる場合は、直前に確認してください。**\n\n撤廃されると、加入するかどうかは**「週20時間以上か」と「学生でないか」の2つ**に絞られます。賃金による線引きが消えるので、時給を上げても加入の有無は変わりません。「106万円を超えないように働く」という調整が、意味を持たなくなるということです。\n\nなお、**いわゆる「130万円の壁」（扶養に入れるかどうかの基準）は、この改正では撤廃されていません。** 106万円の話と130万円の話は別の制度なので、混ざらないようご注意ください。\n\n## この基準は、いつまで続くのか？\n\n企業規模の要件そのものが、10年かけて段階的になくなります。\n\n| 時期 | 特定適用事業所になる規模 |\n|---|---|\n| 現行 | 厚生年金保険の被保険者 **51人以上** |\n| **2027年10月** | **36人以上** |\n| **2029年10月** | **21人以上** |\n| **2032年10月** | **11人以上** |\n| **2035年10月** | **10人以下も対象**（規模要件の撤廃完了） |\n\n（令和7年法律第74号。厚生労働省「短時間労働者の社会保険の加入拡大のポイント」令和8年1月作成）\n\n**最終的に、企業規模による線引きはなくなります。** いま50人以下だから関係ない、という状態は続きません。従業員が20人の会社なら2032年10月から、10人の会社でも2035年10月から対象になります。\n\nあわせて予定されている変更も挙げておきます。\n\n- 新たに加入対象となる方への**保険料の調整支援**（3年間）——2026年10月\n- 標準報酬月額の上限引上げ——2027年9月に68万円、2028年9月に71万円、2029年9月に75万円\n- **個人事業所の適用対象の拡大**（全業種・常時5人以上）——2029年10月（同時点で既にある事業所は当分の間対象外）\n\n短い時間で雇う人を増やすか、人数を絞って1人あたりの時間を長くするか。**どちらの設計も、数年後には同じ結論に収束します。** その前提で人員計画を立てるほうが、あとで組み直す手間が減ります。\n\n家族を短時間で雇う場合は、雇用保険の扱いが別に問題になります。[家族を社員にするとき、つまずく3つのところ](/labor/column/kazoku-shain-koyohoken-yakuin-joseikin)をご覧ください。パートを正社員にしていく予定がある場合は、[助成金を狙うなら、最初の契約形態で決まる](/labor/column/joseikin-yuki-muki-keiyaku-katachi)を先にお読みいただくと、入り口の契約の決め方が変わります。\n\n## よくある質問\n\n**Q. 週の所定労働時間が28時間ですが、繁忙期は実際に32時間働いています。どちらで判断されますか？**\nA. 判断の基礎は**所定**労働時間です。ただし、実際の労働時間が恒常的に所定を上回っている場合、実態に合わせて所定労働時間を見直すべき状態と評価されることがあります。「一時的に超えた」のか「実質的にそれが所定になっている」のかで扱いが変わりますので、繁忙期の残業が毎年同じ時期に同じだけ発生している、というような場合はご相談ください。\n\n**Q. 従業員数の51人は、パートも含めて数えるのですか？**\nA. 特定適用事業所の判定に使うのは、**厚生年金保険の被保険者の数**です。パートでも被保険者になっていれば数に入り、被保険者になっていない短時間の方は入りません。また事業主が同一である複数の適用事業所は合算して数えます。「従業員数」という言い方をしますが、在籍者の頭数ではない点にご注意ください。\n\n**Q. 賃金要件が撤廃されると、いまパートの方は全員加入になりますか？**\nA. 51人以上の会社であれば、週20時間以上で学生でない方は加入対象になります。ただし最低賃金法の減額特例の対象となる方で月額8.8万円未満の場合は、撤廃後も原則として対象外とされています（申出による任意加入は可能）。50人以下の会社では、賃金要件の撤廃だけでは変わりません。企業規模要件が下がる時期に影響を受けます。\n\n**Q. 保険料の負担が増える分、時給を下げることはできますか？**\nA. 賃金の引下げは労働条件の不利益変更にあたるため、本人の同意なく一方的に行うことはできません。就業規則の変更による場合も、変更の合理性が問われます。加入拡大を理由とした引下げは、合理性の説明が難しい部類に入ります。**この判断は個別の事情によりますので、実施を検討される場合は事前にご相談ください。** 費用は[報酬額表](/labor/ryokin)をご覧ください。\n\n## この記事の根拠\n\n- 健康保険法（大正11年法律第70号）第3条第1項第9号\n- 厚生年金保険法（昭和29年法律第115号）第9条、第12条第5号\n- 公的年金制度の財政基盤及び最低保障機能の強化等のための国民年金法等の一部を改正する法律（**平成24年法律第62号**）附則第1条第5号（平成28年10月1日施行）、附則第17条第1項（厚生年金保険）、附則第46条第1項（健康保険）\n- 雇用保険法（昭和49年法律第116号）第4条第1項、第6条第1号。**第6条は項を持たない条文のため、引用は「第6条第1号」です**\n- 社会経済の変化を踏まえた年金制度の機能強化のための国民年金法等の一部を改正する等の法律（**令和7年法律第74号**。2025年6月13日成立、6月20日公布）\n- 厚生労働省「短時間労働者の社会保険（健康保険・厚生年金保険）の加入拡大のポイント」（**令和8年1月作成**）——企業規模要件のスケジュール、賃金要件の撤廃予定、最低賃金1,016円の記述\n- 日本年金機構「短時間労働者に対する健康保険・厚生年金保険の適用の拡大」（**2026年4月17日更新**）\n- **賃金要件の撤廃時期を定める施行期日政令は、2026年8月13日時点で確認できていません（未検証）。** 厚生労働省・日本年金機構とも「令和8年10月に撤廃予定」という表現を用いています\n- 条文はいずれも2026年8月13日時点でe-Gov法令検索により確認した現行条文です\n\n**この記事は、誰に相談するかまでは決めていません。** 所定労働時間の設計、加入の要否の判定、資格取得届の手続、就業規則の見直しは社会保険労務士の業務です。配偶者控除など所得税の扱いは税理士へ直接ご依頼いただく形をご案内します。当事務所は紹介料を受け取りません。四葉社会保険労務士事務所にご相談いただく場合の費用は[報酬額表](/labor/ryokin)に、よくいただくご質問は[よくあるご質問](/labor/faq)にまとめています。\n\n本記事は一般的な情報提供です。個別のご事情に応じた判断は、面談のうえ資格者が行います。執筆は[浦松丈二](/about/uramatsu)（社会保険労務士・行政書士・宅地建物取引士）です。",
    "status": "published",
    "author": {
      "name": "浦松 丈二",
      "title": "社会保険労務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
    },
    "keywords": [
      "パート 社会保険 何時間から",
      "社会保険 4分の3基準",
      "106万円の壁 撤廃",
      "社会保険 適用拡大 51人",
      "雇用保険 週20時間",
      "短時間労働者 社会保険 企業規模要件"
    ],
    "tags": [
      "社会保険",
      "雇用保険",
      "パート",
      "適用拡大",
      "年金制度改正"
    ],
    "locales": [],
    "faq": [
      {
        "question": "週の所定労働時間が28時間ですが、繁忙期は実際に32時間働いています。どちらで判断されますか？",
        "answer": "判断の基礎は所定労働時間です。ただし、実際の労働時間が恒常的に所定を上回っている場合、実態に合わせて所定労働時間を見直すべき状態と評価されることがあります。「一時的に超えた」のか「実質的にそれが所定になっている」のかで扱いが変わりますので、繁忙期の残業が毎年同じ時期に同じだけ発生している、というような場合はご相談ください。"
      },
      {
        "question": "従業員数の51人は、パートも含めて数えるのですか？",
        "answer": "特定適用事業所の判定に使うのは、厚生年金保険の被保険者の数です。パートでも被保険者になっていれば数に入り、被保険者になっていない短時間の方は入りません。また事業主が同一である複数の適用事業所は合算して数えます。「従業員数」という言い方をしますが、在籍者の頭数ではない点にご注意ください。"
      },
      {
        "question": "賃金要件が撤廃されると、いまパートの方は全員加入になりますか？",
        "answer": "51人以上の会社であれば、週20時間以上で学生でない方は加入対象になります。ただし最低賃金法の減額特例の対象となる方で月額8.8万円未満の場合は、撤廃後も原則として対象外とされています（申出による任意加入は可能）。50人以下の会社では、賃金要件の撤廃だけでは変わりません。企業規模要件が下がる時期に影響を受けます。"
      },
      {
        "question": "保険料の負担が増える分、時給を下げることはできますか？",
        "answer": "賃金の引下げは労働条件の不利益変更にあたるため、本人の同意なく一方的に行うことはできません。就業規則の変更による場合も、変更の合理性が問われます。加入拡大を理由とした引下げは、合理性の説明が難しい部類に入ります。この判断は個別の事情によりますので、実施を検討される場合は事前にご相談ください。 費用は報酬額表をご覧ください。"
      }
    ],
    "translations": {
      "en": {
        "title": "What happens to social insurance when you hire someone for short hours",
        "excerpt": "At a company with fewer than 51 employees, whether someone joins social insurance is decided by the three-quarters test alone. If both the prescribed working hours per week and the prescribed working days per month are less than three-quarters of those of an ordinary worker, they do not join. Employment insurance is separate: the dividing line is 20 hours a week. A table also sets out the timetable by which the company-size requirement is abolished by October 2035.",
        "content": "**In short:** At a company with fewer than 51 employees, whether someone joins social insurance is decided by the **three-quarters test** alone. If **both** the prescribed working hours per week and the prescribed working days per month are less than three-quarters of those of an ordinary worker, they do not join. Employment insurance is separate: **20 hours a week or more** is the dividing line.\n\nWhen hiring a part-timer, we are often asked \"up to how many hours can I go without having to enrol them in insurance?\" The answer changes with the size of the company — and **it will keep changing over the next ten years**. The standard you set today is the kind of standard that will no longer work as it is a few years from now.\n\n## From how many hours does someone join social insurance?\n\nHealth insurance and employees' pension insurance contain provisions that exclude short-time workers from insured status (Health Insurance Act, Article 3, paragraph 1, item 9; Employees' Pension Insurance Act, Article 12, item 5). This is where the three-quarters test comes in.\n\n**At a company where ordinary workers work 40 hours a week and 20 days a month, the boundary is 30 hours a week and 15 days a month.** If both are less than three-quarters, the person does not become an insured person. If even one of them is three-quarters or more, they are an insured person.\n\nThe three-quarters test decides the matter on its own only at **a company that is not a specified covered workplace** — that is, a company where the number of insured persons under employees' pension insurance is 50 or fewer on a regular basis. The basis is Act No. 62 of 2012 (Heisei 24), Supplementary Provisions, Article 17, paragraph 1 (employees' pension insurance) and Supplementary Provisions, Article 46, paragraph 1 (health insurance), which provide that \"for the time being, a specified short-time worker working less than three-quarters who is employed at a covered workplace other than a specified covered workplace shall not be treated as an insured person.\"\n\nAt a company where the number of insured persons **regularly exceeds 50**, a person becomes an insured person even below three-quarters if all of the following apply.\n\n| | Requirement |\n|---|---|\n| ① | Prescribed working hours of **20 hours or more** per week |\n| ② | Prescribed wages of **88,000 yen or more per month** |\n| ③ | **Not a student** |\n\nAs set out below, ② is scheduled to be abolished.\n\n## Does employment insurance use the same standard as social insurance?\n\nNo. **For employment insurance it is 20 hours a week.** The Employment Insurance Act excludes from coverage \"a person whose prescribed working hours per week are less than 20 hours\" (Article 6, item 1 of that Act).\n\nWorkers' accident compensation insurance is different again: **it has no working-hours requirement.** Employ even one worker and the business is covered, and someone working one hour a week is covered too. Setting the three side by side:\n\n| Prescribed working hours per week | Workers' accident compensation insurance | Employment insurance | Health insurance / employees' pension insurance (company with fewer than 51 employees) |\n|---|---|---|---|\n| Less than 20 hours | Covered | Not covered | Not covered |\n| 20 hours or more but less than 30 hours | Covered | **Covered** | Not covered |\n| 30 hours or more | Covered | Covered | **Covered** (at a company on 40 hours a week) |\n\n**The band from 20 to 30 hours is the one most often misunderstood.** It is the state in which the person is in employment insurance but not in social insurance. What happens is that someone the employer assumed \"cannot be insured\" asks for a separation certificate, and only then does the employer notice.\n\nNote that \"30 hours or more\" in the social insurance column assumes a company where ordinary workers work 40 hours a week. **At a company where ordinary workers have shorter prescribed hours, the boundary comes down too.** At a company on 35 hours a week it is 26.25 hours. Work it out from the prescribed working hours in your own rules of employment.\n\n## Where has the \"1.06 million yen wall\" gone?\n\n**It is moving towards disappearing.** The wage requirement in ② above (88,000 yen or more per month, which comes to roughly 1.06 million yen a year) was what the so-called \"1.06 million yen wall\" actually was.\n\nThe Ministry of Health, Labour and Welfare states that this wage requirement is **scheduled to be abolished in October of Reiwa 8 (2026)**. The reason is that **the regional minimum wages for FY Reiwa 7 (FY2025) came to exceed 1,016 yen an hour in every prefecture**. At 1,016 yen an hour, 20 hours a week reaches 88,000 yen a month, so once the working-hours requirement in ① is met, ② is met automatically. The reasoning is that it has therefore ceased to function as a requirement.\n\n**It is, however, \"scheduled.\"** Act No. 74 of 2025 (Reiwa 7) sets the timing of the abolition as \"a day to be specified by cabinet order within 3 years from promulgation,\" and the cabinet order fixing that date could not be confirmed as at the time of writing (13 August 2026). Both the Ministry of Health, Labour and Welfare and the Japan Pension Service use the wording \"scheduled to be abolished.\" **If you are building a staffing plan on the assumption of that date, check again immediately beforehand.**\n\nOnce it is abolished, whether someone joins comes down to **just 2 questions: \"20 hours a week or more?\" and \"not a student?\"** Because the line drawn by wages disappears, raising the hourly rate will not change whether the person joins. It means that adjusting hours \"so as not to go over 1.06 million yen\" ceases to have any point.\n\nNote that **the so-called \"1.3 million yen wall\" (the standard for being a dependant) is not abolished by this reform.** The 1.06 million yen question and the 1.3 million yen question belong to different schemes, so take care not to mix them up.\n\n## How long will this standard last?\n\nThe company-size requirement itself disappears in stages over ten years.\n\n| Timing | Size at which a company becomes a specified covered workplace |\n|---|---|\n| Current | **51 or more** insured persons under employees' pension insurance |\n| **October 2027** | **36 or more** |\n| **October 2029** | **21 or more** |\n| **October 2032** | **11 or more** |\n| **October 2035** | **10 or fewer also covered** (abolition of the size requirement completed) |\n\n(Act No. 74 of 2025 (Reiwa 7). Ministry of Health, Labour and Welfare, \"Key points on the expansion of social insurance coverage for short-time workers,\" prepared January of Reiwa 8 (2026))\n\n**In the end, the line drawn by company size disappears.** The state of \"we have 50 or fewer, so it does not concern us\" will not continue. A company with 20 employees is covered from October 2032, and even a company with 10 employees from October 2035.\n\nThe changes scheduled alongside this are also worth listing.\n\n- **Support in adjusting insurance premiums** for those newly brought into coverage (for 3 years) — October 2026\n- Raising of the upper limit of the standard monthly remuneration — to 680,000 yen in September 2027, 710,000 yen in September 2028 and 750,000 yen in September 2029\n- **Expansion of coverage for sole proprietorships** (all industries, five or more workers on a regular basis) — October 2029 (workplaces already in existence at that time are outside the scope for the time being)\n\nDo you increase the number of people employed for short hours, or narrow the headcount and give each person longer hours? **Both designs converge on the same conclusion within a few years.** Building the staffing plan on that assumption saves you the work of rebuilding it later.\n\nWhere you employ a family member for short hours, the treatment under employment insurance becomes a separate problem. See [Three things that trip you up when you put a family member on the payroll](/en/labor/column/kazoku-shain-koyohoken-yakuin-joseikin). If you plan to convert part-timers into regular employees, reading [If you are going after a subsidy, it is decided by the form of the first contract](/en/labor/column/joseikin-yuki-muki-keiyaku-katachi) first will change how you settle the contract at the entrance.\n\n## Frequently asked questions\n\n**Q. The prescribed working hours are 28 a week, but in the busy season she actually works 32. Which is used to judge?**\nA. The basis for the judgement is the **prescribed** working hours. However, where actual working hours consistently exceed the prescribed hours, this may be assessed as a state of affairs in which the prescribed working hours ought to be revised to match reality. The treatment differs depending on whether the excess was \"temporary\" or whether \"that has in substance become the prescribed hours,\" so if overtime in the busy season arises at the same time of year and to the same extent every year, please consult us.\n\n**Q. In counting the 51 employees, are part-timers included?**\nA. What is used in determining a specified covered workplace is **the number of insured persons under employees' pension insurance**. A part-timer who is an insured person counts, while a short-hours worker who is not an insured person does not. Multiple covered workplaces under the same proprietor are also counted together. The expression used is \"number of employees,\" but note that it is not a head count of the people on the books.\n\n**Q. When the wage requirement is abolished, will all our current part-timers be enrolled?**\nA. At a company with 51 or more employees, those working 20 hours or more a week who are not students become subject to enrolment. However, a person who is covered by the reduction exception under the Minimum Wage Act and whose monthly wage is less than 88,000 yen is as a rule still outside the scope after the abolition (voluntary enrolment on application is possible). At a company with 50 or fewer employees, the abolition of the wage requirement alone changes nothing; such companies are affected when the company-size requirement comes down.\n\n**Q. Can I lower the hourly rate to offset the increase in insurance premiums?**\nA. Lowering wages amounts to a disadvantageous change to working conditions, so it cannot be done unilaterally without the person's consent. Even where it is done by amending the rules of employment, the reasonableness of the amendment will be examined. A reduction on the grounds of the expansion of coverage falls into the category where reasonableness is difficult to explain. **This judgement depends on the individual circumstances, so please consult us in advance if you are considering it.** For fees, see the [fee schedule](/en/labor/ryokin).\n\n## Sources for this article\n\n- Health Insurance Act (健康保険法, Act No. 70 of 1922), Article 3, paragraph 1, item 9\n- Employees' Pension Insurance Act (厚生年金保険法, Act No. 115 of 1954), Article 9 and Article 12, item 5\n- Act Partially Amending the National Pension Act and Other Acts to Strengthen the Financial Base and Minimum Guarantee Function of the Public Pension System (公的年金制度の財政基盤及び最低保障機能の強化等のための国民年金法等の一部を改正する法律, **Act No. 62 of 2012 (Heisei 24)**), Supplementary Provisions, Article 1, item 5 (in force 1 October 2016 (Heisei 28)); Supplementary Provisions, Article 17, paragraph 1 (employees' pension insurance); Supplementary Provisions, Article 46, paragraph 1 (health insurance)\n- Employment Insurance Act (雇用保険法, Act No. 116 of 1974), Article 4, paragraph 1 and Article 6, item 1. **Article 6 is a provision that has no paragraphs, so the citation is \"Article 6, item 1\"**\n- Act Partially Amending the National Pension Act and Other Acts to Strengthen the Functions of the Pension System in Light of Socio-Economic Change (社会経済の変化を踏まえた年金制度の機能強化のための国民年金法等の一部を改正する等の法律, **Act No. 74 of 2025 (Reiwa 7)**; enacted 13 June 2025, promulgated 20 June)\n- Ministry of Health, Labour and Welfare, \"Key points on the expansion of social insurance (health insurance and employees' pension insurance) coverage for short-time workers\" (**prepared January of Reiwa 8 (2026)**) — the timetable for the company-size requirement, the scheduled abolition of the wage requirement, and the statement on the 1,016 yen minimum wage\n- Japan Pension Service, \"Expansion of the application of health insurance and employees' pension insurance to short-time workers\" (**updated 17 April 2026**)\n- **The cabinet order fixing the date of abolition of the wage requirement could not be confirmed as at 13 August 2026 (unverified).** Both the Ministry of Health, Labour and Welfare and the Japan Pension Service use the wording \"scheduled to be abolished in October of Reiwa 8\"\n- All provisions are those in force as confirmed through e-Gov law search as of 13 August 2026\n\n**This article stops short of deciding who you should consult.** Designing prescribed working hours, determining whether enrolment is required, filing notifications of acquisition of insured status, and reviewing the rules of employment are the work of a Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant). For income tax matters such as the spouse deduction, we will point you to a tax accountant, whom you engage directly under a separate contract. We do not receive referral fees. Fees for consulting 四葉社会保険労務士事務所 are set out in the [fee schedule](/en/labor/ryokin), and the questions we are asked most often are collected in [frequently asked questions](/en/labor/faq).\n\nThis article is general information. A judgement on your particular circumstances is made by a qualified professional after a meeting. Written by [Joji Uramatsu](/en/about/uramatsu) (Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist).",
        "category": "Social insurance",
        "keywords": [
          "part-timer social insurance from how many hours",
          "social insurance three-quarters test",
          "1.06 million yen wall abolition",
          "social insurance expansion of coverage 51 employees",
          "employment insurance 20 hours a week",
          "short-time workers social insurance company size requirement"
        ],
        "tags": [
          "Social insurance",
          "Employment insurance",
          "Part-time work",
          "Expansion of coverage",
          "Pension system reform"
        ],
        "author": {
          "name": "Joji Uramatsu",
          "title": "Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist — 四葉社会保険労務士事務所／四葉行政書士事務所"
        },
        "faq": [
          {
            "question": "The prescribed working hours are 28 a week, but in the busy season she actually works 32. Which is used to judge?",
            "answer": "The basis for the judgement is the prescribed working hours. However, where actual working hours consistently exceed the prescribed hours, this may be assessed as a state of affairs in which the prescribed working hours ought to be revised to match reality. The treatment differs depending on whether the excess was \"temporary\" or whether \"that has in substance become the prescribed hours,\" so if overtime in the busy season arises at the same time of year and to the same extent every year, please consult us."
          },
          {
            "question": "In counting the 51 employees, are part-timers included?",
            "answer": "What is used in determining a specified covered workplace is the number of insured persons under employees' pension insurance. A part-timer who is an insured person counts, while a short-hours worker who is not an insured person does not. Multiple covered workplaces under the same proprietor are also counted together. The expression used is \"number of employees,\" but note that it is not a head count of the people on the books."
          },
          {
            "question": "When the wage requirement is abolished, will all our current part-timers be enrolled?",
            "answer": "At a company with 51 or more employees, those working 20 hours or more a week who are not students become subject to enrolment. However, a person who is covered by the reduction exception under the Minimum Wage Act and whose monthly wage is less than 88,000 yen is as a rule still outside the scope after the abolition (voluntary enrolment on application is possible). At a company with 50 or fewer employees, the abolition of the wage requirement alone changes nothing; such companies are affected when the company-size requirement comes down."
          },
          {
            "question": "Can I lower the hourly rate to offset the increase in insurance premiums?",
            "answer": "Lowering wages amounts to a disadvantageous change to working conditions, so it cannot be done unilaterally without the person's consent. Even where it is done by amending the rules of employment, the reasonableness of the amendment will be examined. A reduction on the grounds of the expansion of coverage falls into the category where reasonableness is difficult to explain. This judgement depends on the individual circumstances, so please consult us in advance if you are considering it. For fees, see the fee schedule."
          }
        ]
      },
      "zh-tw": {
        "title": "以短時間雇用員工時，社會保險會怎麼樣",
        "excerpt": "在員工未滿51人的公司，是否加入社會保險只由「4分之3基準」決定。1週的約定工作時間與1個月的約定工作日數，兩者都未滿一般勞工的4分之3就不加入。雇用保險則另有一套，分界點是每週20小時。本文也以表格整理了企業規模要件在2035年10月前撤廢完成的時程。",
        "content": "**結論（先講重點）**：在員工未滿51人的公司，是否加入社會保險只由「**4分之3基準**」決定。1週的約定工作時間與1個月的約定工作日數**兩者**都未滿一般勞工的4分之3，就不加入。雇用保險則是另一回事，**每週20小時以上**是分界點。\n\n雇用兼職人員時，我們常收到「工作到幾小時為止可以不用加保」這樣的提問。答案會隨公司規模而變，而且**接下來的10年還會持續改變**。現在定下來的基準，具有「幾年後就無法照原樣沿用」的性質。\n\n## 從幾小時開始要加入社會保險？\n\n健康保險與厚生年金保險設有把短時間勞工排除於被保險人之外的規定（健康保險法第3條第1項第9號、厚生年金保險法第12條第5號）。這裡使用的就是4分之3基準。\n\n**如果一般勞工是每週40小時、每月20日的公司，分界就是每週30小時、每月15日。** 兩者都未滿4分之3就不會成為被保險人。只要有一項達到4分之3以上，就是被保險人。\n\n只以這個4分之3基準來決定的，是**非特定適用事業所的公司**，也就是厚生年金保險的被保險人經常在50人以下的公司。依據是平成24年〈2012年〉法律第62號的附則第17條第1項（厚生年金保險）與附則第46條第1項（健康保險），其中規定「在相當期間內，對於受雇於特定適用事業所以外之適用事業所的特定未滿4分之3短時間勞工……不作為被保險人」。\n\n在被保險人**經常超過50人**的公司，即使未滿4分之3，只要符合下列全部條件，就會成為被保險人。\n\n| | 要件 |\n|---|---|\n| ① | 1週的約定工作時間為**20小時以上** |\n| ② | 約定內工資為**每月8.8萬圓以上** |\n| ③ | **不是學生** |\n\n關於②，如後所述已預定撤廢。\n\n## 雇用保險和社會保險是相同的基準嗎？\n\n不同。**雇用保險是每週20小時。** 雇用保險法把「1週的約定工作時間未滿20小時者」列為適用除外（同法第6條第1號）。\n\n勞災保險又是另一回事，**沒有時間上的要件**。只要使用1名勞工就是適用事業，即使每週1小時也是對象。把3者並列如下。\n\n| 1週的約定工作時間 | 勞災保險 | 雇用保險 | 健康保險・厚生年金保險（未滿51人的公司） |\n|---|---|---|---|\n| 未滿20小時 | 加入 | 不加入 | 不加入 |\n| 20小時以上未滿30小時 | 加入 | **加入** | 不加入 |\n| 30小時以上 | 加入 | 加入 | **加入**（每週40小時的公司的情形） |\n\n**20小時到30小時這一段最容易被誤解。** 也就是加入雇用保險、但不加入社會保險的狀態。常發生的情況是：原本以為「應該沒有加保」的人來索取離職票，這時才第一次發現。\n\n另外，社會保險欄的「30小時以上」，是以一般勞工每週40小時的公司為前提。**在一般勞工的約定工作時間較短的公司，分界也會跟著下降。** 每週35小時的公司就是26.25小時。請依貴公司就業規則上的約定工作時間計算。\n\n## 「106萬圓之牆」跑到哪裡去了？\n\n**正朝著消失的方向前進。** 上面列出的②的工資要件（每月8.8萬圓以上。換算成年收入約106萬圓），就是所謂「106萬圓之牆」的真面目。\n\n厚生勞動省表示，這項工資要件**預定於令和8年（2026年）10月撤廢**。理由是**全部都道府縣的令和7年度（2025年度）地區別最低工資都超過了時薪1,016圓**。以時薪1,016圓工作每週20小時就會達到每月8.8萬圓，因此只要滿足①的時間要件，②就會自動滿足。整理下來就是：它已經失去作為要件的意義。\n\n**不過這是「預定」。** 令和7年〈2025年〉法律第74號把撤廢的時期定為「自公布起3年以內以政令所定之日」，而規定其施行期日的政令，在本文執筆時點（2026年8月13日）尚未能確認。厚生勞動省與日本年金機構都使用「預定撤廢」這樣的表述。**若要以日期為前提來擬定人員計畫，請在事前再確認一次。**\n\n一旦撤廢，是否加保就會縮減為**「是否每週20小時以上」與「是否不是學生」這2項**。由於以工資劃線的做法消失，即使調高時薪也不會改變加保與否。也就是說，「為了不超過106萬圓而調整工作」這件事將失去意義。\n\n另外，**所謂「130萬圓之牆」（能否成為被扶養者的基準），在這次修法中並未撤廢。** 106萬圓的話題與130萬圓的話題屬於不同的制度，請注意不要混在一起。\n\n## 這個基準會持續到什麼時候？\n\n企業規模的要件本身，將在10年間分階段消失。\n\n| 時期 | 成為特定適用事業所的規模 |\n|---|---|\n| 現行 | 厚生年金保險的被保險人 **51人以上** |\n| **2027年10月** | **36人以上** |\n| **2029年10月** | **21人以上** |\n| **2032年10月** | **11人以上** |\n| **2035年10月** | **10人以下也成為對象**（規模要件撤廢完成） |\n\n（令和7年〈2025年〉法律第74號。厚生勞動省「短時間勞工社會保險加入擴大的要點」令和8年〈2026年〉1月製作）\n\n**最終，以企業規模劃線的做法會消失。** 「現在是50人以下所以與我無關」這種狀態不會一直持續。員工20人的公司從2032年10月起，即使是10人的公司也從2035年10月起成為對象。\n\n一併預定的變更也在此列出。\n\n- 對新成為加保對象者的**保險費調整支援**（3年間）——2026年10月\n- 標準報酬月額上限的調高——2027年9月調至68萬圓、2028年9月調至71萬圓、2029年9月調至75萬圓\n- **個人事業所適用對象的擴大**（全業種・經常5人以上）——2029年10月（在該時點已經存在的事業所，在相當期間內不列為對象）\n\n是要增加短時間雇用的人數，還是要縮減人數、拉長每人的工作時間。**兩種設計在幾年後都會收斂到相同的結論。** 以這個前提來擬定人員計畫，日後重組的工夫會比較少。\n\n以短時間雇用家人時，雇用保險的處理會另外構成問題，請見[讓家人成為員工時，容易卡住的3個地方](/zh-tw/labor/column/kazoku-shain-koyohoken-yakuin-joseikin)。若預定把兼職人員轉為正職，先閱讀[要爭取助成金，最初的契約形式就決定了一切](/zh-tw/labor/column/joseikin-yuki-muki-keiyaku-katachi)，入口契約的決定方式會有所不同。\n\n## 常見問題\n\n**Q. 每週的約定工作時間是28小時，但旺季實際上工作32小時。會以哪一個判斷？**\nA. 判斷的基礎是**約定**工作時間。不過，若實際工作時間長期持續超過約定時間，可能被評價為應該配合實際狀態重新檢討約定工作時間的狀態。「只是一時超過」或「實質上那已經成為約定時間」，處理會不一樣，因此若旺季的加班每年都在同一時期、以同樣的量發生，請與我們商量。\n\n**Q. 員工人數的51人，是連兼職人員也一起計算嗎？**\nA. 用於判定特定適用事業所的，是**厚生年金保險被保險人的人數**。兼職人員只要成為被保險人就計入，未成為被保險人的短時間工作者則不計入。此外，事業主相同的多個適用事業所要合併計算。雖然用「員工人數」這個說法，但請注意它不是在籍者的人頭數。\n\n**Q. 工資要件撤廢後，現在的兼職人員會全部加保嗎？**\nA. 若是51人以上的公司，每週20小時以上且不是學生的人就會成為加保對象。不過，屬於最低工資法減額特例對象且每月未滿8.8萬圓的人，撤廢後原則上仍不列為對象（可依申請任意加保）。在50人以下的公司，光是工資要件撤廢並不會有變化，而是在企業規模要件下降的時期受到影響。\n\n**Q. 保險費負擔增加的部分，可以調降時薪嗎？**\nA. 調降工資屬於勞動條件的不利益變更，不能未經本人同意單方面實施。即使是透過變更就業規則進行，也會被追問變更的合理性。以適用擴大為理由的調降，屬於合理性難以說明的類型。**這項判斷取決於個別情況，若考慮實施請事前與我們商量。** 費用請見[報酬額表](/zh-tw/labor/ryokin)。\n\n## 本文的依據\n\n- 健康保險法（健康保険法，大正11年〈1922年〉法律第70號）第3條第1項第9號\n- 厚生年金保險法（厚生年金保険法，昭和29年〈1954年〉法律第115號）第9條、第12條第5號\n- 公的年金制度の財政基盤及び最低保障機能の強化等のための国民年金法等の一部を改正する法律（**平成24年〈2012年〉法律第62號**）附則第1條第5號（平成28年〈2016年〉10月1日施行）、附則第17條第1項（厚生年金保險）、附則第46條第1項（健康保險）\n- 雇用保險法（雇用保険法，昭和49年〈1974年〉法律第116號）第4條第1項、第6條第1號。**第6條是不具「項」的條文，因此引用寫作「第6條第1號」**\n- 社会経済の変化を踏まえた年金制度の機能強化のための国民年金法等の一部を改正する等の法律（**令和7年〈2025年〉法律第74號**。2025年6月13日成立、6月20日公布）\n- 厚生勞動省「短時間勞工社會保險（健康保險・厚生年金保險）加入擴大的要點」（**令和8年〈2026年〉1月製作**）——企業規模要件的時程、工資要件的撤廢預定、最低工資1,016圓的記述\n- 日本年金機構「對短時間勞工擴大適用健康保險・厚生年金保險」（**2026年4月17日更新**）\n- **規定工資要件撤廢時期的施行期日政令，在2026年8月13日時點尚未能確認（未查證）。** 厚生勞動省與日本年金機構都使用「預定於令和8年10月撤廢」這樣的表述\n- 條文均為2026年8月13日時點以e-Gov法令檢索確認的現行條文\n\n**本文並未決定到「該找誰商量」為止。** 約定工作時間的設計、是否需要加保的判定、資格取得申報的手續、就業規則的檢討，是社會保險勞務士的業務。配偶扣除等所得稅上的處理請找稅理士，**直接委任、另行簽約**。本所不收取介紹費。向四葉社会保険労務士事務所諮詢時的費用請見[報酬額表](/zh-tw/labor/ryokin)，常收到的提問則整理在[常見問答](/zh-tw/labor/faq)。\n\n本文為一般性的資訊提供。針對個別情況的判斷，由具備資格者於面談後作成。撰文者為[浦松丈二](/zh-tw/about/uramatsu)（社會保險勞務士・行政書士・宅地建物取引士）。",
        "category": "社會保險",
        "keywords": [
          "兼職 社會保險 從幾小時開始",
          "社會保險 4分之3基準",
          "106萬圓之牆 撤廢",
          "社會保險 適用擴大 51人",
          "雇用保險 每週20小時",
          "短時間勞工 社會保險 企業規模要件"
        ],
        "tags": [
          "社會保險",
          "雇用保險",
          "兼職",
          "適用擴大",
          "年金制度改正"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社會保險勞務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "每週的約定工作時間是28小時，但旺季實際上工作32小時。會以哪一個判斷？",
            "answer": "判斷的基礎是約定工作時間。不過，若實際工作時間長期持續超過約定時間，可能被評價為應該配合實際狀態重新檢討約定工作時間的狀態。「只是一時超過」或「實質上那已經成為約定時間」，處理會不一樣，因此若旺季的加班每年都在同一時期、以同樣的量發生，請與我們商量。"
          },
          {
            "question": "員工人數的51人，是連兼職人員也一起計算嗎？",
            "answer": "用於判定特定適用事業所的，是厚生年金保險被保險人的人數。兼職人員只要成為被保險人就計入，未成為被保險人的短時間工作者則不計入。此外，事業主相同的多個適用事業所要合併計算。雖然用「員工人數」這個說法，但請注意它不是在籍者的人頭數。"
          },
          {
            "question": "工資要件撤廢後，現在的兼職人員會全部加保嗎？",
            "answer": "若是51人以上的公司，每週20小時以上且不是學生的人就會成為加保對象。不過，屬於最低工資法減額特例對象且每月未滿8.8萬圓的人，撤廢後原則上仍不列為對象（可依申請任意加保）。在50人以下的公司，光是工資要件撤廢並不會有變化，而是在企業規模要件下降的時期受到影響。"
          },
          {
            "question": "保險費負擔增加的部分，可以調降時薪嗎？",
            "answer": "調降工資屬於勞動條件的不利益變更，不能未經本人同意單方面實施。即使是透過變更就業規則進行，也會被追問變更的合理性。以適用擴大為理由的調降，屬於合理性難以說明的類型。這項判斷取決於個別情況，若考慮實施請事前與我們商量。 費用請見報酬額表。"
          }
        ]
      },
      "zh": {
        "title": "以短时间雇用员工时，社会保险会怎么样",
        "excerpt": "在员工不满51人的公司，是否加入社会保险只由「4分之3基准」决定。1周的约定工作时间与1个月的约定工作日数，两者都不满一般劳动者的4分之3就不加入。雇用保险则另有一套，分界点是每周20小时。本文也以表格整理了企业规模要件在2035年10月前撤废完成的时间表。",
        "content": "**结论（先讲重点）**：在员工不满51人的公司，是否加入社会保险只由「**4分之3基准**」决定。1周的约定工作时间与1个月的约定工作日数**两者**都不满一般劳动者的4分之3，就不加入。雇用保险则是另一回事，**每周20小时以上**是分界点。\n\n雇用兼职人员时，我们常收到「工作到几小时为止可以不用加保」这样的提问。答案会随公司规模而变，而且**接下来的10年还会持续变化**。现在定下来的基准，具有「几年后就无法照原样沿用」的性质。\n\n## 从几小时开始要加入社会保险？\n\n健康保险与厚生年金保险设有把短时间劳动者排除于被保险人之外的规定（健康保险法第3条第1项第9号、厚生年金保险法第12条第5号）。这里使用的就是4分之3基准。\n\n**如果一般劳动者是每周40小时、每月20日的公司，分界就是每周30小时、每月15日。** 两者都不满4分之3就不会成为被保险人。只要有一项达到4分之3以上，就是被保险人。\n\n仅以这个4分之3基准决定的，是**非特定适用事业所的公司**，也就是厚生年金保险的被保险人经常在50人以下的公司。依据是平成24年〈2012年〉法律第62号的附则第17条第1项（厚生年金保险）与附则第46条第1项（健康保险），其中规定「在相当期间内，对于受雇于特定适用事业所以外之适用事业所的特定不满4分之3短时间劳动者……不作为被保险人」。\n\n在被保险人**经常超过50人**的公司，即使不满4分之3，只要符合下列全部条件，就会成为被保险人。\n\n| | 要件 |\n|---|---|\n| ① | 1周的约定工作时间为**20小时以上** |\n| ② | 约定内工资为**每月8.8万日元以上** |\n| ③ | **不是学生** |\n\n关于②，如后所述已预定撤废。\n\n## 雇用保险和社会保险是相同的基准吗？\n\n不同。**雇用保险是每周20小时。** 雇用保险法把「1周的约定工作时间不满20小时者」列为适用除外（同法第6条第1号）。\n\n劳灾保险又是另一回事，**没有时间上的要件**。只要使用1名劳动者就是适用事业，即使每周1小时也是对象。把3者并列如下。\n\n| 1周的约定工作时间 | 劳灾保险 | 雇用保险 | 健康保险・厚生年金保险（不满51人的公司） |\n|---|---|---|---|\n| 不满20小时 | 加入 | 不加入 | 不加入 |\n| 20小时以上不满30小时 | 加入 | **加入** | 不加入 |\n| 30小时以上 | 加入 | 加入 | **加入**（每周40小时的公司的情形） |\n\n**20小时到30小时这一段最容易被误解。** 也就是加入雇用保险、但不加入社会保险的状态。常发生的情况是：原本以为「应该没有加保」的人来索取离职票，这时才第一次发现。\n\n另外，社会保险栏的「30小时以上」，是以一般劳动者每周40小时的公司为前提。**在一般劳动者的约定工作时间较短的公司，分界也会跟着下降。** 每周35小时的公司就是26.25小时。请按贵公司就业规则上的约定工作时间计算。\n\n## 「106万日元之墙」跑到哪里去了？\n\n**正朝着消失的方向前进。** 上面列出的②的工资要件（每月8.8万日元以上。换算成年收入约106万日元），就是所谓「106万日元之墙」的真面目。\n\n厚生劳动省表示，这项工资要件**预定于令和8年（2026年）10月撤废**。理由是**全部都道府县的令和7年度（2025年度）地区别最低工资都超过了时薪1,016日元**。以时薪1,016日元工作每周20小时就会达到每月8.8万日元，因此只要满足①的时间要件，②就会自动满足。整理下来就是：它已经失去作为要件的意义。\n\n**不过这是「预定」。** 令和7年〈2025年〉法律第74号把撤废的时期定为「自公布起3年以内以政令所定之日」，而规定其施行期日的政令，在本文执笔时点（2026年8月13日）尚未能确认。厚生劳动省与日本年金机构都使用「预定撤废」这样的表述。**若要以日期为前提来拟定人员计划，请在事前再确认一次。**\n\n一旦撤废，是否加保就会缩减为**「是否每周20小时以上」与「是否不是学生」这2项**。由于以工资划线的做法消失，即使调高时薪也不会改变加保与否。也就是说，「为了不超过106万日元而调整工作」这件事将失去意义。\n\n另外，**所谓「130万日元之墙」（能否成为被扶养者的基准），在这次修法中并未撤废。** 106万日元的话题与130万日元的话题属于不同的制度，请注意不要混在一起。\n\n## 这个基准会持续到什么时候？\n\n企业规模的要件本身，将在10年间分阶段消失。\n\n| 时期 | 成为特定适用事业所的规模 |\n|---|---|\n| 现行 | 厚生年金保险的被保险人 **51人以上** |\n| **2027年10月** | **36人以上** |\n| **2029年10月** | **21人以上** |\n| **2032年10月** | **11人以上** |\n| **2035年10月** | **10人以下也成为对象**（规模要件撤废完成） |\n\n（令和7年〈2025年〉法律第74号。厚生劳动省「短时间劳动者社会保险加入扩大的要点」令和8年〈2026年〉1月制作）\n\n**最终，以企业规模划线的做法会消失。** 「现在是50人以下所以与我无关」这种状态不会一直持续。员工20人的公司从2032年10月起，即使是10人的公司也从2035年10月起成为对象。\n\n一并预定的变更也在此列出。\n\n- 对新成为加保对象者的**保险费调整支援**（3年间）——2026年10月\n- 标准报酬月额上限的调高——2027年9月调至68万日元、2028年9月调至71万日元、2029年9月调至75万日元\n- **个人事业所适用对象的扩大**（全行业・经常5人以上）——2029年10月（在该时点已经存在的事业所，在相当期间内不列为对象）\n\n是要增加短时间雇用的人数，还是要缩减人数、拉长每人的工作时间。**两种设计在几年后都会收敛到相同的结论。** 以这个前提来拟定人员计划，日后重组的工夫会比较少。\n\n以短时间雇用家人时，雇用保险的处理会另外构成问题，请见[让家人成为员工时，容易卡住的3个地方](/zh/labor/column/kazoku-shain-koyohoken-yakuin-joseikin)。若预定把兼职人员转为正式员工，先阅读[要争取助成金，最初的合同形式就决定了一切](/zh/labor/column/joseikin-yuki-muki-keiyaku-katachi)，入口合同的决定方式会有所不同。\n\n## 常见问题\n\n**Q. 每周的约定工作时间是28小时，但旺季实际上工作32小时。会以哪一个判断？**\nA. 判断的基础是**约定**工作时间。不过，若实际工作时间长期持续超过约定时间，可能被评价为应该配合实际状态重新检讨约定工作时间的状态。「只是一时超过」或「实质上那已经成为约定时间」，处理会不一样，因此若旺季的加班每年都在同一时期、以同样的量发生，请与我们商量。\n\n**Q. 员工人数的51人，是连兼职人员也一起计算吗？**\nA. 用于判定特定适用事业所的，是**厚生年金保险被保险人的人数**。兼职人员只要成为被保险人就计入，未成为被保险人的短时间工作者则不计入。此外，事业主相同的多个适用事业所要合并计算。虽然用「员工人数」这个说法，但请注意它不是在籍者的人头数。\n\n**Q. 工资要件撤废后，现在的兼职人员会全部加保吗？**\nA. 若是51人以上的公司，每周20小时以上且不是学生的人就会成为加保对象。不过，属于最低工资法减额特例对象且每月不满8.8万日元的人，撤废后原则上仍不列为对象（可依申请任意加保）。在50人以下的公司，光是工资要件撤废并不会有变化，而是在企业规模要件下降的时期受到影响。\n\n**Q. 保险费负担增加的部分，可以调降时薪吗？**\nA. 调降工资属于劳动条件的不利益变更，不能未经本人同意单方面实施。即使是通过变更就业规则进行，也会被追问变更的合理性。以适用扩大为理由的调降，属于合理性难以说明的类型。**这项判断取决于个别情况，若考虑实施请事前与我们商量。** 费用请见[报酬额表](/zh/labor/ryokin)。\n\n## 本文的依据\n\n- 健康保险法（健康保険法，大正11年〈1922年〉法律第70号）第3条第1项第9号\n- 厚生年金保险法（厚生年金保険法，昭和29年〈1954年〉法律第115号）第9条、第12条第5号\n- 公的年金制度の財政基盤及び最低保障機能の強化等のための国民年金法等の一部を改正する法律（**平成24年〈2012年〉法律第62号**）附则第1条第5号（平成28年〈2016年〉10月1日施行）、附则第17条第1项（厚生年金保险）、附则第46条第1项（健康保险）\n- 雇用保险法（雇用保険法，昭和49年〈1974年〉法律第116号）第4条第1项、第6条第1号。**第6条是不具「项」的条文，因此引用写作「第6条第1号」**\n- 社会経済の変化を踏まえた年金制度の機能強化のための国民年金法等の一部を改正する等の法律（**令和7年〈2025年〉法律第74号**。2025年6月13日成立、6月20日公布）\n- 厚生劳动省「短时间劳动者社会保险（健康保险・厚生年金保险）加入扩大的要点」（**令和8年〈2026年〉1月制作**）——企业规模要件的时间表、工资要件的撤废预定、最低工资1,016日元的记述\n- 日本年金机构「对短时间劳动者扩大适用健康保险・厚生年金保险」（**2026年4月17日更新**）\n- **规定工资要件撤废时期的施行期日政令，在2026年8月13日时点尚未能确认（未查证）。** 厚生劳动省与日本年金机构都使用「预定于令和8年10月撤废」这样的表述\n- 条文均为2026年8月13日时点以e-Gov法令检索确认的现行条文\n\n**本文并未决定到「该找谁商量」为止。** 约定工作时间的设计、是否需要加保的判定、资格取得申报的手续、就业规则的检讨，是社会保险劳务士的业务。配偶扣除等所得税上的处理请找税理士，**直接委任、另行签约**。本所不收取介绍费。向四葉社会保険労務士事務所咨询时的费用请见[报酬额表](/zh/labor/ryokin)，常收到的提问则整理在[常见问答](/zh/labor/faq)。\n\n本文为一般性的信息提供。针对个别情况的判断，由具备资格者于面谈后作出。撰文者为[浦松丈二](/zh/about/uramatsu)（社会保险劳务士・行政书士・宅地建物取引士）。",
        "category": "社会保险",
        "keywords": [
          "兼职 社会保险 从几小时开始",
          "社会保险 4分之3基准",
          "106万日元之墙 撤废",
          "社会保险 适用扩大 51人",
          "雇用保险 每周20小时",
          "短时间劳动者 社会保险 企业规模要件"
        ],
        "tags": [
          "社会保险",
          "雇用保险",
          "兼职",
          "适用扩大",
          "年金制度改正"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社会保险劳务士・行政书士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "每周的约定工作时间是28小时，但旺季实际上工作32小时。会以哪一个判断？",
            "answer": "判断的基础是约定工作时间。不过，若实际工作时间长期持续超过约定时间，可能被评价为应该配合实际状态重新检讨约定工作时间的状态。「只是一时超过」或「实质上那已经成为约定时间」，处理会不一样，因此若旺季的加班每年都在同一时期、以同样的量发生，请与我们商量。"
          },
          {
            "question": "员工人数的51人，是连兼职人员也一起计算吗？",
            "answer": "用于判定特定适用事业所的，是厚生年金保险被保险人的人数。兼职人员只要成为被保险人就计入，未成为被保险人的短时间工作者则不计入。此外，事业主相同的多个适用事业所要合并计算。虽然用「员工人数」这个说法，但请注意它不是在籍者的人头数。"
          },
          {
            "question": "工资要件撤废后，现在的兼职人员会全部加保吗？",
            "answer": "若是51人以上的公司，每周20小时以上且不是学生的人就会成为加保对象。不过，属于最低工资法减额特例对象且每月不满8.8万日元的人，撤废后原则上仍不列为对象（可依申请任意加保）。在50人以下的公司，光是工资要件撤废并不会有变化，而是在企业规模要件下降的时期受到影响。"
          },
          {
            "question": "保险费负担增加的部分，可以调降时薪吗？",
            "answer": "调降工资属于劳动条件的不利益变更，不能未经本人同意单方面实施。即使是通过变更就业规则进行，也会被追问变更的合理性。以适用扩大为理由的调降，属于合理性难以说明的类型。这项判断取决于个别情况，若考虑实施请事前与我们商量。 费用请见报酬额表。"
          }
        ]
      }
    }
  },
  {
    "business": "labor",
    "slug": "kaisha-tatamu-shakaihoken-zenso-tetsuzuki",
    "title": "会社をたたむとき、社会保険と労働保険はどうするか",
    "date": "2026-09-01",
    "category": "手続と期限",
    "excerpt": "会社をたたむときは、社会保険の適用事業所全喪届、雇用保険の適用事業所廃止届、労働保険の確定保険料申告書の3つが必要です。被保険者の資格喪失届は別に人数分出します。「労働保険 保険関係消滅届」という届出は存在しません。届出の名称・提出先・期限を一覧にしました。",
    "content": "**結論（先に要点）**：会社をたたむときは、**社会保険の適用事業所全喪届**、**雇用保険の適用事業所廃止届**、**労働保険の確定保険料申告書**の3つが必要です。被保険者の資格喪失届は、これとは別に人数分出します。登記より先に、こちらの期限が来ます。\n\n会社をつくるときの手続を書いた記事はたくさんありますが、たたむときの手続はあまり見かけません。廃業を扱う場面が少ないためだと思いますが、期限は開業のときより短いものが混じっていて、しかも**登記が終わるのを待っていると間に合いません**。\n\n## 会社をたたむと、どの届出が必要になるのか？\n\n大きく3つの系統に分かれます。提出先も期限もそれぞれ違います。\n\n| 何を | どこへ | いつまでに | 根拠 |\n|---|---|---|---|\n| 健康保険・厚生年金保険 **適用事業所全喪届** | 事務センターまたは管轄の年金事務所 | **事実があった日から5日以内** | 健康保険法施行規則第20条第1項／厚生年金保険法施行規則第13条の2第1項 |\n| 雇用保険 **適用事業所廃止届** | 事業所の所在地を管轄するハローワーク | **廃止の日の翌日から起算して10日以内** | 雇用保険法施行規則第141条第1項 |\n| 労働保険 **確定保険料申告書** | 所轄労働基準監督署、所轄都道府県労働局、日本銀行のいずれか | **保険関係が消滅した日から50日以内** | 労働保険の保険料の徴収等に関する法律第19条第1項 |\n\n**ここで1つ、よく誤解されている点があります。「労働保険 保険関係消滅届」という届出は存在しません。**\n\n労働保険の保険関係は、事業が廃止または終了したときに、その**翌日に法律上当然に消滅します**（労働保険の保険料の徴収等に関する法律第5条）。届け出て消してもらうものではないため、消滅届という様式がそもそもありません。実務では、確定保険料申告書の**「事業廃止等年月日」欄**に廃止の日を書くことで、廃止の事実を伝えることになります。\n\nなお「保険関係消滅**申請**書」（様式第27号）は存在しますが、これは**雇用保険暫定任意適用事業**に限った制度で、労働者の4分の3以上の同意と認可が必要なものです（徴収法附則第4条）。強制適用の事業には使いません。名前が似ているので、検索して行き当たった場合はご注意ください。\n\n## 順番と期限は、どうなっているのか？\n\n「保険関係が消滅した日」は廃止日の**翌日**なので、50日の起算もそこからです。厚生労働省の手引も「事業を廃止した日の翌日から起算して50日以内」と表示しています。\n\n実際に動かす順番は、次のようになります。\n\n1. **従業員の退職日を確定する**（ここが起点になります）\n2. 従業員の**資格喪失届**を出す（社会保険・雇用保険。下記参照）\n3. **確定保険料申告書**を作る。概算で納めた額が確定額を上回るときは、**労働保険料還付請求書（様式第8号）を同時に**出します\n4. **全喪届**を出す。このとき、**確定保険料申告書の写し（事業廃止等年月日の記載があるもの）**が事実を示す書類として求められます\n5. **雇用保険適用事業所廃止届**を出す\n\n**3と4の順序に注意してください。** 全喪届の添付書類として確定保険料申告書の写しが求められるため、労働保険を先に片づけないと社会保険が終わりません。ここを逆にすると往復が発生します。\n\n**「事業は続いているが従業員が0人になった」場合も、雇用保険の廃止届の対象です。** 厚生労働省の手引は、被保険者がいなくなり雇用の見込みもないとき、事業を休止して再開の見込みがないときも廃止届を出すとしています。法人格が残っているかどうかとは別の話です。\n\n## 従業員の分は、何を出すのか？\n\n人数分、別に出します。期限は事業所の届出とは違います。\n\n| 何を | いつまでに | 根拠 |\n|---|---|---|\n| 健康保険・厚生年金保険 **被保険者資格喪失届** | **事実があった日から5日以内** | 健康保険法施行規則第29条第1項／厚生年金保険法施行規則第22条第1項 |\n| 雇用保険 **被保険者資格喪失届** | **事実のあった日の翌日から起算して10日以内** | 雇用保険法施行規則第7条第1項 |\n\n雇用保険の資格喪失届には、原則として**離職証明書**（様式第5号）を添えます。本人が離職票の交付を希望しない場合は省略できますが、**離職日に59歳以上の被保険者については省略できません**（同条第3項）。廃業に伴う退職では60歳前後の方が含まれることが多く、ここは実際によく問題になります。\n\n離職理由をどう書くかも、本人の失業給付に直接影響します。会社都合か自己都合か、事業所の廃止に伴うものか。**事実と違う記載をしないこと**が第一ですが、事実の書き方で本人の受給の条件が変わるため、退職日を決める段階から確認しておくほうが安全です。\n\n## 登記や税務とは、どう分かれるのか？\n\n**分かれます。** 会社をたたむ手続は、少なくとも3つの系統が並行して動きます。\n\n| 系統 | 中身 | 誰の業務か |\n|---|---|---|\n| 労働・社会保険 | 全喪届、廃止届、確定保険料、資格喪失届 | 社会保険労務士 |\n| **登記** | 解散の登記、清算人の登記、清算結了の登記 | **司法書士** |\n| **税務** | 異動届出書、清算事業年度の申告、最後の確定申告 | **税理士** |\n\n**当事務所が扱うのは1行目だけです。** 登記は司法書士、税務は税理士へ、それぞれ直接ご依頼いただく形をご案内します。当事務所は紹介料を受け取りません。四葉行政書士事務所とは**それぞれ別の事業体**ですので、あわせてご依頼になる場合も別々にご契約いただきます。\n\nタイミングの関係だけ、先に押さえておいてください。**解散の登記が終わってから労働・社会保険の手続を始めると、5日や10日の期限をすでに過ぎていることがあります。** 従業員の退職日が決まった時点で、労働・社会保険の側は動き出せます。登記の完了を待つ必要はありません。\n\n会社をつくるときの届出と期限は[会社をつくったら、いつまでに何を出すのか](/labor/column/kaisha-setsuritsu-shakaihoken-roudouhoken-kigen)にまとめています。入口と出口で、必要な書類がきれいに対応しているわけではない点も、あわせてご覧ください。\n\n## よくある質問\n\n**Q. 従業員が全員辞めたあと、社長1人だけ残ります。全喪届は出しますか？**\nA. 法人であって代表者に報酬が支払われている限り、社会保険の適用事業所であり続けるため、その時点では全喪の届出には至りません。一方、雇用保険は被保険者がいなくなるため、雇用の見込みがなければ適用事業所廃止届の対象になります。**社会保険と雇用保険で結論が分かれる**のがこの場面です。\n\n**Q. 休業するだけで、いずれ再開するつもりです。それでも届出は必要ですか？**\nA. 再開の見込みがあるかどうかで扱いが変わります。厚生労働省の手引は、事業を休止して**再開の見込みがない**ときを廃止届の対象としています。見込みがある場合の扱いは、休業の期間や被保険者の状況によりますので、個別にご確認いただくところになります。\n\n**Q. 複数の法人を整理します。まとめて出せますか？**\nA. 届出は事業所（労働保険番号・事業所整理記号）ごとです。まとめて1通で出すことはできません。ただし廃止の日を揃えると、確定保険料の計算期間や資格喪失日が揃うため、実務としては楽になります。日程の組み方から一緒に検討したほうが早い場面です。費用は[報酬額表](/labor/ryokin)をご覧ください。\n\n**Q. 概算で納めた労働保険料が多すぎました。戻ってきますか？**\nA. 確定保険料が概算保険料を下回る場合、差額は充当または還付の対象になります。還付を受けるには、**労働保険料還付請求書（様式第8号）を確定保険料申告書と同時に**提出します。あとから請求すると手間が増えるので、確定申告書を作る段階で計算しておいてください。\n\n## この記事の根拠\n\n- 健康保険法施行規則（大正15年内務省令第36号）第20条第1項（全喪届）、第29条第1項（資格喪失届）\n- 厚生年金保険法施行規則（昭和29年厚生省令第37号）第13条の2第1項（全喪届）、第22条第1項（資格喪失届）\n- 雇用保険法施行規則（昭和50年労働省令第3号）第141条第1項（適用事業所廃止届）、第7条第1項・第3項（資格喪失届・離職証明書）\n- 労働保険の保険料の徴収等に関する法律（昭和44年法律第84号）第5条（保険関係の消滅）、第19条第1項（確定保険料）、附則第4条（暫定任意適用事業の保険関係消滅申請）\n- 厚生労働省「雇用保険事務手続きの手引き【第1編】適用事業所編【令和7年8月版】」（提出期日、被保険者0人・休止の場合の取扱い）\n- 日本年金機構「適用事業所が廃止等により適用事業所に該当しなくなったときの手続き」（提出時期・提出先・添付書類）\n- 条文はいずれも2026年8月13日時点でe-Gov法令検索により確認した現行条文です\n\n**この記事は、誰に相談するかまでは決めていません。** 労働・社会保険の届出と確定保険料の計算、離職理由の整理は社会保険労務士の業務です。解散・清算の登記は司法書士、清算事業年度の申告など税務は税理士へ、それぞれ直接ご依頼いただく形をご案内します。当事務所は紹介料を受け取りません。四葉社会保険労務士事務所にご相談いただく場合の費用は[報酬額表](/labor/ryokin)に、よくいただくご質問は[よくあるご質問](/labor/faq)にまとめています。\n\n本記事は一般的な情報提供です。個別のご事情に応じた判断は、面談のうえ資格者が行います。執筆は[浦松丈二](/about/uramatsu)（社会保険労務士・行政書士・宅地建物取引士）です。",
    "status": "published",
    "author": {
      "name": "浦松 丈二",
      "title": "社会保険労務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
    },
    "keywords": [
      "会社 廃業 社会保険 手続き",
      "適用事業所全喪届 期限",
      "雇用保険 適用事業所廃止届",
      "労働保険 確定保険料 廃業",
      "廃業 社会保険 資格喪失届",
      "会社 解散 労働保険"
    ],
    "tags": [
      "廃業",
      "全喪届",
      "労働保険",
      "社会保険",
      "手続"
    ],
    "locales": [],
    "faq": [
      {
        "question": "従業員が全員辞めたあと、社長1人だけ残ります。全喪届は出しますか？",
        "answer": "法人であって代表者に報酬が支払われている限り、社会保険の適用事業所であり続けるため、その時点では全喪の届出には至りません。一方、雇用保険は被保険者がいなくなるため、雇用の見込みがなければ適用事業所廃止届の対象になります。社会保険と雇用保険で結論が分かれるのがこの場面です。"
      },
      {
        "question": "休業するだけで、いずれ再開するつもりです。それでも届出は必要ですか？",
        "answer": "再開の見込みがあるかどうかで扱いが変わります。厚生労働省の手引は、事業を休止して再開の見込みがないときを廃止届の対象としています。見込みがある場合の扱いは、休業の期間や被保険者の状況によりますので、個別にご確認いただくところになります。"
      },
      {
        "question": "複数の法人を整理します。まとめて出せますか？",
        "answer": "届出は事業所（労働保険番号・事業所整理記号）ごとです。まとめて1通で出すことはできません。ただし廃止の日を揃えると、確定保険料の計算期間や資格喪失日が揃うため、実務としては楽になります。日程の組み方から一緒に検討したほうが早い場面です。費用は報酬額表をご覧ください。"
      },
      {
        "question": "概算で納めた労働保険料が多すぎました。戻ってきますか？",
        "answer": "確定保険料が概算保険料を下回る場合、差額は充当または還付の対象になります。還付を受けるには、労働保険料還付請求書（様式第8号）を確定保険料申告書と同時に提出します。あとから請求すると手間が増えるので、確定申告書を作る段階で計算しておいてください。"
      }
    ],
    "translations": {
      "en": {
        "title": "Winding up a company — what to do about social insurance and labour insurance",
        "excerpt": "When you wind up a company you need three things: the notification of total loss of covered workplace status for social insurance, the notification of abolition of a covered workplace for employment insurance, and the final insurance premium return for labour insurance. Notifications of loss of insured status are filed separately, one per person. There is no such notification as a \"labour insurance notification of extinction of the insurance relationship.\" The names, filing destinations and deadlines are set out in a table.",
        "content": "**In short:** When you wind up a company, three filings are needed: the **notification of total loss of covered workplace status** (適用事業所全喪届) for social insurance, the **notification of abolition of a covered workplace** (適用事業所廃止届) for employment insurance, and the **final insurance premium return** (確定保険料申告書) for labour insurance. Notifications of loss of insured status for the insured persons are filed separately, one per person. These deadlines fall before the registration is done.\n\nThere are plenty of articles on the procedures for setting a company up, but not many on the procedures for winding one down. That is probably because closures come up less often — but the deadlines include some that are shorter than at the start-up stage, and **if you wait for the registration to be completed, you will miss them**.\n\n## Which notifications are needed when you wind up a company?\n\nThey fall broadly into three streams. The filing destination and the deadline differ for each.\n\n| What | Where | By when | Basis |\n|---|---|---|---|\n| Health insurance / employees' pension insurance **notification of total loss of covered workplace status** (適用事業所全喪届) | The administration centre or the pension office with jurisdiction | **Within 5 days of the day the fact arose** | Regulation for Enforcement of the Health Insurance Act, Article 20, paragraph 1 / Regulation for Enforcement of the Employees' Pension Insurance Act, Article 13-2, paragraph 1 |\n| Employment insurance **notification of abolition of a covered workplace** (適用事業所廃止届) | The Hello Work with jurisdiction over the location of the workplace | **Within 10 days counting from the day after the day of abolition** | Regulation for Enforcement of the Employment Insurance Act, Article 141, paragraph 1 |\n| Labour insurance **final insurance premium return** (確定保険料申告書) | Any of the competent labour standards inspection office, the competent prefectural labour bureau, or the Bank of Japan | **Within 50 days of the day the insurance relationship was extinguished** | Act on Collection of Insurance Premiums of Labour Insurance, Article 19, paragraph 1 |\n\n**There is one point here that is widely misunderstood. There is no such notification as a \"labour insurance notification of extinction of the insurance relationship\" (労働保険 保険関係消滅届).**\n\nThe labour insurance relationship is extinguished **by operation of law on the day after** the business is abolished or terminated (Act on Collection of Insurance Premiums of Labour Insurance, Article 5). It is not something you file to have cancelled, so no form of \"notification of extinction\" exists in the first place. In practice, you convey the fact of the abolition by entering the date of abolition in the **\"date of abolition of business, etc.\" field** of the final insurance premium return.\n\nThere is an \"**application** for extinction of the insurance relationship\" (保険関係消滅申請書, Form No. 27), but that belongs to a scheme confined to **provisional voluntarily covered businesses under employment insurance**, and it requires the consent of three-quarters or more of the workers and official approval (Supplementary Provisions, Article 4 of the Collection Act). It is not used for compulsorily covered businesses. The names are similar, so take care if you come across it in a search.\n\n## What is the order, and what are the deadlines?\n\nThe \"day the insurance relationship was extinguished\" is the **day after** the day of abolition, so the 50 days are counted from there as well. The Ministry of Health, Labour and Welfare's handbook likewise states \"within 50 days counting from the day after the day the business was abolished.\"\n\nThe order in which you actually move is as follows.\n\n1. **Fix the employees' dates of resignation** (this is the starting point)\n2. File the employees' **notifications of loss of insured status** (social insurance and employment insurance — see below)\n3. Prepare the **final insurance premium return**. Where the amount paid as the estimated premium exceeds the final amount, file the **application for refund of labour insurance premiums (Form No. 8) at the same time**\n4. File the **notification of total loss of covered workplace status**. At this point, **a copy of the final insurance premium return (bearing the date of abolition of business, etc.)** is required as the document evidencing the fact\n5. File the **employment insurance notification of abolition of a covered workplace**\n\n**Note the order of 3 and 4.** Because a copy of the final insurance premium return is required as an attachment to the notification of total loss, social insurance cannot be completed until labour insurance has been dealt with first. Reverse the two and you generate a round trip.\n\n**The employment insurance notification of abolition also applies where \"the business continues but the number of employees has fallen to 0.\"** The Ministry's handbook says the notification of abolition is also filed where there are no longer any insured persons and no prospect of employment, and where the business has been suspended with no prospect of resumption. That is a separate question from whether the corporate entity still exists.\n\n## What has to be filed for the employees?\n\nThey are filed separately, one per person. The deadlines differ from those for the workplace-level notifications.\n\n| What | By when | Basis |\n|---|---|---|\n| Health insurance / employees' pension insurance **notification of loss of insured status** (被保険者資格喪失届) | **Within 5 days of the day the fact arose** | Regulation for Enforcement of the Health Insurance Act, Article 29, paragraph 1 / Regulation for Enforcement of the Employees' Pension Insurance Act, Article 22, paragraph 1 |\n| Employment insurance **notification of loss of insured status** (被保険者資格喪失届) | **Within 10 days counting from the day after the day the fact arose** | Regulation for Enforcement of the Employment Insurance Act, Article 7, paragraph 1 |\n\nThe employment insurance notification of loss of insured status is as a rule accompanied by a **separation certificate** (離職証明書, Form No. 5). It may be omitted where the person does not wish a separation slip to be issued, but **it may not be omitted for an insured person who is 59 or older on the date of separation** (paragraph 3 of the same Article). Resignations on a closure often include people around the age of 60, and this comes up frequently in practice.\n\nHow the reason for separation is written also bears directly on the person's unemployment benefits — whether it is at the company's convenience or the person's own, and whether it accompanies the abolition of the workplace. **Not writing anything contrary to the facts** comes first, but because the way the facts are written changes the conditions on which the person receives benefits, it is safer to check this from the stage at which the dates of resignation are fixed.\n\n## How does this divide from registration and tax?\n\n**It does divide.** Winding up a company means at least three streams running in parallel.\n\n| Stream | Content | Whose work it is |\n|---|---|---|\n| Labour and social insurance | Notification of total loss, notification of abolition, final insurance premium, notifications of loss of insured status | Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant) |\n| **Registration** | Registration of dissolution, registration of liquidators, registration of completion of liquidation | **A judicial scrivener** |\n| **Tax** | Notification of change, returns for the liquidation business years, the final tax return | **A tax accountant** |\n\n**We handle only the first row.** For registration we will point you to a judicial scrivener and for tax to a tax accountant, each of whom you engage directly. We do not receive referral fees. 四葉行政書士事務所 and this office are **separate business entities**, so even where you instruct both, you do so under **separate contracts**, and each accepts the work **separately**.\n\nJust one point on timing to fix in advance. **If you start the labour and social insurance procedures after the registration of dissolution is complete, the 5-day and 10-day deadlines may already have passed.** Once the employees' dates of resignation are fixed, the labour and social insurance side can start moving. There is no need to wait for the registration to be completed.\n\nThe notifications and deadlines when you set a company up are collected in [Once you have set up a company, what do you have to file and by when](/en/labor/column/kaisha-setsuritsu-shakaihoken-roudouhoken-kigen). Please also note there that the documents required at the entrance and at the exit do not map neatly onto one another.\n\n## Frequently asked questions\n\n**Q. After all the employees have left, only the president remains. Do we file the notification of total loss?**\nA. So long as the entity is a company and remuneration is paid to the representative, it remains a covered workplace for social insurance, so at that point you do not get as far as filing a notification of total loss. Employment insurance, on the other hand, no longer has any insured person, so if there is no prospect of employment it becomes subject to the notification of abolition of a covered workplace. This is the situation where **social insurance and employment insurance come to different conclusions**.\n\n**Q. We are only suspending operations and intend to resume in due course. Are notifications still needed?**\nA. The treatment differs according to whether there is a prospect of resumption. The Ministry's handbook treats a business suspended with **no prospect of resumption** as subject to the notification of abolition. Where there is a prospect, the treatment depends on the length of the suspension and the position of the insured persons, so that is a point to be confirmed case by case.\n\n**Q. We are winding up several companies. Can we file for them together?**\nA. Notifications are per workplace (per labour insurance number and per workplace reference number). They cannot be filed together in a single document. That said, aligning the dates of abolition aligns the calculation periods for the final insurance premium and the dates of loss of insured status, which makes the work easier in practice. This is a situation where it is quicker to consider the scheduling together from the outset. For fees, see the [fee schedule](/en/labor/ryokin).\n\n**Q. We paid too much in estimated labour insurance premiums. Do we get it back?**\nA. Where the final premium falls below the estimated premium, the difference is subject to set-off or refund. To obtain a refund, file the **application for refund of labour insurance premiums (Form No. 8) at the same time as** the final insurance premium return. Claiming afterwards adds work, so do the calculation at the stage when you prepare the final return.\n\n## Sources for this article\n\n- Regulation for Enforcement of the Health Insurance Act (健康保険法施行規則, Ordinance of the Ministry of Home Affairs No. 36 of 1926), Article 20, paragraph 1 (notification of total loss) and Article 29, paragraph 1 (notification of loss of insured status)\n- Regulation for Enforcement of the Employees' Pension Insurance Act (厚生年金保険法施行規則, Ordinance of the Ministry of Health and Welfare No. 37 of 1954), Article 13-2, paragraph 1 (notification of total loss) and Article 22, paragraph 1 (notification of loss of insured status)\n- Regulation for Enforcement of the Employment Insurance Act (雇用保険法施行規則, Ordinance of the Ministry of Labour No. 3 of 1975), Article 141, paragraph 1 (notification of abolition of a covered workplace) and Article 7, paragraphs 1 and 3 (notification of loss of insured status and separation certificate)\n- Act on Collection of Insurance Premiums of Labour Insurance (労働保険の保険料の徴収等に関する法律, Act No. 84 of 1969), Article 5 (extinction of the insurance relationship), Article 19, paragraph 1 (final insurance premium), Supplementary Provisions, Article 4 (application for extinction of the insurance relationship for a provisional voluntarily covered business)\n- Ministry of Health, Labour and Welfare, \"Handbook of employment insurance administrative procedures, Volume 1: covered workplaces, August 2025 (Reiwa 7) edition\" (filing dates; treatment where there are 0 insured persons or the business is suspended)\n- Japan Pension Service, \"Procedures where a covered workplace ceases to be a covered workplace due to abolition or other reasons\" (timing of filing, filing destination, attachments)\n- All provisions are those in force as confirmed through e-Gov law search as of 13 August 2026\n\n**This article stops short of deciding who you should consult.** The labour and social insurance notifications, the calculation of the final insurance premium, and putting the reasons for separation in order are the work of a Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant). For the registration of dissolution and liquidation we will point you to a judicial scrivener, and for tax matters such as the returns for the liquidation business years to a tax accountant, each of whom you engage directly under a separate contract. We do not receive referral fees. Fees for consulting 四葉社会保険労務士事務所 are set out in the [fee schedule](/en/labor/ryokin), and the questions we are asked most often are collected in [frequently asked questions](/en/labor/faq).\n\nThis article is general information. A judgement on your particular circumstances is made by a qualified professional after a meeting. Written by [Joji Uramatsu](/en/about/uramatsu) (Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist).",
        "category": "Procedures and deadlines",
        "keywords": [
          "company closure social insurance procedures",
          "notification of total loss of covered workplace status deadline",
          "employment insurance notification of abolition of covered workplace",
          "labour insurance final insurance premium closure",
          "closure social insurance notification of loss of insured status",
          "company dissolution labour insurance"
        ],
        "tags": [
          "Business closure",
          "Notification of total loss",
          "Labour insurance",
          "Social insurance",
          "Procedures"
        ],
        "author": {
          "name": "Joji Uramatsu",
          "title": "Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist — 四葉社会保険労務士事務所／四葉行政書士事務所"
        },
        "faq": [
          {
            "question": "After all the employees have left, only the president remains. Do we file the notification of total loss?",
            "answer": "So long as the entity is a company and remuneration is paid to the representative, it remains a covered workplace for social insurance, so at that point you do not get as far as filing a notification of total loss. Employment insurance, on the other hand, no longer has any insured person, so if there is no prospect of employment it becomes subject to the notification of abolition of a covered workplace. This is the situation where social insurance and employment insurance come to different conclusions."
          },
          {
            "question": "We are only suspending operations and intend to resume in due course. Are notifications still needed?",
            "answer": "The treatment differs according to whether there is a prospect of resumption. The Ministry's handbook treats a business suspended with no prospect of resumption as subject to the notification of abolition. Where there is a prospect, the treatment depends on the length of the suspension and the position of the insured persons, so that is a point to be confirmed case by case."
          },
          {
            "question": "We are winding up several companies. Can we file for them together?",
            "answer": "Notifications are per workplace (per labour insurance number and per workplace reference number). They cannot be filed together in a single document. That said, aligning the dates of abolition aligns the calculation periods for the final insurance premium and the dates of loss of insured status, which makes the work easier in practice. This is a situation where it is quicker to consider the scheduling together from the outset. For fees, see the fee schedule."
          },
          {
            "question": "We paid too much in estimated labour insurance premiums. Do we get it back?",
            "answer": "Where the final premium falls below the estimated premium, the difference is subject to set-off or refund. To obtain a refund, file the application for refund of labour insurance premiums (Form No. 8) at the same time as the final insurance premium return. Claiming afterwards adds work, so do the calculation at the stage when you prepare the final return."
          }
        ]
      },
      "zh-tw": {
        "title": "結束公司時，社會保險與勞動保險該怎麼辦",
        "excerpt": "結束公司時，需要社會保險的適用事業所全喪申報書、雇用保險的適用事業所廢止申報書、勞動保險的確定保險料申報書這3件。被保險人的資格喪失申報書則另外按人數提出。並不存在「勞動保險 保險關係消滅申報書」這種申報。本文把申報的名稱・提出處・期限整理成一覽表。",
        "content": "**結論（先講重點）**：結束公司時，需要**社會保險的適用事業所全喪申報書**（適用事業所全喪届）、**雇用保險的適用事業所廢止申報書**（適用事業所廃止届）、**勞動保險的確定保險料申報書**（確定保険料申告書）這3件。被保險人的資格喪失申報書則與這些分開，按人數提出。這些期限，會比登記先到來。\n\n寫公司設立手續的文章很多，但結束時的手續卻不太看得到。我想是因為處理廢業的場面比較少，但期限之中混有比開業時更短的，而且**等到登記結束才動作就來不及了**。\n\n## 結束公司時，需要哪些申報？\n\n大致分為3個系統。提出處與期限也各不相同。\n\n| 什麼 | 提出到哪裡 | 期限 | 依據 |\n|---|---|---|---|\n| 健康保險・厚生年金保險 **適用事業所全喪申報書**（適用事業所全喪届） | 事務中心或管轄的年金事務所 | **自事實發生之日起5日內** | 健康保險法施行規則第20條第1項／厚生年金保險法施行規則第13條之2第1項 |\n| 雇用保險 **適用事業所廢止申報書**（適用事業所廃止届） | 管轄事業所所在地的 Hello Work（公共職業安定所） | **自廢止之日的翌日起算10日內** | 雇用保險法施行規則第141條第1項 |\n| 勞動保險 **確定保險料申報書**（確定保険料申告書） | 所轄勞動基準監督署、所轄都道府縣勞動局、日本銀行三者之一 | **自保險關係消滅之日起50日內** | 勞動保險之保險料徵收等相關法律第19條第1項 |\n\n**這裡有一點經常被誤解。並不存在「勞動保險 保險關係消滅申報書」（労働保険 保険関係消滅届）這種申報。**\n\n勞動保險的保險關係，在事業廢止或終了時，於其**翌日依法律當然消滅**（勞動保險之保險料徵收等相關法律第5條）。它不是提出申報請對方註銷的東西，所以根本就沒有「消滅申報書」這種格式。實務上，是在確定保險料申報書的**「事業廢止等年月日」欄**填入廢止之日，藉此傳達廢止的事實。\n\n另外，「保險關係消滅**申請**書」（保険関係消滅申請書，樣式第27號）確實存在，但那是僅限於**雇用保險暫定任意適用事業**的制度，需要4分之3以上勞工的同意與認可（徵收法附則第4條）。強制適用的事業不使用它。名稱相似，若在搜尋時碰上請多留意。\n\n## 順序與期限是怎麼安排的？\n\n「保險關係消滅之日」是廢止日的**翌日**，所以50日也從那裡起算。厚生勞動省的手冊也標示為「自廢止事業之日的翌日起算50日內」。\n\n實際運作的順序如下。\n\n1. **確定員工的離職日**（這裡是起點）\n2. 提出員工的**資格喪失申報書**（社會保險・雇用保險。詳見下述）\n3. 製作**確定保險料申報書**。以概算繳納的金額超過確定金額時，要**同時**提出**勞動保險料退還請求書（樣式第8號）**\n4. 提出**全喪申報書**。此時會被要求提出**確定保險料申報書的影本（載有事業廢止等年月日者）**作為證明事實的文件\n5. 提出**雇用保險適用事業所廢止申報書**\n\n**請注意3與4的順序。** 因為全喪申報書的附件要求確定保險料申報書的影本，所以不先把勞動保險處理完，社會保險就結束不了。順序顛倒就會多跑一趟。\n\n**「事業仍在繼續，但員工變成0人」的情形，也是雇用保險廢止申報的對象。** 厚生勞動省的手冊指出，被保險人不復存在且已無雇用的可能時，以及事業休止且已無重啟的可能時，也要提出廢止申報。這與法人格是否還留著是兩回事。\n\n## 員工的部分要提出什麼？\n\n按人數另外提出。期限與事業所的申報不同。\n\n| 什麼 | 期限 | 依據 |\n|---|---|---|\n| 健康保險・厚生年金保險 **被保險人資格喪失申報書**（被保険者資格喪失届） | **自事實發生之日起5日內** | 健康保險法施行規則第29條第1項／厚生年金保險法施行規則第22條第1項 |\n| 雇用保險 **被保險人資格喪失申報書**（被保険者資格喪失届） | **自事實發生之日的翌日起算10日內** | 雇用保險法施行規則第7條第1項 |\n\n雇用保險的資格喪失申報書，原則上要附上**離職證明書**（離職証明書，樣式第5號）。本人不希望核發離職票時可以省略，但**對於離職日當日已滿59歲的被保險人不得省略**（同條第3項）。伴隨廢業的離職中，常包含60歲前後的人，這裡在實務上確實經常出問題。\n\n離職理由怎麼寫，也直接影響本人的失業給付。是公司因素還是個人因素、是否伴隨事業所的廢止。**不作與事實不符的記載**是第一要務，但由於事實的寫法會改變本人的受給條件，從決定離職日的階段就先確認過會比較安全。\n\n## 與登記、稅務是怎麼分開的？\n\n**是分開的。** 結束公司的手續，至少有3個系統並行推進。\n\n| 系統 | 內容 | 屬於誰的業務 |\n|---|---|---|\n| 勞動・社會保險 | 全喪申報、廢止申報、確定保險料、資格喪失申報 | 社會保險勞務士 |\n| **登記** | 解散登記、清算人登記、清算終結（清算結了）登記 | **司法書士** |\n| **稅務** | 異動申報書、清算事業年度的申報、最後的結算申報 | **稅理士** |\n\n**本所承辦的只有第1列。** 登記請找司法書士、稅務請找稅理士，分別直接委任。本所不收取介紹費。與四葉行政書士事務所是**各自獨立的事業體**，因此即使一併委託，也請**另行簽約**、分別承接。\n\n只有時間點的關係要請您先掌握。**如果等到解散登記結束才開始勞動・社會保險的手續，5日或10日的期限往往已經過了。** 員工的離職日一確定，勞動・社會保險這一側就可以開始動作，不需要等登記完成。\n\n公司設立時的申報與期限，整理在[設立公司之後，要在什麼時候之前提出什麼](/zh-tw/labor/column/kaisha-setsuritsu-shakaihoken-roudouhoken-kigen)。入口與出口所需的文件並非乾淨對應，這一點也請一併參閱。\n\n## 常見問題\n\n**Q. 員工全部離職之後，只剩社長1人。要提出全喪申報書嗎？**\nA. 只要是法人且對代表人支付報酬，就會持續作為社會保險的適用事業所，因此在該時點還不到提出全喪申報的程度。另一方面，雇用保險因為被保險人不復存在，若已無雇用的可能就會成為適用事業所廢止申報的對象。**社會保險與雇用保險的結論在此分岐**，正是這個場面。\n\n**Q. 只是休業，將來還打算重啟。這樣也需要申報嗎？**\nA. 依有無重啟的可能而處理不同。厚生勞動省的手冊把事業休止且**沒有重啟可能**的情形列為廢止申報的對象。有重啟可能時的處理，則取決於休業的期間與被保險人的狀況，屬於需要個別確認的部分。\n\n**Q. 要整理多間法人。可以一起提出嗎？**\nA. 申報是以事業所（勞動保險號碼・事業所整理記號）為單位。不能彙整成1份提出。不過只要把廢止日對齊，確定保險料的計算期間與資格喪失日也會對齊，實務上會比較輕鬆。這是從日程的安排方式開始一起檢討會比較快的場面。費用請見[報酬額表](/zh-tw/labor/ryokin)。\n\n**Q. 以概算繳納的勞動保險料繳太多了。會退回來嗎？**\nA. 確定保險料低於概算保險料時，差額會成為充抵或退還的對象。要取得退還，須**與確定保險料申報書同時**提出**勞動保險料退還請求書（樣式第8號）**。事後才請求會增加工夫，請在製作確定申報書的階段就先算好。\n\n## 本文的依據\n\n- 健康保險法施行規則（健康保険法施行規則，大正15年〈1926年〉內務省令第36號）第20條第1項（全喪申報）、第29條第1項（資格喪失申報）\n- 厚生年金保險法施行規則（厚生年金保険法施行規則，昭和29年〈1954年〉厚生省令第37號）第13條之2第1項（全喪申報）、第22條第1項（資格喪失申報）\n- 雇用保險法施行規則（雇用保険法施行規則，昭和50年〈1975年〉勞動省令第3號）第141條第1項（適用事業所廢止申報）、第7條第1項・第3項（資格喪失申報・離職證明書）\n- 勞動保險之保險料徵收等相關法律（労働保険の保険料の徴収等に関する法律，昭和44年〈1969年〉法律第84號）第5條（保險關係的消滅）、第19條第1項（確定保險料）、附則第4條（暫定任意適用事業的保險關係消滅申請）\n- 厚生勞動省「雇用保險事務手續手冊【第1編】適用事業所編【令和7年〈2025年〉8月版】」（提出期日、被保險人0人・休止情形的處理）\n- 日本年金機構「適用事業所因廢止等而不再該當適用事業所時的手續」（提出時期・提出處・附件）\n- 條文均為2026年8月13日時點以e-Gov法令檢索確認的現行條文\n\n**本文並未決定到「該找誰商量」為止。** 勞動・社會保險的申報與確定保險料的計算、離職理由的整理，是社會保險勞務士的業務。解散・清算的登記請找司法書士，清算事業年度的申報等稅務請找稅理士，**分別直接委任、另行簽約**。本所不收取介紹費。向四葉社会保険労務士事務所諮詢時的費用請見[報酬額表](/zh-tw/labor/ryokin)，常收到的提問則整理在[常見問答](/zh-tw/labor/faq)。\n\n本文為一般性的資訊提供。針對個別情況的判斷，由具備資格者於面談後作成。撰文者為[浦松丈二](/zh-tw/about/uramatsu)（社會保險勞務士・行政書士・宅地建物取引士）。",
        "category": "手續與期限",
        "keywords": [
          "公司 廢業 社會保險 手續",
          "適用事業所全喪申報 期限",
          "雇用保險 適用事業所廢止申報",
          "勞動保險 確定保險料 廢業",
          "廢業 社會保險 資格喪失申報",
          "公司 解散 勞動保險"
        ],
        "tags": [
          "廢業",
          "全喪申報",
          "勞動保險",
          "社會保險",
          "手續"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社會保險勞務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "員工全部離職之後，只剩社長1人。要提出全喪申報書嗎？",
            "answer": "只要是法人且對代表人支付報酬，就會持續作為社會保險的適用事業所，因此在該時點還不到提出全喪申報的程度。另一方面，雇用保險因為被保險人不復存在，若已無雇用的可能就會成為適用事業所廢止申報的對象。社會保險與雇用保險的結論在此分岐，正是這個場面。"
          },
          {
            "question": "只是休業，將來還打算重啟。這樣也需要申報嗎？",
            "answer": "依有無重啟的可能而處理不同。厚生勞動省的手冊把事業休止且沒有重啟可能的情形列為廢止申報的對象。有重啟可能時的處理，則取決於休業的期間與被保險人的狀況，屬於需要個別確認的部分。"
          },
          {
            "question": "要整理多間法人。可以一起提出嗎？",
            "answer": "申報是以事業所（勞動保險號碼・事業所整理記號）為單位。不能彙整成1份提出。不過只要把廢止日對齊，確定保險料的計算期間與資格喪失日也會對齊，實務上會比較輕鬆。這是從日程的安排方式開始一起檢討會比較快的場面。費用請見報酬額表。"
          },
          {
            "question": "以概算繳納的勞動保險料繳太多了。會退回來嗎？",
            "answer": "確定保險料低於概算保險料時，差額會成為充抵或退還的對象。要取得退還，須與確定保險料申報書同時提出勞動保險料退還請求書（樣式第8號）。事後才請求會增加工夫，請在製作確定申報書的階段就先算好。"
          }
        ]
      },
      "zh": {
        "title": "结束公司时，社会保险与劳动保险该怎么办",
        "excerpt": "结束公司时，需要社会保险的适用事业所全丧申报书、雇用保险的适用事业所废止申报书、劳动保险的确定保险料申报书这3件。被保险人的资格丧失申报书则另外按人数提出。并不存在「劳动保险 保险关系消灭申报书」这种申报。本文把申报的名称・提交处・期限整理成一览表。",
        "content": "**结论（先讲重点）**：结束公司时，需要**社会保险的适用事业所全丧申报书**（適用事業所全喪届）、**雇用保险的适用事业所废止申报书**（適用事業所廃止届）、**劳动保险的确定保险料申报书**（確定保険料申告書）这3件。被保险人的资格丧失申报书则与这些分开，按人数提出。这些期限，会比登记先到来。\n\n写公司设立手续的文章很多，但结束时的手续却不太看得到。我想是因为处理废业的场面比较少，但期限之中混有比开业时更短的，而且**等到登记结束才行动就来不及了**。\n\n## 结束公司时，需要哪些申报？\n\n大致分为3个系统。提交处与期限也各不相同。\n\n| 什么 | 提交到哪里 | 期限 | 依据 |\n|---|---|---|---|\n| 健康保险・厚生年金保险 **适用事业所全丧申报书**（適用事業所全喪届） | 事务中心或管辖的年金事务所 | **自事实发生之日起5日内** | 健康保险法施行规则第20条第1项／厚生年金保险法施行规则第13条之2第1项 |\n| 雇用保险 **适用事业所废止申报书**（適用事業所廃止届） | 管辖事业所所在地的 Hello Work（公共职业安定所） | **自废止之日的次日起算10日内** | 雇用保险法施行规则第141条第1项 |\n| 劳动保险 **确定保险料申报书**（確定保険料申告書） | 所辖劳动基准监督署、所辖都道府县劳动局、日本银行三者之一 | **自保险关系消灭之日起50日内** | 劳动保险之保险料征收等相关法律第19条第1项 |\n\n**这里有一点经常被误解。并不存在「劳动保险 保险关系消灭申报书」（労働保険 保険関係消滅届）这种申报。**\n\n劳动保险的保险关系，在事业废止或终了时，于其**次日依法律当然消灭**（劳动保险之保险料征收等相关法律第5条）。它不是提出申报请对方注销的东西，所以根本就没有「消灭申报书」这种格式。实务上，是在确定保险料申报书的**「事业废止等年月日」栏**填入废止之日，借此传达废止的事实。\n\n另外，「保险关系消灭**申请**书」（保険関係消滅申請書，样式第27号）确实存在，但那是仅限于**雇用保险暂定任意适用事业**的制度，需要4分之3以上劳动者的同意与认可（征收法附则第4条）。强制适用的事业不使用它。名称相似，若在检索时碰上请多留意。\n\n## 顺序与期限是怎么安排的？\n\n「保险关系消灭之日」是废止日的**次日**，所以50日也从那里起算。厚生劳动省的手册也标示为「自废止事业之日的次日起算50日内」。\n\n实际推进的顺序如下。\n\n1. **确定员工的离职日**（这里是起点）\n2. 提出员工的**资格丧失申报书**（社会保险・雇用保险。详见下述）\n3. 制作**确定保险料申报书**。以概算缴纳的金额超过确定金额时，要**同时**提出**劳动保险料退还请求书（样式第8号）**\n4. 提出**全丧申报书**。此时会被要求提交**确定保险料申报书的复印件（载有事业废止等年月日者）**作为证明事实的文件\n5. 提出**雇用保险适用事业所废止申报书**\n\n**请注意3与4的顺序。** 因为全丧申报书的附件要求确定保险料申报书的复印件，所以不先把劳动保险处理完，社会保险就结束不了。顺序颠倒就会多跑一趟。\n\n**「事业仍在继续，但员工变成0人」的情形，也是雇用保险废止申报的对象。** 厚生劳动省的手册指出，被保险人不复存在且已无雇用的可能时，以及事业休止且已无重启的可能时，也要提出废止申报。这与法人资格是否还留着是两回事。\n\n## 员工的部分要提出什么？\n\n按人数另外提出。期限与事业所的申报不同。\n\n| 什么 | 期限 | 依据 |\n|---|---|---|\n| 健康保险・厚生年金保险 **被保险人资格丧失申报书**（被保険者資格喪失届） | **自事实发生之日起5日内** | 健康保险法施行规则第29条第1项／厚生年金保险法施行规则第22条第1项 |\n| 雇用保险 **被保险人资格丧失申报书**（被保険者資格喪失届） | **自事实发生之日的次日起算10日内** | 雇用保险法施行规则第7条第1项 |\n\n雇用保险的资格丧失申报书，原则上要附上**离职证明书**（離職証明書，样式第5号）。本人不希望核发离职票时可以省略，但**对于离职日当日已满59岁的被保险人不得省略**（同条第3项）。伴随废业的离职中，常包含60岁前后的人，这里在实务上确实经常出问题。\n\n离职理由怎么写，也直接影响本人的失业给付。是公司原因还是个人原因、是否伴随事业所的废止。**不作与事实不符的记载**是第一要务，但由于事实的写法会改变本人的受给条件，从决定离职日的阶段就先确认过会比较安全。\n\n## 与登记、税务是怎么分开的？\n\n**是分开的。** 结束公司的手续，至少有3个系统并行推进。\n\n| 系统 | 内容 | 属于谁的业务 |\n|---|---|---|\n| 劳动・社会保险 | 全丧申报、废止申报、确定保险料、资格丧失申报 | 社会保险劳务士 |\n| **登记** | 解散登记、清算人登记、清算终结（清算結了）登记 | **司法书士** |\n| **税务** | 异动申报书、清算事业年度的申报、最后的结算申报 | **税理士** |\n\n**本所承办的只有第1行。** 登记请找司法书士、税务请找税理士，分别直接委任。本所不收取介绍费。与四葉行政書士事務所是**各自独立的事业体**，因此即使一并委托，也请**另行签约**、分别承接。\n\n只有时间点的关系要请您先掌握。**如果等到解散登记结束才开始劳动・社会保险的手续，5日或10日的期限往往已经过了。** 员工的离职日一确定，劳动・社会保险这一侧就可以开始行动，不需要等登记完成。\n\n公司设立时的申报与期限，整理在[设立公司之后，要在什么时候之前提出什么](/zh/labor/column/kaisha-setsuritsu-shakaihoken-roudouhoken-kigen)。入口与出口所需的文件并非干净对应，这一点也请一并参阅。\n\n## 常见问题\n\n**Q. 员工全部离职之后，只剩社长1人。要提出全丧申报书吗？**\nA. 只要是法人且对代表人支付报酬，就会持续作为社会保险的适用事业所，因此在该时点还不到提出全丧申报的程度。另一方面，雇用保险因为被保险人不复存在，若已无雇用的可能就会成为适用事业所废止申报的对象。**社会保险与雇用保险的结论在此分歧**，正是这个场面。\n\n**Q. 只是停业，将来还打算重启。这样也需要申报吗？**\nA. 依有无重启的可能而处理不同。厚生劳动省的手册把事业休止且**没有重启可能**的情形列为废止申报的对象。有重启可能时的处理，则取决于停业的期间与被保险人的状况，属于需要个别确认的部分。\n\n**Q. 要整理多家法人。可以一起提出吗？**\nA. 申报是以事业所（劳动保险号码・事业所整理记号）为单位。不能汇总成1份提出。不过只要把废止日对齐，确定保险料的计算期间与资格丧失日也会对齐，实务上会比较轻松。这是从日程的安排方式开始一起研究会比较快的场面。费用请见[报酬额表](/zh/labor/ryokin)。\n\n**Q. 以概算缴纳的劳动保险料缴太多了。会退回来吗？**\nA. 确定保险料低于概算保险料时，差额会成为抵充或退还的对象。要取得退还，须**与确定保险料申报书同时**提出**劳动保险料退还请求书（样式第8号）**。事后才请求会增加工夫，请在制作确定申报书的阶段就先算好。\n\n## 本文的依据\n\n- 健康保险法施行规则（健康保険法施行規則，大正15年〈1926年〉内务省令第36号）第20条第1项（全丧申报）、第29条第1项（资格丧失申报）\n- 厚生年金保险法施行规则（厚生年金保険法施行規則，昭和29年〈1954年〉厚生省令第37号）第13条之2第1项（全丧申报）、第22条第1项（资格丧失申报）\n- 雇用保险法施行规则（雇用保険法施行規則，昭和50年〈1975年〉劳动省令第3号）第141条第1项（适用事业所废止申报）、第7条第1项・第3项（资格丧失申报・离职证明书）\n- 劳动保险之保险料征收等相关法律（労働保険の保険料の徴収等に関する法律，昭和44年〈1969年〉法律第84号）第5条（保险关系的消灭）、第19条第1项（确定保险料）、附则第4条（暂定任意适用事业的保险关系消灭申请）\n- 厚生劳动省「雇用保险事务手续手册【第1编】适用事业所编【令和7年〈2025年〉8月版】」（提交期日、被保险人0人・休止情形的处理）\n- 日本年金机构「适用事业所因废止等而不再该当适用事业所时的手续」（提交时期・提交处・附件）\n- 条文均为2026年8月13日时点以e-Gov法令检索确认的现行条文\n\n**本文并未决定到「该找谁商量」为止。** 劳动・社会保险的申报与确定保险料的计算、离职理由的整理，是社会保险劳务士的业务。解散・清算的登记请找司法书士，清算事业年度的申报等税务请找税理士，**分别直接委任、另行签约**。本所不收取介绍费。向四葉社会保険労務士事務所咨询时的费用请见[报酬额表](/zh/labor/ryokin)，常收到的提问则整理在[常见问答](/zh/labor/faq)。\n\n本文为一般性的信息提供。针对个别情况的判断，由具备资格者于面谈后作出。撰文者为[浦松丈二](/zh/about/uramatsu)（社会保险劳务士・行政书士・宅地建物取引士）。",
        "category": "手续与期限",
        "keywords": [
          "公司 废业 社会保险 手续",
          "适用事业所全丧申报 期限",
          "雇用保险 适用事业所废止申报",
          "劳动保险 确定保险料 废业",
          "废业 社会保险 资格丧失申报",
          "公司 解散 劳动保险"
        ],
        "tags": [
          "废业",
          "全丧申报",
          "劳动保险",
          "社会保险",
          "手续"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社会保险劳务士・行政书士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "员工全部离职之后，只剩社长1人。要提出全丧申报书吗？",
            "answer": "只要是法人且对代表人支付报酬，就会持续作为社会保险的适用事业所，因此在该时点还不到提出全丧申报的程度。另一方面，雇用保险因为被保险人不复存在，若已无雇用的可能就会成为适用事业所废止申报的对象。社会保险与雇用保险的结论在此分歧，正是这个场面。"
          },
          {
            "question": "只是停业，将来还打算重启。这样也需要申报吗？",
            "answer": "依有无重启的可能而处理不同。厚生劳动省的手册把事业休止且没有重启可能的情形列为废止申报的对象。有重启可能时的处理，则取决于停业的期间与被保险人的状况，属于需要个别确认的部分。"
          },
          {
            "question": "要整理多家法人。可以一起提出吗？",
            "answer": "申报是以事业所（劳动保险号码・事业所整理记号）为单位。不能汇总成1份提出。不过只要把废止日对齐，确定保险料的计算期间与资格丧失日也会对齐，实务上会比较轻松。这是从日程的安排方式开始一起研究会比较快的场面。费用请见报酬额表。"
          },
          {
            "question": "以概算缴纳的劳动保险料缴太多了。会退回来吗？",
            "answer": "确定保险料低于概算保险料时，差额会成为抵充或退还的对象。要取得退还，须与确定保险料申报书同时提出劳动保险料退还请求书（样式第8号）。事后才请求会增加工夫，请在制作确定申报书的阶段就先算好。"
          }
        ]
      }
    }
  },
  {
    "business": "labor",
    "slug": "nenkin-jukyuchu-koyo-zaishoku-rorei",
    "title": "年金をもらいながら働く人を雇うとき",
    "date": "2026-09-01",
    "category": "社会保険",
    "excerpt": "老齢厚生年金は、給与と合わせて一定額を超えると一部が止まります。令和8年4月以降の支給停止調整額は65万円です。65万円までは、いくら払っても年金は減りません。繰下げ待機中に在職老齢年金で止まった額は増額の対象にならない点も、あわせて整理します。",
    "content": "**結論（先に要点）**：老齢厚生年金は、給与と合わせて一定額を超えると一部が止まります。**令和8年4月以降の基準額は65万円**です。超えた分の2分の1が止まる計算なので、**65万円までは、いくら払っても年金は減りません**。\n\n60代・70代の方を迎えるときに、「年金が止まるから給与は抑えてほしい」と本人から言われることがあります。以前はその通りでしたが、令和8年4月から基準額が大きく上がり、中小企業の給与水準ではほとんど止まらなくなりました。**古い前提のまま賃金を決めていると、払えるはずの給与を払わずに済ませてしまいます。**\n\n## 働くと、年金はいくら止まるのか？\n\n厚生年金保険法第46条第1項が、次のように定めています。**基本月額**（老齢厚生年金の額を12で割った額）と**総報酬月額相当額**（標準報酬月額＋直近1年間の賞与の12分の1）の合計が**支給停止調整額**を超えると、超えた額の2分の1が止まります。\n\n式にすると次のとおりです。\n\n> **支給停止額（月額）＝（基本月額 ＋ 総報酬月額相当額 − 65万円）÷ 2**\n\n支給停止調整額は、年度ごとに改定されます。\n\n| 年度 | 支給停止調整額 |\n|---|---|\n| 令和6年度 | 50万円 |\n| 令和7年度 | 51万円 |\n| **令和8年度（2026年4月〜）** | **65万円** |\n\n（厚生労働省「令和8年度の年金額改定についてお知らせします」令和8年1月23日）\n\n**51万円から65万円へ、一度に14万円上がりました。** 令和7年法律第74号による引上げが令和8年4月に施行されたものです。\n\nなお、厚生労働省の法案説明資料には「50万円→**62万円**」という記載があります。これは**令和6年度価格の法定額**で、条文（厚生年金保険法第46条第3項）に書かれている数字です。同項ただし書により毎年度改定されるため、令和8年度の実額が65万円になります。**62万円と65万円は矛盾ではありません。**\n\n止まるのは**老齢厚生年金の報酬比例部分**だけです。老齢基礎年金は在職老齢年金による支給停止の対象になりません。\n\n## 何歳まで、どの保険に入るのか？\n\n制度ごとに上限が違います。ここは表で押さえてください。\n\n| 制度 | 加入の上限 | 根拠 |\n|---|---|---|\n| 労災保険 | **上限なし** | 労働者であれば年齢を問わない |\n| 雇用保険 | **上限なし**。65歳以上は**高年齢被保険者** | 雇用保険法第37条の2第1項 |\n| **厚生年金保険** | **70歳未満** | 厚生年金保険法第9条、第14条第5号 |\n| **健康保険** | **75歳**（後期高齢者医療へ移行） | 健康保険法第3条第1項第7号、高齢者の医療の確保に関する法律第50条第1号 |\n| 介護保険（第2号被保険者） | 65歳で第1号被保険者へ | ― |\n\n**健康保険に70歳の上限はありません。** 70歳で抜けるのは厚生年金保険だけで、健康保険は75歳まで続きます。ここは混同されやすいところです。\n\n**資格喪失の日付にもくせがあります。** 厚生年金保険は「70歳に達したとき」に**その日**に資格を喪失します（厚生年金保険法第14条第5号）。「70歳に達したとき」は誕生日の**前日**なので、喪失日も誕生日の前日です。健康保険の75歳到達による喪失は誕生日の**当日**です。1日ずれます。\n\n### 70歳以上被用者該当届\n\n70歳を過ぎても働き続ける方については、**70歳以上被用者該当届**が必要になる場合があります。厚生年金保険の被保険者ではなくなっても、在職老齢年金の計算に給与を反映させるためです（厚生年金保険法第27条）。\n\n| 場合 | 届出 |\n|---|---|\n| 70歳到達日時点の標準報酬月額相当額が、**前日の標準報酬月額と異なる** | **必要**（70歳到達日から5日以内） |\n| 同額である | **不要**（日本年金機構側で処理。平成31年4月からの取扱い） |\n| 70歳以上で**新たに雇い入れた** | 必要 |\n\n（厚生年金保険法施行規則第10条の4、第15条の2）\n\n対象になるのは、**過去に厚生年金保険の被保険者期間がある方**です。一度も加入したことがない方は対象になりません。\n\n## 繰下げを考えている人を雇うとき、何に気をつけるのか？\n\n**ここが、いちばん誤解の多いところです。**\n\n繰下げ受給は、年金の受給開始を遅らせて増額を受ける制度です。ところが、**繰下げの待機期間中に在職老齢年金で支給停止された額は、増額の対象になりません。**\n\n日本年金機構は次のように説明しています。繰下げ加算額を計算するとき、在職老齢年金により支給停止される額に相当する部分を除き、**平均支給率**を掛けて計算する。\n\n> 平均支給率 ＝ 月単位での支給率の合計 ÷ 繰下げ待機期間\n> 月単位での支給率 ＝ 1 −（在職支給停止額 ÷ 65歳時の老齢厚生年金額）\n\n法律上は、厚生年金保険法第44条の3第4項が、繰下げ加算額を「第46条第1項の規定の例により計算したその支給を停止するものとされた額を勘案して政令で定める額」としており、ここが根拠になります。\n\n**つまり「止まった分は、あとで増えて返ってくる」わけではありません。** 止まった分は、そのまま受け取れないまま終わります。\n\nとはいえ、令和8年4月に基準額が65万円まで上がったことで、**止まる方自体が大きく減りました**。基本月額が月10万円の方なら、総報酬月額相当額が55万円までは1円も止まりません。**「繰下げるから給与を抑えてほしい」というご要望があった場合は、実際に止まるのかどうかを一度計算してみてください。** 抑える必要がないことが多いはずです。\n\nなお、**老齢基礎年金の繰下げは在職老齢年金の影響を受けません。** 厚生年金と基礎年金は別々に繰下げを選べるため、選び方の相談は本人が年金事務所にされるのが確実です。\n\n## 賃金は、どう設計すればいいのか？\n\n順番としては、**①本人の基本月額を確認する → ②65万円から基本月額を引く → ③その額が総報酬月額相当額の上限になる**、です。\n\n例えば基本月額が12万円なら、総報酬月額相当額が53万円までは支給停止が生じません。中小企業の給与水準では、**多くの場合、意識せずに済む範囲**に収まります。\n\n意識が必要になるのは、次のような場合です。\n\n- 役員報酬が高く、総報酬月額相当額が50万円を超える\n- 賞与が大きく、総報酬月額相当額（直近1年の賞与の12分の1を含む）が跳ね上がる\n- 基本月額が大きい（長期加入・高額報酬の期間が長い）\n\n**賞与の設計には特に注意してください。** 総報酬月額相当額には直近1年間の賞与の12分の1が入るため、年1回の賞与でも12か月にわたって影響します。月給を抑えて賞与を厚くしても、在職老齢年金の計算では均されます。\n\n2027年9月からは標準報酬月額の上限が65万円から68万円に上がり、その後も2028年9月に71万円、2029年9月に75万円と段階的に引き上げられます。高額報酬の方については、**標準報酬月額が上がることで総報酬月額相当額も上がる**点を、あわせて見ておいてください。\n\n短時間で雇う場合の加入の基準は[短い時間で雇うと、社会保険はどうなるか](/labor/column/tanjikan-koyo-shakaihoken-4bunno3)に、業務委託で来てもらう場合の注意は[外注と雇用の境目は、契約書では決まらない](/labor/column/gaichu-koyo-sakaime-roudoushasei)にまとめています。\n\n## よくある質問\n\n**Q. 65万円という額は、来年も同じですか？**\nA. 支給停止調整額は年度ごとに改定されます（厚生年金保険法第46条第3項ただし書）。名目賃金の変動に応じて改定されるため、令和9年度以降の額は改定の結果によります。毎年1月下旬に厚生労働省が翌年度の年金額改定を公表しますので、そこでご確認ください。\n\n**Q. 本人が「年金が止まるので月20万円までにしてほしい」と言っています。どう説明すればよいですか？**\nA. まず基本月額を確認していただくのが早道です。ねんきん定期便や年金事務所で確認できます。基本月額が分かれば、65万円から引いた額が支給停止の生じない上限になります。多くの場合、月20万円という水準は上限をはるかに下回りますので、**抑える必要がないことをその場で示せます**。ただし本人の年金額は個人情報ですので、本人から確認していただく形になります。\n\n**Q. 70歳を過ぎた方を新しく雇いました。何を出しますか？**\nA. 厚生年金保険の被保険者にはなりませんが、**70歳以上被用者該当届**の対象になります。健康保険については75歳未満であれば被保険者になりますので、健康保険の資格取得届もあわせて必要です。雇用保険も、週20時間以上であれば高年齢被保険者として加入します。**3つの制度で扱いが分かれる**ので、届出の抜けが出やすい場面です。\n\n**Q. 在職中に年金額が増えることはありますか？**\nA. 65歳以降も厚生年金保険に加入して働いた期間は年金額に反映され、在職定時改定により毎年10月分から増額される仕組みがあります。ただし増えた分も在職老齢年金の計算対象になります。個別の見込み額は年金事務所でご確認いただくのが確実です。当方では、給与や賞与をどう設計すると支給停止が生じるかの整理をお手伝いしています。費用は[報酬額表](/labor/ryokin)をご覧ください。\n\n## この記事の根拠\n\n- 厚生年金保険法（昭和29年法律第115号）第9条、第14条第5号、第27条、第44条の3第4項、第46条第1項・第3項\n- 厚生年金保険法施行規則（昭和29年厚生省令第37号）第10条の4、第15条の2、第22条の2\n- 健康保険法（大正11年法律第70号）第3条第1項第7号、第36条第3号\n- 高齢者の医療の確保に関する法律（昭和57年法律第80号）第50条第1号、第52条第1号\n- 雇用保険法（昭和49年法律第116号）第37条の2第1項\n- 社会経済の変化を踏まえた年金制度の機能強化のための国民年金法等の一部を改正する等の法律（令和7年法律第74号）\n- **支給停止調整額65万円の出典**：厚生労働省「令和8年度の年金額改定についてお知らせします」（**令和8年1月23日**）、日本年金機構「在職老齢年金の計算方法」（**2026年4月1日更新**）\n- **繰下げと在職支給停止の関係の出典**：日本年金機構「年金の繰下げ受給」（**2026年8月12日更新**）\n- 繰下げ加算額の具体的な計算方法を定める政令の条番号は特定していません（**未検証**）\n- 条文はいずれも2026年8月13日時点でe-Gov法令検索により確認した現行条文です\n\n**この記事は、誰に相談するかまでは決めていません。** 賃金・賞与の設計、届出の要否の判定、標準報酬月額の管理は社会保険労務士の業務です。ご本人の年金見込額や繰下げの選択は日本年金機構（年金事務所）へ、役員報酬の税務の扱いは税理士へ、それぞれ直接ご確認・ご依頼いただく形をご案内します。当事務所は紹介料を受け取りません。四葉社会保険労務士事務所にご相談いただく場合の費用は[報酬額表](/labor/ryokin)に、よくいただくご質問は[よくあるご質問](/labor/faq)にまとめています。\n\n本記事は一般的な情報提供です。個別のご事情に応じた判断は、面談のうえ資格者が行います。執筆は[浦松丈二](/about/uramatsu)（社会保険労務士・行政書士・宅地建物取引士）です。",
    "status": "published",
    "author": {
      "name": "浦松 丈二",
      "title": "社会保険労務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
    },
    "keywords": [
      "在職老齢年金 65万円",
      "支給停止調整額 令和8年度",
      "年金 もらいながら 働く 上限",
      "70歳以上被用者該当届",
      "繰下げ 在職老齢年金 増額されない",
      "高齢者 雇用 社会保険 何歳まで"
    ],
    "tags": [
      "在職老齢年金",
      "高年齢者雇用",
      "厚生年金保険",
      "繰下げ受給",
      "賃金設計"
    ],
    "locales": [],
    "faq": [
      {
        "question": "65万円という額は、来年も同じですか？",
        "answer": "支給停止調整額は年度ごとに改定されます（厚生年金保険法第46条第3項ただし書）。名目賃金の変動に応じて改定されるため、令和9年度以降の額は改定の結果によります。毎年1月下旬に厚生労働省が翌年度の年金額改定を公表しますので、そこでご確認ください。"
      },
      {
        "question": "本人が「年金が止まるので月20万円までにしてほしい」と言っています。どう説明すればよいですか？",
        "answer": "まず基本月額を確認していただくのが早道です。ねんきん定期便や年金事務所で確認できます。基本月額が分かれば、65万円から引いた額が支給停止の生じない上限になります。多くの場合、月20万円という水準は上限をはるかに下回りますので、抑える必要がないことをその場で示せます。ただし本人の年金額は個人情報ですので、本人から確認していただく形になります。"
      },
      {
        "question": "70歳を過ぎた方を新しく雇いました。何を出しますか？",
        "answer": "厚生年金保険の被保険者にはなりませんが、70歳以上被用者該当届の対象になります。健康保険については75歳未満であれば被保険者になりますので、健康保険の資格取得届もあわせて必要です。雇用保険も、週20時間以上であれば高年齢被保険者として加入します。3つの制度で扱いが分かれるので、届出の抜けが出やすい場面です。"
      },
      {
        "question": "在職中に年金額が増えることはありますか？",
        "answer": "65歳以降も厚生年金保険に加入して働いた期間は年金額に反映され、在職定時改定により毎年10月分から増額される仕組みがあります。ただし増えた分も在職老齢年金の計算対象になります。個別の見込み額は年金事務所でご確認いただくのが確実です。当方では、給与や賞与をどう設計すると支給停止が生じるかの整理をお手伝いしています。費用は報酬額表をご覧ください。"
      }
    ],
    "translations": {
      "en": {
        "title": "When You Employ Someone Who Is Already Drawing a Pension",
        "excerpt": "The old-age employees' pension is partly suspended once it and pay together exceed a set amount. The suspension adjustment amount from April 2026 is 650,000 yen, and up to 650,000 yen no level of pay reduces the pension. This article also sets out why an amount suspended during a deferral waiting period never comes back as an increase.",
        "content": "**In short:** the old-age employees' pension is partly suspended once it and pay together exceed a set amount. **From April 2026 (令和8年4月) the threshold is 650,000 yen.** Half of the excess is suspended, so **up to 650,000 yen you can pay whatever you like and the pension is not reduced.**\n\nWhen you take on someone in their 60s or 70s, they will sometimes ask you to hold their pay down \"because my pension will stop.\" That used to be sound. But the threshold rose sharply in April 2026, and at the pay levels of a small or medium-sized company the pension now rarely stops at all. **If you set wages on the old assumption, you end up not paying wages you could have paid.**\n\n## How much of the pension stops when the person works?\n\nThe Employees' Pension Insurance Act (厚生年金保険法, Act No. 115 of 1954), Article 46, paragraph 1, provides as follows. Where the **basic monthly amount** (the old-age employees' pension divided by 12) and the **monthly remuneration equivalent** (the standard monthly remuneration plus one-twelfth of the bonuses paid in the preceding 12 months) together exceed the **suspension adjustment amount**, half of the excess is suspended.\n\nAs a formula:\n\n> **Suspended amount (per month) = (basic monthly amount + monthly remuneration equivalent − 650,000 yen) ÷ 2**\n\nThe suspension adjustment amount is revised each fiscal year.\n\n| Fiscal year | Suspension adjustment amount |\n|---|---|\n| FY2024 (令和6年度) | 500,000 yen |\n| FY2025 (令和7年度) | 510,000 yen |\n| **FY2026 (令和8年度, from April 2026)** | **650,000 yen** |\n\n(Ministry of Health, Labour and Welfare, \"令和8年度の年金額改定についてお知らせします\", 23 January 2026 (令和8年1月23日))\n\n**That is a jump of 140,000 yen at once, from 510,000 yen to 650,000 yen.** It is the increase made by Act No. 74 of 2025 (令和7年法律第74号), which took effect in April 2026.\n\nNote that the Ministry's explanatory material for the bill states \"500,000 yen → **620,000 yen**\". That is the **statutory amount at FY2024 (令和6年度) prices**, the figure written into the Act itself (Employees' Pension Insurance Act, Article 46, paragraph 3). Because the proviso to that paragraph revises the amount every fiscal year, the actual amount for FY2026 comes out at 650,000 yen. **620,000 yen and 650,000 yen are not in conflict.**\n\nWhat is suspended is only the **earnings-related portion of the old-age employees' pension**. The old-age basic pension (老齢基礎年金) is not subject to suspension under the in-work old-age pension rules.\n\n## Up to what age does each insurance scheme apply?\n\nThe upper limits differ from scheme to scheme. This is best held as a table.\n\n| Scheme | Upper limit on coverage | Basis |\n|---|---|---|\n| Workers' accident compensation insurance (労災保険) | **No upper limit** | Age is irrelevant so long as the person is a worker |\n| Employment insurance (雇用保険) | **No upper limit.** From age 65, an older-worker insured person (高年齢被保険者) | Employment Insurance Act (雇用保険法, Act No. 116 of 1974), Article 37-2, paragraph 1 |\n| **Employees' Pension Insurance (厚生年金保険)** | **Under 70** | Employees' Pension Insurance Act, Article 9 and Article 14, item 5 |\n| **Health insurance (健康保険)** | **75** (transfers to medical care for the late-stage elderly) | Health Insurance Act (健康保険法, Act No. 70 of 1922), Article 3, paragraph 1, item 7; Act on Assurance of Medical Care for Elderly People (高齢者の医療の確保に関する法律, Act No. 80 of 1982), Article 50, item 1 |\n| Long-term care insurance (介護保険), Category 2 insured person | Becomes a Category 1 insured person at 65 | — |\n\n**There is no age-70 upper limit in health insurance.** What ends at 70 is Employees' Pension Insurance only; health insurance continues until 75. This is where the two are most often confused.\n\n**The dates on which coverage is lost also have a quirk.** Under Employees' Pension Insurance, coverage is lost **on the day** the person \"reaches the age of 70\" (Employees' Pension Insurance Act, Article 14, item 5). \"Reaching the age of 70\" means the **day before** the birthday, so the date of loss is the day before the birthday as well. Loss of health insurance on reaching 75 falls on the birthday **itself**. The two are one day apart.\n\n### Notification for an employee aged 70 or over (70歳以上被用者該当届)\n\nFor someone who keeps working past 70, a **notification for an employee aged 70 or over (70歳以上被用者該当届)** may be required. Even though the person is no longer an insured person under Employees' Pension Insurance, the notification allows the pay to be reflected in the in-work old-age pension calculation (Employees' Pension Insurance Act, Article 27).\n\n| Situation | Notification |\n|---|---|\n| The amount equivalent to the standard monthly remuneration on the day of reaching 70 **differs from the standard monthly remuneration on the previous day** | **Required** (within 5 days of the day of reaching 70) |\n| The amounts are the same | **Not required** (handled on the Japan Pension Service side; the treatment applied since April 2019 (平成31年4月)) |\n| The person is **newly hired** at 70 or over | Required |\n\n(Ordinance for Enforcement of the Employees' Pension Insurance Act (厚生年金保険法施行規則, Ordinance of the Ministry of Health and Welfare No. 37 of 1954), Article 10-4 and Article 15-2)\n\nThis applies to people who **have a past period of coverage under Employees' Pension Insurance**. Someone who has never been covered is outside the scope.\n\n## What should you watch when you employ someone who is thinking about deferral?\n\n**This is where the misunderstandings are most common.**\n\nDeferred receipt is the arrangement under which you put off the start of your pension in exchange for an increase. However, **an amount suspended by the in-work old-age pension rules during the deferral waiting period is not subject to that increase.**\n\nThe Japan Pension Service (日本年金機構) explains it this way. When the deferral supplement is calculated, the portion corresponding to the amount suspended under the in-work old-age pension rules is excluded and the **average payment rate** is applied.\n\n> Average payment rate = the sum of the monthly payment rates ÷ the deferral waiting period\n> Monthly payment rate = 1 − (the in-work suspended amount ÷ the old-age employees' pension amount at age 65)\n\nIn law, the basis is the Employees' Pension Insurance Act, Article 44-3, paragraph 4, which defines the deferral supplement as \"an amount specified by Cabinet Order taking into account the amount that was to be suspended, calculated in accordance with the provisions of Article 46, paragraph 1.\"\n\n**So the amount that stopped does not come back later as an increase.** What stopped simply stays unreceived.\n\nThat said, because the threshold rose to 650,000 yen in April 2026, **far fewer people are affected at all**. For someone with a basic monthly amount of 100,000 yen, nothing is suspended until the monthly remuneration equivalent reaches 550,000 yen. **If you are asked to hold pay down \"because I am deferring,\" work out first whether anything would actually stop.** In most cases there will be no need to hold anything down.\n\nNote also that **deferral of the old-age basic pension is unaffected by the in-work old-age pension rules.** Because the employees' pension and the basic pension can be deferred separately, the surest route for advice on which to choose is for the person to go to a pension office themselves.\n\n## How should the pay be designed?\n\nThe order is: **(1) confirm the person's basic monthly amount → (2) subtract it from 650,000 yen → (3) the result is the ceiling on the monthly remuneration equivalent.**\n\nFor example, with a basic monthly amount of 120,000 yen, no suspension arises until the monthly remuneration equivalent reaches 530,000 yen. At the pay levels of a small or medium-sized company, **in most cases this stays in a range you never have to think about**.\n\nYou do need to think about it in cases such as these.\n\n- Director's remuneration is high and the monthly remuneration equivalent exceeds 500,000 yen\n- Bonuses are large, so the monthly remuneration equivalent (which includes one-twelfth of the bonuses of the preceding 12 months) jumps\n- The basic monthly amount is large (a long period of coverage, or long periods of high remuneration)\n\n**Take particular care with bonus design.** Because the monthly remuneration equivalent includes one-twelfth of the preceding 12 months' bonuses, even a once-a-year bonus has an effect across 12 months. Holding down monthly pay and loading the bonus instead is levelled out in the in-work old-age pension calculation.\n\nFrom September 2027 the upper limit on the standard monthly remuneration rises from 650,000 yen to 680,000 yen, and it then rises in stages to 710,000 yen in September 2028 and 750,000 yen in September 2029. For people on high remuneration, keep an eye on the fact that **a higher standard monthly remuneration also raises the monthly remuneration equivalent**.\n\nThe coverage tests for short-hours employment are set out in [What happens to social insurance when you hire someone for short hours](/en/labor/column/tanjikan-koyo-shakaihoken-4bunno3), and the points to watch when someone comes in under a contract for services are in [The line between outsourcing and employment is not settled by the contract](/en/labor/column/gaichu-koyo-sakaime-roudoushasei).\n\n## Frequently asked questions\n\n**Q. Will the figure of 650,000 yen be the same next year?**\nA. The suspension adjustment amount is revised each fiscal year (Employees' Pension Insurance Act, Article 46, paragraph 3, proviso). Because it is revised in line with movements in nominal wages, the amount for FY2027 (令和9年度) and later depends on the outcome of that revision. The Ministry of Health, Labour and Welfare announces the following year's pension revision in late January each year, so please check it there.\n\n**Q. The person says \"my pension will stop, so please keep me to 200,000 yen a month.\" How should I explain it?**\nA. The quickest route is to ask them to confirm their basic monthly amount. It can be checked on the annual pension notice (ねんきん定期便) or at a pension office. Once the basic monthly amount is known, subtracting it from 650,000 yen gives the ceiling below which no suspension arises. In most cases a level of 200,000 yen a month is far below that ceiling, so **you can show on the spot that there is no need to hold anything down**. Note that the person's own pension amount is personal information, so it has to be the person themselves who confirms it.\n\n**Q. I have newly hired someone over 70. What do I file?**\nA. They do not become an insured person under Employees' Pension Insurance, but they are within the scope of the **notification for an employee aged 70 or over (70歳以上被用者該当届)**. For health insurance, someone under 75 does become an insured person, so a health insurance notification of acquisition of insured status is needed as well. For employment insurance, someone working 20 hours a week or more is covered as an older-worker insured person. **The three schemes are treated differently**, which is why filings are easy to miss here.\n\n**Q. Can the pension amount increase while the person is still working?**\nA. Periods worked with Employees' Pension Insurance coverage after age 65 are reflected in the pension amount, and the periodic revision while in work (在職定時改定) increases it from the October payment each year. The increase is itself then taken into account in the in-work old-age pension calculation. For an individual estimate, a pension office is the reliable place to ask. What we help with is working through how pay and bonuses can be designed so that a suspension does or does not arise. For fees, please see the [fee schedule](/en/labor/ryokin).\n\n## Sources for this article\n\n- 厚生年金保険法 (Employees' Pension Insurance Act, Act No. 115 of 1954), Article 9, Article 14 item 5, Article 27, Article 44-3 paragraph 4, Article 46 paragraphs 1 and 3\n- 厚生年金保険法施行規則 (Ordinance for Enforcement of the Employees' Pension Insurance Act, Ordinance of the Ministry of Health and Welfare No. 37 of 1954), Article 10-4, Article 15-2, Article 22-2\n- 健康保険法 (Health Insurance Act, Act No. 70 of 1922), Article 3 paragraph 1 item 7, Article 36 item 3\n- 高齢者の医療の確保に関する法律 (Act on Assurance of Medical Care for Elderly People, Act No. 80 of 1982), Article 50 item 1, Article 52 item 1\n- 雇用保険法 (Employment Insurance Act, Act No. 116 of 1974), Article 37-2 paragraph 1\n- 社会経済の変化を踏まえた年金制度の機能強化のための国民年金法等の一部を改正する等の法律 (令和7年法律第74号 / Act No. 74 of 2025)\n- **Source for the 650,000 yen suspension adjustment amount**: Ministry of Health, Labour and Welfare, \"令和8年度の年金額改定についてお知らせします\" (**23 January 2026 / 令和8年1月23日**); Japan Pension Service, \"在職老齢年金の計算方法\" (**updated 1 April 2026**)\n- **Source for the relationship between deferral and in-work suspension**: Japan Pension Service, \"年金の繰下げ受給\" (**updated 12 August 2026**)\n- The article number of the Cabinet Order setting out the specific method of calculating the deferral supplement has not been identified (**unverified**)\n- All provisions are the versions in force as confirmed on e-Gov法令検索 as of 13 August 2026\n\n**This article does not go so far as to decide who you should consult.** Designing wages and bonuses, judging whether a filing is required, and managing standard monthly remuneration are the work of a Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant). For an individual's estimated pension amount and for the choice of whether to defer, we point you to the Japan Pension Service (a pension office); for the tax treatment of directors' remuneration, to a tax accountant — in each case to be confirmed or instructed by you directly. We do not accept referral fees. Fees for consulting 四葉社会保険労務士事務所 are set out in the [fee schedule](/en/labor/ryokin), and the questions we are asked most often in [frequently asked questions](/en/labor/faq).\n\nThis article is general information. Judgments that turn on your particular circumstances are made by a qualified professional after a consultation. Written by [Joji Uramatsu](/en/about/uramatsu) (Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist).",
        "category": "Social insurance",
        "keywords": [
          "in-work old-age pension 650,000 yen",
          "suspension adjustment amount FY2026",
          "working while drawing a pension pay ceiling",
          "notification for an employee aged 70 or over",
          "deferred pension suspended amount not increased",
          "employing older workers social insurance age limits"
        ],
        "tags": [
          "In-work old-age pension",
          "Employing older workers",
          "Employees' Pension Insurance",
          "Deferred receipt",
          "Pay design"
        ],
        "author": {
          "name": "Joji Uramatsu",
          "title": "Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist — 四葉社会保険労務士事務所／四葉行政書士事務所"
        },
        "faq": [
          {
            "question": "Will the figure of 650,000 yen be the same next year?",
            "answer": "The suspension adjustment amount is revised each fiscal year (Employees' Pension Insurance Act, Article 46, paragraph 3, proviso). Because it is revised in line with movements in nominal wages, the amount for FY2027 (令和9年度) and later depends on the outcome of that revision. The Ministry of Health, Labour and Welfare announces the following year's pension revision in late January each year, so please check it there."
          },
          {
            "question": "The person says \"my pension will stop, so please keep me to 200,000 yen a month.\" How should I explain it?",
            "answer": "The quickest route is to ask them to confirm their basic monthly amount. It can be checked on the annual pension notice (ねんきん定期便) or at a pension office. Once the basic monthly amount is known, subtracting it from 650,000 yen gives the ceiling below which no suspension arises. In most cases a level of 200,000 yen a month is far below that ceiling, so you can show on the spot that there is no need to hold anything down. Note that the person's own pension amount is personal information, so it has to be the person themselves who confirms it."
          },
          {
            "question": "I have newly hired someone over 70. What do I file?",
            "answer": "They do not become an insured person under Employees' Pension Insurance, but they are within the scope of the notification for an employee aged 70 or over (70歳以上被用者該当届). For health insurance, someone under 75 does become an insured person, so a health insurance notification of acquisition of insured status is needed as well. For employment insurance, someone working 20 hours a week or more is covered as an older-worker insured person. The three schemes are treated differently, which is why filings are easy to miss here."
          },
          {
            "question": "Can the pension amount increase while the person is still working?",
            "answer": "Periods worked with Employees' Pension Insurance coverage after age 65 are reflected in the pension amount, and the periodic revision while in work (在職定時改定) increases it from the October payment each year. The increase is itself then taken into account in the in-work old-age pension calculation. For an individual estimate, a pension office is the reliable place to ask. What we help with is working through how pay and bonuses can be designed so that a suspension does or does not arise. For fees, please see the fee schedule."
          }
        ]
      },
      "zh-tw": {
        "title": "僱用一邊領年金一邊工作的人時",
        "excerpt": "老齡厚生年金與薪資合計超過一定金額時，會有一部分停止支給。令和8年（2026年）4月以後的支給停止調整額為65萬日圓，在65萬日圓以內，薪資給得再多年金也不會減少。本文一併整理延後請領的等待期間內，被在職老齡年金停止的金額不會成為增額對象這一點。",
        "content": "**結論（先講重點）**：老齡厚生年金與薪資合計超過一定金額時，會有一部分停止支給。**令和8年（2026年）4月以後的基準金額為65萬日圓**。計算方式是超過部分的二分之一停止，因此**在65萬日圓以內，薪資給得再多，年金都不會減少**。\n\n要迎接60多歲、70多歲的人才時，本人有時會說「年金會被停掉，所以薪資請壓低一點」。以前確實如此，但令和8年4月起基準金額大幅提高，以中小企業的薪資水準來說幾乎不會被停。**若仍依照舊的前提來決定薪資，等於是把本來付得出來的薪資省下來不付。**\n\n## 一邊工作，年金會被停掉多少？\n\n厚生年金保険法（昭和29年法律第115號）第46條第1項規定如下。**基本月額**（老齡厚生年金金額除以12）與**總報酬月額相當額**（標準報酬月額＋最近1年獎金的十二分之一）合計超過**支給停止調整額**時，超過金額的二分之一會停止支給。\n\n寫成算式如下。\n\n> **支給停止額（月額）＝（基本月額 ＋ 總報酬月額相當額 − 65萬日圓）÷ 2**\n\n支給停止調整額每年度改定。\n\n| 年度 | 支給停止調整額 |\n|---|---|\n| 令和6年度（2024年度） | 50萬日圓 |\n| 令和7年度（2025年度） | 51萬日圓 |\n| **令和8年度（2026年4月〜）** | **65萬日圓** |\n\n（厚生勞動省「令和8年度の年金額改定についてお知らせします」令和8年1月23日）\n\n**從51萬日圓一口氣提高到65萬日圓，一次上調了14萬日圓。** 這是依令和7年法律第74號的調高規定，於令和8年4月施行的結果。\n\n另外，厚生勞動省的法案說明資料中有「50萬日圓→**62萬日圓**」的記載。這是**令和6年度價格的法定金額**，也就是條文（厚生年金保険法第46條第3項）所寫的數字。依同項但書規定每年度改定，因此令和8年度的實際金額為65萬日圓。**62萬日圓與65萬日圓並不矛盾。**\n\n會被停止的只有**老齡厚生年金的報酬比例部分**。老齡基礎年金不屬於在職老齡年金支給停止的對象。\n\n## 到幾歲為止，要加入哪一種保險？\n\n各制度的上限並不相同。這裡請用表格記住。\n\n| 制度 | 加入的上限 | 依據 |\n|---|---|---|\n| 勞災保險 | **無上限** | 只要是勞工，不問年齡 |\n| 雇用保險 | **無上限**。65歲以上為**高年齡被保險者** | 雇用保険法第37條之2第1項 |\n| **厚生年金保險** | **未滿70歲** | 厚生年金保険法第9條、第14條第5號 |\n| **健康保險** | **75歲**（轉入後期高齡者醫療） | 健康保険法第3條第1項第7號、高齢者の医療の確保に関する法律第50條第1號 |\n| 介護保險（第2號被保險者） | 65歲起轉為第1號被保險者 | ― |\n\n**健康保險沒有70歲的上限。** 70歲時脫離的只有厚生年金保險，健康保險會持續到75歲。這裡是最容易混淆的地方。\n\n**喪失資格的日期也有其特殊之處。** 厚生年金保險是在「達到70歲時」**當天**喪失資格（厚生年金保険法第14條第5號）。「達到70歲時」指的是生日的**前一天**，因此喪失日也是生日的前一天。健康保險因達到75歲而喪失資格，則是在生日**當天**。兩者相差一天。\n\n### 70歳以上被用者該当届\n\n對於超過70歲仍繼續工作的人，有時需要提出**70歳以上被用者該当届**（70歲以上被用者符合通知書）。這是為了即使不再是厚生年金保險的被保險者，仍能將薪資反映到在職老齡年金的計算中（厚生年金保険法第27條）。\n\n| 情形 | 申報 |\n|---|---|\n| 達到70歲當日的標準報酬月額相當額，**與前一天的標準報酬月額不同** | **需要**（自達到70歲之日起5日內） |\n| 金額相同 | **不需要**（由日本年金機構端處理。平成31年4月起的作法） |\n| 70歲以上**新僱用**的情形 | 需要 |\n\n（厚生年金保険法施行規則第10條之4、第15條之2）\n\n適用對象是**過去曾有厚生年金保險被保險者期間的人**。從未加入過的人不在對象範圍內。\n\n## 僱用正在考慮延後請領的人時，要注意什麼？\n\n**這裡是誤解最多的地方。**\n\n延後請領（繰下げ受給）是延後年金開始請領的時點以換取增額的制度。然而，**在延後請領的等待期間內，因在職老齡年金而被停止支給的金額，不會成為增額的對象。**\n\n日本年金機構說明如下。計算延後加算額時，要扣除相當於因在職老齡年金而停止支給的部分，再乘以**平均支給率**計算。\n\n> 平均支給率 ＝ 以月為單位的支給率合計 ÷ 延後請領等待期間\n> 以月為單位的支給率 ＝ 1 −（在職支給停止額 ÷ 65歲時的老齡厚生年金金額）\n\n在法律上，厚生年金保険法第44條之3第4項將延後加算額規定為「依第46條第1項規定之例計算所得、應停止支給之金額，斟酌後由政令所定之金額」，這就是依據所在。\n\n**也就是說，並不是「被停掉的部分之後會增額還回來」。** 被停掉的部分，就這樣領不到而結束。\n\n不過，由於令和8年4月基準金額提高到65萬日圓，**會被停止的人本身已經大幅減少**。基本月額為每月10萬日圓的人，總報酬月額相當額在55萬日圓以內都不會被停掉1日圓。**若本人提出「因為要延後請領，希望薪資壓低」的要求，請先實際計算一次是否真的會被停止。** 多數情況下應該都沒有壓低的必要。\n\n另外，**老齡基礎年金的延後請領不受在職老齡年金的影響。** 厚生年金與基礎年金可以分別選擇是否延後，因此關於如何選擇，由本人直接向年金事務所諮詢最為確實。\n\n## 薪資該如何設計？\n\n順序是：**①確認本人的基本月額 → ②以65萬日圓減去基本月額 → ③該金額即為總報酬月額相當額的上限**。\n\n例如基本月額為12萬日圓時，總報酬月額相當額在53萬日圓以內都不會產生支給停止。以中小企業的薪資水準而言，**多數情況都落在不需要特別留意的範圍內**。\n\n需要留意的是以下這些情形。\n\n- 董監事報酬較高，總報酬月額相當額超過50萬日圓\n- 獎金金額大，使總報酬月額相當額（含最近1年獎金的十二分之一）大幅跳升\n- 基本月額較大（長期加入、高額報酬的期間較長）\n\n**獎金的設計請特別注意。** 由於總報酬月額相當額會計入最近1年獎金的十二分之一，即使一年只發一次獎金，影響也會持續12個月。壓低月薪、把獎金加厚，在在職老齡年金的計算上會被平均掉。\n\n自2027年9月起，標準報酬月額的上限將從65萬日圓提高到68萬日圓，之後也會在2028年9月提高到71萬日圓、2029年9月提高到75萬日圓，分階段調升。對於高額報酬的人，請一併留意**標準報酬月額提高，總報酬月額相當額也會跟著提高**這一點。\n\n以短時數僱用時的加保基準整理於[以短時數僱用時，社會保險會怎麼樣](/zh-tw/labor/column/tanjikan-koyo-shakaihoken-4bunno3)，以業務委託形式請人前來時的注意事項則整理於[外包與僱用的界線，並非由契約書決定](/zh-tw/labor/column/gaichu-koyo-sakaime-roudoushasei)。\n\n## 常見問題\n\n**Q. 65萬日圓這個金額，明年也一樣嗎？**\nA. 支給停止調整額每年度改定（厚生年金保険法第46條第3項但書）。由於是依名目工資的變動來改定，令和9年度以後的金額取決於改定的結果。厚生勞動省每年1月下旬會公布次年度的年金額改定，屆時請於該處確認。\n\n**Q. 本人說「年金會被停掉，所以希望控制在每月20萬日圓以內」。該如何說明？**\nA. 請本人先確認基本月額是最快的方式，可透過「ねんきん定期便」（年金定期通知）或年金事務所查詢。知道基本月額後，以65萬日圓減去該金額，就是不會產生支給停止的上限。多數情況下，每月20萬日圓的水準遠低於該上限，因此**可以當場說明沒有壓低的必要**。不過本人的年金金額屬於個人資料，需由本人自行確認。\n\n**Q. 我們新僱用了一位超過70歲的人。要提出什麼？**\nA. 該員不會成為厚生年金保險的被保險者，但屬於**70歳以上被用者該当届**的對象。健康保險方面，未滿75歲仍會成為被保險者，因此也需要一併提出健康保險的資格取得申報。雇用保險方面，每週20小時以上者會以高年齡被保險者的身分加保。**三種制度的處理各自不同**，是容易漏報的場面。\n\n**Q. 在職期間，年金金額有可能增加嗎？**\nA. 65歲以後仍加入厚生年金保險工作的期間會反映到年金金額上，並透過在職定時改定於每年10月分起增額。不過增加的部分同樣會成為在職老齡年金的計算對象。個別的預估金額，向年金事務所確認最為確實。本所可協助整理薪資與獎金如何設計會產生支給停止。費用請參見[報酬金額表](/zh-tw/labor/ryokin)。\n\n## 本文的依據\n\n- 厚生年金保険法（昭和29年法律第115號）第9條、第14條第5號、第27條、第44條之3第4項、第46條第1項・第3項\n- 厚生年金保険法施行規則（昭和29年厚生省令第37號）第10條之4、第15條之2、第22條之2\n- 健康保険法（大正11年法律第70號）第3條第1項第7號、第36條第3號\n- 高齢者の医療の確保に関する法律（昭和57年法律第80號）第50條第1號、第52條第1號\n- 雇用保険法（昭和49年法律第116號）第37條之2第1項\n- 社会経済の変化を踏まえた年金制度の機能強化のための国民年金法等の一部を改正する等の法律（令和7年法律第74號）\n- **支給停止調整額65萬日圓的出處**：厚生勞動省「令和8年度の年金額改定についてお知らせします」（**令和8年1月23日**）、日本年金機構「在職老齢年金の計算方法」（**2026年4月1日更新**）\n- **延後請領與在職支給停止之關係的出處**：日本年金機構「年金の繰下げ受給」（**2026年8月12日更新**）\n- 規定延後加算額具體計算方法的政令條號尚未特定（**未經查證**）\n- 以上條文均為2026年8月13日時點以e-Gov法令検索確認的現行條文\n\n**本文並未替您決定該找誰諮詢。** 薪資與獎金的設計、申報要否的判斷、標準報酬月額的管理，是社會保險勞務士的業務。本人的年金預估金額與延後請領的選擇請洽日本年金機構（年金事務所），董監事報酬的稅務處理請洽稅理士，均由您直接確認或委任。本所不收取介紹費。委託四葉社会保険労務士事務所諮詢時的費用整理於[報酬金額表](/zh-tw/labor/ryokin)，常收到的提問則整理於[常見問題](/zh-tw/labor/faq)。\n\n本文為一般性資訊提供。依個別情況所為的判斷，由具備資格者於面談後進行。撰文者為[浦松丈二](/zh-tw/about/uramatsu)（社會保險勞務士・行政書士・宅地建物取引士）。",
        "category": "社會保險",
        "keywords": [
          "在職老齡年金 65萬日圓",
          "支給停止調整額 令和8年度",
          "一邊領年金一邊工作 薪資上限",
          "70歳以上被用者該当届",
          "延後請領 在職老齡年金 不會增額",
          "高齡者 僱用 社會保險 到幾歲"
        ],
        "tags": [
          "在職老齡年金",
          "高齡者僱用",
          "厚生年金保險",
          "延後請領",
          "薪資設計"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社會保險勞務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "65萬日圓這個金額，明年也一樣嗎？",
            "answer": "支給停止調整額每年度改定（厚生年金保険法第46條第3項但書）。由於是依名目工資的變動來改定，令和9年度以後的金額取決於改定的結果。厚生勞動省每年1月下旬會公布次年度的年金額改定，屆時請於該處確認。"
          },
          {
            "question": "本人說「年金會被停掉，所以希望控制在每月20萬日圓以內」。該如何說明？",
            "answer": "請本人先確認基本月額是最快的方式，可透過「ねんきん定期便」（年金定期通知）或年金事務所查詢。知道基本月額後，以65萬日圓減去該金額，就是不會產生支給停止的上限。多數情況下，每月20萬日圓的水準遠低於該上限，因此可以當場說明沒有壓低的必要。不過本人的年金金額屬於個人資料，需由本人自行確認。"
          },
          {
            "question": "我們新僱用了一位超過70歲的人。要提出什麼？",
            "answer": "該員不會成為厚生年金保險的被保險者，但屬於70歳以上被用者該当届的對象。健康保險方面，未滿75歲仍會成為被保險者，因此也需要一併提出健康保險的資格取得申報。雇用保險方面，每週20小時以上者會以高年齡被保險者的身分加保。三種制度的處理各自不同，是容易漏報的場面。"
          },
          {
            "question": "在職期間，年金金額有可能增加嗎？",
            "answer": "65歲以後仍加入厚生年金保險工作的期間會反映到年金金額上，並透過在職定時改定於每年10月分起增額。不過增加的部分同樣會成為在職老齡年金的計算對象。個別的預估金額，向年金事務所確認最為確實。本所可協助整理薪資與獎金如何設計會產生支給停止。費用請參見報酬金額表。"
          }
        ]
      },
      "zh": {
        "title": "雇用一边领年金一边工作的人时",
        "excerpt": "老龄厚生年金与工资合计超过一定金额时，会有一部分停止支付。令和8年（2026年）4月以后的支给停止调整额为65万日元，在65万日元以内，工资给得再多年金也不会减少。本文一并整理延后请领的等待期间内，被在职老龄年金停止的金额不会成为增额对象这一点。",
        "content": "**结论（先讲重点）**：老龄厚生年金与工资合计超过一定金额时，会有一部分停止支付。**令和8年（2026年）4月以后的基准金额为65万日元**。计算方式是超过部分的二分之一停止，因此**在65万日元以内，工资给得再多，年金都不会减少**。\n\n要接纳60多岁、70多岁的人才时，本人有时会说“年金会被停掉，所以工资请压低一点”。以前确实如此，但令和8年4月起基准金额大幅提高，以中小企业的工资水准来说几乎不会被停。**若仍按照旧的前提来决定工资，等于是把本来付得出来的工资省下来不付。**\n\n## 一边工作，年金会被停掉多少？\n\n厚生年金保険法（昭和29年法律第115号）第46条第1项规定如下。**基本月额**（老龄厚生年金金额除以12）与**总报酬月额相当额**（标准报酬月额＋最近1年奖金的十二分之一）合计超过**支给停止调整额**时，超过金额的二分之一会停止支付。\n\n写成算式如下。\n\n> **支给停止额（月额）＝（基本月额 ＋ 总报酬月额相当额 − 65万日元）÷ 2**\n\n支给停止调整额每年度改定。\n\n| 年度 | 支给停止调整额 |\n|---|---|\n| 令和6年度（2024年度） | 50万日元 |\n| 令和7年度（2025年度） | 51万日元 |\n| **令和8年度（2026年4月〜）** | **65万日元** |\n\n（厚生劳动省「令和8年度の年金額改定についてお知らせします」令和8年1月23日）\n\n**从51万日元一口气提高到65万日元，一次上调了14万日元。** 这是依令和7年法律第74号的调高规定，于令和8年4月施行的结果。\n\n另外，厚生劳动省的法案说明资料中有“50万日元→**62万日元**”的记载。这是**令和6年度价格的法定金额**，也就是条文（厚生年金保険法第46条第3项）所写的数字。依同项但书规定每年度改定，因此令和8年度的实际金额为65万日元。**62万日元与65万日元并不矛盾。**\n\n会被停止的只有**老龄厚生年金的报酬比例部分**。老龄基础年金不属于在职老龄年金支给停止的对象。\n\n## 到几岁为止，要加入哪一种保险？\n\n各制度的上限并不相同。这里请用表格记住。\n\n| 制度 | 加入的上限 | 依据 |\n|---|---|---|\n| 劳灾保险 | **无上限** | 只要是劳动者，不问年龄 |\n| 雇用保险 | **无上限**。65岁以上为**高年龄被保险者** | 雇用保険法第37条之2第1项 |\n| **厚生年金保险** | **未满70岁** | 厚生年金保険法第9条、第14条第5号 |\n| **健康保险** | **75岁**（转入后期高龄者医疗） | 健康保険法第3条第1项第7号、高齢者の医療の確保に関する法律第50条第1号 |\n| 介护保险（第2号被保险者） | 65岁起转为第1号被保险者 | ― |\n\n**健康保险没有70岁的上限。** 70岁时脱离的只有厚生年金保险，健康保险会持续到75岁。这里是最容易混淆的地方。\n\n**丧失资格的日期也有其特殊之处。** 厚生年金保险是在“达到70岁时”**当天**丧失资格（厚生年金保険法第14条第5号）。“达到70岁时”指的是生日的**前一天**，因此丧失日也是生日的前一天。健康保险因达到75岁而丧失资格，则是在生日**当天**。两者相差一天。\n\n### 70歳以上被用者該当届\n\n对于超过70岁仍继续工作的人，有时需要提出**70歳以上被用者該当届**（70岁以上被用者符合申报书）。这是为了即使不再是厚生年金保险的被保险者，仍能将工资反映到在职老龄年金的计算中（厚生年金保険法第27条）。\n\n| 情形 | 申报 |\n|---|---|\n| 达到70岁当日的标准报酬月额相当额，**与前一天的标准报酬月额不同** | **需要**（自达到70岁之日起5日内） |\n| 金额相同 | **不需要**（由日本年金机构端处理。平成31年4月起的做法） |\n| 70岁以上**新雇用**的情形 | 需要 |\n\n（厚生年金保険法施行規則第10条之4、第15条之2）\n\n适用对象是**过去曾有厚生年金保险被保险者期间的人**。从未加入过的人不在对象范围内。\n\n## 雇用正在考虑延后请领的人时，要注意什么？\n\n**这里是误解最多的地方。**\n\n延后请领（繰下げ受給）是延后年金开始请领的时点以换取增额的制度。然而，**在延后请领的等待期间内，因在职老龄年金而被停止支付的金额，不会成为增额的对象。**\n\n日本年金机构说明如下。计算延后加算额时，要扣除相当于因在职老龄年金而停止支付的部分，再乘以**平均支给率**计算。\n\n> 平均支给率 ＝ 以月为单位的支给率合计 ÷ 延后请领等待期间\n> 以月为单位的支给率 ＝ 1 −（在职支给停止额 ÷ 65岁时的老龄厚生年金金额）\n\n在法律上，厚生年金保険法第44条之3第4项将延后加算额规定为“依第46条第1项规定之例计算所得、应停止支付之金额，斟酌后由政令所定之金额”，这就是依据所在。\n\n**也就是说，并不是“被停掉的部分之后会增额还回来”。** 被停掉的部分，就这样领不到而结束。\n\n不过，由于令和8年4月基准金额提高到65万日元，**会被停止的人本身已经大幅减少**。基本月额为每月10万日元的人，总报酬月额相当额在55万日元以内都不会被停掉1日元。**若本人提出“因为要延后请领，希望工资压低”的要求，请先实际计算一次是否真的会被停止。** 多数情况下应该都没有压低的必要。\n\n另外，**老龄基础年金的延后请领不受在职老龄年金的影响。** 厚生年金与基础年金可以分别选择是否延后，因此关于如何选择，由本人直接向年金事务所咨询最为确实。\n\n## 工资该如何设计？\n\n顺序是：**①确认本人的基本月额 → ②以65万日元减去基本月额 → ③该金额即为总报酬月额相当额的上限**。\n\n例如基本月额为12万日元时，总报酬月额相当额在53万日元以内都不会产生支给停止。以中小企业的工资水准而言，**多数情况都落在不需要特别留意的范围内**。\n\n需要留意的是以下这些情形。\n\n- 董监事报酬较高，总报酬月额相当额超过50万日元\n- 奖金金额大，使总报酬月额相当额（含最近1年奖金的十二分之一）大幅跳升\n- 基本月额较大（长期加入、高额报酬的期间较长）\n\n**奖金的设计请特别注意。** 由于总报酬月额相当额会计入最近1年奖金的十二分之一，即使一年只发一次奖金，影响也会持续12个月。压低月薪、把奖金加厚，在在职老龄年金的计算上会被平均掉。\n\n自2027年9月起，标准报酬月额的上限将从65万日元提高到68万日元，之后也会在2028年9月提高到71万日元、2029年9月提高到75万日元，分阶段调升。对于高额报酬的人，请一并留意**标准报酬月额提高，总报酬月额相当额也会跟着提高**这一点。\n\n以短时数雇用时的加保基准整理于[以短时数雇用时，社会保险会怎么样](/zh/labor/column/tanjikan-koyo-shakaihoken-4bunno3)，以业务委托形式请人前来时的注意事项则整理于[外包与雇佣的界线，并非由合同决定](/zh/labor/column/gaichu-koyo-sakaime-roudoushasei)。\n\n## 常见问题\n\n**Q. 65万日元这个金额，明年也一样吗？**\nA. 支给停止调整额每年度改定（厚生年金保険法第46条第3项但书）。由于是依名目工资的变动来改定，令和9年度以后的金额取决于改定的结果。厚生劳动省每年1月下旬会公布次年度的年金额改定，届时请于该处确认。\n\n**Q. 本人说“年金会被停掉，所以希望控制在每月20万日元以内”。该如何说明？**\nA. 请本人先确认基本月额是最快的方式，可通过“ねんきん定期便”（年金定期通知）或年金事务所查询。知道基本月额后，以65万日元减去该金额，就是不会产生支给停止的上限。多数情况下，每月20万日元的水准远低于该上限，因此**可以当场说明没有压低的必要**。不过本人的年金金额属于个人信息，需由本人自行确认。\n\n**Q. 我们新雇用了一位超过70岁的人。要提出什么？**\nA. 该员不会成为厚生年金保险的被保险者，但属于**70歳以上被用者該当届**的对象。健康保险方面，未满75岁仍会成为被保险者，因此也需要一并提出健康保险的资格取得申报。雇用保险方面，每周20小时以上者会以高年龄被保险者的身分加保。**三种制度的处理各自不同**，是容易漏报的场面。\n\n**Q. 在职期间，年金金额有可能增加吗？**\nA. 65岁以后仍加入厚生年金保险工作的期间会反映到年金金额上，并通过在职定时改定于每年10月分起增额。不过增加的部分同样会成为在职老龄年金的计算对象。个别的预估金额，向年金事务所确认最为确实。本所可协助整理工资与奖金如何设计会产生支给停止。费用请参见[报酬金额表](/zh/labor/ryokin)。\n\n## 本文的依据\n\n- 厚生年金保険法（昭和29年法律第115号）第9条、第14条第5号、第27条、第44条之3第4项、第46条第1项・第3项\n- 厚生年金保険法施行規則（昭和29年厚生省令第37号）第10条之4、第15条之2、第22条之2\n- 健康保険法（大正11年法律第70号）第3条第1项第7号、第36条第3号\n- 高齢者の医療の確保に関する法律（昭和57年法律第80号）第50条第1号、第52条第1号\n- 雇用保険法（昭和49年法律第116号）第37条之2第1项\n- 社会経済の変化を踏まえた年金制度の機能強化のための国民年金法等の一部を改正する等の法律（令和7年法律第74号）\n- **支给停止调整额65万日元的出处**：厚生劳动省「令和8年度の年金額改定についてお知らせします」（**令和8年1月23日**）、日本年金机构「在職老齢年金の計算方法」（**2026年4月1日更新**）\n- **延后请领与在职支给停止之关系的出处**：日本年金机构「年金の繰下げ受給」（**2026年8月12日更新**）\n- 规定延后加算额具体计算方法的政令条号尚未特定（**未经查证**）\n- 以上条文均为2026年8月13日时点以e-Gov法令検索确认的现行条文\n\n**本文并未替您决定该找谁咨询。** 工资与奖金的设计、申报要否的判断、标准报酬月额的管理，是社会保险劳务士的业务。本人的年金预估金额与延后请领的选择请洽日本年金机构（年金事务所），董监事报酬的税务处理请洽税理士，均由您直接确认或委任。本所不收取介绍费。委托四葉社会保険労務士事務所咨询时的费用整理于[报酬金额表](/zh/labor/ryokin)，常收到的提问则整理于[常见问题](/zh/labor/faq)。\n\n本文为一般性信息提供。依个别情况所为的判断，由具备资格者于面谈后进行。撰文者为[浦松丈二](/zh/about/uramatsu)（社会保险劳务士・行政书士・宅地建物取引士）。",
        "category": "社会保险",
        "keywords": [
          "在职老龄年金 65万日元",
          "支给停止调整额 令和8年度",
          "一边领年金一边工作 工资上限",
          "70歳以上被用者該当届",
          "延后请领 在职老龄年金 不会增额",
          "高龄者 雇用 社会保险 到几岁"
        ],
        "tags": [
          "在职老龄年金",
          "高龄者雇用",
          "厚生年金保险",
          "延后请领",
          "工资设计"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社会保险劳务士・行政书士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "65万日元这个金额，明年也一样吗？",
            "answer": "支给停止调整额每年度改定（厚生年金保険法第46条第3项但书）。由于是依名目工资的变动来改定，令和9年度以后的金额取决于改定的结果。厚生劳动省每年1月下旬会公布次年度的年金额改定，届时请于该处确认。"
          },
          {
            "question": "本人说“年金会被停掉，所以希望控制在每月20万日元以内”。该如何说明？",
            "answer": "请本人先确认基本月额是最快的方式，可通过“ねんきん定期便”（年金定期通知）或年金事务所查询。知道基本月额后，以65万日元减去该金额，就是不会产生支给停止的上限。多数情况下，每月20万日元的水准远低于该上限，因此可以当场说明没有压低的必要。不过本人的年金金额属于个人信息，需由本人自行确认。"
          },
          {
            "question": "我们新雇用了一位超过70岁的人。要提出什么？",
            "answer": "该员不会成为厚生年金保险的被保险者，但属于70歳以上被用者該当届的对象。健康保险方面，未满75岁仍会成为被保险者，因此也需要一并提出健康保险的资格取得申报。雇用保险方面，每周20小时以上者会以高年龄被保险者的身分加保。三种制度的处理各自不同，是容易漏报的场面。"
          },
          {
            "question": "在职期间，年金金额有可能增加吗？",
            "answer": "65岁以后仍加入厚生年金保险工作的期间会反映到年金金额上，并通过在职定时改定于每年10月分起增额。不过增加的部分同样会成为在职老龄年金的计算对象。个别的预估金额，向年金事务所确认最为确实。本所可协助整理工资与奖金如何设计会产生支给停止。费用请参见报酬金额表。"
          }
        ]
      }
    }
  },
  {
    "business": "labor",
    "slug": "kaigai-shucho-haken-rosai-chigai",
    "title": "海外出張と海外派遣は、労災でまったく違う",
    "date": "2026-09-01",
    "category": "労働保険",
    "excerpt": "労災保険は属地主義です。海外出張なら国内の事業場の労災保険から給付されますが、海外派遣には適用がなく、特別加入の手続をしていなければ給付を受けられません。分かれ目は滞在期間ではなく指揮命令の所在です。日中社会保障協定の適用証明書についても整理します。",
    "content": "**結論（先に要点）**：労災保険は属地主義です。**海外出張**なら国内の事業場の労災保険から給付されますが、**海外派遣**には適用がなく、特別加入の手続をしていなければ給付を受けられません。分かれ目は滞在期間の長さではなく、**指揮命令がどこにあるか**です。\n\n中国やアジアに社員を出している会社から、いちばん多くいただくご質問です。「3か月なら出張、1年なら派遣ですよね」と言われることがありますが、**期間では決まりません**。ここを取り違えたまま送り出すと、現地で事故が起きたときに、どの制度からも給付が出ない状態になります。\n\n## 出張と派遣は、どこで分かれるのか？\n\n厚生労働省は、次のように説明しています。\n\n> 海外「出張」に当たるか海外「派遣」に当たるのかは、**海外における勤務期間の長短によって判断されるのではなく、その労働者の海外における労働関係によって判断されます**。したがって、例え海外での勤務が長期にわたる場合でも、国内の事業場の指揮命令に従って業務に従事している場合には海外出張となりますし、海外の事業場に所属して、その事業場の指揮命令に従って業務を行う場合などは、海外派遣とみなされることになります。\n> （厚生労働省 労働基準情報FAQ「海外出張先で事故に遭った場合、労災保険の適用はどうなるのでしょうか。」）\n\nつまり、**どこの指揮を受けて働いているか**です。厚生労働省「特別加入制度のしおり（海外派遣者用）」が挙げる例示を並べると、輪郭がはっきりします。\n\n| | 例 |\n|---|---|\n| **海外出張**（国内の労災保険が及ぶ） | 商談／技術打合せ／市場調査・会議・視察／アフターサービス／突発的なトラブルへの対処／技術習得 |\n| **海外派遣**（特別加入が必要） | 海外の関連会社への出向／海外支店・営業所への転勤／海外での据付工事・建設工事への従事 |\n\n**現地法人に出向させた時点で、期間にかかわらず海外派遣です。** 逆に、日本の本社の指示で動き、日本の上長に報告し、日本の就業規則が適用されている状態であれば、1年でも出張として整理できる余地があります。\n\n書類の上でどちらに見えるかではなく、**実際にどちらの指揮を受けているか**で判断されます。この構造は、[外注と雇用の境目は、契約書では決まらない](/labor/column/gaichu-koyo-sakaime-roudoushasei)で書いた労働者性の判断と同じ考え方です。\n\n## 現地でけがをしたら、どちらの制度が使えるのか？\n\n海外出張であれば、**国内の事業場の労災保険**から給付されます。特別な手続は要りません。\n\n海外派遣の場合は、**特別加入の手続をしていなければ給付を受けられません**（労働者災害補償保険法第33条第7号、第36条第1項）。厚生労働省のしおりも「海外派遣者に関して特別加入の手続を行っていなければ、労災保険による給付を受けられません」と明記しています。\n\n**注意点が3つあります。**\n\n**1つめ。加入できる立場に制限があります。** 労災保険法第33条第7号は、派遣先の海外の事業が**特定事業に該当しないとき**は、その事業に使用される**労働者として派遣する者に限る**としています。特定事業かどうかは規模で決まり、規模の判断は「海外の各国ごとに、かつ、**企業を単位として**」行われます。派遣先が大規模な場合、事業主等の立場で行く人は加入できません。\n\n**2つめ。現地採用の方は加入できません。** 国内の事業からの派遣ではないためです。単に留学を目的とした派遣も対象外です。\n\n**3つめ。事後の加入はできません。** 特別加入は申請と政府の承認による制度なので、**出発前に手続を終えている必要があります**。事故が起きてから遡って入ることはできません。\n\nなお、社長ご自身が海外に出る場合、国内での特別加入とは別の枠になります。国内の特別加入の要件は[社長には労災が出ない。そして1人だと特別加入もできない](/labor/column/shacho-rosai-tokubetsu-kanyu-hitori)にまとめました。\n\n## 現地の社会保険には、入るのか？\n\n労災とは別の話になります。整理すると次のとおりです。\n\n| 制度 | 海外に出ている間の扱い |\n|---|---|\n| 健康保険 | 適用事業所に使用される限り**継続**（国内に住所がなくても加入） |\n| 厚生年金保険 | 同上 |\n| 介護保険（第2号） | 国内に住所がなくなれば**適用除外**（適用除外等該当届が必要） |\n| 労災保険 | 出張は国内の保険が及ぶ。派遣は特別加入 |\n\n日本年金機構は「**健康保険および厚生年金保険は、適用事業所に勤務する限り、国内における住所の有無を問わず加入します**」「一方、介護保険は、国内に住所がある方のみ加入します」としています。海外転出届を出す場合、**介護保険適用除外等該当届**を忘れないでください。\n\n### 中国に出す場合——日中社会保障協定\n\n中国では、日本の企業から派遣された方も現地の社会保険の対象になりますが、**社会保障に関する日本国政府と中華人民共和国政府との間の協定**（令和元年条約第1号。**2019年9月1日発効**）により、二重加入を避けるしくみがあります。\n\n**この協定には、実務で誤解されやすい点がいくつもあります。**\n\n| 論点 | 正しい内容 |\n|---|---|\n| 免除の対象 | **中国の被用者基本老齢保険のみ**。医療保険・失業保険・労災保険・生育保険は対象外 |\n| 日本側の対象制度 | 国民年金（基金を除く）・厚生年金保険（基金を除く）。**健康保険は対象外** |\n| 期間の要件 | **見込みは不要**。派遣の**最初の5年間**は日本の法令のみが適用される（協定第6条1） |\n| 年金加入期間の通算 | **できない**。日中協定は二重加入の防止のみ |\n| 香港・マカオ | **対象外** |\n| 自営業者 | **対象外** |\n\n**★「5年以内の見込みで派遣される場合」という説明は、日中協定には当てはまりません。** 日本年金機構の中国向けページは「派遣期間の長さの『見込み』は必要なく、派遣開始日から5年間は派遣元国の年金制度のみに加入することとなります」としています。実際、申請書の記入方法にも、派遣予定期間が5年を超える場合は終了予定年月日欄に「派遣開始予定年月日から5年が満了する年月日」を書くよう指示があります。**5年を超える見込みでも、最初の5年について適用証明書が交付されます。**\n\n米国やドイツとの協定は「5年以内の見込み」型で、日本年金機構の一般ページもその書き方をしています。**中国はその例外側です。** 一般ページだけを読むと取り違えます。\n\n### 適用証明書をどう扱うか\n\n免除を受けるには、**日本年金機構から適用証明書の交付を受ける**必要があります（協定第13条）。厚生労働省の広報誌も「中国の年金制度への加入が免除されるためにはあらかじめ日本年金機構などから『適用証明書』の交付を受ける必要があります」としています。申請は**就労開始予定のおおむね6か月前から**可能です。\n\n**そして中国には、他の協定国と違う取扱いがあります。** 日本年金機構は次のように求めています。\n\n> 日本年金機構から交付された適用証明書については、中国に派遣後速やかに、派遣先の中国の事業所を通じ、その派遣先事業所を所管する社会保険料徴収機関に**原本を提出**してください。（中略）**中国の法令に従って、中国制度の適用免除の手続を行ってください。**\n\n一般の協定国では「相手国当局から求められたときに提示または提出」で足りるのに対し、**中国では派遣後速やかに能動的に原本を提出することが求められ、さらに中国の法令に基づく免除手続が別途必要**とされています。\n\n**ここは断定を避けます。** 「原本を提出して初めて免除の効力が生じる」と書いてある日本側の一次資料は、当方では確認できませんでした（**未検証**）。中国側での効力の要件は中国の法令が定める事項で、日本の公表資料の範囲外です。**確実に言えるのは、日本年金機構が原本の提出と中国法令に基づく手続の両方を求めている、ということです。** 発給を受けただけで終わりにしないでください。\n\n5年を超えて派遣が続く場合は、**延長申請**により両国の関係機関が個別に判断・合意すれば、引き続き日本の制度のみに加入できます（協定第6条2）。延長は原則5年を超えない期間ですが、特段の事情があれば合計10年を超える場合も認められる余地があります。延長が認められなかった場合には、**厚生年金保険の特例加入制度**（任意加入）という受け皿があります。\n\n## 出す前に、何を確認すればいいのか？\n\n送り出す前に、次の5つを紙に書き出してください。\n\n1. **出張か派遣か**——誰の指揮を受けて働くのか。現地法人への出向なら派遣です\n2. **派遣なら、特別加入の申請を出発前に済ませたか**——事後の加入はできません\n3. **健康保険・厚生年金保険を継続するか**——適用事業所に使用される限り継続します\n4. **住民票を海外へ移すか**——移すなら介護保険適用除外等該当届\n5. **中国なら、適用証明書の申請と、着任後の原本提出まで段取りしたか**——6か月前から申請できます\n\n**2と5は、日程が決まってから動くと間に合わないことがあります。** 赴任の内示が出た時点で着手してください。\n\nなお、外国人を日本で受け入れる側の手続は主語が逆になります。在留資格そのものについては[在留資格・ビザのご相談](/global)、企業として外国人社員を受け入れる際の手続については[外国人社員の受け入れ](/legal/services/gaikokujin-shain)をご覧ください。**これらは四葉行政書士事務所が扱う業務で、四葉社会保険労務士事務所とは別の事業体です。** ご依頼いただく場合は、それぞれ別々にご契約いただく形になります。当社・当事務所は紹介料の授受を行いません。\n\n## よくある質問\n\n**Q. 3か月の技術指導で中国に出します。派遣ですか、出張ですか？**\nA. 現地法人の指揮下に入らず、日本の事業場の指示で動き、日本の上長に報告している形であれば、出張として整理できる余地があります。逆に、現地法人に籍を移して現地の指揮を受けるのであれば、3か月でも派遣です。**期間ではなく指揮命令の所在**でご確認ください。判断に迷う場合は、指揮系統と就業規則の適用関係を書き出したうえでご相談ください。\n\n**Q. 特別加入の保険料は、どのくらいかかりますか？**\nA. 海外派遣者の特別加入（第三種特別加入保険料）は、申請して承認された給付基礎日額をもとに計算されます。日額をいくらに設定するかで保険料も給付額も変わります。実際の額は加入時に決めますので、事前にご相談ください。費用の考え方は[報酬額表](/labor/ryokin)をご覧ください。\n\n**Q. 適用証明書を出さないと、中国で保険料を取られますか？**\nA. 中国側での取扱いは中国の法令によるため、当方から断定することはできません。日本年金機構が原本の提出と中国法令に基づく免除手続を求めていることは事実ですので、**求められている手続は済ませておく**という考え方でお進めいただくのが安全です。\n\n**Q. 現地の医療費はどうなりますか？**\nA. 日中協定の対象は年金だけで、**医療保険は含まれていません**。健康保険の被保険者資格は継続しますので、海外療養費の制度を使う余地はありますが、現地で全額を立て替えたうえで日本で請求する形になり、支給額も日本国内の基準で計算されます。多くの会社が民間の海外旅行保険や駐在員向け保険を併用しているのは、この差を埋めるためです。**保険商品の選択は当方の業務範囲外ですので、保険の専門家にご相談ください。**\n\n## この記事の根拠\n\n- 労働者災害補償保険法（昭和22年法律第50号）第33条第6号・第7号、第36条第1項\n- 労働者災害補償保険法施行規則（昭和30年労働省令第22号）第46条の16、第46条の25の2\n- 厚生労働省 労働基準情報FAQ「海外出張先で事故に遭った場合、労災保険の適用はどうなるのでしょうか。」（出張・派遣の判断が勤務期間の長短によらないこと）\n- 厚生労働省「特別加入制度のしおり（海外派遣者用）」（出張・派遣の定義と例示、未加入時に給付を受けられないこと）\n- 都道府県労働局の公表資料（規模判断を海外の各国ごと・企業単位で行うこと、現地採用・留学目的の派遣が対象外であること）\n- **社会保障に関する日本国政府と中華人民共和国政府との間の協定**（平成30年5月9日署名、**令和元年5月17日公布・条約第1号**、**令和元年9月1日効力発生**）第2条1、第6条1・2、第13条、第14条3\n- 厚生労働省 年金局長通知（令和元年6月5日 年発0605第1号）——対象制度が年金のみ・対象者が被用者のみであること、派遣された日から最初の5年間であること、延長の取扱い\n- 日本年金機構「協定相手国別の注意事項（中国）」——**派遣期間の見込みが不要であること**、適用証明書原本の提出、延長、香港・マカオ・自営業者の取扱い\n- 日本年金機構「海外へ転勤または転職するときの手続き」——健康保険・厚生年金保険の継続加入、介護保険の適用除外\n- **適用証明書の原本提出が中国側での免除の効力要件であるかどうかは、日本側の一次資料では確認できませんでした（未検証）。** 中国の法令が定める事項であるためです\n- 条文はいずれも2026年8月13日時点でe-Gov法令検索により確認した現行条文です\n\n**この記事は、誰に相談するかまでは決めていません。** 出張か派遣かの整理、特別加入の申請、適用証明書の申請、健康保険・厚生年金保険の継続と介護保険の適用除外の手続は社会保険労務士の業務です。在留資格の申請は四葉行政書士事務所（**別の事業体です。別々にご契約いただきます**）、海外赴任に伴う所得税・住民税の扱いは税理士、現地の労働法令は現地の専門家へ、それぞれ直接ご依頼いただく形をご案内します。当事務所は紹介料を受け取りません。四葉社会保険労務士事務所にご相談いただく場合の費用は[報酬額表](/labor/ryokin)に、よくいただくご質問は[よくあるご質問](/labor/faq)にまとめています。\n\n本記事は一般的な情報提供です。個別のご事情に応じた判断は、面談のうえ資格者が行います。執筆は[浦松丈二](/about/uramatsu)（社会保険労務士・行政書士・宅地建物取引士）です。",
    "status": "published",
    "author": {
      "name": "浦松 丈二",
      "title": "社会保険労務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
    },
    "keywords": [
      "海外出張 海外派遣 労災 違い",
      "海外派遣 労災 特別加入",
      "日中社会保障協定 適用証明書",
      "中国 駐在 社会保険 免除",
      "海外赴任 健康保険 厚生年金",
      "海外勤務 介護保険 適用除外"
    ],
    "tags": [
      "労災保険",
      "特別加入",
      "海外派遣",
      "社会保障協定",
      "中国"
    ],
    "locales": [],
    "faq": [
      {
        "question": "3か月の技術指導で中国に出します。派遣ですか、出張ですか？",
        "answer": "現地法人の指揮下に入らず、日本の事業場の指示で動き、日本の上長に報告している形であれば、出張として整理できる余地があります。逆に、現地法人に籍を移して現地の指揮を受けるのであれば、3か月でも派遣です。期間ではなく指揮命令の所在でご確認ください。判断に迷う場合は、指揮系統と就業規則の適用関係を書き出したうえでご相談ください。"
      },
      {
        "question": "特別加入の保険料は、どのくらいかかりますか？",
        "answer": "海外派遣者の特別加入（第三種特別加入保険料）は、申請して承認された給付基礎日額をもとに計算されます。日額をいくらに設定するかで保険料も給付額も変わります。実際の額は加入時に決めますので、事前にご相談ください。費用の考え方は報酬額表をご覧ください。"
      },
      {
        "question": "適用証明書を出さないと、中国で保険料を取られますか？",
        "answer": "中国側での取扱いは中国の法令によるため、当方から断定することはできません。日本年金機構が原本の提出と中国法令に基づく免除手続を求めていることは事実ですので、求められている手続は済ませておくという考え方でお進めいただくのが安全です。"
      },
      {
        "question": "現地の医療費はどうなりますか？",
        "answer": "日中協定の対象は年金だけで、医療保険は含まれていません。健康保険の被保険者資格は継続しますので、海外療養費の制度を使う余地はありますが、現地で全額を立て替えたうえで日本で請求する形になり、支給額も日本国内の基準で計算されます。多くの会社が民間の海外旅行保険や駐在員向け保険を併用しているのは、この差を埋めるためです。保険商品の選択は当方の業務範囲外ですので、保険の専門家にご相談ください。"
      }
    ],
    "translations": {
      "en": {
        "title": "An Overseas Business Trip and an Overseas Posting Are Completely Different for Workers' Accident Compensation",
        "excerpt": "Workers' accident compensation insurance follows the territoriality principle. On an overseas business trip, benefits come from the insurance of the establishment in Japan; an overseas posting is outside that, and without special enrollment no benefits can be received. The dividing line is not the length of the stay but where the direction and orders come from. This article also sets out the certificate of coverage under the Japan-China Social Security Agreement.",
        "content": "**In short:** workers' accident compensation insurance follows the territoriality principle. On an **overseas business trip (海外出張)**, benefits are paid from the workers' accident compensation insurance of the establishment in Japan; an **overseas posting (海外派遣)** falls outside that, and without special enrollment (特別加入) no benefits can be received. The dividing line is not the length of the stay but **where the direction and orders come from**.\n\nThis is the question we are asked most often by companies that send staff to China and elsewhere in Asia. People sometimes say \"three months is a business trip, a year is a posting,\" but **the period does not decide it**. Send someone out on the wrong classification and, if an accident happens on site, no scheme pays out at all.\n\n## Where is the line between a business trip and a posting?\n\nThe Ministry of Health, Labour and Welfare (厚生労働省) explains it as follows.\n\n> Whether a case is an overseas \"business trip\" or an overseas \"posting\" **is not judged by the length of the period of work overseas, but by the employment relationship of that worker overseas**. Accordingly, even where the work overseas runs for a long period, if the person is engaged in duties under the direction and orders of the establishment in Japan it is an overseas business trip; and where the person belongs to an establishment overseas and carries out duties under the direction and orders of that establishment, it is treated as an overseas posting.\n> (Ministry of Health, Labour and Welfare, 労働基準情報FAQ「海外出張先で事故に遭った場合、労災保険の適用はどうなるのでしょうか。」)\n\nIn other words, **whose direction the person is working under**. Setting out the examples given in the Ministry's 「特別加入制度のしおり（海外派遣者用）」 brings the outline into focus.\n\n| | Examples |\n|---|---|\n| **Overseas business trip** (covered by workers' accident compensation insurance in Japan) | Business negotiations / technical meetings / market research, conferences and inspection visits / after-sales service / dealing with sudden trouble / acquiring technical skills |\n| **Overseas posting** (special enrollment required) | Secondment to a group company overseas / transfer to an overseas branch or sales office / engagement in installation or construction work overseas |\n\n**Once you second someone to a local subsidiary, it is an overseas posting regardless of the period.** Conversely, where the person moves on instructions from the head office in Japan, reports to a superior in Japan, and is subject to the Japanese work rules, there is room to treat even a year as a business trip.\n\nThe judgment turns not on how it looks on paper but on **whose direction the person is actually under**. The structure is the same as the test of worker status set out in [The line between outsourcing and employment is not settled by the contract](/en/labor/column/gaichu-koyo-sakaime-roudoushasei).\n\n## If someone is injured on site, which scheme can be used?\n\nOn an overseas business trip, benefits are paid from the **workers' accident compensation insurance of the establishment in Japan**. No special procedure is required.\n\nIn the case of an overseas posting, **no benefits can be received unless the special enrollment procedure has been completed** (Workers' Accident Compensation Insurance Act (労働者災害補償保険法, Act No. 50 of 1947), Article 33 item 7 and Article 36 paragraph 1). The Ministry's booklet also states expressly that \"if the special enrollment procedure has not been carried out in respect of an overseas posted worker, no benefits under workers' accident compensation insurance can be received.\"\n\n**There are three points to watch.**\n\n**First, there are limits on who can enroll.** Article 33 item 7 of the Workers' Accident Compensation Insurance Act provides that, where the overseas business to which the person is posted **does not fall within a specified business (特定事業)**, enrollment is **limited to persons posted as workers** employed by that business. Whether it is a specified business is determined by scale, and scale is assessed \"**for each country overseas, and on a company basis**.\" Where the receiving business is large, a person going in the position of a business proprietor cannot enroll.\n\n**Second, locally hired staff cannot enroll.** They are not posted from a business in Japan. A posting purely for the purpose of study is also outside the scope.\n\n**Third, you cannot enroll after the event.** Special enrollment operates by application and government approval, so **the procedure has to be completed before departure**. You cannot join retroactively once an accident has happened.\n\nWhere the company president goes overseas personally, that sits in a different category from special enrollment in Japan. The requirements for special enrollment in Japan are set out in [No workers' accident compensation for the company president — and with only one person, no special enrollment either](/en/labor/column/shacho-rosai-tokubetsu-kanyu-hitori).\n\n## Do you join the social insurance in the host country?\n\nThat is a separate matter from workers' accident compensation. In summary:\n\n| Scheme | Treatment while the person is overseas |\n|---|---|\n| Health insurance (健康保険) | **Continues** so long as the person is employed by a covered establishment (coverage applies even without an address in Japan) |\n| Employees' Pension Insurance (厚生年金保険) | Same as above |\n| Long-term care insurance (介護保険), Category 2 | **Excluded** once the person no longer has an address in Japan (a notification of exclusion, 適用除外等該当届, is required) |\n| Workers' accident compensation insurance (労災保険) | On a business trip, the insurance in Japan reaches the person. On a posting, special enrollment |\n\nThe Japan Pension Service (日本年金機構) states that \"**health insurance and Employees' Pension Insurance apply, irrespective of whether the person has an address in Japan, so long as the person works at a covered establishment**,\" and that \"long-term care insurance, on the other hand, applies only to those who have an address in Japan.\" If a notification of moving abroad is filed, do not forget the **notification of exclusion from long-term care insurance (介護保険適用除外等該当届)**.\n\n### Sending someone to China — the Japan-China Social Security Agreement\n\nIn China, a person posted from a Japanese company also comes within the local social insurance, but the **社会保障に関する日本国政府と中華人民共和国政府との間の協定** (Treaty No. 1 of 2019 (令和元年条約第1号); **in force from 1 September 2019**) provides a mechanism for avoiding dual coverage.\n\n**This agreement contains several points that are easily misunderstood in practice.**\n\n| Issue | The correct position |\n|---|---|\n| What the exemption covers | **China's employees' basic old-age insurance (职工基本养老保险) only.** Medical insurance, unemployment insurance, work injury insurance and maternity insurance are outside the scope |\n| Schemes covered on the Japanese side | National Pension (excluding the fund) and Employees' Pension Insurance (excluding the funds). **Health insurance is outside the scope** |\n| Requirement as to period | **No expectation is required.** For the **first five years** of the posting, only the legislation of Japan applies (Agreement, Article 6(1)) |\n| Totalisation of pension coverage periods | **Not possible.** The Japan-China Agreement covers only the avoidance of dual coverage |\n| Hong Kong and Macau | **Outside the scope** |\n| Self-employed persons | **Outside the scope** |\n\n**★ The explanation \"where the person is posted for an expected period of five years or less\" does not apply to the Japan-China Agreement.** The Japan Pension Service's China-specific page states that \"no 'expectation' as to the length of the posting period is required; for five years from the day the posting begins, the person is covered only by the pension scheme of the sending country.\" Consistently with that, the instructions for completing the application form direct that, where the planned posting period exceeds five years, the field for the expected end date should show \"the date on which five years from the expected start date of the posting expire.\" **Even where the posting is expected to run beyond five years, a certificate of coverage is issued for the first five years.**\n\nThe agreements with the United States and Germany are of the \"expected to be five years or less\" type, and the Japan Pension Service's general page is written that way. **China sits on the exception side.** Reading only the general page will lead you astray.\n\n### How to handle the certificate of coverage\n\nTo obtain the exemption, you need to **have a certificate of coverage (適用証明書) issued by the Japan Pension Service** (Agreement, Article 13). The Ministry of Health, Labour and Welfare's public information magazine also states that \"in order to be exempted from coverage under the Chinese pension scheme, it is necessary to obtain a 'certificate of coverage' in advance from the Japan Pension Service or elsewhere.\" Applications can be made **from roughly six months before the planned start of work**.\n\n**And China is handled differently from other agreement countries.** The Japan Pension Service asks the following.\n\n> As regards the certificate of coverage issued by the Japan Pension Service, please **submit the original**, promptly after the posting to China, through the Chinese establishment to which the person is posted, to the social insurance premium collection agency with jurisdiction over that establishment. (...) **Please carry out the procedures for exemption from the Chinese scheme in accordance with the laws and regulations of China.**\n\nWhereas for agreement countries generally it is enough to \"present or submit the certificate when requested by the authorities of the other country,\" **in the case of China the original is to be submitted actively and promptly after the posting, and a separate exemption procedure under Chinese law is also required.**\n\n**We stop short of asserting more than that.** We were not able to confirm any primary source on the Japanese side stating that \"the exemption takes effect only once the original has been submitted\" (**unverified**). The conditions for effectiveness on the Chinese side are matters determined by Chinese law and fall outside the scope of published Japanese material. **What can be said with certainty is that the Japan Pension Service asks for both the submission of the original and the procedure under Chinese law.** Do not treat the matter as finished once the certificate has been issued.\n\nWhere the posting continues beyond five years, an **application for extension** allows the person to remain covered only by the Japanese scheme if the competent institutions of the two countries decide and agree on the individual case (Agreement, Article 6(2)). An extension is in principle for a period not exceeding five years, but where there are special circumstances there is room for a total exceeding ten years to be permitted. If an extension is not granted, there is a fallback in the **special enrollment arrangement under Employees' Pension Insurance** (voluntary coverage).\n\n## What should you check before sending someone out?\n\nBefore you send someone out, write down these five points.\n\n1. **Business trip or posting?** — whose direction is the person working under? A secondment to a local subsidiary is a posting\n2. **If it is a posting, has the special enrollment application been completed before departure?** — you cannot enroll after the event\n3. **Will health insurance and Employees' Pension Insurance continue?** — they continue so long as the person is employed by a covered establishment\n4. **Will the residence registration be moved overseas?** — if so, the notification of exclusion from long-term care insurance (介護保険適用除外等該当届)\n5. **For China, have you arranged both the application for the certificate of coverage and the submission of the original after arrival?** — applications can be made from six months in advance\n\n**With items 2 and 5, starting once the dates are fixed can leave you short of time.** Begin as soon as the assignment is announced internally.\n\nNote that where you are the receiving side, bringing foreign nationals into Japan, the subject is reversed. For residence status itself, please see [Residence status and visa consultations](/en/global); for the procedures a company follows when bringing on foreign employees, please see [Bringing on foreign employees](/en/legal/services/gaikokujin-shain). **These are matters handled by 四葉行政書士事務所, which is a separate business entity from 四葉社会保険労務士事務所.** If you instruct us, each office accepts the work **separately**, under a **separate contract**. Neither our company nor our office gives or receives referral fees.\n\n## Frequently asked questions\n\n**Q. We are sending someone to China for three months of technical guidance. Is that a posting or a business trip?**\nA. If the person does not come under the direction of the local subsidiary, moves on instructions from the establishment in Japan, and reports to a superior in Japan, there is room to treat it as a business trip. Conversely, if the person's employment is transferred to the local subsidiary and they come under local direction, it is a posting even at three months. Please check by reference to **where the direction and orders sit, not the period**. If the classification is unclear, write out the reporting lines and which work rules apply, and then come and discuss it.\n\n**Q. How much does the special enrollment premium cost?**\nA. Special enrollment for overseas posted workers (the Class 3 special enrollment premium) is calculated on the basic daily benefit amount (給付基礎日額) applied for and approved. The level you set for the daily amount changes both the premium and the benefits. The actual amount is decided at the time of enrollment, so please discuss it with us beforehand. For how we approach fees, please see the [fee schedule](/en/labor/ryokin).\n\n**Q. If we do not produce the certificate of coverage, will premiums be taken in China?**\nA. Treatment on the Chinese side is governed by Chinese law, so we cannot state a conclusion on it. What is a fact is that the Japan Pension Service asks for the submission of the original and for the exemption procedure under Chinese law, so the safe approach is to proceed on the basis of **completing the procedures that are being asked for**.\n\n**Q. What about medical costs on site?**\nA. The Japan-China Agreement covers pensions only; **medical insurance is not included**. Health insurance insured status continues, so there is room to use the overseas medical expense (海外療養費) arrangement, but it works by paying the full amount on site and then claiming in Japan, and the amount paid is calculated on Japanese domestic standards. That gap is why many companies also take out private overseas travel insurance or expatriate cover. **The choice of insurance products is outside our scope of work, so please consult an insurance specialist.**\n\n## Sources for this article\n\n- 労働者災害補償保険法 (Workers' Accident Compensation Insurance Act, Act No. 50 of 1947), Article 33 items 6 and 7, Article 36 paragraph 1\n- 労働者災害補償保険法施行規則 (Ordinance for Enforcement of the Workers' Accident Compensation Insurance Act, Ordinance of the Ministry of Labour No. 22 of 1955), Article 46-16, Article 46-25-2\n- Ministry of Health, Labour and Welfare, 労働基準情報FAQ「海外出張先で事故に遭った場合、労災保険の適用はどうなるのでしょうか。」 (that the business trip / posting classification does not turn on the length of the period of work)\n- Ministry of Health, Labour and Welfare, 「特別加入制度のしおり（海外派遣者用）」 (the definitions and examples of business trip and posting, and that no benefits can be received without enrollment)\n- Published materials of the Prefectural Labour Bureaus (that scale is assessed for each country overseas and on a company basis, and that locally hired staff and postings for study purposes are outside the scope)\n- **社会保障に関する日本国政府と中華人民共和国政府との間の協定** (signed 9 May 2018 (平成30年5月9日), **promulgated 17 May 2019 as Treaty No. 1 (令和元年5月17日公布・条約第1号)**, **entered into force 1 September 2019 (令和元年9月1日)**), Article 2(1), Article 6(1) and (2), Article 13, Article 14(3)\n- Ministry of Health, Labour and Welfare, notice of the Director-General of the Pension Bureau (令和元年6月5日 年発0605第1号) — that the schemes covered are pensions only and the persons covered are employees only, that the period is the first five years from the day of posting, and the treatment of extensions\n- Japan Pension Service, 「協定相手国別の注意事項（中国）」 — **that no expectation as to the posting period is required**, submission of the original certificate of coverage, extensions, and the treatment of Hong Kong, Macau and self-employed persons\n- Japan Pension Service, 「海外へ転勤または転職するときの手続き」 — continued coverage under health insurance and Employees' Pension Insurance, and exclusion from long-term care insurance\n- **Whether submission of the original certificate of coverage is a condition for the exemption to take effect on the Chinese side could not be confirmed in primary sources on the Japanese side (unverified).** This is because it is a matter determined by Chinese law\n- All provisions are the versions in force as confirmed on e-Gov法令検索 as of 13 August 2026\n\n**This article does not go so far as to decide who you should consult.** Sorting out whether a case is a business trip or a posting, applying for special enrollment, applying for the certificate of coverage, and the procedures for continuing health insurance and Employees' Pension Insurance and for exclusion from long-term care insurance are the work of a Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant). Applications for residence status are handled by 四葉行政書士事務所 (**a separate business entity; you contract with each office separately**); the income tax and residence tax treatment of an overseas assignment, by a tax accountant; and local labour legislation, by a specialist in that country — in each case to be instructed by you directly. We do not accept referral fees. Fees for consulting 四葉社会保険労務士事務所 are set out in the [fee schedule](/en/labor/ryokin), and the questions we are asked most often in [frequently asked questions](/en/labor/faq).\n\nThis article is general information. Judgments that turn on your particular circumstances are made by a qualified professional after a consultation. Written by [Joji Uramatsu](/en/about/uramatsu) (Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist).",
        "category": "Labour insurance",
        "keywords": [
          "overseas business trip versus overseas posting workers' accident insurance",
          "overseas posting special enrollment workers' accident insurance",
          "Japan-China Social Security Agreement certificate of coverage",
          "posting to China social insurance exemption",
          "overseas assignment health insurance employees' pension",
          "working abroad long-term care insurance exclusion"
        ],
        "tags": [
          "Workers' accident compensation insurance",
          "Special enrollment",
          "Overseas posting",
          "Social security agreement",
          "China"
        ],
        "author": {
          "name": "Joji Uramatsu",
          "title": "Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist — 四葉社会保険労務士事務所／四葉行政書士事務所"
        },
        "faq": [
          {
            "question": "We are sending someone to China for three months of technical guidance. Is that a posting or a business trip?",
            "answer": "If the person does not come under the direction of the local subsidiary, moves on instructions from the establishment in Japan, and reports to a superior in Japan, there is room to treat it as a business trip. Conversely, if the person's employment is transferred to the local subsidiary and they come under local direction, it is a posting even at three months. Please check by reference to where the direction and orders sit, not the period. If the classification is unclear, write out the reporting lines and which work rules apply, and then come and discuss it."
          },
          {
            "question": "How much does the special enrollment premium cost?",
            "answer": "Special enrollment for overseas posted workers (the Class 3 special enrollment premium) is calculated on the basic daily benefit amount (給付基礎日額) applied for and approved. The level you set for the daily amount changes both the premium and the benefits. The actual amount is decided at the time of enrollment, so please discuss it with us beforehand. For how we approach fees, please see the fee schedule."
          },
          {
            "question": "If we do not produce the certificate of coverage, will premiums be taken in China?",
            "answer": "Treatment on the Chinese side is governed by Chinese law, so we cannot state a conclusion on it. What is a fact is that the Japan Pension Service asks for the submission of the original and for the exemption procedure under Chinese law, so the safe approach is to proceed on the basis of completing the procedures that are being asked for."
          },
          {
            "question": "What about medical costs on site?",
            "answer": "The Japan-China Agreement covers pensions only; medical insurance is not included. Health insurance insured status continues, so there is room to use the overseas medical expense (海外療養費) arrangement, but it works by paying the full amount on site and then claiming in Japan, and the amount paid is calculated on Japanese domestic standards. That gap is why many companies also take out private overseas travel insurance or expatriate cover. The choice of insurance products is outside our scope of work, so please consult an insurance specialist."
          }
        ]
      },
      "zh-tw": {
        "title": "海外出差與海外派遣，在勞災保險上完全不同",
        "excerpt": "勞災保險採屬地主義。海外出差時由日本國內事業場所的勞災保險給付，海外派遣則不適用，未辦妥特別加入手續就無法領取給付。分界不在停留期間的長短，而在指揮命令位於何處。本文一併整理日中社會保障協定的適用證明書。",
        "content": "**結論（先講重點）**：勞災保險採屬地主義。若屬**海外出差**（日文：海外出張），由日本國內事業場所的勞災保險給付；但**海外派遣**不適用勞災保險，未辦妥**特別加入**手續就無法領取給付。分界不在停留期間的長短，而在**指揮命令位於何處**。\n\n這是把員工派往中國及亞洲各地的公司最常提出的問題。常有人說「3個月是出差，1年就是派遣吧」，但**並非由期間決定**。若在這裡搞錯就把人送出去，一旦在當地發生事故，會變成任何制度都不給付的狀態。\n\n## 出差與派遣，分界在哪裡？\n\n厚生勞動省的說明如下。\n\n> 屬於海外「出張（出差）」或海外「派遣」，**並非依海外勤務期間的長短來判斷，而是依該勞工在海外的勞動關係來判斷**。因此，即使海外勤務為長期，只要是依日本國內事業場所的指揮命令從事業務，即為海外出差；而隸屬於海外的事業場所、依該事業場所的指揮命令執行業務等情形，則視為海外派遣。\n> （厚生勞動省 労働基準情報FAQ「海外出張先で事故に遭った場合、労災保険の適用はどうなるのでしょうか。」）\n\n也就是說，重點在於**受誰的指揮而工作**。將厚生勞動省「特別加入制度のしおり（海外派遣者用）」所列舉的例示並排來看，輪廓就會清楚。\n\n| | 例子 |\n|---|---|\n| **海外出差**（日本國內的勞災保險及於此） | 商務洽談／技術會議／市場調查・會議・參訪／售後服務／處理突發狀況／技術研習 |\n| **海外派遣**（需要特別加入） | 向海外關係企業出向（借調）／調任海外分公司・營業所／從事海外的安裝工程・建設工程 |\n\n**一旦出向到當地法人，不論期間長短都是海外派遣。** 反過來說，若是依日本總公司的指示行動、向日本的主管報告、適用日本的工作規則，即使1年也仍有整理為出差的空間。\n\n判斷的依據不是書面上看起來像哪一種，而是**實際上受哪一方的指揮**。這個結構與[外包與僱用的界線，並非由契約書決定](/zh-tw/labor/column/gaichu-koyo-sakaime-roudoushasei)所寫的勞工性判斷，是同一套思考方式。\n\n## 在當地受傷時，可以使用哪一個制度？\n\n若屬海外出差，由**日本國內事業場所的勞災保險**給付，不需要特別的手續。\n\n若屬海外派遣，**未辦妥特別加入手續就無法領取給付**（労働者災害補償保険法第33條第7號、第36條第1項）。厚生勞動省的手冊也明確記載「若未就海外派遣者辦理特別加入手續，即無法領取勞災保險的給付」。\n\n**有3點需要注意。**\n\n**第1點，可加入的身分有限制。** 労働者災害補償保険法第33條第7號規定，派遣目的地的海外事業**不屬於特定事業時**，**限於以勞工身分派遣者**。是否為特定事業依規模決定，而規模的判斷是「**就海外各國分別、且以企業為單位**」進行。派遣目的地規模較大時，以事業主等身分前往的人無法加入。\n\n**第2點，當地聘僱者無法加入。** 因為並非自日本國內的事業所派遣。單純以留學為目的的派遣也不在對象範圍內。\n\n**第3點，無法事後加入。** 特別加入是經申請與政府承認的制度，因此**必須在出發前完成手續**。無法在事故發生後追溯加入。\n\n另外，社長本人前往海外的情形，與國內的特別加入屬於不同的框架。國內特別加入的要件整理於[社長不適用勞災保險；而且只有一人時也無法特別加入](/zh-tw/labor/column/shacho-rosai-tokubetsu-kanyu-hitori)。\n\n## 當地的社會保險，要加入嗎？\n\n這與勞災是另一件事。整理如下。\n\n| 制度 | 在海外期間的處理 |\n|---|---|\n| 健康保險 | 只要受僱於適用事業所即**持續加保**（即使在日本國內沒有住所也加保） |\n| 厚生年金保險 | 同上 |\n| 介護保險（第2號） | 在日本國內沒有住所後即**適用除外**（需提出適用除外等該当届） |\n| 勞災保險 | 出差時日本國內的保險及於此。派遣則需特別加入 |\n\n日本年金機構表示「**健康保險及厚生年金保險，只要在適用事業所任職，不問在日本國內有無住所均予加保**」「另一方面，介護保險僅限在日本國內有住所者加保」。若要辦理海外遷出登記，請不要忘記**介護保険適用除外等該当届**。\n\n### 派往中國時——日中社會保障協定\n\n在中國，由日本企業派遣的人員也會成為當地社會保險的對象，但依**社会保障に関する日本国政府と中華人民共和国政府との間の協定**（令和元年條約第1號。**2019年9月1日生效**），設有避免雙重加保的機制。\n\n**這項協定有數個在實務上容易被誤解的地方。**\n\n| 論點 | 正確內容 |\n|---|---|\n| 免除的對象 | **僅限中國的職工基本養老保險**（日文：被用者基本老齢保険）。醫療保險・失業保險・工傷保險（勞災保險）・生育保險不在對象範圍內 |\n| 日本側的對象制度 | 國民年金（不含基金）・厚生年金保險（不含基金）。**健康保險不在對象範圍內** |\n| 期間的要件 | **不需要「見込み」（預估）**。派遣的**最初5年間**僅適用日本的法令（協定第6條1） |\n| 年金加保期間的通算 | **無法通算**。日中協定僅處理雙重加保的防止 |\n| 香港・澳門 | **不在對象範圍內** |\n| 自營作業者 | **不在對象範圍內** |\n\n**★「以5年以內的預估期間派遣的情形」這種說明，並不適用於日中協定。** 日本年金機構針對中國的頁面表示「不需要派遣期間長短的『預估』，自派遣開始日起5年間僅加入派遣來源國的年金制度」。事實上，申請書的填寫方法也指示：派遣預定期間超過5年時，於預定結束年月日欄填寫「自預定派遣開始年月日起屆滿5年之年月日」。**即使預估會超過5年，仍會就最初的5年核發適用證明書。**\n\n與美國、德國的協定屬於「5年以內的預估」型，日本年金機構的一般頁面也是這樣寫的。**中國屬於例外的那一側。** 只讀一般頁面就會搞錯。\n\n### 適用證明書該如何處理\n\n要取得免除，必須**取得日本年金機構核發的適用證明書**（日文：適用証明書。協定第13條）。厚生勞動省的宣導刊物也表示「為免除加入中國的年金制度，必須事先取得日本年金機構等核發的『適用證明書』」。申請自**預定開始工作前約6個月起**即可辦理。\n\n**而中國有與其他協定國不同的處理方式。** 日本年金機構要求如下。\n\n> 就日本年金機構核發的適用證明書，請於派遣至中國後儘速，透過派遣目的地的中國事業所，向管轄該派遣目的地事業所的社會保險費徵收機關**提交原本**。（中略）**請依中國的法令，辦理中國制度的適用免除手續。**\n\n一般的協定國只要「在對方國家主管機關要求時出示或提交」即可，相對地，**在中國則被要求於派遣後儘速主動提交原本，並且另外需要依中國法令辦理的免除手續**。\n\n**這裡避免斷言。** 記載「提交原本後免除才開始生效」的日本側一次資料，本所並未能確認（**未經查證**）。中國側的生效要件屬於中國法令規定的事項，超出日本公開資料的範圍。**可以確定的是，日本年金機構同時要求提交原本與依中國法令辦理手續這兩件事。** 請不要在取得核發之後就停下來。\n\n派遣持續超過5年時，經**延長申請**由兩國相關機關個別判斷並達成合意，即可繼續僅加入日本的制度（協定第6條2）。延長原則上不超過5年，但若有特殊情事，也有合計超過10年獲准的空間。若延長未獲准，則有**厚生年金保險的特例加入制度**（任意加入）作為承接的機制。\n\n## 派出之前，該確認什麼？\n\n送人出去之前，請把以下5點寫在紙上。\n\n1. **是出差還是派遣**——受誰的指揮而工作。若是向當地法人出向即為派遣\n2. **若是派遣，特別加入的申請是否已於出發前完成**——無法事後加入\n3. **是否持續加保健康保險・厚生年金保險**——只要受僱於適用事業所即持續加保\n4. **是否將住民票遷往海外**——若要遷出，需提出介護保険適用除外等該当届\n5. **若是中國，適用證明書的申請與到任後提交原本是否都已安排妥當**——可自6個月前開始申請\n\n**第2點與第5點，等日程確定後才行動有時會來不及。** 請在赴任內定的時點就著手辦理。\n\n另外，若是在日本接納外國人的一方，手續的主語就反過來了。關於在留資格本身請參見[在留資格・簽證諮詢](/zh-tw/global)，關於企業接納外籍員工時的手續請參見[外籍員工的接納](/zh-tw/legal/services/gaikokujin-shain)。**這些是四葉行政書士事務所承辦的業務，與四葉社会保険労務士事務所是各自獨立的事業體。** 委託時需**分別承接**、由各事務所**另行簽約**。本公司・本所不進行介紹費的收受。\n\n## 常見問題\n\n**Q. 要派人到中國做3個月的技術指導。這是派遣還是出差？**\nA. 若不進入當地法人的指揮之下，而是依日本事業場所的指示行動、向日本的主管報告，就有整理為出差的空間。反過來說，若將人籍移至當地法人並接受當地的指揮，即使只有3個月也是派遣。請以**指揮命令的所在而非期間**來確認。若判斷上有疑慮，請先把指揮系統與工作規則的適用關係寫出來，再與我們討論。\n\n**Q. 特別加入的保險費大約要多少？**\nA. 海外派遣者的特別加入（第三種特別加入保險費）是依申請並獲承認的給付基礎日額計算。日額設定為多少，保險費與給付金額都會隨之改變。實際金額於加入時決定，請事先與我們討論。費用的思考方式請參見[報酬金額表](/zh-tw/labor/ryokin)。\n\n**Q. 沒有提出適用證明書，在中國會被收取保險費嗎？**\nA. 中國側的處理依中國的法令而定，本所無法斷言。日本年金機構要求提交原本並依中國法令辦理免除手續，這一點是事實，因此以**先把被要求的手續辦妥**的思路進行，較為安全。\n\n**Q. 當地的醫療費用怎麼辦？**\nA. 日中協定的對象只有年金，**並不包含醫療保險**。健康保險的被保險者資格會持續，因此仍有使用海外療養費制度的空間，但形式上是在當地先全額墊付、再回日本申請，支付金額也是依日本國內的基準計算。許多公司之所以同時投保民間的海外旅遊保險或駐外人員保險，就是為了補上這個差距。**保險商品的選擇不在本所的業務範圍內，請向保險的專業人士諮詢。**\n\n## 本文的依據\n\n- 労働者災害補償保険法（昭和22年法律第50號）第33條第6號・第7號、第36條第1項\n- 労働者災害補償保険法施行規則（昭和30年労働省令第22號）第46條之16、第46條之25之2\n- 厚生勞動省 労働基準情報FAQ「海外出張先で事故に遭った場合、労災保険の適用はどうなるのでしょうか。」（出差・派遣的判斷不依勤務期間長短）\n- 厚生勞動省「特別加入制度のしおり（海外派遣者用）」（出差・派遣的定義與例示，以及未加入時無法領取給付）\n- 都道府縣勞動局的公開資料（規模判斷就海外各國分別、以企業為單位進行；當地聘僱者、以留學為目的的派遣不在對象範圍內）\n- **社会保障に関する日本国政府と中華人民共和国政府との間の協定**（平成30年5月9日簽署，**令和元年5月17日公布・條約第1號**，**令和元年9月1日生效**）第2條1、第6條1・2、第13條、第14條3\n- 厚生勞動省 年金局長通知（令和元年6月5日 年発0605第1号）——對象制度僅限年金、對象者僅限被用者，以及自派遣之日起最初5年間、延長的處理\n- 日本年金機構「協定相手国別の注意事項（中国）」——**派遣期間不需要預估**、適用證明書原本的提交、延長，以及香港・澳門・自營作業者的處理\n- 日本年金機構「海外へ転勤または転職するときの手続き」——健康保險・厚生年金保險的持續加保、介護保險的適用除外\n- **適用證明書提交原本是否為中國側免除生效的要件，本所在日本側的一次資料中未能確認（未經查證）。** 因為這屬於中國法令規定的事項\n- 以上條文均為2026年8月13日時點以e-Gov法令検索確認的現行條文\n\n**本文並未替您決定該找誰諮詢。** 出差或派遣的整理、特別加入的申請、適用證明書的申請、健康保險・厚生年金保險的持續加保與介護保險適用除外的手續，是社會保險勞務士的業務。在留資格的申請由四葉行政書士事務所承辦（**是各自獨立的事業體，需另行簽約**），海外赴任伴隨的所得稅・住民稅處理請洽稅理士，當地的勞動法令請洽當地的專業人士，均由您直接委任。本所不收取介紹費。委託四葉社会保険労務士事務所諮詢時的費用整理於[報酬金額表](/zh-tw/labor/ryokin)，常收到的提問則整理於[常見問題](/zh-tw/labor/faq)。\n\n本文為一般性資訊提供。依個別情況所為的判斷，由具備資格者於面談後進行。撰文者為[浦松丈二](/zh-tw/about/uramatsu)（社會保險勞務士・行政書士・宅地建物取引士）。",
        "category": "勞動保險",
        "keywords": [
          "海外出差 海外派遣 勞災 差異",
          "海外派遣 勞災 特別加入",
          "日中社會保障協定 適用證明書",
          "中國 派駐 社會保險 免除",
          "海外赴任 健康保險 厚生年金",
          "海外工作 介護保險 適用除外"
        ],
        "tags": [
          "勞災保險",
          "特別加入",
          "海外派遣",
          "社會保障協定",
          "中國"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社會保險勞務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "要派人到中國做3個月的技術指導。這是派遣還是出差？",
            "answer": "若不進入當地法人的指揮之下，而是依日本事業場所的指示行動、向日本的主管報告，就有整理為出差的空間。反過來說，若將人籍移至當地法人並接受當地的指揮，即使只有3個月也是派遣。請以指揮命令的所在而非期間來確認。若判斷上有疑慮，請先把指揮系統與工作規則的適用關係寫出來，再與我們討論。"
          },
          {
            "question": "特別加入的保險費大約要多少？",
            "answer": "海外派遣者的特別加入（第三種特別加入保險費）是依申請並獲承認的給付基礎日額計算。日額設定為多少，保險費與給付金額都會隨之改變。實際金額於加入時決定，請事先與我們討論。費用的思考方式請參見報酬金額表。"
          },
          {
            "question": "沒有提出適用證明書，在中國會被收取保險費嗎？",
            "answer": "中國側的處理依中國的法令而定，本所無法斷言。日本年金機構要求提交原本並依中國法令辦理免除手續，這一點是事實，因此以先把被要求的手續辦妥的思路進行，較為安全。"
          },
          {
            "question": "當地的醫療費用怎麼辦？",
            "answer": "日中協定的對象只有年金，並不包含醫療保險。健康保險的被保險者資格會持續，因此仍有使用海外療養費制度的空間，但形式上是在當地先全額墊付、再回日本申請，支付金額也是依日本國內的基準計算。許多公司之所以同時投保民間的海外旅遊保險或駐外人員保險，就是為了補上這個差距。保險商品的選擇不在本所的業務範圍內，請向保險的專業人士諮詢。"
          }
        ]
      },
      "zh": {
        "title": "海外出差与海外派遣，在劳灾保险上完全不同",
        "excerpt": "劳灾保险采属地主义。海外出差时由日本国内事业场所的劳灾保险给付，海外派遣则不适用，未办妥特别加入手续就无法领取给付。分界不在停留期间的长短，而在指挥命令位于何处。本文一并整理日中社会保障协定的适用证明书。",
        "content": "**结论（先讲重点）**：劳灾保险采属地主义。若属**海外出差**（日文：海外出張），由日本国内事业场所的劳灾保险给付；但**海外派遣**不适用劳灾保险，未办妥**特别加入**手续就无法领取给付。分界不在停留期间的长短，而在**指挥命令位于何处**。\n\n这是把员工派往中国及亚洲各地的公司最常提出的问题。常有人说“3个月是出差，1年就是派遣吧”，但**并非由期间决定**。若在这里搞错就把人送出去，一旦在当地发生事故，会变成任何制度都不给付的状态。\n\n## 出差与派遣，分界在哪里？\n\n厚生劳动省的说明如下。\n\n> 属于海外“出張（出差）”或海外“派遣”，**并非依海外勤务期间的长短来判断，而是依该劳动者在海外的劳动关系来判断**。因此，即使海外勤务为长期，只要是依日本国内事业场所的指挥命令从事业务，即为海外出差；而隶属于海外的事业场所、依该事业场所的指挥命令执行业务等情形，则视为海外派遣。\n> （厚生劳动省 労働基準情報FAQ「海外出張先で事故に遭った場合、労災保険の適用はどうなるのでしょうか。」）\n\n也就是说，重点在于**受谁的指挥而工作**。将厚生劳动省「特別加入制度のしおり（海外派遣者用）」所列举的例示并排来看，轮廓就会清楚。\n\n| | 例子 |\n|---|---|\n| **海外出差**（日本国内的劳灾保险及于此） | 商务洽谈／技术会议／市场调查・会议・参访／售后服务／处理突发状况／技术研习 |\n| **海外派遣**（需要特别加入） | 向海外关联公司出向（借调）／调任海外分公司・营业所／从事海外的安装工程・建设工程 |\n\n**一旦出向到当地法人，不论期间长短都是海外派遣。** 反过来说，若是依日本总公司的指示行动、向日本的主管报告、适用日本的工作规则，即使1年也仍有整理为出差的空间。\n\n判断的依据不是书面上看起来像哪一种，而是**实际上受哪一方的指挥**。这个结构与[外包与雇佣的界线，并非由合同决定](/zh/labor/column/gaichu-koyo-sakaime-roudoushasei)所写的劳动者性判断，是同一套思考方式。\n\n## 在当地受伤时，可以使用哪一个制度？\n\n若属海外出差，由**日本国内事业场所的劳灾保险**给付，不需要特别的手续。\n\n若属海外派遣，**未办妥特别加入手续就无法领取给付**（労働者災害補償保険法第33条第7号、第36条第1项）。厚生劳动省的手册也明确记载“若未就海外派遣者办理特别加入手续，即无法领取劳灾保险的给付”。\n\n**有3点需要注意。**\n\n**第1点，可加入的身分有限制。** 労働者災害補償保険法第33条第7号规定，派遣目的地的海外事业**不属于特定事业时**，**限于以劳动者身分派遣者**。是否为特定事业依规模决定，而规模的判断是“**就海外各国分别、且以企业为单位**”进行。派遣目的地规模较大时，以事业主等身分前往的人无法加入。\n\n**第2点，当地聘雇者无法加入。** 因为并非自日本国内的事业所派遣。单纯以留学为目的的派遣也不在对象范围内。\n\n**第3点，无法事后加入。** 特别加入是经申请与政府承认的制度，因此**必须在出发前完成手续**。无法在事故发生后追溯加入。\n\n另外，社长本人前往海外的情形，与国内的特别加入属于不同的框架。国内特别加入的要件整理于[社长不适用劳灾保险；而且只有一人时也无法特别加入](/zh/labor/column/shacho-rosai-tokubetsu-kanyu-hitori)。\n\n## 当地的社会保险，要加入吗？\n\n这与劳灾是另一件事。整理如下。\n\n| 制度 | 在海外期间的处理 |\n|---|---|\n| 健康保险 | 只要受雇于适用事业所即**持续加保**（即使在日本国内没有住所也加保） |\n| 厚生年金保险 | 同上 |\n| 介护保险（第2号） | 在日本国内没有住所后即**适用除外**（需提出适用除外等該当届） |\n| 劳灾保险 | 出差时日本国内的保险及于此。派遣则需特别加入 |\n\n日本年金机构表示“**健康保险及厚生年金保险，只要在适用事业所任职，不问在日本国内有无住所均予加保**”“另一方面，介护保险仅限在日本国内有住所者加保”。若要办理海外迁出登记，请不要忘记**介護保険適用除外等該当届**。\n\n### 派往中国时——日中社会保障协定\n\n在中国，由日本企业派遣的人员也会成为当地社会保险的对象，但依**社会保障に関する日本国政府と中華人民共和国政府との間の協定**（令和元年条约第1号。**2019年9月1日生效**），设有避免双重参保的机制。\n\n**这项协定有数个在实务上容易被误解的地方。**\n\n| 论点 | 正确内容 |\n|---|---|\n| 免除的对象 | **仅限中国的职工基本养老保险**（日文：被用者基本老齢保険）。医疗保险・失业保险・工伤保险（劳灾保险）・生育保险不在对象范围内 |\n| 日本侧的对象制度 | 国民年金（不含基金）・厚生年金保险（不含基金）。**健康保险不在对象范围内** |\n| 期间的要件 | **不需要「見込み」（预估）**。派遣的**最初5年间**仅适用日本的法令（协定第6条1） |\n| 年金参保期间的通算 | **无法通算**。日中协定仅处理双重参保的防止 |\n| 香港・澳门 | **不在对象范围内** |\n| 自雇者（自营业者） | **不在对象范围内** |\n\n**★“以5年以内的预估期间派遣的情形”这种说明，并不适用于日中协定。** 日本年金机构针对中国的页面表示“不需要派遣期间长短的『预估』，自派遣开始日起5年间仅加入派遣来源国的年金制度”。事实上，申请书的填写方法也指示：派遣预定期间超过5年时，于预定结束年月日栏填写“自预定派遣开始年月日起届满5年之年月日”。**即使预估会超过5年，仍会就最初的5年核发适用证明书。**\n\n与美国、德国的协定属于“5年以内的预估”型，日本年金机构的一般页面也是这样写的。**中国属于例外的那一侧。** 只读一般页面就会搞错。\n\n### 适用证明书该如何处理\n\n要取得免除，必须**取得日本年金机构核发的适用证明书**（日文：適用証明書。协定第13条）。厚生劳动省的宣导刊物也表示“为免除加入中国的年金制度，必须事先取得日本年金机构等核发的『适用证明书』”。申请自**预定开始工作前约6个月起**即可办理。\n\n**而中国有与其他协定国不同的处理方式。** 日本年金机构要求如下。\n\n> 就日本年金机构核发的适用证明书，请于派遣至中国后尽速，通过派遣目的地的中国事业所，向管辖该派遣目的地事业所的社会保险费征收机关**提交原本**。（中略）**请依中国的法令，办理中国制度的适用免除手续。**\n\n一般的协定国只要“在对方国家主管机关要求时出示或提交”即可，相对地，**在中国则被要求于派遣后尽速主动提交原本，并且另外需要依中国法令办理的免除手续**。\n\n**这里避免断言。** 记载“提交原本后免除才开始生效”的日本侧一次资料，本所并未能确认（**未经查证**）。中国侧的生效要件属于中国法令规定的事项，超出日本公开资料的范围。**可以确定的是，日本年金机构同时要求提交原本与依中国法令办理手续这两件事。** 请不要在取得核发之后就停下来。\n\n派遣持续超过5年时，经**延长申请**由两国相关机关个别判断并达成合意，即可继续仅加入日本的制度（协定第6条2）。延长原则上不超过5年，但若有特殊情事，也有合计超过10年获准的空间。若延长未获准，则有**厚生年金保险的特例加入制度**（任意加入）作为承接的机制。\n\n## 派出之前，该确认什么？\n\n送人出去之前，请把以下5点写在纸上。\n\n1. **是出差还是派遣**——受谁的指挥而工作。若是向当地法人出向即为派遣\n2. **若是派遣，特别加入的申请是否已于出发前完成**——无法事后加入\n3. **是否持续加保健康保险・厚生年金保险**——只要受雇于适用事业所即持续加保\n4. **是否将住民票迁往海外**——若要迁出，需提出介護保険適用除外等該当届\n5. **若是中国，适用证明书的申请与到任后提交原本是否都已安排妥当**——可自6个月前开始申请\n\n**第2点与第5点，等日程确定后才行动有时会来不及。** 请在赴任内定的时点就着手办理。\n\n另外，若是在日本接纳外国人的一方，手续的主语就反过来了。关于在留资格本身请参见[在留资格・签证咨询](/zh/global)，关于企业接纳外籍员工时的手续请参见[外籍员工的接纳](/zh/legal/services/gaikokujin-shain)。**这些是四葉行政書士事務所承办的业务，与四葉社会保険労務士事務所是各自独立的事业体。** 委托时需**分别承接**、由各事务所**另行签约**。本公司・本所不进行介绍费的收受。\n\n## 常见问题\n\n**Q. 要派人到中国做3个月的技术指导。这是派遣还是出差？**\nA. 若不进入当地法人的指挥之下，而是依日本事业场所的指示行动、向日本的主管报告，就有整理为出差的空间。反过来说，若将人事关系移至当地法人并接受当地的指挥，即使只有3个月也是派遣。请以**指挥命令的所在而非期间**来确认。若判断上有疑虑，请先把指挥系统与工作规则的适用关系写出来，再与我们讨论。\n\n**Q. 特别加入的保险费大约要多少？**\nA. 海外派遣者的特别加入（第三种特别加入保险费）是依申请并获承认的给付基础日额计算。日额设定为多少，保险费与给付金额都会随之改变。实际金额于加入时决定，请事先与我们讨论。费用的思考方式请参见[报酬金额表](/zh/labor/ryokin)。\n\n**Q. 没有提出适用证明书，在中国会被收取保险费吗？**\nA. 中国侧的处理依中国的法令而定，本所无法断言。日本年金机构要求提交原本并依中国法令办理免除手续，这一点是事实，因此以**先把被要求的手续办妥**的思路进行，较为安全。\n\n**Q. 当地的医疗费用怎么办？**\nA. 日中协定的对象只有年金，**并不包含医疗保险**。健康保险的被保险者资格会持续，因此仍有使用海外疗养费制度的空间，但形式上是在当地先全额垫付、再回日本申请，支付金额也是依日本国内的基准计算。许多公司之所以同时投保民间的海外旅游保险或驻外人员保险，就是为了补上这个差距。**保险商品的选择不在本所的业务范围内，请向保险的专业人士咨询。**\n\n## 本文的依据\n\n- 労働者災害補償保険法（昭和22年法律第50号）第33条第6号・第7号、第36条第1项\n- 労働者災害補償保険法施行規則（昭和30年労働省令第22号）第46条之16、第46条之25之2\n- 厚生劳动省 労働基準情報FAQ「海外出張先で事故に遭った場合、労災保険の適用はどうなるのでしょうか。」（出差・派遣的判断不依勤务期间长短）\n- 厚生劳动省「特別加入制度のしおり（海外派遣者用）」（出差・派遣的定义与例示，以及未加入时无法领取给付）\n- 都道府县劳动局的公开资料（规模判断就海外各国分别、以企业为单位进行；当地聘雇者、以留学为目的的派遣不在对象范围内）\n- **社会保障に関する日本国政府と中華人民共和国政府との間の協定**（平成30年5月9日签署，**令和元年5月17日公布・条约第1号**，**令和元年9月1日生效**）第2条1、第6条1・2、第13条、第14条3\n- 厚生劳动省 年金局长通知（令和元年6月5日 年発0605第1号）——对象制度仅限年金、对象者仅限被用者，以及自派遣之日起最初5年间、延长的处理\n- 日本年金机构「協定相手国別の注意事項（中国）」——**派遣期间不需要预估**、适用证明书原本的提交、延长，以及香港・澳门・自雇者的处理\n- 日本年金机构「海外へ転勤または転職するときの手続き」——健康保险・厚生年金保险的持续加保、介护保险的适用除外\n- **适用证明书提交原本是否为中国侧免除生效的要件，本所在日本侧的一次资料中未能确认（未经查证）。** 因为这属于中国法令规定的事项\n- 以上条文均为2026年8月13日时点以e-Gov法令検索确认的现行条文\n\n**本文并未替您决定该找谁咨询。** 出差或派遣的整理、特别加入的申请、适用证明书的申请、健康保险・厚生年金保险的持续加保与介护保险适用除外的手续，是社会保险劳务士的业务。在留资格的申请由四葉行政書士事務所承办（**是各自独立的事业体，需另行签约**），海外赴任伴随的所得税・住民税处理请洽税理士，当地的劳动法令请洽当地的专业人士，均由您直接委任。本所不收取介绍费。委托四葉社会保険労務士事務所咨询时的费用整理于[报酬金额表](/zh/labor/ryokin)，常收到的提问则整理于[常见问题](/zh/labor/faq)。\n\n本文为一般性信息提供。依个别情况所为的判断，由具备资格者于面谈后进行。撰文者为[浦松丈二](/zh/about/uramatsu)（社会保险劳务士・行政书士・宅地建物取引士）。",
        "category": "劳动保险",
        "keywords": [
          "海外出差 海外派遣 劳灾 差异",
          "海外派遣 劳灾 特别加入",
          "日中社会保障协定 适用证明书",
          "中国 派驻 社会保险 免除",
          "海外赴任 健康保险 厚生年金",
          "海外工作 介护保险 适用除外"
        ],
        "tags": [
          "劳灾保险",
          "特别加入",
          "海外派遣",
          "社会保障协定",
          "中国"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社会保险劳务士・行政书士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "要派人到中国做3个月的技术指导。这是派遣还是出差？",
            "answer": "若不进入当地法人的指挥之下，而是依日本事业场所的指示行动、向日本的主管报告，就有整理为出差的空间。反过来说，若将人事关系移至当地法人并接受当地的指挥，即使只有3个月也是派遣。请以指挥命令的所在而非期间来确认。若判断上有疑虑，请先把指挥系统与工作规则的适用关系写出来，再与我们讨论。"
          },
          {
            "question": "特别加入的保险费大约要多少？",
            "answer": "海外派遣者的特别加入（第三种特别加入保险费）是依申请并获承认的给付基础日额计算。日额设定为多少，保险费与给付金额都会随之改变。实际金额于加入时决定，请事先与我们讨论。费用的思考方式请参见报酬金额表。"
          },
          {
            "question": "没有提出适用证明书，在中国会被收取保险费吗？",
            "answer": "中国侧的处理依中国的法令而定，本所无法断言。日本年金机构要求提交原本并依中国法令办理免除手续，这一点是事实，因此以先把被要求的手续办妥的思路进行，较为安全。"
          },
          {
            "question": "当地的医疗费用怎么办？",
            "answer": "日中协定的对象只有年金，并不包含医疗保险。健康保险的被保险者资格会持续，因此仍有使用海外疗养费制度的空间，但形式上是在当地先全额垫付、再回日本申请，支付金额也是依日本国内的基准计算。许多公司之所以同时投保民间的海外旅游保险或驻外人员保险，就是为了补上这个差距。保险商品的选择不在本所的业务范围内，请向保险的专业人士咨询。"
          }
        ]
      }
    }
  },
  {
    "business": "labor",
    "slug": "shugyokisoku-10nin-gimu-nani-ga-hitsuyo",
    "title": "就業規則は何人から義務か。義務でないものは何か",
    "date": "2026-09-01",
    "category": "労働法の基本",
    "excerpt": "就業規則の作成と届出が義務になるのは常時10人以上からです。ただしハラスメント防止の措置と育児・介護休業法上の措置は人数に関係なく義務で、労働条件の明示も1人目から必要です。令和8年10月からはカスタマーハラスメントへの対応も義務になります。",
    "content": "**結論（先に要点）**：就業規則の作成と届出が義務になるのは**常時10人以上**からです。ただし、**ハラスメント防止の措置**と**育児・介護休業法上の措置**は、**人数に関係なく**義務です。労働条件の明示も、1人目から必要です。「10人未満だから何も要らない」ではありません。\n\n「うちはまだ5人なので、就業規則は要りませんよね」というご質問をよくいただきます。**就業規則については、そのとおりです。** ただし就業規則が要らないことと、何も要らないことは違います。人数と無関係に効いてくる義務が、いくつもあります。\n\n## 就業規則は、何人から義務になるのか？\n\n労働基準法第89条が「**常時十人以上の労働者を使用する使用者**は、次に掲げる事項について就業規則を作成し、行政官庁に届け出なければならない」と定めています。変更したときも同じです。\n\n数え方には注意点があります。**「常時10人以上」は事業場ごとです。** 会社全体で15人でも、本社8人・支店7人なら、どちらの事業場も10人未満になります。逆に本社12人・支店3人なら、本社だけが義務の対象です。\n\n**パート・アルバイトも数に入ります。** 雇用形態を問わず、常態として使用している労働者の数です。日雇いや臨時のように、常態といえない人は除きます。\n\n**届出の期限は「◯日以内」ではありません。** 労働基準法施行規則第49条第1項は「常時十人以上の労働者を使用するに至つた場合においては、**遅滞なく**」、所轄労働基準監督署長に届け出るとしています。10人目を採用した時点で、猶予日数はありません。\n\n記載する事項は、**必ず書かなければならないもの**（絶対的必要記載事項）と、**制度を設けるなら書かなければならないもの**（相対的必要記載事項）に分かれます。\n\n| | 中身 |\n|---|---|\n| **必ず書く** | ①始業・終業の時刻、休憩時間、休日、休暇、交替制の就業時転換 ②賃金の決定・計算・支払の方法、締切りと支払の時期、昇給 ③退職に関する事項（**解雇の事由を含む**） |\n| **定めるなら書く** | 退職手当／臨時の賃金等・最低賃金額／食費・作業用品等の負担／安全衛生／職業訓練／災害補償・業務外の傷病扶助／表彰・制裁／その他全労働者に適用される定め |\n\n③の「解雇の事由を含む」は、実務で抜けやすいところです。\n\n## 10人未満なら、本当に何も要らないのか？\n\n要ります。**人数と無関係な義務**を並べると次のようになります。\n\n| 何が | 何人から | 根拠 |\n|---|---|---|\n| **労働条件の明示** | **1人目から** | 労働基準法第15条、同施行規則第5条 |\n| **ハラスメント防止措置**（パワーハラスメント） | **人数を問わず** | 労働施策総合推進法第30条の2第1項。中小企業は令和4年4月1日から義務 |\n| 相談等を理由とする**不利益取扱いの禁止** | **人数を問わず**（令和2年6月1日から） | 同条第2項 |\n| **育児休業・介護休業等に関する措置** | **人数を問わず** | 育児・介護休業法（第22条の2を除く） |\n| **育児休業等に関するハラスメント防止措置** | **人数を問わず** | 育児・介護休業法第25条 |\n| **36協定**（時間外・休日労働をさせるなら） | **人数を問わず** | 労働基準法第36条 |\n| 就業規則の作成・届出 | **常時10人以上** | 労働基準法第89条 |\n| 育児休業取得状況の公表 | **常時300人超** | 育児・介護休業法第22条の2 |\n\n**育児・介護休業法で規模要件が付いているのは第22条の2（取得状況の公表）だけです。** 育児休業・介護休業の申出への対応、子の看護等休暇、介護休暇、所定外労働・時間外労働・深夜業の制限、3歳未満の短時間勤務、妊娠・出産等の申出があった場合の個別周知と意向確認、雇用環境の整備——これらはすべて、従業員1人の会社でも義務です。\n\n**ハラスメント防止措置についても、誤解が2つあります。**\n\n1つめ。中小企業の義務化は令和4年4月1日からで、**すでに4年以上前**です。「中小企業は努力義務」という説明が残っていることがありますが、現在は義務です。\n\n2つめ。努力義務にとどめられていたのは第30条の2の**第1項だけ**でした。**第2項（相談したことを理由に不利益な取扱いをしてはならない）は、中小企業も令和2年6月1日から適用**されています。\n\nそして**36協定**。時間外労働または休日労働をさせるには、労働者の過半数代表者等との書面による協定を締結し、**所轄労働基準監督署長に届け出る**必要があります（労働基準法第36条第1項）。届け出ずに残業をさせている状態は、人数にかかわらず違法です。限度時間は原則として**1か月45時間・1年360時間**（同条第4項）です。\n\n## 令和8年10月から、何が増えるのか？\n\n**カスタマーハラスメント（顧客等からの著しい迷惑行為）への対応が義務になります。**\n\n令和7年法律第63号による労働施策総合推進法等の改正で、**令和8年10月1日から**、事業主に次の措置が義務づけられます。\n\n- **カスタマーハラスメント**（顧客等からの著しい迷惑行為）による就業環境の害を防止するための雇用管理上の措置\n- **求職者等に対するセクシュアルハラスメント**の防止措置\n\n**これも規模を問いません。** そして、この記事が公開される2026年9月1日の**翌月から**です。\n\nパワーハラスメントの防止措置と同じく、相談窓口の設置、方針の明確化と周知、事後の対応といった内容が求められます。**すでにパワハラの体制がある会社は、その枠を広げる形で対応できます。** 逆に、パワハラの措置自体が未整備の会社は、10月までに2つ分をまとめて整えることになります。\n\n## 何から手をつければいいのか？\n\n人数にかかわらず必要なものから順に、次の順序をおすすめしています。\n\n1. **労働条件通知書**（労働基準法第15条）——1人目から必要で、いちばん頻度が高い\n2. **36協定**（残業をさせるなら）——届出をしていなければ、いま残業させていること自体が問題\n3. **ハラスメント防止の体制**——令和8年10月にカスハラが加わる。いま整えれば一度で済む\n4. **育児・介護休業関係の規程と個別周知の手順**——申出があってからでは間に合わない\n5. **就業規則**（10人が見えてきたら）\n\n**1の労働条件の明示は、令和6年4月から項目が増えています。** 就業の場所および従事すべき業務の**変更の範囲**、有期契約の**更新上限**、無期転換申込権が発生する契約における**無期転換の申出に関する事項と転換後の労働条件**。書式を数年前のまま使っていると、この3つが抜けています。\n\n明示は**書面の交付**が原則で、本人が希望した場合に限りファクシミリや電子メール等でも可能です（労働基準法施行規則第5条第4項）。「口頭で伝えた」では足りません。\n\nなお、同居の親族を雇用保険に入れる場合、要件の一つとして「**就業規則その他これに準ずるものに定めるところにより**、その管理が他の労働者と同様になされていること」が求められます。10人未満でも書面が要る場面として、[家族を社員にするとき、つまずく3つのところ](/labor/column/kazoku-shain-koyohoken-yakuin-joseikin)もあわせてご覧ください。\n\n## よくある質問\n\n**Q. 常時10人未満ですが、就業規則を作ってもいいですか？**\nA. 作れます。義務がないだけで、禁じられているわけではありません。作成すれば、労働条件を個別に説明する手間が減り、懲戒処分の根拠も明確になります。なお、義務のない事業場が任意に作成した場合、届出の義務も生じませんが、**届け出ておくと内容の確認を受けられる**という実務上の利点があります。\n\n**Q. 10人を超えたのに就業規則がありません。すぐ罰せられますか？**\nA. 労働基準法第89条違反には罰則がありますが、実務では監督署の指導を経るのが通例です。ただし「指導されるまで放っておいてよい」という意味ではありません。**就業規則がないこと自体より、就業規則がないために労働条件が曖昧なままになっていることのほうが、実際には問題を招きます**。退職や解雇をめぐる争いになったときに、拠って立つものがない状態になります。\n\n**Q. 支店ごとに違う就業規則にしてもいいですか？**\nA. できます。就業規則は事業場ごとに作成・届出をするものなので、事業場ごとに内容が異なること自体は差し支えありません。ただし合理的な理由なく待遇に差を設けると、別の問題（不利益取扱い、同一労働同一賃金）が生じます。**なぜ違うのかを説明できる形にしておく**ことが必要です。\n\n**Q. ハラスメント防止措置は、具体的に何をすればよいのですか？**\nA. 方針の明確化と周知・啓発、相談に応じ適切に対応するために必要な体制の整備、事後の迅速かつ適切な対応、プライバシー保護と不利益取扱いの禁止の周知、といった内容が指針で示されています。**小規模な会社では、相談窓口を誰にするかが実際の悩みどころ**になります。社内に置けない場合の選択肢も含めてご相談ください。費用は[報酬額表](/labor/ryokin)をご覧ください。\n\n## この記事の根拠\n\n- 労働基準法（昭和22年法律第49号）第15条、第36条第1項・第4項、第89条\n- 労働基準法施行規則（昭和22年厚生省令第23号）第5条第1項・第3項・第4項・第5項、第16条第1項、第49条第1項\n- 労働施策の総合的な推進並びに労働者の雇用の安定及び職業生活の充実等に関する法律（昭和41年法律第132号）第30条の2第1項・第2項\n- 女性の職業生活における活躍の推進に関する法律等の一部を改正する法律（令和元年法律第24号）附則第3条（中小事業主に関する経過措置）。**中小企業への義務化は令和4年4月1日**。日付は厚生労働省「職場におけるパワーハラスメント対策が事業主の義務になりました！」（令和4年1月作成）および複数の都道府県労働局の公表資料により確認しました。**当該経過措置の「政令で定める日」を定めた政令の条文は確認できていません（未検証）**\n- 育児休業、介護休業等育児又は家族介護を行う労働者の福祉に関する法律（平成3年法律第76号）第5条、第9条の2、第10条、第16条の2、第16条の5、第16条の8、第17条、第19条、第21条、第22条、第23条第1項、第23条の3、第25条（**いずれも企業規模を問わない**）、第22条の2（**常時300人超**）\n- 労働施策総合推進法等の改正（令和7年法律第63号）による**カスタマーハラスメント防止措置および求職者等に対するセクシュアルハラスメント防止措置の義務化は、令和8年10月1日施行**。厚生労働省「令和8年10月1日からハラスメント対策が強化されます！」により確認\n- 条文はいずれも2026年8月13日時点でe-Gov法令検索により確認した現行条文です\n\n**この記事は、誰に相談するかまでは決めていません。** 就業規則・賃金規程の作成と届出、36協定の締結と届出、労働条件通知書の整備、ハラスメント防止体制の構築は社会保険労務士の業務です。すでに紛争になっている事案は弁護士、賃金規程に伴う源泉徴収や年末調整の扱いは税理士へ、それぞれ直接ご依頼いただく形をご案内します。当事務所は紹介料を受け取りません。四葉社会保険労務士事務所にご相談いただく場合の費用は[報酬額表](/labor/ryokin)に、よくいただくご質問は[よくあるご質問](/labor/faq)にまとめています。\n\n本記事は一般的な情報提供です。個別のご事情に応じた判断は、面談のうえ資格者が行います。執筆は[浦松丈二](/about/uramatsu)（社会保険労務士・行政書士・宅地建物取引士）です。",
    "status": "published",
    "author": {
      "name": "浦松 丈二",
      "title": "社会保険労務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
    },
    "keywords": [
      "就業規則 何人から 義務",
      "10人未満 就業規則 不要",
      "パワハラ防止措置 中小企業 義務",
      "カスタマーハラスメント 義務化 令和8年10月",
      "労働条件通知書 明示事項",
      "36協定 届出 人数"
    ],
    "tags": [
      "就業規則",
      "ハラスメント",
      "労働条件明示",
      "36協定",
      "育児介護休業法"
    ],
    "locales": [],
    "faq": [
      {
        "question": "常時10人未満ですが、就業規則を作ってもいいですか？",
        "answer": "作れます。義務がないだけで、禁じられているわけではありません。作成すれば、労働条件を個別に説明する手間が減り、懲戒処分の根拠も明確になります。なお、義務のない事業場が任意に作成した場合、届出の義務も生じませんが、届け出ておくと内容の確認を受けられるという実務上の利点があります。"
      },
      {
        "question": "10人を超えたのに就業規則がありません。すぐ罰せられますか？",
        "answer": "労働基準法第89条違反には罰則がありますが、実務では監督署の指導を経るのが通例です。ただし「指導されるまで放っておいてよい」という意味ではありません。就業規則がないこと自体より、就業規則がないために労働条件が曖昧なままになっていることのほうが、実際には問題を招きます。退職や解雇をめぐる争いになったときに、拠って立つものがない状態になります。"
      },
      {
        "question": "支店ごとに違う就業規則にしてもいいですか？",
        "answer": "できます。就業規則は事業場ごとに作成・届出をするものなので、事業場ごとに内容が異なること自体は差し支えありません。ただし合理的な理由なく待遇に差を設けると、別の問題（不利益取扱い、同一労働同一賃金）が生じます。なぜ違うのかを説明できる形にしておくことが必要です。"
      },
      {
        "question": "ハラスメント防止措置は、具体的に何をすればよいのですか？",
        "answer": "方針の明確化と周知・啓発、相談に応じ適切に対応するために必要な体制の整備、事後の迅速かつ適切な対応、プライバシー保護と不利益取扱いの禁止の周知、といった内容が指針で示されています。小規模な会社では、相談窓口を誰にするかが実際の悩みどころになります。社内に置けない場合の選択肢も含めてご相談ください。費用は報酬額表をご覧ください。"
      }
    ],
    "translations": {
      "en": {
        "title": "How many employees make work rules mandatory, and what applies no matter how few",
        "excerpt": "Drawing up and filing work rules becomes mandatory once you regularly employ 10 or more workers. Harassment-prevention measures and the measures under the Child Care and Family Care Leave Act, however, are mandatory regardless of headcount, and written notice of working conditions is required from your very first hire. From October 2026, responding to customer harassment also becomes mandatory.",
        "content": "**In short:** Drawing up and filing work rules becomes mandatory once you **regularly employ 10 or more workers**. However, **harassment-prevention measures** and the **measures under the Child Care and Family Care Leave Act** are mandatory **regardless of headcount**. Written notice of working conditions is required from your first employee too. \"We have fewer than 10 people, so we need nothing\" does not hold.\n\nWe are often asked, \"We are still only five people, so we don't need work rules, do we?\" **As far as work rules go, that is correct.** But not needing work rules is not the same as needing nothing. Several obligations bite regardless of how many people you employ.\n\n## How many employees does it take before work rules become mandatory?\n\nArticle 89 of the Labor Standards Act (労働基準法, Act No. 49 of 1947) provides that \"**an employer who regularly employs 10 or more workers** shall draw up work rules covering the matters listed below and file them with the administrative agency.\" The same applies when the rules are amended.\n\nThere are traps in how you count. **\"Regularly 10 or more\" is counted per place of business.** If the company has 15 people in total but 8 at head office and 7 at a branch, both places of business are under 10. Conversely, with 12 at head office and 3 at a branch, only head office is subject to the obligation.\n\n**Part-timers and casual staff are included in the count.** The figure is the number of workers you employ as a normal state of affairs, whatever the form of employment. People who cannot be described as normally employed, such as day laborers and temporary hires, are excluded.\n\n**The filing deadline is not \"within X days.\"** Article 49, paragraph 1 of the Ordinance for Enforcement of the Labor Standards Act (労働基準法施行規則, Ordinance of the Ministry of Health and Welfare No. 23 of 1947) provides that where an employer \"has come to regularly employ 10 or more workers,\" the filing with the head of the competent Labor Standards Inspection Office must be made **without delay**. From the moment you hire your tenth worker, there is no grace period counted in days.\n\nThe matters to be stated split into those that **must always be written** (absolutely required matters) and those that **must be written if you have such a system** (relatively required matters).\n\n| | Content |\n|---|---|\n| **Always write** | (1) Starting and finishing times, rest periods, days off, leave, and shift changeovers where work is in shifts (2) Determination, calculation and method of payment of wages, the closing date and timing of payment, and pay raises (3) Matters concerning resignation and termination (**including the grounds for dismissal**) |\n| **Write if you have the system** | Retirement allowances / temporary wages and minimum wage amounts / worker-borne meal costs, work supplies and the like / safety and health / vocational training / accident compensation and support for non-work injury and illness / commendations and sanctions / any other rule applying to all workers |\n\n\"Including the grounds for dismissal\" in (3) is the part most easily missed in practice.\n\n## If you have fewer than 10 people, is nothing really required?\n\nThings are required. Laid out, the obligations that **do not depend on headcount** look like this.\n\n| What | From how many | Basis |\n|---|---|---|\n| **Written notice of working conditions** | **From the first employee** | Labor Standards Act, Article 15; Ordinance for Enforcement of the Labor Standards Act, Article 5 |\n| **Harassment-prevention measures** (power harassment) | **Regardless of headcount** | Labor Measures Comprehensive Promotion Act (労働施策の総合的な推進並びに労働者の雇用の安定及び職業生活の充実等に関する法律, Act No. 132 of 1966), Article 30-2, paragraph 1. Mandatory for small and medium-sized enterprises from April 1, 2022 (令和4年4月1日) |\n| Prohibition of **disadvantageous treatment** on the grounds of having raised a consultation | **Regardless of headcount** (from June 1, 2020 / 令和2年6月1日) | Same Article, paragraph 2 |\n| **Measures concerning child care leave, family care leave and the like** | **Regardless of headcount** | Child Care and Family Care Leave Act (育児休業、介護休業等育児又は家族介護を行う労働者の福祉に関する法律, Act No. 76 of 1991) (except Article 22-2) |\n| **Measures to prevent harassment relating to child care leave and the like** | **Regardless of headcount** | Child Care and Family Care Leave Act, Article 25 |\n| **Article 36 agreement** (if you have people work overtime or on days off) | **Regardless of headcount** | Labor Standards Act, Article 36 |\n| Drawing up and filing work rules | **Regularly 10 or more** | Labor Standards Act, Article 89 |\n| Publication of the rate at which child care leave is taken | **Regularly more than 300** | Child Care and Family Care Leave Act, Article 22-2 |\n\n**Within the Child Care and Family Care Leave Act, the only provision carrying a company-size requirement is Article 22-2 (publication of take-up rates).** Responding to applications for child care leave and family care leave, leave to care for a child, family care leave, restrictions on work outside scheduled hours, on overtime work and on late-night work, shortened working hours for children under three, individual notification and confirmation of intent when an employee reports a pregnancy or birth, and putting the employment environment in place — all of these are obligations even in a company with one employee.\n\n**There are also two misunderstandings about harassment-prevention measures.**\n\nFirst. The obligation for small and medium-sized enterprises started on April 1, 2022 (令和4年4月1日), which is **already more than four years ago**. Explanations describing it as \"an effort obligation for small and medium-sized enterprises\" are still in circulation, but it is now a hard obligation.\n\nSecond. What was left as an effort obligation was **only paragraph 1** of Article 30-2. **Paragraph 2 (you must not treat a worker disadvantageously on the grounds that they raised a consultation) has applied to small and medium-sized enterprises since June 1, 2020 (令和2年6月1日).**\n\nAnd then the **Article 36 agreement**. To have workers work overtime or on days off, you must conclude a written agreement with a representative of the majority of workers or the like, and **file it with the head of the competent Labor Standards Inspection Office** (Labor Standards Act, Article 36, paragraph 1). Having people work overtime without filing it is unlawful regardless of headcount. The limit is, as a rule, **45 hours a month and 360 hours a year** (same Article, paragraph 4).\n\n## What gets added from October 2026?\n\n**Dealing with customer harassment (severely abusive conduct by customers and others) becomes mandatory.**\n\nUnder the amendment of the Labor Measures Comprehensive Promotion Act and related acts by Act No. 63 of 2025 (令和7年法律第63号), employers are required to take the following measures **from October 1, 2026 (令和8年10月1日)**:\n\n- Employment-management measures to prevent harm to the working environment caused by **customer harassment** (severely abusive conduct by customers and others)\n- Measures to prevent **sexual harassment against job applicants and others**\n\n**This too applies regardless of size.** And it starts **the month after** September 1, 2026, the day this article is published.\n\nAs with the measures against power harassment, what is required is a consultation desk, a clearly stated and publicized policy, and appropriate follow-up afterwards. **A company that already has a power harassment framework can respond by widening that same frame.** A company that has not put the power harassment measures themselves in place will have to build both at once by October.\n\n## Where should you start?\n\nWe recommend the following order, starting with what is required regardless of headcount.\n\n1. **The written notice of working conditions** (Labor Standards Act, Article 15) — required from your first employee, and the item that arises most often\n2. **The Article 36 agreement** (if you have people work overtime) — if you have not filed it, the overtime being worked right now is itself the problem\n3. **A harassment-prevention framework** — customer harassment joins it in October 2026. Build it now and it is done in one pass\n4. **Rules on child care and family care leave, and the procedure for individual notification** — waiting until an application arrives is too late\n5. **Work rules** (once 10 people come into view)\n\n**On item 1, the required items increased in April 2024 (令和6年4月).** The **scope of change** of the place of work and of the duties to be performed; the **cap on renewals** for fixed-term contracts; and, for contracts where the right to apply for conversion to an indefinite term arises, **the matters concerning that application and the working conditions after conversion**. If you are still using a form from several years ago, those three are missing.\n\nNotice must in principle be given by **delivering a written document**; only where the worker so requests may it be given by facsimile, email or the like (Ordinance for Enforcement of the Labor Standards Act, Article 5, paragraph 4). \"We told them verbally\" is not enough.\n\nOne more point: where you enroll a co-residing relative in employment insurance, one of the requirements is that the person \"be managed in the same way as other workers **in accordance with the work rules or something equivalent to them**.\" As a situation calling for a written document even below 10 people, see also [Three places people stumble when putting family on the payroll](/en/labor/column/kazoku-shain-koyohoken-yakuin-joseikin).\n\n## Frequently asked questions\n\n**Q. We regularly employ fewer than 10 people. May we draw up work rules anyway?**\nA. You may. There is simply no obligation; it is not prohibited. Drawing them up reduces the effort of explaining working conditions one person at a time, and it makes the basis for disciplinary action clear. Note that where a place of business with no obligation draws them up voluntarily, no filing obligation arises either — but **filing them anyway has the practical advantage of getting the content reviewed**.\n\n**Q. We have passed 10 people and have no work rules. Will we be penalized straight away?**\nA. There are penalties for violating Article 89 of the Labor Standards Act, but in practice guidance from the inspection office normally comes first. That does not mean \"you may leave it alone until you are told.\" **What actually invites trouble is less the absence of work rules than the fact that, without them, working conditions stay vague.** When a dispute over resignation or dismissal arises, you have nothing to stand on.\n\n**Q. May we have different work rules for each branch?**\nA. You may. Work rules are drawn up and filed per place of business, so differences in content between places of business are not in themselves a problem. However, creating differences in treatment without a rational reason gives rise to other issues (disadvantageous treatment; equal pay for equal work). **You need to be in a position to explain why they differ.**\n\n**Q. What exactly are we supposed to do for harassment-prevention measures?**\nA. The guidelines set out clarifying the policy and making it known, putting in place the framework needed to receive consultations and respond appropriately, prompt and appropriate follow-up, and making known the protection of privacy and the prohibition of disadvantageous treatment. **In a small company, the real difficulty is deciding who staffs the consultation desk.** Please talk to us, including about the options where it cannot be placed inside the company. For fees, see the [fee schedule](/en/labor/ryokin).\n\n## Sources for this article\n\n- 労働基準法 (Labor Standards Act, Act No. 49 of 1947), Article 15, Article 36 paragraphs 1 and 4, and Article 89\n- 労働基準法施行規則 (Ordinance for Enforcement of the Labor Standards Act, Ordinance of the Ministry of Health and Welfare No. 23 of 1947), Article 5 paragraphs 1, 3, 4 and 5, Article 16 paragraph 1, Article 49 paragraph 1\n- 労働施策の総合的な推進並びに労働者の雇用の安定及び職業生活の充実等に関する法律 (Act No. 132 of 1966), Article 30-2 paragraphs 1 and 2\n- 女性の職業生活における活躍の推進に関する法律等の一部を改正する法律 (Act No. 24 of 2019 / 令和元年法律第24号), Supplementary Provisions Article 3 (transitional measures for small and medium-sized employers). **The obligation for small and medium-sized enterprises took effect on April 1, 2022 (令和4年4月1日).** The date was confirmed from the Ministry of Health, Labour and Welfare's 「職場におけるパワーハラスメント対策が事業主の義務になりました！」 (prepared January 2022 / 令和4年1月) and from published materials of several Prefectural Labour Bureaus. **We have not been able to confirm the text of the Cabinet Order fixing the \"day specified by Cabinet Order\" for that transitional measure (unverified).**\n- 育児休業、介護休業等育児又は家族介護を行う労働者の福祉に関する法律 (Act No. 76 of 1991), Articles 5, 9-2, 10, 16-2, 16-5, 16-8, 17, 19, 21, 22, 23 paragraph 1, 23-3 and 25 (**none of which depend on company size**), and Article 22-2 (**regularly more than 300**)\n- The amendment of the 労働施策総合推進法 and related acts by 令和7年法律第63号 makes **the obligation to take customer harassment prevention measures and measures to prevent sexual harassment against job applicants and others effective on October 1, 2026 (令和8年10月1日)**. Confirmed from the Ministry of Health, Labour and Welfare's 「令和8年10月1日からハラスメント対策が強化されます！」\n- All statutory provisions are the versions in force as confirmed on e-Gov法令検索 on August 13, 2026\n\n**This article does not go so far as to decide whom you should consult.** Drawing up and filing work rules and wage rules, concluding and filing the Article 36 agreement, putting written notices of working conditions in order, and building a harassment-prevention framework are the work of a Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant). Matters that have already become disputes go to an attorney, and the handling of withholding tax and the year-end adjustment that comes with wage rules goes to a tax accountant — in each case we will point you to them and you engage them directly. This office does not accept referral fees. The cost of consulting 四葉社会保険労務士事務所 is set out in the [fee schedule](/en/labor/ryokin), and the questions we are asked most often are collected on the [FAQ page](/en/labor/faq).\n\nThis article is general information. Judgments that fit your particular circumstances are made by a qualified professional after a meeting. Written by [Joji Uramatsu](/en/about/uramatsu) (Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist).",
        "category": "Labor law basics",
        "keywords": [
          "work rules how many employees mandatory",
          "fewer than 10 employees work rules not required",
          "power harassment prevention measures small and medium-sized enterprises",
          "customer harassment mandatory October 2026",
          "written notice of working conditions required items",
          "Article 36 agreement filing headcount"
        ],
        "tags": [
          "work rules",
          "harassment",
          "notice of working conditions",
          "Article 36 agreement",
          "Child Care and Family Care Leave Act"
        ],
        "author": {
          "name": "Joji Uramatsu",
          "title": "Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist — 四葉社会保険労務士事務所／四葉行政書士事務所"
        },
        "faq": [
          {
            "question": "We regularly employ fewer than 10 people. May we draw up work rules anyway?",
            "answer": "You may. There is simply no obligation; it is not prohibited. Drawing them up reduces the effort of explaining working conditions one person at a time, and it makes the basis for disciplinary action clear. Note that where a place of business with no obligation draws them up voluntarily, no filing obligation arises either — but filing them anyway has the practical advantage of getting the content reviewed."
          },
          {
            "question": "We have passed 10 people and have no work rules. Will we be penalized straight away?",
            "answer": "There are penalties for violating Article 89 of the Labor Standards Act, but in practice guidance from the inspection office normally comes first. That does not mean \"you may leave it alone until you are told.\" What actually invites trouble is less the absence of work rules than the fact that, without them, working conditions stay vague. When a dispute over resignation or dismissal arises, you have nothing to stand on."
          },
          {
            "question": "May we have different work rules for each branch?",
            "answer": "You may. Work rules are drawn up and filed per place of business, so differences in content between places of business are not in themselves a problem. However, creating differences in treatment without a rational reason gives rise to other issues (disadvantageous treatment; equal pay for equal work). You need to be in a position to explain why they differ."
          },
          {
            "question": "What exactly are we supposed to do for harassment-prevention measures?",
            "answer": "The guidelines set out clarifying the policy and making it known, putting in place the framework needed to receive consultations and respond appropriately, prompt and appropriate follow-up, and making known the protection of privacy and the prohibition of disadvantageous treatment. In a small company, the real difficulty is deciding who staffs the consultation desk. Please talk to us, including about the options where it cannot be placed inside the company. For fees, see the fee schedule."
          }
        ]
      },
      "zh-tw": {
        "title": "就業規則從幾人開始成為義務？不是義務的又是哪些？",
        "excerpt": "就業規則的制定與申報，從經常僱用10人以上開始成為義務。但防止騷擾的措施與育兒・照護休業法上的措施，與人數無關一律是義務，勞動條件的明示也從第1位員工起就必須進行。從令和8年10月起，因應顧客騷擾也將成為義務。",
        "content": "**結論（先講重點）**：就業規則的制定與申報成為義務，是從**經常僱用10人以上**開始。但是，**防止騷擾的措施**與**育兒・照護休業法上的措施**，**與人數無關**一律是義務。勞動條件的明示，也從第1位員工起就必須進行。並不是「未滿10人所以什麼都不需要」。\n\n我們經常被問到：「我們公司才5個人，應該不需要就業規則吧？」**就就業規則而言，確實如此。** 但是「不需要就業規則」和「什麼都不需要」是兩回事。與人數無關而發生效力的義務，有好幾項。\n\n## 就業規則從幾人開始成為義務？\n\n日本《勞動基準法》（労働基準法，昭和22年法律第49號）第89條規定：「**經常使用十人以上勞動者的使用者**，就下列事項應制定就業規則，並向行政官廳申報。」變更時亦同。\n\n計算方式有需要注意的地方。**「經常10人以上」是以事業場為單位。** 即使公司整體有15人，若總公司8人、分店7人，兩個事業場都未滿10人。反之，若總公司12人、分店3人，則只有總公司是義務的對象。\n\n**兼職人員、工讀生也計入人數。** 不問僱用形態，指的是作為常態所使用的勞動者人數。像日僱、臨時性等無法稱為常態的人則予以排除。\n\n**申報期限並不是「◯日以內」。** 日本《勞動基準法施行規則》（労働基準法施行規則，昭和22年厚生省令第23號）第49條第1項規定，「在成為經常使用十人以上勞動者的情形下」，應**不遲延地**向所轄勞動基準監督署長申報。從僱用第10人的時點起，並沒有以日數計算的寬限期。\n\n應記載的事項，分為**必須記載者**（絕對必要記載事項）與**設有該制度時必須記載者**（相對必要記載事項）。\n\n| | 內容 |\n|---|---|\n| **一定要寫** | ①上班・下班時刻、休息時間、休假日、休假、輪班制的工作班次輪換 ②工資的決定・計算・支付方法、結算日與支付時期、調薪 ③關於離職的事項（**包含解僱的事由**） |\n| **設有制度就要寫** | 退職金／臨時工資等・最低工資額／伙食費・作業用品等的負擔／安全衛生／職業訓練／災害補償・業務外的傷病扶助／表揚・懲戒／其他適用於全體勞動者的規定 |\n\n③的「包含解僱的事由」，是實務上最容易漏掉的地方。\n\n## 未滿10人的話，真的什麼都不需要嗎？\n\n需要。把**與人數無關的義務**列出來如下。\n\n| 什麼 | 從幾人開始 | 依據 |\n|---|---|---|\n| **勞動條件的明示** | **從第1人開始** | 日本《勞動基準法》第15條、同施行規則第5條 |\n| **防止騷擾的措施**（職權騷擾） | **不問人數** | 日本《勞動施策綜合推進法》（労働施策の総合的な推進並びに労働者の雇用の安定及び職業生活の充実等に関する法律，昭和41年法律第132號）第30條之2第1項。中小企業自令和4年（2022年）4月1日起為義務 |\n| 禁止因提出諮詢等而為**不利益對待** | **不問人數**（自令和2年（2020年）6月1日起） | 同條第2項 |\n| **關於育兒休業・照護休業等的措施** | **不問人數** | 日本《育兒・照護休業法》（育児休業、介護休業等育児又は家族介護を行う労働者の福祉に関する法律，平成3年法律第76號）（第22條之2除外） |\n| **關於育兒休業等的防止騷擾措施** | **不問人數** | 日本《育兒・照護休業法》第25條 |\n| **36協定**（若要讓員工從事延長工時・休假日勞動） | **不問人數** | 日本《勞動基準法》第36條 |\n| 就業規則的制定・申報 | **經常10人以上** | 日本《勞動基準法》第89條 |\n| 育兒休業取得狀況的公布 | **經常超過300人** | 日本《育兒・照護休業法》第22條之2 |\n\n**在育兒・照護休業法中，附有規模要件的只有第22條之2（取得狀況的公布）。** 對育兒休業・照護休業申請的因應、照顧子女等的休假、照護休假、限制法定外勞動・延長工時勞動・深夜勞動、未滿3歲的縮短工時工作、有懷孕・生產等申報時的個別告知與意向確認、僱用環境的整備——這些全部，即使是只有1位員工的公司也是義務。\n\n**關於防止騷擾的措施，也有兩個誤解。**\n\n第一個。中小企業的義務化是自令和4年（2022年）4月1日起，**已經超過4年**。有時仍留有「中小企業是努力義務」的說明，但現在是義務。\n\n第二個。當時被留在努力義務的，只有第30條之2的**第1項**。**第2項（不得以曾提出諮詢為由而為不利益對待），中小企業自令和2年（2020年）6月1日起就已適用。**\n\n然後是**36協定**。要讓員工從事延長工時勞動或休假日勞動，必須與勞動者過半數代表者等締結書面協定，並**向所轄勞動基準監督署長申報**（日本《勞動基準法》第36條第1項）。未申報卻讓員工加班的狀態，不問人數都是違法的。上限時間原則上是**1個月45小時・1年360小時**（同條第4項）。\n\n## 從令和8年10月起，會增加什麼？\n\n**因應顧客騷擾（來自顧客等的顯著困擾行為）將成為義務。**\n\n依令和7年法律第63號對勞動施策綜合推進法等的修正，**自令和8年（2026年）10月1日起**，事業主被課予下列措施的義務。\n\n- 為防止因**顧客騷擾**（來自顧客等的顯著困擾行為）而損害工作環境所需的僱用管理上的措施\n- 防止**對求職者等的性騷擾**的措施\n\n**這同樣不問規模。** 而且，是本文公開日2026年9月1日的**次月**。\n\n與職權騷擾的防止措施相同，要求的內容包括設置諮詢窗口、明確方針並周知、事後的因應等。**已經建立職權騷擾體制的公司，可以用擴大該框架的方式因應。** 反之，連職權騷擾的措施本身都尚未整備的公司，就得在10月之前一次整備兩份。\n\n## 該從哪裡著手？\n\n我們建議依照下列順序，從與人數無關而必要的項目開始。\n\n1. **勞動條件通知書**（日本《勞動基準法》第15條）——從第1人起就必要，發生頻率也最高\n2. **36協定**（若要讓員工加班）——若未申報，現在讓員工加班這件事本身就有問題\n3. **防止騷擾的體制**——令和8年10月將加入顧客騷擾。現在整備就能一次完成\n4. **育兒・照護休業相關的規程與個別告知的程序**——等到有人提出申請才做就來不及了\n5. **就業規則**（當10人的門檻已在眼前時）\n\n**第1項的勞動條件明示，自令和6年（2024年）4月起項目增加了。** 工作場所及應從事業務的**變更範圍**、有期契約的**更新上限**、發生無期轉換申請權的契約中**關於無期轉換申請的事項與轉換後的勞動條件**。若還在使用數年前的格式，這3項就會漏掉。\n\n明示原則上以**交付書面**為之，僅在本人希望的情形下才可以用傳真或電子郵件等方式（日本《勞動基準法施行規則》第5條第4項）。「已經口頭告知」並不足夠。\n\n另外，要為同居的親屬加入僱用保險時，要件之一是「**依就業規則或準此之規定**，其管理與其他勞動者相同」。作為未滿10人也需要書面的場面，請一併參閱[讓家人成為員工時，容易卡住的3個地方](/zh-tw/labor/column/kazoku-shain-koyohoken-yakuin-joseikin)。\n\n## 常見問題\n\n**Q. 我們經常未滿10人，可以制定就業規則嗎？**\nA. 可以制定。只是沒有義務，並不是被禁止。制定之後，可以減少逐一說明勞動條件的工夫，懲戒處分的依據也會明確。此外，沒有義務的事業場自行制定時，也不會產生申報義務，但**先行申報有可以獲得內容確認的實務上優點**。\n\n**Q. 已經超過10人卻沒有就業規則，會馬上被處罰嗎？**\nA. 違反日本《勞動基準法》第89條有罰則，但實務上通常會先經過監督署的指導。不過這並不表示「可以放著不管直到被指導為止」。**比起沒有就業規則本身，因為沒有就業規則而使勞動條件一直含糊不清，實際上更容易招來問題。** 一旦發生關於離職或解僱的爭議，就會處於無所依憑的狀態。\n\n**Q. 可以各分店訂定不同的就業規則嗎？**\nA. 可以。就業規則是以事業場為單位制定・申報，因此各事業場內容不同本身並無妨。但若無合理理由而在待遇上設有差異，會產生另外的問題（不利益對待、同工同酬）。**必須做成能夠說明「為什麼不同」的形式。**\n\n**Q. 防止騷擾的措施，具體上要做什麼？**\nA. 指針列出的內容包括：明確方針並周知・啟發、為受理諮詢並適切因應所需體制的整備、事後迅速且適切的因應、周知隱私保護與禁止不利益對待等。**在小規模公司，實際的煩惱往往是諮詢窗口要由誰擔任。** 包含無法設在公司內部時的選項在內，歡迎與我們討論。費用請參閱[報酬額表](/zh-tw/labor/ryokin)。\n\n## 本文的依據\n\n- 労働基準法（昭和22年法律第49號）第15條、第36條第1項・第4項、第89條\n- 労働基準法施行規則（昭和22年厚生省令第23號）第5條第1項・第3項・第4項・第5項、第16條第1項、第49條第1項\n- 労働施策の総合的な推進並びに労働者の雇用の安定及び職業生活の充実等に関する法律（昭和41年法律第132號）第30條之2第1項・第2項\n- 女性の職業生活における活躍の推進に関する法律等の一部を改正する法律（令和元年法律第24號）附則第3條（關於中小事業主的過渡措施）。**對中小企業的義務化是令和4年（2022年）4月1日。** 日期是依厚生勞動省「職場におけるパワーハラスメント対策が事業主の義務になりました！」（令和4年1月製作）以及多個都道府縣勞動局的公開資料確認。**該過渡措施中「以政令所定之日」的政令條文尚未能確認（未查證）**\n- 育児休業、介護休業等育児又は家族介護を行う労働者の福祉に関する法律（平成3年法律第76號）第5條、第9條之2、第10條、第16條之2、第16條之5、第16條之8、第17條、第19條、第21條、第22條、第23條第1項、第23條之3、第25條（**均不問企業規模**）、第22條之2（**經常超過300人**）\n- 依令和7年法律第63號對労働施策総合推進法等的修正，**顧客騷擾防止措施及對求職者等的性騷擾防止措施的義務化，自令和8年（2026年）10月1日施行**。依厚生勞動省「令和8年10月1日からハラスメント対策が強化されます！」確認\n- 條文均為2026年8月13日時點以e-Gov法令検索確認的現行條文\n\n**本文並未決定到「該向誰諮詢」為止。** 就業規則・工資規程的制定與申報、36協定的締結與申報、勞動條件通知書的整備、防止騷擾體制的建立，是社會保險勞務士的業務。已經發生爭議的案件請洽律師，隨工資規程而來的源泉徵收與年終調整的處理請洽稅理士，我們會為您轉介，由您各自直接委任。本事務所不收取介紹費。向四葉社会保険労務士事務所諮詢時的費用整理於[報酬額表](/zh-tw/labor/ryokin)，常被詢問的問題整理於[常見問答](/zh-tw/labor/faq)。\n\n本文為一般性的資訊提供。因應個別情事的判斷，由具備資格者在面談後進行。撰文者為[浦松丈二](/zh-tw/about/uramatsu)（社會保險勞務士・行政書士・宅地建物取引士）。",
        "category": "勞動法基礎",
        "keywords": [
          "就業規則 幾人 義務",
          "未滿10人 就業規則 不需要",
          "職權騷擾防止措施 中小企業 義務",
          "顧客騷擾 義務化 令和8年10月",
          "勞動條件通知書 明示事項",
          "36協定 申報 人數"
        ],
        "tags": [
          "就業規則",
          "騷擾",
          "勞動條件明示",
          "36協定",
          "育兒照護休業法"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社會保險勞務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "我們經常未滿10人，可以制定就業規則嗎？",
            "answer": "可以制定。只是沒有義務，並不是被禁止。制定之後，可以減少逐一說明勞動條件的工夫，懲戒處分的依據也會明確。此外，沒有義務的事業場自行制定時，也不會產生申報義務，但先行申報有可以獲得內容確認的實務上優點。"
          },
          {
            "question": "已經超過10人卻沒有就業規則，會馬上被處罰嗎？",
            "answer": "違反日本《勞動基準法》第89條有罰則，但實務上通常會先經過監督署的指導。不過這並不表示「可以放著不管直到被指導為止」。比起沒有就業規則本身，因為沒有就業規則而使勞動條件一直含糊不清，實際上更容易招來問題。 一旦發生關於離職或解僱的爭議，就會處於無所依憑的狀態。"
          },
          {
            "question": "可以各分店訂定不同的就業規則嗎？",
            "answer": "可以。就業規則是以事業場為單位制定・申報，因此各事業場內容不同本身並無妨。但若無合理理由而在待遇上設有差異，會產生另外的問題（不利益對待、同工同酬）。必須做成能夠說明「為什麼不同」的形式。"
          },
          {
            "question": "防止騷擾的措施，具體上要做什麼？",
            "answer": "指針列出的內容包括：明確方針並周知・啟發、為受理諮詢並適切因應所需體制的整備、事後迅速且適切的因應、周知隱私保護與禁止不利益對待等。在小規模公司，實際的煩惱往往是諮詢窗口要由誰擔任。 包含無法設在公司內部時的選項在內，歡迎與我們討論。費用請參閱報酬額表。"
          }
        ]
      },
      "zh": {
        "title": "就业规则从几人开始成为义务？不是义务的又有哪些？",
        "excerpt": "就业规则的制定与申报，从经常雇用10人以上开始成为义务。但防止骚扰的措施与育儿・护理休业法上的措施，与人数无关一律是义务，劳动条件的明示也从第1位员工起就必须进行。从令和8年10月起，应对顾客骚扰也将成为义务。",
        "content": "**结论（先讲重点）**：就业规则的制定与申报成为义务，是从**经常雇用10人以上**开始。但是，**防止骚扰的措施**与**育儿・护理休业法上的措施**，**与人数无关**一律是义务。劳动条件的明示，也从第1位员工起就必须进行。并不是「不满10人所以什么都不需要」。\n\n我们经常被问到：「我们公司才5个人，应该不需要就业规则吧？」**就就业规则而言，确实如此。** 但是「不需要就业规则」和「什么都不需要」是两回事。与人数无关而发生效力的义务，有好几项。\n\n## 就业规则从几人开始成为义务？\n\n日本《劳动基准法》（労働基準法，昭和22年法律第49号）第89条规定：「**经常使用十人以上劳动者的使用者**，就下列事项应制定就业规则，并向行政官厅申报。」变更时亦同。\n\n计算方式有需要注意的地方。**「经常10人以上」是以事业场为单位。** 即使公司整体有15人，若总公司8人、分店7人，两个事业场都不满10人。反之，若总公司12人、分店3人，则只有总公司是义务的对象。\n\n**兼职人员、打工人员也计入人数。** 不问雇用形态，指的是作为常态所使用的劳动者人数。像日雇、临时性等无法称为常态的人则予以排除。\n\n**申报期限并不是「◯日以内」。** 日本《劳动基准法施行规则》（労働基準法施行規則，昭和22年厚生省令第23号）第49条第1项规定，「在成为经常使用十人以上劳动者的情形下」，应**不迟延地**向所辖劳动基准监督署长申报。从雇用第10人的时点起，并没有以日数计算的宽限期。\n\n应记载的事项，分为**必须记载者**（绝对必要记载事项）与**设有该制度时必须记载者**（相对必要记载事项）。\n\n| | 内容 |\n|---|---|\n| **一定要写** | ①上班・下班时刻、休息时间、休假日、休假、轮班制的工作班次轮换 ②工资的决定・计算・支付方法、结算日与支付时期、调薪 ③关于离职的事项（**包含解雇的事由**） |\n| **设有制度就要写** | 退职金／临时工资等・最低工资额／伙食费・作业用品等的负担／安全卫生／职业训练／灾害补偿・业务外的伤病扶助／表彰・惩戒／其他适用于全体劳动者的规定 |\n\n③的「包含解雇的事由」，是实务上最容易漏掉的地方。\n\n## 不满10人的话，真的什么都不需要吗？\n\n需要。把**与人数无关的义务**列出来如下。\n\n| 什么 | 从几人开始 | 依据 |\n|---|---|---|\n| **劳动条件的明示** | **从第1人开始** | 日本《劳动基准法》第15条、同施行规则第5条 |\n| **防止骚扰的措施**（职权骚扰） | **不问人数** | 日本《劳动施策综合推进法》（労働施策の総合的な推進並びに労働者の雇用の安定及び職業生活の充実等に関する法律，昭和41年法律第132号）第30条之2第1项。中小企业自令和4年（2022年）4月1日起为义务 |\n| 禁止因提出咨询等而作**不利益对待** | **不问人数**（自令和2年（2020年）6月1日起） | 同条第2项 |\n| **关于育儿休业・护理休业等的措施** | **不问人数** | 日本《育儿・护理休业法》（育児休業、介護休業等育児又は家族介護を行う労働者の福祉に関する法律，平成3年法律第76号）（第22条之2除外） |\n| **关于育儿休业等的防止骚扰措施** | **不问人数** | 日本《育儿・护理休业法》第25条 |\n| **36协定**（若要让员工从事延长工时・休假日劳动） | **不问人数** | 日本《劳动基准法》第36条 |\n| 就业规则的制定・申报 | **经常10人以上** | 日本《劳动基准法》第89条 |\n| 育儿休业取得状况的公布 | **经常超过300人** | 日本《育儿・护理休业法》第22条之2 |\n\n**在育儿・护理休业法中，附有规模要件的只有第22条之2（取得状况的公布）。** 对育儿休业・护理休业申请的应对、照顾子女等的休假、护理休假、限制法定外劳动・延长工时劳动・深夜劳动、不满3岁的缩短工时工作、有怀孕・生产等申报时的个别告知与意向确认、雇用环境的整备——这些全部，即使是只有1位员工的公司也是义务。\n\n**关于防止骚扰的措施，也有两个误解。**\n\n第一个。中小企业的义务化是自令和4年（2022年）4月1日起，**已经超过4年**。有时仍留有「中小企业是努力义务」的说明，但现在是义务。\n\n第二个。当时被留在努力义务的，只有第30条之2的**第1项**。**第2项（不得以曾提出咨询为由而作不利益对待），中小企业自令和2年（2020年）6月1日起就已适用。**\n\n然后是**36协定**。要让员工从事延长工时劳动或休假日劳动，必须与劳动者过半数代表者等缔结书面协定，并**向所辖劳动基准监督署长申报**（日本《劳动基准法》第36条第1项）。未申报却让员工加班的状态，不问人数都是违法的。上限时间原则上是**1个月45小时・1年360小时**（同条第4项）。\n\n## 从令和8年10月起，会增加什么？\n\n**应对顾客骚扰（来自顾客等的显著困扰行为）将成为义务。**\n\n依令和7年法律第63号对劳动施策综合推进法等的修正，**自令和8年（2026年）10月1日起**，事业主被课予下列措施的义务。\n\n- 为防止因**顾客骚扰**（来自顾客等的显著困扰行为）而损害工作环境所需的雇用管理上的措施\n- 防止**对求职者等的性骚扰**的措施\n\n**这同样不问规模。** 而且，是本文公开日2026年9月1日的**次月**。\n\n与职权骚扰的防止措施相同，要求的内容包括设置咨询窗口、明确方针并周知、事后的应对等。**已经建立职权骚扰体制的公司，可以用扩大该框架的方式应对。** 反之，连职权骚扰的措施本身都尚未整备的公司，就得在10月之前一次整备两份。\n\n## 该从哪里着手？\n\n我们建议按照下列顺序，从与人数无关而必要的项目开始。\n\n1. **劳动条件通知书**（日本《劳动基准法》第15条）——从第1人起就必要，发生频率也最高\n2. **36协定**（若要让员工加班）——若未申报，现在让员工加班这件事本身就有问题\n3. **防止骚扰的体制**——令和8年10月将加入顾客骚扰。现在整备就能一次完成\n4. **育儿・护理休业相关的规程与个别告知的程序**——等到有人提出申请才做就来不及了\n5. **就业规则**（当10人的门槛已在眼前时）\n\n**第1项的劳动条件明示，自令和6年（2024年）4月起项目增加了。** 工作场所及应从事业务的**变更范围**、有期契约的**更新上限**、发生无期转换申请权的契约中**关于无期转换申请的事项与转换后的劳动条件**。若还在使用数年前的格式，这3项就会漏掉。\n\n明示原则上以**交付书面**为之，仅在本人希望的情形下才可以用传真或电子邮件等方式（日本《劳动基准法施行规则》第5条第4项）。「已经口头告知」并不足够。\n\n另外，要为同居的亲属加入雇用保险时，要件之一是「**依就业规则或准此之规定**，其管理与其他劳动者相同」。作为不满10人也需要书面的场面，请一并参阅[让家人成为员工时，容易卡住的3个地方](/zh/labor/column/kazoku-shain-koyohoken-yakuin-joseikin)。\n\n## 常见问题\n\n**Q. 我们经常不满10人，可以制定就业规则吗？**\nA. 可以制定。只是没有义务，并不是被禁止。制定之后，可以减少逐一说明劳动条件的工夫，惩戒处分的依据也会明确。此外，没有义务的事业场自行制定时，也不会产生申报义务，但**先行申报有可以获得内容确认的实务上优点**。\n\n**Q. 已经超过10人却没有就业规则，会马上被处罚吗？**\nA. 违反日本《劳动基准法》第89条有罚则，但实务上通常会先经过监督署的指导。不过这并不表示「可以放着不管直到被指导为止」。**比起没有就业规则本身，因为没有就业规则而使劳动条件一直含糊不清，实际上更容易招来问题。** 一旦发生关于离职或解雇的争议，就会处于无所依凭的状态。\n\n**Q. 可以各分店订定不同的就业规则吗？**\nA. 可以。就业规则是以事业场为单位制定・申报，因此各事业场内容不同本身并无妨碍。但若无合理理由而在待遇上设有差异，会产生另外的问题（不利益对待、同工同酬）。**必须做成能够说明「为什么不同」的形式。**\n\n**Q. 防止骚扰的措施，具体上要做什么？**\nA. 指针列出的内容包括：明确方针并周知・启发、为受理咨询并适切应对所需体制的整备、事后迅速且适切的应对、周知隐私保护与禁止不利益对待等。**在小规模公司，实际的烦恼往往是咨询窗口要由谁担任。** 包含无法设在公司内部时的选项在内，欢迎与我们讨论。费用请参阅[报酬额表](/zh/labor/ryokin)。\n\n## 本文的依据\n\n- 労働基準法（昭和22年法律第49号）第15条、第36条第1项・第4项、第89条\n- 労働基準法施行規則（昭和22年厚生省令第23号）第5条第1项・第3项・第4项・第5项、第16条第1项、第49条第1项\n- 労働施策の総合的な推進並びに労働者の雇用の安定及び職業生活の充実等に関する法律（昭和41年法律第132号）第30条之2第1项・第2项\n- 女性の職業生活における活躍の推進に関する法律等の一部を改正する法律（令和元年法律第24号）附则第3条（关于中小事业主的过渡措施）。**对中小企业的义务化是令和4年（2022年）4月1日。** 日期是依厚生劳动省「職場におけるパワーハラスメント対策が事業主の義務になりました！」（令和4年1月制作）以及多个都道府县劳动局的公开资料确认。**该过渡措施中「以政令所定之日」的政令条文尚未能确认（未查证）**\n- 育児休業、介護休業等育児又は家族介護を行う労働者の福祉に関する法律（平成3年法律第76号）第5条、第9条之2、第10条、第16条之2、第16条之5、第16条之8、第17条、第19条、第21条、第22条、第23条第1项、第23条之3、第25条（**均不问企业规模**）、第22条之2（**经常超过300人**）\n- 依令和7年法律第63号对労働施策総合推進法等的修正，**顾客骚扰防止措施及对求职者等的性骚扰防止措施的义务化，自令和8年（2026年）10月1日施行**。依厚生劳动省「令和8年10月1日からハラスメント対策が強化されます！」确认\n- 条文均为2026年8月13日时点以e-Gov法令検索确认的现行条文\n\n**本文并未决定到「该向谁咨询」为止。** 就业规则・工资规程的制定与申报、36协定的缔结与申报、劳动条件通知书的整备、防止骚扰体制的建立，是社会保险劳务士的业务。已经发生争议的案件请洽律师，随工资规程而来的源泉征收与年终调整的处理请洽税理士，我们会为您介绍，由您各自直接委任。本事务所不收取介绍费。向四葉社会保険労務士事務所咨询时的费用整理于[报酬额表](/zh/labor/ryokin)，常被询问的问题整理于[常见问答](/zh/labor/faq)。\n\n本文为一般性的信息提供。因应个别情事的判断，由具备资格者在面谈后进行。撰文者为[浦松丈二](/zh/about/uramatsu)（社会保险劳务士・行政书士・宅地建物取引士）。",
        "category": "劳动法基础",
        "keywords": [
          "就业规则 几人 义务",
          "不满10人 就业规则 不需要",
          "职权骚扰防止措施 中小企业 义务",
          "顾客骚扰 义务化 令和8年10月",
          "劳动条件通知书 明示事项",
          "36协定 申报 人数"
        ],
        "tags": [
          "就业规则",
          "骚扰",
          "劳动条件明示",
          "36协定",
          "育儿护理休业法"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社会保险劳务士・行政书士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "我们经常不满10人，可以制定就业规则吗？",
            "answer": "可以制定。只是没有义务，并不是被禁止。制定之后，可以减少逐一说明劳动条件的工夫，惩戒处分的依据也会明确。此外，没有义务的事业场自行制定时，也不会产生申报义务，但先行申报有可以获得内容确认的实务上优点。"
          },
          {
            "question": "已经超过10人却没有就业规则，会马上被处罚吗？",
            "answer": "违反日本《劳动基准法》第89条有罚则，但实务上通常会先经过监督署的指导。不过这并不表示「可以放着不管直到被指导为止」。比起没有就业规则本身，因为没有就业规则而使劳动条件一直含糊不清，实际上更容易招来问题。 一旦发生关于离职或解雇的争议，就会处于无所依凭的状态。"
          },
          {
            "question": "可以各分店订定不同的就业规则吗？",
            "answer": "可以。就业规则是以事业场为单位制定・申报，因此各事业场内容不同本身并无妨碍。但若无合理理由而在待遇上设有差异，会产生另外的问题（不利益对待、同工同酬）。必须做成能够说明「为什么不同」的形式。"
          },
          {
            "question": "防止骚扰的措施，具体上要做什么？",
            "answer": "指针列出的内容包括：明确方针并周知・启发、为受理咨询并适切应对所需体制的整备、事后迅速且适切的应对、周知隐私保护与禁止不利益对待等。在小规模公司，实际的烦恼往往是咨询窗口要由谁担任。 包含无法设在公司内部时的选项在内，欢迎与我们讨论。费用请参阅报酬额表。"
          }
        ]
      }
    }
  },
  {
    "business": "labor",
    "slug": "kaisha-setsuritsu-shakaihoken-roudouhoken-kigen",
    "title": "会社をつくったら、いつまでに何を出すのか",
    "date": "2026-09-01",
    "category": "手続と期限",
    "excerpt": "法人は代表者1人でも社会保険の適用事業所になります。人を雇えば労働保険も要ります。見落としやすいのが労働保険の概算保険料申告書で、保険関係が成立した日から50日以内という別の期限があります。届出の名称・提出先・期限を一覧にしました。",
    "content": "**結論（先に要点）**：法人は、代表者1人でも社会保険の適用事業所になります。人を雇えば労働保険も要ります。見落としやすいのが**労働保険の概算保険料申告書**で、**保険関係が成立した日から50日以内**という別の期限があります。成立届を出して終わりではありません。\n\n会社をつくったあと、税務署への届出は税理士から案内が来ることが多いのですが、労働・社会保険の側は自分で調べることになりがちです。期限が短いものが混じっているうえ、**同じ「労働保険」の中に期限の違う書類が2枚ある**ので、片方だけ出して終わったつもりになりやすい領域です。\n\n## 法人をつくると、何に入ることになるのか？\n\n**社会保険（健康保険・厚生年金保険）は、人を雇っていなくても必要です。** 法人は、代表者1人であっても強制適用事業所になります。代表者に報酬が支払われている限り、その代表者自身が被保険者になります。\n\n**労働保険（労災保険・雇用保険）は、労働者を雇ってから**です。労災保険は、労働者を使用する事業が適用事業になります。雇用保険は、週20時間以上などの要件を満たす労働者を雇ったときに手続が生じます。**代表者だけの会社に労働保険はありません。**\n\nこの違いが、そのまま届出のタイミングの違いになります。\n\n| | 社会保険 | 労働保険 |\n|---|---|---|\n| いつ必要になるか | **法人設立時**（代表者1人でも） | **最初の労働者を雇ったとき** |\n| 代表者の扱い | 被保険者になる | 労働者ではないため対象外（[特別加入](/labor/column/shacho-rosai-tokubetsu-kanyu-hitori)の枠がある） |\n\n## いつまでに、どこへ出すのか？\n\n期限がすべて違います。**起算日も揃っていません。**\n\n| 何を | どこへ | いつまでに | 根拠 |\n|---|---|---|---|\n| 健康保険・厚生年金保険 **新規適用届** | 事務センターまたは管轄の年金事務所 | **事実があった日から5日以内** | 健康保険法施行規則第19条第1項／厚生年金保険法施行規則第13条第1項 |\n| 健康保険・厚生年金保険 **被保険者資格取得届** | 同上 | **事実があった日から5日以内** | 健康保険法施行規則第24条第1項／厚生年金保険法施行規則第15条第1項 |\n| 労働保険 **保険関係成立届** | 所轄労働基準監督署長または所轄公共職業安定所長 | **保険関係が成立した日の翌日から起算して10日以内** | 徴収法第4条の2第1項、同施行規則第4条第2項 |\n| 労働保険 **概算保険料申告書** | 所轄労働基準監督署、所轄都道府県労働局、日本銀行のいずれか | **保険関係が成立した日の翌日から起算して50日以内** | 徴収法第15条第1項 |\n| 雇用保険 **適用事業所設置届** | 事業所の所在地を管轄するハローワーク | **設置の日の翌日から起算して10日以内** | 雇用保険法施行規則第141条第1項 |\n| 雇用保険 **被保険者資格取得届** | 同上 | **資格取得の事実があった日の属する月の翌月10日まで** | 雇用保険法施行規則第6条第1項 |\n\n**社会保険は「5日以内」がふたつ、労働保険は「10日以内」と「50日以内」、雇用保険の資格取得だけが「翌月10日まで」。** この不揃いが、そのまま抜けの原因になります。\n\nなお、法文の書き方と行政の案内で表現が違うところがあります。徴収法第4条の2第1項は「その成立した日から十日以内」ですが、厚生労働省は「成立した日の**翌日から起算して**10日以内」と案内しています。民法第140条（初日不算入）による同じ内容の言い換えで、矛盾ではありません。\n\n## なぜ概算保険料の申告を見落とすのか？\n\n**「労働保険の手続」が1つだと思われているからです。** 実際には2枚あります。\n\n- **保険関係成立届**——保険関係が成立したことを届け出る書類（10日以内）\n- **概算保険料申告書**——その年度分の保険料を見込みで申告し、納付する書類（50日以内）\n\n成立届を出すと労働保険番号が振られるので、そこで手続が終わったように見えます。ところが保険料の申告はまだ済んでいません。**50日という期限は他より長いため、いったん置いて忘れる**というのが、いちばんよくある流れです。\n\nしかも、期限が長いぶん、気づいたときには過ぎていることになります。**成立届と概算保険料申告書は、同じ日にまとめて出すのが確実です。** 提出先が違う場合もありますが、労働基準監督署では両方受け付けています。\n\n概算保険料は、その保険年度に支払う見込みの賃金総額に保険料率を掛けて算出します。年度が終わったあとに確定保険料を申告し、差額を精算する仕組みです（これを毎年繰り返すのが年度更新です）。**払いすぎた分は精算されますので、見込みが多少ずれても取り返しはつきます。** 出さないことのほうが問題です。\n\n会社をたたむときは、この裏返しで**確定保険料申告書**を出すことになります。[会社をたたむとき、社会保険と労働保険はどうするか](/labor/column/kaisha-tatamu-shakaihoken-zenso-tetsuzuki)にまとめました。\n\n## 登記や税務の届出とは、どう分かれるのか？\n\n**分かれます。** 設立直後に必要な届出は、少なくとも3つの系統に分かれ、それぞれ担当する専門家が違います。\n\n| 系統 | 中身 | 誰の業務か |\n|---|---|---|\n| 労働・社会保険 | 新規適用届、保険関係成立届、概算保険料申告書、適用事業所設置届、資格取得届 | 社会保険労務士 |\n| **登記** | 設立登記、役員変更登記 | **司法書士** |\n| **税務** | 法人設立届出書、青色申告の承認申請、給与支払事務所等の開設届出 | **税理士** |\n| 許認可 | 事業に必要な免許・許可・届出 | 行政書士 |\n\n**当事務所が扱うのは1行目だけです。** 登記は司法書士、税務は税理士へ、それぞれ直接ご依頼いただく形をご案内します。当事務所は紹介料を受け取りません。\n\n**なお、会社設立に伴う定款や許認可の書類作成は[会社設立・各種許認可](/legal/services/company)で承っていますが、これは四葉行政書士事務所の業務で、四葉社会保険労務士事務所とは別の事業体です。** 両方をご依頼いただく場合も、それぞれ別々にご契約いただき、請求もお振込先も分かれます。\n\n**タイミングだけ、先に押さえておいてください。** 社会保険の新規適用届には登記事項証明書が必要になるため、設立登記の完了を待つことになります。一方、**5日という期限は登記の完了を待ってくれるわけではありません**。登記が完了したら、すぐ動けるよう書類を先に揃えておくのが実務です。\n\n## よくある質問\n\n**Q. 代表者1人で、役員報酬をゼロにしています。それでも社会保険は必要ですか？**\nA. 報酬が支払われていない場合、被保険者となる前提を欠くため、実務上は適用事業所として届け出ないことがあります。ただし「ゼロにしておけば入らなくてよい」という単純な話ではなく、実際に報酬が発生していないかどうかで判断されます。**役員報酬をどう設定するかは税務にも直結しますので、税理士と並行してご検討ください。**\n\n**Q. 設立から数か月経ってしまいました。いま出しても大丈夫ですか？**\nA. 期限を過ぎていても、届出は受け付けられます。ただし社会保険については、**さかのぼって適用**され、その分の保険料もさかのぼって発生します。時間が経つほど遡及の額が大きくなりますので、気づいた時点で早く出すほど負担は軽くなります。まずは現状を整理するところからご相談ください。\n\n**Q. 家族だけの会社ですが、労働保険は必要ですか？**\nA. 同居の親族は原則として労働者に当たらないと扱われるため、その方だけであれば労働保険の対象にならない場合があります。ただし判断は実態によります。雇用保険については別途、業務取扱要領の要件を満たせば被保険者となる余地があります。詳しくは[家族を社員にするとき、つまずく3つのところ](/labor/column/kazoku-shain-koyohoken-yakuin-joseikin)をご覧ください。\n\n**Q. 労働・社会保険の届出は、すべてお願いできますか？**\nA. 労働・社会保険の届出は、四葉社会保険労務士事務所で承ります。料金は[報酬額表](/labor/ryokin)に掲載しています。**登記や税務の届出は当事務所では扱いませんので、司法書士・税理士へ直接ご依頼いただく形になります。** それぞれ別のご契約になります。\n\n## この記事の根拠\n\n- 健康保険法施行規則（大正15年内務省令第36号）第19条第1項（新規適用届）、第24条第1項（資格取得届）\n- 厚生年金保険法施行規則（昭和29年厚生省令第37号）第13条第1項（新規適用届）、第15条第1項（資格取得届）\n- 労働保険の保険料の徴収等に関する法律（昭和44年法律第84号）第3条、第4条の2第1項、第15条第1項\n- 労働保険の保険料の徴収等に関する法律施行規則（昭和47年労働省令第8号）第4条第2項\n- 雇用保険法施行規則（昭和50年労働省令第3号）第141条第1項（適用事業所設置届）、第6条第1項（資格取得届）\n- 厚生労働省「労働保険の成立手続」（成立届10日以内・概算保険料申告書50日以内・雇用保険適用事業所設置届10日以内・資格取得届は翌月10日まで）\n- 日本年金機構「新規適用の手続き」（提出時期は事実発生から5日以内、提出先は事務センターまたは管轄の年金事務所）\n- 厚生労働省「雇用保険事務手続きの手引き【第1編】適用事業所編【令和7年8月版】」\n- 条文はいずれも2026年8月13日時点でe-Gov法令検索により確認した現行条文です\n\n**この記事は、誰に相談するかまでは決めていません。** 労働・社会保険の届出と概算保険料の申告、資格取得の手続は社会保険労務士の業務です。設立登記は司法書士、法人設立届出書など税務は税理士へ、それぞれ直接ご依頼いただく形をご案内します。定款や許認可の書類作成は四葉行政書士事務所（**別の事業体です。別々にご契約いただきます**）で承ります。当事務所は紹介料を受け取りません。四葉社会保険労務士事務所にご相談いただく場合の費用は[報酬額表](/labor/ryokin)に、よくいただくご質問は[よくあるご質問](/labor/faq)にまとめています。\n\n本記事は一般的な情報提供です。個別のご事情に応じた判断は、面談のうえ資格者が行います。執筆は[浦松丈二](/about/uramatsu)（社会保険労務士・行政書士・宅地建物取引士）です。",
    "status": "published",
    "author": {
      "name": "浦松 丈二",
      "title": "社会保険労務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
    },
    "keywords": [
      "会社設立 社会保険 手続き 期限",
      "新規適用届 5日以内",
      "労働保険 保険関係成立届 10日",
      "概算保険料申告書 50日以内",
      "雇用保険 適用事業所設置届",
      "設立直後 労働保険 何を出す"
    ],
    "tags": [
      "会社設立",
      "新規適用届",
      "労働保険",
      "概算保険料",
      "手続"
    ],
    "locales": [],
    "faq": [
      {
        "question": "代表者1人で、役員報酬をゼロにしています。それでも社会保険は必要ですか？",
        "answer": "報酬が支払われていない場合、被保険者となる前提を欠くため、実務上は適用事業所として届け出ないことがあります。ただし「ゼロにしておけば入らなくてよい」という単純な話ではなく、実際に報酬が発生していないかどうかで判断されます。役員報酬をどう設定するかは税務にも直結しますので、税理士と並行してご検討ください。"
      },
      {
        "question": "設立から数か月経ってしまいました。いま出しても大丈夫ですか？",
        "answer": "期限を過ぎていても、届出は受け付けられます。ただし社会保険については、さかのぼって適用され、その分の保険料もさかのぼって発生します。時間が経つほど遡及の額が大きくなりますので、気づいた時点で早く出すほど負担は軽くなります。まずは現状を整理するところからご相談ください。"
      },
      {
        "question": "家族だけの会社ですが、労働保険は必要ですか？",
        "answer": "同居の親族は原則として労働者に当たらないと扱われるため、その方だけであれば労働保険の対象にならない場合があります。ただし判断は実態によります。雇用保険については別途、業務取扱要領の要件を満たせば被保険者となる余地があります。詳しくは家族を社員にするとき、つまずく3つのところをご覧ください。"
      },
      {
        "question": "労働・社会保険の届出は、すべてお願いできますか？",
        "answer": "労働・社会保険の届出は、四葉社会保険労務士事務所で承ります。料金は報酬額表に掲載しています。登記や税務の届出は当事務所では扱いませんので、司法書士・税理士へ直接ご依頼いただく形になります。 それぞれ別のご契約になります。"
      }
    ],
    "translations": {
      "en": {
        "title": "Once you have set up a company, what has to be filed and by when",
        "excerpt": "A corporation becomes a covered workplace for social insurance even with a single representative director. Hire anyone and labor insurance is required as well. The item most easily overlooked is the labor insurance estimated premium declaration, which carries a separate deadline of 50 days from the day the insurance relationship is established. The names, destinations and deadlines of every filing are set out in a table.",
        "content": "**In short:** A corporation becomes a covered workplace for social insurance even if it has only one representative director. Hire anyone and labor insurance is required as well. The item most easily overlooked is the **labor insurance estimated premium declaration**, which carries a separate deadline of **50 days from the day the insurance relationship is established**. Filing the notification of establishment is not the end of it.\n\nAfter a company is formed, the tax office filings are usually flagged by a tax accountant, but the labor and social insurance side tends to be something you have to look up yourself. Some deadlines are short, and **there are two documents with different deadlines inside the same \"labor insurance\"** — which makes this an area where it is easy to file one of them and assume you are done.\n\n## What does a corporation get enrolled in when you set it up?\n\n**Social insurance (health insurance and employees' pension insurance) is required even if you employ no one.** A corporation is a compulsorily covered workplace even with a single representative director. So long as remuneration is paid to that representative director, the director is an insured person.\n\n**Labor insurance (workers' accident compensation insurance and employment insurance) starts once you hire a worker.** For workers' accident compensation insurance, a business that uses workers is a covered business. For employment insurance, the procedure arises when you hire a worker who meets requirements such as 20 or more hours a week. **A company with only a representative director has no labor insurance.**\n\nThat difference becomes, directly, the difference in filing timing.\n\n| | Social insurance | Labor insurance |\n|---|---|---|\n| When it becomes necessary | **When the corporation is formed** (even with one representative director) | **When you hire your first worker** |\n| Treatment of the representative director | Becomes an insured person | Not a worker, so outside the scope (there is a [special enrollment](/en/labor/column/shacho-rosai-tokubetsu-kanyu-hitori) route) |\n\n## By when, and where, do you file?\n\nThe deadlines are all different. **The days they run from are not aligned either.**\n\n| What | Where | By when | Basis |\n|---|---|---|---|\n| Health insurance / employees' pension insurance **new coverage notification** (新規適用届) | The administrative center or the competent Japan Pension Service office | **Within 5 days of the day the fact arose** | 健康保険法施行規則 Article 19 paragraph 1 / 厚生年金保険法施行規則 Article 13 paragraph 1 |\n| Health insurance / employees' pension insurance **notification of acquisition of insured status** (被保険者資格取得届) | Same as above | **Within 5 days of the day the fact arose** | 健康保険法施行規則 Article 24 paragraph 1 / 厚生年金保険法施行規則 Article 15 paragraph 1 |\n| Labor insurance **notification of establishment of the insurance relationship** (保険関係成立届) | The head of the competent Labor Standards Inspection Office or the head of the competent Public Employment Security Office | **Within 10 days counted from the day after the insurance relationship is established** | 徴収法 Article 4-2 paragraph 1; 同施行規則 Article 4 paragraph 2 |\n| Labor insurance **estimated premium declaration** (概算保険料申告書) | The competent Labor Standards Inspection Office, the competent Prefectural Labour Bureau, or the Bank of Japan | **Within 50 days counted from the day after the insurance relationship is established** | 徴収法 Article 15 paragraph 1 |\n| Employment insurance **notification of establishment of a covered place of business** (適用事業所設置届) | The Hello Work office with jurisdiction over the location of the place of business | **Within 10 days counted from the day after the day of establishment** | 雇用保険法施行規則 Article 141 paragraph 1 |\n| Employment insurance **notification of acquisition of insured status** (被保険者資格取得届) | Same as above | **By the 10th day of the month following the month containing the day the acquisition occurred** | 雇用保険法施行規則 Article 6 paragraph 1 |\n\n**Social insurance has two \"within 5 days\"; labor insurance has \"within 10 days\" and \"within 50 days\"; and employment insurance's acquisition notification alone is \"by the 10th of the following month.\"** That unevenness is itself the cause of missed filings.\n\nOne note: the wording of the statute and the wording of the administrative guidance differ in places. Article 4-2, paragraph 1 of 徴収法 says \"within ten days from the day it was established,\" while the Ministry of Health, Labour and Welfare describes it as \"within 10 days **counted from the day after** the day it was established.\" These are the same thing said differently, under Article 140 of the Civil Code (民法, Act No. 89 of 1896) (the first day is not counted). There is no contradiction.\n\n## Why is the estimated premium declaration overlooked?\n\n**Because people think the \"labor insurance procedure\" is one thing.** In fact there are two documents.\n\n- **Notification of establishment of the insurance relationship** — the document notifying that the insurance relationship has been established (within 10 days)\n- **Estimated premium declaration** — the document declaring, and paying, the estimated premium for that fiscal year (within 50 days)\n\nOnce you file the notification of establishment, a labor insurance number is assigned, so it looks as though the procedure is finished. But the premium declaration has not been made. **Because 50 days is a longer deadline than the others, it gets set aside and forgotten** — that is the most common sequence by far.\n\nAnd because the deadline is long, by the time you notice, it has passed. **Filing the notification of establishment and the estimated premium declaration together on the same day is the reliable approach.** The destinations can differ, but the Labor Standards Inspection Office accepts both.\n\nThe estimated premium is calculated by multiplying the total wages you expect to pay in that insurance year by the premium rate. After the year ends, you declare the definite premium and settle the difference (repeating this every year is the annual renewal, 年度更新). **Anything overpaid is settled up, so a somewhat inaccurate estimate can be recovered from.** Not filing at all is the greater problem.\n\nWhen you wind a company up, the mirror image applies and you file a **definite premium declaration**. That is covered in [Winding up a company: what to do about social insurance and labor insurance](/en/labor/column/kaisha-tatamu-shakaihoken-zenso-tetsuzuki).\n\n## How does this divide from the registration and tax filings?\n\n**It divides.** The filings needed right after formation fall into at least three streams, and a different professional handles each.\n\n| Stream | Content | Whose work it is |\n|---|---|---|\n| Labor and social insurance | New coverage notification, notification of establishment of the insurance relationship, estimated premium declaration, notification of establishment of a covered place of business, notifications of acquisition of insured status | A Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant) |\n| **Registration** | Incorporation registration, registration of changes of officers | **A judicial scrivener** |\n| **Tax** | Corporation establishment notification, application for approval of blue return filing, notification of establishment of an office paying salaries | **A tax accountant** |\n| Licenses and permits | The licenses, permissions and notifications your business needs | A Gyoseishoshi (Certified Administrative Procedures Legal Specialist) |\n\n**This office handles only the first row.** Registration goes to a judicial scrivener and tax to a tax accountant; in each case we will point you to them and you engage them directly. This office does not accept referral fees.\n\n**Note also that the drafting of articles of incorporation and licence and permit documents that accompany company formation is handled at [Company formation and licences and permits](/en/legal/services/company), but that is the work of 四葉行政書士事務所, a business entity separate from 四葉社会保険労務士事務所.** Even where you ask for both, you enter into a **separate contract** with each, and invoices and bank accounts are separate as well.\n\n**Get the timing straight in advance, at least.** The social insurance new coverage notification requires a certificate of registered matters, so you have to wait for the incorporation registration to be completed. On the other hand, **the 5-day deadline does not wait for the registration to be completed**. In practice you assemble the documents in advance so that you can move the moment the registration is done.\n\n## Frequently asked questions\n\n**Q. There is only one representative director and we have set the officer's remuneration at zero. Is social insurance still required?**\nA. Where no remuneration is paid, the premise for being an insured person is absent, so in practice a notification as a covered workplace is sometimes not made. But it is not as simple as \"set it to zero and you don't have to enroll\" — the judgment turns on whether remuneration is in fact arising. **How you set officer remuneration also feeds directly into tax, so please consider it alongside a tax accountant.**\n\n**Q. Several months have passed since we set the company up. Is it all right to file now?**\nA. Filings are accepted even after the deadline has passed. For social insurance, however, coverage is **applied retroactively**, and the premiums for that period arise retroactively too. The more time passes, the larger the retroactive amount, so the sooner you file after noticing, the lighter the burden. Start by talking to us about putting the current position in order.\n\n**Q. Ours is a company of family members only. Do we need labor insurance?**\nA. Co-residing relatives are as a rule treated as not being workers, so if they are the only people involved, labor insurance may not apply. The judgment does, however, turn on the actual circumstances. For employment insurance there is separately room to become an insured person if the requirements in the administrative handling guidelines are met. For details, see [Three places people stumble when putting family on the payroll](/en/labor/column/kazoku-shain-koyohoken-yakuin-joseikin).\n\n**Q. Can we ask you to handle all of the labor and social insurance filings?**\nA. Labor and social insurance filings are handled by 四葉社会保険労務士事務所. Fees are set out in the [fee schedule](/en/labor/ryokin). **We do not handle registration or tax filings, so those you engage a judicial scrivener and a tax accountant to do directly.** Each of those is a separate engagement.\n\n## Sources for this article\n\n- 健康保険法施行規則 (Ordinance for Enforcement of the Health Insurance Act, Ordinance of the Ministry of Home Affairs No. 36 of 1926), Article 19 paragraph 1 (new coverage notification), Article 24 paragraph 1 (notification of acquisition of insured status)\n- 厚生年金保険法施行規則 (Ordinance for Enforcement of the Employees' Pension Insurance Act, Ordinance of the Ministry of Health and Welfare No. 37 of 1954), Article 13 paragraph 1 (new coverage notification), Article 15 paragraph 1 (notification of acquisition of insured status)\n- 労働保険の保険料の徴収等に関する法律 (Act on Collection of Insurance Premiums of Labor Insurance, Act No. 84 of 1969), Article 3, Article 4-2 paragraph 1, Article 15 paragraph 1\n- 労働保険の保険料の徴収等に関する法律施行規則 (Ordinance of the Ministry of Labour No. 8 of 1972), Article 4 paragraph 2\n- 雇用保険法施行規則 (Ordinance for Enforcement of the Employment Insurance Act, Ordinance of the Ministry of Labour No. 3 of 1975), Article 141 paragraph 1 (notification of establishment of a covered place of business), Article 6 paragraph 1 (notification of acquisition of insured status)\n- Ministry of Health, Labour and Welfare, 「労働保険の成立手続」 (notification of establishment within 10 days; estimated premium declaration within 50 days; employment insurance notification of establishment of a covered place of business within 10 days; notification of acquisition of insured status by the 10th of the following month)\n- Japan Pension Service, 「新規適用の手続き」 (filing period is within 5 days of the fact arising; the destination is the administrative center or the competent Japan Pension Service office)\n- Ministry of Health, Labour and Welfare, 「雇用保険事務手続きの手引き【第1編】適用事業所編【令和7年8月版】」\n- All statutory provisions are the versions in force as confirmed on e-Gov法令検索 on August 13, 2026\n\n**This article does not go so far as to decide whom you should consult.** Labor and social insurance filings, the estimated premium declaration and the acquisition-of-insured-status procedures are the work of a Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant). Incorporation registration goes to a judicial scrivener, and tax matters such as the corporation establishment notification go to a tax accountant; in each case we will point you to them and you engage them directly. The drafting of articles of incorporation and licence and permit documents is handled by 四葉行政書士事務所 (**a separate business entity; you enter into a separate contract with each office**). This office does not accept referral fees. The cost of consulting 四葉社会保険労務士事務所 is set out in the [fee schedule](/en/labor/ryokin), and the questions we are asked most often are collected on the [FAQ page](/en/labor/faq).\n\nThis article is general information. Judgments that fit your particular circumstances are made by a qualified professional after a meeting. Written by [Joji Uramatsu](/en/about/uramatsu) (Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist).",
        "category": "Procedures and deadlines",
        "keywords": [
          "company formation social insurance procedures deadline",
          "new coverage notification within 5 days",
          "labor insurance notification of establishment of insurance relationship 10 days",
          "estimated premium declaration within 50 days",
          "employment insurance notification of establishment of a covered place of business",
          "what to file right after incorporation"
        ],
        "tags": [
          "company formation",
          "new coverage notification",
          "labor insurance",
          "estimated premium",
          "filing procedures"
        ],
        "author": {
          "name": "Joji Uramatsu",
          "title": "Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist — 四葉社会保険労務士事務所／四葉行政書士事務所"
        },
        "faq": [
          {
            "question": "There is only one representative director and we have set the officer's remuneration at zero. Is social insurance still required?",
            "answer": "Where no remuneration is paid, the premise for being an insured person is absent, so in practice a notification as a covered workplace is sometimes not made. But it is not as simple as \"set it to zero and you don't have to enroll\" — the judgment turns on whether remuneration is in fact arising. How you set officer remuneration also feeds directly into tax, so please consider it alongside a tax accountant."
          },
          {
            "question": "Several months have passed since we set the company up. Is it all right to file now?",
            "answer": "Filings are accepted even after the deadline has passed. For social insurance, however, coverage is applied retroactively, and the premiums for that period arise retroactively too. The more time passes, the larger the retroactive amount, so the sooner you file after noticing, the lighter the burden. Start by talking to us about putting the current position in order."
          },
          {
            "question": "Ours is a company of family members only. Do we need labor insurance?",
            "answer": "Co-residing relatives are as a rule treated as not being workers, so if they are the only people involved, labor insurance may not apply. The judgment does, however, turn on the actual circumstances. For employment insurance there is separately room to become an insured person if the requirements in the administrative handling guidelines are met. For details, see Three places people stumble when putting family on the payroll."
          },
          {
            "question": "Can we ask you to handle all of the labor and social insurance filings?",
            "answer": "Labor and social insurance filings are handled by 四葉社会保険労務士事務所. Fees are set out in the fee schedule. We do not handle registration or tax filings, so those you engage a judicial scrivener and a tax accountant to do directly. Each of those is a separate engagement."
          }
        ]
      },
      "zh-tw": {
        "title": "設立公司之後，要在什麼時候提出哪些文件？",
        "excerpt": "法人即使只有代表人1人，也會成為社會保險的適用事業所。一旦僱用員工，勞動保險也是必要的。最容易被漏掉的是勞動保險的概算保險費申報書，它另有「自保險關係成立之日起50日以內」這個不同的期限。本文將申報文件的名稱、提出處與期限整理成一覽表。",
        "content": "**結論（先講重點）**：法人即使只有代表人1人，也會成為社會保險的適用事業所。一旦僱用員工，勞動保險也是必要的。最容易被漏掉的是**勞動保險的概算保險費申報書**，它另有**自保險關係成立之日起50日以內**這個不同的期限。並不是提出成立申報書就結束了。\n\n設立公司之後，向稅務署提出的申報通常會由稅理士主動告知，但勞動・社會保險這一側往往得自己去查。其中混雜著期限很短的項目，而且**在同一個「勞動保險」裡就有2份期限不同的文件**，因此很容易只提出其中一份就以為已經辦完。\n\n## 設立法人後，會被納入哪些制度？\n\n**社會保險（健康保險・厚生年金保險），即使沒有僱用任何人也是必要的。** 法人即使只有代表人1人，也是強制適用事業所。只要代表人有支領報酬，該代表人本身就會成為被保險人。\n\n**勞動保險（勞災保險・僱用保險），則是從僱用勞動者之後開始。** 勞災保險，以使用勞動者的事業為適用事業。僱用保險，則是在僱用滿足每週20小時以上等要件的勞動者時產生手續。**只有代表人的公司沒有勞動保險。**\n\n這個差異，直接就形成了申報時點的差異。\n\n| | 社會保險 | 勞動保險 |\n|---|---|---|\n| 何時開始必要 | **法人設立時**（即使只有代表人1人） | **僱用第一位勞動者時** |\n| 代表人的處理 | 成為被保險人 | 因非勞動者而不屬對象（另有[特別加入](/zh-tw/labor/column/shacho-rosai-tokubetsu-kanyu-hitori)的制度） |\n\n## 要在什麼時候、向哪裡提出？\n\n期限全部不同。**起算日也不一致。**\n\n| 提出什麼 | 向哪裡 | 期限 | 依據 |\n|---|---|---|---|\n| 健康保險・厚生年金保險 **新規適用届** | 事務中心或管轄的年金事務所 | **自事實發生之日起5日以內** | 健康保険法施行規則第19條第1項／厚生年金保険法施行規則第13條第1項 |\n| 健康保險・厚生年金保險 **被保險人資格取得届** | 同上 | **自事實發生之日起5日以內** | 健康保険法施行規則第24條第1項／厚生年金保険法施行規則第15條第1項 |\n| 勞動保險 **保險關係成立届** | 所轄勞動基準監督署長或所轄公共職業安定所長 | **自保險關係成立之日的次日起算10日以內** | 徴収法第4條之2第1項、同施行規則第4條第2項 |\n| 勞動保險 **概算保險費申報書** | 所轄勞動基準監督署、所轄都道府縣勞動局、日本銀行三者之一 | **自保險關係成立之日的次日起算50日以內** | 徴収法第15條第1項 |\n| 僱用保險 **適用事業所設置届** | 管轄事業所所在地的公共職業安定所（Hello Work） | **自設置之日的次日起算10日以內** | 雇用保険法施行規則第141條第1項 |\n| 僱用保險 **被保險人資格取得届** | 同上 | **至資格取得事實發生之日所屬月份的次月10日為止** | 雇用保険法施行規則第6條第1項 |\n\n**社會保險是兩個「5日以內」，勞動保險是「10日以內」與「50日以內」，只有僱用保險的資格取得是「次月10日為止」。** 這種不整齊，直接就成為疏漏的原因。\n\n另外，法條的寫法與行政的說明在表達上有出入。徴収法第4條之2第1項寫的是「自其成立之日起十日以內」，但厚生勞動省的說明是「自成立之日的**次日起算**10日以內」。這是依日本《民法》（民法，明治29年法律第89號）第140條（初日不算入）所作的同一內容的換句話說，並非矛盾。\n\n## 為什麼會漏掉概算保險費的申報？\n\n**因為大家以為「勞動保險的手續」只有一項。** 實際上有2份文件。\n\n- **保險關係成立届**——申報保險關係已經成立的文件（10日以內）\n- **概算保險費申報書**——以預估方式申報並繳納該年度保險費的文件（50日以內）\n\n提出成立届之後會被賦予勞動保險號碼，因此看起來手續已經完成。但是保險費的申報還沒做。**50日這個期限比其他項目都長，所以先擱著然後就忘了**——這是最常見的流程。\n\n而且因為期限長，等到察覺時往往已經過期。**把成立届與概算保險費申報書在同一天一起提出，是最確實的做法。** 提出處有時不同，但勞動基準監督署兩者都受理。\n\n概算保險費，是以該保險年度預計支付的工資總額乘以保險費率計算。年度結束後再申報確定保險費，結算差額（每年重複這個流程就是年度更新）。**多繳的部分會被結算，因此預估即使有些偏差也還來得及補救。** 不提出才是問題。\n\n結束公司營業時，則反過來要提出**確定保險費申報書**。相關內容整理於[結束公司時，社會保險與勞動保險該怎麼辦](/zh-tw/labor/column/kaisha-tatamu-shakaihoken-zenso-tetsuzuki)。\n\n## 與登記、稅務的申報如何區分？\n\n**是分開的。** 設立後立即需要的申報，至少分為3個系統，各自負責的專業人員也不同。\n\n| 系統 | 內容 | 屬於誰的業務 |\n|---|---|---|\n| 勞動・社會保險 | 新規適用届、保險關係成立届、概算保險費申報書、適用事業所設置届、資格取得届 | 社會保險勞務士 |\n| **登記** | 設立登記、董監事變更登記 | **司法書士** |\n| **稅務** | 法人設立申報書、藍色申報的核准申請、給與支付事務所等的開設申報 | **稅理士** |\n| 許認可 | 事業所需的執照・許可・申報 | 行政書士 |\n\n**本事務所處理的只有第1行。** 登記請洽司法書士，稅務請洽稅理士，我們會為您轉介，由您各自直接委任。本事務所不收取介紹費。\n\n**另外，公司設立所伴隨的章程與許認可文件製作，由[公司設立・各種許認可](/zh-tw/legal/services/company)承接，但這是四葉行政書士事務所的業務，與四葉社会保険労務士事務所是各自獨立的事業體。** 即使兩邊都委託，也請**另行簽約**，請款與匯款帳戶也是分開的。\n\n**至少請先掌握時間點。** 社會保險的新規適用届需要登記事項證明書，因此必須等設立登記完成。另一方面，**5日這個期限並不會等登記完成**。實務上的做法是先把文件備齊，等登記一完成就能立刻行動。\n\n## 常見問題\n\n**Q. 只有代表人1人，且董事報酬設為零。這樣還需要社會保險嗎？**\nA. 在沒有支付報酬的情形下，因欠缺成為被保險人的前提，實務上有不作為適用事業所申報的情況。不過這並不是「設成零就可以不加入」這麼單純，而是依實際上是否發生報酬來判斷。**董事報酬要如何設定也直接牽涉稅務，請與稅理士並行研議。**\n\n**Q. 距離設立已經過了好幾個月。現在提出還可以嗎？**\nA. 即使已經過期，申報仍會被受理。不過社會保險方面會**追溯適用**，該部分的保險費也會追溯發生。時間拖得越久，追溯的金額越大，因此發現後越早提出，負擔就越輕。請先從整理現狀開始與我們討論。\n\n**Q. 我們是只有家人的公司，需要勞動保險嗎？**\nA. 同居的親屬原則上被認為不屬於勞動者，因此若只有這些人，可能不成為勞動保險的對象。但判斷仍取決於實際狀態。至於僱用保險，若另外滿足業務處理要領的要件，仍有成為被保險人的餘地。詳情請參閱[讓家人成為員工時，容易卡住的3個地方](/zh-tw/labor/column/kazoku-shain-koyohoken-yakuin-joseikin)。\n\n**Q. 勞動・社會保險的申報，可以全部委託給你們嗎？**\nA. 勞動・社會保險的申報，由四葉社会保険労務士事務所承接。費用刊載於[報酬額表](/zh-tw/labor/ryokin)。**登記與稅務的申報本事務所不處理，請直接委任司法書士・稅理士。** 那些都是各自分別的委任契約。\n\n## 本文的依據\n\n- 健康保険法施行規則（大正15年內務省令第36號）第19條第1項（新規適用届）、第24條第1項（資格取得届）\n- 厚生年金保険法施行規則（昭和29年厚生省令第37號）第13條第1項（新規適用届）、第15條第1項（資格取得届）\n- 労働保険の保険料の徴収等に関する法律（昭和44年法律第84號）第3條、第4條之2第1項、第15條第1項\n- 労働保険の保険料の徴収等に関する法律施行規則（昭和47年勞動省令第8號）第4條第2項\n- 雇用保険法施行規則（昭和50年勞動省令第3號）第141條第1項（適用事業所設置届）、第6條第1項（資格取得届）\n- 厚生勞動省「労働保険の成立手続」（成立届10日以內・概算保險費申報書50日以內・僱用保險適用事業所設置届10日以內・資格取得届為次月10日為止）\n- 日本年金機構「新規適用の手続き」（提出時期為自事實發生起5日以內，提出處為事務中心或管轄的年金事務所）\n- 厚生勞動省「雇用保険事務手続きの手引き【第1編】適用事業所編【令和7年8月版】」\n- 條文均為2026年8月13日時點以e-Gov法令検索確認的現行條文\n\n**本文並未決定到「該向誰諮詢」為止。** 勞動・社會保險的申報與概算保險費的申報、資格取得的手續，是社會保險勞務士的業務。設立登記請洽司法書士，法人設立申報書等稅務請洽稅理士，我們會為您轉介，由您各自直接委任。章程與許認可的文件製作由四葉行政書士事務所（**是各自獨立的事業體，請另行簽約**）承接。本事務所不收取介紹費。向四葉社会保険労務士事務所諮詢時的費用整理於[報酬額表](/zh-tw/labor/ryokin)，常被詢問的問題整理於[常見問答](/zh-tw/labor/faq)。\n\n本文為一般性的資訊提供。因應個別情事的判斷，由具備資格者在面談後進行。撰文者為[浦松丈二](/zh-tw/about/uramatsu)（社會保險勞務士・行政書士・宅地建物取引士）。",
        "category": "手續與期限",
        "keywords": [
          "公司設立 社會保險 手續 期限",
          "新規適用届 5日以內",
          "勞動保險 保險關係成立届 10日",
          "概算保險費申報書 50日以內",
          "僱用保險 適用事業所設置届",
          "設立後 勞動保險 要提出什麼"
        ],
        "tags": [
          "公司設立",
          "新規適用届",
          "勞動保險",
          "概算保險費",
          "手續"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社會保險勞務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "只有代表人1人，且董事報酬設為零。這樣還需要社會保險嗎？",
            "answer": "在沒有支付報酬的情形下，因欠缺成為被保險人的前提，實務上有不作為適用事業所申報的情況。不過這並不是「設成零就可以不加入」這麼單純，而是依實際上是否發生報酬來判斷。董事報酬要如何設定也直接牽涉稅務，請與稅理士並行研議。"
          },
          {
            "question": "距離設立已經過了好幾個月。現在提出還可以嗎？",
            "answer": "即使已經過期，申報仍會被受理。不過社會保險方面會追溯適用，該部分的保險費也會追溯發生。時間拖得越久，追溯的金額越大，因此發現後越早提出，負擔就越輕。請先從整理現狀開始與我們討論。"
          },
          {
            "question": "我們是只有家人的公司，需要勞動保險嗎？",
            "answer": "同居的親屬原則上被認為不屬於勞動者，因此若只有這些人，可能不成為勞動保險的對象。但判斷仍取決於實際狀態。至於僱用保險，若另外滿足業務處理要領的要件，仍有成為被保險人的餘地。詳情請參閱讓家人成為員工時，容易卡住的3個地方。"
          },
          {
            "question": "勞動・社會保險的申報，可以全部委託給你們嗎？",
            "answer": "勞動・社會保險的申報，由四葉社会保険労務士事務所承接。費用刊載於報酬額表。登記與稅務的申報本事務所不處理，請直接委任司法書士・稅理士。 那些都是各自分別的委任契約。"
          }
        ]
      },
      "zh": {
        "title": "设立公司之后，要在什么时候提交哪些文件？",
        "excerpt": "法人即使只有代表人1人，也会成为社会保险的适用事业所。一旦雇用员工，劳动保险也是必要的。最容易被漏掉的是劳动保险的概算保险费申报书，它另有「自保险关系成立之日起50日以内」这个不同的期限。本文将申报文件的名称、提交处与期限整理成一览表。",
        "content": "**结论（先讲重点）**：法人即使只有代表人1人，也会成为社会保险的适用事业所。一旦雇用员工，劳动保险也是必要的。最容易被漏掉的是**劳动保险的概算保险费申报书**，它另有**自保险关系成立之日起50日以内**这个不同的期限。并不是提交了成立申报书就结束了。\n\n设立公司之后，向税务署提交的申报通常会由税理士主动告知，但劳动・社会保险这一侧往往得自己去查。其中混杂着期限很短的项目，而且**在同一个「劳动保险」里就有2份期限不同的文件**，因此很容易只提交其中一份就以为已经办完。\n\n## 设立法人后，会被纳入哪些制度？\n\n**社会保险（健康保险・厚生年金保险），即使没有雇用任何人也是必要的。** 法人即使只有代表人1人，也是强制适用事业所。只要代表人有领取报酬，该代表人本身就会成为被保险人。\n\n**劳动保险（劳灾保险・雇用保险），则是从雇用劳动者之后开始。** 劳灾保险，以使用劳动者的事业为适用事业。雇用保险，则是在雇用满足每周20小时以上等要件的劳动者时产生手续。**只有代表人的公司没有劳动保险。**\n\n这个差异，直接就形成了申报时点的差异。\n\n| | 社会保险 | 劳动保险 |\n|---|---|---|\n| 何时开始必要 | **法人设立时**（即使只有代表人1人） | **雇用第一位劳动者时** |\n| 代表人的处理 | 成为被保险人 | 因非劳动者而不属对象（另有[特别加入](/zh/labor/column/shacho-rosai-tokubetsu-kanyu-hitori)的制度） |\n\n## 要在什么时候、向哪里提交？\n\n期限全部不同。**起算日也不一致。**\n\n| 提交什么 | 向哪里 | 期限 | 依据 |\n|---|---|---|---|\n| 健康保险・厚生年金保险 **新规适用届** | 事务中心或管辖的年金事务所 | **自事实发生之日起5日以内** | 健康保険法施行規則第19条第1项／厚生年金保険法施行規則第13条第1项 |\n| 健康保险・厚生年金保险 **被保险人资格取得届** | 同上 | **自事实发生之日起5日以内** | 健康保険法施行規則第24条第1项／厚生年金保険法施行規則第15条第1项 |\n| 劳动保险 **保险关系成立届** | 所辖劳动基准监督署长或所辖公共职业安定所长 | **自保险关系成立之日的次日起算10日以内** | 徴収法第4条之2第1项、同施行规则第4条第2项 |\n| 劳动保险 **概算保险费申报书** | 所辖劳动基准监督署、所辖都道府县劳动局、日本银行三者之一 | **自保险关系成立之日的次日起算50日以内** | 徴収法第15条第1项 |\n| 雇用保险 **适用事业所设置届** | 管辖事业所所在地的公共职业安定所（Hello Work） | **自设置之日的次日起算10日以内** | 雇用保険法施行規則第141条第1项 |\n| 雇用保险 **被保险人资格取得届** | 同上 | **至资格取得事实发生之日所属月份的次月10日为止** | 雇用保険法施行規則第6条第1项 |\n\n**社会保险是两个「5日以内」，劳动保险是「10日以内」与「50日以内」，只有雇用保险的资格取得是「次月10日为止」。** 这种不整齐，直接就成为疏漏的原因。\n\n另外，法条的写法与行政的说明在表达上有出入。徴収法第4条之2第1项写的是「自其成立之日起十日以内」，但厚生劳动省的说明是「自成立之日的**次日起算**10日以内」。这是依日本《民法》（民法，明治29年法律第89号）第140条（初日不算入）所作的同一内容的换句话说，并非矛盾。\n\n## 为什么会漏掉概算保险费的申报？\n\n**因为大家以为「劳动保险的手续」只有一项。** 实际上有2份文件。\n\n- **保险关系成立届**——申报保险关系已经成立的文件（10日以内）\n- **概算保险费申报书**——以预估方式申报并缴纳该年度保险费的文件（50日以内）\n\n提交成立届之后会被赋予劳动保险号码，因此看起来手续已经完成。但是保险费的申报还没做。**50日这个期限比其他项目都长，所以先搁着然后就忘了**——这是最常见的流程。\n\n而且因为期限长，等到察觉时往往已经过期。**把成立届与概算保险费申报书在同一天一起提交，是最确实的做法。** 提交处有时不同，但劳动基准监督署两者都受理。\n\n概算保险费，是以该保险年度预计支付的工资总额乘以保险费率计算。年度结束后再申报确定保险费，结算差额（每年重复这个流程就是年度更新）。**多缴的部分会被结算，因此预估即使有些偏差也还来得及补救。** 不提交才是问题。\n\n结束公司营业时，则反过来要提交**确定保险费申报书**。相关内容整理于[结束公司时，社会保险与劳动保险该怎么办](/zh/labor/column/kaisha-tatamu-shakaihoken-zenso-tetsuzuki)。\n\n## 与登记、税务的申报如何区分？\n\n**是分开的。** 设立后立即需要的申报，至少分为3个系统，各自负责的专业人员也不同。\n\n| 系统 | 内容 | 属于谁的业务 |\n|---|---|---|\n| 劳动・社会保险 | 新规适用届、保险关系成立届、概算保险费申报书、适用事业所设置届、资格取得届 | 社会保险劳务士 |\n| **登记** | 设立登记、董监事变更登记 | **司法书士** |\n| **税务** | 法人设立申报书、蓝色申报的核准申请、给与支付事务所等的开设申报 | **税理士** |\n| 许认可 | 事业所需的执照・许可・申报 | 行政书士 |\n\n**本事务所处理的只有第1行。** 登记请洽司法书士，税务请洽税理士，我们会为您介绍，由您各自直接委任。本事务所不收取介绍费。\n\n**另外，公司设立所伴随的章程与许认可文件制作，由[公司设立・各种许认可](/zh/legal/services/company)承接，但这是四葉行政書士事務所的业务，与四葉社会保険労務士事務所是各自独立的事业体。** 即使两边都委托，也请**另行签约**，请款与汇款账户也是分开的。\n\n**至少请先掌握时间点。** 社会保险的新规适用届需要登记事项证明书，因此必须等设立登记完成。另一方面，**5日这个期限并不会等登记完成**。实务上的做法是先把文件备齐，等登记一完成就能立刻行动。\n\n## 常见问题\n\n**Q. 只有代表人1人，且董事报酬设为零。这样还需要社会保险吗？**\nA. 在没有支付报酬的情形下，因欠缺成为被保险人的前提，实务上有不作为适用事业所申报的情况。不过这并不是「设成零就可以不加入」这么单纯，而是依实际上是否发生报酬来判断。**董事报酬要如何设定也直接牵涉税务，请与税理士并行研议。**\n\n**Q. 距离设立已经过了好几个月。现在提交还可以吗？**\nA. 即使已经过期，申报仍会被受理。不过社会保险方面会**追溯适用**，该部分的保险费也会追溯发生。时间拖得越久，追溯的金额越大，因此发现后越早提交，负担就越轻。请先从整理现状开始与我们讨论。\n\n**Q. 我们是只有家人的公司，需要劳动保险吗？**\nA. 同居的亲属原则上被认为不属于劳动者，因此若只有这些人，可能不成为劳动保险的对象。但判断仍取决于实际状态。至于雇用保险，若另外满足业务处理要领的要件，仍有成为被保险人的余地。详情请参阅[让家人成为员工时，容易卡住的3个地方](/zh/labor/column/kazoku-shain-koyohoken-yakuin-joseikin)。\n\n**Q. 劳动・社会保险的申报，可以全部委托给你们吗？**\nA. 劳动・社会保险的申报，由四葉社会保険労務士事務所承接。费用刊载于[报酬额表](/zh/labor/ryokin)。**登记与税务的申报本事务所不处理，请直接委任司法书士・税理士。** 那些都是各自分别的委任契约。\n\n## 本文的依据\n\n- 健康保険法施行規則（大正15年内务省令第36号）第19条第1项（新规适用届）、第24条第1项（资格取得届）\n- 厚生年金保険法施行規則（昭和29年厚生省令第37号）第13条第1项（新规适用届）、第15条第1项（资格取得届）\n- 労働保険の保険料の徴収等に関する法律（昭和44年法律第84号）第3条、第4条之2第1项、第15条第1项\n- 労働保険の保険料の徴収等に関する法律施行規則（昭和47年劳动省令第8号）第4条第2项\n- 雇用保険法施行規則（昭和50年劳动省令第3号）第141条第1项（适用事业所设置届）、第6条第1项（资格取得届）\n- 厚生劳动省「労働保険の成立手続」（成立届10日以内・概算保险费申报书50日以内・雇用保险适用事业所设置届10日以内・资格取得届为次月10日为止）\n- 日本年金机构「新規適用の手続き」（提交时期为自事实发生起5日以内，提交处为事务中心或管辖的年金事务所）\n- 厚生劳动省「雇用保険事務手続きの手引き【第1編】適用事業所編【令和7年8月版】」\n- 条文均为2026年8月13日时点以e-Gov法令検索确认的现行条文\n\n**本文并未决定到「该向谁咨询」为止。** 劳动・社会保险的申报与概算保险费的申报、资格取得的手续，是社会保险劳务士的业务。设立登记请洽司法书士，法人设立申报书等税务请洽税理士，我们会为您介绍，由您各自直接委任。章程与许认可的文件制作由四葉行政書士事務所（**是各自独立的事业体，请另行签约**）承接。本事务所不收取介绍费。向四葉社会保険労務士事務所咨询时的费用整理于[报酬额表](/zh/labor/ryokin)，常被询问的问题整理于[常见问答](/zh/labor/faq)。\n\n本文为一般性的信息提供。因应个别情事的判断，由具备资格者在面谈后进行。撰文者为[浦松丈二](/zh/about/uramatsu)（社会保险劳务士・行政书士・宅地建物取引士）。",
        "category": "手续与期限",
        "keywords": [
          "公司设立 社会保险 手续 期限",
          "新规适用届 5日以内",
          "劳动保险 保险关系成立届 10日",
          "概算保险费申报书 50日以内",
          "雇用保险 适用事业所设置届",
          "设立后 劳动保险 要提交什么"
        ],
        "tags": [
          "公司设立",
          "新规适用届",
          "劳动保险",
          "概算保险费",
          "手续"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社会保险劳务士・行政书士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "只有代表人1人，且董事报酬设为零。这样还需要社会保险吗？",
            "answer": "在没有支付报酬的情形下，因欠缺成为被保险人的前提，实务上有不作为适用事业所申报的情况。不过这并不是「设成零就可以不加入」这么单纯，而是依实际上是否发生报酬来判断。董事报酬要如何设定也直接牵涉税务，请与税理士并行研议。"
          },
          {
            "question": "距离设立已经过了好几个月。现在提交还可以吗？",
            "answer": "即使已经过期，申报仍会被受理。不过社会保险方面会追溯适用，该部分的保险费也会追溯发生。时间拖得越久，追溯的金额越大，因此发现后越早提交，负担就越轻。请先从整理现状开始与我们讨论。"
          },
          {
            "question": "我们是只有家人的公司，需要劳动保险吗？",
            "answer": "同居的亲属原则上被认为不属于劳动者，因此若只有这些人，可能不成为劳动保险的对象。但判断仍取决于实际状态。至于雇用保险，若另外满足业务处理要领的要件，仍有成为被保险人的余地。详情请参阅让家人成为员工时，容易卡住的3个地方。"
          },
          {
            "question": "劳动・社会保险的申报，可以全部委托给你们吗？",
            "answer": "劳动・社会保险的申报，由四葉社会保険労務士事務所承接。费用刊载于报酬额表。登记与税务的申报本事务所不处理，请直接委任司法书士・税理士。 那些都是各自分别的委任契约。"
          }
        ]
      }
    }
  },
  {
    "business": "labor",
    "slug": "joseikin-yuki-muki-keiyaku-katachi",
    "title": "助成金を狙うなら、最初の契約形態で決まる",
    "date": "2026-09-01",
    "category": "助成金",
    "excerpt": "キャリアアップ助成金の正社員化コースは、有期契約から正社員にしたか、無期契約から正社員にしたかで額が変わります。パートを迎える時点でどちらにするかが、1年後の金額を決めます。キャリアアップ計画は転換の実施日の前日までに提出しないと不支給になります。",
    "content": "**結論（先に要点）**：キャリアアップ助成金の正社員化コースは、**有期契約から正社員にしたか、無期契約から正社員にしたか**で額が変わります。パートを迎える時点でどちらにするかが、1年後の金額を決めます。**あとから変えることはできません。**\n\n助成金の記事は「いくらもらえるか」から書かれることが多いのですが、実際に金額を決めているのは**入り口の契約**です。しかも入り口の判断は、正社員化を考えるずっと前——最初にパートとして迎えるときに済んでしまっています。この記事は、助成金そのものではなく**契約の形の選び方**だけを扱います。制度全体は[助成金の申請サポート](/labor/services/joseikin)をご覧ください。\n\n## 有期と無期で、なぜ額が変わるのか？\n\n**正社員に近いところから動かすほど、助成の額は小さくなる**という設計だからです。\n\n有期契約（期間の定めのある契約）から正社員にするほうが、無期契約（期間の定めのない契約）から正社員にするより、労働者の立場の改善幅が大きいと評価されます。そのため額に差がつきます。\n\n| 転換前 | 中小企業 | 大企業 |\n|---|---|---|\n| **有期**契約労働者から | **40万円**（1期あたり） | **30万円**（1期あたり） |\n| **無期**契約労働者から | **20万円**（1期あたり） | **15万円**（1期あたり） |\n\n（キャリアアップ助成金支給要領 1005。**令和8年4月8日付け**）\n\n**「1期あたり」がもう一段の分岐です。** 支給対象期が2期になるのは、対象者が**重点支援対象者**に当たる場合だけです。当たらなければ1期で終わります。\n\n| | 中小企業 | 大企業 |\n|---|---|---|\n| 重点支援対象者・**有期**から | **80万円**（40万円×2期） | 60万円（30万円×2期） |\n| 重点支援対象者・**無期**から | 40万円（20万円×2期） | 30万円（15万円×2期） |\n| それ以外・**有期**から | 40万円（1期） | 30万円（1期） |\n| それ以外・**無期**から | **20万円**（1期） | 15万円（1期） |\n\n**同じ1人の正社員化で、80万円と20万円の差がつきます。** 4倍です。\n\n重点支援対象者には、**雇入れから3年以上の有期雇用労働者**、雇入れから3年未満で過去5年の正規雇用期間が通算1年以下かつ過去1年正規雇用でない者、派遣労働者・母子家庭の母等などが含まれます（支給要領0235）。\n\n**ここが実務の要です。** 3年以上有期契約で働いてもらってから正社員にすると最大額に届きますが、途中で「安定させてあげよう」と無期契約に切り替えると、その先の正社員化は無期からの転換になり、額が下がります。**善意の無期転換が、助成金を減らします。**\n\n無期転換ルール（労働契約法第18条）により、通算5年を超えると本人の申込みで無期契約になります。**5年を待たずに正社員化まで進めるのか、無期転換を経るのか。この見通しを、最初に立てておく必要があります。**\n\nなお、令和8年度から**しょくばらぼ等への公表**による加算（中小企業20万円）が新設されました。正社員転換制度や多様な正社員制度を新たに規定した場合の加算とあわせて、1適用事業所につき各1回のみ受けられます。\n\n**1年度1事業所あたりの支給申請の上限は20人**です（同一対象者の2回目の申請を除く）。\n\n## 計画は、いつまでに出すのか？\n\n**転換等の措置を実施する日の前日までです。出していなければ、それだけで不支給になります。**\n\n支給要領0401は、天災その他やむを得ない理由がある場合を除き、「**コース実施日の前日**（その日が行政機関の休日に当たる場合には、**当該行政機関の休日の翌日**）までに」、キャリアアップ計画書を**管轄労働局長**に提出しなければならない、としています。\n\n| | 内容 |\n|---|---|\n| 提出期限 | **コース実施日（転換日）の前日**まで。前日が土日祝・年末年始なら**休日の翌日**まで |\n| 計画期間 | **3年以上5年以内**（支給要領0302ヘ） |\n| 提出先 | **管轄労働局長**。労働局が委任した場合に限り、ハローワーク経由で提出可 |\n\n**「前日まで」は、ぎりぎりを狙う期限ではありません。** 厚生労働省のパンフレットも「コース実施日の1か月前など、余裕を持ってご提出ください」としています。計画書に不備があれば差し戻され、その間に転換日が来てしまいます。\n\n計画期間が3年以上必要なので、**「来月転換するから今月計画を出す」という使い方はできても、計画自体は3年先まで書く**ことになります。転換の予定が1人分しかなくても同じです。\n\n## 家族を雇う場合は、どうなるのか？\n\n**対象になりません。** 支給要領1003ニが、対象労働者の要件として「転換又は直接雇用を行った適用事業所の**事業主又は取締役の3親等以内の親族**（民法第725条第1号に規定する血族のうち3親等以内の者、同条第2号に規定する配偶者及び同条第3号に規定する姻族をいう）**以外の者であること**」と定めています。\n\n**判定される期間まで決まっています。** 厚生労働省のQ&A（令和8年7月29日）Q-8は、正社員化コースについて「**転換又は直接雇用日の前日から起算して6か月前の日を始期とし、支給申請時点まで**」としています。転換の直前に関係が変わっても、6か月さかのぼって見られます。\n\nそのうえ、**同居の親族は原則として雇用保険の被保険者になりません**（厚生労働省「雇用保険に関する業務取扱要領」20351(1)リ）。雇用関係助成金は雇用保険適用事業所の事業主であることを前提としており、対象労働者も被保険者です。**入り口の段階で二重に外れる**ことになります。\n\n家族の入社を検討している場合は、[家族を社員にするとき、つまずく3つのところ](/labor/column/kazoku-shain-koyohoken-yakuin-joseikin)を先にお読みください。\n\n## 入り口で決めておくことは何か？\n\nパートを迎える時点で、次の4つを決めておいてください。\n\n1. **有期契約にするか、無期契約にするか**——ここで最大4倍の差がつきます\n2. **正社員化までの想定年数**——3年以上有期で働いてもらうと重点支援対象者に届きます\n3. **無期転換ルール（通算5年）との関係**——5年を超えると本人の申込みで無期になります\n4. **その人が3親等以内の親族でないか**——親族なら助成金の検討自体が不要です\n\nそして、**正社員転換制度そのものを就業規則等に規定しておく**必要があります。制度を新たに規定して転換した場合には加算もありますが、**そもそも制度がなければ転換の根拠がありません**。就業規則の作成義務は常時10人以上からですが、10人未満でも規定は必要になります（[就業規則は何人から義務か。義務でないものは何か](/labor/column/shugyokisoku-10nin-gimu-nani-ga-hitsuyo)）。\n\n短時間で雇う場合の社会保険の加入基準は、[短い時間で雇うと、社会保険はどうなるか](/labor/column/tanjikan-koyo-shakaihoken-4bunno3)にまとめています。**週20時間以上でないと雇用保険に入れず、雇用保険に入らなければ助成金の対象にもなりません。** 労働時間の設計も、入り口の判断のうちです。\n\n## よくある質問\n\n**Q. すでに無期契約にしてしまいました。有期に戻せますか？**\nA. 無期契約を有期契約に戻すことは、労働条件の不利益変更にあたります。本人の同意があっても、助成金を受けるために戻したと見られる形は望ましくありません。**すでに無期であれば、無期からの転換として受けるのが素直です。** 額は下がりますが、要件を満たさない申請をするより確実です。\n\n**Q. 転換日を来週に予定しています。いまから計画を出せますか？**\nA. 転換日の前日まで（前日が休日なら休日の翌日まで）に管轄労働局長に到達していれば、形式上は間に合います。ただし計画書に不備があると受理されないため、実際には厳しい日程です。**転換日を先に延ばすほうが確実な場合があります。** 日程の組み替えを含めてご相談ください。\n\n**Q. 金額はこの記事のとおりで確定ですか？**\nA. いいえ。本記事の金額は**令和8年4月8日付けの支給要領・リーフレット**に基づくものです。厚生労働省は「制度の見直し等によりその都度支給申請様式の改定を行っています。支給申請様式や支給金額は、**各コースの取組を行った日で変化します**」としており、実際に令和8年度も4月1日版と4月8日版の2つが出ています。**申請の際は、必ず厚生労働省の最新の支給要領でご確認ください。**\n\n**Q. 助成金の申請だけをお願いできますか？**\nA. 助成金の申請には、就業規則や賃金台帳、出勤簿といった書類の整合が必要になります。日ごろの労務管理と切り離して申請だけを受けると、書類の不整合に気づけないまま提出することになりかねません。**四葉では顧問契約を前提としてお受けしています。** 費用の考え方は[報酬額表](/labor/ryokin)をご覧ください。\n\n## この記事の根拠\n\n- **キャリアアップ助成金支給要領（令和8年4月8日付け）** 0235（重点支援対象者）、0302ヘ（計画期間）、0401（計画書の提出）、1003ニ（3親等以内の親族の除外）、1005（支給額・上限人数・加算）\n- **キャリアアップ助成金Q&A（令和8年7月29日）** Q-8（親族の判定期間）\n- キャリアアップ助成金（正社員化コース）リーフレット **令和8年4月8日版**\n- キャリアアップ助成金のご案内（令和8年度版）パンフレット（**令和8年4月8日現在**）\n- 雇用関係助成金に共通の支給要領（令和8年4月8日付け）0301（雇用保険適用事業所の事業主であること）\n- 民法（明治29年法律第89号）第725条第1号・第2号・第3号\n- 厚生労働省「雇用保険に関する業務取扱要領（適用関係）」20351（1）リ（同居の親族）\n- 労働契約法（平成19年法律第128号）第18条（無期転換ルール）\n- **支給要領・支給額は年度ごとに、また年度の途中でも改定されます。** 本記事の金額はいずれも令和8年4月8日付けの資料に基づくもので、令和9年度以降の取組には適用されない可能性が高く、令和8年度内であっても改定がありえます。**申請の際は、必ず厚生労働省の最新の支給要領でご確認ください**\n\n**この記事は、誰に相談するかまでは決めていません。** キャリアアップ計画の作成と提出、正社員転換制度の規定づくり、対象労働者の要件確認、支給申請は社会保険労務士の業務です。設備投資などの補助金は四葉行政書士事務所（**別の事業体です。別々にご契約いただきます**）、助成金収入の税務上の扱いは税理士へ、それぞれ直接ご依頼いただく形をご案内します。当事務所は紹介料を受け取りません。四葉社会保険労務士事務所にご相談いただく場合の費用は[報酬額表](/labor/ryokin)に、よくいただくご質問は[よくあるご質問](/labor/faq)にまとめています。\n\n本記事は一般的な情報提供です。個別のご事情に応じた判断は、面談のうえ資格者が行います。執筆は[浦松丈二](/about/uramatsu)（社会保険労務士・行政書士・宅地建物取引士）です。",
    "status": "published",
    "author": {
      "name": "浦松 丈二",
      "title": "社会保険労務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
    },
    "keywords": [
      "キャリアアップ助成金 有期 無期 違い",
      "正社員化コース 金額",
      "キャリアアップ計画 提出期限",
      "パート 正社員 助成金",
      "重点支援対象者 キャリアアップ助成金",
      "助成金 家族 3親等以内の親族"
    ],
    "tags": [
      "助成金",
      "キャリアアップ助成金",
      "正社員化",
      "有期契約",
      "無期転換"
    ],
    "locales": [],
    "faq": [
      {
        "question": "すでに無期契約にしてしまいました。有期に戻せますか？",
        "answer": "無期契約を有期契約に戻すことは、労働条件の不利益変更にあたります。本人の同意があっても、助成金を受けるために戻したと見られる形は望ましくありません。すでに無期であれば、無期からの転換として受けるのが素直です。 額は下がりますが、要件を満たさない申請をするより確実です。"
      },
      {
        "question": "転換日を来週に予定しています。いまから計画を出せますか？",
        "answer": "転換日の前日まで（前日が休日なら休日の翌日まで）に管轄労働局長に到達していれば、形式上は間に合います。ただし計画書に不備があると受理されないため、実際には厳しい日程です。転換日を先に延ばすほうが確実な場合があります。 日程の組み替えを含めてご相談ください。"
      },
      {
        "question": "金額はこの記事のとおりで確定ですか？",
        "answer": "いいえ。本記事の金額は令和8年4月8日付けの支給要領・リーフレットに基づくものです。厚生労働省は「制度の見直し等によりその都度支給申請様式の改定を行っています。支給申請様式や支給金額は、各コースの取組を行った日で変化します」としており、実際に令和8年度も4月1日版と4月8日版の2つが出ています。申請の際は、必ず厚生労働省の最新の支給要領でご確認ください。"
      },
      {
        "question": "助成金の申請だけをお願いできますか？",
        "answer": "助成金の申請には、就業規則や賃金台帳、出勤簿といった書類の整合が必要になります。日ごろの労務管理と切り離して申請だけを受けると、書類の不整合に気づけないまま提出することになりかねません。四葉では顧問契約を前提としてお受けしています。 費用の考え方は報酬額表をご覧ください。"
      }
    ],
    "translations": {
      "en": {
        "title": "If you are aiming for a subsidy, the form of the first contract decides it",
        "excerpt": "Under the Regular Employment Conversion Course of the Career Up Subsidy, the amount changes according to whether you converted a fixed-term contract worker or an indefinite-term contract worker into a regular employee. Which of the two you choose at the moment you take a part-timer on decides the amount a year later. And if the Career Up Plan is not submitted by the day before the conversion is carried out, nothing is paid at all.",
        "content": "**In short:** Under the Regular Employment Conversion Course of the Career Up Subsidy (キャリアアップ助成金), the amount changes according to **whether you converted a fixed-term contract worker, or an indefinite-term contract worker, into a regular employee**. Which of the two you choose at the moment you take a part-timer on decides the amount a year later. **You cannot change it after the fact.**\n\nArticles about subsidies usually start from \"how much you can get,\" but what actually fixes the amount is **the contract at the entrance**. And that entrance decision is made long before conversion to regular employment is on anyone's mind — it is already settled when you first take the person on as a part-timer. This article deals only with **how to choose the form of the contract**, not with the subsidy scheme itself. For the scheme as a whole, see [Support with subsidy applications](/en/labor/services/joseikin).\n\n## Why does the amount change between fixed-term and indefinite-term?\n\n**Because the scheme is designed so that the closer to a regular employee you start from, the smaller the support.**\n\nMoving someone from a fixed-term contract (a contract with a defined period) to regular employment is assessed as a larger improvement in the worker's position than moving them from an indefinite-term contract (a contract with no defined period) to regular employment. Hence the difference in amount.\n\n| Status before conversion | Small and medium-sized enterprise | Large enterprise |\n|---|---|---|\n| From a **fixed-term** contract worker | **400,000 yen** (per payment period) | **300,000 yen** (per payment period) |\n| From an **indefinite-term** contract worker | **200,000 yen** (per payment period) | **150,000 yen** (per payment period) |\n\n(Career Up Subsidy payment guidelines 1005. **Dated April 8, 2026 / 令和8年4月8日付け.** Amounts are revised; see the last question below and the sources section.)\n\n**\"Per payment period\" is the next branch.** The payment periods become two only where the person concerned falls within the **priority support target persons** (重点支援対象者). If they do not, it ends after one period.\n\n| | Small and medium-sized enterprise | Large enterprise |\n|---|---|---|\n| Priority support target person, from **fixed-term** | **800,000 yen** (400,000 yen × 2 periods) | 600,000 yen (300,000 yen × 2 periods) |\n| Priority support target person, from **indefinite-term** | 400,000 yen (200,000 yen × 2 periods) | 300,000 yen (150,000 yen × 2 periods) |\n| Otherwise, from **fixed-term** | 400,000 yen (1 period) | 300,000 yen (1 period) |\n| Otherwise, from **indefinite-term** | **200,000 yen** (1 period) | 150,000 yen (1 period) |\n\n**For converting the very same one person, the gap runs between 800,000 yen and 200,000 yen.** A factor of four.\n\nPriority support target persons include **fixed-term employed workers three or more years from being taken on**, those less than three years from being taken on whose period of regular employment over the past five years totals one year or less and who have not been in regular employment in the past year, dispatched workers, mothers in single-mother households and others (payment guidelines 0235).\n\n**This is the crux in practice.** Have someone work on a fixed-term contract for three years or more and then convert them, and you reach the maximum. Switch them to an indefinite-term contract along the way out of a wish to \"give them some stability,\" and the later conversion becomes a conversion from indefinite term, and the amount drops. **A well-meant conversion to indefinite term reduces the subsidy.**\n\nUnder the indefinite-term conversion rule (Article 18 of the Labor Contracts Act, 労働契約法, Act No. 128 of 2007), once the total exceeds five years the contract becomes indefinite on the worker's own application. **Do you go all the way to regular employment without waiting five years, or do you pass through indefinite-term conversion? You need to have this outlook from the start.**\n\nNote also that from fiscal year 2026 (令和8年度) an addition for **publication on Shokuba-Lab (しょくばらぼ) and similar sites** was newly created (200,000 yen for small and medium-sized enterprises). Together with the addition for newly setting out a regular-employee conversion system or a diverse regular-employee system, it can be received only once each per covered place of business.\n\n**The cap on payment applications is 20 people per place of business per fiscal year** (excluding a second application for the same person).\n\n## By when must the plan be submitted?\n\n**By the day before the day the conversion or other measure is carried out. If you have not submitted it, that alone means no payment.**\n\nPayment guidelines 0401 provide that, except where there is a natural disaster or other unavoidable reason, the Career Up Plan must be submitted to the **Director of the competent Prefectural Labour Bureau** \"by **the day before the course implementation date** (or, where that day falls on a holiday of the administrative agency, by **the day after that holiday of the administrative agency**).\"\n\n| | Content |\n|---|---|\n| Submission deadline | By **the day before the course implementation date (the conversion date)**. If the preceding day is a Saturday, Sunday, public holiday or a year-end/new-year holiday, by **the day after the holiday** |\n| Plan period | **Three years or more and five years or less** (payment guidelines 0302-he) |\n| Where to submit | The **Director of the competent Prefectural Labour Bureau**. Submission via Hello Work is possible only where the Labour Bureau has delegated it |\n\n**\"By the day before\" is not a deadline to be shaved.** The Ministry of Health, Labour and Welfare's pamphlet also says to \"submit with time to spare, for example one month before the course implementation date.\" If there is a defect in the plan, it is sent back, and the conversion date arrives in the meantime.\n\nBecause the plan period has to be three years or more, **you can use it in the sense of \"we are converting next month, so we submit the plan this month,\" but the plan itself has to be written out three years ahead**. That holds even if there is only one person's conversion in prospect.\n\n## What happens if you employ family members?\n\n**They are not eligible.** Payment guidelines 1003-ni provide, as a requirement for the target worker, that the person must be \"a person **other than a relative within the third degree of kinship of the business owner or a director** of the covered place of business that carried out the conversion or direct employment (meaning blood relatives within the third degree among those provided for in Article 725, item 1 of the Civil Code, the spouse provided for in item 2 of the same Article, and relatives by affinity provided for in item 3 of the same Article).\"\n\n**Even the period over which this is judged is fixed.** Q-8 of the Ministry of Health, Labour and Welfare's Q&A (dated July 29, 2026 / 令和8年7月29日) states, for the Regular Employment Conversion Course, that it runs \"**from the day six months before the day preceding the date of conversion or direct employment, counted back from that day, up to the time of the payment application**.\" Even if the relationship changes immediately before the conversion, they look back six months.\n\nOn top of that, **co-residing relatives are as a rule not employment insurance insured persons** (Ministry of Health, Labour and Welfare, \"雇用保険に関する業務取扱要領\" 20351(1)-ri). Employment-related subsidies presuppose that the applicant is the business owner of a covered place of business for employment insurance, and the target worker is an insured person too. **You fall outside twice over, right at the entrance.**\n\nIf you are considering bringing family members into the company, please read [Three places people stumble when putting family on the payroll](/en/labor/column/kazoku-shain-koyohoken-yakuin-joseikin) first.\n\n## What should you decide at the entrance?\n\nAt the moment you take a part-timer on, decide these four things.\n\n1. **Fixed-term contract or indefinite-term contract** — this is where the factor-of-four gap opens up\n2. **How many years you expect before conversion to regular employment** — three years or more on a fixed-term contract reaches the priority support target persons\n3. **The relationship with the indefinite-term conversion rule (five years in total)** — beyond five years, the contract becomes indefinite on the worker's own application\n4. **Whether the person is a relative within the third degree** — if they are, there is no need to consider the subsidy at all\n\nAnd you need to **set out the regular-employee conversion system itself in your work rules or the like**. There is an addition where you newly set out such a system and then convert, but **without a system in the first place there is no basis for the conversion**. The obligation to draw up work rules starts at 10 or more workers regularly employed, but the provision is needed even below 10 ([How many employees make work rules mandatory, and what applies no matter how few](/en/labor/column/shugyokisoku-10nin-gimu-nani-ga-hitsuyo)).\n\nThe social insurance enrollment criteria for short-hours hiring are covered in [What happens to social insurance when you hire for short hours](/en/labor/column/tanjikan-koyo-shakaihoken-4bunno3). **Below 20 hours a week you cannot enroll the person in employment insurance, and without employment insurance they are not eligible for the subsidy either.** Designing working hours is part of the entrance decision too.\n\n## Frequently asked questions\n\n**Q. We have already made the contract indefinite-term. Can we put it back to fixed-term?**\nA. Returning an indefinite-term contract to a fixed-term contract amounts to a disadvantageous change of working conditions. Even with the person's consent, a shape that looks like it was reverted in order to obtain a subsidy is not desirable. **If they are already on an indefinite term, taking it as a conversion from indefinite term is the straightforward course.** The amount is lower, but it is safer than an application that does not meet the requirements.\n\n**Q. The conversion date is set for next week. Can we submit the plan now?**\nA. If it reaches the Director of the competent Prefectural Labour Bureau by the day before the conversion date (or, where that day is a holiday, by the day after the holiday), it is formally in time. But because a plan with defects will not be accepted, the schedule is tight in practice. **Pushing the conversion date back is sometimes the safer option.** Please talk to us, including about rearranging the schedule.\n\n**Q. Are the amounts in this article final as stated?**\nA. No. The amounts in this article are based on **the payment guidelines and leaflet dated April 8, 2026 (令和8年4月8日付け)**. The Ministry of Health, Labour and Welfare states that \"we revise the payment application forms each time the scheme is reviewed. The payment application forms and the amounts paid **change according to the date on which the work under each course was carried out**,\" and in fact two versions were issued in fiscal 2026 as well, an April 1 version and an April 8 version. **When you apply, always check against the Ministry of Health, Labour and Welfare's latest payment guidelines.**\n\n**Q. Can we ask you to handle only the subsidy application?**\nA. A subsidy application requires the work rules, wage ledgers, attendance records and other documents to be consistent with one another. If we take on the application alone, cut off from day-to-day labor management, we may end up submitting without noticing inconsistencies in the documents. **At Yotsuba we accept this work on the premise of a retainer agreement.** For how we think about fees, see the [fee schedule](/en/labor/ryokin).\n\n## Sources for this article\n\n- **キャリアアップ助成金支給要領（令和8年4月8日付け）** Career Up Subsidy payment guidelines dated April 8, 2026: 0235 (priority support target persons), 0302-he (plan period), 0401 (submission of the plan), 1003-ni (exclusion of relatives within the third degree), 1005 (amounts, cap on the number of people, additions)\n- **キャリアアップ助成金Q&A（令和8年7月29日）** Career Up Subsidy Q&A dated July 29, 2026: Q-8 (the period over which relatives are judged)\n- キャリアアップ助成金（正社員化コース）リーフレット **令和8年4月8日版** (leaflet, April 8, 2026 version)\n- キャリアアップ助成金のご案内（令和8年度版）パンフレット (**as of 令和8年4月8日現在**)\n- 雇用関係助成金に共通の支給要領（令和8年4月8日付け）0301 (being the business owner of a covered place of business for employment insurance)\n- 民法 (Civil Code, Act No. 89 of 1896), Article 725 items 1, 2 and 3\n- Ministry of Health, Labour and Welfare, 「雇用保険に関する業務取扱要領（適用関係）」 20351(1)-ri (co-residing relatives)\n- 労働契約法 (Labor Contracts Act, Act No. 128 of 2007), Article 18 (the indefinite-term conversion rule)\n- **The payment guidelines and the amounts paid are revised every fiscal year, and also part-way through a fiscal year.** All amounts in this article are based on materials dated April 8, 2026 (令和8年4月8日), are highly likely not to apply to work carried out in fiscal 2027 (令和9年度) or later, and may be revised even within fiscal 2026 (令和8年度). **When you apply, always check against the Ministry of Health, Labour and Welfare's latest payment guidelines**\n\n**This article does not go so far as to decide whom you should consult.** Drawing up and submitting the Career Up Plan, framing the provisions for a regular-employee conversion system, checking the requirements for target workers, and the payment application are the work of a Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant). Grants for capital investment and the like go to 四葉行政書士事務所 (**a separate business entity; you enter into a separate contract with each office**), and the tax treatment of subsidy income goes to a tax accountant; in each case we will point you to them and you engage them directly. This office does not accept referral fees. The cost of consulting 四葉社会保険労務士事務所 is set out in the [fee schedule](/en/labor/ryokin), and the questions we are asked most often are collected on the [FAQ page](/en/labor/faq).\n\nThis article is general information. Judgments that fit your particular circumstances are made by a qualified professional after a meeting. Written by [Joji Uramatsu](/en/about/uramatsu) (Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist).",
        "category": "Employment subsidies",
        "keywords": [
          "Career Up Subsidy fixed-term indefinite-term difference",
          "Regular Employment Conversion Course amount",
          "Career Up Plan submission deadline",
          "part-timer regular employee subsidy",
          "priority support target person Career Up Subsidy",
          "subsidy family relative within the third degree"
        ],
        "tags": [
          "employment subsidies",
          "Career Up Subsidy",
          "conversion to regular employee",
          "fixed-term contract",
          "conversion to indefinite term"
        ],
        "author": {
          "name": "Joji Uramatsu",
          "title": "Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist — 四葉社会保険労務士事務所／四葉行政書士事務所"
        },
        "faq": [
          {
            "question": "We have already made the contract indefinite-term. Can we put it back to fixed-term?",
            "answer": "Returning an indefinite-term contract to a fixed-term contract amounts to a disadvantageous change of working conditions. Even with the person's consent, a shape that looks like it was reverted in order to obtain a subsidy is not desirable. If they are already on an indefinite term, taking it as a conversion from indefinite term is the straightforward course. The amount is lower, but it is safer than an application that does not meet the requirements."
          },
          {
            "question": "The conversion date is set for next week. Can we submit the plan now?",
            "answer": "If it reaches the Director of the competent Prefectural Labour Bureau by the day before the conversion date (or, where that day is a holiday, by the day after the holiday), it is formally in time. But because a plan with defects will not be accepted, the schedule is tight in practice. Pushing the conversion date back is sometimes the safer option. Please talk to us, including about rearranging the schedule."
          },
          {
            "question": "Are the amounts in this article final as stated?",
            "answer": "No. The amounts in this article are based on the payment guidelines and leaflet dated April 8, 2026 (令和8年4月8日付け). The Ministry of Health, Labour and Welfare states that \"we revise the payment application forms each time the scheme is reviewed. The payment application forms and the amounts paid change according to the date on which the work under each course was carried out,\" and in fact two versions were issued in fiscal 2026 as well, an April 1 version and an April 8 version. When you apply, always check against the Ministry of Health, Labour and Welfare's latest payment guidelines."
          },
          {
            "question": "Can we ask you to handle only the subsidy application?",
            "answer": "A subsidy application requires the work rules, wage ledgers, attendance records and other documents to be consistent with one another. If we take on the application alone, cut off from day-to-day labor management, we may end up submitting without noticing inconsistencies in the documents. At Yotsuba we accept this work on the premise of a retainer agreement. For how we think about fees, see the fee schedule."
          }
        ]
      },
      "zh-tw": {
        "title": "想爭取助成金，關鍵在最初的契約形態",
        "excerpt": "職涯提升助成金（キャリアアップ助成金）的正社員化課程，金額會依「是從有期契約轉為正社員，還是從無期契約轉為正社員」而不同。在迎接兼職人員的那個時點選擇哪一種，就決定了1年後的金額。而職涯提升計畫若未在轉換實施日的前一日之前提出，就會不予支給。",
        "content": "**結論（先講重點）**：職涯提升助成金（キャリアアップ助成金）的正社員化課程，金額會依**是從有期契約轉為正社員，還是從無期契約轉為正社員**而不同。在迎接兼職人員的那個時點選擇哪一種，就決定了1年後的金額。**事後無法更改。**\n\n關於助成金的文章，多半從「可以領多少」寫起，但實際上決定金額的是**入口的契約**。而且入口的判斷，早在考慮正社員化之前——第一次以兼職人員身分迎接對方的時候，就已經完成了。本文不談助成金制度本身，只處理**契約形式的選擇方式**。制度整體請參閱[助成金的申請支援](/zh-tw/labor/services/joseikin)。\n\n## 有期與無期，為什麼金額會不同？\n\n**因為制度設計是：越接近正社員的狀態出發，助成的金額就越小。**\n\n從有期契約（定有期間的契約）轉為正社員，相較於從無期契約（未定期間的契約）轉為正社員，被評價為勞動者立場的改善幅度較大。因此金額上有差距。\n\n| 轉換前 | 中小企業 | 大企業 |\n|---|---|---|\n| 從**有期**契約勞動者 | **40萬日圓**（每1期） | **30萬日圓**（每1期） |\n| 從**無期**契約勞動者 | **20萬日圓**（每1期） | **15萬日圓**（每1期） |\n\n（キャリアアップ助成金支給要領 1005。**令和8年（2026年）4月8日付**。金額會被改定，請一併參閱下方最後一則問答與「本文的依據」。）\n\n**「每1期」是再往下一層的分歧。** 支給對象期會變成2期，只限對象者屬於**重點支援對象者**的情形。若不屬於，1期就結束。\n\n| | 中小企業 | 大企業 |\n|---|---|---|\n| 重點支援對象者・從**有期** | **80萬日圓**（40萬日圓×2期） | 60萬日圓（30萬日圓×2期） |\n| 重點支援對象者・從**無期** | 40萬日圓（20萬日圓×2期） | 30萬日圓（15萬日圓×2期） |\n| 其他・從**有期** | 40萬日圓（1期） | 30萬日圓（1期） |\n| 其他・從**無期** | **20萬日圓**（1期） | 15萬日圓（1期） |\n\n**同樣是1個人的正社員化，卻會產生80萬日圓與20萬日圓的差距。** 相差4倍。\n\n重點支援對象者包含：**自僱用起3年以上的有期僱用勞動者**、自僱用起未滿3年且過去5年的正規僱用期間合計1年以下並且過去1年未處於正規僱用者、派遣勞動者・單親媽媽家庭的母親等（支給要領0235）。\n\n**這裡是實務的關鍵。** 讓對方以有期契約工作3年以上再轉為正社員，可以達到最高額；但中途出於「讓對方安定一點」的想法而改為無期契約，之後的正社員化就變成從無期的轉換，金額會下降。**善意的無期轉換，會使助成金減少。**\n\n依無期轉換規則（日本《勞動契約法》，労働契約法，平成19年法律第128號，第18條），合計超過5年時，經本人申請即成為無期契約。**是不等到5年就一路推進到正社員化，還是先經過無期轉換？這個展望必須在最初就先建立起來。**\n\n另外，自令和8年度（2026年度）起，新設了因**在しょくばらぼ（職場情報綜合網站）等公開資訊**而給予的加算（中小企業20萬日圓）。與「新訂正社員轉換制度或多樣正社員制度」的加算合計，每1適用事業所各只能領取1次。\n\n**每1年度、每1事業所的支給申請上限為20人**（同一對象者的第2次申請除外）。\n\n## 計畫要在什麼時候提出？\n\n**要在實施轉換等措施之日的前一日之前。若未提出，光是這一點就會不予支給。**\n\n支給要領0401規定，除有天災及其他不得已的理由外，應「**至課程實施日的前一日**（該日若適逢行政機關的休假日，則至**該行政機關休假日的次日**）為止」，向**管轄勞動局長**提出職涯提升計畫書。\n\n| | 內容 |\n|---|---|\n| 提出期限 | 至**課程實施日（轉換日）的前一日**為止。若前一日為週六日・國定假日・年末年始，則至**假日的次日**為止 |\n| 計畫期間 | **3年以上5年以內**（支給要領0302ヘ） |\n| 提出處 | **管轄勞動局長**。僅限勞動局有委任的情形，才可經由公共職業安定所（Hello Work）提出 |\n\n**「前一日為止」並不是拿來壓線用的期限。** 厚生勞動省的宣導手冊也表示「請在課程實施日的1個月前等，保留充裕時間提出」。計畫書若有缺漏會被退回，而在這期間轉換日就到了。\n\n由於計畫期間必須3年以上，因此**雖然可以「下個月要轉換所以這個月提出計畫」，但計畫本身仍必須寫到3年後**。即使預定轉換的只有1個人，也是一樣。\n\n## 雇用家人的話會怎樣？\n\n**不屬於對象。** 支給要領1003ニ就對象勞動者的要件規定：必須是「進行轉換或直接僱用的適用事業所的**事業主或董事的3親等以內親屬**（指日本《民法》第725條第1號所定血親中3親等以內者、同條第2號所定配偶、及同條第3號所定姻親）**以外之人**」。\n\n**連判定的期間都已經定好。** 厚生勞動省的Q&A（令和8年（2026年）7月29日）Q-8就正社員化課程表示：「**以自轉換或直接僱用日的前一日起算6個月前之日為始期，至支給申請時點為止**」。即使在轉換的前夕改變關係，仍會被回溯6個月檢視。\n\n再加上，**同居的親屬原則上不會成為僱用保險的被保險人**（厚生勞動省「雇用保険に関する業務取扱要領」20351(1)リ）。僱用關係助成金以「屬於僱用保險適用事業所的事業主」為前提，對象勞動者也必須是被保險人。**在入口階段就會雙重被排除。**\n\n若正在考慮讓家人進公司，請先閱讀[讓家人成為員工時，容易卡住的3個地方](/zh-tw/labor/column/kazoku-shain-koyohoken-yakuin-joseikin)。\n\n## 在入口處要先決定什麼？\n\n在迎接兼職人員的時點，請先決定下列4件事。\n\n1. **要採有期契約還是無期契約**——這裡會產生最多4倍的差距\n2. **到正社員化為止的預估年數**——讓對方以有期工作3年以上，就能達到重點支援對象者\n3. **與無期轉換規則（合計5年）的關係**——超過5年，經本人申請即成為無期\n4. **該員是否為3親等以內的親屬**——若是親屬，就連考慮助成金都不需要\n\n而且，必須**把正社員轉換制度本身規定在就業規則等之中**。新訂制度並進行轉換時雖然也有加算，但**若根本沒有制度，轉換就沒有依據**。就業規則的制定義務是從經常10人以上開始，但未滿10人也仍然需要有相關規定（[就業規則從幾人開始成為義務？不是義務的又是哪些？](/zh-tw/labor/column/shugyokisoku-10nin-gimu-nani-ga-hitsuyo)）。\n\n以短時間僱用時的社會保險加入基準，整理於[以短時間僱用，社會保險會如何](/zh-tw/labor/column/tanjikan-koyo-shakaihoken-4bunno3)。**未達每週20小時就無法加入僱用保險，而未加入僱用保險就也不會成為助成金的對象。** 勞動時間的設計，同樣是入口判斷的一部分。\n\n## 常見問題\n\n**Q. 我們已經改成無期契約了，可以改回有期嗎？**\nA. 把無期契約改回有期契約，屬於勞動條件的不利益變更。即使取得本人同意，被看成是為了領助成金而改回去的形式並不妥當。**既然已經是無期，就以「從無期的轉換」來申請比較自然。** 金額雖然會下降，但比起提出不符合要件的申請更為確實。\n\n**Q. 我們預定下週轉換，現在還能提出計畫嗎？**\nA. 只要在轉換日的前一日（前一日若為假日則為假日的次日）之前送達管轄勞動局長，形式上是來得及的。但計畫書若有缺漏就不會被受理，實際上行程相當吃緊。**把轉換日往後延，有時反而更為確實。** 包含行程重組在內，歡迎與我們討論。\n\n**Q. 金額就照本文所寫的確定了嗎？**\nA. 不是。本文的金額是依**令和8年（2026年）4月8日付的支給要領・宣導單**而來。厚生勞動省表示「因制度檢討等而隨時進行支給申請樣式的改定。支給申請樣式與支給金額，**會依進行各課程作為之日而變化**」，實際上令和8年度也出現了4月1日版與4月8日版兩種。**申請時，請務必以厚生勞動省最新的支給要領確認。**\n\n**Q. 可以只委託助成金的申請嗎？**\nA. 助成金的申請，需要就業規則、工資帳冊、出勤簿等文件彼此一致。若與日常的勞務管理切開、只承接申請，很可能在沒察覺文件不一致的狀態下就提出。**四葉是以顧問契約為前提承接。** 費用的思考方式請參閱[報酬額表](/zh-tw/labor/ryokin)。\n\n## 本文的依據\n\n- **キャリアアップ助成金支給要領（令和8年4月8日付け）** 0235（重點支援對象者）、0302ヘ（計畫期間）、0401（計畫書的提出）、1003ニ（3親等以內親屬的排除）、1005（支給額・上限人數・加算）\n- **キャリアアップ助成金Q&A（令和8年7月29日）** Q-8（親屬的判定期間）\n- キャリアアップ助成金（正社員化コース）リーフレット **令和8年4月8日版**\n- キャリアアップ助成金のご案内（令和8年度版）パンフレット（**令和8年4月8日現在**）\n- 雇用関係助成金に共通の支給要領（令和8年4月8日付け）0301（須為僱用保險適用事業所的事業主）\n- 民法（明治29年法律第89號）第725條第1號・第2號・第3號\n- 厚生勞動省「雇用保険に関する業務取扱要領（適用関係）」20351（1）リ（同居的親屬）\n- 労働契約法（平成19年法律第128號）第18條（無期轉換規則）\n- **支給要領・支給額會逐年度改定，年度中途也可能改定。** 本文的金額均依令和8年4月8日付的資料而來，很可能不適用於令和9年度以後的作為，即使在令和8年度內也可能發生改定。**申請時，請務必以厚生勞動省最新的支給要領確認**\n\n**本文並未決定到「該向誰諮詢」為止。** 職涯提升計畫的製作與提出、正社員轉換制度的規定擬訂、對象勞動者的要件確認、支給申請，是社會保險勞務士的業務。設備投資等的補助金請洽四葉行政書士事務所（**是各自獨立的事業體，請另行簽約**），助成金收入在稅務上的處理請洽稅理士，我們會為您轉介，由您各自直接委任。本事務所不收取介紹費。向四葉社会保険労務士事務所諮詢時的費用整理於[報酬額表](/zh-tw/labor/ryokin)，常被詢問的問題整理於[常見問答](/zh-tw/labor/faq)。\n\n本文為一般性的資訊提供。因應個別情事的判斷，由具備資格者在面談後進行。撰文者為[浦松丈二](/zh-tw/about/uramatsu)（社會保險勞務士・行政書士・宅地建物取引士）。",
        "category": "助成金",
        "keywords": [
          "職涯提升助成金 有期 無期 差異",
          "正社員化課程 金額",
          "職涯提升計畫 提出期限",
          "兼職 正社員 助成金",
          "重點支援對象者 職涯提升助成金",
          "助成金 家人 3親等以內親屬"
        ],
        "tags": [
          "助成金",
          "職涯提升助成金",
          "正社員化",
          "有期契約",
          "無期轉換"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社會保險勞務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "我們已經改成無期契約了，可以改回有期嗎？",
            "answer": "把無期契約改回有期契約，屬於勞動條件的不利益變更。即使取得本人同意，被看成是為了領助成金而改回去的形式並不妥當。既然已經是無期，就以「從無期的轉換」來申請比較自然。 金額雖然會下降，但比起提出不符合要件的申請更為確實。"
          },
          {
            "question": "我們預定下週轉換，現在還能提出計畫嗎？",
            "answer": "只要在轉換日的前一日（前一日若為假日則為假日的次日）之前送達管轄勞動局長，形式上是來得及的。但計畫書若有缺漏就不會被受理，實際上行程相當吃緊。把轉換日往後延，有時反而更為確實。 包含行程重組在內，歡迎與我們討論。"
          },
          {
            "question": "金額就照本文所寫的確定了嗎？",
            "answer": "不是。本文的金額是依令和8年（2026年）4月8日付的支給要領・宣導單而來。厚生勞動省表示「因制度檢討等而隨時進行支給申請樣式的改定。支給申請樣式與支給金額，會依進行各課程作為之日而變化」，實際上令和8年度也出現了4月1日版與4月8日版兩種。申請時，請務必以厚生勞動省最新的支給要領確認。"
          },
          {
            "question": "可以只委託助成金的申請嗎？",
            "answer": "助成金的申請，需要就業規則、工資帳冊、出勤簿等文件彼此一致。若與日常的勞務管理切開、只承接申請，很可能在沒察覺文件不一致的狀態下就提出。四葉是以顧問契約為前提承接。 費用的思考方式請參閱報酬額表。"
          }
        ]
      },
      "zh": {
        "title": "想争取助成金，关键在最初的契约形态",
        "excerpt": "职业提升助成金（キャリアアップ助成金）的正社员化课程，金额会依「是从有期契约转为正社员，还是从无期契约转为正社员」而不同。在迎接兼职人员的那个时点选择哪一种，就决定了1年后的金额。而职业提升计划若未在转换实施日的前一日之前提出，就会不予支给。",
        "content": "**结论（先讲重点）**：职业提升助成金（キャリアアップ助成金）的正社员化课程，金额会依**是从有期契约转为正社员，还是从无期契约转为正社员**而不同。在迎接兼职人员的那个时点选择哪一种，就决定了1年后的金额。**事后无法更改。**\n\n关于助成金的文章，多半从「可以领多少」写起，但实际上决定金额的是**入口的契约**。而且入口的判断，早在考虑正社员化之前——第一次以兼职人员身分迎接对方的时候，就已经完成了。本文不谈助成金制度本身，只处理**契约形式的选择方式**。制度整体请参阅[助成金的申请支援](/zh/labor/services/joseikin)。\n\n## 有期与无期，为什么金额会不同？\n\n**因为制度设计是：越接近正社员的状态出发，助成的金额就越小。**\n\n从有期契约（定有期间的契约）转为正社员，相较于从无期契约（未定期间的契约）转为正社员，被评价为劳动者立场的改善幅度较大。因此金额上有差距。\n\n| 转换前 | 中小企业 | 大企业 |\n|---|---|---|\n| 从**有期**契约劳动者 | **40万日元**（每1期） | **30万日元**（每1期） |\n| 从**无期**契约劳动者 | **20万日元**（每1期） | **15万日元**（每1期） |\n\n（キャリアアップ助成金支給要領 1005。**令和8年（2026年）4月8日付**。金额会被改定，请一并参阅下方最后一则问答与「本文的依据」。）\n\n**「每1期」是再往下一层的分歧。** 支给对象期会变成2期，只限对象者属于**重点支援对象者**的情形。若不属于，1期就结束。\n\n| | 中小企业 | 大企业 |\n|---|---|---|\n| 重点支援对象者・从**有期** | **80万日元**（40万日元×2期） | 60万日元（30万日元×2期） |\n| 重点支援对象者・从**无期** | 40万日元（20万日元×2期） | 30万日元（15万日元×2期） |\n| 其他・从**有期** | 40万日元（1期） | 30万日元（1期） |\n| 其他・从**无期** | **20万日元**（1期） | 15万日元（1期） |\n\n**同样是1个人的正社员化，却会产生80万日元与20万日元的差距。** 相差4倍。\n\n重点支援对象者包含：**自雇用起3年以上的有期雇用劳动者**、自雇用起不满3年且过去5年的正规雇用期间合计1年以下并且过去1年未处于正规雇用者、派遣劳动者・单亲妈妈家庭的母亲等（支給要領0235）。\n\n**这里是实务的关键。** 让对方以有期契约工作3年以上再转为正社员，可以达到最高额；但中途出于「让对方安定一点」的想法而改为无期契约，之后的正社员化就变成从无期的转换，金额会下降。**善意的无期转换，会使助成金减少。**\n\n依无期转换规则（日本《劳动契约法》，労働契約法，平成19年法律第128号，第18条），合计超过5年时，经本人申请即成为无期契约。**是不等到5年就一路推进到正社员化，还是先经过无期转换？这个展望必须在最初就先建立起来。**\n\n另外，自令和8年度（2026年度）起，新设了因**在しょくばらぼ（职场信息综合网站）等公开信息**而给予的加算（中小企业20万日元）。与「新订正社员转换制度或多样正社员制度」的加算合计，每1适用事业所各只能领取1次。\n\n**每1年度、每1事业所的支给申请上限为20人**（同一对象者的第2次申请除外）。\n\n## 计划要在什么时候提出？\n\n**要在实施转换等措施之日的前一日之前。若未提出，光是这一点就会不予支给。**\n\n支給要領0401规定，除有天灾及其他不得已的理由外，应「**至课程实施日的前一日**（该日若适逢行政机关的休假日，则至**该行政机关休假日的次日**）为止」，向**管辖劳动局长**提出职业提升计划书。\n\n| | 内容 |\n|---|---|\n| 提出期限 | 至**课程实施日（转换日）的前一日**为止。若前一日为周六日・法定假日・年末年初，则至**假日的次日**为止 |\n| 计划期间 | **3年以上5年以内**（支給要領0302ヘ） |\n| 提出处 | **管辖劳动局长**。仅限劳动局有委任的情形，才可经由公共职业安定所（Hello Work）提出 |\n\n**「前一日为止」并不是拿来压线用的期限。** 厚生劳动省的宣导手册也表示「请在课程实施日的1个月前等，保留充裕时间提出」。计划书若有缺漏会被退回，而在这期间转换日就到了。\n\n由于计划期间必须3年以上，因此**虽然可以「下个月要转换所以这个月提出计划」，但计划本身仍必须写到3年后**。即使预定转换的只有1个人，也是一样。\n\n## 雇用家人的话会怎样？\n\n**不属于对象。** 支給要領1003ニ就对象劳动者的要件规定：必须是「进行转换或直接雇用的适用事业所的**事业主或董事的3亲等以内亲属**（指日本《民法》第725条第1号所定血亲中3亲等以内者、同条第2号所定配偶、及同条第3号所定姻亲）**以外之人**」。\n\n**连判定的期间都已经定好。** 厚生劳动省的Q&A（令和8年（2026年）7月29日）Q-8就正社员化课程表示：「**以自转换或直接雇用日的前一日起算6个月前之日为始期，至支给申请时点为止**」。即使在转换的前夕改变关系，仍会被回溯6个月检视。\n\n再加上，**同居的亲属原则上不会成为雇用保险的被保险人**（厚生劳动省「雇用保険に関する業務取扱要領」20351(1)リ）。雇用关系助成金以「属于雇用保险适用事业所的事业主」为前提，对象劳动者也必须是被保险人。**在入口阶段就会双重被排除。**\n\n若正在考虑让家人进公司，请先阅读[让家人成为员工时，容易卡住的3个地方](/zh/labor/column/kazoku-shain-koyohoken-yakuin-joseikin)。\n\n## 在入口处要先决定什么？\n\n在迎接兼职人员的时点，请先决定下列4件事。\n\n1. **要采有期契约还是无期契约**——这里会产生最多4倍的差距\n2. **到正社员化为止的预估年数**——让对方以有期工作3年以上，就能达到重点支援对象者\n3. **与无期转换规则（合计5年）的关系**——超过5年，经本人申请即成为无期\n4. **该员是否为3亲等以内的亲属**——若是亲属，就连考虑助成金都不需要\n\n而且，必须**把正社员转换制度本身规定在就业规则等之中**。新订制度并进行转换时虽然也有加算，但**若根本没有制度，转换就没有依据**。就业规则的制定义务是从经常10人以上开始，但不满10人也仍然需要有相关规定（[就业规则从几人开始成为义务？不是义务的又有哪些？](/zh/labor/column/shugyokisoku-10nin-gimu-nani-ga-hitsuyo)）。\n\n以短时间雇用时的社会保险加入基准，整理于[以短时间雇用，社会保险会如何](/zh/labor/column/tanjikan-koyo-shakaihoken-4bunno3)。**未达每周20小时就无法加入雇用保险，而未加入雇用保险就也不会成为助成金的对象。** 劳动时间的设计，同样是入口判断的一部分。\n\n## 常见问题\n\n**Q. 我们已经改成无期契约了，可以改回有期吗？**\nA. 把无期契约改回有期契约，属于劳动条件的不利益变更。即使取得本人同意，被看成是为了领助成金而改回去的形式并不妥当。**既然已经是无期，就以「从无期的转换」来申请比较自然。** 金额虽然会下降，但比起提出不符合要件的申请更为确实。\n\n**Q. 我们预定下周转换，现在还能提出计划吗？**\nA. 只要在转换日的前一日（前一日若为假日则为假日的次日）之前送达管辖劳动局长，形式上是来得及的。但计划书若有缺漏就不会被受理，实际上行程相当吃紧。**把转换日往后延，有时反而更为确实。** 包含行程重组在内，欢迎与我们讨论。\n\n**Q. 金额就照本文所写的确定了吗？**\nA. 不是。本文的金额是依**令和8年（2026年）4月8日付的支給要領・宣导单**而来。厚生劳动省表示「因制度检讨等而随时进行支给申请样式的改定。支给申请样式与支给金额，**会依进行各课程作为之日而变化**」，实际上令和8年度也出现了4月1日版与4月8日版两种。**申请时，请务必以厚生劳动省最新的支給要領确认。**\n\n**Q. 可以只委托助成金的申请吗？**\nA. 助成金的申请，需要就业规则、工资帐册、出勤簿等文件彼此一致。若与日常的劳务管理切开、只承接申请，很可能在没察觉文件不一致的状态下就提出。**四葉是以顾问契约为前提承接。** 费用的思考方式请参阅[报酬额表](/zh/labor/ryokin)。\n\n## 本文的依据\n\n- **キャリアアップ助成金支給要領（令和8年4月8日付け）** 0235（重点支援对象者）、0302ヘ（计划期间）、0401（计划书的提出）、1003ニ（3亲等以内亲属的排除）、1005（支给额・上限人数・加算）\n- **キャリアアップ助成金Q&A（令和8年7月29日）** Q-8（亲属的判定期间）\n- キャリアアップ助成金（正社員化コース）リーフレット **令和8年4月8日版**\n- キャリアアップ助成金のご案内（令和8年度版）パンフレット（**令和8年4月8日現在**）\n- 雇用関係助成金に共通の支給要領（令和8年4月8日付け）0301（须为雇用保险适用事业所的事业主）\n- 民法（明治29年法律第89号）第725条第1号・第2号・第3号\n- 厚生劳动省「雇用保険に関する業務取扱要領（適用関係）」20351（1）リ（同居的亲属）\n- 労働契約法（平成19年法律第128号）第18条（无期转换规则）\n- **支給要領・支给额会逐年度改定，年度中途也可能改定。** 本文的金额均依令和8年4月8日付的资料而来，很可能不适用于令和9年度以后的作为，即使在令和8年度内也可能发生改定。**申请时，请务必以厚生劳动省最新的支給要領确认**\n\n**本文并未决定到「该向谁咨询」为止。** 职业提升计划的制作与提出、正社员转换制度的规定拟订、对象劳动者的要件确认、支给申请，是社会保险劳务士的业务。设备投资等的补助金请洽四葉行政書士事務所（**是各自独立的事业体，请另行签约**），助成金收入在税务上的处理请洽税理士，我们会为您介绍，由您各自直接委任。本事务所不收取介绍费。向四葉社会保険労務士事務所咨询时的费用整理于[报酬额表](/zh/labor/ryokin)，常被询问的问题整理于[常见问答](/zh/labor/faq)。\n\n本文为一般性的信息提供。因应个别情事的判断，由具备资格者在面谈后进行。撰文者为[浦松丈二](/zh/about/uramatsu)（社会保险劳务士・行政书士・宅地建物取引士）。",
        "category": "助成金",
        "keywords": [
          "职业提升助成金 有期 无期 差异",
          "正社员化课程 金额",
          "职业提升计划 提出期限",
          "兼职 正社员 助成金",
          "重点支援对象者 职业提升助成金",
          "助成金 家人 3亲等以内亲属"
        ],
        "tags": [
          "助成金",
          "职业提升助成金",
          "正社员化",
          "有期契约",
          "无期转换"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社会保险劳务士・行政书士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "我们已经改成无期契约了，可以改回有期吗？",
            "answer": "把无期契约改回有期契约，属于劳动条件的不利益变更。即使取得本人同意，被看成是为了领助成金而改回去的形式并不妥当。既然已经是无期，就以「从无期的转换」来申请比较自然。 金额虽然会下降，但比起提出不符合要件的申请更为确实。"
          },
          {
            "question": "我们预定下周转换，现在还能提出计划吗？",
            "answer": "只要在转换日的前一日（前一日若为假日则为假日的次日）之前送达管辖劳动局长，形式上是来得及的。但计划书若有缺漏就不会被受理，实际上行程相当吃紧。把转换日往后延，有时反而更为确实。 包含行程重组在内，欢迎与我们讨论。"
          },
          {
            "question": "金额就照本文所写的确定了吗？",
            "answer": "不是。本文的金额是依令和8年（2026年）4月8日付的支給要領・宣导单而来。厚生劳动省表示「因制度检讨等而随时进行支给申请样式的改定。支给申请样式与支给金额，会依进行各课程作为之日而变化」，实际上令和8年度也出现了4月1日版与4月8日版两种。申请时，请务必以厚生劳动省最新的支給要領确认。"
          },
          {
            "question": "可以只委托助成金的申请吗？",
            "answer": "助成金的申请，需要就业规则、工资帐册、出勤簿等文件彼此一致。若与日常的劳务管理切开、只承接申请，很可能在没察觉文件不一致的状态下就提出。四葉是以顾问契约为前提承接。 费用的思考方式请参阅报酬额表。"
          }
        ]
      }
    }
  },
  {
    "business": "labor",
    "slug": "freee-jinji-kaikei-ai",
    "title": "freee人事労務とfreee会計のAI連携は、どこまで進んでいるのか",
    "date": "2026-09-01",
    "category": "労務のしくみ",
    "excerpt": "freeeは会計・人事労務など5領域でAPIを公開し、2026年3月にはAIエージェントから直接操作できる「freee-mcp」をOSSとして公開しました。人事労務ではAI年末調整アシストとAI勤怠チェッカーが先行しています。公式発表をもとに、何が自動になり、何が判断として残るのかを整理します。",
    "content": "**結論（先に要点）**：freeeは会計・人事労務・請求書・工数管理・販売の5領域でAPIを公開しており、2026年3月には**AIエージェントからそれらを直接操作できる「freee-mcp」をOSSとして公開**しました。人事労務の側では**AI年末調整アシスト**と**AI勤怠チェッカー**が先行しています。給与計算の結果が仕訳として会計へ流れる連携は以前からあり、そこにAIが乗る形です。ただし**判断まで自動化されるわけではありません。**\n\n「freeeのAIで、労務も経理も自動になるのか」と聞かれることが増えました。公式の発表を読むかぎり、**進んでいるのは事実**です。ただ何がどこまでできて、何が残るのかは、発表を分けて見たほうが正確です。\n\n## そもそも、人事労務と会計はどうつながっているのか？\n\nAIの話の前に、土台のほうから。\n\nfreee人事労務で給与計算をすると、月々の給与、社会保険料、所得税・住民税の控除額が計算されます。**その結果を「給与仕訳」としてfreee会計へ自動で流せる**——これが人事労務と会計の連携の中心です。手で入力し直す作業と、そこで起きる転記ミスが消えます。\n\n**AIが加わるのは、この土台の上です。** 土台がないところにAIだけ乗せても、効果は限られます。\n\n## freeeはAIをどう位置づけているのか？\n\n2025年5月14日、freeeは**AIコンセプト**を発表しました。掲げているのは「**統合flow**」×「**AI**」です。\n\n「統合flow」はWork flow・Communication flow・Data flowの3つから成る、freeeの設計思想の総称です。そこにAIを掛け合わせる、という組み立てになっています。同じ発表で、AIエージェント「**freee AI（β版）**」の申込受付も始まりました。\n\n**バックオフィスの効率化にとどまらず「経営のパートナーに進化する」**——というのが、freeeが自ら書いている位置づけです。\n\n## 人事労務の側では、何が動いているのか？\n\n同じ2025年5月14日の発表で、クローズドβ版として案内されたもののうち、**人事労務に直接かかわるのは2つ**です。\n\n| 機能 | 何をするか |\n|---|---|\n| **AI年末調整アシスト** | 従業員が書類をカメラで撮るだけで、年末調整の記入をアシスト。生命保険料控除なら契約者・保険種類・区分・金額を自動入力。**年度違いなどのエラー検知**も備える |\n| **AI勤怠チェッカー** | AIに勤怠チェックを指示すると、**不備のある従業員をリストアップ**し、修正・催促の連絡まで自動で行う。催促メッセージを複数パターン提案し、指定すると送信する |\n\n**AI年末調整アシストは2025年分の年末調整から提供開始**とされています。\n\nこの2つは、実務の感覚に合っています。**年末調整の不備と、勤怠締めの催促**は、どちらも「人が何度も同じことを確認する」種類の作業だからです。\n\n## 2026年に何が変わったのか？\n\n**2026年3月2日、freeeは「freee-mcp」をOSSとして公開しました。** ここが大きい変化です。\n\nMCP（Model Context Protocol）は、AIアシスタントと外部ツールをつなぐためのオープンな規格です。「freee-mcp」は、freeeが2018年から提供してきたPublic APIをもとに、**会計・人事労務・請求書・工数管理・販売の約270本のAPIをMCPツール化**したものです。\n\nfreeeの発表には、こうあります。\n\n> チャット上で「請求書を作って」と依頼するだけで、取引先登録から請求書発行まで一連の操作を正確に完了できます。\n\nClaude Desktop・Claude Code・Claude Cowork・Cursorなど、主要なAIツールから利用できるとされています。\n\n**つまり「freeeの画面を人が操作する」から「AIに頼むとfreeeが動く」へ、入口が変わりつつある**ということです。freeeの共同創業者でCAIOの横路隆氏は、記者発表でこう述べたと発表文に記されています。\n\n> SaaSは人が使うものではなく、AIから使われるものになってきた\n\n## それで、労務の仕事はなくなるのか？\n\n**作業は軽くなります。判断は残ります。**\n\n年末調整の入力も、勤怠の催促も、請求書の発行も、**手順が決まっている作業**です。決まっているから自動化できます。\n\n一方で、労務には手順が決まっていないものがあります。\n\n- 業務委託でお願いしている方が、**労働者にあたるのかどうか**\n- パートを**社会保険に入れるべきかどうか**（週の所定労働時間をどう設計するか）\n- 助成金の**要件を満たしているかどうか**\n- 就業規則を、**この会社の実態に合わせてどう書くか**\n\n**これらは、正解が事実の側にあるのではなく、事実をどう評価するかの問題です。** AIは資料を整理し、論点を並べるところまでは助けになりますが、**評価そのものは資格者が行います。**\n\nそして、間違えたときに責任を負うのも資格者です。**AIで安くなるのは作業であって、責任ではありません。**\n\n## 会社として、どう構えればいいのか？\n\n順序があります。\n\n**1. まず土台をつくる。** 人事労務と会計を連携させ、給与仕訳が自動で流れる状態にする。ここができていないと、AIを足しても効きません。\n\n**2. 決まった作業から任せる。** 年末調整の入力補助、勤怠の不備チェック。**間違えても取り返しがつく範囲**から始めるのが安全です。\n\n**3. 判断が要るところは、人が見る。** 労働者性、社会保険の加入、助成金の要件、規程の設計。ここを自動化しようとすると、**あとから遡って直すほうが高くつきます。**\n\n## よくある質問\n\n**Q. freee-mcp は誰でも使えますか？**\nA. npmパッケージとして公開されており、GitHubとNPMから誰でもインストールできるとされています。ただし**基幹業務を操作するもの**なので、権限の設定と、誰が何をしたかの記録は、導入前に決めておくべきです。\n\n**Q. 顧問先のデータをAIに渡すことになりませんか？**\nA. その点は、事業者ごとに方針を決める必要があります。**当事務所は、顧問先の個人情報を生成AIに入力しない運用にしています。**社会保険労務士には秘密を守る義務があります（社会保険労務士法第21条）。AIは調べものと下書きに使い、判断と最終確認は社会保険労務士が行います。\n\n**Q. AIを入れれば、社労士に頼まなくてよくなりますか？**\nA. 手続きの**作業**は軽くなります。ただし、報酬を得て労働社会保険の申請書等を作成・提出代行することは、社会保険労務士でなければできません（社会保険労務士法第27条）。AIが代わりに資格者になるわけではありません。\n\n**Q. まだ様子を見たほうがいいですか？**\nA. **土台の連携（給与仕訳の自動化）は、いま整えて損はありません。**AIの機能はこれからも増えますが、データが整っていない会社には効きません。順序としては、連携が先です。\n\n## この記事の根拠\n\n- freee株式会社「**freeeのAIコンセプトを発表 「統合flow」×「AI」でスモールビジネスの経営と組織を進化**」（2025年5月14日）\n  https://corp.freee.co.jp/news/20250514freee_ai.html\n  ——AI年末調整アシスト（2025年分の年末調整より提供開始）、AI勤怠チェッカー、freee AI（β版）の記載はこの発表による\n- freee株式会社「**freee、AIエージェントからfreeeの基幹業務を操作可能にするMCPサーバー「freee-mcp」をOSSとして公開**」（2026年3月2日）\n  https://corp.freee.co.jp/news/20260302freee_mcp.html\n  ——約270本のAPI、5領域（会計・人事労務・請求書・工数管理・販売）、対応AIツール、横路隆CAIOの発言はこの発表による\n- 社会保険労務士法（昭和43年法律第89号）**第21条**（秘密を守る義務）・**第27条**（業務の制限）\n\n**機能の提供状況・名称・提供時期は変わります。導入をご検討の際は、freeeの公式サイトで最新の情報をご確認ください。**本記事は2026年8月時点の公表資料に基づいています。\n\n当事務所が手続きと給与計算をどう進めるかは[ご相談から契約までの流れ](/labor/nagare)に、料金は[報酬額表](/labor/ryokin)に書いています。給与計算の値付けについては[給与計算を社会保険労務士に頼むと、いくらかかるのか](/labor/column/kyuyo-keisan-soba-sharoushi)をご覧ください。\n\n本記事は一般的な情報提供です。個別のご事情に応じた判断は、面談のうえ資格者が行います。執筆は[浦松丈二](/about/uramatsu)（社会保険労務士・行政書士・宅地建物取引士）です。",
    "status": "published",
    "author": {
      "name": "浦松 丈二",
      "title": "社会保険労務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
    },
    "keywords": [
      "freee人事労務 freee会計 連携",
      "freee AI 年末調整",
      "freee AI 勤怠チェッカー",
      "freee-mcp",
      "給与仕訳 自動化 freee",
      "社労士 AI 自動化 どこまで"
    ],
    "tags": [
      "freee",
      "AI",
      "給与計算",
      "年末調整",
      "勤怠管理",
      "バックオフィス"
    ],
    "locales": [],
    "faq": [
      {
        "question": "freee-mcp は誰でも使えますか？",
        "answer": "npmパッケージとして公開されており、GitHubとNPMから誰でもインストールできるとされています。ただし基幹業務を操作するものなので、権限の設定と、誰が何をしたかの記録は、導入前に決めておくべきです。"
      },
      {
        "question": "顧問先のデータをAIに渡すことになりませんか？",
        "answer": "その点は、事業者ごとに方針を決める必要があります。当事務所は、顧問先の個人情報を生成AIに入力しない運用にしています。社会保険労務士には秘密を守る義務があります（社会保険労務士法第21条）。AIは調べものと下書きに使い、判断と最終確認は社会保険労務士が行います。"
      },
      {
        "question": "AIを入れれば、社労士に頼まなくてよくなりますか？",
        "answer": "手続きの作業は軽くなります。ただし、報酬を得て労働社会保険の申請書等を作成・提出代行することは、社会保険労務士でなければできません（社会保険労務士法第27条）。AIが代わりに資格者になるわけではありません。"
      },
      {
        "question": "まだ様子を見たほうがいいですか？",
        "answer": "土台の連携（給与仕訳の自動化）は、いま整えて損はありません。AIの機能はこれからも増えますが、データが整っていない会社には効きません。順序としては、連携が先です。"
      }
    ],
    "translations": {
      "en": {
        "title": "How far has the AI integration between freee HR and freee Accounting actually come?",
        "excerpt": "freee publishes APIs across five areas including accounting and HR, and in March 2026 it released freee-mcp as open-source software, letting AI agents operate those APIs directly. On the HR side, AI Year-End Adjustment Assist and the AI Attendance Checker came first. Working from the official announcements, we set out what becomes automatic and what remains a matter of judgement.",
        "content": "**In short:** freee publishes APIs across five areas — accounting, HR (人事労務), invoicing, project time tracking and sales — and in March 2026 it released **freee-mcp** as open-source software, so that AI agents can operate them directly. On the HR side, **AI Year-End Adjustment Assist** and the **AI Attendance Checker** came first. The link that carries payroll results into accounting as journal entries has existed for some time; AI is being layered on top of it. **What is not automated is judgement.**\n\nWe are asked more and more often whether freee's AI will make both labour administration and bookkeeping run by themselves. Reading the official announcements, **real progress is being made.** But it is more accurate to look at the announcements separately, and to be clear about what each one covers.\n\n## How are HR and accounting connected in the first place?\n\nBefore the AI, the foundation.\n\nWhen you run payroll in freee HR, monthly salary, social insurance contributions and income tax and resident tax withholdings are calculated. **Those results can then flow automatically into freee Accounting as \"payroll journal entries.\"** That is the heart of the integration. It removes the re-keying, and the transcription errors that come with it.\n\n**AI sits on top of that foundation.** Adding AI where the foundation is missing achieves little.\n\n## How does freee position AI?\n\nOn 14 May 2025 freee announced its **AI concept**. What it sets out is \"**integrated flow**\" × \"**AI**.\"\n\n\"Integrated flow\" is freee's umbrella term for its design philosophy, made up of Work flow, Communication flow and Data flow. AI is to be multiplied into that. The same announcement opened applications for the AI agent **freee AI (beta)**.\n\nfreee's own wording is that it will go beyond making back-office work more efficient and \"**evolve into a partner in management.**\"\n\n## What is moving on the HR side?\n\nIn the same announcement of 14 May 2025, two of the functions offered as a closed beta bear directly on HR.\n\n| Function | What it does |\n|---|---|\n| **AI Year-End Adjustment Assist** | An employee photographs the paperwork and the entry for the year-end adjustment is assisted. For life insurance premium deductions, the policyholder, type of policy, category and amount are filled in automatically. It also **detects errors** such as documents from the wrong year |\n| **AI Attendance Checker** | Instruct the AI to check attendance and it **lists the employees whose records are incomplete**, then handles the correction and chasing messages. It proposes several patterns of chasing message and sends the one you choose |\n\n**AI Year-End Adjustment Assist is stated as being provided from the 2025 year-end adjustment onwards.**\n\nThese two match what the work actually feels like. **Year-end adjustment errors and chasing people at attendance close** are both the kind of task where a person checks the same thing over and over.\n\n## What changed in 2026?\n\n**On 2 March 2026, freee released \"freee-mcp\" as open-source software.** This is the larger shift.\n\nMCP (Model Context Protocol) is an open protocol for connecting AI assistants to external tools. \"freee-mcp\" turns roughly **270 of the Public APIs** freee has offered since 2018 — across accounting, HR, invoicing, project time tracking and sales — into MCP tools.\n\nfreee's announcement puts it this way:\n\n> Simply asking, in a chat, \"create an invoice,\" completes the whole sequence accurately, from registering the counterparty through to issuing the invoice.\n\nIt is stated as usable from the main AI tools, including Claude Desktop, Claude Code, Claude Cowork and Cursor.\n\n**In other words, the entrance is shifting from \"a person operates the freee screen\" to \"you ask the AI and freee moves.\"** Takashi Yokoji, freee's co-founder and CAIO, is quoted in the announcement as having said at a press briefing:\n\n> SaaS has become something used by AI, not something used by people.\n\n## So does labour administration stop being a job?\n\n**The work gets lighter. The judgement stays.**\n\nEntering the year-end adjustment, chasing attendance, issuing invoices — these are **tasks with a settled procedure**. Because the procedure is settled, it can be automated.\n\nLabour administration also contains things where no procedure is settled.\n\n- Whether the person you engage under a service contract **is in fact a worker**\n- Whether a part-timer **ought to be enrolled in social insurance** (and how to design the contracted hours)\n- Whether the **requirements for a subsidy** are met\n- **How to write** work rules that fit this particular company\n\n**In each of these the answer does not sit in the facts; it lies in how the facts are assessed.** AI helps as far as organising the material and laying out the issues, but **the assessment itself is made by a qualified professional.**\n\nAnd when something goes wrong, it is the qualified professional who answers for it. **What AI makes cheaper is the work, not the responsibility.**\n\n## How should a company approach this?\n\nThere is an order to it.\n\n**1. Build the foundation first.** Connect HR and accounting so that payroll journal entries flow automatically. Without this, adding AI will not help.\n\n**2. Hand over the settled tasks.** Assisted entry for the year-end adjustment; checking attendance records. It is safer to begin where **a mistake can still be undone**.\n\n**3. Keep a person on anything that calls for judgement.** Worker status, enrolment in social insurance, subsidy requirements, the design of internal rules. Trying to automate this is where **putting it right afterwards costs more**.\n\n## Frequently asked questions\n\n**Q. Can anyone use freee-mcp?**\nA. It is published as an npm package and stated to be installable by anyone from GitHub and NPM. But it **operates core business systems**, so permissions, and a record of who did what, should be settled before you introduce it.\n\n**Q. Doesn't this mean handing client data to an AI?**\nA. That is a matter each business has to decide for itself. **This office does not enter clients' personal data into generative AI.** A Certified Social Insurance and Labour Consultant is under a duty of confidentiality (Article 21 of the Certified Social Insurance and Labour Consultant Act). We use AI for research and drafting; the judgement and the final check are made by the consultant.\n\n**Q. If we bring in AI, will we no longer need a labour consultant?**\nA. The **work** of the procedures gets lighter. But preparing and filing applications under labour and social insurance legislation for a fee may only be done by a Certified Social Insurance and Labour Consultant (Article 27 of the same Act). AI does not become the qualified professional in their place.\n\n**Q. Should we wait and see?**\nA. **There is nothing to lose by putting the foundation — automatic payroll journal entries — in place now.** More AI functions will come, but they do not help a company whose data is not in order. The integration comes first.\n\n## Sources for this article\n\n- freee K.K., \"freeeのAIコンセプトを発表 「統合flow」×「AI」でスモールビジネスの経営と組織を進化\" (14 May 2025)\n  https://corp.freee.co.jp/news/20250514freee_ai.html\n  — AI Year-End Adjustment Assist (from the 2025 year-end adjustment), the AI Attendance Checker and freee AI (beta) are taken from this announcement\n- freee K.K., \"freee、AIエージェントからfreeeの基幹業務を操作可能にするMCPサーバー「freee-mcp」をOSSとして公開\" (2 March 2026)\n  https://corp.freee.co.jp/news/20260302freee_mcp.html\n  — the roughly 270 APIs, the five areas, the AI tools supported and the remark by CAIO Takashi Yokoji are taken from this announcement\n- Certified Social Insurance and Labour Consultant Act (Act No. 89 of 1968), **Article 21** (duty of confidentiality) and **Article 27** (restriction on business)\n\n**Function names, availability and timing change. Please check freee's official site for the current position before deciding to adopt anything.** This article reflects material published as at August 2026.\n\nHow this office handles procedures and payroll is set out in [From consultation to engagement](/en/labor/nagare), and the fees in the [fee schedule](/en/labor/ryokin). On how payroll is priced, see [What does it cost to have a labour consultant run your payroll?](/en/labor/column/kyuyo-keisan-soba-sharoushi).\n\nThis article is general information. Any assessment of your particular circumstances is made by a qualified professional after a meeting. Written by [Joji Uramatsu](/en/about/uramatsu).",
        "category": "How labour administration works",
        "keywords": [
          "freee HR freee Accounting integration",
          "freee AI year-end adjustment",
          "freee AI attendance checker",
          "freee-mcp",
          "payroll journal entry automation freee",
          "how far can AI automate labour administration"
        ],
        "tags": [
          "freee",
          "AI",
          "payroll",
          "year-end adjustment",
          "attendance management",
          "back office"
        ],
        "author": {
          "name": "Joji Uramatsu",
          "title": "Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist — 四葉社会保険労務士事務所／四葉行政書士事務所"
        },
        "faq": [
          {
            "question": "Can anyone use freee-mcp?",
            "answer": "It is published as an npm package and stated to be installable by anyone from GitHub and NPM. But it operates core business systems, so permissions, and a record of who did what, should be settled before you introduce it."
          },
          {
            "question": "Doesn't this mean handing client data to an AI?",
            "answer": "That is a matter each business has to decide for itself. This office does not enter clients' personal data into generative AI. A Certified Social Insurance and Labour Consultant is under a duty of confidentiality (Article 21 of the Certified Social Insurance and Labour Consultant Act). We use AI for research and drafting; the judgement and the final check are made by the consultant."
          },
          {
            "question": "If we bring in AI, will we no longer need a labour consultant?",
            "answer": "The work of the procedures gets lighter. But preparing and filing applications under labour and social insurance legislation for a fee may only be done by a Certified Social Insurance and Labour Consultant (Article 27 of the same Act). AI does not become the qualified professional in their place."
          },
          {
            "question": "Should we wait and see?",
            "answer": "There is nothing to lose by putting the foundation — automatic payroll journal entries — in place now. More AI functions will come, but they do not help a company whose data is not in order. The integration comes first."
          }
        ]
      },
      "zh-tw": {
        "title": "freee人事労務與freee会計的AI整合，究竟進展到什麼程度",
        "excerpt": "freee在會計、人事勞務等5個領域公開API，並於2026年3月將可讓AI代理直接操作的「freee-mcp」以OSS形式公開。人事勞務方面，AI年終調整輔助與AI出勤檢查器先行推出。本文依據官方發表，整理哪些會自動化、哪些仍是判斷的範疇。",
        "content": "**結論（先講重點）**：freee在會計、人事勞務、請款單、工時管理、銷售等5個領域公開API，並於2026年3月將**可讓AI代理直接操作的「freee-mcp」以OSS形式公開**。人事勞務方面，**AI年終調整輔助**與**AI出勤檢查器**先行推出。薪資計算的結果以分錄形式流入會計的整合，在此之前就已存在，AI是疊加在上面。**不過，判斷並不會被自動化。**\n\n「用freee的AI，勞務和會計都能自動化嗎」——這樣的詢問變多了。就官方發表來看，**進展是事實**。但哪些做得到、哪些做不到，分開來看才準確。\n\n## 人事勞務與會計，原本是如何連結的？\n\n在談AI之前，先談基礎。\n\n在freee人事労務進行薪資計算後，會算出每月薪資、社會保險費、所得稅與住民稅的扣繳額。**能將這個結果以「薪資分錄」的形式自動流入freee会計**——這是人事勞務與會計整合的核心。重新輸入的作業，以及由此產生的轉記錯誤，都會消失。\n\n**AI是加在這個基礎之上的。** 在沒有基礎的地方只放AI，效果有限。\n\n## freee如何定位AI？\n\n2025年5月14日，freee發表了**AI概念**。標舉的是「**統合flow**」×「**AI**」。\n\n「統合flow」由Work flow、Communication flow、Data flow三者構成，是freee設計思想的總稱。在其中乘上AI，就是這個組合。同一場發表也開始受理AI代理「**freee AI（β版）**」的申請。\n\n**不僅止於後勤作業的效率化，而是「進化為經營的夥伴」**——這是freee自己寫下的定位。\n\n## 人事勞務方面，有哪些正在推動？\n\n在同一場2025年5月14日的發表中，以封閉β版介紹的功能裡，**與人事勞務直接相關的有2項**。\n\n| 功能 | 做什麼 |\n|---|---|\n| **AI年終調整輔助** | 員工只要用相機拍攝文件，就能輔助年終調整的填寫。以人壽保險費扣除為例，會自動輸入投保人、保險種類、區分、金額。也具備**年度錯誤等的錯誤偵測**功能 |\n| **AI出勤檢查器** | 向AI下達出勤檢查的指示，就會**列出出勤紀錄有缺漏的員工**，並自動進行修正與催促的聯繫。會提出多種催促訊息的版本，指定後即發送 |\n\n**AI年終調整輔助記載為自2025年分的年終調整起提供。**\n\n這2項符合實務的感受。**年終調整的缺漏，與出勤結算的催促**，都屬於「同一件事要由人反覆確認」的作業。\n\n## 2026年有什麼改變？\n\n**2026年3月2日，freee將「freee-mcp」以OSS形式公開。** 這是較大的變化。\n\nMCP（Model Context Protocol）是連接AI助理與外部工具的開放規格。「freee-mcp」以freee自2018年起提供的Public API為基礎，將**會計、人事勞務、請款單、工時管理、銷售等約270支API**轉為MCP工具。\n\nfreee的發表中如此記載：\n\n> 只要在聊天上請求「製作請款單」，就能從交易對象登錄到請款單發行，正確完成一連串的操作。\n\n並記載可從Claude Desktop、Claude Code、Claude Cowork、Cursor等主要AI工具使用。\n\n**也就是說，入口正從「由人操作freee的畫面」轉為「向AI提出請求，freee就會動作」。** freee共同創辦人兼CAIO橫路隆在記者發表中的發言，發表文中如此記載：\n\n> SaaS已經不是給人使用的東西，而是被AI使用的東西。\n\n## 那麼，勞務的工作會消失嗎？\n\n**作業會變輕。判斷會留下。**\n\n年終調整的輸入、出勤的催促、請款單的發行，都是**步驟已定的作業**。因為已定，所以能自動化。\n\n另一方面，勞務中有些事情，步驟並未確定。\n\n- 以業務委託方式請託的人，**是否屬於勞工**\n- 兼職人員**是否應加入社會保險**（週約定工時要如何設計）\n- 是否**符合補助金的要件**\n- 工作規則要**如何配合這家公司的實態來撰寫**\n\n**這些的答案不在事實那一側，而在於如何評價事實。** AI在整理資料、列出爭點的範圍內有幫助，但**評價本身由有資格者進行。**\n\n而且，出錯時承擔責任的也是有資格者。**AI讓變便宜的是作業，不是責任。**\n\n## 公司該如何因應？\n\n是有順序的。\n\n**1. 先建立基礎。** 讓人事勞務與會計整合，使薪資分錄能自動流動。這裡沒做好，加上AI也不會有效。\n\n**2. 從已定的作業開始交付。** 年終調整的輸入輔助、出勤缺漏的檢查。從**即使出錯也還來得及挽回的範圍**開始比較安全。\n\n**3. 需要判斷的地方，由人來看。** 勞工性、社會保險的加入、補助金的要件、規程的設計。若想把這裡也自動化，**事後回頭修正的代價更高。**\n\n## 常見問題\n\n**Q. freee-mcp 任何人都能使用嗎？**\nA. 記載為以npm套件形式公開，任何人都能從GitHub與NPM安裝。不過因為是**操作核心業務**的東西，權限的設定，以及誰做了什麼的紀錄，應在導入前先行決定。\n\n**Q. 這是否等於把顧問客戶的資料交給AI？**\nA. 這一點需要各事業體自行決定方針。**本事務所採取不將顧問客戶的個人資料輸入生成式AI的做法。** 社會保險勞務士負有保密義務（社會保險勞務士法第21條）。AI用於查找與草稿，判斷與最終確認由社會保險勞務士進行。\n\n**Q. 導入AI之後，是不是就不需要委託社會保險勞務士了？**\nA. 手續的**作業**會變輕。但是，收取報酬製作勞動社會保險相關的申請書等並代為提出，非社會保險勞務士不得為之（同法第27條）。AI並不會代替成為有資格者。\n\n**Q. 是不是再觀望一下比較好？**\nA. **基礎的整合（薪資分錄的自動化），現在著手並無損失。** AI的功能今後還會增加，但對資料未整理好的公司並不會有效。就順序而言，整合在先。\n\n## 本文的依據\n\n- freee株式会社「freeeのAIコンセプトを発表 「統合flow」×「AI」でスモールビジネスの経営と組織を進化」（2025年5月14日）\n  https://corp.freee.co.jp/news/20250514freee_ai.html\n  ——AI年終調整輔助（自2025年分的年終調整起提供）、AI出勤檢查器、freee AI（β版）的記載依據此發表\n- freee株式会社「freee、AIエージェントからfreeeの基幹業務を操作可能にするMCPサーバー「freee-mcp」をOSSとして公開」（2026年3月2日）\n  https://corp.freee.co.jp/news/20260302freee_mcp.html\n  ——約270支API、5個領域、支援的AI工具、橫路隆CAIO的發言依據此發表\n- 社會保險勞務士法（昭和43年法律第89號）**第21條**（保密義務）・**第27條**（業務的限制）\n\n**功能的提供狀況、名稱、提供時期都會變動。考慮導入時，請至freee官方網站確認最新資訊。** 本文依據2026年8月時點的公開資料。\n\n本事務所如何進行手續與薪資計算，寫在[從諮詢到簽約的流程](/zh-tw/labor/nagare)；費用寫在[報酬額表](/zh-tw/labor/ryokin)。關於薪資計算的定價，請見[委託社會保險勞務士做薪資計算，要花多少錢](/zh-tw/labor/column/kyuyo-keisan-soba-sharoushi)。\n\n本文為一般性的資訊提供。針對個別情況的判斷，將於面談後由有資格者進行。撰文為[浦松丈二](/zh-tw/about/uramatsu)（社會保險勞務士・行政書士・宅地建物取引士）。",
        "category": "勞務的機制",
        "keywords": [
          "freee人事労務 freee会計 整合",
          "freee AI 年終調整",
          "freee AI 出勤檢查",
          "freee-mcp",
          "薪資分錄 自動化 freee",
          "社會保險勞務士 AI 自動化 到什麼程度"
        ],
        "tags": [
          "freee",
          "AI",
          "薪資計算",
          "年終調整",
          "出勤管理",
          "後勤作業"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社會保險勞務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "freee-mcp 任何人都能使用嗎？",
            "answer": "記載為以npm套件形式公開，任何人都能從GitHub與NPM安裝。不過因為是操作核心業務的東西，權限的設定，以及誰做了什麼的紀錄，應在導入前先行決定。"
          },
          {
            "question": "這是否等於把顧問客戶的資料交給AI？",
            "answer": "這一點需要各事業體自行決定方針。本事務所採取不將顧問客戶的個人資料輸入生成式AI的做法。 社會保險勞務士負有保密義務（社會保險勞務士法第21條）。AI用於查找與草稿，判斷與最終確認由社會保險勞務士進行。"
          },
          {
            "question": "導入AI之後，是不是就不需要委託社會保險勞務士了？",
            "answer": "手續的作業會變輕。但是，收取報酬製作勞動社會保險相關的申請書等並代為提出，非社會保險勞務士不得為之（同法第27條）。AI並不會代替成為有資格者。"
          },
          {
            "question": "是不是再觀望一下比較好？",
            "answer": "基礎的整合（薪資分錄的自動化），現在著手並無損失。 AI的功能今後還會增加，但對資料未整理好的公司並不會有效。就順序而言，整合在先。"
          }
        ]
      },
      "zh": {
        "title": "freee人事労務与freee会計的AI整合，究竟进展到什么程度",
        "excerpt": "freee在会计、人事劳务等5个领域公开API，并于2026年3月将可让AI代理直接操作的「freee-mcp」以OSS形式公开。人事劳务方面，AI年终调整辅助与AI考勤检查器先行推出。本文依据官方发表，整理哪些会自动化、哪些仍属判断的范畴。",
        "content": "**结论（先讲重点）**：freee在会计、人事劳务、请款单、工时管理、销售等5个领域公开API，并于2026年3月将**可让AI代理直接操作的「freee-mcp」以OSS形式公开**。人事劳务方面，**AI年终调整辅助**与**AI考勤检查器**先行推出。工资计算的结果以分录形式流入会计的整合，在此之前就已存在，AI是叠加在上面。**不过，判断并不会被自动化。**\n\n「用freee的AI，劳务和会计都能自动化吗」——这样的询问变多了。就官方发表来看，**进展是事实**。但哪些做得到、哪些做不到，分开来看才准确。\n\n## 人事劳务与会计，原本是如何连结的？\n\n在谈AI之前，先谈基础。\n\n在freee人事労務进行工资计算后，会算出每月工资、社会保险费、所得税与住民税的扣缴额。**能将这个结果以「工资分录」的形式自动流入freee会計**——这是人事劳务与会计整合的核心。重新输入的作业，以及由此产生的转记错误，都会消失。\n\n**AI是加在这个基础之上的。** 在没有基础的地方只放AI，效果有限。\n\n## freee如何定位AI？\n\n2025年5月14日，freee发表了**AI概念**。标举的是「**统合flow**」×「**AI**」。\n\n「统合flow」由Work flow、Communication flow、Data flow三者构成，是freee设计思想的总称。在其中乘上AI，就是这个组合。同一场发表也开始受理AI代理「**freee AI（β版）**」的申请。\n\n**不仅止于后勤作业的效率化，而是「进化为经营的伙伴」**——这是freee自己写下的定位。\n\n## 人事劳务方面，有哪些正在推动？\n\n在同一场2025年5月14日的发表中，以封闭β版介绍的功能里，**与人事劳务直接相关的有2项**。\n\n| 功能 | 做什么 |\n|---|---|\n| **AI年终调整辅助** | 员工只要用相机拍摄文件，就能辅助年终调整的填写。以人寿保险费扣除为例，会自动输入投保人、保险种类、区分、金额。也具备**年度错误等的错误侦测**功能 |\n| **AI考勤检查器** | 向AI下达考勤检查的指示，就会**列出考勤记录有缺漏的员工**，并自动进行修正与催促的联系。会提出多种催促信息的版本，指定后即发送 |\n\n**AI年终调整辅助记载为自2025年分的年终调整起提供。**\n\n这2项符合实务的感受。**年终调整的缺漏，与考勤结算的催促**，都属于「同一件事要由人反复确认」的作业。\n\n## 2026年有什么改变？\n\n**2026年3月2日，freee将「freee-mcp」以OSS形式公开。** 这是较大的变化。\n\nMCP（Model Context Protocol）是连接AI助理与外部工具的开放规格。「freee-mcp」以freee自2018年起提供的Public API为基础，将**会计、人事劳务、请款单、工时管理、销售等约270支API**转为MCP工具。\n\nfreee的发表中如此记载：\n\n> 只要在聊天上请求「制作请款单」，就能从交易对象登录到请款单发行，正确完成一连串的操作。\n\n并记载可从Claude Desktop、Claude Code、Claude Cowork、Cursor等主要AI工具使用。\n\n**也就是说，入口正从「由人操作freee的画面」转为「向AI提出请求，freee就会动作」。** freee共同创办人兼CAIO横路隆在记者发表中的发言，发表文中如此记载：\n\n> SaaS已经不是给人使用的东西，而是被AI使用的东西。\n\n## 那么，劳务的工作会消失吗？\n\n**作业会变轻。判断会留下。**\n\n年终调整的输入、考勤的催促、请款单的发行，都是**步骤已定的作业**。因为已定，所以能自动化。\n\n另一方面，劳务中有些事情，步骤并未确定。\n\n- 以业务委托方式请托的人，**是否属于劳动者**\n- 兼职人员**是否应加入社会保险**（周约定工时要如何设计）\n- 是否**符合补助金的要件**\n- 工作规则要**如何配合这家公司的实态来撰写**\n\n**这些的答案不在事实那一侧，而在于如何评价事实。** AI在整理资料、列出争点的范围内有帮助，但**评价本身由有资格者进行。**\n\n而且，出错时承担责任的也是有资格者。**AI让变便宜的是作业，不是责任。**\n\n## 公司该如何因应？\n\n是有顺序的。\n\n**1. 先建立基础。** 让人事劳务与会计整合，使工资分录能自动流动。这里没做好，加上AI也不会有效。\n\n**2. 从已定的作业开始交付。** 年终调整的输入辅助、考勤缺漏的检查。从**即使出错也还来得及挽回的范围**开始比较安全。\n\n**3. 需要判断的地方，由人来看。** 劳动者性、社会保险的加入、补助金的要件、规程的设计。若想把这里也自动化，**事后回头修正的代价更高。**\n\n## 常见问题\n\n**Q. freee-mcp 任何人都能使用吗？**\nA. 记载为以npm套件形式公开，任何人都能从GitHub与NPM安装。不过因为是**操作核心业务**的东西，权限的设定，以及谁做了什么的记录，应在导入前先行决定。\n\n**Q. 这是否等于把顾问客户的资料交给AI？**\nA. 这一点需要各事业体自行决定方针。**本事务所采取不将顾问客户的个人资料输入生成式AI的做法。** 社会保险劳务士负有保密义务（社会保险劳务士法第21条）。AI用于查找与草稿，判断与最终确认由社会保险劳务士进行。\n\n**Q. 导入AI之后，是不是就不需要委托社会保险劳务士了？**\nA. 手续的**作业**会变轻。但是，收取报酬制作劳动社会保险相关的申请书等并代为提出，非社会保险劳务士不得为之（同法第27条）。AI并不会代替成为有资格者。\n\n**Q. 是不是再观望一下比较好？**\nA. **基础的整合（工资分录的自动化），现在着手并无损失。** AI的功能今后还会增加，但对资料未整理好的公司并不会有效。就顺序而言，整合在先。\n\n## 本文的依据\n\n- freee株式会社「freeeのAIコンセプトを発表 「統合flow」×「AI」でスモールビジネスの経営と組織を進化」（2025年5月14日）\n  https://corp.freee.co.jp/news/20250514freee_ai.html\n  ——AI年终调整辅助（自2025年分的年终调整起提供）、AI考勤检查器、freee AI（β版）的记载依据此发表\n- freee株式会社「freee、AIエージェントからfreeeの基幹業務を操作可能にするMCPサーバー「freee-mcp」をOSSとして公開」（2026年3月2日）\n  https://corp.freee.co.jp/news/20260302freee_mcp.html\n  ——约270支API、5个领域、支援的AI工具、横路隆CAIO的发言依据此发表\n- 社会保险劳务士法（昭和43年法律第89号）**第21条**（保密义务）・**第27条**（业务的限制）\n\n**功能的提供状况、名称、提供时期都会变动。考虑导入时，请至freee官方网站确认最新信息。** 本文依据2026年8月时点的公开资料。\n\n本事务所如何进行手续与工资计算，写在[从咨询到签约的流程](/zh/labor/nagare)；费用写在[报酬额表](/zh/labor/ryokin)。关于工资计算的定价，请见[委托社会保险劳务士做工资计算，要花多少钱](/zh/labor/column/kyuyo-keisan-soba-sharoushi)。\n\n本文为一般性的信息提供。针对个别情况的判断，将于面谈后由有资格者进行。撰文为[浦松丈二](/zh/about/uramatsu)（社会保险劳务士・行政书士・宅地建物取引士）。",
        "category": "劳务的机制",
        "keywords": [
          "freee人事労務 freee会計 整合",
          "freee AI 年终调整",
          "freee AI 考勤检查",
          "freee-mcp",
          "工资分录 自动化 freee",
          "社会保险劳务士 AI 自动化 到什么程度"
        ],
        "tags": [
          "freee",
          "AI",
          "工资计算",
          "年终调整",
          "考勤管理",
          "后勤作业"
        ],
        "author": {
          "name": "浦松 丈二",
          "title": "社会保险劳务士・行政书士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）"
        },
        "faq": [
          {
            "question": "freee-mcp 任何人都能使用吗？",
            "answer": "记载为以npm套件形式公开，任何人都能从GitHub与NPM安装。不过因为是操作核心业务的东西，权限的设定，以及谁做了什么的记录，应在导入前先行决定。"
          },
          {
            "question": "这是否等于把顾问客户的资料交给AI？",
            "answer": "这一点需要各事业体自行决定方针。本事务所采取不将顾问客户的个人资料输入生成式AI的做法。 社会保险劳务士负有保密义务（社会保险劳务士法第21条）。AI用于查找与草稿，判断与最终确认由社会保险劳务士进行。"
          },
          {
            "question": "导入AI之后，是不是就不需要委托社会保险劳务士了？",
            "answer": "手续的作业会变轻。但是，收取报酬制作劳动社会保险相关的申请书等并代为提出，非社会保险劳务士不得为之（同法第27条）。AI并不会代替成为有资格者。"
          },
          {
            "question": "是不是再观望一下比较好？",
            "answer": "基础的整合（工资分录的自动化），现在着手并无损失。 AI的功能今后还会增加，但对资料未整理好的公司并不会有效。就顺序而言，整合在先。"
          }
        ]
      }
    }
  }
];
