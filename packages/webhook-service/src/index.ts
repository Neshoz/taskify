import { RabbitMQClient } from "@taskify/backend-common";
import app from "./app";
(async () => {
  const client = new RabbitMQClient();
  const subscription = await client.subscription("collection:created");
  const PORT = process.env.PORT || 8003;

  subscription.onMessage((message) => console.log(message));
  subscription.channel.on("message", (data) => console.log(data));

  app.listen(PORT, () => {
    console.log(`webhook service is listening on port: ${PORT}`);
  });
})();
