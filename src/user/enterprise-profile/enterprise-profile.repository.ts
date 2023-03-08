import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EnterpriseProfile } from './enterprise-profile.entity';

@Injectable()
export class EnterpriseProfileRepository extends Repository<EnterpriseProfile> {
  constructor(private readonly dataSource: DataSource) {
    super(EnterpriseProfile, dataSource.manager);
  }
}
