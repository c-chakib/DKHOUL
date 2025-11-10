import { Routes } from '@angular/router';

export const MESSAGES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./chat-interface/chat-interface.component').then(m => m.ChatInterfaceComponent)
  }
];
