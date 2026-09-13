import { describe, expect, it, vi } from "vitest";
import { scheduleBrandFonts } from "../schedule-brand-fonts";

function page(complete = false, supportsIdle = true) {
  let id = 0;
  const frames = new Map<number, FrameRequestCallback>();
  const idle = new Map<number, IdleRequestCallback>();
  const browser = Object.assign(new EventTarget(), {
    document: { readyState: complete ? "complete" : "loading" },
    requestAnimationFrame: (callback: FrameRequestCallback) => { frames.set(++id, callback); return id; },
    cancelAnimationFrame: (key: number) => frames.delete(key),
    requestIdleCallback: supportsIdle ? (callback: IdleRequestCallback) => { idle.set(++id, callback); return id; } : undefined,
    cancelIdleCallback: (key: number) => idle.delete(key),
  });
  const frame = () => {
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach(callback => callback(0));
  };
  return {
    browser: browser as unknown as Window,
    loaded: () => browser.dispatchEvent(new Event("load")),
    frame,
    paint: () => { frame(); frame(); },
    idle: () => {
      const callbacks = [...idle.values()];
      idle.clear();
      callbacks.forEach(callback => callback({ didTimeout: false, timeRemaining: () => 50 }));
    },
  };
}

describe("decorative font scheduling", () => {
  it("lets eager images load and paint before requesting fonts on mobile labor pages", () => {
    const p = page();
    const load = vi.fn();
    scheduleBrandFonts(load, true, p.browser);
    p.paint(); p.idle();
    expect(load).not.toHaveBeenCalled();
    p.loaded(); p.paint();
    expect(load).not.toHaveBeenCalled();
    p.idle();
    expect(load).toHaveBeenCalledOnce();
  });

  it("still loads when hydration finishes after the load event", () => {
    const p = page(true);
    const load = vi.fn();
    scheduleBrandFonts(load, true, p.browser);
    p.paint(); p.idle();
    expect(load).toHaveBeenCalledOnce();
  });

  it("preserves the two-frame behavior for desktop and other sites", () => {
    const p = page();
    const load = vi.fn();
    scheduleBrandFonts(load, false, p.browser);
    p.frame();
    expect(load).not.toHaveBeenCalled();
    p.frame();
    expect(load).toHaveBeenCalledOnce();
  });

  it("works without requestIdleCallback", () => {
    const p = page(true, false);
    const load = vi.fn();
    scheduleBrandFonts(load, true, p.browser);
    p.paint();
    expect(load).toHaveBeenCalledOnce();
  });

  for (const phase of ["load", "paint", "idle"] as const) {
    it(`cancels a stale route or Strict Mode effect while waiting for ${phase}`, () => {
      const p = page();
      const load = vi.fn();
      const cancel = scheduleBrandFonts(load, true, p.browser);
      if (phase !== "load") p.loaded();
      if (phase === "idle") p.paint();
      cancel();
      p.loaded(); p.paint(); p.idle();
      expect(load).not.toHaveBeenCalled();
    });
  }
});
