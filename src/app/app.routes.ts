import { Routes } from '@angular/router';
import { App } from './app';

export const routes: Routes = [
  {
    path: '',
    component: App,
    title: 'NIPUNA Centre of Excellence | Hetero'
  },
  {
    path: 'home',
    component: App,
    title: 'NIPUNA Centre of Excellence | Hetero'
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: '**',
    component: App,
    title: 'NIPUNA Centre of Excellence | Hetero'
  }
];
