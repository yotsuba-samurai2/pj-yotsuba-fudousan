import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "四葉パートナーズ",
    short_name: "四葉",
    description: "不動産・行政書士・社会保険労務士のワンストップグループ",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2d6a4f",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
