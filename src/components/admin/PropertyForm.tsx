"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/admin-api";
import type { LangCode } from "@/config/languages";
import {
  walkMinutes,
  scanPropertyText,
  defaultNextUpdateAt,
  DEAL_TYPE_LABELS,
  CATEGORY_LABELS,
  TRADE_MODE_LABELS,
  STATUS_LABELS,
  type AdminProperty,
  type PropertyInput,
  type PropertyStatus,
  type PropertyDealType,
  type PropertyCategory,
  type PropertyTradeMode,
  type PropertyAccess,
  type PropertyImage,
  type PropertySpec,
  type PropertyTranslation,
} from "@/lib/property-shared";

type Props = {
  initialData?: AdminProperty;
  onSubmit: (data: PropertyInput) => Promise<void>;
};

const translationTabs = [
  { code: "en", label: "EN" },
  { code: "zh-tw", label: "繁體" },
  { code: "zh", label: "简体" },
] as const;

type TranslationLang = (typeof translationTabs)[number]["code"];

const LOCALE_OPTIONS: { code: LangCode; label: string }[] = [
  { code: "ja", label: "日本語" },
  { code: "en", label: "EN" },
  { code: "zh-tw", label: "繁體" },
  { code: "zh", label: "简体" },
];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

const EMPTY_TRANS: PropertyTranslation = { title: "", description: "", locationText: "" };

/** 種別ごとの数値・文字列フィールドをフラットに持ち、送信時に spec へ組み立てる */
type SpecDraft = {
  landAreaSqm: string;
  privateRoadAreaSqm: string;
  buildingAreaSqm: string;
  landCategory: string;
  zoning: string;
  buildingCoverage: string;
  floorAreaRatio: string;
  legalRestrictions: string;
  isRowHouse: boolean;
  builtYm: string;
  deliveryYm: string;
  floors: string;
  floorLocated: string;
  exclusiveAreaSqm: string;
  balconyAreaSqm: string;
  managementFee: string;
  repairReserve: string;
  managementForm: string;
  managerWorkStyle: string;
  unitCount: string;
  unitAreaMinSqm: string;
  unitAreaMaxSqm: string;
  structure: string;
  leasehold: string;
};

function specToDraft(spec?: PropertySpec): SpecDraft {
  const s = (spec ?? {}) as Partial<Record<keyof SpecDraft, unknown>> & {
    isRowHouse?: boolean;
  };
  const str = (v: unknown) => (v === undefined || v === null ? "" : String(v));
  return {
    landAreaSqm: str(s.landAreaSqm),
    privateRoadAreaSqm: str(s.privateRoadAreaSqm),
    buildingAreaSqm: str(s.buildingAreaSqm),
    landCategory: str(s.landCategory),
    zoning: str(s.zoning),
    buildingCoverage: str(s.buildingCoverage),
    floorAreaRatio: str(s.floorAreaRatio),
    legalRestrictions: str(s.legalRestrictions),
    isRowHouse: Boolean(s.isRowHouse),
    builtYm: str(s.builtYm),
    deliveryYm: str(s.deliveryYm),
    floors: str(s.floors),
    floorLocated: str(s.floorLocated),
    exclusiveAreaSqm: str(s.exclusiveAreaSqm),
    balconyAreaSqm: str(s.balconyAreaSqm),
    managementFee: str(s.managementFee),
    repairReserve: str(s.repairReserve),
    managementForm: str(s.managementForm),
    managerWorkStyle: str(s.managerWorkStyle),
    unitCount: str(s.unitCount),
    unitAreaMinSqm: str(s.unitAreaMinSqm),
    unitAreaMaxSqm: str(s.unitAreaMaxSqm),
    structure: str(s.structure),
    leasehold: str(s.leasehold),
  };
}

