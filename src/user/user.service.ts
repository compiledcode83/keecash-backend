import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreatePersonProfileDto } from './dto/create-person-profile.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { PersonProfile } from './table/person-profile.entity';
import { PersonProfileRepository } from './table/person-profile.repository';
import { User } from './table/user.entity';
import { UserRepository } from './table/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly personProfileRepository: PersonProfileRepository,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User> {
    return this.userRepository.findOne({ where: { phoneNumber } });
  }

  async passwordReset(email: string, password: string): Promise<boolean> {
    await this.userRepository.update(
      { email },
      { password: await bcrypt.hash(password, 10) },
    );
    return true;
  }

  async createPersonalUser(
    userEntity: CreateUserDto,
    personProfileEntity: CreatePersonProfileDto,
    imageLink: string,
  ) {
    const user: Partial<User> = {
      ...this.userRepository.create(userEntity),
      password: await bcrypt.hash(userEntity.password, 10),
    };
    const res = await this.userRepository.save(user, {
      reload: false,
    });
    const savedUser = await this.findOne(res.id);
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

    return this.findOne(user.id);
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }
}
