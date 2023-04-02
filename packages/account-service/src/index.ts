import app from "./app";

(() => {
  const port = process.env.PORT;

  app.listen(port, () => {
    console.log(`Account service is running on port: ${port}`);
  });
})();
