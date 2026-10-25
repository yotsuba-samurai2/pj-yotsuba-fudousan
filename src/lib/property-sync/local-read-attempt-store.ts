import "server-only";
import { appendReadAttemptRequest, createReadAttemptRegistry, verifyReadAttemptRegistry } from "./read-attempt-registry";
import { createPrivateJournalStore } from "./private-journal-store";

const store = createPrivateJournalStore({ create: createReadAttemptRegistry, verify: verifyReadAttemptRegistry, append: appendReadAttemptRequest,
  errors: { invalidGenesis: "INVALID_READ_REGISTRY_GENESIS", invalidFile: "READ_REGISTRY_FILE_INVALID", capacity: "READ_REGISTRY_STORE_LIMIT" } });
export const createReadAttemptFile = store.create;
export const readAttemptFile = store.read;
export const applyReadAttemptFile = store.apply;
