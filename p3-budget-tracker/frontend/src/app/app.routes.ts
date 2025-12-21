import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: '', loadComponent: () => import('./homepage/homepage.component').then(m => m.HomepageComponent) },
  {path: 'material-demo', loadComponent: () => import('./material-demo/material-demo.component').then(m => m.MaterialDemoComponent) },
];
