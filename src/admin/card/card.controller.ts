import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardService } from '@api/card/card.service';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { GetCardAdminDto } from '../admin/dto/get-card.admin.dto';

@Controller()
@ApiTags('Manage cards')
export class AdminCardController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ description: 'Get cards by user' })
  @ApiBearerAuth()
  @UseGuards(JwtAdminAuthGuard)
  @Get()
  async findCardsByUserId(@Query() query: GetCardAdminDto) {
    return this.cardService.findAllPaginated(query);
  }
}
