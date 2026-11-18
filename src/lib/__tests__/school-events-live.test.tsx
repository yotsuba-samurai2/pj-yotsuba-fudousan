import { afterEach, describe, expect, it, vi } from "vitest";
const hooks = vi.hoisted(() => ({ effect: undefined as undefined | (() => (() => void)), setNow: vi.fn() }));
vi.mock("react", async importOriginal => ({
  ...await importOriginal<typeof import("react")>(),
  useState: (initial: string) => [initial, hooks.setNow],
  useEffect: (effect: () => (() => void)) => { hooks.effect = effect; },
}));
import { SchoolEventsList } from "../../components/gakku/SchoolEventsList";

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); hooks.setNow.mockClear(); });
describe("live school-date refresh without network", () => {
  it("refreshes exactly at the official start, not at an earlier reception time", () => {
    vi.useFakeTimers();
    // Seishi: reception 13:30 JST, briefing starts 14:00 JST.
    vi.setSystemTime(new Date("2027-01-27T04:29:59.000Z"));
    vi.stubGlobal("document", new EventTarget()); vi.stubGlobal("window", new EventTarget());
    SchoolEventsList({ locale: "ja", school: "seishi", initialNow: "2027-01-27T04:00:00.000Z" });
    const cleanup = hooks.effect!();
    expect(hooks.setNow).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1_000);
    expect(hooks.setNow).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(30 * 60_000 + 25);
    expect(hooks.setNow).toHaveBeenLastCalledWith("2027-01-27T05:00:00.025Z");
    expect(vi.getTimerCount()).toBe(1);
    cleanup();
  });

  it("refreshes stale SSR on mount, at JST midnight, on focus, and cleans up", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-21T14:59:59.000Z"));
    const doc = new EventTarget(); const win = new EventTarget();
    vi.stubGlobal("document", doc); vi.stubGlobal("window", win);
    SchoolEventsList({ locale: "ja", initialNow: "2026-11-18T00:00:00Z", limit: 3 });
    const cleanup = hooks.effect!();
    expect(hooks.setNow).toHaveBeenLastCalledWith("2026-11-21T14:59:59.000Z");
    vi.advanceTimersByTime(1025);
    expect(hooks.setNow).toHaveBeenLastCalledWith("2026-11-21T15:00:00.025Z");
    vi.setSystemTime(new Date("2026-11-28T15:01:00Z"));
    win.dispatchEvent(new Event("focus"));
    expect(hooks.setNow).toHaveBeenLastCalledWith("2026-11-28T15:01:00.000Z");
    doc.dispatchEvent(new Event("visibilitychange"));
    expect(vi.getTimerCount()).toBe(1);
    cleanup(); const calls = hooks.setNow.mock.calls.length;
    expect(vi.getTimerCount()).toBe(0);
    win.dispatchEvent(new Event("focus")); doc.dispatchEvent(new Event("visibilitychange"));
    expect(hooks.setNow).toHaveBeenCalledTimes(calls);
  });
});
