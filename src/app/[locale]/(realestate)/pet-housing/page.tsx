// /pet-housing（多頭飼い・大型犬の住まい探し＋大家さんの受入れ相談）＝2026-09-24新設・日本語版のみ
// ペット横断 指示書 版2.0 第10〜13章・Phase 3。手本＝/group-home/ooya（RealestateServicePage・Faq・信頼性の枠・根拠の節）。
//
// 【公開の段取り】公開フラグ（NEXT_PUBLIC_PET_HOUSING_PUBLISHED・@/lib/pet-housing）が off の間は、全言語で 404。
//   on でも日本語以外は 404（翻訳が無いURLへ日本語本文を流し込まない＝指示書 第16章・T18）。
//   generateMetadata でも notFound() を返す（ページ側の metadata は本文と並行して解決されるため、404 の <title> に出さない）。
//
// 【役割分担（luck428-column-seo 第6条・カニバリ防止）】
//   本ページ＝犬・猫と暮らす住まいの「探す側」と「貸す側」の受け皿（物件探し・貸主側への確認・条件の整理・専用フォーム）。
//   /column/doubutsu-toriatsukai-bukken-youken＝ペット関連の「事業用」物件（主題が違う）。
//   /group-home/ooya＝グループホーム用途の大家募集（用途が違うのでリンクしない）。
//   渡航手続のLP（/legal/services/pet-travel）は未公開のため、リンクを張らない（公開後に第15章の相互リンクを足す）。
//
// 【コンプライアンス（shigyo-compliance-gate・指示書 第13章）】
//   ・入居や飼育を約束する語（指示書 第13章の例示）を書かない。飼育の可否を決めるのは貸主・管理組合で、当社は確認と調整まで。
//   ・「ペット相談」を複数飼育可・大型犬可と書かない（指示書 第6章の区別）。
//   ・敷金・原状回復を全物件共通の決まりとして書かない。額と範囲は物件・動物・契約条件で決まると書く。
//   ・賃料の上昇や空室の解消を約束しない（宅建業法第47条の2・第32条）。
//   ・四葉行政書士事務所への言及には、分離受任の一文（独立した事業体・別々にご契約）と「当社は紹介料を受け取りません」を省かずに添える。
//     渡航手続の具体的な業務範囲は資格者の確認前（Phase 1 報告 U-5）のため書かない。
//   ・調査の件数枠（SurveyCountsPanel）は、公開フラグと媒体の許諾がそろうまで何も出さない（第7〜8章）。
//
// 【法令・公的資料の一次確認（2026-09-24・e-Gov 法令API v2／国土交通省の公式ページとPDF）】
//   ・宅地建物取引業法（昭和27年法律第176号）第32条・第34条第1項・第2項・第35条第1項・第46条第1項・第2項・第47条の2第1項
//     （現行版 2026年4月1日施行・law_revision_id 327AC1000000176_20260401_507AC0000000068）
//   ・民法（明治29年法律第89号）第601条・第621条・第622条の2第1項・第2項（現行版 2026年6月24日施行）
//   ・動物の愛護及び管理に関する法律（昭和48年法律第105号）第7条第1項（現行版 2026年6月5日施行）
//   ・国土交通省住宅局「原状回復をめぐるトラブルとガイドライン（再改訂版）」（平成23年8月）本文6頁（「例外としての特約」の例）・
//     別表1（飼育ペットによる柱等のキズ・臭い）
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildPageMetadata, PERSON_ID, SITE_URL } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { JsonLd } from "@/components/seo/JsonLd";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { Faq, type FaqItem } from "@/components/shared/Faq";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { TelLink } from "@/components/shared/TelLink";
import { PetHousingCta } from "@/components/pet/PetHousingCta";
import { PetRenterForm } from "@/components/pet/PetRenterForm";
import { PetOwnerForm } from "@/components/pet/PetOwnerForm";
import { SurveyCountsPanel } from "@/components/rental-survey/SurveyCountsPanel";
import { getPublicSurveySummary } from "@/lib/rental-survey/store";
import { compilePublicPetSchoolListings } from "@/lib/pet-school-listings";
import { OFFICE } from "@/lib/shared/office";
import { SR_BIO } from "@/lib/shared/sr-label";
import {
  PET_HOUSING_LAST_UPDATED_ISO,
  PET_HOUSING_LAST_UPDATED_JA,
  PET_HOUSING_PATH,
  PET_HOUSING_PUBLISHED,
  PET_HOUSING_REFERENCE_DATE_JA,
} from "@/lib/pet-housing";

