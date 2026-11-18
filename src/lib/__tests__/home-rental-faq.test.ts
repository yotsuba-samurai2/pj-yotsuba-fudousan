import { readFileSync } from "node:fs";
import ts from "typescript";
import { describe, expect, it } from "vitest";

// Read the actual homepage copy without invoking server dependencies or a database.
const source = ts.createSourceFile(
  "HomePageContent.tsx",
  readFileSync("src/app/[locale]/(realestate)/HomePageContent.tsx", "utf8"),
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
const answers = new Map<string, string>();
function visit(node: ts.Node) {
  if (ts.isObjectLiteralExpression(node)) {
    const fields = new Map<string, string>();
    for (const property of node.properties) {
      if (ts.isPropertyAssignment(property) && ts.isIdentifier(property.name) && ts.isStringLiteral(property.initializer)) {
        fields.set(property.name.text, property.initializer.text);
      }
    }
    if (fields.has("q") && fields.has("a")) answers.set(fields.get("q")!, fields.get("a")!);
  }
  ts.forEachChild(node, visit);
}
visit(source);

const cases = [
  ["ja", "外国人でも日本で部屋を借りられますか？", "必要な書類や審査・保証の条件は物件ごとに異なります。日本語・英語・中国語でご案内します。"],
  ["en", "Can foreign residents rent a home in Japan?", "Required documents, tenant screening and guarantor requirements vary by property. We provide guidance in Japanese, English and Chinese."],
  ["zh-tw", "外國人也能在日本租屋嗎？", "所需文件、入住審查及保證條件因物件而異。我們提供日語、英語及中文的說明與協助。"],
  ["zh", "外国人也能在日本租房吗？", "所需文件、入住审核及担保条件因房源而异。我们提供日语、英语及中文的说明与协助。"],
];

describe("homepage rental FAQ translation parity", () => {
  it.each(cases)("keeps property-specific requirements and only the stated languages in %s", (_locale, question, expected) => {
    expect(answers.get(question)).toBe(expected);
    expect(answers.get(question)).not.toMatch(/your own language|mother tongue|母語|母语|跨過|跨过|guaranteed|必ず/);
  });
});
