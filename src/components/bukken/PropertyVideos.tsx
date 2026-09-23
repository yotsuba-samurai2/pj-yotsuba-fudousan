import type { LangCode } from "@/config/languages";
import { propertyVideos } from "@/lib/property-videos";

const headings = { ja: "動画", en: "Videos", "zh-tw": "影片", zh: "视频" };

export function PropertyVideos({ description, locale }: { description: string; locale: LangCode }) {
  const videos = propertyVideos(description);
  if (!videos.length) return null;
  return (
    <section className="mt-8" aria-label={headings[locale]}>
      {videos.map((video) => (
        <div key={video.id} className="mt-6">
          <h2 className="font-serif text-xl font-semibold text-ink">{video.title}</h2>
          <iframe
            className="mt-3 aspect-video w-full rounded-xl border-0"
            src={`https://www.youtube-nocookie.com/embed/${video.id}`}
            title={video.title}
            loading="lazy"
            allow="encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      ))}
    </section>
  );
}
