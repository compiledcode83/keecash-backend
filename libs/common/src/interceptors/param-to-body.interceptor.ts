import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ParamToBodyInterceptor implements NestInterceptor {
  public paramName: string;
  public bodyAttributeName: string;

  constructor(paramName: string, bodyAttributeName: string) {
    this.paramName = paramName;
    this.bodyAttributeName = bodyAttributeName;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (Object.prototype.hasOwnProperty.call(request.params, this.paramName)) {
      request.body[this.bodyAttributeName] = request.params[this.paramName];
    }

    return next.handle().pipe();
  }
}
