import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";


export const loginRoutes: Routes = [
  {
    path: '',
    component: LoginComponent,
    loadChildren: () => import('./login.module').then(m => m.LoginModule)
  }
];