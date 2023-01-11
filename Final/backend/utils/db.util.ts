import { QueryInterface, Sequelize } from "sequelize";
import { Umzug, SequelizeStorage, MigrationMeta, UmzugOptions } from "umzug";

export const sequelize: Sequelize = new Sequelize(
  "users",
  "postgres",
  "qwerty123",
  {
    host: "localhost",
    dialect: "postgres",
    logging: false,
  }
);

const migrationConf: UmzugOptions<QueryInterface> = {
  migrations: {
    glob: "migrations/*.ts",
  },
  storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async (): Promise<void> => {
  const migrator: Umzug<QueryInterface> = new Umzug(migrationConf);
  const migrations: MigrationMeta[] = await migrator.up();
  console.log("Migrations up to date", {
    files: migrations.map((mig: MigrationMeta) => mig.name),
  });
};

export const rollbackMigration = async (): Promise<void> => {
  await sequelize.authenticate();
  const migrator: Umzug<QueryInterface> = new Umzug(migrationConf);
  await migrator.down();
};

export const connectToDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log("database connected");
  } catch (err) {
    console.log("connecting database failed");
    console.error(err);
    return process.exit(1);
  }

  return null;
};
