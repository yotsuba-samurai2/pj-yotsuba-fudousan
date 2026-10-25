import { expect, it } from "vitest";
import { appendReadAttemptRequest, verifyReadAttemptRegistry, type ReadAttemptRegistry, type ReadAttemptRequest } from "../read-attempt-registry";
import { contentHash } from "../rules";
import { clock, completion, registry, request } from "./read-registry-fixtures";

function record(j: ReadAttemptRegistry, r: ReadAttemptRequest, now = clock(0)) {
  const result = appendReadAttemptRequest(j, r, now);
  if (result.status !== "recorded") throw new Error(JSON.stringify(result));
  return result;
}
it("開始予約→exact completionを監査保存し全履歴を再生", () => {
  const original = registry(), before = structuredClone(original), start = request(original);
  const first = record(original, start);
  expect(first).toMatchObject({ executable: false, replayed: false, outcome: { status: "started", attemptId: "attempt-1" }, journal: { state: { revision: 1,
    attempts: [{ status: "started", number: 1, startedAt: clock(0) }], owners: [{ attemptId: "attempt-1", actorRef: "synthetic-actor" }] } } });
  const done = record(first.journal, completion(first.journal), clock(1000));
  expect(done.outcome.status).toBe("completed"); expect(verifyReadAttemptRegistry(done.journal)).toEqual(done.journal); expect(original).toEqual(before);
  expect(record(done.journal, request(done.journal, 3), clock(1000)).outcome).toMatchObject({ status: "held", reason: "READ_SUCCEEDED" });
});
it("同じheadからの競合開始は一つだけ、失敗も監査へ", () => {
  const j = registry(), a = request(j), b = request(j, 2), first = record(j, a), second = record(first.journal, b);
  expect(second.outcome).toMatchObject({ status: "held", reason: "READ_REGISTRY_CONFLICT" });
  expect(second.journal.state.attempts).toHaveLength(1); expect(second.journal.state.revision).toBe(2); expect(verifyReadAttemptRegistry(second.journal)).toEqual(second.journal);
});
it("同requestの再送は古い成功と最新stateを返し、送信許可にはしない", () => {
  const j = registry(), start = request(j), first = record(j, start), finish = completion(first.journal), done = record(first.journal, finish, clock(1000));
  const retry = record(done.journal, start, clock(2000));
  expect(retry).toMatchObject({ executable: false, replayed: true, outcome: { status: "started" }, journal: { state: { revision: 2, attempts: [{ status: "succeeded" }] } } });
  expect(record(done.journal, finish, clock(2000))).toMatchObject({ replayed: true, journal: done.journal });
  const altered = { ...start, actorRef: "different" }; expect(appendReadAttemptRequest(done.journal, altered, clock(2000))).toMatchObject({ reason: "READ_REQUEST_ID_CONFLICT" });
});
it("未完了予約はtimeout/deadline後も解放せず予算を戻さない", () => {
  const started = record(registry(), request(registry())).journal;
  const next = record(started, request(started, 2), clock(150000));
  expect(next.outcome).toMatchObject({ status: "held", reason: "READ_ATTEMPT_IN_FLIGHT" }); expect(next.journal.state.attempts).toHaveLength(1);
  const done = record(next.journal, completion(next.journal, 3), clock(151000));
  expect(done.outcome.status).toBe("completed"); expect(done.journal.state.attempts[0]).toMatchObject({ status: "succeeded", finishedAt: clock(151000) });
});
it("再計算されたsuggestedでもbackoff前は開始しない、最大予算を保持", () => {
  let j = record(registry(), request(registry())).journal;
  j = record(j, completion(j, 2, "failed"), clock(1000)).journal;
  let result = record(j, request(j, 3), clock(2999)); expect(result.outcome).toMatchObject({ reason: "READ_BACKOFF_NOT_ELAPSED" }); j = result.journal;
  result = record(j, request(j, 4), clock(3000)); expect(result.outcome.status).toBe("started"); j = result.journal;
  j = record(j, completion(j, 5, "failed"), clock(4000)).journal;
  expect(record(j, request(j, 6), clock(8000)).outcome).toMatchObject({ reason: "READ_ATTEMPT_BUDGET_EXHAUSTED" });
});
it.each(["owner", "attempt", "hash", "run"])("completionの%s不一致を拒否", key => {
  const j = record(registry(), request(registry())).journal, c = completion(j);
  if (c.command.type !== "complete") throw new Error("fixture");
  if (key === "owner") c.actorRef = "other";
  if (key === "attempt") c.command.attemptId = "other";
  if (key === "hash") c.command.startedAttemptHash = "d".repeat(64);
  if (key === "run") c.run.hash = "d".repeat(64);
  expect(record(j, c, clock(1000)).outcome).toMatchObject({ status: "held", reason: { owner: "READ_ATTEMPT_OWNER_MISMATCH", attempt: "READ_ATTEMPT_NOT_FOUND", hash: "READ_STARTED_ATTEMPT_MISMATCH", run: "READ_RUN_MISMATCH" }[key] });
});
it("成功/失敗の競合completionや別要求での二度目更新を拒否", () => {
  const j = record(registry(), request(registry())).journal, success = completion(j), failed = completion(j, 3, "failed"), done = record(j, success, clock(1000));
  expect(record(done.journal, failed, clock(1000)).outcome).toMatchObject({ reason: "READ_REGISTRY_CONFLICT" });
  failed.expected = { revision: done.journal.state.revision, headHash: done.journal.headHash };
  expect(record(done.journal, failed, clock(1000)).outcome).toMatchObject({ reason: "READ_ATTEMPT_ALREADY_COMPLETED" });
});
it("試行/transport IDを再利用しない", () => {
  let j = record(registry(), request(registry())).journal; j = record(j, completion(j, 2, "failed"), clock(1000)).journal;
  const r = request(j, 3); if (r.command.type !== "start") throw new Error("fixture"); r.command.attemptId = "attempt-1";
  expect(record(j, r, clock(3000)).outcome).toMatchObject({ reason: "READ_ATTEMPT_ID_REUSED" });
});
it("保存時刻の逆行は記録せず、未来journalを受け入れない", () => {
  const j = record(registry(), request(registry()), clock(1000)).journal;
  expect(appendReadAttemptRequest(j, completion(j), clock(999))).toMatchObject({ reason: "READ_REGISTRY_FROM_FUTURE" });
});
it.each(["state", "event-time", "event-outcome", "policy", "head"])("%s改変を全履歴検証で拒否", key => {
  const j = record(registry(), request(registry())).journal;
  if (key === "state") j.state.attempts = [];
  if (key === "event-time") j.events[0].recordedAt = clock(500);
  if (key === "event-outcome") j.events[0].outcome.status = "held";
  if (key === "policy") j.genesis.input.policy.maxAttempts++;
  if (key === "head") j.headHash = "d".repeat(64);
  expect(verifyReadAttemptRegistry(j)).toBeUndefined();
});
it("不正requestの生値を監査へ保存しない", () => {
  const j = registry(); expect(appendReadAttemptRequest(j, { ...request(j), rawBody: "PRIVATE_RESPONSE" }, clock(0))).toEqual({ status: "held", executable: false, reason: "INVALID_READ_REGISTRY_REQUEST" });
});

