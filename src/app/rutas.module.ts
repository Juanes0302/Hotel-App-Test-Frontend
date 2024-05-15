import { RouterModule } from "@angular/router";
import { globalRoutes } from "./modules/global/global.routing";
import {NgModule} from '@angular/core'
import { roomsRoutes } from "./modules/rooms/rooms.routing";
import { guestRoutes } from "./modules/guest/guest.routing";
import { recordsRoutes } from "./modules/records/records.routing";
import { loginRoutes } from "./modules/login/login.routing";





@NgModule({
    imports: [RouterModule.forChild([
        ...globalRoutes,
        ...roomsRoutes,
        ...guestRoutes,
        ...recordsRoutes,
        ...loginRoutes
    ])],
    exports: [RouterModule]
})
export class RutasModule { }