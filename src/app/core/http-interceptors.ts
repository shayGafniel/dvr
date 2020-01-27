import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ActionIdInterceptor } from '~/common/services/interceptors/http-interceptors/action-id-interceptor.service';
import { CommonHttpInterceptor } from '~/common/services/interceptors/http-interceptors/common.http-interceptor';
import { LogHttpInterceptor } from '~/common/services/interceptors/http-interceptors/log.http-interceptor';
import { MockHttpInterceptor } from '~/common/services/interceptors/http-interceptors/mock.http-interceptor';
import { environment } from 'environments/environment';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: CommonHttpInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ActionIdInterceptor, multi: true },
  environment.isLogging
    ? { provide: HTTP_INTERCEPTORS, useClass: LogHttpInterceptor, multi: true }
    : [],
  environment.isMock
    ? { provide: HTTP_INTERCEPTORS, useClass: MockHttpInterceptor, multi: true }
    : [],
];
