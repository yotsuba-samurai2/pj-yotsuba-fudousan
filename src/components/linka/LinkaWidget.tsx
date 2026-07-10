"use client";
// フェーズK-3｜LINKA会話ウィジェット＝assistant-ui外枠（Thread/Composer＋useExternalStoreRuntime）
// 設計書§2：外枠のみassistant-ui。結果の中身（ResultView）は独自描画のカスタム本文。
// AIはサーバ（POST /api/linka）のみ＝クライアントにキー・名簿を置かない。
// ⚠️ クライアント側のUI文言に社労士事務所名を置かない（バンドル漏れ防止＝laborは汎用文言）。
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import {
  AssistantRuntimeProvider,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  useExternalStoreRuntime,
  useMessage,
  type AppendMessage,
  type ThreadMessageLike,
} from "@assistant-ui/react";
import { LinkaAvatar } from "./LinkaAvatar";
import { ResultView } from "./ResultView";
import type { LinkaResult, LinkaSite, Summary } from "@/lib/linka/types";

type LocalMsg = { id: string; role: "user" | "assistant"; text?: string; result?: LinkaResult };

// クライアント側UIコピー（挨拶・チップ）。laborは事務所名を含めない汎用文（バンドル漏れ防止）。
const UI_COPY: Record<LinkaSite, { greeting: string; chips: string[] }> = {
  samurai: {
    greeting: "こんにちは、リンカです。どんなことでお困りか、教えてください。",
    chips: ["外国人の従業員のビザ更新が不安", "親が残した実家の相続をどうすれば", "起業したいが手続きが分からない"],
  },
  realestate: {
    greeting:
      "こんにちは、四葉不動産のLINKAです。相続の不動産・投資や事業用・お部屋探しなど、まずはお気軽にどうぞ。分野の見当と、四葉のご案内先をお示しします。",
    chips: ["相続の相談", "投資・事業用を探す", "お部屋探し", "外国人・多言語"],
  },
  legal: {
    greeting:
      "こんにちは、四葉行政書士事務所のLINKAです。障害福祉の指定・GH、在留資格・ビザ、相続、会社設立、補助金など、分野の見当と当事務所のご案内先をお示しします。",
    chips: ["障害福祉(指定/GH)", "在留資格・ビザ", "相続", "会社設立", "補助金"],
  },
  labor: {
    greeting: "こんにちは、LINKAです。処遇改善加算、介護・福祉の労務、雇用助成金、外国人雇用、障害年金など、分野の見当とご案内先をお示しします。",
    chips: ["処遇改善加算", "介護・福祉労務", "雇用助成金", "外国人雇用", "障害年金"],
  },
};

const MEMBER_GREETING =
  "こんにちは、リンカです。士業ドットコムのメンバーですね。どんな協力者をお探しですか?候補を複数お調べして、照会文の下書きまでお手伝いします。";
const CUSTOMER_GREETING =
  "こんにちは、リンカです。どんなことでお困りか、教えてください。関わりそうな分野の見当と、対応できる専門家を、いくつかご案内しますね。";
const MEMBER_CHIPS = ["在留資格に強い方を探しています", "国際相続に対応できる方は?", "文京区で会社設立を手伝える方"];

const INQUIRY_TYPES = [
  { key: "a" as const, label: "協力打診", desc: "関心の有無を聞く" },
  { key: "b" as const, label: "空き確認", desc: "受任余力を聞く" },
  { key: "c" as const, label: "分野確認", desc: "取扱の有無を聞く" },
];

const ResultsContext = createContext<{
  results: Record<string, LinkaResult>;
  isCust: boolean;
  selected: string | null;
  onSelect: (id: string) => void;
}>({ results: {}, isCust: false, selected: null, onSelect: () => {} });

function AssistantMessage() {
  const id = useMessage((m) => m.id);
  const ctx = useContext(ResultsContext);
  const result = ctx.results[id];
  return (
    <div className="flex items-start gap-2">
      <LinkaAvatar size={32} />
      <div className="min-w-0 flex-1 space-y-3">
        {result ? (
          <ResultView result={result} isCust={ctx.isCust} selected={ctx.selected} onSelect={ctx.onSelect} />
        ) : (
          <div className="inline-block rounded-2xl rounded-tl-sm border border-stone-200 bg-white px-4 py-2.5 text-sm leading-relaxed text-stone-700">
            <MessagePrimitive.Parts />
          </div>
        )}
      </div>
    </div>
  );
}

