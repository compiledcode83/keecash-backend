import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PersonProfile } from './person-profile.entity';

@Injectable()
export class PersonProfileRepository extends Repository<PersonProfile> {
  constructor(private readonly dataSource: DataSource) {
    super(PersonProfile, dataSource.manager);
  }
}
