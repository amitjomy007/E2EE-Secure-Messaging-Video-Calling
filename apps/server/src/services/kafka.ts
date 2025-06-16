// import { Kafka } from "kafkajs";

// const kafka = new Kafka({
//     brokers: [],
// });
//let producer = null;
//     }
// export async function createProducer() {
//     if (producer) return producer;
//     const producer = kafka.producer();
//     await producer.connect();
//
//     return producer;
// }

// export default kafka;

const { Kafka } = require('@confluentinc/kafka-javascript').KafkaJS;
import {  Producer } from '@confluentinc/kafka-javascript';
// import { PrismaClient } from '@prisma/client';
import prismaClient from "./prisma";

//claude interface
interface KafkaMessage {
  key?: Buffer | string | null;
  value?: Buffer | string | null;
  timestamp?: string;
  size?: number;
  attributes?: number;
  offset?: string;
}

interface EachMessagePayload {
  topic: string;
  partition: number;
  message: KafkaMessage;
  pause: (topicPartitions?: Array<{ topic: string; partitions?: number[] }>) => Promise<void>;
}




const createProducer = async () => {
  
  const _producer = new Kafka().producer({
    "bootstrap.servers": process.env.KAFKA_BOOTSTRAP_SERVERS,
    "security.protocol": process.env.KAFKA_SECURITY_PROTOCOL,
    "sasl.mechanisms": process.env.KAFKA_SASL_MECHANISMS,
    "sasl.username": process.env.KAFKA_SASL_USERNAME,
    "sasl.password": process.env.KAFKA_SASL_PASSWORD,
  });
  await _producer.connect();
  let producer = _producer;
  return producer;
}

//https://confluent.cloud/environments/env-257mm2/clusters/lkc-qv895d/overview
//topic can be created/found in above url
export async function produceMessage(
  message: string,
  topic: string = "topic_0"
) {
  let producer = await createProducer();
    if (!producer) {
    throw new Error("Kafka producer not initialized");
  }
  await producer.send({
    topic,
    messages: [{ key: `message-${Date.now}`, value: message }],
  });
  console.log(`Message sent to topic ${topic}: ${message}`);
  return true;
}

export async function startMessageConsumer() {
  const consumer = new Kafka().consumer({
    "bootstrap.servers": process.env.KAFKA_BOOTSTRAP_SERVERS,
    "group.id": process.env.KAFKA_GROUP_ID, 
    "security.protocol": process.env.KAFKA_SECURITY_PROTOCOL,
    "sasl.mechanisms": process.env.KAFKA_SASL_MECHANISMS,
    "sasl.username": process.env.KAFKA_SASL_USERNAME,
    "sasl.password": process.env.KAFKA_SASL_PASSWORD,
  });
  await consumer.connect();
  // await consumer.subscribe({ topic: "topic_0",  fromBeginning: true });
    await consumer.subscribe({ topic: "topic_0" });
  console.log("Kafka consumer started and subscribed to topic_0");
  await consumer.run({ 
    autocommit: true,
    eachMessage: async ({ message, pause }: EachMessagePayload) => {
      console.log(`new message received`);
      if(!message.value) {
        return
      }
      try{
        await prismaClient.message.create({
          data: {
            text: message.value?.toString(),
          },
        });
        console.log("Message saved to database successfully");
      }catch(err){
        console.error("Error saving message to database:", err);
        console.log("Pausing consumer for a while");
        await pause([{ topic: "topic_0" }]);
        setTimeout(() =>{
          console.log("Resuming consumer after a minute of pause");
          consumer.resume([{ topic: "topic_0" }]);
        }, 5 * 1000); // Pause for 1 minute // 5 seconds for testing
      }
      
    }
  });
}
