import express from "express";

const PORT = process.env.PORT || 8002;

const app = express();

app.get("/", (req, res) => {
  res.json({ service: "task" });
});

app.listen(PORT, () => {
  console.log(`task service is listening on port: ${PORT}`);
});
