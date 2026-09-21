import { describe, expect, it } from "vitest";
import { propertyVideos } from "../property-videos";

describe("propertyVideos", () => {
  it("embeds explicit public YouTube links and deduplicates aliases", () => {
    expect(propertyVideos("[Style preview](https://www.youtube.com/watch?v=abcdefghijk)\n[Same](https://youtu.be/abcdefghijk?t=3)"))
      .toEqual([{ id: "abcdefghijk", title: "Style preview" }]);
  });
  it.each([
    "https://youtube.com.evil.example/watch?v=abcdefghijk",
    "https://evil.example/abcdefghijk",
    "https://user:secret@youtube.com/watch?v=abcdefghijk",
    "https://youtube.com:8443/watch?v=abcdefghijk",
    "http://youtube.com/watch?v=abcdefghijk",
    "https://youtube.com/watch?v=short",
    "https://youtu.be/abcdefghijk/extra",
    "javascript:alert(1)",
  ])("does not embed unsupported or unsafe URL %s", (url) => {
    expect(propertyVideos(`[Video](${url})`)).toEqual([]);
  });
  it("does not infer a video from a bare URL", () => {
    expect(propertyVideos("https://www.youtube.com/watch?v=abcdefghijk")).toEqual([]);
  });
});
