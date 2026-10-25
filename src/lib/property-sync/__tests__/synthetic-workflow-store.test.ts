import { expect, it } from "vitest";
import { appendMediaAudit, createMediaJournal, type MediaJournal } from "../audit";
import { runSyntheticWorkflow, type SyntheticAuditStore } from "../synthetic-workflow";

function store(fault: "none" | "rollback" | "lost" | "unreadable" | "wrong-ack") {
  let journal: MediaJournal, saves = 0, reads = 0;
  const port: SyntheticAuditStore = {
    initialize: async state => { journal = createMediaJournal(state); },
    read: async () => { reads++; if (fault === "unreadable" && saves) throw new Error("PRIVATE_DB_ERROR"); return structuredClone(journal); },
    apply: async request => {
      saves++;
      if (fault === "rollback") return { status: "held", reason: "TRANSACTION_ROLLED_BACK" };
      const next = appendMediaAudit(journal, request);
      if (next.status === "held") return next;
      journal = next.journal;
      if (fault === "lost" && saves === 1) return { status: "held", reason: "STORE_OUTCOME_UNKNOWN" };
      if (fault === "wrong-ack" && next.outcome.status !== "held") {
        const state = structuredClone(next.outcome.state); state.listing.revision++;
        return { status: "applied", state };
      }
      return next.outcome;
    },
  };
  return { port, inspect: () => ({ journal, saves, reads }) };
}

it("注入した台帳を読取りの正本として使い、正常応答後も保存stateを照合", async () => {
  const f = store("none"), r = await runSyntheticWorkflow("workflow-success", f.port);
  expect(r.expectedResultMatched).toBe(true);
  expect(f.inspect()).toMatchObject({ saves: 3 });
  expect(f.inspect().reads).toBeGreaterThan(3);
  expect(r.result.audit.mediaHeadHash).toBe(f.inspect().journal.headHash);
  expect(r.result.audit.mediaEvents).toBe(3);
});
it("commit応答喪失を同requestの読戻しで確定し再保存しない", async () => {
  const f = store("lost"), r = await runSyntheticWorkflow("workflow-success", f.port);
  expect(r.expectedResultMatched).toBe(true);
  expect(r.result.steps.filter(s => s.reason === "LOCAL_COMMIT_CONFIRMED_BY_READBACK")).toHaveLength(1);
  expect(f.inspect().saves).toBe(3); expect(f.inspect().journal.events).toHaveLength(3);
});
it("rollbackでは模擬媒体成功をローカル保存成功に置き換えない", async () => {
  const f = store("rollback"), r = await runSyntheticWorkflow("workflow-success", f.port);
  expect(r.expectedResultMatched).toBe(false);
  expect(r.result).toMatchObject({ status: "held", reason: "LOCAL_MEDIA_SAVE_HELD", mockMutations: 1, mockReadbackMatched: false, reservationPhase: "attempted" });
  expect(f.inspect().saves).toBe(1); expect(f.inspect().journal.events).toHaveLength(0);
});
it.each(["unreadable", "wrong-ack"] as const)("%sでは保存推定stateを採用せずunknownに保持", async fault => {
  const f = store(fault), r = await runSyntheticWorkflow("workflow-success", f.port);
  expect(r.expectedResultMatched).toBe(false);
  expect(r.result).toMatchObject({ status: "unknown", reason: "LOCAL_MEDIA_OUTCOME_UNKNOWN", mockReadbackMatched: false, realObservationAvailable: false });
  expect(f.inspect().saves).toBe(1); expect(f.inspect().journal.events).toHaveLength(1);
  expect(JSON.stringify(r)).not.toContain("PRIVATE_DB_ERROR");
});
it("初期台帳が別媒体なら固定errorで開始を拒否し保存しない", async () => {
  const f = store("none"), port: SyntheticAuditStore = { ...f.port, read: async () => {
    const j = structuredClone(f.inspect().journal); j.state.media = "athome"; return j;
  } };
  await expect(runSyntheticWorkflow("workflow-success", port)).rejects.toThrow("SYNTHETIC_AUDIT_INITIALIZATION_FAILED");
  expect(f.inspect().saves).toBe(0);
});
