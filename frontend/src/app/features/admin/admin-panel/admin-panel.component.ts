import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatTabsModule, MatProgressSpinnerModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent implements OnInit {
  stats = {
    totalUsers: 0,
    totalServices: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    activeDisputes: 0
  };
  loading = true;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.adminService.getDashboardStats().subscribe({
      next: (response: any) => {
        const statsData = response.data?.statistics || response.statistics || response;
        this.stats = {
          totalUsers: statsData.totalUsers || 0,
          totalServices: statsData.totalServices || 0,
          totalBookings: statsData.totalBookings || 0,
          totalRevenue: statsData.totalRevenue || 0,
          pendingApprovals: statsData.pendingServices || 0,
          activeDisputes: 0 // Not yet implemented in backend
        };
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading stats:', error);
        this.loading = false;
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
