import fs from "fs";
import path from "path";
import express from "express";
import session from "express-session";
import pgConnect from "connect-pg-simple";
import { db, errorMiddleware } from "@taskify/backend-common";
import { router } from "./routes";
import { authMiddleware } from "./auth-middleware";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

const PgSession = pgConnect(session);

const app = express();

// Needed since this service is running behind Nginx proxy.
app.set("trust proxy", 1);
app.use(express.json());

const secret = fs.readFileSync(
  path.join(__dirname, "../keys/", "internal-RS256.key"),
  "utf8"
);

app.use(
  session({
    secret,
    name: "session",
    store: new PgSession({
      pool: db.pool,
      tableName: "session",
      schemaName: "account",
    }),
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 60 * 1000,
      domain: ".taskify.io",
    },
  })
);

app.use(authMiddleware);

app.use(router);

app.use(errorMiddleware);

export default app;
