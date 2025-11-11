import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-panel/admin-panel.component').then(m => m.AdminPanelComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./user-management/user-management.component').then(m => m.UserManagementComponent)
  },
  {
    path: 'logs',
    loadComponent: () => import('./logs/logs.component').then(m => m.LogsComponent)
  }
];
