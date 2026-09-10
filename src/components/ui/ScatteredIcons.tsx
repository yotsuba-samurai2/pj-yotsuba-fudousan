"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { usePathname } from "next/navigation";

/**
 * 背景にアイコンを散りばめる装飾コンポーネント
 *
 * 使い方: 親要素に `relative` を設定し、その直下に配置する
 * - absolute + inset-0 で親の全高に渡って配置
 * - z-0 でコンテンツの後ろに表示
 * - pointer-events-none でクリック透過
 */

type IconPlacement = {
  top: string;
  left: string;
  size: number;
  rotate: number;
};

const placements: IconPlacement[] = [
  // 左上
  { top: "3%", left: "-3%", size: 800, rotate: 15 },
  // 右上
  { top: "10%", left: "82%", size: 500, rotate: -25 },
  // 左中上
  { top: "28%", left: "5%", size: 600, rotate: 40 },
  // 右中
  { top: "42%", left: "78%", size: 700, rotate: -12 },
  // 左中下
  { top: "58%", left: "-5%", size: 550, rotate: -35 },
  // 右下
  { top: "75%", left: "72%", size: 500, rotate: 45 },
  // 左下
  { top: "88%", left: "8%", size: 650, rotate: -18 },
];

export default function ScatteredIcons() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* SPは3点・幅44vw。装飾の取得で主要な内容を待たせない。 */}
      {placements.map((p, i) => (
        <Image
          key={i}
          src="/icon-512.png"
          alt=""
          width={512}
          height={512}
          sizes={`(min-width: 640px) ${p.size}px, 44vw`}
          loading="lazy"
          fetchPriority="low"
          className={`absolute h-auto max-w-none w-[min(var(--decoration-size),44vw)] sm:w-[var(--decoration-size)] ${i % 3 === 0 ? "" : "hidden sm:block"}`}
          style={
            {
              top: p.top,
              left: p.left,
              "--decoration-size": `${p.size}px`,
              opacity: 0.025,
              transform: `rotate(${p.rotate}deg)`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
