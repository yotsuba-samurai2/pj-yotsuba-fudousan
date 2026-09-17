import { describe, it, expect } from "vitest";
import { isLikelyAutomation, AUTOMATION_UA_PATTERN } from "../ga-bot-guard";

const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const ANDROID_CHROME =
  "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36";
const MAC_CHROME =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
const LINE_INAPP = IPHONE + " Line/14.10.0/IAB";
const CUBOT_PHONE =
  "Mozilla/5.0 (Linux; Android 13; CUBOT NOTE 30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

describe("GA4 自動化トラフィック判定：人のブラウザは通す", () => {
  it.each([IPHONE, ANDROID_CHROME, MAC_CHROME, LINE_INAPP])("%s", (ua) => {
    expect(isLikelyAutomation(ua, false)).toBe(false);
    expect(isLikelyAutomation(ua, undefined)).toBe(false);
  });
  it("『bot』を含むスマホブランド（CUBOT）を巻き込まない", () => {
    expect(isLikelyAutomation(CUBOT_PHONE, false)).toBe(false);
  });
});

describe("GA4 自動化トラフィック判定：機械は止める", () => {
  it("navigator.webdriver=true は UA が普通でも止める（Puppeteer/Playwright/Selenium の既定）", () => {
    expect(isLikelyAutomation(MAC_CHROME, true)).toBe(true);
  });
  it("UA が空は止める", () => {
    expect(isLikelyAutomation("", false)).toBe(true);
    expect(isLikelyAutomation(undefined, false)).toBe(true);
  });
  it.each([
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/126.0.0.0 Safari/537.36",
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (compatible; Bytespider; spider-feedback@bytedance.com)",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
    "Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
    "Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)",
    "Mozilla/5.0 (compatible; SemrushBot/7~bl; +http://www.semrush.com/bot.html)",
    "Mozilla/5.0 (compatible; PetalBot;+https://webmaster.petalsearch.com/site/petalbot)",
    "python-requests/2.32.3",
    "Go-http-client/2.0",
    "curl/8.7.1",
    "Scrapy/2.11 (+https://scrapy.org)",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36 Chrome-Lighthouse",
  ])("%s", (ua) => {
    expect(isLikelyAutomation(ua, false)).toBe(true);
  });
});

describe("インラインスクリプトへの埋め込み", () => {
  it("正規表現の source に改行・バッククォートを含まない（テンプレート文字列へ安全に埋め込める）", () => {
    expect(AUTOMATION_UA_PATTERN.source).not.toMatch(/[\n`]/);
    expect(AUTOMATION_UA_PATTERN.flags).toBe("i");
  });
});
