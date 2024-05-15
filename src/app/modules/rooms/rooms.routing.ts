import { Routes } from "@angular/router";
import { IndexComponent } from "./components/index/index.component";


export const roomsRoutes: Routes = [
  {
    path: 'home/rooms/index',
    component: IndexComponent,
    loadChildren: () => import('./rooms.module').then(m => m.RoomsModule )
  }
];