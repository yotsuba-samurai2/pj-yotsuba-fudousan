import { describe, expect, it } from "vitest";
import { propertyPhotoNotes } from "../property-photo-notes";

describe("public photo notes", () => {
  it.each(["写真について", "About the photos", "關於照片", "关于照片"])("preserves the %s section without adjacent content", (heading) => {
    expect(propertyPhotoNotes(`intro\n\n## ${heading}\nFurniture is not included.\nShooting date is unknown.\n\n## Other\nnot a photo note`))
      .toBe("Furniture is not included.\nShooting date is unknown.");
  });
  it("does not invent a notice when none is authored", () => {
    expect(propertyPhotoNotes("Regular property description")).toBeUndefined();
    expect(propertyPhotoNotes("## 写真について\n\n## 概要\n価格")).toBeUndefined();
  });
});
