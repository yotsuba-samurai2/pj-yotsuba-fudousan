"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Grid3X3 } from "lucide-react";
import { groupBusinesses, getBusinessByPath } from "@/config/group";
import { useTranslation } from "@/hooks/useTranslation";

export function GroupSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const currentBiz = getBusinessByPath(pathname);
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-dim hover:text-text"
        aria-label={t("common.navigation.showGroupBusinesses")}
      >
        <Grid3X3 size={16} />
      </button>

      <div
        className={`absolute left-0 top-full mt-2 w-72 overflow-hidden rounded-xl border border-border bg-surface shadow-xl transition-all duration-200 ${
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <div className="border-b border-border px-4 py-3">
          <p className="text-[10px] font-medium tracking-wider text-text-muted">
            {t("brand.groupNameEn")}
          </p>
          <p className="text-sm font-bold">{t("brand.groupName")}</p>
        </div>

        <div className="py-1">
          {groupBusinesses.map((biz) => {
            const isCurrent = biz.key === currentBiz.key;

            return (
              <Link
                key={biz.key}
                href={biz.href}
                onClick={() => setIsOpen(false)}
              >
                <div
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                    isCurrent ? "bg-primary/5" : "hover:bg-surface-dim"
                  }`}
                >
                  <Image
                    src={biz.logo.square}
                    alt={t(`${biz.key}.name`)}
                    width={44}
                    height={44}
                    className="h-11 w-11 shrink-0 object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{t(`${biz.key}.name`)}</p>
                    <p className="text-[11px] text-text-muted">
                      {t(`${biz.key}.description`)}
                    </p>
                  </div>
                  {isCurrent && (
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-medium text-primary">
                      {t("common.current")}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
