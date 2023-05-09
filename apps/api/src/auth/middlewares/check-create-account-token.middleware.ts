import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { CipherTokenService, TokenTypeEnum } from '@app/cipher-token';

@Injectable()
export class CheckCreateAccountToken implements NestMiddleware {
  constructor(private cipherTokenService: CipherTokenService) {}

  async use(req: any, res: any, next: () => void) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Missing CreateAccountToken in the header');
    }

    const bearerCreateAccountToken = req.headers.authorization.split(' ')[1];

    const token = await this.cipherTokenService.findOneBy({
      token: bearerCreateAccountToken,
      type: TokenTypeEnum.CreateAccount,
    });

    if (!token) {
      throw new UnauthorizedException('Token is invalid');
    }

    req.token = token;
    next();
  }
}
