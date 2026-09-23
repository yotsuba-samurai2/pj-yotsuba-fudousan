import { cache } from "react";
import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { getProperties } from "./db/properties";
import { registeredRentalIdentity } from "./registered-rental-identity";
import { compileRentalSummaries, feedSchema, type RentalFeed, type RentalSummary } from "./school-rental-feed";

export const readSchoolRentalFeeds = cache(async () => {
  try {
    const rows = await prisma.schoolRentalFeed.findMany();
    return rows.flatMap(row => {
      const parsed = feedSchema.safeParse(row.payload);
      if (!parsed.success || parsed.data.provider !== row.provider || Date.parse(parsed.data.checkedAt) !== row.checkedAt.getTime()) {
        console.error("Invalid school rental feed omitted", row.provider);
        return [];
      }
      return [{ ...row, feed: parsed.data }];
    });
  } catch (error) {
    // Match existing deployment order: code first, reviewed migration second.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") return [];
    throw error;
  }
});

export const registeredRentalIdentities = cache(async () => {
  const properties = await getProperties();
  return properties.flatMap(p => { const identity = registeredRentalIdentity(p); return identity ? [identity] : []; });
});

export const getSchoolRentalSummaries = cache(async () => {
  const [feeds, existing] = await Promise.all([readSchoolRentalFeeds(), registeredRentalIdentities()]);
  return compileRentalSummaries(feeds.map(f => f.feed), existing).summaries;
});

export async function saveSchoolRentalFeed(feed: RentalFeed, expectedUpdatedAt: string | null) {
  const payload = feed as unknown as Prisma.InputJsonValue;
  if (expectedUpdatedAt === null) {
    await prisma.schoolRentalFeed.create({ data: { provider: feed.provider, checkedAt: new Date(feed.checkedAt), payload } });
    return true;
  }
  const result = await prisma.schoolRentalFeed.updateMany({
    where: { provider: feed.provider, updatedAt: new Date(expectedUpdatedAt), checkedAt: { lte: new Date(feed.checkedAt) } },
    data: { checkedAt: new Date(feed.checkedAt), payload },
  });
  return result.count === 1;
}

export function previewFeedReplacement(feeds: RentalFeed[], next: RentalFeed, existing: Pick<RentalSummary, "building" | "unit" | "address">[]) {
  return compileRentalSummaries([...feeds.filter(f => f.provider !== next.provider), next], existing);
}
