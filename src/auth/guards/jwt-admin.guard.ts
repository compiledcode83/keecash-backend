import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAdminAuthGuard extends AuthGuard('jwtAdmin') {
  handleRequest(
    err: any,
    admin: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ) {
    if (admin) {
      return admin;
    }

    throw new UnauthorizedException();
  }
}
