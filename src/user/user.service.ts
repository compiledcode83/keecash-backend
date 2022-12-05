import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreatePersonProfileDto } from './dto/create-person-profile.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Country } from './table/country.entity';
import { CountryRepository } from './table/country.repository';
import { Document } from './table/document.entity';
import { DocumentRepository } from './table/document.repository';
import { PersonProfile } from './table/person-profile.entity';
import { PersonProfileRepository } from './table/person-profile.repository';
import { User } from './table/user.entity';
import { UserRepository } from './table/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly personProfileRepository: PersonProfileRepository,
    private readonly countryRepository: CountryRepository,
    private readonly documentRepository: DocumentRepository,
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

  async createPersonalUser(body: CreatePersonProfileDto, imageLink: string) {
    const user: Partial<User> = {
      firstName: body.firstName,
      secondName: body.secondName,
      email: body.email,
      phoneNumber: body.phoneNumber,
      language: body.language,
      accountType: body.accountType,
      password: await bcrypt.hash(body.password, 10),
    };
    const userEntity = this.userRepository.create(user);
    const res = await this.userRepository.save(userEntity, {
      reload: false,
    });
    const savedUser = await this.findOne(res.id);
    const country = await this.findOneCountryByName(body.country);
    const personProfile: Partial<PersonProfile> = {
      address1: body.address1,
      address2: body.address2,
      zipcode: body.zipcode,
      city: body.city,
      countryId: country.id,
      user: savedUser,
    };
    const personProfileEntity =
      this.personProfileRepository.create(personProfile);
    await this.personProfileRepository.save(personProfileEntity);
    const document: Partial<Document> = {
      userId: savedUser.id,
      type: body.documentType,
      imageLink: imageLink,
    };
    const documentEntity = this.documentRepository.create(document);
    await this.documentRepository.save(documentEntity);
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

  async findOneCountryByName(name: string): Promise<Country> {
    return this.countryRepository.findOne({ where: { name: name } });
  }
}
