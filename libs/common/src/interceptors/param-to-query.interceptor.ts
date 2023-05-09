import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ParamToQueryInterceptor implements NestInterceptor {
  public paramName: string;
  public queryName: string;

  constructor(paramName: string, queryName: string) {
    this.paramName = paramName;
    this.queryName = queryName;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (Object.prototype.hasOwnProperty.call(request.params, this.paramName)) {
      request.query[this.queryName] = request.params[this.paramName];
    }

    return next.handle().pipe();
  }
}