const PAGE_URL = `${SITE_URL}${PET_HOUSING_PATH}`;
const ORG_ID = `${SITE_URL}/#organization`;
/** 調査の件数枠の scope（Phase 2・src/lib/rental-survey/scope.ts）。公開の可否は getPublicSurveySummary が判定する */
const SURVEY_SCOPE_ID = "bunkyo-rent-pet";

const TITLE =
  "多頭飼い・大型犬と暮らせる住まい探し｜猫3匹以上の賃貸・購入と大家さんの受入れ相談（文京区・東京23区） | 四葉不動産";
const DESCRIPTION =
  "猫3匹以上の多頭飼いや大型犬と暮らせる賃貸・購入物件を探す方と、ペット飼育者に貸したい大家さんの相談窓口。文京区を中心に東京23区。貸主側への受入れの確認と飼育条件の整理を行います。相談無料。入居・飼育の可否は貸主と物件ごとの条件によります。";
const H1 = "多頭飼い・大型犬と暮らせる住まい探し——借りたい・買いたい方と、貸したい大家さんの相談窓口";
const ANSWER =
  "四葉不動産は、猫3匹以上の多頭飼いや大型犬と暮らせる住まい探しを、文京区を中心に東京23区でお手伝いしています。募集情報だけでは飼育条件が分からない物件は、貸主側に受入れの可否と条件を確認します。ペット飼育者に貸したい大家さんのご相談もお受けします。相談は無料です。";
const RESERVATION =
  "飼育できるかどうか、何頭まで・どの大きさまでかは、貸主の承諾、管理規約、物件ごとの条件と審査で決まります。当社が入居や飼育をお約束することはできません。";
const HERO_POINTS = [
  "借りたい・買いたい方：猫の多頭飼い、大型犬、犬と猫の同居など、募集情報だけでは探しにくい条件のご相談",
  "大家さん・所有者の方：空室をペット飼育者に貸すか決める前から。受け入れる条件と契約で決めておくことを整理します",
  "エリア：文京区を中心に東京23区。相談は無料で、仲介手数料・報酬は契約が成立したときだけ発生します",
];

const OPERATOR_SENTENCE =
  "四葉不動産株式会社（宅地建物取引業 東京都知事(1)第113304号）は、文京区小日向を拠点に、犬・猫の多頭飼いや大型犬と暮らせる住まいを探す方の物件探し（借主側・買主側の媒介）と、空室をペット飼育者に貸したい大家さんの受入れ条件の整理・入居者の募集（貸主側の媒介）を行っています。";
const SEPARATION_SENTENCE =
  "犬・猫の日本入国の手続のご相談は、四葉行政書士事務所が当社とは独立した事業体としてお受けし、ご依頼の場合は同事務所と別々にご契約いただきます。賃貸借や近隣との紛争は弁護士、登記は司法書士、税務は税理士へ、それぞれ直接ご依頼いただく形をご案内します。当社は紹介料を受け取りません。";

// 2. 見つかりにくい理由と、当社が行うこと（一般論。件数・割合は書かない）
const REASONS: { why: string; ours: string }[] = [
  {
    why: "「ペット可」「ペット相談」と書かれていても、頭数・種類・大きさに条件がある。「ペット相談」は、複数の動物や大型犬を認めるという意味ではない",
    ours: "募集情報の条件を確かめ、書かれていない点は貸主側に確認します",
  },
  {
    why: "飼育の条件が募集情報に書かれていない物件がある",
    ours: "条件の記載がない物件は、貸主側（管理会社・元付の不動産会社を含む）に受入れの可否を確認します",
  },
  {
    why: "分譲マンションでは、管理規約や使用細則で飼育できる動物・頭数・大きさが決められていることがある",
    ours: "賃貸・購入のどちらでも、管理規約の定めを契約前に確認します",
  },
  {
    why: "貸主は、傷・臭い・鳴き声や、退去時の原状回復を心配する",
    ours: "飼育の状況（種類・頭数・大きさ・しつけ・健康管理）を貸主に伝わる形に整理し、敷金や原状回復の取り決めの選択肢を示して調整します",
  },
];

