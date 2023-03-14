import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalPwdAuthGuard extends AuthGuard('local-pwd') {}
