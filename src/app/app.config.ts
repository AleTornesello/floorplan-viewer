import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(NoopAnimationsModule),
    {
      provide: LOCALE_ID,
      useValue: navigator.language,
    },
    provideTransloco({
      config: {
        availableLangs: ['en', 'it'],
        defaultLang: navigator.language.includes('-')
          ? navigator.language.split('-')[0]
          : navigator.language,
        prodMode: !isDevMode(),
        fallbackLang: 'en',
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