// 2. 対応範囲（誰が何をするか）。speakable: .pet-housing-scope
const ROLES: { what: string; who: string; note: string; ours?: boolean }[] = [
  {
    what: "物件探し、貸主側への受入れの確認、条件の調整、借主側・買主側の媒介",
    who: "四葉不動産株式会社",
    note: "取引態様（媒介）を明示します（宅地建物取引業法第34条）。仲介手数料は契約が成立したときだけ、第46条に基づく告示の範囲内",
    ours: true,
  },
  {
    what: "大家さんの受入れ条件の整理、入居者の募集、貸主側の媒介",
    who: "四葉不動産株式会社",
    note: "報酬は賃貸借契約が成立したときだけ、第46条に基づく告示の範囲内",
    ours: true,
  },
  {
    what: "飼育を認めるかどうか、何頭・どの大きさまでか",
    who: "貸主（所有者）。分譲マンションでは管理規約と管理組合の定め",
    note: "当社は許可を出す立場にありません。確認と調整を行います",
  },
  {
    what: "犬・猫の日本入国の手続のご相談",
    who: "四葉行政書士事務所",
    note: "独立した事業体としてお受けし、別々にご契約いただきます。フォームで同意いただいた場合だけ、ご相談の内容を同事務所へ伝えます",
  },
  { what: "賃貸借の紛争、近隣との紛争", who: "弁護士", note: "直接ご依頼いただく形をご案内します" },
  { what: "購入時の登記、税務", who: "司法書士、税理士", note: "同上" },
];

// 3. 借り手向けの調査・所有者相談・条件調整
const RENTER_SERVICES: { title: string; body: string }[] = [
  {
    title: "調査",
    body: "ご希望のエリア・予算・間取りと、動物の種類・頭数・大きさを伺い、当社が利用する業者向けの物件情報から候補を探します。募集情報の飼育条件は、書かれたとおりに受け取らず確かめます。",
  },
  {
    title: "貸主側への確認",
    body: "飼育の条件が書かれていない物件や、頭数・大きさが条件を少し超える物件は、貸主側に受入れの可否と条件を確認します。",
  },
  {
    title: "条件の調整",
    body: "受入れの余地がある場合は、敷金、退去時の原状回復の範囲、飼育する動物の申告の方法など、貸主が検討しやすい条件の選択肢を整理して調整します。受け入れるかどうかは貸主が決めます。",
  },
];

// 7. 需要の把握から所有者への相談、受入れ条件の整理、マッチングまで（指示書 第10章 7）
const MATCHING_FLOW: { step: string; body: string }[] = [
  { step: "希望の把握", body: "借りたい・買いたい方から、動物の種類・頭数・大きさと、エリア・予算・時期を伺います。" },
  {
    step: "所有者への相談",
    body: "条件に近い物件の貸主・所有者に、受入れの可否と条件を確認します。ペット可にするか迷っている大家さんには、判断の材料をお示しします。",
  },
  {
    step: "受入れ条件の整理",
    body: "飼育できる頭数・大きさ、敷金、原状回復、共用部の使い方など、双方が契約前に確かめたい条件を整理します。",
  },
  {
    step: "マッチング",
    body: "条件が合う場合に、内見・申込み・契約へ進みます。同じ取引で貸主側と借主側の両方の媒介を当社が行う場合は、その旨を事前にお伝えします。",
  },
];

// 8. 大家さん向け（「まだペット可にすると決めていなくても相談可」＝指示書 第10章 8）
const OWNER_ITEMS: { title: string; body: string }[] = [
  {
    title: "物件の確認",
    body: "床・壁の仕上げ、間取り、共用部の状況を確認します。分譲マンションの一室なら、管理規約の飼育の定めを確かめます。",
  },
  {
    title: "受け入れる範囲の検討",
    body: "動物の種類・頭数・大きさをどこまで認めるか、飼育する動物をどう申告してもらうかを、選択肢として整理します。",
  },
  {
    title: "契約条件の整理",
    body: "敷金、原状回復の範囲、退去時の清掃・消臭、退去時の確認の方法など、契約書と特約で決めておくことを整理します。",
  },
  {
    title: "入居者の募集（貸主側の媒介）",
    body: "受入れの条件を明示して、ペットと暮らす住まいを探す方に向けて募集します。",
  },
];

