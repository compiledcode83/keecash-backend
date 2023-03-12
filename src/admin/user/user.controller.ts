import { Body, Controller, Get, NotFoundException, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PersonProfileService } from '@api/user/person-profile/person-profile.service';
import { UserService } from '@api/user/user.service';
import { AccountType } from '@api/user/user.types';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { UpdateUserInfoDto } from '../admin/dto/update-user-info.dto';

@Controller()
@ApiTags('Manage users')
export class AdminUserController {
  constructor(
    private readonly userService: UserService,
    private readonly personProfileService: PersonProfileService,
  ) {}

  @ApiOperation({ description: `Get User Info By Filter(email, phone, referral id)` })
  @UseGuards(JwtAdminAuthGuard)
  @Get()
  async findUserInfo(@Query('searchKey') searchKey: string) {
    const user = await this.userService.findByEmailPhonenumberReferralId(searchKey);
    if (!user) throw new NotFoundException(`User info ${searchKey} not found`);

    switch (user.type) {
      case AccountType.Person:
        const userInfo = await this.personProfileService.getPersonUserInfo(user.id);
        if (!userInfo) throw new NotFoundException(`Profile of user ${searchKey} not found`);

        return userInfo;

      case AccountType.Enterprise:
        break;
    }
  }

  @ApiOperation({ description: `Update user info` })
  @UseGuards(JwtAdminAuthGuard)
  @Patch()
  async updateUserInfo(@Body() body: UpdateUserInfoDto) {
    return this.userService.updatePersonalUser(body);
  }
}
