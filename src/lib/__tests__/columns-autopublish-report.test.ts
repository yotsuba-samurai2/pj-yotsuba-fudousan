import { describe, expect, it } from "vitest";
import { publicationOutcome, renderPublicationSummary } from "../columns-autopublish-report";

const published = [{ key: "labor:a", path: "/labor/column/a", title: "公開済み労務" }];
const held = [{ key: "legal:b", path: "/legal/column/b", title: "保留法務", qualityHoldReasons: ["レビュー未登録"] }];
const qualityError = { key: "legal:b", message: "品質確認待ち：レビュー未登録" };

describe("publication report", () => {
  it("keeps published and held facts when skipped is an empty array", () => {
    const result = { ok: false, published, held, skipped: [], errors: [qualityError], blocked: "品質確認待ち" };
    expect(publicationOutcome(result)).toBe("partial");
    const summary = renderPublicationSummary(result).join("\n");
    expect(summary).toContain("部分成功");
    expect(summary).toContain("公開した記事：1本");
    expect(summary).toContain("https://luck428.com/labor/column/a");
    expect(summary).toContain("保留法務");
    expect(summary).toContain("レビュー未登録");
    expect(summary).not.toContain("実行していません");
    expect(summary).not.toContain("失敗：legal:b");
  });
  it("lists concurrent skips without treating the whole run as unexecuted", () => {
    const summary = renderPublicationSummary({ ok: true, published, skipped: [{ key: "legal:b", skipReason: "別操作で公開済み" }] }).join("\n");
    expect(summary).toContain("競合等で対象外：1本");
    expect(summary).toContain("別操作で公開済み");
    expect(summary).toContain("公開した記事：1本");
    expect(summary).not.toContain("実行していません");
  });
  it("distinguishes only-held, dry-run, legacy no-result and no-op success", () => {
    expect(publicationOutcome({ published: [], held, blocked: "品質確認待ち", errors: [qualityError] })).toBe("held");
    expect(publicationOutcome({ dryRun: true, held, errors: [qualityError] })).toBe("dry-run");
    expect(publicationOutcome({ skipped: "結果がありません" })).toBe("not-run");
    expect(publicationOutcome({ ok: true, published: [], skipped: [] })).toBe("success");
  });
  it("keeps unavailable results unknown and persisted transport failure visible", () => {
    expect(renderPublicationSummary({ skipped: "結果がありません" }).join("\n")).toContain("件数未確認");
    expect(renderPublicationSummary({ error: "HTTP 503" }).join("\n")).not.toContain("公開した記事：0本");
    expect(publicationOutcome({ outcome: "failure" })).toBe("failure");
  });
  it.each([{ refreshError: "cache failure" }, { errors: [qualityError, { key: "labor:c", message: "DB failure" }] }, { error: "HTTP 503" }])("preserves publications on actual failures: %j", failure => {
    const result = { published, held, blocked: "品質確認待ち", ...failure };
    expect(publicationOutcome(result)).toBe("failure");
    expect(renderPublicationSummary(result).join("\n")).toContain("公開した記事：1本");
  });
});
