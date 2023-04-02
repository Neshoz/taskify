import express from "express";
import {
  ApiRequest,
  authMiddleware,
  errorMiddleware,
} from "@taskify/backend-common";

const PORT = process.env.PORT || 8002;

const app = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(authMiddleware);

app.get("/", (req: ApiRequest, res) => {
  res.json({ service: "collection", user: req.userId });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`collection service is listening on port: ${PORT}`);
});
