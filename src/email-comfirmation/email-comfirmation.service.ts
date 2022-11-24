import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailConfirmationDTO } from './dto/email-confirmation.dto';

@Injectable()
export class EmailComfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmailComfirmationLink(email: string): Promise<string> {
    const payload: EmailConfirmationDTO = { email: email };
    const token = await this.jwtService.signAsync(payload);

    const url = `${this.configService.get<string>(
      'jwtConfig.emailConfirmationUrl',
    )}?token=${token}`;

    return url;
  }
}