// 9. 飼育条件・契約上の論点（一般論。個別の判断は資格者＝指示書 第13章）
const CONTRACT_POINTS: { point: string; body: string }[] = [
  {
    point: "動物の種類・頭数・大きさ",
    body: "認める範囲を契約書・特約に書きます。入居後に頭数が増える場合の扱い（事前の申告・承諾）も決めておきます。",
  },
  {
    point: "敷金",
    body: "敷金は、退去時に未払の賃料や原状回復の費用などを差し引いて返還されるお金です（民法第622条の2）。ペットの飼育を理由に積み増す例がありますが、額は物件・動物・契約条件で決まります。",
  },
  {
    point: "原状回復",
    body: "通常の使用による損耗や経年変化は、借主の原状回復義務の対象外です（民法第621条）。一方で、ペットによる柱・クロスのキズや臭いは借主の負担と判断される場合が多いという考え方が、国土交通省のガイドラインで示されています。",
  },
  {
    point: "清掃・消臭、傷・汚損",
    body: "退去時の清掃・消臭の範囲と費用の負担を決めておきます。入居時の部屋の状態を写真などで記録しておくと、退去時の確認がしやすくなります。",
  },
  {
    point: "騒音・近隣への配慮",
    body: "鳴き声・足音・臭いへの配慮を確認します。飼い主には、動物が周りの生活環境に支障を生じさせたり、人に迷惑をかけたりしないよう努める責務があります（動物愛護管理法第7条第1項）。",
  },
  {
    point: "共用部",
    body: "廊下・エレベーターでの抱きかかえやリード、ベランダでの飼育やブラッシングの可否など、管理規約・使用細則の定めを確認します。",
  },
  {
    point: "退去時の確認・緊急連絡",
    body: "退去の立会いで確認する箇所と費用の考え方、飼い主が不在のときや災害時の連絡先・預け先を決めておきます。",
  },
];

// 10. 相談から条件確認、個別案内、契約までの手順（指示書 第10章 10・第12章の「個別案内」）
const STEPS: { step: string; body: string }[] = [
  {
    step: "相談",
    body: "下のフォーム、LINE、電話のいずれかで。借りたい・買いたい方の必須は6項目、大家さんは5項目です。決まっていない項目は「未定」で構いません。",
  },
  { step: "条件の確認", body: "担当者から連絡し、飼育の状況、希望の条件、時期を確かめます。" },
  {
    step: "個別のご案内",
    body: "条件に合いそうな物件と、確認できた飼育の条件をお伝えします。新着の物件を自動でお送りする仕組みはなく、担当者が個別にご案内します。",
  },
  { step: "内見・申込み", body: "飼育する動物の情報（種類・頭数・写真など）の提出を貸主から求められることがあります。" },
  {
    step: "重要事項の説明・契約",
    body: "契約の前に、宅地建物取引士が重要事項を説明します（宅地建物取引業法第35条第1項）。飼育の条件、敷金、原状回復の取り決めを契約書で確かめます。",
  },
];

// 11. FAQ。表示と FAQPage JSON-LD を同じ配列から生成（Faq 部品）。links は Answer に含めない
const FAQ: FaqItem[] = [
  {
    q: "「ペット相談可」の物件なら、多頭飼いや大型犬でも入居できますか。",
    a: "「ペット相談可」は、複数の動物や大型犬を認めるという意味ではありません。頭数・種類・大きさの条件は物件ごとに違い、飼育には貸主の承諾が必要です。当社は募集情報の条件を確かめ、書かれていない点は貸主側に確認します。",
  },
  {
    q: "猫を3匹以上飼っています。住まいを探してもらえますか。",
    a: "お探しします。頭数や飼育の状況を伺ったうえで、条件に合いそうな物件を探し、貸主側に受入れの可否を確認します。見つかるかどうかは、エリア・時期・条件の幅によって変わるため、お約束はできません。",
  },
  {
    q: "大型犬と暮らせる物件を探せますか。",
    a: "探せます。犬の大きさの条件は物件ごとに違い、体重などの上限を決めている物件もあります。ご希望のエリアで大きさの条件を確かめながらお探しし、戸建てを含めるなど候補を広げる方法も一緒に考えます。",
  },
  {
    q: "分譲マンションを買う場合、何に気をつければよいですか。",
    a: "分譲マンションでは、管理規約や使用細則で、飼育できる動物の種類・頭数・大きさが決められていることがあります。購入の前に管理規約の定めを確認します。定めの解釈に争いがある場合は、管理組合や弁護士への確認が必要です。",
  },
  {
    q: "ペットを飼うと、敷金はどのくらい増えますか。",
    a: "決まった金額や割合はありません。ペットの飼育を理由に敷金を積み増す例はありますが、額は物件、動物の種類・頭数、契約条件で変わります。敷金は、退去時に原状回復の費用などを差し引いて返還されるお金です。",
    links: [{ href: "/column/chintaishaku-keiyakusho-doko-wo-yomu", label: "賃貸借契約書、どこを読めばいいか（敷金・禁止事項の条項）" }],
  },
  {
    q: "退去するとき、どこまで費用を負担しますか。",
    a: "通常の使用による損耗や経年変化は、借主の原状回復義務の対象外です。一方で、ペットによる柱・クロスのキズや臭いは借主の負担と判断される場合が多いという考え方が、国土交通省のガイドラインで示されています。負担の範囲は契約書と特約で決まるため、契約の前に具体的に確認します。",
  },
  {
    q: "大家ですが、まだペット可にするか決めていません。相談できますか。",
    a: "相談できます。物件の状態や、分譲マンションの一室なら管理規約の定めを確認したうえで、受け入れる場合の条件の選択肢と、契約で決めておくことを整理します。貸すかどうか、どこまで認めるかは大家さんが決めます。",
  },
  {
    q: "ペット可にすると、賃料や入居の見通しは良くなりますか。",
    a: "お約束はできません。賃料の水準や入居までの期間は、物件の条件や募集の時期で変わります。当社は見込みを断定せず、近隣の募集事例などの判断材料をお示しします。",
  },
  {
    q: "海外から犬・猫と日本へ来る予定です。入国の手続も相談できますか。",
    a: "住まい探しは当社がお受けします。犬・猫の日本入国の手続のご相談は、四葉行政書士事務所が当社とは独立した事業体としてお受けし、ご依頼の場合は同事務所と別々にご契約いただきます。フォームで同意いただいた場合に限り、ご相談の内容を同事務所へ伝えます。同意しなくても住まいのご相談はできます。当社は紹介料を受け取りません。",
  },
  {
    q: "相談に費用はかかりますか。",
    a: "相談は無料です。借りる・買う方の仲介手数料、貸す大家さんへの報酬は、契約が成立したときだけ、宅地建物取引業法第46条に基づく告示の範囲内でいただきます。契約に至らなければ費用は発生しません。",
    links: [{ href: "/ryokin", label: "不動産の料金" }],
  },
];

