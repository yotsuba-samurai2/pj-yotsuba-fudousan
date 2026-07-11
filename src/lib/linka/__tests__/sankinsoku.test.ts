// フェーズK｜三禁則・業際・ガードの受け入れテスト（ClaudeCode実装指示書§9の6点を固定）
// AI経路はモック不要＝ANTHROPIC_API_KEY未設定でデモ経路（＝フォールバックの最後の砦）を検証する。
// 前段ガード（URGENT/NAMEISH）はAPIルート直呼びで検証（AIの手前で決定論的に落ちること）。
import { beforeEach, describe, expect, it } from "vitest";
import { localConcierge, localSearch, localTriage } from "@/lib/linka/demo";
import { BANNED_RECO_WORDS, resolveResult, validateLegalConciergeOutput, validateResolved } from "@/lib/linka/resolve";
import { POST as linkaPost } from "@/app/api/linka/route";
import { POST as draftPost } from "@/app/api/linka/draft/route";

const post = (body: unknown) =>
  linkaPost(
    new Request("http://localhost/api/linka", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );

beforeEach(() => {
  delete process.env.ANTHROPIC_API_KEY; // デモ経路を強制
  process.env.NEXT_PUBLIC_SR_LAUNCHED = "false";
});

describe("三禁則①選ばない：候補は常に2件以上・推薦語ゼロ", () => {
  const queries = ["ビザの更新を頼みたい", "相続で困っています", "こんにちは", "東京で会社設立"];
  it("会員検索・一般トリアージで候補≥2", () => {
    for (const q of queries) {
      const s = localSearch(q);
      expect(s.type).toBe("candidates");
      if (s.type === "candidates") expect(s.candidates.length).toBeGreaterThanOrEqual(2);
      const t = localTriage(q);
      if (t.type === "triage") expect(t.candidates.length).toBeGreaterThanOrEqual(2);
    }
  });
  it("全モードの出力に推薦語（最適/一番/おすすめ等）が含まれない", () => {
    const outputs = [
      ...queries.map((q) => localSearch(q)),
      ...queries.map((q) => localTriage(q)),
      ...queries.map((q) => localConcierge(q, "realestate")),
      ...queries.map((q) => localConcierge(q, "legal")),
    ];
    for (const o of outputs) {
      const text = JSON.stringify(o);
      for (const w of BANNED_RECO_WORDS) expect(text).not.toContain(w);
    }
  });
  it("validateResolvedが推薦語・候補1件を検出する（AI出力検証器）", () => {
    const bad1 = resolveResult({ type: "triage", kento: [], message: "この方が最適です", candidates: [{ id: "uramatsu-joji" }, { id: "li-nayu" }] });
    expect(validateResolved(bad1)).toContain("推薦語");
    const bad2 = resolveResult({ type: "candidates", message: "", candidates: [{ id: "uramatsu-joji" }] });
    expect(validateResolved(bad2)).toContain("2件未満");
  });
});

describe("三禁則③機微を通さない＋緊急エスカレーション（APIの前段で決定論的）", () => {
  it("固有名詞（◯◯さん・株式会社）でanonymization_request", async () => {
    for (const msg of ["田中さんの相続の件で", "株式会社ヤマダの許認可"]) {
      const res = await post({ site: "samurai", mode: "customer", message: msg });
      const json = await res.json();
      expect(json.type).toBe("anonymization_request");
    }
  });
  it("URGENT語でescalation＝候補より先に110・法テラス0570-078374", async () => {
    const res = await post({ site: "realestate", mode: "concierge", message: "明日まで に差押と脅されて逮捕が怖い" });
    const json = await res.json();
    expect(json.type).toBe("escalation"); // 候補カードは出ない＝先にエスカレーション
    expect(json.message).toContain("110");
    expect(json.message).toContain("0570-078374");
  });
});

describe("業際（指示書§9-4）：legalサイトの見当・サービスに「助成金」が出ない", () => {
  it("補助金相談でも kento/services は補助金のみ", () => {
    const r = localConcierge("補助金や助成金を申請したい", "legal");
    expect(r.type).toBe("concierge");
    if (r.type === "concierge") {
      const visible = JSON.stringify({ kento: r.kento, services: r.services, message: r.message });
      expect(visible).not.toContain("助成金");
      expect(JSON.stringify(r.kento)).toContain("補助金");
    }
  });
  it("範囲外（労務）は自社案内せず士業ドットコムへ一般化誘導", () => {
    const r = localConcierge("就業規則の届出を頼みたい", "legal");
    if (r.type === "concierge") {
      expect(r.services.length).toBe(0);
      expect(r.escalate).toBe(true);
      expect(r.samuraiUrl).toContain("samurai.co.jp");
    }
  });
});

describe("社労士ガード＋入力検証", () => {
  it("SR_LAUNCHED=falseでsite=laborは404", async () => {
    const res = await post({ site: "labor", mode: "concierge", message: "処遇改善加算について" });
    expect(res.status).toBe(404);
  });
  it("不正なsite×mode組合せは400（コーポレートで名簿モードを開かない）", async () => {
    const res = await post({ site: "realestate", mode: "member", message: "テスト" });
    expect(res.status).toBe(400);
  });
});

describe("照会文draft：必須文言（任意・お断り可）を必ず含む", () => {
  it("フォールバック下書きに必須文言・宛先・固有名詞なしルール", async () => {
    const res = await draftPost(
      new Request("http://localhost/api/linka/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: "li-nayu", inqType: "a", summary: { bunya: "在留資格・ビザ", chiiki: "関東", jiki: "今月" } }),
      }),
    );
    const json = await res.json();
    expect(json.draft).toContain("ご返答は任意で、お断りいただいても差し支えありません");
    expect(json.draft).toContain("李 奈優");
    expect(json.draft).toContain("[あなたのお名前]");
  });
});

