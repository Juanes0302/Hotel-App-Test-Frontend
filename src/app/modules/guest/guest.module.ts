import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './components/index/index.component';
import { FormComponent } from './components/form/form.component';
import { GlobalModule } from '../global/global.module';
import { FormEditComponent } from './components/form-edit/form-edit.component';
// Importamos GlobalModule
@NgModule({
  declarations: [IndexComponent, FormComponent, FormEditComponent],
  imports: [CommonModule, GlobalModule],
})
export class GuestModule {}
