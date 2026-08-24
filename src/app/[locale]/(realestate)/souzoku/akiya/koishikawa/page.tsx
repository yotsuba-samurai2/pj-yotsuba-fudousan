// /souzoku/akiya/koishikawa（地名×空き家 1本目）＝2026-07-27新設・日本語版のみ・監修前ドラフト
// 方式＝RealestateServicePage（手本=/kaigai-owner・/kikoku）。ja先行公開：availableLocales:["ja"]・sitemap側も locales:["ja"]。
// 原稿＝AI指名獲得_3レーン実装パック_v1 §3-4（レーンB）。
//
// 【誘導ページ化を避ける設計（同パック §3-1）】
//   地名だけ差し替えた実質同一ページを量産するとGoogleの「誘導ページ」の扱いになりうる。
//   各ページに「その地名でしか書けない中身」を最低2つ入れる。本ページは次の2つで満たしている：
//   (1) 小石川で空き家が動かなくなる理由＝**浦松の実知見**（H2-3。使い回し禁止）
//   (2) 区の制度の該当箇所＝**小石川が対象になる制度／ならない制度の線引き**（H2-6）
//   **タイトル・H1に「文京区 空き家」を重ねない**（/souzoku/akiya が文京区全体を取っているため町名を主語にする）。
//   /souzoku/akiya へ内部リンクを返して評価を集約する（同パック §3-3）。
//
// 【コンプライアンス】shigyo-compliance-gate 準拠
//   ・借地非訟・成年後見・遺産分割の紛争＝弁護士／登記＝司法書士／税額計算・特別控除＝税理士。
//     いずれも当方が行う形で書かない。四葉は「不動産側の数字を揃える」までと明記。
//   ・区の制度は申請者要件（宅地建物取引業者は木造住宅除却助成の申請者になれない）まで書き、
//     当方が代わりに受け取れるかのような書き方をしない。
//   ・禁止語「ワンストップ」「街の不動産屋」不使用。実績数字なし。
//   ・社会保険労務士・労務に言及しない。区の制度の正式名称「◯◯助成」は固有名詞として正確に書く
//     （自社サービスとしての「助成金」を掲げるのとは別。/office コラムのTOSBEC表記と同じ扱い）。
//
// 【法令・制度の裏取り（2026-07-27 実施・出典は本文末「この記事の根拠」に併記）】
//   ・民法612条＝賃借権の譲渡・転貸には賃貸人の承諾が必要／無断譲渡は解除事由（e-Gov原文確認）
//   ・借地借家法19条＝地主が承諾しないとき、裁判所が承諾に代わる許可を与えうる（借地非訟）（同）
//   ・民法251条＝共有物の変更には他の共有者の同意。2項＝所在等が不明な共有者がいる場合の裁判所の裁判（同）
//   ・民法859条の3＝成年被後見人の居住用不動産の売却等には家庭裁判所の許可が必要（同）
//   ・空家法（令和5年法律第50号）令和5年12月13日施行・管理不全空家等／勧告で住宅用地特例が適用除外
//     （国交省 001712029.pdf。小規模住宅用地200㎡以下＝課税標準1/6）
//   ・文京区 空家等相談事業＝無料・同一年度内3回まで・住環境課 03-5803-1374
//   ・文京区 空家等利活用事業＝**改修費**上限200万円。「営利を目的としない集会・交流施設等」として
//     10年以上の賃貸借契約が要件＝**除却費の補助ではない**（仕様書§3-4の記述はこの点が誤り）
//   ・文京区 木造住宅除却助成（耐震化促進事業）＝**区内全域**・解体工事費の2/3以内・上限150万円・
//     昭和56年5月31日以前の木造住宅・**申請者は所有者（宅地建物取引業者を除く）**・
//     入口は無料の「容易な耐震診断」・令和8年度の受付期限は令和8年12月4日・03-5803-1846
//   ・文京区 不燃化推進事業の除却費助成＝対象は大塚五・六丁目／千駄木二丁目／千駄木五丁目／根津二丁目
//     ＝**小石川は対象外**
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";

/** 可視の最終更新日。ArticleJsonLd の dateModified と必ず同じ日付にする */
const LAST_UPDATED_ISO = "2026-07-27";
const LAST_UPDATED_JA = "2026年7月27日";

