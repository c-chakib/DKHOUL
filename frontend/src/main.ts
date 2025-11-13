import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { initSentry } from './app/config/sentry.config';
import { environment } from './environments/environment';

// Initialize Sentry with environment configuration
initSentry(environment.sentryDsn, environment.production ? 'production' : 'development');

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
