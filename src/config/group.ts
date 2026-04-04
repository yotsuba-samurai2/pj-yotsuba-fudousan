export type NavItem = { href: string; label: string };

export const groupBusinesses = [
  {
    key: "realestate",
    name: "四葉不動産",
    nameEn: "Real Estate",
    description: "不動産賃貸・売買・管理",
    href: "/",
    pathPrefix: "/",
    /** このテナントに紐づくドメイン（複数可） */
    domains: ["yotsuba-fudousan.com", "www.yotsuba-fudousan.com"],
    external: false,
    logo: {
      square: "/yotsuba/realestate-square.png",
      horizontal: "/yotsuba/realestate-horizontal.png",
    },
    nav: [
      { href: "/services", label: "サービス" },
      { href: "/about", label: "会社概要" },
      { href: "/column", label: "コラム" },
      { href: "/contact", label: "お問い合わせ" },
    ] as NavItem[],
  },
  {
    key: "legal",
    name: "四葉行政書士事務所",
    nameEn: "Administrative Scrivener",
    description: "補助金・助成金申請、在留資格・ビザ、法務手続き",
    href: "/legal",
    pathPrefix: "/legal",
    domains: ["yotsuba-legal.com", "www.yotsuba-legal.com"],
    external: false,
    logo: {
      square: "/yotsuba/legal-square.png",
      horizontal: "/yotsuba/legal-horizontal.png",
    },
    nav: [
      { href: "/legal", label: "サービス" },
      { href: "/legal/about", label: "事務所概要" },
      { href: "/legal/column", label: "コラム" },
      { href: "/legal/contact", label: "お問い合わせ" },
    ] as NavItem[],
  },
  {
    key: "labor",
    name: "四葉社会保険労務士法人",
    nameEn: "Labor Consultant",
    description: "社会保険・労務管理・助成金申請",
    href: "/labor",
    pathPrefix: "/labor",
    domains: ["yotsuba-labor.com", "www.yotsuba-labor.com"],
    external: false,
    logo: {
      square: "/yotsuba/labor-square.png",
      horizontal: "/yotsuba/labor-horizontal.png",
    },
    nav: [
      { href: "/labor", label: "サービス" },
      { href: "/labor/about", label: "事務所概要" },
      { href: "/labor/column", label: "コラム" },
      { href: "/labor/contact", label: "お問い合わせ" },
    ] as NavItem[],
  },
] as const;

/** ホスト名からテナントを判定 */
export function getBusinessByHost(host: string): (typeof groupBusinesses)[number] {
  const hostname = host.split(":")[0]; // ポート番号を除去

  // ドメインマッチ
  for (const biz of groupBusinesses) {
    if ((biz.domains as readonly string[]).includes(hostname)) return biz;
  }

  // localhost開発用: legal.localhost → legal
  const sub = hostname.split(".")[0];
  if (sub === "legal") return groupBusinesses[1];
  if (sub === "labor") return groupBusinesses[2];

  // デフォルト: 不動産
  return groupBusinesses[0];
}

/** パスからテナントを判定 */
export function getBusinessByPath(pathname: string) {
  for (const biz of groupBusinesses) {
    if (biz.pathPrefix !== "/" && pathname.startsWith(biz.pathPrefix)) {
      return biz;
    }
  }
  return groupBusinesses[0];
}

export const groupBrand = {
  name: "四葉パートナーズ",
  nameEn: "YOTSUBA PARTNERS",
} as const;
