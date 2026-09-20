import { prisma } from "@/lib/prisma";
import type { PropertyPublicationEvent as Row } from "@prisma/client";
import type {
  NotifyStatus,
  PublicationEvent,
  PublicationEventKind,
  PublicationEventStore,
} from "@/lib/property-publication";

/**
 * PropertyPublicationEvent の Prisma 実装（db/properties.ts と同型）。
 * 呼び出し元は必ず property-publication-notify.ts 経由（route から直接importしない）。
 */

function toEvent(row: Row): PublicationEvent {
  return {
    id: row.id,
    slug: row.slug,
    kind: row.kind as PublicationEventKind,
    urls: row.urls,
    notifyStatus: row.notifyStatus as NotifyStatus,
    attempts: row.attempts,
    nextAttemptAt: row.nextAttemptAt,
    createdAt: row.createdAt,
  };
}

export const publicationEventStore: PublicationEventStore = {
  async insert(e) {
    await prisma.propertyPublicationEvent.create({
      data: {
        slug: e.slug,
        kind: e.kind,
        urls: e.urls,
        contentHash: e.contentHash,
        nextAttemptAt: e.nextAttemptAt,
      },
    });
  },

  async due(now, limit) {
    const rows = await prisma.propertyPublicationEvent.findMany({
      where: { notifyStatus: "pending", nextAttemptAt: { lte: now } },
      orderBy: { createdAt: "asc" },
      take: limit,
    });
    return rows.map(toEvent);
  },

  async mark(id, patch) {
    await prisma.propertyPublicationEvent.update({
      where: { id },
      data: {
        notifyStatus: patch.notifyStatus,
        attempts: patch.attempts,
        nextAttemptAt: patch.nextAttemptAt,
        lastStatus: patch.lastStatus,
      },
    });
  },

  async latestKind(slug) {
    const row = await prisma.propertyPublicationEvent.findFirst({
      where: { slug },
      orderBy: { createdAt: "desc" },
      select: { kind: true },
    });
    return (row?.kind as PublicationEventKind) ?? null;
  },
};
