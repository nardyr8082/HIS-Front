import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { RegisterRoutingModule } from './register-routing.module';



@NgModule({
  declarations: [RegisterFormComponent, RegisterPageComponent],
  imports: [CommonModule, RegisterRoutingModule, SharedModule],
  entryComponents: [RegisterFormComponent],
})
export class RegisterModule {}
