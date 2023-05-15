import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { set } from 'lodash';

@Injectable()
export class RequestToQueryInterceptor implements NestInterceptor {
  public requestAttributeName: string;
  public queryAttributeName: string;

  constructor(requestAttributeName: string, queryAttributeName: string) {
    this.requestAttributeName = requestAttributeName;
    this.queryAttributeName = queryAttributeName;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (this.requestAttributeName in request) {
      set(request.query, this.queryAttributeName, request[this.requestAttributeName]);
    }

    return next.handle().pipe();
  }
}
