// フェーズK-2｜LINKA 型定義（正本＝facilitator/linka-facilitator.jsx v0.2 の応答スキーマ）
// 本番はサーバで id→公開プロフィールに解決した「カード」を返す（クライアントに名簿JSONを載せない）。

export type LinkaSite = "samurai" | "realestate" | "legal" | "labor";
export type LinkaMode = "member" | "customer" | "concierge";

export interface LinkaRequest {
  site: LinkaSite;
  mode: LinkaMode;
  message: string;
}

/** 名簿（公開情報のみ＋オプトイン列。相談本文は保存しない） */
export interface Member {
  id: string;
  name: string;
  shikaku: string[];
  mark: string;
  catch: string;
  bunya: string[];
  lang: string[];
  area: string;
  taio: string[];
  /** AI照会の受付可否（null=未取得） */
  ai_shokai_ok: boolean | null;
  /** 一般相談の受付可否（null=未取得） */
  sodan_ok: boolean | null;
}

export interface ColumnEntry {
  id: string;
  title: string;
  author: string | null;
  tags: string[];
  date: string;
  slug: string | null;
}

export interface VideoEntry {
  id: string;
  theme: string;
  tags: string[];
  type: string;
  url: string | null;
}

export interface SiteService {
  label: string;
  url: string;
  tags: string[];
}

export interface SiteServiceConfig {
  greeting: string;
  chips: string[];
  services: SiteService[];
  escalateNote: string;
}

export interface Summary {
  bunya?: string;
  chiiki?: string;
  jiki?: string;
  kibo?: string;
}

/** サーバで解決済みの候補カード（クライアントは名簿を持たない） */
export interface CandidateCard {
  id: string;
  name: string;
  shikaku: string[];
  mark: string;
  catch: string;
  bunya: string[];
  lang: string[];
  area: string;
  taio: string[];
  profileUrl: string;
  reasons: string[];
  /** "ok"=オプトイン取得済 / "unknown"=未取得（明示表示） */
  optin: "ok" | "unknown";
  authoredColumns: { title: string; url: string }[];
}

export interface ColumnCard {
  id: string;
  title: string;
  url: string;
  tags: string[];
  date: string;
  authorName: string | null;
  reason: string;
}

export interface VideoCard {
  id: string;
  theme: string;
  url: string;
  tags: string[];
  type: string;
  reason: string;
}

export interface ServiceCard {
  label: string;
  url: string;
  reason: string;
}

interface Base {
  /** true=AI不通・検証失敗時のフォールバック（簡易検索） */
  demo?: boolean;
}

export type LinkaResult =
  | ({ type: "anonymization_request"; message: string } & Base)
  | ({ type: "clarify"; message: string } & Base)
  | ({ type: "escalation"; message: string } & Base)
  | ({
      type: "candidates";
      message: string;
      candidates: CandidateCard[];
      columns?: ColumnCard[];
      videos?: VideoCard[];
      summary?: Summary;
    } & Base)
  | ({
      type: "triage";
      kento: string[];
      message: string;
      candidates: CandidateCard[];
      columns?: ColumnCard[];
      videos?: VideoCard[];
      summary?: Summary;
    } & Base)
  | ({
      type: "concierge";
      kento: string[];
      message: string;
      services: ServiceCard[];
      escalate: boolean;
      escalateReason?: string;
      columns?: ColumnCard[];
      summary?: Summary;
      /** 範囲外誘導先（士業ドットコム） */
      samuraiUrl: string;
    } & Base);

export interface LinkaDraftRequest {
  memberId: string;
  inqType: "a" | "b" | "c";
  summary?: Summary;
}

export interface LinkaDraftResult {
  draft: string;
  demo?: boolean;
}
