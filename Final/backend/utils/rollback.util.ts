import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });

process.on("uncaughtException", (err: Error) => {
  console.log("Uncaught Exception!  Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

import { rollbackMigration } from "./db.util";

// rollbackMigration();

(async (): Promise<void> => {
  await rollbackMigration();
})();

process.on("unhandledRejection", (err: Error) => {
  console.log("Unhandled Rejection! Shutting down...");
  console.error(err);
  process.exit(1);
});
