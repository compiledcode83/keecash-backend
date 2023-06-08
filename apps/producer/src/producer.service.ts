import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Producer, RecordMetadata, TopicMessages } from 'kafkajs';
import { OutboxService } from '@app/outbox';
import { KAFKA_PRODUCER_TOKEN } from './producer.types';

@Injectable()
export class ProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ProducerService.name);

  constructor(
    @Inject(KAFKA_PRODUCER_TOKEN) private kafka: Producer,
    private readonly outboxService: OutboxService,
  ) {}

  async produceMessages(): Promise<TopicMessages[]> {
    try {
      const startTime = performance.now();
      const messages = await this.outboxService.findAll();
      let batch: TopicMessages[] = [];

      if (messages.length > 0) {
        batch = messages.map((message) => ({
          topic: message.eventName,
          messages: [
            {
              value: message.payload,
            },
          ],
        }));

        await this.sendBatch(batch);
        await this.outboxService.setAsSent(messages.map((message) => message.id));

        this.logger.log(
          `Produced ${messages.length} messages in ${Math.floor(performance.now() - startTime)}ms`,
        );
      }

      return batch;
    } catch (err) {
      this.logger.error(`Error producing messages: ${err?.message}`);

      Sentry.captureException(err);

      process.exitCode = 1;
      process.exit(1);
    }
  }

  async send(pattern: any, data: any): Promise<RecordMetadata> {
    const [response] = await this.kafka.send({
      topic: pattern,
      messages: [
        {
          value: JSON.stringify(data),
        },
      ],
    });

    if (response.errorCode !== 0) {
      throw new Error();
    }

    return response;
  }

  async sendBatch(topicMessages: TopicMessages[]): Promise<RecordMetadata[]> {
    const responses = await this.kafka.sendBatch({
      topicMessages,
    });

    responses.forEach((response) => {
      if (response.errorCode !== 0) {
        throw new Error(
          `Kafka responded with an error code ${response.errorCode} for topic ${response.topicName}`,
        );
      }
    });

    return responses;
  }

  async healthCheck() {
    await this.kafka.send({
      topic: 'healthcheck',
      messages: [
        {
          value: JSON.stringify({ timestamp: new Date(), client: 'api-gateway' }),
        },
      ],
    });
  }

  async onModuleInit() {
    await this.kafka.connect();
    this.logger.log('Kafka producer connected successfully');
  }

  async onModuleDestroy() {
    await this.kafka.disconnect();
    this.logger.log('Kafka producer disconnected successfully');
  }

  get client(): Producer {
    return this.kafka;
  }
}
