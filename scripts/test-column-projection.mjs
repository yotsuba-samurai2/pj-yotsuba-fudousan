import { test } from "node:test";
import assert from "node:assert/strict";
import { compareProjection, constrainProjection, fixedLocalePolicy, displayedFaq, generatedArray, internalLink, registryRecords, supplementalSeedFile } from "./check-column-projection.mjs";
const block = (href = "/en/legal/column/example") => "## Questions\n\n" + [1,2,3,4].map(n => "**Q. Number " + n + "?**\nA. Answer " + n + (n === 1 ? " [details]("+href+")" : "") + ".").join("\n\n");
const source = b => "---\ntitle: Article\nexcerpt: Short\n---\n" + b;
const done = b => ({title:"Article",excerpt:"Short",content:b,faq:displayedFaq(b)});
const known = new Map([["legal:example",[{locales:[],translations:{en:{content:"Translated"}}}]]]);
test("complete projections compare actual question and answer text",()=>{const b=block();assert.deepEqual(compareProjection(source(b),"en",done(b),known).errors,[]); assert.equal(displayedFaq(b)[0].answer,"Answer 1 details.");});
test("correct count does not conceal a stale structured answer",()=>{const b=block(),r=done(b);r.faq[1].answer="stale";assert.ok(compareProjection(source(b),"en",r,known).errors.some(x=>x.includes("structured")));});
test("a syntactically localized href is not enough if destination lacks translated content",()=>{const b=block();for(const r of [{locales:["ja"],translations:{en:{content:"hidden"}}},{locales:[],translations:{en:{content:" "}}}]) assert.ok(compareProjection(source(b),"en",done(b),new Map([["legal:example",[r]]])).errors.some(x=>x.includes("no enabled")));});
test("an unknown possibly database-only target is reported without blocking known-good articles",()=>{const b=block();const r=compareProjection(source(b),"en",done(b),new Map());assert.equal(r.errors.length,0);assert.ok(r.warnings.length);});
test("missing translated record fails before content access",()=>assert.ok(compareProjection("","zh",undefined,known).errors.length));
test("wrong locale and non-equivalent generated metadata are found",()=>{const b=block("/zh/legal/column/example"),r=done(b);r.excerpt="different";const issues=compareProjection(source(b),"en",r,known).errors;assert.ok(issues.some(x=>x.includes("locale")));assert.ok(issues.some(x=>x.includes("excerpt")));});
test("separate headings, missing answers, external links, fragments and locale boundaries",()=>{assert.throws(()=>displayedFaq("no faq"));assert.throws(()=>displayedFaq(block()+"\n"+block()));assert.equal(displayedFaq(block().replace("A. Answer 2.","")).length,3);assert.equal(internalLink("#same","en"),null);assert.equal(internalLink("https://example.org/ja","en"),null);assert.equal(internalLink("/enough","en").matches,false);assert.equal(internalLink("https://luck428.com/zh-tw/legal/column/x/?q=1#x","zh-tw").base,"/legal/column/x");});
test("a malformed legacy seed is not invented as a JSON inventory",()=>{assert.equal(generatedArray("export const legacy = [...items]; // JS expression"),null);assert.deepEqual(generatedArray("export const MY_SEED: string[] = [];"),[]);});

test("only independently approved keys with proven source regressions are removed; other valid reviews survive",()=>{
  const before={reviews:[{key:"legal:bad"},{key:"legal:good"},{key:"labor:previous"}],held:[{key:"legal:bad",reasons:["independent concern"]},{key:"labor:unproven",reasons:["no source proof"]}]};
  const audit={errorsByKey:new Map([["legal:bad",["stale FAQ"]],["legal:good",[]],["labor:unproven",[]]])};
  const out=constrainProjection(before,["legal:good","legal:bad","labor:unproven"],audit);
  assert.deepEqual(out.reviews,[{key:"legal:good"},{key:"labor:previous"}]);
  assert.ok(out.held.find(r=>r.key==="legal:bad").reasons.includes("independent concern"));
  assert.ok(out.held.find(r=>r.key==="legal:bad").reasons.some(s=>s.includes("stale FAQ")));
  assert.deepEqual(out.held.find(r=>r.key==="labor:unproven").reasons,["no source proof"]);
  assert.equal(before.reviews.length,3);
});
test("an absent audit holds each affected candidate but cannot modify an unrelated approval",()=>{
  const result=constrainProjection({reviews:[{key:"check"},{key:"old"}],held:[]},["check","other"],undefined);
  assert.deepEqual(result.reviews,[{key:"old"}]);assert.deepEqual(result.held.map(x=>x.key),["check","other"]);
});

test("fixed pages retain declared locale availability and legal business prefix",()=>{
 const src='const STATIC_REALESTATE: StaticPage[] = [\n {path: "/office", locales:["ja"]},\n { path: "/contact", priority:1 },\n {path: "/funin",\n locales: ["ja", "zh-tw"]},\n {path: "/flags", locales: flags},\n];\nconst STATIC_LEGAL: StaticPage[] = [\n {path:"/example", locales:["ja"]},\n];';
 const policy=fixedLocalePolicy(src);
 const check=(href)=>compareProjection(source(block(href)),"en",done(block(href)),known,policy);
 assert.ok(check("/en/office").errors.some(x=>x.includes("does not publish")));
 assert.deepEqual(check("/en/contact").errors,[]);
 assert.ok(check("/en/funin").errors.length); assert.ok(policy.get("/funin").includes("zh-tw"));
 assert.ok(check("/en/legal/example").errors.length);
 assert.ok(check("/en/flags").warnings.length);
});

test("Japanese registry-only edits are detectable without executing generator source",()=>{
 const spec='  {\n    file: "01-item.md",\n    slug: "item",\n    title: "A",\n    excerpt:\n      "B",\n  },';
 const a=registryRecords(spec).get("item"), b=registryRecords(spec.replace('"A"','"C"')).get("item");
 assert.equal(a.file,"01-item.md"); assert.equal(a.title,"A"); assert.equal(a.excerpt,"B"); assert.notEqual(a.signature,b.signature);
 const c=registryRecords(spec.replace('"A"','dynamicTitle')).get("item"); assert.equal(c.title,undefined);
});
test("legacy part seeds can prove a translated destination is absent",()=>{
 for (const f of ["foo-seed.ts","gh-columns-seed-p2.ts","gh-columns-seed-p3b.ts"]) assert.equal(supplementalSeedFile(f),true);
 assert.equal(supplementalSeedFile("columns-autopublish-reviews.ts"),false);
});
