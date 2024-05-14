import { Routes } from "@angular/router";
import { IndexComponent } from "./components/index/index.component";


export const recordsRoutes: Routes = [
  {
    path: 'records/index',
    component: IndexComponent,
    loadChildren: () => import('./records.module').then(m => m.RecordsModule )
  }
];