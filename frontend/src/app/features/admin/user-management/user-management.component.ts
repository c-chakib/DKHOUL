import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminService } from '../../../core/services/admin.service';
import Swal from 'sweetalert2';
import { LoggerService } from '../../../core/services/logger.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, 
            MatChipsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  displayedColumns: string[] = ['avatar', 'name', 'email', 'role', 'verified', 'status', 'createdAt', 'actions'];
  users: any[] = [];
  totalUsers = 0;
  pageSize = 10;
  pageIndex = 0;
  loading = true;
  searchQuery = '';
  roleFilter = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getUsers(this.pageIndex + 1, this.pageSize, this.searchQuery).subscribe({
      next: (data: any) => {
        this.users = data.data || data.users || [];
        this.totalUsers = data.total || this.users.length;
        this.loading = false;
      },
      error: (error: any) => {
        this.logger.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  searchUsers(): void {
    this.pageIndex = 0;
    this.loadUsers();
  }

  filterByRole(role: string): void {
    this.roleFilter = role;
    this.pageIndex = 0;
    this.loadUsers();
  }

  verifyUser(userId: string): void {
    Swal.fire({
      title: 'Verify User?',
      text: 'This will verify the user account',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#999',
      confirmButtonText: 'Yes, verify'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.verifyUser(userId).subscribe({
          next: () => {
            Swal.fire('Verified!', 'User has been verified', 'success');
            this.loadUsers();
          },
          error: (error: any) => {
            this.logger.error('Error verifying user:', error);
            Swal.fire('Error', 'Failed to verify user', 'error');
          }
        });
      }
    });
  }

  suspendUser(userId: string): void {
    Swal.fire({
      title: 'Suspend User?',
      text: 'This will suspend the user account',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F44336',
      cancelButtonColor: '#999',
      confirmButtonText: 'Yes, suspend'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.suspendUser(userId).subscribe({
          next: () => {
            Swal.fire('Suspended!', 'User has been suspended', 'success');
            this.loadUsers();
          },
          error: (error: any) => {
            this.logger.error('Error suspending user:', error);
            Swal.fire('Error', 'Failed to suspend user', 'error');
          }
        });
      }
    });
  }

  deleteUser(userId: string): void {
    Swal.fire({
      title: 'Delete User?',
      text: 'This action cannot be undone!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#F44336',
      cancelButtonColor: '#999',
      confirmButtonText: 'Yes, delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteUser(userId).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'User has been deleted', 'success');
            this.loadUsers();
          },
          error: (error: any) => {
            this.logger.error('Error deleting user:', error);
            Swal.fire('Error', 'Failed to delete user', 'error');
          }
        });
      }
    });
  }
}


