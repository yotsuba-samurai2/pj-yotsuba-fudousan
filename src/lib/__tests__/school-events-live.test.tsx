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
