import "server-only";
import { appendPlanRegistry, createPlanRegistry, verifyPlanRegistry } from "./plan-registry";
import { createPrivateJournalStore } from "./private-journal-store";

const store = createPrivateJournalStore({ create: createPlanRegistry, verify: verifyPlanRegistry, append: appendPlanRegistry,
  errors: { invalidGenesis: "INVALID_REGISTRY_GENESIS", invalidFile: "REGISTRY_FILE_INVALID", capacity: "REGISTRY_CAPACITY_REACHED" } });

export const createPlanRegistryFile = store.create;
export const readPlanRegistryFile = store.read;
export const applyPlanRegistryFile = store.apply;
