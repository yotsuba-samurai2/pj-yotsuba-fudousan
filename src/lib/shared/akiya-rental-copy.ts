import type { LangCode } from "@/config/languages";
import type { FaqItem } from "@/components/shared/Faq";

type RentalCopy = {
  title: string; h1: string; lead: string; contact: string; compare: string;
  ways: string; home: string; homeText: string; group: string; groupText: string; groupLink: string;
  flow: string; steps: [string, string, string]; table: string; item: string; columns: [string, string];
  rows: [string, string, string][]; note: string; finalTitle: string; finalText: string;
  tax: string; saleCaution: string; division: string; faq: FaqItem[];
};

export const AKIYA_TAX_SOURCE = "https://www.nta.go.jp/taxes/shiraberu/taxanswer/joto/3306.htm";
export const AKIYA_MLIT_SOURCE = "https://www.mlit.go.jp/jutakukentiku/house/akiya-taisaku/articles/2024020105.html";

export const AKIYA_RENTAL = {
  ja: {
    title: "文京区の空き家活用・売却｜片付け前の賃貸相談｜四葉不動産",
    h1: "文京区の空き家を、大きく直さず貸せるか。",
    lead: "相続した実家に家具や荷物が残っていても、片付けやリフォームを頼む前にご相談ください。四葉不動産が建物と設備の状態を確認し、今の状態に近い形で貸せるか、最低限どこを直す必要があるかを、想定賃料とあわせてお伝えします。",
    contact: "片付け前の空き家を相談する", compare: "売る・貸す・管理を比べる",
    ways: "空き家を貸す、2つの選択肢",
    home: "住まいとして貸す", homeText: "雨漏りや給排水など、安全や生活に関わる箇所は先に確認します。壁紙や塗装などは、貸主の事前承諾を得て借主が手を入れる方法もあります。残す家財、工事費の負担、退去時に戻す範囲は契約前に決めます。",
    group: "グループホームの運営法人に貸す", groupText: "条件が合えば、グループホーム（障害福祉の共同生活援助）を運営する法人への賃貸も選択肢です。貸主の用途・改修承諾、建築・消防の条件、事業者指定の見通しをそれぞれ確認します。",
    groupLink: "グループホーム向けに貸す大家さんへ",
    flow: "ご相談から貸し方の比較まで", steps: ["物件の町名と家財の状況をお知らせください。", "現地で建物・設備を確認し、必要な工事と残せる家財を整理します。", "費用と収支の見通しをA4一枚で比較します。"],
    table: "貸し方の比較表に載せる項目", item: "確認項目", columns: ["現状に近い形で貸す", "必要箇所だけ直して貸す"],
    rows: [
      ["初期費用", "安全・使用上必要な対応と家財の整理", "追加で直す設備・内装と見積り"],
      ["想定賃料", "現況と借主の工事負担を踏まえた目安", "工事後の状態と近隣事例を踏まえた目安"],
      ["年間収支", "空室と維持費を見込んだ試算", "空室と維持費を見込んだ試算"],
      ["募集開始の目安", "確認・是正が済む時期", "工事の工程と募集時期"],
    ],
    note: "貸す条件が合わなければ、売却や当面の管理も比較します。費用がかかる作業は、始める前に範囲と金額をお伝えします。",
    finalTitle: "片付けを始める前に、空き家の状態をお聞かせください。", finalText: "最初は町名と、家具や荷物が残っているかが分かれば大丈夫です。写真や登記資料は最初のご相談には不要です。",
    tax: "特定空家等や管理不全空家等について市区町村から勧告を受けると、その敷地が住宅用地特例の対象から外れ、土地の税負担が増える場合があります。",
    saleCaution: "相続空き家の売却特例には、相続後の所定の期間に貸し付けていないことが要件です。短期間でも貸し付けると、この要件を満たせません。売却もお考えなら、貸す前に税理士にご確認ください。",
    division: "遺産分割協議書などの書類作成は、四葉行政書士事務所が独立した事業体として別契約で受任します。登記申請の代理は司法書士へ、税務は税理士へ直接ご依頼ください。",
    faq: [
      { q: "家具や荷物が残っていても相談できますか？", a: "はい。片付けを始める前からご相談いただけます。誰が所有する家財かを確認し、撤去するもの、残すもの、処分を任せるものと費用負担を整理します。" },
      { q: "雨漏りや古い設備があっても貸せますか？", a: "不具合と建物の状態により異なります。雨漏り・電気・給排水などを確認し、安全や使用に関わる是正の見通しが立たなければ募集は見送ります。" },
      { q: "空き家を貸した後に売却できますか？", a: "売却は検討できますが、賃貸中かどうかで引渡し条件が異なります。相続空き家の売却特例は、短期間でも貸し付けると要件に影響するため、特例を検討している方は貸す前に税理士にご確認ください。" },
    ],
  },
  en: {
    title: "Vacant homes in Bunkyo: renting or selling | Yotsuba Real Estate",
    h1: "Could you rent out your vacant home in Bunkyo without major renovations?",
    lead: "You can talk to us before clearing out or renovating an inherited home, even if furniture and belongings are still there. We review the condition of the building and its fixtures, then explain whether it could be rented close to its current condition, what repairs may be needed and what rent you might expect.",
    contact: "Ask about your vacant home before clearing it out", compare: "Compare selling, renting and managing",
    ways: "Two ways to rent out a vacant home",
    home: "Rent it as a home", homeText: "First, check issues that affect safety or everyday use, such as leaks and plumbing. Tenants may be able to repaint or redecorate with the owner’s prior approval. Agree in advance on belongings left behind, who pays for work, and what must be restored at move-out.",
    group: "Lease it to a group home operator", groupText: "If the property is suitable, leasing to an operator of supported housing for people with disabilities is another option. Check the owner’s consent to use and alterations, building and fire safety requirements, and whether the operator could obtain the required designation.",
    groupLink: "Guide for owners considering a group home lease (Japanese)",
    flow: "From first enquiry to comparing rental options", steps: ["Tell us the neighbourhood and whether belongings remain.", "We check the building and fixtures on site and identify repairs and items that may stay.", "We compare likely costs and rental income on one A4 page."],
    table: "What the rental comparison covers", item: "Item", columns: ["Rent close to its current condition", "Rent after essential repairs"],
    rows: [
      ["Upfront costs", "Work needed for safe use and handling of belongings", "Quotes for additional fixture and interior repairs"],
      ["Estimated rent", "Based on the current condition and work the tenant would pay for", "Based on the repaired condition and comparable local properties"],
      ["Annual cash flow", "Estimate allowing for vacancies and running costs", "Estimate allowing for vacancies and running costs"],
      ["When to start marketing", "When checks and essential corrections are complete", "Timing for repairs and marketing"],
    ],
    note: "If renting does not suit the property, we can compare selling or managing it for now. We explain the scope and cost of any paid work before it starts.",
    finalTitle: "Tell us about the home before you start clearing it out.", finalText: "The neighbourhood and whether belongings remain are enough to start. Photos and registration documents are not required for the initial enquiry.",
    tax: "If a local authority issues a formal recommendation concerning a designated or inadequately managed vacant property, its land may lose preferential residential land treatment, and the tax burden may increase.",
    saleCaution: "Japan’s tax relief on the sale of an inherited vacant home requires that the property not be rented out during the prescribed period after inheritance. Even a short tenancy in that period fails this requirement. If you may sell, consult a tax accountant before renting it out.",
    division: "四葉行政書士事務所 is a separate business and handles work such as preparing inheritance division agreements under a separate contract. For registration applications, engage a judicial scrivener directly; for tax matters, engage a tax accountant directly.",
    faq: [
      { q: "Can I enquire if furniture or belongings are still there?", a: "Yes. Contact us before clearing them out. We check who owns the items and agree which will be removed, left for use or disposed of, and who will bear the costs." },
      { q: "Can I rent out a home with leaks or old fixtures?", a: "It depends on the defects and the condition of the building. We check leaks, electrics and plumbing. If there is no clear way to address problems affecting safety or use, we do not market the property." },
      { q: "Can I sell the house after renting it out?", a: "You may consider selling, but handover terms depend on whether it is tenanted. Even a short tenancy can affect eligibility for Japan’s tax relief on the sale of an inherited vacant home. If considering the relief, consult a tax accountant before renting." },
    ],
  },
  "zh-tw": {
    title: "文京區空屋活用與出售｜清理前的出租諮詢｜四葉不動産",
    h1: "文京區的空屋，不大幅整修也能出租嗎？",
    lead: "繼承的老家即使還留著家具或物品，也可以在委託清理或整修之前先諮詢。四葉不動産會確認房屋及設備的狀況，說明是否能以接近現況的方式出租、哪些地方需要先修，以及預估租金。",
    contact: "在清理前諮詢空屋出租", compare: "比較出售、出租與管理",
    ways: "空屋出租的兩種方式",
    home: "作為一般住宅出租", homeText: "先確認漏水、給排水等影響安全及日常使用的事項。壁紙或油漆等，可由承租人在取得屋主事前同意後施作。哪些家具要保留、施工費由誰負擔，以及退租時需恢復到什麼程度，都在簽約前確認。",
    group: "出租給團體家屋的營運法人", groupText: "若房屋條件合適，也可考慮出租給提供身心障礙者共同生活援助的法人。須分別確認屋主是否同意用途與改修、建築及消防條件，以及事業者取得指定的可行性。",
    groupLink: "給考慮出租給團體家屋的屋主（日文）",
    flow: "從諮詢到比較出租方案", steps: ["請先告訴我們房屋所在的町名，以及是否還留有家具或物品。", "到現場確認房屋及設備，整理必要修繕與可保留的物品。", "用一張A4比較預估費用與租金收支。"],
    table: "出租方案比較表", item: "比較項目", columns: ["以接近現況的方式出租", "完成必要修繕後出租"],
    rows: [
      ["初期費用", "安全與使用所需的處理及家財整理", "額外修繕設備與室內的估價"],
      ["預估租金", "依房屋現況及承租人負擔的工程估算", "依修繕後的狀況及附近案例估算"],
      ["年度收支", "將空置期及維護費納入試算", "將空置期及維護費納入試算"],
      ["開始招租的時點", "完成檢查並處理必要事項後", "依工程進度安排招租"],
    ],
    note: "若房屋不適合出租，也可比較出售或暫時管理。需要付費的作業，會在開始前告知範圍及金額。",
    finalTitle: "開始清理之前，歡迎先告訴我們空屋的狀況。", finalText: "初次諮詢只要提供町名，以及是否還留有家具或物品。不必先準備照片或登記資料。",
    tax: "日本的特定空家等或管理不全空家等若收到地方政府的勸告，基地可能不再適用住宅用地特例，土地的稅負因而可能增加。",
    saleCaution: "日本的繼承空屋出售稅務特例，要求在繼承後的法定期間內未曾出租；即使只出租短期，也不符合這項要件。若也在考慮出售，請先向稅理士確認，再決定是否出租。",
    division: "遺產分割協議書等文件的製作，由獨立經營的四葉行政書士事務所另行簽約辦理。登記申請代理請直接委託日本的司法書士，稅務請直接委託稅理士。",
    faq: [
      { q: "屋內還留著家具或物品，也可以諮詢嗎？", a: "可以，不必先清理。我們會先確認物品的所有人，再整理哪些要搬走、哪些可留用、哪些可委託處理，以及費用由誰負擔。" },
      { q: "房屋漏水或設備老舊，也可以出租嗎？", a: "要視問題與房屋狀況而定。我們會確認漏水、電力及給排水。若影響安全或使用的問題沒有明確的改善方案，就先不招租。" },
      { q: "出租空屋後還能出售嗎？", a: "可以考慮出售，但是否仍在出租會影響交屋條件。即使只出租短期，也可能影響日本繼承空屋出售的稅務特例。若打算申請該特例，請在出租前先向稅理士確認。" },
    ],
  },
  zh: {
    title: "文京区空置房屋利用与出售｜清理前的出租咨询｜四葉不動産",
    h1: "文京区的空置房屋，不大规模翻修也能出租吗？",
    lead: "继承的房屋即使还留有家具或物品，也可以在委托清理或翻修之前先咨询。四葉不動産会查看房屋及设备的状况，说明是否能以接近现状的方式出租、哪些地方需要先修，以及预计租金。",
    contact: "在清理前咨询空置房屋出租", compare: "比较出售、出租与管理",
    ways: "空置房屋出租的两种方式",
    home: "作为普通住宅出租", homeText: "先检查漏水、给排水等影响安全和日常使用的问题。墙纸或涂漆等，可由承租人在取得房东事先同意后施工。保留哪些家具、施工费由谁承担、退租时恢复到什么程度，都在签约前明确。",
    group: "出租给团体之家运营法人", groupText: "条件合适时，也可考虑出租给运营残障人士共同生活援助服务的法人。需分别确认房东对用途和改造的同意、建筑及消防条件，以及运营机构取得指定的可行性。",
    groupLink: "面向考虑出租给团体之家的房东（日语）",
    flow: "从咨询到比较出租方案", steps: ["请先告知房屋所在的町名，以及是否还留有家具或物品。", "到现场查看房屋和设备，梳理必要维修及可保留的物品。", "用一张A4纸比较预计费用和租赁收支。"],
    table: "出租方案比较表", item: "比较项目", columns: ["以接近现状的方式出租", "完成必要维修后出租"],
    rows: [
      ["初期费用", "安全和使用所需的处理，以及屋内物品的整理", "额外维修设备及室内的报价"],
      ["预计租金", "按房屋现状和承租人承担的工程估算", "按维修后的状况及附近案例估算"],
      ["年度收支", "计入空置期和维护费后估算", "计入空置期和维护费后估算"],
      ["预计招租时间", "完成检查并处理必要问题后", "按维修工期安排招租"],
    ],
    note: "不适合出租时，也可比较出售或暂时管理。收费工作会在开始前说明范围和金额。",
    finalTitle: "开始清理前，欢迎先告诉我们空置房屋的情况。", finalText: "首次咨询只需提供町名，以及是否还留有家具或物品。不必先准备照片或登记材料。",
    tax: "日本的特定空家等或管理不全空家等收到地方政府的劝告后，房屋所在土地可能不再适用住宅用地税收优惠，土地税负可能增加。",
    saleCaution: "日本的继承空置房屋出售税收优惠要求在继承后的规定期间内未曾出租；即使仅短期出租，也不符合这项要求。如果也在考虑出售，请在出租前向税理士确认。",
    division: "遗产分割协议书等文件由独立经营的四葉行政書士事務所另行签约制作。登记申请代理请直接委托日本的司法书士，税务请直接委托税理士。",
    faq: [
      { q: "屋内还有家具或物品，可以咨询吗？", a: "可以，不用先清理。先确认物品归属，再确定哪些要搬走、哪些可留用、哪些可委托处置，以及由谁承担费用。" },
      { q: "房屋漏水或设备老旧，也可以出租吗？", a: "要看问题和房屋状况。我们会检查漏水、电力和给排水。如影响安全或使用的问题没有明确的解决方案，暂不招租。" },
      { q: "空置房屋出租后还能出售吗？", a: "可以考虑出售，但是否仍在出租会影响交房条件。即使短期出租，也可能影响日本继承空置房屋出售时的税收优惠。如考虑该优惠，请在出租前向税理士确认。" },
    ],
  },
} satisfies Record<LangCode, RentalCopy>;
