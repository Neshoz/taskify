import express from "express";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const PORT = process.env.PORT || 8001;

const pool = new Pool();

pool.connect();

pool.on("connect", () => console.log("connected to database"));
pool.on("error", (error) => console.log("error", error));

const app = express();

app.get("/", (req, res) => {
  res.json({ service: "account" });
});

app.listen(PORT, () => {
  console.log(`account service is listening on port: ${PORT}`);
});
