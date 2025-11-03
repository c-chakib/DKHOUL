import { Routes } from '@angular/router';

export const SERVICES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./service-list/service-list.component').then(m => m.ServiceListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./service-create/service-create.component').then(m => m.ServiceCreateComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./service-detail/service-detail.component').then(m => m.ServiceDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./service-edit/service-edit.component').then(m => m.ServiceEditComponent)
  }
];
