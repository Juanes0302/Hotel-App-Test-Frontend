import { Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';

export const guestRoutes: Routes = [
  {
    path: 'home/guest/index',
    component: IndexComponent,
    loadChildren: () => import('./guest.module').then((m) => m.GuestModule),
  },
];
