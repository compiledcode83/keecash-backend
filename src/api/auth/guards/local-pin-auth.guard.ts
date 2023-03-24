import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalPinAuthGuard extends AuthGuard('local-pin') {}
