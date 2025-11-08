import { Routes } from '@angular/router';

export const REVIEWS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./review-list/review-list.component').then(m => m.ReviewListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./review-create/review-create.component').then(m => m.ReviewCreateComponent)
  }
];