describe("オプトイン運用：候補カードに未取得を明示", () => {
  it("全員null初期値＝optin: unknown が付く", () => {
    const s = localSearch("ビザ");
    if (s.type === "candidates") {
      expect(s.candidates.every((c) => c.optin === "unknown")).toBe(true);
    }
  });
});

// ===== 以下、K-2a（2026-07-12）多言語安全装置の追加テスト（既存11テストは不変・追加のみ） =====

describe("K-2a 緊急エスカレーション多言語：en/zh危害入力もAI前段で決定論的にescalation", () => {
  it("en危害入力（kill myself / hits me / threatens me）→escalation＋enメッセージ（110・0570-078374維持）", async () => {
    for (const msg of ["I want to kill myself", "My husband hits me every night", "He threatens me about the contract"]) {
      const res = await post({ site: "realestate", mode: "concierge", message: msg, locale: "en" });
      const json = await res.json();
      expect(json.type).toBe("escalation");
      expect(json.message).toContain("110");
      expect(json.message).toContain("0570-078374");
      expect(json.message).toContain("Japan Legal Support Center");
    }
  });
  it("zh-tw危害入力（我想死・他威脅我・有人恐嚇我）→escalation＋繁体メッセージ", async () => {
    for (const msg of ["我想死", "他威脅我", "有人恐嚇我"]) {
      const res = await post({ site: "realestate", mode: "concierge", message: msg, locale: "zh-tw" });
      const json = await res.json();
      expect(json.type).toBe("escalation");
      expect(json.message).toContain("110");
      expect(json.message).toContain("0570-078374");
      expect(json.message).toContain("法テラス");
    }
  });
  it("zh危害入力（我想自杀・我先生打我・他威胁我）→escalation＋简体メッセージ", async () => {
    for (const msg of ["我想自杀", "我先生打我", "他威胁我"]) {
      const res = await post({ site: "legal", mode: "concierge", message: msg, locale: "zh" });
      const json = await res.json();
      expect(json.type).toBe("escalation");
      expect(json.message).toContain("110");
      expect(json.message).toContain("0570-078374");
    }
  });
  it("locale不正値・未指定はjaメッセージ（既存ja文面の維持）", async () => {
    const res = await post({ site: "realestate", mode: "concierge", message: "死にたいくらい辛い", locale: "fr" });
    const json = await res.json();
    expect(json.type).toBe("escalation");
    expect(json.message).toContain("110番");
    expect(json.message).toContain("法テラス(0570-078374)");
  });
});

