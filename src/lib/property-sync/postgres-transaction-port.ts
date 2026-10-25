import { RolledBackTransaction, type SqlPort, type SqlTransaction } from "./db-media-store";

/** An exclusive connected client; close must end the physical connection, never return it to a pool. */
export interface PostgresTransactionClient extends SqlTransaction { close(): Promise<void> }

/**
 * Unwired driver boundary. The caller supplies a new exclusive connection per transaction.
 * No package import, URL, environment lookup, connection retry or production wiring here.
 */
export function createPostgresTransactionPort(connect: () => Promise<PostgresTransactionClient>): SqlPort {
  return {
    async transaction<T>(run: (tx: SqlTransaction) => Promise<T>): Promise<T> {
      let client: PostgresTransactionClient | undefined;
      let outcome: { status: "committed"; value: T } | { status: "rolled_back" | "unknown" } = { status: "unknown" };
      try {
        client = await connect();
        await client.query("BEGIN", []);
        let callback: { ok: true; value: T } | { ok: false };
        try {
          // Keep lifecycle methods away from the callback; all SQL uses this same lease.
          callback = { ok: true, value: await run({ query: (sql, parameters) => client!.query(sql, parameters) }) };
        } catch { callback = { ok: false }; }
        if (callback.ok) {
          // COMMIT exceptions never enter the callback's rollback path.
          await client.query("COMMIT", []);
          outcome = { status: "committed", value: callback.value };
        } else {
          await client.query("ROLLBACK", []);
          outcome = { status: "rolled_back" };
        }
      } catch { outcome = { status: "unknown" }; }
      if (client) {
        try { await client.close(); }
        catch { outcome = { status: "unknown" }; }
      }
      if (outcome.status === "committed") return outcome.value;
      if (outcome.status === "rolled_back") throw new RolledBackTransaction();
      // Driver errors may contain connection details or SQL parameters.
      throw new Error("POSTGRES_TRANSACTION_OUTCOME_UNKNOWN");
    },
  };
}
