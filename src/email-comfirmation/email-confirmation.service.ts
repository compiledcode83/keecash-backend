import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailConfirmationDTO } from './dto/email-confirmation.dto';
import { UserService } from '@src/user/user.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailComfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  async sendEmailComfirmationLink(email: string): Promise<any> {
    const payload: EmailConfirmationDTO = { email: email };
    const token = await this.jwtService.signAsync(payload);

    const emailVerificationLink = `${this.configService.get<string>(
      'jwtConfig.emailConfirmationUrl',
    )}?token=${token}`;

    const response = await this.mailerService.sendMail({
      to: email,
      from: 'ryan.kennedy@keecash.com',
      subject: 'Please verify your email',
      text: `Verify your email by click this link ${emailVerificationLink}`,
    });
    if (response) {
      return 'Please check your mail inbox';
    }
    return 'Error Occured';
  }

  async resendEmailComfirmationLink(email: string) {
    const user = await this.userService.findByEmail(email);
    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    return await this.sendEmailComfirmationLink(email);
  }

  async decodeConfirmationLink(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get<string>(
          'jwtConfig.jwtVerificationTokenSecret',
        ),
      });
      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async comfirmEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }
    await this.userService.makeEmailAsConfirmed(email);
  }
}
