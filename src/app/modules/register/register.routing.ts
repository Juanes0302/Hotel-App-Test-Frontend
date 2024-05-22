import { Routes } from "@angular/router";
import { IndexComponent } from "./components/index/index.component";


export const registerRoutes: Routes = [
  {
    path: 'home/register/index',
    component: IndexComponent,
    loadChildren: () => import('./register.module').then(m => m.RegisterModule )
  }
];