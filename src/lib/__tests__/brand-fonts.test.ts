import { describe, expect, it, vi } from "vitest";
import { prepareBrandFontSwap } from "@/lib/brand-fonts";

const families = { serif: '"Noto Serif JP"', sans: '"Noto Sans JP"' };

describe("brand font readiness", () => {
  it("keeps the swap pending until both families and all weights are ready", async () => {
    const resolvers: (() => void)[] = [];
    const load = vi.fn(() => new Promise<FontFace[]>(resolve => {
      resolvers.push(() => resolve([]));
    }));
    let ready = false;
    const pending = prepareBrandFontSwap(new Map([
      ["serif:700", "四葉事務所"],
      ["sans:400", "繁體中文简体English"],
      ["sans:600", "予約"],
    ]), families, { load }).then(() => { ready = true; });
    expect(load).toHaveBeenCalledWith('400 16px "Noto Sans JP"', "繁體中文简体English");
    resolvers[0]();
    resolvers[1]();
    await Promise.resolve();
    expect(ready).toBe(false);
    resolvers[2]();
    await pending;
    expect(ready).toBe(true);
  });

  it("does not signal readiness after a failed slice download", async () => {
    const load = vi.fn().mockRejectedValue(new Error("Font download failed"));
    await expect(prepareBrandFontSwap(new Map([["serif:600", "相談"]]), families, { load }))
      .rejects.toThrow("Font download failed");
  });

  it("does not download a font family with no matching text", async () => {
    const load = vi.fn().mockResolvedValue([]);
    await prepareBrandFontSwap(new Map(), families, { load });
    expect(load).not.toHaveBeenCalled();
  });
});
