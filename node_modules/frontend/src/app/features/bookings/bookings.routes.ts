import { Routes } from '@angular/router';

export const BOOKINGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./booking-list/booking-list.component').then(m => m.BookingListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./booking-create/booking-create.component').then(m => m.BookingCreateComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./booking-detail/booking-detail.component').then(m => m.BookingDetailComponent)
  }
];
