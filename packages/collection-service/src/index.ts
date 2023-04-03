import app from "./app";

const PORT = process.env.PORT || 8002;

app.listen(PORT, () => {
  console.log(`collection service is listening on port: ${PORT}`);
});
