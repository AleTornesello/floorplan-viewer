import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
  provideZoneChangeDetection,
  isDevMode,
  APP_INITIALIZER,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { TranslocoHttpLoader } from './transloco-loader';
import {
  provideTransloco,
  Translation,
  TranslocoService,
} from '@jsverse/transloco';
import { lastValueFrom } from 'rxjs';

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
    {
      provide: APP_INITIALIZER,
      useFactory: (translateService: TranslocoService) => {
        return (): Promise<Translation> => {
          const defaultLang = translateService.getDefaultLang();
          translateService.setActiveLang(defaultLang);
          translateService.getTranslation(defaultLang);
          return lastValueFrom(translateService.load(defaultLang));
        };
      },
      deps: [TranslocoService],
      multi: true,
    },
  ],
};
