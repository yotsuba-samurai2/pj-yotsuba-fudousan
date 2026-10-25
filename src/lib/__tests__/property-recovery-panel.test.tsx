import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import PropertyPublicationRecovery from "@/components/admin/PropertyPublicationRecovery";
import { createPropertyRecoverySession } from "../property-recovery-session";
import type { PropertyRecoverySummary } from "../property-recovery-contract";
const propertyId = "00000000-0000-4000-8000-000000000001", requestId = "00000000-0000-4000-8000-000000000002", operatorId = "00000000-0000-4000-8000-00000000000a";
function setup() {
  let serialized = JSON.stringify([{ propertyId, requestId }]);
  const summary: PropertyRecoverySummary = { cache: { status: "pending", attempts: 0 }, notification: { status: "pending", attempts: 0 }, revision: 0, resultVersion: "2026-10-25T00:00:00.001Z" };
  let status = 200;
  const session = createPropertyRecoverySession({ propertyId, operatorId, storage: { getItem: () => serialized, setItem: (_key,v) => { serialized = v; } },
    send: async () => Response.json({ propertyId, requestId, summary, outcome: "status", publication: "not_checked" }, { status }) });
  return { summary, session, forbid: () => { status = 403; }, render: () => renderToStaticMarkup(<PropertyPublicationRecovery session={session} />) };
}
it("static panel renders cache-first controls and distinct received/publication status", async () => {
  const f = setup(); await f.session.inspect(); let html = f.render();
  expect(html).toContain('aria-label="保存後の公開処理"'); expect(html).toContain('aria-live="polite"');
  expect(html).toMatch(/<button type="button">ページ更新を再開<\/button>/);
  expect(html).toMatch(/<button type="button" disabled="">通知を再開<\/button>/);
  f.summary.cache.status = "running"; await f.session.inspect(); html = f.render(); expect(html).toContain("ページ更新の結果を照合");
  f.summary.cache.status = "acknowledged"; f.summary.notification.status = "not_required"; await f.session.inspect(); html = f.render();
  expect(html).toContain("完了した受付番号を一覧から外す"); expect(html).not.toContain("を再開</button>"); expect(html).toContain("公開画面への反映は未確認");
});
it("static panel removes resumable controls after a forbidden result", async () => {
  const f = setup(); await f.session.inspect(); f.forbid(); await f.session.resume("cache");
  const html = f.render(); expect(html).toContain("権限を確認できません"); expect(html).not.toContain("を再開</button>"); expect(html).toContain("状態を照合</button>");
});
it("static panel shows explicit held removal and capacity guidance without effect controls", async () => {
  let refs = JSON.stringify([{ propertyId, requestId }]);
  const session = createPropertyRecoverySession({ propertyId, operatorId, storage: { getItem: () => refs, setItem: (_key, value) => { refs = value; } },
    send: async () => Response.json({ propertyId, requestId, outcome: "confirmed_held", publication: "not_checked", reason: "VERSION_CONFLICT", resultVersion: "2026-10-25T00:00:00.001Z" }) });
  await session.inspect(); const html = renderToStaticMarkup(<PropertyPublicationRecovery session={session} />);
  expect(html).toContain("保留が確定した受付番号を一覧から外す"); expect(html).toContain("サーバーの記録は残ります");
  expect(html).not.toContain("を再開</button>"); expect(html).not.toContain("完了した受付番号を一覧から外す");
  expect(session.forgetConfirmedHeld()).toBe(true); expect(refs).toBe("[]");
  expect(renderToStaticMarkup(<PropertyPublicationRecovery session={session} />)).not.toContain("保留が確定した受付番号を一覧から外す</button>");
});
