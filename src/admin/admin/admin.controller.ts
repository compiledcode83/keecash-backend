import { Body, Controller, Post, UseGuards, Get, Query, Delete, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AddAdminDto } from './dto/add-admin.dto';
import { AdminFilterDto } from './dto/admin.filter.dto';
import { JwtAdminAuthGuard } from '@admin/auth/guards/jwt-admin-auth.guard';

@Controller()
@ApiTags('Manage admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ description: `Get admin` })
  @ApiBearerAuth()
  @UseGuards(JwtAdminAuthGuard)
  @Get()
  async findAllPaginated(@Query() searchParams: AdminFilterDto) {
    return this.adminService.findAllPaginated(searchParams);
  }

  @ApiOperation({ description: `Add admin` })
  @ApiBearerAuth()
  @UseGuards(JwtAdminAuthGuard)
  @Post()
  async addAdmin(@Body() body: AddAdminDto) {
    return this.adminService.addAdmin(body);
  }

  @ApiOperation({ description: `Delete admin` })
  @ApiParam({ name: 'card_id', required: true, description: 'Bridgecard ID' })
  @ApiBearerAuth()
  @UseGuards(JwtAdminAuthGuard)
  @Delete(':id')
  async deleteAdmin(@Param('id') id: number) {
    return this.adminService.deleteAdmin(id);
  }
}
