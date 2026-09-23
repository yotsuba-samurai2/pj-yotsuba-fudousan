import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Run ONLY inside the documented browser node_repl with an already claimed tab.
 * First observe current DOM and verify these selectors still identify the gallery.
 * The gallery must already be open. Never collect the 72×96 thumbnail strip.
 */
export async function collectEsSquareGallery(tab, { expectedCount, downloadDir, outputFile }) {
  if (!Number.isInteger(expectedCount) || expectedCount < 1 || expectedCount > 100) throw Error("Invalid gallery count");
  const collected = new Map();
  for (let turn = 0; turn <= expectedCount; turn++) {
    const slides = await tab.playwright.locator(".css-1sucic7 .swiper-slide").evaluateAll(elements => elements.map(e => {
      const img = e.querySelector("img");
      return { index: Number(e.getAttribute("data-swiper-slide-index")), src: img?.getAttribute("src"), width: img?.naturalWidth, height: img?.naturalHeight };
    }));
    if (!slides.length) throw Error("拡大ギャラリーが見つかりません。画面変更またはログイン切れを確認してください");
    for (const item of slides) {
      if (collected.has(item.index)) continue;
      if (!Number.isInteger(item.index) || item.index < 0 || item.index >= expectedCount) throw Error("Gallery index changed");
      if (!item.src || Math.min(item.width, item.height) < 400 || Math.max(item.width, item.height) < 640) continue;
      // Unique exact src is intentional: nth/all downloadMedia previously saved image 0 repeatedly.
      const locator = tab.playwright.locator(`.css-1sucic7 img[src=${JSON.stringify(item.src)}]`);
      if (await locator.count() !== 1) throw Error("拡大画像を一意に特定できません");
      if (!item.src.startsWith("blob:https://rent.es-square.net/")) throw Error("Download filename mapping needs review");
      const stem = item.src.split("/").pop();
      const before = new Set((await readdir(downloadDir)).filter(n => n.startsWith(stem)));
      await locator.downloadMedia();
      const created = (await readdir(downloadDir)).filter(n => n.startsWith(stem) && !before.has(n) && !n.endsWith(".crdownload"));
      if (created.length !== 1) throw Error(`画像${item.index}のダウンロード完了を確認できません`);
      collected.set(item.index, { ...item, file: join(downloadDir, created[0]) });
      await writeFile(outputFile, JSON.stringify([...collected.values()], null, 2), { mode: 0o600 });
    }
    if (collected.size === expectedCount) return [...collected.values()].sort((a,b) => a.index-b.index);
    await tab.playwright.locator(".css-1sucic7").getByTestId("keyboardArrowRight").click();
  }
  throw Error(`画像取得不足: ${collected.size}/${expectedCount}。サムネイルで補完しないでください`);
}

/** Fallback for invalid local API credentials. Does not save the property form. */
export async function uploadThroughAdmin(tab, entries, outputFile) {
  const uploaded = [];
  for (const entry of entries) {
    const before = await tab.playwright.locator("section img").evaluateAll(es => es.map(e => e.getAttribute("src")));
    // Attach rejection handler immediately; no unhandled chooser timeout/kernel reset.
    const pending = tab.playwright.waitForEvent("filechooser", { timeoutMs: 10000 }).then(chooser => ({ chooser }), error => ({ error }));
    await tab.playwright.getByText("＋画像をアップロード", { exact: true }).click();
    const result = await pending;
    if (!result.chooser) throw Error("ファイル選択を開けません");
    await result.chooser.setFiles([entry.file]);
    await tab.playwright.getByText("＋画像をアップロード", { exact: true }).waitFor({ state: "visible" });
    const after = await tab.playwright.locator("section img").evaluateAll(es => es.map(e => e.getAttribute("src")));
    const added = after.filter(url => !before.includes(url));
    if (added.length !== 1 || uploaded.some(i => i.url === added[0])) throw Error("アップロード結果が一意ではありません");
    uploaded.push({ ...entry, url: added[0] });
    await writeFile(outputFile, JSON.stringify(uploaded, null, 2), { mode: 0o600 });
  }
  return uploaded;
}
