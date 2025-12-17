import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./projects/projects.component').then((m) => m.ProjectsComponent),
    children: [
      {
        path: ':id',
        loadComponent: () =>
          import('./projects/project-detail/project-detail.component').then(
            (m) => m.ProjectDetailComponent
          ),
      },
    ],
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./about/about.component').then((m) => m.AboutComponent),
  },
];
