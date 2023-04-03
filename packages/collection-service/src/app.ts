import { authMiddleware, errorMiddleware } from "@taskify/backend-common";
import express from "express";
import router from "./routes";

const app = express();

app.set("trust proxy", 1);
app.use(express.json());
app.use(authMiddleware);

app.use(router);

app.use(errorMiddleware);

export default app;
