import { ErrorHandler } from '@angular/core';

import { ErrorsHandler } from '~/common/services/interceptors/app-interceptors/error-handler.interceptor';
import { environment } from 'environments/environment';

/** Application interceptor providers in outside-in order */
export const applicationInterceptorProviders = [
  environment.production && !environment.isProxy
    ? { provide: ErrorHandler, useClass: ErrorsHandler }
    : [],
];
