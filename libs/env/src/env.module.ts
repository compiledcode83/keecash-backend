import { Module } from '@nestjs/common';
import { EnvHelper } from './env.helper';
import { EnvService } from './env.service';

@Module({
  providers: [EnvService],
  exports: [EnvService, EnvHelper],
})
export class EnvModule {}