function draftToSpec(dealType: PropertyDealType, d: SpecDraft): PropertySpec {
  const num = (v: string) => Number(v || 0);
  const leasehold = d.leasehold.trim() ? { leasehold: d.leasehold.trim() } : {};
  switch (dealType) {
    case "land":
      return {
        dealType,
        landAreaSqm: num(d.landAreaSqm),
        privateRoadAreaSqm: num(d.privateRoadAreaSqm),
        landCategory: d.landCategory,
        zoning: d.zoning,
        buildingCoverage: d.buildingCoverage,
        floorAreaRatio: d.floorAreaRatio,
        legalRestrictions: d.legalRestrictions,
        ...leasehold,
      };
    case "house":
      return {
        dealType,
        landAreaSqm: num(d.landAreaSqm),
        privateRoadAreaSqm: num(d.privateRoadAreaSqm),
        buildingAreaSqm: num(d.buildingAreaSqm),
        ...(d.isRowHouse ? { isRowHouse: true } : {}),
        builtYm: d.builtYm,
        deliveryYm: d.deliveryYm,
        ...leasehold,
      };
    case "condo":
      return {
        dealType,
        floors: d.floors,
        floorLocated: d.floorLocated,
        exclusiveAreaSqm: num(d.exclusiveAreaSqm),
        balconyAreaSqm: num(d.balconyAreaSqm),
        builtYm: d.builtYm,
        deliveryYm: d.deliveryYm,
        managementFee: d.managementFee,
        repairReserve: d.repairReserve,
        managementForm: d.managementForm,
        managerWorkStyle: d.managerWorkStyle,
        ...leasehold,
      };
    case "wholeBuilding":
      return {
        dealType,
        landAreaSqm: num(d.landAreaSqm),
        privateRoadAreaSqm: num(d.privateRoadAreaSqm),
        buildingAreaSqm: num(d.buildingAreaSqm),
        builtYm: d.builtYm,
        deliveryYm: d.deliveryYm,
        unitCount: num(d.unitCount),
        unitAreaMinSqm: num(d.unitAreaMinSqm),
        unitAreaMaxSqm: num(d.unitAreaMaxSqm),
        structure: d.structure,
        floors: d.floors,
        ...leasehold,
      };
    case "businessBuilding":
      return {
        dealType,
        landAreaSqm: num(d.landAreaSqm),
        privateRoadAreaSqm: num(d.privateRoadAreaSqm),
        buildingAreaSqm: num(d.buildingAreaSqm),
        builtYm: d.builtYm,
        deliveryYm: d.deliveryYm,
        ...(d.structure.trim() ? { structure: d.structure } : {}),
        ...(d.floors.trim() ? { floors: d.floors } : {}),
        ...(d.zoning.trim() ? { zoning: d.zoning } : {}),
        ...leasehold,
      };
  }
}

const inputCls =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-primary";
const labelCls = "mb-1 block text-xs font-medium text-text-muted";

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

