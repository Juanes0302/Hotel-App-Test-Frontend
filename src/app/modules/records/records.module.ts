import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './components/index/index.component';
import { GlobalModule } from '../global/global.module';
import { ReportsComponent } from './components/reports/reports.component';
// Importamos el GlobalModule
@NgModule({
  declarations: [IndexComponent, ReportsComponent],
  imports: [CommonModule, GlobalModule],
})
export class RecordsModule {}
