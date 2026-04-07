# SEO メタデータ一覧

各ページのタイトル・description を一覧で確認できます。
編集したい場合は、ファイルパスを参考に該当ファイルを修正してください。

> 📝 **タイトル表示ルール**
>
> - 通常ページ: `{title} | 四葉不動産` のように事業名が自動で末尾に付く
> - トップページ: `absoluteTitle: true` で固定表示
> - dynamic（コラム詳細）: Firestoreから取得した記事タイトルが入る

---

## 四葉不動産（yotsuba-fudousan.com）

### トップページ

**ファイル:** [src/app/(realestate)/page.tsx](<../src/app/(realestate)/page.tsx>)

- **Title:** `四葉不動産 | 元新聞記者×行政書士の東京の不動産屋`
- **Description:** 元新聞記者が5カ国での在住経験を活かして立ち上げた、東京・文京区の不動産屋。賃貸・売買・管理から相続不動産まで、日英中タイベトナム5言語対応と専門家ネットワークで住まい探しから契約・法務までワンストップ対応。初回相談は無料、お気軽にどうぞ。

### 会社概要

**ファイル:** [src/app/(realestate)/about/page.tsx](<../src/app/(realestate)/about/page.tsx>)

- **Title:** `会社概要 | 四葉不動産`
- **Description:** 元新聞記者が5カ国での在住経験を活かして立ち上げた、東京・文京区の不動産屋。行政書士・社労士との連携と日英中タイベトナム5言語対応で、住まい探しから契約・法務・相続までワンストップで対応。四葉不動産の理念とバックグラウンドをご紹介します。

### サービス

**ファイル:** [src/app/(realestate)/services/page.tsx](<../src/app/(realestate)/services/page.tsx>)

- **Title:** `サービス | 四葉不動産`
- **Description:** 賃貸・売買・管理から相続不動産、オーナー向けコンサルティングまで、東京の不動産取引をワンストップで対応。日本語・英語・中国語・タイ語・ベトナム語の5言語対応、契約書類は行政書士が監修。文京区を拠点に四葉不動産がお届けするサービス一覧です。

### お問い合わせ

**ファイル:** [src/app/(realestate)/contact/page.tsx](<../src/app/(realestate)/contact/page.tsx>)

- **Title:** `お問い合わせ | 四葉不動産`
- **Description:** 住まい探し・契約・相続不動産・ビザ・労務まで、不動産と行政書士・社労士がワンストップで対応。日英中タイベトナム5言語対応、電話・お問い合わせフォーム・オンライン予約から受付。初回相談は無料、文京区の四葉不動産までお気軽にどうぞ。

### コラム一覧

**ファイル:** [src/app/(realestate)/column/page.tsx](<../src/app/(realestate)/column/page.tsx>)

- **Title:** `コラム | 四葉不動産`
- **Description:** 東京の部屋探しのコツ、敷金・礼金の仕組み、契約書の読み方、文京区の暮らし情報、相続不動産の基礎知識まで。元新聞記者としての取材経験と行政書士の専門知識を活かし、四葉不動産が実体験を交えてわかりやすく解説するお役立ちコラムです。

### コラム詳細（動的）

**ファイル:** [src/app/(realestate)/column/[slug]/page.tsx](<../src/app/(realestate)/column/[slug]/page.tsx>)

- **Title:** `{記事タイトル} | 四葉不動産`
- **Description:** {記事の概要} ※Firestoreから自動取得

### プライバシーポリシー

**ファイル:** [src/app/(realestate)/privacy-policy/page.tsx](<../src/app/(realestate)/privacy-policy/page.tsx>)

- **Title:** `プライバシーポリシー | 四葉不動産`
- **Description:** 四葉パートナーズが取り扱う個人情報の利用目的、第三者提供の有無、Cookie使用方針、お問い合わせデータの保管期間、情報管理体制など、プライバシー保護に関する取り扱いを詳しく明記しています。安心してご利用いただくためにご確認ください。

### 利用規約

**ファイル:** [src/app/(realestate)/terms/page.tsx](<../src/app/(realestate)/terms/page.tsx>)

- **Title:** `利用規約 | 四葉不動産`
- **Description:** 四葉パートナーズが運営するウェブサイトの利用規約。サービス利用条件、禁止事項、免責事項、知的財産権の取り扱い、準拠法、規約変更に関する事項など、ご利用にあたっての重要事項を明記しています。ご利用前に必ずご確認ください。

### 宅建業法に基づく表記

**ファイル:** [src/app/(realestate)/legal-notice/page.tsx](<../src/app/(realestate)/legal-notice/page.tsx>)

