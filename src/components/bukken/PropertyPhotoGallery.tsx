"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { LangCode } from "@/config/languages";

const labels = {
  ja: { open: "写真を拡大", close: "閉じる", previous: "前の写真", next: "次の写真", more: "写真をもっと見る", hint: "写真をクリックすると拡大します" },
  en: { open: "Enlarge photo", close: "Close", previous: "Previous photo", next: "Next photo", more: "View all photos", hint: "Select a photo to enlarge it" },
  "zh-tw": { open: "放大照片", close: "關閉", previous: "上一張", next: "下一張", more: "查看更多照片", hint: "點擊照片即可放大" },
  zh: { open: "放大照片", close: "关闭", previous: "上一张", next: "下一张", more: "查看更多照片", hint: "点击照片即可放大" },
} satisfies Record<LangCode, Record<string, string>>;

type Props = {
  images: { url: string; alt: string }[];
  locale: LangCode;
  previewLimit?: number;
  allPhotosHref?: string;
  photoNotes?: string;
};

export function PropertyPhotoGallery({ images, locale, previewLimit, allPhotosHref, photoNotes }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState(0);
  const text = labels[locale];
  const photo = images[selected];
  if (!images.length) return null;
  const visible = previewLimit ? images.slice(0, previewLimit) : images;
  const move = (step: number) => setSelected((index) => (index + step + images.length) % images.length);

  return (
    <div>
      {photoNotes && <p className="mb-4 whitespace-pre-line rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed">{photoNotes}</p>}
      <p className="mb-3 text-sm text-text-muted">{text.hint}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
        {visible.map((image, index) => (
          <button
            key={`${image.url}-${index}`}
            type="button"
            aria-label={`${text.open}: ${image.alt}`}
            onClick={() => { setSelected(index); dialog.current?.showModal(); }}
            className="group min-w-0 cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.url} alt={image.alt} width={640} height={480} loading="lazy" className="aspect-[4/3] w-full rounded-lg bg-surface-dim object-contain" />
            <span className="mt-2 block text-xs leading-relaxed text-text-muted group-hover:text-primary">{image.alt}</span>
          </button>
        ))}
      </div>
      {allPhotosHref && images.length > visible.length && (
        <Link href={allPhotosHref} className="mt-6 inline-flex min-h-11 items-center rounded-lg border border-primary px-5 py-2 text-sm font-medium text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
          {text.more} ({images.length})
        </Link>
      )}
      <dialog
        ref={dialog}
        aria-label={text.open}
        onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
          if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
        }}
        className="fixed inset-0 m-auto max-h-[95dvh] w-[min(96vw,1200px)] max-w-none overflow-auto rounded-xl bg-white p-3 text-text shadow-xl backdrop:bg-black/80 sm:p-5"
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <span className="text-sm tabular-nums" aria-live="polite">{selected + 1} / {images.length}</span>
          <button type="button" autoFocus onClick={() => dialog.current?.close()} className="min-h-11 rounded-lg border border-border px-4 text-sm focus-visible:outline-2 focus-visible:outline-primary">{text.close}</button>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.url} alt={photo.alt} width={1600} height={1200} className="max-h-[68dvh] w-full object-contain" />
        <p className="mt-3 text-center text-sm leading-relaxed" aria-live="polite">{photo.alt}</p>
        {photoNotes && <p className="mt-3 whitespace-pre-line rounded-lg border border-border bg-surface p-3 text-sm leading-relaxed">{photoNotes}</p>}
        {images.length > 1 && (
          <div className="mt-3 flex justify-between gap-4">
            <button type="button" onClick={() => move(-1)} className="min-h-11 rounded-lg border border-border px-4 text-sm focus-visible:outline-2 focus-visible:outline-primary">{text.previous}</button>
            <button type="button" onClick={() => move(1)} className="min-h-11 rounded-lg border border-border px-4 text-sm focus-visible:outline-2 focus-visible:outline-primary">{text.next}</button>
          </div>
        )}
      </dialog>
    </div>
  );
}