function UserMessage() {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-primary-tint px-4 py-2.5 text-sm text-stone-800">
        <MessagePrimitive.Parts />
      </div>
    </div>
  );
}

export function LinkaWidget({
  site,
  mode,
  className = "",
  greeting: greetingProp,
  chips: chipsProp,
}: {
  site: LinkaSite;
  mode: "member" | "customer" | "concierge";
  className?: string;
  /** 挨拶の上書き（例：不動産トップのインライン60秒診断＝ロケール別の挨拶を渡す） */
  greeting?: string;
  /** クイックチップの上書き（ロケール別） */
  chips?: string[];
}) {
  const isCust = site === "samurai" && mode === "customer";
  const greeting =
    greetingProp ??
    (site === "samurai" ? (mode === "customer" ? CUSTOMER_GREETING : MEMBER_GREETING) : UI_COPY[site].greeting);
  const chips =
    chipsProp ?? (site === "samurai" ? (mode === "customer" ? UI_COPY.samurai.chips : MEMBER_CHIPS) : UI_COPY[site].chips);

  const idSeq = useRef(0);
  const nextId = () => `m${++idSeq.current}`;
  const [messages, setMessages] = useState<LocalMsg[]>([{ id: "m0", role: "assistant", text: greeting }]);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<Record<string, LinkaResult>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [inqType, setInqType] = useState<"a" | "b" | "c">("a");
  const [draft, setDraft] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [copied, setCopied] = useState(false);
  const lastSummary = useRef<Summary | undefined>(undefined);

  const sendMessage = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q || isRunning) return;
      setMessages((prev) => [...prev, { id: nextId(), role: "user", text: q }]);
      setIsRunning(true);
      setSelected(null);
      setDraft("");
      try {
        const res = await fetch("/api/linka", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ site, mode, message: q }),
        });
        const result: LinkaResult = res.ok
          ? await res.json()
          : { type: "clarify", message: "接続に失敗しました。時間をおいてもう一度お試しください。" };
        if ("summary" in result) lastSummary.current = result.summary;
        const id = nextId();
        setResults((prev) => ({ ...prev, [id]: result }));
        setMessages((prev) => [...prev, { id, role: "assistant" }]);
      } finally {
        setIsRunning(false);
      }
    },
    [isRunning, site, mode],
  );

  const onNew = useCallback(
    async (m: AppendMessage) => {
      const text = m.content
        .map((p) => (p.type === "text" ? p.text : ""))
        .join("")
        .trim();
      await sendMessage(text);
    },
    [sendMessage],
  );

  const convertMessage = useCallback(
    (m: LocalMsg): ThreadMessageLike => ({ id: m.id, role: m.role, content: m.text ?? " " }),
    [],
  );

  const runtime = useExternalStoreRuntime({ messages, isRunning, onNew, convertMessage });

  const makeDraft = async () => {
    if (!selected || drafting) return;
    setDrafting(true);
    setDraft("");
    setCopied(false);
    try {
      const res = await fetch("/api/linka/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: selected, inqType, summary: lastSummary.current }),
      });
      const json = await res.json();
      setDraft(typeof json.draft === "string" ? json.draft : "");
    } catch {
      setDraft("");
    }
    setDrafting(false);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  const selectedCard = useMemo(() => {
    if (!selected) return null;
    for (const r of Object.values(results)) {
      if (r.type === "candidates" || r.type === "triage") {
        const c = r.candidates.find((x) => x.id === selected);
        if (c) return c;
      }
    }
    return null;
  }, [selected, results]);

  const ctxValue = useMemo(
    () => ({ results, isCust, selected, onSelect: (id: string) => { setSelected(id); setDraft(""); } }),
    [results, isCust, selected],
  );

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <ResultsContext.Provider value={ctxValue}>
        <div className={"flex h-full min-h-0 flex-col bg-bg " + className}>
          <ThreadPrimitive.Root className="flex min-h-0 flex-1 flex-col">
            <ThreadPrimitive.Viewport className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
              <ThreadPrimitive.Messages components={{ UserMessage, AssistantMessage }} />
              {isRunning && (
                <div className="flex items-center gap-2 text-sm text-stone-500">
                  <LinkaAvatar size={28} talking />
                  <span>確認しています…</span>
                </div>
              )}

              {/* 会員モード：照会文パネル（送信はご自身から＝LINKAは送らない） */}
              {selectedCard && site === "samurai" && mode === "member" && (
                <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold text-stone-800">{selectedCard.name} 先生への照会文を作る</div>
                  <div className="flex gap-2">
                    {INQUIRY_TYPES.map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setInqType(t.key)}
                        className={
                          "flex-1 rounded-lg border px-2 py-2 text-xs " +
                          (inqType === t.key ? "border-primary bg-primary text-white" : "border-stone-300 bg-white text-stone-700")
                        }
                      >
                        <div className="font-semibold">{t.label}</div>
                        <div className={inqType === t.key ? "text-white/70" : "text-stone-400"}>{t.desc}</div>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={makeDraft}
                    disabled={drafting}
                    className="w-full rounded-lg border border-primary py-2.5 text-sm font-semibold text-primary disabled:opacity-40"
                  >
                    {drafting ? "下書きを作成しています…" : "下書きを作成"}
                  </button>
                  {draft && (
                    <div className="space-y-2">
                      <div className="whitespace-pre-wrap rounded-lg border border-stone-200 bg-stone-50 p-3 font-serif text-sm text-stone-800">
                        {draft}
                      </div>
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={copy} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
                          {copied ? "コピーしました" : "本文をコピー"}
                        </button>
                        <span className="text-xs text-stone-500">送信はご自身から。実運用ではオプトイン取得後の会員のみに照会します。</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 一般相談モード：予約導線（受任判断・契約は専門家と直接＝仲介手数料なし） */}
              {selectedCard && isCust && (
                <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold text-stone-800">{selectedCard.name} 先生に相談を申し込む</div>
                  <div className="text-xs leading-relaxed text-stone-600">
                    samurai.co.jp のプロフィールページから、オンライン・電話・対面での相談を予約できます。受任するかどうかは専門家ご本人が判断し、契約と費用は専門家との間で直接取り決めます。士業ドットコムは仲介手数料を受け取りません。
                  </div>
                  <a
                    href={selectedCard.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full rounded-lg bg-primary py-2.5 text-center text-sm font-semibold text-white"
                  >
                    samurai.co.jp で相談を予約する
                  </a>
                </div>
              )}
            </ThreadPrimitive.Viewport>

            {/* コンポーザー（assistant-ui・⌘/Ctrl+Enter送信は標準） */}
            <div className="border-t border-border bg-surface">
              <div className="space-y-2 px-4 py-3">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {chips.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => sendMessage(c)}
                      disabled={isRunning}
                      className="flex-shrink-0 rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-600 disabled:opacity-40"
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <ComposerPrimitive.Root className="flex items-end gap-2">
                  <ComposerPrimitive.Input
                    rows={2}
                    placeholder={
                      site === "samurai"
                        ? isCust
                          ? "お困りごとを匿名で(お名前・会社名は伏せてください)…"
                          : "お探しの協力者の条件を匿名で(分野・地域・規模感・時期)…"
                        : "お困りごとを匿名で入力…(⌘/Ctrl+Enterで送信)"
                    }
                    className="flex-1 resize-none rounded-xl border border-stone-300 p-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-focus"
                  />
                  <ComposerPrimitive.Send className="flex-shrink-0 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-40">
                    送信
                  </ComposerPrimitive.Send>
                </ComposerPrimitive.Root>
                <p className="text-[11px] leading-relaxed text-stone-500">
                  お名前・会社名など特定できる情報は入力しないでください。LINKAは分野の見当・
                  {site === "samurai" ? "専門家の候補" : "自社サービスや相談先"}
                  ・公開コラムのご案内までを行い、法律相談・法的判断はしません。回答の正確性・最新性は保証されません。ファシリテートは無償・中立で、順位付け・推薦は行いません。
                </p>
              </div>
            </div>
          </ThreadPrimitive.Root>
        </div>
      </ResultsContext.Provider>
    </AssistantRuntimeProvider>
  );
}
