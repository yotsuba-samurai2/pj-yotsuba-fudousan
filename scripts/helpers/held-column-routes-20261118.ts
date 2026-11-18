// Exact, source-verified internal destinations for these held manuscripts only.
// This checks localized links during seed generation. It never records editorial approval.
const ROUTES: Readonly<Record<string, readonly string[]>> = {
  "legal:keiei-kanri-zairyu-2025-kaisei-shihonkin-joukin-shokuin-chuka-taiwan": [
    "/about/uramatsu",
    "/global",
    "/legal/column/keieikanri-koshin-jigyo-keizokusei-rissho-chuka-taiwan",
    "/legal/column/keieikanri-zairyu-chuka-kigyousha-kaisha-setsuritsu",
    "/legal/nagare",
    "/legal/ryokin",
    "/legal/services"
  ],
  "realestate:chugokugo-kokudo-riyo-keikaku-ho-jigo-todokede-menseki": [
    "/about/uramatsu",
    "/column/chugokugo-buyer-juyojiko-check-toushi-bukken",
    "/column/chuka-shihon-kisei-soukin-nihon-fudosan-kessai",
    "/column/hikyojusha-baibai-baishu-gensen-10-21-chugokugo",
    "/column/juyo-tochi-chosa-ho-chushi-tokubetsu-chushi-torihiki-todokede",
    "/toushi"
  ],
  "legal:houkatsu-tokutei-izo-chigai-juisha-hoki": [
    "/about/uramatsu",
    "/legal/column/jihitsu-kosei-yuigon",
    "/legal/column/souzoku-iryubun-kiso",
    "/legal/column/tokutei-zaisan-shokei-yuigon-izo-chigai",
    "/legal/nagare",
    "/legal/ryokin",
    "/legal/services/inheritance",
    "/souzoku"
  ],
  "legal:kensetsugyo-kessan-henko-todoke-jigyo-nendo-shuryo": [
    "/about/uramatsu",
    "/legal/column/keiei-jiko-shinsa-keishin-nyusatsu-sankaku-shikaku",
    "/legal/column/kensetsugyo-kyoka-yoken-keikan-sengi-zaisan",
    "/legal/nagare",
    "/legal/ryokin",
    "/legal/services"
  ],
  "legal:gaikokuseki-nihon-zaiju-yuigon-houshiki-junkyoho-chuka-taiwan": [
    "/about/uramatsu",
    "/legal/column/gaikokuseki-hisouzokunin-junkyoho-tsusokuho-36jo",
    "/legal/column/jihitsu-kosei-yuigon",
    "/legal/column/jihitsu-yuigon-hokan-seido-souzoku-tetsuzuki",
    "/legal/column/kosei-shosho-yuigon-koshonin-shonin-hiyo",
    "/legal/nagare",
    "/legal/ryokin",
    "/legal/services/inheritance",
    "/souzoku"
  ],
  "legal:shurui-seizo-menkyo-craft-beer-happosyu-youken": [
    "/about/uramatsu",
    "/legal/column/inshokuten-eigyo-kyoka-hokenjo-setsubi-kijun-shokuhin-eisei",
    "/legal/column/shokuhin-seizogyo-kyoka-bukken-setsubi-kijun",
    "/legal/column/shurui-kouri-menkyo-tenpo-bukken-yoken",
    "/legal/nagare",
    "/legal/ryokin",
    "/legal/services"
  ],
  "realestate:chuka-pro-kyutaishin-kubun-mansion-dd": [
    "/about/uramatsu",
    "/column/chugokugo-buyer-juyojiko-check-toushi-bukken",
    "/column/chugokugo-buyer-kanri-kiyaku-shuzen-keikaku-check",
    "/column/chuka-pro-shuueki-biru-kensazumisho-dd",
    "/toushi"
  ],
  "realestate:shoene-tekigo-gimuka-2025-chintai-shinchiku-bukken": [
    "/about/uramatsu",
    "/column/kenchiku-shoene-ho-shoene-seino-hyoji-koukoku-2024",
    "/toushi"
  ],
  "legal:shakai-fukushi-hojin-setsuritsu-ninka-nagare-shisan-youken": [
    "/about/uramatsu",
    "/legal/column/ippan-shadan-houjin-setsuritsu-hieiri-teikan",
    "/legal/column/iryohojin-setsuritsu-ninka-nagare-shorui",
    "/legal/column/npo-hojin-setsuritsu-ninsho-nagare-shokatsucho",
    "/legal/nagare",
    "/legal/ryokin",
    "/legal/services"
  ],
  "legal:startup-visa-gaikokujin-kigyo-katsudo-sokushin-tokutei-katsudo": [
    "/about/uramatsu",
    "/global",
    "/legal/column/keiei-kanri-zairyu-2025-kaisei-shihonkin-joukin-shokuin-chuka-taiwan",
    "/legal/column/keieikanri-koshin-jigyo-keizokusei-rissho-chuka-taiwan",
    "/legal/column/keieikanri-zairyu-chuka-kigyousha-kaisha-setsuritsu",
    "/legal/nagare",
    "/legal/ryokin",
    "/legal/services"
  ],
  "realestate:chugokugo-buyer-keibai-kobai-bukken-nyusatsu-daikin-nouhu": [
    "/about/uramatsu",
    "/column/chugokugo-buyer-juyojiko-check-toushi-bukken",
    "/column/souzoku-sashiosae-toki-ari-fudosan-baikyaku",
    "/toushi"
  ],
  "realestate:ev-kyusoku-juden-setsubi-chintai-shougyou-bukken-shoubou": [
    "/about/uramatsu",
    "/column/kenchiku-shoene-ho-shoene-seino-hyoji-koukoku-2024",
    "/column/shoene-tekigo-gimuka-2025-chintai-shinchiku-bukken",
    "/office",
    "/toushi"
  ],
  "legal:jokaso-koji-gyo-touroku-seiso-gyo-kyoka-nagare-youken": [
    "/about/uramatsu",
    "/legal/column/kaitai-koji-gyo-touroku-kensetsu-kyoka-chigai",
    "/legal/column/kensetsugyo-kyoka-yoken-keikan-sengi-zaisan",
    "/legal/column/sanpai-shushu-unpan-kyoka-torikata",
    "/legal/nagare",
    "/legal/ryokin",
    "/legal/services"
  ],
  "legal:yuigon-to-kotonaru-isanbunkatsu-kyogi-kahi-youken": [
    "/about/uramatsu",
    "/legal/column/isan-bunkatsu-kyogi-yarinaoshi-goui-kaijo",
    "/legal/column/isan-bunkatsu-kyougisho",
    "/legal/column/yuigon-shikkosha-shokumu-sennin-dare",
    "/legal/column/yuigon-tekkai-teishoku-fukusu-yuigon-yuretsu",
    "/legal/nagare",
    "/legal/ryokin",
    "/legal/services/inheritance",
    "/souzoku"
  ],
  "realestate:seikatsu-kaigo-jigyosho-bukken-youken-shitei": [
    "/about/uramatsu",
    "/column/kensazumisho-nashi-bukken-fukushi-youto-henko",
    "/legal/column/seikatsu-kaigo-shitei-bukken-yoken",
    "/legal/services/shogai-fukushi",
    "/office",
    "/toushi"
  ],
  "realestate:souzoku-kashiya-akewatashi-seitojiyu-tachinoki-ryo-baikyaku": [
    "/about/uramatsu",
    "/column/chugokugo-owner-teiki-shakuya-futsu-chigai-saikeiyaku",
    "/column/kaigai-souzokunin-owner-change-baikyaku-gensen",
    "/souzoku"
  ],
  "legal:dai-nishu-doubutsu-toriatsukai-todokede-hieiri-jotokai-youken": [
    "/about/uramatsu",
    "/legal/column/dai-isshu-doubutsu-toriatsukai-touroku-youken",
    "/legal/column/inshokuten-eigyo-kyoka-hokenjo-setsubi-kijun-shokuhin-eisei",
    "/legal/column/npo-hojin-setsuritsu-ninsho-nagare-shokatsucho",
    "/legal/nagare",
    "/legal/ryokin",
    "/legal/services"
  ],
  "legal:souzoku-kyoninka-shokei-gyoshu-betsu-kahi-hikaku": [
    "/about/uramatsu",
    "/legal/column/kensetsugyo-kyoka-yoken-keikan-sengi-zaisan",
    "/legal/column/souzoku-fuzoku-eigyo-kyoka-shoukei-minashi-todokede",
    "/legal/column/souzoku-jigyo-shokei-kyoninka-shoukei-saishutoku",
    "/legal/nagare",
    "/legal/ryokin",
    "/legal/services",
    "/souzoku"
  ],
  "realestate:shokuhin-seizogyo-central-kitchen-bukken-youto-haisui-tokutei-shisetsu": [
    "/about/uramatsu",
    "/column/delivery-senmon-ghost-kitchen-bukken-youto-haisui-grease",
    "/column/inshokuten-skeleton-bukken-haiki-grease",
    "/column/kitchen-car-shikomi-basho-bukken-eigyo-kyoka-youken",
    "/office",
    "/toushi"
  ],
  "realestate:souzoku-nochi-nouyouchi-kuiki-noshin-jogai-tenyo-baikyaku": [
    "/about/uramatsu",
    "/column/einou-taiyoko-nochi-ichiji-tenyo-bukken",
    "/column/souzoku-nochi-baikyaku-kashidashi-nagare",
    "/column/souzoku-seisan-ryokuchi-baikyaku-nagare",
    "/souzoku"
  ],
  "legal:eisei-kensajo-rinsho-kensa-touroku-kozo-setsubi-kijun": [
    "/about/uramatsu",
    "/legal/column/iyakuhin-tenpo-hanbaigyo-drugstore-kozo-setsubi-touroku-hanbaisha",
    "/legal/column/kodo-kanri-iryokiki-hanbai-kashidashi-kyoka-tenpo-kanrisha",
    "/legal/column/shinryojo-kaisetsu-todokede-iryoho-8jo",
    "/legal/nagare",
    "/legal/ryokin",
    "/legal/services"
  ],
  "legal:kikyuji-yuigon-shibo-kikyusha-minpo-976jo-kakunin": [
    "/about/uramatsu",
    "/legal/column/jihitsu-kosei-yuigon",
    "/legal/column/kosei-shosho-yuigon-koshonin-shonin-hiyo",
    "/legal/column/yuigon-tekkai-teishoku-fukusu-yuigon-yuretsu",
    "/legal/nagare",
    "/legal/ryokin",
    "/legal/services",
    "/legal/services/inheritance"
  ],
  "realestate:souzoku-minpaku-jutaku-shukuhaku-todokede-shokei-haigyo-baikyaku": [
    "/about/uramatsu",
    "/column/hikyojusha-chuka-owner-minpaku-jutaku-shukuhaku-kanri-itaku",
    "/legal/column/minpaku-jutaku-shukuhaku-todokede-yoken",
    "/column/souzoku-akiya-3000man-roujin-home-nyusho-kyojuyoken",
    "/legal/column/souzoku-touki-nagare",
    "/column/tokku-minpaku-bukken-youken-nintei",
    "/souzoku",
    "/toushi"
  ],
  "realestate:tokutei-yukyo-inshokuten-club-bukken-youto-hozen-taisho": [
    "/about/uramatsu",
    "/legal/column/tokutei-yukyo-inshokuten-eigyo-kyoka-youken",
    "/office",
    "/toushi"
  ],
  "legal:kashikin-gyo-touroku-yoken-shunin-junshisan": [
    "/about/uramatsu",
    "/legal/column/denki-koji-gyo-touroku-eigyosho-shunin",
    "/legal/column/kensetsugyo-kyoka-yoken-keikan-sengi-zaisan",
    "/legal/nagare",
    "/legal/ryokin",
    "/legal/services"
  ],
  "legal:souzoku-fuzaisha-zaisan-kanrinin-shisso-senkoku-erabikata": [
    "/about/uramatsu",
    "/legal/column/souzoku-nin-fuzai-seisannin-tokubetsu-enko",
    "/legal/column/souzoku-ninchisho-yukuefumei-miseinen",
    "/legal/column/souzoku-touki-nagare",
    "/legal/nagare",
    "/legal/ryokin",
    "/legal/services/inheritance",
    "/souzoku"
  ]
};

export function isHeldManuscriptRoute(business: "legal" | "realestate", slug: string, locale: string, href: string): boolean {
  if (!["en", "zh-tw", "zh"].includes(locale)) return false;
  const prefix = `/${locale}`;
  if (!href.startsWith(`${prefix}/`)) return false;
  return ROUTES[`${business}:${slug}`]?.includes(href.slice(prefix.length)) ?? false;
}
