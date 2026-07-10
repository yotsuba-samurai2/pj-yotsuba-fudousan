// フェーズK｜三禁則・業際・ガードの受け入れテスト（ClaudeCode実装指示書§9の6点を固定）
// AI経路はモック不要＝ANTHROPIC_API_KEY未設定でデモ経路（＝フォールバックの最後の砦）を検証する。
// 前段ガード（URGENT/NAMEISH）はAPIルート直呼びで検証（AIの手前で決定論的に落ちること）。
import { beforeEach, describe, expect, it } from "vitest";
import { localConcierge, localSearch, localTriage } from "@/lib/linka/demo";
import { BANNED_RECO_WORDS, resolveResult, validateResolved } from "@/lib/linka/resolve";
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
