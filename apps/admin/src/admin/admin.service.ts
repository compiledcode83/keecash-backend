import { Injectable } from '@nestjs/common';
import { UserService } from '@api/user/user.service';
import { AddAdminDto } from './dto/add-admin.dto';
import { UpdateUserInfoDto } from '../user/dto/update-user-info.dto';
import { Admin } from './admin.entity';
import { AdminRepository } from './admin.repository';
import { AdminFilterDto } from './dto/admin.filter.dto';
import { PagingResult } from 'typeorm-cursor-pagination';

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    private readonly adminRepository: AdminRepository,
  ) {}

  async findAllPaginated(searchParams: AdminFilterDto): Promise<PagingResult<Admin>> {
    return this.adminRepository.getPaginatedQueryBuilder(searchParams);
  }

  async updateUserInfo(body: UpdateUserInfoDto) {
    return this.userService.updatePersonalUser(body);
  }

  async validateAdmin(email: string, password: string): Promise<Partial<Admin> | null> {
    return this.adminRepository.validateAdmin(email, password);
  }

  async findAdminByEmail(email: string): Promise<Admin> {
    return this.adminRepository.findOneByEmail(email);
  }

  async addAdmin(body: AddAdminDto): Promise<Admin> {
    return this.adminRepository.addAdmin(body);
  }

  async deleteAdmin(id: number) {
    return this.adminRepository.softDelete({ id });
  }

  async addNormalAdmin(body: AddAdminDto): Promise<Admin> {
    const admin = await this.addAdmin(body);

    return admin;
  }
}