- **Title:** `宅建業法に基づく表記 | 四葉不動産`
- **Description:** 四葉不動産株式会社の宅地建物取引業免許番号、事務所所在地、代表者情報、取引態様、所属団体、保証協会など、宅地建物取引業法第50条に基づく法定開示事項を掲載しています。安心してお取引いただくための情報です。

### 送信完了（noindex）

**ファイル:** [src/app/(realestate)/thanks/page.tsx](<../src/app/(realestate)/thanks/page.tsx>)

- **Title:** `送信完了 | 四葉不動産`
- **Description:** お問い合わせを受け付けました。

---

## 四葉行政書士事務所（yotsuba-legal.com）

### トップページ

**ファイル:** [src/app/(legal)/legal/page.tsx](<../src/app/(legal)/legal/page.tsx>)

- **Title:** `四葉行政書士事務所 | 補助金・ビザ・会社設立をワンストップ`
- **Description:** 元新聞記者の文章力で「通る申請書」を作成する文京区の四葉行政書士事務所。補助金・助成金の採択率向上、ビザ・在留資格、会社設立、各種許認可までワンストップで対応。不動産とも連携し事業開始を総合支援。初回相談は無料、お気軽にどうぞ。

### 会社概要

**ファイル:** [src/app/(legal)/legal/about/page.tsx](<../src/app/(legal)/legal/about/page.tsx>)

- **Title:** `会社概要 | 四葉行政書士事務所`
- **Description:** 5カ国で暮らした元新聞記者が、取材で培った情報収集力と文章力を活かして行政書士に。補助金・助成金、ビザ、会社設立、許認可までワンストップで対応。文京区の四葉行政書士事務所の理念とバックグラウンドをご紹介します。

### お問い合わせ

**ファイル:** [src/app/(legal)/legal/contact/page.tsx](<../src/app/(legal)/legal/contact/page.tsx>)

- **Title:** `お問い合わせ | 四葉行政書士事務所`
- **Description:** 補助金・助成金の申請書作成、ビザ・在留資格、会社設立、各種許認可のご相談はこちら。初回相談無料、電話・お問い合わせフォーム・オンライン予約で受付。文京区の四葉行政書士事務所が迅速・丁寧にお答えします。お気軽にどうぞ。

### コラム一覧

**ファイル:** [src/app/(legal)/legal/column/page.tsx](<../src/app/(legal)/legal/column/page.tsx>)

- **Title:** `コラム | 四葉行政書士事務所`
- **Description:** 補助金・助成金の最新情報と採択のコツ、ビザ・在留資格申請のポイント、会社設立の手順、各種許認可の実務まで。元新聞記者としての取材経験と現場の視点を活かし、四葉行政書士事務所がわかりやすく解説するお役立ちコラムです。

### コラム詳細（動的）

**ファイル:** [src/app/(legal)/legal/column/[slug]/page.tsx](<../src/app/(legal)/legal/column/[slug]/page.tsx>)

- **Title:** `{記事タイトル} | 四葉行政書士事務所`
- **Description:** {記事の概要} ※Firestoreから自動取得

### 送信完了（noindex）

**ファイル:** [src/app/(legal)/legal/thanks/page.tsx](<../src/app/(legal)/legal/thanks/page.tsx>)

- **Title:** `送信完了 | 四葉行政書士事務所`
- **Description:** お問い合わせを受け付けました。

---

## OG画像 / Twitter Card

| 事業               | OG画像    | サイズ   | Twitter Card        |
| ------------------ | --------- | -------- | ------------------- |
| 四葉不動産         | `/og.png` | 1322×834 | summary_large_image |
| 四葉行政書士事務所 | なし      | —        | summary             |

## Favicon

| ファイル    | パス                                                       |
| ----------- | ---------------------------------------------------------- |
| favicon.ico | `src/app/favicon.ico`（Next.js 自動配信）                  |
| アイコン    | `public/icon-192.png`（metadata icons / apple-touch-icon） |

## canonical URL

| 事業               | ドメイン                  |
| ------------------ | ------------------------- |
| 四葉不動産         | https://luck428.com       |
| 四葉行政書士事務所 | https://yotsuba-legal.com |

## 技術仕様

- **言語対応:** ja / en / zh-tw / zh（hreflang自動設定）
- **構造化データ:** Organization, WebSite, BlogPosting, BreadcrumbList, FAQPage, Service, HowTo, Speakable
- **データソース:** Firestore（公開ステータスのコラムのみ表示）
- **キャッシュ:** ISR `revalidate = 300秒`、管理画面で公開後は自動revalidate
