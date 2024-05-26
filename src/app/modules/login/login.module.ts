import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { GlobalModule } from '../global/global.module';
// Importamos GlobalModule
@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, GlobalModule],
})
export class LoginModule {}
