import Image from "next/image";
import type { ResolvedColumnIllustration } from "@/lib/column-illustrations";

type Props = {
  /** ローカライズ済みの表示用テキスト（画像の選択は ja 正本で済ませてから渡す） */
  date: string;
  category: string;
  title: string;
  illustration: ResolvedColumnIllustration;
};

/**
 * 3事業のコラム詳細に共通のヒーロー。
 *
 * 以前は3テンプレートが同一のJSXを各自持ち、日付・カテゴリ・H1だけを
 * 高さ40vhの無地の帯に置いていた（挿絵が1枚も無い状態の原因）。ここに集約する。
 *
 * 文字は画像に重ねない。挿絵は明度も構図もまちまちで、全点で十分なコントラストを
 * 保証できないため、文字と画像を上下に分ける。
 *
 * CLS対策として width/height を実寸で渡し、next/image に領域を先に確保させる。
 * quality は next.config.ts の qualities:[60,75] で許可された値のみ使える。
 */
export function ColumnArticleHero({ date, category, title, illustration }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-border pt-24 pb-10 sm:pt-32 sm:pb-12 md:pt-36 md:pb-16">
      <div
        className="pointer-events-none absolute inset-0 bg-green-gradient"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted">{date.replace(/-/g, ".")}</span>
          <span className="gradient-line rounded-full px-2.5 py-0.5 text-[10px] font-medium text-white">
            {category}
          </span>
        </div>
        <h1 className="article-headline mt-4 text-2xl font-bold leading-relaxed sm:text-3xl md:text-4xl">
          {title}
        </h1>
        <div className="mt-6 overflow-hidden rounded-2xl sm:mt-8">
          <Image
            src={illustration.src}
            alt={illustration.alt}
            width={1600}
            height={900}
            quality={60}
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className="h-auto w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
