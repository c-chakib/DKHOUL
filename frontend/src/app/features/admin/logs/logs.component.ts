// frontend/src/app/features/admin/logs/logs.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { LogService } from '../../../core/services/log.service';
import { LoggerService } from '../../../core/services/logger.service';

interface LogEntry {
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

interface LogStats {
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
}

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit, OnDestroy {
  logs: LogEntry[] = [];
  stats: LogStats | null = null;
  components: string[] = [];
  
  displayedColumns: string[] = ['timestamp', 'level', 'component', 'message', 'user', 'actions'];
  
  // Pagination
  page = 1;
  pageSize = 25;
  totalLogs = 0;
  
  // Filters
  filters = {
    level: null as string | null,
    component: null as string | null,
    startDate: null as Date | null,
    endDate: null as Date | null,
    search: ''
  };
  
  loading = false;
  private searchSubject = new Subject<string>();
  maxErrorCount = 0;

  constructor(
    private logService: LogService,
    private logger: LoggerService,
    private dialog: MatDialog,
    private router: Router
  ) {
    // Debounce search input
    this.searchSubject.pipe(
      debounceTime(500)
    ).subscribe(() => {
      this.applyFilters();
    });
  }

  ngOnInit(): void {
    this.loadLogs();
    this.loadStats();
    this.logger.info('Logs dashboard initialized');
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  /**
   * Load logs from backend
   */
  loadLogs(): void {
    this.loading = true;
    
    const params: any = {
      page: this.page,
      limit: this.pageSize
    };
    
    if (this.filters.level) params.level = this.filters.level;
    if (this.filters.component) params.component = this.filters.component;
    if (this.filters.startDate) params.startDate = this.filters.startDate.toISOString();
    if (this.filters.endDate) params.endDate = this.filters.endDate.toISOString();
    if (this.filters.search) params.search = this.filters.search;
    
    this.logService.getLogs(params).subscribe({
      next: (response) => {
        this.logs = response.data.logs;
        this.totalLogs = response.data.pagination.total;
        this.loading = false;
        this.logger.debug('Loaded logs', response);
      },
      error: (error) => {
        this.logger.error('Error loading logs', error);
        this.loading = false;
      }
    });
  }

  /**
   * Load statistics
   */
  loadStats(): void {
    this.logService.getLogStats().subscribe({
      next: (response) => {
        this.stats = response.data;
        
        // Extract unique components
        this.components = response.data.componentStats.map((stat: any) => stat._id);
        
        // Calculate max error count for chart
        if (response.data.errorTrends.length > 0) {
          this.maxErrorCount = Math.max(...response.data.errorTrends.map((t: any) => t.count));
        }
        
        this.logger.debug('Loaded log stats', response);
      },
      error: (error) => {
        this.logger.error('Error loading log stats', error);
      }
    });
  }

  /**
   * Apply filters
   */
  applyFilters(): void {
    this.page = 1;
    this.loadLogs();
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.filters = {
      level: null,
      component: null,
      startDate: null,
      endDate: null,
      search: ''
    };
    this.applyFilters();
  }

  /**
   * Handle search input change
   */
  onSearchChange(): void {
    this.searchSubject.next(this.filters.search);
  }

  /**
   * Handle page change
   */
  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadLogs();
  }

  /**
   * Refresh logs
   */
  refreshLogs(): void {
    this.loadLogs();
    this.loadStats();
    this.logger.info('Logs refreshed');
  }

  /**
   * Export logs to CSV
   */
  exportLogs(): void {
    const params: any = {};
    if (this.filters.level) params.level = this.filters.level;
    if (this.filters.component) params.component = this.filters.component;
    if (this.filters.startDate) params.startDate = this.filters.startDate.toISOString();
    if (this.filters.endDate) params.endDate = this.filters.endDate.toISOString();
    
    this.logService.exportLogs(params);
    this.logger.info('Exporting logs to CSV');
  }

  /**
   * View log details
   */
  viewLogDetails(log: LogEntry): void {
    // TODO: Open dialog with full log details
    console.log('View log details:', log);
    this.logger.info('Viewing log details', { logId: log._id });
  }

  /**
   * View user profile
   */
  viewUser(userId: string): void {
    this.router.navigate(['/admin/users', userId]);
    this.logger.info('Navigating to user profile', { userId });
  }

  /**
   * Get icon for log level
   */
  getLevelIcon(level: string): string {
    switch (level) {
      case 'debug': return 'bug_report';
      case 'info': return 'info';
      case 'warn': return 'warning';
      case 'error': return 'error';
      default: return 'circle';
    }
  }

  /**
   * Format hour for error trends
   */
  formatHour(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
}
