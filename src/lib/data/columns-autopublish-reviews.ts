import type { ColumnQualityReview } from "@/lib/columns-autopublish-quality";

/**
 * Content-bound publication reviews from the independent Daily review stage.
 * Drafting/fix stages cannot approve their own work. Concrete legal decisions or
 * unresolved important sources still need qualified review.
 * General permission to automate publication is not approval of unverified articles.
 * No review is pre-approved by this implementation; unknown future articles stay held.
 */
export const COLUMNS_AUTOPUBLISH_REVIEWS: readonly ColumnQualityReview[] = [];
