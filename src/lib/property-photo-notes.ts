/** Public photo notes are authored in a dedicated section of each translated description. */
export function propertyPhotoNotes(description: string): string | undefined {
  const headings = new Set(["写真について", "About the photos", "關於照片", "关于照片"]);
  const lines = description.split(/\r?\n/);
  const start = lines.findIndex((line) => headings.has(line.replace(/^##\s+/, "").trim()) && /^##\s+/.test(line));
  if (start < 0) return undefined;
  const end = lines.findIndex((line, index) => index > start && /^#{1,2}\s+/.test(line));
  return lines.slice(start + 1, end < 0 ? undefined : end).join("\n").trim() || undefined;
}
