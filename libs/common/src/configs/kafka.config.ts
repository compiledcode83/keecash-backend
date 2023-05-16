import { registerAs } from '@nestjs/config';

export default registerAs('kafkaConfig', () => ({
  brokerUrl: process.env.KAFKA_BROKER_URL,
  consumerGroup: process.env.KAFKA_CONSUMER_GROUP,
  ssl: process.env.KAFKA_SSL === 'true',
  username: process.env.KAFKA_USERNAME,
  password: process.env.KAFKA_PASSWORD,
}));
