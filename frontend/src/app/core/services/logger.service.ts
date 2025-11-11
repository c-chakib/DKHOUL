import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private isDevelopment = !environment.production;
  private logLevel: LogLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.ERROR;

  /**
   * Log debug information (only in development)
   */
  debug(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  /**
   * Log informational messages
   */
  info(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  /**
   * Log warning messages
   */
  warn(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  /**
   * Log error messages (always logged)
   */
  error(message: string, error?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(`[ERROR] ${message}`, error);
      
      // Send to backend for admin dashboard
      this.sendToErrorTracking(message, error);
    }
  }

  /**
   * Log with timestamp (for debugging timing issues)
   */
  logWithTimestamp(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] ${message}`, ...args);
    }
  }

  /**
   * Group related logs together
   */
  group(label: string): void {
    if (this.isDevelopment) {
      console.group(label);
    }
  }

  groupEnd(): void {
    if (this.isDevelopment) {
      console.groupEnd();
    }
  }

  /**
   * Log table data (useful for arrays/objects)
   */
  table(data: any): void {
    if (this.isDevelopment) {
      console.table(data);
    }
  }

  /**
   * Check if should log based on level
   */
  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  /**
   * Send logs to backend
   */
  private sendToBackend(level: LogLevel, message: string, data?: any): void {
    // Only send in production or if explicitly enabled
    if (!environment.production && !this.shouldSendToBackend) {
      return;
    }
    
    try {
      const logEntry = {
        level: LogLevel[level].toLowerCase(),
        message,
        component: this.getCurrentComponent(),
        action: this.getCurrentAction(),
        timestamp: new Date().toISOString(),
        metadata: {
          url: window.location.href,
          userAgent: navigator.userAgent,
          error: data?.message || data,
          stack: data?.stack
        }
      };
      
      fetch(`${environment.apiUrl}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(logEntry)
      }).catch(() => {
        // Silently fail - don't break app due to logging
      });
    } catch (e) {
      // Silently fail
    }
  }

  /**
   * Send errors to tracking service in production
   */
  private sendToErrorTracking(message: string, error: any): void {
    // Send to backend
    this.sendToBackend(LogLevel.ERROR, message, error);
    
    // TODO: Also integrate with Sentry, LogRocket, etc.
    // Example with Sentry:
    // Sentry.captureException(error, { extra: { message } });
  }

  /**
   * Get current component name from router
   */
  private getCurrentComponent(): string {
    try {
      const url = window.location.pathname;
      const segments = url.split('/').filter(s => s);
      return segments[0] || 'root';
    } catch {
      return 'unknown';
    }
  }

  /**
   * Get current action from URL
   */
  private getCurrentAction(): string {
    try {
      const url = window.location.pathname;
      const segments = url.split('/').filter(s => s);
      return segments[segments.length - 1] || 'index';
    } catch {
      return 'unknown';
    }
  }

  /**
   * Get authentication token
   */
  private getAuthToken(): string {
    try {
      return localStorage.getItem('token') || '';
    } catch {
      return '';
    }
  }

  /**
   * Enable/disable sending logs to backend
   */
  private shouldSendToBackend = false;
  
  enableBackendLogging(enable: boolean = true): void {
    this.shouldSendToBackend = enable;
  }

  /**
   * Set log level dynamically
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }
}
