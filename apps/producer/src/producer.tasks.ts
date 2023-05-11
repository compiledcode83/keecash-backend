import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProducerService } from './producer.service';

@Injectable()
export class ProducerTasks {
  constructor(private readonly producerService: ProducerService) {}

  @Cron(CronExpression.EVERY_SECOND)
  async produceMessages() {
    await this.producerService.produceMessages();
  }
}
