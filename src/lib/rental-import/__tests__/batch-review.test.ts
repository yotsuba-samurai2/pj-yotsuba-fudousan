import { describe, expect, it, vi } from "vitest";
import { applyWithReceipt, inspectReceipt, acknowledgeReadback, runReviewedBatch, intentDigest, batchAssets, operatorReceipts, summaryReport, type BatchResult, type ReceiptStore } from "../batch-review";

const slug = "rent-" + "a".repeat(24);
const slug2 = "rent-" + "b".repeat(24);
const tag = "0".repeat(64), nextTag = "1".repeat(64);
const ready = (s = slug): BatchResult => ({ action: "ready", slug: s });
const memory = () => {
  const data = new Map<string, string>();
  const store: ReceiptStore = { getItem: k => data.get(k) ?? null, setItem: (k,v) => { data.set(k,v); }, removeItem: k => { data.delete(k); } };
  return { data, store };
};
const OK = () => Promise.resolve({ ok:true, status:200, body:{action:"updated",slug} });
const request = (store: ReceiptStore, send = OK, intent=tag) => applyWithReceipt({ store, slug, intent, closing:false, send });
describe("既存賃貸取込のバッチ反映", () => {
  it("最初に保留だった行は書込時の再チェックすらせず、通過した行だけ処理", async () => {
    const check = vi.fn(async (index:number) => ready(index===1 ? slug2 : slug));
    const apply = vi.fn(async () => ({action:"updated", slug:slug2}));
    const approved = [{action:"held"}, ready(slug2)];
    const out = await runReviewedBatch({records:[0,1], approved, check, apply});
    expect(check.mock.calls).toEqual([[1]]); expect(apply).toHaveBeenCalledOnce();
    expect(out.map(x=>x.action)).toEqual(["held","updated"]);
  });
  it("直前の種別変更・別号室・未審査・重複slugは送らない", async () => {
    const apply=vi.fn(); const checked=[{action:"ready-close",slug},ready(slug),ready(slug2)];
    const changes=await runReviewedBatch({ records:[0,1,2], approved:[ready(),ready(slug2)], check:async i=>checked[i], apply});
    expect(changes.every(r=>r.action==="held")).toBe(true);
    const duplicate=await runReviewedBatch({records:[0,1],approved:[ready(),ready()],check:async()=>ready(),apply});
    expect(duplicate.every(r=>r.action==="held")).toBe(true); expect(apply).not.toHaveBeenCalled();
  });
  it("一行失敗しても次を進め、読取だけの回は書かない", async () => {
    const apply=vi.fn(); const progress=vi.fn();
    const out=await runReviewedBatch({records:[0,1],check:async n=>{if(n===0)throw Error("要確認"); return ready(slug2);},apply,onProgress:progress});
    expect(out.map(r=>r.action)).toEqual(["held","ready"]); expect(apply).not.toHaveBeenCalled(); expect(progress).toHaveBeenCalledTimes(2);
  });
});
describe("物件保存の応答と再開", () => {
  it("書込前に非公開情報なしの印を保存、正常応答済みの同じ意図は再送しない", async () => {
    const {store,data}=memory(); const send=vi.fn(async()=>{expect(inspectReceipt(store,slug,tag)?.action).toBe("readback_required");return OK();});
    expect((await request(store,send)).action).toBe("updated"); expect((await request(store,send)).action).toBe("previously_saved"); expect(send).toHaveBeenCalledTimes(1);
    expect(JSON.stringify([...data])).not.toContain("https:"); expect(inspectReceipt(store,slug,nextTag)).toBeNull();
  });
  it("503の保存成功を通常の保留や再送対象にしない。別入力でも読戻し前は止める", async () => {
    const {store}=memory(); const send=vi.fn(async()=>({ok:false,status:503,body:{mutationSucceeded:true,publicationRefresh:"failed",error:"private"}}));
    expect((await applyWithReceipt({store,slug,intent:tag,closing:false,send})).action).toBe("saved_refresh_pending");
    expect(inspectReceipt(store,slug,nextTag)?.action).toBe("saved_refresh_pending");
    const next=vi.fn(OK); expect((await request(store,next,nextTag)).action).toBe("saved_refresh_pending"); expect(next).not.toHaveBeenCalled();
  });
  it("返答喪失・不正応答は保留と区別。リロード相当の新しい呼出しでも送らない", async () => {
    for(const send of [async()=>{throw Error("private transport");},async()=>({ok:true,status:200,body:{} }),async()=>({ok:true,status:200,body:{action:"closed",slug}})]){
      const {store}=memory(); const first=await applyWithReceipt({store,slug,intent:tag,closing:false,send});
      expect(first.action).toBe("readback_required"); const next=vi.fn(OK); expect((await request(store,next)).action).toBe("readback_required"); expect(next).not.toHaveBeenCalled();
    }
  });
  it("明示照合は見たときの不明印にだけ作用し、元入力の再送は禁止、異なる入力は新規審査", async () => {
    const {store}=memory(); const out=await applyWithReceipt({store,slug,intent:tag,closing:false,send:async()=>{throw Error();}});
    expect(acknowledgeReadback(store,slug,nextTag)).toBe(false); expect(acknowledgeReadback(store,slug,out.receiptIntent!)).toBe(true);
    const next=vi.fn(OK); expect((await request(store,next)).action).toBe("already_reviewed"); expect(next).not.toHaveBeenCalled(); expect(inspectReceipt(store,slug,nextTag)).toBeNull();
  });
  it("保存前の根拠不足・認証拒否の確定応答なら再検査できる", async () => {
    for(const resp of [{ok:true,status:200,body:{action:"held",reasons:["確認待ち"]}},{ok:false,status:401,body:{error:"再ログイン"}}]){
      const {store}=memory();const result=await applyWithReceipt({store,slug,intent:tag,closing:false,send:async()=>resp});
      expect(result.action).toBe("held"); expect(inspectReceipt(store,slug,tag)).toBeNull();
    }
  });
  it("印の保存不可や不正なslug・壊れた記録は書込せず、成功後の記録障害は保存済みを見失わない", async () => {
    const send=vi.fn(OK); const {store,data}=memory(); const blocked={...store,setItem:()=>{throw Error();}};
    expect((await request(blocked,send)).action).toBe("held"); expect((await applyWithReceipt({store,slug:"unsafe",intent:tag,closing:false,send})).action).toBe("held"); expect(send).not.toHaveBeenCalled();
    const flaky={...store,setItem:(k:string,v:string)=>{if(data.size)throw Error();store.setItem(k,v);}};
    expect((await request(flaky,send)).action).toBe("saved_readback_required"); expect(inspectReceipt(store,slug,nextTag)?.action).toBe("readback_required");
    data.set([...data.keys()][0],"not JSON"); expect((await request(store,send)).action).toBe("held"); expect(send).toHaveBeenCalledTimes(1);
  });
  it("確定済みの別意図から新しい試行が保留になっても元の成功印を消さない", async()=>{
    const {store}=memory(); await request(store);
    await applyWithReceipt({store,slug,intent:nextTag,closing:false,send:async()=>({ok:true,status:200,body:{action:"held"}})});
    expect(inspectReceipt(store,slug,tag)?.action).toBe("previously_saved");
  });
});
it("入力意図はキー順で変わらず、出力報告に元データ・理由・資格情報・公開完了を入れない",async()=>{
  const a=await intentDigest({a:1,b:2},"draft","new");
  expect(a).toBe(await intentDigest({b:2,a:1},"draft","new")); expect(a).not.toBe(await intentDigest({a:1,b:2},"published","new"));
  const report=summaryReport({startedAt:"2026-11-21T12:00:00Z",mode:"draft",operation:"new",stage:"apply",total:3,results:[{action:"created",slug,reasons:["private"]},{action:"saved_refresh_pending",slug:"unsafe-private"}]});
  expect(report.rows.map(r=>r.action)).toEqual(["created","saved_refresh_pending","not_observed"]); expect(JSON.stringify(report)).not.toContain("private"); expect(report.publicReadback).toBe("not_verified"); expect(report.medium).toBe("yotsuba");
});

