import { expect, it, vi } from "vitest";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const deps = vi.hoisted(() => ({ close: vi.fn(), flush: vi.fn(), disconnect: vi.fn() }));
vi.mock("dotenv", () => ({ config: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { $disconnect: deps.disconnect } }));
vi.mock("@/lib/rental-import/db-store", () => ({ rentalStore: {} }));
vi.mock("@/lib/rental-import/lifecycle", () => ({ closeRental: deps.close, closureFromRentalImport: vi.fn(), importRental: vi.fn() }));
vi.mock("@/lib/property-publication-notify", () => ({ recordPropertyPublicationChange: vi.fn(), flushDuePropertyNotificationsNow: deps.flush }));

it("CLIは保存成功後に通知・切断・結果報告まで完了する（DB/送信はモック）", async () => {
  const dir = await mkdtemp(join(tmpdir(), "yotsuba-cli-")); const input = join(dir, "input.json"), report = join(dir, "report.json");
  const argv = process.argv, exitCode = process.exitCode;
  deps.close.mockResolvedValue({ action: "closed", slug: "synthetic", reasons: [] });
  vi.stubEnv("RENTAL_IMPORT_ENABLED", "true");
  await writeFile(input, JSON.stringify([{}]));
  process.argv = ["node", "run.ts", "close", `--input=${input}`, `--report=${report}`, "--write"];
  try {
    await import("../../../../scripts/rental-import/run");
    await vi.waitFor(async () => {
      const output = JSON.parse(await readFile(report, "utf8"));
      expect(output.results).toEqual([{ action: "closed", slug: "synthetic", reasons: [] }]); expect(output.dryRun).toBe(false);
    });
    expect(deps.close).toHaveBeenCalledOnce(); expect(deps.flush).toHaveBeenCalledOnce(); expect(deps.disconnect).toHaveBeenCalledOnce();
    expect(deps.close.mock.invocationCallOrder[0]).toBeLessThan(deps.flush.mock.invocationCallOrder[0]);
    expect(deps.flush.mock.invocationCallOrder[0]).toBeLessThan(deps.disconnect.mock.invocationCallOrder[0]);
    expect(process.exitCode).toBe(exitCode);
  } finally {
    process.argv = argv; process.exitCode = exitCode; vi.unstubAllEnvs();
    await rm(dir, { recursive: true, force: true });
  }
});
