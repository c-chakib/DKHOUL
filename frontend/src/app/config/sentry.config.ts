import { ErrorHandler, Injectable } from '@angular/core';
import * as Sentry from '@sentry/browser';

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // Only send errors to Sentry in production or if explicitly enabled
    if (this.shouldReportError()) {
      Sentry.captureException(error.originalError || error);
    }

    // Always log to console
    console.error('Error captured:', error);
  }

  private shouldReportError(): boolean {
    return typeof window !== 'undefined' &&
           (window.location.hostname !== 'localhost' ||
            this.getSentryDsn() !== null);
  }

  private getSentryDsn(): string | null {
    // Try to get DSN from various sources
    return (window as any)['SENTRY_DSN'] ||
           (window as any)['sentryDsn'] ||
           null;
  }
}

export const initSentry = (dsn?: string, environment?: string) => {
  // Get DSN from parameter or global
  const sentryDsn = dsn || (window as any)['SENTRY_DSN'] || (window as any)['sentryDsn'];

  // Only initialize Sentry if we have a DSN and are not in localhost (unless explicitly enabled)
  if (typeof window !== 'undefined' && sentryDsn &&
      (window.location.hostname !== 'localhost' || !!sentryDsn)) {

    Sentry.init({
      dsn: sentryDsn,
      environment: environment || (window as any)['NODE_ENV'] || 'development',
      // Basic error tracking only
      tracesSampleRate: window.location.hostname === 'localhost' ? 1.0 : 0.1,

      // Error filtering
      beforeSend(event) {
        // Filter out sensitive information
        if (event.request?.data) {
          const sensitiveFields = ['password', 'token', 'secret', 'key', 'creditCard'];
          const data = event.request.data as Record<string, unknown>;

          if (typeof data === 'object' && data !== null) {
            sensitiveFields.forEach(field => {
              if (data[field]) {
                data[field] = '[FILTERED]';
              }
            });
          }
        }

        return event;
      },
    });

    console.log('🔍 Sentry error tracking initialized (Frontend)');
  } else {
    console.log('ℹ️  Sentry not initialized (Frontend - localhost or no DSN)');
  }
};