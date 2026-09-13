import { LABOR_PRICING } from "./pricing";

/** Tax-inclusive model, not a minimum fee or a universal package. */
export const LABOR_ENGAGEMENT_ITEMS = [
  { key: "socialSetup", category: "insurance", standalone: 20900, advisory: 20900 },
  { key: "laborSetup", category: "insurance", standalone: 13750, advisory: 13750 },
  { key: "premiumDeclaration", category: "insurance", standalone: 11550, advisory: 11550 },
  { key: "socialEnrollment", category: "insurance", standalone: 2750 * 2, advisory: 0 },
  { key: "employmentEnrollment", category: "insurance", standalone: 2750, advisory: 0 },
  { key: "employmentTerms", category: "documents", standalone: 7700, advisory: 7700 },
  { key: "wageRules", category: "documents", standalone: 49800, advisory: 49800 },
  { key: "harassmentRules", category: "documents", standalone: 11000, advisory: 11000 },
  { key: "overtimeAgreement", category: "documents", standalone: 22000, advisory: 22000 },
] as const;

export type EngagementItemKey = (typeof LABOR_ENGAGEMENT_ITEMS)[number]["key"];
const sum = (column: "standalone" | "advisory") => LABOR_ENGAGEMENT_ITEMS.reduce((total, item) => total + item[column], 0);
const advisoryWork = sum("advisory");
const setup = LABOR_PRICING.initialSetupStandard;
const monthly = LABOR_PRICING.bands[0].monthly;

export const LABOR_ENGAGEMENT_EXAMPLE = {
  standalone: sum("standalone"),
  insuranceOnly: LABOR_ENGAGEMENT_ITEMS.filter(item => item.category === "insurance").reduce((total, item) => total + item.standalone, 0),
  documents: LABOR_ENGAGEMENT_ITEMS.filter(item => item.category === "documents").reduce((total, item) => total + item.standalone, 0),
  advisoryWork,
  setup,
  advisoryInitial: advisoryWork + setup,
  monthly,
  advisoryWithOneMonth: advisoryWork + setup + monthly,
  conditionalDiscount: setup,
  conditionalInitial: advisoryWork,
  conditionalWithOneMonth: advisoryWork + monthly,
} as const;