// この記事の根拠（2026-09-24 取得。上のファイル冒頭の注記と同じ）
const KONKYO: { what: string; source: string }[] = [
  {
    what: "誇大広告の禁止、取引態様の明示、重要事項の説明、報酬、断定的判断の提供の禁止",
    source:
      "宅地建物取引業法（昭和27年法律第176号）第32条、第34条第1項・第2項、第35条第1項、第46条第1項・第2項、第47条の2第1項（現行版 2026年4月1日施行）",
  },
  {
    what: "賃貸借、原状回復、敷金",
    source: "民法（明治29年法律第89号）第601条・第621条・第622条の2第1項・第2項（現行版 2026年6月24日施行）",
  },
  {
    what: "飼い主の責務（周りの生活環境への配慮）",
    source: "動物の愛護及び管理に関する法律（昭和48年法律第105号）第7条第1項（現行版 2026年6月5日施行）",
  },
  {
    what: "ペットによる柱・クロスのキズや臭いの負担の考え方、「例外としての特約」の例（ペット飼育を認めるためのクロス張替費用）",
    source: `国土交通省住宅局「原状回復をめぐるトラブルとガイドライン（再改訂版）」（平成23年8月）本文・別表1（${PET_HOUSING_REFERENCE_DATE_JA}取得）`,
  },
];

/** WebPage。組織・人物は既存 @id の参照にとどめる。speakable＝直答ブロックと対応範囲の節 */
const WEBPAGE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${PAGE_URL}#webpage`,
  url: PAGE_URL,
  name: TITLE,
  description: DESCRIPTION,
  inLanguage: "ja",
  datePublished: PET_HOUSING_LAST_UPDATED_ISO,
  dateModified: PET_HOUSING_LAST_UPDATED_ISO,
  about: [{ "@id": ORG_ID }],
  mentions: [{ "@id": PERSON_ID }],
  publisher: { "@id": ORG_ID },
  mainEntity: { "@id": `${PAGE_URL}#service` },
  speakable: { "@type": "SpeakableSpecification", cssSelector: [".pet-housing-answer", ".pet-housing-scope"] },
};

/** Service に足す項目（@id・name・provider・author・url はシェルが出力。areaServed を上書き）。料金は書かず「相談無料」のみ */
const SERVICE_EXTRA = {
  serviceType:
    "犬・猫の多頭飼育や大型犬と暮らせる賃貸・購入物件の探索、貸主側への受入れの確認と条件の調整、借主側・買主側・貸主側の媒介",
  areaServed: "東京都文京区を中心とする東京23区",
  audience: [
    { "@type": "Audience", audienceType: "犬・猫と暮らせる住まいを探す方（賃貸・購入）" },
    { "@type": "Audience", audienceType: "空室をペット飼育者に貸したい大家さん・所有者" },
  ],
  offers: {
    "@type": "Offer",
    description: "相談は無料。仲介手数料・報酬は契約の成立時のみ（宅地建物取引業法第46条の告示の範囲内）",
  },
};

