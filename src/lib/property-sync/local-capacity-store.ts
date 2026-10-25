import "server-only";
import { appendCapacityRequest, createCapacityJournal, verifyCapacityJournal } from "./capacity-reservations";
import { createPrivateJournalStore } from "./private-journal-store";

const store = createPrivateJournalStore({ create: createCapacityJournal, verify: verifyCapacityJournal, append: appendCapacityRequest,
  errors: { invalidGenesis: "INVALID_CAPACITY_GENESIS", invalidFile: "CAPACITY_FILE_INVALID", capacity: "CAPACITY_STORE_LIMIT" } });

export const createCapacityFile = store.create;
export const readCapacityFile = store.read;
export const applyCapacityRequestFile = store.apply;
