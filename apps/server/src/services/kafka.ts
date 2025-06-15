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