/** 公開フラグ off、または日本語以外のURLでは 404（metadata と本文の両方で呼ぶ） */
async function notFoundUnlessPublishedJa() {
  if (!PET_HOUSING_PUBLISHED || (await getRequestLocale()) !== "ja") notFound();
}

export async function generateMetadata(): Promise<Metadata> {
  await notFoundUnlessPublishedJa();
  return buildPageMetadata({
    businessKey: "realestate",
    title: TITLE,
    description: DESCRIPTION,
    path: PET_HOUSING_PATH,
    keywords: ["多頭飼い 賃貸", "猫 3匹 賃貸", "大型犬 賃貸 東京", "ペット可 大家 受け入れ", "文京区 ペット 賃貸"],
    locale: "ja",
    absoluteTitle: true,
    availableLocales: ["ja"],
  });
}

const th = "border border-border px-3 py-2";
const td = "border border-border px-3 py-2";
const card = "rounded-xl border border-border bg-surface p-4";

export default async function Page() {
  await notFoundUnlessPublishedJa();
  const summary = await getPublicSurveySummary(SURVEY_SCOPE_ID, "ja");
  const publicListings = compilePublicPetSchoolListings();

  return (
    <>
      <JsonLd data={WEBPAGE_JSONLD} />
      <RealestateServicePage
        path={PET_HOUSING_PATH}
        answerBlock={<span className="pet-housing-answer">{ANSWER}</span>}
        crumbs={[
          { name: "ホーム", href: "/" },
          { name: "サービス", href: "/services" },
          { name: "多頭飼い・大型犬の住まい探し" },
        ]}
        serviceName="ペット多頭飼育・大型犬対応の住宅マッチング（住まい探しと大家さんの受入れ相談）"
        serviceExtra={SERVICE_EXTRA}
        heroSrc="/hero/bunkyo-sakura-16x9.webp"
        heroAlt="桜並木が続く通りと沿道のマンション（文京区の街並み）"
        h1={H1}
        ctaContactHref="#pet-forms"
        authorBio={`浦松 丈二｜四葉不動産株式会社 代表取締役・専任宅地建物取引士。四葉行政書士事務所 代表行政書士。${SR_BIO.ja}。`}
        lead={
          <>
            <p className="text-sm text-text-muted">{RESERVATION}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-relaxed">
              {HERO_POINTS.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <div className="mt-5">
              <PetHousingCta location="hero" />
            </div>
            <p className="mt-3 text-sm text-text-muted">最終更新：{PET_HOUSING_LAST_UPDATED_JA}</p>
          </>
        }
        internalLinks={[
          { href: "/gakku", label: "学区から探す（文京区の通学区域）" },
          { href: "/column/chintaishaku-keiyakusho-doko-wo-yomu", label: "賃貸借契約書、どこを読めばいいか" },
          { href: "/global", label: "外国人・多言語のお部屋探し" },
          { href: "/kikoku", label: "海外赴任からの本帰国と住まい" },
          { href: "/nagare", label: "ご依頼から引渡しまでの流れ" },
          { href: "/ryokin", label: "不動産の料金" },
        ]}
      >
        {/* 事業者主語の一文＋分離受任の一文 */}
        <div className="rounded-xl border border-border bg-surface p-4 text-sm leading-relaxed text-text">
          <p>{OPERATOR_SENTENCE}</p>
          <p className="mt-3 text-text-muted">{SEPARATION_SENTENCE}</p>
        </div>

        {/* 2. 見つかりにくい理由と対応範囲 */}
        <div>
          <ReH2>多頭飼い・大型犬と暮らせる住まいは、なぜ見つかりにくいのですか</ReH2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className={th}>見つかりにくい理由（一般論）</th>
                  <th className={th}>当社が行うこと</th>
                </tr>
              </thead>
              <tbody className="text-text">
                {REASONS.map((r) => (
                  <tr key={r.why}>
                    <td className={td}>{r.why}</td>
                    <td className={td}>{r.ours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pet-housing-scope mt-6">
            <h3 className="font-serif text-lg font-semibold text-ink">対応範囲（誰が何をするか）</h3>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-primary-tint text-left">
                    <th className={th}>すること</th>
                    <th className={th}>誰が</th>
                    <th className={th}>備考</th>
                  </tr>
                </thead>
                <tbody className="text-text">
                  {ROLES.map((r) => (
                    <tr key={r.what}>
                      <td className={td}>{r.ours ? <strong className="text-ink">{r.what}</strong> : r.what}</td>
                      <td className={td}>{r.ours ? <strong className="text-ink">{r.who}</strong> : r.who}</td>
                      <td className={td}>{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-text">
              エリアは文京区を中心に東京23区です。犬・猫のほかの動物も、ご相談ください（受け入れられるかは物件側の条件によります）。
            </p>
          </div>
        </div>

        {/* 3. 借り手向けの調査・所有者への確認・条件の調整 */}
        <div>
          <ReH2>借りたい・買いたい方のために、四葉は何をしますか</ReH2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {RENTER_SERVICES.map((s) => (
              <div key={s.title} className={card}>
                <p className="font-semibold text-ink">{s.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-text">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 leading-relaxed text-text">
            条件に合う物件が見つからないこともあります。そのときは、エリアや間取り、賃貸と購入のどちらも含めるなど、条件の幅を広げる選択肢を一緒に考えます。
          </p>
        </div>

        {/* 4. 今回の調査で確認した対象物件（公開フラグと媒体の許諾がそろうまで何も出さない） */}
        <SurveyCountsPanel
          summary={summary}
          locale="ja"
          cta={
            <a href="#renter-form" className="text-sm font-semibold text-primary underline">
              条件を伝えて相談する
            </a>
          }
        />

        {publicListings.length > 0 && (
          <section aria-label="学区と物件">
            <ReH2>学区と物件</ReH2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-primary-tint text-left">
                    <th className={th}>学区</th>
                    <th className={th}>物件</th>
                  </tr>
                </thead>
                <tbody className="text-text">
                  {publicListings.map((listing) => (
                    <tr key={`${listing.school}:${listing.property}`}>
                      <td className={td}>
                        <Link className="font-semibold text-primary underline" href={listing.href}>{listing.school}</Link>
                      </td>
                      <td className={td}>{listing.property}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 7. 需要の把握から所有者への相談、受入れ条件の整理、マッチングまで */}
        <div>
          <ReH2>借り手と大家さんのあいだで、四葉は何をつなぎますか</ReH2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-text">
            {MATCHING_FLOW.map((f) => (
              <li key={f.step}>
                <strong className="text-ink">{f.step}</strong>：{f.body}
              </li>
            ))}
          </ol>
          <p className="mt-4 rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
            <strong className="text-ink">当社の立場</strong>：媒介です。取引態様は媒介であることを明示します（宅地建物取引業法第34条）。仲介手数料・報酬は契約が成立したときだけで、同法第46条に基づく告示の範囲内です。
          </p>
        </div>

        {/* CTA②（流れの直後） */}
        <PetHousingCta location="mid" />

        {/* 8. 大家さん向け */}
        <div>
          <ReH2>大家さん：ペット飼育者に貸すか決める前でも、相談できますか</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            <strong className="text-ink">相談できます。まだペット可にすると決めていなくても構いません。</strong>
            受け入れる場合に何を決めておけばよいかを整理するところから始めます。
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {OWNER_ITEMS.map((o) => (
              <div key={o.title} className={card}>
                <p className="font-semibold text-ink">{o.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-text">{o.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            ペット可にすることで賃料や入居の見通しがどう変わるかは、物件と募集の時期で変わります。当社は見込みを断定せず、近隣の募集事例などの判断材料をお示しします。報酬は賃貸借契約が成立したときだけです。
          </p>
        </div>

        {/* 9. 飼育条件・契約上の論点（一般論） */}
        <div>
          <ReH2>ペットと暮らす賃貸借では、契約の前に何を決めておきますか</ReH2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className={th}>論点</th>
                  <th className={th}>確認し、取り決めておくこと（一般論）</th>
                </tr>
              </thead>
              <tbody className="text-text">
                {CONTRACT_POINTS.map((c) => (
                  <tr key={c.point}>
                    <td className={`${td} whitespace-nowrap font-medium text-ink`}>{c.point}</td>
                    <td className={td}>{c.body}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 leading-relaxed text-text">
            国土交通省のガイドラインは、居室でのペットの飼育を認めるためのクロスの張替え費用を、「例外としての特約」の例として挙げています。特約にする場合は、内容を貸主・借主の双方が理解したうえで契約書に書きます。契約書の条項の読み方は
            <Link href="/column/chintaishaku-keiyakusho-doko-wo-yomu" className="text-primary underline">
              賃貸借契約書、どこを読めばいいか
            </Link>
            にまとめています。
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            上の表は一般的な論点の整理です。どの条件がふさわしいかは、物件・動物・契約の内容で変わり、全物件に共通の決まりはありません。個別の条件は当社の宅地建物取引士が確認のうえご提案し、法的な判断が必要な点は資格者による確認を要します。
          </p>
        </div>

        {/* 10. 相談から条件確認、個別案内、契約までの手順 */}
        <div>
          <ReH2>相談してから契約まで、どんな手順で進みますか</ReH2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-text">
            {STEPS.map((s) => (
              <li key={s.step}>
                <strong className="text-ink">{s.step}</strong>：{s.body}
              </li>
            ))}
          </ol>
        </div>

        {/* 11. FAQ（FAQPage JSON-LD＝同じ配列から生成。日本語版のみのページ） */}
        <Faq items={FAQ} heading="よくある質問" withJsonLd bare openFirst={false} />

        {/* 12. 借り手フォーム・大家フォーム（CtaBand のお問い合わせは #pet-forms へ向ける） */}
        <div id="pet-forms" className="scroll-mt-24 space-y-8">
          <p className="text-sm leading-relaxed text-text">
            借りたい・買いたい方は「多頭飼いできる家を探す」、大家さん・所有者の方は「ペット飼育者に貸せるか相談する」のフォームからご相談ください。LINE・電話でも受け付けています。
          </p>
          <PetRenterForm />
          <PetOwnerForm />
        </div>

        {/* 12. 信頼性ブロック（会社・免許・代表・担当・所在地・電話） */}
        <div>
          <ReH2>四葉不動産株式会社について</ReH2>
          <dl className="mt-3 grid gap-x-4 gap-y-2 text-sm text-text sm:grid-cols-[8rem_1fr]">
            <dt className="font-medium text-ink">商号</dt>
            <dd>四葉不動産株式会社</dd>
            <dt className="font-medium text-ink">免許</dt>
            <dd>宅地建物取引業 東京都知事(1)第113304号</dd>
            <dt className="font-medium text-ink">代表</dt>
            <dd>代表取締役 浦松丈二（宅地建物取引士・行政書士・{SR_BIO.ja}）</dd>
            <dt className="font-medium text-ink">担当</dt>
            <dd>代表取締役 浦松丈二（宅地建物取引士）</dd>
            <dt className="font-medium text-ink">所在地</dt>
            <dd>〒112-0006 {OFFICE.address}（{OFFICE.access}）</dd>
            <dt className="font-medium text-ink">電話</dt>
            <dd>
              <TelLink phone={OFFICE.tel} location="pet_housing_trust" className="text-primary underline">
                {OFFICE.tel}
              </TelLink>
            </dd>
          </dl>
        </div>

        {/* 12. この記事の根拠＋留保＋文責＋最終更新 */}
        <div>
          <ReH2>この記事の根拠</ReH2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className={th}>内容</th>
                  <th className={th}>根拠</th>
                </tr>
              </thead>
              <tbody className="text-text">
                {KONKYO.map((k) => (
                  <tr key={k.what}>
                    <td className={td}>{k.what}</td>
                    <td className={td}>{k.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-text-muted">
            法令は e-Gov 法令検索で {PET_HOUSING_REFERENCE_DATE_JA}に現行条文を確認。公的資料は取得日を併記。
          </p>
          <p className="mt-3 leading-relaxed text-text">
            本ページは一般的な情報提供であり、個別の法的判断は資格者による確認を要します。飼育できるかどうか、どの条件で契約するかは、貸主の承諾と物件ごとの条件で決まります。当社は媒介として確認と条件の整理を行い、紛争・登記・税務は、弁護士・司法書士・税理士へ直接ご依頼いただく形をご案内します。
          </p>
          <p className="mt-3 text-xs leading-relaxed text-text-muted">
            文責：浦松丈二（四葉不動産株式会社 代表取締役・宅地建物取引士（東京）第293544号／四葉行政書士事務所 代表行政書士・登録番号第25087022号）。
            <Link href="/about/uramatsu" className="text-primary underline">
              執筆者について
            </Link>
          </p>
          <p className="mt-2 text-xs text-text-muted">最終更新：{PET_HOUSING_LAST_UPDATED_JA}</p>
        </div>

        <CannotHandle bare />
      </RealestateServicePage>
    </>
  );
}
