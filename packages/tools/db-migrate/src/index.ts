import pg from "pg";
import fs from "fs";
import * as sqlTemplateStrings from "sql-template-strings";

const SQL = sqlTemplateStrings.SQL;

const { Client } = pg;

type Migration = {
  id: string;
  created: Date;
  modified: Date;
  version: number;
  filename: string;
};

type File = {
  version: number;
  filename: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getMigrationsInOrder(fromVersion?: number): File[] {
  console.log(`Retrieving migration files since version ${fromVersion}`);

  const files = fs.readdirSync("migrations").map((file) => ({
    version: parseInt(file.split("_")[0] || "-1"),
    filename: file,
  }));

  let sortedFiles = files.sort((a, b) => a.version - b.version);

  if (fromVersion) {
    sortedFiles = sortedFiles.filter((file) => file.version > fromVersion);
  }

  if (sortedFiles.length === 0) {
    console.log("No new migrations found");
    return sortedFiles;
  }

  console.log("New migrations found");
  sortedFiles.forEach((file) => console.log(file.filename));
  return sortedFiles;
}

async function initDB() {
  console.log("Connecting to database...");

  const db = new Client();
  await db.connect();

  console.log("Connected.");

  return db;
}

async function initMigrationsTable(db: pg.Client) {
  console.log("Initializing migrations table...");

  const createSchemaQuery = SQL`CREATE SCHEMA IF NOT EXISTS migration AUTHORIZATION postgres`;
  await db.query(createSchemaQuery);

  const createTableQuery = SQL`
    CREATE TABLE IF NOT EXISTS migration.migration
    (
      id uuid NOT NULL DEFAULT gen_random_uuid(),
      created timestamp with time zone default current_timestamp,
      modified timestamp with time zone default current_timestamp,
      version numeric(10, 0) NOT NULL,
      filename character varying(255) NOT NULL
    )
  `;
  await db.query(createTableQuery);

  console.log("Initialized.");
}

async function runMigration(db: pg.Client, file: File) {
  console.log(`Running migration ${file.filename}...`);

  await db.query("BEGIN");

  const sqlFile = fs.readFileSync(`migrations/${file.filename}`, "utf8");
  await db.query(sqlFile);
  await addMigrationToDB(db, file);

  await db.query("COMMIT");
}

async function addMigrationToDB(db: pg.Client, file: File) {
  const query = SQL`
    INSERT INTO migration.migration (
      version,
      filename
    )
    VALUES (
      ${file.version},
      ${file.filename}
    )
  `;

  await db.query(query);
}

async function getLatestVersion(db: pg.Client) {
  console.log("Retrieving latest version...");
  const query = SQL`SELECT version FROM migration.migration ORDER BY version DESC LIMIT 1`;
  const result = await db.query<Migration>(query);

  if (result.rows.length > 0) {
    const version = result.rows[0]?.version;
    console.log(`Latest version is ${version}`);
    return version;
  }
  console.log("No version found");
}

console.log("Running migrations...");

try {
  const db = await initDB();
  await initMigrationsTable(db);
  const latestVersion = await getLatestVersion(db);
  const files = getMigrationsInOrder(latestVersion);
  for (const file of files) {
    await runMigration(db, file);
  }
  await sleep(2 * 1000); // Debug purposes
  console.log("Disconnecting from db...");
  await db.end();
  console.log("Disconnected");
  console.log("Migrations complete");
  process.exit(0);
} catch (error) {
  console.log("Something went wrong");
  console.error(error);
  process.exit(1);
}
