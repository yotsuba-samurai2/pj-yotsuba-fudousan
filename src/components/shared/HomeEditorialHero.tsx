import Image from "next/image";
import type { LangCode } from "@/config/languages";
import { HOME_ENTRIES, homeLineHref } from "@/lib/home-conversion";
import { HomeLineLink } from "./HomeLineLink";
import { HomeOffMarketNote } from "./HomeOffMarketNote";
import styles from "./HomeEditorial.module.css";

const copy = {
  ja: { place:"文京区小日向の地域密着店　｜　茗荷谷駅徒歩5分", title:["文京区の住まいを、","希望の学区から。"], example:"「窪町小の学区で、春までに引っ越したい」", lead:"そんな一言から、通学区域とご予算に合う住まいを一緒に探します。", secondary:"学区別の物件を見る", rail:["学区・新入学説明会","事業用の物件","相続した家"] },
  en: { place:"Your local agency in Kohinata, Bunkyo · 5 min from Myogadani Station", title:["A home in Bunkyo,","in your school district."], example:"“We want to move into the Kubomachi school district by spring.”", lead:"Start with a school, budget or move-in date. We check the district and find homes that fit your family.", secondary:"Explore school districts", rail:["Districts & entry briefings","Business property","Inherited homes"] },
  "zh-tw": { place:"深耕文京區小日向　｜　茗荷谷站步行5分鐘", title:["在文京區找家，","從理想學區開始。"], example:"「想在春天前搬到窪町小學學區。」", lead:"告訴我們希望就讀的學校或預算，我們會先確認通學區域，再陪您找適合全家的住處。", secondary:"查看學區物件", rail:["學區及新生入學說明會","營業用物件","繼承的房屋"] },
  zh: { place:"深耕文京区小日向　｜　茗荷谷站步行5分钟", title:["在文京区找家，","从理想学区开始。"], example:"「想在春天前搬到洼町小学学区。」", lead:"告诉我们希望就读的学校或预算，我们会先确认通学区域，再陪您找适合全家的住处。", secondary:"查看学区房源", rail:["学区与新生入学说明会","经营用房产","继承的房屋"] },
} satisfies Record<LangCode,{place:string;title:[string,string];example:string;lead:string;secondary:string;rail:[string,string,string]}>;
const targets=["#home-school","#home-business","#home-inheritance"] as const;
export function HomeEditorialHero({locale,heroAlt}:{locale:LangCode;heroAlt:string}){
 const c=copy[locale], home=HOME_ENTRIES[locale];
 return <><section className={styles.hero} aria-labelledby="realestate-home-title"><div className={styles.heroCopy}>
 <p className={styles.place}>{c.place}</p>
 <h1 className={styles.h1} id="realestate-home-title"><span className="sr-only">四葉不動産｜</span><span>{c.title[0]}</span><span>{c.title[1]}</span></h1>
 <p className={styles.lead}>{c.example}<br/>{c.lead}</p><div className={styles.offer}><HomeOffMarketNote locale={locale}/></div>
 <div className={styles.actions}><HomeLineLink href={homeLineHref("family",locale)} topic="family" placement="home_hero" locale={locale} className={styles.line}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.5 11.4a8.5 7.2 0 0 1-8.5 7.2H9l-4 2 .8-4.4a6.8 6.8 0 0 1-2.3-4.8 8.5 7.2 0 0 1 17 0Z"/></svg>{home.main}</HomeLineLink>
 <a className={styles.sub} href="#home-school">{c.secondary}<span aria-hidden="true">→</span></a></div><p className={styles.reply}>{home.reply}</p></div>
 <figure className={styles.image}><picture><source type="image/avif" srcSet={[420,750,828,1200,1600].map(w=>`/hero/bunkyo-sakura-${w}.avif ${w}w`).join(", ")} sizes="(min-width:781px) 46vw,100vw"/><Image src="/hero/bunkyo-sakura-16x9.webp" alt={heroAlt} width={1600} height={900} quality={60} sizes="(min-width:781px) 46vw,100vw" loading="eager" fetchPriority="high"/></picture><figcaption>{heroAlt}</figcaption></figure>
 </section><nav className={styles.rail} aria-label={home.directions}><div className={styles.railInner}>{targets.map((id,i)=><a key={id} href={id}><i aria-hidden="true">0{i+1}</i><span>{c.rail[i]}</span><b aria-hidden="true">↓</b></a>)}</div></nav></>;
}
