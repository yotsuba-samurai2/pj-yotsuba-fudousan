import { expect, it } from "vitest";
import { runSyntheticWorkflow, syntheticWorkflowCases } from "../synthetic-workflow";

it.each(syntheticWorkflowCases)("合成1物件の独立した接続フロー: %s", async scenario => {
  const report = await runSyntheticWorkflow(scenario);
  expect(report.expectedResultMatched).toBe(true);
  expect(report).toMatchObject({ sourceOrigin: "synthetic_generated", purpose: "workflow_demo", executable: false,
    realSettingsVerified: false, realPermissionsVerified: false, mediaConnectionVerified: false, realPublicationVerified: false });
  expect(report.result).toMatchObject({ executable: false, internalExcluded: true, integrityVerified: true, realObservationAvailable: false });
  expect(JSON.stringify(report)).not.toMatch(/SYNTHETIC_PRIVATE_|adNote|rentMinYen|recordJson|contractRef/);
  if (report.result.status === "simulated") {
    expect(report.result).toMatchObject({ mockMutations: 1, mockReadbackMatched: true, reservationPhase: "attempted",
      audit: { planEvents: 1, capacityEvents: 3, mediaEvents: 3, mockTargetEvents: 1 },
      mockTarget: { desiredState: "published", listingRevision: 1 } });
    expect(report.result.mockTarget.payloadHash).toBe(report.result.publicPreview.payloadHash);
    expect(report.result.steps.map(s => s.stage)).toEqual(expect.arrayContaining(["plan", "preflight", "confirm", "mock_apply", "readback"]));
  }
  if (scenario === "workflow-writer-conflict") expect(report.result).toMatchObject({ mockMutations: 0, submissionCalls: 1,
    mockTarget: { desiredState: "not_published", listingRevision: 1, payloadHash: null }, audit: { mediaEvents: 0, mockTargetEvents: 2 } });
  if (scenario === "workflow-duplicate") expect(report.result).toMatchObject({ submissionCalls: 2, duplicateReplayed: true, mockMutations: 1 });
  if (scenario === "workflow-request-conflict") expect(report.result).toMatchObject({ submissionCalls: 2, duplicateReplayed: false, mockMutations: 1,
    mockTarget: { desiredState: "published", listingRevision: 1 }, audit: { mockTargetEvents: 1 } });
  if (scenario === "workflow-response-lost") expect(report.result).toMatchObject({ submissionCalls: 1, unknownResolvedByReadback: true, mockMutations: 1 });
  if (scenario === "workflow-response-unknown") expect(report.result).toMatchObject({ status: "unknown", submissionCalls: 1, unknownResolvedByReadback: false,
    mockReadbackMatched: false, reservationPhase: "attempted", audit: { mediaEvents: 0 } });
  if (scenario === "workflow-readback-mismatch") expect(report.result).toMatchObject({ mockReadbackMatched: false, unknownResolvedByReadback: false, audit: { mediaEvents: 0 } });
  if (report.expected.mockMutations === 0 && scenario !== "workflow-writer-conflict") expect(report.result).toMatchObject({ submissionCalls: 0,
    mockTarget: { desiredState: "unconfigured", listingRevision: 0, payloadHash: null }, audit: { mediaEvents: 0, mockTargetEvents: 0 } });
});
it("外部target/任意scenarioは受け取らず、未知の指定は開始しない", async () => {
  await expect(runSyntheticWorkflow("production" as never)).rejects.toThrow("UNKNOWN_SYNTHETIC_CASE");
});
