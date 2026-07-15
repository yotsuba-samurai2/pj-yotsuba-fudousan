// プライバシーポリシーにGA4記載（analytics節）を4言語で追加し、お問い合わせを6節へ繰り下げ。冪等。
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const DRY = process.argv.includes("--dry-run");

const ANALYTICS = {
  ja: {
    title: "5. アクセス解析ツール（Googleアナリティクス）",
    content:
      "当サイトでは、サービス向上のため、Google LLCが提供するアクセス解析ツール「Googleアナリティクス」を利用しています。GoogleアナリティクスはCookie等を利用して、閲覧ページ、滞在時間、流入経路、ブラウザや端末の種類、おおよその地域などのアクセス情報を収集します。これらの情報に、氏名・住所・電話番号など個人を特定できる情報は含まれません。",
    items: [
      "収集されたアクセス情報は、Google社のサーバー（日本国外を含みます）に送信され、同社のプライバシーポリシーに基づき管理されます。",
      "情報の収集を望まない場合は、ブラウザの設定でCookieを無効にするか、Google社が提供するオプトアウト アドオンをインストールすることで、収集を無効化できます。",
    ],
    googlePolicyLink: "Googleのプライバシーポリシー",
    optoutLink: "Googleアナリティクス オプトアウト アドオン",
  },
  en: {
    title: "5. Website Analytics (Google Analytics)",
    content:
      "This website uses Google Analytics, a web analytics service provided by Google LLC, to help us improve our services. Google Analytics uses cookies and similar technologies to collect access data such as pages viewed, time spent on the site, referral sources, browser and device types, and approximate location. This data does not include personally identifiable information such as your name, address, or phone number.",
    items: [
      "The collected data is transmitted to and stored on Google's servers (which may be located outside Japan) and is managed in accordance with Google's Privacy Policy.",
      "If you prefer not to have your data collected, you can disable cookies in your browser settings or install the opt-out browser add-on provided by Google.",
    ],
    googlePolicyLink: "Google Privacy Policy",
    optoutLink: "Google Analytics Opt-out Browser Add-on",
  },
  "zh-tw": {
    title: "5. 網站分析工具（Google Analytics）",
    content:
      "為提升服務品質，本網站使用Google LLC提供的網站分析工具「Google Analytics」。Google Analytics會透過Cookie等技術，收集瀏覽頁面、停留時間、流量來源、瀏覽器與裝置類型、大致地區等存取資訊。這些資訊不包含姓名、地址、電話號碼等可識別個人身分的資料。",
    items: [
      "所收集的存取資訊將傳送至Google公司的伺服器（可能位於日本境外），並依據該公司的隱私權政策進行管理。",
      "如不希望資料被收集，可於瀏覽器設定中停用Cookie，或安裝Google提供的選擇不採用瀏覽器外掛程式，即可停止資料收集。",
    ],
    googlePolicyLink: "Google隱私權政策",
    optoutLink: "Google Analytics 選擇不採用瀏覽器外掛程式",
  },
  zh: {
    title: "5. 网站分析工具（Google Analytics）",
    content:
      "为提升服务质量，本网站使用Google LLC提供的网站分析工具「Google Analytics」。Google Analytics会通过Cookie等技术，收集浏览页面、停留时间、流量来源、浏览器与设备类型、大致地区等访问信息。这些信息不包含姓名、地址、电话号码等可识别个人身份的资料。",
    items: [
      "所收集的访问信息将发送至Google公司的服务器（可能位于日本境外），并依据该公司的隐私政策进行管理。",
      "如不希望数据被收集，可在浏览器设置中禁用Cookie，或安装Google提供的停用浏览器插件，即可停止数据收集。",
    ],
    googlePolicyLink: "Google隐私政策",
    optoutLink: "Google Analytics 停用浏览器插件",
  },
};

for (const [locale, analytics] of Object.entries(ANALYTICS)) {
  const row = await prisma.translation.findUnique({ where: { locale } });
  if (!row) { console.log(`${locale}: 行なし・スキップ`); continue; }
  const data = row.data;
  const pp = data?.privacyPolicy;
  if (!pp?.sections) { console.log(`${locale}: privacyPolicyなし・スキップ`); continue; }
  pp.sections.analytics = analytics;
  const iq = pp.sections.inquiry;
  if (iq?.title?.match(/^5[.．]/)) iq.title = iq.title.replace(/^5([.．])/, "6$1");
  console.log(`${DRY ? "[dry] " : ""}${locale}: analytics追加 / inquiry.title="${iq?.title}"`);
  if (!DRY) await prisma.translation.update({ where: { locale }, data: { data } });
}
await prisma.$disconnect();
