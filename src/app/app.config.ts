import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling, withComponentInputBinding, TitleStrategy } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './core/interceptor/auth.interceptor';
import { loaderInterceptor } from './core/interceptor/loader.interceptor';
import { AppTitleStrategy } from './core/helpers/app-title.strategy';
import { provideToastr } from 'ngx-toastr';

// 👇 Import spinner provider

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
       provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    Title,
    { provide: TitleStrategy, useClass: AppTitleStrategy },
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
      withComponentInputBinding()
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, loaderInterceptor])),
    provideToastr({
      timeOut: 2500,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      toastClass: 'ngx-toastr toast-main'
    }),

    

    // 👇 This line enables NgxSpinner globally
    
  ],
};
