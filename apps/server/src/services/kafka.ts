import { RdKafka } from '@confluentinc/kafka-javascript';
import { PrismaClient } from '@prisma/client';

// Define interfaces for message types
interface KafkaMessage {
  key: string;
  value: string | null;
}

interface TopicMessage {
  topic: string;
  messages: KafkaMessage[];
}

const createProducer = async () => {
  const _producer = new RdKafka().producer({
    "bootstrap.servers": process.env.KAFKA_BOOTSTRAP_SERVERS,
    "security.protocol": process.env.KAFKA_SECURITY_PROTOCOL,
    "sasl.mechanisms": process.env.KAFKA_SASL_MECHANISMS,
    "sasl.username": process.env.KAFKA_SASL_USERNAME,
    "sasl.password": process.env.KAFKA_SASL_PASSWORD,
  });
  await _producer.connect();
  return _producer;
}

//https://confluent.cloud/environments/env-257mm2/clusters/lkc-qv895d/overview
//topic can be created/found in above url
export async function produceMessage(
  message: string,
  topic: string = "topic_0"
): Promise<boolean> {
  const producer = await createProducer();
  if (!producer) {
    throw new Error("Kafka producer not initialized");
  }
  
  await producer.produce({
    topic,
    message: {
      key: `message-${Date.now()}`,
      value: message
    }
  });
  
  console.log(`Message sent to topic ${topic}: ${message}`);
  return true;
}

export async function startMessageConsumer(): Promise<void> {
  const consumer = new RdKafka().consumer({
    "bootstrap.servers": process.env.KAFKA_BOOTSTRAP_SERVERS,
    "group.id": process.env.KAFKA_GROUP_ID,
    "security.protocol": process.env.KAFKA_SECURITY_PROTOCOL,
    "sasl.mechanisms": process.env.KAFKA_SASL_MECHANISMS,
    "sasl.username": process.env.KAFKA_SASL_USERNAME,
    "sasl.password": process.env.KAFKA_SASL_PASSWORD,
  });

  await consumer.connect();
  await consumer.subscribe({ topic: "topic_0" });
  console.log("Kafka consumer started and subscribed to topic_0");

  await consumer.run({ 
    autocommit: true,
    eachMessage: async ({ message, pause }) => {
      console.log(`new message received`);
      if(!message.value) return;

      try {
        await PrismaClient.message.create({
          data: {
            text: message.value.toString(),
          },
        });
      } catch(err) {
        console.error("Error saving message to database:", err);
        console.log("Pausing consumer for a while");
        await pause([{ topic: "topic_0" }]);
        setTimeout(() => {
          console.log("Resuming consumer after a minute of pause");
          consumer.resume([{ topic: "topic_0" }]);
        }, 60 * 1000);
      }
    }
  });
}