const JA_ANSWER_BLOCK =
  "小石川（文京区）の空き家の相談先は、大きく①文京区の空家等対策の窓口 ②不動産会社（買取・仲介） ③司法書士・税理士・弁護士などの士業に分かれます。四葉不動産株式会社は隣の小日向（茗荷谷駅徒歩5分）にあり、宅地建物取引士と行政書士を兼ねる代表が、管理・賃貸・売却の判断材料づくりから書類作成まで続けてお受けします。登記は司法書士、税務は税理士に分けてお願いします。";

// H2-1 目的別の相談先。下2行が他社の案内で抜けている部分。
const JA_SODANSAKI: { what: string; who: string; note: string; ours?: boolean }[] = [
  {
    what: "とりあえず現状を整理したい",
    who: "文京区の空家等対策の窓口（無料相談）",
    note: "同一年度内に3回まで利用できます",
  },
  { what: "名義が親のままで動かせない", who: "司法書士", note: "相続登記は司法書士の業務です" },
  { what: "売ったときの税金が心配", who: "税理士", note: "譲渡所得の計算・特別控除の適用可否" },
  { what: "相続人の間でもめている", who: "弁護士", note: "遺産分割の紛争" },
  {
    what: "貸す・売る・持ち続けるの判断そのものをしたい",
    who: "宅地建物取引士",
    note: "賃料相場・売却価格・維持費を並べて比較する段階",
    ours: true,
  },
  {
    what: "その判断のあと、書類の作成まで一続きで進めたい",
    who: "宅地建物取引士＋行政書士",
    note: "遺産分割協議書などの作成を伴う場合",
    ours: true,
  },
];

// H2-4 3つの出口を同じ物差しで並べる。「時間の目安」は浦松の実務感覚（2026-07-27）。
const JA_DEGUCHI: { axis: string; sell: string; rent: string; keep: string }[] = [
  {
    axis: "初期に出ていく費用",
    sell: "残置物処分・測量・（必要なら）解体",
    rent: "原状回復・設備更新",
    keep: "点検・最低限の修繕",
  },
  { axis: "手元に入るもの", sell: "一度きりの売却代金", rent: "毎月の賃料", keep: "なし" },
  { axis: "続く負担", sell: "なし", rent: "空室・修繕・入居者対応", keep: "固定資産税・管理費" },
  {
    axis: "時間の目安",
    sell: "最短でも数か月",
    rent: "最短でも数か月",
    keep: "—",
  },
  {
    axis: "主な論点",
    sell: "譲渡所得の課税（税理士）",
    rent: "賃貸経営としての採算",
    keep: "管理不全空家等の勧告リスク",
  },
];

// H2-8 この記事の根拠
const JA_KONKYO: { what: string; source: string }[] = [
  {
    what: "管理不全空家等・住宅用地特例の解除",
    source:
      "空家等対策の推進に関する特別措置法（令和5年法律第50号・2023年12月13日施行）／国土交通省「固定資産税等の住宅用地特例に係る空き家対策上の措置」",
  },
  {
    what: "借地上の建物を売るには地主の承諾が要ること／承諾に代わる許可",
    source: "民法第612条第1項／借地借家法第19条第1項",
  },
  {
    what: "共有物の変更に他の共有者の同意が要ること／所在等不明共有者がいる場合の裁判",
    source: "民法第251条第1項・第2項",
  },
  {
    what: "成年被後見人の居住用不動産の売却に家庭裁判所の許可が要ること",
    source: "民法第859条の3",
  },
  { what: "相続登記が司法書士の業務であること", source: "司法書士法第3条第1項第1号" },
  {
    what: "税務書類の作成・税務代理が税理士の業務であること",
    source: "税理士法第2条第1項第1号・第2号、第52条",
  },
  {
    what: "文京区の空家等相談事業・空家等利活用事業／木造住宅除却助成／不燃化推進事業の対象地区",
    source: "文京区公式サイトおよび文京区耐震化促進事業パンフレット（令和8年4月作成）・2026年7月27日確認",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    businessKey: "realestate",
    title: "小石川の空き家をどうするか｜売却・賃貸・管理の相談先 | 四葉不動産",
    description:
      "文京区小石川・春日の空き家について、区の窓口・買取業者・士業のどこに相談すべきかを整理しました。宅地建物取引士と行政書士を兼ねる代表が、管理から売却までの判断材料づくりをお受けします。茗荷谷駅徒歩5分。",
    path: "/souzoku/akiya/koishikawa",
    keywords: [
      "小石川 空き家 相談",
      "文京区 小石川 空き家 売却",
      "春日 空き家 管理",
      "小石川 借地 空き家 売却",
      "空き家 共有名義 売れない",
    ],
    locale: "ja",
    absoluteTitle: true,
    availableLocales: ["ja"],
  });
}