it("監査上限の最後一枠を有効completion用に確保する", () => {
  let j = registry();
  // Large valid fixture: all preceding commands are held for a nonexistent completion.
  for (let i = 0; i < 998; i++) {
    const r = request(j, i + 100); r.command = { type: "complete", attemptId: "missing", startedAttemptHash: "d".repeat(64), result: { status: "succeeded", resultHash: "e".repeat(64) } };
    const after = { ...j.state, revision: j.state.revision + 1 };
    const body = { sequence: i + 1, recordedAt: clock(0), request: r, beforeHash: contentHash(j.state), afterHash: contentHash(after),
      outcome: { status: "held" as const, reason: "READ_ATTEMPT_NOT_FOUND", attemptId: null }, previousHash: j.headHash };
    const event = { ...body, eventHash: contentHash(body) }; j = { ...j, state: after, headHash: event.eventHash, events: [...j.events, event] };
  }
  expect(verifyReadAttemptRegistry(j)).toEqual(j);
  j = record(j, request(j, 1200)).journal; expect(j.events).toHaveLength(999);
  const wrong = completion(j, 1201); wrong.actorRef = "other";
  expect(appendReadAttemptRequest(j, wrong, clock(1000))).toMatchObject({ reason: "READ_COMPLETION_CAPACITY_RESERVED" });
  expect(appendReadAttemptRequest(j, request(j, 1202), clock(1000))).toMatchObject({ reason: "READ_COMPLETION_CAPACITY_RESERVED" });
  j = record(j, completion(j, 1203), clock(1000)).journal; expect(j.events).toHaveLength(1000); expect(verifyReadAttemptRegistry(j)).toEqual(j);
  expect(appendReadAttemptRequest(j, request(j, 1204), clock(2000))).toMatchObject({ reason: "READ_REGISTRY_CAPACITY_REACHED" });
}, 15000);
