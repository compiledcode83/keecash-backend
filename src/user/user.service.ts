import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateEnterpriseUserDto } from './dto/create-enterprise-user.dto';
import { CreatePersonUserDto } from './dto/create-person-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Country } from './table/country.entity';
import { CountryRepository } from './table/country.repository';
import { DOCUEMNT_TYPE, Document } from './table/document.entity';
import { DocumentRepository } from './table/document.repository';
import { EnterpriseProfile } from './table/enterprise-profile.entity';
import { EnterpriseProfileRepository } from './table/enterprise-profile.repository';
import { PersonProfile } from './table/person-profile.entity';
import { PersonProfileRepository } from './table/person-profile.repository';
import { Shareholder } from './table/shareholder.entity';
import { ShareholderRepository } from './table/shareholder.repository';
import { AccountType, User } from './table/user.entity';
import { UserRepository } from './table/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly personProfileRepository: PersonProfileRepository,
    private readonly countryRepository: CountryRepository,
    private readonly documentRepository: DocumentRepository,
    private readonly enterpriseProfileRepository: EnterpriseProfileRepository,
    private readonly shareholderRepository: ShareholderRepository,
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

  async createPersonalUser(body: CreatePersonUserDto) {
    const user: Partial<User> = {
      firstName: body.firstName,
      secondName: body.secondName,
      email: body.email,
      phoneNumber: body.phoneNumber,
      language: body.language,
      accountType: AccountType.PERSON,
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
      imageLink: body.verificationImageLink,
    };
    const documentEntity = this.documentRepository.create(document);
    await this.documentRepository.save(documentEntity);
    return 'success';
  }

  async createEnterpriseUser(body: CreateEnterpriseUserDto) {
    const user: Partial<User> = {
      firstName: body.firstName,
      secondName: body.secondName,
      email: body.email,
      language: body.language,
      accountType: AccountType.ENTERPRISE,
      password: await bcrypt.hash(body.password, 10),
    };
    const userEntity = this.userRepository.create(user);
    const resUser = await this.userRepository.save(userEntity, {
      reload: false,
    });
    const savedUser = await this.findOne(resUser.id);
    const country = await this.findOneCountryByName(body.country);
    const enterpriseProfile: Partial<EnterpriseProfile> = {
      position: body.position,
      entityType: body.entityType,
      companyName: body.companyName,
      countryId: country.id,
      companyRegisterationNumber: body.companyRegisterationNumber,
      vatNumber: body.vatNumber,
      address1: body.address1,
      address2: body.address2,
      zipcode: body.zipcode,
      city: body.city,
      user: savedUser,
    };
    const enterpriseProfileEntity =
      this.enterpriseProfileRepository.create(enterpriseProfile);
    const resEnterpriseProfile = await this.enterpriseProfileRepository.save(
      enterpriseProfileEntity,
    );
    const savedEnterpriseProfile =
      await this.enterpriseProfileRepository.findOne({
        where: { id: resEnterpriseProfile.id },
      });
    for (const shareholderItem of body.shareholders) {
      const shareholder: Partial<Shareholder> = {
        firstName: shareholderItem.firstName,
        secondName: shareholderItem.secondName,
        enterpriseProfileId: savedEnterpriseProfile.id,
      };
      const shareholderEntity = this.shareholderRepository.create(shareholder);
      await this.shareholderRepository.save(shareholderEntity);
    }
    {
      const document: Partial<Document> = {
        userId: savedUser.id,
        type: body.documentType,
        imageLink: body.verificationImageLink,
      };
      const documentEntity = this.documentRepository.create(document);
      await this.documentRepository.save(documentEntity);
    }
    {
      const document: Partial<Document> = {
        userId: savedUser.id,
        type: DOCUEMNT_TYPE.UBO,
        imageLink: body.uboImageLink,
      };
      const documentEntity = this.documentRepository.create(document);
      await this.documentRepository.save(documentEntity);
    }
    {
      const document: Partial<Document> = {
        userId: savedUser.id,
        type: DOCUEMNT_TYPE.PROOF_COMPANY_REGISTERATION,
        imageLink: body.companyRegisterationImageLink,
      };
      const documentEntity = this.documentRepository.create(document);
      await this.documentRepository.save(documentEntity);
    }
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
