import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreatePersonProfileDto } from './dto/create-person-profile.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PersonProfile } from './person-profile.entity';
import { PersonProfileRepository } from './person-profile.repository';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly personProfileRepository: PersonProfileRepository,
  ) {}

  async findByUuid(uuid: string): Promise<User> {
    return this.userRepository.findOne({ where: { uuid } });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User> {
    return this.userRepository.findOne({ where: { phoneNumber } });
  }

  async update(uuid: string, body: UpdateUserDto): Promise<User> {
    await this.userRepository.update(
      { uuid },
      this.userRepository.create(body),
    );

    return this.findByUuid(uuid);
  }

  async createPersonalUser(
    userEntity: CreateUserDto,
    personProfileEntity: CreatePersonProfileDto,
  ) {
    const user: Partial<User> = {
      ...this.userRepository.create(userEntity),
      password: await bcrypt.hash(userEntity.password, 10),
    };
    const res = await this.userRepository.save(user, {
      reload: false,
    });
    const savedUser = await this.findByUuid(res.uuid);
    const personProfile: Partial<PersonProfile> = {
      ...this.personProfileRepository.create(personProfileEntity),
      user: savedUser,
    };
    await this.personProfileRepository.save(personProfile);
    return 'success';
  }

  async create(body: CreateUserDto): Promise<User> {
    const userEntity: Partial<User> = {
      ...this.userRepository.create(body),
      password: await bcrypt.hash(body.password, 10),
    };
    const user = await this.userRepository.save(userEntity, { reload: false });

    return this.findByUuid(user.uuid);
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }
}
