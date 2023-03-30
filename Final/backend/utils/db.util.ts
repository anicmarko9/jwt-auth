import { QueryInterface, Sequelize } from "sequelize";
import { Umzug, SequelizeStorage, MigrationMeta, UmzugOptions } from "umzug";

export let sequelize: Sequelize;

if (process.env.NODE_ENV === "production") {
  // ElephantSQL -> DataBase on Cloud
  sequelize = new Sequelize(process.env.POSTGRES_URL, {
    username: process.env.POSTGRES_USERNAME,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    dialect: "postgres",
    logging: false,
  });
} else {
  // DataBase on postgresql:5432
  sequelize = new Sequelize(
    process.env.DATABASE_LOCAL,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
      host: process.env.PGHOST ? process.env.PGHOST : process.env.HOST,
      dialect: "postgres",
      logging: false,
    }
  );
}

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
};