export default async function Page() {
  return (
    <>
      <ArticleJsonLd
        businessKey="realestate"
        title="小石川の空き家、どうするか —— 相談先の選び方と、動かなくなる前の手当て"
        description="文京区小石川・春日の空き家について、区の窓口・買取業者・士業のどこに相談すべきかを整理しました。借地・共有で動かなくなる理由と、区の制度が使える条件をまとめています。"
        path="/souzoku/akiya/koishikawa"
        datePublished={LAST_UPDATED_ISO}
        dateModified={LAST_UPDATED_ISO}
      />
      <RealestateServicePage
        path="/souzoku/akiya/koishikawa"
        answerBlock={JA_ANSWER_BLOCK}
        crumbs={[
          { name: "ホーム", href: "/" },
          { name: "相続した空き家", href: "/souzoku/akiya" },
          { name: "小石川の空き家" },
        ]}
        serviceName="小石川・春日の空き家の管理・賃貸・売却の相談"
        heroSrc="/hero/bunkyo-sakura-16x9.webp"
        heroAlt="文京区小石川の街並みのイメージ"
        h1="小石川の空き家、どうするか —— 相談先の選び方と、動かなくなる前の手当て"
        ctaVariant="property-general"
        ctaIntent="akiya"
        lead={
          <>
            <p>
              空き家は、<strong>放っておくと選択肢が減っていきます。</strong>小石川で動かなくなる案件には共通した理由があり、その多くは<strong>建物の状態ではなく権利関係</strong>です。このページでは、目的別の相談先と、区の制度が使える条件を整理します。
            </p>
            <p className="mt-3">
              文京区全体の空き家の話は
              <Link href="/souzoku/akiya" className="text-primary underline">
                相続した空き家の管理・活用・売却
              </Link>
              にまとめています。
            </p>
            <p className="mt-3 text-sm text-text-muted">最終更新：{LAST_UPDATED_JA}</p>
          </>
        }
        internalLinks={[
          { href: "/souzoku/akiya", label: "相続した空き家｜管理・活用・売却" },
          { href: "/souzoku", label: "文京区で不動産を相続したら｜完全ガイド" },
          { href: "/souzoku/nagare", label: "売却までの流れ" },
          { href: "/kaigai-owner", label: "海外に住んだまま日本の家を持つ" },
          { href: "/access", label: "アクセス・ご相談" },
          { href: "/contact", label: "お問い合わせ" },
        ]}
        crossLinkLead="遺産分割協議書など、相続に伴う書類の作成は併設の四葉行政書士事務所が別契約で受任します。"
      >
        {/* H2-1 相談先 */}
        <div>
          <ReH2>小石川の空き家は、どこに相談すればいいですか？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            相談先は目的で変わります。<strong className="text-ink">「まず何を決めたいか」から選んでください。</strong>
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className="border border-border px-3 py-2">決めたいこと</th>
                  <th className="border border-border px-3 py-2">向いている相談先</th>
                  <th className="border border-border px-3 py-2">補足</th>
                </tr>
              </thead>
              <tbody className="text-text">
                {JA_SODANSAKI.map((s) => (
                  <tr key={s.what}>
                    <td className="border border-border px-3 py-2">
                      {s.ours ? <strong className="text-ink">{s.what}</strong> : s.what}
                    </td>
                    <td className="border border-border px-3 py-2">
                      {s.ours ? <strong className="text-ink">{s.who}</strong> : s.who}
                    </td>
                    <td className="border border-border px-3 py-2">{s.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 leading-relaxed text-text">
            多くの案内では、下の2行が抜けています。<strong className="text-ink">「誰に売るか」の前に「売るのか貸すのか持つのか」を決める段階があり、そこは不動産の実勢を握っている者にしか判断材料を出せません。</strong>
          </p>
        </div>

        {/* H2-2 放置のリスク */}
        <div>
          <ReH2>放置したままだと、制度上どうなりますか？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            2023年12月13日施行の改正空家法（空家等対策の推進に関する特別措置法／令和5年法律第50号）で「<strong className="text-ink">管理不全空家等</strong>」が新設されました。
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-text">
            <li>特定空家になる<strong className="text-ink">おそれ</strong>がある状態でも、区から指導・勧告の対象になります</li>
            <li>
              <strong className="text-ink">勧告を受けると、土地の固定資産税の住宅用地特例（課税標準を最大6分の1に軽減）が外れます</strong>
            </li>
          </ul>
          <p className="mt-3 leading-relaxed text-text">
            つまり、以前は「倒壊のおそれ」まで至らなければ税負担は変わりませんでしたが、<strong className="text-ink">今は手前の段階で変わります。</strong>庭木の越境、郵便物の滞留、擁壁のひび。初期のサインの段階で手当てするかどうかで、負担額が変わります。
          </p>
        </div>

        {/* H2-3 小石川固有＝浦松の実知見（使い回し禁止のブロック） */}
        <div>
          <ReH2>小石川で空き家が動きにくくなる、典型的な理由は何ですか？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            建物の傷み具合よりも、<strong className="text-ink">権利関係でつまずく案件のほうが多い</strong>のがこの地域の特徴です。小石川には古くからの寺院が多く、その周辺には<strong className="text-ink">借地</strong>と<strong className="text-ink">共有</strong>が今も残っています。そこへ<strong className="text-ink">相続</strong>や<strong className="text-ink">持ち主の施設入居</strong>が重なると、売ろうと思っても手続きが先に立ちはだかります。
          </p>

          <p className="mt-5 font-medium text-ink">① 建物は自分のものでも、土地は借地である</p>
          <p className="mt-2 leading-relaxed text-text">
            借地上の建物を第三者に売るには、<strong className="text-ink">土地を貸している側（地主）の承諾が必要</strong>です（民法第612条第1項）。承諾を得ずに譲渡すると契約を解除されうるため、実務では承諾が取れるまで話が進みません。地主が承諾しない場合、<strong className="text-ink">裁判所に「承諾に代わる許可」を申し立てる手続き</strong>があります（借地借家法第19条第1項）が、これは裁判所の手続きであり、その分の時間がかかります。
          </p>
          <p className="mt-2 leading-relaxed text-text">
            <strong className="text-ink">判断にどう効くか。</strong>買主を探し始める前に、まず登記と契約書で借地かどうかを確かめ、地主の意向を先に聞く——という順番になります。ここを飛ばして買主を決めてしまうと、承諾が取れずに白紙に戻ります。
          </p>

          <p className="mt-5 font-medium text-ink">② 名義が共有のまま代替わりしている</p>
          <p className="mt-2 leading-relaxed text-text">
            共有の不動産を丸ごと売るには、<strong className="text-ink">共有者全員が売主として関与する必要があります</strong>。共有物に変更を加えるには他の共有者の同意が要る（民法第251条第1項）ためで、一人でも反対すれば止まります。相続を経るたびに共有者は増えるので、代が変わるほど難しくなります。
          </p>
          <p className="mt-2 leading-relaxed text-text">
            <strong className="text-ink">判断にどう効くか。</strong>共有者の人数と所在の確認が最初の作業になります。連絡が取れない共有者がいる場合は、裁判所の手続き（民法第251条第2項ほか）を検討することになり、こちらも時間がかかります。
          </p>

          <p className="mt-5 font-medium text-ink">③ きっかけが「持ち主の施設入居」である</p>
          <p className="mt-2 leading-relaxed text-text">
            ご本人が施設に入り、空いた自宅を売るという相談は少なくありません。このとき論点になるのが<strong className="text-ink">ご本人の判断能力</strong>です。成年後見が付いている場合、<strong className="text-ink">居住用の不動産を売るには家庭裁判所の許可が必要</strong>です（民法第859条の3）。ご家族の総意があっても、この許可なしには進みません。
          </p>
          <p className="mt-2 leading-relaxed text-text">
            <strong className="text-ink">判断にどう効くか。</strong>「誰が売主になれるのか」を最初に確定させる必要があります。ここが未確定のまま売却活動を始めると、買主が決まってから止まります。
          </p>

          <p className="mt-5 leading-relaxed text-text">
            ①〜③はいずれも、<strong className="text-ink">建物を直せば解決する種類の問題ではありません。</strong>そして、どれも<strong className="text-ink">気づくのが早いほど選択肢が残ります</strong>。売れるかどうかを調べる前に、まず「売主になれるのは誰か」「土地は誰のものか」を確かめる。それがこの地域での順番です。
          </p>
          <p className="mt-3 leading-relaxed text-text">
            なお、借地非訟・共有物分割・成年後見はいずれも<strong className="text-ink">裁判所の手続き</strong>であり、その代理は弁護士の業務です。四葉不動産株式会社は、これらが必要かどうかの見極めと、<strong className="text-ink">不動産側の数字</strong>（賃料相場・売却見込み・維持費）の整理までをお受けし、必要な場面で提携先の専門家をご案内します。
          </p>
        </div>

        {/* H2-4 3つの出口 */}
        <div>
          <ReH2>売る・貸す・持ち続けるは、何で決めますか？</ReH2>
          <p className="mt-3 leading-relaxed text-text">3つの出口を、同じ物差しで並べます。</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className="border border-border px-3 py-2"> </th>
                  <th className="border border-border px-3 py-2">売る</th>
                  <th className="border border-border px-3 py-2">貸す</th>
                  <th className="border border-border px-3 py-2">持ち続ける（管理のみ）</th>
                </tr>
              </thead>
              <tbody className="text-text">
                {JA_DEGUCHI.map((d) => (
                  <tr key={d.axis}>
                    <td className="border border-border px-3 py-2 font-medium text-ink whitespace-nowrap">{d.axis}</td>
                    <td className="border border-border px-3 py-2">{d.sell}</td>
                    <td className="border border-border px-3 py-2">{d.rent}</td>
                    <td className="border border-border px-3 py-2">{d.keep}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 leading-relaxed text-text">
            <strong className="text-ink">売るにしても貸すにしても、最短で数か月はかかります。</strong>前の節の①〜③が絡むと、そこからさらに延びます。「来月には現金化したい」という前提だと、選べる道が買取に限られてしまうので、<strong className="text-ink">時間の見積もりは早い段階で立てておくほうが有利です。</strong>
          </p>
          <p className="mt-3 leading-relaxed text-text">
            <strong className="text-ink">税額の計算と特別控除の適用可否は税理士の業務です。</strong>四葉不動産株式会社は、賃料相場・売却見込み・維持費という<strong className="text-ink">不動産側の数字</strong>を揃えてお出しします。
          </p>
        </div>

        {/* H2-5 遠方・海外 */}
        <div>
          <ReH2>遠方や海外に住んでいても進みますか？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            進みます。相続で空き家を引き継ぐ方の多くは、その家に住んでいません。
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-text">
            <li>現況の確認は写真・動画でご報告します</li>
            <li>打ち合わせはオンラインで、時差にも合わせます</li>
            <li>
              海外にお住まいで、日本の不動産を持ち続ける場合は
              <Link href="/kaigai-owner" className="text-primary underline">
                〈海外に住んだまま、日本の家をどうするか〉
              </Link>
              に、家賃の源泉徴収と納税管理人をまとめています
            </li>
            <li>
              帰国してご自分で住む予定がある場合は
              <Link href="/kikoku" className="text-primary underline">
                〈海外赴任からの本帰国〉
              </Link>
              へ
            </li>
          </ul>
        </div>

        {/* H2-6 区の制度＝小石川固有の線引き（2つ目の「その地名でしか書けない中身」） */}
        <div>
          <ReH2>文京区の制度は使えますか？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            使えるものと、<strong className="text-ink">小石川では使えないもの</strong>があります。「文京区には空き家の補助がある」とだけ書かれた案内が多いので、線を引いておきます。
          </p>

          <p className="mt-5 font-medium text-ink">相談だけなら無料で受けられます</p>
          <p className="mt-2 leading-relaxed text-text">
            区内の空家の所有者・権利者を対象にした<strong className="text-ink">空家等相談事業</strong>があり、<strong className="text-ink">無料</strong>で、<strong className="text-ink">同一年度内に3回まで</strong>利用できます。申請書を都市計画部住環境課へ郵送または持参します（住環境課管理担当 03-5803-1374）。
          </p>

          <p className="mt-5 font-medium text-ink">解体費なら「木造住宅除却助成」（小石川も対象）</p>
          <p className="mt-2 leading-relaxed text-text">
            区の耐震化促進事業にある<strong className="text-ink">木造住宅除却助成</strong>は<strong className="text-ink">区内全域が対象</strong>で、小石川も含まれます。<strong className="text-ink">昭和56年5月31日以前に建築された木造住宅</strong>（延べ面積の2分の1以上を住宅に使っているもの）で耐震化基準を満たさない建物について、<strong className="text-ink">解体工事費の3分の2以内・上限150万円</strong>が助成されます。入口は区職員が行う<strong className="text-ink">無料の「容易な耐震診断」</strong>で、倒壊の危険性があると判定されれば申請に進めます。
          </p>
          <blockquote className="mt-3 rounded-lg border-l-4 border-primary bg-surface p-4 text-sm leading-relaxed text-text">
            <strong className="text-ink">申請できるのは建物の所有者（個人または中小企業者）で、宅地建物取引業者は申請者になれません。</strong>四葉が代わりに受け取る制度ではなく、<strong className="text-ink">所有者ご本人が申請する制度</strong>です。当社は要件に当てはまりそうかの確認と、区への相談の段取りまでをお手伝いします。
          </blockquote>

          <p className="mt-5 font-medium text-ink">不燃化推進事業の除却費助成は、小石川では使えません</p>
          <p className="mt-2 leading-relaxed text-text">
            除却費の助成にはもう一つ<strong className="text-ink">不燃化推進事業</strong>がありますが、対象は<strong className="text-ink">大塚五・六丁目地区、千駄木二丁目、千駄木五丁目、根津二丁目</strong>に限られます。<strong className="text-ink">小石川は対象外</strong>です。同じ「文京区の除却費助成」でも、住所によって使える制度が違います。
          </p>

          <p className="mt-5 font-medium text-ink">空家等利活用事業（上限200万円）は、解体費ではありません</p>
          <p className="mt-2 leading-relaxed text-text">
            <strong className="text-ink">空家等利活用事業</strong>の補助（上限200万円）は<strong className="text-ink">改修費</strong>で、解体費ではありません。しかも、改修後に「営利を目的としない集会・交流施設、体験・学習施設その他の地域活性化に資すると区が認める施設」として<strong className="text-ink">10年以上の賃貸借契約を続ける</strong>ことが条件です。<strong className="text-ink">普通に貸したい方・売りたい方が使える制度ではありません。</strong>
          </p>

          <p className="mt-5 leading-relaxed text-text">
            <strong className="text-ink">金額・要件・受付期間は年度で変わります。</strong>令和8年度の木造住宅除却助成の申請受付期限は<strong className="text-ink">令和8年12月4日</strong>です（耐震・不燃化担当 03-5803-1846）。上記はいずれも<strong className="text-ink">2026年7月27日に区の公式資料で確認した内容</strong>ですので、着手前に必ず区の最新のご案内でご確認ください。制度を使えるかどうかで、解体か売却かの結論が変わることがあります。申請書類の作成は行政書士の業務として、別契約でお受けできます。
          </p>
        </div>

        {/* H2-7 四葉の視点 */}
        <div>
          <ReH2>四葉に相談する意味はどこにありますか？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            代表の浦松丈二は、<strong className="text-ink">宅地建物取引士と行政書士</strong>を兼ねています。毎日新聞社で記者を34年務め、中国総局長として中国や台湾、タイに駐在しました。
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-text">
            <li>
              <strong className="text-ink">茗荷谷駅徒歩5分。</strong>小石川・春日は歩いて見に行ける距離です
            </li>
            <li>
              <strong className="text-ink">「貸すか売るか」の判断材料づくりと、そのあとの書類作成を、続けてお受けします</strong>
            </li>
            <li>
              登記は司法書士、税務は税理士、裁判所の手続きは弁護士と、それぞれ直接ご契約いただきます。<strong className="text-ink">四葉が間に立って報酬を受け取ることはありません</strong>
            </li>
          </ul>
        </div>

        {/* H2-8 この記事の根拠 */}
        <div>
          <ReH2>この記事の根拠</ReH2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className="border border-border px-3 py-2">内容</th>
                  <th className="border border-border px-3 py-2">根拠</th>
                </tr>
              </thead>
              <tbody className="text-text">
                {JA_KONKYO.map((k) => (
                  <tr key={k.what}>
                    <td className="border border-border px-3 py-2">{k.what}</td>
                    <td className="border border-border px-3 py-2">{k.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 leading-relaxed text-text">
            本ページは一般的な情報提供です。個別の税務判断は税理士、登記は司法書士、裁判所の手続きの代理は弁護士が行います。不動産の媒介・管理は四葉不動産株式会社（宅地建物取引業 東京都知事(1)第113304号）、書類の作成は四葉行政書士事務所が、<strong className="text-ink">それぞれ別の契約</strong>としてお受けします。
          </p>
        </div>

        <CannotHandle bare />
      </RealestateServicePage>
    </>
  );
}
