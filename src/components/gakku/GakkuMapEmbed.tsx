"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 文京区20校の学区参考図（/public/gakku/3s1k-map.html）を埋め込む。
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
      setHeight(Math.ceil(doc.body.scrollHeight));
    });
    observer.observe(doc.body);
    disconnectRef.current = () => observer.disconnect();
  }, []);

  useEffect(() => {
    // hydration より前に読み込みが終わっていた場合はここで購読する（onLoad は発火済み）
    if (ref.current?.contentDocument?.readyState === "complete") observe();
    return () => disconnectRef.current?.();
  }, [observe]);

  useEffect(() => {
    const focusMap = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== ref.current?.contentWindow) return;
      if (event.data?.type !== "gakku-map-focus") return;
      const frame = ref.current;
      if (!frame) return;
      // Wait for the opened detail/iframe height to settle before positioning.
      // An instant parent scroll avoids racing the iframe's focus and map animation.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (!frame.isConnected) return;
        window.scrollTo({ top: window.scrollY + frame.getBoundingClientRect().top - 96, behavior: "instant" });
      }));
    };
    window.addEventListener("message", focusMap);
    return () => window.removeEventListener("message", focusMap);
  }, []);

  return (
    <iframe
      ref={ref}
      src="/gakku/3s1k-map.html"
      title="文京区20小学校の学区マップ（学校一覧から拡大）"
      loading="eager"
      onLoad={observe}
      style={{ width: "100%", height, border: 0, display: "block", scrollMarginTop: 96 }}
    />
  );
}
