import { Body, Request, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { BeneficiaryService } from './beneficiary.service';
import { AddBeneficiaryUserDto } from './dto/add-beneficiary-user.dto';

@Controller('beneficiary')
export class BeneficiaryController {
  constructor(private readonly beneficiaryService: BeneficiaryService) {}
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('add-user')
  async addBeneficiaryUser(
    @Body() body: AddBeneficiaryUserDto,
    @Request() req,
  ) {
    return await this.beneficiaryService.addBeneficiaryUser(body, req.user.id);
  }
}
