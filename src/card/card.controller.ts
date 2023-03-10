import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { CardService } from './card.service';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ description: `Get my all cards` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllPaginated(@Request() req) {
    return;
  }
}
