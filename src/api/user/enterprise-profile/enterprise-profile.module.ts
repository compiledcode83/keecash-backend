import { Module } from '@nestjs/common';
import { EnterpriseProfileRepository } from './enterprise-profile.repository';
import { EnterpriseProfileService } from './enterprise-profile.service';

@Module({
  providers: [EnterpriseProfileService, EnterpriseProfileRepository],
  exports: [EnterpriseProfileService],
})
export class EnterpriseProfileModule {}
