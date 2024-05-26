import { Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { ReportsComponent } from './components/reports/reports.component';

export const recordsRoutes: Routes = [
  {
    path: 'home/records/index',
    component: IndexComponent,
    loadChildren: () => import('./records.module').then((m) => m.RecordsModule),
  },
  {
    path: 'home/records/reports',
    component: ReportsComponent,
    loadChildren: () => import('./records.module').then((m) => m.RecordsModule),
  },
];
