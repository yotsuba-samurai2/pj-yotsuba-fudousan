"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 3S1K 通学区域マップ（/public/gakku/3s1k-map.html）を埋め込む。
 * iframe を中身の高さに合わせて伸縮させ、内部スクロールを出さない。
 *
 * 高さは同一オリジンの中身を ResizeObserver で直接見る。
 * 地図側は postMessage でも高さを通知するが、その初回は hydration より前に飛ぶことがあり、
 * 受信側が間に合わない（実測：iframeは640pxのまま・中身は992〜1122pxで内部スクロールが出た）。
 * ResizeObserver なら購読時点の高さと、以後の変化（学校一覧の開閉・画面幅の変化）を両方拾える。
 */
export default function GakkuMapEmbed() {
  const ref = useRef<HTMLIFrameElement>(null);
  const disconnectRef = useRef<(() => void) | null>(null);
  const [height, setHeight] = useState(640);

  const observe = useCallback(() => {
    const doc = ref.current?.contentDocument;
    if (!doc) return;
    disconnectRef.current?.();
    const observer = new ResizeObserver(() => {
      setHeight(Math.ceil(doc.documentElement.scrollHeight));
    });
    observer.observe(doc.documentElement);
    disconnectRef.current = () => observer.disconnect();
  }, []);

  useEffect(() => {
    // hydration より前に読み込みが終わっていた場合はここで購読する（onLoad は発火済み）
    if (ref.current?.contentDocument?.readyState === "complete") observe();
    return () => disconnectRef.current?.();
  }, [observe]);

  return (
    <iframe
      ref={ref}
      src="/gakku/3s1k-map.html"
      title="文京区 3S1K（誠之・千駄木・昭和・窪町）の通学区域マップ"
      loading="eager"
      onLoad={observe}
      style={{ width: "100%", height, border: 0, display: "block" }}
    />
  );
}
