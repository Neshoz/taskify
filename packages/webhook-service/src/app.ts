import { authMiddleware, errorMiddleware } from "@taskify/backend-common";
import express from "express";

const app = express();

app.set("trust proxy", 1);
app.use(express.json());
app.use(authMiddleware);

export default app;
