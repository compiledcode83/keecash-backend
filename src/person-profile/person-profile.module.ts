import { Module } from '@nestjs/common';
import { PersonProfileRepository } from './person-profile.repository';
import { PersonProfileService } from './person-profile.service';

@Module({
  providers: [PersonProfileService, PersonProfileRepository],
  exports: [PersonProfileService],
})
export class PersonProfileModule {}
