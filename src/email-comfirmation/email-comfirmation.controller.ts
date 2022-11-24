import { Controller, Get, Query } from '@nestjs/common';
import { EmailComfirmationService } from './email-confirmation.service';

@Controller('email-comfirmation')
export class EmailComfirmationController {
  constructor(
    private readonly emailComfirmationService: EmailComfirmationService,
  ) {}

  @Get()
  async comfirmationEmail(@Query('token') token: string) {
    console.log('token', token);

    const email = await this.emailComfirmationService.decodeConfirmationLink(
      token,
    );
    return await this.emailComfirmationService.comfirmEmail(email);
  }
}
