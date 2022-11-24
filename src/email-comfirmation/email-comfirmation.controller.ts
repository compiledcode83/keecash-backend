import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { EmailComfirmationService } from './email-confirmation.service';

@Controller('email-comfirmation')
export class EmailComfirmationController {
  constructor(
    private readonly emailComfirmationService: EmailComfirmationService,
  ) {}

  @Get()
  async comfirmationEmail(@Query('token') token: string) {
    const email = await this.emailComfirmationService.decodeConfirmationLink(
      token,
    );
    await this.emailComfirmationService.comfirmEmail(email);
    return 'Successfully Verified';
  }

  @Post('resend-confirmation-link')
  @UseGuards(JwtAuthGuard)
  async resendComfirmationLink(@Request() req) {
    return await this.emailComfirmationService.resendEmailComfirmationLink(
      req.user.email,
    );
  }
}
