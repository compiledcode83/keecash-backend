import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from './admin.entity';
import { AddAdminDto } from '../dto/add-admin.dto';

@Injectable()
export class AdminRepository extends Repository<Admin> {
  constructor(private readonly dataSource: DataSource) {
    super(Admin, dataSource.manager);
  }

  async findOneByEmail(email: string): Promise<Admin> {
    return this.findOne({ where: { email: email } });
  }

  async validateAdmin(email: string, password: string): Promise<Partial<Admin> | null> {
    const admin = await this.findOneByEmail(email);

    if (admin && (await bcrypt.compare(password, admin.password))) {
      return {
        id: admin.id,
        email: admin.email,
        type: admin.type,
      };
    }
  }

  async addAdmin(body: AddAdminDto): Promise<Admin> {
    const admin: Partial<Admin> = {
      email: body.email,
      password: await bcrypt.hash(body.password, 10),
      type: body.type,
    };
    const adminEntity = this.create(admin);
    const res = await this.save(adminEntity);

    return this.findOne({ where: { id: res.id } });
  }
}