export default function PropertyForm({ initialData, onSubmit }: Props) {
  const [status, setStatus] = useState<PropertyStatus>(initialData?.status ?? "draft");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [dealType, setDealType] = useState<PropertyDealType>(
    initialData?.dealType ?? "house",
  );
  const [category, setCategory] = useState<PropertyCategory>(
    initialData?.category ?? "other",
  );
  const [tradeMode, setTradeMode] = useState<PropertyTradeMode>(
    initialData?.tradeMode ?? "broker",
  );
  const [title, setTitle] = useState(initialData?.title ?? "");
  // 入力は万円単位（priceYen へは ×10000 して送る）
  const [priceMan, setPriceMan] = useState(
    initialData ? String(Math.round(initialData.priceYen / 10000)) : "",
  );
  const [priceNote, setPriceNote] = useState(initialData?.priceNote ?? "");
  const [locationText, setLocationText] = useState(initialData?.locationText ?? "");
  const [access, setAccess] = useState<PropertyAccess[]>(initialData?.access ?? []);
  const [specDraft, setSpecDraft] = useState<SpecDraft>(specToDraft(initialData?.spec));
  const [images, setImages] = useState<PropertyImage[]>(initialData?.images ?? []);
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [infoUpdatedAt, setInfoUpdatedAt] = useState(
    initialData?.infoUpdatedAt ?? today(),
  );
  const [nextUpdateAt, setNextUpdateAt] = useState(
    initialData?.nextUpdateAt ?? defaultNextUpdateAt(today()),
  );
  const [locales, setLocales] = useState<LangCode[]>(initialData?.locales ?? ["ja"]);
  const [enTrans, setEnTrans] = useState<PropertyTranslation>(
    initialData?.translations?.en ?? EMPTY_TRANS,
  );
  const [zhTwTrans, setZhTwTrans] = useState<PropertyTranslation>(
    initialData?.translations?.["zh-tw"] ?? EMPTY_TRANS,
  );
  const [zhTrans, setZhTrans] = useState<PropertyTranslation>(
    initialData?.translations?.zh ?? EMPTY_TRANS,
  );
  const [activeTranslation, setActiveTranslation] = useState<TranslationLang>("en");
  // ★内部フィールド（公開面に出ない）：自社媒介／広告許可の別・社内メモ
  const initialInternal = (initialData?.internal ?? {}) as {
    sourceType?: string;
    memo?: string;
  };
  const [sourceType, setSourceType] = useState(initialInternal.sourceType ?? "own");
  const [internalMemo, setInternalMemo] = useState(initialInternal.memo ?? "");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const setSpec = (patch: Partial<SpecDraft>) =>
    setSpecDraft((prev) => ({ ...prev, ...patch }));

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file, "bukken");
      setImages((prev) => [...prev, { url, alt: "" }]);
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err instanceof Error ? err.message : "アップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  const buildInput = (): PropertyInput => ({
    slug: slug.trim(),
    status,
    dealType,
    category,
    tradeMode,
    title: title.trim(),
    priceYen: Math.round(Number(priceMan || 0) * 10000),
    ...(priceNote.trim() ? { priceNote: priceNote.trim() } : {}),
    locationText: locationText.trim(),
    access,
    spec: draftToSpec(dealType, specDraft),
    images,
    description,
    // 公開への遷移時に情報公開日を自動設定（既にあれば維持）
    ...(status === "published"
      ? { publishedAt: initialData?.publishedAt ?? today() }
      : initialData?.publishedAt
        ? { publishedAt: initialData.publishedAt }
        : {}),
    infoUpdatedAt,
    nextUpdateAt,
    locales,
    translations: {
      ...(enTrans.title ? { en: enTrans } : {}),
      ...(zhTwTrans.title ? { "zh-tw": zhTwTrans } : {}),
      ...(zhTrans.title ? { zh: zhTrans } : {}),
    },
    internal: { sourceType, ...(internalMemo.trim() ? { memo: internalMemo.trim() } : {}) },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 禁止語スキャン（規約の特定用語＋業者間用語）。公開はサーバー側でも拒否される
    const hits = scanPropertyText([title, description, priceNote].join("\n"));
    if (hits.length > 0) {
      const terms = [...new Set(hits.map((h) => h.term))].join("・");
      if (status === "published") {
        setError(`公開できません：表示規約の特定用語または業者間用語が含まれています（${terms}）`);
        return;
      }
      if (!window.confirm(`禁止語の候補が含まれています（${terms}）。下書きとして保存しますか？`)) {
        return;
      }
    }

    setSaving(true);
    try {
      await onSubmit(buildInput());
    } catch {
      // エラー表示は呼び出し側
    } finally {
      setSaving(false);
    }
  };

  const showLand = dealType === "land";
  const showBuildingCommon =
    dealType === "house" || dealType === "wholeBuilding" || dealType === "businessBuilding";
  const showCondo = dealType === "condo";
  const showWhole = dealType === "wholeBuilding";
  const transState: Record<TranslationLang, [PropertyTranslation, (t: PropertyTranslation) => void]> = {
    en: [enTrans, setEnTrans],
    "zh-tw": [zhTwTrans, setZhTwTrans],
    zh: [zhTrans, setZhTrans],
  };
  const [trans, setTrans] = transState[activeTranslation];

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {/* 登録時の注意（規約・宅建業法） */}
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
        <p className="font-semibold">登録前にご確認ください</p>
        <ul className="mt-1 list-disc space-y-1 pl-4">
          <li>
            建築確認前（未完成）の物件は登録できません（宅建業法第33条・広告開始時期の制限）。
          </li>
          <li>
            掲載する写真・動画は<strong>取引する物件そのもの</strong>を使用してください。
            CG・見取図・完成予想図等を用いる場合は<strong>その旨を画像内または画像に接する位置に明示</strong>
            してください（表示規約施行規則・写真/絵図の表示基準）。
          </li>
          <li>
            元付会社名・広告許可の記録・AD・手数料配分等の業者間情報は、公開欄には書かず
            末尾の「社内メモ（非公開）」に記録してください。
          </li>
        </ul>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      {/* 基本情報 */}
      <section className="rounded-xl border border-border bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold text-text">基本情報</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="ステータス">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PropertyStatus)}
              className={inputCls}
            >
              {(Object.keys(STATUS_LABELS) as PropertyStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="種別">
            <select
              value={dealType}
              onChange={(e) => setDealType(e.target.value as PropertyDealType)}
              className={inputCls}
            >
              {(Object.keys(DEAL_TYPE_LABELS) as PropertyDealType[]).map((t) => (
                <option key={t} value={t}>
                  {DEAL_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="カテゴリ">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PropertyCategory)}
              className={inputCls}
            >
              {(Object.keys(CATEGORY_LABELS) as PropertyCategory[]).map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="取引態様（必須表示）">
            <select
              value={tradeMode}
              onChange={(e) => setTradeMode(e.target.value as PropertyTradeMode)}
              className={inputCls}
            >
              {(Object.keys(TRADE_MODE_LABELS) as PropertyTradeMode[]).map((m) => (
                <option key={m} value={m}>
                  {TRADE_MODE_LABELS[m]}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_220px]">
          <Field label="物件名（タイトル）">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} required />
          </Field>
          <Field label="slug（半角英数とハイフン）">
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={inputCls}
              pattern="[a-z0-9-]+"
              placeholder="kohinata-house-01"
              required
            />
          </Field>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Field label="価格（万円）">
            <input
              type="number"
              min={1}
              value={priceMan}
              onChange={(e) => setPriceMan(e.target.value)}
              className={inputCls}
              required
            />
          </Field>
          <Field label="価格の注記（消費税・負担金等）" className="sm:col-span-2">
            <input
              value={priceNote}
              onChange={(e) => setPriceNote(e.target.value)}
              className={inputCls}
              placeholder="税込／個人間売買のため消費税非課税 等"
            />
          </Field>
        </div>
        <div className="mt-3">
          <Field label="所在地（町又は字の名称まで・地番は書かない）">
            <input
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              className={inputCls}
              placeholder="東京都文京区小日向"
              required
            />
          </Field>
        </div>
      </section>

      {/* 交通 */}
      <section className="rounded-xl border border-border bg-surface p-4">
        <h2 className="mb-1 text-sm font-semibold text-text">交通の利便</h2>
        <p className="mb-3 text-xs text-text-muted">
          道路距離（m）を入力すると徒歩分数は 80m＝1分（端数切り上げ）で自動表示されます（規約施行規則第9条(9)）。
        </p>
        {access.map((a, i) => (
          <div key={i} className="mb-2 grid grid-cols-[1fr_1fr_110px_90px_60px] items-end gap-2">
            <Field label="路線">
              <input
                value={a.line}
                onChange={(e) =>
                  setAccess((prev) => prev.map((x, j) => (j === i ? { ...x, line: e.target.value } : x)))
                }
                className={inputCls}
                placeholder="東京メトロ丸ノ内線"
              />
            </Field>
            <Field label="駅名">
              <input
                value={a.station}
                onChange={(e) =>
                  setAccess((prev) => prev.map((x, j) => (j === i ? { ...x, station: e.target.value } : x)))
                }
                className={inputCls}
                placeholder="茗荷谷"
              />
            </Field>
            <Field label="道路距離(m)">
              <input
                type="number"
                min={1}
                value={a.distanceM || ""}
                onChange={(e) =>
                  setAccess((prev) =>
                    prev.map((x, j) => (j === i ? { ...x, distanceM: Number(e.target.value) } : x)),
                  )
                }
                className={inputCls}
              />
            </Field>
            <p className="pb-2 text-xs text-text-muted">
              徒歩{a.distanceM > 0 ? walkMinutes(a.distanceM) : "—"}分
            </p>
            <button
              type="button"
              onClick={() => setAccess((prev) => prev.filter((_, j) => j !== i))}
              className="pb-2 text-xs text-red-500 hover:underline"
            >
              削除
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setAccess((prev) => [...prev, { line: "", station: "", distanceM: 0 }])}
          className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted hover:bg-surface-dim"
        >
          ＋駅を追加
        </button>
      </section>

      {/* 種別ごとの必須項目 */}
      <section className="rounded-xl border border-border bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold text-text">
          必要表示事項（{DEAL_TYPE_LABELS[dealType]}）
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(showLand || showBuildingCommon) && (
            <>
              <Field label="土地面積（㎡）">
                <input type="number" step="0.01" min={0} value={specDraft.landAreaSqm} onChange={(e) => setSpec({ landAreaSqm: e.target.value })} className={inputCls} required />
              </Field>
              <Field label="私道負担面積（㎡・なし=0）">
                <input type="number" step="0.01" min={0} value={specDraft.privateRoadAreaSqm} onChange={(e) => setSpec({ privateRoadAreaSqm: e.target.value })} className={inputCls} required />
              </Field>
            </>
          )}
          {showBuildingCommon && (
            <Field label="建物面積（㎡）">
              <input type="number" step="0.01" min={0} value={specDraft.buildingAreaSqm} onChange={(e) => setSpec({ buildingAreaSqm: e.target.value })} className={inputCls} required />
            </Field>
          )}
          {showLand && (
            <>
              <Field label="地目">
                <input value={specDraft.landCategory} onChange={(e) => setSpec({ landCategory: e.target.value })} className={inputCls} placeholder="宅地" required />
              </Field>
              <Field label="建ぺい率">
                <input value={specDraft.buildingCoverage} onChange={(e) => setSpec({ buildingCoverage: e.target.value })} className={inputCls} placeholder="60%" required />
              </Field>
              <Field label="容積率（制限があれば内容も）">
                <input value={specDraft.floorAreaRatio} onChange={(e) => setSpec({ floorAreaRatio: e.target.value })} className={inputCls} placeholder="200%" required />
              </Field>
            </>
          )}
          {(showLand || dealType === "businessBuilding") && (
            <Field label={showLand ? "用途地域（市街化調整区域はその旨＋許可条件）" : "用途地域（任意）"} className="col-span-2">
              <input value={specDraft.zoning} onChange={(e) => setSpec({ zoning: e.target.value })} className={inputCls} placeholder="第一種住居地域" required={showLand} />
            </Field>
          )}
          {showLand && (
            <Field label="法令に基づく制限（宅建業法施行令第3条の事項）" className="col-span-2 sm:col-span-3">
              <input value={specDraft.legalRestrictions} onChange={(e) => setSpec({ legalRestrictions: e.target.value })} className={inputCls} placeholder="高度地区、防火地域 等（該当なしの場合は「なし」）" required />
            </Field>
          )}
          {dealType === "house" && (
            <Field label="連棟式建物">
              <label className="flex h-9 items-center gap-2 text-sm text-text">
                <input type="checkbox" checked={specDraft.isRowHouse} onChange={(e) => setSpec({ isRowHouse: e.target.checked })} />
                連棟式である（その旨を表示）
              </label>
            </Field>
          )}
          {showCondo && (
            <>
              <Field label="建物の階数">
                <input value={specDraft.floors} onChange={(e) => setSpec({ floors: e.target.value })} className={inputCls} placeholder="地上10階建" required />
              </Field>
              <Field label="所在階">
                <input value={specDraft.floorLocated} onChange={(e) => setSpec({ floorLocated: e.target.value })} className={inputCls} placeholder="5階" required />
              </Field>
              <Field label="専有面積（㎡）">
                <input type="number" step="0.01" min={0} value={specDraft.exclusiveAreaSqm} onChange={(e) => setSpec({ exclusiveAreaSqm: e.target.value })} className={inputCls} required />
              </Field>
              <Field label="バルコニー面積（㎡）">
                <input type="number" step="0.01" min={0} value={specDraft.balconyAreaSqm} onChange={(e) => setSpec({ balconyAreaSqm: e.target.value })} className={inputCls} required />
              </Field>
              <Field label="管理費">
                <input value={specDraft.managementFee} onChange={(e) => setSpec({ managementFee: e.target.value })} className={inputCls} placeholder="月額12,000円" required />
              </Field>
              <Field label="修繕積立金等">
                <input value={specDraft.repairReserve} onChange={(e) => setSpec({ repairReserve: e.target.value })} className={inputCls} placeholder="月額9,000円" required />
              </Field>
              <Field label="管理形態">
                <input value={specDraft.managementForm} onChange={(e) => setSpec({ managementForm: e.target.value })} className={inputCls} placeholder="全部委託" required />
              </Field>
              <Field label="管理員の勤務形態">
                <input value={specDraft.managerWorkStyle} onChange={(e) => setSpec({ managerWorkStyle: e.target.value })} className={inputCls} placeholder="日勤" required />
              </Field>
            </>
          )}
          {showWhole && (
            <>
              <Field label="住戸数">
                <input type="number" min={1} value={specDraft.unitCount} onChange={(e) => setSpec({ unitCount: e.target.value })} className={inputCls} required />
              </Field>
              <Field label="専有面積・最小（㎡）">
                <input type="number" step="0.01" min={0} value={specDraft.unitAreaMinSqm} onChange={(e) => setSpec({ unitAreaMinSqm: e.target.value })} className={inputCls} required />
              </Field>
              <Field label="専有面積・最大（㎡）">
                <input type="number" step="0.01" min={0} value={specDraft.unitAreaMaxSqm} onChange={(e) => setSpec({ unitAreaMaxSqm: e.target.value })} className={inputCls} required />
              </Field>
            </>
          )}
          {(showWhole || dealType === "businessBuilding") && (
            <>
              <Field label={showWhole ? "構造" : "構造（任意）"}>
                <input value={specDraft.structure} onChange={(e) => setSpec({ structure: e.target.value })} className={inputCls} placeholder="鉄筋コンクリート造" required={showWhole} />
              </Field>
              <Field label={showWhole ? "階数" : "階数（任意）"}>
                <input value={specDraft.floors} onChange={(e) => setSpec({ floors: e.target.value })} className={inputCls} placeholder="地上3階建" required={showWhole} />
              </Field>
            </>
          )}
          {(showBuildingCommon || showCondo) && (
            <>
              <Field label="建築年月（YYYY-MM）">
                <input type="month" value={specDraft.builtYm} onChange={(e) => setSpec({ builtYm: e.target.value })} className={inputCls} required />
              </Field>
              <Field label="引渡し可能年月（YYYY-MM または「即時」等）">
                <input value={specDraft.deliveryYm} onChange={(e) => setSpec({ deliveryYm: e.target.value })} className={inputCls} placeholder="即時（相談）" required />
              </Field>
            </>
          )}
          <Field label="借地の場合（種類・内容・期間・保証金等）" className="col-span-2 sm:col-span-3">
            <input value={specDraft.leasehold} onChange={(e) => setSpec({ leasehold: e.target.value })} className={inputCls} placeholder="所有権の場合は空欄" />
          </Field>
        </div>
      </section>

      {/* 画像 */}
      <section className="rounded-xl border border-border bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold text-text">画像（取引する物件そのもの）</h2>
        <div className="space-y-2">
          {images.map((img, i) => (
            <div key={img.url} className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt} className="h-16 w-24 rounded-lg object-cover" />
              <input
                value={img.alt}
                onChange={(e) =>
                  setImages((prev) => prev.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))
                }
                className={inputCls}
                placeholder="代替テキスト（例：建物外観）"
                required
              />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                className="shrink-0 text-xs text-red-500 hover:underline"
              >
                削除
              </button>
            </div>
          ))}
        </div>
        <label className="mt-3 inline-block cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted hover:bg-surface-dim">
          {uploading ? "アップロード中…" : "＋画像をアップロード"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleUpload(file);
              e.target.value = "";
            }}
          />
        </label>
      </section>

      {/* 紹介文 */}
      <section className="rounded-xl border border-border bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold text-text">紹介文（Markdown可・消費者向け情報のみ）</h2>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={10}
          className={inputCls}
          required
        />
      </section>

      {/* 日付（法定・規約表示） */}
      <section className="rounded-xl border border-border bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold text-text">情報の鮮度（自動表示される日付）</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="情報公開日（公開時に自動設定）">
            <input value={initialData?.publishedAt ?? "（公開時に設定）"} readOnly className={`${inputCls} bg-surface-dim`} />
          </Field>
          <Field label="情報更新日">
            <input type="date" value={infoUpdatedAt} onChange={(e) => setInfoUpdatedAt(e.target.value)} className={inputCls} required />
          </Field>
          <Field label="次回更新予定日（既定＝更新日+14日）">
            <div className="flex gap-2">
              <input type="date" value={nextUpdateAt} onChange={(e) => setNextUpdateAt(e.target.value)} className={inputCls} required />
              <button
                type="button"
                onClick={() => setNextUpdateAt(defaultNextUpdateAt(infoUpdatedAt))}
                className="shrink-0 rounded-lg border border-border px-2 text-xs text-text-muted hover:bg-surface-dim"
              >
                +14日
              </button>
            </div>
          </Field>
        </div>
      </section>

      {/* 公開言語・翻訳 */}
      <section className="rounded-xl border border-border bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold text-text">公開言語と翻訳（ja必須・翻訳は任意）</h2>
        <div className="mb-3 flex gap-4">
          {LOCALE_OPTIONS.map((l) => (
            <label key={l.code} className="flex items-center gap-1.5 text-sm text-text">
              <input
                type="checkbox"
                checked={locales.includes(l.code)}
                disabled={l.code === "ja"}
                onChange={(e) =>
                  setLocales((prev) =>
                    e.target.checked ? [...prev, l.code] : prev.filter((c) => c !== l.code),
                  )
                }
              />
              {l.label}
            </label>
          ))}
        </div>
        <div className="mb-2 flex gap-1 rounded-lg bg-surface-dim p-1">
          {translationTabs.map((t) => (
            <button
              key={t.code}
              type="button"
              onClick={() => setActiveTranslation(t.code)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                activeTranslation === t.code ? "bg-surface text-text shadow-sm" : "text-text-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <Field label="タイトル">
            <input value={trans.title} onChange={(e) => setTrans({ ...trans, title: e.target.value })} className={inputCls} />
          </Field>
          <Field label="所在地の訳（省略時は日本語表記）">
            <input value={trans.locationText ?? ""} onChange={(e) => setTrans({ ...trans, locationText: e.target.value })} className={inputCls} />
          </Field>
          <Field label="紹介文">
            <textarea value={trans.description} onChange={(e) => setTrans({ ...trans, description: e.target.value })} rows={5} className={inputCls} />
          </Field>
        </div>
      </section>

      {/* 内部フィールド */}
      <section className="rounded-xl border border-red-200 bg-red-50/40 p-4">
        <h2 className="mb-1 text-sm font-semibold text-red-700">社内メモ（非公開・業者間情報はここへ）</h2>
        <p className="mb-3 text-xs text-red-700/80">
          この欄は公開ページ・JSON-LD・OGPのどこにも出力されません。元付会社名・広告許可の記録・
          AD・手数料配分・業者間の経緯は必ずこの欄に記録してください。
        </p>
        <div className="grid gap-3 sm:grid-cols-[220px_1fr]">
          <Field label="登録区分（内部管理用）">
            <select value={sourceType} onChange={(e) => setSourceType(e.target.value)} className={inputCls}>
              <option value="own">自社媒介</option>
              <option value="permitted">広告許可物件（元付あり）</option>
            </select>
          </Field>
          <Field label="メモ">
            <textarea value={internalMemo} onChange={(e) => setInternalMemo(e.target.value)} rows={3} className={inputCls} />
          </Field>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="relative overflow-hidden rounded-lg px-6 py-2.5 text-sm font-semibold text-text disabled:opacity-50"
        >
          <span className="pointer-events-none absolute inset-0 rounded-lg gradient-btn" aria-hidden="true" />
          <span className="relative">{saving ? "保存中…" : "保存する"}</span>
        </button>
      </div>
    </form>
  );
}
