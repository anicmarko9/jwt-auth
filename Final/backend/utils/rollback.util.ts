import { rollbackMigration } from "./db.util";

// rollbackMigration();

(async (): Promise<void> => {
  await rollbackMigration();
})();
