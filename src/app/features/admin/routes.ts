import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./shell').then(m => m.AdminShell)
  },
  {
    path: 'posts',
    loadComponent: () => import('./screens/posts-list').then(m => m.AdminPostsList)
  },
  {
    path: 'posts/new',
    loadComponent: () => import('./screens/post-form').then(m => m.AdminPostForm)
  },
  {
    path: 'posts/:id',
    loadComponent: () => import('./screens/post-form').then(m => m.AdminPostForm)
  }
];