describe("K-2a 機微多言語：en/zh法人格・敬称もanonymization_request", () => {
  it("en法人格・敬称（Mr./Ltd./Inc.）→anonymization_request＋enメッセージ", async () => {
    for (const msg of ["Mr. Chen of ABC Ltd. asked me to sign a contract", "Our company ABC Inc. has a licensing problem"]) {
      const res = await post({ site: "realestate", mode: "concierge", message: msg, locale: "en" });
      const json = await res.json();
      expect(json.type).toBe("anonymization_request");
      expect(json.message).toContain("company names");
    }
  });
  it("zh法人格・敬称（有限公司・股份有限公司・先生・小姐）→anonymization_request", async () => {
    for (const msg of ["我是ABC有限公司的陳先生", "台灣股份有限公司的王小姐有問題"]) {
      const res = await post({ site: "legal", mode: "concierge", message: msg, locale: "zh-tw" });
      const json = await res.json();
      expect(json.type).toBe("anonymization_request");
      expect(json.message).toContain("公司名稱");
    }
  });
  it("localSearch（会員検索デモ）にも同一ガードが効く（診断A-1のデモ側欠落修理）", () => {
    const a = localSearch("我是ABC有限公司的陳先生", "zh");
    expect(a.type).toBe("anonymization_request");
    const b = localSearch("我想死", "zh");
    expect(b.type).toBe("escalation");
  });
});

describe("K-2a 推薦語多言語：validateResolvedがen/zh推薦語入りAI出力を弾く", () => {
  it("en推薦語（best/recommend/No. 1・大文字小文字非依存）を検出", () => {
    for (const msg of ["We RECOMMEND Mr. Yamada for your case", "This is the BEST choice for you", "They are No. 1 in Tokyo"]) {
      const bad = resolveResult({ type: "triage", kento: [], message: msg, candidates: [{ id: "uramatsu-joji" }, { id: "li-nayu" }] });
      expect(validateResolved(bad)).toContain("推薦語");
    }
  });
  it("zh推薦語（首選/推荐/最好・簡繁）を検出", () => {
    for (const msg of ["首選是這位專家", "我们推荐这位专家", "這是最好的選擇"]) {
      const bad = resolveResult({ type: "triage", kento: [], message: msg, candidates: [{ id: "uramatsu-joji" }, { id: "li-nayu" }] });
      expect(validateResolved(bad)).toContain("推薦語");
    }
  });
});

describe("K-2a 業際・言語非依存：validateLegalConciergeOutput（(c)併用＋言語ゲート）", () => {
  const mk = (over: Record<string, unknown>) =>
    resolveResult({
      type: "concierge",
      kento: ["補助金"],
      message: "お話の内容から見当をお示しします。これは見当であって法的な判断ではありません。",
      services: [],
      escalate: false,
      escalateReason: "",
      ...over,
    });
  it("escalateReasonの「助成金」も検査対象（既存穴A-3の修正）", () => {
    const r = mk({ escalate: true, escalateReason: "雇用助成金のご相談は当サイトの範囲外です" });
    expect(validateLegalConciergeOutput(r)).toContain("業際");
  });
  it("en文脈語（employment grant等）でフォールバック判定", () => {
    const r = mk({ message: "こちらの employment grant が使える可能性があります" });
    expect(validateLegalConciergeOutput(r)).toContain("業際");
    const r2 = mk({ message: "You may apply for the employment grant." });
    expect(validateLegalConciergeOutput(r2)).toContain("業際");
  });
  it("zh文脈語（就業補助金/就业补助金等）でフォールバック判定", () => {
    const r = mk({ message: "就業補助金の件のご案内です" });
    expect(validateLegalConciergeOutput(r)).toContain("業際");
    const r2 = mk({ message: "关于就业补助金のご案内です" });
    expect(validateLegalConciergeOutput(r2)).toContain("業際");
  });
  it("言語ゲート：仮名ゼロのlegal出力（英文回答）は非日本語の疑いでフォールバック判定", () => {
    const r = mk({ kento: ["visa"], message: "We can guide you on visa procedures in Japan." });
    expect(validateLegalConciergeOutput(r)).toContain("非日本語");
  });
  it("正常ja出力（補助金のみ・仮名あり）はnull＝通る（補助金=行政書士OKを潰さない）", () => {
    const r = mk({});
    expect(validateLegalConciergeOutput(r)).toBeNull();
  });
});

describe("K-2a 正常系：通常入力は過剰発火せずconcierge（デモフォールバック原則の維持）", () => {
  it("正常ja入力（補助金相談）はconciergeのまま", async () => {
    const res = await post({ site: "legal", mode: "concierge", message: "補助金の申請を相談したい", locale: "ja" });
    const json = await res.json();
    expect(json.type).toBe("concierge");
  });
  it("危険語のないen入力もガード誤発火せずconcierge（デモ経路）", async () => {
    const res = await post({ site: "realestate", mode: "concierge", message: "I am looking for an apartment in Tokyo", locale: "en" });
    const json = await res.json();
    expect(json.type).toBe("concierge");
  });
});
