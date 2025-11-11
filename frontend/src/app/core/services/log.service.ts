// frontend/src/app/core/services/log.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LogEntry {
  _id: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: Date;
  component?: string;
  action?: string;
  userId?: string;
  userName?: string;
  metadata?: any;
}

export interface LogStats {
  totalLogs: number;
  todayLogs: number;
  levelStats: {
    debug?: number;
    info?: number;
    warn?: number;
    error?: number;
  };
  componentStats: Array<{ _id: string; count: number }>;
  errorTrends: Array<{ _id: string; count: number }>;
  recentErrors: LogEntry[];
}

export interface LogsResponse {
  success: boolean;
  data: {
    logs: LogEntry[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface LogStatsResponse {
  success: boolean;
  data: LogStats;
}

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private apiUrl = `${environment.apiUrl}/logs`;

  constructor(private http: HttpClient) {}

  /**
   * Get logs with filters
   */
  getLogs(params: any): Observable<LogsResponse> {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] != null) {
        httpParams = httpParams.append(key, params[key].toString());
      }
    });
    
    return this.http.get<LogsResponse>(this.apiUrl, { params: httpParams });
  }

  /**
   * Get log statistics
   */
  getLogStats(startDate?: Date, endDate?: Date): Observable<LogStatsResponse> {
    let params = new HttpParams();
    
    if (startDate) {
      params = params.append('startDate', startDate.toISOString());
    }
    if (endDate) {
      params = params.append('endDate', endDate.toISOString());
    }
    
    return this.http.get<LogStatsResponse>(`${this.apiUrl}/stats`, { params });
  }

  /**
   * Create a log entry
   */
  createLog(log: {
    level: 'debug' | 'info' | 'warn' | 'error';
    message: string;
    component?: string;
    action?: string;
    metadata?: any;
  }): Observable<any> {
    return this.http.post(this.apiUrl, log);
  }

  /**
   * Export logs to CSV
   */
  exportLogs(params: any): void {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] != null) {
        httpParams = httpParams.append(key, params[key].toString());
      }
    });
    
    const url = `${this.apiUrl}/export?${httpParams.toString()}`;
    window.open(url, '_blank');
  }

  /**
   * Delete old logs
   */
  deleteOldLogs(days: number = 30): Observable<any> {
    return this.http.post(`${this.apiUrl}/cleanup`, { days });
  }
}
