import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

export const initSentry = () => {
  // Only initialize Sentry in production or if explicitly enabled
  if (process.env.NODE_ENV === 'production' || process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      integrations: [
        nodeProfilingIntegration(),
        Sentry.httpIntegration(),
        Sentry.consoleIntegration(),
        Sentry.onUncaughtExceptionIntegration(),
        Sentry.onUnhandledRejectionIntegration(),
      ],
      // Performance monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

      // Error tracking
      beforeSend(event, hint) {
        // Filter out sensitive information
        if (event.request?.data) {
          // Remove sensitive fields from request data
          const sensitiveFields = ['password', 'token', 'secret', 'key'];
          const data = event.request.data as any;

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

      // Capture console logs in production
      beforeBreadcrumb(breadcrumb, hint) {
        if (breadcrumb.category === 'console' && process.env.NODE_ENV === 'production') {
          // Only capture error and warn level console logs
          if (!['error', 'warn'].includes(breadcrumb.level || '')) {
            return null;
          }
        }
        return breadcrumb;
      },
    });

    console.log('🔍 Sentry error tracking initialized');
  } else {
    console.log('ℹ️  Sentry not initialized (not in production or SENTRY_DSN not set)');
  }
};

export const captureException = (error: Error, context?: any) => {
  if (process.env.NODE_ENV === 'production' || process.env.SENTRY_DSN) {
    Sentry.withScope(scope => {
      if (context) {
        scope.setContext('additional_info', context);
      }
      Sentry.captureException(error);
    });
  } else {
    console.error('Error captured (Sentry not active):', error);
  }
};

export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info', context?: any) => {
  if (process.env.NODE_ENV === 'production' || process.env.SENTRY_DSN) {
    Sentry.withScope(scope => {
      scope.setLevel(level);
      if (context) {
        scope.setContext('additional_info', context);
      }
      Sentry.captureMessage(message);
    });
  } else {
    console.log(`Message captured (Sentry not active) [${level}]:`, message);
  }
};