it("別の更新を完了後も既に送った業務入力は再送しない",async()=>{
  const {store}=memory(); await request(store); await request(store,OK,nextTag);
  const next=vi.fn(OK); expect((await request(store,next)).action).toBe("previously_saved"); expect(next).not.toHaveBeenCalled();
});
it("同名画像の内容差を意図に含める。欠落・衝突・過大は画像送信前に保留、終了には画像不要",async()=>{
  const photo=(text:string)=>new File([text],"photo.jpg");
  const data={property:{images:[{url:"asset:photo.jpg"}]}}, old=batchAssets([photo("A")]), newer=batchAssets([photo("B")]);
  const a=await old.signature(data,"published","new",false);
  expect(a).not.toBe(await newer.signature(data,"published","new",false));
  await expect(batchAssets([]).signature(data,"published","new",false)).rejects.toThrow();
  await expect(batchAssets([photo("A"),photo("B")]).signature(data,"published","new",false)).rejects.toThrow();
  const huge={name:"photo.jpg",size:11*1024*1024,arrayBuffer:vi.fn()};
  await expect(batchAssets([huge]).signature(data,"published","new",false)).rejects.toThrow(); expect(huge.arrayBuffer).not.toHaveBeenCalled();
  await expect(batchAssets([]).signature(data,"draft","close",true)).resolves.toMatch(/^[a-f0-9]{64}$/);
});

it("同じタブの他操作者・偽IDは送信記録を引き継がない",async()=>{
  const {store}=memory(), own=operatorReceipts(store,"staff-a"), other=operatorReceipts(store,"staff-b");
  await request(own); expect(inspectReceipt(own,slug,tag)?.action).toBe("previously_saved");
  expect(inspectReceipt(other,slug,tag)).toBeNull(); expect(()=>operatorReceipts(store,"unsafe/token")).toThrow();
});
it("確定応答に別の型のslugがあれば結果不明。明示的な保存済みを未保存には変更しない",async()=>{
  for(const bad of ["",false,0,null]){
    const {store}=memory(); const r=await applyWithReceipt({store,slug,intent:tag,closing:false,send:async()=>({ok:true,status:200,body:{action:"held",slug:bad}})});
    expect(r.action).toBe("readback_required"); expect(acknowledgeReadback(store,slug,tag,"confirmed_not_saved")).toBe(true); expect(inspectReceipt(store,slug,tag)?.action).toBe("already_reviewed");
  }
  const {store}=memory(); await applyWithReceipt({store,slug,intent:tag,closing:false,send:async()=>({ok:false,status:503,body:{mutationSucceeded:true,publicationRefresh:"failed"}})});
  expect(acknowledgeReadback(store,slug,tag,"confirmed_not_saved")).toBe(false);
});
it("同じ素材を写真・間取り両方として入れた候補は送信前に保留",async()=>{
  const source={property:{images:[{url:"asset:one.jpg",kind:"photo"},{url:"asset:one.jpg",kind:"floorplan"}]}};
  const file=new File(["photo"],"one.jpg"); await expect(batchAssets([file]).signature(source,"published","new",false)).rejects.toThrow("兼用");
});
