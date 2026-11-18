import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { serializeAgentDiscoveryCard } from "../src/lib/agent-discovery-card";

const expected = serializeAgentDiscoveryCard();
const check = process.argv.includes("--check");
for (const name of ["agent-card.json", "agent.json"]) {
  const file = fileURLToPath(new URL(`../public/.well-known/${name}`, import.meta.url));
  if (check) {
    if (readFileSync(file, "utf8") !== expected) throw new Error(`${name} is stale; regenerate discovery cards.`);
  } else {
    writeFileSync(file, expected);
  }
}
console.log(check ? "Discovery cards are current." : "Both discovery cards regenerated.");
