import { SystemEventType } from "@taskify/shared-service-types";
import amqplib, { Channel, Connection, ConsumeMessage } from "amqplib";

export class RabbitMQClient {
  constructor() {}

  public async topic(topic: SystemEventType): Promise<Topic> {
    try {
      const connection = await this.connect();
      const channel = await connection.createChannel();

      process.once("SIGINT", async () => {
        await channel.close();
        await connection.close();
      });

      return new Topic(channel, topic);
    } catch (error) {
      throw error;
    }
  }

  public async subscription(topic: SystemEventType) {
    try {
      const connection = await this.connect();
      const channel = await connection.createChannel();

      process.once("SIGINT", async () => {
        await channel.close();
        await connection.close();
      });

      return new Subscription(channel, topic);
    } catch (error) {
      throw error;
    }
  }

  private connect(): Promise<Connection> {
    if (!process.env.RABBIT_MQ_URL) {
      throw new Error("Missing env variable: RABBIT_MQ_URL");
    }
    return amqplib.connect(process.env.RABBIT_MQ_URL ?? "");
  }
}

class Topic {
  private channel: Channel;
  private topic: SystemEventType;

  constructor(channel: Channel, topic: SystemEventType) {
    this.channel = channel;
    this.topic = topic;
  }

  public async publishMessage<T>(payload: T) {
    try {
      await this.channel.assertQueue(this.topic, { durable: true });
      this.channel.sendToQueue(
        this.topic,
        Buffer.from(JSON.stringify(payload)),
        { contentType: "application/json" }
      );
    } catch (error) {
      throw error;
    }
  }
}

type MessageData<T> = {
  topic: SystemEventType;
  data: T;
};

class Subscription {
  public channel: Channel;
  private topic: SystemEventType;

  constructor(channel: Channel, topic: SystemEventType) {
    this.channel = channel;
    this.topic = topic;
  }

  public onMessage<T>(callback: (message: MessageData<T>) => void) {
    this.channel.assertQueue(this.topic).then(() => {
      this.channel.consume(this.topic, (msg) => {
        if (msg?.content) {
          const messageData: MessageData<T> = {
            topic: this.topic,
            data: JSON.parse(msg.content.toString()),
          };
          this.channel.ack(msg);
          this.channel.emit("message", messageData);
          callback(messageData);
        }
      });
    });
  }
}
