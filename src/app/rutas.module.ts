import { RouterModule } from "@angular/router";
import { globalRoutes } from "./modules/global/global.routing";
import {NgModule} from '@angular/core'
import { roomsRoutes } from "./modules/rooms/rooms.routing";




@NgModule({
    imports: [RouterModule.forChild([
        ...globalRoutes,
        ...roomsRoutes
    ])],
    exports: [RouterModule]
})
export class RutasModule { }