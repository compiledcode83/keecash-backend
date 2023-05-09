import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RequestToParamInterceptor implements NestInterceptor {
  constructor(private readonly requestAttributeName: string, private readonly paramAttributeName: string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (Object.prototype.hasOwnProperty.call(request, this.requestAttributeName)) {
      request.params[this.paramAttributeName] = request[this.requestAttributeName];
    }

    return next.handle().pipe();
  }
}
