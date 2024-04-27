import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './modules/global/components/navbar/navbar.component';

const routes: Routes = [
  {
    path: '',
    component: NavbarComponent ,
    loadChildren: () => import('./rutas.module').then(m => m.RutasModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
