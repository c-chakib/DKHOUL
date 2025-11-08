import { Routes } from '@angular/router';

export const MESSAGES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./conversations-list/conversations-list.component').then(m => m.ConversationsListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./chat-interface/chat-interface.component').then(m => m.ChatInterfaceComponent)
  }
];
