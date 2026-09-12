"use client";

// 既存import/APIを維持。共通レイアウトやDBを変えず、SP/PC両方の相談導線へ拡張。
import { StickyContactCta } from "@/components/shared/ContactCta";
import type { BusinessKey } from "@/lib/shared/office-public";

type Props = { businessKey: BusinessKey };

export function MobileStickyBar({ businessKey }: Props) {
  return <StickyContactCta businessKey={businessKey} />;
}
